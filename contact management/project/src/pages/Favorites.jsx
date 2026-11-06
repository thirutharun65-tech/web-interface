import { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sortContacts, getFullName } from '@/utils/helpers';
import ContactTable from '@/components/ContactTable';
import ContactCard from '@/components/ContactCard';

export default function Favorites({ onSelectContact, onEditContact, onDelete, onSendEmail }) {
  const { contacts } = useApp();

  const favorites = useMemo(() => {
    return sortContacts(contacts.filter((c) => c.favorite), 'name');
  }, [contacts]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Favorites</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{favorites.length} starred contacts</p>
      </div>

      <div className="hidden lg:block">
        <ContactTable contacts={favorites} onView={onSelectContact} onEdit={onEditContact} onDelete={onDelete} onSendEmail={onSendEmail} />
      </div>
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favorites.map((c) => (
          <ContactCard key={c.id} contact={c} onView={onSelectContact} onEdit={onEditContact} onDelete={onDelete} onSendEmail={onSendEmail} />
        ))}
      </div>

      {favorites.length === 0 && (
        <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
          <Star className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
          <p className="text-sm text-ink-500 dark:text-ink-400">No favorite contacts yet</p>
          <p className="text-xs text-ink-400 mt-1">Click the star icon on any contact to add it here</p>
        </div>
      )}
    </div>
  );
}
