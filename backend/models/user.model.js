import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    uid: { type: String },
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: {
      type: String,
      required: [true, "Email address is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },
    birthDate: {
      type: Date,
      default: null,
      set: (val) => (val === "" || val === undefined ? null : val),
    },
    gender: String,
    height: String,
    weight: String,
    profileImageUrl: String,
    authProvider: { type: String, default: "local" },
    language: { type: String, default: "en" },
    timezone: { type: String, default: "utc" },
    autoSave: { type: Boolean, default: true },
    weeklyReports: { type: Boolean, default: true },
    notifications: {
      push: { type: Boolean, default: true },
      workoutReminders: { type: Boolean, default: true },
      mealReminders: { type: Boolean, default: true },
      waterReminders: { type: Boolean, default: true },
      achievements: { type: Boolean, default: true },
    },
    theme: { type: String, default: "auto" },
    accentColor: { type: String, default: "blue" },
    lastLoginAt: { type: Date, default: null },
    previousLoginAt: { type: Date, default: null },
    knownDevices: [
      {
        userAgent: String,
        ip: String,
        deviceString: String,
        firstSeenAt: { type: Date, default: Date.now },
        lastSeenAt: { type: Date, default: Date.now },
      },
    ],
    bio: { type: String, default: "" },
    username: { type: String, trim: true },
    badge: { type: String, default: "PRO ATHLETE" },
    location: { type: String, default: "" },
    followersCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    postsCount: { type: Number, default: 0 },
    reelsCount: { type: Number, default: 0 },
    workoutStats: {
      totalWorkouts: { type: Number, default: 24 },
      totalMinutes: { type: Number, default: 1140 },
      totalCalories: { type: Number, default: 18450 },
      streakDays: { type: Number, default: 7 },
    },
    fitnessGoals: [
      {
        title: { type: String, default: "Daily Step Goal" },
        target: { type: String, default: "10,000 steps" },
        progress: { type: Number, default: 75 },
      },
    ],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isOnline: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

userSchema.index({ username: 1 });
userSchema.index({ isOnline: 1, lastSeen: -1 });

userSchema.pre("save", async function (next) {
  if (this.isNew && !this.uid) {
    this.uid = this._id.toString();
  }
  if (!this.isModified("password")) {
    return next();
  }
  if (this.password && (this.password.startsWith("$2a$") || this.password.startsWith("$2b$"))) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;