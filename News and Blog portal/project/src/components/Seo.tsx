import { Helmet } from 'react-helmet-async';

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function Seo({
  title,
  description = '',
  image,
  url,
  type = 'website',
}: SeoProps) {
  const fullTitle = title.includes('PulsePress') ? title : `${title} | PulsePress`;
  const siteUrl = 'https://pulsepress.example.com';
  const canonicalUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-default.png`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
