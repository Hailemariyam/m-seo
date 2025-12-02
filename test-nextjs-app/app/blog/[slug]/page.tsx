import { seo, generateStructuredData } from '../../../lib/seo';
import type { Metadata } from 'next';
import SeoInspector from '../../components/SeoInspector';

const article = {
  title: 'Getting Started with M-SEO and Next.js',
  description: 'Learn how to implement SEO in your Next.js applications using M-SEO',
  author: 'M-SEO Team',
  publishedDate: '2025-12-02',
  modifiedDate: '2025-12-02',
  image: 'http://localhost:3002/blog/example.jpg',
};

export const metadata: Metadata = seo.generateMetadata({
  title: article.title,
  description: article.description,
  openGraph: {
    title: article.title,
    description: article.description,
    type: 'article',
    publishedTime: article.publishedDate,
    modifiedTime: article.modifiedDate,
    authors: [article.author],
    images: [
      {
        url: article.image,
        width: 1200,
        height: 630,
        alt: article.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: article.title,
    description: article.description,
  },
});

export default function BlogPost() {
  const articleSchema = generateStructuredData('Article', {
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'M-SEO',
      logo: {
        '@type': 'ImageObject',
        url: 'http://localhost:3002/logo.png',
      },
    },
  });

  const breadcrumbSchema = generateStructuredData('BreadcrumbList', {
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'http://localhost:3002',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'http://localhost:3002/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: 'http://localhost:3002/blog/example',
      },
    ],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="page-header">
        <h1 className="page-title">📝 {article.title}</h1>
        <p className="page-subtitle">
          By {article.author} • Published {article.publishedDate}
        </p>
      </div>

      <div className="card">
        <h2>Article Content</h2>
        <p>
          M-SEO makes it easy to add comprehensive SEO to your Next.js applications.
          This page demonstrates how to use the Next.js adapter with the App Router.
        </p>

        <h3>Key Features</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Server-side metadata generation</li>
          <li>Article structured data (JSON-LD)</li>
          <li>Breadcrumb navigation</li>
          <li>Open Graph tags for social sharing</li>
          <li>Twitter Card tags</li>
        </ul>

        <h3>How It Works</h3>
        <p>
          The <code>seo.generateMetadata()</code> function creates Next.js compatible
          metadata that gets rendered in the page <code>&lt;head&gt;</code>. The
          structured data is added via <code>&lt;script type="application/ld+json"&gt;</code>
          tags.
        </p>

        <div style={{ marginTop: '1rem' }}>
          <span className="badge badge-primary">Article Schema</span>
          <span className="badge badge-success">Breadcrumbs</span>
          <span className="badge badge-secondary">OG Tags</span>
        </div>
      </div>

      <SeoInspector
        metadata={metadata}
        structuredData={{ article: articleSchema, breadcrumbs: breadcrumbSchema }}
      />
    </>
  );
}
