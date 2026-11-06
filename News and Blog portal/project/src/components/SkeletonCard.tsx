interface SkeletonCardProps {
  variant?: 'featured' | 'horizontal' | 'compact' | 'grid';
}

export default function SkeletonCard({ variant = 'grid' }: SkeletonCardProps) {
  if (variant === 'featured') {
    return (
      <div className="animate-pulse">
        <div className="h-[400px] bg-gray-200 dark:bg-neutral-800 rounded-lg" />
        <div className="mt-4 h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-3 h-8 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-3 h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-2 h-4 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded" />
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className="flex gap-4 animate-pulse">
        <div className="w-32 h-24 bg-gray-200 dark:bg-neutral-800 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3 w-16 bg-gray-200 dark:bg-neutral-800 rounded" />
          <div className="mt-2 h-5 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
          <div className="mt-2 h-4 w-2/3 bg-gray-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="animate-pulse">
        <div className="h-4 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded" />
        <div className="mt-2 h-3 w-1/2 bg-gray-200 dark:bg-neutral-800 rounded" />
      </div>
    );
  }

  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-neutral-800 rounded-lg" />
      <div className="mt-3 h-3 w-20 bg-gray-200 dark:bg-neutral-800 rounded" />
      <div className="mt-2 h-6 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
      <div className="mt-2 h-4 w-full bg-gray-200 dark:bg-neutral-800 rounded" />
      <div className="mt-2 h-3 w-1/3 bg-gray-200 dark:bg-neutral-800 rounded" />
    </div>
  );
}
