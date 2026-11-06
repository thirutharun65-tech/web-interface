import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  errorType?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Unable to load news right now',
  message = 'Something went wrong. Please try again.',
  errorType,
  onRetry,
}: ErrorStateProps) {
  const isNetworkError = errorType === 'API_ERROR';
  const isApiKeyError = errorType === 'NO_API_KEY' || errorType === 'INVALID_KEY';
  const isRateLimit = errorType === 'RATE_LIMIT';

  const displayTitle = isRateLimit
    ? 'Too many requests'
    : isApiKeyError
      ? 'API key required'
      : isNetworkError
        ? 'Unable to load news right now'
        : title;

  const displayMessage = isRateLimit
    ? 'The news service is rate-limited. Please wait a moment and try again.'
    : isApiKeyError
      ? 'A valid news API key is required. Add VITE_NEWS_API_KEY to your .env file to fetch live articles.'
      : isNetworkError
        ? 'Check your internet connection and try again.'
        : message;

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-4">
        {isNetworkError ? (
          <WifiOff className="w-8 h-8 text-red-500" />
        ) : (
          <AlertCircle className="w-8 h-8 text-red-500" />
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
        {displayTitle}
      </h3>
      <p className="mt-2 text-gray-500 dark:text-neutral-400 max-w-md">
        {displayMessage}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:bg-gray-700 dark:hover:bg-neutral-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
