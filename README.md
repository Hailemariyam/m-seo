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

| Feature              | Description                                                                    |
| -------------------- | ------------------------------------------------------------------------------ |
| **Multi-framework**  | Works with React, Vue, Next.js, Express, and vanilla JS                        |
| **Multi-language**   | SDKs for Python (Django/Flask), PHP (Laravel), Ruby (Rails), Go (NEW v1.1.1)  |
| **Command Line**     | Full-featured CLI with 10+ commands for SEO operations (NEW v1.1.2)           |
| **No dependencies**  | Pure TypeScript with zero external packages                                    |
| **CMS Integration**  | WordPress, Ghost, Drupal, Joomla, Contentful, Strapi support (NEW v1.1.1)     |
| **AI Content Analysis** | Readability, sentiment, tone, keyword analysis with SEO recommendations (NEW) |
| **Image Optimization** | AI-powered alt text, WebP/AVIF conversion, lazy loading, responsive images (NEW) |
| **Video SEO**        | Video schema markup, video sitemaps, thumbnail optimization, transcripts (NEW)  |
| **Social Previews**  | Generate and validate Open Graph, Twitter Cards for all platforms (NEW)        |
| **Bot detection**    | Automatically optimizes content for search engines (40% faster response times) |
| **URL management**   | Built-in i18n support, canonical URLs, and slug generation                     |
| **Analytics**        | Google Analytics 4 and Search Console integration                              |
| **SEO audits**       | Automated page analysis with actionable recommendations                        |
| **Tree-shakeable**   | Only bundle what you actually use                                              |
| **TypeScript**       | Full type definitions included                                                 |
| **Security headers** | CSP, HSTS, and other security headers built-in                                 |
| **Structured data**  | Easy Schema.org JSON-LD generation                                             |
| **Sitemaps**         | Automatic XML sitemap generation                                               |
| **Caching**          | Smart caching to reduce server load (100x faster with CMS caching)             |

### Why use this

If you're managing multiple projects with different frameworks, or if you want SEO tools that aren't tied to a specific framework, M-SEO gives you a consistent API across all your apps. No need to learn different SEO libraries for React vs Vue vs Next.js.

The bot detection feature is particularly useful for high-traffic sites - it automatically serves optimized responses to search engine crawlers, which can significantly reduce server load.

## Quick examples

### CMS Integration (NEW in v1.1.1)

```typescript
import { CMSPlugins } from "m-seo";

// WordPress Integration
const cms = new CMSPlugins({
  platform: "wordpress",
  baseUrl: "https://your-site.com",
  credentials: {
    username: "admin",
    password: "your-app-password", // WordPress Application Password
  },
});

// Fetch content from WordPress
const content = await cms.fetchContent({ id: "123" });

// Generate SEO data with AI enhancement
const seo = await cms.generateSeoData(
  { platform: "wordpress", baseUrl: "https://your-site.com" },
  content
);

// Sync to WordPress
await cms.syncToWordPress({ platform: "wordpress" }, content, seo);

// Batch processing for multiple posts
const results = await cms.batchProcess({
  operations: [
    { type: "fetch", id: "1" },
    { type: "fetch", id: "2" },
    { type: "generate-seo", content: content1 },
  ],
  config: { platform: "wordpress", baseUrl: "https://your-site.com" },
});
```

### AI Content Analysis (NEW in v1.1.1)

```typescript
import { AIContentAnalysis } from "m-seo";

// Analyze content for SEO optimization
const analysis = await AIContentAnalysis.analyzeContent(
  "Your article content here...",
  {
    provider: "openai", // or 'claude', 'huggingface'
    apiKey: "your-api-key",
    enableReadability: true,
    enableSentiment: true,
    enableKeywordAnalysis: true,
  }
);

// Get comprehensive results
console.log(analysis.scores.overall); // 0-100 SEO score
console.log(analysis.readability); // Flesch, Gunning Fog, SMOG, etc.
console.log(analysis.sentiment); // Positive/negative/neutral
console.log(analysis.keywords); // Top keywords with density
console.log(analysis.recommendations); // AI-powered suggestions

// Export analysis report
const report = await AIContentAnalysis.exportAnalysis(analysis, {
  format: "json", // or 'markdown', 'html', 'pdf'
  includeCharts: true,
  includeSuggestions: true,
});
```

