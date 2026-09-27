import express from "express";
import {
  getReels,
  createReel,
  toggleLikeReel,
  trackReelView,
  addReelComment,
} from "../controllers/reels.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadReelVideo } from "../middleware/upload.middleware.js";

const router = express.Router();

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.get("/", optionalAuth, getReels);
router.post("/", protect, uploadReelVideo.single("video"), createReel);
router.post("/:id/like", protect, toggleLikeReel);
router.post("/:id/view", optionalAuth, trackReelView);
router.post("/:id/comments", protect, addReelComment);

export default router;
