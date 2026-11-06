const KEYS = {
  HISTORY: "convertx_history",
  FAVORITES: "convertx_favorites",
  THEME: "convertx_theme",
  PRECISION: "convertx_precision",
};

const MAX_HISTORY = 20;

function safeGet(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Failed to read "${key}" from storage:`, err);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`Failed to write "${key}" to storage:`, err);
    return false;
  }
}

export function getHistory() {
  return safeGet(KEYS.HISTORY, []);
}

export function addHistoryEntry(entry) {
  const current = getHistory();
  const updated = [{ ...entry, id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, timestamp: new Date().toISOString() }, ...current].slice(0, MAX_HISTORY);
  safeSet(KEYS.HISTORY, updated);
  return updated;
}

export function clearHistory() {
  safeSet(KEYS.HISTORY, []);
  return [];
}

export function getFavorites() {
  return safeGet(KEYS.FAVORITES, null);
}

export function setFavorites(favorites) {
  safeSet(KEYS.FAVORITES, favorites);
  return favorites;
}

export function getTheme() {
  return safeGet(KEYS.THEME, "light");
}

export function setTheme(theme) {
  safeSet(KEYS.THEME, theme);
}

export function getPrecision() {
  return safeGet(KEYS.PRECISION, 2);
}

export function setPrecision(precision) {
  safeSet(KEYS.PRECISION, precision);
}
