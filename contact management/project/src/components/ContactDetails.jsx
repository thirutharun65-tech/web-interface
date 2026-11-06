import { useState, useEffect } from 'react';
import { Star, Mail, Phone, Building2, Briefcase, MapPin, Calendar, Clock, Tag, FileText, ArrowLeft, Pencil, Trash2, Send } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getFullName, formatDate, relativeDayLabel, getAge } from '@/utils/helpers';
import { getEmailsForContact } from '@/services/emailService';
import Avatar from './Avatar';
import EmailHistory from './EmailHistory';

export default function ContactDetails({ contact, onEdit, onDelete, onBack, onSendEmail, onReply, onComposeAgain }) {
  const { toggleFavorite } = useApp();
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    if (contact) {
      setEmails(getEmailsForContact(contact.id));
    }
  }, [contact]);

  if (!contact) return null;

  const fields = [
    { icon: Mail, label: 'Email', value: contact.email, isEmail: true },
    { icon: Phone, label: 'Phone', value: contact.phone, isPhone: true },
    { icon: Phone, label: 'Alternate Phone', value: contact.alternatePhone, isPhone: true },
    { icon: Building2, label: 'Company', value: contact.company },
    { icon: Briefcase, label: 'Job Title', value: contact.jobTitle },
    { icon: MapPin, label: 'Address', value: contact.address },
    { icon: Calendar, label: 'Birthday', value: contact.birthday ? `${formatDate(contact.birthday)}${getAge(contact.birthday) != null ? ` (age ${getAge(contact.birthday)})` : ''}` : '' },
    { icon: Clock, label: 'Follow-up', value: contact.followUpDate ? `${formatDate(contact.followUpDate)} · ${relativeDayLabel(contact.followUpDate)}` : '' },
    { icon: FileText, label: 'Notes', value: contact.notes },
  ].filter((f) => f.value);

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to contacts
      </button>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-brand-500 to-brand-400" />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <Avatar contact={contact} size="xl" ring />
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => toggleFavorite(contact.id)}
                className={`p-2 rounded-lg transition-colors ${contact.favorite ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-500/15' : 'text-ink-400 hover:bg-ink-50 dark:hover:bg-ink-700'}`}
                aria-label="Toggle favorite"
              >
                <Star className={`w-5 h-5 ${contact.favorite ? 'fill-yellow-400' : ''}`} />
              </button>
              {contact.email && (
                <button onClick={() => onSendEmail(contact)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors">
                  <Send className="w-4 h-4" /> Send Email
                </button>
              )}
              <button onClick={() => onEdit(contact)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button onClick={() => onDelete(contact)} className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-500 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{getFullName(contact)}</h2>
          <p className="text-sm text-ink-500 dark:text-ink-400">{contact.jobTitle || 'No title'}{contact.company ? ` at ${contact.company}` : ''}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium px-2.5 py-1 bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 rounded-lg">
              {contact.category}
            </span>
            {contact.group && (
              <span className="text-xs font-medium px-2.5 py-1 bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 rounded-lg">
                {contact.group}
              </span>
            )}
            {contact.tags && contact.tags.map((tag) => (
              <span key={tag} className="text-xs font-medium px-2.5 py-1 bg-ink-50 dark:bg-ink-700 text-ink-500 dark:text-ink-400 rounded-lg flex items-center gap-1">
                <Tag className="w-3 h-3" /> {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 mb-4">Contact Information</h3>
        <div className="space-y-4">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-ink-50 dark:bg-ink-700 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-ink-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-ink-400 dark:text-ink-500">{field.label}</p>
                  {field.isEmail && field.value ? (
                    <a href={`mailto:${field.value}`} className="text-sm text-brand-500 hover:underline break-words">{field.value}</a>
                  ) : field.isPhone && field.value ? (
                    <a href={`tel:${field.value}`} className="text-sm text-brand-500 hover:underline break-words">{field.value}</a>
                  ) : (
                    <p className="text-sm text-ink-900 dark:text-ink-50 break-words">{field.value}</p>
                  )}
                </div>
              </div>
            );
          })}
          {fields.length === 0 && <p className="text-sm text-ink-500">No additional information</p>}
        </div>
      </div>

      <EmailHistory
        emails={emails}
        onReply={onReply}
        onComposeAgain={onComposeAgain}
        onSendEmail={() => onSendEmail(contact)}
      />

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6">
        <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 mb-4">Metadata</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-ink-400 dark:text-ink-500">Created</p>
            <p className="text-sm text-ink-900 dark:text-ink-50">{formatDate(contact.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-ink-400 dark:text-ink-500">Last updated</p>
            <p className="text-sm text-ink-900 dark:text-ink-50">{formatDate(contact.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
