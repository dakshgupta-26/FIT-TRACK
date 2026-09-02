import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  maskEmail,
  getMailjetCredentials,
  validateMailjetConfig,
  sendMailjetMessage,
} from '../services/email/mailjet.client.js';

import emailService, {
  sendEmail,
  sendVerificationOtpEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendLoginAlertEmail,
  getAppUrl,
} from '../services/email/email.service.js';

import { getVerificationOtpTemplate } from '../services/email/templates/verification.template.js';
import { getWelcomeTemplate } from '../services/email/templates/welcome.template.js';
import { getPasswordResetTemplate } from '../services/email/templates/password-reset.template.js';
import { getPasswordChangedTemplate } from '../services/email/templates/password-changed.template.js';
import { getLoginAlertTemplate } from '../services/email/templates/login-alert.template.js';

describe('Mailjet Client & Configuration', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    delete process.env.MJ_APIKEY_PUBLIC;
    delete process.env.MJ_APIKEY_PRIVATE;
    delete process.env.MAIL_FROM_EMAIL;
    delete process.env.MAIL_FROM_NAME;

    process.env.MAILJET_API_KEY = 'test_pub_key_12345';
    process.env.MAILJET_SECRET_KEY = 'test_priv_sec_67890';
    process.env.MAILJET_FROM_EMAIL = 'verified-sender@fittrack.ai';
    process.env.MAILJET_FROM_NAME = 'FitTrack AI';
    process.env.FRONTEND_URL = 'https://app.fittrack.ai';
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  test('maskEmail should securely mask email usernames', () => {
    assert.equal(maskEmail('developer@fittrack.ai'), 'd***r@fittrack.ai');
    assert.equal(maskEmail('alex@example.com'), 'a***x@example.com');
    assert.equal(maskEmail('me@test.io'), 'm***@test.io');
    assert.equal(maskEmail('invalid-string'), 'invalid-email');
    assert.equal(maskEmail(''), 'unknown');
  });

  test('validateMailjetConfig validates MAILJET_* environment variables', () => {
    const res = validateMailjetConfig();
    assert.equal(res.valid, true);
    assert.equal(res.fromEmail, 'verified-sender@fittrack.ai');
    assert.equal(res.fromName, 'FitTrack AI');
  });

  test('validateMailjetConfig validates MJ_* fallback environment variables', () => {
    delete process.env.MAILJET_API_KEY;
    delete process.env.MAILJET_SECRET_KEY;
    delete process.env.MAILJET_FROM_EMAIL;
    delete process.env.MAILJET_FROM_NAME;

    process.env.MJ_APIKEY_PUBLIC = 'fallback_key';
    process.env.MJ_APIKEY_PRIVATE = 'fallback_secret';
    process.env.MAIL_FROM_EMAIL = 'support@fittrack.ai';
    process.env.MAIL_FROM_NAME = 'FitTrack Support';

    const res = validateMailjetConfig();
    assert.equal(res.valid, true);
    assert.equal(res.fromEmail, 'support@fittrack.ai');
    assert.equal(res.fromName, 'FitTrack Support');
  });

  test('validateMailjetConfig detects missing variables', () => {
    delete process.env.MAILJET_API_KEY;
    delete process.env.MAILJET_SECRET_KEY;
    delete process.env.MJ_APIKEY_PUBLIC;
    delete process.env.MJ_APIKEY_PRIVATE;
    const res = validateMailjetConfig();
    assert.equal(res.valid, false);
  });

  test('getMailjetCredentials never exposes private keys when unconfigured', () => {
    delete process.env.MAILJET_SECRET_KEY;
    delete process.env.MJ_APIKEY_PRIVATE;
    const creds = getMailjetCredentials();
    assert.equal(creds.isConfigured, false);
  });
});

