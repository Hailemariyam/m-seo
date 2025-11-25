// src/adapters/VueSPAAdapter.ts

/**
 * Vue SPA Adapter for m-seo
 * Provides Vue 3 composables, components, and directives export function useStructuredData(
  schemas: StructuredData | StructuredData[] | Ref<StructuredData | StructuredData[]>
): void {
  const injectSchemas = (data: StructuredData | StructuredData[]) => { management
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

import { watch, onUnmounted, isRef, computed, ref, type Ref } from 'vue';
import type { SeoConfig, MetaTag, LinkTag } from '../core/SeoEngine.js';
import type { StructuredData } from '../core/StructuredDataManager.js';
import { BotDetection } from '../analytics/BotDetection.js';
import { GoogleAnalytics, type GAConfig, type PageViewData, type EventData, type TransactionData, type UserProperties, type SEOMetrics } from '../analytics/GoogleAnalytics.js';
import { GoogleSearchConsole, type GSCConfig, type SearchAnalyticsQuery, type URLInspectionResult, type PerformanceSummary } from '../analytics/GoogleSearchConsole.js';
import { createUrlManager, type UrlManager, type UrlConfig } from '../core/UrlManager.js';
import { createI18n, type Internationalization, type I18nConfig, type HreflangTag } from '../core/Internationalization.js';

/**
 * Vue 3 Composable for managing SEO
 * Updates document meta tags reactively
 * Automatically optimized for bots - skips client-side rendering for crawlers
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
  const applySeoTags = (seoConfig: SeoConfig) => {
    // Skip client-side SEO rendering for bots (they use server-rendered tags)
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

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
 * Automatically optimized for bots - skips client-side rendering for crawlers
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
  const applyStructuredData = (schemaData: StructuredData | StructuredData[]) => {
    // Skip client-side structured data for bots (they use server-rendered JSON-LD)
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

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
};

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
};

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
};

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

/**
 * Vue 3 Composable for bot detection integration
 * Provides bot information and detection utilities
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBotDetection } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const { isBot, botInfo, isSearchEngine } = useBotDetection();
 * </script>
 *
 * <template>
 *   <div v-if="isBot">
 *     Bot-optimized content for {{ botInfo.name }}
 *   </div>
 *   <div v-else>
 *     Regular user content
 *   </div>
 * </template>
 * ```
 */
export function useBotDetection() {
  const botInfo = BotDetection.getBotInfo();

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
 * Vue 3 Composable for Google Analytics Integration
 * Provides a comprehensive analytics interface with automatic bot filtering
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useGoogleAnalytics } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const analytics = useGoogleAnalytics({
 *   measurementId: 'G-XXXXXXXXXX',
 *   filterBots: true
 * });
 *
 * const handleClick = () => {
 *   analytics.event('button_click', {
 *     category: 'Engagement',
 *     label: 'CTA Button'
 *   });
 * };
 * </script>
 *
 * <template>
 *   <button @click="handleClick">Click me</button>
 * </template>
 * ```
 */
export function useGoogleAnalytics(config: GAConfig | Ref<GAConfig>) {
  const getConfig = () => (isRef(config) ? config.value : config);

  const analytics = new GoogleAnalytics(getConfig());
  analytics.initialize();

  // If config is reactive, reinitialize when it changes
  if (isRef(config)) {
    watch(config, (newConfig) => {
      analytics.clear();
      const newAnalytics = new GoogleAnalytics(newConfig);
      newAnalytics.initialize();
    });
  }

  // Track time on page before component unmounts
  onUnmounted(() => {
    analytics.trackTimeOnPage();
  });

  return analytics;
}

/**
 * Vue 3 Composable for tracking page views automatically on route changes
 * Use with Vue Router
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { usePageViewTracking } from 'm-seo/adapters/VueSPAAdapter';
 * import { useRouter } from 'vue-router';
 *
 * const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 * const router = useRouter();
 * usePageViewTracking(analytics, router);
 * </script>
 * ```
 */
export function usePageViewTracking(
  analytics: GoogleAnalytics,
  router: any,
  customDataFn?: (route: any) => Omit<PageViewData, 'page_path' | 'page_title'>
): void {
  watch(
    () => router.currentRoute.value,
    (route) => {
      const customData = customDataFn ? customDataFn(route) : {};
      analytics.pageView({
        page_path: route.path,
        page_title: (route.meta.title as string) || document.title,
        ...customData
      });
    },
    { immediate: true }
  );
}

