/**
 * Google Analytics Usage Examples for m-seo
 *
 * This file contains practical examples of using the Google Analytics
 * integration in various scenarios.
 */

import { createGoogleAnalytics, GAConfig } from '../src/analytics/GoogleAnalytics.js';

// ============================================================================
// Example 1: Basic Setup - GA4 Only
// ============================================================================

export function basicGA4Setup() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    debug: true
  });

  // Track page view
  analytics.pageView();

  // Track button click
  analytics.event('button_click', {
    category: 'Engagement',
    label: 'CTA Button'
  });

  console.log('Basic GA4 setup complete');
}

// ============================================================================
// Example 2: Dual Analytics (GA4 + UA)
// ============================================================================

export function dualAnalyticsSetup() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',  // GA4
    trackingId: 'UA-XXXXXXXXX-X',   // Universal Analytics
    debug: process.env.NODE_ENV === 'development'
  });

  // Events will be sent to both GA4 and UA
  analytics.pageView({
    page_title: 'Home Page',
    page_path: '/home'
  });

  console.log('Dual analytics setup complete');
}

// ============================================================================
// Example 3: Full Configuration with Privacy Features
// ============================================================================

export function privacyFocusedSetup() {
  const config: GAConfig = {
    measurementId: 'G-XXXXXXXXXX',

    // Privacy settings
    anonymizeIp: true,
    filterBots: true,

    // Cookie configuration
    cookieConfig: {
      domain: 'example.com',
      expires: 31536000,  // 1 year
      secure: true,
      sameSite: 'strict'
    },

    // Custom dimensions
    customDimensions: {
      dimension1: 'user_type',
      dimension2: 'subscription_plan'
    },

    // Enhanced measurement
    enhancedMeasurement: {
      scrollTracking: true,
      outboundLinks: true,
      siteSearch: true,
      videoEngagement: true,
      fileDownloads: true
    }
  };

  const analytics = createGoogleAnalytics(config);

  console.log('Privacy-focused analytics setup complete');
}

// ============================================================================
// Example 4: E-commerce Website
// ============================================================================

export function ecommerceExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  // Product view
  function viewProduct(productId: string, productName: string, price: number) {
    analytics.event('view_item', {
      category: 'E-commerce',
      items: [{
        item_id: productId,
        item_name: productName,
        item_category: 'Widgets',
        price: price,
        quantity: 1
      }]
    });
  }

  // Add to cart
  function addToCart(productId: string, productName: string, price: number, quantity: number) {
    analytics.event('add_to_cart', {
      category: 'E-commerce',
      value: price * quantity,
      currency: 'USD',
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity
      }]
    });
  }

  // Complete purchase
  function completePurchase(orderId: string, total: number, items: any[]) {
    analytics.transaction({
      transaction_id: orderId,
      value: total,
      currency: 'USD',
      tax: total * 0.08,
      shipping: 9.99,
      items: items
    });
  }

  // Example usage
  viewProduct('SKU123', 'Premium Widget', 99.99);
  addToCart('SKU123', 'Premium Widget', 99.99, 2);
  completePurchase('ORDER-001', 209.97, [
    {
      item_id: 'SKU123',
      item_name: 'Premium Widget',
      price: 99.99,
      quantity: 2
    }
  ]);

  console.log('E-commerce tracking complete');
}

// ============================================================================
// Example 5: SaaS Application with User Tracking
// ============================================================================

export function saasApplicationExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  // User signup
  function trackSignup(userId: string, method: string) {
    analytics.setUser({
      user_id: userId,
      user_type: 'free',
      subscription_plan: 'trial'
    });

    analytics.event('signup', {
      category: 'Conversion',
      label: method,
      method: method
    });
  }

  // Feature usage
  function trackFeatureUsage(featureName: string) {
    analytics.event('feature_use', {
      category: 'Product',
      label: featureName,
      feature_name: featureName
    });
  }

  // Subscription upgrade
  function trackUpgrade(userId: string, plan: string, value: number) {
    analytics.setUser({
      user_id: userId,
      user_type: 'premium',
      subscription_plan: plan,
      lifetime_value: value
    });

    analytics.event('upgrade', {
      category: 'Conversion',
      label: plan,
      value: value,
      plan: plan
    });
  }

  // Trial started
  function trackTrialStart(userId: string) {
    analytics.event('trial_start', {
      category: 'Conversion',
      user_id: userId
    });
  }

  // Example usage
  trackSignup('user_12345', 'email');
  trackFeatureUsage('dashboard');
  trackTrialStart('user_12345');
  trackUpgrade('user_12345', 'pro', 99);

  console.log('SaaS tracking complete');
}

