import User from "../models/user.model.js";
import Verification from "../models/verification.model.js";
import PasswordReset from "../models/passwordReset.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateSecureOtp, hashOtp, verifyOtpHash } from "../utils/otp.js";
import { isDisposableEmail } from "../utils/disposableEmail.js";
import { parseUserAgent } from "../utils/deviceParser.js";
import { getIpGeolocation } from "../utils/geoIp.js";
import {
  sendOtpEmail,
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
} from "../emailService.js";

// Helper to generate a JWT
const generateToken = (id) => {
  const secret = process.env.JWT_SECRET || "fittrack_jwt_secret_key_production_2026_super_secure_998877665544332211";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id }, secret, { expiresIn });
};

/**
 * Helper to extract IP address from Express Request
 */
const getClientIp = (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || req.ip || "127.0.0.1";
};

/**
 * @desc    Step 1 Signup: Validate user input, check disposable email, store pending verification with hashed OTP, send Email #1
 * @route   POST /api/auth/signup (or /api/auth/send-otp)
 */
export const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, birthDate } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields (First Name, Last Name, Email, Password).",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check disposable email domain
    if (isDisposableEmail(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Disposable or temporary email addresses are not permitted. Please use a permanent email.",
      });
    }

    // Check if user already exists in User collection
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists. Please log in.",
      });
    }

    // Generate 6-digit OTP and hash it
    const rawOtp = generateSecureOtp();
    const hashedOtp = hashOtp(rawOtp);

    // Hash user password for secure pending storage
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Expiry in 5 minutes
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Store or update pending verification record in Verification collection
    await Verification.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        hashedPassword,
        birthDate: birthDate || null,
        hashedOtp,
        expiresAt,
        attempts: 0,
        resendCount: 1,
        lastResendAt: new Date(),
      },
      { upsert: true, new: true, runValidators: true }
    );

    // Send Email #1 (Verification OTP Email)
    const emailResult = await sendOtpEmail(normalizedEmail, firstName, rawOtp);

    if (!emailResult.success) {
      console.error("❌ OTP Email Dispatch Failed:", emailResult.error);
      return res.status(500).json({
        success: false,
        message: `Email delivery failed: ${emailResult.error || "SMTP Authentication Error"}. Please check server logs or SMTP credentials.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email.",
      email: normalizedEmail,
      expiresAt,
    });
  } catch (error) {
    console.error("Signup/Send-OTP error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process signup request.",
    });
  }
};

/**
 * @desc    Step 2 Verify OTP: Verify entered OTP, create User in MongoDB, delete Verification record, send Email #2 Welcome Email
 * @route   POST /api/auth/verify-otp
 */
export const verifyOtpUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email address and 6-digit verification code are required.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanOtp = otp.toString().trim();

    // Find pending verification record
    const verification = await Verification.findOne({ email: normalizedEmail });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "No pending verification request found or code expired. Please sign up again.",
      });
    }

    // Check if expired
    if (new Date() > new Date(verification.expiresAt)) {
      await Verification.deleteOne({ email: normalizedEmail });
      return res.status(400).json({
        success: false,
        message: "Verification code has expired (valid for 5 mins). Please request a new code.",
      });
    }

    // Check attempt limit
    if (verification.attempts >= 5) {
      await Verification.deleteOne({ email: normalizedEmail });
      return res.status(429).json({
        success: false,
        message: "Maximum verification attempts (5) exceeded. Security lock engaged. Please request a new code.",
      });
    }

    // Compare hashed OTP
    const isValid = verifyOtpHash(cleanOtp, verification.hashedOtp);

    if (!isValid) {
      verification.attempts += 1;
      await verification.save();

      const remaining = 5 - verification.attempts;
      if (remaining <= 0) {
        await Verification.deleteOne({ email: normalizedEmail });
        return res.status(429).json({
          success: false,
          message: "Maximum verification attempts exceeded. Please request a new code.",
        });
      }

      return res.status(400).json({
        success: false,
        message: `Invalid verification code. You have ${remaining} attempt(s) remaining.`,
      });
    }

    // Create User in MongoDB
    let user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      user = await User.create({
        firstName: verification.firstName,
        lastName: verification.lastName,
        email: normalizedEmail,
        password: verification.hashedPassword,
        birthDate: verification.birthDate,
        authProvider: "local",
        lastLoginAt: new Date(),
      });
    }

    // Remove pending verification document
    await Verification.deleteOne({ email: normalizedEmail });

    // Generate JWT Token
    const token = generateToken(user._id);
    const userResponse = await User.findById(user._id);

    // Send Welcome Email asynchronously
    sendWelcomeEmail(userResponse).catch((err) =>
      console.error("Welcome email async error:", err.message)
    );

    return res.status(201).json({
      success: true,
      message: "Account verified and created successfully!",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "OTP verification failed due to a server error.",
    });
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/auth/resend-otp
 */
export const resendOtpUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email address is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const verification = await Verification.findOne({ email: normalizedEmail });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "No pending verification found for this email. Please fill in the signup form.",
      });
    }

    // Hourly rate limit check (Max 3 resends per hour)
    const ONE_HOUR = 60 * 60 * 1000;
    const timeSinceLastResend = Date.now() - new Date(verification.lastResendAt).getTime();

    if (timeSinceLastResend < ONE_HOUR && verification.resendCount >= 3) {
      const waitMinutes = Math.ceil((ONE_HOUR - timeSinceLastResend) / (60 * 1000));
      return res.status(429).json({
        success: false,
        message: `Maximum resend limit (3 per hour) reached. Please wait ${waitMinutes} minute(s) before trying again.`,
      });
    }

    if (timeSinceLastResend >= ONE_HOUR) {
      verification.resendCount = 0;
    }

    // Generate new OTP
    const rawOtp = generateSecureOtp();
    const hashedOtp = hashOtp(rawOtp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    verification.hashedOtp = hashedOtp;
    verification.expiresAt = expiresAt;
    verification.attempts = 0;
    verification.resendCount += 1;
    verification.lastResendAt = new Date();

    await verification.save();

    // Send Email
    const emailResult = await sendOtpEmail(normalizedEmail, verification.firstName, rawOtp);

    if (!emailResult.success) {
      console.error("❌ Resend OTP Email Dispatch Failed:", emailResult.error);
      return res.status(500).json({
        success: false,
        message: `Email delivery failed: ${emailResult.error || "SMTP Authentication Error"}. Please check server logs or SMTP credentials.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "A new 6-digit verification code has been sent to your email.",
      email: normalizedEmail,
      expiresAt,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to resend verification code." });
  }
};

/**
 * @desc    Authenticate user & send Security Login Alert Email
 * @route   POST /api/auth/login
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please enter both email and password.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    // Device & IP Geolocation Telemetry
    const rawUa = req.headers["user-agent"] || "";
    const deviceInfo = parseUserAgent(rawUa);
    const clientIp = getClientIp(req);
    const geoInfo = await getIpGeolocation(clientIp);

    // Check if device is recognized
    const knownDevices = user.knownDevices || [];
    const isKnownDevice = knownDevices.some(
      (d) => d.deviceString === deviceInfo.deviceString
    );

    const isNewDevice = !isKnownDevice;

    if (isNewDevice) {
      knownDevices.push({
        userAgent: rawUa,
        ip: clientIp,
        deviceString: deviceInfo.deviceString,
        firstSeenAt: new Date(),
        lastSeenAt: new Date(),
      });
    } else {
      const matchDevice = knownDevices.find((d) => d.deviceString === deviceInfo.deviceString);
      if (matchDevice) {
        matchDevice.lastSeenAt = new Date();
        matchDevice.ip = clientIp;
      }
    }

    // Update login timestamps
    const previousLoginAt = user.lastLoginAt;
    user.previousLoginAt = previousLoginAt;
    user.lastLoginAt = new Date();
    user.knownDevices = knownDevices;
    await user.save();

    const userResponse = await User.findById(user._id);

    // Dispatch Login Alert Email asynchronously
    sendLoginAlertEmail({
      user,
      loginDetails: {
        isNewDevice,
        ...deviceInfo,
        ...geoInfo,
      },
    }).catch((err) => console.error("Login alert email dispatch error:", err.message));

    return res.json({
      success: true,
      token: generateToken(user._id),
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: error.message || "Login failed due to a server error." });
  }
};

/**
 * @desc    Request Password Reset Email (15-min expiry token)
 * @route   POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please provide your email address." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Return 200 to prevent user enumeration attacks
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, password reset instructions have been sent.",
      });
    }

    // Generate 32-byte hex token and hash it
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");

    // 15-minute token TTL
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await PasswordReset.findOneAndDelete({ email: normalizedEmail });
    await PasswordReset.create({
      email: normalizedEmail,
      hashedToken,
      expiresAt,
    });

    // Send Email
    sendPasswordResetEmail(normalizedEmail, user.firstName, rawToken).catch((err) =>
      console.error("Password reset mail error:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Password reset instructions sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to process forgot password request." });
  }
};

/**
 * @desc    Reset Password with 15-min token
 * @route   POST /api/auth/reset-password
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;

    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, token, and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedToken = crypto.createHash("sha256").update(token.trim()).digest("hex");

    const resetRecord = await PasswordReset.findOne({
      email: normalizedEmail,
      hashedToken,
    });

    if (!resetRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired password reset token. Please request a new password reset.",
      });
    }

    if (new Date() > new Date(resetRecord.expiresAt)) {
      await PasswordReset.deleteOne({ _id: resetRecord._id });
      return res.status(400).json({
        success: false,
        message: "Password reset token has expired (15 min limit). Please request a new link.",
      });
    }

    // Find User and update password
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "User account not found." });
    }

    // Pre-save hook in user.model.js will hash the password
    user.password = newPassword;
    await user.save();

    // Delete password reset record
    await PasswordReset.deleteOne({ _id: resetRecord._id });

    // Telemetry & Notification
    const rawUa = req.headers["user-agent"] || "";
    const deviceInfo = parseUserAgent(rawUa);
    const clientIp = getClientIp(req);
    const geoInfo = await getIpGeolocation(clientIp);

    sendPasswordChangedEmail(user, { ...deviceInfo, ...geoInfo }).catch((err) =>
      console.error("Password changed email dispatch error:", err.message)
    );

    return res.status(200).json({
      success: true,
      message: "Password successfully updated! You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ success: false, message: error.message || "Failed to reset password." });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 */
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized. Session not found." });
    }
    return res.json({ success: true, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Server error fetching user details." });
  }
};

