import { useSearchParams } from 'react-router-dom';
import { useNews } from '@/hooks/useNews';
import { searchNews } from '@/services/newsApi';
import SearchBar from '@/components/SearchBar';
import NewsCard from '@/components/NewsCard';
import SkeletonCard from '@/components/SkeletonCard';
import ErrorState from '@/components/ErrorState';
import EmptyState from '@/components/EmptyState';
import Seo from '@/components/Seo';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const { data, loading, error, refetch } = useNews(
    () => searchNews(query),
    [query],
    { cacheKey: `search-${query}` }
  );

  return (
    <>
      <Seo title={`Search: ${query}`} description="Search results from PulsePress" url={`/search?q=${query}`} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
          Search
        </h1>
        <SearchBar initialQuery={query} autoFocus={!query} />

        {query && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-4">
            {loading
              ? 'Searching...'
              : `${data.length} result${data.length !== 1 ? 's' : ''} for "${query}"`}
          </p>
        )}

        {!query && (
          <div className="mt-8">
            <EmptyState
              title="Start searching"
              message="Enter a keyword above to search across all articles. Try topics like technology, business, or sports."
              icon="search"
            />
          </div>
        )}

        {query && loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {query && !loading && error && (
          <div className="mt-8">
            <ErrorState errorType={error} onRetry={refetch} />
          </div>
        )}

        {query && !loading && !error && data.length === 0 && (
          <div className="mt-8">
            <EmptyState
              title="No stories found"
              message={`No articles matched "${query}". Try different keywords or check the spelling.`}
              icon="search"
            />
          </div>
        )}

        {query && !loading && !error && data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
