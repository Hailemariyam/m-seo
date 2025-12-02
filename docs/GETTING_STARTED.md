# 🚀 Getting Started with M-SEO

Welcome to M-SEO! This guide will help you get started quickly, regardless of your framework choice.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Choose Your Framework](#choose-your-framework)
- [Installation](#installation)
- [Basic Setup](#basic-setup)
- [Framework-Specific Guides](#framework-specific-guides)
- [Live Examples](#live-examples)
- [Next Steps](#next-steps)

---

## Quick Start

### 5-Minute Setup

1. **Install M-SEO**

   ```bash
   npm install m-seo
   ```

2. **Add to your app**

   ```javascript
   import { MetaManager } from "m-seo";

   const seo = new MetaManager();
   seo.setTitle("My Awesome Website");
   seo.setDescription("Best website ever!");
   ```

3. **You're done!** 🎉

---

## Choose Your Framework

M-SEO works with **any** JavaScript framework. Choose based on your project:

### 🌐 Vanilla JavaScript

**Best for**: Static sites, landing pages, portfolios

```html
<script type="module">
  import { MetaManager } from "https://unpkg.com/m-seo@latest/dist/index.js";

  const seo = new MetaManager();
  seo.setTitle("My Site");
</script>
```

[→ Vanilla JS Guide](./VANILLA_JS_GUIDE.md)

---

### ⚛️ React

**Best for**: SPAs, dynamic web apps, admin panels

```tsx
import { MetaManager } from "m-seo";

function HomePage() {
  React.useEffect(() => {
    const seo = new MetaManager();
    seo.setTitle("Home - My React App");
  }, []);

  return <div>Welcome!</div>;
}
```

[→ React Guide](./REACT_GUIDE.md) | [Live Demo](../test-app/)

---

### 🟢 Vue.js

**Best for**: Progressive web apps, interactive UIs

```vue
<script setup>
import { onMounted } from "vue";
import { MetaManager } from "m-seo";

onMounted(() => {
  const seo = new MetaManager();
  seo.setTitle("Home - My Vue App");
});
</script>
```

[→ Vue Guide](./VUE_GUIDE.md) | [Live Demo](../test-vue-app/)

---

### ▲ Next.js

**Best for**: SEO-critical sites, blogs, e-commerce

```tsx
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: "https://example.com",
  siteName: "My Site",
});
```

[→ Next.js Guide](./NEXT_JS_GUIDE.md) | [Live Demo](../test-nextjs-app/)

---

### 🚂 Express.js

**Best for**: Server-side rendering, APIs with bot detection

```javascript
import express from "express";
import { BotDetection } from "m-seo";

app.use((req, res, next) => {
  const isBot = BotDetection.isBot(req.headers["user-agent"]);
  req.isBot = isBot;
  next();
});
```

[→ Express Guide](./EXPRESS_GUIDE.md) | [Live Demo](../test-express-app/)

---

## Installation

### NPM/Yarn/PNPM

```bash
# NPM
npm install m-seo

# Yarn
yarn add m-seo

# PNPM
pnpm add m-seo
```

### CDN (Browser)

```html
<!-- Latest version -->
<script type="module">
  import {
    MetaManager,
    BotDetection,
  } from "https://unpkg.com/m-seo@latest/dist/index.js";
</script>

<!-- Specific version (recommended for production) -->
<script type="module">
  import { MetaManager } from "https://unpkg.com/m-seo@1.1.1/dist/index.js";
</script>
```

---

## Basic Setup

### 1. Basic Meta Tags

Every website needs these essential meta tags:

```javascript
import { MetaManager } from "m-seo";

const seo = new MetaManager();

// Essential tags
seo.setTitle("Your Page Title");
seo.setDescription("Your page description (under 160 characters)");
seo.setCanonical("https://yoursite.com/page");
seo.setKeywords(["keyword1", "keyword2", "keyword3"]);
```

### 2. Social Media Sharing

Make your links look great when shared:

```javascript
// Open Graph (Facebook, LinkedIn, etc.)
seo.setOpenGraph({
  title: "Your Page Title",
  description: "Your description",
  type: "website",
  url: "https://yoursite.com/page",
  image: "https://yoursite.com/og-image.jpg",
  siteName: "Your Site Name",
});

// Twitter Card
seo.setTwitterCard({
  card: "summary_large_image",
  site: "@yourtwitter",
  title: "Your Page Title",
  description: "Your description",
  image: "https://yoursite.com/twitter-image.jpg",
});
```

### 3. Bot Detection

Optimize content delivery for search engines:

```javascript
import { BotDetection } from "m-seo";

const userAgent = navigator.userAgent; // or req.headers['user-agent']
const isBot = BotDetection.isBot(userAgent);

if (isBot) {
  // Serve static, SEO-optimized content
  const botInfo = BotDetection.getBotInfo(userAgent);
  console.log(`Detected: ${botInfo?.name}`); // e.g., "Googlebot"
} else {
  // Serve interactive content for humans
}
```

### 4. Structured Data (Rich Snippets)

Help search engines understand your content:

```javascript
// Article schema
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Your Article Title",
  description: "Article description",
  image: "https://yoursite.com/article-image.jpg",
  datePublished: "2025-01-01",
  author: {
    "@type": "Person",
    name: "Author Name",
  },
};

// Add to page
const script = document.createElement("script");
script.type = "application/ld+json";
script.textContent = JSON.stringify(articleSchema);
document.head.appendChild(script);
```

---

## Framework-Specific Guides

### Detailed Documentation

| Framework      | Guide                               | Live Demo                                  | Difficulty      |
| -------------- | ----------------------------------- | ------------------------------------------ | --------------- |
| **Vanilla JS** | [View Guide](./VANILLA_JS_GUIDE.md) | [Run Example](../examples/test-vanilla.js) | ⭐ Easy         |
| **React**      | [View Guide](./REACT_GUIDE.md)      | [Run Demo](../test-app/)                   | ⭐⭐ Moderate   |
| **Vue.js**     | [View Guide](./VUE_GUIDE.md)        | [Run Demo](../test-vue-app/)               | ⭐⭐ Moderate   |
| **Next.js**    | [View Guide](./NEXT_JS_GUIDE.md)    | [Run Demo](../test-nextjs-app/)            | ⭐⭐⭐ Advanced |
| **Express.js** | [View Guide](./EXPRESS_GUIDE.md)    | [Run Demo](../test-express-app/)           | ⭐⭐ Moderate   |

---

## Live Examples

### Run Test Applications

All test applications are fully functional and ready to run:

```bash
# React Test App (Port 3000)
cd test-app
npm install
npm run dev

# Vue.js Test App (Port 3001)
cd test-vue-app
npm install
npm run dev

# Next.js Test App (Port 3002)
cd test-nextjs-app
npm install
npm run dev

# Express.js Test App (Port 3003)
cd test-express-app
npm install
node server.js
```

### What's Included in Test Apps

✅ Basic meta tags setup
✅ Open Graph configuration
✅ Twitter Card integration
✅ Structured data examples
✅ Bot detection
✅ Dynamic SEO updates
✅ Multiple page examples

---

## Next Steps

### 🎓 Learn More

1. **Read Framework Guide**: Choose your framework guide above
2. **Explore Examples**: Check the `/examples` folder
3. **Run Test Apps**: Try the live demos
4. **API Reference**: [Quick Reference Guide](./QUICK_REFERENCE.md)

### 📚 Advanced Topics

- **Internationalization**: [I18N Guide](./INTERNATIONALIZATION_GUIDE.md)
- **Google Analytics**: [Analytics Guide](./GOOGLE_ANALYTICS_GUIDE.md)
- **SEO Audit**: [Audit Engine Guide](./SEO_AUDIT_ENGINE_GUIDE.md)
- **URL Management**: [URL Manager Guide](./URL_MANAGER_GUIDE.md)

### 🆚 Comparisons

Coming from another library?

- **vs next-seo**: [Comparison Guide](./COMPARISON.md)
- **vs react-helmet**: [Comparison Guide](./COMPARISON.md)
- **vs vue-meta**: [Comparison Guide](./COMPARISON.md)

---

## Common Use Cases

### Blog/Content Site

```javascript
const seo = new MetaManager();
seo.setTitle("Article Title - Blog");
seo.setDescription("Article excerpt...");
seo.setCanonical("https://blog.com/article");

// Add Article schema for rich snippets
```

[→ Full Blog Example](./REACT_GUIDE.md#blog-post-with-full-seo)

### E-commerce Product

```javascript
seo.setTitle("Product Name - $99.99");
seo.setDescription("Product description...");
seo.setOpenGraph({
  type: "product",
  image: "product-image.jpg",
});

// Add Product schema with pricing
```

[→ Full Product Example](./REACT_GUIDE.md#e-commerce-product-with-rich-snippets)

### Landing Page

```javascript
seo.setTitle("Best Product Ever | Company Name");
seo.setDescription("Convert visitors with perfect SEO");
seo.setKeywords(["product", "solution", "industry"]);
```

[→ Full Landing Page Example](./VANILLA_JS_GUIDE.md#complete-single-page-example)

### Multi-language Site

```javascript
// Set language
document.documentElement.lang = 'es';

// Add alternate links
<link rel="alternate" hreflang="en" href="https://site.com/en" />
<link rel="alternate" hreflang="es" href="https://site.com/es" />
```

[→ Full i18n Example](./INTERNATIONALIZATION_GUIDE.md)

---

## Troubleshooting

### Common Issues

**Meta tags not showing?**

- Check browser DevTools → Elements → `<head>`
- Make sure M-SEO is imported correctly
- Verify code runs after DOM loads

**SEO not updating?**

- For React/Vue: Check dependency arrays in hooks
- For SPAs: Make sure to call SEO on route changes
- Clear browser cache

**TypeScript errors?**

```bash
npm install --save-dev @types/node
```

**Need Help?**

- 📖 [Full Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 [Examples](../examples/)

---

## Testing Your SEO

### Validation Tools

1. **Google Rich Results Test**
   https://search.google.com/test/rich-results

2. **Facebook Sharing Debugger**
   https://developers.facebook.com/tools/debug/

3. **Twitter Card Validator**
   https://cards-dev.twitter.com/validator

4. **LinkedIn Post Inspector**
   https://www.linkedin.com/post-inspector/

### What to Check

✅ Page title shows correctly
✅ Meta description under 160 characters
✅ Open Graph image is 1200x630px
✅ Canonical URL is absolute (includes https://)
✅ Structured data validates
✅ No duplicate meta tags

---

## Best Practices

### ✅ Do's

- Use absolute URLs for canonical tags
- Keep descriptions under 160 characters
- Use 1200x630px for Open Graph images
- Add structured data for rich snippets
- Test on multiple social platforms
- Update SEO on route changes (SPAs)

### ❌ Don'ts

- Don't stuff keywords
- Don't duplicate meta tags
- Don't forget mobile optimization
- Don't skip canonical URLs
- Don't use relative URLs in meta tags

---

## Support & Community

### Get Help

- 📖 **Documentation**: [Full Docs](../README.md)
- 💬 **Issues**: [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 **Examples**: [Code Examples](../examples/)
- 🚀 **Live Demos**: Run test applications

### Contribute

M-SEO is open source! Contributions welcome:

```bash
git clone https://github.com/Hailemariyam/m-seo.git
cd m-seo
npm install
npm run build
npm test
```

[Contributing Guide](../CONTRIBUTING.md)

---

## Quick Reference Card

```javascript
import { MetaManager, BotDetection } from 'm-seo';

// Basic Setup
const seo = new MetaManager();
seo.setTitle('Page Title');
seo.setDescription('Description');
seo.setCanonical('https://site.com/page');

// Social Media
seo.setOpenGraph({ title, description, image, url });
seo.setTwitterCard({ card: 'summary_large_image', ... });

// Bot Detection
const isBot = BotDetection.isBot(userAgent);
const botInfo = BotDetection.getBotInfo(userAgent);

// Structured Data
const schema = { '@context': 'https://schema.org', '@type': 'Article', ... };
```

---

**Ready to optimize your SEO?** Choose your framework guide above and start building! 🚀

---

**License**: MIT © Hailemariyam Kebede
