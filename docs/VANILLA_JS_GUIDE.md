# 📘 Vanilla JavaScript Guide

Complete guide to using M-SEO with vanilla JavaScript, from basic meta tags to advanced SEO optimization.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Intermediate Usage](#intermediate-usage)
- [Advanced Usage](#advanced-usage)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Live Examples](#live-examples)

---

## Installation

### Option 1: NPM/Yarn (Recommended)

```bash
npm install m-seo
# or
yarn add m-seo
```

### Option 2: CDN (Quick Start)

```html
<!-- ES Module -->
<script type="module">
  import {
    MetaManager,
    BotDetection,
  } from "https://unpkg.com/m-seo@latest/dist/index.js";
</script>

<!-- Or use a specific version -->
<script type="module">
  import { MetaManager } from "https://unpkg.com/m-seo@1.1.1/dist/index.js";
</script>
```

---

## Basic Usage

### 1. Setting Basic Meta Tags

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <script type="module">
      import { MetaManager } from "https://unpkg.com/m-seo@latest/dist/index.js";

      // Create meta manager instance
      const seo = new MetaManager();

      // Set basic meta tags
      seo.setTitle("My Awesome Website");
      seo.setDescription("Welcome to my website built with M-SEO");
      seo.setKeywords(["web development", "SEO", "vanilla JavaScript"]);

      // Set canonical URL
      seo.setCanonical("https://example.com/");
    </script>
  </head>
  <body>
    <h1>Welcome to My Website</h1>
  </body>
</html>
```

### 2. Open Graph (Social Media Sharing)

```javascript
import { MetaManager } from "m-seo";

const seo = new MetaManager();

// Open Graph tags for better social media sharing
seo.setOpenGraph({
  title: "Amazing Product Launch",
  description: "Check out our new product!",
  type: "website",
  url: "https://example.com/product",
  image: "https://example.com/images/product.jpg",
  siteName: "My Store",
});
```

### 3. Twitter Cards

```javascript
// Twitter-specific meta tags
seo.setTwitterCard({
  card: "summary_large_image",
  site: "@mywebsite",
  creator: "@author",
  title: "Amazing Article",
  description: "Read about our latest insights",
  image: "https://example.com/images/article.jpg",
});
```

---

## Intermediate Usage

### 1. Bot Detection

```html
<script type="module">
  import { BotDetection } from "m-seo";

  // Detect if current visitor is a search engine bot
  const userAgent = navigator.userAgent;
  const isBot = BotDetection.isBot(userAgent);

  if (isBot) {
    console.log("Search engine bot detected!");

    // Get detailed bot information
    const botInfo = BotDetection.getBotInfo(userAgent);
    console.log("Bot name:", botInfo?.name);
    console.log("Bot category:", botInfo?.category);

    // Optimize content for bots
    document.body.classList.add("bot-visitor");
  } else {
    console.log("Human visitor detected");
    // Load interactive features for humans
    loadInteractiveFeatures();
  }
</script>
```

### 2. Structured Data (JSON-LD)

```javascript
import { StructuredData } from "m-seo";

const structured = new StructuredData();

// Article Schema
structured.addArticle({
  headline: "Complete Guide to SEO",
  description: "Learn everything about SEO optimization",
  author: {
    "@type": "Person",
    name: "John Doe",
    url: "https://example.com/author/john",
  },
  datePublished: "2025-01-01",
  dateModified: "2025-01-15",
  image: "https://example.com/images/seo-guide.jpg",
  publisher: {
    "@type": "Organization",
    name: "SEO Masters",
    logo: {
      "@type": "ImageObject",
      url: "https://example.com/logo.png",
    },
  },
});

// Inject into page
const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = structured.getAll();
document.head.appendChild(script);
```

### 3. Product Schema (E-commerce)

```javascript
structured.addProduct({
  name: "Premium Headphones",
  description: "High-quality wireless headphones",
  image: "https://example.com/images/headphones.jpg",
  brand: {
    "@type": "Brand",
    name: "AudioPro",
  },
  offers: {
    "@type": "Offer",
    price: "199.99",
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "My Store",
    },
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "247",
  },
});
```

### 4. Dynamic Meta Tag Updates (SPA)

```javascript
// For Single Page Applications
class PageManager {
  constructor() {
    this.seo = new MetaManager();
  }

  navigateTo(page) {
    // Update meta tags based on current page
    switch (page) {
      case "home":
        this.seo.setTitle("Home - My Website");
        this.seo.setDescription("Welcome to our homepage");
        break;

      case "about":
        this.seo.setTitle("About Us - My Website");
        this.seo.setDescription("Learn more about our company");
        break;

      case "products":
        this.seo.setTitle("Products - My Website");
        this.seo.setDescription("Browse our product catalog");
        break;
    }

    // Update canonical URL
    this.seo.setCanonical(`https://example.com/${page}`);

    // Update Open Graph
    this.seo.setOpenGraph({
      url: `https://example.com/${page}`,
      title: this.seo.getTitle(),
    });
  }
}

// Usage
const pageManager = new PageManager();

// Listen to route changes (example with custom router)
window.addEventListener("popstate", (e) => {
  const page = e.state?.page || "home";
  pageManager.navigateTo(page);
});
```

---

## Advanced Usage

### 1. SEO Audit Engine

```javascript
import { SEOAuditEngine } from "m-seo";

// Create audit engine
const audit = new SEOAuditEngine();

// Run comprehensive SEO audit
const results = await audit.runAudit({
  url: window.location.href,
  checkMeta: true,
  checkStructuredData: true,
  checkPerformance: true,
  checkAccessibility: true,
});

// Display results
console.log("SEO Score:", results.score);
console.log("Issues:", results.issues);
console.log("Recommendations:", results.recommendations);

// Check specific aspects
if (results.meta.missingTags.length > 0) {
  console.warn("Missing meta tags:", results.meta.missingTags);
}

if (results.performance.loadTime > 3000) {
  console.warn("Page load time is slow:", results.performance.loadTime);
}

// Generate audit report
const report = audit.generateReport(results);
document.getElementById("audit-results").innerHTML = report;
```

### 2. Internationalization (i18n)

```javascript
import { MetaManager, URLManager } from "m-seo";

class MultilingualSEO {
  constructor() {
    this.seo = new MetaManager();
    this.urlManager = new URLManager({
      baseUrl: "https://example.com",
      defaultLocale: "en",
    });

    this.translations = {
      en: {
        title: "Welcome to Our Website",
        description: "Discover amazing products and services",
      },
      es: {
        title: "Bienvenido a Nuestro Sitio Web",
        description: "Descubre productos y servicios increíbles",
      },
      fr: {
        title: "Bienvenue sur Notre Site Web",
        description: "Découvrez des produits et services incroyables",
      },
    };
  }

  setLanguage(locale) {
    const t = this.translations[locale] || this.translations.en;

    // Update meta tags
    this.seo.setTitle(t.title);
    this.seo.setDescription(t.description);

    // Set language attribute
    document.documentElement.lang = locale;

    // Add alternate links for other languages
    this.addAlternateLinks(locale);

    // Update canonical URL
    const url = this.urlManager.buildUrl({ locale });
    this.seo.setCanonical(url);
  }

  addAlternateLinks(currentLocale) {
    // Remove existing alternate links
    document
      .querySelectorAll('link[rel="alternate"]')
      .forEach((el) => el.remove());

    // Add alternate links for each language
    Object.keys(this.translations).forEach((locale) => {
      if (locale !== currentLocale) {
        const link = document.createElement("link");
        link.rel = "alternate";
        link.hreflang = locale;
        link.href = this.urlManager.buildUrl({ locale });
        document.head.appendChild(link);
      }
    });

    // Add x-default
    const defaultLink = document.createElement("link");
    defaultLink.rel = "alternate";
    defaultLink.hreflang = "x-default";
    defaultLink.href = this.urlManager.buildUrl({ locale: "en" });
    document.head.appendChild(defaultLink);
  }
}

// Usage
const multilingual = new MultilingualSEO();

// Detect browser language
const browserLang = navigator.language.split("-")[0];
multilingual.setLanguage(browserLang);

// Language switcher
document.querySelectorAll(".lang-switcher").forEach((button) => {
  button.addEventListener("click", (e) => {
    const locale = e.target.dataset.lang;
    multilingual.setLanguage(locale);
  });
});
```

### 3. Performance Monitoring

```javascript
import { PerformanceMonitor } from "m-seo";

const monitor = new PerformanceMonitor();

// Track page load performance
monitor.trackPageLoad();

// Track custom metrics
monitor.trackMetric("custom-script-load", () => {
  // Load heavy script
  return import("./heavy-module.js");
});

// Monitor Core Web Vitals
monitor.trackCoreWebVitals({
  onLCP: (value) => console.log("Largest Contentful Paint:", value),
  onFID: (value) => console.log("First Input Delay:", value),
  onCLS: (value) => console.log("Cumulative Layout Shift:", value),
});

// Get performance report
const perfReport = monitor.getReport();
console.log("Performance Report:", perfReport);

// Send to analytics
if (perfReport.lcp > 2500) {
  analytics.track("slow-lcp", { value: perfReport.lcp });
}
```

### 4. Advanced Bot Detection & Rendering

```javascript
import { BotDetection } from "m-seo";

class AdaptiveRenderer {
  constructor() {
    this.isBot = BotDetection.isBot(navigator.userAgent);
    this.botInfo = BotDetection.getBotInfo(navigator.userAgent);
  }

  render() {
    if (this.isBot) {
      // Render static, SEO-optimized content for bots
      this.renderStaticContent();

      // Skip heavy JavaScript
      console.log("Bot detected, skipping interactive features");

      // Log bot visit
      this.logBotVisit();
    } else {
      // Render full interactive experience for humans
      this.renderInteractiveContent();

      // Load all features
      this.loadAllFeatures();
    }
  }

  renderStaticContent() {
    // Render clean HTML with all content visible
    document.body.innerHTML = `
      <article>
        <h1>${this.getPageTitle()}</h1>
        <div class="content">
          ${this.getFullContent()}
        </div>
      </article>
    `;
  }

  renderInteractiveContent() {
    // Progressive enhancement
    // Start with static content, then enhance with JS
    this.renderStaticContent();

    // Add interactive features
    setTimeout(() => {
      this.addLazyLoading();
      this.addAnimations();
      this.addDynamicComponents();
    }, 0);
  }

  logBotVisit() {
    if (this.botInfo) {
      // Send to analytics (server-side)
      fetch("/api/analytics/bot-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bot: this.botInfo.name,
          category: this.botInfo.category,
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }

  getPageTitle() {
    return (
      document.querySelector('meta[property="og:title"]')?.content ||
      document.title
    );
  }

  getFullContent() {
    // Return all content without lazy loading
    return document.getElementById("main-content")?.innerHTML || "";
  }

  addLazyLoading() {
    // Implement lazy loading for images
    const images = document.querySelectorAll("img[data-src]");
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }

  addAnimations() {
    // Add CSS animations
    document.body.classList.add("animations-enabled");
  }

  addDynamicComponents() {
    // Load interactive components
    import("./components/interactive.js").then((module) => {
      module.initComponents();
    });
  }
}

// Initialize
const renderer = new AdaptiveRenderer();
renderer.render();
```

### 5. Sitemap Generation (Client-Side)

```javascript
import { SitemapGenerator } from "m-seo";

const sitemap = new SitemapGenerator({
  baseUrl: "https://example.com",
});

// Add static pages
sitemap.addURL({
  loc: "/",
  lastmod: "2025-01-15",
  changefreq: "daily",
  priority: 1.0,
});

sitemap.addURL({
  loc: "/about",
  lastmod: "2025-01-10",
  changefreq: "monthly",
  priority: 0.8,
});

// Add dynamic pages (fetch from API)
async function generateDynamicSitemap() {
  const posts = await fetch("/api/posts").then((r) => r.json());

  posts.forEach((post) => {
    sitemap.addURL({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    });
  });

  // Generate XML
  const xml = sitemap.toXML();

  // Download or send to server
  const blob = new Blob([xml], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "sitemap.xml";
  a.click();
}
```

---

## API Reference

### MetaManager

```javascript
const seo = new MetaManager(options);

// Methods
seo.setTitle(title);                    // Set page title
seo.setDescription(description);        // Set meta description
seo.setKeywords(keywords[]);            // Set meta keywords
seo.setCanonical(url);                  // Set canonical URL
seo.setRobots(robots);                  // Set robots meta tag
seo.setViewport(viewport);              // Set viewport
seo.setCharset(charset);                // Set charset
seo.setAuthor(author);                  // Set author

// Open Graph
seo.setOpenGraph(ogData);               // Set all OG tags
seo.setOGTitle(title);                  // Set og:title
seo.setOGDescription(description);      // Set og:description
seo.setOGImage(imageUrl);               // Set og:image
seo.setOGType(type);                    // Set og:type
seo.setOGUrl(url);                      // Set og:url

// Twitter Card
seo.setTwitterCard(cardData);           // Set all Twitter tags
seo.setTwitterCardType(type);           // Set twitter:card
seo.setTwitterSite(site);               // Set twitter:site
seo.setTwitterCreator(creator);         // Set twitter:creator

// Getters
seo.getTitle();                         // Get current title
seo.getDescription();                   // Get current description
seo.getAllMeta();                       // Get all meta tags
```

### BotDetection (Static Class)

```javascript
// Check if user agent is a bot
BotDetection.isBot(userAgent); // Returns boolean

// Get bot details
BotDetection.getBotInfo(userAgent); // Returns { name, pattern, category }

// Supported categories
// - search: Google, Bing, DuckDuckGo, Yahoo, Baidu, Yandex
// - social: Facebook, Twitter, LinkedIn, Pinterest
// - seo: Ahrefs, SEMrush, Moz, Screaming Frog
// - monitoring: Pingdom, UptimeRobot, StatusCake
```

### StructuredData

```javascript
const structured = new StructuredData();

// Add schemas
structured.addArticle(articleData);
structured.addProduct(productData);
structured.addOrganization(orgData);
structured.addPerson(personData);
structured.addBreadcrumb(items[]);
structured.addLocalBusiness(businessData);
structured.addEvent(eventData);
structured.addFAQ(faqData);

// Get JSON-LD
structured.getAll();                    // Get all as JSON string
structured.get(type);                   // Get specific schema type
```

---

## Best Practices

### 1. Progressive Enhancement

```javascript
// Start with basic meta tags in HTML
// Enhance with JavaScript only when needed

// HTML (always works)
<title>My Website</title>
<meta name="description" content="Description">

// JavaScript (enhancement)
<script type="module">
  import { MetaManager } from 'm-seo';

  // Only update if dynamic content
  if (isDynamicPage()) {
    const seo = new MetaManager();
    seo.setTitle(getDynamicTitle());
  }
</script>
```

### 2. Performance Optimization

```javascript
// Lazy load M-SEO only when needed
async function setupSEO() {
  const { MetaManager } = await import("m-seo");
  const seo = new MetaManager();
  // ... setup
}

// Or use dynamic import for features
document.getElementById("run-audit").addEventListener("click", async () => {
  const { SEOAuditEngine } = await import("m-seo");
  const audit = new SEOAuditEngine();
  const results = await audit.runAudit();
  displayResults(results);
});
```

### 3. Error Handling

```javascript
try {
  const seo = new MetaManager();
  seo.setTitle("My Page");
  seo.setOpenGraph(ogData);
} catch (error) {
  console.error("SEO setup failed:", error);
  // Fallback to basic HTML meta tags
}
```

### 4. Server-Side Rendering Compatibility

```javascript
// Check if running in browser
if (typeof window !== "undefined") {
  import("m-seo").then(({ MetaManager }) => {
    const seo = new MetaManager();
    seo.setTitle("Client-side Title");
  });
}
```

---

## Live Examples

### Complete Single Page Example

See the complete working example: [`examples/test-vanilla.js`](../examples/test-vanilla.js)

### Test Application

Run the interactive test application:

```bash
cd examples
npx serve .
# Open http://localhost:3000/test-vanilla.html
```

---

## Next Steps

- **React Guide**: [REACT_GUIDE.md](./REACT_GUIDE.md)
- **Vue.js Guide**: [VUE_GUIDE.md](./VUE_GUIDE.md)
- **Next.js Guide**: [NEXT_JS_GUIDE.md](./NEXT_JS_GUIDE.md)
- **Express.js Guide**: [EXPRESS_GUIDE.md](./EXPRESS_GUIDE.md)
- **API Documentation**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## Support

- 📖 [Full Documentation](./README.md)
- 💬 [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 [Examples](../examples/)
