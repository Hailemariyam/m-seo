# API Reference

Complete API documentation for **m-seo**.

## Table of Contents

- [Core API](#core-api) - createSEO(), SeoEngine
- [CMS Integration API](#cms-integration-api) - CMSPlugins (NEW v1.1.1)
- [AI Content Analysis API](#ai-content-analysis-api) - AIContentAnalysis (NEW v1.1.1)
- [Framework Adapters](#framework-adapters) - React, Vue, Next.js, Express
- [Utilities](#utilities) - UrlManager, Sitemap, Robots

---

## CMS Integration API (NEW v1.1.1)

### CMSPlugins

Multi-platform CMS integration for WordPress, Ghost, Drupal, Joomla, Contentful, and Strapi.

#### Constructor

```typescript
import { CMSPlugins, CMSConfig } from "m-seo";

interface CMSConfig {
  platform:
    | "wordpress"
    | "ghost"
    | "drupal"
    | "joomla"
    | "contentful"
    | "strapi"
    | "custom";
  baseUrl: string;
  credentials?: {
    username?: string;
    password?: string;
    apiKey?: string;
    token?: string;
  };
  options?: {
    cacheEnabled?: boolean;
    cacheTTL?: number; // milliseconds
    rateLimitPerMinute?: number;
    timeout?: number;
  };
}

const cms = new CMSPlugins(config);
```

#### Methods

**fetchContent()**

```typescript
async fetchContent(options: { id: string; type?: string }): Promise<CMSContent>

interface CMSContent {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
  featuredImage?: string;
  categories?: string[];
  tags?: string[];
  metadata?: Record<string, any>;
}
```

**generateSeoData()**

```typescript
async generateSeoData(config: CMSConfig, content: CMSContent): Promise<SeoData>

interface SeoData {
  title: string;
  description: string;
  keywords: string[];
  canonical?: string;
  ogImage?: string;
  structuredData?: object;
}
```

**batchProcess()**

```typescript
async batchProcess(options: BatchOptions): Promise<BatchResult[]>

interface BatchOptions {
  operations: BatchOperation[];
  config: CMSConfig;
  maxConcurrency?: number;
}

interface BatchOperation {
  type: "fetch" | "generate-seo" | "sync";
  id?: string;
  content?: CMSContent;
  seo?: SeoData;
}
```

**exportContent()**

```typescript
async exportContent(
  contents: CMSContent[],
  options: { format: "json" | "csv" | "xml" | "markdown" }
): Promise<string>
```

**importContent()**

```typescript
async importContent(
  data: string,
  format: "json" | "csv" | "xml" | "markdown",
  config: CMSConfig
): Promise<CMSContent[]>
```

---

## AI Content Analysis API (NEW v1.1.1)

### AIContentAnalysis

AI-powered content analysis for SEO optimization.

#### analyzeContent()

```typescript
static async analyzeContent(
  content: string,
  config: AIContentConfig
): Promise<AdvancedContentAnalysisResult>

interface AIContentConfig {
  provider: "openai" | "claude" | "huggingface";
  apiKey: string;
  model?: string;
  enableReadability?: boolean;
  enableSentiment?: boolean;
  enableToneAnalysis?: boolean;
  enableKeywordAnalysis?: boolean;
  enablePlagiarismCheck?: boolean;
  targetKeywords?: string[];
  language?: string;
}

interface AdvancedContentAnalysisResult {
  scores: ContentQualityMetrics;
  readability: ReadabilityScores;
  sentiment: SentimentAnalysis;
  tone: ToneAnalysis;
  keywords: KeywordAnalysis[];
  recommendations: SEORecommendation[];
  plagiarism?: PlagiarismResult;
  metadata: {
    analyzedAt: string;
    wordCount: number;
    characterCount: number;
    sentenceCount: number;
    paragraphCount: number;
  };
}
```

#### Readability Scores

```typescript
interface ReadabilityScores {
  fleschReadingEase: number; // 0-100, higher is easier
  gunningFog: number; // Grade level
  smog: number; // Grade level
  colemanLiau: number; // Grade level
  automatedReadability: number; // Grade level
  daleChall: number; // Grade level
  grade: string; // "Easy", "Medium", "Hard"
  readingTime: number; // minutes
}
```

#### Sentiment & Tone

```typescript
interface SentimentAnalysis {
  type: "positive" | "negative" | "neutral" | "mixed";
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  emotions?: {
    joy?: number;
    sadness?: number;
    anger?: number;
    fear?: number;
    surprise?: number;
  };
}

interface ToneAnalysis {
  primary: string; // "professional", "casual", "formal", etc.
  secondary?: string[];
  confidence: number;
  attributes: {
    formality: number; // 0-1
    complexity: number;
    enthusiasm: number;
  };
}
```

#### Keyword Analysis

```typescript
interface KeywordAnalysis {
  word: string;
  frequency: number;
  density: number; // percentage
  prominence: number; // 0-1
  relevance: number; // 0-100
  context: string[];
}
```

#### Batch Analysis

```typescript
static async batchAnalyze(options: {
  requests: BatchAnalysisRequest[];
  globalConfig?: Partial<AIContentConfig>;
  maxConcurrency?: number;
}): Promise<BatchAnalysisResult[]>

interface BatchAnalysisRequest {
  content: string;
  config?: Partial<AIContentConfig>;
}
```

#### Export Analysis

```typescript
static async exportAnalysis(
  result: AdvancedContentAnalysisResult,
  options: ExportOptions
): Promise<string>

interface ExportOptions {
  format: "json" | "markdown" | "html" | "pdf";
  includeCharts?: boolean;
  includeSuggestions?: boolean;
  includeHistory?: boolean;
}
```

---

## Image Optimization API (NEW v1.1.1)

### ImageOptimizer

Optimize images for SEO and performance with AI-powered features.

#### analyzeImage()

```typescript
static async analyzeImage(src: string, alt?: string): Promise<ImageAnalysisResult>

interface ImageAnalysisResult {
  src: string;
  originalFormat: string;
  originalSize: { width: number; height: number; fileSize: number };
  aspectRatio: string;
  hasAlt: boolean;
  altText: string;
  altQuality: number; // 0-100
  altScore: number; // 0-100
  isOptimized: boolean;
  canBeOptimized: boolean;
  potentialSavings: number; // bytes
  format: string;
  recommendations: string[];
}
```

#### optimizeImage()

```typescript
static async optimizeImage(config: ImageOptimizationConfig): Promise<OptimizedImage>

interface ImageOptimizationConfig {
  src: string;
  alt?: string;
  title?: string;
  format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto';
  quality?: number; // 1-100
  maxWidth?: number;
  maxHeight?: number;
  responsive?: boolean;
  breakpoints?: number[]; // [320, 640, 768, 1024, 1280, 1536]
  sizes?: string; // "(max-width: 768px) 100vw, 50vw"
  loading?: 'lazy' | 'eager' | 'auto';
  fetchPriority?: 'high' | 'low' | 'auto';
  decoding?: 'async' | 'sync' | 'auto';
  generateAlt?: boolean; // AI-generated alt text
  altLanguage?: string;
  keywords?: string[];
}

interface OptimizedImage {
  src: string;
  srcset?: string;
  sizes?: string;
  alt: string;
  loading: string;
  html: string; // Complete <picture> or <img> tag
}
```

---

## Video SEO API (NEW v1.1.1)

### VideoSeo

Optimize video content for search engines.

#### optimizeVideo()

```typescript
static optimizeVideo(config: VideoSeoConfig, pageUrl: string): VideoOptimizationResult

interface VideoSeoConfig {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string; // ISO 8601 date
  duration: string; // ISO 8601 duration (PT1H30M)
  contentUrl?: string;
  embedUrl?: string;
  transcript?: string;
  captions?: Array<{ language: string; url: string }>;
  category?: string;
  tags?: string[];
  rating?: number; // 1-5
  viewCount?: number;
  familyFriendly?: boolean;
  requiresSubscription?: boolean;
  videoQuality?: 'hd' | 'sd';
  width?: number;
  height?: number;
  publisher?: { name: string; logo: string };
}

interface VideoOptimizationResult {
  schema: VideoSchemaMarkup; // JSON-LD object
  schemaJson: string; // JSON-LD as string
  sitemapEntry: string; // XML sitemap entry
  embedCode: string; // Optimized iframe code
  recommendations: string[];
  seoScore: number; // 0-100
}
```

#### generateVideoSitemap()

```typescript
static generateVideoSitemap(videos: VideoSeoConfig[]): string
// Returns complete XML video sitemap
```

---

## Social Preview API (NEW v1.1.1)

### SocialPreviewGenerator

Generate and validate social media preview cards.

#### generatePreview()

```typescript
static generatePreview(
  platform: 'facebook' | 'twitter' | 'linkedin' | 'pinterest',
  config: SocialPreviewConfig
): SocialPreviewResult

interface SocialPreviewConfig {
  og?: OpenGraphData;
  twitter?: TwitterCardData;
}

interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'video' | 'music' | 'book' | 'profile';
  siteName?: string;
  locale?: string;
  imageWidth?: number;
  imageHeight?: number;
}

interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string; // @username
  creator?: string; // @username
  title?: string;
  description?: string;
  image?: string;
}

interface SocialPreviewResult {
  platform: string;
  title: string;
  description: string;
  image: string;
  url: string;
  preview: string; // HTML preview render
  validation: PreviewValidation;
  meta: {
    titleLength: number;
    descriptionLength: number;
    imageAspectRatio?: string;
    imageDimensions?: { width: number; height: number };
  };
}

interface PreviewValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  requiredTags: string[];
  optionalTags: string[];
  score: number; // 0-100
}
```

#### validatePreview()

```typescript
static validatePreview(
  platform: string,
  data: { og?: Partial<OpenGraphData>; twitter?: Partial<TwitterCardData> }
): PreviewValidation
```

#### generateMetaTags()

```typescript
static generateMetaTags(config: SocialPreviewConfig): string
// Returns complete Open Graph and Twitter Card meta tags as HTML string
```

---

## Core API

### createSEO()

**Simple API** - Quick way to generate SEO tags.

```typescript
function createSEO(options: SimpleSeoOptions): SeoResult;

interface SimpleSeoOptions {
  title: string;
  description: string;
  image?: string;
  url?: string;
  keywords?: string[];
  siteName?: string;
  locale?: string;
  type?: "website" | "article" | "product";
}

interface SeoResult {
  html: string; // HTML meta tags as string
  jsonLd: object; // JSON-LD structured data
  metaTags: MetaTag[]; // Array of meta tag objects
  linkTags: LinkTag[]; // Array of link tag objects
  title: string; // Page title
  description: string; // Meta description
  openGraph: object; // Open Graph data
}
```

**Example:**

```typescript
import { createSEO } from "m-seo";

const seo = createSEO({
  title: "My Page",
  description: "Page description",
  image: "https://example.com/og.jpg",
  url: "https://example.com/page",
  keywords: ["seo", "web"],
  siteName: "My Site",
  locale: "en_US",
  type: "article",
});

console.log(seo.html); // HTML string
console.log(seo.jsonLd); // JSON-LD object
console.log(seo.metaTags); // Meta tag array
```

---

### SeoEngine

**Advanced API** - Full control over SEO configuration.

#### Constructor

```typescript
class SeoEngine {
  constructor(config: SeoConfig);
}

interface SeoConfig {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  ogUrl?: string;
  twitterCard?: "summary" | "summary_large_image" | "app" | "player";
  twitterSite?: string;
  twitterCreator?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  themeColor?: string;
  robots?: string;
  viewport?: string;
  appleMobileWebAppCapable?: boolean;
  appleMobileWebAppTitle?: string;
}
```

**Example:**

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "Blog Post Title",
  description: "An amazing blog post",
  keywords: ["blog", "tech", "web"],
  canonical: "https://example.com/blog/post",
  ogImage: "https://example.com/images/og.jpg",
  ogType: "article",
  twitterCard: "summary_large_image",
  author: "John Doe",
  siteName: "My Blog",
  locale: "en_US",
  themeColor: "#3490dc",
  robots: "index, follow",
});
```

#### Methods

##### generateMetaTags()

Generate array of meta tag objects.

```typescript
generateMetaTags(): MetaTag[]

interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}
```

**Example:**

```typescript
const metaTags = seo.generateMetaTags();
// [
//   { name: 'description', content: 'An amazing blog post' },
//   { property: 'og:title', content: 'Blog Post Title' },
//   { name: 'twitter:card', content: 'summary_large_image' },
//   ...
// ]
```

##### generateLinkTags()

Generate array of link tag objects.

```typescript
generateLinkTags(): LinkTag[]

interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
}
```

**Example:**

```typescript
const linkTags = seo.generateLinkTags();
// [
//   { rel: 'canonical', href: 'https://example.com/blog/post' }
// ]
```

##### toHtmlString()

Generate complete HTML string with all tags.

```typescript
toHtmlString(): string
```

**Example:**

```typescript
const html = seo.toHtmlString();
// <title>Blog Post Title</title>
// <meta name="description" content="An amazing blog post">
// <meta property="og:title" content="Blog Post Title">
// ...
```

##### updateConfig()

Update SEO configuration.

```typescript
updateConfig(newConfig: Partial<SeoConfig>): void
```

**Example:**

```typescript
seo.updateConfig({
  title: "Updated Title",
  description: "Updated description",
});
```

##### getConfig()

Get current configuration.

```typescript
getConfig(): SeoConfig
```

**Example:**

```typescript
const config = seo.getConfig();
console.log(config.title); // 'Blog Post Title'
```

##### Static: setDefaults()

Set global default configuration.

```typescript
static setDefaults(defaults: Partial<SeoConfig>): void
```

**Example:**

```typescript
SeoEngine.setDefaults({
  siteName: "My Website",
  locale: "en_US",
  author: "John Doe",
  themeColor: "#3490dc",
});

// All new instances inherit these defaults
const seo = new SeoEngine({
  title: "Page",
  description: "Description",
  // siteName, locale, author, themeColor are inherited
});
```

---

### SitemapGenerator

Generate XML sitemaps.

#### Constructor

```typescript
class SitemapGenerator {
  constructor(options?: SitemapOptions);
}

interface SitemapOptions {
  hostname: string;
  defaultChangefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  defaultPriority?: number; // 0.0 to 1.0
}
```

#### Methods

##### addUrl()

Add a URL to the sitemap.

```typescript
addUrl(url: SitemapUrl): void

interface SitemapUrl {
  loc: string;                    // URL path
  lastmod?: Date | string;        // Last modified date
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;              // 0.0 to 1.0
  alternates?: AlternateUrl[];    // Alternate language URLs
}

interface AlternateUrl {
  hreflang: string;
  href: string;
}
```

**Example:**

```typescript
import { SitemapGenerator } from "m-seo";

const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
  defaultChangefreq: "weekly",
  defaultPriority: 0.5,
});

