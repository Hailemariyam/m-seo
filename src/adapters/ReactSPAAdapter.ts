// src/adapters/ReactSPAAdapter.ts

/**
 * React SPA Adapter for m-seo
 * Provides React hooks and components for SEO management
 *
 * Usage:
 * ```tsx
 * import { useSeo, SeoHead, useStructuredData } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function MyPage() {
 *   useSeo({
 *     title: 'My Page',
 *     description: 'Page description',
 *     keywords: ['react', 'seo']
 *   });
 *   return <div>Content</div>;
 * }
 * ```
 */

import type { SeoConfig, MetaTag, LinkTag } from '../core/SeoEngine.js';
import type { StructuredData } from '../core/StructuredDataManager.js';
import { BotDetection } from '../analytics/BotDetection.js';
import { GoogleAnalytics, type GAConfig, type PageViewData, type EventData, type TransactionData, type UserProperties, type SEOMetrics } from '../analytics/GoogleAnalytics.js';
import { GoogleSearchConsole, type GSCConfig, type SearchAnalyticsQuery, type URLInspectionResult } from '../analytics/GoogleSearchConsole.js';
import { createUrlManager, type UrlManager, type UrlConfig } from '../core/UrlManager.js';
import { createI18n, type Internationalization, type I18nConfig, type HreflangTag } from '../core/Internationalization.js';

// Type-only imports (won't cause issues if React isn't installed)
type ReactElement = any;
type DependencyList = ReadonlyArray<any>;

/**
 * Browser-safe check for React
 */
function getReact() {
  if (typeof window === 'undefined') {
    throw new Error('ReactSPAAdapter can only be used in browser environments');
  }

  // Try to get React from global scope or module
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return typeof require !== 'undefined' ? require('react') : (window as any).React;
  } catch {
    throw new Error('React is required to use ReactSPAAdapter. Please install react and react-dom.');
  }
}

/**
 * Custom hook for managing SEO in React applications
 * Updates document meta tags when dependencies change
 * Automatically optimized for bots - skips client-side rendering for crawlers
 */
export function useSeo(config: SeoConfig, deps?: DependencyList): void {
  const React = getReact();
  const { useEffect } = React;

  useEffect(() => {
    // Skip client-side SEO rendering for bots (they use server-rendered tags)
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

    // Update title
    if (config.title) {
      document.title = config.title;
    }

    // Generate and apply meta tags
    const metaTags = generateMetaTags(config);
    const linkTags = generateLinkTags(config);

    // Remove old m-seo managed tags
    document.querySelectorAll('meta[data-mseo]').forEach((el: Element) => el.remove());
    document.querySelectorAll('link[data-mseo]').forEach((el: Element) => el.remove());

    // Add new meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-mseo', 'true');

      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      if (tag.httpEquiv) meta.setAttribute('http-equiv', tag.httpEquiv);
      meta.setAttribute('content', tag.content);

      document.head.appendChild(meta);
    });

    // Add link tags
    linkTags.forEach(link => {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('data-mseo', 'true');
      linkEl.setAttribute('rel', link.rel);
      linkEl.setAttribute('href', link.href);

      if (link.hreflang) linkEl.setAttribute('hreflang', link.hreflang);
      if (link.sizes) linkEl.setAttribute('sizes', link.sizes);
      if (link.type) linkEl.setAttribute('type', link.type);

      document.head.appendChild(linkEl);
    });

    // Cleanup on unmount or when deps change
    return () => {
      document.querySelectorAll('meta[data-mseo]').forEach((el: Element) => el.remove());
      document.querySelectorAll('link[data-mseo]').forEach((el: Element) => el.remove());
    };
  }, deps || [config.title, config.description, config.keywords?.join(','), config.ogImage, config.canonical]);
}

/**
 * Custom hook for managing structured data (JSON-LD)
 * Automatically optimized for bots - skips client-side rendering for crawlers
 */
export function useStructuredData(schemas: StructuredData | StructuredData[], deps?: DependencyList): void {
  const React = getReact();
  const { useEffect } = React;

  useEffect(() => {
    // Skip client-side structured data for bots (they use server-rendered JSON-LD)
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

    // Remove old structured data
    document.querySelectorAll('script[data-mseo-ld]').forEach((el: Element) => el.remove());

    // Add new structured data
    schemaArray.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-mseo-ld', 'true');
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });

    // Cleanup
    return () => {
      document.querySelectorAll('script[data-mseo-ld]').forEach((el: Element) => el.remove());
    };
  }, deps || [JSON.stringify(schemas)]);
}

