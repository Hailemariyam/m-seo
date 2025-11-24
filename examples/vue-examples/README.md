# Vue.js Examples for m-seo

This directory contains **real, runnable Vue 3 examples** (not commented code like React).

## 📁 Files

### Page Components (`.vue` files)

- **HomePage.vue** - Basic SEO setup
- **BlogPost.vue** - Blog post with Article schema
- **ProductPage.vue** - E-commerce product with Product schema
- **BreadcrumbPage.vue** - Breadcrumb navigation
- **FAQPage.vue** - FAQ with FAQPage schema

### App Files

- **App.vue** - Main app component with navigation
- **router.ts** - Vue Router setup with SEO integration
- **main.ts** - App entry point
- **index.html** - HTML template

## 🚀 How to Run

### Option 1: With Vite (Recommended)

1. **Create a new Vue project:**

   ```bash
   npm create vite@latest my-vue-seo-app -- --template vue-ts
   cd my-vue-seo-app
   ```

2. **Install dependencies:**

   ```bash
   npm install
   npm install vue-router
   npm install m-seo
   ```

3. **Copy these example files:**

   ```bash
   cp -r /path/to/m-seo/examples/vue-examples/* src/
   ```

4. **Run the dev server:**

   ```bash
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:5173
   ```

### Option 2: Direct Usage

Just copy the `.vue` files into your existing Vue 3 project and import them!

```vue
<script setup>
import HomePage from "./vue-examples/HomePage.vue";
</script>

<template>
  <HomePage />
</template>
```

## 📦 What Each Example Shows

### 1. HomePage.vue

- Basic `useSeo()` usage
- Simple meta tags
- Theme color

### 2. BlogPost.vue

- Complete blog post SEO
- Article structured data (JSON-LD)
- Author and publisher info
- Date published/modified

### 3. ProductPage.vue

- E-commerce product SEO
- Product structured data
- Price, availability, ratings
- Brand and SKU info

### 4. BreadcrumbPage.vue

- `useBreadcrumbs()` composable
- BreadcrumbList schema
- Visual breadcrumb navigation

### 5. FAQPage.vue

- FAQ page SEO
- FAQPage structured data
- Question/Answer schema

### 6. Router Integration (router.ts)

- `setupSeoRouter()` helper
- Automatic SEO on route changes
- Meta from route config

## 🎯 Key Differences from React Examples

| Aspect         | React Examples        | Vue Examples                  |
| -------------- | --------------------- | ----------------------------- |
| **Format**     | `.tsx` with JSX       | `.vue` Single File Components |
| **Code Style** | Exported functions    | `<script setup>`              |
| **Runnable**   | ✅ Yes                | ✅ Yes                        |
| **Templates**  | JSX in return         | `<template>` section          |
| **Styling**    | Separate or CSS-in-JS | `<style scoped>`              |
| **Real Files** | ✅ Real `.tsx` files  | ✅ Real `.vue` files          |

## 💡 Usage Patterns

### Composition API (Recommended)

```vue
<script setup lang="ts">
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

useSeo({
  title: "My Page",
  description: "Description",
});
</script>
```

### Options API

```vue
<script lang="ts">
import { VueSPAAdapter } from "m-seo/adapters/VueSPAAdapter";

export default {
  mounted() {
    const seo = new VueSPAAdapter({
      title: "My Page",
    });
    seo.applySeo();
  },
};
</script>
```

### Component-based

```vue
<template>
  <SeoHead title="My Page" description="Description" />
</template>

<script setup>
import { SeoHead } from "m-seo/adapters/VueSPAAdapter";
</script>
```

## 🔥 Live Example

Run all examples together:

1. Copy all files to a Vue 3 project
2. The router is pre-configured
3. Navigate between pages to see SEO changes
4. Check browser DevTools → Elements → `<head>` to see meta tags
5. View JSON-LD scripts in the `<head>`

## ✨ Features Demonstrated

- ✅ Reactive SEO updates
- ✅ Structured data (JSON-LD)
- ✅ Router integration
- ✅ Breadcrumbs
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Schema.org schemas:
  - BlogPosting
  - Product
  - FAQPage
  - BreadcrumbList

## 📚 Learn More

- [Vue 3 Documentation](https://vuejs.org)
- [m-seo Documentation](https://github.com/Hailemariyam/m-seo)
- [Schema.org](https://schema.org)

---

**These are REAL Vue files, not comments!** 🎉

You can copy and run them directly in any Vue 3 project.
