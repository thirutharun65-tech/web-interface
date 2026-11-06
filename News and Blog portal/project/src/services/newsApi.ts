import type { Article } from '@/types';
import { slugify, createArticleId } from '@/utils/slugify';
import { calculateReadingTime } from '@/utils/formatDate';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY || '';
const PROXY_URL = `${SUPABASE_URL}/functions/v1/news-proxy`;

const CATEGORY_MAP: Record<string, string> = {
  world: 'general',
  politics: 'general',
  business: 'business',
  technology: 'technology',
  science: 'science',
  health: 'health',
  sports: 'sports',
  entertainment: 'entertainment',
  lifestyle: 'general',
  travel: 'general',
  education: 'general',
};

interface NewsApiArticle {
  title: string;
  description: string | null;
  content: string | null;
  url: string;
  urlToImage: string | null;
  source: { name: string };
  author: string | null;
  publishedAt: string;
}

function mapArticle(raw: NewsApiArticle, category: string): Article {
  const textForReading = [raw.title, raw.description, raw.content]
    .filter(Boolean)
    .join(' ');
  return {
    id: createArticleId(raw.url),
    slug: slugify(raw.title) + '-' + createArticleId(raw.url).slice(0, 6),
    title: raw.title || 'Untitled',
    description: raw.description || '',
    content: raw.content,
    url: raw.url,
    image: raw.urlToImage,
    source: raw.source?.name || 'Unknown Source',
    author: raw.author,
    category,
    publishedAt: raw.publishedAt,
    updated: null,
    readingTime: calculateReadingTime(textForReading),
    isExternal: true,
  };
}

async function fetchNews(
  endpoint: string,
  params: Record<string, string>,
  category: string
): Promise<Article[]> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !NEWS_API_KEY) {
    throw new Error('NO_API_KEY');
  }

  const url = new URL(PROXY_URL);
  url.searchParams.set('endpoint', endpoint);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
      'X-News-Key': NEWS_API_KEY,
    },
  });

  if (!res.ok) {
    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (res.status === 401) throw new Error('INVALID_KEY');
    throw new Error(`API_ERROR_${res.status}`);
  }

  const data = await res.json();
  if (data.status !== 'ok') {
    throw new Error('API_ERROR');
  }

  const articles: NewsApiArticle[] = data.articles || [];
  return articles
    .filter((a) => a.title && a.title !== '[Removed]')
    .map((a) => mapArticle(a, category));
}

export async function getTopHeadlines(category?: string): Promise<Article[]> {
  const apiCategory = category ? CATEGORY_MAP[category] || 'general' : 'general';
  const params: Record<string, string> = {
    country: 'us',
    pageSize: '15',
    language: 'en',
    category: apiCategory,
  };
  return fetchNews('top-headlines', params, category || 'world');
}

export async function getLatestNews(): Promise<Article[]> {
  const params: Record<string, string> = {
    country: 'us',
    pageSize: '30',
    language: 'en',
  };
  return fetchNews('top-headlines', params, 'world');
}

export async function getNewsByCategory(category: string): Promise<Article[]> {
  const apiCategory = CATEGORY_MAP[category] || 'general';
  const params: Record<string, string> = {
    country: 'us',
    pageSize: '20',
    language: 'en',
    category: apiCategory,
  };
  return fetchNews('top-headlines', params, category);
}

export async function searchNews(query: string): Promise<Article[]> {
  if (!query.trim()) return [];
  const params: Record<string, string> = {
    q: query,
    sortBy: 'relevancy',
    pageSize: '30',
    language: 'en',
  };
  return fetchNews('everything', params, 'world');
}

export async function getTrendingNews(): Promise<Article[]> {
  const params: Record<string, string> = {
    country: 'us',
    pageSize: '20',
    language: 'en',
    category: 'general',
  };
  return fetchNews('top-headlines', params, 'world');
}

export function hasApiKey(): boolean {
  return !!SUPABASE_URL && !!SUPABASE_ANON_KEY && !!NEWS_API_KEY;
}
