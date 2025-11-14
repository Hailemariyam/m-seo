# API Reference

Complete API documentation for **m-seo**.

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
