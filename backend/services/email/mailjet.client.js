/**
 * FitTrack - Centralized Mailjet API v3.1 Client
 *
 * Implements direct HTTPS communication with Mailjet Send API v3.1
 * using HTTP Basic Authentication.
 * Supports both MAILJET_* and MJ_* environment variable conventions.
 *
 * SECURITY:
 * - Credentials are only read from server-side environment variables.
 * - Authorization headers and secrets are NEVER logged or leaked to clients.
 */

const MAILJET_API_URL = 'https://api.mailjet.com/v3.1/send';

/**
 * Mask an email address for safe observability (e.g., "d***h@example.com")
 */
export const maskEmail = (email) => {
  if (!email || typeof email !== 'string') return 'unknown';
  const parts = email.split('@');
  if (parts.length !== 2) return 'invalid-email';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2
    ? `${name[0]}***${name[name.length - 1]}`
    : `${name[0]}***`;
  return `${maskedName}@${domain}`;
};

/**
 * Get configured Mailjet credentials safely from environment variables
 * Supports both MAILJET_API_KEY and MJ_APIKEY_PUBLIC naming conventions.
 */
export const getMailjetCredentials = () => {
  const apiKey = (process.env.MAILJET_API_KEY || process.env.MJ_APIKEY_PUBLIC || '').trim();
  const apiSecret = (process.env.MAILJET_SECRET_KEY || process.env.MJ_APIKEY_PRIVATE || '').trim();
  const fromEmail = (process.env.MAILJET_FROM_EMAIL || process.env.MAIL_FROM_EMAIL || '').trim();
  const fromName = (process.env.MAILJET_FROM_NAME || process.env.MAIL_FROM_NAME || 'FitTrack').trim();

  return {
    apiKey,
    apiSecret,
    fromEmail,
    fromName,
    isConfigured: Boolean(apiKey && apiSecret && fromEmail),
  };
};

/**
 * Verify that Mailjet environment variables are properly configured
 */
export const validateMailjetConfig = () => {
  const { apiKey, apiSecret, fromEmail, fromName, isConfigured } = getMailjetCredentials();

  if (!isConfigured) {
    const missing = [];
    if (!apiKey) missing.push('MAILJET_API_KEY (or MJ_APIKEY_PUBLIC)');
    if (!apiSecret) missing.push('MAILJET_SECRET_KEY (or MJ_APIKEY_PRIVATE)');
    if (!fromEmail) missing.push('MAILJET_FROM_EMAIL (or MAIL_FROM_EMAIL)');

    return {
      valid: false,
      message: `Missing required Mailjet backend environment variables: ${missing.join(', ')}`,
      missing,
    };
  }

  return {
    valid: true,
    fromEmail,
    fromName,
  };
};

/**
 * Send a single transactional message via Mailjet Send API v3.1
 *
 * @param {Object} options
 * @param {string} options.to - Recipient email
 * @param {string} [options.toName] - Recipient display name
 * @param {string} options.subject - Email subject line
 * @param {string} [options.text] - Plain text content (TextPart)
 * @param {string} options.html - HTML content (HTMLPart)
 * @param {string} [options.customId] - Meaningful correlation ID (e.g. "signup-otp-user")
 * @param {boolean} [options.sandbox] - Enable Mailjet Sandbox mode (validates payload without delivery)
 * @returns {Promise<{ success: boolean, messageId?: string, status?: string, error?: string }>}
 */
export const sendMailjetMessage = async ({
  to,
  toName,
  subject,
  text,
  html,
  customId,
  sandbox = false,
}) => {
  const validation = validateMailjetConfig();
  if (!validation.valid) {
    console.warn(`[FitTrack Email] Config notice: ${validation.message}`);
    return {
      success: false,
      error: 'Mailjet credentials or sender address not configured on server.',
    };
  }

  if (!to || typeof to !== 'string' || !to.includes('@')) {
    return {
      success: false,
      error: 'Invalid or missing recipient email address.',
    };
  }

  if (!subject || !html) {
    return {
      success: false,
      error: 'Subject and HTML content are required to send an email.',
    };
  }

  const { apiKey, apiSecret, fromEmail, fromName } = getMailjetCredentials();
  const authHeader = `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}`;

  const messagePayload = {
    From: {
      Email: fromEmail,
      Name: fromName,
    },
    To: [
      {
        Email: to.trim().toLowerCase(),
        Name: toName ? toName.trim() : to.trim(),
      },
    ],
    Subject: subject,
    HTMLPart: html,
    TextPart: text || subject,
  };

  if (customId && typeof customId === 'string') {
    messagePayload.CustomID = customId.slice(0, 100);
  }

  const requestBody = {
    Messages: [messagePayload],
  };

  const isSandbox = sandbox || process.env.MJ_SANDBOX_MODE === 'true';
  if (isSandbox) {
    requestBody.SandboxMode = true;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const safeRecipient = maskEmail(to);
  const logCustomId = customId || 'none';

  try {
    const response = await fetch(MAILJET_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
        'User-Agent': 'FitTrack-Backend/1.0',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Safe error extraction without leaking credentials or auth headers
      const errorMessage = data?.ErrorMessage || data?.message || `HTTP ${response.status} ${response.statusText}`;
      const safeErrorDetails = Array.isArray(data?.Messages) && data.Messages[0]?.Errors
        ? data.Messages[0].Errors.map((e) => e.ErrorMessage).join('; ')
        : errorMessage;

      console.error(`[FitTrack Email] Delivery error [Status ${response.status}] [CustomID: ${logCustomId}] [To: ${safeRecipient}]: ${safeErrorDetails}`);

      return {
        success: false,
        status: 'error',
        httpStatus: response.status,
        error: safeErrorDetails,
      };
    }

    // Inspect Mailjet v3.1 Messages response array
    const messageResult = Array.isArray(data?.Messages) ? data.Messages[0] : null;
    const messageStatus = messageResult?.Status || 'success';

    if (messageStatus === 'error') {
      const errList = (messageResult?.Errors || []).map((e) => e.ErrorMessage).join('; ') || 'Mailjet message error';
      console.error(`[FitTrack Email] Message rejected [CustomID: ${logCustomId}] [To: ${safeRecipient}]: ${errList}`);
      return {
        success: false,
        status: 'error',
        error: errList,
      };
    }

    const messageId = messageResult?.To?.[0]?.MessageID
      ? String(messageResult.To[0].MessageID)
      : `mj-${Date.now()}`;

    console.log(`[FitTrack Email] Dispatched [Status: ${messageStatus}] [CustomID: ${logCustomId}] [To: ${safeRecipient}] [MsgID: ${messageId}]`);

    return {
      success: true,
      status: messageStatus,
      messageId,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error.name === 'AbortError') {
      console.error(`[FitTrack Email] Request timed out after 10000ms [CustomID: ${logCustomId}] [To: ${safeRecipient}]`);
      return {
        success: false,
        error: 'Mailjet connection timeout.',
      };
    }

    console.error(`[FitTrack Email] Network error [CustomID: ${logCustomId}] [To: ${safeRecipient}]: ${error.message}`);
    return {
      success: false,
      error: 'Network error connecting to Mailjet API.',
    };
  }
};
