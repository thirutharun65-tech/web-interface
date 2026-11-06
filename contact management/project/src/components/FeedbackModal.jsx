import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { loadFeedback, saveFeedback } from '@/utils/storage';
import Modal from './Modal';

const FEEDBACK_TYPES = ['Bug Report', 'Feature Request', 'General Feedback', 'Other'];

export default function FeedbackModal({ open, onClose }) {
  const { profile, showToast } = useApp();
  const [form, setForm] = useState({
    name: profile.firstName || '',
    email: profile.email || '',
    type: 'General Feedback',
    message: '',
  });

  const handleSubmit = () => {
    if (!form.message.trim()) return;
    const feedback = loadFeedback();
    feedback.push({ ...form, timestamp: Date.now() });
    saveFeedback(feedback);
    showToast('Thank you for your feedback!');
    setForm({ ...form, message: '' });
    onClose();
  };

  const inputClass = 'w-full px-3.5 py-2.5 text-sm rounded-xl border border-ink-200 dark:border-ink-600 bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20';

  return (
    <Modal open={open} onClose={onClose} title="Send Feedback" size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Feedback type</label>
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputClass}>
            {FEEDBACK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Message</label>
          <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us what you think..." className={inputClass} />
        </div>
        <div className="flex items-center justify-end gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleSubmit} disabled={!form.message.trim()} className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-50 rounded-xl shadow-soft transition-colors">Submit Feedback</button>
        </div>
      </div>
    </Modal>
  );
}
