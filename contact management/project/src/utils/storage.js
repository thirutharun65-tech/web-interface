const KEYS = {
  CONTACTS: 'contactly_contacts',
  GROUPS: 'contactly_groups',
  ACTIVITY: 'contactly_activity',
  THEME: 'contactly_theme',
  USER: 'contactly_user',
  WORKSPACE: 'contactly_workspace',
  PROFILE: 'contactly_profile',
  NOTIFICATIONS: 'contactly_notifications',
  CONTACT_PREFS: 'contactly_contact_preferences',
  FEEDBACK: 'contactly_feedback',
  ACCENT: 'contactly_accent',
  DENSITY: 'contactly_density',
};

const ACCENTS = {
  purple: {
    50: '#F0EEFF', 100: '#E4E0FC', 200: '#C9C0F8', 300: '#A99BF2',
    400: '#8B78ED', 500: '#6C5CE7', 600: '#5A49D4', 700: '#4838B0',
    800: '#382C8C', 900: '#2A2068',
  },
  blue: {
    50: '#EBF5FF', 100: '#D6EBFF', 200: '#AED7FF', 300: '#7CC0FF',
    400: '#45A5FF', 500: '#0984E3', 600: '#0773C7', 700: '#055DA0',
    800: '#044878', 900: '#033452',
  },
  green: {
    50: '#E8FBF3', 100: '#C9F7E2', 200: '#95EFC6', 300: '#5FE3A8',
    400: '#2DD491', 500: '#00B894', 600: '#009F7E', 700: '#008065',
    800: '#00614C', 900: '#004233',
  },
  orange: {
    50: '#FFF4E8', 100: '#FFE2C9', 200: '#FFC595', 300: '#FFA85F',
    400: '#FF8E32', 500: '#E17055', 600: '#C45A41', 700: '#9D4834',
    800: '#763627', 900: '#4F241A',
  },
};

const DEFAULT_PROFILE = {
  firstName: 'Thirumurugan',
  lastName: '',
  email: 'thirumurugan@example.com',
  jobTitle: 'Contact Manager',
  phone: '',
  bio: 'Managing my professional and personal network with Contactly.',
  avatarColor: '#6C5CE7',
};

const DEFAULT_NOTIFICATIONS = {
  followUps: true,
  birthdays: true,
  contactUpdates: true,
  weeklySummary: false,
  desktopNotifications: false,
};

const DEFAULT_CONTACT_PREFS = {
  defaultView: 'table',
  defaultSort: 'recent',
  defaultCategory: 'all',
  confirmDelete: true,
};

