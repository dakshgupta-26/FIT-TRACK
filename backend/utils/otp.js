import crypto from "crypto";

/**
 * Generate a cryptographically secure 6-digit OTP string.
 */
export const generateSecureOtp = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Hash an OTP using SHA-256 with a salt to ensure one-way security.
 * Never store plain OTPs in DB.
 */
export const hashOtp = (otp) => {
  const secret = process.env.JWT_SECRET || "fittrack_otp_salt_secret";
  return crypto
    .createHmac("sha256", secret)
    .update(otp.toString().trim())
    .digest("hex");
};

/**
 * Compare entered OTP against stored hash.
 */
export const verifyOtpHash = (enteredOtp, storedHash) => {
  if (!enteredOtp || !storedHash) return false;
  const calculatedHash = hashOtp(enteredOtp);
  return crypto.timingSafeEqual(
    Buffer.from(calculatedHash),
    Buffer.from(storedHash)
  );
};
