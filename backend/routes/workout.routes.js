// routes/workout.routes.js

import express from "express";
import {
  getAllWorkouts,
  createWorkout,
  getWorkoutById,
  updateWorkout,
  deleteWorkout,
} from "../controllers/workout.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // Assuming you have this middleware

const router = express.Router();

// Apply protect middleware to all routes in this file
router.use(protect);

router.route("/").get(getAllWorkouts).post(createWorkout);
router
  .route("/:id")
  .get(getWorkoutById)
  .put(updateWorkout)
  .delete(deleteWorkout);

export default router;