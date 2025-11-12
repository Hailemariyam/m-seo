/**
 * Framework-agnostic usage example
 * This code works in ANY JavaScript environment
 */

import { SeoEngine, SitemapGenerator, RobotsManager, StructuredDataManager } from '../src/index.js';

// 1. Generate meta tags
const seo = new SeoEngine({
  title: 'My Awesome Website',
  description: 'A framework-agnostic SEO library',
  keywords: ['seo', 'meta-tags', 'framework-agnostic'],
  canonical: 'https://example.com',
  ogImage: 'https://example.com/og-image.jpg',
  author: 'John Doe',
  siteName: 'Example Site'
});

// Get meta tags as objects (use in React, Vue, etc.)
const metaTags = seo.generateMetaTags();
console.log('Meta Tags:', metaTags);

// Or get as HTML string (for SSR, static sites)
const htmlString = seo.toHtmlString();
console.log('\nHTML Meta Tags:\n', htmlString);

// 2. Generate sitemap
const sitemap = new SitemapGenerator({
  hostname: 'https://example.com'
});

sitemap
  .addUrl({
    loc: '/',
    changefreq: 'daily',
    priority: 1.0
  })
  .addUrl({
    loc: '/about',
    changefreq: 'weekly',
    priority: 0.8
  })
  .addUrl({
    loc: '/blog',
    changefreq: 'daily',
    priority: 0.9,
    lastmod: new Date()
  });

console.log('\nSitemap XML:\n', sitemap.toXml());

// 3. Generate robots.txt
const robots = new RobotsManager();

robots
  .addRule({
    userAgent: 'Googlebot',
    allow: ['/'],
  })
  .addRule({
    userAgent: '*',
    disallow: ['/admin/', '/private/']
  })
  .setSitemap('https://example.com/sitemap.xml');

console.log('\nRobots.txt:\n', robots.toString());

// 4. Add structured data
const structuredData = new StructuredDataManager();

structuredData
  .addWebsite({
    name: 'Example Website',
    url: 'https://example.com',
    description: 'A great website'
  })
  .addOrganization({
    name: 'Example Org',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png'
  })
  .addArticle({
    headline: 'My First Article',
    description: 'An interesting article',
    datePublished: '2025-01-01',
    author: { name: 'Jane Doe' }
  });

console.log('\nStructured Data:\n', structuredData.toHtmlScript());
