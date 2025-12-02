# 🚂 Express.js Guide - M-SEO

Complete guide to using M-SEO with Express.js for server-side rendering, bot detection, and SEO optimization.

## 📚 Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Intermediate Usage](#intermediate-usage)
- [Advanced Usage](#advanced-usage)
- [Bot Detection](#bot-detection)
- [Best Practices](#best-practices)
- [Live Demo](#live-demo)
- [Troubleshooting](#troubleshooting)

---

## Installation

```bash
npm install express m-seo
# or
yarn add express m-seo
```

---

## Basic Usage

### 1. Simple Server with SEO

```javascript
import express from "express";
import { MetaManager } from "m-seo";

const app = express();

app.get("/", (req, res) => {
  const seo = new MetaManager();
  seo.setTitle("Home - My Express App");
  seo.setDescription("Welcome to my Express application");
  seo.setCanonical("https://example.com/");

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${seo.getTitle()}</title>
      <meta name="description" content="${seo.getDescription()}">
      <link rel="canonical" href="https://example.com/">
    </head>
    <body>
      <h1>Welcome!</h1>
    </body>
    </html>
  `);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### 2. Template Helper Function

```javascript
function renderPage({ title, meta, content }) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      ${meta}
    </head>
    <body>
      ${content}
    </body>
    </html>
  `;
}

app.get("/about", (req, res) => {
  const seo = new MetaManager();
  seo.setTitle("About Us");
  seo.setDescription("Learn about our company");

  const meta = `
    <title>${seo.getTitle()}</title>
    <meta name="description" content="${seo.getDescription()}">
  `;

  res.send(
    renderPage({
      title: "About Us",
      meta,
      content: "<h1>About Us</h1><p>We are awesome!</p>",
    })
  );
});
```

---

## Intermediate Usage

### 1. Bot Detection Middleware

```javascript
import { BotDetection } from "m-seo";

// Bot detection middleware
app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  const isBot = BotDetection.isBot(userAgent);

  req.isBot = isBot;

  if (isBot) {
    const botInfo = BotDetection.getBotInfo(userAgent);
    res.setHeader("X-Bot-Detected", "true");
    if (botInfo) {
      res.setHeader("X-Bot-Name", botInfo.name);
    }
  }

  console.log(`${req.method} ${req.path} - Bot: ${isBot}`);
  next();
});

// Use bot detection in routes
app.get("/product/:id", (req, res) => {
  if (req.isBot) {
    // Serve static, SEO-optimized content for bots
    res.send(renderStaticProduct(req.params.id));
  } else {
    // Serve interactive content for humans
    res.send(renderInteractiveProduct(req.params.id));
  }
});
```

### 2. SEO Helper Middleware

```javascript
// SEO helper middleware
app.use((req, res, next) => {
  res.locals.generateSEO = function (config) {
    const seo = new MetaManager();

    if (config.title) seo.setTitle(config.title);
    if (config.description) seo.setDescription(config.description);
    if (config.canonical) seo.setCanonical(config.canonical);
    if (config.keywords) seo.setKeywords(config.keywords);

    let html = "";
    html += `<title>${seo.getTitle()}</title>\n`;
    html += `<meta name="description" content="${seo.getDescription()}">\n`;
    if (config.canonical) {
      html += `<link rel="canonical" href="${config.canonical}">\n`;
    }

    // Open Graph
    if (config.ogImage) {
      html += `<meta property="og:title" content="${seo.getTitle()}">\n`;
      html += `<meta property="og:description" content="${seo.getDescription()}">\n`;
      html += `<meta property="og:image" content="${config.ogImage}">\n`;
      html += `<meta property="og:url" content="${config.canonical}">\n`;
    }

    return html;
  };

  next();
});

// Use in routes
app.get("/blog/:slug", (req, res) => {
  const post = getPost(req.params.slug);

  const seoMeta = res.locals.generateSEO({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    canonical: `https://example.com/blog/${req.params.slug}`,
    ogImage: post.image,
  });

  res.send(
    renderPage({
      meta: seoMeta,
      content: `<article>${post.content}</article>`,
    })
  );
});
```

### 3. Structured Data Helper

```javascript
function generateStructuredData(type, data) {
  const schemas = {
    article: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: data.title,
      description: data.excerpt,
      image: data.image,
      datePublished: data.publishedAt,
      author: {
        "@type": "Person",
        name: data.author,
      },
    },
    product: {
      "@context": "https://schema.org",
      "@type": "Product",
      name: data.name,
      description: data.description,
      image: data.image,
      offers: {
        "@type": "Offer",
        price: data.price,
        priceCurrency: "USD",
      },
    },
  };

  const schema = schemas[type];
  return `<script type="application/ld+json">${JSON.stringify(
    schema
  )}</script>`;
}