sitemap.addUrl({
  loc: "/",
  lastmod: new Date(),
  changefreq: "daily",
  priority: 1.0,
});

sitemap.addUrl({
  loc: "/blog/post-1",
  lastmod: "2025-01-15",
  changefreq: "monthly",
  priority: 0.8,
  alternates: [
    { hreflang: "en", href: "https://example.com/en/blog/post-1" },
    { hreflang: "es", href: "https://example.com/es/blog/post-1" },
  ],
});
```

##### toXml()

Generate sitemap as XML string.

```typescript
toXml(): string
```

**Example:**

```typescript
const xml = sitemap.toXml();
console.log(xml);
// <?xml version="1.0" encoding="UTF-8"?>
// <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//   <url>
//     <loc>https://example.com/</loc>
//     <lastmod>2025-01-15</lastmod>
//     <changefreq>daily</changefreq>
//     <priority>1.0</priority>
//   </url>
//   ...
// </urlset>
```

##### toJson()

Get sitemap URLs as JSON array.

```typescript
toJson(): SitemapUrl[]
```

##### clear()

Remove all URLs from sitemap.

```typescript
clear(): void
```

---

### RobotsManager

Manage robots.txt content.

#### Constructor

```typescript
class RobotsManager {
  constructor();
}
```

#### Methods

##### addRule()

Add a robot rule.

```typescript
addRule(rule: RobotRule): void

interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}
```

**Example:**

```typescript
import { RobotsManager } from "m-seo";

const robots = new RobotsManager();

robots.addRule({
  userAgent: "Googlebot",
  allow: ["/public"],
  disallow: ["/admin", "/private"],
  crawlDelay: 10,
});

robots.addRule({
  userAgent: "*",
  allow: ["/"],
  disallow: ["/admin"],
});
```

##### allowAll()

Allow all bots to crawl everything.

```typescript
allowAll(): RobotsManager
```

**Example:**

```typescript
robots.allowAll();
// User-agent: *
// Allow: /
```

##### disallowAll()

Block all bots from crawling.

```typescript
disallowAll(): RobotsManager
```

**Example:**

```typescript
robots.disallowAll();
// User-agent: *
// Disallow: /
```

##### setSitemap()

Add sitemap URL.

```typescript
setSitemap(url: string): RobotsManager
```

**Example:**

```typescript
robots.setSitemap("https://example.com/sitemap.xml");
```

##### setHost()

Set preferred host.

```typescript
setHost(host: string): RobotsManager
```

**Example:**

```typescript
robots.setHost("https://example.com");
```

##### toString()

Generate robots.txt content.

```typescript
toString(): string
```

**Example:**

```typescript
const content = robots.toString();
console.log(content);
// User-agent: Googlebot
// Allow: /public
// Disallow: /admin
// Disallow: /private
// Crawl-delay: 10
//
// User-agent: *
// Allow: /
// Disallow: /admin
//
// Sitemap: https://example.com/sitemap.xml
// Host: https://example.com
```

---

### StructuredDataManager

Manage Schema.org JSON-LD structured data.

#### Constructor

```typescript
class StructuredDataManager {
  constructor();
}
```

#### Methods

##### addSchema()

Add custom schema.

```typescript
addSchema(schema: object): void
```

**Example:**

```typescript
import { StructuredDataManager } from "m-seo";

