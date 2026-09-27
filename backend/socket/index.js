import { Server } from "socket.io";
import { socketAuthMiddleware } from "./auth.js";
import { registerPresenceHandlers } from "./presence.js";
import { registerMessagingHandlers } from "./messaging.js";
import { registerLiveHandlers } from "./live.js";
import { registerNotificationHandlers } from "./notifications.js";

let ioInstance = null;

export const initSocket = (httpServer) => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    process.env.APP_URL,
    "https://fit-track-neon-xi.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:8080",
  ]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((u) => u.trim().replace(/\/+$/, ""))
    .filter(Boolean);

  const uniqueOrigins = Array.from(new Set(allowedOrigins));

  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const normalized = origin.replace(/\/+$/, "");
        if (uniqueOrigins.includes(normalized) || process.env.NODE_ENV === "development") {
          return callback(null, true);
        }
        return callback(new Error(`Socket CORS violation: ${origin} not allowed`));
      },
      credentials: true,
      methods: ["GET", "POST"],
    },
    pingTimeout: 30000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  // Attach authentication middleware
  io.use(socketAuthMiddleware);

  // Connection handler
  io.on("connection", (socket) => {
    const userId = socket.userId;
    const userEmail = socket.user?.email || "Unknown";
    console.log(`🔌 [Socket.IO] Connected: user=${userEmail} (${userId}) socket=${socket.id}`);

    // Register modular feature handlers
    registerPresenceHandlers(io, socket);
    registerMessagingHandlers(io, socket);
    registerLiveHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    socket.on("disconnect", (reason) => {
      console.log(`❌ [Socket.IO] Disconnected: user=${userEmail} (${userId}) socket=${socket.id} reason=${reason}`);
    });
  });

  ioInstance = io;
  return io;
};

export const getIO = () => {
  return ioInstance;
};
