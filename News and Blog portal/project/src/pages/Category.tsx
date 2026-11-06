import { useParams } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { getNewsByCategory } from '@/services/newsApi';
import NewsCard from '@/components/NewsCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Seo from '@/components/Seo';

export default function Category() {
  const { category } = useParams<{ category: string }>();
  const { data, loading, error, refetch } = useNews(
    () => getNewsByCategory(category || 'world'),
    [category],
    { cacheKey: `category-${category}` }
  );

  return (
    <>
      <Seo
        title={`${category} News`}
        description={`Latest ${category} news and stories from PulsePress`}
        url={`/category/${category}`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Category
          </span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 capitalize mt-1">
            {category}
          </h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
            {data.length > 0 ? `${data.length} stories` : 'Loading stories...'}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <ErrorState errorType={error} onRetry={refetch} />
        ) : data.length === 0 ? (
          <EmptyState
            title="No stories in this category"
            message="There are currently no articles in this category. Check back later."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
