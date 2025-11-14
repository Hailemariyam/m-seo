# Testing M-SEO with React

Complete guide for testing and verifying that M-SEO is working correctly in your React application.

## 🚀 Quick Test (5 minutes)

### Option 1: Using the Built-in Test App

1. **Start the test server:**

   ```bash
   npm run test:react
   ```

   This uses `npx serve` which is a zero-config static file server.

   **Alternative methods:**

   ```bash
   # Using http-server (another Node.js option)
   npx http-server test-app -p 3000

   # Using Python (if Node isn't available)
   python3 -m http.server 3000 --directory test-app

   # Using PHP
   php -S localhost:3000 -t test-app
   ```

2. **Open your browser:**

   ```
   http://localhost:3000
   ```

3. **Navigate through the test pages:**

   - 🏠 Home - Basic SEO with `useSeo` hook
   - 📝 Blog - Structured data with `useStructuredData`
   - 🛍️ Product - E-commerce schema
   - 🔗 Breadcrumbs - Navigation with `useBreadcrumbs`

4. **Verify SEO is working:**
   - See the **Live SEO Inspector** section on each page
   - It shows all meta tags, links, and structured data in real-time

### Option 2: Manual Browser Verification

1. **Open DevTools** (F12 or right-click → Inspect)

2. **Check the `<head>` section:**

   - Go to **Elements** tab
   - Expand the `<head>` tag
   - Look for tags with `data-mseo` attribute:

   ```html
   <meta data-mseo="true" name="description" content="..." />
   <meta data-mseo="true" property="og:title" content="..." />
   <link data-mseo="true" rel="canonical" href="..." />
   ```

3. **Check structured data:**
   - Search for `<script type="application/ld+json"` with `data-mseo-ld` attribute
   - Verify the JSON-LD schema is present

## 🔍 Detailed Verification Steps

### 1. Verify Meta Tags

Open the browser console and run:

```javascript
// Check all M-SEO meta tags
console.table(
  Array.from(document.querySelectorAll("meta[data-mseo]")).map((el) => ({
    name: el.getAttribute("name") || el.getAttribute("property"),
    content: el.getAttribute("content"),
  }))
);
```

**Expected output:** Table showing all meta tags (title, description, Open Graph, Twitter cards, etc.)

### 2. Verify Link Tags

```javascript
// Check canonical and other links
console.table(
  Array.from(document.querySelectorAll("link[data-mseo]")).map((el) => ({
    rel: el.getAttribute("rel"),
    href: el.getAttribute("href"),
  }))
);
```

**Expected output:** Canonical link and alternate language links

### 3. Verify Structured Data

```javascript
// Check JSON-LD structured data
Array.from(document.querySelectorAll("script[data-mseo-ld]")).forEach(
  (el, i) => {
    console.log(`Schema ${i + 1}:`, JSON.parse(el.textContent));
  }
);
```

**Expected output:** JSON objects with @type, @context, and schema data

### 4. Verify Dynamic Updates

1. Navigate between pages using the test app navigation
2. Watch the **Live SEO Inspector** update in real-time
3. Check DevTools Elements tab - tags should change automatically

**Expected behavior:**

- Old tags are removed
- New tags appear instantly
- No duplicate tags

## 🧪 Testing in Your Own React App

### Step 1: Create a Test Component

```tsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function TestPage() {
  // Add SEO
  useSeo({
    title: "Test Page",
    description: "Testing M-SEO",
    keywords: ["test", "seo"],
    canonical: "https://example.com/test",
    ogImage: "https://example.com/test.jpg",
  });

  // Add structured data
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Test Page",
  });

  return (
    <div>
      <h1>Test Page</h1>
      <p>Check the page source to see SEO tags!</p>
    </div>
  );
}
```

### Step 2: Verify in Browser

1. Render the component
2. Open DevTools (F12)
3. Go to Elements tab
4. Check `<head>` for:
   - `<meta data-mseo="true" name="description" content="Testing M-SEO">`
   - `<meta data-mseo="true" property="og:title" content="Test Page">`
   - `<link data-mseo="true" rel="canonical" href="https://example.com/test">`
   - `<script data-mseo-ld="true" type="application/ld+json">`

## 🌐 Testing SEO Tools

### Google Rich Results Test

1. Build your app: `npm run build`
2. Deploy to a public URL (or use ngrok for local testing)
3. Visit: https://search.google.com/test/rich-results
4. Enter your URL
5. Check for structured data validation

