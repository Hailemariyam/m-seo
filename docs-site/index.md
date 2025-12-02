---
layout: home

hero:
  name: m-seo
  text: Multiversal SEO Utility
  tagline: Framework-agnostic SEO for every web app. Now with CMS integration, AI analysis & multi-language SDKs. Works with Next.js, React, Vue, WordPress, Django, Laravel, Rails, and more.
  actions:
    - theme: brand
      text: Get Started
      link: /getting-started
    - theme: alt
      text: View Examples
      link: /examples
    - theme: alt
      text: API Reference
      link: /api

features:
  - icon: 🚀
    title: Universal SEO Tags
    details: Generate title, meta description, keywords, Open Graph, Twitter cards, canonical, robots, and schema.org JSON-LD.

  - icon: 🌍
    title: Multi-Language SDKs (NEW v1.1.1)
    details: Enterprise SDKs for Python (Django/Flask/FastAPI), PHP (Laravel), Ruby (Rails), and Go. Connect any backend.

  - icon: 📝
    title: CMS Integration (NEW v1.1.1)
    details: Connect to WordPress, Ghost, Drupal, Joomla, Contentful, Strapi. Automated SEO generation from CMS content.

  - icon: 🤖
    title: AI Content Analysis (NEW v1.1.1)
    details: Readability scores, sentiment analysis, keyword optimization, and AI-powered SEO recommendations.

  - icon: 🖼️
    title: Image & Video SEO (NEW v1.1.1)
    details: AI alt text generation, WebP/AVIF conversion, video schema markup, responsive images, lazy loading.

  - icon: 📱
    title: Social Media Optimization (NEW v1.1.1)
    details: Generate and validate Open Graph, Twitter Cards, LinkedIn previews for perfect social sharing.

  - icon: 🎯
    title: Simple & Advanced API
    details: Use createSEO({ title, description, image }) for quick setups, or customize every tag with advanced options.

  - icon: 🧩
    title: Framework Support
    details: SSR (Next.js, Nuxt), CSR (React, Vue, Svelte), Node/Express, Static HTML - all supported out of the box.

  - icon: 📦
    title: Multiple Output Formats
    details: Raw <meta> tags as strings, framework objects, global defaults - choose what works for you.

  - icon: 🔧
    title: Zero Heavy Dependencies
    details: Clean, modular TypeScript code. Tree-shakable. ESM + CommonJS. Production-ready.

  - icon: ⚡
    title: Performance First
    details: Lightweight core, optimized bundles, 100x faster caching. Perfect for modern web performance.
---

## 🚀 Quick Start

### Installation

```bash
npm install m-seo
```

### Basic Usage

```typescript
import { createSEO } from "m-seo";

const seo = createSEO({
  title: "My Awesome App",
  description: "Welcome to my site",
  image: "https://example.com/og.png",
  url: "https://example.com",
});

// Output as HTML string
console.log(seo.html);

// Output as JSON-LD
console.log(seo.jsonLd);
```

### NEW: CMS Integration (v1.1.1)

```typescript
import { CMSPlugins } from "m-seo";

// Connect to WordPress
const cms = new CMSPlugins({
  platform: "wordpress",
  baseUrl: "https://your-site.com",
  credentials: { username: "admin", password: "app-password" },
});

// Fetch content and generate SEO
const content = await cms.fetchContent({ id: "123" });
const seo = await cms.generateSeoData(config, content);
```

### NEW: AI Content Analysis (v1.1.1)

```typescript
import { AIContentAnalysis } from "m-seo";

// Analyze content for SEO optimization
const analysis = await AIContentAnalysis.analyzeContent(articleText, {
  provider: "openai",
  enableReadability: true,
  enableSentiment: true,
  enableKeywordAnalysis: true,
});

// Get SEO score, readability, keywords, and recommendations
console.log(analysis.scores.overall); // 0-100
console.log(analysis.recommendations); // AI-powered suggestions
```

### Framework-Specific Examples

<div class="framework-grid">

**React**

```jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home",
    description: "Welcome",
  });
  return <h1>Home</h1>;
}
```

**Express**

```js
const { ExpressAdapter } = require("m-seo/adapters/ExpressAdapter");

app.use(
  ExpressAdapter({
    defaults: { siteName: "My Site" },
  })
);
```

**Next.js**

```jsx
import { createSEO } from 'm-seo';

export async function getServerSideProps() {
  const seo = createSEO({ ... });
  return { props: { seo } };
}
```

**Static HTML**

```js
const { SeoEngine } = require('m-seo');
const seo = new SeoEngine({ ... });
document.head.innerHTML += seo.toHtmlString();
```

</div>

## 📚 Documentation

- **[Getting Started](getting-started.md)** - Installation, basic usage, quick examples
- **[API Reference](api.md)** - Complete API documentation for all methods
- **[Examples](examples.md)** - Real-world examples for every framework
- **[FAQ](faq.md)** - Common questions and troubleshooting
- **[Project Structure](project-structure.md)** - Architecture and code organization

## 💡 Why m-seo?

<div class="why-grid">

✅ **One Package, All Frameworks**
Stop installing different SEO packages for each project. m-seo works everywhere.

✅ **Clean, Modular TypeScript**
Fully typed, tree-shakable, modern code. Great DX.

✅ **Production-Ready**
Battle-tested, optimized, and ready for real-world apps.

✅ **No Vendor Lock-In**
Framework-agnostic core means you're never locked to one ecosystem.

</div>

## 🏁 Next Steps

1. **[Install and configure](getting-started.md)** m-seo in your project
2. **[Explore examples](examples.md)** for your framework
3. **[Read the API docs](api.md)** to unlock advanced features
4. **[Check the FAQ](faq.md)** for common questions

---

<div class="footer-cta">

**Ready to boost your SEO?**
[Get Started →](getting-started.md)

</div>
