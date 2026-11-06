import { useState, useEffect } from 'react';
import {
  Sparkles, LayoutGrid, Users, Clock, Cake, Star,
  FolderTree, ArrowUpDown, Activity, ChevronDown, Moon, Sun,
  Settings, HelpCircle, Mail,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid, section: 'WORKSPACE' },
  { id: 'contacts', label: 'Contacts', icon: Users, section: 'WORKSPACE', countKey: 'contacts' },
  { id: 'follow-ups', label: 'Follow-ups', icon: Clock, section: 'WORKSPACE', countKey: 'followups' },
  { id: 'birthdays', label: 'Birthdays', icon: Cake, section: 'WORKSPACE', countKey: 'birthdays' },
  { id: 'favorites', label: 'Favorites', icon: Star, section: 'WORKSPACE', countKey: 'favorites' },
  { id: 'groups', label: 'Groups', icon: FolderTree, section: 'MANAGE' },
  { id: 'import-export', label: 'Import & Export', icon: ArrowUpDown, section: 'MANAGE' },
  { id: 'activity', label: 'Activity', icon: Activity, section: 'MANAGE' },
  { id: 'email-history', label: 'Email History', icon: Mail, section: 'MANAGE' },
  { id: 'settings', label: 'Settings', icon: Settings, section: 'ACCOUNT' },
  { id: 'help', label: 'Help Center', icon: HelpCircle, section: 'ACCOUNT' },
];

export default function Sidebar({ active, onNavigate, mobileOpen, onCloseMobile }) {
  const { contacts, groups, theme, toggleTheme, workspace } = useApp();
  const [wsOpen, setWsOpen] = useState(false);

  const counts = {
    contacts: contacts.length,
    followups: contacts.filter((c) => c.followUpDate).length,
    birthdays: contacts.filter((c) => c.birthday).length,
    favorites: contacts.filter((c) => c.favorite).length,
  };

  const handleNav = (id) => {
    onNavigate(id);
    if (onCloseMobile) onCloseMobile();
  };

  const sections = [...new Set(NAV_ITEMS.map((i) => i.section))];

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-ink-900/40 dark:bg-black/60 z-30 lg:hidden" onClick={onCloseMobile} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-ink-800 border-r border-ink-100 dark:border-ink-700 flex flex-col z-40 transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-5 py-5 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center shadow-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-ink-900 dark:text-ink-50 tracking-tight">
            contactly
          </span>
        </div>

        <div className="px-3 mb-2">
          <button
            onClick={() => setWsOpen(!wsOpen)}
            className="w-full flex items-center gap-3 p-2.5 rounded-xl border border-ink-100 dark:border-ink-700 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-brand-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {workspace.initials || 'WS'}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">
                {workspace.owner || 'Workspace'}
              </p>
              <p className="text-xs text-ink-500 dark:text-ink-400 truncate">
                {workspace.name || 'Personal workspace'}
              </p>
            </div>
            <ChevronDown className={`w-4 h-4 text-ink-400 transition-transform ${wsOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-4">
          {sections.map((section) => (
            <div key={section}>
              <p className="px-3 mb-1.5 text-[10px] font-bold tracking-wider text-ink-400 dark:text-ink-500 uppercase">
                {section}
              </p>
              <div className="space-y-0.5">
                {NAV_ITEMS.filter((i) => i.section === section).map((item) => {
                  const Icon = item.icon;
                  const isActive = active === item.id;
                  const count = item.countKey ? counts[item.countKey] : null;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNav(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300'
                          : 'text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50'
                      }`}
                    >
                      <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-500' : ''}`} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {count != null && count > 0 && (
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                          isActive
                            ? 'bg-brand-100 dark:bg-brand-500/20 text-brand-600 dark:text-brand-300'
                            : 'bg-ink-100 dark:bg-ink-700 text-ink-500 dark:text-ink-400'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-ink-100 dark:border-ink-700">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 p-2.5 rounded-lg text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-ink-100 dark:bg-ink-700 flex items-center justify-center">
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-ink-500" />}
            </div>
            <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