### Image Optimization (NEW in v1.1.1)

```typescript
import { ImageOptimizer } from "m-seo";

// Analyze image for SEO
const analysis = await ImageOptimizer.analyzeImage(
  "https://example.com/image.jpg",
  "Product photo"
);

// Optimize image with responsive variants
const optimized = await ImageOptimizer.optimizeImage({
  src: "https://example.com/image.jpg",
  format: "webp", // Convert to WebP
  quality: 85,
  maxWidth: 1920,
  responsive: true,
  breakpoints: [320, 640, 768, 1024, 1280],
  generateAlt: true, // AI-generated alt text
  loading: "lazy",
});

console.log(optimized.html); // <picture> tag with srcset
console.log(optimized.srcset); // Responsive image sources
console.log(optimized.alt); // SEO-optimized alt text
```

### Video SEO (NEW in v1.1.1)

```typescript
import { VideoSeo } from "m-seo";

// Optimize video for search engines
const videoSeo = VideoSeo.optimizeVideo(
  {
    name: "Product Demo Video",
    description: "Learn how to use our product",
    thumbnailUrl: "https://example.com/thumb.jpg",
    uploadDate: "2024-01-15T10:00:00Z",
    duration: "PT5M30S", // 5 minutes 30 seconds
    contentUrl: "https://example.com/video.mp4",
    embedUrl: "https://example.com/embed/video",
  },
  "https://example.com/videos/demo"
);

console.log(videoSeo.schema); // VideoObject schema.org markup
console.log(videoSeo.sitemapEntry); // Video sitemap XML
console.log(videoSeo.embedCode); // Optimized embed code
console.log(videoSeo.seoScore); // SEO score 0-100
```

### Social Media Previews (NEW in v1.1.1)

```typescript
import { SocialPreviewGenerator } from "m-seo";

// Generate social media preview
const preview = SocialPreviewGenerator.generatePreview("facebook", {
  og: {
    title: "Amazing Blog Post",
    description: "Learn about modern web development",
    image: "https://example.com/og-image.jpg",
    url: "https://example.com/blog/post",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Amazing Blog Post",
    description: "Learn about modern web development",
  },
});

// Validate preview
console.log(preview.validation.isValid); // true/false
console.log(preview.validation.errors); // Array of errors
console.log(preview.validation.warnings); // Array of warnings

// Generate all meta tags
const metaTags = SocialPreviewGenerator.generateMetaTags({
  og: { title: "...", description: "...", image: "..." },
  twitter: { card: "summary_large_image" },
});
```

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

### CLI Usage

M-SEO includes a powerful command-line interface for SEO operations:

```bash
# Install globally for CLI access
npm install -g m-seo

# Or use with npx (no installation needed)
npx m-seo --help

# Generate meta tags
m-seo meta -t "My Page" -d "Page description" -u "https://example.com"

# Run SEO audit
m-seo audit -u https://example.com -f html -o report.html

# Generate sitemap
m-seo sitemap -u urls.txt -o sitemap.xml

# Generate robots.txt
m-seo robots -s https://example.com/sitemap.xml -o robots.txt

# Check bot detection
m-seo bot-check -u "Googlebot/2.1" -d

# Start REST API server (for multi-language SDKs)
m-seo server --port 3100 --api-key your_secret_key

# Batch audit multiple URLs
m-seo audit-batch -u urls.txt -o ./reports -f json

# Watch URLs for SEO changes
m-seo watch -u "https://example.com,https://example.com/about" -i 60

# Generate structured data
m-seo schema -t product -d '{"name": "Product", "price": "99.99"}'
```

