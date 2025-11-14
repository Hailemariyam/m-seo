# FAQ

Frequently asked questions about **m-seo**.

## General Questions

### What is m-seo?

**m-seo** (Multiversal SEO) is a framework-agnostic SEO utility library that helps you manage SEO tags, structured data, sitemaps, and robots.txt across any JavaScript framework or environment.

### Why should I use m-seo?

- ✅ **Universal** - Works with any framework (React, Vue, Next.js, Express, etc.)
- ✅ **No vendor lock-in** - Switch frameworks without rewriting SEO code
- ✅ **TypeScript** - Full type safety and autocomplete
- ✅ **Zero heavy dependencies** - Lightweight and tree-shakable
- ✅ **Production-ready** - Battle-tested and optimized
- ✅ **Simple & Advanced APIs** - Use what you need, when you need it

### What frameworks are supported?

m-seo works with:

- **SSR Frameworks:** Next.js, Nuxt.js, SvelteKit
- **CSR Frameworks:** React, Vue, Svelte, Angular
- **Server Frameworks:** Express, Fastify, Koa, NestJS
- **Static:** Pure HTML/JavaScript
- **Runtime:** Node.js, Deno, Bun, browsers, edge runtimes

### Is m-seo production-ready?

**Yes!** m-seo is production-ready and includes:

- ✅ Complete TypeScript definitions
- ✅ Comprehensive test coverage
- ✅ Optimized bundle size (22.6 KB)
- ✅ Zero breaking changes policy
- ✅ Active maintenance

