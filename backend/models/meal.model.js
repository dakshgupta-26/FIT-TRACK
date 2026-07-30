import mongoose from "mongoose";

const nutritionSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true, default: 0 },
    protein: { type: Number, required: true, default: 0 },
    carbs: { type: Number, required: true, default: 0 },
    fat: { type: Number, required: true, default: 0 },
  },
  { _id: false }
);

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Meal name is required"],
      trim: true,
    },
    timestamp: {
      type: Date,
      required: true,
    },
    nutrition: nutritionSchema,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id; // Rename _id to id
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

const Meal = mongoose.model("Meal", mealSchema);

export default Meal;