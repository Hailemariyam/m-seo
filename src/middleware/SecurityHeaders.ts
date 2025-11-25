/**
 * SecurityHeaders - Security-Focused HTTP Headers for SEO
 *
 * PURPOSE:
 * Comprehensive security header management that enhances both security and SEO by:
 * - Protecting against common web vulnerabilities (XSS, clickjacking, MITM)
 * - Building trust with search engines through HTTPS enforcement
 * - Maintaining crawlability while implementing security measures
 * - Balancing security hardening with SEO requirements
 * - Providing clear referrer policies for analytics tracking
 *
 * USE CASES:
 * 1. **Content Security Policy (CSP)**: Prevent XSS while allowing search engine scripts
 * 2. **HTTPS Enforcement**: HSTS for secure connections (Google ranking factor)
 * 3. **Frame Protection**: Prevent clickjacking without blocking legitimate embeds
 * 4. **Referrer Management**: Control referrer information for privacy and analytics
 * 5. **Permission Policies**: Restrict browser features and APIs
 *
 * APPLICATION SCENARIOS:
 * - E-commerce sites with payment processing and user data
 * - Content sites with embedded media and third-party widgets
 * - SaaS applications with multi-tenant security
 * - Corporate websites with strict security policies
 * - Sites migrating to HTTPS requiring HSTS configuration
 * - Sites with user-generated content requiring CSP protection
 *
 * SEO IMPACT:
 * - HTTPS (via HSTS) is a Google ranking signal
 * - Secure sites get "Secure" badge in browsers (increases CTR)
 * - Referrer-Policy affects analytics and attribution tracking
 * - CSP can block tracking scripts if misconfigured
 * - Frame policies affect social media previews
 *
 * @module SecurityHeaders
 */

/**
 * Content Security Policy directives
 */
export interface CspDirectives {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  fontSrc?: string[];
  connectSrc?: string[];
  mediaSrc?: string[];
  objectSrc?: string[];
  frameSrc?: string[];
  frameAncestors?: string[];
  baseUri?: string[];
  formAction?: string[];
  manifestSrc?: string[];
  workerSrc?: string[];
  upgradeInsecureRequests?: boolean;
  blockAllMixedContent?: boolean;
  reportUri?: string;
  reportTo?: string;
}

/**
 * HTTP Strict Transport Security configuration
 */
export interface HstsOptions {
  enabled: boolean;
  maxAge: number; // seconds
  includeSubDomains?: boolean;
  preload?: boolean;
}

/**
 * Referrer Policy options
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy
 */
export type ReferrerPolicyValue =
  | 'no-referrer'
  | 'no-referrer-when-downgrade'
  | 'origin'
  | 'origin-when-cross-origin'
  | 'same-origin'
  | 'strict-origin'
  | 'strict-origin-when-cross-origin'
  | 'unsafe-url';

/**
 * X-Frame-Options values
 */
export type FrameOptionsValue = 'DENY' | 'SAMEORIGIN' | { allowFrom: string };

/**
 * Permissions Policy (formerly Feature Policy)
 */
export interface PermissionsPolicyDirectives {
  camera?: string[];
  microphone?: string[];
  geolocation?: string[];
  payment?: string[];
  usb?: string[];
  accelerometer?: string[];
  gyroscope?: string[];
  magnetometer?: string[];
  fullscreen?: string[];
  pictureInPicture?: string[];
  displayCapture?: string[];
  autoplay?: string[];
  encryptedMedia?: string[];
  midi?: string[];
}

/**
 * Complete security headers configuration
 */
export interface SecurityHeadersOptions {
  /** Content Security Policy */
  csp?: CspDirectives | false;

  /** HTTP Strict Transport Security */
  hsts?: HstsOptions | false;

  /** Referrer Policy */
  referrerPolicy?: ReferrerPolicyValue;

  /** X-Frame-Options */
  frameOptions?: FrameOptionsValue | false;

