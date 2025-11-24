/**
 * Advanced Google Analytics Integration for m-seo
 *
 * Features:
 * - GA4 and Universal Analytics support
 * - Event tracking with custom dimensions
 * - E-commerce tracking
 * - User tracking and segmentation
 * - Page view tracking
 * - SEO-specific metrics
 * - Bot filtering
 * - Custom events and conversions
 * - Performance monitoring
 * - Error tracking
 *
 * @module GoogleAnalytics
 */

import { BotDetection } from './BotDetection.js';

/**
 * Google Analytics configuration
 */
export interface GAConfig {
  /** GA4 Measurement ID (G-XXXXXXXXXX) */
  measurementId?: string;
  /** Universal Analytics Tracking ID (UA-XXXXXXXXX-X) */
  trackingId?: string;
  /** Enable debug mode */
  debug?: boolean;
  /** Anonymize IP addresses */
  anonymizeIp?: boolean;
  /** Custom dimensions mapping */
  customDimensions?: Record<string, string | number>;
  /** Filter bot traffic */
  filterBots?: boolean;
  /** Send page views automatically */
  autoPageView?: boolean;
  /** Cookie configuration */
  cookieConfig?: {
    domain?: string;
    expires?: number;
    secure?: boolean;
    sameSite?: 'strict' | 'lax' | 'none';
  };
  /** Enhanced measurement settings */
  enhancedMeasurement?: {
    scrollTracking?: boolean;
    outboundLinks?: boolean;
    siteSearch?: boolean;
    videoEngagement?: boolean;
    fileDownloads?: boolean;
  };
}

/**
 * Page view tracking data
 */
export interface PageViewData {
  /** Page path */
  page_path?: string;
  /** Page title */
  page_title?: string;
  /** Page location (full URL) */
  page_location?: string;
  /** Referrer */
  page_referrer?: string;
  /** Custom parameters */
  [key: string]: any;
}

/**
 * Event tracking data
 */
export interface EventData {
  /** Event category */
  category?: string;
  /** Event label */
  label?: string;
  /** Event value */
  value?: number;
  /** Non-interaction event */
  non_interaction?: boolean;
  /** Custom parameters */
  [key: string]: any;
}

/**
 * E-commerce transaction data
 */
export interface TransactionData {
  /** Transaction ID */
  transaction_id: string;
  /** Transaction value */
  value: number;
  /** Currency code (e.g., 'USD') */
  currency: string;
  /** Tax amount */
  tax?: number;
  /** Shipping cost */
  shipping?: number;
  /** Items in transaction */
  items: TransactionItem[];
  /** Coupon code */
  coupon?: string;
  /** Affiliation */
  affiliation?: string;
}

/**
 * E-commerce item data
 */
export interface TransactionItem {
  /** Item ID */
  item_id: string;
  /** Item name */
  item_name: string;
  /** Item category */
  item_category?: string;
  /** Item variant */
  item_variant?: string;
  /** Item brand */
  item_brand?: string;
  /** Item price */
  price: number;
  /** Item quantity */
  quantity: number;
  /** Discount */
  discount?: number;
}

/**
 * User properties
 */
export interface UserProperties {
  /** User ID */
  user_id?: string;
  /** User type (e.g., 'premium', 'free') */
  user_type?: string;
  /** Customer lifetime value */
  lifetime_value?: number;
  /** Custom properties */
  [key: string]: any;
}

/**
 * SEO metrics data
 */
export interface SEOMetrics {
  /** Organic traffic source */
  organic_source?: string;
  /** Search query */
  search_query?: string;
  /** Ranking position */
  ranking_position?: number;
  /** Click-through rate */
  ctr?: number;
  /** Time on page */
  time_on_page?: number;
  /** Bounce rate indicator */
  bounced?: boolean;
  /** Page depth */
  page_depth?: number;
}

/**
 * Advanced Google Analytics Integration
 */
export class GoogleAnalytics {
  private config: GAConfig;
  private initialized: boolean = false;
  private dataLayer: any[] = [];
  private startTime: number = Date.now();

