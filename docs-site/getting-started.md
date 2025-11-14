# Getting Started

Get up and running with **m-seo** in minutes.

## Installation

::: code-group

```bash [npm]
npm install m-seo
```

```bash [yarn]
yarn add m-seo
```

```bash [pnpm]
pnpm add m-seo
```

:::

## Requirements

- **Node.js** ≥ 16.0.0
- **TypeScript** (optional, but recommended)

## Quick Start

### 1. Import the Library

```typescript
// Core (framework-agnostic)
import { SeoEngine, createSEO } from "m-seo";

// React adapter
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

// Express adapter
import { ExpressAdapter } from "m-seo/adapters/ExpressAdapter";
```

### 2. Basic Usage

#### Simple API (Recommended for Most Cases)

```typescript
import { createSEO } from "m-seo";

const seo = createSEO({
  title: "My Awesome Website",
  description: "A comprehensive guide to web development",
  image: "https://example.com/og-image.jpg",
  url: "https://example.com",
  keywords: ["web", "development", "seo"],
});

// Get HTML meta tags
console.log(seo.html);
// Output: <title>My Awesome Website</title>
//         <meta name="description" content="A comprehensive guide...">
//         <meta property="og:title" content="My Awesome Website">
//         ...

// Get JSON-LD structured data
console.log(seo.jsonLd);
```

#### Advanced API (Full Control)

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "Custom Title",
  description: "Custom description",
  canonical: "https://example.com/page",
  ogImage: "https://example.com/og.png",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  author: "John Doe",
  siteName: "My Site",
  locale: "en_US",
  themeColor: "#3490dc",
});

// Generate meta tags as objects
const metaTags = seo.generateMetaTags();
// [{ name: 'description', content: '...' }, ...]

// Generate as HTML string
const htmlString = seo.toHtmlString();

// Update configuration
seo.updateConfig({ title: "New Title" });
```

## Framework-Specific Setup

### React (Hooks)

```jsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  // Set SEO tags
  useSeo({
    title: "Home - My React App",
    description: "Welcome to my awesome React application",
    canonical: "https://example.com",
    ogImage: "https://example.com/og.jpg",
  });

  // Add structured data
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My React App",
    url: "https://example.com",
  });

  return (
    <div>
      <h1>Welcome!</h1>
    </div>
  );
}
```

### React (Components)

```jsx
import { SeoHead, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function BlogPost({ post }) {
  return (
    <div>
      <SeoHead
        title={`${post.title} - Blog`}
        description={post.excerpt}
        ogImage={post.image}
      />

      <JsonLd
        data={{
          "@type": "BlogPosting",
          headline: post.title,
          datePublished: post.date,
          author: { "@type": "Person", name: post.author },
        }}
      />

      <article>
        <h1>{post.title}</h1>
        <p>{post.content}</p>
      </article>
    </div>
  );
}
```

### Next.js (App Router)

```tsx
// app/layout.tsx
import { Metadata } from "next";
import { createSEO } from "m-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = createSEO({
    title: "My Next.js App",
    description: "Welcome to my site",
  });

  return {
    title: seo.title,
    description: seo.description,
    openGraph: seo.openGraph,
  };
}
```

### Next.js (Pages Router)

```tsx
// pages/index.tsx
import Head from "next/head";
import { SeoEngine } from "m-seo";

export default function HomePage() {
  const seo = new SeoEngine({
    title: "Home",
    description: "Welcome",
  });

  return (
    <>
      <Head>
        <title>{seo.getConfig().title}</title>
        {seo.generateMetaTags().map((tag, i) => (
          <meta key={i} {...tag} />
        ))}
      </Head>
      <h1>Home</h1>
    </>
  );
}
```

### Express.js

```javascript
const express = require("express");
const { ExpressAdapter, SeoEngine } = require("m-seo");

const app = express();

// Use middleware (optional)
app.use(
  ExpressAdapter({
    defaults: {
      siteName: "My Express App",
      locale: "en_US",
    },
  })
);

// Route-specific SEO
app.get("/", (req, res) => {
  const seo = new SeoEngine({
    title: "Home",
    description: "Welcome to my Express app",
    canonical: "https://example.com",
  });

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${seo.toHtmlString()}
      </head>
      <body>
        <h1>Home</h1>
      </body>
    </html>
  `);
});

app.listen(3000);
```

### Vue 3 (Composition API)

```vue
<script setup>
import { onMounted } from "vue";
import { SeoEngine } from "m-seo";

onMounted(() => {
  const seo = new SeoEngine({
    title: "Vue 3 App",
    description: "Built with Vue 3 and m-seo",
  });

  document.title = seo.getConfig().title;

  // Inject meta tags
  const metaTags = seo.generateMetaTags();
  metaTags.forEach((tag) => {
    const meta = document.createElement("meta");
    Object.keys(tag).forEach((key) => {
      meta.setAttribute(key, tag[key]);
    });
    document.head.appendChild(meta);
  });
});
</script>

<template>
  <div>
    <h1>Vue 3 App</h1>
  </div>
</template>
```

### Vanilla JavaScript

```javascript
import { SeoEngine } from "m-seo";

// Initialize SEO
const seo = new SeoEngine({
  title: "My Static Site",
  description: "Built with vanilla JS",
  canonical: window.location.href,
});

// Set document title
document.title = seo.getConfig().title;

// Inject meta tags
const metaTags = seo.generateMetaTags();
metaTags.forEach((tag) => {
  const meta = document.createElement("meta");
  if (tag.name) meta.setAttribute("name", tag.name);
  if (tag.property) meta.setAttribute("property", tag.property);
  meta.setAttribute("content", tag.content);
  document.head.appendChild(meta);
});
```

## Configuration Options

### SeoEngine Options

```typescript
interface SeoConfig {
  title: string; // Page title
  description: string; // Meta description
  keywords?: string[]; // Meta keywords
  canonical?: string; // Canonical URL
  ogImage?: string; // Open Graph image
  ogType?: string; // og:type (default: 'website')
  twitterCard?: string; // Twitter card type
  author?: string; // Author name
  siteName?: string; // Site name
  locale?: string; // Language locale (e.g., 'en_US')
  themeColor?: string; // Theme color for mobile browsers
  robots?: string; // Robots meta tag
  viewport?: string; // Viewport meta tag
}
```

### Global Defaults

```typescript
import { SeoEngine } from "m-seo";

// Set global defaults
SeoEngine.setDefaults({
  siteName: "My Website",
  locale: "en_US",
  author: "John Doe",
  themeColor: "#3490dc",
});

// All instances will inherit these defaults
const seo = new SeoEngine({
  title: "Home",
  description: "Welcome",
  // siteName, locale, author, themeColor are inherited
});
```

## Next Steps

- **[Explore Examples](examples.md)** - See real-world usage patterns
- **[API Reference](api.md)** - Deep dive into all methods and options
- **[FAQ](faq.md)** - Common questions and troubleshooting

---

Need help? Check the [FAQ](faq.md) or [open an issue](https://github.com/Hailemariyam/m-seo/issues).
