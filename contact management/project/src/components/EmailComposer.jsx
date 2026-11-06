import { useState, useRef, useEffect } from 'react';
import { X, Minus, Maximize2, Minimize2, Paperclip, Send, Save, Trash2, RotateCcw } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { sendEmail, isEmailConfigured, saveDraft, deleteDraft, addEmailHistory } from '@/services/emailService';
import { validateEmail } from '@/utils/emailValidation';
import EmailToolbar from './EmailToolbar';
import AttachmentList from './AttachmentList';
import EmailTemplates from './EmailTemplates';
import Avatar from './Avatar';
import { getFullName } from '@/utils/helpers';

export default function EmailComposer({ contacts: recipients, onClose, onSent, draft: initialDraft, replyData }) {
  const { profile, user, showToast, addActivity, getFullName: ctxGetFullName } = useApp();
  const editorRef = useRef(null);
  const fileRef = useRef(null);
  const [mode, setMode] = useState('modal');
  const [showCc, setShowCc] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);

  const recipientList = Array.isArray(recipients) ? recipients : recipients ? [recipients] : [];

  const [form, setForm] = useState(() => {
    if (initialDraft) {
      return { cc: initialDraft.cc || '', bcc: initialDraft.bcc || '', subject: initialDraft.subject || '', message: initialDraft.message || '' };
    }
    if (replyData) {
      return { cc: '', bcc: '', subject: replyData.subject || '', message: replyData.message || '' };
    }
    return { cc: '', bcc: '', subject: '', message: '' };
  });

  const [removedIds, setRemovedIds] = useState(new Set());

  const activeRecipients = recipientList.filter((c) => !removedIds.has(c.id));

  useEffect(() => {
    if (editorRef.current && form.message) {
      editorRef.current.innerHTML = form.message;
    }
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      handleChange('message', editorRef.current.innerHTML);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleRemoveAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveRecipient = (id) => {
    setRemovedIds((prev) => new Set([...prev, id]));
  };

  const handleSaveDraft = () => {
    const draft = {
      id: initialDraft?.id || `draft_${Date.now()}`,
      contactIds: activeRecipients.map((c) => c.id),
      to: activeRecipients.map((c) => c.email).join(', '),
      cc: form.cc,
      bcc: form.bcc,
      subject: form.subject,
      message: form.message,
    };
    saveDraft(draft);
    showToast('Draft saved');
    onClose();
  };

  const handleDiscard = () => {
    if (initialDraft) {
      deleteDraft(initialDraft.id);
    }
    onClose();
  };

  const handleSend = async () => {
    if (activeRecipients.length === 0) {
      setErrors({ to: 'Please select at least one recipient.' });
      return;
    }

    const toEmails = activeRecipients.map((c) => c.email).join(', ');
    const { valid, errors: errs } = validateEmail({ to: toEmails, cc: form.cc, bcc: form.bcc, subject: form.subject, message: editorRef.current?.innerText || form.message });
    if (!valid) {
      setErrors(errs);
      return;
    }

    if (!isEmailConfigured()) {
      setErrors({ general: 'Email service is not configured. Please configure the email service before sending.' });
      return;
    }

    setSending(true);
    const useBcc = activeRecipients.length > 1 && !form.cc.trim();
    const result = await sendEmail({
      to: useBcc ? activeRecipients[0].email : toEmails,
      cc: form.cc.trim(),
      bcc: useBcc ? activeRecipients.slice(1).map((c) => c.email).join(', ') : form.bcc.trim(),
      subject: form.subject.trim(),
      message: editorRef.current?.innerHTML || form.message,
      senderName: `${profile.firstName} ${profile.lastName || ''}`.trim(),
      senderEmail: profile.email,
      attachments,
    });
    setSending(false);

    if (result.success) {
      const messagePreview = (editorRef.current?.innerText || form.message).slice(0, 200);
      const historyEntry = {
        contactIds: activeRecipients.map((c) => c.id),
        contactId: activeRecipients.length === 1 ? activeRecipients[0].id : undefined,
        recipients: activeRecipients.map((c) => ({ id: c.id, name: getFullName(c), email: c.email })),
        to: toEmails,
        subject: form.subject.trim(),
        messagePreview,
        status: 'sent',
      };
      addEmailHistory(historyEntry);
      if (onSent) onSent(historyEntry);

      if (activeRecipients.length === 1) {
        addActivity('sent email to', getFullName(activeRecipients[0]));
        showToast(`Email sent to ${getFullName(activeRecipients[0])}`);
      } else {
        addActivity('sent email to', `${activeRecipients.length} contacts`);
        showToast(`Email sent to ${activeRecipients.length} contacts`);
      }
      onClose();
    } else {
      setErrors({ general: result.error || 'Email could not be sent. Please try again.' });
    }
  };

  const inputClass = (field) =>
    `w-full px-3 py-2 text-sm bg-transparent border-0 border-b border-ink-100 dark:border-ink-700 text-ink-900 dark:text-ink-50 placeholder:text-ink-400 outline-none focus:border-brand-400 transition-colors ${errors[field] ? 'border-red-400' : ''}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-ink-900/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative bg-white dark:bg-ink-800 shadow-float w-full flex flex-col animate-scaleIn overflow-hidden ${
        mode === 'fullscreen'
          ? 'h-full sm:h-full sm:max-w-3xl mx-auto rounded-2xl'
          : mode === 'minimized'
            ? 'sm:max-w-md h-12 rounded-2xl'
            : 'h-full sm:h-auto sm:max-h-[85vh] sm:max-w-2xl mx-auto rounded-2xl'
      }`}>

        <div className="flex items-center justify-between px-4 py-2.5 bg-ink-50 dark:bg-ink-700/50 border-b border-ink-100 dark:border-ink-700">
          <span className="text-sm font-semibold text-ink-900 dark:text-ink-50">New Message</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setMode(mode === 'minimized' ? 'modal' : 'minimized')} className="p-1.5 rounded-md text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors" aria-label="Minimize">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={() => setMode(mode === 'fullscreen' ? 'modal' : 'fullscreen')} className="p-1.5 rounded-md text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors" aria-label="Expand">
              {mode === 'fullscreen' ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-1.5 rounded-md text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {mode !== 'minimized' && (
          <>
            <div className="px-4 pt-3">
              <div className="border-b border-ink-100 dark:border-ink-700 pb-2">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-ink-400 w-10 shrink-0">To</span>
                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {activeRecipients.map((c) => (
                      <span key={c.id} className="inline-flex items-center gap-1.5 px-2 py-1 bg-brand-50 dark:bg-brand-500/15 text-brand-600 dark:text-brand-300 rounded-lg text-xs font-medium">
                        {getFullName(c)}
                        <button onClick={() => handleRemoveRecipient(c.id)} className="text-brand-400 hover:text-brand-600">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {activeRecipients.length === 0 && (
                      <span className="text-xs text-red-500">No recipients selected</span>
                    )}
                  </div>
                  {!showCc && (
                    <button onClick={() => setShowCc(true)} className="text-xs text-ink-400 hover:text-ink-600 px-2 py-1 shrink-0">Cc Bcc</button>
                  )}
                </div>
              </div>
              {showCc && (
                <>
                  <div className="flex items-center border-b border-ink-100 dark:border-ink-700">
                    <span className="text-xs font-medium text-ink-400 w-10 shrink-0">Cc</span>
                    <input type="text" value={form.cc} onChange={(e) => handleChange('cc', e.target.value)} placeholder="cc@example.com" className={inputClass('cc')} />
                    {errors.cc && <span className="text-xs text-red-500 ml-2 shrink-0">{errors.cc}</span>}
                  </div>
                  <div className="flex items-center border-b border-ink-100 dark:border-ink-700">
                    <span className="text-xs font-medium text-ink-400 w-10 shrink-0">Bcc</span>
                    <input type="text" value={form.bcc} onChange={(e) => handleChange('bcc', e.target.value)} placeholder="bcc@example.com" className={inputClass('bcc')} />
                    {errors.bcc && <span className="text-xs text-red-500 ml-2 shrink-0">{errors.bcc}</span>}
                  </div>
                </>
              )}
              <div className="flex items-center border-b border-ink-100 dark:border-ink-700">
                <span className="text-xs font-medium text-ink-400 w-10 shrink-0">Subject</span>
                <input type="text" value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="Subject" className={inputClass('subject')} />
                {errors.subject && <span className="text-xs text-red-500 ml-2 shrink-0">{errors.subject}</span>}
              </div>
            </div>

            <div className="flex items-center justify-between px-4 py-2">
              <EmailTemplates
                contact={activeRecipients[0]}
                user={user}
                onApply={({ subject, message }) => {
                  handleChange('subject', subject);
                  if (editorRef.current) editorRef.current.innerHTML = message.replace(/\n/g, '<br>');
                  handleChange('message', message.replace(/\n/g, '<br>'));
                }}
              />
            </div>

            <EmailToolbar editorRef={editorRef} />

            <div className="flex-1 overflow-y-auto px-4 py-3 min-h-[200px]">
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorInput}
                className="w-full min-h-[180px] text-sm text-ink-900 dark:text-ink-50 outline-none prose-sm"
                data-placeholder="Write your message..."
                style={{ minHeight: '180px' }}
              />
            </div>

            {errors.message && <p className="px-4 text-xs text-red-500">{errors.message}</p>}

            <AttachmentList attachments={attachments} onRemove={handleRemoveAttachment} />

            {errors.general && (
              <div className="mx-4 mb-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs text-red-600 dark:text-red-400 flex-1">{errors.general}</p>
                  <button
                    onClick={() => setErrors((prev) => ({ ...prev, general: null }))}
                    className="text-xs font-medium text-red-500 hover:text-red-600 shrink-0 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Retry
                  </button>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between px-4 py-3 border-t border-ink-100 dark:border-ink-700 bg-ink-50/50 dark:bg-ink-700/30">
              <div className="flex items-center gap-2">
                <button onClick={() => fileRef.current?.click()} className="p-2 rounded-lg text-ink-500 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-600 transition-colors" aria-label="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input ref={fileRef} type="file" multiple onChange={handleFileSelect} className="hidden" />
                <button onClick={handleSaveDraft} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-600 dark:text-ink-300 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors">
                  <Save className="w-3.5 h-3.5" /> Save Draft
                </button>
                <button onClick={handleDiscard} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-500 dark:text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Discard
                </button>
                {activeRecipients.length > 1 && (
                  <span className="text-xs text-ink-400 ml-2">Recipients: {activeRecipients.length}</span>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={sending || activeRecipients.length === 0}
                className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 rounded-xl shadow-soft transition-colors"
              >
                {sending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Send
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