  constructor(config: GAConfig = {}) {
    this.config = {
      debug: false,
      anonymizeIp: true,
      filterBots: true,
      autoPageView: true,
      enhancedMeasurement: {
        scrollTracking: true,
        outboundLinks: true,
        siteSearch: true,
        videoEngagement: true,
        fileDownloads: true
      },
      ...config
    };

    if (typeof window !== 'undefined') {
      (window as any).dataLayer = (window as any).dataLayer || [];
      this.dataLayer = (window as any).dataLayer;
    }
  }

  /**
   * Initialize Google Analytics
   */
  initialize(): void {
    if (this.initialized) {
      console.warn('Google Analytics already initialized');
      return;
    }

    if (typeof window === 'undefined') {
      console.warn('Google Analytics can only be initialized in browser environment');
      return;
    }

    // Check if bot and filter if enabled
    if (this.config.filterBots && BotDetection.isBot()) {
      if (this.config.debug) {
        console.log('Bot detected - skipping GA initialization');
      }
      return;
    }

    // Initialize GA4
    if (this.config.measurementId) {
      this.initializeGA4();
    }

    // Initialize Universal Analytics
    if (this.config.trackingId) {
      this.initializeUA();
    }

    // Set up enhanced measurement
    if (this.config.enhancedMeasurement) {
      this.setupEnhancedMeasurement();
    }

    // Send initial page view if enabled
    if (this.config.autoPageView) {
      this.pageView();
    }

    this.initialized = true;

    if (this.config.debug) {
      console.log('Google Analytics initialized', this.config);
    }
  }