// ============================================================================
// Example 6: Content Website with SEO Tracking
// ============================================================================

export function contentWebsiteExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true,
    enhancedMeasurement: {
      scrollTracking: true,
      siteSearch: true,
      fileDownloads: true,
      outboundLinks: true,
      videoEngagement: true
    }
  });

  // Track article view
  function trackArticleView(title: string, category: string, author: string) {
    analytics.pageView({
      page_title: title,
      content_type: 'article',
      content_category: category,
      content_author: author
    });
  }

  // Track organic search landing
  function trackOrganicLanding(query: string, position: number) {
    analytics.trackSEOMetrics({
      organic_source: 'google',
      search_query: query,
      ranking_position: position,
      ctr: 0.15
    });
  }

  // Track newsletter signup
  function trackNewsletterSignup(location: string) {
    analytics.event('newsletter_signup', {
      category: 'Conversion',
      label: location,
      signup_location: location
    });
  }

  // Track social share
  function trackSocialShare(platform: string, articleTitle: string) {
    analytics.event('share', {
      category: 'Social',
      label: platform,
      content_type: 'article',
      content_title: articleTitle,
      share_platform: platform
    });
  }

  // Track time reading
  function trackReadingComplete(articleTitle: string, timeSpent: number) {
    analytics.event('article_complete', {
      category: 'Engagement',
      label: articleTitle,
      value: timeSpent,
      time_spent: timeSpent
    });
  }

  // Example usage
  trackArticleView('10 SEO Tips', 'SEO', 'John Doe');
  trackOrganicLanding('best seo tips', 3);
  trackNewsletterSignup('article_bottom');
  trackSocialShare('twitter', '10 SEO Tips');
  trackReadingComplete('10 SEO Tips', 180);

  console.log('Content website tracking complete');
}

// ============================================================================
// Example 7: React SPA with Router Integration
// ============================================================================

export function reactSPAExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    autoPageView: false  // We'll handle page views manually
  });

  // In your React app:
  /*
  import { useEffect } from 'react';
  import { useLocation } from 'react-router-dom';

  function App() {
    const location = useLocation();

    useEffect(() => {
      analytics.pageView({
        page_path: location.pathname,
        page_title: document.title
      });
    }, [location]);

    return <YourAppContent />;
  }

  // Track button click in component
  function CTAButton() {
    const handleClick = () => {
      analytics.event('cta_click', {
        category: 'Engagement',
        label: 'Hero CTA'
      });
      // Your button logic
    };

    return <button onClick={handleClick}>Get Started</button>;
  }

  // Track form submission
  function ContactForm() {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      analytics.event('form_submit', {
        category: 'Conversion',
        label: 'Contact Form'
      });

      // Your form submission logic
    };

    return <form onSubmit={handleSubmit}>...</form>;
  }
  */

  console.log('React SPA example setup complete');
}

// ============================================================================
// Example 8: Vue 3 SPA with Composition API
// ============================================================================

export function vue3SPAExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    autoPageView: false
  });

  // In your Vue 3 app:
  /*
  <script setup lang="ts">
  import { watch } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  // Track route changes
  watch(
    () => router.currentRoute.value,
    (route) => {
      analytics.pageView({
        page_path: route.path,
        page_title: route.meta.title as string || document.title
      });
    }
  );

  // Track button click
  const trackCTA = () => {
    analytics.event('cta_click', {
      category: 'Engagement',
      label: 'Hero CTA'
    });
  };

  // Track form submission
  const submitForm = () => {
    analytics.event('form_submit', {
      category: 'Conversion',
      label: 'Contact Form'
    });
    // Your form logic
  };
  </script>

  <template>
    <button @click="trackCTA">Get Started</button>
    <form @submit.prevent="submitForm">...</form>
  </template>
  */

  console.log('Vue 3 SPA example setup complete');
}

// ============================================================================
// Example 9: Error Tracking
// ============================================================================

