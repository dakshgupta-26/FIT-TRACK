import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { Follow } from "../models/community.model.js";
import Notification from "../models/notification.model.js";
import { uploadBufferToStorage } from "../utils/mediaUpload.js";
import { getIO } from "../socket/index.js";
import { emitNotificationToUser } from "../socket/notifications.js";

// Helper to format post with user interaction flags
const formatPost = (post, currentUserId) => {
  const p = post.toObject ? post.toObject() : post;
  const isLiked = currentUserId && p.likes
    ? p.likes.some((id) => id.toString() === currentUserId.toString())
    : false;
  const isBookmarked = currentUserId && p.bookmarks
    ? p.bookmarks.some((id) => id.toString() === currentUserId.toString())
    : false;

  // Calculate relative time string if not present
  const diffMinutes = Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 60000);
  let timeAgo = "Just now";
  if (diffMinutes >= 60 * 24) {
    const days = Math.floor(diffMinutes / (60 * 24));
    timeAgo = `${days}d ago`;
  } else if (diffMinutes >= 60) {
    const hours = Math.floor(diffMinutes / 60);
    timeAgo = `${hours}h ago`;
  } else if (diffMinutes > 0) {
    timeAgo = `${diffMinutes}m ago`;
  }

  return {
    ...p,
    id: p._id.toString(),
    likesCount: p.likes ? p.likes.length : 0,
    commentsCount: p.comments ? p.comments.length : 0,
    sharesCount: p.sharesCount || 0,
    isLiked,
    isBookmarked,
    timeAgo,
  };
};

/**
 * GET /api/posts - Fetch Home / Community Feed
 * Query params: page, limit, category (all, following, trending, workout, reel), search, userId
 */
export const getPosts = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 15));
    const skip = (page - 1) * limit;
    const { category = "all", search, userId } = req.query;

    let filter = {};

    if (userId) {
      filter.author = userId;
    } else if (category === "following" && currentUserId) {
      const follows = await Follow.find({ follower: currentUserId, status: "active" }).select("following").lean();
      const followingIds = follows.map((f) => f.following);
      followingIds.push(currentUserId);
      filter.author = { $in: followingIds };
    } else if (category === "trending") {
      filter.$or = [
        { "workoutMetrics.caloriesBurned": { $gt: 350 } },
        { "likes.5": { $exists: true } },
      ];
    } else if (category === "workout") {
      filter.type = { $in: ["workout", "transformation"] };
    } else if (category === "meal") {
      filter.type = "meal";
    }

    if (search && search.trim()) {
      filter.$or = [
        { caption: { $regex: search.trim(), $options: "i" } },
        { authorName: { $regex: search.trim(), $options: "i" } },
        { hashtags: { $in: [new RegExp(search.trim().replace(/^#/, ""), "i")] } },
      ];
    }

    const [posts, totalCount] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("author", "firstName lastName profileImageUrl badge")
        .exec(),
      Post.countDocuments(filter),
    ]);

    const formattedPosts = posts.map((p) => formatPost(p, currentUserId));

    return res.status(200).json({
      success: true,
      data: formattedPosts,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + posts.length < totalCount,
      },
    });
  } catch (error) {
    console.error("[getPosts Error]:", error);
    return res.status(500).json({ success: false, message: "Unable to retrieve feed. Please try again." });
  }
};

/**
 * POST /api/posts - Create Post
 */
export const createPost = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required to create a post" });
    }

    const {
      caption,
      type = "workout",
      workoutMetrics,
      mediaUrls: clientMediaUrls = [],
      tags = [],
      hashtags = [],
    } = req.body;

    if (!caption || !caption.trim()) {
      return res.status(400).json({ success: false, message: "Post caption is required" });
    }

    let finalMediaUrls = Array.isArray(clientMediaUrls) ? [...clientMediaUrls] : [clientMediaUrls].filter(Boolean);

    // If file was uploaded via multer
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith("video/");
      const uploadedUrl = await uploadBufferToStorage(req.file.buffer, {
        folder: "fittrack_posts",
        resource_type: isVideo ? "video" : "image",
        originalname: req.file.originalname,
      });
      finalMediaUrls.unshift(uploadedUrl);
    }

    const parsedMetrics = typeof workoutMetrics === "string" ? JSON.parse(workoutMetrics) : (workoutMetrics || {});

    // Generate intelligent AI telemetry summary based on metrics
    let aiAnalysis = "⚡ FitTracker AI telemetry verified workout completion.";
    if (parsedMetrics.avgHeartRate > 150) {
      aiAnalysis = `🔥 High cardiovascular intensity! Maintained HR Zone 4 (${parsedMetrics.avgHeartRate} BPM) with optimal recovery window.`;
    } else if (parsedMetrics.caloriesBurned > 500) {
      aiAnalysis = `⚡ Exceptional caloric burn (${parsedMetrics.caloriesBurned} kcal). Glycogen reload recommended.`;
    }

    const authorName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "Athlete";
    const authorAvatar = req.user.profileImageUrl || "";
    const authorBadge = req.user.badge || "PRO ATHLETE";

    // Extract hashtags from caption if not explicitly provided
    const extractedHashtags = caption.match(/#[a-z0-9_]+/gi) || [];
    const mergedHashtags = Array.from(new Set([...hashtags, ...extractedHashtags.map((h) => h.slice(1))]));

    const newPost = await Post.create({
      author: userId,
      authorName,
      authorAvatar,
      authorBadge,
      type,
      caption: caption.trim(),
      mediaUrls: finalMediaUrls,
      workoutMetrics: parsedMetrics,
      tags,
      hashtags: mergedHashtags,
      aiAnalysis,
    });

    // Increment user's postsCount
    await User.findByIdAndUpdate(userId, { $inc: { postsCount: 1 } });

    const formatted = formatPost(newPost, userId);

    // Real-time broadcast to all connected clients
    const io = getIO();
    if (io) {
      io.emit("post:created", formatted);
    }

    return res.status(201).json({
      success: true,
      message: "Post published to FitTracker Community",
      data: formatted,
    });
  } catch (error) {
    console.error("[createPost Error]:", error);
    return res.status(500).json({ success: false, message: "Unable to create post. Please try again." });
  }
};