/**
 * Custom hook for breadcrumbs structured data
 */
export function useBreadcrumbs(items: Array<{ name: string; url: string }>, deps?: DependencyList): void {
  const breadcrumbSchema: StructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  useStructuredData(breadcrumbSchema, deps);
}

/**
 * React component for managing SEO (alternative to useSeo hook)
 */
export function SeoHead(props: SeoConfig): ReactElement {
  useSeo(props);
  return null;
}

/**
 * React component for JSON-LD structured data
 */
export function JsonLd({ data }: { data: StructuredData | StructuredData[] }): ReactElement {
  useStructuredData(data);
  return null;
}

/**
 * Higher-order component for adding SEO to pages
 */
export function withSeo(config: SeoConfig | ((props: any) => SeoConfig)) {
  return function <P extends object>(Component: React.ComponentType<P>) {
    return function WithSeoComponent(props: P) {
      const React = getReact();
      const seoConfig = typeof config === 'function' ? config(props) : config;
      useSeo(seoConfig);
      return React.createElement(Component, props);
    };
  };
}

/**
 * React hook for bot detection integration
 * Provides bot information and detection utilities
 *
 * @example
 * ```tsx
 * import { useBotDetection } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function MyComponent() {
 *   const { isBot, botInfo, isSearchEngine } = useBotDetection();
 *
 *   if (isBot) {
 *     return <div>Bot-optimized content for {botInfo.name}</div>;
 *   }
 *
 *   return <div>Regular user content</div>;
 * }
 * ```
 */
export function useBotDetection() {
  const React = getReact();
  const { useState } = React;

  const [botInfo] = useState(() => BotDetection.getBotInfo());

  return {
    isBot: botInfo.isBot,
    botInfo,
    botType: botInfo.type,
    botName: botInfo.name,
    isSearchEngine: BotDetection.isSearchEngine(),
    isSocialMedia: BotDetection.isSocialMedia(),
    isSEOTool: BotDetection.isSEOTool(),
    isAIBot: BotDetection.isAIBot(),
    shouldRenderClientSide: BotDetection.shouldRenderClientSide(),
    getAnalyticsCategory: () => BotDetection.getAnalyticsCategory(),
    getBotSuspicionScore: () => BotDetection.getBotSuspicionScore()
  };
}

/**
 * React Hook for Google Analytics Integration
 * Provides a comprehensive analytics interface with automatic bot filtering
 *
 * @example
 * ```tsx
 * import { useGoogleAnalytics } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function MyComponent() {
 *   const analytics = useGoogleAnalytics({
 *     measurementId: 'G-XXXXXXXXXX',
 *     filterBots: true
 *   });
 *
 *   const handleClick = () => {
 *     analytics.event('button_click', {
 *       category: 'Engagement',
 *       label: 'CTA Button'
 *     });
 *   };
 *
 *   return <button onClick={handleClick}>Click me</button>;
 * }
 * ```
 */
export function useGoogleAnalytics(config: GAConfig) {
  const React = getReact();
  const { useEffect, useRef } = React;

  const analyticsRef = useRef(null as GoogleAnalytics | null);

  useEffect(() => {
    if (!analyticsRef.current) {
      analyticsRef.current = new GoogleAnalytics(config);
      analyticsRef.current.initialize();
    }

    return () => {
      // Cleanup on unmount
      if (analyticsRef.current) {
        analyticsRef.current.trackTimeOnPage();
      }
    };
  }, []);

  return analyticsRef.current;
}

/**
 * React Hook for tracking page views automatically on route changes
 * Use with React Router or any routing library
 *
 * @example
 * ```tsx
 * import { usePageViewTracking } from 'm-seo/adapters/ReactSPAAdapter';
 * import { useLocation } from 'react-router-dom';
 *
 * function App() {
 *   const location = useLocation();
 *   usePageViewTracking(analytics, location.pathname);
 *
 *   return <YourApp />;
 * }
 * ```
 */
