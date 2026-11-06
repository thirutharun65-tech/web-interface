import { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import SettingsSidebar, { SETTINGS_SECTIONS } from '@/components/SettingsSidebar';
import ProfileSettings from '@/components/ProfileSettings';
import WorkspaceSettings from '@/components/WorkspaceSettings';
import AppearanceSettings from '@/components/AppearanceSettings';
import NotificationSettings from '@/components/NotificationSettings';
import ContactPreferences from '@/components/ContactPreferences';
import PrivacyData from '@/components/PrivacyData';
import KeyboardShortcuts from '@/components/KeyboardShortcuts';
import Modal from '@/components/Modal';

export default function Settings() {
  const { resetSettings, showToast } = useApp();
  const [active, setActive] = useState('profile');
  const [search, setSearch] = useState('');
  const [showReset, setShowReset] = useState(false);

  const handleReset = () => {
    resetSettings();
    showToast('Settings reset successfully');
    setShowReset(false);
  };

  const renderSection = () => {
    switch (active) {
      case 'profile': return <ProfileSettings />;
      case 'workspace': return <WorkspaceSettings />;
      case 'appearance': return <AppearanceSettings />;
      case 'notifications': return <NotificationSettings />;
      case 'contact-preferences': return <ContactPreferences />;
      case 'privacy': return <PrivacyData />;
      case 'shortcuts': return <KeyboardShortcuts />;
      default: return <ProfileSettings />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Settings</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage your workspace, preferences, notifications, and application settings.</p>
        </div>
        <button onClick={() => setShowReset(true)} className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors">
          <RotateCcw className="w-4 h-4" /> Reset settings
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search settings..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-3 lg:sticky lg:top-20">
            <p className="px-3 py-2 text-[10px] font-bold tracking-wider text-ink-400 dark:text-ink-500 uppercase">Settings</p>
            <SettingsSidebar active={active} onSelect={setActive} searchQuery={search} />
          </div>
        </div>
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>

      <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset settings?" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          This will reset theme, accent color, density, notification preferences, and contact preferences to their defaults. Your contacts will not be affected.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setShowReset(false)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleReset} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl transition-colors">Reset settings</button>
        </div>
      </Modal>
    </div>
  );
}
