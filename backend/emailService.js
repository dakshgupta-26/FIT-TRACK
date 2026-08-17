import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import { emailConfig } from './email-config.js';

// Transporter with environment variable support & fallback
const createTransporter = () => {
  const user = (process.env.SMTP_EMAIL || process.env.SMTP_USER || process.env.FROM_EMAIL || emailConfig.SMTP_EMAIL || '').trim();
  const pass = (process.env.SMTP_PASSWORD || process.env.SMTP_PASS || emailConfig.SMTP_PASSWORD || '').trim();
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: host,
    port: port,
    secure: port === 465,
    auth: { user, pass },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
  });
};

/**
 * Perform Startup SMTP Verification Check
 */
export const verifySmtpConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log("✅ FIT TRACK Nodemailer SMTP Transporter connected & verified!");
    return true;
  } catch (error) {
    console.warn("⚠️ FIT TRACK SMTP Transporter verification notice:", error.message);
    return false;
  }
};

const getSenderHeader = () => {
  const fromName = process.env.FROM_NAME || process.env.SMTP_FROM_NAME || 'FIT TRACK';
  const senderEmail = (process.env.FROM_EMAIL || process.env.SMTP_EMAIL || process.env.SMTP_USER || emailConfig.FROM_EMAIL || 'finplan26@gmail.com').trim();
  return `"${fromName}" <${senderEmail}>`;
};