  /** X-Content-Type-Options */
  noSniff?: boolean;

  /** X-XSS-Protection (legacy, for older browsers) */
  xssProtection?: boolean | 'block' | 'report';

  /** Permissions-Policy */
  permissionsPolicy?: PermissionsPolicyDirectives | false;

  /** X-DNS-Prefetch-Control */
  dnsPrefetchControl?: boolean;

  /** Expect-CT */
  expectCt?: {
    maxAge: number;
    enforce?: boolean;
    reportUri?: string;
  } | false;

  /** Cross-Origin-Opener-Policy */
  crossOriginOpenerPolicy?: 'same-origin' | 'same-origin-allow-popups' | 'unsafe-none';

  /** Cross-Origin-Embedder-Policy */
  crossOriginEmbedderPolicy?: 'require-corp' | 'credentialless' | 'unsafe-none';

  /** Cross-Origin-Resource-Policy */
  crossOriginResourcePolicy?: 'same-origin' | 'same-site' | 'cross-origin';
}

/**
 * SEO-friendly security header presets
 */
export const SECURITY_PRESETS = {
  /**
   * Strict security for high-value applications (banking, healthcare)
   * May impact some third-party integrations
   */
  strict: {
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: true,
      blockAllMixedContent: true,
    },
    hsts: {
      enabled: true,
      maxAge: 63072000, // 2 years
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: 'strict-origin-when-cross-origin' as ReferrerPolicyValue,
    frameOptions: 'DENY' as FrameOptionsValue,
    noSniff: true,
    xssProtection: 'block',
    crossOriginOpenerPolicy: 'same-origin',
    crossOriginEmbedderPolicy: 'require-corp',
    crossOriginResourcePolicy: 'same-origin',
  },

  /**
   * Balanced security for most websites with analytics and CDNs
   * Recommended for production sites with SEO considerations
   */
  balanced: {
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Google Analytics, Google Tag Manager
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://ssl.google-analytics.com',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'https://www.google-analytics.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://www.google-analytics.com'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.google.com'],
      frameAncestors: ["'self'"],
      upgradeInsecureRequests: true,
    },
    hsts: {
      enabled: true,
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: false,
    },
    referrerPolicy: 'strict-origin-when-cross-origin' as ReferrerPolicyValue,
    frameOptions: 'SAMEORIGIN' as FrameOptionsValue,
    noSniff: true,
    xssProtection: 'block',
    dnsPrefetchControl: true,
  },

  /**
   * Relaxed security for content sites with many third-party integrations
   * Allows social embeds, ads, and various widgets
   */
  relaxed: {
    csp: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https:'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ['*', 'data:', 'blob:'],
      fontSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ['*'],
      mediaSrc: ['*'],
      frameSrc: ['*'],
      frameAncestors: ["'self'", 'https:'],
      upgradeInsecureRequests: true,
    },
    hsts: {
      enabled: true,
      maxAge: 31536000,
      includeSubDomains: false,
      preload: false,
    },
    referrerPolicy: 'no-referrer-when-downgrade' as ReferrerPolicyValue,
    frameOptions: 'SAMEORIGIN' as FrameOptionsValue,
    noSniff: true,
    xssProtection: true,
  },
} as const;

/**
 * SecurityHeaders Class
 * Manages security headers with SEO considerations
 */
export class SecurityHeaders {
  private options: SecurityHeadersOptions;
  private headers: Map<string, string>;

  constructor(options: SecurityHeadersOptions = {}) {
    this.options = options;
    this.headers = new Map();
    this.initialize();
  }