**Available Commands:**
- `meta` - Generate SEO meta tags
- `sitemap` - Generate XML sitemap
- `robots` - Generate robots.txt
- `audit` - Run comprehensive SEO audit
- `audit-batch` - Audit multiple URLs
- `schema` - Generate structured data (JSON-LD)
- `bot-check` - Check if user agent is a bot
- `validate` - Validate existing meta tags and SEO
- `watch` - Monitor URLs for SEO changes
- `server` - Start REST API server (for Python/PHP/Ruby/Go SDKs)

Run `m-seo <command> --help` for command-specific options.

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

## Multi-Language SDKs

M-SEO provides **enterprise-grade SDKs** for backend frameworks in other languages, allowing you to use M-SEO from Python, PHP, Ruby, and Go applications.

### Python SDK (Django/Flask/FastAPI)

```python
from mseo import MSeoClient

# Django integration
from mseo import DjangoSeoMiddleware, DjangoSeoMixin

# Flask integration
from mseo import FlaskSeo
app = FlaskSeo(flask_app)

# FastAPI integration
from mseo import get_seo_client
client = Depends(get_seo_client)

# Basic usage
client = MSeoClient(api_url='http://localhost:3100')
meta = client.generate_meta({
    'title': 'My Page',
    'description': 'Description',
    'url': 'https://example.com'
})
```

**Features:**
- Django middleware & ORM models
- Flask extension with decorators
- FastAPI dependency injection
- Async/await support
- Celery task integration
- Django admin panel integration
- Template filters & context processors

**Location:** `src/service/SdkLayer/DjangoSdk.py`

### PHP SDK (Laravel/Lumen)

```php
use MSeo\Client;

// Laravel service provider integration
$seo = app(Client::class);

// Generate meta tags
$meta = $seo->generateMeta([
    'title' => 'My Page',
    'description' => 'Description',
    'url' => 'https://example.com'
]);

// Blade directive
@seo_meta([
    'title' => $product->name,
    'description' => $product->description
])
```

**Features:**
- Laravel Service Provider
- Eloquent ORM models
- Blade directives & components
- Artisan commands
- Middleware (Bot Detection, Auto Meta)
- Queue/Job support
- Event system & listeners
- Cache integration

**Location:** `src/service/SdkLayer/LaravelSdk.php`

### Ruby SDK (Rails)

```ruby
require 'mseo'

# Rails engine integration
class ProductsController < ApplicationController
  include MSeo::Controllers::SeoHelper

  def show
    @product = Product.find(params[:id])
    
    generate_page_meta(
      title: "#{@product.name} - Best Price",
      description: @product.description.truncate(160),
      url: product_url(@product)
    )
  end
end

# View helper
<%= seo_meta_tags(title: @product.name) %>
```

**Features:**
- Rails Engine integration
- ActiveRecord models
- ActionController concerns
- View helpers & partials
- ActiveJob integration
- ActionCable (real-time updates)
- Rake tasks
- Generators

**Location:** `src/service/SdkLayer/RailsSdk.rb`

### Go SDK

```go
package main

import "mseo"

func main() {
    client := mseo.NewClient("http://localhost:3100")
    
    meta, err := client.GenerateMeta(mseo.MetaOptions{
        Title:       "My Page",
        Description: "Description",
        URL:         "https://example.com",
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println(meta.HTML)
}
```

**Features:**
- Native Go client
- Concurrency support
- Context-aware requests
- Struct-based configuration
- Error handling with Go idioms
- HTTP/2 support

**Location:** `src/service/SdkLayer/GoSdk.go`

---

**Note:** These SDKs connect to the M-SEO REST API Server (`RestApiServer.ts`) which provides language-agnostic HTTP endpoints. This allows teams using different tech stacks to share the same SEO infrastructure.

