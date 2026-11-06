import { Keyboard } from 'lucide-react';

const SHORTCUTS = [
  { action: 'Global Search', keys: ['Ctrl', 'K'] },
  { action: 'Add Contact', keys: ['Ctrl', 'N'] },
  { action: 'Close Modal', keys: ['Esc'] },
  { action: 'Save Form', keys: ['Ctrl', 'S'] },
  { action: 'Go to Dashboard', keys: ['G', 'D'] },
  { action: 'Go to Contacts', keys: ['G', 'C'] },
  { action: 'Go to Favorites', keys: ['G', 'F'] },
];

export default function KeyboardShortcuts() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Keyboard Shortcuts</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Speed up your workflow with these shortcuts.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <div className="space-y-1">
          {SHORTCUTS.map((s, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-ink-100 dark:border-ink-700 last:border-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-ink-50 dark:bg-ink-700 flex items-center justify-center">
                  <Keyboard className="w-4 h-4 text-ink-500 dark:text-ink-300" />
                </div>
                <span className="text-sm font-medium text-ink-900 dark:text-ink-50">{s.action}</span>
              </div>
              <div className="flex items-center gap-1">
                {s.keys.map((key, j) => (
                  <span key={j} className="px-2 py-1 text-xs font-semibold text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 border border-ink-200 dark:border-ink-600 rounded-md shadow-sm">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
