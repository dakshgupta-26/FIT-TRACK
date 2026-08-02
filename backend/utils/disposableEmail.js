// List of common disposable/temporary email provider domains
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "sharklasers.com",
  "trashmail.com",
  "dispostable.com",
  "getnada.com",
  "yopmail.com",
  "throwawaymail.com",
  "tempmailo.com",
  "fakemailgenerator.com",
  "maildrop.cc",
  "crazymailing.com",
  "nada.ltd",
  "burnermail.io",
  "mytemp.email",
  "emailondeck.com",
  "temp-mail.org",
]);

/**
 * Validates whether an email address uses a disposable/temporary email domain.
 * @param {string} email 
 * @returns {boolean} True if disposable, false otherwise.
 */
export const isDisposableEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const parts = email.toLowerCase().trim().split("@");
  if (parts.length !== 2) return false;
  const domain = parts[1];
  return DISPOSABLE_DOMAINS.has(domain);
};
