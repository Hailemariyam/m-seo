# Complete Guide: Using M-SEO with Next.js

## Overview

The M-SEO Next.js adapter is **standalone** and does **NOT require** importing core or analytics files directly. Everything you need is exposed through the adapter.

---

## 📦 What's Included in the NextAdapter

### Current Implementation (Updated)

The NextAdapter now supports **three usage levels**:

#### Level 1: Basic (NextAdapter Only)

- ✅ `CacheManager` (from middleware)
- ✅ `GeoSeo` (from middleware)
- ✅ `HeaderManager` (from middleware)
- ✅ `SecurityHeaders` (from middleware)

#### Level 2: Enhanced (NextAdapter + Core Modules)

- ✅ All Level 1 features
- ✅ `SeoEngine` (from core)
- ✅ `SitemapGenerator` (from core)
- ✅ `UrlManager` (from core)
- ✅ `Internationalization` (from core)
- ✅ `StructuredDataManager` (from core)

#### Level 3: Enterprise (NextAdapter + Core + Analytics)

- ✅ All Level 1 & 2 features
- ✅ `GoogleAnalytics` (from analytics)
- ✅ `BotDetection` (from analytics)
- ✅ `SeoAuditEngine` (from analytics)
- ✅ `SeoReportGenerator` (from analytics)

### What's NOT Required

The adapter handles **everything internally** - you don't need to manually import from core/ or analytics/ folders unless you want advanced customization.

**Why?** The NextAdapter is designed to be a **high-level, all-in-one** solution that handles common Next.js SEO needs without requiring manual setup.

---

## 🤔 Do You Need Core/Analytics Files?

### Answer: **It Depends on Your Use Case**

#### ✅ You DON'T Need Core/Analytics If:

- You want basic to advanced SEO (metadata, OG, Twitter cards)
- You need automatic sitemap.xml generation
- You need automatic robots.txt generation
- You want security headers (HSTS, CSP)
- You want caching for sitemaps
- You need geographic SEO
- You want structured data (JSON-LD)

**👉 Use NextAdapter alone - it handles all of this!**

#### ✅ You DO Need Core Files If:

You want **advanced customization** beyond the adapter:

**From `core/`:**

1. **`SeoEngine`** - Manual meta tag generation with custom logic
2. **`SitemapGenerator`** - Generate sitemaps with custom algorithms
3. **`RobotsManager`** - Advanced robots.txt with custom rules
4. **`StructuredDataManager`** - Complex schema.org validation
5. **`UrlManager`** - Advanced URL manipulation/canonicalization
6. **`Internationalization`** - Advanced i18n beyond hreflang

**From `analytics/`:**

1. **`GoogleAnalytics`** - Track SEO metrics and user behavior
2. **`BotDetection`** - Detect search engine bots
3. **`GoogleSearchConsole`** - Fetch GSC data programmatically
4. **`SeoAuditEngine`** - Run automated SEO audits
5. **`SeoReportGenerator`** - Generate SEO reports

---

## 🚀 Three Usage Levels

### Level 1: Simple (NextAdapter Only)

**90% of users - Recommended for most Next.js apps**

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
  securityPreset: "balanced",
});

// app/page.tsx
export const metadata = seo.generateMetadata({
  title: "Home",
  description: "Welcome to my site",
});

// app/sitemap.xml/route.ts
export async function GET() {
  return seo.generateSitemap([
    { url: "/", lastModified: new Date(), priority: 1 },
  ]);
}
```

**Provides:**

- ✅ Metadata generation
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Security headers
- ✅ Caching
- ✅ JSON-LD helpers

---

### Level 2: Enhanced (NextAdapter + Core)

**Advanced customization needs**

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";
import { SitemapGenerator, UrlManager } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
});

// Advanced sitemap generation with custom logic
export const sitemapGen = new SitemapGenerator({
  baseUrl: "https://example.com",
  defaultChangeFrequency: "weekly",
  defaultPriority: 0.7,
});

// Advanced URL management
export const urlManager = new UrlManager({
  baseUrl: "https://example.com",
  trailingSlash: true,
  lowercase: true,
});

// app/sitemap.xml/route.ts
export async function GET() {
  // Use core SitemapGenerator for advanced features
  const pages = await fetchPages();

  pages.forEach((page) => {
    sitemapGen.addUrl({
      loc: urlManager.normalize(page.path),
      lastmod: page.updatedAt,
      changefreq: page.changeFreq,
      priority: page.priority,
    });
  });

  return new Response(sitemapGen.toString(), {
    headers: { "Content-Type": "application/xml" },
  });
}
```

**Provides:**

- ✅ Everything from Level 1
- ✅ Advanced sitemap generation
- ✅ URL normalization and canonicalization
- ✅ Custom structured data validation
- ✅ Advanced internationalization

---

### Level 3: Enterprise (NextAdapter + Core + Analytics)

**NEW: Direct Enterprise Integration**

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";
import {
  SeoEngine,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
} from "m-seo";