/**
 * @desc    Logout user
 * @route   POST /api/auth/logout
 */
export const logoutUser = async (req, res) => {
  return res.json({ success: true, message: "Logged out successfully." });
};

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 */
export const refreshToken = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authorized." });
    }
    const newToken = generateToken(req.user._id);
    return res.json({ success: true, token: newToken, user: req.user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message || "Failed to refresh token." });
  }
};

/**
 * @desc    Google Authentication
 * @route   POST /api/auth/google
 */
export const googleAuth = async (req, res) => {
  try {
    const { email, firstName, lastName, photoUrl } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Google profile email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      user = await User.create({
        firstName: firstName || "Google",
        lastName: lastName || "User",
        email: normalizedEmail,
        password: randomPassword,
        profileImageUrl: photoUrl || "",
        authProvider: "google",
        lastLoginAt: new Date(),
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    const userResponse = await User.findById(user._id);
    return res.json({
      success: true,
      token: generateToken(user._id),
      user: userResponse,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Google authentication failed." });
  }
};

/**
 * @desc    Microsoft Authentication
 * @route   POST /api/auth/microsoft
 */
export const microsoftAuth = async (req, res) => {
  try {
    const { email, firstName, lastName, photoUrl } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Microsoft profile email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + "Aa1!";
      user = await User.create({
        firstName: firstName || "Microsoft",
        lastName: lastName || "User",
        email: normalizedEmail,
        password: randomPassword,
        profileImageUrl: photoUrl || "",
        authProvider: "microsoft",
        lastLoginAt: new Date(),
      });
    } else {
      user.lastLoginAt = new Date();
      await user.save();
    }

    const userResponse = await User.findById(user._id);
    return res.json({
      success: true,
      token: generateToken(user._id),
      user: userResponse,
    });
  } catch (error) {
    console.error("Microsoft Auth Error:", error);
    return res.status(500).json({ success: false, message: error.message || "Microsoft authentication failed." });
  }
};