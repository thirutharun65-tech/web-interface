import { useParams, Link } from 'react-router-dom';
import { ExternalLink, Clock, Calendar, User } from 'lucide-react';
import { useNews } from '@/hooks/useNews';
import { getLatestNews, getTopHeadlines } from '@/services/newsApi';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import ImageWithFallback from '@/components/ImageWithFallback';
import ErrorState from '@/components/ErrorState';
import Seo from '@/components/Seo';
import { formatDate, timeAgo } from '@/utils/formatDate';

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error, refetch } = useNews(
    () => getLatestNews(),
    [],
    { cacheKey: 'latest-news-article' }
  );

  const article = data.find((a) => a.slug === slug);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-4 h-10 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-6 h-6 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-8 h-64 w-full bg-gray-200 dark:bg-neutral-800 rounded-xl" />
        <div className="mt-8 space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <ErrorState errorType={error} onRetry={refetch} />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
          Article not found
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          The article you are looking for may have been removed or is no longer available.
        </p>
        <Link
          to="/"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Back to home
        </Link>
      </div>
    );
  }

  const related = data
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <>
      <Seo
        title={article.title}
        description={article.description}
        image={article.image || undefined}
        url={`/article/${article.slug}`}
        type="article"
      />
      <article data-reading-content className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category */}
        <Link
          to={`/category/${article.category}`}
          className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:underline"
        >
          {article.category}
        </Link>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-100 leading-tight mt-3">
          {article.title}
        </h1>

        {/* Description */}
        {article.description && (
          <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 leading-relaxed">
            {article.description}
          </p>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-neutral-400">
            <span className="font-medium text-gray-700 dark:text-neutral-300">
              {article.source}
            </span>
          </div>
          {article.author && (
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
              <User size={14} />
              {article.author}
            </div>
          )}
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <Calendar size={14} />
            {formatDate(article.publishedAt)}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <Clock size={14} />
            {article.readingTime} min read
          </div>
        </div>

        {/* Hero image */}
        {article.image && (
          <div className="mt-6 overflow-hidden rounded-xl">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-auto"
              loading="eager"
            />
          </div>
        )}

        {/* Article body */}
        <div className="mt-8 prose prose-lg dark:prose-invert max-w-none">
          {article.content ? (
            <>
              <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
                {article.description}
              </p>
              <p className="text-gray-700 dark:text-neutral-300 leading-relaxed mt-4">
                {article.content
                  .replace(/\[.*?\]/g, '')
                  .replace(/\+/g, '')
                  .trim() || article.description}
              </p>
            </>
          ) : (
            <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
              {article.description}
            </p>
          )}

          {article.isExternal && (
            <div className="mt-8 p-5 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <p className="text-sm text-gray-600 dark:text-neutral-400 mb-3">
                This is a summary from {article.source}. Read the full article on the original source.
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
              >
                <ExternalLink size={16} />
                Read full story on {article.source}
              </a>
            </div>
          )}
        </div>

        {/* Share & bookmark */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Share:
            </span>
            <ShareButtons
              title={article.title}
              slug={article.slug}
              isExternal={article.isExternal}
              externalUrl={article.url}
            />
          </div>
          <BookmarkButton article={article} variant="label" size="md" />
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
              Related Stories
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} to={`/article/${rel.slug}`} className="group">
                  <div className="overflow-hidden rounded-lg aspect-[16/10] mb-3">
                    <ImageWithFallback
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-neutral-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                    {rel.source} · {timeAgo(rel.publishedAt)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
