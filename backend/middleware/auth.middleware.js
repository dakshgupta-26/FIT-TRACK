import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.model.js";

dotenv.config();

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1]?.trim();

      if (!token) {
        return res.status(401).json({ message: "Not authorized, token missing" });
      }

      const secret =
        process.env.JWT_SECRET ||
        "fittrack_jwt_secret_key_production_2026_super_secure_998877665544332211";

      // Verify token
      const decoded = jwt.verify(token, secret);
      const userId = decoded.id || decoded._id || decoded.userId;

      if (!userId) {
        return res.status(401).json({ message: "Not authorized, invalid token payload" });
      }

      // Get user from the token (excluding the password)
      req.user = await User.findById(userId).select("-password");

      if (!req.user) {
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.warn("[Auth Middleware Warning] Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed", error: error.message });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};