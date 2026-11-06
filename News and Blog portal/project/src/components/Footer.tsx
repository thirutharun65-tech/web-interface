import { Link } from 'react-router-dom';
import { Newspaper, Twitter, Facebook, Linkedin, Instagram } from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';

export default function Footer() {
  const exploreLinks = [
    { to: '/', label: 'Home' },
    { to: '/latest', label: 'Latest' },
    { to: '/trending', label: 'Trending' },
    { to: '/blogs', label: 'Blogs' },
  ];

  const categoryLinks = ['technology', 'business', 'sports', 'entertainment'];

  const companyLinks = [
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/about', label: 'Privacy' },
    { to: '/about', label: 'Terms' },
  ];

  const socialIcons = [
    { Icon: Twitter, url: SITE_CONFIG.social.twitter, label: 'Twitter' },
    { Icon: Facebook, url: SITE_CONFIG.social.facebook, label: 'Facebook' },
    { Icon: Linkedin, url: SITE_CONFIG.social.linkedin, label: 'LinkedIn' },
    { Icon: Instagram, url: SITE_CONFIG.social.instagram, label: 'Instagram' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-neutral-950 border-t border-gray-200 dark:border-neutral-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-neutral-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white dark:text-neutral-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
                {SITE_CONFIG.name}
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-neutral-400 max-w-sm leading-relaxed">
              {SITE_CONFIG.description}
            </p>
            <div className="flex gap-3 mt-5">
              {socialIcons.map(({ Icon, url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center bg-gray-200 dark:bg-neutral-800 text-gray-600 dark:text-neutral-400 hover:bg-gray-900 dark:hover:bg-neutral-100 hover:text-white dark:hover:text-neutral-900 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wider mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <ul className="space-y-2.5">
              {categoryLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/category/${cat}`}
                    className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 capitalize transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wider mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-neutral-500">
            © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 dark:text-neutral-500">
            Built with React, Vite & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