export function usePageViewTracking(
  analytics: GoogleAnalytics | null,
  pathname: string,
  customData?: Omit<PageViewData, 'page_path'>
): void {
  const React = getReact();
  const { useEffect } = React;

  useEffect(() => {
    if (analytics) {
      analytics.pageView({
        page_path: pathname,
        page_title: document.title,
        ...customData
      });
    }
  }, [pathname, analytics]);
}

/**
 * React Hook for tracking events
 * Provides a memoized event tracker function
 *
 * @example
 * ```tsx
 * import { useEventTracking } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function MyComponent() {
 *   const { analytics } = useGoogleAnalytics({ measurementId: 'G-XXX' });
 *   const trackEvent = useEventTracking(analytics);
 *
 *   const handleSubmit = () => {
 *     trackEvent('form_submit', {
 *       category: 'Conversion',
 *       label: 'Contact Form'
 *     });
 *   };
 *
 *   return <form onSubmit={handleSubmit}>...</form>;
 * }
 * ```
 */
export function useEventTracking(analytics: GoogleAnalytics | null) {
  const React = getReact();
  const { useCallback } = React;

  return useCallback(
    (eventName: string, data?: EventData) => {
      if (analytics) {
        analytics.event(eventName, data);
      }
    },
    [analytics]
  );
}

/**
 * React Hook for tracking e-commerce transactions
 *
 * @example
 * ```tsx
 * import { useTransactionTracking } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function CheckoutPage() {
 *   const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 *   const trackTransaction = useTransactionTracking(analytics);
 *
 *   const handlePurchase = (orderData) => {
 *     trackTransaction({
 *       transaction_id: orderData.id,
 *       value: orderData.total,
 *       currency: 'USD',
 *       items: orderData.items
 *     });
 *   };
 *
 *   return <button onClick={handlePurchase}>Complete Purchase</button>;
 * }
 * ```
 */
export function useTransactionTracking(analytics: GoogleAnalytics | null) {
  const React = getReact();
  const { useCallback } = React;

  return useCallback(
    (data: TransactionData) => {
      if (analytics) {
        analytics.transaction(data);
      }
    },
    [analytics]
  );
}

/**
 * React Hook for tracking user properties
 *
 * @example
 * ```tsx
 * import { useUserTracking } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function App() {
 *   const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 *   const setUser = useUserTracking(analytics);
 *
 *   useEffect(() => {
 *     if (currentUser) {
 *       setUser({
 *         user_id: currentUser.id,
 *         user_type: currentUser.plan
 *       });
 *     }
 *   }, [currentUser]);
 *
 *   return <YourApp />;
 * }
 * ```
 */
export function useUserTracking(analytics: GoogleAnalytics | null) {
  const React = getReact();
  const { useCallback } = React;

  return useCallback(
    (properties: UserProperties) => {
      if (analytics) {
        analytics.setUser(properties);
      }
    },
    [analytics]
  );
}

/**
 * React Hook for tracking SEO metrics
 *
 * @example
 * ```tsx
 * import { useSEOTracking } from 'm-seo/adapters/ReactSPAAdapter';
 *
 * function BlogPost() {
 *   const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 *   const trackSEO = useSEOTracking(analytics);
 *
 *   useEffect(() => {
 *     const params = new URLSearchParams(window.location.search);
 *     const query = params.get('q');
 *     if (query) {
 *       trackSEO({
 *         organic_source: 'google',
 *         search_query: query
 *       });
 *     }
 *   }, []);
 *
 *   return <article>...</article>;
 * }
 * ```
 */
export function useSEOTracking(analytics: GoogleAnalytics | null) {
  const React = getReact();
  const { useCallback } = React;

  return useCallback(
    (metrics: SEOMetrics) => {
      if (analytics) {
        analytics.trackSEOMetrics(metrics);
      }
    },
    [analytics]
  );
}

// ============================================================================
// Google Search Console Hooks
// ============================================================================

