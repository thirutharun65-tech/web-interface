export function validateContact(contact) {
  const errors = {};

  if (!contact.firstName || !contact.firstName.trim()) {
    errors.firstName = 'First name is required';
  }

  if (!contact.lastName || !contact.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }

  if (!contact.category || !contact.category.trim()) {
    errors.category = 'Category is required';
  }

  if (contact.email && !isValidEmail(contact.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (contact.phone && !isValidPhone(contact.phone)) {
    errors.phone = 'Please enter a valid phone number';
  }

  if (contact.alternatePhone && !isValidPhone(contact.alternatePhone)) {
    errors.alternatePhone = 'Please enter a valid phone number';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone) {
  const cleaned = phone.replace(/[\s\-().]/g, '');
  return /^\+?\d{7,15}$/.test(cleaned);
}
