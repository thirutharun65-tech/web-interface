import { Search } from 'lucide-react';

export default function HelpSearch({ query, setQuery }) {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for help..."
        className="w-full pl-12 pr-4 py-3.5 text-sm bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-2xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20 shadow-soft"
      />
    </div>
  );
}