const SAMPLE_CONTACTS = [
  {
    id: 'c1',
    firstName: 'Thiru',
    lastName: 'Tharun',
    email: 'thiru@example.com',
    phone: '+91 9876543210',
    alternatePhone: '+91 9123456780',
    company: 'Independent',
    jobTitle: 'Engineer',
    category: 'Personal',
    group: 'Friends',
    tags: ['developer', 'mentor'],
    address: 'Chennai, Tamil Nadu, India',
    notes: 'Met at a local tech meetup. Interested in collaborating on open-source projects.',
    birthday: '2005-04-15',
    followUpDate: getRelativeDate(7),
    favorite: true,
    createdAt: '2026-01-10',
    updatedAt: '2026-09-20',
  },
  {
    id: 'c2',
    firstName: 'Olivia',
    lastName: 'Rhye',
    email: 'olivia.rhye@layers.com',
    phone: '+1 (415) 555-0142',
    alternatePhone: '',
    company: 'Layers',
    jobTitle: 'Product Designer',
    category: 'Work',
    group: 'Work',
    tags: ['design', 'ux'],
    address: 'San Francisco, CA, USA',
    notes: 'Lead designer on the onboarding redesign project.',
    birthday: '1992-09-23',
    followUpDate: getRelativeDate(1),
    favorite: true,
    createdAt: '2026-02-05',
    updatedAt: '2026-09-18',
  },
  {
    id: 'c3',
    firstName: 'Phoenix',
    lastName: 'Baker',
    email: 'phoenix@sisyphus.com',
    phone: '+1 (628) 555-0199',
    alternatePhone: '',
    company: 'Sisyphus',
    jobTitle: 'Brand Designer',
    category: 'Work',
    group: 'Clients',
    tags: ['branding', 'design'],
    address: 'Austin, TX, USA',
    notes: 'Working on brand identity for Q4 launch.',
    birthday: '1988-09-25',
    followUpDate: getRelativeDate(3),
    favorite: true,
    createdAt: '2026-02-20',
    updatedAt: '2026-09-15',
  },
  {
    id: 'c4',
    firstName: 'Lana',
    lastName: 'Steiner',
    email: 'lana@gumroad.com',
    phone: '+1 (212) 555-0177',
    alternatePhone: '',
    company: 'Gumroad',
    jobTitle: 'Product Manager',
    category: 'Work',
    group: 'Work',
    tags: ['product', 'strategy'],
    address: 'New York, NY, USA',
    notes: 'Discussing partnership opportunities for Q1 next year.',
    birthday: '1990-09-24',
    followUpDate: getRelativeDate(3),
    favorite: false,
    createdAt: '2026-03-01',
    updatedAt: '2026-09-10',
  },
  {
    id: 'c5',
    firstName: 'Demi',
    lastName: 'Wilkinson',
    email: 'demi@quadtent.com',
    phone: '+1 (305) 555-0163',
    alternatePhone: '',
    company: 'Quadtent',
    jobTitle: 'Software Engineer',
    category: 'Work',
    group: 'Work',
    tags: ['developer', 'backend'],
    address: 'Miami, FL, USA',
    notes: 'Backend engineer, helped with API integration.',
    birthday: '1995-10-02',
    followUpDate: getRelativeDate(14),
    favorite: false,
    createdAt: '2026-03-15',
    updatedAt: '2026-09-05',
  },
  {
    id: 'c6',
    firstName: 'Candice',
    lastName: 'Wu',
    email: 'candice@catshare.com',
    phone: '+1 (206) 555-0188',
    alternatePhone: '',
    company: 'Catshare',
    jobTitle: 'Marketing Lead',
    category: 'Work',
    group: 'Clients',
    tags: ['marketing', 'growth'],
    address: 'Seattle, WA, USA',
    notes: 'Coordinating on the fall campaign launch.',
    birthday: '1989-10-10',
    followUpDate: getRelativeDate(-2),
    favorite: true,
    createdAt: '2026-04-02',
    updatedAt: '2026-09-01',
  },
  {
    id: 'c7',
    firstName: 'Natali',
    lastName: 'Craig',
    email: 'natali@quadtent.com',
    phone: '+1 (312) 555-0144',
    alternatePhone: '',
    company: 'Quadtent',
    jobTitle: 'Frontend Developer',
    category: 'Work',
    group: 'Work',
    tags: ['developer', 'frontend'],
    address: 'Chicago, IL, USA',
    notes: 'Building out the new component library.',
    birthday: '1993-10-15',
    followUpDate: getRelativeDate(21),
    favorite: false,
    createdAt: '2026-04-20',
    updatedAt: '2026-08-28',
  },
  {
    id: 'c8',
    firstName: 'Drew',
    lastName: 'Cano',
    email: 'drew@mailchimp.com',
    phone: '+1 (404) 555-0125',
    alternatePhone: '',
    company: 'Mailchimp',
    jobTitle: 'Data Analyst',
    category: 'Work',
    group: 'Work',
    tags: ['data', 'analytics'],
    address: 'Atlanta, GA, USA',
    notes: 'Analyzing user engagement metrics for the dashboard.',
    birthday: '1991-09-22',
    followUpDate: getRelativeDate(5),
    favorite: false,
    createdAt: '2026-05-10',
    updatedAt: '2026-08-20',
  },
  {
    id: 'c9',
    firstName: 'Kai',
    lastName: 'Rogers',
    email: 'kai.rogers@gmail.com',
    phone: '+44 7700 900123',
    alternatePhone: '',
    company: 'Freelance',
    jobTitle: 'Photographer',
    category: 'Personal',
    group: 'Friends',
    tags: ['creative', 'photography'],
    address: 'London, UK',
    notes: 'Shot photos for the team offsite. Great portfolio.',
    birthday: '1994-10-01',
    followUpDate: getRelativeDate(10),
    favorite: false,
    createdAt: '2026-06-01',
    updatedAt: '2026-08-15',
  },
];

const SAMPLE_GROUPS = [
  { id: 'g1', name: 'Friends', description: 'Close personal friends', color: '#6C5CE7' },
  { id: 'g2', name: 'Family', description: 'Family members', color: '#E17055' },
  { id: 'g3', name: 'College', description: 'College classmates', color: '#00B894' },
  { id: 'g4', name: 'Work', description: 'Professional colleagues', color: '#0984E3' },
  { id: 'g5', name: 'Clients', description: 'Client contacts', color: '#FDCB6E' },
];

const DEFAULT_USER = {
  firstName: 'Thirumurugan',
  lastName: '',
  email: 'thirumurugan@contactly.app',
  initials: 'TH',
};

