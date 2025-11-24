# Vue 3 SEO Guide - M-SEO

Complete guide to using M-SEO with Vue 3 and the Composition API.

## 📦 Installation

```bash
npm install m-seo
```

## 🚀 Quick Start

The Vue adapter provides composables and components that integrate seamlessly with Vue 3's Composition API and reactivity system.

### Basic Usage

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

const pageData = reactive({
  title: "Home Page",
  description: "Welcome to my Vue application",
});

useSeo({
  title: pageData.title,
  description: pageData.description,
  keywords: ["vue", "seo", "spa"],
});
</script>
```

## 🎯 Available Composables

### 1. `useSeo()` - Meta Tags Management

Manages all SEO meta tags including title, description, Open Graph, and Twitter cards.

```vue
<script setup lang="ts">
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

useSeo({
  title: "Page Title",
  description: "Page description",
  keywords: ["vue", "seo"],
  canonical: "https://example.com/page",
  author: "John Doe",
  robots: "index, follow",
  themeColor: "#667eea",
});
</script>
```

**Reactive Updates:**

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

const seoConfig = reactive({
  title: "Initial Title",
  description: "Initial description",
});

useSeo(seoConfig);

// Update SEO tags dynamically
function updateTitle() {
  seoConfig.title = "Updated Title"; // Meta tags update automatically!
}
</script>
```

### 2. `useOpenGraph()` - Open Graph Tags

Manages Open Graph meta tags for social media sharing.

```vue
<script setup lang="ts">
import { useOpenGraph } from "m-seo/adapters/VueSPAAdapter";

useOpenGraph({
  type: "article",
  title: "Article Title",
  description: "Article description",
  image: "https://example.com/image.jpg",
  url: "https://example.com/article",
  siteName: "My Blog",
});
</script>
```

### 3. `useStructuredData()` - JSON-LD Structured Data

Injects Schema.org structured data for better search results.

```vue
<script setup lang="ts">
import { useStructuredData } from "m-seo/adapters/VueSPAAdapter";

useStructuredData({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Article Title",
  author: {
    "@type": "Person",
    name: "John Doe",
  },
  datePublished: "2024-01-15",
  image: "https://example.com/image.jpg",
});
</script>
```

**Multiple Schemas:**

```vue
<script setup lang="ts">
import { useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "My Company",
    url: "https://example.com",
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "My Website",
    url: "https://example.com",
  },
];

useStructuredData(schemas);
</script>
```

### 4. `useBreadcrumbs()` - Breadcrumb Navigation

Generates BreadcrumbList structured data.

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { useBreadcrumbs } from "m-seo/adapters/VueSPAAdapter";

const breadcrumbs = reactive([
  { name: "Home", url: "https://example.com/" },
  { name: "Category", url: "https://example.com/category" },
  { name: "Product", url: "https://example.com/category/product" },
]);

useBreadcrumbs(breadcrumbs);
</script>
```

## 🧩 Components

### `<SeoHead>` Component

Alternative to `useSeo()` composable for template-based configuration.

```vue
<template>
  <div>
    <SeoHead
      :title="pageTitle"
      :description="pageDescription"
      :keywords="['vue', 'seo']"
      canonical="https://example.com"
    />
    <h1>{{ pageTitle }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { SeoHead } from "m-seo/adapters/VueSPAAdapter";

const pageTitle = ref("My Page");
const pageDescription = ref("Page description");
</script>
```

### `<JsonLd>` Component

Alternative to `useStructuredData()` for template-based structured data.

```vue
<template>
  <div>
    <JsonLd :data="articleSchema" />
    <article>
      <h1>{{ article.title }}</h1>
    </article>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { JsonLd } from "m-seo/adapters/VueSPAAdapter";

const article = reactive({
  title: "Article Title",
  author: "John Doe",
});

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  author: {
    "@type": "Person",
    name: article.author,
  },
};
</script>
```

### `<Breadcrumbs>` Component

Alternative to `useBreadcrumbs()` composable.

```vue
<template>
  <div>
    <Breadcrumbs :items="breadcrumbItems" />
    <nav>
      <!-- Visual breadcrumbs -->
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { Breadcrumbs } from "m-seo/adapters/VueSPAAdapter";

