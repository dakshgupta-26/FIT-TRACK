import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // uid will now be populated by our backend, referencing MongoDB's _id
    uid: { type: String, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "is invalid"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false, // Don't send password in API responses by default
    },
    birthDate: { type: Date },
    gender: String,
    height: String,
    weight: String,
    profileImageUrl: String,
    // Default settings remain the same
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
  },
  { timestamps: true }
);

// Middleware to hash password before saving and set the UID
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Set uid from the document's _id
  if (this.isNew) {
    this.uid = this._id.toString();
  }

  next();
});

// Method to compare entered password with the hashed password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;