import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = ['all', 'Personal', 'Work', 'Family', 'Clients', 'Other'];
const SORTS = [
  { value: 'recent', label: 'Most recent' },
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'company', label: 'Company' },
  { value: 'oldest', label: 'Oldest first' },
];

export default function FilterBar({ filters, setFilters, groups }) {
  const groupOptions = ['all', ...groups.map((g) => g.name)];

  const selectClass = "text-sm font-medium bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 text-ink-600 dark:text-ink-300 rounded-lg px-3 py-2 outline-none cursor-pointer hover:border-ink-300 dark:hover:border-ink-500 focus:border-brand-400";

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          placeholder="Search contacts..."
          className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-lg text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400"
        />
        {filters.search && (
          <button onClick={() => setFilters({ ...filters, search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 overflow-x-auto">
        <SlidersHorizontal className="w-4 h-4 text-ink-400 shrink-0" />
        <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className={selectClass}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
        </select>
        <select value={filters.group} onChange={(e) => setFilters({ ...filters, group: e.target.value })} className={selectClass}>
          {groupOptions.map((g) => <option key={g} value={g}>{g === 'all' ? 'All groups' : g}</option>)}
        </select>
        <select value={filters.favorite} onChange={(e) => setFilters({ ...filters, favorite: e.target.value === 'true' })} className={selectClass}>
          <option value="false">All contacts</option>
          <option value="true">Favorites only</option>
        </select>
        <select value={filters.sortBy} onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })} className={selectClass}>
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>
    </div>
  );
}
