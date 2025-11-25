/**
 * @file src/middleware/HeaderManager.ts
 * @summary HTTP Response Header Management for SEO.
 *
 * @description
 * Advanced HTTP header management system that optimizes response headers for:
 * - Search engine crawling and indexing
 * - Page performance and caching
 * - Mobile optimization
 * - Content negotiation
 * - Cross-origin resource sharing (CORS)
 * - Link relationships (canonical, alternate, etc.)
 *
 * USE CASES:
 * 1. **SEO Headers**: Canonical URLs, alternate languages, mobile variants
 * 2. **Performance Headers**: Compression, caching directives, resource hints
 * 3. **Content Headers**: Language, encoding, MIME types
 * 4. **Link Headers**: Preload, prefetch, DNS prefetch, preconnect
 * 5. **Crawl Directives**: X-Robots-Tag, Vary headers for bot detection
 *
 * APPLICATION SCENARIOS:
 * - Server-side rendering (SSR) with Next.js, Nuxt.js, Angular Universal
 * - API responses with RESTful services
 * - Static site generation with proper caching
 * - Multi-language sites with content negotiation
 * - Mobile-first applications with responsive headers
 * - CDN integration with optimal cache headers
 *
 * @module HeaderManager
 * - CDN integration with optimal cache headers
 *
 * @module HeaderManager
 */
export type LinkRelation =
  | 'canonical'
  | 'alternate'
  | 'preload'
  | 'prefetch'
  | 'dns-prefetch'
  | 'preconnect'
  | 'prev'
  | 'next'
  | 'amphtml'
  | 'manifest'
  | 'icon';

/**
 * Resource types for preload hints
 */
export type ResourceType =
  | 'script'
  | 'style'
  | 'font'
  | 'image'
  | 'document'
  | 'fetch'
  | 'worker'
  | 'video'
  | 'audio';

/**
 * Link header configuration
 */
export interface LinkHeader {
  url: string;
  rel: LinkRelation;
  type?: string;
  as?: ResourceType;
  crossorigin?: 'anonymous' | 'use-credentials';
  media?: string;
  hreflang?: string;
  title?: string;
}

/**
 * SEO-specific header configuration
 */
export interface SeoHeaders {
  canonical?: string;
  alternates?: Array<{
    url: string;
    hreflang: string;
    title?: string;
  }>;
  robots?: {
    index?: boolean;
    follow?: boolean;
    noarchive?: boolean;
    nosnippet?: boolean;
    maxSnippet?: number;
    maxImagePreview?: 'none' | 'standard' | 'large';
    maxVideoPreview?: number;
    notranslate?: boolean;
    noimageindex?: boolean;
    unavailableAfter?: Date;
  };
  refresh?: {
    seconds: number;
    url?: string;
  };
}

/**
 * Performance optimization headers
 */
export interface PerformanceHeaders {
  compression?: boolean;
  caching?: {
    public?: boolean;
    private?: boolean;
    maxAge?: number;
    sMaxAge?: number;
    staleWhileRevalidate?: number;
    staleIfError?: number;
    mustRevalidate?: boolean;
    noCache?: boolean;
    noStore?: boolean;
  };
  resourceHints?: {
    dnsPrefetch?: string[];
    preconnect?: string[];
    preload?: Array<{
      url: string;
      as: ResourceType;
      type?: string;
      crossorigin?: boolean;
    }>;
    prefetch?: string[];
  };
}

/**
 * Content negotiation headers
 */
export interface ContentHeaders {
  language?: string;
  languages?: string[];
  encoding?: string;
  type?: string;
  disposition?: {
    type: 'inline' | 'attachment';
    filename?: string;
  };
}

/**
 * CORS configuration
 */
