import { useParams, Link } from 'react-router-dom';
import { Clock, Calendar, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/blogs';
import { formatDate } from '@/utils/formatDate';
import ImageWithFallback from '@/components/ImageWithFallback';
import ReadingProgress from '@/components/ReadingProgress';
import ShareButtons from '@/components/ShareButtons';
import Seo from '@/components/Seo';
import { SITE_CONFIG } from '@/config/site';

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
          Blog post not found
        </h1>
        <p className="text-gray-500 dark:text-neutral-400 mt-2">
          The blog post you are looking for does not exist.
        </p>
        <Link
          to="/blogs"
          className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-gray-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-sm font-medium hover:opacity-80 transition-opacity"
        >
          Back to blogs
        </Link>
      </div>
    );
  }

  const related = blogPosts.filter((p) => p.id !== post.id).slice(0, 2);
  const paragraphs = post.content.split('\n\n');

  return (
    <>
      <Seo
        title={post.title}
        description={post.excerpt}
        image={post.image}
        url={`/blog/${post.slug}`}
        type="article"
      />
      <ReadingProgress />
      <article data-reading-content className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          to="/blogs"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400 hover:text-gray-900 dark:hover:text-neutral-100 transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Back to blogs
        </Link>

        <span className="text-sm font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          {post.category}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-neutral-100 leading-tight mt-3">
          {post.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-neutral-400 mt-4 leading-relaxed">
          {post.excerpt}
        </p>

        <div className="flex flex-wrap items-center gap-4 mt-6 pb-6 border-b border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <User size={14} />
            {post.author}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <Calendar size={14} />
            {formatDate(post.date)}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-neutral-400">
            <Clock size={14} />
            {post.readingTime} min read
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl">
          <ImageWithFallback
            src={post.image}
            alt={post.title}
            className="w-full h-auto"
            loading="eager"
          />
        </div>

        <div className="mt-8 max-w-none">
          {paragraphs.map((para, i) => {
            const trimmed = para.trim();
            if (!trimmed) return null;
            if (trimmed.startsWith('## ')) {
              return (
                <h2
                  key={i}
                  className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mt-8 mb-4"
                >
                  {trimmed.slice(3)}
                </h2>
              );
            }
            return (
              <p
                key={i}
                className="text-gray-700 dark:text-neutral-300 leading-relaxed mb-4 text-lg"
              >
                {trimmed}
              </p>
            );
          })}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-sm text-gray-600 dark:text-neutral-400"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Share */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
              Share:
            </span>
            <ShareButtons
              title={post.title}
              slug={post.slug}
              isExternal={false}
            />
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200 dark:border-neutral-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
              More from our blog
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map((rel) => (
                <Link key={rel.id} to={`/blog/${rel.slug}`} className="group">
                  <div className="overflow-hidden rounded-lg aspect-[16/10] mb-3">
                    <ImageWithFallback
                      src={rel.image}
                      alt={rel.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-neutral-100 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
                    {formatDate(rel.date)} · {rel.readingTime} min read
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
