import { Link } from 'react-router-dom';
import { SITE_CONFIG } from '@/config/site';

interface CategoryTabsProps {
  active?: string;
}

export default function CategoryTabs({ active }: CategoryTabsProps) {
  return (
    <div className="border-b border-gray-200 dark:border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="flex gap-1 overflow-x-auto scrollbar-hide -mb-px"
          aria-label="Category navigation"
        >
          {SITE_CONFIG.categories.map((cat) => (
            <Link
              key={cat}
              to={`/category/${cat}`}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors capitalize ${
                active === cat
                  ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 hover:border-gray-300 dark:hover:border-neutral-600'
              }`}
            >
              {cat}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
