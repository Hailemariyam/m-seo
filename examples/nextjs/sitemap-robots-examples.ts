/**
 * M-SEO Next.js Sitemap & Robots.txt Examples
 *
 * Examples of automatic sitemap and robots.txt generation
 */

import { seo } from '@/lib/seo';
import { type MetadataRoute } from 'next';

/**
 * Example 1: Basic Sitemap
 *
 * File: app/sitemap.xml/route.ts
 */
export async function basicSitemapGET() {
  const staticPages = [
    { url: '/', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: '/about', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: '/contact', lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  return seo.generateSitemap(staticPages);
}

/**
 * Example 2: Dynamic Sitemap with Database
 */
export async function dynamicSitemapGET() {
  // Fetch all blog posts
  const posts = await fetchAllBlogPosts();

  const blogUrls = posts.map(post => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Fetch all products
  const products = await fetchAllProducts();

  const productUrls = products.map(product => ({
    url: `/products/${product.id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Combine all URLs
  const allUrls = [
    { url: '/', lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    ...blogUrls,
    ...productUrls,
  ];

  // M-SEO automatically caches this with stale-while-revalidate
  return seo.generateSitemap(allUrls);
}

/**
 * Example 3: Multi-language Sitemap with hreflang
 */
export async function multiLangSitemapGET() {
  const pages = await fetchAllPages();

  const urls = pages.map(page => ({
    url: page.path,
    lastModified: new Date(page.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: page.priority || 0.5,
    // Automatic hreflang tags for i18n
    alternates: [
      { lang: 'en', url: `https://example.com${page.path}` },
      { lang: 'es', url: `https://example.com/es${page.path}` },
      { lang: 'fr', url: `https://example.com/fr${page.path}` },
      { lang: 'de', url: `https://example.com/de${page.path}` },
      { lang: 'ja', url: `https://example.com/ja${page.path}` },
    ],
  }));

  return seo.generateSitemap(urls);
}

/**
 * Example 4: Sitemap Index (for large sites)
 *
 * File: app/sitemap.xml/route.ts
 */
export async function sitemapIndexGET() {
  // For very large sites, split into multiple sitemaps
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-blog.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`,
    {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}

/**
 * Example 5: Blog-specific Sitemap
 *
 * File: app/sitemap-blog.xml/route.ts
 */
export async function blogSitemapGET() {
  const posts = await fetchAllBlogPosts();

  const urls = posts.map(post => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: post.isStale ? 'yearly' as const : 'weekly' as const,
    priority: post.featured ? 0.9 : 0.7,
  }));

  return seo.generateSitemap(urls);
}

/**
 * Example 6: Basic Robots.txt
 *
 * File: app/robots.txt/route.ts
 */
export async function basicRobotsGET() {
  return seo.generateRobotsTxt({
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
      },
    ],
    sitemap: ['https://example.com/sitemap.xml'],
  });
}

/**
 * Example 7: Advanced Robots.txt
 */
export async function advancedRobotsGET() {
  return seo.generateRobotsTxt({
    rules: [
      // Default rule for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/api',
          '/private',
          '/tmp',
          '/*.json$',
          '/*?*',  // Avoid duplicate content from URL parameters
        ],
        crawlDelay: 10,
      },
      // Googlebot-specific rules
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
        crawlDelay: 0, // No delay for Google
      },
      // Bingbot-specific rules
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin', '/api', '/private'],
        crawlDelay: 5,
      },
      // Block bad bots
      {
        userAgent: 'BadBot',
        disallow: ['/'],
      },
    ],
    sitemap: [
      'https://example.com/sitemap.xml',
      'https://example.com/sitemap-blog.xml',
      'https://example.com/sitemap-products.xml',
    ],
    host: 'https://example.com',
  });
}

/**
 * Example 8: Environment-aware Robots.txt
 */
export async function envRobotsGET() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development/Staging: Block all crawlers
    return seo.generateRobotsTxt({
      rules: [
        {
          userAgent: '*',
          disallow: ['/'],
        },
      ],
    });
  }

  // Production: Allow crawlers
  return seo.generateRobotsTxt({
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: ['https://example.com/sitemap.xml'],
    host: 'https://example.com',
  });
}

/**
 * Example 9: Cache Invalidation
 *
 * File: app/api/revalidate-sitemap/route.ts
 */
export async function POST() {
  // Invalidate sitemap cache when content changes
  await seo.invalidateCache(['sitemap']);

  return new Response(JSON.stringify({ revalidated: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * Example 10: Using Next.js native sitemap (with M-SEO enhancement)
 *
 * File: app/sitemap.ts
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await fetchAllBlogPosts();

  return [
    {
      url: 'https://example.com',
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: 'https://example.com/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...posts.map(post => ({
      url: `https://example.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];
}

// Mock functions
async function fetchAllBlogPosts() {
  return [
    { slug: 'post-1', updatedAt: '2025-11-25', featured: true, isStale: false },
    { slug: 'post-2', updatedAt: '2025-11-20', featured: false, isStale: false },
  ];
}

async function fetchAllProducts() {
  return [
    { id: '1', updatedAt: '2025-11-25' },
    { id: '2', updatedAt: '2025-11-24' },
  ];
}

async function fetchAllPages() {
  return [
    { path: '/', updatedAt: '2025-11-25', priority: 1 },
    { path: '/about', updatedAt: '2025-11-20', priority: 0.8 },
  ];
}