app.get("/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  const structuredData = generateStructuredData("product", product);

  res.send(
    renderPage({
      meta: `<title>${product.name}</title>`,
      content: `
      ${structuredData}
      <h1>${product.name}</h1>
      <p>${product.description}</p>
    `,
    })
  );
});
```

---

## Advanced Usage

### 1. Complete SEO Manager Class

```javascript
import { MetaManager, BotDetection } from "m-seo";

class SEOManager {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.defaultTitle = "My Website";
    this.defaultDescription = "Welcome to my website";
  }

  generateMeta(config) {
    const seo = new MetaManager();

    const title = config.title || this.defaultTitle;
    const description = config.description || this.defaultDescription;
    const canonical = config.canonical || this.baseUrl;

    seo.setTitle(title);
    seo.setDescription(description);
    seo.setCanonical(canonical);

    if (config.keywords) seo.setKeywords(config.keywords);

    let html = "";
    html += `<meta charset="UTF-8">\n`;
    html += `<meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    html += `<title>${title}</title>\n`;
    html += `<meta name="description" content="${description}">\n`;
    html += `<link rel="canonical" href="${canonical}">\n`;

    // Open Graph
    if (config.openGraph !== false) {
      const og = config.openGraph || {};
      html += `<meta property="og:title" content="${og.title || title}">\n`;
      html += `<meta property="og:description" content="${
        og.description || description
      }">\n`;
      html += `<meta property="og:type" content="${og.type || "website"}">\n`;
      html += `<meta property="og:url" content="${og.url || canonical}">\n`;
      if (og.image) {
        html += `<meta property="og:image" content="${og.image}">\n`;
      }
      if (og.siteName) {
        html += `<meta property="og:site_name" content="${og.siteName}">\n`;
      }
    }

    // Twitter Card
    if (config.twitter) {
      html += `<meta name="twitter:card" content="${
        config.twitter.card || "summary_large_image"
      }">\n`;
      if (config.twitter.site) {
        html += `<meta name="twitter:site" content="${config.twitter.site}">\n`;
      }
      html += `<meta name="twitter:title" content="${title}">\n`;
      html += `<meta name="twitter:description" content="${description}">\n`;
      if (config.twitter.image || config.openGraph?.image) {
        html += `<meta name="twitter:image" content="${
          config.twitter.image || config.openGraph?.image
        }">\n`;
      }
    }

    // Robots
    if (config.robots) {
      html += `<meta name="robots" content="${config.robots}">\n`;
    }

    return html;
  }

  generateStructuredData(type, data) {
    const schemas = {
      article: {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: data.title,
        description: data.excerpt,
        image: data.image,
        datePublished: data.publishedAt,
        dateModified: data.updatedAt,
        author: {
          "@type": "Person",
          name: data.author.name,
          url: data.author.url,
        },
        publisher: {
          "@type": "Organization",
          name: data.publisher || this.defaultTitle,
          logo: {
            "@type": "ImageObject",
            url: data.publisherLogo || `${this.baseUrl}/logo.png`,
          },
        },
      },
      product: {
        "@context": "https://schema.org",
        "@type": "Product",
        name: data.name,
        description: data.description,
        image: data.images || [data.image],
        brand: {
          "@type": "Brand",
          name: data.brand,
        },
        offers: {
          "@type": "Offer",
          price: data.price,
          priceCurrency: data.currency || "USD",
          availability: data.inStock
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      },
      breadcrumb: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: data.items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      },
    };

    const schema = schemas[type];
    if (!schema) return "";

    return `<script type="application/ld+json">\n${JSON.stringify(
      schema,
      null,
      2
    )}\n</script>`;
  }
}

// Usage
const seoManager = new SEOManager("https://example.com");

app.use((req, res, next) => {
  res.locals.seo = seoManager;
  next();
});

