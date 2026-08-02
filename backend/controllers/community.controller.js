import Post from "../models/post.model.js";
import { Follow, Group, Challenge, Message, PrivacySettings } from "../models/community.model.js";

// --- GET COMMUNITY FEED ---
export const getFeed = async (req, res) => {
  try {
    const { category = "all" } = req.query;
    let queryFilter = {};

    if (category === "reels") {
      queryFilter.type = "reel";
    } else if (category === "trending") {
      queryFilter["workoutMetrics.caloriesBurned"] = { $gt: 200 };
    }

    const posts = await Post.find(queryFilter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean();

    return res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching community feed:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- CREATE NEW POST ---
export const createPost = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { caption, type = "workout", workoutMetrics, mediaUrls } = req.body;

    const newPost = await Post.create({
      author: userId || "650000000000000000000001",
      authorName: req.user?.name || "Daksh Gupta",
      authorAvatar: req.user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop",
      type,
      caption,
      mediaUrls: mediaUrls || [],
      workoutMetrics: workoutMetrics || {},
      aiAnalysis: "🔥 High intensity workout output! Heart rate stayed optimal at 165 BPM.",
    });

    return res.status(201).json({
      success: true,
      message: "Post published to FitTracker Community",
      data: newPost,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- LIKE / UNLIKE POST ---
export const toggleLikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id || "650000000000000000000001";

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    const hasLiked = post.likes.includes(userId);
    if (hasLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
      success: true,
      likesCount: post.likes.length,
      isLiked: !hasLiked,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- GET GROUPS ---
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().limit(20).lean();
    return res.status(200).json({ success: true, data: groups });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- GET CHALLENGES ---
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().limit(20).lean();
    return res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- UPDATE PRIVACY SETTINGS ---
export const updatePrivacySettings = async (req, res) => {
  try {
    const userId = req.user?.id || "650000000000000000000001";
    const updateData = req.body;

    const settings = await PrivacySettings.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      success: true,
      message: "Privacy settings updated successfully",
      data: settings,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