/**
 * Hook for Google Search Console instance
 *
 * Creates and manages a Google Search Console client instance.
 * Note: This is primarily for server-side or dashboard applications,
 * as the Search Console API requires OAuth2 authentication.
 *
 * @param config - Google Search Console configuration
 * @returns GoogleSearchConsole instance or null
 *
 * @example
 * ```tsx
 * function Dashboard() {
 *   const gsc = useGoogleSearchConsole({
 *     siteUrl: 'https://example.com',
 *     credentials: {
 *       accessToken: process.env.REACT_APP_GSC_TOKEN
 *     }
 *   });
 *
 *   return <div>Search Console Dashboard</div>;
 * }
 * ```
 */
export function useGoogleSearchConsole(config: GSCConfig) {
  const React = getReact();
  const { useRef, useEffect } = React;

  const gscRef = useRef(null as GoogleSearchConsole | null);

  useEffect(() => {
    if (!gscRef.current) {
      gscRef.current = new GoogleSearchConsole(config);
    }
  }, [config.siteUrl]);

  return gscRef.current;
}

/**
 * Hook for fetching search analytics data
 *
 * Fetches and manages search analytics data from Google Search Console.
 * Automatically refetches when query parameters change.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param query - Search analytics query parameters
 * @returns Object with data, loading state, and error
 *
 * @example
 * ```tsx
 * function PerformanceReport() {
 *   const gsc = useGoogleSearchConsole({...});
 *   const { data, loading, error } = useSearchAnalytics(gsc, {
 *     startDate: '2024-01-01',
 *     endDate: '2024-01-31',
 *     dimensions: ['query']
 *   });
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <ul>
 *       {data?.rows.map(row => (
 *         <li key={row.keys?.[0]}>
 *           {row.keys?.[0]}: {row.clicks} clicks
 *         </li>
 *       ))}
 *     </ul>
 *   );
 * }
 * ```
 */
