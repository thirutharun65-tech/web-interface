import { User, Building2, Palette, Bell, SlidersHorizontal, Shield, Keyboard } from 'lucide-react';

export const SETTINGS_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'contact-preferences', label: 'Contact Preferences', icon: SlidersHorizontal },
  { id: 'privacy', label: 'Privacy & Data', icon: Shield },
  { id: 'shortcuts', label: 'Keyboard Shortcuts', icon: Keyboard },
];

export const SETTINGS_KEYWORDS = {
  profile: ['profile', 'name', 'email', 'avatar', 'bio', 'phone', 'job title'],
  workspace: ['workspace', 'name', 'description', 'owner'],
  appearance: ['theme', 'dark', 'light', 'accent', 'color', 'density', 'compact', 'comfortable', 'appearance'],
  notifications: ['notification', 'reminder', 'follow-up', 'birthday', 'weekly', 'desktop', 'alert'],
  'contact-preferences': ['contact', 'view', 'table', 'cards', 'sort', 'category', 'delete', 'confirm', 'preference'],
  privacy: ['privacy', 'data', 'export', 'import', 'clear', 'delete', 'backup', 'local', 'storage'],
  shortcuts: ['keyboard', 'shortcut', 'ctrl', 'search', 'navigate'],
};

export default function SettingsSidebar({ active, onSelect, searchQuery }) {
  const filtered = searchQuery
    ? SETTINGS_SECTIONS.filter((s) => {
        const kw = SETTINGS_KEYWORDS[s.id] || [];
        return (
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          kw.some((k) => k.includes(searchQuery.toLowerCase()))
        );
      })
    : SETTINGS_SECTIONS;

  return (
    <div className="space-y-0.5">
      {filtered.map((s) => {
        const Icon = s.icon;
        const isActive = active === s.id;
        return (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive
                ? 'bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300'
                : 'text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50'
            }`}
          >
            <Icon className={`w-[18px] h-[18px] ${isActive ? 'text-brand-500' : ''}`} />
            <span className="flex-1 text-left">{s.label}</span>
          </button>
        );
      })}
      {filtered.length === 0 && (
        <p className="text-sm text-ink-400 px-3 py-4">No settings found</p>
      )}
    </div>
  );
}
