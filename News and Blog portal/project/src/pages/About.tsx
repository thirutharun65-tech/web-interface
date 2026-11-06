import { Newspaper, Target, Eye, Mail } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import Seo from '@/components/Seo';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      text: 'To deliver accurate, in-depth reporting that helps readers understand the world — not just consume headlines.',
    },
    {
      icon: Eye,
      title: 'Editorial Focus',
      text: 'We cover world events, technology, business, science, and culture with an emphasis on context and analysis over speed.',
    },
    {
      icon: Newspaper,
      title: 'Content Approach',
      text: 'Every story is sourced from verified news APIs and wire services. We do not fabricate content or generate articles with AI.',
    },
  ];

  return (
    <>
      <Seo title="About" description={SITE_CONFIG.description} url="/about" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-neutral-100 flex items-center justify-center mx-auto mb-4">
            <Newspaper className="w-8 h-8 text-white dark:text-neutral-900" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100">
            About {SITE_CONFIG.name}
          </h1>
          <p className="text-lg text-gray-500 dark:text-neutral-400 mt-3 max-w-2xl mx-auto">
            {SITE_CONFIG.tagline}
          </p>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p className="text-gray-700 dark:text-neutral-300 leading-relaxed">
            {SITE_CONFIG.description} We believe journalism should inform, not
            inflame. In an era of infinite content and shrinking attention
            spans, we focus on what matters: accuracy, context, and clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {values.map((v) => (
            <div
              key={v.title}
              className="p-6 rounded-xl bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700"
            >
              <div className="w-12 h-12 rounded-lg bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4">
                <v.icon className="w-6 h-6 text-amber-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-neutral-100">
                {v.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2 leading-relaxed">
                {v.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 rounded-xl bg-gray-900 dark:bg-neutral-800 text-center">
          <Mail className="w-8 h-8 text-amber-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-white dark:text-neutral-100">
            Get in touch
          </h2>
          <p className="text-gray-400 dark:text-neutral-400 mt-2">
            Have a tip, question, or feedback? We'd love to hear from you.
          </p>
          <a
            href={`mailto:${SITE_CONFIG.contactEmail}`}
            className="inline-block mt-4 px-5 py-2.5 rounded-lg bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-colors"
          >
            {SITE_CONFIG.contactEmail}
          </a>
        </div>
      </div>
    </>
  );
}