/**
 * Vue 3 Composable for tracking events
 * Returns a function to track events
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useEventTracking } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 * const trackEvent = useEventTracking(analytics);
 *
 * const handleSubmit = () => {
 *   trackEvent('form_submit', {
 *     category: 'Conversion',
 *     label: 'Contact Form'
 *   });
 * };
 * </script>
 *
 * <template>
 *   <form @submit.prevent="handleSubmit">...</form>
 * </template>
 * ```
 */
export function useEventTracking(analytics: GoogleAnalytics) {
  return (eventName: string, data?: EventData) => {
    analytics.event(eventName, data);
  };
}

/**
 * Vue 3 Composable for tracking e-commerce transactions
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useTransactionTracking } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 * const trackTransaction = useTransactionTracking(analytics);
 *
 * const handlePurchase = (orderData: any) => {
 *   trackTransaction({
 *     transaction_id: orderData.id,
 *     value: orderData.total,
 *     currency: 'USD',
 *     items: orderData.items
 *   });
 * };
 * </script>
 *
 * <template>
 *   <button @click="handlePurchase">Complete Purchase</button>
 * </template>
 * ```
 */
export function useTransactionTracking(analytics: GoogleAnalytics) {
  return (data: TransactionData) => {
    analytics.transaction(data);
  };
}

/**
 * Vue 3 Composable for tracking user properties
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useUserTracking } from 'm-seo/adapters/VueSPAAdapter';
 * import { watch } from 'vue';
 *
 * const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 * const setUser = useUserTracking(analytics);
 *
 * const currentUser = ref(null);
 *
 * watch(currentUser, (user) => {
 *   if (user) {
 *     setUser({
 *       user_id: user.id,
 *       user_type: user.plan
 *     });
 *   }
 * });
 * </script>
 * ```
 */
export function useUserTracking(analytics: GoogleAnalytics) {
  return (properties: UserProperties) => {
    analytics.setUser(properties);
  };
}

/**
 * Vue 3 Composable for tracking SEO metrics
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 * import { useSEOTracking } from 'm-seo/adapters/VueSPAAdapter';
 * import { onMounted } from 'vue';
 *
 * const analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
 * const trackSEO = useSEOTracking(analytics);
 *
 * onMounted(() => {
 *   const params = new URLSearchParams(window.location.search);
 *   const query = params.get('q');
 *   if (query) {
 *     trackSEO({
 *       organic_source: 'google',
 *       search_query: query
 *     });
 *   }
 * });
 * </script>
 *
 * <template>
 *   <article>...</article>
 * </template>
 * ```
 */
export function useSEOTracking(analytics: GoogleAnalytics) {
  return (metrics: SEOMetrics) => {
    analytics.trackSEOMetrics(metrics);
  };
}

// ============================================================================
// Google Search Console Composables
// ============================================================================

/**
 * Composable for Google Search Console instance
 *
 * Creates and manages a Google Search Console client instance.
 * Supports reactive configuration updates.
 *
 * @param config - Google Search Console configuration (can be reactive)
 * @returns GoogleSearchConsole instance
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue';
 * import { useGoogleSearchConsole } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const gscConfig = ref({
 *   siteUrl: 'https://example.com',
 *   credentials: {
 *     accessToken: import.meta.env.VITE_GSC_TOKEN
 *   }
 * });
 *
 * const gsc = useGoogleSearchConsole(gscConfig);
 * </script>
 * ```
 */
export function useGoogleSearchConsole(config: GSCConfig | Ref<GSCConfig>) {
  let gsc: GoogleSearchConsole;

  if (isRef(config)) {
    gsc = new GoogleSearchConsole(config.value);

    watch(config, (newConfig) => {
      gsc = new GoogleSearchConsole(newConfig);
    });
  } else {
    gsc = new GoogleSearchConsole(config);
  }

  return gsc;
}

/**
 * Composable for fetching search analytics data
 *
 * Fetches search analytics data and provides reactive state management.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param query - Search analytics query (can be reactive)
 * @returns Reactive object with data, loading state, and error
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref, computed } from 'vue';
 * import { useGoogleSearchConsole, useSearchAnalytics } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const gsc = useGoogleSearchConsole({...});
 *
 * const query = ref({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   dimensions: ['query']
 * });
 *
 * const { data, loading, error } = useSearchAnalytics(gsc, query);
 * </script>
 *
 * <template>
 *   <div v-if="loading">Loading...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <ul v-else>
 *     <li v-for="row in data?.rows" :key="row.keys?.[0]">
 *       {{ row.keys?.[0] }}: {{ row.clicks }} clicks
 *     </li>
 *   </ul>
 * </template>
 * ```
 */
