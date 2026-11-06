import { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Pencil, Trash2, Eye, Mail, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getFullName, relativeDayLabel } from '@/utils/helpers';
import Avatar from './Avatar';

export default function ContactTable({ contacts, onView, onEdit, onDelete, onSendEmail }) {
  const { toggleFavorite } = useApp();
  const [openMenu, setOpenMenu] = useState(null);
  const menuRefs = useRef({});

  useEffect(() => {
    const handleClick = (e) => {
      const any = Object.values(menuRefs.current).some((ref) => ref && ref.contains(e.target));
      if (!any) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-100 dark:border-ink-700">
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3">Contact</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Company</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Job Title</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Email</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Phone</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Category</th>
              <th className="text-left text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3 hidden xl:table-cell">Follow-up</th>
              <th className="text-center text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3">Favorite</th>
              <th className="text-right text-xs font-semibold text-ink-400 dark:text-ink-500 uppercase tracking-wider px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr
                key={contact.id}
                className="border-b border-ink-50 dark:border-ink-700/50 hover:bg-ink-50/50 dark:hover:bg-ink-700/30 transition-colors cursor-pointer"
                onClick={() => onView(contact)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar contact={contact} size="md" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{getFullName(contact)}</p>
                      <p className="text-xs text-ink-400 dark:text-ink-500 truncate md:hidden">{contact.company}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-sm text-ink-600 dark:text-ink-300">{contact.company || '—'}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-ink-600 dark:text-ink-300">{contact.jobTitle || '—'}</span>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-sm text-ink-600 dark:text-ink-300 truncate block max-w-[180px]">{contact.email || '—'}</span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  <span className="text-sm text-ink-600 dark:text-ink-300">{contact.phone || '—'}</span>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs font-medium px-2.5 py-1 bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 rounded-lg">
                    {contact.category || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 hidden xl:table-cell">
                  {contact.followUpDate ? (
                    <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                      {relativeDayLabel(contact.followUpDate)}
                    </span>
                  ) : (
                    <span className="text-sm text-ink-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(contact.id); }}
                    className={`p-1.5 rounded-lg transition-colors inline-flex ${contact.favorite ? 'text-yellow-500' : 'text-ink-300 dark:text-ink-500 hover:text-yellow-400'}`}
                    aria-label="Toggle favorite"
                  >
                    <Star className={`w-4 h-4 ${contact.favorite ? 'fill-yellow-400' : ''}`} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="relative inline-block" ref={(el) => (menuRefs.current[contact.id] = el)}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === contact.id ? null : contact.id); }}
                      className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-700 transition-colors"
                      aria-label="More options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {openMenu === contact.id && (
                      <div className="absolute top-full right-0 mt-1 w-40 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden z-20 animate-slideUp">
                        <button onClick={(e) => { e.stopPropagation(); onView(contact); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50">
                          <Eye className="w-4 h-4" /> View
                        </button>
                        {contact.email && (
                          <button onClick={(e) => { e.stopPropagation(); onSendEmail(contact); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50">
                            <Mail className="w-4 h-4" /> Send Email
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); onEdit(contact); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50">
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(contact); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {contacts.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-sm text-ink-500 dark:text-ink-400">No contacts found</p>
        </div>
      )}
    </div>
  );
}
