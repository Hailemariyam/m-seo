<div align="center">

# M-SEO

**Framework-agnostic SEO toolkit for modern web applications**

<p>
  <a href="https://npmjs.com/package/m-seo">
    <img src="https://img.shields.io/npm/v/m-seo.svg?style=for-the-badge&color=3490dc" alt="npm version" />
  </a>
  <a href="https://npmjs.com/package/m-seo">
    <img src="https://img.shields.io/npm/dm/m-seo.svg?style=for-the-badge&color=38c172" alt="npm downloads" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="MIT License" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white&style=for-the-badge" alt="TypeScript" />
  </a>
  <a href="https://npmjs.com/package/m-seo">
    <img src="https://img.shields.io/badge/dependencies-0-green.svg?style=for-the-badge" alt="Zero Dependencies" />
  </a>
  <a href="https://npmjs.com/package/m-seo">
    <img src="https://img.shields.io/badge/tree--shakeable-✅-blue.svg?style=for-the-badge" alt="Tree Shakeable" />
  </a>
</p>

A TypeScript SEO library that works with React, Vue, Next.js, Express, and vanilla JavaScript. Built for teams who need consistent SEO across different projects without framework lock-in.

<table>
<tr>
<td align="center" width="25%">
<a href="#installation">
<img src="https://img.shields.io/badge/📦_Install-3490dc?style=for-the-badge" alt="Install" />
</a>
</td>
<td align="center" width="25%">
<a href="https://hailemariyam.github.io/m-seo/">
<img src="https://img.shields.io/badge/📚_Documentation-38c172?style=for-the-badge" alt="Docs" />
</a>
</td>
<td align="center" width="25%">
<a href="#live-demo-applications">
<img src="https://img.shields.io/badge/🧪_Examples-ffb400?style=for-the-badge" alt="Examples" />
</a>
</td>
<td align="center" width="25%">
<a href="#contributing">
<img src="https://img.shields.io/badge/🤝_Contribute-6f42c1?style=for-the-badge" alt="Contributing" />
</a>
</td>
</tr>
</table>

---

</div>

## What's included

M-SEO handles the SEO boilerplate so you can focus on building features. Here's what you get:

| Feature | Description |
| ------- | ----------- |
| **Multi-framework** | Works with React, Vue, Next.js, Express, and vanilla JS |
| **No dependencies** | Pure TypeScript with zero external packages |
| **Bot detection** | Automatically optimizes content for search engines (40% faster response times) |
| **URL management** | Built-in i18n support, canonical URLs, and slug generation |
| **Analytics** | Google Analytics 4 and Search Console integration |
| **SEO audits** | Automated page analysis with actionable recommendations |
| **Tree-shakeable** | Only bundle what you actually use |
| **TypeScript** | Full type definitions included |
| **Security headers** | CSP, HSTS, and other security headers built-in |
| **Structured data** | Easy Schema.org JSON-LD generation |
| **Sitemaps** | Automatic XML sitemap generation |
| **Caching** | Smart caching to reduce server load |

### Why use this

If you're managing multiple projects with different frameworks, or if you want SEO tools that aren't tied to a specific framework, M-SEO gives you a consistent API across all your apps. No need to learn different SEO libraries for React vs Vue vs Next.js.

The bot detection feature is particularly useful for high-traffic sites - it automatically serves optimized responses to search engine crawlers, which can significantly reduce server load.

## Quick examples

### React

```tsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home - My React App",
    description: "Welcome to my awesome React application",
    keywords: ["react", "seo", "web"],
    canonical: "https://example.com",
    ogImage: "https://example.com/og-image.jpg",
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My App",
  });

  return <h1>Welcome!</h1>;
}
```

### Vue 3

```vue
<template>
  <div>
    <h1>{{ article.title }}</h1>
  </div>
</template>

<script setup>
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const article = {
  title: "Getting Started with Vue 3",
  content: "Learn Vue 3 best practices...",
};

useSeo({
  title: `${article.title} - Blog`,
  description: article.content,
  canonical: "https://example.com/blog/vue-seo",
});

useStructuredData({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
});
</script>
```

### Next.js

```tsx
import { createNextAdapter } from "m-seo";

const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My App",
  enableSecurity: true,
  enableGeoSeo: true,
});

export const metadata = seo.generateMetadata({
  title: "Home Page",
  description: "Welcome to my site",
  openGraph: { title: "Home", type: "website" },
});

export default function HomePage() {
  return <h1>Hello World</h1>;
}
```

### With analytics and auditing

```tsx
import {
  createNextAdapter,
  SeoEngine,
  GoogleAnalytics,
  BotDetection,
} from "m-seo";

const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Enterprise App",
  enableCaching: true,
  enableSecurity: true,
  seoEngine: new SeoEngine({ siteName: "My Enterprise App" }),
  googleAnalytics: new GoogleAnalytics({ measurementId: "G-XXXXXXXXXX" }),
  botDetection: new BotDetection(),
});

export default async function AnalyticsPage() {
  const isBot = seo.detectBot("Mozilla/5.0 (compatible; Googlebot/2.1)");
  const audit = await seo.runSeoAudit("https://example.com");

  return (
    <div>
      <h1>SEO Analytics</h1>
      <pre>{JSON.stringify(audit, null, 2)}</pre>
    </div>
  );
}
```

