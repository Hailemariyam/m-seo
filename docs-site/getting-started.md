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

// Vue adapter
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

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

### Vue 3 (Composables)

```vue
<template>
  <div>
    <h1>{{ article.title }}</h1>
    <p>{{ article.content }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const article = reactive({
  title: "Getting Started with Vue SEO",
  content: "Learn how to implement SEO in Vue applications",
  author: "John Doe",
  publishedDate: "2024-01-15",
});

// Set SEO tags
useSeo({
  title: `${article.title} - Blog`,
  description: article.content,
  canonical: "https://example.com/blog",
});

// Add structured data
useStructuredData({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  author: {
    "@type": "Person",
    name: article.author,
  },
  datePublished: article.publishedDate,
});
</script>
```

### Vue 3 (Components)

```vue
<template>
  <div>
    <SeoHead
      :title="`${post.title} - Blog`"
      :description="post.excerpt"
      :ogImage="post.image"
    />

    <JsonLd :data="articleSchema" />

    <article>
      <h1>{{ post.title }}</h1>
      <p>{{ post.content }}</p>
    </article>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { SeoHead, JsonLd } from "m-seo/adapters/VueSPAAdapter";

const post = reactive({
  title: "Blog Post Title",
  excerpt: "Post excerpt",
  content: "Post content",
  image: "https://example.com/image.jpg",
  author: "John Doe",
  date: "2024-01-15",
});

const articleSchema = {
  "@type": "BlogPosting",
  headline: post.title,
  datePublished: post.date,
  author: { "@type": "Person", name: post.author },
};
</script>
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

## CMS Integration (NEW v1.1.1)

M-SEO now includes powerful CMS integration for WordPress, Ghost, Drupal, Joomla, Contentful, and Strapi.

### WordPress Integration

```typescript
import { CMSPlugins } from "m-seo";

// Initialize WordPress connection
const cms = new CMSPlugins({
  platform: "wordpress",
  baseUrl: "https://your-wordpress-site.com",
  credentials: {
    username: "admin",
    password: "your-app-password", // WordPress Application Password
  },
});

// Fetch content from WordPress
const content = await cms.fetchContent({ id: "123" });

// Generate SEO data from content
const seo = await cms.generateSeoData(
  { platform: "wordpress", baseUrl: "https://your-site.com" },
  content
);

// Sync SEO data back to WordPress
await cms.syncToWordPress(
  { platform: "wordpress", baseUrl: "https://your-site.com" },
  content,
  seo
);
```

### Batch Processing

```typescript
// Process multiple posts simultaneously
const results = await cms.batchProcess({
  operations: [
    { type: "fetch", id: "1" },
    { type: "fetch", id: "2" },
    { type: "generate-seo", content: content1 },
    { type: "sync", content: content2, seo: seo2 },
  ],
  config: { platform: "wordpress", baseUrl: "https://your-site.com" },
});

console.log(`Processed ${results.length} operations`);
```

### Export/Import

```typescript
// Export content to various formats
const exported = await cms.exportContent(
  [content1, content2],
  { format: "json" } // or 'csv', 'xml', 'markdown'
);

// Import from external sources
const imported = await cms.importContent(
  externalData,
  "json",
  { platform: "wordpress" }
);
```

## AI Content Analysis (NEW v1.1.1)

Analyze content for SEO optimization with AI-powered recommendations.

### Basic Analysis

```typescript
import { AIContentAnalysis } from "m-seo";

// Analyze article content
const analysis = await AIContentAnalysis.analyzeContent(
  "Your article text here...",
  {
    provider: "openai", // or 'claude', 'huggingface'
    apiKey: "your-api-key",
    enableReadability: true,
    enableSentiment: true,
    enableKeywordAnalysis: true,
  }
);

// Get results
console.log("SEO Score:", analysis.scores.overall); // 0-100
console.log("Readability:", analysis.readability);
console.log("Sentiment:", analysis.sentiment.type); // positive/negative/neutral
console.log("Top Keywords:", analysis.keywords.slice(0, 5));
console.log("Recommendations:", analysis.recommendations);
```

### Readability Scores

```typescript
// Access multiple readability formulas
const { readability } = analysis;

