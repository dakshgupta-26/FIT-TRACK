import { Conversation, Message } from "../models/conversation.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { uploadBufferToStorage } from "../utils/mediaUpload.js";
import { getIO } from "../socket/index.js";
import { emitNotificationToUser } from "../socket/notifications.js";
import { isUserOnline } from "../socket/presence.js";

/**
 * GET /api/conversations - List conversations for authenticated user
 */
export const getConversations = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const conversations = await Conversation.find({ participants: userId })
      .sort({ updatedAt: -1 })
      .populate("participants", "firstName lastName email profileImageUrl badge isOnline lastSeen")
      .exec();

    const formatted = conversations.map((conv) => {
      const c = conv.toObject();
      const otherParticipant = c.participants.find(
        (p) => p._id.toString() !== userId.toString()
      ) || c.participants[0] || {};

      const unreadCount = (c.unreadCounts && c.unreadCounts[userId.toString()]) || 0;
      const isOnline = otherParticipant._id ? isUserOnline(otherParticipant._id.toString()) : false;

      return {
        id: c._id.toString(),
        isGroup: c.isGroup,
        groupTitle: c.groupTitle,
        otherUser: {
          id: otherParticipant._id?.toString(),
          name: otherParticipant.firstName
            ? `${otherParticipant.firstName} ${otherParticipant.lastName || ""}`.trim()
            : otherParticipant.email?.split("@")[0] || "Athlete",
          avatar: otherParticipant.profileImageUrl || "",
          badge: otherParticipant.badge || "PRO ATHLETE",
          isOnline: isOnline || otherParticipant.isOnline || false,
          lastSeen: otherParticipant.lastSeen || new Date(),
        },
        lastMessage: c.lastMessage || null,
        unreadCount,
        updatedAt: c.updatedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    console.error("[getConversations Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/conversations - Get or create conversation with recipient
 */
export const getOrCreateConversation = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ success: false, message: "recipientId is required" });
    }

    if (recipientId.toString() === userId.toString()) {
      return res.status(400).json({ success: false, message: "Cannot create conversation with yourself" });
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [userId, recipientId], $size: 2 },
    }).populate("participants", "firstName lastName email profileImageUrl badge isOnline lastSeen");

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, recipientId],
        isGroup: false,
        unreadCounts: {},
      });

      conversation = await Conversation.findById(conversation._id).populate(
        "participants",
        "firstName lastName email profileImageUrl badge isOnline lastSeen"
      );
    }

    const c = conversation.toObject();
    const otherParticipant = c.participants.find(
      (p) => p._id.toString() !== userId.toString()
    ) || {};

    return res.status(200).json({
      success: true,
      data: {
        id: c._id.toString(),
        otherUser: {
          id: otherParticipant._id?.toString(),
          name: otherParticipant.firstName
            ? `${otherParticipant.firstName} ${otherParticipant.lastName || ""}`.trim()
            : otherParticipant.email || "Athlete",
          avatar: otherParticipant.profileImageUrl || "",
          badge: otherParticipant.badge || "PRO ATHLETE",
          isOnline: otherParticipant._id ? isUserOnline(otherParticipant._id.toString()) : false,
          lastSeen: otherParticipant.lastSeen || new Date(),
        },
        lastMessage: c.lastMessage,
        updatedAt: c.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/conversations/:id/messages - Fetch messages for conversation
 */
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    const conversation = await Conversation.findById(id).lean();
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: "Not authorized to view these messages" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 50));
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ conversation: id })
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Message.countDocuments({ conversation: id }),
    ]);

    const formatted = messages.map((m) => {
      const isMe = m.sender.toString() === userId.toString();
      const timeStr = new Date(m.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        ...m,
        id: m._id.toString(),
        isMe,
        time: timeStr,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      total,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/conversations/:id/messages - Send message via REST
 */
export const sendMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;
    const { text = "", workoutAttachment } = req.body;
    let mediaUrl = req.body.mediaUrl || "";

    if (req.file) {
      mediaUrl = await uploadBufferToStorage(req.file.buffer, {
        folder: "fittrack_chat",
        resource_type: req.file.mimetype.startsWith("video/") ? "video" : "image",
        originalname: req.file.originalname,
      });
    }

    if (!text.trim() && !mediaUrl && !workoutAttachment) {
      return res.status(400).json({ success: false, message: "Message content or media required" });
    }

    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const isMember = conversation.participants.some(
      (p) => p.toString() === userId.toString()
    );
    if (!isMember) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    const senderName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "Athlete";
    const senderAvatar = req.user.profileImageUrl || "";

    const message = await Message.create({
      conversation: id,
      sender: userId,
      senderName,
      senderAvatar,
      text: text.trim(),
      mediaUrl,
      workoutAttachment: workoutAttachment ? (typeof workoutAttachment === "string" ? JSON.parse(workoutAttachment) : workoutAttachment) : null,
      status: "sent",
      readBy: [userId],
    });

    conversation.lastMessage = {
      text: text.trim() || (mediaUrl ? "Sent a media attachment" : "Shared workout milestone"),
      sender: userId,
      senderName,
      mediaUrl,
      createdAt: new Date(),
    };

    if (!conversation.unreadCounts) {
      conversation.unreadCounts = new Map();
    }
    conversation.participants.forEach((p) => {
      const pId = p.toString();
      if (pId !== userId.toString()) {
        const cCount = conversation.unreadCounts.get(pId) || 0;
        conversation.unreadCounts.set(pId, cCount + 1);
      }
    });

    await conversation.save();

    const formattedMessage = {
      ...message.toObject(),
      id: message._id.toString(),
      isMe: true,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Emit Socket.IO event to room
    const io = getIO();
    if (io) {
      io.to(`conversation:${id}`).emit("message:new", formattedMessage);

      // Emit to each other participant's personal room
      conversation.participants.forEach(async (participantId) => {
        const pIdStr = participantId.toString();
        if (pIdStr !== userId.toString()) {
          io.to(`user:${pIdStr}`).emit("message:received", {
            conversationId: id,
            message: formattedMessage,
          });

          try {
            const notif = await Notification.create({
              recipient: participantId,
              sender: userId,
              senderName,
              senderAvatar,
              type: "message",
              title: `New message from ${senderName}`,
              message: text.trim().slice(0, 100) || "Sent an attachment",
              referenceId: id,
              referenceType: "conversation",
              read: false,
            });
            emitNotificationToUser(io, participantId, notif);
          } catch (nErr) {
            console.warn("[Message Notification Warning]:", nErr.message);
          }
        }
      });
    }

    return res.status(201).json({
      success: true,
      data: formattedMessage,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
