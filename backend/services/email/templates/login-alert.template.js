/**
 * FitTrack - Transactional Email Templates
 * Security Sign-in / Login Alert
 */

export const getLoginAlertTemplate = ({
  userName,
  email,
  isNewDevice,
  currentLoginTime,
  previousLoginTime,
  timezone,
  deviceString,
  browser,
  platform,
  deviceType,
  ip,
  locationString,
  mapsUrl,
  appUrl,
  year = new Date().getFullYear(),
}) => {
  const name = userName || 'Member';
  const badgeHtml = isNewDevice
    ? `<span class="badge-new">⚠️ NEW DEVICE DETECTED</span>`
    : `<span class="badge-trusted">✅ TRUSTED DEVICE SIGN-IN</span>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Alert: Sign-in Notification - FitTrack</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .card { max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 50px rgba(56, 189, 248, 0.2); }
    .header-banner { background: linear-gradient(135deg, #0d1e30 0%, #081726 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .badge-new { display: inline-block; background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.4); color: #fb7185; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 12px; }
    .badge-trusted { display: inline-block; background: rgba(45, 212, 191, 0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; letter-spacing: 0.5px; margin-bottom: 12px; }
    .title { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; }
    .content-body { padding: 32px 28px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; overflow: hidden; }
    .info-table td { padding: 12px 18px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; }
    .label { color: #64748b; font-weight: 600; width: 38%; }
    .val { color: #f1f5f9; font-weight: 700; }
    .btn-maps { display: inline-block; background: rgba(56, 189, 248, 0.15); border: 1px solid rgba(56, 189, 248, 0.4); color: #38bdf8; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 8px; text-decoration: none; margin-top: 4px; }
    .cta-bar { margin-top: 28px; text-align: center; }
    .btn-danger { display: inline-block; background: linear-gradient(135deg, #f43f5e 0%, #e11d48 100%); color: #ffffff; font-size: 13px; font-weight: 800; padding: 12px 24px; border-radius: 10px; text-decoration: none; margin-right: 8px; box-shadow: 0 0 20px rgba(244,63,94,0.3); }
    .footer { background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569; }
    .footer-links { margin-bottom: 8px; }
    .footer-links a { color: #2dd4bf; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header-banner">
        ${badgeHtml}
        <h1 class="title">Security Alert: Sign-in Notification</h1>
      </div>

      <div class="content-body">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5; margin: 0 0 20px 0;">
          Hi <strong>${name}</strong>,<br>
          We detected a successful sign-in to your <strong>FitTrack</strong> account (<code>${email}</code>).
        </p>

        <table class="info-table">
          <tr><td class="label">Date & Time:</td><td class="val">${currentLoginTime} (${timezone || 'UTC'})</td></tr>
          <tr><td class="label">Previous Sign-in:</td><td class="val" style="color: #94a3b8;">${previousLoginTime || 'First Sign-in on Account'}</td></tr>
          <tr><td class="label">Device & OS:</td><td class="val">${deviceString || 'Unknown'}</td></tr>
          <tr><td class="label">Browser:</td><td class="val">${browser || 'Unknown'}</td></tr>
          <tr><td class="label">Platform:</td><td class="val" style="color: #2dd4bf;">${platform || 'Web'} (${deviceType || 'Desktop'})</td></tr>
          <tr><td class="label">IP Address:</td><td class="val" style="font-family: monospace;">${ip || '127.0.0.1'}</td></tr>
          <tr><td class="label">Approx. Location:</td><td class="val">${locationString || 'Unknown'}</td></tr>
          ${mapsUrl ? `<tr><td class="label">Map Telemetry:</td><td class="val"><a href="${mapsUrl}" target="_blank" class="btn-maps">📍 View on Google Maps →</a></td></tr>` : ''}
        </table>

        <div style="background: rgba(30, 41, 59, 0.6); border-left: 3px solid #f43f5e; padding: 14px; border-radius: 8px; font-size: 13px; color: #94a3b8; line-height: 1.5;">
          <strong>Didn't sign in?</strong> Your account password may have been compromised. Click below immediately to lock sessions and reset your password.
        </div>

        <div class="cta-bar">
          <a href="${appUrl}/forgot-password" class="btn-danger">🔒 Secure Your Account</a>
        </div>
      </div>

      <div class="footer">
        <div class="footer-links">
          <a href="${appUrl}">Website</a> • <a href="${appUrl}/support">Support</a>
        </div>
        <div>© ${year} FitTrack Security Infrastructure. All rights reserved.</div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const text = `FitTrack - Security Alert: Sign-in Notification

Hi ${name},

We detected a successful sign-in to your FitTrack account (${email}).
Event Telemetry:
- Date & Time: ${currentLoginTime} (${timezone || 'UTC'})
- Device: ${deviceString || 'Unknown'}
- Browser: ${browser || 'Unknown'}
- IP Address: ${ip || '127.0.0.1'}
- Location: ${locationString || 'Unknown'}

If you did not sign in, please secure your account immediately:
${appUrl}/forgot-password

© ${year} FitTrack. All rights reserved.`;

  return { html, text };
};
