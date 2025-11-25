// src/adapters/NextAdapter.ts

/**
 * M-SEO Next.js Adapter
 *
 * A comprehensive SEO solution for Next.js that surpasses next-seo with:
 * - Advanced middleware integration (caching, security, headers, geo-targeting)
 * - Native Next.js 13+ Metadata API support
 * - App Router and Pages Router support
 * - Built-in internationalization with hreflang
 * - Automatic sitemap and robots.txt generation
 * - Enhanced structured data with validation
 * - Performance optimization with caching
 * - Security headers with SEO considerations
 * - Geographic SEO for multi-region sites
 */

import { CacheManager } from '../middleware/CacheManager.js';
import { GeoSeo } from '../middleware/GeoSeo.js';
import { HeaderManager, type HeaderManagerOptions } from '../middleware/HeaderManager.js';
import { SecurityHeaders, SECURITY_PRESETS } from '../middleware/SecurityHeaders.js';

/**
 * Next.js SEO configuration for basic metadata
 */
export interface NextSeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    siteName?: string;
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
    locale?: string;
    type?: string;
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
  };
  twitter?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    images?: string[];
  };
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    noimageindex?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
    googleBot?: Record<string, unknown>;
  };
  languageAlternates?: Array<{
    hrefLang: string;
    href: string;
  }>;
  verification?: {
    google?: string;
    yandex?: string;
    bing?: string;
    other?: Record<string, string>;
  };
}

/**
 * Next.js App Router specific configuration
 */
export interface NextAppSeoConfig extends NextSeoConfig {
  viewport?: {
    width?: string | number;
    initialScale?: number;
    maximumScale?: number;
    userScalable?: boolean;
    themeColor?: string | Array<{ media: string; color: string }>;
  };
  icons?: {
    icon?: string | string[];
    apple?: string | string[];
    other?: Array<{ rel: string; url: string }>;
  };
  manifest?: string;
  appleWebApp?: {
    title?: string;
    statusBarStyle?: 'default' | 'black' | 'black-translucent';
  };
}

/**
 * Next.js adapter options
 */
export interface NextAdapterOptions {
  baseUrl: string;
  siteName: string;
  defaultLocale?: string;
  locales?: string[];
  enableCaching?: boolean;
  cacheOptions?: {
    defaultTtl?: number;
    namespace?: string;
  };
  enableSecurity?: boolean;
  securityPreset?: 'strict' | 'balanced' | 'relaxed';
  customSecurityHeaders?: Record<string, string>;
  enableGeoSeo?: boolean;
  geoOptions?: {
    enableAutoDetection?: boolean;
    defaultRegion?: string;
    supportedRegions?: string[];
  };
  enableAutoSitemap?: boolean;
  enableResourceHints?: boolean;
  preconnectDomains?: string[];
  dnsPrefetchDomains?: string[];

  // Level 3: Enterprise modules
  seoEngine?: any;
  sitemapGenerator?: any;
  urlManager?: any;
  i18n?: any;
  structuredDataManager?: any;
  googleAnalytics?: any;
  botDetection?: any;
  seoAuditEngine?: any;
  seoReportGenerator?: any;
}

/**
 * Next.js Adapter for M-SEO
 */
export class NextAdapter {
  private cache?: CacheManager;
  private geoSeo?: GeoSeo;
  private headerManager?: HeaderManager;
  private security?: SecurityHeaders;
  private options: NextAdapterOptions;

  // Level 3: Enterprise modules
  public seoEngine?: any;
  public sitemapGenerator?: any;
  public urlManager?: any;
  public i18n?: any;
  public structuredDataManager?: any;
  public googleAnalytics?: any;
  public botDetection?: any;
  public seoAuditEngine?: any;
  public seoReportGenerator?: any;

  constructor(options: NextAdapterOptions) {
    this.options = options;

    if (options.enableCaching) {
      this.cache = new CacheManager(options.cacheOptions);
    }

    if (options.enableGeoSeo) {
      this.geoSeo = new GeoSeo({
        supportedRegions: options.geoOptions?.supportedRegions || ['US'],
        defaultCountry: options.geoOptions?.defaultRegion || 'US',
        enableAutoDetection: options.geoOptions?.enableAutoDetection ?? true,
      });
    }

    if (options.enableSecurity) {
      const preset = options.securityPreset || 'balanced';
      const presetConfig = SECURITY_PRESETS[preset];
      // Create a mutable copy of the preset
      const mutableConfig = JSON.parse(JSON.stringify(presetConfig));
      this.security = new SecurityHeaders(mutableConfig);
    }

    const headerOptions: HeaderManagerOptions = {
      customHeaders: options.customSecurityHeaders,
    };

    this.headerManager = new HeaderManager(headerOptions);

    // Level 3: Enterprise modules
    this.seoEngine = options.seoEngine;
    this.sitemapGenerator = options.sitemapGenerator;
    this.urlManager = options.urlManager;
    this.i18n = options.i18n;
    this.structuredDataManager = options.structuredDataManager;
    this.googleAnalytics = options.googleAnalytics;
    this.botDetection = options.botDetection;
    this.seoAuditEngine = options.seoAuditEngine;
    this.seoReportGenerator = options.seoReportGenerator;
  }
  // Level 3: Advanced helpers
  runSeoAudit(url: string): Promise<any> {
    if (this.seoAuditEngine) {
      return this.seoAuditEngine.audit(url);
    }
    throw new Error('SeoAuditEngine not configured');
  }

