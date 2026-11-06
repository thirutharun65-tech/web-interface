import { Rocket, Users, Clock, FolderTree, ArrowUpDown, Settings, Shield, Wrench } from 'lucide-react';

const CATEGORIES = [
  { id: 'getting-started', label: 'Getting Started', desc: 'Learn the basics of Contactly.', icon: Rocket, color: '#6C5CE7' },
  { id: 'contacts', label: 'Contacts', desc: 'Create, edit, search, and organize contacts.', icon: Users, color: '#0984E3' },
  { id: 'follow-ups', label: 'Follow-ups', desc: 'Learn how reminders and follow-up dates work.', icon: Clock, color: '#00B894' },
  { id: 'groups', label: 'Groups', desc: 'Organize contacts into groups.', icon: FolderTree, color: '#E17055' },
  { id: 'import-export', label: 'Import & Export', desc: 'Move contact data in and out of Contactly.', icon: ArrowUpDown, color: '#FDCB6E' },
  { id: 'settings', label: 'Settings', desc: 'Customize your Contactly experience.', icon: Settings, color: '#6C5CE7' },
  { id: 'privacy', label: 'Privacy & Data', desc: 'How Contactly stores data locally.', icon: Shield, color: '#E84393' },
  { id: 'troubleshooting', label: 'Troubleshooting', desc: 'Solutions for common problems.', icon: Wrench, color: '#00CEC9' },
];

export { CATEGORIES };

export default function HelpCategoryCard({ category, onClick }) {
  const Icon = category.icon;
  return (
    <button
      onClick={() => onClick(category)}
      className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all text-left group"
    >
      <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: (category.color || '#6C5CE7') + '20' }}>
        <Icon className="w-5 h-5" style={{ color: category.color }} />
      </div>
      <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 group-hover:text-brand-500 transition-colors">{category.label}</h3>
      <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{category.desc}</p>
    </button>
  );
}