const DEFAULT_WORKSPACE = {
  name: 'Personal workspace',
  owner: 'Thirumurugan',
  initials: 'TH',
};

function getRelativeDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split('T')[0];
}

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function loadContacts() {
  const raw = localStorage.getItem(KEYS.CONTACTS);
  if (!raw) {
    localStorage.setItem(KEYS.CONTACTS, JSON.stringify(SAMPLE_CONTACTS));
    return SAMPLE_CONTACTS;
  }
  return safeParse(raw, []);
}

export function saveContacts(contacts) {
  localStorage.setItem(KEYS.CONTACTS, JSON.stringify(contacts));
}

export function loadGroups() {
  const raw = localStorage.getItem(KEYS.GROUPS);
  if (!raw) {
    localStorage.setItem(KEYS.GROUPS, JSON.stringify(SAMPLE_GROUPS));
    return SAMPLE_GROUPS;
  }
  return safeParse(raw, []);
}

export function saveGroups(groups) {
  localStorage.setItem(KEYS.GROUPS, JSON.stringify(groups));
}

export function loadActivity() {
  const raw = localStorage.getItem(KEYS.ACTIVITY);
  if (!raw) {
    return [];
  }
  return safeParse(raw, []);
}

export function saveActivity(activity) {
  localStorage.setItem(KEYS.ACTIVITY, JSON.stringify(activity));
}

export function loadTheme() {
  return localStorage.getItem(KEYS.THEME) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(KEYS.THEME, theme);
}

export function loadUser() {
  const raw = localStorage.getItem(KEYS.USER);
  if (!raw) {
    localStorage.setItem(KEYS.USER, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  return safeParse(raw, DEFAULT_USER);
}

export function saveUser(user) {
  localStorage.setItem(KEYS.USER, JSON.stringify(user));
}

export function loadWorkspace() {
  const raw = localStorage.getItem(KEYS.WORKSPACE);
  if (!raw) {
    localStorage.setItem(KEYS.WORKSPACE, JSON.stringify(DEFAULT_WORKSPACE));
    return DEFAULT_WORKSPACE;
  }
  return safeParse(raw, DEFAULT_WORKSPACE);
}

export function saveWorkspace(workspace) {
  localStorage.setItem(KEYS.WORKSPACE, JSON.stringify(workspace));
}

export function loadProfile() {
  return safeParse(localStorage.getItem(KEYS.PROFILE), DEFAULT_PROFILE);
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export function loadNotifications() {
  return safeParse(localStorage.getItem(KEYS.NOTIFICATIONS), DEFAULT_NOTIFICATIONS);
}

export function saveNotifications(notifs) {
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(notifs));
}

export function loadContactPrefs() {
  return safeParse(localStorage.getItem(KEYS.CONTACT_PREFS), DEFAULT_CONTACT_PREFS);
}

export function saveContactPrefs(prefs) {
  localStorage.setItem(KEYS.CONTACT_PREFS, JSON.stringify(prefs));
}

export function loadAccent() {
  return localStorage.getItem(KEYS.ACCENT) || 'purple';
}

export function saveAccent(accent) {
  localStorage.setItem(KEYS.ACCENT, accent);
}

export function loadDensity() {
  return localStorage.getItem(KEYS.DENSITY) || 'comfortable';
}

export function saveDensity(density) {
  localStorage.setItem(KEYS.DENSITY, density);
}

export function loadFeedback() {
  return safeParse(localStorage.getItem(KEYS.FEEDBACK), []);
}

export function saveFeedback(feedback) {
  localStorage.setItem(KEYS.FEEDBACK, JSON.stringify(feedback));
}

export function getAccentColors(accent) {
  return ACCENTS[accent] || ACCENTS.purple;
}

export function applyAccent(accent) {
  const colors = getAccentColors(accent);
  const root = document.documentElement;
  Object.keys(colors).forEach((shade) => {
    root.style.setProperty(`--brand-${shade}`, colors[shade]);
  });
}

export function applyDensity(density) {
  document.documentElement.setAttribute('data-density', density);
}

export function exportAllData() {
  return {
    contacts: loadContacts(),
    groups: safeParse(localStorage.getItem(KEYS.GROUPS), []),
    activity: loadActivity(),
    profile: loadProfile(),
    workspace: loadWorkspace(),
    theme: loadTheme(),
    accent: loadAccent(),
    density: loadDensity(),
    notifications: loadNotifications(),
    contactPrefs: loadContactPrefs(),
    exportedAt: new Date().toISOString(),
  };
}

export function clearAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export { ACCENTS, DEFAULT_PROFILE, DEFAULT_NOTIFICATIONS, DEFAULT_CONTACT_PREFS };
export { KEYS };
