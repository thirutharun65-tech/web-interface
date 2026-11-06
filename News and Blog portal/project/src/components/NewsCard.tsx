import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Article, NewsCardVariant } from '@/types';
import { timeAgo } from '@/utils/formatDate';
import ImageWithFallback from './ImageWithFallback';
import BookmarkButton from './BookmarkButton';

interface NewsCardProps {
  article: Article;
  variant?: NewsCardVariant;
  showImage?: boolean;
  showSummary?: boolean;
}

export default function NewsCard({
  article,
  variant = 'grid',
  showImage = true,
  showSummary = true,
}: NewsCardProps) {
  const articleLink = article.isExternal
    ? `/article/${article.slug}`
    : `/article/${article.slug}`;

  if (variant === 'featured') {
    return (
      <article className="group">
        <Link to={articleLink} className="block">
          <div className="relative overflow-hidden rounded-xl aspect-[16/10] mb-4">
            {showImage && (
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
                {article.category}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {article.title}
              </h2>
            </div>
          </div>
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {showSummary && article.description && (
              <p className="text-gray-600 dark:text-neutral-400 line-clamp-2 mb-3">
                {article.description}
              </p>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-neutral-500">
              <span className="font-medium text-gray-700 dark:text-neutral-300">
                {article.source}
              </span>
              <span aria-hidden="true">·</span>
              <span>{timeAgo(article.publishedAt)}</span>
              <span aria-hidden="true">·</span>
              <span>{article.readingTime} min read</span>
            </div>
          </div>
          <BookmarkButton article={article} size="md" />
        </div>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article className="group flex gap-4">
        {showImage && (
          <Link to={articleLink} className="flex-shrink-0">
            <div className="w-32 h-24 overflow-hidden rounded-lg">
              <ImageWithFallback
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Link to={articleLink}>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {article.category}
                </span>
                <h3 className="font-semibold text-gray-900 dark:text-neutral-100 leading-snug mt-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </Link>
              {showSummary && article.description && (
                <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2 mt-1">
                  {article.description}
                </p>
              )}
              <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500 mt-2">
                <span>{article.source}</span>
                <span aria-hidden="true">·</span>
                <span>{timeAgo(article.publishedAt)}</span>
              </div>
            </div>
            <BookmarkButton article={article} size="sm" />
          </div>
        </div>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="group flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <Link to={articleLink}>
            <h3 className="font-medium text-gray-900 dark:text-neutral-100 text-sm leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-3">
              {article.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500 mt-1.5">
            <span>{article.source}</span>
            <span aria-hidden="true">·</span>
            <span>{timeAgo(article.publishedAt)}</span>
          </div>
        </div>
        <BookmarkButton article={article} size="sm" />
      </article>
    );
  }

  // grid variant (default)
  return (
    <article className="group flex flex-col">
      {showImage && (
        <Link to={articleLink} className="block">
          <div className="overflow-hidden rounded-xl aspect-[16/10]">
            <ImageWithFallback
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      )}
      <div className="flex-1 mt-3">
        <div className="flex items-center justify-between">
          <Link to={articleLink}>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              {article.category}
            </span>
          </Link>
          <BookmarkButton article={article} size="sm" />
        </div>
        <Link to={articleLink}>
          <h3 className="font-semibold text-gray-900 dark:text-neutral-100 leading-snug mt-1.5 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-3">
            {article.title}
          </h3>
        </Link>
        {showSummary && article.description && (
          <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2 mt-2">
            {article.description}
          </p>
        )}
        <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500 mt-3">
          <span className="font-medium">{article.source}</span>
          {article.isExternal && (
            <ExternalLink size={11} className="inline" aria-label="External article" />
          )}
          <span aria-hidden="true">·</span>
          <span>{timeAgo(article.publishedAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readingTime} min read</span>
        </div>
      </div>
    </article>
  );
}