// Create enterprise adapter with modules passed directly
export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Enterprise Site",
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,

  // Level 3: Pass enterprise modules directly to adapter
  seoEngine: new SeoEngine({ siteName: "My Enterprise Site" }),
  googleAnalytics: new GoogleAnalytics({
    measurementId: "G-XXXXXXXXXX",
    enablePageViews: true,
    enableEvents: true,
  }),
  botDetection: new BotDetection(),
  seoAuditEngine: new SeoAuditEngine({
    checkMetaTags: true,
    checkPerformance: true,
  }),
});

// Access enterprise features through adapter methods
export default async function AnalyticsPage() {
  // Use adapter's built-in enterprise methods
  const audit = await seo.runSeoAudit("https://example.com");
  const isBot = seo.detectBot("Mozilla/5.0 (compatible; Googlebot/2.1)");
  const botInfo = seo.getBotInfo("Mozilla/5.0 (compatible; Googlebot/2.1)");

  return (
    <div>
      <h1>SEO Analytics Dashboard</h1>
      <p>Bot detected: {isBot ? botInfo.name : "No"}</p>
      <pre>{JSON.stringify(audit, null, 2)}</pre>
    </div>
  );
}

// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Apply security headers from adapter
  Object.entries(seo.generateMiddlewareHeaders()).forEach(([k, v]) =>
    response.headers.set(k, v)
  );

  // Detect bots using adapter's built-in method
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = seo.detectBot(userAgent);

  if (isBot) {
    const botInfo = seo.getBotInfo(userAgent);
    response.headers.set("X-Bot-Detected", botInfo.name);
  }

  return response;
}
```

**Level 3 Features:**

- ✅ **Direct Module Integration** - Pass enterprise modules to NextAdapter constructor
- ✅ **Built-in Enterprise Methods** - `runSeoAudit()`, `detectBot()`, `getBotInfo()`, `getAnalyticsInstance()`
- ✅ **Unified API** - Access all features through the adapter instance
- ✅ **Automatic Middleware** - Bot detection and security headers built-in
- ✅ **Analytics Integration** - Google Analytics tracking and reporting
- ✅ **SEO Audits** - Automated page analysis and reporting

---

**Level 3 provides:**

- All Level 1 & 2 features
- Google Analytics integration
- Bot detection
- Automated SEO audits
- SEO report generation
- Search Console integration

**Use Level 3 for maximum control, analytics, and enterprise-grade SEO.**

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";
import {
  SeoEngine,
  SitemapGenerator,
  UrlManager,
  Internationalization,
  StructuredDataManager,
} from "m-seo";
import {
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
  SeoReportGenerator,
} from "m-seo";

// Basic adapter for Next.js
export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,
});

// Core modules for advanced features
export const seoEngine = new SeoEngine({
  siteName: "My Site",
  separator: "|",
});

export const i18n = new Internationalization({
  defaultLocale: "en-US",
  locales: ["en-US", "es", "fr", "de", "ja"],
});

export const urlManager = new UrlManager({
  baseUrl: "https://example.com",
  trailingSlash: true,
});

// Analytics modules
export const ga = new GoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  enablePageViews: true,
  enableEvents: true,
});

export const botDetector = new BotDetection();

export const auditEngine = new SeoAuditEngine({
  checkMetaTags: true,
  checkContent: true,
  checkPerformance: true,
});

// app/page.tsx
export const metadata = seo.generateMetadata({
  title: "Home",
  description: "Welcome",
});

// app/analytics/page.tsx
export default async function AnalyticsPage() {
  // Run SEO audit
  const audit = await auditEngine.audit("https://example.com");

  return (
    <div>
      <h1>SEO Audit Results</h1>
      <pre>{JSON.stringify(audit, null, 2)}</pre>
    </div>
  );
}

// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Apply security headers from adapter
  const headers = seo.generateMiddlewareHeaders();
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));

  // Detect bots
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = botDetector.isBot(userAgent);

  if (isBot) {
    const botInfo = botDetector.getBotInfo(userAgent);
    response.headers.set("X-Bot-Detected", botInfo.name);
  }

  return response;
}
```

**Provides:**

- ✅ Everything from Level 1 & 2
- ✅ Google Analytics integration
- ✅ Bot detection and handling
- ✅ Automated SEO audits
- ✅ SEO report generation
- ✅ Search Console integration

---

## 📊 Feature Matrix by Level

| Feature                         | Level 1<br>(Adapter Only) | Level 2<br>(+ Core) | Level 3<br>(+ Analytics) |
| ------------------------------- | :-----------------------: | :-----------------: | :----------------------: |
| Basic metadata                  |            ✅             |         ✅          |            ✅            |
| OpenGraph/Twitter               |            ✅             |         ✅          |            ✅            |
| Sitemap.xml                     |            ✅             |     ✅ Enhanced     |       ✅ Enhanced        |
| Robots.txt                      |            ✅             |         ✅          |            ✅            |
| Security headers                |            ✅             |         ✅          |            ✅            |
| Caching                         |            ✅             |         ✅          |            ✅            |
| JSON-LD helpers                 |            ✅             |         ✅          |            ✅            |
| Geographic SEO                  |            ✅             |         ✅          |            ✅            |
| URL management                  |           Basic           |     ✅ Advanced     |       ✅ Advanced        |
| i18n/hreflang                   |           Basic           |     ✅ Advanced     |       ✅ Advanced        |
| Schema validation               |            ❌             |         ✅          |            ✅            |
| Google Analytics                |            ❌             |         ❌          |            ✅            |
| Bot detection                   |            ❌             |         ❌          |            ✅            |
| SEO audits                      |            ❌             |         ❌          |            ✅            |
| Report generation               |            ❌             |         ❌          |            ✅            |
| GSC integration                 |            ❌             |         ❌          |            ✅            |
| **Direct Module Integration**   |            ❌             |         ❌          |            ✅            |
| **Built-in Enterprise Methods** |            ❌             |         ❌          |            ✅            |

