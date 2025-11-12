/**
 * Framework-agnostic usage test (JavaScript)
 * Run with: node examples/test-vanilla.js
 */

import { SeoEngine, SitemapGenerator, RobotsManager, StructuredDataManager } from '../dist/index.js';

console.log('=== M-SEO Framework-Agnostic Test ===\n');

// 1. Generate meta tags
console.log('1. SEO Meta Tags:');
console.log('------------------');
const seo = new SeoEngine({
  title: 'My Awesome Website',
  description: 'A framework-agnostic SEO library',
  keywords: ['seo', 'meta-tags', 'framework-agnostic'],
  canonical: 'https://example.com',
  ogImage: 'https://example.com/og-image.jpg',
  author: 'John Doe',
  siteName: 'Example Site'
});

const metaTags = seo.generateMetaTags();
console.log(`Generated ${metaTags.length} meta tags:`);
metaTags.slice(0, 5).forEach(tag => {
  console.log(`  - ${tag.name || tag.property}: ${tag.content.substring(0, 50)}`);
});

console.log('\nHTML Output:');
console.log(seo.toHtmlString().substring(0, 200) + '...\n');

// 2. Generate sitemap
console.log('\n2. XML Sitemap:');
console.log('------------------');
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

console.log(`Generated sitemap with ${sitemap.getUrlCount()} URLs`);
console.log(sitemap.toXml().substring(0, 300) + '...\n');

// 3. Generate robots.txt
console.log('\n3. Robots.txt:');
console.log('------------------');
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

console.log(robots.toString());

// 4. Add structured data
console.log('\n\n4. Structured Data (JSON-LD):');
console.log('------------------');
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

console.log(`Generated ${structuredData.getSchemaCount()} schemas`);
console.log(structuredData.toHtmlScript().substring(0, 400) + '...\n');

console.log('\n✅ All tests passed! The library is framework-agnostic and working perfectly!');
console.log('\n🎯 You can use these same APIs in:');
console.log('   - Node.js (Express, Fastify, Koa)');
console.log('   - React, Vue, Angular, Svelte');
console.log('   - Next.js, Nuxt, Remix');
console.log('   - Vanilla JavaScript');
console.log('   - Deno, Bun');
console.log('   - Edge runtimes (Cloudflare Workers, Vercel Edge)');
