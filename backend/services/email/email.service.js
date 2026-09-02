/**
 * FitTrack - Centralized Email Service
 *
 * All transactional emails across the application pass through this service.
 * Dispatches emails via Mailjet Send API v3.1 using responsive FitTrack branded templates.
 */

import { sendMailjetMessage, validateMailjetConfig } from './mailjet.client.js';
import { getVerificationOtpTemplate } from './templates/verification.template.js';
import { getWelcomeTemplate } from './templates/welcome.template.js';
import { getPasswordResetTemplate } from './templates/password-reset.template.js';
import { getPasswordChangedTemplate } from './templates/password-changed.template.js';
import { getLoginAlertTemplate } from './templates/login-alert.template.js';

/**
 * Helper to get the canonical Frontend / Application URL
 */
export const getAppUrl = () => {
  const url = process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:3000';
  return url.replace(/\/+$/, '');
};

/**
 * Startup verification check for Mailjet configuration
 */
export const verifyMailjetConfig = async () => {
  const check = validateMailjetConfig();
  if (check.valid) {
    console.log(`✅ FitTrack Email Service connected & verified (Mailjet Send API v3.1 Active, Sender: ${check.fromEmail})`);
    return true;
  }
  console.warn(`⚠️ FitTrack Email Service warning: ${check.message}`);
  return false;
};

/**
 * Generic reusable email dispatch function
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} [options.toName] - Recipient name
 * @param {string} options.subject - Subject line
 * @param {string} [options.text] - Plain text body
 * @param {string} options.html - HTML body
 * @param {string} [options.customId] - Observability correlation ID
 * @param {boolean} [options.sandbox] - Sandbox mode flag
 */
export const sendEmail = async ({
  to,
  toName,
  subject,
  text,
  html,
  customId,
  sandbox = false,
}) => {
  return await sendMailjetMessage({
    to,
    toName,
    subject,
    text,
    html,
    customId,
    sandbox,
  });
};

/**
 * Send 6-Digit OTP Email for Signup / Account Verification
 *
 * @param {string} email
 * @param {string} firstName
 * @param {string|number} otp
 */
export const sendVerificationOtpEmail = async (email, firstName, otp) => {
  try {
    const appUrl = getAppUrl();
    const { html, text } = getVerificationOtpTemplate({
      otp,
      firstName,
      appUrl,
    });

    const customId = `verify-otp-${email.toLowerCase().trim()}`;

    return await sendMailjetMessage({
      to: email,
      toName: firstName,
      subject: 'Verify Your FitTrack Account',
      html,
      text,
      customId,
    });
  } catch (error) {
    console.error(`[EmailService] Error preparing verification OTP email for ${email}:`, error.message);
    return { success: false, error: 'Failed to dispatch verification email.' };
  }
};

/**
 * Backwards-compatibility alias for sendVerificationOtpEmail
 */
export const sendOtpEmail = sendVerificationOtpEmail;

/**
 * Send Welcome Email upon successful account verification / creation
 *
 * @param {Object} userData
 */
