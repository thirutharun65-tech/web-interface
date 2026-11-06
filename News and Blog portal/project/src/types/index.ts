export interface Article {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  url: string;
  image: string | null;
  source: string;
  author: string | null;
  category: string;
  publishedAt: string;
  updated: string | null;
  readingTime: number;
  isExternal: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  tags: string[];
  readingTime: number;
}

export type Theme = 'light' | 'dark' | 'system';
export type ReadingDensity = 'compact' | 'comfortable' | 'large';

export interface Settings {
  theme: Theme;
  readingDensity: ReadingDensity;
  defaultCategory: string;
  region: string;
  language: string;
}

export type NewsCardVariant = 'featured' | 'horizontal' | 'compact' | 'grid';
