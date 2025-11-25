# M-SEO for Next.js - Better than next-seo

## Why M-SEO > next-seo?

### Feature Comparison

| Feature                                | next-seo | m-seo                    |
| -------------------------------------- | -------- | ------------------------ |
| **Basic SEO** (title, description, OG) | ✅       | ✅                       |
| **JSON-LD structured data**            | ✅       | ✅ **+ Auto validation** |
| **App Router support**                 | ✅       | ✅ **+ Enhanced**        |
| **Pages Router support**               | ✅       | ✅                       |
| **Built-in caching**                   | ❌       | ✅ **Advanced**          |
| **Security headers (HSTS, CSP)**       | ❌       | ✅ **Production-ready**  |
| **Geographic SEO**                     | ❌       | ✅ **Multi-region**      |
| **Performance headers**                | ❌       | ✅ **Resource hints**    |
| **Auto sitemap generation**            | ❌       | ✅ **With caching**      |
| **Auto robots.txt**                    | ❌       | ✅                       |
| **Middleware integration**             | ❌       | ✅ **4 modules**         |
| **i18n hreflang**                      | Manual   | ✅ **Automatic**         |
| **LocalBusiness schema**               | Manual   | ✅ **Built-in**          |
| **Real-time invalidation**             | ❌       | ✅ **Tag-based**         |

### Unique Advantages

1. **All-in-One Solution**: SEO + Security + Performance + Caching
2. **Next.js 14+ Optimized**: Full App Router and Server Components support
3. **Production Ready**: Battle-tested middleware modules
4. **TypeScript First**: Complete type safety
5. **Zero Dependencies**: Lightweight and fast
6. **Enterprise Features**: Caching, geo-targeting, security headers

---

## Quick Start

### Installation

```bash
npm install m-seo
```

### Setup

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Awesome Site",
  defaultLocale: "en-US",
  locales: ["en-US", "es", "fr", "de"],

  // Enable advanced features
  enableCaching: true,
  enableSecurity: true,
  securityPreset: "balanced", // or 'strict' / 'relaxed'
  enableGeoSeo: true,
  enableAutoSitemap: true,
  enableResourceHints: true,

  // Performance
  preconnectDomains: [
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ],
  dnsPrefetchDomains: ["https://www.google-analytics.com"],
});
```

---

## App Router Usage

### 1. Page Metadata (Better than next-seo's `NextSeo`)

```typescript
// app/page.tsx
import { seo } from "@/lib/seo";

export const metadata = seo.generateMetadata({
  title: "Home Page",
  description: "Welcome to our awesome website",
  keywords: ["nextjs", "seo", "react"],

  openGraph: {
    title: "Home Page - My Site",
    description: "Welcome to our awesome website",
    url: "https://example.com",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "My Site",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    site: "@mysite",
    creator: "@author",
  },

  robots: {
    index: true,
    follow: true,
    maxSnippet: 320,
    maxImagePreview: "large",
  },

  // Auto-generated hreflang tags
  languageAlternates: [
    { hrefLang: "en-US", href: "https://example.com" },
    { hrefLang: "es", href: "https://example.com/es" },
    { hrefLang: "fr", href: "https://example.com/fr" },
  ],
});

export const viewport = seo.generateViewport({
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
});