### Vanilla JavaScript

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "My Website",
  description: "A great description",
  canonical: "https://example.com",
});

document.head.innerHTML += seo.toHtmlString();
```

---

## Installation

```bash
npm install m-seo
# or
yarn add m-seo
# or
pnpm add m-seo
```

---

## How it works

```
Your App (React, Vue, Next.js, Express, etc.)
    ↓
M-SEO Adapters (framework-specific hooks/helpers)
    ↓
M-SEO Core (framework-agnostic SEO engine)
    ↓
Output (meta tags, sitemaps, analytics, etc.)
```

The library has a framework-agnostic core that handles all the SEO logic, with thin adapter layers for each framework. This means you get the same SEO capabilities whether you're using React hooks, Vue composables, or Next.js metadata.

## Supported frameworks

Currently stable:

- **React** - Hooks (`useSeo`, `useStructuredData`), components, bot detection
- **Vue 3** - Composables with reactive updates and auto-cleanup
- **Next.js** - App Router, Pages Router, middleware support
- **Express** - Middleware for SSR and security headers
- **Vanilla JS** - Works anywhere JavaScript runs

Coming soon (contributions welcome):

- Nuxt 3
- SvelteKit
- Astro
- Angular

## Features

**SEO basics:**
- Meta tags (title, description, keywords, Open Graph, Twitter Cards)
- XML sitemaps
- robots.txt management
- Schema.org structured data (JSON-LD)
- Canonical URLs and hreflang for internationalization

**Performance:**
- Bot detection (serves optimized content to search engines)
- Smart caching
- Tree-shakeable imports
- Zero runtime dependencies

**Analytics & monitoring:**
- Google Analytics 4 integration
- Google Search Console API
- Automated SEO audits
- Report generation

**Developer experience:**
- Full TypeScript support
- Framework-specific adapters (hooks, composables, etc.)
- Security headers (CSP, HSTS)
- URL management and slug generation

## Documentation

**Getting started:**
- [Quick Start Guide](./docs-site/getting-started.md) - Get up and running in 5 minutes
- [API Reference](./docs-site/api.md) - Full API documentation
- [Code Examples](./docs-site/examples.md) - Real-world examples
- [FAQ](./docs-site/faq.md) - Common questions

**Framework guides:**
- [React Guide](./docs/REACT_GUIDE.md) - React hooks and components
- [Vue Guide](./docs/VUE_GUIDE.md) - Vue 3 composables
- [Next.js Guide](./docs/NEXTJS_USAGE_COMPLETE.md) - Next.js integration
- [Express Guide](./examples/express-adapter.ts) - Express middleware

**Features:**
- [URL Management](./docs/URL_MANAGER_GUIDE.md) - SEO-friendly URLs
- [Internationalization](./docs/INTERNATIONALIZATION_GUIDE.md) - Multi-language support
- [Bot Detection](./BOT_DETECTION_COMPLETE.md) - Bot optimization
- [Google Analytics](./docs/GOOGLE_ANALYTICS_GUIDE.md) - GA4 integration
- [SEO Audit Engine](./docs/SEO_AUDIT_ENGINE_GUIDE.md) - Automated audits

## Demo apps

**React demo:**
```bash
npm run test:react
# Open http://localhost:3000
```
Includes SEO inspector, structured data examples, and analytics integration.

**Vue 3 demo:**
```bash
cd test-vue-app
npm install
npm run dev
# Open http://localhost:3001
```
Shows reactive SEO updates, Schema.org implementations, and component patterns.

## API

**Core modules:**
```typescript
import {
  SeoEngine,              // Meta tags, OG, Twitter Cards
  SitemapGenerator,       // XML sitemaps
  RobotsManager,          // robots.txt
  StructuredDataManager,  // Schema.org JSON-LD
  UrlManager,             // URL utils and canonicalization
  Internationalization    // Multi-language support
} from "m-seo";
```

**Framework adapters:**
```typescript
// React
import { useSeo, useStructuredData, SeoInspector } from "m-seo/adapters/ReactSPAAdapter";

// Vue 3
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

// Next.js
import { createNextAdapter } from "m-seo";
```

**Analytics:**
```typescript
import {
  GoogleAnalytics,      // GA4
  BotDetection,         // Bot detection
  SeoAuditEngine,       // SEO audits
  SeoReportGenerator    // Reports
} from "m-seo";
```

## Contributing

Contributions are welcome. The main rule is that core modules must stay framework-agnostic.

```bash
git clone https://github.com/Hailemariyam/m-seo.git
cd m-seo
npm install
npm run build
npm test
npm run dev  # watch mode
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

MIT - see [LICENSE](./LICENSE)

---

<div align="center">

If this library helps your project, consider [buying me a coffee](https://buymeacoffee.com/hailemariyam) ☕

[⬆️ Back to top](#m-seo)

</div>
