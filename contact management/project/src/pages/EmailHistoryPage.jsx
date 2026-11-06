import { useState, useMemo } from 'react';
import { Search, Mail, Inbox } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { loadEmailHistory } from '@/services/emailService';
import { formatDate, getFullName } from '@/utils/helpers';
import EmailHistoryItem from '@/components/EmailHistoryItem';

export default function EmailHistoryPage({ onReply, onComposeAgain }) {
  const { contacts } = useApp();
  const [search, setSearch] = useState('');
  const [history, setHistory] = useState(loadEmailHistory());

  const filtered = useMemo(() => {
    if (!search.trim()) return history;
    const q = search.toLowerCase();
    return history.filter((e) =>
      (e.to || '').toLowerCase().includes(q) ||
      (e.subject || '').toLowerCase().includes(q) ||
      (e.messagePreview || '').toLowerCase().includes(q) ||
      (e.contactName || '').toLowerCase().includes(q)
    );
  }, [history, search]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">Email History</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400">{history.length} email{history.length !== 1 ? 's' : ''} sent</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by recipient, subject, or message..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-ink-800 border border-ink-200 dark:border-ink-600 rounded-xl text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-500/20"
        />
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
        {filtered.length > 0 ? (
          <div className="space-y-2">
            {filtered.map((email) => {
              const contact = contacts.find((c) => c.id === email.contactId);
              const recipientLabel = email.recipients && email.recipients.length > 0
                ? email.recipients.length === 1
                  ? `${email.recipients[0].name} (${email.recipients[0].email})`
                  : `${email.recipients[0].name} + ${email.recipients.length - 1} more`
                : email.to;
              return (
                <div key={email.id} className="border border-ink-100 dark:border-ink-700 rounded-xl p-4 hover:bg-ink-50/50 dark:hover:bg-ink-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-brand-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{email.subject || '(No subject)'}</p>
                        <span className="text-xs text-ink-400 shrink-0">{formatDate(new Date(email.sentAt).toISOString())}</span>
                      </div>
                      <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">
                        To: {recipientLabel} {contact && `· ${getFullName(contact)}`}
                      </p>
                      {email.messagePreview && (
                        <p className="text-xs text-ink-400 dark:text-ink-500 mt-1 line-clamp-2">{email.messagePreview}</p>
                      )}
                      <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 rounded-md">
                        {email.status || 'sent'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center">
            <Inbox className="w-10 h-10 text-ink-300 dark:text-ink-600 mx-auto mb-3" />
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {search ? `No emails found for "${search}"` : 'No emails sent yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
