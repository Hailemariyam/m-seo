# M-SEO

**Framework-Agnostic SEO Library for Modern Web Applications**

A powerful, zero-dependency SEO toolkit that works **everywhere** - React, Vue, Angular, Express, Next.js, vanilla JavaScript, and more.

## 🚀 Features

- ✅ **100% Framework-Agnostic** - Use with any framework or no framework
- ✅ **React Hooks & Components** - `useSeo`, `useStructuredData`, `<SeoHead>`, `<JsonLd>`
- ✅ **TypeScript** - Full type safety
- ✅ **Zero Dependencies** - Lightweight core
- ✅ **Universal** - Works in Node.js, Deno, Bun, browsers, edge runtimes
- ✅ **Comprehensive** - Meta tags, sitemaps, robots.txt, structured data
- ✅ **Modern** - ES modules, tree-shakeable

## 📦 Installation

```bash
npm install m-seo
# or
yarn add m-seo
# or
pnpm add m-seo
```

## 🎯 Quick Start

### React (🔥 Recommended for SPAs)

```tsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  // Add SEO meta tags with a simple hook
  useSeo({
    title: "Home - My React App",
    description: "Welcome to my awesome React application",
    keywords: ["react", "seo", "web"],
    canonical: "https://example.com",
    ogImage: "https://example.com/og-image.jpg",
    themeColor: "#3490dc",
  });

  // Add structured data for search engines
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My App",
    url: "https://example.com",
  });

  return (
    <div>
      <h1>Welcome!</h1>
    </div>
  );
}
```

📖 **[Complete React Guide](./docs/REACT_GUIDE.md)** - Full hooks, components, examples & best practices

### 🧪 Test React Features Live

Want to see it in action? Run the interactive test app:

```bash
npm run test:react
# Open http://localhost:3000
```

The test app includes:

- 🏠 Basic SEO example
- 📝 Blog with structured data
- 🛍️ E-commerce product schema
- 🔗 Breadcrumbs navigation
- 🔍 Live SEO inspector showing all tags in real-time

**[Testing Guide](./TESTING.md)** | **[Quick Reference](./QUICK_REFERENCE.txt)**

### Vanilla JavaScript (Framework-Agnostic)

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "My Awesome Website",
  description: "A great description",
  keywords: ["seo", "awesome"],
  canonical: "https://example.com",
  ogImage: "https://example.com/og.jpg",
});

// Get as HTML string (for SSR, static sites)
const htmlTags = seo.toHtmlString();

// Or get as objects (for React, Vue, etc.)
const metaTags = seo.generateMetaTags();
```

### Express.js

```typescript
import express from "express";
import { SeoEngine, SitemapGenerator, RobotsManager } from "m-seo";

const app = express();

// Sitemap
const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
sitemap.addUrl({ loc: "/", changefreq: "daily", priority: 1.0 });

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml").send(sitemap.toXml());
});

// Robots.txt
const robots = new RobotsManager();
robots.allowAll().setSitemap("https://example.com/sitemap.xml");

app.get("/robots.txt", (req, res) => {
  res.type("text/plain").send(robots.toString());
});

// SEO middleware
app.get("/", (req, res) => {
  const seo = new SeoEngine({
    title: "Home",
    description: "Welcome",
    canonical: "https://example.com",
  });

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>${seo.toHtmlString()}</head>
      <body><h1>Home</h1></body>
    </html>
  `);
});
```

### React / Next.js

```tsx
// Option 1: Using React Hooks (Recommended)
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function BlogPost({ post }) {
  useSeo({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    ogImage: post.image,
    canonical: `https://example.com/blog/${post.slug}`,
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
  });

  return (
    <article>
      <h1>{post.title}</h1>
    </article>
  );
}

// Option 2: Using Components
import { SeoHead, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function ProductPage({ product }) {
  return (
    <div>
      <SeoHead
        title={product.name}
        description={product.description}
        ogImage={product.image}
      />

      <JsonLd
        data={{
          "@type": "Product",
          name: product.name,
          offers: { "@type": "Offer", price: product.price },
        }}
      />

      <h1>{product.name}</h1>
    </div>
  );
}

// Option 3: Using Core (Framework-Agnostic)
import { useEffect } from "react";
import { SeoEngine } from "m-seo";

function SeoHead({ title, description }) {
  useEffect(() => {
    const seo = new SeoEngine({ title, description });
    document.title = title;

    const metaTags = seo.generateMetaTags();
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.name) meta.setAttribute("name", tag.name);
      if (tag.property) meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  }, [title, description]);

  return null;
}
```

📖 **See [React Guide](./docs/REACT_GUIDE.md) for complete documentation**

## 📖 API Documentation

### SeoEngine

Generate meta tags, Open Graph, Twitter cards.

```typescript
const seo = new SeoEngine({
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  themeColor?: string;
  robots?: string;
});

