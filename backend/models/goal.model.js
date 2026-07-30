import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    // Changed uid to a direct reference to the User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    description: String,
    type: {
      type: String,
      enum: [
        "weight",
        "workout",
        "nutrition",
        "habit",
        "strength",
        "hydration",
        "steps",
      ],
      required: true,
    },
    category: {
      type: String,
      enum: ["Fitness", "Nutrition", "Lifestyle"],
      required: true,
    },
    startDate: { type: Date, required: true, default: Date.now },
    targetDate: { type: Date, required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
    target: { type: Number, required: true },
    unit: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "completed", "failed"],
      default: "active",
    },
    milestones: [
      {
        _id: false, // Don't create separate _id for milestones
        title: String,
        isCompleted: { type: Boolean, default: false },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id; // Rename _id to id for frontend convenience
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;