See [PRODUCTION-READY.md](https://github.com/Hailemariyam/m-seo/blob/main/PRODUCTION-READY.md) for details.

---

## Installation & Setup

### How do I install m-seo?

```bash
npm install m-seo
# or
yarn add m-seo
# or
pnpm add m-seo
```

### What are the system requirements?

- **Node.js** ≥ 16.0.0
- **TypeScript** ≥ 4.5 (optional, but recommended)

### Do I need to install peer dependencies?

No! m-seo has **zero runtime dependencies** for the core library. Framework adapters use only the framework's own APIs.

---

## Usage Questions

### How do I set SEO tags in React?

Use the `useSeo` hook:

```jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home",
    description: "Welcome to my site",
    canonical: "https://example.com",
  });

  return <h1>Home</h1>;
}
```

### How do I generate a sitemap?

Use the `SitemapGenerator` class:

```javascript
const { SitemapGenerator } = require("m-seo");

const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
});

sitemap.addUrl({ loc: "/", changefreq: "daily", priority: 1.0 });
sitemap.addUrl({ loc: "/about", changefreq: "monthly", priority: 0.8 });

console.log(sitemap.toXml());
```

### How do I manage robots.txt?

Use the `RobotsManager` class:

```javascript
const { RobotsManager } = require("m-seo");

const robots = new RobotsManager();
robots.allowAll();
robots.setSitemap("https://example.com/sitemap.xml");

console.log(robots.toString());
```

### How do I add structured data (JSON-LD)?

**React:**

```jsx
import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

useStructuredData({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "My Company",
  url: "https://example.com",
});
```

**Core API:**

```javascript
const { StructuredDataManager } = require("m-seo");

const sd = new StructuredDataManager();
sd.addOrganization({
  name: "My Company",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
});

console.log(sd.toHtmlScript());
```

### How do I add breadcrumbs?

**React:**

```jsx
import { useBreadcrumbs } from "m-seo/adapters/ReactSPAAdapter";

useBreadcrumbs([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
  { name: "Product Name", url: "/products/123" },
]);
```

**Core API:**

```javascript
const { StructuredDataManager } = require("m-seo");

const sd = new StructuredDataManager();
sd.addBreadcrumb([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
]);
```

### How do I set global defaults?

```javascript
import { SeoEngine } from "m-seo";

SeoEngine.setDefaults({
  siteName: "My Website",
  locale: "en_US",
  author: "John Doe",
  themeColor: "#3490dc",
});

// All new instances inherit these defaults
const seo = new SeoEngine({
  title: "Home",
  description: "Welcome",
});
```

---

## Framework-Specific Questions

### Can I use m-seo with Next.js?

**Yes!** For Next.js App Router:

```tsx
import { Metadata } from "next";
import { createSEO } from "m-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = createSEO({
    title: "My Next.js App",
    description: "Welcome",
  });

  return {
    title: seo.title,
    description: seo.description,
    openGraph: seo.openGraph,
  };
}
```

For Pages Router, see [Examples](examples.md#nextjs-examples).

### Can I use m-seo with Express?

**Yes!** Use the `ExpressAdapter` or core API:

```javascript
const express = require("express");
const { SeoEngine } = require("m-seo");

const app = express();

app.get("/", (req, res) => {
  const seo = new SeoEngine({
    title: "Home",
    description: "Welcome",
  });

  res.send(`
    <html>
      <head>${seo.toHtmlString()}</head>
      <body><h1>Home</h1></body>
    </html>
  `);
});
```

See [Examples](examples.md#express-examples) for more.

### Does m-seo work with Vue?

**Yes!** Use the core API in Vue components:

```vue
<script setup>
import { onMounted } from "vue";
import { SeoEngine } from "m-seo";

onMounted(() => {
  const seo = new SeoEngine({
    title: "Home",
    description: "Welcome",
  });

  document.title = seo.getConfig().title;
});
</script>
```

See [Examples](examples.md#vue-examples) for more.

### Does m-seo work with Nuxt?

**Yes!** Use the core API with Nuxt's `useHead`:

```vue
<script setup>
import { useHead } from "#app";
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "Home",
  description: "Welcome",
});

useHead({
  title: seo.getConfig().title,
  meta: seo.generateMetaTags(),
});
</script>
```

---

## Advanced Questions

### How do I handle multi-language sites?

Add alternate language URLs to your sitemap:

```javascript
sitemap.addUrl({
  loc: "/en/blog/post-1",
  alternates: [
    { hreflang: "en", href: "https://example.com/en/blog/post-1" },
    { hreflang: "es", href: "https://example.com/es/blog/post-1" },
    { hreflang: "fr", href: "https://example.com/fr/blog/post-1" },
  ],
});
```

And set the locale in your SEO config:

```javascript
const seo = new SeoEngine({
  title: "Accueil",
  description: "Bienvenue",
  locale: "fr_FR",
});
```

### Can I customize the output format?

**Yes!** m-seo provides multiple output formats:

```javascript
const seo = new SeoEngine({ ... });

// HTML string
const html = seo.toHtmlString();

// Meta tag objects
const metaTags = seo.generateMetaTags();

// Link tag objects
const linkTags = seo.generateLinkTags();

// Raw config
const config = seo.getConfig();
```

### How do I add custom meta tags?

Extend the generated tags:

```javascript
const seo = new SeoEngine({ ... });
const metaTags = seo.generateMetaTags();

// Add custom tags
metaTags.push({
  name: 'custom-tag',
  content: 'custom value'
});

// Inject to DOM
metaTags.forEach(tag => {
  const meta = document.createElement('meta');
  Object.keys(tag).forEach(key => {
    meta.setAttribute(key, tag[key]);
  });
  document.head.appendChild(meta);
});
```

### How do I handle dynamic sitemaps?

Generate sitemaps dynamically from your database:

```javascript
app.get("/sitemap.xml", async (req, res) => {
  const sitemap = new SitemapGenerator({
    hostname: "https://example.com",
  });

  // Add static pages
  sitemap.addUrl({ loc: "/", priority: 1.0 });

  // Add dynamic pages from database
  const posts = await Post.findAll();
  posts.forEach((post) => {
    sitemap.addUrl({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt,
      priority: 0.7,
    });
  });

  res.type("application/xml").send(sitemap.toXml());
});
```

See [Examples](examples.md#advanced-examples) for more.

---

## Troubleshooting

### SEO tags are not appearing in the DOM

**React:**
Make sure you're using the hooks inside a component that's rendered:

```jsx
function HomePage() {
  useSeo({ title: "Home" }); // ✅ Inside component
  return <h1>Home</h1>;
}

// Not this:
useSeo({ title: "Home" }); // ❌ Outside component
```

**General:**
Check that meta tags are being injected into `<head>`, not `<body>`.

### Sitemap is empty

Make sure you're adding URLs before calling `toXml()`:

```javascript
const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
sitemap.addUrl({ loc: "/" }); // ✅ Add URLs first
console.log(sitemap.toXml()); // Then generate XML
```

### TypeScript errors with adapters

Make sure you're importing from the correct path:

```typescript
// ✅ Correct
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

// ❌ Wrong
import { useSeo } from "m-seo";
```

### Meta tags are duplicated

**React:**
Make sure you're not calling `useSeo` multiple times with the same tags. The hook automatically cleans up on unmount.

**General:**
Check if you have other SEO libraries or manual meta tags conflicting with m-seo.

---

## Performance & Optimization

### What's the bundle size?

- **Full package:** 22.6 KB (gzipped)
- **Core only:** ~10 KB
- **React adapter:** ~5 KB

All modules are **tree-shakable** - you only bundle what you use.

### Does m-seo impact performance?

**No!** m-seo:

- Has zero runtime dependencies
- Uses lightweight DOM APIs
- Is fully tree-shakable
- Has minimal overhead

### Can I use m-seo in edge runtimes?

**Yes!** m-seo works in:

- Vercel Edge Functions
- Cloudflare Workers
- Deno Deploy
- AWS Lambda@Edge
- Any JavaScript runtime

---

## Contributing & Support

### Where can I report bugs?

Open an issue on [GitHub](https://github.com/Hailemariyam/m-seo/issues).

### Can I contribute?

**Yes!** Contributions are welcome. See [CONTRIBUTING.md](https://github.com/Hailemariyam/m-seo/blob/main/CONTRIBUTING.md) for guidelines.

### Where can I get help?

- **Documentation:** [Getting Started](getting-started.md) | [API Reference](api.md) | [Examples](examples.md)
- **GitHub Issues:** [Report a bug or request a feature](https://github.com/Hailemariyam/m-seo/issues)
- **Discussions:** [GitHub Discussions](https://github.com/Hailemariyam/m-seo/discussions)

---

## Next Steps

- **[Getting Started](getting-started.md)** - Installation and basic usage
- **[API Reference](api.md)** - Complete API documentation
- **[Examples](examples.md)** - Real-world examples for every framework
