# M-SEO Express.js Test Application

A comprehensive Express.js server demonstrating M-SEO integration for traditional Node.js applications.

## Features Demonstrated

### ✅ Server-Side Rendering

- Full HTML control with Express
- Meta tags generated server-side
- SEO-friendly from the first request
- No client-side JavaScript required for SEO

### ✅ Core SEO Features

- Meta tags (title, description, keywords)
- Open Graph tags for social sharing
- Twitter Card integration
- Canonical URLs
- Structured data (JSON-LD)
- Dynamic sitemap generation
- Robots.txt configuration

### ✅ Express Specific

- Middleware integration
- Bot detection middleware
- Security headers middleware
- Request logging
- Static file serving
- API endpoints

### ✅ Enterprise Features

- Bot detection on every request
- User agent analysis
- Request header inspection
- Security headers (CSP, X-Frame-Options, etc.)
- Health check endpoint

## Installation

```bash
cd test-express-app
npm install
```

## Running

### Development Mode (with auto-reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Or from root directory:

```bash
npm run test:express
```

Visit: **http://localhost:3003**

## Routes

| Route          | Description          | Schema Type  |
| -------------- | -------------------- | ------------ |
| `/`            | Home page            | WebSite      |
| `/about`       | About page           | Organization |
| `/analytics`   | Analytics dashboard  | None         |
| `/blog/:slug`  | Blog posts           | Article      |
| `/sitemap.xml` | XML sitemap          | N/A          |
| `/robots.txt`  | Robots configuration | N/A          |
| `/api/health`  | Health check API     | N/A          |

## M-SEO Adapter Usage

### Basic Setup

```javascript
import { createExpressAdapter } from "m-seo/adapters/express";

const seo = createExpressAdapter({
  defaultMeta: {
    siteName: "M-SEO Express Test",
    locale: "en_US",
  },
});
```

### Generate Meta Tags

```javascript
const meta = seo.generateMetaTags({
  title: "My Page Title",
  description: "Page description",
  canonical: "http://localhost:3003/page",
  openGraph: {
    title: "OG Title",
    description: "OG Description",
    type: "website",
  },
});

// Returns HTML string to insert in <head>
```

### Generate Sitemap

```javascript
const sitemap = seo.generateSitemap([
  { url: "http://localhost:3003/", changefreq: "daily", priority: 1.0 },
  { url: "http://localhost:3003/about", changefreq: "monthly", priority: 0.8 },
]);

res.header("Content-Type", "application/xml");
res.send(sitemap);
```

### Generate Robots.txt

```javascript
const robots = seo.generateRobotsTxt({
  userAgent: "*",
  allow: "/",
  disallow: ["/admin/", "/api/"],
  sitemap: "http://localhost:3003/sitemap.xml",
});

res.type("text/plain");
res.send(robots);
```

## Middleware

### Bot Detection

```javascript
import { BotDetector } from "m-seo";

const botDetector = new BotDetector();

app.use((req, res, next) => {
  const userAgent = req.headers["user-agent"] || "";
  req.isBot = botDetector.isBot(userAgent);
  next();
});
```

### Security Headers

```javascript
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});
```

## Structured Data Examples

### WebSite Schema (Home Page)

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "M-SEO Express Test",
  "url": "http://localhost:3003",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "http://localhost:3003/search?q={search_term_string}"
  }
}
```

### Organization Schema (About Page)

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "M-SEO",
  "url": "http://localhost:3003",
  "sameAs": ["https://github.com/Hailemariyam/m-seo"]
}
```

### Article Schema (Blog Posts)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Getting Started with M-SEO",
  "author": {
    "@type": "Person",
    "name": "M-SEO Team"
  },
  "datePublished": "2024-12-01"
}
```

## Testing SEO

1. **View Source**: Right-click → View Page Source to see meta tags
2. **Check Headers**: Use browser DevTools → Network tab
3. **Test Sitemap**: Visit http://localhost:3003/sitemap.xml
4. **Test Robots**: Visit http://localhost:3003/robots.txt
5. **Google Rich Results**: https://search.google.com/test/rich-results
6. **Schema Validator**: https://validator.schema.org/

## API Endpoints

### Health Check

```bash
curl http://localhost:3003/api/health
```

Response:

```json
{
  "status": "ok",
  "timestamp": "2024-12-02T12:00:00.000Z",
  "isBot": false
}
```

## Bot Detection

The server automatically detects bots and logs requests:

```
[2024-12-02T12:00:00.000Z] GET / - Bot: false
[2024-12-02T12:01:00.000Z] GET / - Bot: true
```

Common bots detected:

- Googlebot
- Bingbot
- Facebook bot
- Twitter bot
- LinkedIn bot
- And many more...

## Advantages Over Client-Side Rendering

1. **SEO**: Meta tags present on first load
2. **Performance**: No JavaScript needed for content
3. **Compatibility**: Works without JavaScript enabled
4. **Control**: Full control over HTML output
5. **Security**: Server-side validation and headers

## Framework Comparison

| Test App         | Framework | Port | Rendering       |
| ---------------- | --------- | ---- | --------------- |
| test-app         | React     | 3000 | Client-side     |
| test-vue-app     | Vue       | 3001 | Client-side     |
| test-nextjs-app  | Next.js   | 3002 | Server + Client |
| test-express-app | Express   | 3003 | Server-side     |

All use the same M-SEO library with framework-specific adapters! 🎯

## Learn More

- [M-SEO Documentation](https://hailemariyam.github.io/m-seo/)
- [Express.js Guide](https://expressjs.com/)
- [Schema.org](https://schema.org/)

## Next Steps

1. Run the server
2. Visit each route and view source
3. Check the console logs for bot detection
4. Test the sitemap and robots.txt
5. Compare with React, Vue, and Next.js implementations