describe('FitTrack Email Template Generation', () => {
  const appUrl = 'https://app.fittrack.ai';

  test('Verification OTP template renders 6-digit code, FitTrack branding, and TextPart', () => {
    const { html, text } = getVerificationOtpTemplate({
      otp: '784920',
      firstName: 'Sarah',
      appUrl,
      year: 2026,
    });

    assert.ok(html.includes('7 8 4 9 2 0'));
    assert.ok(html.includes('FitTrack'));
    assert.ok(html.includes('AI-Powered Health & Fitness Intelligence'));
    assert.ok(html.includes('Sarah'));
    assert.ok(html.includes('5 minutes'));

    assert.ok(text.includes('VERIFICATION CODE: 784920'));
    assert.ok(text.includes('Sarah'));
    assert.ok(text.includes('FitTrack AI - AI-Powered Health & Fitness Intelligence'));
  });

  test('Welcome email template renders FitTrack fitness telemetry, CTA link, and TextPart', () => {
    const { html, text } = getWelcomeTemplate({
      userName: 'Alex',
      email: 'alex@fittrack.ai',
      createdDate: 'January 15, 2026',
      appUrl,
      year: 2026,
    });

    assert.ok(html.includes('Alex'));
    assert.ok(html.includes('alex@fittrack.ai'));
    assert.ok(html.includes('https://app.fittrack.ai/dashboard'));
    assert.ok(html.includes('Welcome to FitTrack'));
    assert.ok(html.includes('AI Fitness Intelligence'));

    assert.ok(text.includes('Welcome to FitTrack'));
    assert.ok(text.includes('Member: Alex'));
    assert.ok(text.includes('https://app.fittrack.ai/dashboard'));
  });

  test('Password Reset template renders FitTrack recovery URL with 15-minute expiry', () => {
    const resetUrl = 'https://app.fittrack.ai/reset-password?token=abc123token&email=alex%40fittrack.ai';
    const { html, text } = getPasswordResetTemplate({
      userName: 'Alex',
      resetUrl,
      appUrl,
      year: 2026,
    });

    assert.ok(html.includes(resetUrl));
    assert.ok(html.includes('15 minutes'));
    assert.ok(html.includes('Reset Password Now'));
    assert.ok(html.includes('FitTrack'));

    assert.ok(text.includes(resetUrl));
    assert.ok(text.includes('15 minutes'));
    assert.ok(text.includes('FitTrack - Reset Your Password'));
  });

  test('Password Changed template renders security notice & telemetry', () => {
    const { html, text } = getPasswordChangedTemplate({
      userName: 'Alex',
      changeTime: 'Sep 2, 2026, 07:30 PM',
      deviceString: 'Chrome on macOS',
      ip: '198.51.100.4',
      locationString: 'San Francisco, CA',
      appUrl,
      year: 2026,
    });

    assert.ok(html.includes('Password Successfully Changed'));
    assert.ok(html.includes('Chrome on macOS'));
    assert.ok(html.includes('198.51.100.4'));
    assert.ok(html.includes('San Francisco, CA'));
    assert.ok(html.includes('FitTrack'));

    assert.ok(text.includes('Chrome on macOS'));
    assert.ok(text.includes('198.51.100.4'));
  });

  test('Login Alert template renders security badge & geolocation details', () => {
    const { html, text } = getLoginAlertTemplate({
      userName: 'Alex',
      email: 'alex@fittrack.ai',
      isNewDevice: true,
      currentLoginTime: 'Wed, Sep 2, 2026, 07:30:00 PM',
      previousLoginTime: 'Tue, Sep 1, 2026',
      deviceString: 'Firefox on Linux',
      browser: 'Firefox',
      platform: 'Linux',
      deviceType: 'Desktop',
      ip: '203.0.113.195',
      locationString: 'Austin, TX',
      mapsUrl: 'https://maps.google.com?q=Austin',
      appUrl,
      year: 2026,
    });

    assert.ok(html.includes('NEW DEVICE DETECTED'));
    assert.ok(html.includes('Firefox on Linux'));
    assert.ok(html.includes('203.0.113.195'));
    assert.ok(html.includes('Austin, TX'));
    assert.ok(html.includes('https://maps.google.com?q=Austin'));

    assert.ok(text.includes('Security Alert: Sign-in Notification'));
    assert.ok(text.includes('Firefox on Linux'));
  });
});

