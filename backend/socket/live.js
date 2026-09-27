import LiveStream from "../models/liveStream.model.js";

// In-memory mapping of streamId -> Set of socket IDs
const streamViewers = new Map();
// Socket ID -> Set of streamIds joined
const socketStreams = new Map();
// Rate limit tracker: socketId -> lastMessageTimestamp
const messageRateLimits = new Map();
const reactionRateLimits = new Map();

export const registerLiveHandlers = (io, socket) => {
  const userId = socket.userId;
  const user = socket.user;
  const socketId = socket.id;

  // 1. Join Live Stream
  socket.on("live:join", async ({ streamId }, callback) => {
    try {
      if (!streamId) return callback?.({ success: false, message: "streamId is required" });

      const roomName = `live:${streamId}`;
      socket.join(roomName);

      if (!streamViewers.has(streamId)) {
        streamViewers.set(streamId, new Set());
      }
      streamViewers.get(streamId).add(socketId);

      if (!socketStreams.has(socketId)) {
        socketStreams.set(socketId, new Set());
      }
      socketStreams.get(socketId).add(streamId);

      const currentCount = streamViewers.get(streamId).size;

      // Broadcast viewer count to all in room
      io.to(roomName).emit("live:viewerCount", {
        streamId,
        count: currentCount,
      });

      // Update database asynchronously
      LiveStream.findByIdAndUpdate(streamId, {
        viewerCount: currentCount,
        $max: { peakViewers: currentCount },
      }).catch((err) => console.warn("[LiveStream DB Warning]:", err.message));

      return callback?.({ success: true, count: currentCount });
    } catch (err) {
      console.error("[Live Socket Error] live:join:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // 2. Leave Live Stream
  socket.on("live:leave", ({ streamId }) => {
    if (!streamId) return;
    const roomName = `live:${streamId}`;
    socket.leave(roomName);

    if (streamViewers.has(streamId)) {
      const viewers = streamViewers.get(streamId);
      viewers.delete(socketId);
      const updatedCount = viewers.size;

      io.to(roomName).emit("live:viewerCount", {
        streamId,
        count: updatedCount,
      });

      LiveStream.findByIdAndUpdate(streamId, {
        viewerCount: updatedCount,
      }).catch((err) => console.warn("[LiveStream DB Warning]:", err.message));
    }

    if (socketStreams.has(socketId)) {
      socketStreams.get(socketId).delete(streamId);
    }
  });

  // 3. Live Chat Message with Rate Limiting
  socket.on("live:message", ({ streamId, text }, callback) => {
    try {
      if (!streamId || !text || !text.trim()) return;

      // Rate limit: max 1 msg every 500ms
      const lastMsg = messageRateLimits.get(socketId) || 0;
      const now = Date.now();
      if (now - lastMsg < 500) {
        return callback?.({ success: false, message: "Please slow down" });
      }
      messageRateLimits.set(socketId, now);

      const senderName = user?.firstName
        ? `${user.firstName} ${user.lastName ? user.lastName[0] + "." : ""}`.trim()
        : "Athlete";
      const senderAvatar = user?.profileImageUrl || "";

      const chatPayload = {
        id: `live-msg-${now}-${Math.random().toString(36).slice(2, 7)}`,
        streamId,
        senderId: userId,
        senderName,
        senderAvatar,
        text: text.trim().slice(0, 200),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        createdAt: new Date(),
      };

      io.to(`live:${streamId}`).emit("live:message", chatPayload);
      return callback?.({ success: true, data: chatPayload });
    } catch (err) {
      console.error("[Live Socket Error] live:message:", err);
      return callback?.({ success: false, message: err.message });
    }
  });

  // 4. Live Reaction (Ephemeral Heart, Fire, Clap, Muscle, Lightning)
  socket.on("live:reaction", ({ streamId, reaction = "❤️" }) => {
    if (!streamId) return;

    // Rate limit reactions: max 1 every 200ms
    const lastReaction = reactionRateLimits.get(socketId) || 0;
    const now = Date.now();
    if (now - lastReaction < 200) return;
    reactionRateLimits.set(socketId, now);

    io.to(`live:${streamId}`).emit("live:reaction", {
      streamId,
      reaction,
      senderName: user?.firstName || "Athlete",
      timestamp: now,
    });
  });

  // 5. Live Telemetry Update (Host Broadcasts HR / Calories)
  socket.on("live:telemetry", ({ streamId, telemetry }) => {
    if (!streamId || !telemetry) return;
    io.to(`live:${streamId}`).emit("live:telemetry", {
      streamId,
      telemetry,
    });
  });

  // 6. Cleanup on Disconnect
  socket.on("disconnect", () => {
    messageRateLimits.delete(socketId);
    reactionRateLimits.delete(socketId);

    if (socketStreams.has(socketId)) {
      const streams = socketStreams.get(socketId);
      streams.forEach((streamId) => {
        if (streamViewers.has(streamId)) {
          const viewers = streamViewers.get(streamId);
          viewers.delete(socketId);
          const count = viewers.size;

          io.to(`live:${streamId}`).emit("live:viewerCount", {
            streamId,
            count,
          });

          LiveStream.findByIdAndUpdate(streamId, {
            viewerCount: count,
          }).catch(() => {});
        }
      });
      socketStreams.delete(socketId);
    }
  });
};