export interface CorsHeaders {
  origin?: string | string[];
  methods?: string[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

/**
 * Complete header manager options
 */
export interface HeaderManagerOptions {
  seo?: SeoHeaders;
  performance?: PerformanceHeaders;
  content?: ContentHeaders;
  cors?: CorsHeaders;
  customHeaders?: Record<string, string>;
  varyHeaders?: string[];
}

/**
 * HeaderManager Class
 * Manages HTTP response headers for SEO optimization and performance
 */
export class HeaderManager {
  private options: HeaderManagerOptions;
  private headers: Map<string, string>;

  constructor(options: HeaderManagerOptions = {}) {
    this.options = options;
    this.headers = new Map();
    this.initialize();
  }

  /**
   * Initialize headers based on configuration
   */
  private initialize(): void {
    if (this.options.seo) {
      this.applySeoHeaders(this.options.seo);
    }

    if (this.options.performance) {
      this.applyPerformanceHeaders(this.options.performance);
    }

    if (this.options.content) {
      this.applyContentHeaders(this.options.content);
    }

    if (this.options.cors) {
      this.applyCorsHeaders(this.options.cors);
    }

    if (this.options.customHeaders) {
      Object.entries(this.options.customHeaders).forEach(([key, value]) => {
        this.headers.set(key, value);
      });
    }

    if (this.options.varyHeaders && this.options.varyHeaders.length > 0) {
      this.headers.set('Vary', this.options.varyHeaders.join(', '));
    }
  }

  /**
   * Apply SEO-specific headers
   *
   * @example
   * ```typescript
   * manager.applySeoHeaders({
   *   canonical: 'https://example.com/page',
   *   alternates: [
   *     { url: 'https://example.com/en/page', hreflang: 'en' },
   *     { url: 'https://example.com/es/page', hreflang: 'es' }
   *   ],
   *   robots: {
   *     index: true,
   *     follow: true,
   *     maxSnippet: 320,
   *     maxImagePreview: 'large'
   *   }
   * });
   * ```
   */
  applySeoHeaders(seo: SeoHeaders): void {
    const links: LinkHeader[] = [];

    // Canonical URL
    if (seo.canonical) {
      links.push({
        url: seo.canonical,
        rel: 'canonical',
      });
    }

    // Alternate language versions
    if (seo.alternates) {
      seo.alternates.forEach(alt => {
        links.push({
          url: alt.url,
          rel: 'alternate',
          hreflang: alt.hreflang,
          title: alt.title,
        });
      });
    }

    // Set Link header
    if (links.length > 0) {
      this.headers.set('Link', this.formatLinkHeader(links));
    }

    // X-Robots-Tag
    if (seo.robots) {
      const directives: string[] = [];
      const robots = seo.robots;

      if (robots.index === false) directives.push('noindex');
      if (robots.follow === false) directives.push('nofollow');
      if (robots.noarchive) directives.push('noarchive');
      if (robots.nosnippet) directives.push('nosnippet');
      if (robots.maxSnippet !== undefined) directives.push(`max-snippet:${robots.maxSnippet}`);
      if (robots.maxImagePreview) directives.push(`max-image-preview:${robots.maxImagePreview}`);
      if (robots.maxVideoPreview !== undefined) directives.push(`max-video-preview:${robots.maxVideoPreview}`);
      if (robots.notranslate) directives.push('notranslate');
      if (robots.noimageindex) directives.push('noimageindex');
      if (robots.unavailableAfter) {
        directives.push(`unavailable_after: ${robots.unavailableAfter.toUTCString()}`);
      }

      if (directives.length > 0) {
        this.headers.set('X-Robots-Tag', directives.join(', '));
      }
    }

    // Refresh header (301/302 alternative)
    if (seo.refresh) {
      const { seconds, url } = seo.refresh;
      this.headers.set('Refresh', url ? `${seconds}; url=${url}` : `${seconds}`);
    }
  }

  /**
   * Apply performance optimization headers
   *
   * @example
   * ```typescript
   * manager.applyPerformanceHeaders({
   *   compression: true,
   *   caching: {
   *     public: true,
   *     maxAge: 3600,
   *     staleWhileRevalidate: 86400
   *   },
   *   resourceHints: {
   *     dnsPrefetch: ['https://cdn.example.com'],
   *     preconnect: ['https://fonts.googleapis.com'],
   *     preload: [{
   *       url: '/critical.css',
   *       as: 'style'
   *     }]
   *   }
   * });
   * ```
   */
  applyPerformanceHeaders(perf: PerformanceHeaders): void {
    // Compression
    if (perf.compression) {
      this.headers.set('Content-Encoding', 'gzip');
      this.headers.set('Vary', this.addToVary('Accept-Encoding'));
    }

    // Cache-Control
    if (perf.caching) {
      const parts: string[] = [];
      const cache = perf.caching;

      if (cache.public) parts.push('public');
      if (cache.private) parts.push('private');
      if (cache.maxAge !== undefined) parts.push(`max-age=${cache.maxAge}`);
      if (cache.sMaxAge !== undefined) parts.push(`s-maxage=${cache.sMaxAge}`);
      if (cache.staleWhileRevalidate !== undefined) {
        parts.push(`stale-while-revalidate=${cache.staleWhileRevalidate}`);
      }
      if (cache.staleIfError !== undefined) {
        parts.push(`stale-if-error=${cache.staleIfError}`);
      }
      if (cache.mustRevalidate) parts.push('must-revalidate');
      if (cache.noCache) parts.push('no-cache');
      if (cache.noStore) parts.push('no-store');

      if (parts.length > 0) {
        this.headers.set('Cache-Control', parts.join(', '));
      }
    }

    // Resource hints via Link header
    if (perf.resourceHints) {
      const links: LinkHeader[] = [];

      // DNS prefetch
      perf.resourceHints.dnsPrefetch?.forEach(url => {
        links.push({ url, rel: 'dns-prefetch' });
      });

      // Preconnect
      perf.resourceHints.preconnect?.forEach(url => {
        links.push({ url, rel: 'preconnect' });
      });

      // Preload
      perf.resourceHints.preload?.forEach(resource => {
        links.push({
          url: resource.url,
          rel: 'preload',
          as: resource.as,
          type: resource.type,
          crossorigin: resource.crossorigin ? 'anonymous' : undefined,
        });
      });

      // Prefetch
      perf.resourceHints.prefetch?.forEach(url => {
        links.push({ url, rel: 'prefetch' });
      });

      if (links.length > 0) {
        const existing = this.headers.get('Link');
        const newLinks = this.formatLinkHeader(links);
        this.headers.set('Link', existing ? `${existing}, ${newLinks}` : newLinks);
      }
    }
  }

  /**
   * Apply content negotiation headers
   *
   * @example
   * ```typescript
   * manager.applyContentHeaders({
   *   language: 'en-US',
   *   languages: ['en-US', 'en', 'es'],
   *   type: 'application/json',
   *   encoding: 'utf-8'
   * });
   * ```
   */
  applyContentHeaders(content: ContentHeaders): void {
    if (content.language) {
      this.headers.set('Content-Language', content.language);
    }

    if (content.languages && content.languages.length > 0) {
      this.headers.set('Content-Language', content.languages.join(', '));
      this.headers.set('Vary', this.addToVary('Accept-Language'));
    }

    if (content.type) {
      const charset = content.encoding ? `; charset=${content.encoding}` : '';
      this.headers.set('Content-Type', `${content.type}${charset}`);
    }

    if (content.disposition) {
      const { type, filename } = content.disposition;
      const filenameParam = filename ? `; filename="${filename}"` : '';
      this.headers.set('Content-Disposition', `${type}${filenameParam}`);
    }
  }

  /**
   * Apply CORS headers
   *
   * @example
   * ```typescript
   * manager.applyCorsHeaders({
   *   origin: '*',
   *   methods: ['GET', 'POST', 'PUT'],
   *   allowedHeaders: ['Content-Type', 'Authorization'],
   *   credentials: true,
   *   maxAge: 86400
   * });
   * ```
   */
  applyCorsHeaders(cors: CorsHeaders): void {
    if (cors.origin) {
      const origin = Array.isArray(cors.origin) ? cors.origin.join(', ') : cors.origin;
      this.headers.set('Access-Control-Allow-Origin', origin);
      this.headers.set('Vary', this.addToVary('Origin'));
    }

    if (cors.methods && cors.methods.length > 0) {
      this.headers.set('Access-Control-Allow-Methods', cors.methods.join(', '));
    }

    if (cors.allowedHeaders && cors.allowedHeaders.length > 0) {
      this.headers.set('Access-Control-Allow-Headers', cors.allowedHeaders.join(', '));
    }

    if (cors.exposedHeaders && cors.exposedHeaders.length > 0) {
      this.headers.set('Access-Control-Expose-Headers', cors.exposedHeaders.join(', '));
    }

    if (cors.credentials) {
      this.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    if (cors.maxAge !== undefined) {
      this.headers.set('Access-Control-Max-Age', cors.maxAge.toString());
    }
  }

  /**
   * Format Link header value
   */
  private formatLinkHeader(links: LinkHeader[]): string {
    return links
      .map(link => {
        let value = `<${link.url}>; rel="${link.rel}"`;

        if (link.type) value += `; type="${link.type}"`;
        if (link.as) value += `; as="${link.as}"`;
        if (link.crossorigin) value += `; crossorigin="${link.crossorigin}"`;
        if (link.media) value += `; media="${link.media}"`;
        if (link.hreflang) value += `; hreflang="${link.hreflang}"`;
        if (link.title) value += `; title="${link.title}"`;

        return value;
      })
      .join(', ');
  }

  /**
   * Add value to Vary header
   */
  private addToVary(value: string): string {
    const existing = this.headers.get('Vary');
    if (!existing) return value;

    const values = existing.split(',').map(v => v.trim());
    if (values.includes(value)) return existing;

    values.push(value);
    return values.join(', ');
  }

  /**
   * Set custom header
   *
   * @example
   * ```typescript
   * manager.setHeader('X-Custom-Header', 'value');
   * ```
   */
  setHeader(key: string, value: string): void {
    this.headers.set(key, value);
  }

  /**
   * Get specific header value
   */
  getHeader(key: string): string | undefined {
    return this.headers.get(key);
  }

  /**
   * Remove header
   */
  removeHeader(key: string): void {
    this.headers.delete(key);
  }

  /**
   * Get all headers as object
   *
   * @example
   * ```typescript
   * const headers = manager.getHeaders();
   * // Express.js
   * res.set(headers);
   *
   * // Next.js
   * Object.entries(headers).forEach(([key, value]) => {
   *   res.setHeader(key, value);
   * });
   *
   * // Fetch API
   * return new Response(body, { headers });
   * ```
   */
  getHeaders(): Record<string, string> {
    return Object.fromEntries(this.headers);
  }

  /**
   * Clear all headers
   */
  clear(): void {
    this.headers.clear();
  }

  /**
   * Merge with existing headers
   */
  merge(headers: Record<string, string>): void {
    Object.entries(headers).forEach(([key, value]) => {
      this.headers.set(key, value);
    });
  }
}

/**
 * Express.js middleware factory
 *
 * @example
 * ```typescript
 * import { createHeaderMiddleware } from 'm-seo';
 *
 * app.use(createHeaderMiddleware({
 *   seo: {
 *     robots: { index: true, follow: true }
 *   },
 *   performance: {
 *     caching: { public: true, maxAge: 3600 }
 *   }
 * }));
 * ```
 */
export function createHeaderMiddleware(options: HeaderManagerOptions) {
  return (_req: any, res: any, next: any) => {
    const manager = new HeaderManager(options);
    const headers = manager.getHeaders();

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    next();
  };
}

/**
 * Next.js API route helper
 *
 * @example
 * ```typescript
 * import { applyHeaders } from 'm-seo';
 *
 * export default function handler(req, res) {
 *   applyHeaders(res, {
 *     seo: { canonical: 'https://example.com/api/data' },
 *     performance: { caching: { maxAge: 60 } }
 *   });
 *
 *   res.json({ data: '...' });
 * }
 * ```
 */
export function applyHeaders(res: any, options: HeaderManagerOptions): void {
  const manager = new HeaderManager(options);
  const headers = manager.getHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
}
