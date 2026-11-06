import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ_ITEMS = [
  {
    q: 'How do I add a contact?',
    a: 'Open Contacts and click Add Contact. Enter the contact information and select Save Contact. The new contact will appear in your list immediately.',
    category: 'contacts',
  },
  {
    q: 'How do I edit a contact?',
    a: 'Open the contact and select Edit. Update the required information and save your changes. The contact will be updated instantly.',
    category: 'contacts',
  },
  {
    q: 'Where are my contacts stored?',
    a: 'Contactly stores contact information in your browser\'s localStorage because this version of the application does not use a backend database.',
    category: 'privacy',
  },
  {
    q: 'How do I export contacts?',
    a: 'Open Import & Export and select Export CSV. A CSV file will be downloaded with all your contacts.',
    category: 'import-export',
  },
  {
    q: 'How do I enable dark mode?',
    a: 'Open Settings → Appearance → Theme and select Dark. You can also toggle it from the sidebar or the profile menu.',
    category: 'settings',
  },
  {
    q: 'How do favorites work?',
    a: 'Select the star icon on a contact to add or remove it from Favorites. The Favorites page shows all starred contacts.',
    category: 'contacts',
  },
  {
    q: 'How do I delete a contact?',
    a: 'Open the contact menu and select Delete. Confirm the deletion. Deleted contacts cannot be recovered unless you have a backup.',
    category: 'contacts',
  },
  {
    q: 'Can I recover deleted contacts?',
    a: 'Deleted contacts cannot be recovered unless you previously exported a backup. Always export your data regularly from Settings → Privacy & Data.',
    category: 'privacy',
  },
  {
    q: 'How do follow-ups work?',
    a: 'Set a follow-up date on any contact. The Follow-ups page shows contacts grouped by overdue, today, tomorrow, this week, and upcoming.',
    category: 'follow-ups',
  },
  {
    q: 'How do I create a group?',
    a: 'Go to the Groups page and click Create Group. Enter a name, description, and color. Assign contacts to groups from the contact form.',
    category: 'groups',
  },
  {
    q: 'How do I import contacts from a CSV file?',
    a: 'Open Import & Export, select a CSV file, preview the contacts, and click Import. The contacts will be added to your existing list.',
    category: 'import-export',
  },
  {
    q: 'How do I change the accent color?',
    a: 'Open Settings → Appearance → Accent Color and choose from Purple, Blue, Green, or Orange. The change applies instantly across the app.',
    category: 'settings',
  },
];

export default function FAQAccordion({ items }) {
  const [open, setOpen] = useState(null);
  const list = items || FAQ_ITEMS;

  return (
    <div className="space-y-2">
      {list.map((item, i) => (
        <div key={i} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-ink-50/50 dark:hover:bg-ink-700/30 transition-colors"
          >
            <span className="text-sm font-semibold text-ink-900 dark:text-ink-50">{item.q}</span>
            <ChevronDown className={`w-4 h-4 text-ink-400 shrink-0 transition-transform ${open === i ? 'rotate-180' : ''}`} />
          </button>
          {open === i && (
            <div className="px-5 pb-4 animate-slideUp">
              <p className="text-sm text-ink-500 dark:text-ink-400">{item.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
