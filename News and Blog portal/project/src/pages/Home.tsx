import { Link } from 'react-router-dom';
import { TrendingUp, ArrowRight } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { getTopHeadlines, getLatestNews, getTrendingNews } from '@/services/newsApi';
import FeaturedNews from '@/components/FeaturedNews';
import NewsCard from '@/components/NewsCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorState from '@/components/ErrorState';
import Seo from '@/components/Seo';
import { SITE_CONFIG } from '@/config/site';

export default function Home() {
  const top = useNews(() => getTopHeadlines(), [], { cacheKey: 'top-headlines' });
  const latest = useNews(() => getLatestNews(), [], { cacheKey: 'latest-news' });
  const trending = useNews(() => getTrendingNews(), [], { cacheKey: 'trending-news' });

  return (
    <>
      <Seo
        title="PulsePress — The Pulse of Modern Journalism"
        description={SITE_CONFIG.description}
        url="/"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero / Featured */}
        <section aria-label="Featured stories">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              Featured
            </h1>
          </div>
          <FeaturedNews
            articles={top.data}
            loading={top.loading}
            error={top.error}
            onRetry={top.refetch}
          />
        </section>

        {/* Latest section */}
        <section className="mt-16" aria-label="Latest news">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
              Latest News
            </h2>
            <Link
              to="/latest"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {latest.loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : latest.error ? (
            <ErrorState errorType={latest.error} onRetry={latest.refetch} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {latest.data.slice(0, 4).map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Trending section */}
        <section className="mt-16" aria-label="Trending stories">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-amber-500" />
              Trending
            </h2>
            <Link
              to="/trending"
              className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 hover:gap-2 transition-all"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {trending.loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} variant="horizontal" />
              ))}
            </div>
          ) : trending.error ? (
            <ErrorState errorType={trending.error} onRetry={trending.refetch} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
              {trending.data.slice(0, 6).map((article, i) => (
                <div key={article.id} className="flex gap-4 items-start">
                  <span className="text-3xl font-bold text-gray-200 dark:text-neutral-700 w-10 flex-shrink-0">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <NewsCard article={article} variant="compact" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Categories preview */}
        <section className="mt-16" aria-label="Browse by category">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {SITE_CONFIG.categories.map((cat) => (
              <Link
                key={cat}
                to={`/category/${cat}`}
                className="px-4 py-6 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition-all text-center group"
              >
                <span className="text-sm font-semibold text-gray-700 dark:text-neutral-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 capitalize">
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