  /**
   * Initialize security headers
   */
  private initialize(): void {
    // Content Security Policy
    if (this.options.csp) {
      this.applyCsp(this.options.csp);
    }

    // HSTS
    if (this.options.hsts) {
      this.applyHsts(this.options.hsts);
    }

    // Referrer Policy
    if (this.options.referrerPolicy) {
      this.headers.set('Referrer-Policy', this.options.referrerPolicy);
    }

    // Frame Options
    if (this.options.frameOptions) {
      this.applyFrameOptions(this.options.frameOptions);
    }

    // X-Content-Type-Options
    if (this.options.noSniff !== false) {
      this.headers.set('X-Content-Type-Options', 'nosniff');
    }

    // X-XSS-Protection
    if (this.options.xssProtection !== undefined && this.options.xssProtection !== false) {
      this.applyXssProtection(this.options.xssProtection);
    }

    // Permissions Policy
    if (this.options.permissionsPolicy) {
      this.applyPermissionsPolicy(this.options.permissionsPolicy);
    }

    // DNS Prefetch Control
    if (this.options.dnsPrefetchControl !== undefined) {
      this.headers.set(
        'X-DNS-Prefetch-Control',
        this.options.dnsPrefetchControl ? 'on' : 'off'
      );
    }

    // Expect-CT
    if (this.options.expectCt) {
      this.applyExpectCt(this.options.expectCt);
    }

    // Cross-Origin Policies
    if (this.options.crossOriginOpenerPolicy) {
      this.headers.set('Cross-Origin-Opener-Policy', this.options.crossOriginOpenerPolicy);
    }

    if (this.options.crossOriginEmbedderPolicy) {
      this.headers.set('Cross-Origin-Embedder-Policy', this.options.crossOriginEmbedderPolicy);
    }

    if (this.options.crossOriginResourcePolicy) {
      this.headers.set('Cross-Origin-Resource-Policy', this.options.crossOriginResourcePolicy);
    }
  }

  /**
   * Apply Content Security Policy
   *
   * @example
   * ```typescript
   * security.applyCsp({
   *   defaultSrc: ["'self'"],
   *   scriptSrc: ["'self'", "'unsafe-inline'", 'https://www.google-analytics.com'],
   *   imgSrc: ["'self'", 'data:', 'https:'],
   *   upgradeInsecureRequests: true
   * });
   * ```
   */
  applyCsp(directives: CspDirectives): void {
    const parts: string[] = [];

    // Helper to format directive
    const addDirective = (name: string, values?: string[]) => {
      if (values && values.length > 0) {
        parts.push(`${name} ${values.join(' ')}`);
      }
    };

    addDirective('default-src', directives.defaultSrc);
    addDirective('script-src', directives.scriptSrc);
    addDirective('style-src', directives.styleSrc);
    addDirective('img-src', directives.imgSrc);
    addDirective('font-src', directives.fontSrc);
    addDirective('connect-src', directives.connectSrc);
    addDirective('media-src', directives.mediaSrc);
    addDirective('object-src', directives.objectSrc);
    addDirective('frame-src', directives.frameSrc);
    addDirective('frame-ancestors', directives.frameAncestors);
    addDirective('base-uri', directives.baseUri);
    addDirective('form-action', directives.formAction);
    addDirective('manifest-src', directives.manifestSrc);
    addDirective('worker-src', directives.workerSrc);

    if (directives.upgradeInsecureRequests) {
      parts.push('upgrade-insecure-requests');
    }

    if (directives.blockAllMixedContent) {
      parts.push('block-all-mixed-content');
    }

    if (directives.reportUri) {
      parts.push(`report-uri ${directives.reportUri}`);
    }

    if (directives.reportTo) {
      parts.push(`report-to ${directives.reportTo}`);
    }

    if (parts.length > 0) {
      this.headers.set('Content-Security-Policy', parts.join('; '));
    }
  }

