import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import Seo from '@/components/Seo';

export default function NotFound() {
  return (
    <>
      <Seo title="Page Not Found" description="The page you are looking for does not exist" url="/404" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-8xl font-bold text-gray-200 dark:text-neutral-800">404</p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mt-4">
          Page not found
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          The page you are looking for may have been moved, deleted, or never existed.
        </p>
        <div className="flex items-center justify-center gap-3 mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
          >
            <Home size={16} />
            Go home
          </Link>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-gray-700 dark:text-neutral-300 text-sm font-medium hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
          >
            <Search size={16} />
            Search
          </Link>
        </div>
      </div>
    </>
  );
}
