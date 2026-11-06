import { useState } from 'react';
import { Newspaper } from 'lucide-react';

interface ImageWithFallbackProps {
  src: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export default function ImageWithFallback({
  src,
  alt,
  className = '',
  loading = 'lazy',
}: ImageWithFallbackProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 dark:bg-neutral-800 ${className}`}
        role="img"
        aria-label={alt}
      >
        <Newspaper className="w-10 h-10 text-gray-400 dark:text-neutral-600" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
