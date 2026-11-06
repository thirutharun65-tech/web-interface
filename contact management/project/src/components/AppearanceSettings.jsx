import { useApp } from '@/context/AppContext';
import { Sun, Moon, Monitor, Palette, Gauge } from 'lucide-react';
import SettingRow from './SettingRow';

const ACCENT_OPTIONS = [
  { value: 'purple', label: 'Purple', color: '#6C5CE7' },
  { value: 'blue', label: 'Blue', color: '#0984E3' },
  { value: 'green', label: 'Green', color: '#00B894' },
  { value: 'orange', label: 'Orange', color: '#E17055' },
];

export default function AppearanceSettings() {
  const { theme, setThemeMode, accent, setAccent, density, setDensity, showToast } = useApp();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Appearance</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Customize how Contactly looks and feels.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <div className="flex items-center gap-2 mb-2">
          <Sun className="w-4 h-4 text-ink-500" />
          <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">Theme</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Light', icon: Sun },
            { value: 'dark', label: 'Dark', icon: Moon },
            { value: 'system', label: 'System', icon: Monitor },
          ].map((opt) => {
            const Icon = opt.icon;
            const isActive = (opt.value === 'system' && theme === 'system') || (opt.value !== 'system' && theme === opt.value);
            return (
              <button
                key={opt.value}
                onClick={() => { setThemeMode(opt.value); showToast(`${opt.label} theme applied`); }}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  isActive
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                    : 'border-ink-100 dark:border-ink-700 hover:border-ink-200 dark:hover:border-ink-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-500' : 'text-ink-400'}`} />
                <span className={`text-sm font-medium ${isActive ? 'text-brand-600 dark:text-brand-300' : 'text-ink-600 dark:text-ink-300'}`}>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="w-4 h-4 text-ink-500" />
          <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">Accent Color</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACCENT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setAccent(opt.value); showToast(`${opt.label} accent applied`); }}
              className={`flex items-center gap-2.5 p-3 rounded-xl border-2 transition-all ${
                accent === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-ink-100 dark:border-ink-700 hover:border-ink-200 dark:hover:border-ink-600'
              }`}
            >
              <span className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: opt.color }} />
              <span className={`text-sm font-medium ${accent === opt.value ? 'text-brand-600 dark:text-brand-300' : 'text-ink-600 dark:text-ink-300'}`}>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <div className="flex items-center gap-2 mb-4">
          <Gauge className="w-4 h-4 text-ink-500" />
          <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">Interface Density</h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier reading' },
            { value: 'compact', label: 'Compact', desc: 'Tighter spacing, more content' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setDensity(opt.value); showToast(`${opt.label} density applied`); }}
              className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 transition-all text-left ${
                density === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10'
                  : 'border-ink-100 dark:border-ink-700 hover:border-ink-200 dark:hover:border-ink-600'
              }`}
            >
              <span className={`text-sm font-semibold ${density === opt.value ? 'text-brand-600 dark:text-brand-300' : 'text-ink-900 dark:text-ink-50'}`}>{opt.label}</span>
              <span className="text-xs text-ink-500 dark:text-ink-400">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