---

## 💡 Recommendations

### For Most Next.js Apps

**Use Level 1 (NextAdapter Only)**

```typescript
import { createNextAdapter } from "m-seo";
```

This covers 90% of SEO needs without complexity.

### For Advanced SEO Needs

**Use Level 2 (NextAdapter + Core)**

```typescript
import { createNextAdapter, SitemapGenerator, UrlManager } from "m-seo";
```

When you need custom sitemap logic or advanced URL handling.

### For Enterprise/Agency

**Use Level 3 (NextAdapter + Enterprise Modules)**

```typescript
import { createNextAdapter } from "m-seo";
import {
  SeoEngine,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
} from "m-seo";

// Pass enterprise modules directly to adapter
export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  seoEngine: new SeoEngine({ siteName: "My Site" }),
  googleAnalytics: new GoogleAnalytics({ measurementId: "G-XXXXXXXXXX" }),
  botDetection: new BotDetection(),
  seoAuditEngine: new SeoAuditEngine(),
});
```

When you need analytics, audits, and comprehensive SEO monitoring with unified API access.

---

## 🎯 Quick Decision Guide

**Q: Do I just need metadata and sitemaps?**
→ Use **NextAdapter only** (Level 1)

**Q: Do I need custom sitemap generation or advanced URL handling?**
→ Add **core modules** (Level 2)

**Q: Do I need analytics, bot detection, or SEO audits with unified API access?**
→ Use **Level 3 enterprise integration** - pass modules directly to NextAdapter

**Q: Can I mix and match?**
→ Yes! Import only what you need:

```typescript
import {
  createNextAdapter, // Always include
  UrlManager, // From core (optional)
  GoogleAnalytics, // From analytics (optional)
} from "m-seo";

// Level 3: Pass directly to adapter
export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  googleAnalytics: new GoogleAnalytics({ measurementId: "G-XXXXXXXXXX" }),
  botDetection: new BotDetection(),
});
```

---

## 📝 Example: Real-World E-commerce Site

```typescript
// lib/seo.ts
import {
  createNextAdapter,
  UrlManager, // For product URL normalization
  GoogleAnalytics, // Track conversions
  BotDetection, // Handle search engine bots
} from "m-seo";

// Next.js adapter for basic SEO
export const seo = createNextAdapter({
  baseUrl: "https://mystore.com",
  siteName: "My Store",
  enableCaching: true,
  enableSecurity: true,
  securityPreset: "strict", // E-commerce needs strict security
  enableGeoSeo: true, // Multi-region pricing
});

// URL manager for clean product URLs
export const urlManager = new UrlManager({
  baseUrl: "https://mystore.com",
  trailingSlash: false,
  lowercase: true,
});

// Analytics for conversion tracking
export const ga = new GoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  enablePageViews: true,
  enableEvents: true,
});

// Bot detection for serving optimized content
export const botDetector = new BotDetection();

// app/products/[id]/page.tsx
import { generateProductJsonLd } from "m-seo";

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);

  return seo.generateMetadata({
    title: product.name,
    description: product.description,
    openGraph: {
      type: "product",
      images: [{ url: product.image, width: 1200, height: 630 }],
    },
  });
}

export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);

  const productSchema = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand,
    offers: {
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "InStock" : "OutOfStock",
      url: urlManager.normalize(`/products/${product.id}`),
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      {/* Product UI */}
    </>
  );
}
```

---

## ✅ Summary

### NextAdapter is Self-Contained

- ✅ Works standalone without core/analytics
- ✅ Handles 90% of Next.js SEO needs
- ✅ Includes caching, security, geo-targeting
- ✅ Provides metadata, sitemap, robots.txt

### Add Core For Advanced Features

- ✅ Custom sitemap algorithms
- ✅ Advanced URL normalization
- ✅ Schema.org validation
- ✅ Complex internationalization

### Level 3: Direct Enterprise Integration

- ✅ **Pass enterprise modules directly to NextAdapter constructor**
- ✅ **Access all features through unified adapter API**
- ✅ **Built-in enterprise methods** (`runSeoAudit()`, `detectBot()`, etc.)
- ✅ Google Analytics integration
- ✅ Bot detection
- ✅ SEO audits
- ✅ Report generation
- ✅ Search Console data

**Start with Level 1, upgrade to Level 3 for enterprise features!** 🚀
