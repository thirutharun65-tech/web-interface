import { useState, useEffect, useCallback } from 'react';
import type { Article } from '@/types';

const STORAGE_KEY = 'pulsepress_bookmarks';

interface StoredBookmark {
  id: string;
  slug: string;
  title: string;
  description: string;
  image: string | null;
  source: string;
  author: string | null;
  category: string;
  publishedAt: string;
  url: string;
  readingTime: number;
  isExternal: boolean;
  bookmarkedAt: string;
}

function getBookmarks(): StoredBookmark[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveBookmarks(bookmarks: StoredBookmark[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<StoredBookmark[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
  }, []);

  const isBookmarked = useCallback(
    (id: string): boolean => bookmarks.some((b) => b.id === id),
    [bookmarks]
  );

  const toggleBookmark = useCallback((article: Article): void => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === article.id);
      let updated: StoredBookmark[];
      if (exists) {
        updated = prev.filter((b) => b.id !== article.id);
      } else {
        const newBookmark: StoredBookmark = {
          id: article.id,
          slug: article.slug,
          title: article.title,
          description: article.description,
          image: article.image,
          source: article.source,
          author: article.author,
          category: article.category,
          publishedAt: article.publishedAt,
          url: article.url,
          readingTime: article.readingTime,
          isExternal: article.isExternal,
          bookmarkedAt: new Date().toISOString(),
        };
        updated = [...prev, newBookmark];
      }
      saveBookmarks(updated);
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((id: string): void => {
    setBookmarks((prev) => {
      const updated = prev.filter((b) => b.id !== id);
      saveBookmarks(updated);
      return updated;
    });
  }, []);

  const clearBookmarks = useCallback((): void => {
    saveBookmarks([]);
    setBookmarks([]);
  }, []);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearBookmarks,
    count: bookmarks.length,
  };
}
