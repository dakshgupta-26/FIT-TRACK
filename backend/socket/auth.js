import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

/**
 * Socket.IO Authentication Middleware
 * Validates JWT token from handshake auth or headers.
 * Populates socket.user with verified user document.
 */
export const socketAuthMiddleware = async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.replace(/^Bearer\s+/i, "");

    if (!token) {
      return next(new Error("Authentication error: No token provided"));
    }

    const secret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, secret);

    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      return next(new Error("Authentication error: Invalid token payload"));
    }

    const user = await User.findById(userId).select("-password").lean();
    if (!user) {
      return next(new Error("Authentication error: User not found"));
    }

    socket.user = user;
    socket.userId = user._id.toString();
    next();
  } catch (error) {
    console.warn(`[Socket Auth Warning] Handshake failed: ${error.message}`);
    return next(new Error(`Authentication error: ${error.message}`));
  }
};