console.log("Flesch Reading Ease:", readability.fleschReadingEase); // 0-100
console.log("Gunning Fog Index:", readability.gunningFog); // Grade level
console.log("SMOG Index:", readability.smog);
console.log("Coleman-Liau:", readability.colemanLiau);
console.log("ARI:", readability.automatedReadability);
console.log("Dale-Chall:", readability.daleChall);
```

### Keyword Analysis

```typescript
// Get keyword insights
const { keywords } = analysis;

keywords.forEach((kw) => {
  console.log(`${kw.word}: ${kw.frequency} times (${kw.density}%)`);
  console.log(`Relevance: ${kw.relevance}/100`);
});
```

### Export Reports

```typescript
// Export analysis as report
const report = await AIContentAnalysis.exportAnalysis(analysis, {
  format: "markdown", // or 'json', 'html', 'pdf'
  includeCharts: true,
  includeSuggestions: true,
  includeHistory: true,
});

// Save to file
fs.writeFileSync("seo-report.md", report);
```

### Batch Analysis

```typescript
// Analyze multiple articles
const batchResults = await AIContentAnalysis.batchAnalyze({
  requests: [
    { content: "Article 1...", config: { enableReadability: true } },
    { content: "Article 2...", config: { enableSentiment: true } },
  ],
  globalConfig: { provider: "openai", apiKey: "your-key" },
});

console.log(`Analyzed ${batchResults.length} articles`);
```

## Image Optimization (NEW v1.1.1)

Optimize images for better SEO and performance with AI-powered features.

### Analyze Image

```typescript
import { ImageOptimizer } from "m-seo";

// Analyze existing image
const analysis = await ImageOptimizer.analyzeImage(
  "https://example.com/image.jpg",
  "Product photo"
);

console.log("Alt Quality:", analysis.altQuality); // 0-100
console.log("Is Optimized:", analysis.isOptimized);
console.log("Potential Savings:", analysis.potentialSavings);
console.log("Recommendations:", analysis.recommendations);
```

### Optimize Image

```typescript
// Optimize with responsive variants
const optimized = await ImageOptimizer.optimizeImage({
  src: "https://example.com/image.jpg",
  format: "webp", // or 'avif', 'jpeg', 'png', 'auto'
  quality: 85,
  maxWidth: 1920,
  maxHeight: 1080,
  responsive: true,
  breakpoints: [320, 640, 768, 1024, 1280, 1536],
  sizes: "(max-width: 768px) 100vw, 50vw",
  loading: "lazy",
  generateAlt: true, // AI-generated alt text
  keywords: ["product", "demo", "feature"],
});

// Use optimized image
console.log(optimized.html); // Complete <picture> tag
console.log(optimized.srcset); // Responsive srcset
console.log(optimized.alt); // SEO-optimized alt text
```

## Video SEO (NEW v1.1.1)

Optimize video content for search engines with schema markup and sitemaps.

### Basic Video Optimization

```typescript
import { VideoSeo } from "m-seo";

const videoSeo = VideoSeo.optimizeVideo(
  {
    name: "Product Demo Video",
    description: "Learn how to use our amazing product",
    thumbnailUrl: "https://example.com/thumb.jpg",
    uploadDate: "2024-01-15T10:00:00Z",
    duration: "PT5M30S", // ISO 8601: 5 minutes 30 seconds
    contentUrl: "https://example.com/video.mp4",
    embedUrl: "https://example.com/embed/video",
    transcript: "Full video transcript here...",
    tags: ["tutorial", "demo", "product"],
    category: "Education",
    viewCount: 1500,
  },
  "https://example.com/videos/demo"
);

// Add schema to page
console.log(videoSeo.schemaJson); // JSON-LD script tag

// Add to video sitemap
console.log(videoSeo.sitemapEntry); // XML sitemap entry

// Use embed code
console.log(videoSeo.embedCode); // Optimized iframe

// Check SEO score
console.log("Video SEO Score:", videoSeo.seoScore); // 0-100
```

### Video Sitemap Generation

```typescript
// Generate complete video sitemap
const sitemap = VideoSeo.generateVideoSitemap([
  {
    name: "Video 1",
    description: "First video",
    thumbnailUrl: "https://example.com/thumb1.jpg",
    uploadDate: "2024-01-01",
    duration: "PT3M",
  },
  {
    name: "Video 2",
    description: "Second video",
    thumbnailUrl: "https://example.com/thumb2.jpg",
    uploadDate: "2024-01-02",
    duration: "PT5M",
  },
]);