// ============================================================================
// TEMPLATE 1: OTP VERIFICATION EMAIL (Dark Glassmorphism Luxury Theme)
// ============================================================================
const otpEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your FitTracker AI account</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .main-card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(20, 184, 166, 0.15); }
    .header-banner { background: linear-gradient(135deg, #0d1527 0%, #061e27 100%); padding: 36px 30px 24px 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .logo-badge { display: inline-flex; align-items: center; background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }
    .content-body { padding: 36px 32px; text-align: center; }
    .headline { font-size: 26px; font-weight: 800; color: #ffffff; margin: 0 0 14px 0; }
    .description { font-size: 15px; line-height: 1.6; color: #94a3b8; margin: 0 0 28px 0; }
    .otp-box-wrapper { margin: 28px 0; padding: 24px 16px; background: linear-gradient(180deg, rgba(15, 23, 42, 0.9) 0%, rgba(6, 182, 212, 0.08) 100%); border: 1px solid rgba(45, 212, 191, 0.35); border-radius: 20px; box-shadow: 0 0 30px rgba(45, 212, 191, 0.2); }
    .otp-code { font-family: 'Courier New', Courier, monospace; font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #2dd4bf; text-shadow: 0 0 20px rgba(45, 212, 191, 0.6); margin: 0; }
    .expiry-text { margin-top: 14px; font-size: 13px; color: #64748b; font-weight: 600; }
    .security-notice { background: rgba(30, 41, 59, 0.6); border-left: 3px solid #2dd4bf; border-radius: 8px; padding: 14px 18px; margin: 28px 0 10px 0; text-align: left; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .footer { background: #060910; padding: 28px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); }
    .footer-links a { color: #2dd4bf; text-decoration: none; font-size: 12px; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header-banner">
        <div style="font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin-bottom: 12px;">FIT TRACK <span style="color: #2dd4bf;">AI</span></div>
        <div><span class="logo-badge">⚡ Verification Security</span></div>
      </div>
      <div class="content-body">
        <h1 class="headline">Verify Your Email Address</h1>
        <p class="description">Welcome to <strong>FitTracker AI</strong>.<br>Before creating your account, please verify your email with this single-use 6-digit OTP code.</p>
        <div class="otp-box-wrapper">
          <div class="otp-code">{{otp}}</div>
          <div class="expiry-text">Valid for <span style="color: #38bdf8; font-weight: 700;">5 minutes</span></div>
        </div>
        <div class="security-notice">
          <strong>🛡️ Security Note:</strong> If you did not request this verification code, please disregard this message. Account creation requires verification.
        </div>
      </div>
      <div class="footer">
        <div style="font-size: 14px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px;">FIT TRACK AI</div>
        <div class="footer-links"><a href="{{appUrl}}">Website</a> • <a href="{{appUrl}}/support">Support</a></div>
        <div style="margin-top: 14px; font-size: 11px; color: #475569;">© {{year}} FIT TRACK AI. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// TEMPLATE 2: WELCOME EMAIL
// ============================================================================
const welcomeEmailTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎉 Welcome to FIT TRACK AI</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .main-card { max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 50px rgba(20, 184, 166, 0.2); }
    .hero-banner { background: linear-gradient(135deg, #091a27 0%, #042426 50%, #090d16 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .hero-badge { display: inline-block; background: rgba(45,212,191,0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
    .hero-title { font-size: 30px; font-weight: 900; color: #ffffff; margin: 0 0 10px 0; }
    .content-body { padding: 36px 32px; }
    .cta-container { text-align: center; margin: 32px 0 28px 0; }
    .btn-primary { display: inline-block; background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%); color: #04060a; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 0 25px rgba(45, 212, 191, 0.4); }
    .feature-grid { display: table; width: 100%; margin-top: 24px; border-collapse: separate; border-spacing: 10px; }
    .feature-cell { display: table-cell; width: 50%; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px; text-align: left; }
    .feature-title { font-size: 13px; font-weight: 700; color: #2dd4bf; margin-bottom: 4px; }
    .feature-desc { font-size: 12px; color: #94a3b8; line-height: 1.4; }
    .profile-card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(45, 212, 191, 0.25); border-radius: 16px; padding: 20px; margin-top: 24px; }
    .profile-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="hero-banner">
        <span class="hero-badge">✨ VERIFIED & ACTIVE ACCOUNT</span>
        <h1 class="hero-title">Welcome to FIT TRACK AI</h1>
        <p style="color: #94a3b8; font-size: 15px; margin: 0;">Your Next-Gen AI Health Operating System</p>
      </div>

      <div class="content-body">
        <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1;">
          Hello <strong>{{userName}}</strong>,<br><br>
          Your email has been verified and your account is active. Explore your personalized dashboard and smart biometric telemetry below.
        </p>

        <div class="cta-container">
          <a href="{{appUrl}}/dashboard" class="btn-primary">Go To Dashboard →</a>
        </div>

        <div class="feature-grid">
          <div class="feature-cell">
            <div class="feature-title">🤖 AI Health Coach</div>
            <div class="feature-desc">Real-time workout optimization & recovery insights.</div>
          </div>
          <div class="feature-cell">
            <div class="feature-title">🥗 Smart Meal AI</div>
            <div class="feature-desc">Instant photo macro recognition and nutrition tracking.</div>
          </div>
        </div>

        <div class="profile-card">
          <div style="font-weight: 800; font-size: 13px; color: #ffffff; margin-bottom: 8px;">Member Credentials</div>
          <div class="profile-row"><span style="color: #64748b;">Member:</span> <span style="color: #2dd4bf; font-weight: 700;">{{userName}}</span></div>
          <div class="profile-row"><span style="color: #64748b;">Email:</span> <span style="color: #2dd4bf; font-weight: 700;">{{email}}</span></div>
          <div class="profile-row"><span style="color: #64748b;">Account Created:</span> <span style="color: #38bdf8; font-weight: 700;">{{createdDate}}</span></div>
        </div>
      </div>
      <div style="background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569;">
        © {{year}} FIT TRACK AI. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// TEMPLATE 3: LOGIN ALERT EMAIL (Comprehensive Geolocation & Security Audit)
// ============================================================================
const loginAlertTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert: New Sign-in to FIT TRACK AI</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .main-card { max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 50px rgba(56, 189, 248, 0.2); }
    .header-banner { background: linear-gradient(135deg, #0d1e30 0%, #081726 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .badge-new { display: inline-block; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 12px; }
    .badge-trusted { display: inline-block; background: rgba(45, 212, 191, 0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 12px; }
    .title { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; }
    .content-body { padding: 32px 28px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; }
    .info-table td { padding: 12px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; }
    .info-table tr:last-child td { border-bottom: none; }
    .label { color: #64748b; font-weight: 600; width: 38%; }
    .val { color: #f1f5f9; font-weight: 700; }
    .btn-maps { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 8px; text-decoration: none; margin-top: 4px; }
    .cta-bar { margin-top: 28px; text-align: center; }
    .btn-danger { display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-size: 13px; font-weight: 800; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-right: 8px; box-shadow: 0 0 20px rgba(244,63,94,0.3); }
    .btn-secondary { display: inline-block; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); color: #ffffff; font-size: 13px; font-weight: 700; padding: 12px 20px; border-radius: 10px; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header-banner">
        {{#if isNewDevice}}
          <span class="badge-new">⚠️ NEW DEVICE DETECTED</span>
        {{else}}
          <span class="badge-trusted">✅ TRUSTED DEVICE SIGN-IN</span>
        {{/if}}
        <h1 class="title">Security Alert: Sign-in Notification</h1>
      </div>

      <div class="content-body">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5; margin: 0 0 20px 0;">
          Hi <strong>{{userName}}</strong>,<br>
          We detected a successful sign-in to your <strong>FIT TRACK AI</strong> account (<code>{{email}}</code>).
        </p>

        <table class="info-table">
          <tr><td class="label">Date & Time:</td><td class="val">{{currentLoginTime}} ({{timezone}})</td></tr>
          <tr><td class="label">Previous Sign-in:</td><td class="val" style="color: #94a3b8;">{{previousLoginTime}}</td></tr>
          <tr><td class="label">Device & OS:</td><td class="val">{{deviceString}}</td></tr>
          <tr><td class="label">Browser:</td><td class="val">{{browser}}</td></tr>
          <tr><td class="label">Platform:</td><td class="val" style="color: #2dd4bf;">{{platform}} ({{deviceType}})</td></tr>
          <tr><td class="label">IP Address:</td><td class="val" style="font-family: monospace;">{{ip}}</td></tr>
          <tr><td class="label">Approx. Location:</td><td class="val">{{locationString}}</td></tr>
          <tr>
            <td class="label">Map Telemetry:</td>
            <td class="val">
              <a href="{{mapsUrl}}" target="_blank" class="btn-maps">📍 View on Google Maps →</a>
            </td>
          </tr>
        </table>

        <div style="background: rgba(30, 41, 59, 0.6); border-left: 3px solid #f43f5e; padding: 14px; border-radius: 8px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
          <strong>Didn't sign in?</strong> Your account password may have been compromised. Click below immediately to lock sessions and reset your password.
        </div>

        <div class="cta-bar">
          <a href="{{appUrl}}/forgot-password" class="btn-danger">🔒 Secure Your Account</a>
          <a href="{{appUrl}}/forgot-password" class="btn-secondary">Reset Password</a>
        </div>
      </div>

      <div style="background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569;">
        © {{year}} FIT TRACK AI Security Infrastructure. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// TEMPLATE 4: PASSWORD RESET EMAIL (15-Minute Token Expiry)
// ============================================================================
const passwordResetTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your FIT TRACK AI Password</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .main-card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 50px rgba(244, 63, 94, 0.25); }
    .header-banner { background: linear-gradient(135deg, #240a15 0%, #12060c 100%); padding: 36px 30px 24px 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .badge { display: inline-block; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; margin-bottom: 12px; }
    .content-body { padding: 36px 32px; text-align: center; }
    .btn-reset { display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-size: 15px; font-weight: 800; padding: 15px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 0 30px rgba(244, 63, 94, 0.4); margin: 24px 0; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header-banner">
        <span class="badge">🔑 PASSWORD RECOVERY</span>
        <h1 style="font-size: 26px; font-weight: 800; color: #ffffff; margin: 0;">Reset Your Password</h1>
      </div>

      <div class="content-body">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0;">
          Hi <strong>{{userName}}</strong>,<br>
          We received a password reset request for your <strong>FIT TRACK AI</strong> account. Click the button below to set a new password:
        </p>

        <a href="{{resetUrl}}" class="btn-reset">Reset Password Now →</a>

        <div style="margin-top: 20px; font-size: 13px; color: #64748b;">
          ⏳ This single-use link expires in <strong style="color: #fb7185;">15 minutes</strong>.
        </div>

        <div style="background: rgba(30, 41, 59, 0.6); border-left: 3px solid #64748b; padding: 14px; border-radius: 8px; font-size: 12px; color: #94a3b8; text-align: left; margin-top: 28px; line-height: 1.5;">
          <strong>Note:</strong> If you did not request a password reset, please ignore this email. Your current password will remain unchanged and secure.
        </div>
      </div>

      <div style="background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569;">
        © {{year}} FIT TRACK AI. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// TEMPLATE 5: PASSWORD CHANGED NOTIFICATION EMAIL
// ============================================================================
const passwordChangedTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Notice: FIT TRACK AI Password Changed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .main-card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(45, 212, 191, 0.2); }
    .header-banner { background: linear-gradient(135deg, #0d2720 0%, #061713 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .badge { display: inline-block; background: rgba(45, 212, 191, 0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; margin-bottom: 12px; }
    .content-body { padding: 32px 28px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(15, 23, 42, 0.8); border-radius: 12px; overflow: hidden; }
    .table td { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="main-card">
      <div class="header-banner">
        <span class="badge">🔒 SECURITY NOTICE</span>
        <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; margin: 0;">Password Successfully Changed</h1>
      </div>
      <div class="content-body">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5;">
          Hi <strong>{{userName}}</strong>,<br>
          The password for your <strong>FIT TRACK AI</strong> account was recently changed.
        </p>
        <table class="table">
          <tr><td style="color: #64748b;">Date & Time:</td><td style="color: #ffffff; font-weight: 700;">{{changeTime}}</td></tr>
          <tr><td style="color: #64748b;">Device:</td><td style="color: #2dd4bf; font-weight: 700;">{{deviceString}}</td></tr>
          <tr><td style="color: #64748b;">IP Address:</td><td style="font-family: monospace; color: #ffffff;">{{ip}}</td></tr>
          <tr><td style="color: #64748b;">Location:</td><td style="color: #ffffff;">{{locationString}}</td></tr>
        </table>
        <div style="background: rgba(244, 63, 94, 0.1); border-left: 3px solid #f43f5e; padding: 14px; border-radius: 8px; font-size: 13px; color: #fb7185; margin-top: 20px;">
          <strong>If you did not make this change:</strong> Please <a href="{{appUrl}}/forgot-password" style="color: #ffffff; text-decoration: underline;">reset your password immediately</a> to secure your account.
        </div>
      </div>
      <div style="background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569;">
        © {{year}} FIT TRACK AI. All rights reserved.
      </div>
    </div>
  </div>
</body>
</html>
`;

// ============================================================================
// EMAIL DISPATCHERS
// ============================================================================

export const sendOtpEmail = async (email, firstName, otp) => {
  try {
    console.log(`📧 FIT TRACK: Dispatching OTP Email to ${email}...`);
    const transporter = createTransporter();
    const template = handlebars.compile(otpEmailTemplate);

    const html = template({
      otp: otp.toString().split('').join(' '),
      appUrl: emailConfig.APP_URL,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: getSenderHeader(),
      to: email,
      subject: 'Verify your FitTracker AI account',
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ FIT TRACK: OTP Email delivered:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ FIT TRACK: Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
};

export const sendWelcomeEmail = async (userData) => {
  try {
    console.log('📧 FIT TRACK: Dispatching Welcome Email to:', userData.email);
    const transporter = createTransporter();
    const template = handlebars.compile(welcomeEmailTemplate);

    const userName = userData.firstName || 'Member';
    const createdDate = new Date(userData.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    const html = template({
      userName: userName,
      email: userData.email,
      createdDate: createdDate,
      appUrl: emailConfig.APP_URL,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: getSenderHeader(),
      to: userData.email,
      subject: '🎉 Welcome to FIT TRACK AI',
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ FIT TRACK: Welcome Email delivered:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ FIT TRACK: Error sending Welcome email:', error);
    return { success: false, error: error.message };
  }
};

export const sendLoginAlertEmail = async ({ user, loginDetails }) => {
  try {
    console.log('📧 FIT TRACK: Dispatching Security Login Alert Email to:', user.email);
    const transporter = createTransporter();
    const template = handlebars.compile(loginAlertTemplate);

    const userName = user.firstName || 'Member';
    const now = new Date();

    const formattedTime = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    const prevLogin = user.previousLoginAt
      ? new Date(user.previousLoginAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'First Sign-in on Account';

    const html = template({
      userName: userName,
      email: user.email,
      isNewDevice: loginDetails.isNewDevice,
      currentLoginTime: formattedTime,
      previousLoginTime: prevLogin,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      deviceString: loginDetails.deviceString,
      browser: loginDetails.browser,
      platform: loginDetails.platform,
      deviceType: loginDetails.isMobile ? 'Mobile' : loginDetails.isTablet ? 'Tablet' : 'Desktop',
      ip: loginDetails.ip,
      locationString: loginDetails.locationString,
      mapsUrl: loginDetails.mapsUrl,
      appUrl: emailConfig.APP_URL,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: getSenderHeader(),
      to: user.email,
      subject: loginDetails.isNewDevice ? '⚠️ Security Alert: New Device Sign-in to FIT TRACK AI' : 'Security Alert: Sign-in Notification - FIT TRACK AI',
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ FIT TRACK: Login Alert Email delivered:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ FIT TRACK: Error sending Login Alert email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, firstName, rawToken) => {
  try {
    console.log(`📧 FIT TRACK: Dispatching Password Reset Email to ${email}...`);
    const transporter = createTransporter();
    const template = handlebars.compile(passwordResetTemplate);

    const resetUrl = `${emailConfig.APP_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

    const html = template({
      userName: firstName || 'Member',
      resetUrl: resetUrl,
      appUrl: emailConfig.APP_URL,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: getSenderHeader(),
      to: email,
      subject: '🔑 Reset Your FIT TRACK AI Password',
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ FIT TRACK: Password Reset Email delivered:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ FIT TRACK: Error sending Password Reset email:', error);
    return { success: false, error: error.message };
  }
};

export const sendPasswordChangedEmail = async (user, loginDetails) => {
  try {
    console.log(`📧 FIT TRACK: Dispatching Password Changed Notification Email to ${user.email}...`);
    const transporter = createTransporter();
    const template = handlebars.compile(passwordChangedTemplate);

    const formattedTime = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const html = template({
      userName: user.firstName || 'Member',
      changeTime: formattedTime,
      deviceString: loginDetails?.deviceString || 'Web Browser',
      ip: loginDetails?.ip || '127.0.0.1',
      locationString: loginDetails?.locationString || 'Local Workstation',
      appUrl: emailConfig.APP_URL,
      year: new Date().getFullYear(),
    });

    const mailOptions = {
      from: getSenderHeader(),
      to: user.email,
      subject: '🔒 Security Notice: FIT TRACK AI Password Changed',
      html: html,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ FIT TRACK: Password Changed Email delivered:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ FIT TRACK: Error sending Password Changed email:', error);
    return { success: false, error: error.message };
  }
};

export default {
  verifySmtpConnection,
  sendOtpEmail,
  sendWelcomeEmail,
  sendLoginAlertEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
};
