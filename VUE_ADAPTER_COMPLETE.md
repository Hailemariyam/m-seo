# Vue.js Adapter Complete - VueSPAAdapter

✅ **Vue.js SPA Adapter implementation complete!**

## 📦 What's Included

### 1. **VueSPAAdapter.ts** - Main Adapter File

Location: `src/adapters/VueSPAAdapter.ts`

**Features:**

- ✅ Vue 3 Composition API support
- ✅ Reactive SEO with refs
- ✅ Composables for all SEO needs
- ✅ Vue Components for template usage
- ✅ Class-based adapter for Options API
- ✅ Vue Router integration helper
- ✅ Fully TypeScript typed

### 2. **vue-usage.ts** - Complete Examples

Location: `examples/vue-usage.ts`

**12 Complete Examples:**

1. Basic SEO with Composition API
2. Reactive SEO with Refs
3. Blog Post with Structured Data
4. E-commerce Product Page
5. SeoHead Component Usage
6. Breadcrumbs Navigation
7. Vue Router Integration
8. Class-based Usage (Options API)
9. Multi-language Support
10. Dynamic FAQ Page
11. Organization Schema
12. Event Schema

---

## 🎯 Vue Composables (Composition API)

### `useSeo(config)`

Main composable for SEO management

```vue
<script setup>
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

useSeo({
  title: "My Page",
  description: "Page description",
  keywords: ["vue", "seo"],
});
</script>
```

**Features:**

- ✅ Updates document meta tags
- ✅ Supports reactive refs
- ✅ Auto-cleanup on unmount
- ✅ Watches for changes

### `useStructuredData(schemas)`

Composable for JSON-LD structured data

```vue
<script setup>
import { useStructuredData } from "m-seo/adapters/VueSPAAdapter";

useStructuredData({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "My Article",
});
</script>
```

**Features:**

- ✅ Adds JSON-LD to document head
- ✅ Supports single or multiple schemas
- ✅ Reactive updates
- ✅ Auto-cleanup

### `useBreadcrumbs(items)`

Composable for breadcrumb navigation

```vue
<script setup>
import { useBreadcrumbs } from "m-seo/adapters/VueSPAAdapter";

useBreadcrumbs([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
]);
</script>
```

**Features:**

- ✅ Auto-generates BreadcrumbList schema
- ✅ Reactive breadcrumb updates
- ✅ SEO-friendly

### `useOpenGraph(config)`

Composable for Open Graph tags

```vue
<script setup>
import { useOpenGraph } from "m-seo/adapters/VueSPAAdapter";

useOpenGraph({
  title: "My Page",
  description: "Description",
  image: "https://example.com/image.jpg",
});
</script>
```

---

## 🧩 Vue Components

### `<SeoHead>`

Component for template-based SEO

```vue
<template>
  <SeoHead
    title="My Page"
    description="Page description"
    :keywords="['vue', 'seo']"
  />
</template>

<script setup>
import { SeoHead } from "m-seo/adapters/VueSPAAdapter";
</script>
```

### `<JsonLd>`

Component for structured data

```vue
<template>
  <JsonLd :data="structuredData" />
</template>

<script setup>
import { JsonLd } from "m-seo/adapters/VueSPAAdapter";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
};
</script>
```

### `<Breadcrumbs>`

Component for breadcrumbs

```vue
<template>
  <Breadcrumbs :items="breadcrumbItems" />
</template>

<script setup>
import { Breadcrumbs } from "m-seo/adapters/VueSPAAdapter";

const breadcrumbItems = [{ name: "Home", url: "/" }];
</script>
```

---

## 🏗️ Class-based API (Options API)

### `VueSPAAdapter` Class

For Vue 2 or Options API usage:

```vue
<script>
import { VueSPAAdapter } from "m-seo/adapters/VueSPAAdapter";

export default {
  data() {
    return {
      seoAdapter: null,
    };
  },
  mounted() {
    this.seoAdapter = new VueSPAAdapter({
      title: "My Page",
      description: "Description",
    });
    this.seoAdapter.applySeo();
  },
  unmounted() {
    this.seoAdapter.clear();
  },
};
</script>
```

**Methods:**

- `updateSeo(config)` - Update SEO configuration
- `applySeo()` - Apply SEO to document
- `addStructuredData(schema)` - Add JSON-LD
- `clear()` - Remove all SEO tags

---

## 🛣️ Vue Router Integration

### `setupSeoRouter(router, getSeoConfig)`

Automatic SEO on route changes:

```typescript
// router/index.ts
import { createRouter } from 'vue-router';
import { setupSeoRouter } from 'm-seo/adapters/VueSPAAdapter';

const router = createRouter({ ... });

setupSeoRouter(router, (route) => ({
  title: `${route.meta.title} - My Site`,
  description: route.meta.description,
  canonical: `https://example.com${route.path}`
}));

export default router;
```

---

## 🎨 Features Comparison

| Feature            | React Adapter            | Vue Adapter                     |
| ------------------ | ------------------------ | ------------------------------- |
| Composables/Hooks  | ✅ `useSeo()`            | ✅ `useSeo()`                   |
| Components         | ✅ `<SeoHead>`           | ✅ `<SeoHead>`                  |
| Structured Data    | ✅ `useStructuredData()` | ✅ `useStructuredData()`        |
| Breadcrumbs        | ✅ `useBreadcrumbs()`    | ✅ `useBreadcrumbs()`           |
| Class-based API    | ✅ `ReactSPAAdapter`     | ✅ `VueSPAAdapter`              |
| HOC/Directives     | ✅ `withSeo()`           | ⚠️ Not needed (use composables) |
| Router Integration | ⚠️ Manual                | ✅ `setupSeoRouter()`           |
| Reactive Updates   | ✅ Via deps              | ✅ Via refs/watch               |
| TypeScript         | ✅ Full support          | ✅ Full support                 |

---

## 📚 Usage Examples

### Example 1: Simple Page

```vue
<template>
  <div>
    <h1>Home</h1>
    <p>Welcome!</p>
  </div>
