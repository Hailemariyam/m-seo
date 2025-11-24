// examples/vue-usage.ts

/**
 * Vue.js Usage Examples for m-seo
 * Complete examples showing all Vue adapter features
 */

// ============================================================================
// EXAMPLE 1: Basic SEO with Composition API
// ============================================================================

/*
<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to my Vue site!</p>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from 'm-seo/adapters/VueSPAAdapter';

// Simple SEO setup
useSeo({
  title: 'Home - My Vue Site',
  description: 'Welcome to my Vue-powered website',
  keywords: ['vue', 'seo', 'web development'],
  author: 'Your Name'
});
</script>
*/

// ============================================================================
// EXAMPLE 2: Reactive SEO with Refs
// ============================================================================

/*
<template>
  <div>
    <h1>{{ pageTitle }}</h1>
    <button @click="updateTitle">Change Title</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo } from 'm-seo/adapters/VueSPAAdapter';

const pageTitle = ref('Initial Title');

// SEO updates automatically when pageTitle changes
useSeo({
  title: pageTitle.value,
  description: 'This page has reactive SEO'
});

const updateTitle = () => {
  pageTitle.value = 'New Dynamic Title';
};
</script>
*/

// ============================================================================
// EXAMPLE 3: Complete Blog Post with Structured Data
// ============================================================================

/*
<template>
  <article>
    <h1>{{ post.title }}</h1>
    <time>{{ post.publishedAt }}</time>
    <div v-html="post.content"></div>
  </article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';

const post = ref({
  title: 'Understanding Vue 3 Composition API',
  content: '<p>Vue 3 brings powerful new features...</p>',
  excerpt: 'Learn about the Composition API in Vue 3',
  publishedAt: '2025-11-24',
  author: 'Jane Developer',
  image: 'https://example.com/blog/vue3.jpg'
});

// SEO meta tags
useSeo({
  title: `${post.value.title} - My Blog`,
  description: post.value.excerpt,
  keywords: ['vue', 'composition api', 'vue 3'],
  ogImage: post.value.image,
  canonical: `https://example.com/blog/${post.value.slug}`,
  author: post.value.author
});

// Article structured data
useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.value.title,
  description: post.value.excerpt,
  image: post.value.image,
  datePublished: post.value.publishedAt,
  author: {
    '@type': 'Person',
    name: post.value.author
  },
  publisher: {
    '@type': 'Organization',
    name: 'My Blog',
    logo: {
      '@type': 'ImageObject',
      url: 'https://example.com/logo.png'
    }
  }
});
</script>
*/

// ============================================================================
// EXAMPLE 4: E-commerce Product Page
// ============================================================================

/*
<template>
  <div class="product">
    <img :src="product.image" :alt="product.name" />
    <h1>{{ product.name }}</h1>
    <p class="price">${{ product.price }}</p>
    <p>{{ product.description }}</p>
    <button>Add to Cart</button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';

const product = ref({
  name: 'Premium Wireless Headphones',
  description: 'High-quality noise-canceling headphones',
  price: 199.99,
  currency: 'USD',
  image: 'https://example.com/products/headphones.jpg',
  brand: 'AudioTech',
  sku: 'ATP-001',
  availability: 'https://schema.org/InStock',
  rating: 4.5,
  reviewCount: 128
});

// Product SEO
useSeo({
  title: `${product.value.name} - Shop Now`,
  description: product.value.description,
  ogImage: product.value.image,
  canonical: `https://example.com/products/${product.value.sku}`
});

// Product structured data
useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.value.name,
  description: product.value.description,
  image: product.value.image,
  brand: {
    '@type': 'Brand',
    name: product.value.brand
  },
  sku: product.value.sku,
  offers: {
    '@type': 'Offer',
    price: product.value.price,
    priceCurrency: product.value.currency,
    availability: product.value.availability
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: product.value.rating,
    reviewCount: product.value.reviewCount
  }
});
</script>
*/

// ============================================================================
// EXAMPLE 5: Using SeoHead Component
// ============================================================================

/*
<template>
  <div>
    <!-- Component-based SEO -->
    <SeoHead
      title="About Us"
      description="Learn more about our company"
      :keywords="['about', 'company', 'team']"
      author="Company Name"
      og-image="https://example.com/about.jpg"
    />

    <h1>About Us</h1>
    <p>We are a team of passionate developers...</p>
  </div>
</template>

<script setup lang="ts">
import { SeoHead } from 'm-seo/adapters/VueSPAAdapter';
</script>
*/

// ============================================================================
// EXAMPLE 6: Breadcrumbs Navigation
// ============================================================================

/*
<template>
  <div>
    <nav aria-label="Breadcrumb">
      <ol>
        <li v-for="crumb in breadcrumbs" :key="crumb.url">
          <a :href="crumb.url">{{ crumb.name }}</a>
        </li>
      </ol>
    </nav>

    <h1>Current Page</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useBreadcrumbs } from 'm-seo/adapters/VueSPAAdapter';

const breadcrumbs = ref([
  { name: 'Home', url: 'https://example.com/' },
  { name: 'Products', url: 'https://example.com/products' },
  { name: 'Electronics', url: 'https://example.com/products/electronics' },
  { name: 'Headphones', url: 'https://example.com/products/electronics/headphones' }
]);

// Automatically generates BreadcrumbList structured data
useBreadcrumbs(breadcrumbs);
</script>
*/

// ============================================================================
// EXAMPLE 7: Vue Router Integration
// ============================================================================

