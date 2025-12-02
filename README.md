<div align="center">

# M-SEO

### **Multiversal SEO - Framework-Agnostic SEO Toolkit**

**Professional-grade SEO infrastructure for modern web applications**

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

> **One library. Every framework. Zero compromises.**
> Enterprise-grade SEO automation with analytics, bot detection, and internationalization—no framework lock-in.

<table>
<tr>
<td align="center" width="25%">
<a href="#-installation">
<img src="https://img.shields.io/badge/📦_Install-3490dc?style=for-the-badge" alt="Install" />
</a>
</td>
<td align="center" width="25%">
<a href="https://hailemariyam.github.io/m-seo/">
<img src="https://img.shields.io/badge/📚_Documentation-38c172?style=for-the-badge" alt="Docs" />
</a>
</td>
<td align="center" width="25%">
<a href="#-live-examples">
<img src="https://img.shields.io/badge/🧪_Examples-ffb400?style=for-the-badge" alt="Examples" />
</a>
</td>
<td align="center" width="25%">
<a href="#-contributing">
<img src="https://img.shields.io/badge/🤝_Contribute-6f42c1?style=for-the-badge" alt="Contributing" />
</a>
</td>
</tr>
</table>

---

</div>

## Why Choose M-SEO?

M-SEO provides enterprise-grade SEO infrastructure that works across any JavaScript framework. Designed for teams managing multiple projects or applications requiring consistent SEO implementation.

### Feature Matrix

| Feature                            | Status |
| ---------------------------------- | :----: |
| **Multi-Framework Support**        | ✅ React, Vue, Next.js, Express, Vanilla JS |
| **Zero Dependencies**              | ✅ Pure TypeScript, no external packages |
| **Intelligent Bot Detection**      | ✅ Built-in with 40% performance improvement |
| **URL Management & i18n**          | ✅ Full internationalization support |
| **Analytics Integration**          | ✅ GA4 and Google Search Console |
| **SEO Audit Engine**               | ✅ Automated analysis and reporting |
| **Tree Shakeable Architecture**    | ✅ Import only what you need |
| **Full TypeScript Support**        | ✅ Complete type definitions |
| **Enterprise-Ready Features**      | ✅ Security, caching, middleware |
| **Structured Data Management**     | ✅ Schema.org JSON-LD support |
| **Sitemap & Robots Generation**    | ✅ Automated XML sitemaps |
| **Security Headers**               | ✅ CSP, HSTS, and more |

### Key Advantages

- **Framework Agnostic**: Single unified API across React, Vue, Next.js, and Node.js
- **Zero Dependencies**: No bloat, pure TypeScript implementation with no external packages
- **Performance Optimized**: Bot detection and intelligent caching reduce server load by up to 40%
- **Enterprise Ready**: Built-in analytics, automated auditing, and comprehensive internationalization
- **Developer Experience**: Full TypeScript support, extensive documentation, and real-world examples

## Quick Start Examples

### React Implementation

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

### Vue 3 Implementation

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

### Next.js App Router

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

### Enterprise Next.js (Level 3)

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

## 📦 Installation

```bash
npm install m-seo
# or
yarn add m-seo
# or
pnpm add m-seo
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Your Application                         │
│            (React • Vue • Next.js • Express • ...)          │
├─────────────────────────────────────────────────────────────┤
│                    M-SEO Adapters                           │
│   React Hooks • Vue Composables • Next.js • Express        │
├─────────────────────────────────────────────────────────────┤
│                    M-SEO Core                               │
│   • SeoEngine • SitemapGenerator • RobotsManager           │
│   • StructuredDataManager • UrlManager • I18n              │
│   • Analytics • Bot Detection • SEO Audit                  │
├─────────────────────────────────────────────────────────────┤
│                    Runtime Environment                      │
│        Node.js • Deno • Bun • Browser • Edge                │
└─────────────────────────────────────────────────────────────┘
```

**Framework-agnostic core** with **specialized adapters** for optimal DX.

## Framework Support

M-SEO provides first-class support for modern JavaScript frameworks with specialized adapters optimized for each ecosystem.

### Production Ready

| Framework      | Status    | Adapter Features                                                 |
| -------------- | --------- | ---------------------------------------------------------------- |
| **React**      | ✅ Stable | Hooks (`useSeo`, `useStructuredData`), Components, Bot Detection |
| **Vue 3**      | ✅ Stable | Composables, Reactive System, Auto-cleanup                       |
| **Next.js**    | ✅ Stable | App Router, Pages Router, Middleware, Enterprise Integration     |
| **Express**    | ✅ Stable | Middleware, SSR Support, Security Headers                        |
| **Vanilla JS** | ✅ Stable | Framework-independent, Universal compatibility                   |

### Roadmap

Additional framework support planned for future releases:

- **Nuxt 3** - Full-stack Vue framework integration
- **SvelteKit** - Svelte ecosystem support
- **Astro** - Static site generation optimization
- **Angular** - Enterprise Angular integration

Community contributions welcome for framework adapter development.

## Core Features

### Performance & Developer Experience

- **🤖 Intelligent Bot Detection** - Optimize content delivery for search engines with 40% performance improvement
- **📦 Tree-Shakeable Architecture** - Import only what you need, minimize bundle size
- **🔄 Reactive Updates** - Real-time SEO changes with Vue 3 reactivity system
- **🚀 Zero Runtime Dependencies** - Lightweight core with no external dependencies
- **📱 Universal Compatibility** - Works in Node.js, Deno, Bun, browsers, and edge runtimes

