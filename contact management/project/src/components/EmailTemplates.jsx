import { FileText, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const TEMPLATES = [
  {
    id: 'follow-up',
    label: 'Follow-up',
    subject: 'Following up with you',
    message: 'Hi {{firstName}},\n\nI wanted to follow up with you regarding our previous conversation.\n\nBest regards,\n{{userName}}',
  },
  {
    id: 'meeting',
    label: 'Meeting Request',
    subject: 'Meeting request',
    message: 'Hi {{firstName}},\n\nI would like to schedule a meeting with you to discuss our next steps.\n\nPlease let me know your availability.\n\nBest regards,\n{{userName}}',
  },
  {
    id: 'introduction',
    label: 'Introduction',
    subject: 'Introduction',
    message: 'Hi {{firstName}},\n\nI wanted to introduce myself and connect with you.\n\nBest regards,\n{{userName}}',
  },
  {
    id: 'thank-you',
    label: 'Thank You',
    subject: 'Thank you',
    message: 'Hi {{firstName}},\n\nThank you for your time and support. I truly appreciate it.\n\nBest regards,\n{{userName}}',
  },
  {
    id: 'birthday',
    label: 'Birthday',
    subject: 'Happy Birthday!',
    message: 'Hi {{firstName}},\n\nWishing you a very happy birthday! Hope you have a wonderful day.\n\nBest regards,\n{{userName}}',
  },
  {
    id: 'project-update',
    label: 'Project Update',
    subject: 'Project update',
    message: 'Hi {{firstName}},\n\nHere is a quick update on our project status and next steps.\n\nBest regards,\n{{userName}}',
  },
];

export function applyTemplate(template, contact, user) {
  const firstName = contact?.firstName || '';
  const userName = user?.firstName || '';
  return {
    subject: template.subject.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{userName\}\}/g, userName),
    message: template.message.replace(/\{\{firstName\}\}/g, firstName).replace(/\{\{userName\}\}/g, userName),
  };
}

export { TEMPLATES };

export default function EmailTemplates({ contact, user, onApply }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-600 dark:text-ink-300 bg-ink-50 dark:bg-ink-700 hover:bg-ink-100 dark:hover:bg-ink-600 rounded-lg transition-colors"
      >
        <FileText className="w-3.5 h-3.5" /> Templates
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute top-full mt-1 left-0 w-44 bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl shadow-float overflow-hidden z-20 animate-slideUp">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  const applied = applyTemplate(t, contact, user);
                  onApply(applied);
                  setOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-ink-600 dark:text-ink-300 hover:bg-ink-50 dark:hover:bg-ink-700/50 transition-colors"
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
