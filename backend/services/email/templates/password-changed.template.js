/**
 * FitTrack - Transactional Email Templates
 * Password Changed Notification
 */

export const getPasswordChangedTemplate = ({ userName, changeTime, deviceString, ip, locationString, appUrl, year = new Date().getFullYear() }) => {
  const name = userName || 'Member';
  const timeStr = changeTime || new Date().toLocaleString('en-US');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Notice: FitTrack Password Changed</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .card { max-width: 580px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.8), 0 0 40px rgba(45, 212, 191, 0.2); }
    .header { background: linear-gradient(135deg, #0d2720 0%, #061713 100%); padding: 32px 28px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .badge { display: inline-block; background: rgba(45, 212, 191, 0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 5px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; margin-bottom: 8px; }
    .headline { font-size: 24px; font-weight: 800; color: #ffffff; margin: 0; }
    .content-body { padding: 32px 28px; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; background: rgba(15, 23, 42, 0.8); border-radius: 12px; overflow: hidden; }
    .table td { padding: 12px 16px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 13px; }
    .label { color: #64748b; width: 35%; }
    .val { color: #ffffff; font-weight: 700; }
    .alert-box { background: rgba(244, 63, 94, 0.1); border-left: 3px solid #f43f5e; padding: 14px; border-radius: 8px; font-size: 13px; color: #fb7185; margin-top: 20px; line-height: 1.5; }
    .footer { background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569; }
    .footer-links { margin-bottom: 8px; }
    .footer-links a { color: #2dd4bf; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="header">
        <span class="badge">🔒 SECURITY NOTICE</span>
        <h1 class="headline">Password Successfully Changed</h1>
      </div>
      <div class="content-body">
        <p style="font-size: 15px; color: #cbd5e1; line-height: 1.5; margin: 0 0 16px 0;">
          Hi <strong>${name}</strong>,<br>
          The password for your <strong>FitTrack</strong> account was recently changed. Below are the details:
        </p>
        <table class="table">
          <tr><td class="label">Date & Time:</td><td class="val">${timeStr}</td></tr>
          <tr><td class="label">Device:</td><td class="val" style="color: #2dd4bf;">${deviceString || 'Web Browser'}</td></tr>
          <tr><td class="label">IP Address:</td><td class="val" style="font-family: monospace;">${ip || '127.0.0.1'}</td></tr>
          <tr><td class="label">Location:</td><td class="val">${locationString || 'Local Workstation'}</td></tr>
        </table>
        <div class="alert-box">
          <strong>If you did not make this change:</strong> Please <a href="${appUrl}/forgot-password" style="color: #ffffff; text-decoration: underline; font-weight: 700;">reset your password immediately</a> to secure your account.
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

  const text = `FitTrack - Security Notice: Password Changed

Hi ${name},

The password for your FitTrack account was recently changed.
Event Telemetry:
- Date & Time: ${timeStr}
- Device: ${deviceString || 'Web Browser'}
- IP Address: ${ip || '127.0.0.1'}
- Location: ${locationString || 'Local Workstation'}

If you did not make this change, please reset your password immediately:
${appUrl}/forgot-password

© ${year} FitTrack. All rights reserved.`;

  return { html, text };
};
