import { useState, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Download, Upload, Trash2, AlertTriangle } from 'lucide-react';
import Modal from './Modal';

export default function PrivacyData() {
  const { exportAllData, handleClearAllData, showToast, contacts, groups, activity } = useApp();
  const [showImport, setShowImport] = useState(false);
  const [showClear, setShowClear] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [importData, setImportData] = useState(null);
  const fileRef = useRef(null);

  const handleExport = () => {
    const data = exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'contactly-backup.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('All data exported successfully');
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        if (parsed.contacts && Array.isArray(parsed.contacts)) {
          setImportData(parsed);
        } else {
          showToast('Invalid backup file format', 'error');
        }
      } catch {
        showToast('Invalid JSON file', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!importData) return;
    if (importData.contacts) {
      localStorage.setItem('contactly_contacts', JSON.stringify(importData.contacts));
    }
    if (importData.groups) {
      localStorage.setItem('contactly_groups', JSON.stringify(importData.groups));
    }
    if (importData.activity) {
      localStorage.setItem('contactly_activity', JSON.stringify(importData.activity));
    }
    if (importData.profile) {
      localStorage.setItem('contactly_profile', JSON.stringify(importData.profile));
    }
    if (importData.workspace) {
      localStorage.setItem('contactly_workspace', JSON.stringify(importData.workspace));
    }
    showToast('Data imported successfully. Reloading...');
    setShowImport(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  const handleClear = () => {
    handleClearAllData();
    showToast('All data cleared');
    setShowClear(false);
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Privacy & Data</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage your local data and privacy settings.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 mb-2">Local Data</h3>
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">
          Your contacts and application preferences are stored locally in your browser. No data is sent to any server.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button onClick={handleExport} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">
            <Download className="w-4 h-4" /> Export all data
          </button>
          <button onClick={() => fileRef.current?.click()} className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-xl transition-colors">
            <Upload className="w-4 h-4" /> Import data
          </button>
          <input ref={fileRef} type="file" accept=".json" onChange={handleFile} className="hidden" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-3">
            <p className="text-lg font-bold text-ink-900 dark:text-ink-50">{contacts.length}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">Contacts</p>
          </div>
          <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-3">
            <p className="text-lg font-bold text-ink-900 dark:text-ink-50">{groups.length}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">Groups</p>
          </div>
          <div className="bg-ink-50 dark:bg-ink-700/50 rounded-xl p-3">
            <p className="text-lg font-bold text-ink-900 dark:text-ink-50">{activity.length}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">Activities</p>
          </div>
        </div>
      </div>

      <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h3 className="text-sm font-bold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          This will permanently remove contacts, groups, activities, preferences, and profile information stored in this browser.
        </p>
        <button onClick={() => setShowClear(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
          <Trash2 className="w-4 h-4" /> Clear all local data
        </button>
      </div>

      <Modal open={showImport} onClose={() => setShowImport(false)} title="Import data?" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          {importData
            ? `This will replace your current data with ${importData.contacts?.length || 0} contacts, ${importData.groups?.length || 0} groups, and related settings. Are you sure?`
            : 'Select a backup file to import.'}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setShowImport(false)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleImport} disabled={!importData} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 rounded-xl transition-colors">Import data</button>
        </div>
      </Modal>

      <Modal open={showClear} onClose={() => { setShowClear(false); setConfirmText(''); }} title="Clear all data" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-4">
          This action cannot be undone. Type <span className="font-bold text-red-500">DELETE</span> to confirm.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-500/20 mb-6"
        />
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => { setShowClear(false); setConfirmText(''); }} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleClear} disabled={confirmText !== 'DELETE'} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors">Clear all data</button>
        </div>
      </Modal>
    </div>
  );
}
