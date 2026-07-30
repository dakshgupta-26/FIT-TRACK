import express from "express";
import {
  getMealsByDate,
  addMeal,
  updateMeal,
  deleteMeal,
  deleteMealsByDate,
} from "../controllers/meal.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

router.route("/").get(getMealsByDate).post(addMeal).delete(deleteMealsByDate); // For resetting the day

router.route("/:id").put(updateMeal).delete(deleteMeal);

export default router;