import express from "express";
import {
  getPosts,
  createPost,
  getPostById,
  deletePost,
  toggleLike,
  toggleBookmark,
  addComment,
} from "../controllers/posts.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { uploadPostMedia } from "../middleware/upload.middleware.js";

const router = express.Router();

// Optional authentication middleware for GET / to personalize liked/saved status
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    return protect(req, res, next);
  }
  next();
};

router.get("/", optionalAuth, getPosts);
router.post("/", protect, uploadPostMedia.single("media"), createPost);
router.get("/:id", optionalAuth, getPostById);
router.delete("/:id", protect, deletePost);
router.post("/:id/like", protect, toggleLike);
router.delete("/:id/like", protect, toggleLike);
router.post("/:id/save", protect, toggleBookmark);
router.post("/:id/comments", protect, addComment);

export default router;
