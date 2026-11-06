import { Link } from 'react-router-dom';
import { FileText, ArrowRight } from 'lucide-react';
import { blogPosts } from '@/data/blogs';
import { formatDate } from '@/utils/formatDate';
import ImageWithFallback from '@/components/ImageWithFallback';
import Seo from '@/components/Seo';

export default function Blogs() {
  return (
    <>
      <Seo
        title="Blogs"
        description="In-depth analysis and commentary from the PulsePress editorial team"
        url="/blogs"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 inline-flex items-center gap-3">
            <FileText className="w-8 h-8 text-amber-500" />
            Editorial Blogs
          </h1>
          <p className="text-gray-500 dark:text-neutral-400 mt-2 max-w-2xl">
            In-depth analysis, commentary, and perspectives from our editorial team on media, journalism, and the stories behind the news.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="group flex flex-col"
            >
              <div className="overflow-hidden rounded-xl aspect-[16/10]">
                <ImageWithFallback
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex-1 mt-4">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  {post.category}
                </span>
                <h2 className="font-bold text-lg text-gray-900 dark:text-neutral-100 leading-snug mt-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2 mt-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500 mt-3">
                  <span>{post.author}</span>
                  <span aria-hidden="true">·</span>
                  <span>{formatDate(post.date)}</span>
                  <span aria-hidden="true">·</span>
                  <span>{post.readingTime} min read</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400 mt-3 group-hover:gap-2 transition-all">
                Read blog <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
