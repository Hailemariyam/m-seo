import { seo, generateStructuredData } from '../lib/seo';
import type { Metadata } from 'next';
import SeoInspector from './components/SeoInspector';

export const metadata: Metadata = seo.generateMetadata({
  title: 'Home',
  description: 'M-SEO Next.js test application demonstrating framework-agnostic SEO with Next.js App Router',
  keywords: ['nextjs', 'seo', 'm-seo', 'react', 'typescript'],
  openGraph: {
    title: 'M-SEO Next.js Test',
    description: 'Framework-agnostic SEO for Next.js',
    type: 'website',
    images: [
      {
        url: 'http://localhost:3002/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'M-SEO Next.js Test',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'M-SEO Next.js Test',
    description: 'Framework-agnostic SEO for Next.js',
  },
});

export default function HomePage() {
  const websiteSchema = generateStructuredData('WebSite', {
    name: 'M-SEO Next.js Test',
    url: 'http://localhost:3002',
    description: 'Testing M-SEO with Next.js App Router',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'http://localhost:3002/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />

      <div className="page-header">
        <h1 className="page-title">🏠 Home</h1>
        <p className="page-subtitle">M-SEO Next.js Test Application</p>
      </div>

      <div className="card">
        <h2>Welcome to M-SEO Next.js Test</h2>
        <p>
          This application demonstrates how M-SEO works with Next.js 14 App Router,
          providing the same SEO capabilities you get with React and Vue.
        </p>

        <h3>✨ Features Demonstrated</h3>
        <div style={{ marginTop: '1rem' }}>
          <span className="badge badge-primary">Next.js 14</span>
          <span className="badge badge-primary">App Router</span>
          <span className="badge badge-success">TypeScript</span>
          <span className="badge badge-success">Metadata API</span>
          <span className="badge badge-secondary">Structured Data</span>
          <span className="badge badge-secondary">Bot Detection</span>
        </div>

        <h3>📄 Test Pages</h3>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li><strong>Home</strong> - Basic SEO setup (you are here)</li>
          <li><strong>Blog</strong> - Article with structured data</li>
          <li><strong>Product</strong> - E-commerce product schema</li>
          <li><strong>Analytics</strong> - SEO audit and bot detection</li>
          <li><strong>About</strong> - Organization schema</li>
        </ul>

        <h3>🔍 How to Test</h3>
        <ol style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>View page source (Ctrl+U or Cmd+Option+U)</li>
          <li>Look for <code>&lt;meta&gt;</code> tags in the <code>&lt;head&gt;</code></li>
          <li>Check the SEO Inspector below for live meta tag preview</li>
          <li>Use Google Rich Results Test for structured data validation</li>
        </ol>
      </div>

      <SeoInspector metadata={metadata} structuredData={websiteSchema} />
    </>
  );
}
