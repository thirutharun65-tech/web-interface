import { useState, useMemo } from 'react';
import { Plus, Download } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { filterContacts, sortContacts, toCSV, downloadCSV, getFullName } from '@/utils/helpers';
import FilterBar from '@/components/FilterBar';
import ContactTable from '@/components/ContactTable';
import ContactCard from '@/components/ContactCard';
import Modal from '@/components/Modal';
import ContactForm from '@/components/ContactForm';

export default function Contacts({ onSelectContact, onEditContact, onSendEmail }) {
  const { contacts, groups, addContact, deleteContact, showToast } = useApp();
  const [filters, setFilters] = useState({ search: '', category: 'all', group: 'all', favorite: false, sortBy: 'recent' });
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const filtered = useMemo(() => {
    const result = filterContacts(contacts, filters);
    return sortContacts(result, filters.sortBy);
  }, [contacts, filters]);

  const handleExport = () => {
    const csv = toCSV(contacts);
    downloadCSV(csv, 'contactly-export.csv');
    showToast('CSV exported successfully');
  };

  const handleAdd = (formData) => {
    addContact(formData);
    showToast('Contact added successfully');
    setShowAdd(false);
  };

  const handleDelete = () => {
    deleteContact(deleteTarget.id);
    showToast('Contact deleted successfully');
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Contacts</h1>
          <p className="text-sm text-ink-500 dark:text-ink-400">Manage and organize your professional and personal relationships.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="flex items-center gap-2 px-3.5 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-xl hover:bg-ink-50 dark:hover:bg-ink-700 transition-colors">
            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Export</span>
          </button>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-xl shadow-soft transition-colors">
            <Plus className="w-4 h-4" /> Add contact
          </button>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} groups={groups} />

      <div className="hidden lg:block">
        <ContactTable
          contacts={filtered}
          onView={onSelectContact}
          onEdit={onEditContact}
          onDelete={setDeleteTarget}
          onSendEmail={onSendEmail}
        />
      </div>
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filtered.map((c) => (
          <ContactCard key={c.id} contact={c} onView={onSelectContact} onEdit={onEditContact} onDelete={setDeleteTarget} onSendEmail={onSendEmail} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
            <p className="text-sm text-ink-500 dark:text-ink-400">No contacts found</p>
          </div>
        )}
      </div>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add new contact" size="lg">
        <ContactForm onSave={handleAdd} onCancel={() => setShowAdd(false)} />
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete contact?" size="sm">
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">
          Are you sure you want to permanently delete {deleteTarget ? getFullName(deleteTarget) : 'this contact'}? This action cannot be undone.
        </p>
        <div className="flex items-center justify-end gap-3">
          <button onClick={() => setDeleteTarget(null)} className="px-4 py-2.5 text-sm font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700 rounded-xl transition-colors">Cancel</button>
          <button onClick={handleDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">Delete contact</button>
        </div>
      </Modal>
    </div>
  );
}
