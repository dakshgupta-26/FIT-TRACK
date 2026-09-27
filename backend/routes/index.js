// routes/index.js
import express from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import goalRoutes from "./goal.routes.js";
import progressRoutes from "./progress.routes.js";
import healthMetricRoutes from "./healthMetric.routes.js";
import aiRoutes from "./ai.routes.js";
import mealRoutes from "./meal.routes.js";
import workoutRoutes from "./workout.routes.js";
import communityRoutes from "./community.routes.js";
import postsRoutes from "./posts.routes.js";
import reelsRoutes from "./reels.routes.js";
import liveRoutes from "./live.routes.js";
import conversationsRoutes from "./conversations.routes.js";
import notificationsRoutes from "./notifications.routes.js";
import socialRoutes from "./social.routes.js";
import { searchGlobal } from "../controllers/social.controller.js";

const router = express.Router();

// Health Check Route
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "FitTracker Backend API is running", timestamp: new Date().toISOString() });
});

// Mount resource-specific routes
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/goals", goalRoutes);
router.use("/progress", progressRoutes);
router.use("/health-metrics", healthMetricRoutes);
router.use("/ai", aiRoutes);
router.use("/meals", mealRoutes);
router.use("/workouts", workoutRoutes);

// Real-Time Social & Community Routes
router.use("/community", communityRoutes);
router.use("/posts", postsRoutes);
router.use("/reels", reelsRoutes);
router.use("/live", liveRoutes);
router.use("/conversations", conversationsRoutes);
router.use("/messages", conversationsRoutes);
router.use("/notifications", notificationsRoutes);
router.use("/social", socialRoutes);
router.use("/users", socialRoutes);
router.get("/search", searchGlobal);

export default router;