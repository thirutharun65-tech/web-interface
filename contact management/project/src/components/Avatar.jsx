import { getInitials, getAvatarColor, getFullName } from '@/utils/helpers';

export default function Avatar({ contact, size = 'md', ring = false }) {
  const name = contact ? getFullName(contact) : '?';
  const initials = contact ? getInitials(contact.firstName, contact.lastName) : '?';
  const color = getAvatarColor(name);
  const sizes = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${ring ? 'ring-2 ring-white dark:ring-ink-800' : ''}`}
      style={{ backgroundColor: color }}
      title={name}
    >
      {initials}
    </div>
  );
}
