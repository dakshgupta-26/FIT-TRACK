import User from "../models/user.model.js";

// In-memory mapping of userId -> Set of active socket IDs
const activeUserSockets = new Map();

export const registerPresenceHandlers = (io, socket) => {
  const userId = socket.userId;
  if (!userId) return;

  // Add socket to active tracking
  if (!activeUserSockets.has(userId)) {
    activeUserSockets.set(userId, new Set());
  }
  const userSocketSet = activeUserSockets.get(userId);
  const wasOffline = userSocketSet.size === 0;
  userSocketSet.add(socket.id);

  // Join user's personal notification/presence room
  socket.join(`user:${userId}`);

  // If user just transitioned from offline to online
  if (wasOffline) {
    const now = new Date();
    User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: now }).catch((err) =>
      console.warn("[Presence Error] DB update online:", err.message)
    );

    io.emit("presence:online", {
      userId,
      isOnline: true,
      lastSeen: now,
    });
  }

  // Allow client to request presence status of a list of user IDs
  socket.on("presence:query", (targetUserIds, callback) => {
    if (!Array.isArray(targetUserIds)) return;
    const presenceMap = {};
    for (const id of targetUserIds) {
      presenceMap[id] = activeUserSockets.has(id) && activeUserSockets.get(id).size > 0;
    }
    if (typeof callback === "function") {
      callback(presenceMap);
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    if (activeUserSockets.has(userId)) {
      const set = activeUserSockets.get(userId);
      set.delete(socket.id);

      if (set.size === 0) {
        activeUserSockets.delete(userId);
        const now = new Date();
        User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: now }).catch((err) =>
          console.warn("[Presence Error] DB update offline:", err.message)
        );

        io.emit("presence:offline", {
          userId,
          isOnline: false,
          lastSeen: now,
        });
      }
    }
  });
};

export const isUserOnline = (userId) => {
  return activeUserSockets.has(userId) && activeUserSockets.get(userId).size > 0;
};
