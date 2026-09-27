import Notification from "../models/notification.model.js";

export const registerNotificationHandlers = (io, socket) => {
  const userId = socket.userId;
  if (!userId) return;

  // Mark notification as read
  socket.on("notification:read", async ({ notificationId }, callback) => {
    try {
      if (!notificationId) return;

      await Notification.findOneAndUpdate(
        { _id: notificationId, recipient: userId },
        { read: true }
      );

      socket.emit("notification:read", { notificationId });
      return callback?.({ success: true });
    } catch (err) {
      console.error("[Notification Socket Error]:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // Mark all notifications as read
  socket.on("notification:readAll", async (callback) => {
    try {
      await Notification.updateMany({ recipient: userId, read: false }, { read: true });
      socket.emit("notification:readAll", { success: true });
      return callback?.({ success: true });
    } catch (err) {
      return callback?.({ success: false, message: err.message });
    }
  });
};

/**
 * Server-side helper to emit notification to a user's private socket room
 */
export const emitNotificationToUser = (io, recipientId, notification) => {
  if (!io || !recipientId) return;
  io.to(`user:${recipientId.toString()}`).emit("notification:new", notification);
};
