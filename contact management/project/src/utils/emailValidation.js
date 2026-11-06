import { isValidEmail } from './validation';

export function validateEmail({ to, cc, bcc, subject, message }) {
  const errors = {};

  if (!to || !to.trim()) {
    errors.to = 'Please enter a recipient email address.';
  } else if (!isValidEmail(to.trim())) {
    errors.to = 'Please enter a valid email address.';
  }

  if (cc && cc.trim() && !isValidEmail(cc.trim())) {
    errors.cc = 'Please enter a valid Cc email address.';
  }

  if (bcc && bcc.trim() && !isValidEmail(bcc.trim())) {
    errors.bcc = 'Please enter a valid Bcc email address.';
  }

  if (!subject || !subject.trim()) {
    errors.subject = 'Please enter a subject.';
  }

  if (!message || !message.trim()) {
    errors.message = 'Please enter a message.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
