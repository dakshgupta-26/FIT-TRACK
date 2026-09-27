import express from "express";
import {
  getPosts,
  createPost,
  toggleLike,
} from "../controllers/posts.controller.js";
import {
  getGroups,
  joinGroup,
  getChallenges,
  joinChallenge,
  getLeaderboard,
  updatePrivacySettings,
  reportContent,
  blockUser,
} from "../controllers/community.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadPostMedia } from "../middleware/upload.middleware.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.get("/feed", optionalAuth, getPosts);
router.post("/posts", protect, uploadPostMedia.single("media"), createPost);
router.post("/posts/:id/like", protect, toggleLike);

router.get("/groups", optionalAuth, getGroups);
router.post("/groups/:id/join", protect, joinGroup);

router.get("/challenges", optionalAuth, getChallenges);
router.post("/challenges/:id/join", protect, joinChallenge);

router.get("/leaderboard", optionalAuth, getLeaderboard);

router.put("/privacy", protect, updatePrivacySettings);
router.post("/report", protect, reportContent);
router.post("/block/:userId", protect, blockUser);

export default router;
