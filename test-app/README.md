# Quick Start: Testing M-SEO with React

Follow these steps to test the React SEO functionality:

## 🚀 Quick Test (2 minutes)

### 1. Start the Test Server

```bash
npm run test:react
```

This uses `npx serve` to start a local server at `http://localhost:3000`

**Alternative methods:**

```bash
# Using npx serve (recommended)
npx serve test-app -p 3000

# Using Node's http-server
npx http-server test-app -p 3000

# Using Python (if Node isn't available)
python3 -m http.server 3000 --directory test-app

# Using PHP (if available)
php -S localhost:3000 -t test-app
```

### 2. Open in Browser

Navigate to: **http://localhost:3000**

### 3. See It Working!

You'll see a beautiful test app with 4 example pages:

- **🏠 Home** - Basic SEO with `useSeo` hook
- **📝 Blog** - Blog post with structured data
- **🛍️ Product** - E-commerce product schema
- **🔗 Breadcrumbs** - Navigation breadcrumbs

Each page has a **Live SEO Inspector** showing all active meta tags and structured data in real-time!

## 🔍 Verify It's Working

### Method 1: Live Inspector (Easiest)

Just scroll down on any test page and see the "🔍 Live SEO Inspector" section showing:

- ✅ All meta tags
- ✅ Link tags (canonical, etc.)
- ✅ Structured data (JSON-LD)

### Method 2: Browser DevTools

1. Press **F12** to open DevTools
2. Go to **Elements** tab
3. Look in the `<head>` section for:
   - `<meta data-mseo="true" ...>` tags
   - `<link data-mseo="true" ...>` tags
   - `<script data-mseo-ld="true" type="application/ld+json">` tags

### Method 3: Console Commands

Open the browser console (F12 → Console) and paste:

```javascript
// Show all meta tags
console.table(
  Array.from(document.querySelectorAll("meta[data-mseo]")).map((el) => ({
    name: el.getAttribute("name") || el.getAttribute("property"),
    content: el.getAttribute("content"),
  }))
);

// Show structured data
document.querySelectorAll("script[data-mseo-ld]").forEach((el, i) => {
  console.log(`Schema ${i + 1}:`, JSON.parse(el.textContent));
});
```

## ✅ What You Should See

When working correctly:

✅ **Browser tab title** changes when you navigate between pages
✅ **Meta tags appear** in DevTools with `data-mseo` attribute
✅ **Old tags are removed** when changing pages (no duplicates)
✅ **Structured data** appears as JSON-LD scripts
✅ **Live Inspector** updates in real-time

## 🎯 Use in Your Own React App

Once you've verified it works, use it in your app:

```tsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function MyPage() {
  useSeo({
    title: "My Page Title",
    description: "My page description",
    keywords: ["react", "seo"],
    canonical: "https://example.com/my-page",
    ogImage: "https://example.com/image.jpg",
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "My Page",
  });

  return <div>Your content here</div>;
}
```

## 📚 More Information

- **Full Testing Guide:** See `TESTING.md`
- **React Guide:** See `docs/REACT_GUIDE.md`
- **Examples:** See `examples/react-usage.tsx`

## 🐛 Not Working?

1. Make sure the server is running: `npm run test:react`
2. Check browser console for errors
3. Verify you're using a modern browser (Chrome, Firefox, Safari, Edge)
4. See `TESTING.md` for detailed troubleshooting

---

**That's it!** 🎉 You now have a working React SEO solution.
