# Testing M-SEO - Complete Guide

This guide explains how to run and compare all 4 M-SEO test applications to see framework-agnostic SEO in action.

## 🎯 Overview

M-SEO includes **4 complete test applications** demonstrating the same SEO features across different frameworks:

| App                  | Framework  | Port | Rendering       | Command                |
| -------------------- | ---------- | ---- | --------------- | ---------------------- |
| **test-app**         | React 18   | 3000 | Client-side     | `npm run test:react`   |
| **test-vue-app**     | Vue 3      | 3001 | Client-side     | `npm run test:vue`     |
| **test-nextjs-app**  | Next.js 14 | 3002 | Server + Client | `npm run test:nextjs`  |
| **test-express-app** | Express 4  | 3003 | Server-side     | `npm run test:express` |

## 🚀 Quick Start

### Option 1: Run Individual Apps

```bash
# React app (port 3000)
npm run test:react

# Vue app (port 3001)
npm run test:vue

# Next.js app (port 3002)
npm run test:nextjs

# Express app (port 3003)
npm run test:express
```

### Option 2: Run All Apps Simultaneously

Open 4 terminal windows and run each command:

```bash
# Terminal 1
npm run test:react

# Terminal 2
npm run test:vue

# Terminal 3
npm run test:nextjs

# Terminal 4
npm run test:express
```

Then visit:

- React: http://localhost:3000
- Vue: http://localhost:3001
- Next.js: http://localhost:3002
- Express: http://localhost:3003

## 📋 What to Test

### 1. **View Page Source** (Most Important!)

Right-click → "View Page Source" on each app to see:

#### React & Vue (Client-Side Rendering)

```html
<!-- Initial HTML has minimal meta tags -->
<head>
  <title>React/Vue App</title>
  <!-- Meta tags added by JavaScript after page load -->
</head>
```

#### Next.js (Server-Side Rendering)

```html
<!-- Full meta tags in initial HTML -->
<head>
  <title>Home - M-SEO Next.js Test</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
  <script type="application/ld+json">
    { "@context": "..." }
  </script>
</head>
```

#### Express (Server-Side Rendering)

```html
<!-- Full meta tags in initial HTML -->
<head>
  <title>Home - M-SEO Express Test</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="..." />
  <script type="application/ld+json">
    { "@context": "..." }
  </script>
</head>
```

**Key Insight**: Server-side apps (Next.js, Express) have SEO-friendly HTML from the start!

---

### 2. **Compare Structured Data**

Visit these pages and check the JSON-LD schemas:

| Page Type | React    | Vue      | Next.js                 | Express                 |
| --------- | -------- | -------- | ----------------------- | ----------------------- |
| Home      | `/`      | `/`      | `/`                     | `/`                     |
| About     | `/about` | `/about` | `/about`                | `/about`                |
| Blog Post | `/blog`  | `/blog`  | `/blog/getting-started` | `/blog/getting-started` |
| Product   | N/A      | N/A      | `/products/m-seo-pro`   | N/A                     |
| Analytics | N/A      | N/A      | `/analytics`            | `/analytics`            |

**Schemas to Look For**:

- **WebSite** (Home page)
- **Organization** (About page)
- **Article** (Blog posts)
- **Product** (Product pages - Next.js only)
- **BreadcrumbList** (Blog posts - Next.js only)

---

### 3. **Test Sitemap & Robots.txt**

| App     | Sitemap           | Robots.txt       |
| ------- | ----------------- | ---------------- |
| React   | ❌ (Static file)  | ❌ (Static file) |
| Vue     | ❌ (Static file)  | ❌ (Static file) |
| Next.js | ✅ `/sitemap.xml` | ✅ `/robots.txt` |
| Express | ✅ `/sitemap.xml` | ✅ `/robots.txt` |

Visit each URL to see dynamically generated vs static files.

---

### 4. **Test Bot Detection**

#### Express App (Best Example)

