import { useMemo } from 'react';
import { Cake } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { daysUntilBirthday, getUpcomingBirthdayAge, formatDate, getFullName } from '@/utils/helpers';
import Avatar from '@/components/Avatar';

export default function Birthdays({ onSelectContact }) {
  const { contacts } = useApp();

  const upcoming = useMemo(() => {
    return contacts
      .filter((c) => c.birthday)
      .map((c) => ({ ...c, days: daysUntilBirthday(c.birthday), age: getUpcomingBirthdayAge(c.birthday) }))
      .filter((c) => c.days <= 60)
      .sort((a, b) => a.days - b.days);
  }, [contacts]);

  const today = upcoming.filter((c) => c.days === 0);
  const thisWeek = upcoming.filter((c) => c.days > 0 && c.days <= 7);
  const thisMonth = upcoming.filter((c) => c.days > 7 && c.days <= 30);
  const later = upcoming.filter((c) => c.days > 30);

  const renderSection = (label, items) => {
    if (items.length === 0) return null;
    return (
      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
        <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 mb-3">{label}</h3>
        <div className="space-y-1">
          {items.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelectContact(c)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left"
            >
              <Avatar contact={c} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{getFullName(c)}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">
                  {formatDate(c.birthday, { month: 'long', day: 'numeric' })}
                  {c.age != null && ` · Turning ${c.age}`}
                </p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-500/15 text-pink-500 shrink-0">
                <Cake className="w-3.5 h-3.5" />
                {c.days === 0 ? 'Today!' : c.days === 1 ? 'Tomorrow' : `In ${c.days} days`}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Birthdays</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{upcoming.length} upcoming birthdays in the next 60 days</p>
      </div>

      {renderSection('Today', today)}
      {renderSection('This week', thisWeek)}
      {renderSection('This month', thisMonth)}
      {renderSection('Later', later)}

      {upcoming.length === 0 && (
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
          <Cake className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
          <p className="text-sm text-ink-500 dark:text-ink-400">No upcoming birthdays</p>
        </div>
      )}
    </div>
  );
}