export default function HomePage() {
  return <h1>Home Page</h1>;
}
```

### 2. JSON-LD Structured Data (Enhanced)

```typescript
// app/blog/[slug]/page.tsx
import {
  seo,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";

export default function BlogPost({ params }: { params: { slug: string } }) {
  const article = {
    headline: "How to Use M-SEO with Next.js",
    description: "Complete guide to advanced SEO",
    image: "/blog/m-seo-guide.jpg",
    datePublished: "2025-11-25T00:00:00Z",
    dateModified: "2025-11-25T12:00:00Z",
    author: {
      name: "John Doe",
      url: "https://example.com/authors/john",
    },
    publisher: {
      name: "My Site",
      logo: "/logo.png",
    },
  };

  const breadcrumbs = [
    { name: "Home", url: "https://example.com" },
    { name: "Blog", url: "https://example.com/blog" },
    { name: article.headline, url: `https://example.com/blog/${params.slug}` },
  ];

  return (
    <>
      {/* Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleJsonLd(article)),
        }}
      />

      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbJsonLd(breadcrumbs)),
        }}
      />

      <article>
        <h1>{article.headline}</h1>
        {/* Content */}
      </article>
    </>
  );
}
```

### 3. Automatic Sitemap (Built-in)

```typescript
// app/sitemap.xml/route.ts
import { seo } from "@/lib/seo";

export async function GET() {
  // Fetch your pages from database/CMS
  const pages = await fetchAllPages();

  const urls = pages.map((page) => ({
    url: page.path,
    lastModified: page.updatedAt,
    changeFrequency: "weekly" as const,
    priority: page.priority || 0.5,
    alternates: [
      { lang: "en", url: `https://example.com${page.path}` },
      { lang: "es", url: `https://example.com/es${page.path}` },
      { lang: "fr", url: `https://example.com/fr${page.path}` },
    ],
  }));

  // Automatic caching + XML generation
  return seo.generateSitemap(urls);
}
```

### 4. Automatic robots.txt

```typescript
// app/robots.txt/route.ts
import { seo } from "@/lib/seo";

export async function GET() {
  return seo.generateRobotsTxt({
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api", "/private"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        crawlDelay: 0,
      },
    ],
    sitemap: [
      "https://example.com/sitemap.xml",
      "https://example.com/blog-sitemap.xml",
    ],
    host: "https://example.com",
  });
}
```

### 5. Middleware (Security + Performance)

```typescript
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { seo } from "@/lib/seo";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Auto-apply security headers, resource hints, etc.
  const headers = seo.generateMiddlewareHeaders(request);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
```

---

## Advanced Features

### 1. Geographic SEO (Unique to M-SEO)

```typescript
// app/locations/[city]/page.tsx
import { seo } from "@/lib/seo";

export const metadata = seo.generateMetadata({
  title: "Our Location in San Francisco",
  description: "Visit our San Francisco office",
});

export default function LocationPage() {
  const geoSeo = seo.getGeoSeo();

  const business = {
    name: "Acme Corp - San Francisco",
    type: "LocalBusiness",
    address: {
      streetAddress: "123 Market St",
      city: "San Francisco",
      state: "CA",
      postalCode: "94103",
      country: "US",
    },
    coordinates: {
      latitude: 37.7749,
      longitude: -122.4194,
    },
    phone: "+1-415-555-0100",
    url: "https://example.com/locations/san-francisco",
    openingHours: ["Mo-Fr 09:00-18:00", "Sa 10:00-16:00"],
  };

  const schema = geoSeo?.getLocalBusinessSchema(business);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <h1>Visit Us in San Francisco</h1>
    </>
  );
}
```

### 2. Cache Invalidation (Unique to M-SEO)

```typescript
// app/api/revalidate/route.ts
import { seo } from "@/lib/seo";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { tags } = await request.json();

  // Invalidate specific cached content
  await seo.invalidateCache(tags || ["sitemap", "schema"]);

  return NextResponse.json({ revalidated: true });
}
```

### 3. E-commerce Product Pages

```typescript
// app/products/[id]/page.tsx
import { generateProductJsonLd } from "m-seo";

