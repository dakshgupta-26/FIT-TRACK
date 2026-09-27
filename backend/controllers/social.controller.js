import User from "../models/user.model.js";
import Post from "../models/post.model.js";
import Reel from "../models/reel.model.js";
import { Follow, Group, Challenge } from "../models/community.model.js";
import Notification from "../models/notification.model.js";
import { getIO } from "../socket/index.js";
import { emitNotificationToUser } from "../socket/notifications.js";
import { isUserOnline } from "../socket/presence.js";

/**
 * POST /api/users/:id/follow - Follow a user
 */
export const followUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    if (targetUserId.toString() === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingFollow = await Follow.findOne({
      follower: currentUserId,
      following: targetUserId,
    });

    if (existingFollow) {
      return res.status(200).json({
        success: true,
        message: "Already following this user",
        isFollowing: true,
      });
    }

    await Follow.create({
      follower: currentUserId,
      following: targetUserId,
      status: "active",
    });

    // Update counts atomically
    await Promise.all([
      User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: 1 } }),
      User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: 1 } }),
    ]);

    // Create notification
    const senderName = req.user.firstName
      ? `${req.user.firstName} ${req.user.lastName || ""}`.trim()
      : req.user.email?.split("@")[0] || "An athlete";

    try {
      const notif = await Notification.create({
        recipient: targetUserId,
        sender: currentUserId,
        senderName,
        senderAvatar: req.user.profileImageUrl || "",
        type: "follow",
        title: "New Follower",
        message: `${senderName} started following your fitness journey!`,
        referenceId: currentUserId.toString(),
        referenceType: "user",
      });

      const io = getIO();
      if (io) {
        emitNotificationToUser(io, targetUserId, notif);
      }
    } catch (notifErr) {
      console.warn("[Follow Notification Warning]:", notifErr.message);
    }

    return res.status(200).json({
      success: true,
      message: `You are now following ${targetUser.firstName || "athlete"}`,
      isFollowing: true,
    });
  } catch (error) {
    console.error("[followUser Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /api/users/:id/follow - Unfollow a user
 */
export const unfollowUser = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id || req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const deleted = await Follow.findOneAndDelete({
      follower: currentUserId,
      following: targetUserId,
    });

    if (deleted) {
      await Promise.all([
        User.findByIdAndUpdate(currentUserId, { $inc: { followingCount: -1 } }),
        User.findByIdAndUpdate(targetUserId, { $inc: { followersCount: -1 } }),
      ]);
    }

    return res.status(200).json({
      success: true,
      message: "Unfollowed successfully",
      isFollowing: false,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/users/:id/followers - Get user's followers
 */
export const getFollowers = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id || req.user?.id;

    const follows = await Follow.find({ following: targetUserId, status: "active" })
      .populate("follower", "firstName lastName email profileImageUrl badge isOnline lastSeen")
      .limit(50)
      .lean();

    const followers = follows.map((f) => {
      const u = f.follower;
      if (!u) return null;
      return {
        id: u._id.toString(),
        name: u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.email || "Athlete",
        avatar: u.profileImageUrl || "",
        badge: u.badge || "PRO ATHLETE",
        isOnline: isUserOnline(u._id.toString()) || u.isOnline || false,
      };
    }).filter(Boolean);

    return res.status(200).json({ success: true, data: followers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/users/:id/following - Get who user is following
 */
export const getFollowing = async (req, res) => {
  try {
    const targetUserId = req.params.id;

    const follows = await Follow.find({ follower: targetUserId, status: "active" })
      .populate("following", "firstName lastName email profileImageUrl badge isOnline lastSeen")
      .limit(50)
      .lean();

    const following = follows.map((f) => {
      const u = f.following;
      if (!u) return null;
      return {
        id: u._id.toString(),
        name: u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.email || "Athlete",
        avatar: u.profileImageUrl || "",
        badge: u.badge || "PRO ATHLETE",
        isOnline: isUserOnline(u._id.toString()) || u.isOnline || false,
      };
    }).filter(Boolean);

    return res.status(200).json({ success: true, data: following });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/users/:id/profile - Comprehensive user profile
 */
export const getUserProfile = async (req, res) => {
  try {
    const targetUserId = req.params.id;
    const currentUserId = req.user?._id || req.user?.id;

    const user = await User.findById(targetUserId).select("-password").lean();
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let isFollowing = false;
    if (currentUserId && currentUserId.toString() !== targetUserId.toString()) {
      const follow = await Follow.findOne({ follower: currentUserId, following: targetUserId });
      isFollowing = !!follow;
    }

    // Fetch user's recent posts and reels
    const [recentPosts, recentReels] = await Promise.all([
      Post.find({ author: targetUserId }).sort({ createdAt: -1 }).limit(10).lean(),
      Reel.find({ author: targetUserId }).sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    const isOnline = isUserOnline(user._id.toString()) || user.isOnline || false;

    return res.status(200).json({
      success: true,
      data: {
        id: user._id.toString(),
        name: user.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : user.email?.split("@")[0] || "Athlete",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.profileImageUrl || "",
        badge: user.badge || "PRO ATHLETE",
        bio: user.bio || "Dedicated FitTracker athlete pushing performance limits daily.",
        location: user.location || "San Francisco, CA",
        followersCount: user.followersCount || 0,
        followingCount: user.followingCount || 0,
        postsCount: recentPosts.length,
        reelsCount: recentReels.length,
        workoutStats: user.workoutStats || {
          totalWorkouts: 32,
          totalMinutes: 1420,
          totalCalories: 21500,
          streakDays: 8,
        },
        fitnessGoals: user.fitnessGoals || [
          { title: "Weekly Running Target", target: "25 miles", progress: 68 },
          { title: "Daily Calorie Burn", target: "650 kcal", progress: 85 },
        ],
        isOnline,
        lastSeen: user.lastSeen || new Date(),
        isFollowing,
        posts: recentPosts.map((p) => ({ ...p, id: p._id.toString() })),
        reels: recentReels.map((r) => ({ ...r, id: r._id.toString() })),
      },
    });
  } catch (error) {
    console.error("[getUserProfile Error]:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/users/suggested - Suggested Gym Buddies / Athletes
 */
export const getSuggestedUsers = async (req, res) => {
  try {
    const currentUserId = req.user?._id || req.user?.id;

    let filter = {};
    if (currentUserId) {
      // Exclude already followed users and self
      const follows = await Follow.find({ follower: currentUserId }).select("following").lean();
      const excludeIds = [currentUserId, ...follows.map((f) => f.following)];
      filter._id = { $nin: excludeIds };
    }

    const users = await User.find(filter)
      .select("firstName lastName email profileImageUrl badge location workoutStats")
      .limit(8)
      .lean();

    const suggested = users.map((u, idx) => {
      const matchScores = ["98% Match", "96% Match", "94% Match", "92% Match", "89% Match"];
      const specialties = [
        "HIIT & Sprint Athlete",
        "Marathon & Trail Runner",
        "Powerlifting & Strength",
        "CrossFit & Functional",
        "Calisthenics & Mobility",
      ];

      return {
        id: u._id.toString(),
        name: u.firstName ? `${u.firstName} ${u.lastName || ""}`.trim() : u.email?.split("@")[0] || "Athlete",
        avatar: u.profileImageUrl || `https://images.unsplash.com/photo-${1534528741775 + idx}?q=80&w=300&auto=format&fit=crop`,
        badge: u.badge || "PRO ATHLETE",
        role: specialties[idx % specialties.length],
        score: matchScores[idx % matchScores.length],
        location: u.location || "Nearby",
        isOnline: isUserOnline(u._id.toString()),
      };
    });

    return res.status(200).json({ success: true, data: suggested });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /api/search - Global Categorized Search
 */
export const searchGlobal = async (req, res) => {
  try {
    const q = req.query.q ? req.query.q.trim() : "";
    if (!q) {
      return res.status(200).json({
        success: true,
        data: { users: [], posts: [], reels: [], groups: [], challenges: [] },
      });
    }

    const regex = new RegExp(q, "i");

    const [users, posts, reels, groups, challenges] = await Promise.all([
      User.find({
        $or: [{ firstName: regex }, { lastName: regex }, { email: regex }, { bio: regex }],
      })
        .select("firstName lastName email profileImageUrl badge")
        .limit(6)
        .lean(),

      Post.find({
        $or: [{ caption: regex }, { authorName: regex }, { hashtags: { $in: [regex] } }],
      })
        .limit(6)
        .lean(),

      Reel.find({
        $or: [{ caption: regex }, { authorName: regex }, { audioTitle: regex }, { workoutType: regex }],
      })
        .limit(6)
        .lean(),

      Group.find({
        $or: [{ name: regex }, { description: regex }, { category: regex }],
      })
        .limit(6)
        .lean(),

      Challenge.find({
        $or: [{ title: regex }, { description: regex }],
      })
        .limit(6)
        .lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: users.map((u) => ({
          id: u._id.toString(),
          name: `${u.firstName || ""} ${u.lastName || ""}`.trim() || u.email,
          avatar: u.profileImageUrl,
          badge: u.badge,
        })),
        posts: posts.map((p) => ({
          id: p._id.toString(),
          caption: p.caption,
          authorName: p.authorName,
          media: p.mediaUrls?.[0] || "",
        })),
        reels: reels.map((r) => ({
          id: r._id.toString(),
          caption: r.caption,
          videoUrl: r.videoUrl,
          coverImage: r.coverImage,
        })),
        groups: groups.map((g) => ({
          id: g._id.toString(),
          name: g.name,
          category: g.category,
          icon: g.icon,
        })),
        challenges: challenges.map((c) => ({
          id: c._id.toString(),
          title: c.title,
          rewardXP: c.rewardXP,
        })),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
