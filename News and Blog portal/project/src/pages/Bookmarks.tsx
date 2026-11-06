import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Article } from '@/types';
import NewsCard from '@/components/NewsCard';
import EmptyState from '@/components/EmptyState';
import Seo from '@/components/Seo';

export default function Bookmarks() {
  const { bookmarks, removeBookmark, clearBookmarks } = useBookmarks();

  const toArticle = (b: typeof bookmarks[0]): Article => ({
    id: b.id,
    slug: b.slug,
    title: b.title,
    description: b.description,
    content: null,
    url: b.url,
    image: b.image,
    source: b.source,
    author: b.author,
    category: b.category,
    publishedAt: b.publishedAt,
    updated: null,
    readingTime: b.readingTime,
    isExternal: b.isExternal,
  });

  return (
    <>
      <Seo title="Bookmarks" description="Your saved articles" url="/bookmarks" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-3">
              <Bookmark className="w-8 h-8 text-amber-500" />
              Bookmarks
            </h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
              {bookmarks.length > 0
                ? `${bookmarks.length} saved stor${bookmarks.length !== 1 ? 'ies' : 'y'}`
                : 'No saved stories yet'}
            </p>
          </div>
          {bookmarks.length > 0 && (
            <button
              onClick={() => {
                if (confirm('Remove all bookmarks? This cannot be undone.')) {
                  clearBookmarks();
                }
              }}
              className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {bookmarks.length === 0 ? (
          <EmptyState
            title="You haven't saved any stories yet"
            message="Bookmark articles to read them later. Your saved stories will appear here."
            icon="bookmark"
            action={
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                Browse stories
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarks.map((b) => (
              <div key={b.id} className="relative">
                <NewsCard article={toArticle(b)} />
                <button
                  onClick={() => removeBookmark(b.id)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white dark:bg-neutral-800 shadow-md text-gray-400 hover:text-red-500 transition-colors"
                  aria-label="Remove bookmark"
                >
                  <Bookmark className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