  getAnalyticsInstance(): any {
    return this.googleAnalytics;
  }

  detectBot(userAgent: string): any {
    if (this.botDetection) {
      return this.botDetection.isBot(userAgent);
    }
    return false;
  }

  getBotInfo(userAgent: string): any {
    if (this.botDetection) {
      return this.botDetection.getBotInfo(userAgent);
    }
    return null;
  }

  generateMetadata(config: NextSeoConfig): Record<string, unknown> {
    const metadata: Record<string, unknown> = {};

    if (config.title) metadata.title = config.title;
    if (config.description) metadata.description = config.description;
    if (config.keywords) metadata.keywords = config.keywords.join(', ');

    if (config.openGraph) {
      metadata.openGraph = {
        title: config.openGraph.title || config.title,
        description: config.openGraph.description || config.description,
        url: config.openGraph.url || this.options.baseUrl,
        siteName: config.openGraph.siteName || this.options.siteName,
        images: config.openGraph.images,
        locale: config.openGraph.locale || this.options.defaultLocale || 'en_US',
        type: config.openGraph.type || 'website',
        ...(config.openGraph.publishedTime && { publishedTime: config.openGraph.publishedTime }),
        ...(config.openGraph.modifiedTime && { modifiedTime: config.openGraph.modifiedTime }),
        ...(config.openGraph.authors && { authors: config.openGraph.authors }),
      };
    }

    if (config.twitter) {
      metadata.twitter = {
        card: config.twitter.card || 'summary_large_image',
        site: config.twitter.site,
        creator: config.twitter.creator,
        title: config.twitter.title || config.title,
        description: config.twitter.description || config.description,
        images: config.twitter.images,
      };
    }

    if (config.robots) {
      const robotsConfig: Record<string, unknown> = {};
      if (config.robots.index !== undefined) robotsConfig.index = config.robots.index;
      if (config.robots.follow !== undefined) robotsConfig.follow = config.robots.follow;
      if (config.robots.noarchive) robotsConfig.noarchive = true;
      if (config.robots.nosnippet) robotsConfig.nosnippet = true;
      if (config.robots.noimageindex) robotsConfig.noimageindex = true;
      if (config.robots.maxSnippet) robotsConfig['max-snippet'] = config.robots.maxSnippet;
      if (config.robots.maxImagePreview) robotsConfig['max-image-preview'] = config.robots.maxImagePreview;
      if (config.robots.maxVideoPreview) robotsConfig['max-video-preview'] = config.robots.maxVideoPreview;
      if (config.robots.googleBot) robotsConfig.googleBot = config.robots.googleBot;

      metadata.robots = robotsConfig;
    }

    if (config.languageAlternates) {
      metadata.alternates = {
        languages: config.languageAlternates.reduce((acc, alt) => {
          acc[alt.hrefLang] = alt.href;
          return acc;
        }, {} as Record<string, string>),
      };
    }

    if (config.canonical) {
      metadata.alternates = {
        ...(metadata.alternates as Record<string, unknown> || {}),
        canonical: config.canonical,
      };
    }

    if (config.verification) {
      metadata.verification = config.verification;
    }

    return metadata;
  }

  generateViewport(config?: NextAppSeoConfig['viewport']): Record<string, unknown> {
    return {
      width: config?.width || 'device-width',
      initialScale: config?.initialScale || 1,
      maximumScale: config?.maximumScale || 5,
      userScalable: config?.userScalable !== false,
      themeColor: config?.themeColor,
    };
  }

  generateJsonLd(data: Record<string, unknown>): string {
    const jsonLd = {
      '@context': 'https://schema.org',
      ...data,
    };
    return JSON.stringify(jsonLd);
  }

  generateMiddlewareHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    if (this.security) {
      const securityHeaders = this.security.getHeaders();
      Object.assign(headers, securityHeaders);
    }

    if (this.headerManager) {
      const perfHeaders = this.headerManager.getHeaders();
      Object.assign(headers, perfHeaders);
    }

    if (this.options.enableResourceHints) {
      const hints: string[] = [];

      if (this.options.preconnectDomains) {
        this.options.preconnectDomains.forEach(domain => {
          hints.push('<' + domain + '>; rel=preconnect');
        });
      }

      if (this.options.dnsPrefetchDomains) {
        this.options.dnsPrefetchDomains.forEach(domain => {
          hints.push('<' + domain + '>; rel=dns-prefetch');
        });
      }

      if (hints.length > 0) {
        headers['Link'] = hints.join(', ');
      }
    }

