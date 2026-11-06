import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import type { Article } from '@/types';

interface BookmarkButtonProps {
  article: Article;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'label';
}

export default function BookmarkButton({
  article,
  size = 'md',
  variant = 'icon',
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(article.id);

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-10 h-10',
  };

  const iconSize = {
    sm: 14,
    md: 18,
    lg: 20,
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(article);
      }}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark article'}
      aria-pressed={bookmarked}
      className={`${
        variant === 'icon' ? sizeClasses[size] : 'px-3 py-1.5 gap-1.5'
      } inline-flex items-center justify-center rounded-lg transition-colors ${
        bookmarked
          ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50'
          : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
      }`}
    >
      {bookmarked ? (
        <BookmarkCheck size={iconSize[size]} />
      ) : (
        <Bookmark size={iconSize[size]} />
      )}
      {variant === 'label' && (
        <span className="text-sm font-medium">
          {bookmarked ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  );
}