  /**
   * Apply HTTP Strict Transport Security
   *
   * @example
   * ```typescript
   * security.applyHsts({
   *   enabled: true,
   *   maxAge: 31536000, // 1 year
   *   includeSubDomains: true,
   *   preload: true
   * });
   * ```
   */
  applyHsts(options: HstsOptions): void {
    if (!options.enabled) return;

    const parts: string[] = [`max-age=${options.maxAge}`];

    if (options.includeSubDomains) {
      parts.push('includeSubDomains');
    }

    if (options.preload) {
      parts.push('preload');
    }

    this.headers.set('Strict-Transport-Security', parts.join('; '));
  }

  /**
   * Apply X-Frame-Options
   */
  private applyFrameOptions(options: FrameOptionsValue): void {
    if (typeof options === 'string') {
      this.headers.set('X-Frame-Options', options);
    } else {
      this.headers.set('X-Frame-Options', `ALLOW-FROM ${options.allowFrom}`);
    }
  }

  /**
   * Apply X-XSS-Protection
   */
  private applyXssProtection(value: boolean | 'block' | 'report'): void {
    if (value === true) {
      this.headers.set('X-XSS-Protection', '1');
    } else if (value === 'block') {
      this.headers.set('X-XSS-Protection', '1; mode=block');
    } else if (value === 'report') {
      this.headers.set('X-XSS-Protection', '1; report');
    }
  }

  /**
   * Apply Permissions Policy
   *
   * @example
   * ```typescript
   * security.applyPermissionsPolicy({
   *   camera: [],
   *   microphone: [],
   *   geolocation: ['self'],
   *   payment: ['self', 'https://payment-provider.com']
   * });
   * ```
   */
  applyPermissionsPolicy(directives: PermissionsPolicyDirectives): void {
    const parts: string[] = [];

    Object.entries(directives).forEach(([feature, allowlist]) => {
      if (!allowlist) return;

      // Convert camelCase to kebab-case
      const kebabFeature = feature.replace(/([A-Z])/g, '-$1').toLowerCase();

      if (allowlist.length === 0) {
        parts.push(`${kebabFeature}=()`);
      } else {
        const formatted = allowlist.map((origin: string) => {
          if (origin === 'self') return 'self';
          if (origin === '*') return '*';
          return `"${origin}"`;
        });
        parts.push(`${kebabFeature}=(${formatted.join(' ')})`);
      }
    });

    if (parts.length > 0) {
      this.headers.set('Permissions-Policy', parts.join(', '));
    }
  }

  /**
   * Apply Expect-CT
   */
  private applyExpectCt(options: { maxAge: number; enforce?: boolean; reportUri?: string }): void {
    const parts: string[] = [`max-age=${options.maxAge}`];

    if (options.enforce) {
      parts.push('enforce');
    }

    if (options.reportUri) {
      parts.push(`report-uri="${options.reportUri}"`);
    }

    this.headers.set('Expect-CT', parts.join(', '));
  }

  /**
   * Add Google Analytics to CSP
   * Convenience method for common SEO tracking
   */
  allowGoogleAnalytics(): void {
    if (!this.options.csp || typeof this.options.csp === 'boolean') return;

    const csp = this.options.csp;

    // Add GA domains to appropriate directives
    const gaDomains = {
      scriptSrc: [
        'https://www.googletagmanager.com',
        'https://www.google-analytics.com',
        'https://ssl.google-analytics.com',
        "'unsafe-inline'",
      ],
      imgSrc: ['https://www.google-analytics.com'],
      connectSrc: ['https://www.google-analytics.com', 'https://analytics.google.com'],
    };

    Object.entries(gaDomains).forEach(([directive, domains]) => {
      const key = directive as keyof typeof gaDomains;
      const currentValue = csp[key];

      if (!currentValue) {
        csp[key] = [...domains];
      } else if (Array.isArray(currentValue)) {
        domains.forEach(domain => {
          if (!currentValue.includes(domain)) {
            currentValue.push(domain);
          }
        });
      }
    });

    this.applyCsp(csp);
  }

