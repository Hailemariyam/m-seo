# M-SEO Middleware Guide

## Overview

M-SEO provides four advanced middleware modules for optimizing performance, security, geographic targeting, and HTTP headers. These modules are designed for production use with comprehensive SEO considerations.

## Table of Contents

1. [CacheManager](#cachemanager) - Intelligent caching for SEO resources
2. [GeoSeo](#geoseo) - Geographic and location-based SEO
3. [HeaderManager](#headermanager) - HTTP header management
4. [SecurityHeaders](#securityheaders) - Security headers with SEO considerations

---

## CacheManager

### Purpose

Intelligent caching system for SEO-critical resources including:

- Sitemaps and sitemap indexes
- Structured data (JSON-LD, Schema.org)
- Translations and internationalized content
- Meta tag configurations
- Rendered pages and API responses

### Key Features

- **Multi-layer Caching**: Memory, disk, and CDN-aware caching
- **Tag-based Invalidation**: Group-based cache clearing
- **ETags**: Conditional requests for bandwidth optimization
- **Stale-while-revalidate**: Serve stale content while refreshing
- **LRU Eviction**: Automatic memory management
- **Statistics**: Cache hit/miss tracking
- **Compression Support**: Built-in gzip handling

### Basic Usage

```typescript
import { CacheManager } from "m-seo";

const cache = new CacheManager({
  namespace: "seo",
  defaultTtl: 3600, // 1 hour
  maxEntries: 1000,
  enableEtags: true,
  enableStaleWhileRevalidate: true,
});

// Cache sitemap
await cache.set("sitemap.xml", sitemapXml, {
  ttl: 86400, // 24 hours
  tags: ["sitemap", "xml"],
  staleWhileRevalidate: 43200, // 12 hours
});

// Retrieve from cache
const sitemap = await cache.get("sitemap.xml", {
  allowStale: true,
});

// Invalidate by tag
cache.invalidateByTag("sitemap");

// Get cache headers for HTTP response
const headers = cache.getCacheHeaders("sitemap.xml", {
  ttl: 86400,
  staleWhileRevalidate: 43200,
});
```

### Express.js Integration

```typescript
import express from "express";
import { CacheManager } from "m-seo";

const app = express();
const cache = new CacheManager();

app.get("/sitemap.xml", async (req, res) => {
  const cacheKey = "sitemap.xml";
  const cached = await cache.get(cacheKey);

  if (cached) {
    const headers = cache.getCacheHeaders(cacheKey, { ttl: 86400 });
    res.set(headers);
    return res.type("application/xml").send(cached);
  }

  // Generate sitemap
  const sitemap = await generateSitemap();

  await cache.set(cacheKey, sitemap, {
    ttl: 86400,
    tags: ["sitemap"],
  });

  res.type("application/xml").send(sitemap);
});
```

### Next.js Integration

```typescript
import { CacheManager } from "m-seo";

const cache = new CacheManager();

export async function GET(request: Request) {
  const cacheKey = "api-data";
  const cached = await cache.get(cacheKey);

  if (cached) {
    return new Response(JSON.stringify(cached), {
      headers: {
        "Content-Type": "application/json",
        ...cache.getCacheHeaders(cacheKey, { ttl: 300 }),
      },
    });
  }

  const data = await fetchData();

  await cache.set(cacheKey, data, {
    ttl: 300,
    tags: ["api"],
  });

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}
```

### Cache Warming

```typescript
// Pre-populate cache on server start
await cache.warm([
  { key: "homepage", data: homepageHtml, strategy: { ttl: 3600 } },
  { key: "sitemap", data: sitemapXml, strategy: { ttl: 86400 } },
  { key: "schema", data: schemaData, strategy: { ttl: 7200 } },
]);
```

### Persistence

```typescript
// Export cache to disk/database before shutdown
const snapshot = cache.export();
await fs.writeFile("cache-snapshot.json", JSON.stringify(snapshot));

// Import on restart
const snapshot = JSON.parse(await fs.readFile("cache-snapshot.json", "utf-8"));
cache.import(snapshot);
```

---

## GeoSeo

### Purpose

Geographic and location-based SEO optimization for:

- Multi-region websites and international SEO
- Local business directories and listings
- Restaurant chains and retail stores
- Real estate and property listings
- Event platforms with location-based content
- Service providers with regional coverage

### Key Features

- **IP Geolocation**: Automatic visitor location detection
- **Geo Meta Tags**: geo.region, geo.position, ICBM coordinates
- **LocalBusiness Schema**: Schema.org structured data
- **Regional Hreflang**: Multi-region alternate language tags
- **Distance Calculation**: Haversine formula for proximity
- **Location Breadcrumbs**: Geographic navigation trails
- **Opening Hours**: Schema.org compliant time formatting

### Basic Usage

```typescript
import { GeoSeo } from "m-seo";

const geoSeo = new GeoSeo({
  defaultCountry: "US",
  supportedRegions: ["US", "CA", "GB", "AU"],
  geolocationService: async (ip) => {
    // Integrate with MaxMind, ipapi.co, etc.
    return await geolocate(ip);
  },
});

// Detect visitor location
const location = await geoSeo.detectLocation(req.ip);

// Generate geo meta tags
const metaTags = geoSeo.getGeoMetaTags(location);
```

### LocalBusiness Schema

```typescript
const businessSchema = geoSeo.getLocalBusinessSchema({
  name: "Acme Coffee Shop",
  type: "CoffeeShop",
  address: {
    streetAddress: "123 Main St",
    city: "San Francisco",
    state: "CA",
    postalCode: "94102",
    country: "US",
  },
  coordinates: {
    latitude: 37.7749,
    longitude: -122.4194,
  },
  phone: "+1-415-555-0100",
  url: "https://example.com",
  openingHours: ["Mo-Fr 07:00-19:00", "Sa-Su 08:00-17:00"],
  priceRange: "$$",
});

// Add to page <head>
<script type="application/ld+json">{JSON.stringify(businessSchema)}</script>;
```

### Multi-Region Hreflang

```typescript
const hreflangTags = geoSeo.getRegionalHreflang('/products', {
  'en-US': 'https://example.com/us/products',
  'en-CA': 'https://example.ca/products',
  'en-GB': 'https://example.co.uk/products',
  'en-AU': 'https://example.com.au/products',
});

// Renders:
<link rel="alternate" hreflang="en-US" href="https://example.com/us/products" />
<link rel="alternate" hreflang="en-CA" href="https://example.ca/products" />
<link rel="alternate" hreflang="en-GB" href="https://example.co.uk/products" />
<link rel="alternate" hreflang="en-AU" href="https://example.com.au/products" />
```

### Distance Calculation

```typescript
// Find nearest store
const userLat = 37.7749;
const userLon = -122.4194;

const nearestStore = stores
  .map((store) => ({
    ...store,
    distance: geoSeo.calculateDistance(
      userLat,
      userLon,
      store.latitude,
      store.longitude
    ),
  }))
  .sort((a, b) => a.distance - b.distance)[0];

console.log(`Nearest store is ${nearestStore.distance.toFixed(2)} km away`);
```

### Express.js Integration

```typescript
app.use(async (req, res, next) => {
  const location = await geoSeo.detectLocation(req.ip);
  req.geoLocation = location;
  req.isTargetRegion = geoSeo.isTargetRegion(location);
  next();
});

app.get("/location-specific-page", (req, res) => {
  const metaTags = geoSeo.getGeoMetaTags(req.geoLocation);
  res.render("page", { metaTags });
});
```

---

## HeaderManager

### Purpose

Advanced HTTP header management for:

- SEO headers (canonical, alternate, robots)
- Performance headers (caching, compression, resource hints)
- Content negotiation (language, encoding, MIME types)
- CORS configuration
- Link headers (preload, prefetch, DNS prefetch)

### Key Features

- **SEO Headers**: Canonical URLs, alternate languages, X-Robots-Tag
- **Performance**: Cache-Control, resource hints, compression
- **Content Headers**: Language, encoding, content type
- **Link Headers**: Preload, prefetch, DNS prefetch, preconnect
- **CORS**: Full cross-origin configuration
- **Vary Headers**: Proper cache variation support

### Basic Usage

```typescript
import { HeaderManager } from "m-seo";

const headers = new HeaderManager({
  seo: {
    canonical: "https://example.com/page",
    alternates: [
      { url: "https://example.com/en/page", hreflang: "en" },
      { url: "https://example.com/es/page", hreflang: "es" },
    ],
    robots: {
      index: true,
      follow: true,
      maxSnippet: 320,
      maxImagePreview: "large",
    },
  },
  performance: {
    compression: true,
    caching: {
      public: true,
      maxAge: 3600,
      staleWhileRevalidate: 86400,
    },
    resourceHints: {
      dnsPrefetch: ["https://cdn.example.com"],
      preconnect: ["https://fonts.googleapis.com"],
      preload: [
        { url: "/critical.css", as: "style" },
        { url: "/hero.webp", as: "image" },
      ],
    },
  },
  content: {
    language: "en-US",
    type: "text/html",
    encoding: "utf-8",
  },
});

const responseHeaders = headers.getHeaders();
```

### Express.js Middleware

```typescript
import { createHeaderMiddleware } from "m-seo";

app.use(
  createHeaderMiddleware({
    seo: {
      robots: { index: true, follow: true },
    },
    performance: {
      caching: { public: true, maxAge: 3600 },
    },
  })
);
```

### Next.js API Route

```typescript
import { applyHeaders } from "m-seo";

export default function handler(req, res) {
  applyHeaders(res, {
    seo: {
      canonical: "https://example.com/api/data",
    },
    performance: {
      caching: { maxAge: 60 },
    },
  });

  res.json({ data: "..." });
}
```

### Resource Hints for Performance

```typescript
const headers = new HeaderManager({
  performance: {
    resourceHints: {
      // Resolve DNS early
      dnsPrefetch: ["https://cdn.example.com", "https://analytics.google.com"],
      // Establish connections early
      preconnect: ["https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      // Preload critical resources
      preload: [
        { url: "/critical.css", as: "style" },
        {
          url: "/font.woff2",
          as: "font",
          type: "font/woff2",
          crossorigin: true,
        },
      ],
      // Prefetch next navigation
      prefetch: ["/next-page"],
    },
  },
});
```

---

## SecurityHeaders

### Purpose

Security-focused HTTP headers that enhance both security and SEO:

- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS) - Google ranking factor
- Referrer Policy for analytics
- Frame protection
- Permissions Policy

### Key Features

- **CSP**: Prevent XSS while allowing search engine scripts
- **HSTS**: HTTPS enforcement (ranking signal)
- **Referrer Policy**: Control referrer for analytics
- **Frame Options**: Clickjacking prevention
- **Permissions Policy**: Browser feature restrictions
- **SEO Presets**: Balanced, strict, and relaxed configurations

### Security Presets

```typescript
import { SecurityHeaders, SECURITY_PRESETS } from "m-seo";

// Balanced security (recommended for most sites)
const security = new SecurityHeaders(SECURITY_PRESETS.balanced);

// Strict security (banking, healthcare)
const security = new SecurityHeaders(SECURITY_PRESETS.strict);

// Relaxed security (content sites with many embeds)
const security = new SecurityHeaders(SECURITY_PRESETS.relaxed);
```

### Custom Configuration

```typescript
const security = new SecurityHeaders({
  csp: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'"],
    styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "https:"],
    fontSrc: ["'self'", "https://fonts.gstatic.com"],
    upgradeInsecureRequests: true,
  },
  hsts: {
    enabled: true,
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: false,
  },
  referrerPolicy: "strict-origin-when-cross-origin",
  frameOptions: "SAMEORIGIN",
  noSniff: true,
  xssProtection: "block",
});
```

### Allow Google Analytics

```typescript
const security = new SecurityHeaders(SECURITY_PRESETS.strict);

// Automatically add GA domains to CSP
security.allowGoogleAnalytics();

// Or Google Tag Manager
security.allowGoogleTagManager();

// Or common CDNs
security.allowCommonCdns();

const headers = security.getHeaders();
```

### Express.js Middleware

```typescript
import { createSecurityMiddleware, SECURITY_PRESETS } from "m-seo";

app.use(createSecurityMiddleware(SECURITY_PRESETS.balanced));
```

### Next.js Middleware

```typescript
// middleware.ts
import { applySecurityHeaders, SECURITY_PRESETS } from "m-seo";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  applySecurityHeaders(response, SECURITY_PRESETS.balanced);
  return response;
}
```

### SEO Considerations

#### HSTS and HTTPS

```typescript
// HTTPS is a ranking factor
hsts: {
  enabled: true,
  maxAge: 31536000, // Required by Google
  includeSubDomains: true, // Recommended
  preload: true, // Submit to Chrome's HSTS preload list
}
```

#### Referrer Policy

```typescript
// Balance privacy with analytics needs
referrerPolicy: "strict-origin-when-cross-origin";
// Sends full URL for same-origin, origin only for cross-origin HTTPS
```

#### CSP and Tracking Scripts

```typescript
csp: {
  scriptSrc: [
    "'self'",
    "'unsafe-inline'", // Required for Google Analytics
    'https://www.googletagmanager.com',
    'https://www.google-analytics.com',
  ],
  connectSrc: [
    "'self'",
    'https://www.google-analytics.com',
    'https://analytics.google.com',
  ],
}
```

---

## Complete Integration Example

### Express.js Server with All Middleware

```typescript
import express from "express";
import {
  CacheManager,
  GeoSeo,
  createHeaderMiddleware,
  createSecurityMiddleware,
  SECURITY_PRESETS,
} from "m-seo";

const app = express();

// Initialize modules
const cache = new CacheManager({ namespace: "seo" });
const geoSeo = new GeoSeo({ defaultCountry: "US" });

// Apply security headers globally
app.use(createSecurityMiddleware(SECURITY_PRESETS.balanced));

// Geolocation middleware
app.use(async (req, res, next) => {
  req.geoLocation = await geoSeo.detectLocation(req.ip);
  next();
});

// Homepage with caching and geo-targeting
app.get("/", async (req, res) => {
  const cacheKey = `homepage-${req.geoLocation.country}`;
  const cached = await cache.get(cacheKey);

  if (cached) {
    return res.set(cache.getCacheHeaders(cacheKey, { ttl: 3600 })).send(cached);
  }

  const html = await renderHomepage(req.geoLocation);

  await cache.set(cacheKey, html, {
    ttl: 3600,
    tags: ["homepage", req.geoLocation.country],
  });

  res.send(html);
});

// API with custom headers
app.get("/api/data", async (req, res) => {
  const headers = createHeaderMiddleware({
    performance: {
      caching: { public: true, maxAge: 300 },
    },
    cors: {
      origin: "*",
      methods: ["GET"],
    },
  });

  headers(req, res, () => {
    res.json({ data: "..." });
  });
});

app.listen(3000);
```

### Next.js App with Middleware

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { applySecurityHeaders, SECURITY_PRESETS } from "m-seo";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers
  applySecurityHeaders(response, SECURITY_PRESETS.balanced);

  // Add cache headers for static assets
  if (request.nextUrl.pathname.startsWith("/static/")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
  }

  return response;
}

export const config = {
  matcher: "/:path*",
};
```

---

## Best Practices

### 1. Cache Strategy

- **Sitemaps**: 24 hours TTL with stale-while-revalidate
- **Structured Data**: 2 hours TTL, invalidate on content changes
- **Translations**: 1 week TTL, invalidate on translation updates
- **API Responses**: 5 minutes TTL for dynamic data

### 2. Geographic SEO

- Use hreflang tags for multi-region content
- Implement geo-specific canonical URLs
- Add LocalBusiness schema for physical locations
- Cache geo-detected content by region

### 3. Header Optimization

- Always set Cache-Control for static resources
- Use resource hints (preload, prefetch) for critical assets
- Implement proper Vary headers for caching
- Set correct Content-Language for i18n sites

### 4. Security and SEO Balance

- Use `balanced` preset for most production sites
- Allow Google Analytics/GTM in CSP
- Enable HSTS for HTTPS ranking boost
- Use `strict-origin-when-cross-origin` referrer policy

### 5. Performance

- Enable compression headers
- Use stale-while-revalidate for better UX
- Implement cache warming on deployment
- Monitor cache hit rates with statistics

---

## Troubleshooting

### Cache Not Working

```typescript
// Check cache statistics
const stats = cache.getStatistics();
console.log(`Hit rate: ${(stats.hitRate * 100).toFixed(2)}%`);

// Verify TTL configuration
const entry = await cache.get("key", { includeMetadata: true });
console.log("TTL:", entry?.ttl);
```

### Geolocation Issues

```typescript
// Use fallback for localhost/development
const location = await geoSeo.detectLocation(req.ip || "8.8.8.8");

// Check if region is supported
if (geoSeo.isTargetRegion(location)) {
  // Show region-specific content
}
```

### CSP Blocking Resources

```typescript
// Check browser console for CSP violations
// Add required domains to CSP

const security = new SecurityHeaders({
  csp: {
    scriptSrc: ["'self'", "https://trusted-cdn.com"],
    reportUri: "/csp-violations", // Log violations
  },
});
```

---

## API Reference

See individual class documentation in source files:

- `src/middleware/CacheManager.ts`
- `src/middleware/GeoSeo.ts`
- `src/middleware/HeaderManager.ts`
- `src/middleware/SecurityHeaders.ts`

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## License

MIT - See [LICENSE](../LICENSE) for details.