fs.writeFileSync("video-sitemap.xml", sitemap);
```

## Social Media Previews (NEW v1.1.1)

Generate and validate social media preview cards for all platforms.

### Generate Preview

```typescript
import { SocialPreviewGenerator } from "m-seo";

// Generate Facebook preview
const facebookPreview = SocialPreviewGenerator.generatePreview("facebook", {
  og: {
    title: "Amazing Blog Post",
    description: "Learn about modern web development best practices",
    image: "https://example.com/og-image.jpg",
    url: "https://example.com/blog/post",
    type: "article",
    siteName: "My Blog",
    locale: "en_US",
  },
});

console.log("Title:", facebookPreview.title);
console.log("Is Valid:", facebookPreview.validation.isValid);
console.log("Errors:", facebookPreview.validation.errors);
console.log("Warnings:", facebookPreview.validation.warnings);
```

### Validate Social Tags

```typescript
// Validate Twitter Card
const twitterPreview = SocialPreviewGenerator.generatePreview("twitter", {
  twitter: {
    card: "summary_large_image",
    title: "Amazing Blog Post",
    description: "Learn about modern web development",
    image: "https://example.com/twitter-card.jpg",
    site: "@mysite",
    creator: "@author",
  },
});

// Check validation
if (!twitterPreview.validation.isValid) {
  console.error("Validation errors:", twitterPreview.validation.errors);
  console.warn("Warnings:", twitterPreview.validation.warnings);
}
```

### Generate All Meta Tags

```typescript
// Generate complete meta tags for all platforms
const metaTags = SocialPreviewGenerator.generateMetaTags({
  og: {
    title: "My Page",
    description: "Page description",
    image: "https://example.com/og.jpg",
    url: "https://example.com",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mysite",
  },
});

// Add to HTML <head>
document.head.innerHTML += metaTags;
```

## Multi-Language SDKs

M-SEO provides enterprise-grade SDKs for popular backend frameworks. These SDKs connect to the REST API Server (`RestApiServer.ts`) for language-agnostic SEO management.

### Python SDK (Django/Flask/FastAPI)

```python
# Install
pip install m-seo  # (when published to PyPI)

# Django Integration
from mseo import DjangoSeoMiddleware, get_seo_client
from mseo.models import SeoMetadata

# settings.py
MIDDLEWARE = [
    'mseo.middleware.DjangoSeoMiddleware',
    # ...
]

# views.py
from mseo import get_seo_client

def blog_post(request, slug):
    client = get_seo_client()
    post = Post.objects.get(slug=slug)
    
    seo = client.create_seo({
        'title': post.title,
        'description': post.excerpt,
        'image': post.featured_image,
        'url': request.build_absolute_uri()
    })
    
    return render(request, 'blog/post.html', {
        'post': post,
        'seo_tags': seo.html
    })

# Flask Integration
from flask import Flask
from mseo import FlaskSeo

app = Flask(__name__)
seo = FlaskSeo(app)

@app.route('/product/<id>')
def product(id):
    product = get_product(id)
    return seo.render('product.html', 
        title=product.name,
        description=product.description,
        image=product.image
    )

# FastAPI Integration
from fastapi import FastAPI, Depends
from mseo import get_seo_client

app = FastAPI()

@app.get("/api/seo/{page}")
async def get_seo(page: str, seo = Depends(get_seo_client)):
    tags = seo.create_seo({
        'title': f'{page.title()} Page',
        'description': f'Description for {page}'
    })
    return {"html": tags.html, "json_ld": tags.json_ld}
```

**Features:**
- Django middleware & ORM models
- Flask extension with template integration
- FastAPI dependency injection
- Async/await support
- Celery integration for background SEO tasks
- Django admin panel for SEO management
- Template filters and tags

**Location:** `src/service/SdkLayer/DjangoSdk.py`

### PHP SDK (Laravel/Lumen)

```php
<?php
// Install
composer require m-seo/sdk  // (when published to Packagist)

