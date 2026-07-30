import express from "express";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from "../controllers/goal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all goal routes
router.use(protect);

router.route("/").get(getGoals).post(addGoal);

router.route("/:id").put(updateGoal).delete(deleteGoal);

export default router;