app.get("/article/:slug", (req, res) => {
  const article = getArticle(req.params.slug);

  const meta = res.locals.seo.generateMeta({
    title: `${article.title} - Blog`,
    description: article.excerpt,
    canonical: `https://example.com/article/${req.params.slug}`,
    openGraph: {
      type: "article",
      image: article.image,
    },
    twitter: {
      card: "summary_large_image",
      site: "@myblog",
    },
  });

  const structuredData = res.locals.seo.generateStructuredData(
    "article",
    article
  );

  res.send(
    renderPage({
      meta: meta + structuredData,
      content: `<article>${article.content}</article>`,
    })
  );
});
```

### 2. Template Engine Integration (EJS)

```javascript
import ejs from "ejs";

app.set("view engine", "ejs");

// views/layout.ejs
/*
<!DOCTYPE html>
<html lang="en">
<head>
  <%- seoMeta %>
</head>
<body>
  <%- body %>
</body>
</html>
*/

app.get("/product/:id", (req, res) => {
  const product = getProduct(req.params.id);
  const seoManager = new SEOManager("https://shop.example.com");

  res.render("product", {
    product,
    seoMeta: seoManager.generateMeta({
      title: `${product.name} - ${product.price}`,
      description: product.description,
      canonical: `https://shop.example.com/product/${product.id}`,
      openGraph: {
        type: "product",
        image: product.image,
      },
    }),
  });
});
```

### 3. Sitemap Generation

```javascript
app.get("/sitemap.xml", async (req, res) => {
  const posts = await getAllPosts();
  const products = await getAllProducts();

  const urls = [
    { loc: "https://example.com/", lastmod: new Date(), priority: 1.0 },
    { loc: "https://example.com/about", lastmod: new Date(), priority: 0.8 },
    ...posts.map((post) => ({
      loc: `https://example.com/blog/${post.slug}`,
      lastmod: post.updatedAt,
      priority: 0.7,
    })),
    ...products.map((product) => ({
      loc: `https://example.com/products/${product.id}`,
      lastmod: product.updatedAt,
      priority: 0.9,
    })),
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod.toISOString()}</lastmod>
    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.header("Content-Type", "application/xml");
  res.send(sitemap);
});
```

### 4. Robots.txt Generation

```javascript
app.get("/robots.txt", (req, res) => {
  const robotsTxt = `
User-agent: *
Allow: /
Sitemap: https://example.com/sitemap.xml

User-agent: Googlebot
Allow: /

User-agent: bingbot
Allow: /

# Block specific bots
User-agent: BadBot
Disallow: /
  `.trim();

  res.header("Content-Type", "text/plain");
  res.send(robotsTxt);
});
```

---

## Bot Detection

### 1. Advanced Bot Middleware

```javascript
import { BotDetection } from "m-seo";

class BotMiddleware {
  constructor() {
    this.botCache = new Map();
  }

  middleware() {
    return (req, res, next) => {
      const userAgent = req.headers["user-agent"] || "";

      // Check cache first
      let botData = this.botCache.get(userAgent);

      if (!botData) {
        const isBot = BotDetection.isBot(userAgent);
        const botInfo = BotDetection.getBotInfo(userAgent);

        botData = { isBot, botInfo };
        this.botCache.set(userAgent, botData);
      }

      req.isBot = botData.isBot;
      req.botInfo = botData.botInfo;

      // Add headers
      if (botData.isBot) {
        res.setHeader("X-Bot-Detected", "true");
        if (botData.botInfo) {
          res.setHeader("X-Bot-Name", botData.botInfo.name);
          res.setHeader("X-Bot-Category", botData.botInfo.category);
        }
      }

      next();
    };
  }

  clearCache() {
    this.botCache.clear();
  }
}

