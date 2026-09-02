/**
 * FitTrack - Transactional Email Templates
 * Email Verification (OTP)
 */

export const getVerificationOtpTemplate = ({ otp, firstName, appUrl, year = new Date().getFullYear() }) => {
  const name = firstName || 'Athlete';
  const formattedOtp = otp.toString().split('').join(' ');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your FitTrack Account</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 12px; }
    .card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 40px rgba(20, 184, 166, 0.15); }
    .header { background: linear-gradient(135deg, #0d1527 0%, #061e27 100%); padding: 36px 30px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .brand-title { font-size: 26px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; margin: 0 0 4px 0; }
    .brand-accent { color: #2dd4bf; }
    .brand-tagline { font-size: 11px; color: #94a3b8; letter-spacing: 0.8px; text-transform: uppercase; margin-top: 4px; font-weight: 600; }
    .badge { display: inline-flex; align-items: center; background: rgba(20, 184, 166, 0.15); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 4px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-top: 14px; }
    .content-body { padding: 36px 32px; text-align: center; }
    .headline { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 14px 0; }
    .description { font-size: 15px; line-height: 1.6; color: #94a3b8; margin: 0 0 28px 0; }
    .otp-box { margin: 28px 0; padding: 24px 16px; background: linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(6, 182, 212, 0.08) 100%); border: 1px solid rgba(45, 212, 191, 0.35); border-radius: 20px; box-shadow: 0 0 30px rgba(45, 212, 191, 0.2); }
    .otp-digits { font-family: 'Courier New', Courier, monospace; font-size: 40px; font-weight: 900; letter-spacing: 12px; color: #2dd4bf; text-shadow: 0 0 20px rgba(45, 212, 191, 0.6); margin: 0; }
    .expiry { margin-top: 14px; font-size: 13px; color: #64748b; font-weight: 600; }
    .expiry-val { color: #38bdf8; font-weight: 700; }
    .security-notice { background: rgba(30, 41, 59, 0.6); border-left: 3px solid #2dd4bf; border-radius: 8px; padding: 14px 18px; margin: 28px 0 10px 0; text-align: left; font-size: 13px; color: #94a3b8; line-height: 1.5; }
    .footer { background: #060910; padding: 28px 30px; text-align: center; border-top: 1px solid rgba(255, 255, 255, 0.06); }
    .footer-title { font-size: 14px; font-weight: 700; color: #cbd5e1; margin-bottom: 4px; }
    .footer-links a { color: #2dd4bf; text-decoration: none; font-size: 12px; margin: 0 10px; }
    .footer-copy { margin-top: 14px; font-size: 11px; color: #475569; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <h1 class="brand-title">FitTrack <span class="brand-accent">AI</span></h1>
        <div class="brand-tagline">AI-Powered Health & Fitness Intelligence</div>
        <span class="badge">⚡ Verification Security</span>
      </div>
      <div class="content-body">
        <h2 class="headline">Verify Your Email Address</h2>
        <p class="description">
          Welcome to <strong>FitTrack</strong>, <strong>${name}</strong>.<br>
          Before activating your fitness dashboard, please verify your email address with this single-use 6-digit OTP code:
        </p>
        <div class="otp-box">
          <div class="otp-digits">${formattedOtp}</div>
          <div class="expiry">Valid for <span class="expiry-val">5 minutes</span></div>
        </div>
        <div class="security-notice">
          <strong>🛡️ Security Note:</strong> If you did not request this verification code, please disregard this email. Account creation requires verification.
        </div>
      </div>
      <div class="footer">
        <div class="footer-title">FitTrack AI</div>
        <div class="footer-links">
          <a href="${appUrl}">Website</a> • <a href="${appUrl}/support">Support</a>
        </div>
        <div class="footer-copy">© ${year} FitTrack. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `FitTrack AI - AI-Powered Health & Fitness Intelligence
Email Verification

Hi ${name},

Welcome to FitTrack. Before activating your fitness dashboard, please verify your email with the single-use 6-digit OTP code below:

VERIFICATION CODE: ${otp}
(Valid for 5 minutes)

Security Note: If you did not request this verification code, you can safely ignore this email.

Website: ${appUrl}
© ${year} FitTrack. All rights reserved.`;

  return { html, text };
};
