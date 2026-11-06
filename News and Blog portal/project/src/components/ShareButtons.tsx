import { useState } from 'react';
import { Link2, Share2, MessageCircle, Twitter, Facebook, Linkedin, Check } from 'lucide-react';
import { shareTargets, nativeShare, copyLink } from '@/utils/share';
import { SITE_CONFIG } from '@/config/site';

interface ShareButtonsProps {
  title: string;
  slug: string;
  isExternal?: boolean;
  externalUrl?: string;
  variant?: 'horizontal' | 'vertical' | 'compact';
}

export default function ShareButtons({
  title,
  slug,
  isExternal = false,
  externalUrl,
  variant = 'horizontal',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = isExternal && externalUrl
    ? externalUrl
    : `${SITE_CONFIG.url}/article/${slug}`;

  const handleCopy = async () => {
    const success = await copyLink(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleNativeShare = async () => {
    await nativeShare(shareUrl, title);
  };

  const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement> & { size?: number | string }>> = {
    MessageCircle,
    Twitter,
    Facebook,
    Linkedin,
  };

  const layoutClasses =
    variant === 'vertical'
      ? 'flex-col gap-2'
      : variant === 'compact'
        ? 'flex-row gap-1.5'
        : 'flex-row gap-2';

  const buttonClasses =
    variant === 'vertical'
      ? 'w-10 h-10'
      : variant === 'compact'
        ? 'w-8 h-8'
        : 'w-10 h-10';

  const iconSize = variant === 'compact' ? 14 : 18;

  return (
    <div className={`flex ${layoutClasses}`}>
      <button
        onClick={handleCopy}
        aria-label="Copy link"
        className={`${buttonClasses} flex items-center justify-center rounded-lg transition-colors ${
          copied
            ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30'
            : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800'
        }`}
      >
        {copied ? <Check size={iconSize} /> : <Link2 size={iconSize} />}
      </button>

      <button
        onClick={handleNativeShare}
        aria-label="Share via device"
        className={`${buttonClasses} flex items-center justify-center rounded-lg text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors`}
      >
        <Share2 size={iconSize} />
      </button>

      {Object.entries(shareTargets).map(([key, target]) => {
        const Icon = iconMap[target.icon] || Link2;
        return (
          <a
            key={key}
            href={target.url(shareUrl, title)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Share on ${target.name}`}
            className={`${buttonClasses} flex items-center justify-center rounded-lg text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors`}
          >
            <Icon size={iconSize} />
          </a>
        );
      })}
    </div>
  );
}
