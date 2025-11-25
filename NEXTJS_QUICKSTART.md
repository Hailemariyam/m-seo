# Quick Start: M-SEO with Next.js - Three Levels

## 🎯 Choose Your Level

### Level 1: Simple (90% of apps) ✅ RECOMMENDED

**Just the NextAdapter - No core/analytics needed**

```bash
npm install m-seo
```

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
});
```

**What you get:**

- ✅ Metadata (title, description, OG, Twitter)
- ✅ Sitemap.xml (automatic)
- ✅ Robots.txt (automatic)
- ✅ Security headers (HSTS, CSP)
- ✅ Caching (sitemaps, schemas)
- ✅ JSON-LD helpers (breadcrumb, article, product, FAQ)
- ✅ Geographic SEO

---

### Level 2: Advanced (Custom needs)

**NextAdapter + Core modules**

```typescript
// lib/seo.ts
import {
  createNextAdapter,
  SitemapGenerator, // Advanced sitemap
  UrlManager, // URL normalization
  Internationalization, // Advanced i18n
} from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
});

// Custom sitemap logic
export const sitemapGen = new SitemapGenerator({
  baseUrl: "https://example.com",
  defaultChangeFrequency: "weekly",
});

// URL management
export const urlManager = new UrlManager({
  baseUrl: "https://example.com",
  trailingSlash: true,
});
```

**What you ADD:**

- ✅ Custom sitemap algorithms
- ✅ URL canonicalization
- ✅ Advanced i18n
- ✅ Schema validation

---

### Level 3: Enterprise (Full platform)

**NextAdapter + Core + Analytics**

```typescript
// lib/seo.ts
import {
  createNextAdapter,
  UrlManager,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
} from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
});

export const ga = new GoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
});

export const botDetector = new BotDetection();

export const auditEngine = new SeoAuditEngine({
  checkMetaTags: true,
  checkPerformance: true,
});
```

**What you ADD:**

- ✅ Google Analytics
- ✅ Bot detection
- ✅ SEO audits
- ✅ Report generation
- ✅ Search Console integration

---

## 📋 Comparison Table

| Feature            | Level 1  |   Level 2   |   Level 3   |
| ------------------ | :------: | :---------: | :---------: |
| **Imports needed** |    1     |     2-4     |     5+      |
| **Complexity**     |   Low    |   Medium    |    High     |
| **Setup time**     |  5 min   |   15 min    |   30+ min   |
| **Bundle size**    |   ~8KB   |    ~15KB    |    ~25KB    |
| **Metadata**       |    ✅    |     ✅      |     ✅      |
| **Sitemap**        | ✅ Basic | ✅ Advanced | ✅ Advanced |
| **Security**       |    ✅    |     ✅      |     ✅      |
| **Caching**        |    ✅    |     ✅      |     ✅      |
| **Custom URLs**    |    ❌    |     ✅      |     ✅      |
| **Analytics**      |    ❌    |     ❌      |     ✅      |
| **Bot detection**  |    ❌    |     ❌      |     ✅      |
| **SEO audits**     |    ❌    |     ❌      |     ✅      |

---

## 🚀 Complete Examples

### Example 1: Blog (Level 1)

```typescript
// lib/seo.ts
import { createNextAdapter, generateArticleJsonLd } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://myblog.com",
  siteName: "My Blog",
  enableCaching: true,
  enableSecurity: true,
});

// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.slug);

  return seo.generateMetadata({
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      images: [{ url: post.coverImage }],
    },
  });
}

export default async function BlogPost({ params }) {
  const post = await fetchPost(params.slug);

  const articleSchema = generateArticleJsonLd({
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    author: { name: post.author.name },
    publisher: { name: "My Blog", logo: "/logo.png" },
  });

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <article>{/* Content */}</article>
    </>
  );
}