// Laravel Service Provider auto-discovery
use MSeo\Client;
use MSeo\Facades\Seo;

// routes/web.php
Route::get('/blog/{slug}', function ($slug) {
    $post = Post::where('slug', $slug)->first();
    
    $seo = Seo::create([
        'title' => $post->title,
        'description' => $post->excerpt,
        'image' => $post->featured_image,
        'url' => url()->current()
    ]);
    
    return view('blog.post', compact('post', 'seo'));
});

// Blade Template (resources/views/blog/post.blade.php)
<!DOCTYPE html>
<html>
<head>
    @seo($seo->html)
</head>
<body>
    <h1>{{ $post->title }}</h1>
</body>
</html>

// Advanced: Artisan Command
php artisan seo:generate --cms=wordpress --batch=100
```

**Features:**
- Laravel Service Provider
- Eloquent models for SEO data
- Blade directives (`@seo`, `@jsonLd`)
- Artisan commands
- Middleware for automatic SEO injection
- Queue integration
- Broadcasting events
- Cache integration

**Location:** `src/service/SdkLayer/LaravelSdk.php`

### Ruby SDK (Rails)

```ruby
# Gemfile
gem 'm-seo'  # (when published to RubyGems)

# app/controllers/posts_controller.rb
class PostsController < ApplicationController
  include MSeo::SeoHelper
  
  def show
    @post = Post.find(params[:id])
    
    @seo = mseo_client.create_seo(
      title: @post.title,
      description: @post.excerpt,
      image: @post.featured_image_url,
      url: post_url(@post)
    )
  end
end

# app/views/layouts/application.html.erb
<!DOCTYPE html>
<html>
<head>
  <%= raw @seo&.html %>
  <%= stylesheet_link_tag 'application' %>
</head>
<body>
  <%= yield %>
</body>
</html>

# Background Job
class SeoGeneratorJob < ApplicationJob
  queue_as :default
  
  def perform(post_id)
    post = Post.find(post_id)
    seo = MSeo::Client.new.create_seo(
      title: post.title,
      description: post.excerpt
    )
    post.update(seo_metadata: seo.to_json)
  end
end
```

**Features:**
- Rails Engine integration
- ActiveRecord models and concerns
- ActionController helpers
- View helpers and partials
- ActiveJob integration
- ActionCable support for live SEO updates
- Rake tasks
- Generators for scaffolding

**Location:** `src/service/SdkLayer/RailsSdk.rb`

### Go SDK

```go
package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/yourusername/m-seo-go"  // (when published)
)

func main() {
    // Create client
    client, err := mseo.NewClient(mseo.Config{
        APIEndpoint: "http://localhost:3000",
        Timeout:     30,
    })
    if err != nil {
        log.Fatal(err)
    }
    
    // Create SEO tags
    ctx := context.Background()
    seo, err := client.CreateSEO(ctx, mseo.SEORequest{
        Title:       "My Go Application",
        Description: "Built with Go and M-SEO",
        Image:       "https://example.com/image.jpg",
        URL:         "https://example.com",
        Keywords:    []string{"go", "seo", "performance"},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println("HTML Tags:", seo.HTML)
    fmt.Println("JSON-LD:", seo.JSONLD)
    
    // Generate sitemap
    sitemap, err := client.GenerateSitemap(ctx, []mseo.SitemapURL{
        {Loc: "https://example.com", Priority: 1.0},
        {Loc: "https://example.com/about", Priority: 0.8},
    })
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Println("Sitemap:", sitemap.XML)
}
```

**Features:**
- Native Go client (no Node.js required)
- Concurrency support with goroutines
- Context-aware requests
- Struct-based configuration
- Native Go error handling
- HTTP/2 support

**Location:** `src/service/SdkLayer/GoSdk.go`

### SDK Connection Architecture

All SDKs connect to the **M-SEO REST API Server** (`RestApiServer.ts`), which provides language-agnostic HTTP endpoints:

```
Python/PHP/Ruby/Go App → REST API Server → M-SEO Core Engine → SEO Output
```

This allows teams using different tech stacks to share the same SEO infrastructure and configuration.

**REST API Server Location:** `src/service/RestApiServer.ts`

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
