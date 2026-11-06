import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: 'search' | 'bookmark' | 'default';
  action?: React.ReactNode;
}

export default function EmptyState({
  title = 'No stories found',
  message = 'Try adjusting your search or filters.',
  icon = 'default',
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        {icon === 'search' ? (
          <SearchX className="w-8 h-8 text-gray-400 dark:text-neutral-500" />
        ) : (
          <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-neutral-600" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
        {title}
      </h3>
      <p className="mt-2 text-gray-500 dark:text-neutral-400 max-w-md">
        {message}
      </p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
