# M-SEO

**Framework-Agnostic SEO Library for Modern Web Applications**

A powerful, zero-dependency SEO toolkit that works **everywhere** - React, Vue, Angular, Express, Next.js, vanilla JavaScript, and more.

## 🚀 Features

- ✅ **100% Framework-Agnostic** - Use with any framework or no framework
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
import { useEffect } from "react";
import { SeoEngine } from "m-seo";

function SeoHead({ title, description }) {
  useEffect(() => {
    const seo = new SeoEngine({
      title,
      description,
      canonical: window.location.href,
    });

    document.title = title;

    // Update meta tags
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

export function MyPage() {
  return (
    <>
      <SeoHead title="My Page" description="Page description" />
      <h1>Content</h1>
    </>
  );
}
```

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

While the core is framework-agnostic, you can create thin adapters for your preferred framework.

See `/examples` directory for:

- ✅ Vanilla JS
- ✅ Express.js
- ✅ React
- 📝 Next.js (coming soon)
- 📝 Vue (coming soon)
- 📝 Angular (coming soon)

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
