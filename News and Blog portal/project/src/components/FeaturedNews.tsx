import { Link } from 'react-router-dom';
import type { Article } from '@/types';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
import ErrorState from './ErrorState';

interface FeaturedNewsProps {
  articles: Article[];
  loading: boolean;
  error: string | null;
  onRetry?: () => void;
}

export default function FeaturedNews({
  articles,
  loading,
  error,
  onRetry,
}: FeaturedNewsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard variant="featured" />
        </div>
        <div className="space-y-4">
          <SkeletonCard variant="horizontal" />
          <SkeletonCard variant="horizontal" />
          <SkeletonCard variant="horizontal" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorState errorType={error} onRetry={onRetry} />;
  }

  if (articles.length === 0) return null;

  const [featured, ...rest] = articles;
  const secondary = rest.slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <NewsCard article={featured} variant="featured" />
      </div>
      <div className="space-y-5">
        {secondary.map((article) => (
          <Link key={article.id} to={`/article/${article.slug}`} className="block">
            <NewsCard article={article} variant="horizontal" showImage={true} showSummary={false} />
          </Link>
        ))}
      </div>
    </div>
  );
}
