// src/core/UrlManager.ts

/**
 * URL Manager
 *
 * Advanced URL management for SEO optimization:
 * - Canonical URL generation
 * - URL normalization and cleaning
 * - Query parameter management
 * - Redirect management
 * - URL slug generation
 * - Alternate URL management (hreflang)
 * - URL validation and security
 * - Pretty URL creation
 * - Pagination URL handling
 * - Mobile URL variants
 *
 * @example
 * ```typescript
 * const urlManager = new UrlManager({
 *   baseUrl: 'https://example.com',
 *   trailingSlash: true,
 *   forceHttps: true
 * });
 *
 * const canonical = urlManager.getCanonical('/blog/post-title');
 * const slug = urlManager.createSlug('My Blog Post Title!');
 * ```
 */

export interface UrlConfig {
  baseUrl: string;
  trailingSlash?: boolean;
  forceHttps?: boolean;
  forceLowerCase?: boolean;
  removeWww?: boolean;
  defaultLocale?: string;
  localePrefix?: 'path' | 'subdomain' | 'domain' | 'none';
  allowedQueryParams?: string[];
  ignoreQueryParams?: string[];
  slugOptions?: SlugOptions;
}

export interface SlugOptions {
  separator?: string;
  lowercase?: boolean;
  removeDiacritics?: boolean;
  truncate?: number;
  allowedChars?: RegExp;
  preserveCase?: boolean;
  customReplacements?: Record<string, string>;
}

export interface UrlComponents {
  protocol: string;
  hostname: string;
  port?: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
}

export interface RedirectRule {
  from: string | RegExp;
  to: string;
  statusCode?: 301 | 302 | 303 | 307 | 308;
  preserveQuery?: boolean;
  caseSensitive?: boolean;
}

export interface AlternateUrl {
  href: string;
  hreflang: string;
  media?: string;
}

export interface PaginationUrls {
  first?: string;
  prev?: string;
  next?: string;
  last?: string;
  current: string;
  canonical: string;
}

/**
 * URL Manager Class
 * Comprehensive URL management for SEO
 */
export class UrlManager {
  private config: Required<UrlConfig>;
  private redirectRules: RedirectRule[] = [];

  constructor(config: UrlConfig) {
    this.config = {
      trailingSlash: true,
      forceHttps: true,
      forceLowerCase: true,
      removeWww: false,
      defaultLocale: 'en',
      localePrefix: 'path',
      allowedQueryParams: [],
      ignoreQueryParams: ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'],
      slugOptions: {
        separator: '-',
        lowercase: true,
        removeDiacritics: true,
        truncate: 200,
        allowedChars: /[a-z0-9-]/gi
      },
      ...config
    };

    // Ensure baseUrl doesn't have trailing slash
    this.config.baseUrl = this.config.baseUrl.replace(/\/$/, '');
  }

  /**
   * Get canonical URL for a given path
   */
  getCanonical(path: string, options?: { locale?: string; stripQuery?: boolean }): string {
    let url = this.normalize(path);

    // Add locale if needed
    if (options?.locale && this.config.localePrefix === 'path') {
      const locale = options.locale !== this.config.defaultLocale ? `/${options.locale}` : '';
      url = this.config.baseUrl + locale + url;
    } else {
      url = this.config.baseUrl + url;
    }

    // Strip query parameters if requested
    if (options?.stripQuery) {
      const urlWithoutQuery = url.split('?')[0];
      if (urlWithoutQuery) {
        url = urlWithoutQuery;
      }
    }

    return url;
  }

  /**
   * Normalize URL according to configuration
   */
  normalize(url: string, options?: { preserveQuery?: boolean }): string {
    try {
      let normalized = url;

      // Handle full URLs vs paths
      const isFullUrl = url.startsWith('http://') || url.startsWith('https://');

      if (isFullUrl) {
        const urlObj = new URL(url);
        normalized = urlObj.pathname + (options?.preserveQuery ? urlObj.search : '');
      }

      // Force lowercase
      if (this.config.forceLowerCase) {
        const parts = normalized.split('?');
        if (parts[0]) {
          parts[0] = parts[0].toLowerCase();
        }
        normalized = parts.join('?');
      }

      // Remove double slashes
      normalized = normalized.replace(/\/+/g, '/');

      // Handle trailing slash
      if (this.config.trailingSlash) {
        if (!normalized.endsWith('/') && !normalized.includes('?') && !normalized.match(/\.\w+$/)) {
          normalized += '/';
        }
      } else {
        if (normalized.endsWith('/') && normalized.length > 1) {
          normalized = normalized.slice(0, -1);
        }
      }

      // Ensure starts with /
      if (!normalized.startsWith('/')) {
        normalized = '/' + normalized;
      }

      // Clean query parameters
      if (!options?.preserveQuery && normalized.includes('?')) {
        normalized = this.cleanQueryParams(normalized);
      }

      return normalized;
    } catch (error) {
      console.error('URL normalization error:', error);
      return url;
    }
  }

