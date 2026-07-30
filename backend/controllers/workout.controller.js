// controllers/workout.controller.js

import Workout from "../models/workout.model.js";
import asyncHandler from "express-async-handler";

// @desc    Get all workouts for the logged-in user
// @route   GET /api/workouts
// @access  Private
export const getAllWorkouts = asyncHandler(async (req, res) => {
  const workouts = await Workout.find({ user: req.user.id });
  res.status(200).json(workouts);
});

// @desc    Create a new workout for the logged-in user
// @route   POST /api/workouts
// @access  Private
export const createWorkout = asyncHandler(async (req, res) => {
  const workoutData = { ...req.body, user: req.user.id };
  const workout = await Workout.create(workoutData);
  res.status(201).json(workout);
});

// @desc    Get a single workout by ID
// @route   GET /api/workouts/:id
// @access  Private
export const getWorkoutById = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  // Security Check: Ensure the workout belongs to the logged-in user
  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to access this workout");
  }

  res.status(200).json(workout);
});

// @desc    Update a workout
// @route   PUT /api/workouts/:id
// @access  Private
export const updateWorkout = asyncHandler(async (req, res) => {
  let workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  // Security Check: Ensure the workout belongs to the logged-in user
  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to update this workout");
  }

  workout = await Workout.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(workout);
});

// @desc    Delete a workout
// @route   DELETE /api/workouts/:id
// @access  Private
export const deleteWorkout = asyncHandler(async (req, res) => {
  const workout = await Workout.findById(req.params.id);

  if (!workout) {
    res.status(404);
    throw new Error("Workout not found");
  }

  // Security Check: Ensure the workout belongs to the logged-in user
  if (workout.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error("User not authorized to delete this workout");
  }

  await workout.deleteOne();

  res.status(200).json({ id: req.params.id, message: "Workout deleted" });
});