export function useSearchAnalytics(
  gsc: GoogleSearchConsole | null,
  query: SearchAnalyticsQuery
) {
  const React = getReact();
  const { useState, useEffect } = React;

  const [data, setData] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as Error | null);

  useEffect(() => {
    if (!gsc) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    gsc.getSearchAnalytics(query)
      .then(result => {
        setData(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [gsc, JSON.stringify(query)]);

  return { data, loading, error };
}

/**
 * Hook for URL inspection
 *
 * Inspects a URL and returns its indexing status and issues.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param url - URL to inspect
 * @returns Object with inspection result, loading state, and error
 *
 * @example
 * ```tsx
 * function URLChecker({ url }: { url: string }) {
 *   const gsc = useGoogleSearchConsole({...});
 *   const { result, loading, error } = useURLInspection(gsc, url);
 *
 *   if (loading) return <div>Checking...</div>;
 *   if (error) return <div>Error: {error.message}</div>;
 *
 *   return (
 *     <div>
 *       <p>Indexed: {result?.isIndexed ? '✅' : '❌'}</p>
 *       <p>Status: {result?.indexStatus}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useURLInspection(
  gsc: GoogleSearchConsole | null,
  url: string | null
) {
  const React = getReact();
  const { useState, useEffect } = React;

  const [result, setResult] = useState(null as URLInspectionResult | null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null as Error | null);

  useEffect(() => {
    if (!gsc || !url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    gsc.inspectUrl(url)
      .then(inspectionResult => {
        setResult(inspectionResult);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [gsc, url]);

  return { result, loading, error };
}

/**
 * Hook for performance summary
 *
 * Fetches performance summary for a date range.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Object with summary, loading state, and error
 *
 * @example
 * ```tsx
 * function PerformanceSummary() {
 *   const gsc = useGoogleSearchConsole({...});
 *   const { summary, loading } = usePerformanceSummary(
 *     gsc,
 *     '2024-01-01',
 *     '2024-01-31'
 *   );
 *
 *   if (loading) return <div>Loading...</div>;
 *
 *   return (
 *     <div>
 *       <p>Clicks: {summary?.totalClicks}</p>
 *       <p>Impressions: {summary?.totalImpressions}</p>
 *       <p>CTR: {(summary?.averageCtr * 100).toFixed(2)}%</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function usePerformanceSummary(
  gsc: GoogleSearchConsole | null,
  startDate: string,
  endDate: string
) {
  const React = getReact();
  const { useState, useEffect } = React;

  const [summary, setSummary] = useState(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null as Error | null);

  useEffect(() => {
    if (!gsc) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    gsc.getPerformanceSummary(startDate, endDate)
      .then(result => {
        setSummary(result);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [gsc, startDate, endDate]);

  return { summary, loading, error };
}

/**
 * Utility: Generate meta tags (matches SeoEngine logic)
 */
function generateMetaTags(config: SeoConfig): MetaTag[] {
  const tags: MetaTag[] = [];

  if (config.title) {
    tags.push({ name: 'title', content: config.title });
    tags.push({ property: 'og:title', content: config.title });
    tags.push({ name: 'twitter:title', content: config.title });
  }

  if (config.description) {
    tags.push({ name: 'description', content: config.description });
    tags.push({ property: 'og:description', content: config.description });
    tags.push({ name: 'twitter:description', content: config.description });
  }

  if (config.keywords && config.keywords.length > 0) {
    tags.push({ name: 'keywords', content: config.keywords.join(', ') });
  }

  if (config.ogImage) {
    tags.push({ property: 'og:image', content: config.ogImage });
    tags.push({ name: 'twitter:image', content: config.ogImage });
    tags.push({ name: 'twitter:card', content: 'summary_large_image' });
  }

  if (config.author) {
    tags.push({ name: 'author', content: config.author });
  }

  if (config.siteName) {
    tags.push({ property: 'og:site_name', content: config.siteName });
  }

  if (config.locale) {
    tags.push({ property: 'og:locale', content: config.locale });
  }

  if (config.themeColor) {
    tags.push({ name: 'theme-color', content: config.themeColor });
  }

  if (config.robots) {
    tags.push({ name: 'robots', content: config.robots });
  }

  tags.push({ property: 'og:type', content: 'website' });

  return tags;
}

/**
 * Utility: Generate link tags
 */
function generateLinkTags(config: SeoConfig): LinkTag[] {
  const links: LinkTag[] = [];

  if (config.canonical) {
    links.push({ rel: 'canonical', href: config.canonical });
    links.push({
      rel: 'alternate',
      href: config.canonical,
      hreflang: config.locale || 'en'
    });
  }

  return links;
}

/**
 * React SPA Adapter Class (for class-based usage)
 */
export class ReactSPAAdapter {
  private config: SeoConfig;

  constructor(config: SeoConfig = {}) {
    this.config = config;
  }

  /**
   * Update SEO configuration
   */
  updateSeo(config: Partial<SeoConfig>): void {
    this.config = { ...this.config, ...config };
    this.applySeo();
  }

  /**
   * Apply SEO to document
   */
  applySeo(): void {
    if (this.config.title) {
      document.title = this.config.title;
    }

    const metaTags = generateMetaTags(this.config);
    const linkTags = generateLinkTags(this.config);

    // Remove old tags
    document.querySelectorAll('meta[data-mseo]').forEach((el: Element) => el.remove());
    document.querySelectorAll('link[data-mseo]').forEach((el: Element) => el.remove());

    // Add meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-mseo', 'true');

      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      if (tag.httpEquiv) meta.setAttribute('http-equiv', tag.httpEquiv);
      meta.setAttribute('content', tag.content);

      document.head.appendChild(meta);
    });

    // Add link tags
    linkTags.forEach(link => {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('data-mseo', 'true');
      linkEl.setAttribute('rel', link.rel);
      linkEl.setAttribute('href', link.href);

      if (link.hreflang) linkEl.setAttribute('hreflang', link.hreflang);
      if (link.sizes) linkEl.setAttribute('sizes', link.sizes);
      if (link.type) linkEl.setAttribute('type', link.type);

      document.head.appendChild(linkEl);
    });
  }

  /**
   * Add structured data
   */
  addStructuredData(schema: StructuredData): void {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-mseo-ld', 'true');
    script.textContent = JSON.stringify(schema, null, 2);
    document.head.appendChild(script);
  }

  /**
   * Clear all SEO tags
   */
  clear(): void {
    document.querySelectorAll('meta[data-mseo]').forEach(el => el.remove());
    document.querySelectorAll('link[data-mseo]').forEach(el => el.remove());
    document.querySelectorAll('script[data-mseo-ld]').forEach(el => el.remove());
  }
}

// ============================================================================
// URL MANAGER HOOKS
// ============================================================================

/**
 * React hook for URL management
 * Provides URL utilities for SEO optimization
 * 
 * @example
 * ```tsx
 * function ProductPage({ productName }) {
 *   const { createSlug, getCanonical, generatePagination } = useUrlManager({
 *     baseUrl: 'https://example.com',
 *     trailingSlash: true
 *   });
 *   
 *   const slug = createSlug(productName);
 *   const canonical = getCanonical(`/products/${slug}`);
 *   
 *   return (
 *     <head>
 *       <link rel="canonical" href={canonical} />
 *     </head>
 *   );
 * }
 * ```
 */
export function useUrlManager(config: UrlConfig): UrlManager {
  const React = getReact();
  const { useMemo } = React;
  
  return useMemo(() => createUrlManager(config), [JSON.stringify(config)]);
}

/**
 * React hook for canonical URL
 * Automatically adds canonical link tag to document head
 * 
 * @example
 * ```tsx
 * function ProductPage() {
 *   const canonical = useCanonical('/products/shoes', {
 *     baseUrl: 'https://example.com',
 *     locale: 'en'
 *   });
 *   
 *   return <div>Product content</div>;
 * }
 * ```
 */
export function useCanonical(
  path: string,
  config: UrlConfig & { locale?: string } = { baseUrl: '' }
): string {
  const React = getReact();
  const { useEffect, useMemo } = React;
  
  const urlManager = useMemo(() => createUrlManager(config), [JSON.stringify(config)]);
  const canonical = useMemo(
    () => urlManager.getCanonical(path, { locale: config.locale }),
    [path, config.locale, urlManager]
  );
  
  useEffect(() => {
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }
    
    // Remove existing canonical
    const existing = document.querySelector('link[rel="canonical"][data-mseo]');
    if (existing) existing.remove();
    
    // Add new canonical
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    link.setAttribute('data-mseo', 'true');
    document.head.appendChild(link);
    
    return () => {
      link.remove();
    };
  }, [canonical]);
  
  return canonical;
}

