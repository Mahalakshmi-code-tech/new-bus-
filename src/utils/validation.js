/**
 * SmartBus Form & Input Validation Engine
 * Provides client-side validation with user-friendly error messages.
 * Prevents malformed, oversized, or unauthorized payload structures.
 */

import { sanitizeInput } from './sanitization';

// Standard email regex (RFC 5322 compliant subset)
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Safe phone regex (international format with optional country code, spaces, dashes)
const PHONE_REGEX = /^(\+?[0-9]{1,4}[\s-]?)?(\([0-9]{2,5}\)[\s-]?)?[0-9]{6,12}$/;

/**
 * Validates user login inputs
 */
export function validateLoginCredentials({ email, password }) {
  const errors = {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    errors.email = 'Please provide an email address.';
  } else if (!EMAIL_REGEX.test(email.trim())) {
    errors.email = 'Please provide a valid email address (e.g. user@domain.com).';
  } else if (email.length > 120) {
    errors.email = 'Email address cannot exceed 120 characters.';
  }

  if (!password || typeof password !== 'string') {
    errors.password = 'Please enter your password.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  } else if (password.length > 100) {
    errors.password = 'Password is too long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Validates passenger contact form submissions
 */
export function validateContactForm({ name, email, phone, subject, message }) {
  const errors = {};

  const cleanName = sanitizeInput(name);
  if (!cleanName) {
    errors.name = 'Please enter your full name.';
  } else if (cleanName.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (cleanName.length > 80) {
    errors.name = 'Name cannot exceed 80 characters.';
  }

  const cleanEmail = email ? email.trim() : '';
  if (!cleanEmail) {
    errors.email = 'Please enter your email address.';
  } else if (!EMAIL_REGEX.test(cleanEmail)) {
    errors.email = 'Please enter a valid email address.';
  } else if (cleanEmail.length > 120) {
    errors.email = 'Email address cannot exceed 120 characters.';
  }

  if (phone && phone.trim()) {
    const cleanPhone = phone.trim();
    if (!PHONE_REGEX.test(cleanPhone)) {
      errors.phone = 'Please enter a valid phone number or leave blank.';
    }
  }

  const cleanMessage = sanitizeInput(message);
  if (!cleanMessage) {
    errors.message = 'Please provide a message or inquiry.';
  } else if (cleanMessage.length < 10) {
    errors.message = 'Please provide a little more detail (at least 10 characters).';
  } else if (cleanMessage.length > 2000) {
    errors.message = 'Message is too long. Please limit to 2000 characters.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      name: cleanName,
      email: cleanEmail,
      phone: phone ? sanitizeInput(phone) : '',
      subject: subject ? sanitizeInput(subject) : 'General Commuter Inquiry',
      message: cleanMessage
    }
  };
}

/**
 * Validates incident report submissions
 */
export function validateIncidentReport(data) {
  const errors = {};

  if (!data.issueType || typeof data.issueType !== 'string' || !data.issueType.trim()) {
    errors.issueType = 'Please select the category of the incident.';
  }

  const cleanDesc = sanitizeInput(data.description || '');
  if (!cleanDesc) {
    errors.description = 'Please describe the incident details.';
  } else if (cleanDesc.length < 8) {
    errors.description = 'Description should be at least 8 characters.';
  } else if (cleanDesc.length > 1500) {
    errors.description = 'Description exceeds the 1500 character limit.';
  }

  const cleanLocation = sanitizeInput(data.location || '');
  if (!cleanLocation) {
    errors.location = 'Please specify the bus stop or corridor location.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedData: {
      ...data,
      issueType: sanitizeInput(data.issueType || ''),
      description: cleanDesc,
      location: cleanLocation,
      busNumber: sanitizeInput(data.busNumber || ''),
      reportedBy: sanitizeInput(data.reportedBy || 'Passenger Commuter')
    }
  };
}
