import mongoose from "mongoose";

// --- FOLLOW & FRIEND REQUEST MODEL ---
const followSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    following: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["active", "pending", "blocked", "muted"],
      default: "active",
    },
  },
  { timestamps: true }
);

// --- FITNESS GROUP / CLUB MODEL ---
const groupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Running", "Powerlifting", "Yoga", "HIIT", "Cycling", "Bodybuilding", "City Runners"],
      default: "Running",
    },
    description: { type: String, default: "" },
    bannerImage: { type: String, default: "" },
    icon: { type: String, default: "🏋️" },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPrivate: { type: Boolean, default: false },
    weeklyGoal: { type: String, default: "Run 50km together" },
  },
  { timestamps: true }
);

// --- CHALLENGE MODEL ---
const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ["steps", "calories", "workouts", "distance"], default: "steps" },
    targetValue: { type: Number, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, required: true },
    badgeImage: { type: String, default: "" },
    rewardXP: { type: Number, default: 500 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// --- CHAT MESSAGE MODEL ---
const messageSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String, default: "" },
    text: { type: String, default: "" },
    mediaUrl: { type: String, default: "" },
    audioUrl: { type: String, default: "" },
    workoutAttachment: {
      workoutType: String,
      calories: Number,
      duration: String,
    },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

// --- GRANULAR PRIVACY SETTINGS MODEL ---
const privacySettingsSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    profileVisibility: { type: String, enum: ["public", "followers", "private"], default: "public" },
    hideCalories: { type: Boolean, default: false },
    hideSteps: { type: Boolean, default: false },
    hideWeight: { type: Boolean, default: false },
    hideWorkouts: { type: Boolean, default: false },
    hideSleep: { type: Boolean, default: false },
    hideHeartRate: { type: Boolean, default: false },
    hideActiveStatus: { type: Boolean, default: false },
    hideFollowers: { type: Boolean, default: false },
    hideLocation: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Follow = mongoose.models.Follow || mongoose.model("Follow", followSchema);
export const Group = mongoose.models.Group || mongoose.model("Group", groupSchema);
export const Challenge = mongoose.models.Challenge || mongoose.model("Challenge", challengeSchema);
export const Message = mongoose.models.Message || mongoose.model("Message", messageSchema);
export const PrivacySettings = mongoose.models.PrivacySettings || mongoose.model("PrivacySettings", privacySettingsSchema);