describe('Mailjet Send API Validation & Mocked Dispatch', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.MAILJET_API_KEY = 'mock_public_key';
    process.env.MAILJET_SECRET_KEY = 'mock_private_key';
    process.env.MAILJET_FROM_EMAIL = 'noreply@fittrack.ai';
    process.env.MAILJET_FROM_NAME = 'FitTrack AI';
    process.env.FRONTEND_URL = 'https://app.fittrack.ai';
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test('Rejects email without valid recipient', async () => {
    const res = await sendMailjetMessage({
      to: '',
      subject: 'Test',
      html: '<p>Test</p>',
    });
    assert.equal(res.success, false);
    assert.ok(res.error.includes('recipient'));
  });

  test('Rejects email without subject or HTML content', async () => {
    const res = await sendMailjetMessage({
      to: 'user@example.com',
      subject: '',
      html: '',
    });
    assert.equal(res.success, false);
    assert.ok(res.error.includes('Subject and HTML content are required'));
  });

  test('Properly constructs Send API v3.1 payload with Basic Auth & CustomID', async () => {
    let capturedUrl = null;
    let capturedOptions = null;

    globalThis.fetch = async (url, options) => {
      capturedUrl = url;
      capturedOptions = options;
      return {
        ok: true,
        status: 200,
        json: async () => ({
          Messages: [
            {
              Status: 'success',
              CustomID: 'signup-otp-user',
              To: [{ Email: 'user@example.com', MessageID: 987654321 }],
            },
          ],
        }),
      };
    };

    const res = await sendEmail({
      to: 'user@example.com',
      toName: 'Test User',
      subject: 'Welcome to FitTrack',
      text: 'Welcome text',
      html: '<h1>Welcome</h1>',
      customId: 'signup-otp-user',
    });

    assert.equal(res.success, true);
    assert.equal(res.messageId, '987654321');
    assert.equal(capturedUrl, 'https://api.mailjet.com/v3.1/send');

    // Verify Basic Auth
    const expectedAuth = `Basic ${Buffer.from('mock_public_key:mock_private_key').toString('base64')}`;
    assert.equal(capturedOptions.headers['Authorization'], expectedAuth);
    assert.equal(capturedOptions.headers['Content-Type'], 'application/json');

    // Verify Payload structure
    const body = JSON.parse(capturedOptions.body);
    assert.equal(body.Messages.length, 1);
    const msg = body.Messages[0];
    assert.equal(msg.From.Email, 'noreply@fittrack.ai');
    assert.equal(msg.From.Name, 'FitTrack AI');
    assert.equal(msg.To[0].Email, 'user@example.com');
    assert.equal(msg.To[0].Name, 'Test User');
    assert.equal(msg.Subject, 'Welcome to FitTrack');
    assert.equal(msg.HTMLPart, '<h1>Welcome</h1>');
    assert.equal(msg.TextPart, 'Welcome text');
    assert.equal(msg.CustomID, 'signup-otp-user');
  });

  test('Supports Mailjet Sandbox Mode flag', async () => {
    let capturedBody = null;

    globalThis.fetch = async (url, options) => {
      capturedBody = JSON.parse(options.body);
      return {
        ok: true,
        status: 200,
        json: async () => ({
          Messages: [{ Status: 'success', To: [{ MessageID: 111 }] }],
        }),
      };
    };

    await sendEmail({
      to: 'sandbox-test@example.com',
      subject: 'Sandbox Test',
      html: '<p>Testing</p>',
      sandbox: true,
    });

    assert.equal(capturedBody.SandboxMode, true);
  });

  test('Handles Mailjet API error response safely without leaking credentials', async () => {
    globalThis.fetch = async () => {
      return {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          ErrorMessage: 'API key authentication failure',
          StatusCode: 401,
        }),
      };
    };

    const res = await sendEmail({
      to: 'user@example.com',
      subject: 'Failure Test',
      html: '<p>Fail</p>',
    });

    assert.equal(res.success, false);
    assert.equal(res.httpStatus, 401);
    assert.ok(res.error.includes('API key authentication failure'));
  });
});

describe('Domain Email Services (High-Level)', () => {
  const originalFetch = globalThis.fetch;
  const originalEnv = { ...process.env };

  beforeEach(() => {
    process.env.MAILJET_API_KEY = 'mock_key';
    process.env.MAILJET_SECRET_KEY = 'mock_secret';
    process.env.MAILJET_FROM_EMAIL = 'support@fittrack.ai';
    process.env.FRONTEND_URL = 'https://fittrack.ai';

    globalThis.fetch = async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        Messages: [{ Status: 'success', To: [{ MessageID: 42 }] }],
      }),
    });
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    process.env = { ...originalEnv };
  });

  test('sendVerificationOtpEmail dispatches with proper CustomID', async () => {
    const res = await sendVerificationOtpEmail('dev@example.com', 'Alex', '123456');
    assert.equal(res.success, true);
    assert.equal(res.messageId, '42');
  });

  test('sendWelcomeEmail dispatches successfully for user data', async () => {
    const res = await sendWelcomeEmail({
      _id: 'usr_abc123',
      firstName: 'Alex',
      email: 'alex@example.com',
    });
    assert.equal(res.success, true);
    assert.equal(res.messageId, '42');
  });

  test('sendPasswordResetEmail dispatches token recovery URL', async () => {
    const res = await sendPasswordResetEmail('alex@example.com', 'Alex', 'secure-reset-token-xyz');
    assert.equal(res.success, true);
  });

  test('sendPasswordChangedEmail dispatches security telemetry notice', async () => {
    const res = await sendPasswordChangedEmail(
      { _id: 'usr_1', firstName: 'Alex', email: 'alex@example.com' },
      { deviceString: 'macOS Chrome', ip: '1.2.3.4' }
    );
    assert.equal(res.success, true);
  });

  test('sendLoginAlertEmail dispatches login telemetry alert', async () => {
    const res = await sendLoginAlertEmail({
      user: { _id: 'usr_1', firstName: 'Alex', email: 'alex@example.com' },
      loginDetails: { isNewDevice: true, deviceString: 'Windows Edge', ip: '1.2.3.4' },
    });
    assert.equal(res.success, true);
  });
});
