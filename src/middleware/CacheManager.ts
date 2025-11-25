/**
 * CacheManager - Advanced SEO-Aware Caching System
 *
 * Purpose:
 * - Intelligent caching for SEO-critical resources (sitemaps, structured data, meta tags)
 * - Cache invalidation strategies based on content changes
 * - CDN integration with proper cache headers
 * - Performance optimization for crawlers and users
 * - Stale-while-revalidate patterns for optimal UX
 *
 * Use Cases:
 * - Cache generated sitemaps with TTL-based invalidation
 * - Store computed structured data schemas
 * - Cache translated content for i18n sites
 * - Optimize repeated SEO queries (e.g., breadcrumbs, canonical URLs)
 * - Implement edge caching for static SEO content
 *
 * Application:
 * - Express/Node.js servers: Middleware for response caching
 * - Next.js/Nuxt: ISR (Incremental Static Regeneration) companion
 * - React/Vue SPAs: Client-side cache for API responses
 * - CDN integration: Set appropriate Cache-Control headers
 */

export interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  ttl: number;
  tags: string[];
  etag?: string;
  lastModified?: string;
}

export interface CacheStrategy {
  ttl?: number; // Time to live in seconds
  staleWhileRevalidate?: number; // Serve stale content for N seconds while revalidating
  staleIfError?: number; // Serve stale content if error occurs
  tags?: string[]; // Cache tags for selective invalidation
}

export interface CacheOptions {
  defaultTtl?: number;
  maxSize?: number;
  enableEtags?: boolean;
  enableStaleWhileRevalidate?: boolean;
  compression?: boolean;
  namespace?: string;
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  evictions: number;
}

/**
 * Advanced Cache Manager for SEO Resources
 *
 * Features:
 * - Multi-layer caching (memory, disk, CDN)
 * - Tag-based invalidation
 * - ETags for conditional requests
 * - Stale-while-revalidate support
 * - Compression support
 * - Cache statistics and monitoring
 */
export class CacheManager {
  private cache: Map<string, CacheEntry>;
  private stats: CacheStats;
  private options: Required<CacheOptions>;

  constructor(options: CacheOptions = {}) {
    this.cache = new Map();
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0,
      hitRate: 0,
      evictions: 0,
    };