const botMiddleware = new BotMiddleware();
app.use(botMiddleware.middleware());
```

### 2. Bot-Specific Rendering

```javascript
app.get("/products/:id", (req, res) => {
  const product = getProduct(req.params.id);

  if (req.isBot) {
    // Render static HTML for bots (faster, SEO-optimized)
    const seoManager = new SEOManager("https://shop.example.com");
    const meta = seoManager.generateMeta({
      title: product.name,
      description: product.description,
      openGraph: { image: product.image },
    });

    const structuredData = seoManager.generateStructuredData(
      "product",
      product
    );

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        ${meta}
        ${structuredData}
      </head>
      <body>
        <h1>${product.name}</h1>
        <img src="${product.image}" alt="${product.name}">
        <p>${product.description}</p>
        <p>Price: $${product.price}</p>
        <button>Add to Cart</button>
      </body>
      </html>
    `);
  } else {
    // Render SPA for humans (interactive)
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${product.name}</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/js/app.js"></script>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(product)};
        </script>
      </body>
      </html>
    `);
  }
});
```

### 3. Bot Analytics

```javascript
const botStats = {
  visits: {},
  increment(botName) {
    this.visits[botName] = (this.visits[botName] || 0) + 1;
  },
  getStats() {
    return this.visits;
  },
};

app.use((req, res, next) => {
  if (req.isBot && req.botInfo) {
    botStats.increment(req.botInfo.name);

    // Log to analytics service
    logBotVisit({
      bot: req.botInfo.name,
      category: req.botInfo.category,
      url: req.url,
      timestamp: new Date(),
    });
  }

  next();
});

app.get("/api/analytics/bots", (req, res) => {
  res.json(botStats.getStats());
});
```

---

## Best Practices

### 1. Cache SEO Meta Tags

```javascript
const metaCache = new Map();

function getCachedMeta(key, generator) {
  if (metaCache.has(key)) {
    return metaCache.get(key);
  }

  const meta = generator();
  metaCache.set(key, meta);

  // Clear cache after 1 hour
  setTimeout(() => metaCache.delete(key), 3600000);

  return meta;
}

app.get("/blog/:slug", (req, res) => {
  const cacheKey = `blog-${req.params.slug}`;

  const meta = getCachedMeta(cacheKey, () => {
    const post = getPost(req.params.slug);
    const seoManager = new SEOManager("https://example.com");
    return seoManager.generateMeta({
      title: post.title,
      description: post.excerpt,
    });
  });

  res.send(renderPage({ meta, content: "..." }));
});
```

### 2. Security Headers

```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains"
  );
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
```

### 3. Canonical URLs

```javascript
// Always use absolute URLs
app.get("*", (req, res, next) => {
  const canonical = `https://example.com${req.path}`;
  res.locals.canonical = canonical;
  next();
});
```

### 4. Handle Trailing Slashes

```javascript
app.use((req, res, next) => {
  if (req.path !== "/" && req.path.endsWith("/")) {
    const newPath = req.path.slice(0, -1) + req.url.slice(req.path.length);
    res.redirect(301, newPath);
  } else {
    next();
  }
});
```

---

## Live Demo

Check out the complete working example:

**Test Application**: [`test-express-app/`](../test-express-app/)

Run it locally:

```bash
cd test-express-app
npm install
node server.js
# Open http://localhost:3003
```

**Features Demonstrated**:

- ✅ Bot detection middleware
- ✅ Dynamic meta tag generation
- ✅ Structured data (JSON-LD)
- ✅ Security headers
- ✅ Sitemap generation
- ✅ Robots.txt
- ✅ Bot analytics

---

## Troubleshooting

### Meta Tags Not Rendering

**Problem**: Meta tags show as text

**Solution**: Make sure to use unescaped HTML

```javascript
// ❌ Wrong - EJS
<%=seoMeta%>

// ✅ Correct - EJS
<%-seoMeta%>
```

### Bot Detection Not Working

**Problem**: All requests show as bots or humans

**Solution**: Check user-agent header

```javascript
console.log(req.headers["user-agent"]);
```

### Performance Issues

**Problem**: Slow response times

**Solution**: Cache meta tags and use middleware wisely

```javascript
// Cache expensive operations
const cache = new Map();
```

---

## Next Steps

- **Vanilla JS Guide**: [VANILLA_JS_GUIDE.md](./VANILLA_JS_GUIDE.md)
- **React Guide**: [REACT_GUIDE.md](./REACT_GUIDE.md)
- **Vue.js Guide**: [VUE_GUIDE.md](./VUE_GUIDE.md)
- **Next.js Guide**: [NEXT_JS_GUIDE.md](./NEXT_JS_GUIDE.md)
- **API Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## Support

- 📖 [Full Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 [Examples](../examples/)
- 🚀 [Live Demo](../test-express-app/)

---

**License**: MIT © Hailemariyam Kebede