1. Visit http://localhost:3003/analytics
2. Check the terminal running Express server
3. You'll see logs like:
   ```
   [2024-12-02T12:00:00.000Z] GET /analytics - Bot: false
   ```
4. Try with curl to simulate a bot:
   ```bash
   curl -A "Googlebot/2.1" http://localhost:3003/analytics
   ```
5. Check terminal again:
   ```
   [2024-12-02T12:01:00.000Z] GET /analytics - Bot: true
   ```

#### Next.js App

1. Visit http://localhost:3002/analytics
2. Check browser console for bot detection status

---

### 5. **Compare Code Simplicity**

Open these files side-by-side to see how M-SEO works:

| Framework   | File to Open                   |
| ----------- | ------------------------------ |
| **React**   | `test-app/src/App.jsx`         |
| **Vue**     | `test-vue-app/src/App.vue`     |
| **Next.js** | `test-nextjs-app/app/page.tsx` |
| **Express** | `test-express-app/server.js`   |

Notice:

- ✅ **Same M-SEO API** across all frameworks
- ✅ **Consistent patterns** for meta tags, structured data
- ✅ **Framework-specific optimizations** (e.g., Next.js uses Metadata API)

---

### 6. **Test SEO Inspector Component**

All apps include a live SEO inspector that shows:

- All meta tags currently on the page
- Structured data (JSON-LD)
- Real-time validation

| App     | Inspector Location          |
| ------- | --------------------------- |
| React   | Bottom of every page        |
| Vue     | Bottom of every page        |
| Next.js | Bottom of every page        |
| Express | Not available (server-side) |

**How to Use**:

1. Visit any page
2. Scroll to bottom
3. Click "Show SEO Inspector"
4. See all meta tags and schemas

---

### 7. **Performance Comparison**

#### Bundle Size Test

```bash
# React
cd test-app
npm run build
# Check dist/ folder size

# Vue
cd test-vue-app
npm run build
# Check dist/ folder size

# Next.js
cd test-nextjs-app
npm run build
# Check .next/ folder size
```

#### Initial Load Test

1. Open DevTools → Network tab
2. Refresh each app
3. Compare:
   - **Time to Interactive**
   - **Bundle size**
   - **Number of requests**

**Expected Results**:

- Next.js & Express: Fastest (server-rendered)
- React & Vue: Slower (client-rendered)

---

### 8. **Security Headers Test**

Check HTTP headers in each app:

```bash
# React (no custom headers)
curl -I http://localhost:3000

# Vue (no custom headers)
curl -I http://localhost:3001

# Next.js (security headers in middleware)
curl -I http://localhost:3002
# Look for: X-Content-Type-Options, X-Frame-Options, etc.

# Express (security headers in middleware)
curl -I http://localhost:3003
# Look for: X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security
```

---

## 🔍 Deep Dive: Comparing Implementations

### Home Page Comparison

#### React (`test-app/src/App.jsx`)

```jsx
useSeo({
  title: "M-SEO React Demo",
  description: "Framework-agnostic SEO toolkit",
});

useStructuredData("WebSite", {
  name: "M-SEO React Demo",
  url: "http://localhost:3000",
});
```

#### Vue (`test-vue-app/src/App.vue`)

```vue
<script setup>
useSeo({
  title: "M-SEO Vue Demo",
  description: "Framework-agnostic SEO toolkit",
});

useStructuredData("WebSite", {
  name: "M-SEO Vue Demo",
  url: "http://localhost:3001",
});
</script>
```

#### Next.js (`test-nextjs-app/app/page.tsx`)

```tsx
export const metadata: Metadata = seo.generateMetadata({
  title: "M-SEO Next.js Test",
  description: "Framework-agnostic SEO toolkit",
});

// Structured data in component
const websiteSchema = generateStructuredData("WebSite", {
  name: "M-SEO Next.js Test",
  url: "http://localhost:3002",
});
```

