import { useState } from 'react';
import { useApp } from '@/context/AppContext';

export default function WorkspaceSettings() {
  const { workspace, updateWorkspace, showToast } = useApp();
  const [form, setForm] = useState({
    name: workspace.name || 'Personal workspace',
    description: workspace.description || 'My personal contact network',
    owner: workspace.owner || '',
  });

  const handleSave = () => {
    updateWorkspace(form);
    showToast('Workspace updated successfully');
  };

  const inputClass = 'w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Workspace</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage your workspace name and description.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Workspace Name</label>
          <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Workspace Description</label>
          <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Owner Name</label>
          <input type="text" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} className={inputClass} />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={() => setForm({ name: workspace.name, description: workspace.description, owner: workspace.owner })} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">Save changes</button>
        </div>
      </div>
    </div>
  );
}
