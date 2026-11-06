const DRAFTS_KEY = 'contactly_email_drafts';
const HISTORY_KEY = 'contactly_email_history';

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function getEmailConfig() {
  return {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
  };
}

export function isEmailConfigured() {
  const config = getEmailConfig();
  return !!(config.serviceId && config.templateId && config.publicKey);
}

export async function sendEmail({ to, cc, bcc, subject, message, senderName, senderEmail, attachments }) {
  const config = getEmailConfig();
  if (!isEmailConfigured()) {
    return { success: false, error: 'Email service is not configured. Add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY to your environment.' };
  }

  try {
    const templateParams = {
      to_email: to,
      cc: cc || '',
      bcc: bcc || '',
      subject: subject,
      message: message,
      from_name: senderName || 'Contactly',
      reply_to: senderEmail || '',
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: config.serviceId,
        template_id: config.templateId,
        user_id: config.publicKey,
        template_params: templateParams,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return { success: false, error: `Email service error: ${response.status} ${text}` };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: `Unable to send email: ${err.message || 'Network error'}` };
  }
}

export function loadDrafts() {
  return safeParse(localStorage.getItem(DRAFTS_KEY), []);
}

export function saveDraft(draft) {
  const drafts = loadDrafts();
  const existingIdx = drafts.findIndex((d) => d.id === draft.id);
  const now = Date.now();
  if (existingIdx >= 0) {
    drafts[existingIdx] = { ...draft, updatedAt: now };
  } else {
    drafts.push({ ...draft, id: draft.id || `draft_${now}`, createdAt: now, updatedAt: now });
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return drafts[existingIdx >= 0 ? existingIdx : drafts.length - 1];
}

export function deleteDraft(id) {
  const drafts = loadDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function loadEmailHistory() {
  return safeParse(localStorage.getItem(HISTORY_KEY), []);
}

export function addEmailHistory(entry) {
  const history = loadEmailHistory();
  const record = {
    id: `email_${Date.now()}`,
    ...entry,
    sentAt: Date.now(),
  };
  history.unshift(record);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return record;
}

export function clearEmailHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getEmailsForContact(contactId) {
  return loadEmailHistory().filter((e) => {
    if (e.contactIds && Array.isArray(e.contactIds)) {
      return e.contactIds.includes(contactId);
    }
    return e.contactId === contactId;
  });
}