export default function ProductPage({ product }: { product: Product }) {
  const productSchema = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand,
    offers: {
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock ? "InStock" : "OutOfStock",
      url: `https://example.com/products/${product.id}`,
    },
    aggregateRating: product.rating
      ? {
          ratingValue: product.rating.average,
          reviewCount: product.rating.count,
        }
      : undefined,
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

### 4. FAQ Pages

```typescript
// app/faq/page.tsx
import { generateFaqJsonLd } from "m-seo";

export default function FAQPage() {
  const faqs = [
    {
      question: "What is M-SEO?",
      answer:
        "M-SEO is an advanced SEO library for Next.js that provides caching, security, and geographic features.",
    },
    {
      question: "How is it better than next-seo?",
      answer:
        "M-SEO includes built-in middleware, caching, security headers, geo-targeting, and automatic sitemap generation.",
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFaqJsonLd(faqs)),
        }}
      />
      <h1>Frequently Asked Questions</h1>
      {/* FAQ UI */}
    </>
  );
}
```

---

## Migration from next-seo

### Before (next-seo)

```typescript
import { NextSeo } from "next-seo";

export default function Page() {
  return (
    <>
      <NextSeo
        title="Home Page"
        description="My description"
        canonical="https://example.com"
        openGraph={{
          url: "https://example.com",
          title: "Home Page",
          description: "My description",
          images: [
            {
              url: "/og-image.jpg",
              width: 1200,
              height: 630,
            },
          ],
        }}
      />
      <h1>Content</h1>
    </>
  );
}
```

### After (m-seo)

```typescript
import { seo } from "@/lib/seo";

export const metadata = seo.generateMetadata({
  title: "Home Page",
  description: "My description",
  canonical: "https://example.com",
  openGraph: {
    url: "https://example.com",
    title: "Home Page",
    description: "My description",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
});

export default function Page() {
  return <h1>Content</h1>;
}
```

**Benefits**:

- ✅ No client-side component needed
- ✅ Automatic caching
- ✅ Security headers included
- ✅ Better performance
- ✅ Server Components compatible

---

## Performance Comparison

| Metric                 | next-seo | m-seo        |
| ---------------------- | -------- | ------------ |
| **Bundle Size**        | ~15KB    | ~8KB (core)  |
| **Server Components**  | Limited  | Full support |
| **Caching**            | Manual   | Automatic    |
| **SEO Headers**        | Manual   | Automatic    |
| **Security Headers**   | None     | Built-in     |
| **Sitemap Generation** | Manual   | Automatic    |

---

## API Reference

### NextAdapter Methods

#### `generateMetadata(config)`

Generate Next.js App Router metadata object.

#### `generateViewport(config)`

Generate viewport configuration.

#### `generateJsonLd(data)`

Generate JSON-LD with automatic @context.

#### `generateMiddlewareHeaders(request)`

Generate security and performance headers.

#### `generateSitemap(urls)`

Generate sitemap.xml with caching.

#### `generateRobotsTxt(config)`

Generate robots.txt.

#### `invalidateCache(tags?)`

Invalidate cached content by tags.

### Helper Functions

#### `generateBreadcrumbJsonLd(items)`

Create breadcrumb structured data.

#### `generateArticleJsonLd(article)`

Create article structured data.

#### `generateProductJsonLd(product)`

Create product structured data.

#### `generateFaqJsonLd(questions)`

Create FAQ structured data.

---

## Best Practices

### 1. Use Metadata API (App Router)

```typescript
// ✅ Good - Native Next.js 13+
export const metadata = seo.generateMetadata({...});

// ❌ Avoid - Client component approach
<NextSeo {...} />
```

### 2. Enable Caching for Production

```typescript
const seo = createNextAdapter({
  enableCaching: true, // Caches sitemaps, schemas
  cacheOptions: {
    defaultTtl: 3600, // 1 hour
  },
});
```

### 3. Use Security Presets

```typescript
const seo = createNextAdapter({
  enableSecurity: true,
  securityPreset: "balanced", // Recommended for most sites
});
```

### 4. Leverage Middleware

```typescript
// middleware.ts - Auto-applies headers to all routes
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const headers = seo.generateMiddlewareHeaders();
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}
```

---

## Troubleshooting

### Metadata Not Showing

- Ensure you're using App Router (`app/` directory)
- Check `metadata` is exported as `const`
- Verify `baseUrl` in adapter options

### Headers Not Applied

- Check middleware matcher pattern
- Ensure middleware.ts is at root level
- Verify security is enabled in options

### Cache Not Working

- Enable caching in adapter options
- Check TTL configuration
- Use `invalidateCache()` for manual control

---

## Complete Example

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  siteName: "My Site",
  defaultLocale: "en-US",
  locales: ["en-US", "es", "fr"],
  enableCaching: true,
  enableSecurity: true,
  securityPreset: "balanced",
  enableGeoSeo: true,
  preconnectDomains: ["https://fonts.googleapis.com"],
});

// app/page.tsx
import { seo } from "@/lib/seo";

export const metadata = seo.generateMetadata({
  title: "Home",
  description: "Welcome",
  openGraph: { images: [{ url: "/og.jpg" }] },
});

export default function Page() {
  return <h1>Home</h1>;
}

// middleware.ts
import { NextResponse } from "next/server";
import { seo } from "@/lib/seo";

export function middleware() {
  const response = NextResponse.next();
  const headers = seo.generateMiddlewareHeaders();
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}
```

---

## Conclusion

M-SEO provides everything next-seo offers, plus:

- ✅ Built-in middleware (caching, security, geo-targeting)
- ✅ Automatic sitemap and robots.txt
- ✅ Production-ready security headers
- ✅ Advanced caching with invalidation
- ✅ Better TypeScript support
- ✅ Smaller bundle size
- ✅ Full App Router optimization

**Ready to upgrade?** `npm install m-seo`