### Facebook Sharing Debugger

1. Visit: https://developers.facebook.com/tools/debug/
2. Enter your page URL
3. Click "Scrape Again"
4. Verify Open Graph tags are detected:
   - `og:title`
   - `og:description`
   - `og:image`
   - `og:type`

### Twitter Card Validator

1. Visit: https://cards-dev.twitter.com/validator
2. Enter your page URL
3. Verify Twitter Card tags:
   - `twitter:card`
   - `twitter:title`
   - `twitter:description`
   - `twitter:image`

## ✅ Checklist: Is M-SEO Working?

Use this checklist to verify everything is working:

- [ ] **Title updates** when navigating between pages
- [ ] **Meta tags appear** in `<head>` with `data-mseo` attribute
- [ ] **Old tags are removed** when changing pages (no duplicates)
- [ ] **Canonical link** is present and correct
- [ ] **Open Graph tags** exist (og:title, og:description, og:image)
- [ ] **Twitter Card tags** exist (twitter:card, twitter:title, twitter:image)
- [ ] **Structured data** appears as `<script type="application/ld+json">`
- [ ] **JSON-LD is valid** (paste into JSON validator)
- [ ] **Live SEO Inspector** updates in test app
- [ ] **No console errors** related to M-SEO

## 🐛 Troubleshooting

### Tags Not Appearing

**Problem:** No meta tags with `data-mseo` attribute

**Solutions:**

1. Check that you're calling `useSeo` inside a React component
2. Verify the component is actually rendering
3. Check browser console for errors
4. Make sure React is installed: `npm install react react-dom`

### Tags Not Updating

**Problem:** Tags don't change when navigating

**Solutions:**

1. Add dependencies to `useSeo`: `useSeo(config, [dependency])`
2. Ensure cleanup is happening (check DevTools - old tags should be removed)
3. Verify you're using React 16.8+ (hooks require this version)

### Duplicate Tags

**Problem:** Multiple identical meta tags

**Solutions:**

1. Make sure you're only using ONE SEO method per page (either hook OR component, not both)
2. Check that you don't have multiple instances of the same component
3. Verify cleanup functions are running

### Structured Data Not Valid

**Problem:** Google Rich Results Test shows errors

**Solutions:**

1. Paste JSON into https://jsonlint.com/ to check syntax
2. Use https://validator.schema.org/ to validate schema
3. Check that all required properties are present
4. Verify @context and @type are correct

### React Not Found Error

**Problem:** "React is required to use ReactSPAAdapter"

**Solutions:**

```bash
npm install react react-dom
# or
yarn add react react-dom
```

## 📊 Performance Testing

### Check Tag Injection Speed

```javascript
console.time("seo-injection");
// Navigate to a page
// Check console - should be < 50ms
console.timeEnd("seo-injection");
```

### Check Memory Leaks

1. Open DevTools → Performance tab
2. Start recording
3. Navigate between pages multiple times
4. Stop recording
5. Check memory usage - should be stable (no increasing trend)

## 🎯 Production Testing

Before deploying to production:

1. **Build the app:** `npm run build`
2. **Test in production mode:** Deploy to staging/preview
3. **Run all verification steps** above
4. **Test with real SEO tools:**
   - Google Search Console
   - Google Rich Results Test
   - Facebook Sharing Debugger
   - Twitter Card Validator
5. **Monitor in production:**
   - Check Google Search Console for indexing
   - Verify social sharing previews work
   - Test canonical URLs resolve correctly

## 🔗 Additional Resources

- **Test App:** `/test-app/` directory
- **React Examples:** `/examples/react-usage.tsx`
- **React Guide:** `/docs/REACT_GUIDE.md`
- **GitHub Issues:** Report bugs at https://github.com/Hailemariyam/m-seo/issues

## 💡 Quick Test Commands

```bash
# Run test app
npm run test:react

# Build library
npm run build

# Watch mode (auto-rebuild)
npm run dev

# Run vanilla test
npm test
```

## ✨ What Success Looks Like

When M-SEO is working correctly:

1. ✅ Page title changes in browser tab
2. ✅ View source shows proper meta tags
3. ✅ Google can crawl and index the page
4. ✅ Social media sharing shows rich previews
5. ✅ Structured data validates successfully
6. ✅ No duplicate or conflicting tags
7. ✅ Tags update instantly when navigating
8. ✅ No console errors or warnings

---

**Need help?** Open an issue at https://github.com/Hailemariyam/m-seo/issues
