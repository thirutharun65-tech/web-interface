import { Cake } from 'lucide-react';
import { getFullName, daysUntilBirthday, getUpcomingBirthdayAge, formatDate } from '@/utils/helpers';
import Avatar from './Avatar';

export default function BirthdayCard({ contact, onClick }) {
  const days = daysUntilBirthday(contact.birthday);
  const age = getUpcomingBirthdayAge(contact.birthday);

  let label;
  if (days === 0) label = 'Today!';
  else if (days === 1) label = 'Tomorrow';
  else label = `In ${days} days`;

  return (
    <button
      onClick={() => onClick(contact)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left"
    >
      <Avatar contact={contact} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">
          {getFullName(contact)}
        </p>
        <p className="text-xs text-ink-500 dark:text-ink-400">
          {formatDate(contact.birthday, { month: 'short', day: 'numeric' })}
          {age != null && ` · Turning ${age}`}
        </p>
      </div>
      <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-pink-50 dark:bg-pink-500/15 text-pink-500 shrink-0">
        <Cake className="w-3.5 h-3.5" />
        {label}
      </span>
    </button>
  );
}