  /**
   * Clean query parameters based on allowed/ignored lists
   */
  cleanQueryParams(url: string): string {
    const parts = url.split('?');
    const path = parts[0];
    const query = parts[1];

    if (!query) return path || '';

    const params = new URLSearchParams(query);
    const cleaned = new URLSearchParams();

    params.forEach((value, key) => {
      const shouldKeep = this.config.allowedQueryParams.length > 0
        ? this.config.allowedQueryParams.includes(key)
        : !this.config.ignoreQueryParams.includes(key);

      if (shouldKeep) {
        cleaned.append(key, value);
      }
    });

    const cleanedQuery = cleaned.toString();
    return cleanedQuery ? `${path}?${cleanedQuery}` : (path || '');
  }

  /**
   * Create SEO-friendly slug from text
   */
  createSlug(text: string, options?: SlugOptions): string {
    const opts = { ...this.config.slugOptions, ...options };
    let slug = text;

    // Apply custom replacements first
    if (opts.customReplacements) {
      Object.entries(opts.customReplacements).forEach(([from, to]) => {
        slug = slug.replace(new RegExp(from, 'g'), to);
      });
    }

    // Remove diacritics if enabled
    if (opts.removeDiacritics) {
      slug = this.removeDiacritics(slug);
    }

    // Convert to lowercase if enabled
    if (opts.lowercase && !opts.preserveCase) {
      slug = slug.toLowerCase();
    }

    // Replace spaces and special chars with separator
    slug = slug
      .replace(/\s+/g, opts.separator || '-')
      .replace(/[^\w-]/g, opts.separator || '-')
      .replace(new RegExp(`\\${opts.separator}+`, 'g'), opts.separator || '-')
      .replace(new RegExp(`^\\${opts.separator}|\\${opts.separator}$`, 'g'), '');

    // Keep only allowed characters
    if (opts.allowedChars) {
      slug = slug.split('').filter(char => opts.allowedChars!.test(char)).join('');
    }

    // Truncate if needed
    if (opts.truncate && slug.length > opts.truncate) {
      slug = slug.substring(0, opts.truncate);
      // Remove trailing separator
      slug = slug.replace(new RegExp(`\\${opts.separator}$`), '');
    }

    return slug;
  }

  /**
   * Remove diacritics from text
   */
  private removeDiacritics(text: string): string {
    const diacriticsMap: Record<string, string> = {
      'à': 'a', 'á': 'a', 'â': 'a', 'ã': 'a', 'ä': 'a', 'å': 'a',
      'è': 'e', 'é': 'e', 'ê': 'e', 'ë': 'e',
      'ì': 'i', 'í': 'i', 'î': 'i', 'ï': 'i',
      'ò': 'o', 'ó': 'o', 'ô': 'o', 'õ': 'o', 'ö': 'o',
      'ù': 'u', 'ú': 'u', 'û': 'u', 'ü': 'u',
      'ý': 'y', 'ÿ': 'y',
      'ñ': 'n', 'ç': 'c',
      'À': 'A', 'Á': 'A', 'Â': 'A', 'Ã': 'A', 'Ä': 'A', 'Å': 'A',
      'È': 'E', 'É': 'E', 'Ê': 'E', 'Ë': 'E',
      'Ì': 'I', 'Í': 'I', 'Î': 'I', 'Ï': 'I',
      'Ò': 'O', 'Ó': 'O', 'Ô': 'O', 'Õ': 'O', 'Ö': 'O',
      'Ù': 'U', 'Ú': 'U', 'Û': 'U', 'Ü': 'U',
      'Ý': 'Y', 'Ñ': 'N', 'Ç': 'C'
    };

    return text.split('').map(char => diacriticsMap[char] || char).join('');
  }

