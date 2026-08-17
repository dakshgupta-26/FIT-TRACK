// Email Configuration - Update these values
export const emailConfig = {
  // Gmail SMTP Configuration
  SMTP_EMAIL: process.env.SMTP_USER || process.env.SMTP_EMAIL || 'finplan26@gmail.com',
  SMTP_PASSWORD: process.env.SMTP_PASS || process.env.SMTP_PASSWORD || 'scyz pzat uaby zlxa',
  FROM_NAME: process.env.SMTP_FROM_NAME || process.env.FROM_NAME || 'FIT-TRACK',
  FROM_EMAIL: process.env.EMAIL_FROM || process.env.FROM_EMAIL || 'finplan26@gmail.com',
  
  // App Configuration
  APP_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173'
};

// Instructions:
// 1. Update the values above with your email credentials
// 2. Make sure Gmail 2-factor authentication is enabled
// 3. Use App Password (not your regular Gmail password)
// 4. Restart the backend server after making changes
