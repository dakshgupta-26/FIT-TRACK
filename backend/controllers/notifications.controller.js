import Notification from "../models/notification.model.js";

/**
 * GET /api/notifications - Get notifications for user
 */
export const getNotifications = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [notifications, unreadCount, total] = await Promise.all([
      Notification.find({ recipient: userId })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Notification.countDocuments({ recipient: userId, read: false }),
      Notification.countDocuments({ recipient: userId }),
    ]);

    const formatted = notifications.map((n) => {
      const diffMinutes = Math.floor((Date.now() - new Date(n.createdAt).getTime()) / 60000);
      let timeAgo = "Just now";
      if (diffMinutes >= 60 * 24) {
        timeAgo = `${Math.floor(diffMinutes / (60 * 24))}d ago`;
      } else if (diffMinutes >= 60) {
        timeAgo = `${Math.floor(diffMinutes / 60)}h ago`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes}m ago`;
      }

      return {
        ...n,
        id: n._id.toString(),
        timeAgo,
      };
    });

    return res.status(200).json({
      success: true,
      data: formatted,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/notifications/:id/read - Mark notification as read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.id;

    await Notification.findOneAndUpdate({ _id: id, recipient: userId }, { read: true });

    const remainingUnread = await Notification.countDocuments({ recipient: userId, read: false });

    return res.status(200).json({
      success: true,
      unreadCount: remainingUnread,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * PATCH /api/notifications/read-all - Mark all as read
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    await Notification.updateMany({ recipient: userId, read: false }, { read: true });

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      unreadCount: 0,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