export function errorTrackingExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX'
  });

  // Global error handler
  if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
      analytics.trackError(event.error, true);
    });

    window.addEventListener('unhandledrejection', (event) => {
      const error = new Error(event.reason);
      analytics.trackError(error, false);
    });
  }

  // Manual error tracking
  function handleApiError(error: Error) {
    analytics.trackError(error, false);
    console.error('API Error:', error);
  }

  // Try-catch with tracking
  async function fetchData() {
    try {
      const response = await fetch('/api/data');
      return await response.json();
    } catch (error) {
      handleApiError(error as Error);
      throw error;
    }
  }

  console.log('Error tracking setup complete');
}

// ============================================================================
// Example 10: Performance Monitoring
// ============================================================================

export function performanceMonitoringExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX'
  });

  // Track performance on page load
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        analytics.trackPerformance();
      }, 0);
    });

    // Track time on page before leaving
    window.addEventListener('beforeunload', () => {
      analytics.trackTimeOnPage();
    });
  }

  // Track custom performance metrics
  function trackCustomPerformance() {
    const perfData = performance.timing;
    const metrics = {
      dns_time: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp_time: perfData.connectEnd - perfData.connectStart,
      request_time: perfData.responseStart - perfData.requestStart,
      response_time: perfData.responseEnd - perfData.responseStart,
      dom_processing_time: perfData.domComplete - perfData.domLoading,
      load_time: perfData.loadEventEnd - perfData.navigationStart
    };

    analytics.event('custom_performance', {
      category: 'Performance',
      ...metrics
    });
  }

  console.log('Performance monitoring setup complete');
}

// ============================================================================
// Example 11: A/B Testing Integration
// ============================================================================

export function abTestingExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    customDimensions: {
      dimension1: 'experiment_variant'
    }
  });

  // Assign user to variant
  function assignVariant(): 'A' | 'B' {
    return Math.random() < 0.5 ? 'A' : 'B';
  }

  const variant = assignVariant();

  // Track variant assignment
  analytics.event('experiment_view', {
    category: 'A/B Test',
    label: 'Homepage CTA Test',
    experiment_variant: variant
  });

  // Track conversion by variant
  function trackConversion(action: string) {
    analytics.event('conversion', {
      category: 'A/B Test',
      label: action,
      experiment_variant: variant
    });
  }

  // Example: Different CTAs
  if (variant === 'A') {
    // Show CTA A
    console.log('Showing variant A');
  } else {
    // Show CTA B
    console.log('Showing variant B');
  }

  // Track when user clicks CTA
  trackConversion('cta_click');

  console.log('A/B testing setup complete');
}

// ============================================================================
// Example 12: Video Tracking
// ============================================================================

export function videoTrackingExample() {
  const analytics = createGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX'
  });

  function setupVideoTracking(videoElement: HTMLVideoElement, videoTitle: string) {
    let tracked25 = false;
    let tracked50 = false;
    let tracked75 = false;
    let tracked90 = false;

    // Video start
    videoElement.addEventListener('play', () => {
      analytics.event('video_start', {
        category: 'Video',
        label: videoTitle,
        video_title: videoTitle,
        video_duration: videoElement.duration
      });
    });

    // Video progress
    videoElement.addEventListener('timeupdate', () => {
      const percent = (videoElement.currentTime / videoElement.duration) * 100;

      if (percent >= 25 && !tracked25) {
        tracked25 = true;
        analytics.event('video_progress', {
          category: 'Video',
          label: videoTitle,
          value: 25,
          video_percent: 25
        });
      }
      // Similar for 50%, 75%, 90%
    });

    // Video complete
    videoElement.addEventListener('ended', () => {
      analytics.event('video_complete', {
        category: 'Video',
        label: videoTitle,
        video_title: videoTitle
      });
    });
  }

  console.log('Video tracking setup complete');
}

// ============================================================================
// Export all examples
// ============================================================================

export const examples = {
  basicGA4Setup,
  dualAnalyticsSetup,
  privacyFocusedSetup,
  ecommerceExample,
  saasApplicationExample,
  contentWebsiteExample,
  reactSPAExample,
  vue3SPAExample,
  errorTrackingExample,
  performanceMonitoringExample,
  abTestingExample,
  videoTrackingExample
};

export default examples;
