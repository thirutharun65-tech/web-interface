import { useMemo } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { daysUntil, relativeDayLabel, getFullName } from '@/utils/helpers';
import Avatar from '@/components/Avatar';

const SECTIONS = [
  { key: 'overdue', label: 'Overdue', filter: (d) => d < 0 },
  { key: 'today', label: 'Today', filter: (d) => d === 0 },
  { key: 'tomorrow', label: 'Tomorrow', filter: (d) => d === 1 },
  { key: 'week', label: 'This week', filter: (d) => d >= 2 && d <= 7 },
  { key: 'upcoming', label: 'Upcoming', filter: (d) => d > 7 && d <= 30 },
];

export default function FollowUps({ onSelectContact }) {
  const { contacts } = useApp();

  const grouped = useMemo(() => {
    const withFollowups = contacts.filter((c) => c.followUpDate).map((c) => ({
      ...c,
      days: daysUntil(c.followUpDate),
    }));
    return SECTIONS.map((s) => ({
      ...s,
      items: withFollowups.filter((c) => s.filter(c.days)).sort((a, b) => a.days - b.days),
    }));
  }, [contacts]);

  const total = contacts.filter((c) => c.followUpDate && daysUntil(c.followUpDate) <= 30).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Follow-ups</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{total} follow-ups in the next 30 days</p>
      </div>

      {grouped.map((section) => (
        section.items.length > 0 && (
          <div key={section.key} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                section.key === 'overdue' ? 'bg-red-50 dark:bg-red-500/15' : 'bg-brand-50 dark:bg-brand-500/15'
              }`}>
                {section.key === 'overdue' ? (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-brand-500" />
                )}
              </div>
              <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">{section.label}</h3>
              <span className="text-xs text-ink-400">{section.items.length}</span>
            </div>
            <div className="space-y-1">
              {section.items.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectContact(c)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left"
                >
                  <Avatar contact={c} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{getFullName(c)}</p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                      {c.jobTitle || 'No title'} · {c.company || 'No company'}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
                    c.days < 0
                      ? 'bg-red-50 dark:bg-red-500/15 text-red-500'
                      : c.days <= 1
                      ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600'
                      : 'bg-ink-50 dark:bg-ink-700 text-ink-500 dark:text-ink-400'
                  }`}>
                    {relativeDayLabel(c.followUpDate)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )
      ))}

      {total === 0 && (
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
          <Clock className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
          <p className="text-sm text-ink-500 dark:text-ink-400">No follow-ups scheduled</p>
        </div>
      )}
    </div>
  );
}
