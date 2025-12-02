import { seo, generateStructuredData } from '../../lib/seo';
import type { Metadata } from 'next';
import SeoInspector from '../components/SeoInspector';

export const metadata: Metadata = seo.generateMetadata({
  title: 'About Us',
  description: 'Learn about M-SEO - framework-agnostic SEO toolkit for modern web applications',
  openGraph: {
    title: 'About M-SEO',
    description: 'Framework-agnostic SEO toolkit',
    type: 'website',
  },
});

export default function AboutPage() {
  const organizationSchema = generateStructuredData('Organization', {
    name: 'M-SEO',
    url: 'http://localhost:3002',
    logo: 'http://localhost:3002/logo.png',
    description: 'Framework-agnostic SEO toolkit for modern web applications',
    sameAs: [
      'https://github.com/Hailemariyam/m-seo',
      'https://npmjs.com/package/m-seo',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@m-seo.dev',
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      <div className="page-header">
        <h1 className="page-title">ℹ️ About M-SEO</h1>
        <p className="page-subtitle">Framework-agnostic SEO toolkit</p>
      </div>

      <div className="card">
        <h2>What is M-SEO?</h2>
        <p>
          M-SEO is a TypeScript SEO library that works with React, Vue, Next.js, Express,
          and vanilla JavaScript. It provides a consistent API across all frameworks.
        </p>

        <h3>Why Framework-Agnostic?</h3>
        <p>
          Teams often manage multiple projects with different frameworks. M-SEO lets you
          use the same SEO tools everywhere - no need to learn different libraries for
          each framework.
        </p>

        <h3>Key Features</h3>
        <div className="grid" style={{ marginTop: '1rem' }}>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ color: 'var(--primary)' }}>Multi-Framework</h4>
            <p>React, Vue, Next.js, Express, Vanilla JS</p>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ color: 'var(--primary)' }}>Zero Dependencies</h4>
            <p>Pure TypeScript, no external packages</p>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ color: 'var(--primary)' }}>Enterprise Ready</h4>
            <p>Analytics, audits, bot detection</p>
          </div>
          <div style={{ background: 'var(--light)', padding: '1rem', borderRadius: '4px' }}>
            <h4 style={{ color: 'var(--primary)' }}>TypeScript First</h4>
            <p>Full type definitions included</p>
          </div>
        </div>

        <h3 style={{ marginTop: '1.5rem' }}>Organization Schema</h3>
        <p>
          This page includes Organization structured data, which helps search engines
          understand your business information.
        </p>
      </div>

      <SeoInspector metadata={metadata} structuredData={organizationSchema} />
    </>
  );
}
