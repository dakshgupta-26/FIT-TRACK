/**
 * FitTrack - Transactional Email Templates
 * Password Reset
 */

export const getPasswordResetTemplate = ({ userName, resetUrl, appUrl, year = new Date().getFullYear() }) => {
  const name = userName || 'Member';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your FitTrack Password</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 50px rgba(244, 63, 94, 0.25); }
    .header { background: linear-gradient(135deg, #240a15 0%, #12060c 100%); padding: 36px 30px 24px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .brand-title { font-size: 24px; font-weight: 900; color: #ffffff; margin: 0 0 4px 0; }
    .badge { display: inline-block; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; margin-top: 8px; }
    .content-body { padding: 36px 32px; text-align: center; }
    .headline { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0 0 14px 0; }
    .description { font-size: 15px; color: #cbd5e1; line-height: 1.6; margin: 0 0 20px 0; }
    .btn-reset { display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-size: 15px; font-weight: 800; padding: 15px 36px; border-radius: 12px; text-decoration: none; box-shadow: 0 0 30px rgba(244, 63, 94, 0.4); margin: 20px 0; }
    .expiry { margin-top: 14px; font-size: 13px; color: #64748b; }
    .expiry-val { color: #fb7185; font-weight: 700; }
    .fallback-box { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 14px; margin: 24px 0; word-break: break-all; text-align: left; }
    .fallback-label { font-size: 11px; color: #64748b; margin-bottom: 6px; font-weight: 600; text-transform: uppercase; }
    .fallback-url { font-size: 11px; color: #38bdf8; text-decoration: none; font-family: monospace; }
    .security-notice { background: rgba(30, 41, 59, 0.6); border-left: 3px solid #64748b; padding: 14px; border-radius: 8px; font-size: 12px; color: #94a3b8; text-align: left; margin-top: 24px; line-height: 1.5; }
    .footer { background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569; }
    .footer-links { margin-bottom: 8px; }
    .footer-links a { color: #2dd4bf; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <div class="brand-title">FitTrack</div>
        <span class="badge">🔑 PASSWORD RECOVERY</span>
      </div>

      <div class="content-body">
        <h2 class="headline">Reset Your FitTrack Password</h2>
        <p class="description">
          Hi <strong>${name}</strong>,<br>
          We received a password reset request for your <strong>FitTrack</strong> account. Click the button below to set a new password:
        </p>

        <a href="${resetUrl}" class="btn-reset">Reset Password Now →</a>

        <div class="expiry">
          ⏳ This single-use link expires in <span class="expiry-val">15 minutes</span>.
        </div>

        <div class="fallback-box">
          <div class="fallback-label">Or copy and paste this URL into your browser:</div>
          <a href="${resetUrl}" class="fallback-url">${resetUrl}</a>
        </div>

        <div class="security-notice">
          <strong>Note:</strong> If you did not request a password reset, please ignore this email. Your current password will remain unchanged and secure.
        </div>
      </div>

      <div class="footer">
        <div class="footer-links">
          <a href="${appUrl}">Website</a> • <a href="${appUrl}/support">Support</a>
        </div>
        <div>© ${year} FitTrack. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `FitTrack - Reset Your Password

Hi ${name},

We received a password reset request for your FitTrack account.
Click the single-use recovery link below to set a new password (valid for 15 minutes):

${resetUrl}

If you did not request this password reset, your password remains unchanged and secure.

Website: ${appUrl}
© ${year} FitTrack. All rights reserved.`;

  return { html, text };
};
