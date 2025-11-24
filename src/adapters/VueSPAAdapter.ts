// src/adapters/VueSPAAdapter.ts

/**
 * Vue SPA Adapter for m-seo
 * Provides Vue 3 composables, components, and directives for SEO management
 *
 * Usage:
 * ```vue
 * <script setup>
 * import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';
 *
 * useSeo({
 *   title: 'My Page',
 *   description: 'Page description',
 *   keywords: ['vue', 'seo']
 * });
 * </script>
 * ```
 */

import type { SeoConfig, MetaTag, LinkTag } from '../core/SeoEngine.js';
import type { StructuredData } from '../core/StructuredDataManager.js';

// Type-only imports for Vue
type Ref<T = any> = { value: T };
type Component = any;

/**
 * Browser-safe check for Vue
 */
function getVue() {
  if (typeof window === 'undefined') {
    throw new Error('VueSPAAdapter can only be used in browser environments');
  }

  // Try to get Vue from global scope or module
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return typeof require !== 'undefined' ? require('vue') : (window as any).Vue;
  } catch {
    throw new Error('Vue is required to use VueSPAAdapter. Please install vue.');
  }
}

/**
 * Vue 3 Composable for managing SEO
 * Updates document meta tags reactively
 *
 * @example
 * ```vue
 * <script setup>
 * import { useSeo } from 'm-seo/adapters/VueSPAAdapter';
 * import { ref } from 'vue';
 *
 * const pageTitle = ref('Home');
 *
 * useSeo({
 *   title: pageTitle,
 *   description: 'Welcome to my site',
 *   keywords: ['vue', 'seo']
 * });
 * </script>
 * ```
 */
export function useSeo(config: SeoConfig | Ref<SeoConfig>): void {
  const Vue = getVue();
  const { watch, onUnmounted, isRef } = Vue;

  const applySeoTags = (seoConfig: SeoConfig) => {
    // Update title
    if (seoConfig.title) {
      document.title = seoConfig.title;
    }

    // Generate and apply meta tags
    const metaTags = generateMetaTags(seoConfig);
    const linkTags = generateLinkTags(seoConfig);

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
  };

  // If config is a ref, watch it for changes
  if (isRef(config)) {
    watch(
      () => (config as Ref<SeoConfig>).value,
      (newConfig: SeoConfig) => {
        applySeoTags(newConfig);
      },
      { immediate: true, deep: true }
    );
  } else {
    // If config is a plain object, apply immediately
    applySeoTags(config as SeoConfig);
  }

  // Cleanup on unmount
  onUnmounted(() => {
    document.querySelectorAll('meta[data-mseo]').forEach((el: Element) => el.remove());
    document.querySelectorAll('link[data-mseo]').forEach((el: Element) => el.remove());
  });
}

/**
 * Vue 3 Composable for managing structured data (JSON-LD)
 *
 * @example
 * ```vue
 * <script setup>
 * import { useStructuredData } from 'm-seo/adapters/VueSPAAdapter';
 *
 * useStructuredData({
 *   '@context': 'https://schema.org',
 *   '@type': 'Organization',
 *   name: 'My Company',
 *   url: 'https://example.com'
 * });
 * </script>
 * ```
 */
export function useStructuredData(
  schemas: StructuredData | StructuredData[] | Ref<StructuredData | StructuredData[]>
): void {
  const Vue = getVue();
  const { watch, onUnmounted, isRef } = Vue;

  const applyStructuredData = (schemaData: StructuredData | StructuredData[]) => {
    const schemaArray = Array.isArray(schemaData) ? schemaData : [schemaData];

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
  };

  // If schemas is a ref, watch it for changes
  if (isRef(schemas)) {
    watch(
      () => (schemas as Ref<StructuredData | StructuredData[]>).value,
      (newSchemas: StructuredData | StructuredData[]) => {
        applyStructuredData(newSchemas);
      },
      { immediate: true, deep: true }
    );
  } else {
    // If schemas is a plain value, apply immediately
    applyStructuredData(schemas as StructuredData | StructuredData[]);
  }

  // Cleanup on unmount
  onUnmounted(() => {
    document.querySelectorAll('script[data-mseo-ld]').forEach((el: Element) => el.remove());
  });
}

/**
 * Vue 3 Composable for breadcrumbs structured data
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBreadcrumbs } from 'm-seo/adapters/VueSPAAdapter';
 *
 * useBreadcrumbs([
 *   { name: 'Home', url: '/' },
 *   { name: 'Products', url: '/products' },
 *   { name: 'Product Name', url: '/products/123' }
 * ]);
 * </script>
 * ```
 */
