# Google Analytics Integration Guide

Complete guide for using the advanced Google Analytics integration in m-seo.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [Advanced Features](#advanced-features)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

The m-seo Google Analytics module provides a comprehensive, type-safe wrapper for both GA4 (Google Analytics 4) and Universal Analytics. It includes advanced features like bot detection, e-commerce tracking, SEO metrics, and enhanced measurement.

### Key Benefits

✅ **Dual Analytics Support** - Works with both GA4 and Universal Analytics
✅ **Bot Filtering** - Automatic bot detection and filtering
✅ **SEO Optimized** - Track SEO-specific metrics and organic traffic
✅ **E-commerce Ready** - Full transaction and product tracking
✅ **Privacy Compliant** - IP anonymization and cookie controls
✅ **TypeScript Support** - Full type safety and IntelliSense
✅ **Zero Dependencies** - No external dependencies required

---

## Features

### Core Tracking

- ✅ Page view tracking
- ✅ Custom event tracking
- ✅ User properties and identification
- ✅ E-commerce transactions
- ✅ Custom dimensions

### Enhanced Measurement

- ✅ Scroll depth tracking (25%, 50%, 75%, 90%, 100%)
- ✅ Outbound link clicks
- ✅ File download tracking
- ✅ Site search tracking
- ✅ Performance metrics

### SEO Features

- ✅ Organic traffic tracking
- ✅ Search query tracking
- ✅ Ranking position tracking
- ✅ Time on page
- ✅ Bot detection integration

### Analytics

- ✅ Exception tracking
- ✅ Performance monitoring
- ✅ Custom events
- ✅ User segmentation

---

## Installation

```bash
npm install m-seo
```

---

## Quick Start

### Basic Setup (GA4)

```typescript
import { createGoogleAnalytics } from "m-seo";

// Initialize with GA4
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
});

// Track a page view
analytics.pageView();

// Track an event
analytics.event("button_click", {
  category: "Engagement",
  label: "CTA Button",
});
```

### Basic Setup (Universal Analytics)

```typescript
import { createGoogleAnalytics } from "m-seo";

// Initialize with UA
const analytics = createGoogleAnalytics({
  trackingId: "UA-XXXXXXXXX-X",
});

// Track a page view
analytics.pageView();
```

### Both GA4 and UA

```typescript
import { createGoogleAnalytics } from "m-seo";

// Initialize both
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX", // GA4
  trackingId: "UA-XXXXXXXXX-X", // UA
});

// Events will be sent to both
analytics.pageView();
```

---

## Configuration

### Full Configuration Options

```typescript
import { createGoogleAnalytics, GAConfig } from "m-seo";

const config: GAConfig = {
  // Analytics IDs
  measurementId: "G-XXXXXXXXXX", // GA4 Measurement ID
  trackingId: "UA-XXXXXXXXX-X", // Universal Analytics ID

  // General Settings
  debug: false, // Enable debug logging
  anonymizeIp: true, // Anonymize IP addresses
  filterBots: true, // Filter bot traffic
  autoPageView: true, // Send initial page view

  // Cookie Configuration
  cookieConfig: {
    domain: "example.com", // Cookie domain
    expires: 63072000, // 2 years in seconds
    secure: true, // HTTPS only
    sameSite: "lax", // SameSite attribute
  },

  // Custom Dimensions
  customDimensions: {
    dimension1: "user_type",
    dimension2: "subscription_level",
  },

  // Enhanced Measurement
  enhancedMeasurement: {
    scrollTracking: true, // Track scroll depth
    outboundLinks: true, // Track external links
    siteSearch: true, // Track site searches
    videoEngagement: true, // Track video interactions
    fileDownloads: true, // Track file downloads
  },
};

const analytics = createGoogleAnalytics(config);
```

---

## Usage Examples

### 1. Page View Tracking

```typescript
// Simple page view
analytics.pageView();

// Page view with custom data
analytics.pageView({
  page_title: "Home Page",
  page_path: "/home",
  page_location: "https://example.com/home",
  custom_param: "value",
});

// Track SPA route changes
router.afterEach((to) => {
  analytics.pageView({
    page_path: to.path,
    page_title: to.meta.title as string,
  });
});
```

### 2. Event Tracking

```typescript
// Button click
analytics.event("button_click", {
  category: "Engagement",
  label: "CTA Button",
  value: 1,
});

// Form submission
analytics.event("form_submit", {
  category: "Conversion",
  label: "Contact Form",
  form_name: "contact",
  form_destination: "sales",
});

// Video play
analytics.event("video_play", {
  category: "Media",
  label: "Product Demo",
  video_title: "How to Use",
  video_duration: 120,
});

// Newsletter signup
analytics.event("signup", {
  category: "Conversion",
  label: "Newsletter",
  method: "email",
});
```

### 3. E-commerce Tracking

```typescript
// Product view
analytics.event("view_item", {
  category: "E-commerce",
  items: [
    {
      item_id: "SKU123",
      item_name: "Premium Widget",
      item_category: "Widgets",
      price: 99.99,
      quantity: 1,
    },
  ],
});

// Add to cart
analytics.event("add_to_cart", {
  category: "E-commerce",
  value: 99.99,
  currency: "USD",
  items: [
    {
      item_id: "SKU123",
      item_name: "Premium Widget",
      price: 99.99,
      quantity: 1,
    },
  ],
});

// Purchase
analytics.transaction({
  transaction_id: "T12345",
  value: 149.98,
  currency: "USD",
  tax: 12.0,
  shipping: 7.99,
  coupon: "SAVE10",
  items: [
    {
      item_id: "SKU123",
      item_name: "Premium Widget",
      item_category: "Widgets",
      item_brand: "WidgetCo",
      price: 99.99,
      quantity: 1,
    },
    {
      item_id: "SKU456",
      item_name: "Basic Widget",
      item_category: "Widgets",
      price: 49.99,
      quantity: 1,
    },
  ],
});
```

### 4. User Tracking

```typescript
// Set user ID
analytics.setUser({
  user_id: "user_123456",
});

// Set user properties
analytics.setUser({
  user_id: "user_123456",
  user_type: "premium",
  lifetime_value: 599.99,
  subscription_plan: "pro",
  account_age_days: 365,
});
```

### 5. SEO Metrics

```typescript
// Track organic search landing
analytics.trackSEOMetrics({
  organic_source: "google",
  search_query: "best seo tool",
  ranking_position: 3,
  ctr: 0.15,
});

// Track time on page
setTimeout(() => {
  analytics.trackTimeOnPage();
}, 30000); // After 30 seconds

// Track page depth
analytics.trackSEOMetrics({
  page_depth: 5,
  time_on_page: 180,
  bounced: false,
});
```

### 6. File Downloads

```typescript
// Manual download tracking
analytics.trackDownload("whitepaper.pdf", "/downloads/whitepaper.pdf");

// Automatic tracking (if enhancedMeasurement.fileDownloads is enabled)
// Tracks clicks on links ending with:
// .pdf, .docx, .xlsx, .pptx, .zip, .rar, .7z, .tar, .gz
// .mp3, .mp4, .avi, .mov, .jpg, .png, .gif
```

### 7. Site Search

```typescript
// Track search query
analytics.trackSearch("react components", 42);

// Track search with no results
analytics.trackSearch("nonexistent query", 0);
```

### 8. Error Tracking

```typescript
// Track JavaScript errors
window.addEventListener("error", (event) => {
  analytics.trackError(event.error, true); // fatal = true
});

// Track promise rejections
window.addEventListener("unhandledrejection", (event) => {
  const error = new Error(event.reason);
  analytics.trackError(error, false);
});

// Manual error tracking
try {
  // Some code
} catch (error) {
  analytics.trackError(error as Error, false);
}
```

---

## Advanced Features

### 1. Bot Detection Integration

The analytics automatically integrates with m-seo's bot detection:

```typescript
// Filter all bot traffic (default)
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true, // Bots won't be tracked
});

// Track bots with labels
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: false, // Track all traffic
});

// When filterBots is false, page views include:
// - is_bot: true/false
// - bot_name: 'Googlebot', 'Bingbot', etc.
// - bot_type: 'search-engine', 'social-media', etc.
```

### 2. Performance Monitoring

```typescript
// Automatic performance tracking on page load
// Tracks:
// - page_load_time: Total page load time
// - dom_ready_time: DOM ready time
// - response_time: Server response time

// Manual performance tracking
analytics.trackPerformance();
```

### 3. Enhanced Measurement

#### Scroll Tracking

```typescript
// Automatic scroll depth tracking at 25%, 50%, 75%, 90%, 100%
// No code needed if enhancedMeasurement.scrollTracking is true
```

#### Outbound Link Tracking

```typescript
// Automatic tracking of external links
// No code needed if enhancedMeasurement.outboundLinks is true

// Tracks clicks on links starting with 'http' that don't include current domain
```

#### File Download Tracking

```typescript
// Automatic tracking of file downloads
// No code needed if enhancedMeasurement.fileDownloads is true
```

### 4. Custom Dimensions

```typescript
// Configure custom dimensions
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  customDimensions: {
    dimension1: "user_type",
    dimension2: "subscription_level",
    dimension3: "experiment_variant",
  },
});

// Send events with custom dimensions
analytics.event("conversion", {
  category: "E-commerce",
  user_type: "premium",
  subscription_level: "pro",
  experiment_variant: "A",
});
```

---

## Framework Integration

### React Integration

```tsx
import React, { useEffect } from "react";
import { createGoogleAnalytics } from "m-seo";
import { useLocation } from "react-router-dom";

// Initialize once
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
});

function App() {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    analytics.pageView({
      page_path: location.pathname,
      page_title: document.title,
    });
  }, [location]);

  return <div>Your App</div>;
}

// Track button clicks
function CTAButton() {
  const handleClick = () => {
    analytics.event("cta_click", {
      category: "Engagement",
      label: "Hero CTA",
    });
  };

  return <button onClick={handleClick}>Get Started</button>;
}

export default App;
```

### Vue 3 Integration

```vue
<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { createGoogleAnalytics } from "m-seo";

// Initialize analytics
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
});

const router = useRouter();

// Track page views on route change
watch(
  () => router.currentRoute.value,
  (route) => {
    analytics.pageView({
      page_path: route.path,
      page_title: (route.meta.title as string) || document.title,
    });
  }
);

// Track button click
const trackCTA = () => {
  analytics.event("cta_click", {
    category: "Engagement",
    label: "Hero CTA",
  });
};
</script>

<template>
  <button @click="trackCTA">Get Started</button>
</template>
```

### Next.js Integration

```typescript
// pages/_app.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { createGoogleAnalytics } from "m-seo";

const analytics = createGoogleAnalytics({
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID!,
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.pageView({ page_path: url });
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return <Component {...pageProps} />;
}

export default MyApp;
```

### Nuxt 3 Integration

```typescript
// plugins/analytics.client.ts
import { createGoogleAnalytics } from "m-seo";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const analytics = createGoogleAnalytics({
    measurementId: config.public.gaMeasurementId,
  });

  // Track page views on route change
  nuxtApp.hook("page:finish", () => {
    analytics.pageView({
      page_path: window.location.pathname,
    });
  });

  // Make analytics available globally
  return {
    provide: {
      analytics,
    },
  };
});

// Use in components:
// const { $analytics } = useNuxtApp();
// $analytics.event('button_click', { ... });
```

---

## API Reference

### Constructor

```typescript
new GoogleAnalytics(config?: GAConfig)
```

### Methods

#### `initialize(): void`

Initialize Google Analytics. Called automatically by `createGoogleAnalytics()`.

#### `pageView(data?: PageViewData): void`

Track a page view.

**Parameters:**

- `data.page_path` - Page path (default: `window.location.pathname`)
- `data.page_title` - Page title (default: `document.title`)
- `data.page_location` - Full URL (default: `window.location.href`)
- `data.page_referrer` - Referrer (default: `document.referrer`)

#### `event(eventName: string, data?: EventData): void`

Track a custom event.

**Parameters:**

- `eventName` - Event name
- `data.category` - Event category
- `data.label` - Event label
- `data.value` - Event value (number)
- `data.non_interaction` - Non-interaction event flag

#### `transaction(data: TransactionData): void`

Track an e-commerce transaction.

**Parameters:**

- `data.transaction_id` - Unique transaction ID (required)
- `data.value` - Transaction value (required)
- `data.currency` - Currency code (required)
- `data.items` - Array of transaction items (required)
- `data.tax` - Tax amount
- `data.shipping` - Shipping cost
- `data.coupon` - Coupon code
- `data.affiliation` - Affiliation

#### `setUser(properties: UserProperties): void`

Set user properties.

**Parameters:**

- `properties.user_id` - User ID
- `properties.user_type` - User type
- `properties.lifetime_value` - Customer lifetime value
- Custom properties

#### `trackSEOMetrics(metrics: SEOMetrics): void`

Track SEO-specific metrics.

**Parameters:**

- `metrics.organic_source` - Organic traffic source
- `metrics.search_query` - Search query
- `metrics.ranking_position` - Ranking position
- `metrics.ctr` - Click-through rate
- `metrics.time_on_page` - Time on page
- `metrics.bounced` - Bounce indicator
- `metrics.page_depth` - Page depth

#### `trackDownload(filename: string, url: string): void`

Track file download.

#### `trackSearch(query: string, results?: number): void`

Track site search.

#### `trackError(error: Error, fatal?: boolean): void`

Track JavaScript error.

#### `trackPerformance(): void`

Track page performance metrics.

#### `trackTimeOnPage(): void`

Track time spent on current page.

#### `getData(): any`

Get current analytics data.

#### `clear(): void`

Clear all analytics data.

---

## Best Practices

### 1. Initialize Once

```typescript
// ✅ Good: Initialize once in app entry point
const analytics = createGoogleAnalytics({ ... });

// ❌ Bad: Creating multiple instances
function MyComponent() {
  const analytics = createGoogleAnalytics({ ... }); // Don't do this
}
```

### 2. Use Environment Variables

```typescript
// ✅ Good
const analytics = createGoogleAnalytics({
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
});

// ❌ Bad: Hardcoded IDs in source code
```

### 3. Filter Bots in Production

```typescript
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true, // Filter bots in production
  debug: process.env.NODE_ENV === "development",
});
```

### 4. Track SPA Route Changes

```typescript
// Always track route changes in SPAs
router.afterEach((to) => {
  analytics.pageView({ page_path: to.path });
});
```

### 5. Use Descriptive Event Names

```typescript
// ✅ Good
analytics.event("newsletter_signup", { category: "Conversion" });
analytics.event("product_view", { category: "E-commerce" });

// ❌ Bad
analytics.event("click", { category: "button" });
analytics.event("event1", { category: "cat1" });
```

### 6. Track Conversions

```typescript
// Track important user actions
analytics.event("signup", { category: "Conversion" });
analytics.event("purchase", { category: "Conversion", value: 99.99 });
analytics.event("trial_start", { category: "Conversion" });
```

---

## Troubleshooting

### Events Not Showing in GA

1. **Check initialization:**

   ```typescript
   const analytics = createGoogleAnalytics({
     measurementId: "G-XXXXXXXXXX",
     debug: true, // Enable debug mode
   });
   ```

2. **Check browser console** for debug messages

3. **Verify Measurement ID** is correct

4. **Check bot filtering:**
   ```typescript
   filterBots: false; // Temporarily disable to test
   ```

### GA4 Real-Time Not Working

- GA4 real-time reports can take 1-2 minutes to update
- Check DebugView in GA4 instead
- Enable debug mode: `debug: true`

### Universal Analytics Not Working

- Ensure `trackingId` starts with `UA-`
- UA is deprecated but still supported
- Consider migrating to GA4

### Performance Issues

```typescript
// Disable features you don't need
const analytics = createGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  enhancedMeasurement: {
    scrollTracking: false, // Disable if not needed
    outboundLinks: false,
    fileDownloads: false,
  },
});
```

### TypeScript Errors

```typescript
// Import types
import { GAConfig, EventData, PageViewData } from 'm-seo';

// Use proper types
const config: GAConfig = { ... };
const eventData: EventData = { ... };
```

---

## Support

For more information:

- [Main Documentation](../README.md)
- [SEO Guide](./QUICK_REFERENCE.md)
- [Bot Detection Guide](./BOT_DETECTION_COMPLETE.md)
- [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)

---

## License

MIT License - see [LICENSE](../LICENSE) file for details.
