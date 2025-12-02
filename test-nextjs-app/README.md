# M-SEO Next.js Test App

Test application for the M-SEO Next.js adapter with App Router.

## Quick Start

### 1. Install Dependencies

```bash
cd test-nextjs-app
npm install
```

### 2. Link M-SEO Package

From the root directory:

```bash
npm run build  # Build m-seo first
cd test-nextjs-app
npm link ..    # Link to parent m-seo package
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3002](http://localhost:3002) in your browser.

## Features Demonstrated

### Pages

- **Home** (`/`) - Basic metadata with Next.js adapter
- **Blog Post** (`/blog/example`) - Article with structured data
- **Product** (`/products/example`) - E-commerce product schema
- **Analytics** (`/analytics`) - SEO audit and bot detection demo
- **About** (`/about`) - Organization schema

### Advanced Features

- ✅ Next.js 14 App Router
- ✅ TypeScript support
- ✅ Metadata API integration
- ✅ Structured data (JSON-LD)
- ✅ Bot detection
- ✅ SEO audit engine
- ✅ Google Analytics integration
- ✅ Sitemap generation
- ✅ robots.txt
- ✅ Security headers
- ✅ Caching

## SEO Inspector

Each page includes a live SEO inspector showing:

- All meta tags
- Open Graph tags
- Twitter Cards
- Structured data
- Canonical URLs

## Testing

### Check Meta Tags

1. View page source (`Ctrl+U` or `Cmd+Option+U`)
2. Look for `<meta>` tags in `<head>`
3. Use browser DevTools > Elements

### Verify Structured Data

1. Open page
2. View source
3. Search for `application/ld+json`
4. Use [Google Rich Results Test](https://search.google.com/test/rich-results)

### Test Routes

- `/` - Home page
- `/blog/example` - Blog post
- `/products/example` - Product page
- `/analytics` - Analytics dashboard
- `/about` - About page
- `/sitemap.xml` - Sitemap
- `/robots.txt` - Robots file

## Comparison with React/Vue Tests

Like the React (`test-app`) and Vue (`test-vue-app`) examples, this demonstrates:

- Framework-specific adapter usage
- Real-time SEO inspector
- Multiple page types
- Structured data examples
- Complete SEO implementation

## Notes

- This uses the Next.js 14 App Router (not Pages Router)
- SEO metadata is generated server-side
- All pages are statically generated at build time
- Bot detection works in middleware
