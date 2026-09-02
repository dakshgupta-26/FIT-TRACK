/**
 * FitTrack - Transactional Email Templates
 * Welcome Email
 */

export const getWelcomeTemplate = ({ userName, email, createdDate, appUrl, year = new Date().getFullYear() }) => {
  const name = userName || 'Member';
  const displayDate = createdDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🎉 Welcome to FitTrack</title>
  <style>
    body { margin: 0; padding: 0; background-color: #04060a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #f1f5f9; }
    .wrapper { width: 100%; background-color: #04060a; padding: 40px 10px; }
    .card { max-width: 600px; margin: 0 auto; background: #090d16; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 50px rgba(20, 184, 166, 0.2); }
    .hero-banner { background: linear-gradient(135deg, #091a27 0%, #042426 50%, #090d16 100%); padding: 40px 30px; text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
    .hero-badge { display: inline-block; background: rgba(45, 212, 191, 0.2); border: 1px solid rgba(45, 212, 191, 0.4); color: #2dd4bf; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-bottom: 16px; }
    .hero-title { font-size: 30px; font-weight: 900; color: #ffffff; margin: 0 0 10px 0; }
    .hero-tagline { color: #94a3b8; font-size: 14px; margin: 0; }
    .content-body { padding: 36px 32px; }
    .greeting { font-size: 16px; line-height: 1.6; color: #cbd5e1; margin: 0 0 24px 0; }
    .cta-container { text-align: center; margin: 32px 0 28px 0; }
    .btn-primary { display: inline-block; background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 100%); color: #04060a; font-size: 14px; font-weight: 800; padding: 14px 32px; border-radius: 12px; text-decoration: none; box-shadow: 0 0 25px rgba(45, 212, 191, 0.4); }
    .feature-grid { display: table; width: 100%; margin-top: 24px; border-collapse: separate; border-spacing: 10px; }
    .feature-cell { display: table-cell; width: 50%; background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 14px; padding: 16px; text-align: left; }
    .feature-title { font-size: 13px; font-weight: 700; color: #2dd4bf; margin-bottom: 4px; }
    .feature-desc { font-size: 12px; color: #94a3b8; line-height: 1.4; }
    .profile-card { background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(45, 212, 191, 0.25); border-radius: 16px; padding: 20px; margin-top: 24px; }
    .profile-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); font-size: 13px; }
    .footer { background: #060910; padding: 24px; text-align: center; font-size: 11px; color: #475569; }
    .footer-links { margin-bottom: 8px; }
    .footer-links a { color: #2dd4bf; text-decoration: none; margin: 0 8px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="hero-banner">
        <span class="hero-badge">✨ VERIFIED & ACTIVE ACCOUNT</span>
        <h1 class="hero-title">Welcome to FitTrack</h1>
        <p class="hero-tagline">AI-Powered Health & Fitness Intelligence</p>
      </div>

      <div class="content-body">
        <p class="greeting">
          Hello <strong>${name}</strong>,<br><br>
          Your email has been verified and your account is active. Explore your personalized dashboard and fitness telemetry below:
        </p>

        <div class="cta-container">
          <a href="${appUrl}/dashboard" class="btn-primary">Go To Dashboard →</a>
        </div>

        <div class="feature-grid">
          <div class="feature-cell">
            <div class="feature-title">⚡ AI Fitness Intelligence</div>
            <div class="feature-desc">Real-time workout telemetry, nutrition tracking, and analytics.</div>
          </div>
          <div class="feature-cell">
            <div class="feature-title">🔒 Enterprise Security</div>
            <div class="feature-desc">Continuous session monitoring and automated token isolation.</div>
          </div>
        </div>

        <div class="profile-card">
          <div style="font-weight: 800; font-size: 13px; color: #ffffff; margin-bottom: 8px;">Member Profile</div>
          <div class="profile-row"><span style="color: #64748b;">Member:</span> <span style="color: #2dd4bf; font-weight: 700;">${name}</span></div>
          <div class="profile-row"><span style="color: #64748b;">Email:</span> <span style="color: #2dd4bf; font-weight: 700;">${email}</span></div>
          <div class="profile-row" style="border-bottom: none;"><span style="color: #64748b;">Account Created:</span> <span style="color: #38bdf8; font-weight: 700;">${displayDate}</span></div>
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

  const text = `FitTrack - AI-Powered Health & Fitness Intelligence
🎉 Welcome to FitTrack!

Hello ${name},

Your email has been verified and your FitTrack account is now active.
Member Profile:
- Member: ${name}
- Email: ${email}
- Account Created: ${displayDate}

Go to your dashboard:
${appUrl}/dashboard

© ${year} FitTrack. All rights reserved.`;

  return { html, text };
};
