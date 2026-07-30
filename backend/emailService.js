import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { emailConfig } from './email-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Parse user agent to get real device information
const parseUserAgent = (userAgent) => {
  try {
    let browser = 'Unknown Browser';
    let os = 'Unknown OS';
    let device = 'Unknown Device';

    // Detect Browser
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
      const chromeMatch = userAgent.match(/Chrome\/(\d+\.\d+)/);
      browser = chromeMatch ? `Google Chrome ${chromeMatch[1]}` : 'Google Chrome';
    } else if (userAgent.includes('Firefox')) {
      const firefoxMatch = userAgent.match(/Firefox\/(\d+\.\d+)/);
      browser = firefoxMatch ? `Mozilla Firefox ${firefoxMatch[1]}` : 'Mozilla Firefox';
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
      const safariMatch = userAgent.match(/Version\/(\d+\.\d+)/);
      browser = safariMatch ? `Safari ${safariMatch[1]}` : 'Safari';
    } else if (userAgent.includes('Edg')) {
      const edgeMatch = userAgent.match(/Edg\/(\d+\.\d+)/);
      browser = edgeMatch ? `Microsoft Edge ${edgeMatch[1]}` : 'Microsoft Edge';
    } else if (userAgent.includes('Opera') || userAgent.includes('OPR')) {
      const operaMatch = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/);
      browser = operaMatch ? `Opera ${operaMatch[1]}` : 'Opera';
    }

    // Detect Operating System
    if (userAgent.includes('Windows NT 10.0')) {
      os = 'Windows 10/11';
    } else if (userAgent.includes('Windows NT 6.3')) {
      os = 'Windows 8.1';
    } else if (userAgent.includes('Windows NT 6.1')) {
      os = 'Windows 7';
    } else if (userAgent.includes('Mac OS X')) {
      const macMatch = userAgent.match(/Mac OS X (\d+[._]\d+)/);
      os = macMatch ? `macOS ${macMatch[1].replace('_', '.')}` : 'macOS';
    } else if (userAgent.includes('Linux')) {
      os = 'Linux';
    } else if (userAgent.includes('Android')) {
      const androidMatch = userAgent.match(/Android (\d+\.\d+)/);
      os = androidMatch ? `Android ${androidMatch[1]}` : 'Android';
    } else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      const iosMatch = userAgent.match(/OS (\d+[._]\d+)/);
      os = iosMatch ? `iOS ${iosMatch[1].replace('_', '.')}` : 'iOS';
    }

    // Detect Device Type
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      device = 'Mobile Device';
    } else if (userAgent.includes('Tablet') || userAgent.includes('iPad')) {
      device = 'Tablet';
    } else {
      device = 'Desktop Computer';
    }

    return `${browser} on ${os} (${device})`;
  } catch (error) {
    console.error('Error parsing user agent:', error);
    return userAgent || 'Unknown Device';
  }
};

// Email configuration
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailConfig.SMTP_EMAIL,
      pass: emailConfig.SMTP_PASSWORD
    }
  });
};