</template>

<script setup>
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

useSeo({
  title: "Home - My Site",
  description: "Welcome to my site",
});
</script>
```

### Example 2: Blog Post

```vue
<template>
  <article>
    <h1>{{ post.title }}</h1>
    <div v-html="post.content"></div>
  </article>
</template>

<script setup>
import { ref } from "vue";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const post = ref({
  title: "My Blog Post",
  content: "<p>Content...</p>",
  publishedAt: "2025-11-24",
});

useSeo({
  title: post.value.title,
  description: "Blog post description",
});

useStructuredData({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.value.title,
  datePublished: post.value.publishedAt,
});
</script>
```

### Example 3: Product Page

```vue
<template>
  <div>
    <h1>{{ product.name }}</h1>
    <p>${{ product.price }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const product = ref({
  name: "Product Name",
  price: 99.99,
  image: "https://example.com/product.jpg",
});

useSeo({
  title: product.value.name,
  ogImage: product.value.image,
});

useStructuredData({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.value.name,
  offers: {
    "@type": "Offer",
    price: product.value.price,
  },
});
</script>
```

---

## 🚀 Getting Started

### 1. Install m-seo

```bash
npm install m-seo
```

### 2. Import and Use

```vue
<script setup>
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

useSeo({
  title: "My Page",
  description: "Description",
});
</script>
```

### 3. For Vue Router Integration

```typescript
// router/index.ts
import { setupSeoRouter } from "m-seo/adapters/VueSPAAdapter";

setupSeoRouter(router, (route) => ({
  title: route.meta.title,
  description: route.meta.description,
}));
```

---

## ✨ Key Differences from React Adapter

### 1. **Reactive Updates**

- **React:** Uses dependency array
- **Vue:** Uses reactive refs and watchers

```vue
<!-- Vue - Automatically reactive -->
<script setup>
import { ref } from "vue";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

const title = ref("Initial Title");

useSeo({
  title: title.value, // Auto-updates when title changes
});

// Update title - SEO updates automatically!
title.value = "New Title";
</script>
```

### 2. **Router Integration**

- **React:** Manual setup
- **Vue:** Built-in `setupSeoRouter()` helper

### 3. **No HOC Needed**

- **React:** Uses `withSeo()` HOC
- **Vue:** Composables are sufficient

---

## 📝 TypeScript Support

Full TypeScript support with types:

```typescript
import type { SeoConfig } from "m-seo/core/SeoEngine";
import type { StructuredData } from "m-seo/core/StructuredDataManager";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const config: SeoConfig = {
  title: "My Page",
  description: "Description",
};

useSeo(config);
```

---

## ✅ Status

- ✅ All composables implemented (`useSeo`, `useStructuredData`, `useBreadcrumbs`, `useOpenGraph`)
- ✅ All components implemented (`SeoHead`, `JsonLd`, `Breadcrumbs`)
- ✅ Class-based adapter implemented (`VueSPAAdapter`)
- ✅ Router integration implemented (`setupSeoRouter`)
- ✅ 10 complete .vue examples created in `/examples/vue-examples/`
- ✅ Full test app created in `/test-vue-app/` with 5 working pages
- ✅ TypeScript fully typed with .d.ts files
- ✅ Build successful (npm run build)
- ✅ All tests passing (test-vue-adapter.mjs)
- ✅ Direct ESM imports (Vite compatible)
- ✅ Documentation complete (docs/VUE_GUIDE.md)
- ✅ README.md updated with Vue examples
- ✅ QUICK_REFERENCE.md updated
- ✅ Ready for production

---

## 📦 Files Created/Updated

1. **src/adapters/VueSPAAdapter.ts** - Main adapter (542 lines)

   - Direct Vue imports from 'vue' package
   - 4 composables, 3 components, 1 class, 1 router helper
   - Full reactive support with watch, computed, isRef

2. **examples/vue-examples/** - Real .vue Single File Components

   - App.vue, HomePage.vue, BlogPost.vue, ProductPage.vue
   - BreadcrumbPage.vue, FAQPage.vue, router.ts, main.ts
   - index.html, README.md

3. **test-vue-app/** - Complete working test application

   - Vite 5.2.0 + Vue 3.4.0 + Vue Router 4.3.0
   - 5 example pages demonstrating all features
   - Running on http://localhost:3001
   - All pages working without errors

4. **test-vue-adapter.mjs** - Node.js test verification script

   - 6 test suites: imports, class, comparison, types, bundle, examples
   - All tests passing ✅

5. **docs/VUE_GUIDE.md** - Complete Vue documentation (500+ lines)

   - All composables documented
   - Real-world examples (blog, product, FAQ)
   - Vue Router integration
   - TypeScript support
   - Best practices

6. **README.md** - Updated with Vue section

   - Quick start example
   - Link to Vue guide
   - Test app instructions

7. **docs/QUICK_REFERENCE.md** - Added Vue examples

---

## 🎯 Next Steps

1. **Test in a Vue 3 project:**

   ```bash
   npm link m-seo
   cd your-vue-project
   npm link m-seo
   ```

2. **Update documentation:**

   - Add Vue examples to `docs-site/examples.md`
   - Add Vue guide to `docs-site/getting-started.md`
   - Add Vue API reference to `docs-site/api.md`

3. **Publish new version:**
   ```bash
   npm version patch
   npm publish
   ```

---

**Vue.js adapter is complete and ready to use! 🎉**