/**
 * React hook for hreflang tags
 * Automatically adds hreflang link tags to document head
 * 
 * @example
 * ```tsx
 * function ProductPage() {
 *   const hreflangTags = useHreflang('/products', 'https://example.com', {
 *     locales: ['en', 'es', 'fr'],
 *     includeDefault: true
 *   });
 *   
 *   return <div>Product content</div>;
 * }
 * ```
 */
export function useHreflang(
  path: string,
  baseUrl: string,
  options: {
    locales: string[];
    urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
    includeDefault?: boolean;
  }
): HreflangTag[] {
  const React = getReact();
  const { useEffect, useMemo } = React;
  
  const urlManager = useMemo(
    () => createUrlManager({
      baseUrl,
      localePrefix: (options.urlStrategy === 'query' ? 'none' : options.urlStrategy) || 'path',
      defaultLocale: options.locales[0]
    }),
    [baseUrl, options.urlStrategy, options.locales[0]]
  );
  
  const hreflangTags = useMemo(
    () => urlManager.generateAlternates(path, options.locales, {
      includeDefault: options.includeDefault
    }),
    [path, options.locales, options.includeDefault, urlManager]
  );
  
  useEffect(() => {
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }
    
    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang][data-mseo]').forEach(el => el.remove());
    
    // Add new hreflang tags
    const links: HTMLLinkElement[] = [];
    hreflangTags.forEach((tag: HreflangTag) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = tag.hreflang;
      link.href = tag.href;
      link.setAttribute('data-mseo', 'true');
      document.head.appendChild(link);
      links.push(link);
    });
    
    return () => {
      links.forEach(link => link.remove());
    };
  }, [hreflangTags]);
  
  return hreflangTags;
}

// ============================================================================
// INTERNATIONALIZATION HOOKS
// ============================================================================

