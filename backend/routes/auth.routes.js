import express from "express";
import {
  registerUser,
  verifyOtpUser,
  resendOtpUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getMe,
  logoutUser,
  refreshToken,
  googleAuth,
  microsoftAuth,
} from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Primary & Alias Auth Routes for Signup / OTP flow
router.post("/register", registerUser);
router.post("/signup", registerUser);
router.post("/send-otp", registerUser);

router.post("/verify-otp", verifyOtpUser);
router.post("/resend-otp", resendOtpUser);

// Login & Password Management Routes
router.post("/login", loginUser);
router.post("/signin", loginUser);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Session Routes
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.post("/refresh", protect, refreshToken);

// OAuth Routes
router.post("/google", googleAuth);
router.post("/microsoft", microsoftAuth);

export default router;