export function useSearchAnalytics(
  gsc: GoogleSearchConsole,
  query: SearchAnalyticsQuery | Ref<SearchAnalyticsQuery>
) {
  const data = ref(null as any);
  const loading = ref(true);
  const error = ref(null as Error | null);

  const fetchData = (queryValue: SearchAnalyticsQuery) => {
    loading.value = true;
    error.value = null;

    gsc.getSearchAnalytics(queryValue)
      .then(result => {
        data.value = result;
        loading.value = false;
      })
      .catch(err => {
        error.value = err;
        loading.value = false;
      });
  };

  if (isRef(query)) {
    watch(query, (newQuery) => fetchData(newQuery), { immediate: true });
  } else {
    fetchData(query);
  }

  return { data, loading, error };
}

/**
 * Composable for URL inspection
 *
 * Inspects a URL and returns reactive indexing status and issues.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param url - URL to inspect (can be reactive)
 * @returns Reactive object with inspection result, loading state, and error
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue';
 * import { useGoogleSearchConsole, useURLInspection } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const gsc = useGoogleSearchConsole({...});
 * const urlToCheck = ref('https://example.com/page');
 *
 * const { result, loading, error } = useURLInspection(gsc, urlToCheck);
 * </script>
 *
 * <template>
 *   <div v-if="loading">Checking...</div>
 *   <div v-else-if="error">Error: {{ error.message }}</div>
 *   <div v-else>
 *     <p>Indexed: {{ result?.isIndexed ? '✅' : '❌' }}</p>
 *     <p>Status: {{ result?.indexStatus }}</p>
 *   </div>
 * </template>
 * ```
 */
export function useURLInspection(
  gsc: GoogleSearchConsole,
  url: string | Ref<string | null>
) {
  const result = ref(null as URLInspectionResult | null);
  const loading = ref(false);
  const error = ref(null as Error | null);

  const inspectURL = (urlValue: string | null) => {
    if (!urlValue) {
      loading.value = false;
      return;
    }

    loading.value = true;
    error.value = null;

    gsc.inspectUrl(urlValue)
      .then(inspectionResult => {
        result.value = inspectionResult;
        loading.value = false;
      })
      .catch(err => {
        error.value = err;
        loading.value = false;
      });
  };

  if (isRef(url)) {
    watch(url, (newUrl) => inspectURL(newUrl), { immediate: true });
  } else {
    inspectURL(url);
  }

  return { result, loading, error };
}

/**
 * Composable for performance summary
 *
 * Fetches performance summary for a date range with reactive updates.
 *
 * @param gsc - GoogleSearchConsole instance
 * @param startDate - Start date (can be reactive)
 * @param endDate - End date (can be reactive)
 * @returns Reactive object with summary, loading state, and error
 *
 * @example
 * ```vue
 * <script setup>
 * import { ref } from 'vue';
 * import { useGoogleSearchConsole, usePerformanceSummary } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const gsc = useGoogleSearchConsole({...});
 *
 * const startDate = ref('2024-01-01');
 * const endDate = ref('2024-01-31');
 *
 * const { summary, loading, error } = usePerformanceSummary(gsc, startDate, endDate);
 * </script>
 *
 * <template>
 *   <div v-if="loading">Loading...</div>
 *   <div v-else-if="summary">
 *     <p>Clicks: {{ summary.totalClicks }}</p>
 *     <p>Impressions: {{ summary.totalImpressions }}</p>
 *     <p>CTR: {{ (summary.averageCtr * 100).toFixed(2) }}%</p>
 *   </div>
 * </template>
 * ```
 */
export function usePerformanceSummary(
  gsc: GoogleSearchConsole,
  startDate: string | Ref<string>,
  endDate: string | Ref<string>
) {
  const summary = ref(null as PerformanceSummary | null);
  const loading = ref(true);
  const error = ref(null as Error | null);

  const fetchSummary = (start: string, end: string) => {
    loading.value = true;
    error.value = null;

    gsc.getPerformanceSummary(start, end)
      .then(result => {
        summary.value = result;
        loading.value = false;
      })
      .catch(err => {
        error.value = err;
        loading.value = false;
      });
  };

  // Watch for changes in reactive date values
  const startValue = isRef(startDate) ? startDate : ref(startDate);
  const endValue = isRef(endDate) ? endDate : ref(endDate);

  watch(
    () => [startValue.value, endValue.value],
    ([start, end]) => fetchSummary(start as string, end as string),
    { immediate: true }
  );

  return { summary, loading, error };
}

