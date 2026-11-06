import { useApp } from '@/context/AppContext';
import { Table, LayoutGrid, ArrowUpDown, Tag, AlertTriangle } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import SettingRow from './SettingRow';

const CATEGORIES = ['all', 'Personal', 'Work', 'Family', 'Friends', 'College', 'Other'];

const selectClass = 'text-sm font-medium bg-white dark:bg-ink-700 border border-ink-200 dark:border-ink-600 text-ink-900 dark:text-ink-50 rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-brand-400';

export default function ContactPreferences() {
  const { contactPrefs, updateContactPrefs } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Contact Preferences</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Configure how contacts are displayed and managed.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <SettingRow icon={Table} title="Default contact view" description="Choose how contacts are displayed by default.">
          <div className="flex gap-2">
            <button
              onClick={() => updateContactPrefs({ defaultView: 'table' })}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                contactPrefs.defaultView === 'table'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300'
                  : 'border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-300'
              }`}
            >
              <Table className="w-4 h-4" /> Table
            </button>
            <button
              onClick={() => updateContactPrefs({ defaultView: 'cards' })}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all ${
                contactPrefs.defaultView === 'cards'
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300'
                  : 'border-ink-100 dark:border-ink-700 text-ink-600 dark:text-ink-300'
              }`}
            >
              <LayoutGrid className="w-4 h-4" /> Cards
            </button>
          </div>
        </SettingRow>

        <SettingRow icon={ArrowUpDown} title="Default sorting" description="How contacts are sorted by default.">
          <select value={contactPrefs.defaultSort} onChange={(e) => updateContactPrefs({ defaultSort: e.target.value })} className={selectClass}>
            <option value="name">Name A-Z</option>
            <option value="recent">Recently Added</option>
            <option value="recent">Recently Updated</option>
          </select>
        </SettingRow>

        <SettingRow icon={Tag} title="Default category" description="Filter contacts by this category by default.">
          <select value={contactPrefs.defaultCategory} onChange={(e) => updateContactPrefs({ defaultCategory: e.target.value })} className={selectClass}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
          </select>
        </SettingRow>

        <SettingRow icon={AlertTriangle} title="Confirm before deleting" description="Show a confirmation dialog before deleting contacts.">
          <ToggleSwitch checked={contactPrefs.confirmDelete} onChange={(v) => updateContactPrefs({ confirmDelete: v })} />
        </SettingRow>
      </div>
    </div>
  );
}