const sd = new StructuredDataManager();

sd.addSchema({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "My Company",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
});
```

##### addWebsite()

Add WebSite schema.

```typescript
addWebsite(data: WebsiteSchema): void

interface WebsiteSchema {
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
  potentialAction?: object;
}
```

##### addOrganization()

Add Organization schema.

```typescript
addOrganization(data: OrganizationSchema): void

interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactPoint?: object;
  sameAs?: string[];
}
```

##### addArticle()

Add BlogPosting/Article schema.

```typescript
addArticle(data: ArticleSchema): void

interface ArticleSchema {
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: { name: string } | { '@type': 'Person', name: string };
  image?: string;
  publisher?: object;
}
```

##### addBreadcrumb()

Add BreadcrumbList schema.

```typescript
addBreadcrumb(items: BreadcrumbItem[]): void

interface BreadcrumbItem {
  name: string;
  url: string;
}
```

**Example:**

```typescript
sd.addBreadcrumb([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
  { name: "Post", url: "https://example.com/blog/post" },
]);
```

##### toHtmlScript()

Generate `<script>` tag with JSON-LD.

```typescript
toHtmlScript(): string
```

**Example:**

```typescript
const script = sd.toHtmlScript();
// <script type="application/ld+json">
// {"@context":"https://schema.org","@type":"Organization",...}
// </script>
```

##### toJson()

Get all schemas as array.

```typescript
toJson(): object[]
```

##### clear()

Remove all schemas.

```typescript
clear(): void
```

---

## React Adapter API

### useSeo()

React hook for setting SEO tags.

```typescript
function useSeo(options: SeoConfig): void;
```

**Example:**

```jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home - My App",
    description: "Welcome to my app",
    canonical: "https://example.com",
    ogImage: "https://example.com/og.jpg",
  });

  return <h1>Home</h1>;
}
```

### useStructuredData()

React hook for adding JSON-LD structured data.

```typescript
function useStructuredData(schema: object): void;
```

**Example:**

```jsx
import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function BlogPost({ post }) {
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    author: { "@type": "Person", name: post.author },
  });

  return <article>...</article>;
}
```

### useBreadcrumbs()

React hook for breadcrumb navigation.

```typescript
function useBreadcrumbs(items: BreadcrumbItem[]): void;
```

**Example:**

```jsx
import { useBreadcrumbs } from "m-seo/adapters/ReactSPAAdapter";

