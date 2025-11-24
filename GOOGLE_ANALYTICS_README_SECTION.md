# Google Analytics Integration - README Section

Add this section to the main README.md after the Bot Detection section:

---

## 📊 Google Analytics Integration

Advanced Google Analytics integration with GA4 and Universal Analytics support, bot filtering, and comprehensive tracking.

### Features

- ✅ **Dual Analytics** - GA4 and Universal Analytics support
- ✅ **Bot Filtering** - Automatic bot detection and filtering
- ✅ **E-commerce** - Complete transaction and product tracking
- ✅ **SEO Metrics** - Organic traffic, search queries, rankings
- ✅ **Enhanced Measurement** - Scroll, links, downloads, video
- ✅ **Privacy Compliant** - IP anonymization, cookie controls
- ✅ **Framework Integration** - React hooks, Vue composables
- ✅ **TypeScript** - Full type safety

### Quick Start

#### Vanilla JavaScript

```typescript
import { createGoogleAnalytics } from 'm-seo';

const analytics = createGoogleAnalytics({
  measurementId: 'G-XXXXXXXXXX',
  filterBots: true,
  anonymizeIp: true
});

// Track page view
analytics.pageView();

// Track event
analytics.event('button_click', {
  category: 'Engagement',
  label: 'CTA Button'
});

// Track purchase
analytics.transaction({
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [...]
});
```

#### React

```tsx
import {
  useGoogleAnalytics,
  usePageViewTracking,
} from "m-seo/adapters/ReactSPAAdapter";
import { useLocation } from "react-router-dom";

function App() {
  const analytics = useGoogleAnalytics({
    measurementId: "G-XXXXXXXXXX",
    filterBots: true,
  });

  const location = useLocation();
  usePageViewTracking(analytics, location.pathname);

  return <YourApp />;
}
```

#### Vue 3

```vue
<script setup lang="ts">
import {
  useGoogleAnalytics,
  usePageViewTracking,
} from "m-seo/adapters/VueSPAAdapter";
import { useRouter } from "vue-router";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const router = useRouter();
usePageViewTracking(analytics, router);
</script>

<template>
  <router-view />
</template>
```

### Tracking Examples

#### E-commerce Tracking

```typescript
// Product view
analytics.event('view_item', {
  category: 'E-commerce',
  items: [{
    item_id: 'SKU123',
    item_name: 'Premium Widget',
    price: 99.99,
    quantity: 1
  }]
});

// Purchase
analytics.transaction({
  transaction_id: 'ORDER-123',
  value: 99.99,
  currency: 'USD',
  items: [...]
});
```

#### SEO Metrics

```typescript
analytics.trackSEOMetrics({
  organic_source: "google",
  search_query: "best seo tool",
  ranking_position: 3,
  ctr: 0.15,
});
```

#### User Tracking

```typescript
analytics.setUser({
  user_id: "user_123",
  user_type: "premium",
  lifetime_value: 599.99,
});
```

### Configuration

```typescript
const analytics = createGoogleAnalytics({
  // Analytics IDs
  measurementId: "G-XXXXXXXXXX", // GA4
  trackingId: "UA-XXXXXXXXX-X", // UA (optional)

  // Settings
  debug: false,
  anonymizeIp: true,
  filterBots: true,
  autoPageView: true,

  // Enhanced Measurement
  enhancedMeasurement: {
    scrollTracking: true,
    outboundLinks: true,
    siteSearch: true,
    videoEngagement: true,
    fileDownloads: true,
  },

  // Cookie Configuration
  cookieConfig: {
    domain: "example.com",
    expires: 63072000,
    secure: true,
    sameSite: "lax",
  },
});
```

### API Reference

```typescript
// Page view tracking
analytics.pageView({ page_title: 'Home' });

// Event tracking
analytics.event('button_click', { category: 'Engagement' });

// E-commerce
analytics.transaction({ transaction_id: 'T123', value: 99.99, currency: 'USD', items: [...] });

// User properties
analytics.setUser({ user_id: 'user_123', user_type: 'premium' });

// SEO metrics
analytics.trackSEOMetrics({ organic_source: 'google', search_query: 'query' });

// File downloads
analytics.trackDownload('whitepaper.pdf', '/files/whitepaper.pdf');

// Site search
analytics.trackSearch('react components', 42);

// Errors
analytics.trackError(error, false);

// Performance
analytics.trackPerformance();
```

### Documentation

- **Complete Guide**: [docs/GOOGLE_ANALYTICS_GUIDE.md](docs/GOOGLE_ANALYTICS_GUIDE.md)
- **JavaScript Examples**: [examples/google-analytics-examples.ts](examples/google-analytics-examples.ts)
- **React Examples**: [examples/react-google-analytics.tsx](examples/react-google-analytics.tsx)
- **Vue Examples**: [examples/vue-google-analytics.vue](examples/vue-google-analytics.vue)
- **Integration Summary**: [GOOGLE_ANALYTICS_INTEGRATION.md](GOOGLE_ANALYTICS_INTEGRATION.md)

---
