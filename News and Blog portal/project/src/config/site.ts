export const SITE_CONFIG = {
  name: 'PulsePress',
  tagline: 'The Pulse of Modern Journalism',
  description:
    'PulsePress is an independent digital publication delivering in-depth reporting on world events, technology, business, and culture.',
  url: 'https://pulsepress.example.com',
  defaultRegion: 'in',
  defaultLanguage: 'en',
  categories: [
    'world',
    'politics',
    'business',
    'technology',
    'science',
    'health',
    'sports',
    'entertainment',
    'lifestyle',
    'travel',
    'education',
  ] as const,
  social: {
    twitter: 'https://twitter.com',
    facebook: 'https://facebook.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
  },
  contactEmail: 'editorial@pulsepress.example.com',
} as const;

export type Category = (typeof SITE_CONFIG.categories)[number];
