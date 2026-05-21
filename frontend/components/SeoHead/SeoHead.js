import Head from 'next/head'

export function personJsonLd({ name, jobTitle, description, url, image, sameAs = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    jobTitle,
    description,
    url,
    image,
    sameAs: sameAs.filter(Boolean),
  }
}

export function articleJsonLd({ title, description, datePublished, url, authorName }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    author: { '@type': 'Person', name: authorName },
    mainEntityOfPage: url,
  }
}

export default function SeoHead({
  title,
  description,
  canonical,
  ogImage,
  jsonLd,
  keywords,
}) {
  const fullTitle = title?.includes('|') ? title : `${title} | Baweke`

  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords?.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </Head>
  )
}
