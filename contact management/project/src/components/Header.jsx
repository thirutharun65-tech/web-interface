import { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, Command, User, Settings, HelpCircle, Moon, Sun, LogOut } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { searchContacts, formatTime, formatDateLong, getFullName } from '@/utils/helpers';
import Avatar from './Avatar';

export default function Header({ onNavigate, onSelectContact }) {
  const { contacts, user, theme, toggleTheme } = useApp();
  const [query, setQuery] = useState('');
  const [now, setNow] = useState(new Date());
  const [showResults, setShowResults] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowResults(false);
        setShowNotif(false);
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const results = query.trim() ? searchContacts(contacts, query).slice(0, 6) : [];

  const handleSelectResult = (contact) => {
    onSelectContact(contact);
    setQuery('');
    setShowResults(false);
  };

  const notifCount = contacts.filter((c) => {
    if (!c.followUpDate) return false;
    const days = Math.round((new Date(c.followUpDate) - new Date()) / (1000 * 60 * 60 * 24));
    return days <= 3;
  }).length;

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-ink-800/80 backdrop-blur-md border-b border-ink-100 dark:border-ink-700">
      <div className="flex items-center gap-4 px-4 lg:px-6 h-16" ref={containerRef}>
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-ink-400" />
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search contacts, companies, tags..."
            className="w-full pl-11 pr-16 py-2.5 bg-ink-50 dark:bg-ink-700/50 border border-transparent focus:border-brand-300 dark:focus:border-brand-500 rounded-xl text-sm text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none transition-all focus:bg-white dark:focus:bg-ink-700"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-ink-400 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded">
            <Command className="w-3 h-3" />K
          </kbd>

          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden animate-slideUp">
              <p className="px-4 py-2 text-xs font-semibold text-ink-400 uppercase tracking-wide border-b border-ink-100 dark:border-ink-700">
                {results.length} result{results.length > 1 ? 's' : ''}
              </p>
              {results.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectResult(c)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left"
                >
                  <Avatar contact={c} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">
                      {getFullName(c)}
                    </p>
                    <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                      {c.company || 'No company'} · {c.email || 'No email'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
          {showResults && query.trim() && results.length === 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float px-4 py-6 text-center animate-slideUp">
              <p className="text-sm text-ink-500 dark:text-ink-400">No contacts found for "{query}"</p>
            </div>
          )}
        </div>

        <div className="hidden md:block text-right">
          <p className="text-xs text-ink-500 dark:text-ink-400">{formatDateLong(now)}</p>
          <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 tabular-nums">{formatTime(now)}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}
              className="relative p-2 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-brand-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifCount}
                </span>
              )}
            </button>
            {showNotif && (
              <div className="absolute top-full mt-2 right-0 w-72 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden animate-slideUp">
                <p className="px-4 py-3 text-sm font-semibold text-ink-900 dark:text-ink-50 border-b border-ink-100 dark:border-ink-700">
                  Follow-up reminders
                </p>
                <div className="max-h-64 overflow-y-auto">
                  {contacts.filter((c) => {
                    if (!c.followUpDate) return false;
                    const days = Math.round((new Date(c.followUpDate) - new Date()) / (1000 * 60 * 60 * 24));
                    return days <= 3;
                  }).map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { onSelectContact(c); setShowNotif(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors text-left"
                    >
                      <Avatar contact={c} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-900 dark:text-ink-50 truncate">{getFullName(c)}</p>
                        <p className="text-xs text-brand-500">Follow-up due soon</p>
                      </div>
                    </button>
                  ))}
                  {notifCount === 0 && (
                    <p className="px-4 py-6 text-sm text-ink-500 text-center">No pending follow-ups</p>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowNotif(false); }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white text-xs font-bold">
              {user.initials || 'U'}
            </div>
            <ChevronDown className="w-4 h-4 text-ink-400 hidden sm:block" />
          </button>
          {showUserMenu && (
            <div className="absolute top-full mt-2 right-4 w-56 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden animate-slideUp">
              <div className="px-4 py-3 border-b border-ink-100 dark:border-ink-700">
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{user.firstName} {user.lastName}</p>
                <p className="text-xs text-ink-500 dark:text-ink-400">{user.email}</p>
              </div>
              <button
                onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
              >
                <User className="w-4 h-4" /> View Profile
              </button>
              <button
                onClick={() => { onNavigate('settings'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </button>
              <button
                onClick={() => { onNavigate('help'); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
              >
                <HelpCircle className="w-4 h-4" /> Help Center
              </button>
              <button
                onClick={() => { toggleTheme(); setShowUserMenu(false); }}
                className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
              <div className="border-t border-ink-100 dark:border-ink-700">
                <button
                  onClick={() => { setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Log out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