// Methods
seo.generateMetaTags() // Returns array of meta tag objects
seo.generateLinkTags() // Returns array of link tag objects
seo.toHtmlString()     // Returns HTML string
seo.updateConfig({})   // Update configuration
seo.getConfig()        // Get current config
```

### SitemapGenerator

Generate XML sitemaps.

```typescript
const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
  defaultChangefreq: "weekly",
  defaultPriority: 0.5,
});

sitemap.addUrl({
  loc: "/about",
  lastmod: new Date(),
  changefreq: "monthly",
  priority: 0.8,
  alternates: [
    { hreflang: "en", href: "https://example.com/en/about" },
    { hreflang: "es", href: "https://example.com/es/about" },
  ],
});

sitemap.toXml(); // Returns XML string
sitemap.toJson(); // Returns JSON array
sitemap.clear(); // Remove all URLs
```

### RobotsManager

Generate robots.txt content.

```typescript
const robots = new RobotsManager();

robots.addRule({
  userAgent: "Googlebot",
  allow: ["/"],
  disallow: ["/admin"],
  crawlDelay: 10,
});

robots.allowAll(); // Allow all bots
robots.disallowAll(); // Block all bots
robots.setSitemap("https://..."); // Add sitemap
robots.setHost("https://example.com"); // Set host
robots.toString(); // Returns robots.txt string
```

### StructuredDataManager

Manage Schema.org JSON-LD structured data.

```typescript
const sd = new StructuredDataManager();

sd.addWebsite({
  name: "My Site",
  url: "https://example.com",
  description: "A great site",
});

sd.addOrganization({
  name: "My Company",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
});

sd.addArticle({
  headline: "Article Title",
  datePublished: "2025-01-01",
  author: { name: "John Doe" },
});

sd.addBreadcrumb([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
]);

sd.toHtmlScript(); // Returns <script type="application/ld+json">
sd.toJson(); // Returns array of schemas
sd.clear(); // Remove all schemas
```

## 🎨 Framework Adapters

While the core is framework-agnostic, we provide official adapters for popular frameworks.

### Official Adapters

- ✅ **React** - Hooks (`useSeo`, `useStructuredData`, `useBreadcrumbs`) and Components (`<SeoHead>`, `<JsonLd>`)
- ✅ **Express** - Middleware and helpers
- ✅ **Vanilla JS** - Direct usage, works everywhere

### Examples in `/examples` Directory

- ✅ [React Usage](./examples/react-usage.tsx) - Complete React examples with hooks
- ✅ [Express Adapter](./examples/express-adapter.ts) - Server-side SEO
- ✅ [Vanilla JS](./examples/vanilla-usage.ts) - Framework-agnostic usage

### Coming Soon

- 📝 Next.js (App Router & Pages Router)
- 📝 Vue 3 Composition API
- 📝 Angular
- 📝 Nuxt
- 📝 SvelteKit

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│   Your Application                  │
│  (React, Vue, Express, etc.)        │
└──────────────┬──────────────────────┘
               │
               │ Import & Use
               ▼
┌─────────────────────────────────────┐
│   M-SEO Core (Framework-Agnostic)   │
│   • Pure TypeScript                 │
│   • No framework dependencies       │
│   • Works everywhere                │
└─────────────────────────────────────┘
```

## 🤝 Contributing

Contributions welcome! This library aims to stay framework-agnostic, so:

- ✅ Core modules should have **zero dependencies**
- ✅ Should work in **any JavaScript environment**
- ✅ Framework-specific code goes in `/adapters` or `/examples`

## 📄 License

MIT

## 🔗 Links

- [GitHub](https://github.com/yourusername/m-seo)
- [NPM](https://npmjs.com/package/m-seo)
- [Documentation](https://github.com/yourusername/m-seo/wiki)

---

**Made with ❤️ for developers who want SEO without framework lock-in**
