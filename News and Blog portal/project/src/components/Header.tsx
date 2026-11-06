import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Search,
  Bookmark,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Newspaper,
  TrendingUp,
  Clock,
  FileText,
  Home as HomeIcon,
} from 'lucide-react';
import { SITE_CONFIG } from '@/config/site';
import { useTheme } from '@/hooks/useTheme';
import { useBookmarks } from '@/hooks/useBookmarks';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const { count } = useBookmarks();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HomeIcon },
    { to: '/latest', label: 'Latest', icon: Clock },
    { to: '/trending', label: 'Trending', icon: TrendingUp },
    { to: '/blogs', label: 'Blogs', icon: FileText },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm'
          : 'bg-white dark:bg-neutral-900'
      } border-b border-gray-200 dark:border-neutral-800`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2" aria-label={`${SITE_CONFIG.name} home`}>
              <div className="w-9 h-9 rounded-lg bg-gray-900 dark:bg-neutral-100 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-white dark:text-neutral-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-neutral-100">
                {SITE_CONFIG.name}
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="relative">
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  onBlur={() => setTimeout(() => setCategoriesOpen(false), 150)}
                  className="px-3 py-2 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-1"
                  aria-expanded={categoriesOpen}
                  aria-haspopup="true"
                >
                  Categories
                  <ChevronDown size={14} />
                </button>
                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-neutral-800 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-700 py-2 z-50">
                    {SITE_CONFIG.categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/category/${cat}`}
                        className="block px-4 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-700 capitalize transition-colors"
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  aria-label="Search articles"
                  className="w-40 lg:w-56 pl-9 pr-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:bg-white dark:focus:bg-neutral-900 focus:outline-none text-gray-900 dark:text-neutral-100 transition-all"
                />
              </div>
            </form>

            <Link
              to="/bookmarks"
              className="relative p-2 rounded-lg text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={`Bookmarks (${count} saved)`}
            >
              <Bookmark className="w-5 h-5" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full bg-amber-500 text-white flex items-center justify-center">
                  {count > 99 ? '99+' : count}
                </span>
              )}
            </Link>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <Link
              to="/settings"
              className="hidden sm:block p-2 rounded-lg text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Settings"
            >
              <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-neutral-600 flex items-center justify-center text-[10px] font-bold text-gray-700 dark:text-neutral-200">
                PP
              </div>
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <nav className="px-4 py-4 space-y-1" aria-label="Mobile navigation">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  aria-label="Search articles"
                  className="w-full pl-9 pr-3 py-2.5 text-sm rounded-lg bg-gray-100 dark:bg-neutral-800 border border-transparent focus:border-gray-300 dark:focus:border-neutral-600 focus:outline-none text-gray-900 dark:text-neutral-100"
                />
              </div>
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-gray-200 dark:border-neutral-800">
              <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1">
                {SITE_CONFIG.categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/category/${cat}`}
                    onClick={() => setMobileOpen(false)}
                    className="px-3 py-2 text-sm text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg capitalize transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-neutral-800">
              <Link
                to="/settings"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Settings
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
