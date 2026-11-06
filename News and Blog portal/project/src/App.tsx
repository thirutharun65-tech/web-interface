import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Home = lazy(() => import('@/pages/Home'));
const Latest = lazy(() => import('@/pages/Latest'));
const Category = lazy(() => import('@/pages/Category'));
const Article = lazy(() => import('@/pages/Article'));
const Blogs = lazy(() => import('@/pages/Blogs'));
const BlogDetail = lazy(() => import('@/pages/BlogDetail'));
const Trending = lazy(() => import('@/pages/Trending'));
const Search = lazy(() => import('@/pages/Search'));
const Bookmarks = lazy(() => import('@/pages/Bookmarks'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

function PageLoader() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-pulse">
      <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-800 rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="h-48 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
            <div className="mt-3 h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded" />
            <div className="mt-2 h-6 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 transition-colors">
          <Header />
          <main className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/latest" element={<Latest />} />
                <Route path="/category/:category" element={<Category />} />
                <Route path="/article/:slug" element={<Article />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/trending" element={<Trending />} />
                <Route path="/search" element={<Search />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </HelmetProvider>
  );
}