export function useBreadcrumbs(
  items: Array<{ name: string; url: string }> | Ref<Array<{ name: string; url: string }>>
): void {
  const Vue = getVue();
  const { computed, isRef } = Vue;

  const breadcrumbSchema = isRef(items)
    ? computed(() => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: (items as Ref<Array<{ name: string; url: string }>>).value.map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      }))
    : {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: (items as Array<{ name: string; url: string }>).map((item: { name: string; url: string }, index: number) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url
        }))
      };

  useStructuredData(breadcrumbSchema as any);
}

/**
 * Vue 3 Composable for Open Graph tags
 *
 * @example
 * ```vue
 * <script setup>
 * import { useOpenGraph } from 'm-seo/adapters/VueSPAAdapter';
 *
 * useOpenGraph({
 *   title: 'My Page',
 *   description: 'Page description',
 *   image: 'https://example.com/image.jpg',
 *   url: 'https://example.com/page'
 * });
 * </script>
 * ```
 */
export function useOpenGraph(config: {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}): void {
  useSeo({
    title: config.title,
    description: config.description,
    ogImage: config.image,
    canonical: config.url,
    siteName: config.siteName,
    locale: config.locale
  });
}

/**
 * Vue 3 Component for managing SEO (template-based usage)
 *
 * @example
 * ```vue
 * <template>
 *   <SeoHead
 *     title="My Page"
 *     description="Page description"
 *     :keywords="['vue', 'seo']"
 *   />
 *   <div>Content</div>
 * </template>
 * ```
 */
export const SeoHead = {
  name: 'SeoHead',
  props: {
    title: String,
    description: String,
    keywords: Array,
    ogImage: String,
    canonical: String,
    author: String,
    siteName: String,
    locale: String,
    themeColor: String,
    robots: String
  },
  setup(props: SeoConfig) {
    useSeo(props);
    return () => null;
  }
} as Component;

/**
 * Vue 3 Component for JSON-LD structured data
 *
 * @example
 * ```vue
 * <template>
 *   <JsonLd :data="structuredData" />
 * </template>
 *
 * <script setup>
 * const structuredData = {
 *   '@context': 'https://schema.org',
 *   '@type': 'Article',
 *   headline: 'Article Title'
 * };
 * </script>
 * ```
 */
export const JsonLd = {
  name: 'JsonLd',
  props: {
    data: {
      type: [Object, Array],
      required: true
    }
  },
  setup(props: { data: StructuredData | StructuredData[] }) {
    useStructuredData(props.data);
    return () => null;
  }
} as Component;

/**
 * Vue 3 Component for Breadcrumbs
 *
 * @example
 * ```vue
 * <template>
 *   <Breadcrumbs :items="breadcrumbItems" />
 * </template>
 *
 * <script setup>
 * const breadcrumbItems = [
 *   { name: 'Home', url: '/' },
 *   { name: 'Products', url: '/products' }
 * ];
 * </script>
 * ```
 */
export const Breadcrumbs = {
  name: 'Breadcrumbs',
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  setup(props: { items: Array<{ name: string; url: string }> }) {
    useBreadcrumbs(props.items);
    return () => null;
  }
} as Component;

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
 * Vue SPA Adapter Class (for class-based usage)
 *
 * @example
 * ```typescript
 * import { VueSPAAdapter } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const seoAdapter = new VueSPAAdapter({
 *   title: 'My Site',
 *   description: 'Welcome'
 * });
 *
 * // Update SEO on route change
 * seoAdapter.updateSeo({
 *   title: 'New Page',
 *   description: 'New description'
 * });
 * ```
 */
export class VueSPAAdapter {
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

/**
 * Vue Router integration helper
 * Automatically updates SEO on route changes
 *
 * @example
 * ```typescript
 * import { createRouter } from 'vue-router';
 * import { setupSeoRouter } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const router = createRouter({ ... });
 *
 * setupSeoRouter(router, (route) => ({
 *   title: route.meta.title || 'My Site',
 *   description: route.meta.description || 'Welcome',
 * }));
 * ```
 */
export function setupSeoRouter(
  router: any,
  getSeoConfig: (route: any) => SeoConfig
): void {
  router.afterEach((to: any) => {
    const config = getSeoConfig(to);
    const adapter = new VueSPAAdapter(config);
    adapter.applySeo();
  });
}
