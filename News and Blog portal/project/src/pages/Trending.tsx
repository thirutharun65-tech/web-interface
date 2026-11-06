import { TrendingUp } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { getTrendingNews } from '@/services/newsApi';
import NewsCard from '@/components/NewsCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Seo from '@/components/Seo';

export default function Trending() {
  const { data, loading, error, refetch } = useNews(
    () => getTrendingNews(),
    [],
    { cacheKey: 'trending-page' }
  );

  return (
    <>
      <Seo title="Trending" description="The most talked-about stories right now" url="/trending" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-amber-500" />
            Trending Now
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2">
            Stories ranked by recency and relevance from live news sources.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} variant="horizontal" />
            ))}
          </div>
        ) : error ? (
          <ErrorState errorType={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState
            title="No trending stories"
            message="Trending stories are temporarily unavailable. Please check back later."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {data.map((article, i) => (
              <div key={article.id} className="flex gap-4 items-start">
                <span className="text-4xl font-bold text-gray-200 dark:text-neutral-700 w-12 flex-shrink-0 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <NewsCard article={article} variant="horizontal" showImage={true} showSummary={false} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
