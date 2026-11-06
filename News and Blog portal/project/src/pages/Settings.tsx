import { useState } from 'react';
import {
  Settings as SettingsIcon,
  Sun,
  Moon,
  Monitor,
  Trash2,
  RotateCcw,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useTheme } from '@/hooks/useTheme';
import type { Theme, ReadingDensity } from '@/types';
import { SITE_CONFIG } from '@/config/site';
import Seo from '@/components/Seo';

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

const densityOptions: { value: ReadingDensity; label: string; desc: string }[] = [
  { value: 'compact', label: 'Compact', desc: 'Tighter spacing, more content per screen' },
  { value: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing for most readers' },
  { value: 'large', label: 'Large text', desc: 'Extra spacing and larger text size' },
];

const regions = [
  { value: 'in', label: 'India' },
  { value: 'us', label: 'United States' },
  { value: 'gb', label: 'United Kingdom' },
  { value: 'au', label: 'Australia' },
  { value: 'ca', label: 'Canada' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'Hindi' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

export default function Settings() {
  const { settings, setTheme, setReadingDensity, setDefaultCategory, setRegion, setLanguage, resetSettings } =
    useSettings();
  const { clearBookmarks, count } = useBookmarks();
  const { setTheme: setThemeDirect } = useTheme();
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const handleThemeChange = (theme: Theme) => {
    setTheme(theme);
    setThemeDirect(theme);
    flashSaved();
  };

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  return (
    <>
      <Seo title="Settings" description="Customize your PulsePress experience" url="/settings" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-amber-500" />
            Settings
          </h1>
          {savedFlash && (
            <span className="inline-flex items-center gap-1 text-sm text-green-500">
              <Check size={14} />
              Saved
            </span>
          )}
        </div>

        {/* Appearance */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-4">
            Appearance
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {themeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleThemeChange(opt.value)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  settings.theme === opt.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                }`}
              >
                <opt.icon
                  className={`w-6 h-6 ${
                    settings.theme === opt.value
                      ? 'text-amber-500'
                      : 'text-gray-400 dark:text-neutral-500'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    settings.theme === opt.value
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-gray-700 dark:text-neutral-300'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Reading */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-4">
            Reading
          </h2>
          <div className="space-y-2">
            {densityOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setReadingDensity(opt.value);
                  flashSaved();
                }}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  settings.readingDensity === opt.value
                    ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                    : 'border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`text-sm font-medium ${
                        settings.readingDensity === opt.value
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-gray-700 dark:text-neutral-300'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5">
                      {opt.desc}
                    </p>
                  </div>
                  {settings.readingDensity === opt.value && (
                    <Check className="w-5 h-5 text-amber-500" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* News preferences */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-4">
            News Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                Default category
              </label>
              <select
                value={settings.defaultCategory}
                onChange={(e) => {
                  setDefaultCategory(e.target.value);
                  flashSaved();
                }}
                className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:outline-none text-gray-900 dark:text-neutral-100 capitalize"
              >
                {SITE_CONFIG.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Region
                </label>
                <select
                  value={settings.region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    flashSaved();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:outline-none text-gray-900 dark:text-neutral-100"
                >
                  {regions.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-2">
                  Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    flashSaved();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:outline-none text-gray-900 dark:text-neutral-100"
                >
                  {languages.map((l) => (
                    <option key={l.value} value={l.value}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Storage */}
        <section className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-neutral-100 mb-4">
            Storage
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                    Clear bookmarks
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500">
                    {count} saved stor{count !== 1 ? 'ies' : 'y'}
                  </p>
                </div>
              </div>
              {confirmClear ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      clearBookmarks();
                      setConfirmClear(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-neutral-100">
                    Reset preferences
                  </p>
                  <p className="text-xs text-gray-400 dark:text-neutral-500">
                    Restore all settings to defaults
                  </p>
                </div>
              </div>
              {confirmReset ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      resetSettings();
                      setConfirmReset(false);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-neutral-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="flex items-start gap-2 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
          <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 dark:text-amber-400">
            All preferences are stored locally in your browser. They are not shared across devices.
          </p>
        </div>
      </div>
    </>
  );
}
