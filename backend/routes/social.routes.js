import express from "express";
import {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserProfile,
  getSuggestedUsers,
  searchGlobal,
} from "../controllers/social.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.post("/users/:id/follow", protect, followUser);
router.delete("/users/:id/follow", protect, unfollowUser);
router.get("/users/:id/followers", getFollowers);
router.get("/users/:id/following", getFollowing);
router.get("/users/:id/profile", optionalAuth, getUserProfile);
router.get("/users/suggested", optionalAuth, getSuggestedUsers);
router.get("/search", searchGlobal);

export default router;
