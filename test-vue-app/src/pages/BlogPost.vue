<template>
  <div class="page">
    <div class="card">
      <h1>📝 {{ article.title }}</h1>
      <div class="meta">
        <span>By {{ article.author }}</span>
        <span>{{ article.publishedDate }}</span>
      </div>

      <p>{{ article.excerpt }}</p>

      <div class="info-box">
        <h3>🏷️ Applied Schema.org Data:</h3>
        <pre>{{ JSON.stringify(schemas, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRoute } from "vue-router";
import {
  useSeo,
  useStructuredData,
} from "../../../src/adapters/VueSPAAdapter.ts";

const route = useRoute();

const article = reactive({
  title: "Getting Started with Vue SEO",
  author: "John Doe",
  publishedDate: "2024-01-15",
  excerpt:
    "Learn how to implement SEO in Vue.js applications using the m-seo adapter with structured data support.",
});

// SEO Meta Tags
useSeo({
  title: `${article.title} - Blog`,
  description: article.excerpt,
  keywords: ["vue", "seo", "tutorial", "structured data"],
});

// Structured Data
const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    author: {
      "@type": "Person",
      name: article.author,
    },
    datePublished: article.publishedDate,
    description: article.excerpt,
  },
];

useStructuredData(schemas);
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  max-width: 800px;
  width: 100%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

h1 {
  color: #667eea;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  color: #999;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

p {
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.info-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.info-box h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

pre {
  background: #2d2d2d;
  color: #f8f8f2;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  font-size: 0.85rem;
  line-height: 1.5;
}
</style>
