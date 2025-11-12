# M-SEO Quick Reference

## Installation

```bash
npm install m-seo
```

## Core Modules

### 1️⃣ SeoEngine - Meta Tags & Open Graph

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "Page Title",
  description: "Page description",
  keywords: ["seo", "meta"],
  canonical: "https://example.com",
  ogImage: "https://example.com/image.jpg",
  author: "John Doe",
  siteName: "My Site",
  locale: "en",
  themeColor: "#ffffff",
  robots: "index, follow",
});

// Get as objects
const metaTags = seo.generateMetaTags();
const linkTags = seo.generateLinkTags();

// Get as HTML string
const html = seo.toHtmlString();

// Update config
seo.updateConfig({ title: "New Title" });
```

### 2️⃣ SitemapGenerator - XML Sitemaps

```typescript
import { SitemapGenerator } from "m-seo";

const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
  defaultChangefreq: "weekly",
  defaultPriority: 0.5,
});

// Add URLs
sitemap.addUrl({
  loc: "/about",
  lastmod: new Date(),
  changefreq: "monthly",
  priority: 0.8,
  alternates: [{ hreflang: "en", href: "https://example.com/en/about" }],
});

// Batch add
sitemap.addUrls([
  { loc: "/", priority: 1.0 },
  { loc: "/blog", priority: 0.9 },
]);

// Output
const xml = sitemap.toXml();
const json = sitemap.toJson();
const count = sitemap.getUrlCount();

// Clear
sitemap.clear();
```

### 3️⃣ RobotsManager - robots.txt

```typescript
import { RobotsManager } from "m-seo";

const robots = new RobotsManager();

// Add rules
robots.addRule({
  userAgent: "Googlebot",
  allow: ["/"],
  disallow: ["/admin"],
  crawlDelay: 10,
});

// Quick setup
robots.allowAll(); // Allow all bots
robots.disallowAll(); // Block all bots

// Add metadata
robots.setSitemap("https://example.com/sitemap.xml");
robots.setHost("https://example.com");

// Output
const content = robots.toString();
```

### 4️⃣ StructuredDataManager - JSON-LD

```typescript
import { StructuredDataManager } from "m-seo";

const sd = new StructuredDataManager();

// Add schemas
sd.addWebsite({
  name: "My Site",
  url: "https://example.com",
  description: "A great site",
  author: { name: "John", url: "https://john.com" },
});

sd.addOrganization({
  name: "My Company",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
  description: "Company description",
  sameAs: ["https://twitter.com/mycompany"],
});

sd.addArticle({
  headline: "Article Title",
  description: "Article description",
  image: "https://example.com/article.jpg",
  datePublished: "2025-01-01",
  dateModified: "2025-01-15",
  author: { name: "Jane Doe" },
});

sd.addBreadcrumb([
  { name: "Home", url: "https://example.com" },
  { name: "Blog", url: "https://example.com/blog" },
]);

// Custom schema
sd.addSchema({
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Product Name",
  price: "99.99",
});

// Output
const scriptTag = sd.toHtmlScript();
const json = sd.toJson();
const count = sd.getSchemaCount();

// Clear
sd.clear();
```

## Usage Patterns

### Express.js

```typescript
app.get("/sitemap.xml", (req, res) => {
  const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
  sitemap.addUrl({ loc: "/", priority: 1.0 });
  res.type("application/xml").send(sitemap.toXml());
});

app.get("/robots.txt", (req, res) => {
  const robots = new RobotsManager();
  robots.allowAll().setSitemap("https://example.com/sitemap.xml");
  res.type("text/plain").send(robots.toString());
});

app.get("/", (req, res) => {
  const seo = new SeoEngine({ title: "Home", description: "Welcome" });
  res.send(`<head>${seo.toHtmlString()}</head>`);
});
```

### React Hook

```typescript
function useSeo(config: SeoConfig) {
  useEffect(() => {
    const seo = new SeoEngine(config);
    document.title = config.title || "";

    const metaTags = seo.generateMetaTags();
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.name) meta.setAttribute("name", tag.name);
      if (tag.property) meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  }, [config]);
}
```

### Static Site Generation

```typescript
// At build time
const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
pages.forEach((page) => {
  sitemap.addUrl({ loc: page.path, lastmod: page.lastModified });
});
fs.writeFileSync("public/sitemap.xml", sitemap.toXml());

const robots = new RobotsManager();
robots.allowAll().setSitemap("https://example.com/sitemap.xml");
fs.writeFileSync("public/robots.txt", robots.toString());
```

### API Response

```typescript
app.get("/api/seo/meta", (req, res) => {
  const seo = new SeoEngine({ title: "API", description: "API endpoint" });
  res.json(seo.generateMetaTags());
});

app.get("/api/seo/sitemap", (req, res) => {
  const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
  sitemap.addUrl({ loc: "/" });
  res.json(sitemap.toJson());
});
```

## TypeScript Types

```typescript
// SeoConfig
interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  themeColor?: string;
  robots?: string;
}

// MetaTag
interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

// SitemapUrl
interface SitemapUrl {
  loc: string;
  lastmod?: string | Date;
  changefreq?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: { hreflang: string; href: string }[];
}

// RobotRule
interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}
```

## Common Patterns

### Complete SEO Setup

```typescript
// Meta tags
const seo = new SeoEngine({
  title: "My Site",
  description: "Description",
  canonical: "https://example.com",
});

// Sitemap
const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
sitemap.addUrl({ loc: "/", priority: 1.0 });

// Robots
const robots = new RobotsManager();
robots.allowAll().setSitemap("https://example.com/sitemap.xml");

// Structured data
const sd = new StructuredDataManager();
sd.addWebsite({ name: "My Site", url: "https://example.com" });
```

### Multi-language Support

```typescript
const sitemap = new SitemapGenerator({ hostname: "https://example.com" });
sitemap.addUrl({
  loc: "/about",
  alternates: [
    { hreflang: "en", href: "https://example.com/en/about" },
    { hreflang: "es", href: "https://example.com/es/about" },
    { hreflang: "fr", href: "https://example.com/fr/about" },
  ],
});
```

## Tips

✅ **DO:**

- Use plain objects for maximum flexibility
- Generate sitemaps at build time for static sites
- Update meta tags dynamically for SPAs
- Cache sitemap/robots.txt for better performance

❌ **DON'T:**

- Don't mutate returned objects directly
- Don't forget to escape user input
- Don't generate sitemap on every request (cache it)

## Resources

- GitHub: https://github.com/yourusername/m-seo
- Docs: /docs/
- Examples: /examples/
