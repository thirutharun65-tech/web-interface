import { Send, Mail } from 'lucide-react';
import EmailHistoryItem from './EmailHistoryItem';

export default function EmailHistory({ emails, onReply, onComposeAgain, onSendEmail }) {
  return (
    <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-bold text-ink-900 dark:text-ink-50">Email History</h3>
          {emails.length > 0 && (
            <span className="text-xs font-medium px-2 py-0.5 bg-ink-50 dark:bg-ink-700 text-ink-500 dark:text-ink-400 rounded-md">{emails.length}</span>
          )}
        </div>
        {onSendEmail && (
          <button
            onClick={onSendEmail}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 rounded-lg transition-colors"
          >
            <Send className="w-3.5 h-3.5" /> Send Email
          </button>
        )}
      </div>

      {emails.length > 0 ? (
        <div className="space-y-2">
          {emails.map((email) => (
            <EmailHistoryItem
              key={email.id}
              email={email}
              onReply={onReply}
              onComposeAgain={onComposeAgain}
            />
          ))}
        </div>
      ) : (
        <div className="py-10 text-center">
          <Mail className="w-8 h-8 text-ink-300 dark:text-ink-600 mx-auto mb-2" />
          <p className="text-sm text-ink-500 dark:text-ink-400">No emails sent yet</p>
          {onSendEmail && (
            <button
              onClick={onSendEmail}
              className="mt-3 text-sm font-medium text-brand-500 hover:text-brand-600"
            >
              Send your first email →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
