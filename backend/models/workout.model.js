// models/workout.model.js

import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Exercise name is required."],
    trim: true,
  },
  sets: {
    type: Number,
    required: [true, "Number of sets is required."],
  },
  reps: {
    type: mongoose.Schema.Types.Mixed, // Allows for numbers (reps) or strings ("30s")
    required: [true, "Reps or duration is required."],
  },
});

const workoutSchema = new mongoose.Schema(
  {
    // This is the crucial field for making workouts user-specific
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Workout title is required."],
      trim: true,
    },
    duration: {
      type: Number,
      required: [true, "Workout duration is required."],
    },
    type: {
      type: String,
      required: [true, "Workout type is required."],
      enum: ["Strength", "Cardio", "Flexibility", "Other"],
    },
    difficulty: {
      type: String,
      required: [true, "Workout difficulty is required."],
      enum: ["Easy", "Medium", "Hard"],
    },
    exercises: [exerciseSchema],
    estimatedCalories: Number,
    targetMuscles: [String],
    popularity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Mongoose virtual to transform _id to id for frontend compatibility
workoutSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

const Workout = mongoose.model("Workout", workoutSchema);

export default Workout;