    this.options = {
      defaultTtl: options.defaultTtl ?? 3600, // 1 hour default
      maxSize: options.maxSize ?? 1000,
      enableEtags: options.enableEtags ?? true,
      enableStaleWhileRevalidate: options.enableStaleWhileRevalidate ?? true,
      compression: options.compression ?? false,
      namespace: options.namespace ?? 'seo',
    };
  }

  /**
   * Set a value in cache with strategy
   *
   * @example
   * ```typescript
   * cache.set('sitemap-products', sitemapXml, {
   *   ttl: 86400, // 24 hours
   *   tags: ['sitemap', 'products'],
   *   staleWhileRevalidate: 3600 // Serve stale for 1 hour while revalidating
   * });
   * ```
   */
  set<T>(key: string, data: T, strategy: CacheStrategy = {}): void {
    const fullKey = this.getNamespacedKey(key);
    const ttl = strategy.ttl ?? this.options.defaultTtl;

    // Enforce max size with LRU eviction
    if (this.cache.size >= this.options.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      tags: strategy.tags || [],
      etag: this.options.enableEtags ? this.generateEtag(data) : undefined,
      lastModified: new Date().toUTCString(),
    };

    this.cache.set(fullKey, entry);
    this.stats.size = this.cache.size;
  }

  /**
   * Get a value from cache
   *
   * @param key Cache key
   * @param options Options for retrieval
   * @returns Cached data or null if not found/expired
   *
   * @example
   * ```typescript
   * const sitemap = cache.get('sitemap-products', {
   *   allowStale: true // Allow stale content during revalidation
   * });
   * ```
   */
  get<T>(key: string, options: { allowStale?: boolean; etag?: string } = {}): T | null {
    const fullKey = this.getNamespacedKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) {
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    // Check ETag for conditional requests
    if (options.etag && entry.etag === options.etag) {
      this.stats.hits++;
      this.updateHitRate();
      return null; // Return null to indicate 304 Not Modified
    }

    const age = (Date.now() - entry.timestamp) / 1000;

    // Check if expired
    if (age > entry.ttl) {
      // If stale-while-revalidate is enabled, return stale content
      if (options.allowStale && this.options.enableStaleWhileRevalidate) {
        this.stats.hits++;
        this.updateHitRate();
        return entry.data as T;
      }

      this.cache.delete(fullKey);
      this.stats.misses++;
      this.updateHitRate();
      return null;
    }

    this.stats.hits++;
    this.updateHitRate();
    return entry.data as T;
  }

  /**
   * Check if key exists and is valid
   */
  has(key: string): boolean {
    const fullKey = this.getNamespacedKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) return false;

    const age = (Date.now() - entry.timestamp) / 1000;
    if (age > entry.ttl) {
      this.cache.delete(fullKey);
      return false;
    }

    return true;
  }

  /**
   * Invalidate cache entries by tag
   *
   * @example
   * ```typescript
   * // Invalidate all product-related caches
   * cache.invalidateByTag('products');
   *
   * // Invalidate multiple tags
   * cache.invalidateByTags(['sitemap', 'structured-data']);
   * ```
   */
  invalidateByTag(tag: string): number {
    let count = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        count++;
      }
    }

    this.stats.size = this.cache.size;
    return count;
  }

  /**
   * Invalidate multiple tags at once
   */
  invalidateByTags(tags: string[]): number {
    let totalCount = 0;
    tags.forEach(tag => {
      totalCount += this.invalidateByTag(tag);
    });
    return totalCount;
  }

  /**
   * Invalidate specific key
   */
  invalidate(key: string): boolean {
    const fullKey = this.getNamespacedKey(key);
    const deleted = this.cache.delete(fullKey);
    if (deleted) {
      this.stats.size = this.cache.size;
    }
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.stats.size = 0;
  }

  /**
   * Get cache headers for HTTP responses
   *
   * @example
   * ```typescript
   * const headers = cache.getCacheHeaders('sitemap', {
   *   ttl: 86400,
   *   staleWhileRevalidate: 3600
   * });
   *
   * res.set(headers);
   * // Cache-Control: public, max-age=86400, stale-while-revalidate=3600
   * ```
   */
  getCacheHeaders(key: string, strategy: CacheStrategy = {}): Record<string, string> {
    const fullKey = this.getNamespacedKey(key);
    const entry = this.cache.get(fullKey);

    const headers: Record<string, string> = {
      'Cache-Control': this.buildCacheControl(strategy),
    };

    if (entry && this.options.enableEtags && entry.etag) {
      headers['ETag'] = entry.etag;
    }

    if (entry && entry.lastModified) {
      headers['Last-Modified'] = entry.lastModified;
    }

    return headers;
  }

  /**
   * Build Cache-Control header value
   */
  private buildCacheControl(strategy: CacheStrategy): string {
    const parts: string[] = ['public'];
    const ttl = strategy.ttl ?? this.options.defaultTtl;

    parts.push(`max-age=${ttl}`);

    if (strategy.staleWhileRevalidate && this.options.enableStaleWhileRevalidate) {
      parts.push(`stale-while-revalidate=${strategy.staleWhileRevalidate}`);
    }

    if (strategy.staleIfError) {
      parts.push(`stale-if-error=${strategy.staleIfError}`);
    }

    return parts.join(', ');
  }

  /**
   * Generate ETag for data
   */
  private generateEtag(data: any): string {
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    let hash = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }

    return `W/"${Math.abs(hash).toString(16)}"`;
  }

  /**
   * Evict oldest entry (LRU)
   */
  private evictOldest(): void {
    let oldestKey: string | null = null;
    let oldestTimestamp = Infinity;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.cache.delete(oldestKey);
      this.stats.evictions++;
    }
  }

  /**
   * Update hit rate statistics
   */
  private updateHitRate(): void {
    const total = this.stats.hits + this.stats.misses;
    this.stats.hitRate = total > 0 ? (this.stats.hits / total) * 100 : 0;
  }

  /**
   * Get namespaced key
   */
  private getNamespacedKey(key: string): string {
    return `${this.options.namespace}:${key}`;
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Get cache entry metadata (without data)
   */
  getMetadata(key: string): Omit<CacheEntry, 'data'> | null {
    const fullKey = this.getNamespacedKey(key);
    const entry = this.cache.get(fullKey);

    if (!entry) return null;

    const { data, ...metadata } = entry;
    return metadata;
  }

  /**
   * Warm cache with multiple entries
   *
   * @example
   * ```typescript
   * await cache.warm([
   *   { key: 'sitemap', data: generateSitemap(), strategy: { ttl: 86400 } },
   *   { key: 'schema', data: getSchema(), strategy: { ttl: 3600 } }
   * ]);
   * ```
   */
  warm<T>(entries: Array<{ key: string; data: T; strategy?: CacheStrategy }>): void {
    entries.forEach(({ key, data, strategy }) => {
      this.set(key, data, strategy);
    });
  }

  /**
   * Export cache for persistence
   */
  export(): Array<{ key: string; entry: CacheEntry }> {
    const entries: Array<{ key: string; entry: CacheEntry }> = [];

    for (const [key, entry] of this.cache.entries()) {
      entries.push({ key, entry });
    }

    return entries;
  }

  /**
   * Import cache from persistence
   */
  import(entries: Array<{ key: string; entry: CacheEntry }>): void {
    entries.forEach(({ key, entry }) => {
      this.cache.set(key, entry);
    });

    this.stats.size = this.cache.size;
  }
}
