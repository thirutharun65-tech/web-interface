import { useState, useRef, useEffect } from 'react';
import { Star, MoreVertical, Pencil, Trash2, Eye, Mail, Phone, MessageSquare } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getFullName, relativeDayLabel } from '@/utils/helpers';
import Avatar from './Avatar';

export default function ContactCard({ contact, onView, onEdit, onDelete, onSendEmail }) {
  const { toggleFavorite } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-4 shadow-soft hover:shadow-card transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onView(contact)}>
          <Avatar contact={contact} size="lg" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink-900 dark:text-ink-50 truncate">{getFullName(contact)}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400 truncate">{contact.jobTitle || 'No title'}</p>
            <p className="text-xs text-ink-400 dark:text-ink-500 truncate">{contact.company || 'No company'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => toggleFavorite(contact.id)}
            className={`p-1.5 rounded-lg transition-colors ${contact.favorite ? 'text-yellow-500' : 'text-ink-300 dark:text-ink-500 hover:text-yellow-400'}`}
            aria-label="Toggle favorite"
          >
            <Star className={`w-4 h-4 ${contact.favorite ? 'fill-yellow-400 animate-starPop' : ''}`} />
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute top-full right-0 mt-1 w-36 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden z-10 animate-slideUp">
                <button onClick={() => { onView(contact); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors">
                  <Eye className="w-4 h-4" /> View
                </button>
                <button onClick={() => { onEdit(contact); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors">
                  <Pencil className="w-4 h-4" /> Edit
                </button>
                <button onClick={() => { onDelete(contact); setMenuOpen(false); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-1.5 text-xs">
        <p className="text-ink-500 dark:text-ink-400 truncate">{contact.email || 'No email'}</p>
        <p className="text-ink-500 dark:text-ink-400 truncate">{contact.phone || 'No phone'}</p>
        {contact.followUpDate && (
          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 rounded-md">
            Follow-up: {relativeDayLabel(contact.followUpDate)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-ink-100 dark:border-ink-700">
        {contact.phone && (
          <a href={`tel:${contact.phone}`} className="p-1.5 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors" aria-label="Call">
            <Phone className="w-3.5 h-3.5" />
          </a>
        )}
        {contact.email && (
          <button onClick={() => onSendEmail(contact)} className="p-1.5 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-brand-50 dark:hover:bg-brand-500/15 hover:text-brand-500 transition-colors" aria-label="Send email">
            <Mail className="w-3.5 h-3.5" />
          </button>
        )}
        {contact.phone && (
          <a href={`sms:${contact.phone}`} className="p-1.5 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors" aria-label="Message">
            <MessageSquare className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}
