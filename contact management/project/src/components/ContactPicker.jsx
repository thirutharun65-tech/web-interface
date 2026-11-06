import { useState, useMemo } from 'react';
import { Search, Check, Star, Users, X, ChevronDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getFullName } from '@/utils/helpers';
import { loadEmailHistory } from '@/services/emailService';
import Avatar from './Avatar';

export default function ContactPicker({ onContinue, onClose }) {
  const { contacts, groups } = useApp();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [groupFilter, setGroupFilter] = useState('all');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const recentContactIds = useMemo(() => {
    const history = loadEmailHistory();
    const ids = new Set();
    history.slice(0, 6).forEach((e) => {
      if (e.contactIds) e.contactIds.forEach((id) => ids.add(id));
      else if (e.contactId) ids.add(e.contactId);
    });
    return ids;
  }, []);

  const recentContacts = useMemo(() => {
    return contacts.filter((c) => recentContactIds.has(c.id) && c.email);
  }, [contacts, recentContactIds]);

  const filtered = useMemo(() => {
    let list = contacts.filter((c) => c.email);
    if (groupFilter !== 'all') {
      list = list.filter((c) => c.group === groupFilter);
    }
    if (favoritesOnly) {
      list = list.filter((c) => c.favorite);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((c) =>
        getFullName(c).toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        (c.jobTitle || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [contacts, search, groupFilter, favoritesOnly]);

  const toggleSelect = (contact) => {
    if (!contact.email) return;
    setSelected((prev) => {
      if (prev.find((c) => c.id === contact.id)) {
        return prev.filter((c) => c.id !== contact.id);
      }
      return [...prev, contact];
    });
  };

  const selectAll = () => {
    setSelected(filtered);
  };

  const clearSelection = () => {
    setSelected([]);
  };

  const handleContinue = () => {
    if (selected.length === 0) return;
    onContinue(selected);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-ink-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-ink-800 shadow-float w-full h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl sm:rounded-2xl flex flex-col animate-scaleIn overflow-hidden">

        <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100 dark:border-ink-700">
          <div>
            <h2 className="text-lg font-bold text-ink-900 dark:text-ink-50">Select contacts</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400">Choose who you want to email.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-3 space-y-3 border-b border-ink-100 dark:border-ink-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, company, job title..."
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-ink-50 dark:bg-ink-700/50 border border-ink-100 dark:border-ink-600 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <select
                value={groupFilter}
                onChange={(e) => setGroupFilter(e.target.value)}
                className="text-xs font-medium bg-ink-50 dark:bg-ink-700 border border-ink-100 dark:border-ink-600 text-ink-600 dark:text-ink-300 rounded-lg px-3 py-1.5 outline-none cursor-pointer focus:border-brand-400"
              >
                <option value="all">All groups</option>
                {groups.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
              </select>
            </div>
            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                favoritesOnly
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300'
                  : 'border-ink-100 dark:border-ink-600 text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-brand-500 text-brand-500' : ''}`} /> Favorites only
            </button>
            <button
              onClick={selectAll}
              className="text-xs font-medium text-brand-500 hover:text-brand-600 px-2 py-1.5"
            >
              Select all
            </button>
            {selected.length > 0 && (
              <button onClick={clearSelection} className="text-xs font-medium text-ink-500 hover:text-ink-700 dark:hover:text-ink-300 px-2 py-1.5">
                Clear selection
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {recentContacts.length > 0 && !search && groupFilter === 'all' && !favoritesOnly && (
            <div className="px-5 pt-4">
              <p className="text-xs font-bold tracking-wider text-ink-400 dark:text-ink-500 uppercase mb-2">Recent</p>
              <div className="space-y-1 mb-3">
                {recentContacts.slice(0, 4).map((contact) => (
                  <ContactPickerRow
                    key={contact.id}
                    contact={contact}
                    selected={!!selected.find((c) => c.id === contact.id)}
                    onToggle={() => toggleSelect(contact)}
                  />
                ))}
              </div>
              <div className="h-px bg-ink-100 dark:border-ink-700" />
            </div>
          )}

          <div className="px-5 py-3">
            {filtered.length > 0 ? (
              <div className="space-y-1">
                {filtered.map((contact) => (
                  <ContactPickerRow
                    key={contact.id}
                    contact={contact}
                    selected={!!selected.find((c) => c.id === contact.id)}
                    onToggle={() => toggleSelect(contact)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <Users className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
                <p className="text-sm text-ink-500 dark:text-ink-400">
                  {search ? `No contacts found for "${search}"` : 'No contacts with email addresses'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between px-5 py-3.5 border-t border-ink-100 dark:border-ink-700 bg-ink-50/50 dark:bg-ink-700/30">
          <p className="text-sm font-medium text-ink-600 dark:text-ink-300">
            {selected.length} contact{selected.length !== 1 ? 's' : ''} selected
          </p>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors">Cancel</button>
            <button
              onClick={handleContinue}
              disabled={selected.length === 0}
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-soft transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPickerRow({ contact, selected, onToggle }) {
  const hasEmail = !!contact.email;
  return (
    <button
      onClick={onToggle}
      disabled={!hasEmail}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-left ${
        selected
          ? 'bg-brand-50 dark:bg-brand-500/10'
          : hasEmail
            ? 'hover:bg-ink-50 dark:hover:bg-ink-700/50'
            : 'opacity-50 cursor-not-allowed'
      }`}
      title={!hasEmail ? 'This contact does not have an email address.' : ''}
    >
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected
          ? 'bg-brand-500 border-brand-500'
          : 'border-ink-200 dark:border-ink-600'
      }`}>
        {selected && <Check className="w-3.5 h-3.5 text-white" />}
      </div>
      <Avatar contact={contact} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{getFullName(contact)}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
          {hasEmail ? contact.email : 'No email'}
          {contact.company && ` · ${contact.company}`}
        </p>
      </div>
    </button>
  );
}
