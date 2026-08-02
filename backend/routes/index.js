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
// import emailRoutes from "./email.routes.js";

const router = express.Router();

// Health Check Route
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Health Bloom Backend API is running" });
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
router.use("/community", communityRoutes);
// router.use("/email", emailRoutes);

export default router;