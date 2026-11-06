import { useState } from 'react';
import { Clock } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { getLatestNews } from '@/services/newsApi';
import NewsCard from '@/components/NewsCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import CategoryTabs from '@/components/CategoryTabs';
import Seo from '@/components/Seo';
import { SITE_CONFIG } from '@/config/site';

const ITEMS_PER_PAGE = 9;

export default function Latest() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const { data, loading, error, refetch } = useNews(
    () => getLatestNews(),
    [],
    { cacheKey: 'latest-news-page' }
  );

  const filtered = activeCategory
    ? data.filter((a) => a.category === activeCategory)
    : data;
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <>
      <Seo title="Latest News" description="The most recent stories from PulsePress" url="/latest" />
      <CategoryTabs active={activeCategory || undefined} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <Clock className="w-6 h-6 text-amber-500" />
              Latest News
            </h1>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
              {filtered.length > 0
                ? `${filtered.length} stories · Updated continuously`
                : 'Loading stories...'}
            </p>
          </div>
          {activeCategory && (
            <button
              onClick={() => setActiveCategory(null)}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState errorType={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No stories found"
            message="No articles match the selected category. Try a different filter."
          />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={() => setVisibleCount((c) => c + ITEMS_PER_PAGE)}
                  className="px-6 py-3 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-neutral-300 transition-colors"
                >
                  Load more stories
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