  /**
   * Add Google Tag Manager to CSP
   */
  allowGoogleTagManager(): void {
    if (!this.options.csp || typeof this.options.csp === 'boolean') return;

    const csp = this.options.csp;

    const gtmDomains = {
      scriptSrc: [
        'https://www.googletagmanager.com',
        "'unsafe-inline'",
        "'unsafe-eval'",
      ],
      imgSrc: ['https://www.googletagmanager.com'],
      connectSrc: ['https://www.googletagmanager.com'],
      frameSrc: ['https://www.googletagmanager.com'],
    };

    Object.entries(gtmDomains).forEach(([directive, domains]) => {
      const key = directive as keyof typeof gtmDomains;
      const currentValue = csp[key];

      if (!currentValue) {
        csp[key] = [...domains];
      } else if (Array.isArray(currentValue)) {
        domains.forEach(domain => {
          if (!currentValue.includes(domain)) {
            currentValue.push(domain);
          }
        });
      }
    });

    this.applyCsp(csp);
  }

  /**
   * Add common CDNs to CSP (fonts, styles, scripts)
   */
  allowCommonCdns(): void {
    if (!this.options.csp || typeof this.options.csp === 'boolean') return;

    const csp = this.options.csp;

    const cdnDomains = {
      scriptSrc: ['https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://cdnjs.cloudflare.com'],
      styleSrc: ['https://cdn.jsdelivr.net', 'https://unpkg.com', 'https://cdnjs.cloudflare.com', 'https://fonts.googleapis.com'],
      fontSrc: ['https://fonts.gstatic.com', 'https://cdn.jsdelivr.net'],
    };

    Object.entries(cdnDomains).forEach(([directive, domains]) => {
      const key = directive as keyof typeof cdnDomains;
      const currentValue = csp[key];

      if (!currentValue) {
        csp[key] = [...domains];
      } else if (Array.isArray(currentValue)) {
        domains.forEach(domain => {
          if (!currentValue.includes(domain)) {
            currentValue.push(domain);
          }
        });
      }
    });

    this.applyCsp(csp);
  }

  /**
   * Get all security headers as object
   *
   * @example
   * ```typescript
   * const security = new SecurityHeaders(SECURITY_PRESETS.balanced);
   * const headers = security.getHeaders();
   *
   * // Express.js
   * res.set(headers);
   *
   * // Next.js
   * Object.entries(headers).forEach(([key, value]) => {
   *   res.setHeader(key, value);
   * });
   * ```
   */
  getHeaders(): Record<string, string> {
    return Object.fromEntries(this.headers);
  }

  /**
   * Set custom security header
   */
  setHeader(key: string, value: string): void {
    this.headers.set(key, value);
  }

  /**
   * Get specific header
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
   * Clear all headers
   */
  clear(): void {
    this.headers.clear();
  }
}

/**
 * Express.js middleware factory
 *
 * @example
 * ```typescript
 * import { createSecurityMiddleware, SECURITY_PRESETS } from 'm-seo';
 *
 * app.use(createSecurityMiddleware(SECURITY_PRESETS.balanced));
 * ```
 */
export function createSecurityMiddleware(options: SecurityHeadersOptions) {
  return (_req: any, res: any, next: any) => {
    const security = new SecurityHeaders(options);
    const headers = security.getHeaders();

    Object.entries(headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    next();
  };
}

/**
 * Next.js middleware helper
 *
 * @example
 * ```typescript
 * // middleware.ts
 * import { applySecurityHeaders, SECURITY_PRESETS } from 'm-seo';
 *
 * export function middleware(req: NextRequest) {
 *   const response = NextResponse.next();
 *   applySecurityHeaders(response, SECURITY_PRESETS.balanced);
 *   return response;
 * }
 * ```
 */
export function applySecurityHeaders(res: any, options: SecurityHeadersOptions): void {
  const security = new SecurityHeaders(options);
  const headers = security.getHeaders();

  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader?.(key, value) || res.headers?.set(key, value);
  });
}
