import { useState, useEffect } from 'react';
import { X, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { validateContact } from '@/utils/validation';

const CATEGORIES = ['Personal', 'Work', 'Family', 'Clients', 'Other'];

const EMPTY_CONTACT = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  alternatePhone: '',
  company: '',
  jobTitle: '',
  category: 'Personal',
  group: '',
  tags: [],
  address: '',
  notes: '',
  birthday: '',
  followUpDate: '',
  favorite: false,
};

export default function ContactForm({ initial, onSave, onCancel, isEdit }) {
  const { groups, showToast } = useApp();
  const [form, setForm] = useState(initial || EMPTY_CONTACT);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    setForm(initial || EMPTY_CONTACT);
  }, [initial]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags.includes(tag)) {
      handleChange('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag) => {
    handleChange('tags', form.tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { valid, errors: errs } = validateContact(form);
    if (!valid) {
      setErrors(errs);
      return;
    }
    onSave({
      ...form,
      tags: form.tags,
      favorite: form.favorite || false,
    });
  };

  const inputClass = (field) =>
    `w-full px-3.5 py-2.5 text-sm rounded-xl border bg-white dark:bg-ink-700 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none transition-all focus:ring-2 focus:ring-brand-500/20 ${
    errors[field]
      ? 'border-red-300 dark:border-red-500/50'
      : 'border-ink-200 dark:border-ink-600 focus:border-brand-400'
  }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleChange('favorite', !form.favorite)}
            className={`p-2 rounded-lg transition-colors ${form.favorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/15' : 'text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700'}`}
            aria-label="Toggle favorite"
          >
            <Star className={`w-5 h-5 ${form.favorite ? 'fill-yellow-400' : ''}`} />
          </button>
          <span className="text-sm text-ink-500 dark:text-ink-400">
            {form.favorite ? 'Marked as favorite' : 'Mark as favorite'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            className={inputClass('firstName')}
            placeholder="John"
          />
          {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            className={inputClass('lastName')}
            placeholder="Doe"
          />
          {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={inputClass('email')}
            placeholder="john@example.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Phone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={inputClass('phone')}
            placeholder="+1 (555) 000-0000"
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Alternate Phone</label>
          <input
            type="tel"
            value={form.alternatePhone}
            onChange={(e) => handleChange('alternatePhone', e.target.value)}
            className={inputClass('alternatePhone')}
            placeholder="+1 (555) 000-0000"
          />
          {errors.alternatePhone && <p className="text-xs text-red-500 mt-1">{errors.alternatePhone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Company</label>
          <input
            type="text"
            value={form.company}
            onChange={(e) => handleChange('company', e.target.value)}
            className={inputClass('company')}
            placeholder="Acme Inc."
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Job Title</label>
          <input
            type="text"
            value={form.jobTitle}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className={inputClass('jobTitle')}
            placeholder="Product Manager"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className={inputClass('category')}
          >
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Group</label>
          <select
            value={form.group}
            onChange={(e) => handleChange('group', e.target.value)}
            className={inputClass('group')}
          >
            <option value="">No group</option>
            {groups.map((g) => <option key={g.id} value={g.name}>{g.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Birthday</label>
          <input
            type="date"
            value={form.birthday}
            onChange={(e) => handleChange('birthday', e.target.value)}
            className={inputClass('birthday')}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Follow-up Date</label>
        <input
          type="date"
          value={form.followUpDate}
          onChange={(e) => handleChange('followUpDate', e.target.value)}
          className={inputClass('followUpDate')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Tags</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
            className={inputClass('tags')}
            placeholder="Add a tag and press Enter"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="px-4 py-2.5 text-sm font-medium text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/15 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/25 transition-colors shrink-0"
          >
            Add
          </button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {form.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 rounded-lg">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-brand-800">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Address</label>
        <input
          type="text"
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className={inputClass('address')}
          placeholder="123 Main St, City, Country"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink-700 dark:text-ink-300 mb-1.5">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          rows={3}
          className={inputClass('notes')}
          placeholder="Additional notes about this contact..."
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-5 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors"
        >
          {isEdit ? 'Save changes' : 'Save contact'}
        </button>
      </div>
    </form>
  );
}
