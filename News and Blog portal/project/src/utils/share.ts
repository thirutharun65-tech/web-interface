export interface ShareTarget {
  name: string;
  icon: string;
  url: (articleUrl: string, title: string) => string;
}

export const shareTargets: Record<string, ShareTarget> = {
  whatsapp: {
    name: 'WhatsApp',
    icon: 'MessageCircle',
    url: (u, t) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}`,
  },
  x: {
    name: 'X',
    icon: 'Twitter',
    url: (u, t) => `https://twitter.com/intent/tweet?text=${encodeURIComponent(t)}&url=${encodeURIComponent(u)}`,
  },
  facebook: {
    name: 'Facebook',
    icon: 'Facebook',
    url: (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  linkedin: {
    name: 'LinkedIn',
    icon: 'Linkedin',
    url: (u, t) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&title=${encodeURIComponent(t)}`,
  },
};

export async function nativeShare(url: string, title: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({ title, url });
      return true;
    } catch {
      return false;
    }
  }
  return false;
}

export async function copyLink(url: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
}
