import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  initialQuery?: string;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function SearchBar({
  initialQuery = '',
  placeholder = 'Search articles, topics, sources...',
  autoFocus = false,
}: SearchBarProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState(initialQuery);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <Search
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search articles"
        className="w-full pl-12 pr-12 py-3.5 text-base rounded-xl bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
