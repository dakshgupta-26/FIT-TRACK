// Backend Configuration
export const config = {
  // Email Configuration (Mailjet v3.1)
  MAIL_FROM_NAME: process.env.MAILJET_FROM_NAME || process.env.MAIL_FROM_NAME || 'FitTrack',
  MAIL_FROM_EMAIL: process.env.MAILJET_FROM_EMAIL || process.env.MAIL_FROM_EMAIL || '',
  
  // App Configuration
  APP_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:3000',
  
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/fittrack',
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  
  // Firebase Configuration
  FIREBASE_PROJECT_ID: 'neurolaw-7bb86'
};