export function getInitials(firstName, lastName) {
  const f = (firstName || '').trim();
  const l = (lastName || '').trim();
  return (f.charAt(0) + l.charAt(0)).toUpperCase() || '?';
}

export function getFullName(contact) {
  return `${contact.firstName || ''} ${contact.lastName || ''}`.trim();
}

export function formatDate(dateStr, opts = {}) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', opts.month ? opts : {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatDateLong(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getGreeting(date = new Date()) {
  const h = date.getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export function daysUntilBirthday(birthdayStr) {
  if (!birthdayStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bday = new Date(birthdayStr);
  bday.setFullYear(today.getFullYear());
  bday.setHours(0, 0, 0, 0);
  if (bday < today) {
    bday.setFullYear(today.getFullYear() + 1);
  }
  return Math.round((bday - today) / (1000 * 60 * 60 * 24));
}

export function getAge(birthdayStr) {
  if (!birthdayStr) return null;
  const bday = new Date(birthdayStr);
  if (isNaN(bday.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - bday.getFullYear();
  const m = today.getMonth() - bday.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < bday.getDate())) age--;
  return age;
}

export function getUpcomingBirthdayAge(birthdayStr) {
  if (!birthdayStr) return null;
  const bday = new Date(birthdayStr);
  if (isNaN(bday.getTime())) return null;
  const today = new Date();
  const nextBday = new Date(bday);
  nextBday.setFullYear(today.getFullYear());
  if (nextBday < today) nextBday.setFullYear(today.getFullYear() + 1);
  return nextBday.getFullYear() - bday.getFullYear();
}

export function relativeDayLabel(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return '';
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7) return `In ${days} days`;
  if (days < 14) return 'Next week';
  return formatDate(dateStr, { month: 'short', day: 'numeric' });
}

export function relativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} minute${mins > 1 ? 's' : ''} ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(new Date(timestamp).toISOString(), { month: 'short', day: 'numeric' });
}

export function sortContacts(contacts, sortBy) {
  const sorted = [...contacts];
  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => getFullName(a).localeCompare(getFullName(b)));
      break;
    case 'name-desc':
      sorted.sort((a, b) => getFullName(b).localeCompare(getFullName(a)));
      break;
    case 'company':
      sorted.sort((a, b) => (a.company || '').localeCompare(b.company || ''));
      break;
    case 'recent':
      sorted.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      break;
    case 'oldest':
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    default:
      break;
  }
  return sorted;
}

export function filterContacts(contacts, { search, category, group, favorite }) {
  return contacts.filter((c) => {
    if (category && category !== 'all' && c.category !== category) return false;
    if (group && group !== 'all' && c.group !== group) return false;
    if (favorite && c.favorite !== true) return false;
    if (search) {
      const q = search.toLowerCase();
      const haystack = [
        c.firstName, c.lastName, getFullName(c), c.email, c.phone,
        c.company, c.jobTitle, c.category, ...(c.tags || []),
      ].join(' ').toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    return true;
  });
}

export function searchContacts(contacts, query) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase();
  return contacts.filter((c) => {
    const haystack = [
      c.firstName, c.lastName, getFullName(c), c.email, c.phone,
      c.company, c.jobTitle, c.category, ...(c.tags || []),
    ].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}

export function getAvatarColor(name) {
  const colors = [
    '#6C5CE7', '#0984E3', '#00B894', '#E17055', '#FDCB6E',
    '#E84393', '#2D3436', '#6C5CE7', '#00CEC9', '#FD79A8',
  ];
  const hash = (name || '').split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function generateId() {
  return 'c' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function generateGroupId() {
  return 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function toCSV(contacts) {
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone', 'Alternate Phone',
    'Company', 'Job Title', 'Category', 'Group', 'Tags',
    'Address', 'Notes', 'Birthday', 'Follow-up Date', 'Favorite', 'Created At',
  ];
  const rows = contacts.map((c) => [
    c.firstName || '',
    c.lastName || '',
    c.email || '',
    c.phone || '',
    c.alternatePhone || '',
    c.company || '',
    c.jobTitle || '',
    c.category || '',
    c.group || '',
    (c.tags || []).join('; '),
    c.address || '',
    c.notes || '',
    c.birthday || '',
    c.followUpDate || '',
    c.favorite ? 'Yes' : 'No',
    c.createdAt || '',
  ]);
  const escape = (val) => {
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
  };
  return [headers, ...rows].map((row) => row.map(escape).join(',')).join('\n');
}

export function parseCSV(text) {
  const rows = [];
  let current = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        current.push(field);
        field = '';
      } else if (ch === '\n' || ch === '\r') {
        current.push(field);
        field = '';
        rows.push(current);
        current = [];
        if (ch === '\r' && text[i + 1] === '\n') i++;
      } else {
        field += ch;
      }
    }
  }
  if (field || current.length) {
    current.push(field);
    rows.push(current);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0].trim()));
}

export function csvToContacts(text) {
  const rows = parseCSV(text);
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const contacts = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = (row[idx] || '').trim();
    });
    const contact = {
      id: generateId(),
      firstName: obj['first name'] || obj['firstname'] || '',
      lastName: obj['last name'] || obj['lastname'] || '',
      email: obj['email'] || '',
      phone: obj['phone'] || '',
      alternatePhone: obj['alternate phone'] || obj['alternatephone'] || '',
      company: obj['company'] || '',
      jobTitle: obj['job title'] || obj['jobtitle'] || '',
      category: obj['category'] || 'Personal',
      group: obj['group'] || '',
      tags: obj['tags'] ? obj['tags'].split(';').map((t) => t.trim()).filter(Boolean) : [],
      address: obj['address'] || '',
      notes: obj['notes'] || '',
      birthday: obj['birthday'] || '',
      followUpDate: obj['follow-up date'] || obj['followup date'] || obj['followupdate'] || '',
      favorite: obj['favorite'] === 'yes' || obj['favorite'] === 'true',
      createdAt: obj['created at'] || obj['createdat'] || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    if (contact.firstName || contact.lastName) {
      contacts.push(contact);
    }
  }
  return contacts;
}

export function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename || 'contacts.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getMonthLabel(monthIdx) {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return labels[monthIdx];
}

export function getGrowthData(contacts) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      label: getMonthLabel(d.getMonth()),
      year: d.getFullYear(),
      month: d.getMonth(),
      count: 0,
    });
  }
  contacts.forEach((c) => {
    if (!c.createdAt) return;
    const d = new Date(c.createdAt);
    if (isNaN(d.getTime())) return;
    months.forEach((m) => {
      if (d.getFullYear() === m.year && d.getMonth() <= m.month) {
        m.count++;
      }
    });
  });
  const prevPeriod = months.map((m) => {
    const d = new Date(m.year, m.month - 6, 1);
    let count = 0;
    contacts.forEach((c) => {
      if (!c.createdAt) return;
      const cd = new Date(c.createdAt);
      if (!isNaN(cd.getTime()) && cd.getFullYear() === d.getFullYear() && cd.getMonth() <= m.month - 6) {
        count++;
      }
    });
    return Math.round(count * 0.7);
  });
  return { months: months.map((m) => ({ label: m.label, count: m.count })), prevPeriod };
}
