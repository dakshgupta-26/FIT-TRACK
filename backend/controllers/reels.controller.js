import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import { uploadBufferToStorage } from "../utils/mediaUpload.js";
import { getIO } from "../socket/index.js";
import { emitNotificationToUser } from "../socket/notifications.js";

// Helper to format reel with user-specific interaction flags
const formatReel = (reel, currentUserId) => {
  const r = reel.toObject ? reel.toObject() : reel;
  const isLiked = currentUserId && r.likes
    ? r.likes.some((id) => id.toString() === currentUserId.toString())
    : false;
  const isBookmarked = currentUserId && r.bookmarks
    ? r.bookmarks.some((id) => id.toString() === currentUserId.toString())
    : false;

  return {
    ...r,
    id: r._id.toString(),
    likesCount: r.likes ? r.likes.length : 0,
    commentsCount: r.comments ? r.comments.length : 0,
    sharesCount: r.sharesCount || 0,
    viewsCount: r.viewsCount || 0,
    isLiked,
    isBookmarked,
  };
};

/**
 * GET /api/reels - Fetch real fitness reels
 */
export const getReels = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(30, Math.max(1, parseInt(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [reels, total] = await Promise.all([
      Reel.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName profileImageUrl badge")
        .exec(),
      Reel.countDocuments(),
    ]);

    const formatted = reels.map((r) => formatReel(r, currentUserId));

    return res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + reels.length < total,
      },
    });
  } catch (error) {
    console.error("[getReels Error]:", error);
    return res.status(500).json({ success: false, message: "Unable to retrieve reels" });
  }
};

/**
 * POST /api/reels - Upload / Create Fitness Reel
 */
export const createReel = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const {
      caption = "",
      videoUrl: bodyVideoUrl = "",
      coverImage = "",
      audioTitle = "Original High-Intensity Audio",
      workoutType = "HIIT Sprints",
      caloriesBurned = 500,
      heartRate = 160,
    } = req.body;

    let finalVideoUrl = bodyVideoUrl;

    if (req.file) {
      finalVideoUrl = await uploadBufferToStorage(req.file.buffer, {
        folder: "fittrack_reels",
        resource_type: "video",
        originalname: req.file.originalname,
      });
    }

    if (!finalVideoUrl) {
      return res.status(400).json({ success: false, message: "Video file or videoUrl is required for reels" });
    }

    const authorName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "Athlete";
    const authorAvatar = req.user.profileImageUrl || "";
    const authorBadge = req.user.badge || "PRO ATHLETE";

    const newReel = await Reel.create({
      author: userId,
      authorName,
      authorAvatar,
      authorBadge,
      videoUrl: finalVideoUrl,
      coverImage: coverImage || finalVideoUrl,
      caption,
      audioTitle,
      workoutType,
      caloriesBurned: Number(caloriesBurned) || 0,
      heartRate: Number(heartRate) || 0,
    });

    await User.findByIdAndUpdate(userId, { $inc: { reelsCount: 1 } });

    const formatted = formatReel(newReel, userId);

    const io = getIO();
    if (io) {
      io.emit("reel:created", formatted);
    }

    return res.status(201).json({
      success: true,
      message: "Fitness Reel uploaded successfully",
      data: formatted,
    });
  } catch (error) {
    console.error("[createReel Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/reels/:id/like - Like or Unlike Reel
 */
export const toggleLikeReel = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const reel = await Reel.findById(id);
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    const alreadyLiked = reel.likes.some((uId) => uId.toString() === currentUserId.toString());

    if (alreadyLiked) {
      reel.likes = reel.likes.filter((uId) => uId.toString() !== currentUserId.toString());
    } else {
      reel.likes.push(currentUserId);

      if (reel.author.toString() !== currentUserId.toString()) {
        try {
          const senderName = req.user.firstName || "An athlete";
          const notif = await Notification.create({
            recipient: reel.author,
            sender: currentUserId,
            senderName,
            senderAvatar: req.user.profileImageUrl || "",
            type: "like",
            title: "Reel Liked",
            message: `${senderName} liked your fitness reel!`,
            referenceId: reel._id.toString(),
            referenceType: "reel",
          });

          const io = getIO();
          if (io) {
            emitNotificationToUser(io, reel.author, notif);
          }
        } catch (notifErr) {
          console.warn("[Reel Like Notification]:", notifErr.message);
        }
      }
    }

    await reel.save();

    return res.status(200).json({
      success: true,
      isLiked: !alreadyLiked,
      likesCount: reel.likes.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/reels/:id/view - Track Reel View
 * Prevents continuous repeat increments by same viewer
 */
export const trackReelView = async (req, res) => {
  try {
    const { id } = req.params;
    const viewerIdentifier = (req.user?._id || req.ip || "anon").toString();

    const reel = await Reel.findById(id);
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    const hasViewedRecently = reel.viewedBy.includes(viewerIdentifier);

    if (!hasViewedRecently) {
      reel.viewsCount = (reel.viewsCount || 0) + 1;
      reel.viewedBy.push(viewerIdentifier);
      // Keep viewedBy array reasonable size
      if (reel.viewedBy.length > 500) {
        reel.viewedBy.shift();
      }
      await reel.save();
    }

    return res.status(200).json({
      success: true,
      viewsCount: reel.viewsCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/reels/:id/comments - Add Comment to Reel
 */
export const addReelComment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const reel = await Reel.findById(id);
    if (!reel) {
      return res.status(404).json({ success: false, message: "Reel not found" });
    }

    const userName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "Athlete";
    const userAvatar = req.user.profileImageUrl || "";

    const newComment = {
      user: currentUserId,
      userName,
      userAvatar,
      text: text.trim(),
      createdAt: new Date(),
    };

    reel.comments.push(newComment);
    await reel.save();

    return res.status(201).json({
      success: true,
      data: newComment,
      commentsCount: reel.comments.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