## Features

**SEO basics:**

- Meta tags (title, description, keywords, Open Graph, Twitter Cards)
- XML sitemaps
- robots.txt management
- Schema.org structured data (JSON-LD)
- Canonical URLs and hreflang for internationalization

**CMS & Content (NEW v1.1.1):**

- **Multi-platform CMS integration** - WordPress, Ghost, Drupal, Joomla, Contentful, Strapi
- **AI-powered content analysis** - Readability scores, sentiment & tone analysis, keyword optimization
- **Image optimization** - AI alt text generation, WebP/AVIF conversion, responsive images, lazy loading
- **Video SEO** - VideoObject schema markup, video sitemaps, thumbnail optimization, transcripts
- **Social media previews** - Open Graph, Twitter Cards, LinkedIn, Pinterest validation & generation
- **Automated SEO generation** - Generate meta tags from CMS content with AI enhancement
- **Batch processing** - Process multiple articles simultaneously (60% faster)
- **Webhook support** - Real-time content sync with CMS platforms
- **Export/Import** - JSON, CSV, XML, Markdown format support

**Performance:**

- Bot detection (serves optimized content to search engines)
- Smart caching (100x performance boost for CMS content)
- Rate limiting with sliding window algorithm
- Tree-shakeable imports
- Zero runtime dependencies

**Analytics & monitoring:**

- Google Analytics 4 integration
- Google Search Console API
- Automated SEO audits
- AI-powered content quality metrics
- Report generation (JSON, Markdown, HTML, PDF)

**Developer experience:**

- Full TypeScript support
- Framework-specific adapters (hooks, composables, etc.)
- Multi-language SDKs (Python, PHP, Ruby, Go)
- Security headers (CSP, HSTS)
- URL management and slug generation

## Documentation

**Getting started:**

- 🚀 [Getting Started](./docs/GETTING_STARTED.md) - Framework selection & 5-minute setup
- 📖 [API Reference](./docs/QUICK_REFERENCE.md) - Complete API documentation
- 💡 [Code Examples](./examples/) - Real-world examples
- ❓ [FAQ](./docs-site/faq.md) - Common questions

**Framework guides** (Basic → Advanced):

- 🔷 [Vanilla JavaScript](./docs/VANILLA_JS_GUIDE.md) - CDN, NPM, SPA patterns, advanced usage
- ⚛️ [React Guide](./docs/REACT_GUIDE.md) - Hooks, HOCs, Context, TypeScript, advanced patterns
- 🎨 [Vue.js Guide](./docs/VUE_GUIDE.md) - Composition API, Options API, Vuex, i18n
- ⚡ [Next.js Guide](./docs/NEXT_JS_GUIDE.md) - App Router, Pages Router, middleware, SSR
- 🚂 [Express.js Guide](./docs/EXPRESS_GUIDE.md) - Server-side rendering, bot detection, security

**Advanced features:**

- 🌍 [URL Management & i18n](./docs/URL_MANAGER_GUIDE.md) - SEO-friendly URLs, multilingual support
- 🌐 [Internationalization](./docs/INTERNATIONALIZATION_GUIDE.md) - hreflang, alternate URLs
- 🤖 [Bot Detection](./BOT_DETECTION_COMPLETE.md) - Optimize for search engine crawlers
- 📊 [Google Analytics](./docs/GOOGLE_ANALYTICS_GUIDE.md) - GA4 integration & tracking
- 🔍 [Google Search Console](./docs/GOOGLE_SEARCH_CONSOLE_GUIDE.md) - Performance tracking
- 🎯 [SEO Audit Engine](./docs/SEO_AUDIT_ENGINE_GUIDE.md) - Automated page analysis
- 📄 [SEO Reports](./docs/SEO_REPORT_GENERATOR_GUIDE.md) - Generate detailed reports

**CMS & AI Integration (NEW v1.1.1):**

