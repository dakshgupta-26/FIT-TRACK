import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      index: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: [true, "Password is required"],
    },
    birthDate: {
      type: Date,
      default: null,
    },
    hashedOtp: {
      type: String,
      required: [true, "OTP is required"],
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Automatically remove document when expiresAt is reached
    },
    attempts: {
      type: Number,
      default: 0,
      max: 5,
    },
    resendCount: {
      type: Number,
      default: 1,
    },
    lastResendAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Verification = mongoose.model("Verification", verificationSchema);
export default Verification;
