// Backend Configuration
export const config = {
  // Email Configuration
  SMTP_EMAIL: process.env.SMTP_EMAIL || 'finplan26@gmail.com',
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || 'scyz pzat uaby zlxa',
  FROM_NAME: process.env.FROM_NAME || 'FIT-TRACK',
  FROM_EMAIL: process.env.FROM_EMAIL || 'finplan26@gmail.com',
  
  // App Configuration
  APP_URL: process.env.FRONTEND_URL || process.env.CLIENT_URL || process.env.APP_URL || 'http://localhost:5173',
  
  // MongoDB Configuration
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/health-bloom',
  
  // Server Configuration
  PORT: process.env.PORT || 5000,
  
  // Firebase Configuration
  FIREBASE_PROJECT_ID: 'neurolaw-7bb86'
};