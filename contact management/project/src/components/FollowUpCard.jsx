import { useApp } from '@/context/AppContext';
import { getFullName, relativeDayLabel, daysUntil } from '@/utils/helpers';
import Avatar from './Avatar';

export default function FollowUpCard({ contact, onClick }) {
  const { toggleFavorite } = useApp();
  const days = daysUntil(contact.followUpDate);
  const label = relativeDayLabel(contact.followUpDate);
  const isOverdue = days < 0;

  return (
    <button
      onClick={() => onClick(contact)}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left group"
    >
      <Avatar contact={contact} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">
          {getFullName(contact)}
        </p>
        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
          {contact.jobTitle || 'No title'} · {contact.company || 'No company'}
        </p>
      </div>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg shrink-0 ${
        isOverdue
          ? 'bg-red-50 dark:bg-red-500/15 text-red-500'
          : days <= 1
          ? 'bg-amber-50 dark:bg-amber-500/15 text-amber-600'
          : 'bg-ink-50 dark:bg-ink-700 text-ink-500 dark:text-ink-400'
      }`}>
        {label}
      </span>
    </button>
  );
}