// ============================================================================
// URL MANAGER COMPOSABLES
// ============================================================================

/**
 * Vue 3 composable for URL management
 * Provides URL utilities for SEO optimization
 *
 * @example
 * ```vue
 * <script setup>
 * import { useUrlManager } from 'm-seo/adapters/VueSPAAdapter';
 * import { ref, computed } from 'vue';
 *
 * const productName = ref('Premium Shoes');
 *
 * const { createSlug, getCanonical } = useUrlManager({
 *   baseUrl: 'https://example.com',
 *   trailingSlash: true
 * });
 *
 * const slug = computed(() => createSlug(productName.value));
 * const canonical = computed(() => getCanonical(`/products/${slug.value}`));
 * </script>
 * ```
 */
export function useUrlManager(config: UrlConfig | Ref<UrlConfig>): UrlManager {
  const urlManager = computed(() => {
    const cfg = isRef(config) ? config.value : config;
    return createUrlManager(cfg);
  });

  return urlManager.value;
}

/**
 * Vue 3 composable for canonical URL
 * Automatically adds canonical link tag to document head
 *
 * @example
 * ```vue
 * <script setup>
 * import { useCanonical } from 'm-seo/adapters/VueSPAAdapter';
 * import { ref } from 'vue';
 *
 * const productSlug = ref('premium-shoes');
 *
 * const canonical = useCanonical(
 *   computed(() => `/products/${productSlug.value}`),
 *   { baseUrl: 'https://example.com', locale: 'en' }
 * );
 * </script>
 * ```
 */
export function useCanonical(
  path: string | Ref<string>,
  config: UrlConfig & { locale?: string } = { baseUrl: '' }
): Ref<string> {
  const urlManager = createUrlManager(config);

  const canonical = computed(() => {
    const p = isRef(path) ? path.value : path;
    return urlManager.getCanonical(p, { locale: config.locale });
  });

  // Apply to document
  watch(canonical, (newCanonical) => {
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

    // Remove existing canonical
    const existing = document.querySelector('link[rel="canonical"][data-mseo]');
    if (existing) existing.remove();

    // Add new canonical
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = newCanonical;
    link.setAttribute('data-mseo', 'true');
    document.head.appendChild(link);
  }, { immediate: true });

  onUnmounted(() => {
    const link = document.querySelector('link[rel="canonical"][data-mseo]');
    if (link) link.remove();
  });

  return canonical;
}

/**
 * Vue 3 composable for hreflang tags
 * Automatically adds hreflang link tags to document head
 *
 * @example
 * ```vue
 * <script setup>
 * import { useHreflang } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const hreflangTags = useHreflang('/products', 'https://example.com', {
 *   locales: ['en', 'es', 'fr'],
 *   includeDefault: true
 * });
 * </script>
 * ```
 */
export function useHreflang(
  path: string | Ref<string>,
  baseUrl: string,
  options: {
    locales: string[];
    urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
    includeDefault?: boolean;
  }
): Ref<HreflangTag[]> {
  const urlManager = createUrlManager({
    baseUrl,
    localePrefix: (options.urlStrategy === 'query' ? 'none' : options.urlStrategy) || 'path',
    defaultLocale: options.locales[0]
  });

  const hreflangTags = computed(() => {
    const p = isRef(path) ? path.value : path;
    return urlManager.generateAlternates(p, options.locales, {
      includeDefault: options.includeDefault
    });
  });

  // Apply to document
  watch(hreflangTags, (tags) => {
    if (!BotDetection.shouldRenderClientSide()) {
      return;
    }

    // Remove existing hreflang tags
    document.querySelectorAll('link[rel="alternate"][hreflang][data-mseo]').forEach(el => el.remove());

    // Add new hreflang tags
    tags.forEach((tag: HreflangTag) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = tag.hreflang;
      link.href = tag.href;
      link.setAttribute('data-mseo', 'true');
      document.head.appendChild(link);
    });
  }, { immediate: true });

  onUnmounted(() => {
    document.querySelectorAll('link[rel="alternate"][hreflang][data-mseo]').forEach(el => el.remove());
  });

  return hreflangTags;
}

// ============================================================================
// INTERNATIONALIZATION COMPOSABLES
// ============================================================================

