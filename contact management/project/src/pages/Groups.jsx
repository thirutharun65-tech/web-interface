import { useState } from 'react';
import { FolderTree, Plus, Pencil, Trash2, Users, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import Modal from '@/components/Modal';

export default function Groups({ onSelectContact }) {
  const { groups, contacts, addGroup, renameGroup, deleteGroup, showToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', color: '#6C5CE7' });

  const COLORS = ['#6C5CE7', '#0984E3', '#00B894', '#E17055', '#FDCB6E', '#E84393', '#00CEC9', '#FD79A8'];

  const handleAdd = () => {
    if (!form.name.trim()) return;
    addGroup({ name: form.name, description: form.description, color: form.color });
    showToast('Group created successfully');
    setShowAdd(false);
    setForm({ name: '', description: '', color: '#6C5CE7' });
  };

  const handleRename = () => {
    if (!form.name.trim() || !editTarget) return;
    renameGroup(editTarget.id, form.name, form.description);
    showToast('Group updated successfully');
    setEditTarget(null);
    setForm({ name: '', description: '', color: '#6C5CE7' });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteGroup(deleteTarget.id);
    showToast('Group deleted successfully');
    setDeleteTarget(null);
  };

  const startEdit = (group) => {
    setForm({ name: group.name, description: group.description || '', color: group.color || '#6C5CE7' });
    setEditTarget(group);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Groups</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Organize contacts into custom groups</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">
          <Plus className="w-4 h-4" /> Create group
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {groups.map((group) => {
          const count = contacts.filter((c) => c.group === group.name).length;
          return (
            <div key={group.id} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: (group.color || '#6C5CE7') + '20' }}>
                  <FolderTree className="w-5 h-5" style={{ color: group.color || '#6C5CE7' }} />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => startEdit(group)} className="p-1.5 rounded-lg text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors" aria-label="Rename group">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteTarget(group)} className="p-1.5 rounded-lg text-ink-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors" aria-label="Delete group">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">{group.name}</h3>
              <p className="text-sm text-ink-500 dark:text-ink-400 mt-0.5">{group.description || 'No description'}</p>
              <div className="flex items-center gap-1.5 mt-3 text-xs text-ink-400">
                <Users className="w-3.5 h-3.5" />
                <span>{count} contact{count !== 1 ? 's' : ''}</span>
              </div>
            </div>
          );
        })}
        {groups.length === 0 && (
          <div className="col-span-full bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
            <FolderTree className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
            <p className="text-sm text-ink-500 dark:text-ink-400">No groups yet</p>
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Create group" size="sm">
        <GroupForm form={form} setForm={setForm} colors={COLORS} onSubmit={handleAdd} onCancel={() => setShowAdd(false)} submitLabel="Create group" />
      </Modal>

      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Rename group" size="sm">
        <GroupForm form={form} setForm={setForm} colors={COLORS} onSubmit={handleRename} onCancel={() => setEditTarget(null)} submitLabel="Save changes" />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete group?" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          Are you sure you want to delete "{deleteTarget?.name}"? Contacts in this group will not be deleted.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Delete group</button>
        </div>
      </Modal>
    </div>
  );
}

function GroupForm({ form, setForm, colors, onSubmit, onCancel, submitLabel }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Group name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="e.g. Work, Friends, Clients"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Description</label>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Optional description"
          className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm({ ...form, color })}
              className={`w-8 h-8 rounded-lg transition-transform ${form.color === color ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'}`}
              style={{ backgroundColor: color }}
              aria-label={`Color ${color}`}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-end gap-3 pt-2">
        <button onClick={onCancel} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
        <button onClick={onSubmit} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">{submitLabel}</button>
      </div>
    </div>
  );
}
