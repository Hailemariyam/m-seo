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
 */
export function useSeo(config: SeoConfig, deps?: DependencyList): void {
  const React = getReact();
  const { useEffect } = React;

  useEffect(() => {
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
 */
export function useStructuredData(schemas: StructuredData | StructuredData[], deps?: DependencyList): void {
  const React = getReact();
  const { useEffect } = React;

  useEffect(() => {
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
