<template>
  <div class="page">
    <div class="card">
      <h1>❓ Frequently Asked Questions</h1>
      <p>Testing FAQ structured data for rich search results</p>

      <div class="faq-list">
        <div v-for="(faq, index) in faqs" :key="index" class="faq-item">
          <h3>{{ faq.question }}</h3>
          <p>{{ faq.answer }}</p>
        </div>
      </div>

      <div class="info-box">
        <h3>💡 FAQPage Schema Applied</h3>
        <p>
          This page includes FAQPage structured data that can show up as rich
          results in Google Search
        </p>
        <p>Total Questions: {{ faqs.length }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  useSeo,
  useStructuredData,
} from "../../../src/adapters/VueSPAAdapter.ts";

const faqs = reactive([
  {
    question: "What is m-seo?",
    answer:
      "m-seo is a comprehensive SEO toolkit for JavaScript frameworks including Vue.js, React, and more.",
  },
  {
    question: "How do I install m-seo?",
    answer: "You can install m-seo using npm: npm install m-seo",
  },
  {
    question: "Does it support TypeScript?",
    answer:
      "Yes! m-seo is written in TypeScript and includes full type definitions.",
  },
  {
    question: "What features does it include?",
    answer:
      "It includes meta tag management, structured data, breadcrumbs, Open Graph tags, and more.",
  },
]);

useSeo({
  title: "FAQ - Vue SEO Test",
  description: "Frequently asked questions about Vue.js SEO implementation",
});

const schemas = [
  {
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

p {
  color: #666;
  line-height: 1.6;
}

.faq-list {
  margin: 2rem 0;
}

.faq-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.faq-item h3 {
  color: #667eea;
  margin-bottom: 0.75rem;
  font-size: 1.1rem;
}

.faq-item p {
  color: #666;
  margin: 0;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #667eea;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-box h3 {
  color: #667eea;
  margin-bottom: 0.75rem;
}

.info-box p {
  margin: 0.5rem 0;
}
</style>
