import { createNextAdapter, SeoEngine, GoogleAnalytics, BotDetection } from 'm-seo';

// Basic Next.js adapter for standard pages
export const seo = createNextAdapter({
  baseUrl: 'http://localhost:3002',
  siteName: 'M-SEO Next.js Test',
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: false,
});

// Enterprise adapter with all features
export const enterpriseSeo = createNextAdapter({
  baseUrl: 'http://localhost:3002',
  siteName: 'M-SEO Next.js Test',
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,
  seoEngine: new SeoEngine({
    siteName: 'M-SEO Next.js Test'
  }),
  googleAnalytics: new GoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
  }),
  botDetection: new BotDetection(),
});

// Helper to generate structured data
export function generateStructuredData(type: string, data: any) {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  };
}