// app/sitemap.xml/route.ts
export async function GET() {
  const posts = await fetchAllPosts();

  const urls = posts.map((post) => ({
    url: `/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return seo.generateSitemap(urls);
}
```

**Result**: Full blog SEO in ~50 lines of code! ✅

---

### Example 2: E-commerce (Level 2)

```typescript
// lib/seo.ts
import { createNextAdapter, generateProductJsonLd, UrlManager } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://mystore.com",
  siteName: "My Store",
  enableCaching: true,
  enableSecurity: true,
  securityPreset: "strict",
  enableGeoSeo: true, // Multi-region pricing
});

// Clean product URLs
export const urlManager = new UrlManager({
  baseUrl: "https://mystore.com",
  trailingSlash: false,
  lowercase: true,
});

// app/products/[id]/page.tsx
export default async function ProductPage({ params }) {
  const product = await fetchProduct(params.id);

  const productSchema = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand,
    sku: product.sku,
    offers: {
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "InStock" : "OutOfStock",
      url: urlManager.normalize(`/products/${product.id}`),
    },
    aggregateRating: {
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  });

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(productSchema)}
      </script>
      {/* Product UI */}
    </>
  );
}
```

**Result**: E-commerce SEO + clean URLs! ✅

---

### Example 3: SaaS Platform (Level 3)

```typescript
// lib/seo.ts
import {
  createNextAdapter,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
  UrlManager,
} from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://mysaas.com",
  siteName: "My SaaS",
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,
});

export const ga = new GoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  enablePageViews: true,
  enableEvents: true,
});

export const botDetector = new BotDetection();
export const auditEngine = new SeoAuditEngine();

// middleware.ts
import { NextResponse } from "next/server";

export function middleware(request) {
  const response = NextResponse.next();

  // Security headers
  const headers = seo.generateMiddlewareHeaders();
  Object.entries(headers).forEach(([k, v]) => {
    response.headers.set(k, v);
  });

  // Bot detection
  const userAgent = request.headers.get("user-agent") || "";
  const isBot = botDetector.isBot(userAgent);

  if (isBot) {
    response.headers.set("X-Bot-Detected", "true");
  }

  return response;
}

// app/dashboard/seo/page.tsx
export default async function SeoAuditPage() {
  const audit = await auditEngine.audit("https://mysaas.com");

  return (
    <div>
      <h1>SEO Audit</h1>
      <p>Score: {audit.score}/100</p>
      <ul>
        {audit.issues.map((issue) => (
          <li key={issue.id}>
            {issue.severity}: {issue.message}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

**Result**: Full SEO platform with analytics and monitoring! ✅

---

## 🎯 Decision Tree

```
Start Here
    |
    v
Do you need basic SEO? (metadata, sitemap, robots.txt)
    |
    +-- YES --> Use Level 1 (NextAdapter only) ✅ DONE
    |
    +-- Need more customization?
            |
            +-- YES --> Need custom sitemap logic?
            |           Need URL normalization?
            |           Need advanced i18n?
            |               |
            |               v
            |           Use Level 2 (+ Core modules)
            |
            +-- Need analytics/monitoring?
                    |
                    v
                YES --> Need Google Analytics?
                        Need bot detection?
                        Need SEO audits?
                            |
                            v
                        Use Level 3 (+ Analytics modules)
```

---

## 📦 Import Cheatsheet

### Level 1 (Simple)

```typescript
import {
  createNextAdapter,
  generateBreadcrumbJsonLd,
  generateArticleJsonLd,
  generateProductJsonLd,
  generateFaqJsonLd,
} from "m-seo";
```

### Level 2 (Advanced)

```typescript
import {
  createNextAdapter,
  SitemapGenerator,
  UrlManager,
  Internationalization,
  StructuredDataManager,
  RobotsManager,
} from "m-seo";
```

### Level 3 (Enterprise)

```typescript
import {
  createNextAdapter,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
  SeoReportGenerator,
  GoogleSearchConsole,
} from "m-seo";
```

---

## ✅ Final Recommendation

### For 90% of Next.js apps:

**Use Level 1 - NextAdapter only**

```typescript
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  siteName: "My Site",
  enableCaching: true,
  enableSecurity: true,
});
```

**This gives you:**

- ✅ All metadata (OG, Twitter, robots)
- ✅ Automatic sitemap.xml
- ✅ Automatic robots.txt
- ✅ Security headers (HSTS = Google ranking factor!)
- ✅ Caching (faster page loads)
- ✅ JSON-LD helpers
- ✅ Geographic SEO

**No core or analytics imports needed!** 🎉

Only add core/analytics modules when you specifically need their advanced features.

---

## 📚 Full Documentation

- **Usage Guide**: `docs/NEXTJS_USAGE_COMPLETE.md` (this file)
- **API Reference**: `docs/NEXT_JS_GUIDE.md`
- **Examples**: `examples/nextjs/`
- **Migration**: See `docs/NEXT_JS_GUIDE.md` (next-seo → m-seo)

**Ready to start? Use Level 1 and upgrade as needed!** 🚀