  /**
   * Parse URL into components
   */
  parseUrl(url: string): UrlComponents {
    try {
      const fullUrl = url.startsWith('http') ? url : `${this.config.baseUrl}${url}`;
      const urlObj = new URL(fullUrl);

      return {
        protocol: urlObj.protocol.replace(':', ''),
        hostname: urlObj.hostname,
        port: urlObj.port || undefined,
        pathname: urlObj.pathname,
        search: urlObj.search,
        hash: urlObj.hash,
        origin: urlObj.origin
      };
    } catch (error) {
      throw new Error(`Invalid URL: ${url}`);
    }
  }

  /**
   * Build URL from components
   */
  buildUrl(components: Partial<UrlComponents>, includeOrigin = true): string {
    const protocol = components.protocol || 'https';
    const hostname = components.hostname || new URL(this.config.baseUrl).hostname;
    const port = components.port ? `:${components.port}` : '';
    const pathname = components.pathname || '/';
    const search = components.search || '';
    const hash = components.hash || '';

    if (includeOrigin) {
      return `${protocol}://${hostname}${port}${pathname}${search}${hash}`;
    } else {
      return `${pathname}${search}${hash}`;
    }
  }

  /**
   * Add redirect rule
   */
  addRedirect(rule: RedirectRule): void {
    this.redirectRules.push(rule);
  }

  /**
   * Get redirect for URL
   */
  getRedirect(url: string): { to: string; statusCode: number } | null {
    for (const rule of this.redirectRules) {
      if (typeof rule.from === 'string') {
        const matches = rule.caseSensitive
          ? url === rule.from
          : url.toLowerCase() === rule.from.toLowerCase();

        if (matches) {
          let to = rule.to;

          // Preserve query string if requested
          if (rule.preserveQuery && url.includes('?')) {
            const [, query] = url.split('?');
            to = to.includes('?') ? `${to}&${query}` : `${to}?${query}`;
          }

          return {
            to: this.normalize(to),
            statusCode: rule.statusCode || 301
          };
        }
      } else if (rule.from instanceof RegExp) {
        if (rule.from.test(url)) {
          const to = url.replace(rule.from, rule.to);
          return {
            to: this.normalize(to),
            statusCode: rule.statusCode || 301
          };
        }
      }
    }

    return null;
  }

  /**
   * Generate alternate URLs for hreflang
   */
  generateAlternates(
    path: string,
    locales: string[],
    options?: { includeDefault?: boolean }
  ): AlternateUrl[] {
    const alternates: AlternateUrl[] = [];

    locales.forEach(locale => {
      const href = this.getCanonical(path, { locale });

      alternates.push({
        href,
        hreflang: locale
      });
    });

    // Add x-default if requested
    if (options?.includeDefault) {
      alternates.push({
        href: this.getCanonical(path, { locale: this.config.defaultLocale }),
        hreflang: 'x-default'
      });
    }

    return alternates;
  }

  /**
   * Generate pagination URLs
   */
  generatePaginationUrls(
    basePath: string,
    currentPage: number,
    totalPages: number,
    options?: { paramName?: string; useQuery?: boolean }
  ): PaginationUrls {
    const paramName = options?.paramName || 'page';
    const useQuery = options?.useQuery ?? true;

    const buildPageUrl = (page: number): string => {
      if (page === 1) {
        return this.getCanonical(basePath, { stripQuery: true });
      }

      if (useQuery) {
        return `${this.getCanonical(basePath, { stripQuery: true })}?${paramName}=${page}`;
      } else {
        return this.getCanonical(`${basePath}/${paramName}/${page}`);
      }
    };

    const urls: PaginationUrls = {
      current: buildPageUrl(currentPage),
      canonical: currentPage === 1
        ? buildPageUrl(1)
        : buildPageUrl(currentPage)
    };

    if (currentPage > 1) {
      urls.first = buildPageUrl(1);
      urls.prev = buildPageUrl(currentPage - 1);
    }

    if (currentPage < totalPages) {
      urls.next = buildPageUrl(currentPage + 1);
      urls.last = buildPageUrl(totalPages);
    }

    return urls;
  }

  /**
   * Validate URL security
   */
  validateUrl(url: string): { valid: boolean; issues: string[] } {
    const issues: string[] = [];

    try {
      const parsed = this.parseUrl(url);

      // Check for XSS attempts
      if (url.includes('<script') || url.includes('javascript:')) {
        issues.push('Potential XSS attempt detected');
      }

      // Check protocol
      if (this.config.forceHttps && parsed.protocol !== 'https') {
        issues.push('Non-HTTPS protocol detected');
      }

      // Check for suspicious patterns
      if (url.includes('..') || url.includes('//')) {
        issues.push('Path traversal attempt detected');
      }

      // Validate hostname
      const baseHostname = new URL(this.config.baseUrl).hostname;
      if (parsed.hostname !== baseHostname && !url.startsWith('/')) {
        issues.push('External hostname detected');
      }

      return {
        valid: issues.length === 0,
        issues
      };
    } catch (error) {
      issues.push('Invalid URL format');
      return { valid: false, issues };
    }
  }

