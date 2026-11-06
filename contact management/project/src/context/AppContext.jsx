import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  loadContacts, saveContacts,
  loadGroups, saveGroups,
  loadActivity, saveActivity,
  loadTheme, saveTheme,
  loadUser, saveUser,
  loadWorkspace, saveWorkspace,
  loadProfile, saveProfile,
  loadNotifications, saveNotifications,
  loadContactPrefs, saveContactPrefs,
  loadAccent, saveAccent, applyAccent,
  loadDensity, saveDensity, applyDensity,
  exportAllData, clearAllData,
  DEFAULT_PROFILE, DEFAULT_NOTIFICATIONS, DEFAULT_CONTACT_PREFS,
} from '@/utils/storage';
import { generateId, generateGroupId, getFullName } from '@/utils/helpers';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [contacts, setContacts] = useState([]);
  const [groups, setGroups] = useState([]);
  const [activity, setActivity] = useState([]);
  const [theme, setTheme] = useState('light');
  const [user, setUser] = useState({});
  const [workspace, setWorkspace] = useState({});
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState(DEFAULT_NOTIFICATIONS);
  const [contactPrefs, setContactPrefs] = useState(DEFAULT_CONTACT_PREFS);
  const [accent, setAccent] = useState('purple');
  const [density, setDensity] = useState('comfortable');
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    setContacts(loadContacts());
    setGroups(loadGroups());
    setActivity(loadActivity());
    setTheme(loadTheme());
    setUser(loadUser());
    setWorkspace(loadWorkspace());
    setProfile(loadProfile());
    setNotifications(loadNotifications());
    setContactPrefs(loadContactPrefs());
    const a = loadAccent();
    setAccent(a);
    applyAccent(a);
    const d = loadDensity();
    setDensity(d);
    applyDensity(d);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveTheme(theme);
  }, [theme]);

  useEffect(() => { applyAccent(accent); saveAccent(accent); }, [accent]);
  useEffect(() => { applyDensity(density); saveDensity(density); }, [density]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const addActivity = useCallback((action, contactName) => {
    const entry = {
      id: Date.now(),
      action,
      contactName,
      timestamp: Date.now(),
      user: profile.firstName || user.firstName || 'User',
    };
    setActivity((prev) => {
      const updated = [entry, ...prev].slice(0, 100);
      saveActivity(updated);
      return updated;
    });
  }, [profile.firstName, user.firstName]);

  const addContact = useCallback((contactData) => {
    const now = new Date().toISOString().split('T')[0];
    const newContact = {
      ...contactData,
      id: generateId(),
      tags: contactData.tags || [],
      favorite: contactData.favorite || false,
      createdAt: now,
      updatedAt: now,
    };
    setContacts((prev) => {
      const updated = [...prev, newContact];
      saveContacts(updated);
      return updated;
    });
    addActivity('added a new contact', getFullName(newContact));
    return newContact;
  }, [addActivity]);

  const updateContact = useCallback((id, updates) => {
    let updatedContact = null;
    setContacts((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          updatedContact = { ...c, ...updates, updatedAt: new Date().toISOString().split('T')[0] };
          return updatedContact;
        }
        return c;
      });
      saveContacts(updated);
      return updated;
    });
    if (updatedContact) addActivity('updated', getFullName(updatedContact));
    return updatedContact;
  }, [addActivity]);

  const deleteContact = useCallback((id) => {
    let deletedName = '';
    setContacts((prev) => {
      const contact = prev.find((c) => c.id === id);
      if (contact) deletedName = getFullName(contact);
      const updated = prev.filter((c) => c.id !== id);
      saveContacts(updated);
      return updated;
    });
    if (deletedName) addActivity('deleted', deletedName);
  }, [addActivity]);

  const toggleFavorite = useCallback((id) => {
    let wasFav = false;
    let name = '';
    setContacts((prev) => {
      const updated = prev.map((c) => {
        if (c.id === id) {
          wasFav = c.favorite;
          name = getFullName(c);
          return { ...c, favorite: !c.favorite, updatedAt: new Date().toISOString().split('T')[0] };
        }
        return c;
      });
      saveContacts(updated);
      return updated;
    });
    addActivity(wasFav ? 'removed from favorites' : 'added to favorites', name);
  }, [addActivity]);

  const addGroup = useCallback((groupData) => {
    const newGroup = { ...groupData, id: generateGroupId() };
    setGroups((prev) => {
      const updated = [...prev, newGroup];
      saveGroups(updated);
      return updated;
    });
    return newGroup;
  }, []);

  const renameGroup = useCallback((id, name, description) => {
    setGroups((prev) => {
      const updated = prev.map((g) => (g.id === id ? { ...g, name, description } : g));
      saveGroups(updated);
      return updated;
    });
  }, []);

  const deleteGroup = useCallback((id) => {
    setGroups((prev) => {
      const updated = prev.filter((g) => g.id !== id);
      saveGroups(updated);
      return updated;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setThemeMode = useCallback((mode) => {
    if (mode === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(isDark ? 'dark' : 'light');
    } else {
      setTheme(mode);
    }
  }, []);

  const importContacts = useCallback((imported) => {
    setContacts((prev) => {
      const updated = [...prev, ...imported];
      saveContacts(updated);
      return updated;
    });
    addActivity('imported', `${imported.length} contacts`);
  }, [addActivity]);

  const updateProfile = useCallback((updates) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveProfile(updated);
      const initials = (updated.firstName.charAt(0) + (updated.lastName ? updated.lastName.charAt(0) : '')).toUpperCase();
      const newUser = { ...loadUser(), firstName: updated.firstName, lastName: updated.lastName, email: updated.email, initials };
      saveUser(newUser);
      setUser(newUser);
      return updated;
    });
  }, []);

  const updateWorkspace = useCallback((updates) => {
    setWorkspace((prev) => {
      const updated = { ...prev, ...updates };
      saveWorkspace(updated);
      return updated;
    });
  }, []);

  const updateNotifications = useCallback((updates) => {
    setNotifications((prev) => {
      const updated = { ...prev, ...updates };
      saveNotifications(updated);
      return updated;
    });
  }, []);

  const updateContactPrefs = useCallback((updates) => {
    setContactPrefs((prev) => {
      const updated = { ...prev, ...updates };
      saveContactPrefs(updated);
      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setTheme('light');
    setAccent('purple');
    setDensity('comfortable');
    setNotifications(DEFAULT_NOTIFICATIONS);
    setContactPrefs(DEFAULT_CONTACT_PREFS);
  }, []);

  const handleClearAllData = useCallback(() => {
    clearAllData();
    setContacts([]);
    setGroups([]);
    setActivity([]);
    setProfile(DEFAULT_PROFILE);
    setNotifications(DEFAULT_NOTIFICATIONS);
    setContactPrefs(DEFAULT_CONTACT_PREFS);
    setTheme('light');
    setAccent('purple');
    setDensity('comfortable');
    setUser(loadUser());
    setWorkspace(loadWorkspace());
  }, []);

  const value = {
    contacts, groups, activity, theme, user, workspace, profile,
    notifications, contactPrefs, accent, density, toasts,
    showToast, addContact, updateContact, deleteContact, toggleFavorite,
    addGroup, renameGroup, deleteGroup, toggleTheme, setThemeMode,
    importContacts, setWorkspace, saveWorkspace, updateProfile,
    updateWorkspace, updateNotifications, updateContactPrefs,
    setAccent, setDensity, resetSettings, handleClearAllData,
    exportAllData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
