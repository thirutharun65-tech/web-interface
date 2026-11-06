import { ArrowLeft } from 'lucide-react';
import { CATEGORIES } from './HelpCategoryCard';
import { FAQ_ITEMS } from './FAQAccordion';

const ARTICLES = {
  'getting-started': {
    title: 'Getting started with Contactly',
    content: [
      { heading: 'Welcome to Contactly', body: 'Contactly is a contact management application that helps you organize your professional and personal relationships. All data is stored locally in your browser.' },
      { heading: 'Your dashboard', body: 'The dashboard shows statistics, a growth chart, upcoming follow-ups, and birthdays. Everything is calculated from your actual contact data.' },
      { heading: 'Adding your first contact', body: 'Click the Add Contact button on the dashboard or contacts page. Fill in the form with at least first name, last name, and category, then save.' },
      { heading: 'Navigation', body: 'Use the sidebar to switch between Overview, Contacts, Follow-ups, Birthdays, Favorites, Groups, Import & Export, Activity, Settings, and Help Center.' },
    ],
  },
  'contacts': {
    title: 'Managing your contacts',
    content: [
      { heading: 'Adding contacts', body: 'Click Add Contact and fill in the form. First name, last name, and category are required. You can also add email, phone, company, job title, birthday, follow-up date, tags, and notes.' },
      { heading: 'Editing contacts', body: 'Click the menu icon on any contact and select Edit, or open the contact details page and click Edit.' },
      { heading: 'Searching contacts', body: 'Use the search bar at the top to search across names, emails, phones, companies, job titles, tags, and categories. Press Ctrl+K to focus the search.' },
      { heading: 'Deleting contacts', body: 'Open the contact menu and select Delete. A confirmation dialog will appear before the contact is permanently removed.' },
    ],
  },
  'follow-ups': {
    title: 'Using follow-ups effectively',
    content: [
      { heading: 'Setting follow-ups', body: 'When adding or editing a contact, set a Follow-up Date. This helps you track when to reconnect.' },
      { heading: 'Follow-up view', body: 'The Follow-ups page groups contacts by Overdue, Today, Tomorrow, This week, and Upcoming so you can prioritize.' },
      { heading: 'Dashboard widget', body: 'The dashboard shows your next 5 follow-ups in the upcoming panel. Click any to open the contact.' },
    ],
  },
  'groups': {
    title: 'Organizing contacts with groups',
    content: [
      { heading: 'Creating groups', body: 'Go to Groups and click Create Group. Give it a name, description, and color.' },
      { heading: 'Assigning contacts', body: 'When adding or editing a contact, select a group from the Group dropdown.' },
      { heading: 'Managing groups', body: 'Rename or delete groups from the Groups page. Deleting a group does not delete its contacts.' },
    ],
  },
  'import-export': {
    title: 'Importing and exporting data',
    content: [
      { heading: 'Exporting to CSV', body: 'Go to Import & Export and click Export to CSV. A file will download with all your contacts.' },
      { heading: 'Importing from CSV', body: 'Select a CSV file, preview the parsed contacts, and click Import. The contacts will be added to your existing list.' },
      { heading: 'Full backup', body: 'For a complete backup including groups, activity, and settings, go to Settings → Privacy & Data → Export all data to download a JSON file.' },
    ],
  },
  'settings': {
    title: 'Customizing Contactly',
    content: [
      { heading: 'Theme', body: 'Switch between Light, Dark, and System themes in Settings → Appearance.' },
      { heading: 'Accent color', body: 'Choose from Purple, Blue, Green, or Orange. The accent color updates buttons, navigation, and charts instantly.' },
      { heading: 'Density', body: 'Switch between Comfortable (more spacing) and Compact (tighter layout) in Settings → Appearance.' },
      { heading: 'Notifications', body: 'Toggle follow-up, birthday, and contact update notifications in Settings → Notifications.' },
    ],
  },
  'privacy': {
    title: 'Understanding privacy and local storage',
    content: [
      { heading: 'Where is my data?', body: 'All data is stored in your browser\'s localStorage. No data is sent to any server.' },
      { heading: 'Exporting data', body: 'Export all data as a JSON backup from Settings → Privacy & Data. This includes contacts, groups, activity, profile, and settings.' },
      { heading: 'Clearing data', body: 'Use the Danger Zone in Settings → Privacy & Data to permanently clear all local data. This cannot be undone.' },
    ],
  },
  'troubleshooting': {
    title: 'Common problems and solutions',
    content: [
      { heading: 'Data not persisting', body: 'If your data resets on reload, ensure your browser allows localStorage. Private browsing modes may clear it.' },
      { heading: 'Dark mode not working', body: 'Try toggling the theme from Settings → Appearance, or clear your browser cache.' },
      { heading: 'Import failed', body: 'Ensure your CSV file has the correct headers (First Name, Last Name, Email, etc.). Use the exported CSV as a template.' },
      { heading: 'App is slow', body: 'Try switching to Compact density or reducing the number of contacts displayed.' },
    ],
  },
};

export default function HelpArticle({ categoryId, onBack }) {
  const category = CATEGORIES.find((c) => c.id === categoryId);
  const article = ARTICLES[categoryId];
  const relatedFaqs = FAQ_ITEMS.filter((f) => f.category === categoryId);

  if (!article) return null;

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-ink-500 dark:text-ink-400 hover:text-ink-900 dark:hover:text-ink-50 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Help Center
      </button>

      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-50">{article.title}</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mt-1">{category?.desc}</p>
      </div>

      <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl shadow-soft p-6 space-y-6">
        {article.content.map((section, i) => (
          <div key={i}>
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-2">{section.heading}</h2>
            <p className="text-sm text-ink-500 dark:text-ink-400 leading-relaxed">{section.body}</p>
          </div>
        ))}
      </div>

      {relatedFaqs.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Related questions</h3>
          <div className="space-y-2">
            {relatedFaqs.map((faq, i) => (
              <details key={i} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-xl px-5 py-3">
                <summary className="text-sm font-semibold text-ink-900 dark:text-ink-50 cursor-pointer">{faq.q}</summary>
                <p className="text-sm text-ink-500 dark:text-ink-400 mt-2">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
