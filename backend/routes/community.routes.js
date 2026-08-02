import express from "express";
import {
  getFeed,
  createPost,
  toggleLikePost,
  getGroups,
  getChallenges,
  updatePrivacySettings,
} from "../controllers/community.controller.js";

const router = express.Router();

router.get("/feed", getFeed);
router.post("/posts", createPost);
router.post("/posts/:postId/like", toggleLikePost);
router.get("/groups", getGroups);
router.get("/challenges", getChallenges);
router.put("/privacy", updatePrivacySettings);

export default router;