/**
 * Vue 3 composable for internationalization
 * Provides i18n utilities and manages locale state
 *
 * @example
 * ```vue
 * <script setup>
 * import { useI18n } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const { t, locale, setLocale, formatDate, formatCurrency } = useI18n({
 *   defaultLocale: 'en',
 *   supportedLocales: ['en', 'es', 'fr']
 * });
 *
 * // Load translations
 * await i18n.loadTranslations('en', {
 *   welcome: 'Hello, {{name}}!'
 * });
 * </script>
 *
 * <template>
 *   <div>
 *     <h1>{{ t('welcome', { name: 'John' }) }}</h1>
 *     <select v-model="locale" @change="setLocale(locale)">
 *       <option v-for="loc in ['en', 'es', 'fr']" :key="loc" :value="loc">
 *         {{ loc }}
 *       </option>
 *     </select>
 *   </div>
 * </template>
 * ```
 */
export function useI18n(config: I18nConfig | Ref<I18nConfig>): {
  i18n: Internationalization;
  locale: Ref<string>;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency?: string) => string;
  formatRelativeTime: (date: Date) => string;
} {
  const cfg = isRef(config) ? config.value : config;
  const i18n = createI18n(cfg);
  const locale = ref(i18n.getLocale());

  const setLocale = (newLocale: string) => {
    i18n.setLocale(newLocale);
    locale.value = newLocale;
  };

  const t = (key: string, params?: Record<string, any>) => {
    return i18n.translate(key, params);
  };

  const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
    return i18n.formatDate(date, options);
  };

  const formatNumber = (num: number, options?: Intl.NumberFormatOptions) => {
    return i18n.formatNumber(num, options);
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return i18n.formatCurrency(amount, currency);
  };

  const formatRelativeTime = (date: Date) => {
    return i18n.formatRelativeTime(date);
  };

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
 * Vue 3 composable for locale detection
 * Automatically detects and sets the appropriate locale
 *
 * @example
 * ```vue
 * <script setup>
 * import { useLocaleDetection } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const locale = useLocaleDetection({
 *   defaultLocale: 'en',
 *   supportedLocales: ['en', 'es', 'fr'],
 *   detectLocale: true
 * });
 * </script>
 *
 * <template>
 *   <div>Current locale: {{ locale }}</div>
 * </template>
 * ```
 */
export function useLocaleDetection(config: I18nConfig | Ref<I18nConfig>): Ref<string> {
  const cfg = isRef(config) ? config.value : config;
  const i18n = createI18n(cfg);
  const locale = ref(i18n.getLocale());

  // Auto-detect on mount
  const detected = i18n.detectLocale();
  i18n.setLocale(detected);
  locale.value = detected;

  return locale;
}

/**
 * Vue 3 composable for locale switcher
 * Provides data for rendering language switcher UI
 *
 * @example
 * ```vue
 * <script setup>
 * import { useLocaleSwitcher } from 'm-seo/adapters/VueSPAAdapter';
 *
 * const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
 *   defaultLocale: 'en',
 *   supportedLocales: ['en', 'es', 'fr'],
 *   baseUrl: 'https://example.com'
 * });
 * </script>
 *
 * <template>
 *   <select :value="currentLocale" @change="switchLocale($event.target.value)">
 *     <option v-for="loc in locales" :key="loc.code" :value="loc.code">
 *       {{ loc.nativeName }} {{ loc.active ? '✓' : '' }}
 *     </option>
 *   </select>
 * </template>
 * ```
 */
export function useLocaleSwitcher(
  config: (I18nConfig & { baseUrl: string }) | Ref<I18nConfig & { baseUrl: string }>
): {
  locales: Ref<Array<{ code: string; name: string; nativeName: string; url: string; active: boolean }>>;
  currentLocale: Ref<string>;
  switchLocale: (locale: string) => void;
} {
  const cfg = isRef(config) ? config.value : config;
  const i18n = createI18n(cfg);
  const currentLocale = ref(i18n.getLocale());

  const getCurrentPath = () => {
    if (typeof window === 'undefined') return '/';
    return window.location.pathname;
  };

  const locales = computed(() => {
    return i18n.getLocaleSwitcherData(getCurrentPath(), cfg.baseUrl);
  });

  const switchLocale = (newLocale: string) => {
    i18n.setLocale(newLocale);
    currentLocale.value = newLocale;

    // Navigate to localized URL
    const localeUrl = i18n.getLocalizedUrl(getCurrentPath(), newLocale, cfg.baseUrl);
    if (typeof window !== 'undefined') {
      window.location.href = localeUrl;
    }
  };

  return {
    locales,
    currentLocale,
    switchLocale
  };
}
