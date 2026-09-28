import mongoose from "mongoose";

const progressPhotoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      enum: ["Front", "Side", "Back", "Other"],
      default: "Front",
    },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true,
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    // Primary image url for quick access and backward compatibility
    imageUrl: {
      type: String,
      default: "",
    },
    publicId: {
      type: String,
      default: "",
    },
    // Multi-photo array supporting Front, Side, Back, Other
    photos: [progressPhotoSchema],
    // Primary category tag
    category: {
      type: String,
      enum: ["Front", "Back", "Side", "Other"],
      default: "Front",
    },
    // Body measurements (stored metric by default: kg, cm)
    weight: { type: Number },
    waist: { type: Number },
    bodyFat: { type: Number },
    chest: { type: Number },
    arms: { type: Number },
    thighs: { type: Number },
    hips: { type: Number },
    neck: { type: Number },
    // Unit preference when entered: "metric" | "imperial"
    unitPreference: {
      type: String,
      enum: ["metric", "imperial"],
      default: "metric",
    },
    // Progress reflection / notes
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    // Optional workout snapshot linkage
    workoutSnapshot: {
      workoutId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Workout",
      },
      workoutTitle: { type: String },
      workoutType: { type: String },
      duration: { type: Number }, // in minutes
      calories: { type: Number },
      distance: { type: Number }, // in km
      prAchieved: { type: String },
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

// Compound index for querying user entries ordered by date
progressSchema.index({ user: 1, date: -1 });

const Progress = mongoose.model("Progress", progressSchema);
export default Progress;