    return headers;
  }

  generateSitemap(urls: Array<{
    url: string;
    lastModified?: Date;
    changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
    priority?: number;
    alternates?: Array<{ lang: string; url: string }>;
  }>): Response {
    const cacheKey = 'sitemap';

    if (this.cache) {
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return new Response(cached as string, {
          headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
          },
        });
      }
    }

    const xmlParts = ['<?xml version="1.0" encoding="UTF-8"?>'];
    xmlParts.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    xmlParts.push('        xmlns:xhtml="http://www.w3.org/1999/xhtml">');

    urls.forEach(entry => {
      const fullUrl = entry.url.startsWith('http') ? entry.url : this.options.baseUrl + entry.url;
      xmlParts.push('  <url>');
      xmlParts.push('    <loc>' + fullUrl + '</loc>');
      if (entry.lastModified) {
        xmlParts.push('    <lastmod>' + entry.lastModified.toISOString() + '</lastmod>');
      }
      if (entry.changeFrequency) {
        xmlParts.push('    <changefreq>' + entry.changeFrequency + '</changefreq>');
      }
      if (entry.priority !== undefined) {
        xmlParts.push('    <priority>' + entry.priority + '</priority>');
      }
      if (entry.alternates) {
        entry.alternates.forEach(alt => {
          xmlParts.push('    <xhtml:link rel="alternate" hreflang="' + alt.lang + '" href="' + alt.url + '" />');
        });
      }
      xmlParts.push('  </url>');
    });

    xmlParts.push('</urlset>');
    const xml = xmlParts.join('\n');

    if (this.cache) {
      this.cache.set(cacheKey, xml, { tags: ['sitemap'] });
    }

    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  }

  generateRobotsTxt(config: {
    rules: Array<{
      userAgent: string;
      allow?: string | string[];
      disallow?: string | string[];
      crawlDelay?: number;
    }>;
    sitemap?: string[];
    host?: string;
  }): Response {
    const lines: string[] = [];

    config.rules.forEach(rule => {
      lines.push('User-agent: ' + rule.userAgent);

      if (rule.allow) {
        const allows = Array.isArray(rule.allow) ? rule.allow : [rule.allow];
        allows.forEach(path => lines.push('Allow: ' + path));
      }

      if (rule.disallow) {
        const disallows = Array.isArray(rule.disallow) ? rule.disallow : [rule.disallow];
        disallows.forEach(path => lines.push('Disallow: ' + path));
      }

      if (rule.crawlDelay !== undefined) {
        lines.push('Crawl-delay: ' + rule.crawlDelay);
      }

      lines.push('');
    });

    if (config.sitemap) {
      config.sitemap.forEach(url => lines.push('Sitemap: ' + url));
      lines.push('');
    }

    if (config.host) {
      lines.push('Host: ' + config.host);
    }

    return new Response(lines.join('\n'), {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  getCache(): CacheManager | undefined {
    return this.cache;
  }

  getGeoSeo(): GeoSeo | undefined {
    return this.geoSeo;
  }

  getSecurity(): SecurityHeaders | undefined {
    return this.security;
  }

  async invalidateCache(tags?: string[]): Promise<void> {
    if (this.cache) {
      if (tags) {
        tags.forEach(tag => this.cache!.invalidateByTags([tag]));
      } else {
        this.cache.clear();
      }
    }
  }
}

export function createNextAdapter(options: NextAdapterOptions): NextAdapter {
  return new NextAdapter(options);
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; url: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateArticleJsonLd(article: {
  headline: string;
  description: string;
  image: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string; url?: string };
  publisher: { name: string; logo?: string };
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: article.publisher.name,
      logo: article.publisher.logo ? {
        '@type': 'ImageObject',
        url: article.publisher.logo,
      } : undefined,
    },
  };
}

export function generateProductJsonLd(product: {
  name: string;
  description: string;
  image: string | string[];
  brand?: string;
  sku?: string;
  offers: {
    price: number;
    priceCurrency: string;
    availability: string;
    url: string;
    priceValidUntil?: string;
    seller?: { name: string };
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
    bestRating?: number;
    worstRating?: number;
  };
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand ? {
      '@type': 'Brand',
      name: product.brand,
    } : undefined,
    sku: product.sku,
    offers: {
      '@type': 'Offer',
      price: product.offers.price,
      priceCurrency: product.offers.priceCurrency,
      availability: 'https://schema.org/' + product.offers.availability,
      url: product.offers.url,
      priceValidUntil: product.offers.priceValidUntil,
      seller: product.offers.seller ? {
        '@type': 'Organization',
        name: product.offers.seller.name,
      } : undefined,
    },
    aggregateRating: product.aggregateRating ? {
      '@type': 'AggregateRating',
      ratingValue: product.aggregateRating.ratingValue,
      reviewCount: product.aggregateRating.reviewCount,
      bestRating: product.aggregateRating.bestRating || 5,
      worstRating: product.aggregateRating.worstRating || 1,
    } : undefined,
  };
}

export function generateFaqJsonLd(questions: Array<{ question: string; answer: string }>): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer,
      },
    })),
  };
}
