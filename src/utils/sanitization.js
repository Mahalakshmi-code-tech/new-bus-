/**
 * SmartBus Input Sanitization & Security Utility
 * Prevents Cross-Site Scripting (XSS), script injections, and malformed payload attacks.
 */

const HTML_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;'
};

/**
 * Escapes unsafe HTML characters in a string
 * @param {string} str Unsanitized string
 * @returns {string} Sanitized string
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>"'/]/g, match => HTML_ENTITY_MAP[match] || match);
}

/**
 * Strips script tags, Javascript URI schemes, and inline event handlers
 * @param {string} input Unsanitized text
 * @returns {string} Cleaned text
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove null bytes
    .replace(/\0/g, '')
    // Strip <script> and dangerous tags
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Strip javascript: pseudo-protocol
    .replace(/javascript\s*:/gi, '')
    // Strip inline event attributes like onerror=, onclick=
    .replace(/\bon\w+\s*=/gi, '')
    .trim();
}

/**
 * Normalizes and sanitizes search queries
 * Enforces maximum length and removes control characters
 * @param {string} query Search input
 * @param {number} maxLength Default 80 chars
 * @returns {string} Clean search query
 */
export function sanitizeSearchQuery(query, maxLength = 80) {
  if (typeof query !== 'string') return '';
  const trimmed = query.trim().slice(0, maxLength);
  // Remove control characters (ASCII 0-31 except space)
  return trimmed.replace(/[\x00-\x1F\x7F]/g, '');
}

/**
 * Strips sensitive fields (passwords, tokens, keys) from an object before logging
 * @param {Object} obj Input data
 * @returns {Object} Safe object for logging
 */
export function stripSensitiveFields(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const sensitiveKeys = ['password', 'token', 'apiKey', 'secret', 'auth', 'creditCard'];
  
  if (Array.isArray(obj)) {
    return obj.map(stripSensitiveFields);
  }

  const safe = {};
  for (const [key, value] of Object.entries(obj)) {
    if (sensitiveKeys.some(s => key.toLowerCase().includes(s.toLowerCase()))) {
      safe[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      safe[key] = stripSensitiveFields(value);
    } else {
      safe[key] = value;
    }
  }
  return safe;
}