function ProductPage() {
  useBreadcrumbs([
    { name: "Home", url: "/" },
    { name: "Products", url: "/products" },
    { name: "Product Name", url: "/products/123" },
  ]);

  return <div>Product Details</div>;
}
```

### SeoHead Component

React component for SEO tags.

```typescript
function SeoHead(props: SeoConfig): JSX.Element;
```

**Example:**

```jsx
import { SeoHead } from "m-seo/adapters/ReactSPAAdapter";

function Page() {
  return (
    <div>
      <SeoHead
        title="Page Title"
        description="Page description"
        ogImage="https://example.com/og.jpg"
      />
      <h1>Content</h1>
    </div>
  );
}
```

### JsonLd Component

React component for JSON-LD structured data.

```typescript
function JsonLd(props: { data: object }): JSX.Element;
```

**Example:**

```jsx
import { JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function Product({ product }) {
  return (
    <div>
      <JsonLd
        data={{
          "@type": "Product",
          name: product.name,
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "USD",
          },
        }}
      />
      <h1>{product.name}</h1>
    </div>
  );
}
```

---

## Express Adapter API

### ExpressAdapter()

Express middleware for SEO.

```typescript
function ExpressAdapter(options: ExpressAdapterOptions): Middleware;

interface ExpressAdapterOptions {
  defaults?: Partial<SeoConfig>;
  sitemapRoute?: string;
  robotsRoute?: string;
}
```

**Example:**

```javascript
const express = require("express");
const { ExpressAdapter } = require("m-seo/adapters/ExpressAdapter");

const app = express();

app.use(
  ExpressAdapter({
    defaults: {
      siteName: "My Site",
      locale: "en_US",
      themeColor: "#3490dc",
    },
    sitemapRoute: "/sitemap.xml",
    robotsRoute: "/robots.txt",
  })
);
```

---

## TypeScript Types

All types are exported from the main package:

```typescript
import type {
  SeoConfig,
  MetaTag,
  LinkTag,
  SitemapUrl,
  RobotRule,
  BreadcrumbItem,
  SimpleSeoOptions,
  SeoResult,
} from "m-seo";
```

---

## Next Steps

- **[See Examples](examples.md)** - Real-world usage patterns
- **[Read FAQ](faq.md)** - Common questions
- **[View Project Structure](project-structure.md)** - Code organization