const breadcrumbItems = ref([
  { name: "Home", url: "/" },
  { name: "Blog", url: "/blog" },
]);
</script>
```

## 📱 Real-World Examples

### Blog Post Page

```vue
<template>
  <article>
    <h1>{{ article.title }}</h1>
    <div class="meta">
      <span>By {{ article.author }}</span>
      <time>{{ article.publishedDate }}</time>
    </div>
    <div v-html="article.content"></div>
  </article>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const route = useRoute();

const article = reactive({
  title: "Getting Started with Vue SEO",
  author: "John Doe",
  publishedDate: "2024-01-15",
  content: "Article content here...",
  excerpt: "Learn how to implement SEO in Vue applications",
});

// SEO Meta Tags
useSeo({
  title: `${article.title} - Blog`,
  description: article.excerpt,
  keywords: ["vue", "seo", "tutorial"],
  canonical: `https://example.com/blog/${route.params.slug}`,
});

// Structured Data
useStructuredData({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.title,
  author: {
    "@type": "Person",
    name: article.author,
  },
  datePublished: article.publishedDate,
  description: article.excerpt,
});
</script>
```

### E-commerce Product Page

```vue
<template>
  <div class="product">
    <h1>{{ product.name }}</h1>
    <div class="price">${{ product.price }}</div>
    <div class="rating">⭐ {{ product.rating }} / 5</div>
    <p>{{ product.description }}</p>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  useSeo,
  useStructuredData,
  useOpenGraph,
} from "m-seo/adapters/VueSPAAdapter";

const product = reactive({
  name: "Vue SEO Toolkit",
  price: 49.99,
  currency: "USD",
  description: "Complete SEO solution for Vue applications",
  rating: 4.8,
  reviewCount: 127,
  availability: "InStock",
  image: "https://example.com/product.jpg",
});

// SEO Meta Tags
useSeo({
  title: `${product.name} - Products`,
  description: product.description,
  keywords: ["vue", "seo", "toolkit"],
});

// Open Graph
useOpenGraph({
  type: "product",
  title: product.name,
  description: product.description,
  image: product.image,
});