export const sendWelcomeEmail = async (userData) => {
  try {
    if (!userData || !userData.email) {
      return { success: false, error: 'User data and email are required for welcome email.' };
    }

    const appUrl = getAppUrl();
    const userName = userData.firstName || 'Member';
    const email = userData.email;
    const createdDate = userData.createdAt
      ? new Date(userData.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
      : undefined;

    const { html, text } = getWelcomeTemplate({
      userName,
      email,
      createdDate,
      appUrl,
    });

    const customId = `welcome-user-${userData._id || email.toLowerCase().trim()}`;

    return await sendMailjetMessage({
      to: email,
      toName: userName,
      subject: '🎉 Welcome to FitTrack - Account Activated',
      html,
      text,
      customId,
    });
  } catch (error) {
    console.error('[EmailService] Error preparing welcome email:', error.message);
    return { success: false, error: 'Failed to dispatch welcome email.' };
  }
};

/**
 * Send Password Reset Email with secure 15-minute recovery token
 *
 * @param {string} email
 * @param {string} firstName
 * @param {string} rawToken
 */
export const sendPasswordResetEmail = async (email, firstName, rawToken) => {
  try {
    const appUrl = getAppUrl();
    const resetUrl = `${appUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    const { html, text } = getPasswordResetTemplate({
      userName: firstName,
      resetUrl,
      appUrl,
    });

    const customId = `reset-password-${email.toLowerCase().trim()}`;

    return await sendMailjetMessage({
      to: email,
      toName: firstName,
      subject: '🔑 Reset Your FitTrack Password',
      html,
      text,
      customId,
    });
  } catch (error) {
    console.error(`[EmailService] Error preparing password reset email for ${email}:`, error.message);
    return { success: false, error: 'Failed to dispatch password reset email.' };
  }
};

/**
 * Send Password Changed Notification Email
 *
 * @param {Object} user
 * @param {Object} [loginDetails]
 */
export const sendPasswordChangedEmail = async (user, loginDetails = {}) => {
  try {
    if (!user || !user.email) {
      return { success: false, error: 'User and email are required for password changed email.' };
    }

    const appUrl = getAppUrl();
    const changeTime = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const { html, text } = getPasswordChangedTemplate({
      userName: user.firstName,
      changeTime,
      deviceString: loginDetails.deviceString,
      ip: loginDetails.ip,
      locationString: loginDetails.locationString,
      appUrl,
    });

    const customId = `password-changed-${user._id || user.email}`;

    return await sendMailjetMessage({
      to: user.email,
      toName: user.firstName,
      subject: '🔒 Security Notice: FitTrack Password Changed',
      html,
      text,
      customId,
    });
  } catch (error) {
    console.error('[EmailService] Error preparing password changed email:', error.message);
    return { success: false, error: 'Failed to dispatch password changed email.' };
  }
};

/**
 * Send Login Security Alert Email
 *
 * @param {Object} params
 * @param {Object} params.user
 * @param {Object} params.loginDetails
 */
export const sendLoginAlertEmail = async ({ user, loginDetails = {} }) => {
  try {
    if (!user || !user.email) {
      return { success: false, error: 'User is required for login alert.' };
    }

    const appUrl = getAppUrl();
    const now = new Date();
    const currentLoginTime = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const previousLoginTime = user.previousLoginAt
      ? new Date(user.previousLoginAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
      : 'First sign-in on record';

    const { html, text } = getLoginAlertTemplate({
      userName: user.firstName,
      email: user.email,
      isNewDevice: loginDetails.isNewDevice,
      currentLoginTime,
      previousLoginTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      deviceString: loginDetails.deviceString,
      browser: loginDetails.browser,
      platform: loginDetails.platform,
      deviceType: loginDetails.isMobile ? 'Mobile' : loginDetails.isTablet ? 'Tablet' : 'Desktop',
      ip: loginDetails.ip,
      locationString: loginDetails.locationString,
      mapsUrl: loginDetails.mapsUrl,
      appUrl,
    });

    const customId = `login-alert-${user._id || user.email}-${Date.now()}`;

    return await sendMailjetMessage({
      to: user.email,
      toName: user.firstName,
      subject: loginDetails.isNewDevice
        ? '⚠️ Security Alert: New Device Sign-in to FitTrack'
        : 'Security Alert: Sign-in Notification - FitTrack',
      html,
      text,
      customId,
    });
  } catch (error) {
    console.error('[EmailService] Error preparing login alert email:', error.message);
    return { success: false, error: 'Failed to dispatch login alert email.' };
  }
};

export default {
  verifyMailjetConfig,
  sendEmail,
  sendVerificationOtpEmail,
  sendOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendLoginAlertEmail,
  getAppUrl,
};
