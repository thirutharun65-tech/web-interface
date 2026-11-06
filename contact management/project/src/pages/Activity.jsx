import { useApp } from '@/context/AppContext';
import { relativeTime } from '@/utils/helpers';
import { UserPlus, UserCheck, Trash2, Star, StarOff, Clock, Upload } from 'lucide-react';

const ACTION_ICONS = {
  'added a new contact': UserPlus,
  'updated': UserCheck,
  'deleted': Trash2,
  'added to favorites': Star,
  'removed from favorites': StarOff,
  'imported': Upload,
};

const ACTION_COLORS = {
  'added a new contact': 'text-green-500 bg-green-50 dark:bg-green-500/15',
  'updated': 'text-blue-500 bg-blue-50 dark:bg-blue-500/15',
  'deleted': 'text-red-500 bg-red-50 dark:bg-red-500/15',
  'added to favorites': 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/15',
  'removed from favorites': 'text-ink-400 bg-ink-50 dark:bg-ink-700',
  'imported': 'text-brand-500 bg-brand-50 dark:bg-brand-500/15',
};

export default function Activity() {
  const { activity } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Activity</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">Recent actions across your workspace</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
        {activity.length > 0 ? (
          <div className="space-y-1">
            {activity.map((entry, idx) => {
              const Icon = ACTION_ICONS[entry.action] || Clock;
              const color = ACTION_COLORS[entry.action] || 'text-ink-400 bg-ink-50 dark:bg-ink-700';
              return (
                <div key={entry.id} className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-ink-50/50 dark:hover:bg-ink-700/30 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-ink-900 dark:text-ink-50">
                      <span className="font-semibold">{entry.user}</span>{' '}
                      {entry.action}{' '}
                      {entry.contactName && <span className="font-medium">{entry.contactName}</span>}
                    </p>
                    <p className="text-xs text-ink-400 dark:text-ink-500 mt-0.5">{relativeTime(entry.timestamp)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Clock className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
            <p className="text-sm text-ink-500 dark:text-ink-400">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