/**
 * React hook for internationalization
 * Provides i18n utilities and manages locale state
 * 
 * @example
 * ```tsx
 * function App() {
 *   const { t, locale, setLocale, formatDate, formatCurrency } = useI18n({
 *     defaultLocale: 'en',
 *     supportedLocales: ['en', 'es', 'fr']
 *   });
 *   
 *   return (
 *     <div>
 *       <h1>{t('welcome.message')}</h1>
 *       <select value={locale} onChange={(e) => setLocale(e.target.value)}>
 *         {['en', 'es', 'fr'].map(loc => (
 *           <option key={loc} value={loc}>{loc}</option>
 *         ))}
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */
export function useI18n(config: I18nConfig): {
  i18n: Internationalization;
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatRelativeTime: (date: Date) => string;
} {
  const React = getReact();
  const { useState, useMemo, useCallback } = React;
  
  const i18n = useMemo(() => createI18n(config), [JSON.stringify(config)]);
  const [locale, setLocaleState] = useState(i18n.getLocale());
  
  const setLocale = useCallback((newLocale: string) => {
    i18n.setLocale(newLocale);
    setLocaleState(newLocale);
  }, [i18n]);
  
  const t = useCallback((key: string, params?: Record<string, any>) => {
    return i18n.translate(key, params);
  }, [i18n, locale]);
  
  const formatDate = useCallback((date: Date, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(date, options);
  }, [i18n, locale]);
  
  const formatNumber = useCallback((num: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(num, options);
  }, [i18n, locale]);
  
  const formatCurrency = useCallback((amount: number, currency?: string) => {
    return i18n.formatCurrency(amount, currency);
  }, [i18n, locale]);
  
  const formatRelativeTime = useCallback((date: Date) => {
    return i18n.formatRelativeTime(date);
  }, [i18n, locale]);
  
  return {
    i18n,
    locale,
    setLocale,
    t,
    formatDate,
    formatNumber,
    formatCurrency,
    formatRelativeTime
  };
}

/**
 * React hook for locale detection
 * Automatically detects and sets the appropriate locale
 * 
 * @example
 * ```tsx
 * function App() {
 *   const locale = useLocaleDetection({
 *     defaultLocale: 'en',
 *     supportedLocales: ['en', 'es', 'fr'],
 *     detectLocale: true
 *   });
 *   
 *   return <div>Current locale: {locale}</div>;
 * }
 * ```
 */
export function useLocaleDetection(config: I18nConfig): string {
  const React = getReact();
  const { useState, useEffect, useMemo } = React;
  
  const i18n = useMemo(() => createI18n(config), [JSON.stringify(config)]);
  const [locale, setLocale] = useState(i18n.getLocale());
  
  useEffect(() => {
    const detected = i18n.detectLocale();
    i18n.setLocale(detected);
    setLocale(detected);
  }, [i18n]);
  
  return locale;
}

/**
 * React hook for locale switcher
 * Provides data for rendering language switcher UI
 * 
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
 *     defaultLocale: 'en',
 *     supportedLocales: ['en', 'es', 'fr'],
 *     baseUrl: 'https://example.com'
 *   });
 *   
 *   return (
 *     <select value={currentLocale} onChange={(e) => switchLocale(e.target.value)}>
 *       {locales.map(loc => (
 *         <option key={loc.code} value={loc.code}>
 *           {loc.nativeName}
 *         </option>
 *       ))}
 *     </select>
 *   );
 * }
 * ```
 */
export function useLocaleSwitcher(
  config: I18nConfig & { baseUrl: string }
): {
  locales: Array<{ code: string; name: string; nativeName: string; url: string; active: boolean }>;
  currentLocale: string;
  switchLocale: (locale: string) => void;
} {
  const React = getReact();
  const { useState, useMemo, useCallback } = React;
  
  const i18n = useMemo(() => createI18n(config), [JSON.stringify(config)]);
  const [currentLocale, setCurrentLocale] = useState(i18n.getLocale());
  
  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  };
  
  const locales = useMemo(() => {
    return i18n.getLocaleSwitcherData(getCurrentPath(), config.baseUrl);
  }, [i18n, currentLocale, config.baseUrl]);
  
  const switchLocale = useCallback((newLocale: string) => {
    i18n.setLocale(newLocale);
    setCurrentLocale(newLocale);
    
    // Navigate to localized URL
    const localeUrl = i18n.getLocalizedUrl(getCurrentPath(), newLocale, config.baseUrl);
    if (typeof window !== 'undefined') {
      window.location.href = localeUrl;
    }
  }, [i18n, config.baseUrl]);
  
  return {
    locales,
    currentLocale,
    switchLocale
  };
}

