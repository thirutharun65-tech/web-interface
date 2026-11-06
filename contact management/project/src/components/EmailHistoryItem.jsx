import { useState } from 'react';
import { Send, Reply, RotateCcw } from 'lucide-react';
import { formatDate } from '@/utils/helpers';

export default function EmailHistoryItem({ email, onReply, onComposeAgain }) {
  const [expanded, setExpanded] = useState(false);

  const recipientLabel = email.recipients && email.recipients.length > 0
    ? email.recipients.length === 1
      ? `To: ${email.recipients[0].name} (${email.recipients[0].email})`
      : `To: ${email.recipients[0].name} + ${email.recipients.length - 1} more`
    : `To: ${email.to}`;

  return (
    <div className="border border-ink-100 dark:border-ink-700 rounded-xl overflow-hidden">
      <div
        className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-ink-50/50 dark:hover:bg-ink-700/30 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-9 h-9 rounded-lg bg-brand-50 dark:bg-brand-500/15 flex items-center justify-center shrink-0">
          <Send className="w-4 h-4 text-brand-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-ink-900 dark:text-ink-50 truncate">{email.subject || '(No subject)'}</p>
            <span className="text-xs text-ink-400 shrink-0">{formatDate(new Date(email.sentAt).toISOString())}</span>
          </div>
          <p className="text-xs text-ink-500 dark:text-ink-400 mt-0.5">{recipientLabel}</p>
          {!expanded && email.messagePreview && (
            <p className="text-xs text-ink-400 dark:text-ink-500 mt-1 truncate">{email.messagePreview}</p>
          )}
        </div>
        <span className="text-xs font-medium px-2 py-0.5 bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400 rounded-md shrink-0">
          {email.status || 'sent'}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 animate-slideUp">
          {email.recipients && email.recipients.length > 1 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-ink-400 mb-1">All recipients ({email.recipients.length})</p>
              <div className="flex flex-wrap gap-1.5">
                {email.recipients.map((r) => (
                  <span key={r.id || r.email} className="text-xs px-2 py-0.5 bg-ink-50 dark:bg-ink-700 text-ink-600 dark:text-ink-300 rounded-md">
                    {r.name} ({r.email})
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="bg-ink-50 dark:bg-ink-700/50 rounded-lg p-3 mb-3">
            <p className="text-sm text-ink-600 dark:text-ink-300 whitespace-pre-wrap">{email.messagePreview || '(No message content stored)'}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onReply(email)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-brand-600 dark:text-brand-300 bg-brand-50 dark:bg-brand-500/15 hover:bg-brand-100 dark:hover:bg-brand-500/25 rounded-lg transition-colors"
            >
              <Reply className="w-3.5 h-3.5" /> Reply
            </button>
            <button
              onClick={() => onComposeAgain(email)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Compose Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