### SEO Fundamentals

- **📄 Complete Meta Tag Management** - Open Graph, Twitter Cards, canonical URLs, and more
- **🗺️ Sitemap Generation** - Automated XML sitemap creation with customizable priorities
- **🤖 robots.txt Management** - Programmatic robot rules configuration
- **📊 Structured Data** - Schema.org JSON-LD implementation for rich snippets
- **🌐 Internationalization** - Multi-language SEO with hreflang support

### Enterprise Capabilities

- **📊 Google Analytics 4** - First-party GA4 integration with event tracking
- **🔍 Search Console Integration** - Programmatic access to Google Search Console data
- **🔧 SEO Audit Engine** - Automated page analysis and optimization recommendations
- **🛡️ Security Headers** - Built-in security header management (CSP, HSTS, etc.)
- **💾 Intelligent Caching** - Reduce server load with configurable caching strategies

## Documentation

### Getting Started

- [**Quick Start Guide**](./docs-site/getting-started.md) - Install and configure M-SEO in 5 minutes
- [**API Reference**](./docs-site/api.md) - Complete API documentation with TypeScript signatures
- [**Code Examples**](./docs-site/examples.md) - Real-world implementation examples
- [**FAQ**](./docs-site/faq.md) - Common questions and troubleshooting

### Framework Integration Guides

- [**React Guide**](./docs/REACT_GUIDE.md) - Hooks, components, and React best practices
- [**Vue Guide**](./docs/VUE_GUIDE.md) - Composables, reactivity, and Vue 3 patterns
- [**Next.js Guide**](./docs/NEXTJS_USAGE_COMPLETE.md) - App Router, Pages Router, and enterprise features
- [**Express Guide**](./examples/express-adapter.ts) - Server-side rendering and middleware integration

### Feature Documentation

- [**URL Management**](./docs/URL_MANAGER_GUIDE.md) - SEO-friendly URL generation and canonicalization
- [**Internationalization**](./docs/INTERNATIONALIZATION_GUIDE.md) - Multi-language SEO implementation
- [**Bot Detection**](./BOT_DETECTION_COMPLETE.md) - Search engine optimization and bot handling
- [**Google Analytics**](./docs/GOOGLE_ANALYTICS_GUIDE.md) - GA4 integration and event tracking
- [**SEO Audit Engine**](./docs/SEO_AUDIT_ENGINE_GUIDE.md) - Automated SEO analysis and reporting

## Live Demo Applications

### React Demo

```bash
npm run test:react
# Navigate to http://localhost:3000
```

**Included Features:**

- SEO inspector panel with real-time meta tag preview
- Structured data implementation (Organization, BreadcrumbList, Article)
- Google Analytics integration example
- Dynamic meta tag updates

### Vue 3 Demo

```bash
cd test-vue-app
npm install
npm run dev
# Navigate to http://localhost:3001
```

**Included Features:**

- Reactive SEO updates with Vue composables
- Schema.org implementations (Article, Product, FAQ)
- Component-based SEO management
- Breadcrumb navigation with structured data

## API Overview

### Core Modules

```typescript
import {
  SeoEngine, // Meta tags, Open Graph, Twitter Cards
  SitemapGenerator, // XML sitemap generation
  RobotsManager, // robots.txt management
  StructuredDataManager, // Schema.org JSON-LD
  UrlManager, // URL normalization and canonicalization
  Internationalization, // Multi-language SEO support
} from "m-seo";
```

### Framework Adapters

```typescript
// React - Hooks and components
import {
  useSeo,
  useStructuredData,
  SeoInspector,
} from "m-seo/adapters/ReactSPAAdapter";

// Vue 3 - Composables and components
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

// Next.js - Unified adapter with enterprise features
import { createNextAdapter } from "m-seo";
```

### Analytics & Monitoring

```typescript
import {
  GoogleAnalytics, // GA4 integration
  BotDetection, // Search engine bot detection
  SeoAuditEngine, // Automated SEO analysis
  SeoReportGenerator, // Comprehensive SEO reports
} from "m-seo";
```

## Contributing

We welcome contributions from the community. M-SEO maintains strict framework-agnostic principles to ensure broad compatibility.

### Development Setup

```bash
# Clone the repository
git clone https://github.com/Hailemariyam/m-seo.git
cd m-seo

# Install dependencies
npm install

# Build the library
npm run build

# Run tests
npm test

# Development mode with watch
npm run dev
```

### Contribution Guidelines

1. **Maintain Framework Agnosticism** - Core modules must not depend on framework-specific APIs
2. **TypeScript First** - All contributions must include proper TypeScript types
3. **Documentation** - Update relevant documentation for new features
4. **Testing** - Include tests for new functionality
5. **Code Style** - Follow existing patterns and use provided ESLint configuration

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

---

## License

**MIT License** - See [LICENSE](./LICENSE) for details.

Copyright © 2025 Hailemariyam Kebede

---

<div align="center">

### Support M-SEO Development

If M-SEO has helped improve your project's SEO, consider supporting its continued development.

<a href="https://buymeacoffee.com/hailemariyam">
  <img src="https://img.shields.io/badge/Buy%20Me%20a%20Coffee-Support-yellow?style=for-the-badge&logo=buy-me-a-coffee" alt="Buy Me a Coffee" />
</a>

---

**Built for developers who refuse framework lock-in**

[⬆️ Back to Top](#m-seo)

</div>