#### Express (`test-express-app/server.js`)

```javascript
app.get("/", (req, res) => {
  const meta = generateMetaTagsHTML({
    title: "M-SEO Express Test",
    description: "Framework-agnostic SEO toolkit",
  });

  const websiteSchema = {
    "@type": "WebSite",
    name: "M-SEO Express Test",
  };

  res.send(renderPage({ meta, structuredData: websiteSchema }));
});
```

**Notice**: Same concepts, framework-specific implementations!

---

## 🧪 Testing Checklist

Use this checklist to systematically test all features:

### Basic SEO

- [ ] Title tag displays correctly
- [ ] Meta description present
- [ ] Canonical URL set
- [ ] Open Graph tags present
- [ ] Twitter Card tags present

### Structured Data

- [ ] WebSite schema on home page
- [ ] Organization schema on about page
- [ ] Article schema on blog posts
- [ ] JSON-LD validates at https://validator.schema.org/

### Technical SEO

- [ ] Sitemap.xml accessible
- [ ] Robots.txt accessible
- [ ] Security headers present (Next.js, Express)
- [ ] Bot detection working (Express)

### Framework-Specific

- [ ] React: Client-side rendering working
- [ ] Vue: Composition API working
- [ ] Next.js: Server-side rendering working
- [ ] Express: Server rendering working

---

## 📊 Feature Matrix

| Feature              | React     | Vue       | Next.js   | Express   |
| -------------------- | --------- | --------- | --------- | --------- |
| **Meta Tags**        | ✅        | ✅        | ✅        | ✅        |
| **Structured Data**  | ✅        | ✅        | ✅        | ✅        |
| **SSR**              | ❌        | ❌        | ✅        | ✅        |
| **Dynamic Sitemap**  | ❌        | ❌        | ✅        | ✅        |
| **Dynamic Robots**   | ❌        | ❌        | ✅        | ✅        |
| **Security Headers** | ❌        | ❌        | ✅        | ✅        |
| **Bot Detection**    | ⚠️ Client | ⚠️ Client | ✅ Server | ✅ Server |
| **SEO Inspector**    | ✅        | ✅        | ✅        | ❌        |
| **Analytics Demo**   | ❌        | ❌        | ✅        | ✅        |

---

## 🎓 Learning Objectives

After testing all 4 apps, you should understand:

1. **Framework Agnostic**: Same M-SEO API works everywhere
2. **SSR vs CSR**: Server-side rendering is better for SEO
3. **Middleware**: Next.js and Express support SEO middleware
4. **Bot Detection**: Server-side bot detection is more reliable
5. **Structured Data**: JSON-LD schemas are framework-independent
6. **Security**: Server-side apps can add security headers

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3000  # or 3001, 3002, 3003

# Kill process
kill -9 <PID>
```

### Dependencies Not Installed

```bash
# Each test app needs its own dependencies
cd test-app && npm install
cd test-vue-app && npm install
cd test-nextjs-app && npm install
cd test-express-app && npm install
```

### M-SEO Module Not Found

```bash
# Build M-SEO first
npm run build

# Then install in test apps
cd test-nextjs-app && npm install
cd test-express-app && npm install
```

---

## 📚 Next Steps

After testing all apps:

1. **Read the comparison**: See `docs/COMPARISON.md` for M-SEO vs competitors
2. **Check documentation**: Visit https://hailemariyam.github.io/m-seo/
3. **Try migrating**: Use the migration guides in `docs/COMPARISON.md`
4. **Build your own**: Start with the framework you use most

---

## 🎯 Conclusion

Running all 4 test apps demonstrates that **M-SEO truly is framework-agnostic**:

- ✅ Same concepts across all frameworks
- ✅ Same API patterns
- ✅ Framework-specific optimizations
- ✅ Enterprise features everywhere

You can confidently use M-SEO in any project, knowing the SEO implementation will be consistent and professional.

**Happy Testing!** 🚀