  /**
   * Generate mobile variant URL
   */
  generateMobileUrl(url: string, strategy: 'subdomain' | 'parameter' | 'separate' = 'subdomain'): string {
    const parsed = this.parseUrl(url);

    switch (strategy) {
      case 'subdomain':
        // m.example.com
        return this.buildUrl({
          ...parsed,
          hostname: `m.${parsed.hostname}`
        });

      case 'parameter':
        // example.com?mobile=true
        const search = parsed.search
          ? `${parsed.search}&mobile=true`
          : '?mobile=true';
        return this.buildUrl({ ...parsed, search });

      case 'separate':
        // example.com/mobile/path
        return this.buildUrl({
          ...parsed,
          pathname: `/mobile${parsed.pathname}`
        });

      default:
        return url;
    }
  }

  /**
   * Extract query parameters
   */
  getQueryParams(url: string): Record<string, string> {
    const [, query] = url.split('?');
    if (!query) return {};

    const params: Record<string, string> = {};
    const urlParams = new URLSearchParams(query);

    urlParams.forEach((value, key) => {
      params[key] = value;
    });

    return params;
  }

  /**
   * Add query parameters to URL
   */
  addQueryParams(url: string, params: Record<string, string>): string {
    const parts = url.split('?');
    const path = parts[0];
    const existingQuery = parts[1];
    const urlParams = new URLSearchParams(existingQuery);

    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value);
    });

    const query = urlParams.toString();
    return query ? `${path}?${query}` : (path || '');
  }

  /**
   * Remove query parameters from URL
   */
  removeQueryParams(url: string, params: string[]): string {
    const parts = url.split('?');
    const path = parts[0];
    const query = parts[1];

    if (!query) return path || '';

    const urlParams = new URLSearchParams(query);

    params.forEach(param => {
      urlParams.delete(param);
    });

    const newQuery = urlParams.toString();
    return newQuery ? `${path}?${newQuery}` : (path || '');
  }

  /**
   * Generate breadcrumb URLs
   */
  generateBreadcrumbs(path: string): Array<{ name: string; url: string }> {
    const parts = path.split('/').filter(Boolean);
    const breadcrumbs: Array<{ name: string; url: string }> = [
      { name: 'Home', url: this.getCanonical('/') }
    ];

    let currentPath = '';
    parts.forEach(part => {
      currentPath += `/${part}`;
      breadcrumbs.push({
        name: this.slugToTitle(part),
        url: this.getCanonical(currentPath)
      });
    });

    return breadcrumbs;
  }

  /**
   * Convert slug to readable title
   */
  private slugToTitle(slug: string): string {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Check if URL is absolute
   */
  isAbsolute(url: string): boolean {
    return /^https?:\/\//i.test(url);
  }

  /**
   * Convert relative URL to absolute
   */
  toAbsolute(url: string): string {
    if (this.isAbsolute(url)) return url;
    return this.getCanonical(url);
  }

  /**
   * Get URL without protocol
   */
  withoutProtocol(url: string): string {
    return url.replace(/^https?:\/\//, '//');
  }

  /**
   * Compare two URLs for equality (normalized)
   */
  urlsEqual(url1: string, url2: string): boolean {
    const normalized1 = this.normalize(url1);
    const normalized2 = this.normalize(url2);
    return normalized1 === normalized2;
  }

  /**
   * Get base URL
   */
  getBaseUrl(): string {
    return this.config.baseUrl;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<UrlConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Helper function to create URL manager instance
 */
export function createUrlManager(config: UrlConfig): UrlManager {
  return new UrlManager(config);
}

/**
 * Quick slug generator
 */
export function slug(text: string, options?: SlugOptions): string {
  const manager = new UrlManager({ baseUrl: 'https://example.com' });
  return manager.createSlug(text, options);
}

/**
 * Quick URL normalizer
 */
export function normalizeUrl(url: string, baseUrl: string, options?: Partial<UrlConfig>): string {
  const manager = new UrlManager({ baseUrl, ...options });
  return manager.normalize(url);
}
