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
  },
  { timestamps: true }
);

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