/*
// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { setupSeoRouter } from 'm-seo/adapters/VueSPAAdapter';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Home',
      description: 'Welcome to our site'
    }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'About Us',
      description: 'Learn more about us'
    }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPost',
    component: () => import('../views/BlogPost.vue'),
    meta: {
      title: 'Blog Post',
      description: 'Read our latest blog post'
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Automatic SEO on route changes
setupSeoRouter(router, (route) => ({
  title: `${route.meta.title} - My Site`,
  description: route.meta.description,
  canonical: `https://example.com${route.path}`,
  siteName: 'My Site'
}));

export default router;
*/

// ============================================================================
// EXAMPLE 8: Class-based Usage (Options API)
// ============================================================================

/*
<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { VueSPAAdapter } from 'm-seo/adapters/VueSPAAdapter';

export default defineComponent({
  name: 'HomePage',
  data() {
    return {
      title: 'Home',
      seoAdapter: null as VueSPAAdapter | null
    };
  },
  mounted() {
    this.seoAdapter = new VueSPAAdapter({
      title: 'Home - My Site',
      description: 'Welcome to my site',
      keywords: ['vue', 'seo']
    });
    this.seoAdapter.applySeo();
  },
  unmounted() {
    this.seoAdapter?.clear();
  }
});
</script>
*/

// ============================================================================
// EXAMPLE 9: Multi-language Support
// ============================================================================

/*
<template>
  <div>
    <select v-model="currentLocale" @change="updateLocale">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>

    <h1>{{ t('home.title') }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useSeo } from 'm-seo/adapters/VueSPAAdapter';

const currentLocale = ref('en');

const translations = {
  en: {
    title: 'Welcome to Our Site',
    description: 'Discover amazing content'
  },
  es: {
    title: 'Bienvenido a Nuestro Sitio',
    description: 'Descubre contenido increíble'
  },
  fr: {
    title: 'Bienvenue sur Notre Site',
    description: 'Découvrez du contenu incroyable'
  }
};

const t = (key: string) => {
  const [section, field] = key.split('.');
  return translations[currentLocale.value as keyof typeof translations][field];
};

// Update SEO when locale changes
watch(currentLocale, (newLocale) => {
  useSeo({
    title: translations[newLocale as keyof typeof translations].title,
    description: translations[newLocale as keyof typeof translations].description,
    locale: newLocale === 'en' ? 'en_US' : newLocale === 'es' ? 'es_ES' : 'fr_FR',
    canonical: `https://example.com/${newLocale}`
  });
}, { immediate: true });
</script>
*/

// ============================================================================
// EXAMPLE 10: Dynamic FAQ Page with Schema
// ============================================================================

/*
<template>
  <div>
    <h1>Frequently Asked Questions</h1>
    <div v-for="faq in faqs" :key="faq.question" class="faq-item">
      <h3>{{ faq.question }}</h3>
      <p>{{ faq.answer }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';

const faqs = ref([
  {
    question: 'What is Vue 3?',
    answer: 'Vue 3 is the latest version of the Vue.js framework.'
  },
  {
    question: 'How do I install Vue?',
    answer: 'You can install Vue using npm or yarn.'
  },
  {
    question: 'Is Vue 3 compatible with Vue 2?',
    answer: 'Vue 3 has breaking changes but provides a migration guide.'
  }
]);

// FAQ SEO
useSeo({
  title: 'FAQ - Frequently Asked Questions',
  description: 'Find answers to common questions about Vue.js',
  keywords: ['faq', 'vue', 'questions']
});

// FAQ structured data
useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.value.map(faq => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
});
</script>
*/

// ============================================================================
// EXAMPLE 11: Organization Schema
// ============================================================================

/*
<template>
  <div>
    <h1>Contact Us</h1>
  </div>
</template>

<script setup lang="ts">
import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';

useSeo({
  title: 'Contact Us - My Company',
  description: 'Get in touch with our team',
  canonical: 'https://example.com/contact'
});

useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'My Company',
  url: 'https://example.com',
  logo: 'https://example.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+1-555-123-4567',
    contactType: 'Customer Service',
    email: 'support@example.com',
    areaServed: 'US',
    availableLanguage: ['en', 'es']
  },
  sameAs: [
    'https://twitter.com/mycompany',
    'https://facebook.com/mycompany',
    'https://linkedin.com/company/mycompany'
  ]
});
</script>
*/

// ============================================================================
// EXAMPLE 12: Event Schema
// ============================================================================

/*
<template>
  <div>
    <h1>{{ event.name }}</h1>
    <p>{{ event.description }}</p>
    <p>Date: {{ event.startDate }}</p>
    <p>Location: {{ event.location.name }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useSeo, useStructuredData } from 'm-seo/adapters/VueSPAAdapter';

const event = ref({
  name: 'Vue.js Conference 2025',
  description: 'Annual conference for Vue developers',
  startDate: '2025-12-15T09:00:00',
  endDate: '2025-12-17T17:00:00',
  location: {
    name: 'Tech Convention Center',
    address: '123 Tech Street, San Francisco, CA'
  },
  image: 'https://example.com/events/vue-conf.jpg',
  url: 'https://example.com/events/vue-conf-2025'
});

useSeo({
  title: `${event.value.name} - Events`,
  description: event.value.description,
  ogImage: event.value.image,
  canonical: event.value.url
});

useStructuredData({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: event.value.name,
  description: event.value.description,
  startDate: event.value.startDate,
  endDate: event.value.endDate,
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  location: {
    '@type': 'Place',
    name: event.value.location.name,
    address: event.value.location.address
  },
  image: event.value.image,
  organizer: {
    '@type': 'Organization',
    name: 'Vue Community',
    url: 'https://example.com'
  }
});
</script>
*/

export {};
