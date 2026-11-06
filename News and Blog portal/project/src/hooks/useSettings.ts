import { useState, useEffect, useCallback } from 'react';
import type { Settings, Theme, ReadingDensity } from '@/types';

const STORAGE_KEY = 'pulsepress_settings';

const DEFAULT_SETTINGS: Settings = {
  theme: 'system',
  readingDensity: 'comfortable',
  defaultCategory: 'world',
  region: 'in',
  language: 'en',
};

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSettings = useCallback(
    (partial: Partial<Settings>): void => {
      setSettings((prev) => {
        const updated = { ...prev, ...partial };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    []
  );

  const setTheme = useCallback(
    (theme: Theme) => updateSettings({ theme }),
    [updateSettings]
  );

  const setReadingDensity = useCallback(
    (density: ReadingDensity) => updateSettings({ readingDensity: density }),
    [updateSettings]
  );

  const setDefaultCategory = useCallback(
    (category: string) => updateSettings({ defaultCategory: category }),
    [updateSettings]
  );

  const setRegion = useCallback(
    (region: string) => updateSettings({ region }),
    [updateSettings]
  );

  const setLanguage = useCallback(
    (language: string) => updateSettings({ language }),
    [updateSettings]
  );

  const resetSettings = useCallback((): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    updateSettings,
    setTheme,
    setReadingDensity,
    setDefaultCategory,
    setRegion,
    setLanguage,
    resetSettings,
  };
}