// Product Schema
useStructuredData({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.name,
  description: product.description,
  image: product.image,
  offers: {
    "@type": "Offer",
    price: product.price,
    priceCurrency: product.currency,
    availability: `https://schema.org/${product.availability}`,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.rating,
    reviewCount: product.reviewCount,
  },
});
</script>
```

### FAQ Page

```vue
<template>
  <div class="faq">
    <h1>Frequently Asked Questions</h1>
    <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
      <h3>{{ faq.question }}</h3>
      <p>{{ faq.answer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

const faqs = reactive([
  {
    question: "What is m-seo?",
    answer: "A comprehensive SEO toolkit for JavaScript frameworks.",
  },
  {
    question: "Does it support TypeScript?",
    answer: "Yes! Full TypeScript support with type definitions.",
  },
]);

useSeo({
  title: "FAQ - Frequently Asked Questions",
  description: "Common questions about Vue.js SEO implementation",
});

useStructuredData({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
</script>
```

## 🔄 Vue Router Integration

### Using `setupSeoRouter()` Helper

```typescript
// router.ts
import { createRouter, createWebHistory } from "vue-router";
import { setupSeoRouter } from "m-seo/adapters/VueSPAAdapter";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // your routes
  ],
});

// Automatically update title on route change
setupSeoRouter(router, (route) => {
  return {
    title: (route.meta.title as string) || "Default Title",
    description: (route.meta.description as string) || "Default description",
  };
});

export default router;
```

### Route Meta Tags

```typescript
// router.ts
const routes = [
  {
    path: "/",
    component: HomePage,
    meta: {
      title: "Home",
      description: "Welcome to our site",
    },
  },
  {
    path: "/blog/:slug",
    component: BlogPost,
    meta: {
      title: "Blog Post",
      description: "Read our latest articles",
    },
  },
];
```

## 🎨 Options API (Class-based)

For those using Options API instead of Composition API:

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VueSPAAdapter } from "m-seo/adapters/VueSPAAdapter";

export default defineComponent({
  data() {
    return {
      title: "My Page",
      seoAdapter: new VueSPAAdapter(),
    };
  },
  mounted() {
    this.seoAdapter.updateSeo({
      title: this.title,
      description: "Page description",
    });
  },
  beforeUnmount() {
    this.seoAdapter.clear();
  },
});
</script>
```

## 🧪 Testing

The Vue adapter automatically cleans up meta tags and structured data when components are unmounted, making it perfect for SPA navigation.

```typescript
import { mount } from "@vue/test-utils";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

describe("SEO Tags", () => {
  it("should add meta tags", async () => {
    const wrapper = mount({
      setup() {
        useSeo({ title: "Test Title" });
      },
    });

    expect(document.title).toBe("Test Title");
  });
});
```

## 💡 Best Practices

### 1. Use `reactive()` for Objects

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

// ✅ Good - reactive object
const seoConfig = reactive({
  title: "Page Title",
  description: "Description",
});

useSeo(seoConfig);

// Updates work automatically
seoConfig.title = "New Title";
</script>
```

### 2. Combine Composables

```vue
<script setup lang="ts">
import {
  useSeo,
  useOpenGraph,
  useStructuredData,
} from "m-seo/adapters/VueSPAAdapter";

// Basic SEO
useSeo({
  title: "Page Title",
  description: "Description",
});

// Social media
useOpenGraph({
  type: "article",
  image: "https://example.com/image.jpg",
});

// Rich results
useStructuredData({
  "@type": "Article",
  headline: "Page Title",
});
</script>
```

### 3. Extract to Composables

```typescript
// composables/usePageSeo.ts
import { useSeo, useOpenGraph } from "m-seo/adapters/VueSPAAdapter";

export function usePageSeo(page: {
  title: string;
  description: string;
  image?: string;
}) {
  useSeo({
    title: page.title,
    description: page.description,
  });

  if (page.image) {
    useOpenGraph({
      type: "website",
      title: page.title,
      description: page.description,
      image: page.image,
    });
  }
}

// Usage in component
import { usePageSeo } from "@/composables/usePageSeo";

usePageSeo({
  title: "My Page",
  description: "Page description",
  image: "https://example.com/image.jpg",
});
```

## 📚 TypeScript Support

Full TypeScript support with comprehensive type definitions:

```typescript
import type {
  SeoConfig,
  StructuredData,
  BreadcrumbItem,
  OpenGraphConfig,
} from "m-seo/adapters/VueSPAAdapter";

const seoConfig: SeoConfig = {
  title: "Page Title",
  description: "Description",
};

const schema: StructuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
};

const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", url: "/" }];

const ogConfig: OpenGraphConfig = {
  type: "website",
  title: "Page Title",
};
```

## 🔗 Additional Resources

- [Vue Examples](../examples/vue-examples/) - Complete working examples
- [Test App](../test-vue-app/) - Interactive demo application
- [API Reference](./api.md) - Complete API documentation
- [Core Documentation](./SUMMARY.md) - Framework-agnostic core features

## 🆘 Common Issues

### Issue: Meta tags not updating

**Solution:** Make sure you're using `reactive()` or `ref()` and passing the reactive object to the composable:

```vue
<script setup lang="ts">
import { reactive } from "vue";
import { useSeo } from "m-seo/adapters/VueSPAAdapter";

// ✅ Correct
const config = reactive({ title: "Title" });
useSeo(config);

// ❌ Wrong
useSeo({ title: "Title" }); // Plain object won't update reactively
</script>
```

### Issue: Duplicate meta tags

**Solution:** The adapter automatically cleans up old tags. If you see duplicates, make sure you're not calling `useSeo()` multiple times with different configs.

---

**Happy coding with Vue + M-SEO! 🚀**