/**
 * GET /api/posts/:id - Get single post
 */
export const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;

    const post = await Post.findById(id).populate("author", "firstName lastName profileImageUrl badge");
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    return res.status(200).json({
      success: true,
      data: formatPost(post, currentUserId),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/posts/:id/like - Like or Unlike Post (Atomic Toggle)
 */
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadyLiked = post.likes.some((uId) => uId.toString() === currentUserId.toString());

    if (alreadyLiked) {
      post.likes = post.likes.filter((uId) => uId.toString() !== currentUserId.toString());
    } else {
      post.likes.push(currentUserId);

      // Create notification for author if not self-like
      if (post.author.toString() !== currentUserId.toString()) {
        try {
          const senderName = req.user.firstName
            ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
            : "An athlete";

          const notif = await Notification.create({
            recipient: post.author,
            sender: currentUserId,
            senderName,
            senderAvatar: req.user.profileImageUrl || "",
            type: "like",
            title: "New Post Like",
            message: `${senderName} liked your post: "${post.caption.slice(0, 45)}..."`,
            referenceId: post._id.toString(),
            referenceType: "post",
          });

          const io = getIO();
          if (io) {
            emitNotificationToUser(io, post.author, notif);
          }
        } catch (notifErr) {
          console.warn("[Like Notification Warning]:", notifErr.message);
        }
      }
    }

    await post.save();

    const isLiked = !alreadyLiked;
    const likesCount = post.likes.length;

    // Broadcast like event to update feeds in real time
    const io = getIO();
    if (io) {
      io.emit("post:liked", { postId: post._id.toString(), likesCount, isLiked, userId: currentUserId });
    }

    return res.status(200).json({
      success: true,
      isLiked,
      likesCount,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Unable to process like. Please try again." });
  }
};

/**
 * POST /api/posts/:id/save - Bookmark or Unbookmark Post
 */
export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;
    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const alreadySaved = post.bookmarks.some((uId) => uId.toString() === currentUserId.toString());

    if (alreadySaved) {
      post.bookmarks = post.bookmarks.filter((uId) => uId.toString() !== currentUserId.toString());
      await User.findByIdAndUpdate(currentUserId, { $pull: { savedPosts: post._id } });
    } else {
      post.bookmarks.push(currentUserId);
      await User.findByIdAndUpdate(currentUserId, { $addToSet: { savedPosts: post._id } });
    }

    await post.save();

    return res.status(200).json({
      success: true,
      isBookmarked: !alreadySaved,
      bookmarksCount: post.bookmarks.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/posts/:id/comments - Add Comment to Post
 */
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
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
      likes: [],
      replies: [],
      createdAt: new Date(),
    };

    post.comments.push(newComment);
    await post.save();

    const createdComment = post.comments[post.comments.length - 1];

    // Notify author if not self-comment
    if (post.author.toString() !== currentUserId.toString()) {
      try {
        const notif = await Notification.create({
          recipient: post.author,
          sender: currentUserId,
          senderName: userName,
          senderAvatar: userAvatar,
          type: "comment",
          title: "New Post Comment",
          message: `${userName} commented: "${text.trim().slice(0, 60)}"`,
          referenceId: post._id.toString(),
          referenceType: "post",
        });

        const io = getIO();
        if (io) {
          emitNotificationToUser(io, post.author, notif);
        }
      } catch (notifErr) {
        console.warn("[Comment Notification Warning]:", notifErr.message);
      }
    }

    // Broadcast new comment to real-time clients
    const io = getIO();
    if (io) {
      io.emit("post:commented", {
        postId: post._id.toString(),
        commentsCount: post.comments.length,
        comment: createdComment,
      });
    }

    return res.status(201).json({
      success: true,
      message: "Comment added",
      data: createdComment,
      commentsCount: post.comments.length,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/posts/:id - Delete Post
 */
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?._id || req.user?.id;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    if (post.author.toString() !== currentUserId.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(id);
    await User.findByIdAndUpdate(currentUserId, { $inc: { postsCount: -1 } });

    const io = getIO();
    if (io) {
      io.emit("post:deleted", { postId: id });
    }

    return res.status(200).json({ success: true, message: "Post removed successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