// Load email templates
const loadTemplate = (templateName) => {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.html`);
  return fs.readFileSync(templatePath, 'utf8');
};

// Welcome email template
const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Health Bloom</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px 30px;
        }
        .welcome-message {
            font-size: 18px;
            margin-bottom: 30px;
            color: #2d3748;
        }
        .features {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 30px 0;
        }
        .feature {
            text-align: center;
            padding: 20px;
            background: #f7fafc;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .feature-icon {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .feature h3 {
            margin: 0 0 10px 0;
            color: #2d3748;
            font-size: 16px;
        }
        .feature p {
            margin: 0;
            color: #718096;
            font-size: 14px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
            transition: transform 0.2s;
        }
        .cta-button:hover {
            transform: translateY(-2px);
        }
        .footer {
            background: #f7fafc;
            padding: 30px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
        .social-links {
            margin: 20px 0;
        }
        .social-links a {
            color: #667eea;
            text-decoration: none;
            margin: 0 10px;
        }
        @media (max-width: 600px) {
            .features {
                grid-template-columns: 1fr;
            }
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌟 Welcome to FIT-TRACK!</h1>
            <p>Your journey to a healthier lifestyle starts now</p>
        </div>
        
        <div class="content">
            <div class="welcome-message">
                <strong>Hi {{firstName}}!</strong><br>
                Thank you for joining FIT-TRACK! We're excited to help you achieve your health and fitness goals.
            </div>
            
            <div class="features">
                <div class="feature">
                    <div class="feature-icon">🎯</div>
                    <h3>Smart Goal Tracking</h3>
                    <p>Set and track personalized fitness goals with our intelligent system</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">📊</div>
                    <h3>Progress Analytics</h3>
                    <p>Monitor your progress with detailed insights and analytics</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">💪</div>
                    <h3>Workout Plans</h3>
                    <p>Access personalized workout routines and exercise plans</p>
                </div>
                <div class="feature">
                    <div class="feature-icon">🥗</div>
                    <h3>Nutrition Tracking</h3>
                    <p>Track your meals and maintain a balanced diet</p>
                </div>
            </div>
            
            <div style="text-align: center;">
                <a href="{{appUrl}}" class="cta-button">Start Your Journey</a>
            </div>
            
            <div style="background: #e6fffa; border-left: 4px solid #38b2ac; padding: 20px; margin: 30px 0; border-radius: 4px;">
                <strong>💡 Pro Tip:</strong> Complete your profile to get personalized recommendations and better insights into your health journey.
            </div>
        </div>
        
        <div class="footer">
            <p><strong>FIT-TRACK Team</strong></p>
            <p>Your health is our priority. We're here to support you every step of the way.</p>
            
            <div class="social-links">
                <a href="#">Website</a> |
                <a href="#">Support</a> |
                <a href="#">Privacy Policy</a>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #a0aec0;">
                This email was sent to {{email}} because you signed up for FIT-TRACK.
                <br>If you didn't create this account, please ignore this email.
            </p>
        </div>
    </div>
</body>
</html>
`;

// Login notification email template
const loginEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login Notification - Health Bloom</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }
        .container {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 700;
        }
        .content {
            padding: 30px;
        }
        .login-info {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #48bb78;
        }
        .info-item {
            display: flex;
            justify-content: space-between;
            margin: 10px 0;
            padding: 5px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .info-item:last-child {
            border-bottom: none;
        }
        .info-label {
            font-weight: 600;
            color: #2d3748;
        }
        .info-value {
            color: #718096;
        }
        .security-notice {
            background: #fff5f5;
            border: 1px solid #fed7d7;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .security-notice h3 {
            color: #c53030;
            margin: 0 0 10px 0;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 20px 0;
        }
        .footer {
            background: #f7fafc;
            padding: 20px;
            text-align: center;
            color: #718096;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 Login Notification</h1>
            <p>Your account was accessed successfully</p>
        </div>
        
        <div class="content">
            <p>Hi <strong>{{firstName}}</strong>,</p>
            
            <p>We wanted to let you know that your FIT-TRACK account was accessed successfully.</p>
            
            <div class="login-info">
                <div class="info-item">
                    <span class="info-label">Login Time:</span>
                    <span class="info-value">{{loginTime}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Device:</span>
                    <span class="info-value">{{deviceInfo}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Location:</span>
                    <span class="info-value">{{location}}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">IP Address:</span>
                    <span class="info-value">{{ipAddress}}</span>
                </div>
            </div>
            
            <div class="security-notice">
                <h3>🛡️ Security Notice</h3>
                <p>If this login was not authorized by you, please:</p>
                <ul>
                    <li>Change your password immediately</li>
                    <li>Contact our support team</li>
                    <li>Review your account activity</li>
                </ul>
            </div>
            
            <div style="text-align: center;">
                <a href="{{appUrl}}" class="cta-button">Continue to FIT-TRACK</a>
            </div>
        </div>
        
        <div class="footer">
            <p><strong>FIT-TRACK Security Team</strong></p>
            <p>Keeping your account safe and secure is our top priority.</p>
            <p style="font-size: 12px; color: #a0aec0; margin-top: 15px;">
                This is an automated security notification. Please do not reply to this email.
            </p>
        </div>
    </div>
</body>
</html>
`;

// Get real user location and IP
const getUserLocationAndIP = async (req) => {
  try {
    // Get IP address from request - try multiple methods
    let ipAddress = req.ip || 
                   req.connection?.remoteAddress || 
                   req.socket?.remoteAddress ||
                   req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                   req.headers['x-real-ip'] ||
                   req.headers['x-client-ip'] ||
                   req.headers['cf-connecting-ip'] ||
                   '127.0.0.1'; // fallback to localhost

    // Remove IPv6 prefix if present
    if (ipAddress.startsWith('::ffff:')) {
      ipAddress = ipAddress.substring(7);
    }

    // If it's localhost, try to get public IP
    if (ipAddress === '127.0.0.1' || ipAddress === '::1' || ipAddress.startsWith('192.168.') || ipAddress.startsWith('10.')) {
      try {
        const publicIPResponse = await fetch('https://api.ipify.org?format=json');
        const publicIPData = await publicIPResponse.json();
        ipAddress = publicIPData.ip || ipAddress;
      } catch (e) {
        console.log('Could not get public IP, using local IP');
      }
    }

    console.log('Detected IP Address:', ipAddress);

    // Get location from IP using a free service
    const locationResponse = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,regionName,city,lat,lon,timezone,query`);
    const locationData = await locationResponse.json();
    
    console.log('Location API Response:', locationData);
    
    let location = 'Unknown Location';
    if (locationData.status === 'success') {
      location = `${locationData.city || 'Unknown City'}, ${locationData.regionName || 'Unknown Region'}, ${locationData.country || 'Unknown Country'}`;
    } else {
      console.log('Location API Error:', locationData.message);
    }

    // Parse device information from user-agent
    const userAgent = req.headers['user-agent'] || 'Unknown Device';
    const deviceInfo = parseUserAgent(userAgent);

    return {
      ipAddress: ipAddress,
      location: location,
      device: deviceInfo
    };
  } catch (error) {
    console.error('Error getting location:', error);
    const userAgent = req?.headers?.['user-agent'] || 'Unknown Device';
    const deviceInfo = parseUserAgent(userAgent);
    
    return {
      ipAddress: 'Unknown IP',
      location: 'Unknown Location',
      device: deviceInfo
    };
  }
};

// Email service functions
export const sendWelcomeEmail = async (userData) => {
  try {
    console.log('📧 Welcome Email - User Data:', userData);
    
    const transporter = createTransporter();
    
    const template = handlebars.compile(welcomeEmailTemplate);
    
    let fullName = 'User';
    
    if (userData.firstName && userData.lastName) {
      fullName = `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName) {
      fullName = userData.firstName;
    } else if (userData.lastName) {
      fullName = userData.lastName;
    }
    
    console.log('📧 Welcome Email - Name Logic:', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: fullName
    });
    
    const html = template({
      firstName: fullName,
      email: userData.email,
      appUrl: emailConfig.APP_URL
    });

    const mailOptions = {
      from: `"${emailConfig.FROM_NAME}" <${emailConfig.FROM_EMAIL}>`,
      to: userData.email,
      subject: '🌟 Welcome to FIT-TRACK - Your Health Journey Starts Now!',
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
};

export const sendLoginNotification = async (userData, loginInfo) => {
  try {
    console.log('📧 Login Notification - User Data:', userData);
    console.log('📧 Login Notification - Login Info:', loginInfo);
    
    const transporter = createTransporter();
    
    const template = handlebars.compile(loginEmailTemplate);
    
    let fullName = 'User';
    
    if (userData.firstName && userData.lastName) {
      fullName = `${userData.firstName} ${userData.lastName}`;
    } else if (userData.firstName) {
      fullName = userData.firstName;
    } else if (userData.lastName) {
      fullName = userData.lastName;
    }
    
    console.log('📧 Login Notification - Name Logic:', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      fullName: fullName
    });
    
    const html = template({
      firstName: fullName,
      email: userData.email,
      loginTime: new Date().toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
      }),
      deviceInfo: loginInfo.device || 'Unknown Device',
      location: loginInfo.location || 'Unknown Location',
      ipAddress: loginInfo.ipAddress || 'Unknown IP',
      appUrl: emailConfig.APP_URL
    });

    const mailOptions = {
      from: `"${emailConfig.FROM_NAME} Security" <${emailConfig.FROM_EMAIL}>`,
      to: userData.email,
      subject: '🔐 Login Notification - FIT-TRACK Account Accessed',
      html: html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Login notification sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending login notification:', error);
    return { success: false, error: error.message };
  }
};

export { getUserLocationAndIP };

export default {
  sendWelcomeEmail,
  sendLoginNotification,
  getUserLocationAndIP
};
