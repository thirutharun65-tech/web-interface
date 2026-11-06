import { useEffect, useState } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const article = document.querySelector('article[data-reading-content]') || document.documentElement;
      const rect = article.getBoundingClientRect();
      const totalHeight = rect.height;
      const scrolled = Math.max(0, -rect.top);
      const maxScroll = totalHeight - window.innerHeight;
      if (maxScroll > 0) {
        setProgress(Math.min(100, (scrolled / maxScroll) * 100));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent"
      aria-hidden="true"
    >
      <div
        className="h-full bg-amber-500 transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
