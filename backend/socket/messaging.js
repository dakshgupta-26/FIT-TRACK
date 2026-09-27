import { Conversation, Message } from "../models/conversation.model.js";
import Notification from "../models/notification.model.js";

export const registerMessagingHandlers = (io, socket) => {
  const userId = socket.userId;
  const user = socket.user;
  if (!userId) return;

  // 1. Join Conversation Room with Server-Side Membership Validation
  socket.on("conversation:join", async ({ conversationId }, callback) => {
    try {
      if (!conversationId) {
        return callback?.({ success: false, message: "conversationId is required" });
      }

      const conv = await Conversation.findById(conversationId).lean();
      if (!conv) {
        return callback?.({ success: false, message: "Conversation not found" });
      }

      const isParticipant = conv.participants.some(
        (p) => p.toString() === userId.toString()
      );
      if (!isParticipant) {
        return callback?.({ success: false, message: "Unauthorized: not a conversation member" });
      }

      const roomName = `conversation:${conversationId}`;
      socket.join(roomName);
      return callback?.({ success: true, room: roomName });
    } catch (err) {
      console.error("[Socket Messaging Error] conversation:join:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // 2. Leave Conversation Room
  socket.on("conversation:leave", ({ conversationId }) => {
    if (conversationId) {
      socket.leave(`conversation:${conversationId}`);
    }
  });

  // 3. Send Real Direct Message
  socket.on("message:send", async (data, callback) => {
    try {
      const { conversationId, text = "", mediaUrl = "", audioUrl = "", workoutAttachment } = data;

      if (!conversationId || (!text.trim() && !mediaUrl && !workoutAttachment)) {
        return callback?.({ success: false, message: "Message content or attachment is required" });
      }

      // Verify conversation membership
      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        return callback?.({ success: false, message: "Conversation not found" });
      }

      const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId.toString()
      );
      if (!isParticipant) {
        return callback?.({ success: false, message: "Unauthorized: not a member of this chat" });
      }

      const senderName = user.firstName
        ? `${user.firstName} ${user.lastName || ""}`.trim()
        : user.email?.split("@")[0] || "Athlete";
      const senderAvatar = user.profileImageUrl || "";

      // Persist Message in Database
      const messageDoc = await Message.create({
        conversation: conversation._id,
        sender: userId,
        senderName,
        senderAvatar,
        text: text.trim(),
        mediaUrl,
        audioUrl,
        workoutAttachment: workoutAttachment || null,
        status: "sent",
        readBy: [userId],
      });

      // Update Conversation Last Message & Unread Counts
      conversation.lastMessage = {
        text: text.trim() || (mediaUrl ? "Sent a photo" : "Shared workout milestone"),
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
          const currentCount = conversation.unreadCounts.get(pId) || 0;
          conversation.unreadCounts.set(pId, currentCount + 1);
        }
      });

      await conversation.save();

      const populatedMessage = messageDoc.toObject();

      // Emit to all users currently inside conversation room
      io.to(`conversation:${conversationId}`).emit("message:new", populatedMessage);

      // Also deliver message and notification to all other participants' personal rooms
      conversation.participants.forEach(async (participantId) => {
        const pIdStr = participantId.toString();
        if (pIdStr !== userId.toString()) {
          // Direct room emission for real-time conversation list updates
          io.to(`user:${pIdStr}`).emit("message:received", {
            conversationId,
            message: populatedMessage,
          });

          // Create and emit Notification
          try {
            const notif = await Notification.create({
              recipient: participantId,
              sender: userId,
              senderName,
              senderAvatar,
              type: "message",
              title: `New message from ${senderName}`,
              message: text.trim().slice(0, 100) || "Shared an attachment",
              referenceId: conversationId,
              referenceType: "conversation",
              read: false,
            });

            io.to(`user:${pIdStr}`).emit("notification:new", notif);
          } catch (notifErr) {
            console.warn("[Message Notification Warning]:", notifErr.message);
          }
        }
      });

      return callback?.({ success: true, data: populatedMessage });
    } catch (err) {
      console.error("[Socket Messaging Error] message:send:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // 4. Real Message Read Receipts
  socket.on("message:read", async ({ conversationId }, callback) => {
    try {
      if (!conversationId) return;

      // Update unread messages
      await Message.updateMany(
        {
          conversation: conversationId,
          sender: { $ne: userId },
          readBy: { $ne: userId },
        },
        {
          $addToSet: { readBy: userId },
          $set: { status: "read" },
        }
      );

      // Reset user unread count on conversation
      const conversation = await Conversation.findById(conversationId);
      if (conversation && conversation.unreadCounts) {
        conversation.unreadCounts.set(userId.toString(), 0);
        await conversation.save();
      }

      // Broadcast read receipt to room
      io.to(`conversation:${conversationId}`).emit("message:read", {
        conversationId,
        readerId: userId,
      });

      return callback?.({ success: true });
    } catch (err) {
      console.error("[Socket Messaging Error] message:read:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // 5. Ephemeral Typing Indicator
  socket.on("message:typing", ({ conversationId }) => {
    if (!conversationId) return;
    const senderName = user.firstName || "Someone";
    socket.to(`conversation:${conversationId}`).emit("message:typing", {
      conversationId,
      userId,
      userName: senderName,
    });
  });

  // 6. Stop Typing Indicator
  socket.on("message:stopTyping", ({ conversationId }) => {
    if (!conversationId) return;
    socket.to(`conversation:${conversationId}`).emit("message:stopTyping", {
      conversationId,
      userId,
    });
  });
};
