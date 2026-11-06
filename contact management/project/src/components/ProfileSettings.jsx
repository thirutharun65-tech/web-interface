import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getInitials } from '@/utils/helpers';

const AVATAR_COLORS = [
  '#6C5CE7', '#0984E3', '#00B894', '#E17055',
  '#FDCB6E', '#E84393', '#00CEC9', '#FD79A8',
];

export default function ProfileSettings() {
  const { profile, updateProfile, showToast } = useApp();
  const [form, setForm] = useState(profile);

  const handleSave = () => {
    updateProfile(form);
    showToast('Profile updated successfully');
  };

  const inputClass = 'w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">Profile</h2>
        <p className="text-sm text-ink-500 dark:text-ink-400">Manage your personal information and avatar.</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: form.avatarColor || '#6C5CE7' }}
          >
            {getInitials(form.firstName, form.lastName)}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink-900 dark:text-ink-50">{form.firstName} {form.lastName}</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">{form.email}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-ink-700 dark:text-ink-300 mb-2">Avatar color</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {AVATAR_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setForm({ ...form, avatarColor: color })}
                className={`w-8 h-8 rounded-lg transition-transform ${form.avatarColor === color ? 'ring-2 ring-offset-2 ring-brand-500 scale-110' : 'hover:scale-105'}`}
                style={{ backgroundColor: color }}
                aria-label={`Avatar color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">First Name</label>
            <input type="text" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Last Name</label>
            <input type="text" value={form.lastName || ''} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Job Title</label>
            <input type="text" value={form.jobTitle || ''} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Phone</label>
            <input type="tel" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Bio</label>
            <textarea rows={3} value={form.bio || ''} onChange={(e) => setForm({ ...form, bio: e.target.value })} className={inputClass} />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button onClick={() => setForm(profile)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSave} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">Save changes</button>
        </div>
      </div>
    </div>
  );
}
