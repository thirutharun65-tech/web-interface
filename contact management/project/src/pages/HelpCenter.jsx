import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import HelpSearch from '@/components/HelpSearch';
import { CATEGORIES } from '@/components/HelpCategoryCard';
import HelpCategoryCard from '@/components/HelpCategoryCard';
import FAQAccordion, { FAQ_ITEMS } from '@/components/FAQAccordion';
import HelpArticle from '@/components/HelpArticle';
import SupportCard from '@/components/SupportCard';
import FeedbackModal from '@/components/FeedbackModal';

const POPULAR_ARTICLES = [
  { id: 'getting-started', title: 'Getting started with Contactly', desc: 'Learn the basics and set up your workspace.' },
  { id: 'contacts', title: 'Managing your contacts', desc: 'Add, edit, search, and organize contacts.' },
  { id: 'groups', title: 'Organizing contacts with groups', desc: 'Create and manage contact groups.' },
  { id: 'follow-ups', title: 'Using follow-ups effectively', desc: 'Stay on top of your follow-up schedule.' },
  { id: 'import-export', title: 'Importing and exporting data', desc: 'Move your data in and out of Contactly.' },
  { id: 'privacy', title: 'Understanding privacy and local storage', desc: 'How your data is stored and protected.' },
];

const QUICK_HELP = [
  { id: 'contacts', title: 'Add a contact', desc: 'Learn how to add your first contact.' },
  { id: 'groups', title: 'Organize contacts', desc: 'Learn about groups, categories, and tags.' },
  { id: 'follow-ups', title: 'Manage follow-ups', desc: 'Learn how to stay connected.' },
];

export default function HelpCenter() {
  const { showToast } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleContactSupport = () => {
    window.location.href = 'mailto:support@contactly.app?subject=Contactly%20Support%20Request';
    showToast('Opening email client...', 'info');
  };

  const searchResults = query.trim()
    ? FAQ_ITEMS.filter((f) => {
        const q = query.toLowerCase();
        return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      })
    : null;

  const popularResults = query.trim()
    ? POPULAR_ARTICLES.filter((a) => a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase()))
    : POPULAR_ARTICLES;

  if (selectedCategory) {
    return (
      <div>
        <HelpArticle categoryId={selectedCategory} onBack={() => setSelectedCategory(null)} />
        <div className="mt-8">
          <SupportCard onContactSupport={handleContactSupport} onSendFeedback={() => setShowFeedback(true)} />
        </div>
        <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center pt-4">
        <h1 className="text-3xl font-bold text-ink-900 dark:text-ink-50 mb-2">How can we help?</h1>
        <p className="text-sm text-ink-500 dark:text-ink-400 mb-6">Find answers, learn how Contactly works, or get support.</p>
        <HelpSearch query={query} setQuery={setQuery} />
      </div>

      {searchResults ? (
        <div className="space-y-6">
          {searchResults.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">FAQ results</h2>
              <FAQAccordion items={searchResults} />
            </div>
          )}
          {popularResults.length > 0 && (
            <div>
              <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularResults.map((a) => (
                  <button key={a.id} onClick={() => setSelectedCategory(a.id)} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all text-left">
                    <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">{a.title}</h3>
                    <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{a.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
          {searchResults.length === 0 && popularResults.length === 0 && (
            <div className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl py-16 text-center">
              <p className="text-sm text-ink-500 dark:text-ink-400">No results found for "{query}"</p>
            </div>
          )}
        </div>
      ) : (
        <>
          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Help categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CATEGORIES.map((cat) => (
                <HelpCategoryCard key={cat.id} category={cat} onClick={(c) => setSelectedCategory(c.id)} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Popular articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POPULAR_ARTICLES.map((a) => (
                <button key={a.id} onClick={() => setSelectedCategory(a.id)} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft hover:shadow-card transition-all text-left group">
                  <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50 group-hover:text-brand-500 transition-colors">{a.title}</h3>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1">{a.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Quick help</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUICK_HELP.map((h) => (
                <div key={h.id} className="bg-white dark:bg-ink-800 border border-ink-100 dark:border-ink-700 rounded-2xl p-5 shadow-soft">
                  <h3 className="text-sm font-bold text-ink-900 dark:text-ink-50">{h.title}</h3>
                  <p className="text-xs text-ink-500 dark:text-ink-400 mt-1 mb-3">{h.desc}</p>
                  <button onClick={() => setSelectedCategory(h.id)} className="text-sm font-medium text-brand-500 hover:text-brand-600 flex items-center gap-1">
                    Learn more →
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-base font-bold text-ink-900 dark:text-ink-50 mb-3">Frequently asked questions</h2>
            <FAQAccordion />
          </div>
        </>
      )}

      <SupportCard onContactSupport={handleContactSupport} onSendFeedback={() => setShowFeedback(true)} />
      <FeedbackModal open={showFeedback} onClose={() => setShowFeedback(false)} />
    </div>
  );
}
