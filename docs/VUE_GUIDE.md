# 🎨 Vue.js Guide - M-SEO# 🎨 Vue.js Guide - M-SEO

Complete guide to using M-SEO with Vue.js 3 using Composition API, Options API, and advanced patterns.Complete guide to using M-SEO with Vue.js 3 using Composition API and Options API.

## 📚 Table of Contents## � Table of Contents

- [Installation](#installation)- [Installation](#installation)

- [Basic Usage](#basic-usage)- [Basic Usage](#basic-usage)

- [Intermediate Usage](#intermediate-usage)- [Intermediate Usage](#intermediate-usage)

- [Advanced Usage](#advanced-usage)- [Advanced Usage](#advanced-usage)

- [TypeScript Support](#typescript-support)- [TypeScript Support](#typescript-support)

- [Best Practices](#best-practices)- [Best Practices](#best-practices)

- [Live Demo](#live-demo)- [Live Demo](#live-demo)

- [Troubleshooting](#troubleshooting)- [Troubleshooting](#troubleshooting)

---

## Installation## Installation

`bash`bash

npm install m-seonpm install m-seo

# or# or

yarn add m-seoyarn add m-seo

````



------



## Basic Usage## Basic Usage



### 1. Composition API - Simple Setup### 1. Simple Composition API Setup



```vue```vue

<template><template>

  <div>  <div>

    <h1>{{ title }}</h1>    <h1>{{ title }}</h1>

    <p>{{ description }}</p>    <p>{{ description }}</p>

  </div>  </div>

</template></template>



<script setup><script setup>

import { useSeo } from 'm-seo/adapters/VueSPAAdapter';import { useSeo } from 'm-seo/adapters/VueSPAAdapter';



useSeo({useSeo({

  title: 'Home - My Vue App',  title: 'Home - My Vue App',

  description: 'Welcome to my Vue application',  description: 'Welcome to my Vue application',

  keywords: ['vue', 'seo', 'spa']  keywords: ['vue', 'seo', 'spa']

});});

</script></script>

````

### 2. Options API - Traditional Setup### 2. Options API Usage

`vue`vue

<template><template>

  <div>  <div>

    <h1>{{ pageTitle }}</h1>    <h1>{{ pageTitle }}</h1>

  </div>  </div>

</template></template>

<script><script>

import { MetaManager } from 'm-seo';import { MetaManager } from 'm-seo';



export default {export default {

  data() {  data() {

    return {    return {

      pageTitle: 'About Us'      pageTitle: 'About Us'

    };    };

  },  },

  mounted() {  mounted() {

    const seo = new MetaManager();    const seo = new MetaManager();

    seo.setTitle(this.pageTitle);    seo.setTitle(this.pageTitle);

    seo.setDescription('Learn about our company');    seo.setDescription('Learn about our company');

    seo.setCanonical('https://example.com/about');    seo.setCanonical('https://example.com/about');

  }  }

};};

</script></script>

````



### 3. Vue Router - Route Meta### 3. Vue Router Integration



```javascript```javascript

// router/index.js// router/index.js

import { createRouter, createWebHistory } from 'vue-router';import { createRouter, createWebHistory } from 'vue-router';

import { MetaManager } from 'm-seo';import { MetaManager } from 'm-seo';



const router = createRouter({const router = createRouter({

  history: createWebHistory(),  history: createWebHistory(),

  routes: [  routes: [

    {    {

      path: '/',      path: '/',

      component: () => import('@/views/Home.vue'),      component: () => import('@/views/Home.vue'),

      meta: {      meta: {

        title: 'Home',        title: 'Home',

        description: 'Welcome to our homepage'        description: 'Welcome to our homepage'

      }      }

    },    },

    {    {

      path: '/about',      path: '/about',

      component: () => import('@/views/About.vue'),      component: () => import('@/views/About.vue'),

      meta: {      meta: {

        title: 'About Us',        title: 'About Us',

        description: 'Learn about our company'        description: 'Learn about our company'

      }      }

    }    }

  ]  ]

});});



router.afterEach((to) => {router.afterEach((to) => {

  const seo = new MetaManager();  const seo = new MetaManager();

  if (to.meta.title) {  if (to.meta.title) {

    seo.setTitle(to.meta.title);    seo.setTitle(to.meta.title);

  }  }

  if (to.meta.description) {  if (to.meta.description) {

    seo.setDescription(to.meta.description);    seo.setDescription(to.meta.description);

  }  }

});});



export default router;export default router;

````

---

## Intermediate Usage## Intermediate Usage

### 1. Reactive SEO Updates### 1. Reactive SEO with Composition API

`vue`vue

<template><template>

  <div>  <div>

    <h1>{{ article.title }}</h1>    <h1>{{ article.title }}</h1>

    <button @click="updateTitle">Update Title</button>    <p>{{ article.excerpt }}</p>

  </div>  </div>

</template></template>

<script setup><script setup>

import { ref, watch } from 'vue';import { ref, watch } from 'vue';

import { useSeo } from 'm-seo/adapters/VueSPAAdapter';import { useSeo } from 'm-seo/adapters/VueSPAAdapter';



const article = ref({useSeo({

  title: 'Original Article Title',  title: "Page Title",

  excerpt: 'Article excerpt here'  description: "Page description",

});  keywords: ["vue", "seo"],

  canonical: "https://example.com/page",

// Update SEO when article changes  author: "John Doe",

watch(article, (newArticle) => {  robots: "index, follow",

  useSeo({  themeColor: "#667eea",

    title: newArticle.title,});

    description: newArticle.excerpt</script>

});```

}, { immediate: true });

**Reactive Updates:**

const updateTitle = () => {

article.value.title = 'Updated Article Title';```vue

};<script setup lang="ts">

</script>import { reactive } from "vue";

````import { useSeo } from "m-seo/adapters/VueSPAAdapter";



### 2. Composable Patternconst seoConfig = reactive({

  title: "Initial Title",

```javascript  description: "Initial description",

// composables/useSEO.js});

import { watch } from 'vue';

import { MetaManager } from 'm-seo';useSeo(seoConfig);



export function usePageSEO(pageData) {// Update SEO tags dynamically

  const seo = new MetaManager();function updateTitle() {

    seoConfig.title = "Updated Title"; // Meta tags update automatically!

  watch(pageData, (data) => {}

    seo.setTitle(data.title);</script>

    seo.setDescription(data.description);```



    if (data.canonical) {### 2. `useOpenGraph()` - Open Graph Tags

      seo.setCanonical(data.canonical);

    }Manages Open Graph meta tags for social media sharing.



    if (data.keywords) {```vue

      seo.setKeywords(data.keywords);<script setup lang="ts">

    }import { useOpenGraph } from "m-seo/adapters/VueSPAAdapter";

  }, { immediate: true });

  useOpenGraph({

  return seo;  type: "article",

}  title: "Article Title",

```  description: "Article description",

  image: "https://example.com/image.jpg",

**Usage**:  url: "https://example.com/article",

  siteName: "My Blog",

```vue});

<script setup></script>

import { ref } from 'vue';```

import { usePageSEO } from '@/composables/useSEO';

### 3. `useStructuredData()` - JSON-LD Structured Data

const pageData = ref({

  title: 'My Page',Injects Schema.org structured data for better search results.

  description: 'Page description',

  canonical: 'https://example.com/page'```vue

});<script setup lang="ts">

import { useStructuredData } from "m-seo/adapters/VueSPAAdapter";

usePageSEO(pageData);

</script>useStructuredData({

```  "@context": "https://schema.org",

  "@type": "Article",

### 3. Structured Data Integration  headline: "Article Title",

  author: {

```vue    "@type": "Person",

<template>    name: "John Doe",

  <article>  },

    <h1>{{ article.title }}</h1>  datePublished: "2024-01-15",

    <time>{{ article.publishedDate }}</time>  image: "https://example.com/image.jpg",

    <div v-html="article.content"></div>});

  </article></script>

</template>```



<script setup>**Multiple Schemas:**

import { ref, onMounted } from 'vue';

import { MetaManager, StructuredData } from 'm-seo';```vue

<script setup lang="ts">

const article = ref({import { useStructuredData } from "m-seo/adapters/VueSPAAdapter";

  title: 'Getting Started with Vue SEO',

  author: 'John Doe',const schemas = [

  publishedDate: '2024-01-15',  {

  excerpt: 'Learn how to implement SEO in Vue applications',    "@context": "https://schema.org",

  content: '<p>Article content...</p>'    "@type": "Organization",

});    name: "My Company",

    url: "https://example.com",

onMounted(() => {  },

  // SEO Meta Tags  {

  const seo = new MetaManager();    "@context": "https://schema.org",

  seo.setTitle(`${article.value.title} - Blog`);    "@type": "WebSite",

  seo.setDescription(article.value.excerpt);    name: "My Website",

      url: "https://example.com",

  // Structured Data  },

  const sd = new StructuredData();];

  sd.addSchema({

    '@context': 'https://schema.org',useStructuredData(schemas);

    '@type': 'Article',</script>

    headline: article.value.title,```

    author: {

      '@type': 'Person',### 4. `useBreadcrumbs()` - Breadcrumb Navigation

      name: article.value.author

    },Generates BreadcrumbList structured data.

    datePublished: article.value.publishedDate,

    description: article.value.excerpt```vue

  });<script setup lang="ts">

});import { reactive } from "vue";

</script>import { useBreadcrumbs } from "m-seo/adapters/VueSPAAdapter";

````

const breadcrumbs = reactive([

### 4. Open Graph Tags { name: "Home", url: "https://example.com/" },

{ name: "Category", url: "https://example.com/category" },

````vue { name: "Product", url: "https://example.com/category/product" },

<script setup>]);

import { onMounted } from 'vue';

import { MetaManager } from 'm-seo';useBreadcrumbs(breadcrumbs);

</script>

const props = defineProps({```

  title: String,

  description: String,## 🧩 Components

  image: String,

  url: String### `<SeoHead>` Component

});

Alternative to `useSeo()` composable for template-based configuration.

onMounted(() => {

  const seo = new MetaManager();```vue

  <template>

  // Basic meta  <div>

  seo.setTitle(props.title);    <SeoHead

  seo.setDescription(props.description);      :title="pageTitle"

        :description="pageDescription"

  // Open Graph      :keywords="['vue', 'seo']"

  const ogTags = [      canonical="https://example.com"

    { property: 'og:title', content: props.title },    />

    { property: 'og:description', content: props.description },    <h1>{{ pageTitle }}</h1>

    { property: 'og:image', content: props.image },  </div>

    { property: 'og:url', content: props.url },</template>

    { property: 'og:type', content: 'article' }

  ];<script setup lang="ts">

  import { ref } from "vue";

  ogTags.forEach(tag => {import { SeoHead } from "m-seo/adapters/VueSPAAdapter";

    const meta = document.createElement('meta');

    meta.setAttribute('property', tag.property);const pageTitle = ref("My Page");

    meta.setAttribute('content', tag.content);const pageDescription = ref("Page description");

    document.head.appendChild(meta);</script>

  });```

});

</script>### `<JsonLd>` Component

````

Alternative to `useStructuredData()` for template-based structured data.

---

````vue

## Advanced Usage<template>

  <div>

### 1. Global SEO Plugin    <JsonLd :data="articleSchema" />

    <article>

```javascript      <h1>{{ article.title }}</h1>

// plugins/seo.js    </article>

import { MetaManager } from 'm-seo';  </div>

</template>

export default {

  install(app, options) {<script setup lang="ts">

    const seo = new MetaManager();import { reactive } from "vue";

    import { JsonLd } from "m-seo/adapters/VueSPAAdapter";

    // Set defaults

    seo.setTitle(options.defaultTitle || 'My App');const article = reactive({

    seo.setDescription(options.defaultDescription || 'Welcome to my app');  title: "Article Title",

      author: "John Doe",

    // Make available globally});

    app.config.globalProperties.$seo = seo;

    app.provide('seo', seo);const articleSchema = {

  }  "@context": "https://schema.org",

};  "@type": "Article",

```  headline: article.title,

  author: {

**Install plugin**:    "@type": "Person",

    name: article.author,

```javascript  },

// main.js};

import { createApp } from 'vue';</script>

import App from './App.vue';```

import seoPlugin from './plugins/seo';

### `<Breadcrumbs>` Component

const app = createApp(App);

Alternative to `useBreadcrumbs()` composable.

app.use(seoPlugin, {

  defaultTitle: 'My Vue App',```vue

  defaultDescription: 'A great Vue application'<template>

});  <div>

    <Breadcrumbs :items="breadcrumbItems" />

app.mount('#app');    <nav>

```      <!-- Visual breadcrumbs -->

    </nav>

**Use in components**:  </div>

</template>

```vue

<script setup><script setup lang="ts">

import { inject, onMounted } from 'vue';import { ref } from "vue";

import { Breadcrumbs } from "m-seo/adapters/VueSPAAdapter";

const seo = inject('seo');

const breadcrumbItems = ref([

onMounted(() => {  { name: "Home", url: "/" },

  seo.setTitle('About Page');  { name: "Blog", url: "/blog" },

  seo.setDescription('Learn about us');]);

});</script>

</script>```

````

## 📱 Real-World Examples

### 2. SEO Mixin (Options API)

### Blog Post Page

````javascript

// mixins/seo.js```vue

import { MetaManager } from 'm-seo';<template>

  <article>

export default {    <h1>{{ article.title }}</h1>

  data() {    <div class="meta">

    return {      <span>By {{ article.author }}</span>

      seo: new MetaManager()      <time>{{ article.publishedDate }}</time>

    };    </div>

  },    <div v-html="article.content"></div>

  methods: {  </article>

    updateSEO(config) {</template>

      if (config.title) this.seo.setTitle(config.title);

      if (config.description) this.seo.setDescription(config.description);<script setup lang="ts">

      if (config.canonical) this.seo.setCanonical(config.canonical);import { reactive } from "vue";

      if (config.keywords) this.seo.setKeywords(config.keywords);import { useRoute } from "vue-router";

    }import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

  }

};const route = useRoute();

````

const article = reactive({

**Usage**: title: "Getting Started with Vue SEO",

author: "John Doe",

````vue publishedDate: "2024-01-15",

<script>  content: "Article content here...",

import seoMixin from '@/mixins/seo';  excerpt: "Learn how to implement SEO in Vue applications",

});

export default {

  mixins: [seoMixin],// SEO Meta Tags

  mounted() {useSeo({

    this.updateSEO({  title: `${article.title} - Blog`,

      title: 'Products',  description: article.excerpt,

      description: 'Browse our products',  keywords: ["vue", "seo", "tutorial"],

      canonical: 'https://example.com/products'  canonical: `https://example.com/blog/${route.params.slug}`,

    });});

  }

};// Structured Data

</script>useStructuredData({

```  "@context": "https://schema.org",

  "@type": "Article",

### 3. Vuex Integration  headline: article.title,

  author: {

```javascript    "@type": "Person",

// store/modules/seo.js    name: article.author,

import { MetaManager } from 'm-seo';  },

  datePublished: article.publishedDate,

const seo = new MetaManager();  description: article.excerpt,

});

export default {</script>

  namespaced: true,```

  state: () => ({

    title: '',### E-commerce Product Page

    description: '',

    canonical: ''```vue

  }),<template>

  mutations: {  <div class="product">

    SET_TITLE(state, title) {    <h1>{{ product.name }}</h1>

      state.title = title;    <div class="price">${{ product.price }}</div>

      seo.setTitle(title);    <div class="rating">⭐ {{ product.rating }} / 5</div>

    },    <p>{{ product.description }}</p>

    SET_DESCRIPTION(state, description) {  </div>

      state.description = description;</template>

      seo.setDescription(description);

    },<script setup lang="ts">

    SET_CANONICAL(state, canonical) {import { reactive } from "vue";

      state.canonical = canonical;import {

      seo.setCanonical(canonical);  useSeo,

    }  useStructuredData,

  },  useOpenGraph,

  actions: {} from "m-seo/adapters/VueSPAAdapter";

    updateMeta({ commit }, { title, description, canonical }) {

      if (title) commit('SET_TITLE', title);const product = reactive({

      if (description) commit('SET_DESCRIPTION', description);  name: "Vue SEO Toolkit",

      if (canonical) commit('SET_CANONICAL', canonical);  price: 49.99,

    }  currency: "USD",

  }  description: "Complete SEO solution for Vue applications",

};  rating: 4.8,

```  reviewCount: 127,

  availability: "InStock",

**Usage**:  image: "https://example.com/product.jpg",

});

```vue

<script setup>// SEO Meta Tags

import { useStore } from 'vuex';useSeo({

import { onMounted } from 'vue';  title: `${product.name} - Products`,

  description: product.description,

const store = useStore();  keywords: ["vue", "seo", "toolkit"],

});

onMounted(() => {

  store.dispatch('seo/updateMeta', {// Open Graph

    title: 'My Page',useOpenGraph({

    description: 'Page description',  type: "product",

    canonical: 'https://example.com/page'  title: product.name,

  });  description: product.description,

});  image: product.image,

</script>});

````

// Product Schema

### 4. E-commerce Product PageuseStructuredData({

"@context": "https://schema.org",

````vue "@type": "Product",

<template>  name: product.name,

  <div class="product">  description: product.description,

    <img :src="product.image" :alt="product.name">  image: product.image,

    <h1>{{ product.name }}</h1>  offers: {

    <div class="price">${{ product.price }}</div>    "@type": "Offer",

    <div class="rating">⭐ {{ product.rating }} / 5 ({{ product.reviewCount }} reviews)</div>    price: product.price,

    <p>{{ product.description }}</p>    priceCurrency: product.currency,

    <button>Add to Cart</button>    availability: `https://schema.org/${product.availability}`,

  </div>  },

</template>  aggregateRating: {

    "@type": "AggregateRating",

<script setup>    ratingValue: product.rating,

import { ref, onMounted } from 'vue';    reviewCount: product.reviewCount,

import { MetaManager, StructuredData } from 'm-seo';  },

import { useRoute } from 'vue-router';});

</script>

const route = useRoute();```



const product = ref({### FAQ Page

  id: route.params.id,

  name: 'Vue SEO Toolkit Pro',```vue

  price: 99.99,<template>

  currency: 'USD',  <div class="faq">

  description: 'Complete SEO solution for Vue.js applications',    <h1>Frequently Asked Questions</h1>

  rating: 4.8,    <div v-for="(faq, index) in faqs" :key="index" class="faq-item">

  reviewCount: 247,      <h3>{{ faq.question }}</h3>

  availability: 'InStock',      <p>{{ faq.answer }}</p>

  image: 'https://example.com/product.jpg',    </div>

  brand: 'M-SEO'  </div>

});</template>



onMounted(() => {<script setup lang="ts">

  // SEO Meta Tagsimport { reactive } from "vue";

  const seo = new MetaManager();import { useSeo, useStructuredData } from "m-seo/adapters/VueSPAAdapter";

  seo.setTitle(`${product.value.name} - $${product.value.price}`);

  seo.setDescription(product.value.description);const faqs = reactive([

  seo.setCanonical(`https://shop.example.com/products/${product.value.id}`);  {

      question: "What is m-seo?",

  // Open Graph    answer: "A comprehensive SEO toolkit for JavaScript frameworks.",

  const ogTags = [  },

    { property: 'og:title', content: product.value.name },  {

    { property: 'og:description', content: product.value.description },    question: "Does it support TypeScript?",

    { property: 'og:image', content: product.value.image },    answer: "Yes! Full TypeScript support with type definitions.",

    { property: 'og:type', content: 'product' },  },

    { property: 'product:price:amount', content: product.value.price },]);

    { property: 'product:price:currency', content: product.value.currency }

  ];useSeo({

    title: "FAQ - Frequently Asked Questions",

  ogTags.forEach(tag => {  description: "Common questions about Vue.js SEO implementation",

    const meta = document.createElement('meta');});

    meta.setAttribute('property', tag.property);

    meta.setAttribute('content', String(tag.content));useStructuredData({

    document.head.appendChild(meta);  "@context": "https://schema.org",

  });  "@type": "FAQPage",

    mainEntity: faqs.map((faq) => ({

  // Product Schema    "@type": "Question",

  const sd = new StructuredData();    name: faq.question,

  sd.addSchema({    acceptedAnswer: {

    '@context': 'https://schema.org',      "@type": "Answer",

    '@type': 'Product',      text: faq.answer,

    name: product.value.name,    },

    description: product.value.description,  })),

    image: product.value.image,});

    brand: {</script>

      '@type': 'Brand',```

      name: product.value.brand

    },## 🔄 Vue Router Integration

    offers: {

      '@type': 'Offer',### Using `setupSeoRouter()` Helper

      price: product.value.price,

      priceCurrency: product.value.currency,```typescript

      availability: `https://schema.org/${product.value.availability}`// router.ts

    },import { createRouter, createWebHistory } from "vue-router";

    aggregateRating: {import { setupSeoRouter } from "m-seo/adapters/VueSPAAdapter";

      '@type': 'AggregateRating',

      ratingValue: product.value.rating,const router = createRouter({

      reviewCount: product.value.reviewCount  history: createWebHistory(),

    }  routes: [

  });    // your routes

});  ],

</script>});

````

// Automatically update title on route change

### 5. Multilingual SEOsetupSeoRouter(router, (route) => {

return {

````vue title: (route.meta.title as string) || "Default Title",

<template>    description: (route.meta.description as string) || "Default description",

  <div>  };

    <h1>{{ t('title') }}</h1>});

    <select v-model="currentLocale" @change="changeLocale">

      <option value="en">English</option>export default router;

      <option value="es">Español</option>```

      <option value="fr">Français</option>

    </select>### Route Meta Tags

  </div>

</template>```typescript

// router.ts

<script setup>const routes = [

import { ref, watch } from 'vue';  {

import { useI18n } from 'vue-i18n';    path: "/",

import { MetaManager } from 'm-seo';    component: HomePage,

    meta: {

const { t, locale } = useI18n();      title: "Home",

const currentLocale = ref(locale.value);      description: "Welcome to our site",

    },

const seoTranslations = {  },

  en: {  {

    title: 'Home - My App',    path: "/blog/:slug",

    description: 'Welcome to my application'    component: BlogPost,

  },    meta: {

  es: {      title: "Blog Post",

    title: 'Inicio - Mi App',      description: "Read our latest articles",

    description: 'Bienvenido a mi aplicación'    },

  },  },

  fr: {];

    title: 'Accueil - Mon App',```

    description: 'Bienvenue dans mon application'

  }## 🎨 Options API (Class-based)

};

For those using Options API instead of Composition API:

const updateSEO = (lang) => {

  const seo = new MetaManager();```vue

  const trans = seoTranslations[lang];<template>

    <div>

  seo.setTitle(trans.title);    <h1>{{ title }}</h1>

  seo.setDescription(trans.description);  </div>

  </template>

  // Set language meta tag

  document.documentElement.lang = lang;<script lang="ts">

  import { defineComponent } from "vue";

  // Alternate language linksimport { VueSPAAdapter } from "m-seo/adapters/VueSPAAdapter";

  const alternates = {

    en: 'https://example.com/en/',export default defineComponent({

    es: 'https://example.com/es/',  data() {

    fr: 'https://example.com/fr/'    return {

  };      title: "My Page",

        seoAdapter: new VueSPAAdapter(),

  Object.entries(alternates).forEach(([hreflang, href]) => {    };

    const link = document.createElement('link');  },

    link.setAttribute('rel', 'alternate');  mounted() {

    link.setAttribute('hreflang', hreflang);    this.seoAdapter.updateSeo({

    link.setAttribute('href', href);      title: this.title,

    document.head.appendChild(link);      description: "Page description",

  });    });

};  },

  beforeUnmount() {

watch(currentLocale, updateSEO, { immediate: true });    this.seoAdapter.clear();

  },

const changeLocale = () => {});

  locale.value = currentLocale.value;</script>

  updateSEO(currentLocale.value);```

};

</script>## 🧪 Testing

````

The Vue adapter automatically cleans up meta tags and structured data when components are unmounted, making it perfect for SPA navigation.

---

````typescript

## TypeScript Supportimport { mount } from "@vue/test-utils";

import { useSeo } from "m-seo/adapters/VueSPAAdapter";

### 1. Typed Composable

describe("SEO Tags", () => {

```typescript  it("should add meta tags", async () => {

// composables/useSEO.ts    const wrapper = mount({

import { watch, type Ref } from 'vue';      setup() {

import { MetaManager } from 'm-seo';        useSeo({ title: "Test Title" });

      },

interface SEOConfig {    });

  title: string;

  description: string;    expect(document.title).toBe("Test Title");

  canonical?: string;  });

  keywords?: string[];});

  robots?: string;```

}

## 💡 Best Practices

export function usePageSEO(config: Ref<SEOConfig>) {

  const seo = new MetaManager();### 1. Use `reactive()` for Objects



  watch(config, (data) => {```vue

    seo.setTitle(data.title);<script setup lang="ts">

    seo.setDescription(data.description);import { reactive } from "vue";

    import { useSeo } from "m-seo/adapters/VueSPAAdapter";

    if (data.canonical) {

      seo.setCanonical(data.canonical);// ✅ Good - reactive object

    }const seoConfig = reactive({

      title: "Page Title",

    if (data.keywords) {  description: "Description",

      seo.setKeywords(data.keywords);});

    }

    useSeo(seoConfig);

    if (data.robots) {

      const robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;// Updates work automatically

      if (robotsMeta) {seoConfig.title = "New Title";

        robotsMeta.content = data.robots;</script>

      } else {```

        const meta = document.createElement('meta');

        meta.name = 'robots';### 2. Combine Composables

        meta.content = data.robots;

        document.head.appendChild(meta);```vue

      }<script setup lang="ts">

    }import {

  }, { immediate: true });  useSeo,

    useOpenGraph,

  return seo;  useStructuredData,

}} from "m-seo/adapters/VueSPAAdapter";

````

// Basic SEO

### 2. Typed PluginuseSeo({

title: "Page Title",

````typescript description: "Description",

// plugins/seo.ts});

import type { App } from 'vue';

import { MetaManager } from 'm-seo';// Social media

useOpenGraph({

interface SEOPluginOptions {  type: "article",

  defaultTitle: string;  image: "https://example.com/image.jpg",

  defaultDescription: string;});

  siteName?: string;

}// Rich results

useStructuredData({

declare module '@vue/runtime-core' {  "@type": "Article",

  interface ComponentCustomProperties {  headline: "Page Title",

    $seo: MetaManager;});

  }</script>

}```



export default {### 3. Extract to Composables

  install(app: App, options: SEOPluginOptions) {

    const seo = new MetaManager();```typescript

    // composables/usePageSeo.ts

    seo.setTitle(options.defaultTitle);import { useSeo, useOpenGraph } from "m-seo/adapters/VueSPAAdapter";

    seo.setDescription(options.defaultDescription);

    export function usePageSeo(page: {

    app.config.globalProperties.$seo = seo;  title: string;

    app.provide('seo', seo);  description: string;

  }  image?: string;

};}) {

```  useSeo({

    title: page.title,

### 3. Typed Component    description: page.description,

  });

```vue

<template>  if (page.image) {

  <article>    useOpenGraph({

    <h1>{{ article.title }}</h1>      type: "website",

  </article>      title: page.title,

</template>      description: page.description,

      image: page.image,

<script setup lang="ts">    });

import { ref, onMounted } from 'vue';  }

import { MetaManager, StructuredData } from 'm-seo';}



interface Article {// Usage in component

  title: string;import { usePageSeo } from "@/composables/usePageSeo";

  author: string;

  publishedDate: string;usePageSeo({

  excerpt: string;  title: "My Page",

  content: string;  description: "Page description",

}  image: "https://example.com/image.jpg",

});

const article = ref<Article>({```

  title: 'TypeScript with Vue SEO',

  author: 'John Doe',## 📚 TypeScript Support

  publishedDate: '2024-01-15',

  excerpt: 'Learn TypeScript patterns for SEO',Full TypeScript support with comprehensive type definitions:

  content: '<p>Content here...</p>'

});```typescript

import type {

onMounted(() => {  SeoConfig,

  const seo = new MetaManager();  StructuredData,

  seo.setTitle(`${article.value.title} - Blog`);  BreadcrumbItem,

  seo.setDescription(article.value.excerpt);  OpenGraphConfig,

  } from "m-seo/adapters/VueSPAAdapter";

  const sd = new StructuredData();

  sd.addSchema({const seoConfig: SeoConfig = {

    '@context': 'https://schema.org',  title: "Page Title",

    '@type': 'Article',  description: "Description",

    headline: article.value.title,};

    author: {

      '@type': 'Person',const schema: StructuredData = {

      name: article.value.author  "@context": "https://schema.org",

    },  "@type": "Article",

    datePublished: article.value.publishedDate};

  });

});const breadcrumbs: BreadcrumbItem[] = [{ name: "Home", url: "/" }];

</script>

```const ogConfig: OpenGraphConfig = {

  type: "website",

---  title: "Page Title",

};

## Best Practices```



### 1. Clean Up on Unmount## 🔗 Additional Resources



```vue- [Vue Examples](../examples/vue-examples/) - Complete working examples

<script setup>- [Test App](../test-vue-app/) - Interactive demo application

import { onMounted, onUnmounted } from 'vue';- [API Reference](./api.md) - Complete API documentation

import { MetaManager } from 'm-seo';- [Core Documentation](./SUMMARY.md) - Framework-agnostic core features



const seo = new MetaManager();## 🆘 Common Issues



onMounted(() => {### Issue: Meta tags not updating

  seo.setTitle('My Page');

});**Solution:** Make sure you're using `reactive()` or `ref()` and passing the reactive object to the composable:



onUnmounted(() => {```vue

  // Clean up custom meta tags if needed<script setup lang="ts">

  const customMetas = document.querySelectorAll('meta[data-custom]');import { reactive } from "vue";

  customMetas.forEach(meta => meta.remove());import { useSeo } from "m-seo/adapters/VueSPAAdapter";

});

</script>// ✅ Correct

```const config = reactive({ title: "Title" });

useSeo(config);

### 2. Centralized SEO Configuration

// ❌ Wrong

```javascriptuseSeo({ title: "Title" }); // Plain object won't update reactively

// config/seo.js</script>

export const seoConfig = {```

  defaultTitle: 'My Vue App',

  titleTemplate: '%s | My Vue App',### Issue: Duplicate meta tags

  defaultDescription: 'Welcome to my Vue application',

  siteName: 'My Vue App',**Solution:** The adapter automatically cleans up old tags. If you see duplicates, make sure you're not calling `useSeo()` multiple times with different configs.

  siteUrl: 'https://example.com',

  twitterHandle: '@myapp',---



  routes: {**Happy coding with Vue + M-SEO! 🚀**

    '/': {
      title: 'Home',
      description: 'Welcome to our homepage'
    },
    '/about': {
      title: 'About Us',
      description: 'Learn about our company'
    }
  }
};
````

### 3. Lazy Load Structured Data

```vue
<script setup>
import { onMounted } from "vue";

const loadStructuredData = async () => {
  const { StructuredData } = await import("m-seo");
  const sd = new StructuredData();
  sd.addSchema({
    "@type": "Organization",
    name: "My Company",
  });
};

onMounted(() => {
  if (window.requestIdleCallback) {
    window.requestIdleCallback(loadStructuredData);
  } else {
    setTimeout(loadStructuredData, 1);
  }
});
</script>
```

### 4. Dynamic Import for Large Schemas

```vue
<script setup>
import { onMounted } from "vue";

onMounted(async () => {
  // Only load SEO for production
  if (import.meta.env.PROD) {
    const { MetaManager } = await import("m-seo");
    const seo = new MetaManager();
    seo.setTitle("My Page");
  }
});
</script>
```

---

## Live Demo

Check out the complete working example:

**Test Application**: [`test-vue-app/`](../test-vue-app/)

Run it locally:

```bash
cd test-vue-app
npm install
npm run dev
# Open http://localhost:3001
```

**Features Demonstrated**:

- ✅ Composition API patterns
- ✅ Vue Router integration
- ✅ Reactive SEO updates
- ✅ Structured data
- ✅ TypeScript support
- ✅ Vuex integration
- ✅ Multilingual SEO

---

## Troubleshooting

### Meta Tags Not Updating

**Problem**: Title doesn't change when navigating

**Solution**: Use `watch` with `immediate: true`

```javascript
watch(pageData, updateSEO, { immediate: true });
```

### Duplicate Meta Tags

**Problem**: Multiple description tags

**Solution**: Remove old tags before adding new ones

```javascript
const oldMeta = document.querySelector('meta[name="description"]');
if (oldMeta) oldMeta.remove();
```

### SSR Issues

**Problem**: Meta tags not rendering on server

**Solution**: Use a proper SSR framework like Nuxt.js or implement server-side rendering properly

### Hydration Mismatch

**Problem**: Vue hydration warnings

**Solution**: Ensure SEO updates happen in `onMounted`, not `setup`

```vue
<script setup>
import { onMounted } from "vue";

// ✅ Correct
onMounted(() => {
  updateSEO();
});

// ❌ Wrong
updateSEO(); // Runs during SSR
</script>
```

---

## Next Steps

- **Vanilla JS Guide**: [VANILLA_JS_GUIDE.md](./VANILLA_JS_GUIDE.md)
- **React Guide**: [REACT_GUIDE.md](./REACT_GUIDE.md)
- **Express.js Guide**: [EXPRESS_GUIDE.md](./EXPRESS_GUIDE.md)
- **Next.js Guide**: [NEXT_JS_GUIDE.md](./NEXT_JS_GUIDE.md)
- **API Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## Support

- 📖 [Full Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 [Examples](../examples/)
- 🚀 [Live Demo](../test-vue-app/)

---

**License**: MIT © Hailemariyam Kebede