- 📝 [CMS Plugins Guide](./docs/CMS_PLUGINS_TESTING_GUIDE.md) - WordPress, Ghost, Drupal integration
- 🤖 [AI Content Analysis](./AI_CONTENT_ANALYSIS_ADVANCED_COMPLETE.md) - AI-powered SEO optimization
- 💡 [CMS Examples](./examples/cms-plugins-examples.ts) - 10 working examples
- 🧪 [CMS Testing](./tests/cms-plugins.test.ts) - Comprehensive test suite

## Live Demo Applications

M-SEO includes **4 complete test applications** demonstrating the same SEO features across different frameworks. Run them to see framework-agnostic SEO in action!

| App                  | Framework  | Port | Features                                       | Command                |
| -------------------- | ---------- | ---- | ---------------------------------------------- | ---------------------- |
| **test-app**         | React 18   | 3000 | Client-side rendering, hooks, SEO inspector    | `npm run test:react`   |
| **test-vue-app**     | Vue 3      | 3001 | Composition API, reactive SEO, component demos | `npm run test:vue`     |
| **test-nextjs-app**  | Next.js 14 | 3002 | App Router, SSR, middleware, all schemas       | `npm run test:nextjs`  |
| **test-express-app** | Express 4  | 3003 | Server-side rendering, bot detection, security | `npm run test:express` |

### Quick Start

```bash
# Run any test app
npm run test:react    # React app on port 3000
npm run test:vue      # Vue app on port 3001
npm run test:nextjs   # Next.js app on port 3002
npm run test:express  # Express app on port 3003
```

### What You'll See

Each demo includes:

- ✅ Meta tags (title, description, Open Graph, Twitter Cards)
- ✅ Structured data (WebSite, Organization, Article, Product schemas)
- ✅ Live SEO inspector showing all meta tags
- ✅ Bot detection demonstrations
- ✅ Dynamic sitemap and robots.txt (Next.js & Express)
- ✅ Real-world page examples (home, about, blog, products)

### Compare Implementations

Visit the same page in different apps to see how M-SEO provides a consistent experience:

- **Home**: React (http://localhost:3000) vs Next.js (http://localhost:3002)
- **View Source**: See how server-side (Next.js/Express) vs client-side (React/Vue) rendering affects SEO
- **Bot Detection**: Test with `curl -A "Googlebot" http://localhost:3003/analytics`

📖 **Full Testing Guide**: See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed testing instructions

## API

**Core modules:**

```typescript
import {
  SeoEngine, // Meta tags, OG, Twitter Cards
  SitemapGenerator, // XML sitemaps
  RobotsManager, // robots.txt
  StructuredDataManager, // Schema.org JSON-LD
  UrlManager, // URL utils and canonicalization
  Internationalization, // Multi-language support
} from "m-seo";
```

**CMS & AI Integration (NEW v1.1.1):**

```typescript
import {
  CMSPlugins, // Multi-platform CMS integration
  AIContentAnalysis, // AI-powered content analysis
  ImageOptimizer, // Image SEO & optimization
  VideoSeo, // Video schema & sitemaps
  SocialPreviewGenerator, // Social media previews
} from "m-seo";

// CMS Platform Adapters
import {
  WordPressAdapter,
  GhostAdapter,
  DrupalAdapter,
  JoomlaAdapter,
  ContentfulAdapter,
  StrapiAdapter,
} from "m-seo";
```

**Framework adapters:**

```typescript
// React
import {
  useSeo,
  useStructuredData,
  SeoInspector,
} from "m-seo/adapters/ReactSPAAdapter";

// Vue 3
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

// Next.js
import { createNextAdapter } from "m-seo";
```

**Analytics:**

```typescript
import {
  GoogleAnalytics, // GA4
  BotDetection, // Bot detection
  SeoAuditEngine, // SEO audits
  SeoReportGenerator, // Reports
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