  /**
   * Initialize GA4
   */
  private initializeGA4(): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);

    this.gtag('js', new Date());
    this.gtag('config', this.config.measurementId!, {
      anonymize_ip: this.config.anonymizeIp,
      cookie_domain: this.config.cookieConfig?.domain || 'auto',
      cookie_expires: this.config.cookieConfig?.expires || 63072000, // 2 years
      cookie_flags: this.getCookieFlags(),
      send_page_view: false, // We'll handle page views manually
      custom_map: this.config.customDimensions || {}
    });
  }

  /**
   * Initialize Universal Analytics
   */
  private initializeUA(): void {
    (window as any).ga = (window as any).ga || function (...args: any[]) {
      ((window as any).ga.q = (window as any).ga.q || []).push(args);
    };
    (window as any).ga.l = Date.now();

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.google-analytics.com/analytics.js';
    document.head.appendChild(script);

    (window as any).ga('create', this.config.trackingId, 'auto');
    (window as any).ga('set', 'anonymizeIp', this.config.anonymizeIp);
  }

  /**
   * Get cookie flags string
   */
  private getCookieFlags(): string {
    const flags: string[] = [];

    if (this.config.cookieConfig?.secure) {
      flags.push('secure');
    }

    if (this.config.cookieConfig?.sameSite) {
      flags.push(`samesite=${this.config.cookieConfig.sameSite}`);
    }

    return flags.join(';');
  }

  /**
   * Send data to Google Analytics (gtag function)
   */
  private gtag(...args: any[]): void {
    this.dataLayer.push(args);
  }

  /**
   * Track page view
   */
  pageView(data: PageViewData = {}): void {
    if (!this.initialized && !this.config.measurementId && !this.config.trackingId) {
      console.warn('Google Analytics not initialized');
      return;
    }

    const pageData: PageViewData = {
      page_path: data.page_path || window.location.pathname,
      page_title: data.page_title || document.title,
      page_location: data.page_location || window.location.href,
      page_referrer: data.page_referrer || document.referrer,
      ...data
    };

    // Add bot detection info if filtering is disabled
    if (!this.config.filterBots) {
      const botInfo = BotDetection.getBotInfo();
      if (botInfo.isBot) {
        pageData.is_bot = true;
        pageData.bot_name = botInfo.name;
        pageData.bot_type = botInfo.type;
      }
    }

    // Send to GA4
    if (this.config.measurementId) {
      this.gtag('event', 'page_view', pageData);
    }

    // Send to Universal Analytics
    if (this.config.trackingId) {
      (window as any).ga('send', 'pageview', pageData.page_path);
    }

    // Reset start time for time tracking
    this.startTime = Date.now();

    if (this.config.debug) {
      console.log('GA: Page view tracked', pageData);
    }
  }

  /**
   * Track custom event
   */
  event(eventName: string, data: EventData = {}): void {
    if (!this.initialized && !this.config.measurementId && !this.config.trackingId) {
      return;
    }

    const eventData = {
      event_category: data.category,
      event_label: data.label,
      value: data.value,
      non_interaction: data.non_interaction,
      ...data
    };

    // Send to GA4
    if (this.config.measurementId) {
      this.gtag('event', eventName, eventData);
    }

    // Send to Universal Analytics
    if (this.config.trackingId) {
      (window as any).ga('send', 'event', {
        eventCategory: data.category,
        eventAction: eventName,
        eventLabel: data.label,
        eventValue: data.value,
        nonInteraction: data.non_interaction
      });
    }

    if (this.config.debug) {
      console.log('GA: Event tracked', eventName, eventData);
    }
  }

  /**
   * Track e-commerce transaction
   */
  transaction(data: TransactionData): void {
    if (!this.initialized) {
      return;
    }

    // Send to GA4
    if (this.config.measurementId) {
      this.gtag('event', 'purchase', {
        transaction_id: data.transaction_id,
        value: data.value,
        currency: data.currency,
        tax: data.tax,
        shipping: data.shipping,
        items: data.items,
        coupon: data.coupon,
        affiliation: data.affiliation
      });
    }

    // Send to Universal Analytics
    if (this.config.trackingId) {
      (window as any).ga('require', 'ecommerce');
      (window as any).ga('ecommerce:addTransaction', {
        id: data.transaction_id,
        revenue: data.value,
        tax: data.tax,
        shipping: data.shipping,
        affiliation: data.affiliation
      });

      data.items.forEach(item => {
        (window as any).ga('ecommerce:addItem', {
          id: data.transaction_id,
          name: item.item_name,
          sku: item.item_id,
          category: item.item_category,
          price: item.price,
          quantity: item.quantity
        });
      });

      (window as any).ga('ecommerce:send');
    }

    if (this.config.debug) {
      console.log('GA: Transaction tracked', data);
    }
  }

  /**
   * Set user properties
   */
  setUser(properties: UserProperties): void {
    if (!this.initialized) {
      return;
    }

    // Send to GA4
    if (this.config.measurementId) {
      if (properties.user_id) {
        this.gtag('config', this.config.measurementId, {
          user_id: properties.user_id
        });
      }

      this.gtag('set', 'user_properties', properties);
    }

    // Send to Universal Analytics
    if (this.config.trackingId) {
      if (properties.user_id) {
        (window as any).ga('set', 'userId', properties.user_id);
      }
    }

    if (this.config.debug) {
      console.log('GA: User properties set', properties);
    }
  }

  /**
   * Track SEO metrics
   */
  trackSEOMetrics(metrics: SEOMetrics): void {
    this.event('seo_metrics', {
      category: 'SEO',
      ...metrics
    });

    if (this.config.debug) {
      console.log('GA: SEO metrics tracked', metrics);
    }
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(): void {
    const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);

    this.event('time_on_page', {
      category: 'Engagement',
      label: window.location.pathname,
      value: timeOnPage
    });
  }

  /**
   * Track scroll depth
   */
  private trackScrollDepth(percentage: number): void {
    this.event('scroll', {
      category: 'Engagement',
      label: window.location.pathname,
      value: percentage,
      non_interaction: true
    });
  }

  /**
   * Track outbound link click
   */
  private trackOutboundLink(url: string): void {
    this.event('click', {
      category: 'Outbound Link',
      label: url,
      non_interaction: false
    });
  }

  /**
   * Track file download
   */
  trackDownload(filename: string, url: string): void {
    this.event('file_download', {
      category: 'Downloads',
      label: filename,
      file_name: filename,
      file_url: url
    });
  }

  /**
   * Track site search
   */
  trackSearch(query: string, results?: number): void {
    this.event('search', {
      category: 'Site Search',
      search_term: query,
      search_results: results
    });
  }

  /**
   * Track error
   */
  trackError(error: Error, fatal: boolean = false): void {
    this.event('exception', {
      description: error.message,
      fatal: fatal,
      stack: error.stack
    });

    if (this.config.debug) {
      console.error('GA: Error tracked', error);
    }
  }

  /**
   * Track performance metrics
   */
  trackPerformance(): void {
    if (typeof window === 'undefined' || !window.performance) {
      return;
    }

    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    const domReadyTime = perfData.domContentLoadedEventEnd - perfData.navigationStart;
    const responseTime = perfData.responseEnd - perfData.requestStart;

    this.event('performance', {
      category: 'Performance',
      page_load_time: pageLoadTime,
      dom_ready_time: domReadyTime,
      response_time: responseTime
    });

    if (this.config.debug) {
      console.log('GA: Performance tracked', {
        pageLoadTime,
        domReadyTime,
        responseTime
      });
    }
  }

  /**
   * Set up enhanced measurement features
   */
  private setupEnhancedMeasurement(): void {
    if (typeof window === 'undefined') {
      return;
    }

    // Scroll tracking
    if (this.config.enhancedMeasurement?.scrollTracking) {
      this.setupScrollTracking();
    }

    // Outbound link tracking
    if (this.config.enhancedMeasurement?.outboundLinks) {
      this.setupOutboundLinkTracking();
    }

    // File download tracking
    if (this.config.enhancedMeasurement?.fileDownloads) {
      this.setupFileDownloadTracking();
    }

    // Track performance on load
    window.addEventListener('load', () => {
      setTimeout(() => this.trackPerformance(), 0);
    });

    // Track time on page before unload
    window.addEventListener('beforeunload', () => {
      this.trackTimeOnPage();
    });
  }

  /**
   * Set up scroll depth tracking
   */
  private setupScrollTracking(): void {
    const thresholds = [25, 50, 75, 90, 100];
    const triggered = new Set<number>();

    const checkScroll = () => {
      const scrollPercent = Math.round(
        ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
      );

      thresholds.forEach(threshold => {
        if (scrollPercent >= threshold && !triggered.has(threshold)) {
          triggered.add(threshold);
          this.trackScrollDepth(threshold);
        }
      });
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
  }

  /**
   * Set up outbound link tracking
   */
  private setupOutboundLinkTracking(): void {
    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      // Check if link is outbound
      if (href.startsWith('http') && !href.includes(window.location.hostname)) {
        this.trackOutboundLink(href);
      }
    });
  }

  /**
   * Set up file download tracking
   */
  private setupFileDownloadTracking(): void {
    const fileExtensions = /\.(pdf|docx?|xlsx?|pptx?|zip|rar|7z|tar|gz|mp3|mp4|avi|mov|jpg|png|gif)$/i;

    document.addEventListener('click', (e) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      if (!href) return;

      if (fileExtensions.test(href)) {
        const filename = href.split('/').pop() || href;
        this.trackDownload(filename, href);
      }
    });
  }

  /**
   * Get current analytics data
   */
  getData(): any {
    return {
      initialized: this.initialized,
      config: this.config,
      dataLayer: this.dataLayer
    };
  }

  /**
   * Clear all analytics data
   */
  clear(): void {
    this.dataLayer = [];
    if (typeof window !== 'undefined') {
      (window as any).dataLayer = [];
    }
  }
}

/**
 * Helper function to create GA instance
 */
export function createGoogleAnalytics(config: GAConfig): GoogleAnalytics {
  const ga = new GoogleAnalytics(config);
  ga.initialize();
  return ga;
}

/**
 * Default export
 */
export default GoogleAnalytics;
