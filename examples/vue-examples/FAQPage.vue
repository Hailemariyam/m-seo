<template>
  <div class="faq-page">
    <h1>Frequently Asked Questions</h1>
    <p class="intro">
      Find answers to common questions about our products and services.
    </p>

    <div class="faq-list">
      <details v-for="faq in faqs" :key="faq.question" class="faq-item">
        <summary class="question">{{ faq.question }}</summary>
        <p class="answer">{{ faq.answer }}</p>
      </details>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSeo, useStructuredData } from "../../src/adapters/VueSPAAdapter";

const faqs = ref([
  {
    question: "What is Vue 3?",
    answer:
      "Vue 3 is the latest major version of the Vue.js framework, featuring the Composition API, improved performance, and better TypeScript support.",
  },
  {
    question: "How do I install m-seo?",
    answer:
      "You can install m-seo using npm: npm install m-seo, or yarn: yarn add m-seo, or pnpm: pnpm add m-seo.",
  },
  {
    question: "Does m-seo work with Vue 2?",
    answer:
      "The VueSPAAdapter is designed for Vue 3. For Vue 2, you can use the core SeoEngine class directly.",
  },
  {
    question: "How do I add SEO to my Vue app?",
    answer:
      "Import the useSeo composable from m-seo/adapters/VueSPAAdapter and call it in your components setup function.",
  },
  {
    question: "Does m-seo support server-side rendering?",
    answer:
      "Yes! m-seo works with Nuxt.js and other SSR frameworks. Use the core API or framework-specific adapters.",
  },
]);

// FAQ page SEO
useSeo({
  title: "FAQ - Frequently Asked Questions",
  description:
    "Find answers to common questions about Vue 3, m-seo, and web development",
  keywords: ["faq", "vue", "questions", "help", "m-seo"],
  canonical: "https://example.com/faq",
});

// FAQ structured data
useStructuredData({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.value.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
});
</script>

<style scoped>
.faq-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.intro {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 2rem;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: border-color 0.3s;
}

.faq-item[open] {
  border-color: #42b883;
}

.question {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  cursor: pointer;
  user-select: none;
  list-style: none;
}

.question::-webkit-details-marker {
  display: none;
}

.question::before {
  content: "▶";
  display: inline-block;
  margin-right: 0.5rem;
  transition: transform 0.3s;
  color: #42b883;
}

.faq-item[open] .question::before {
  transform: rotate(90deg);
}

.answer {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
  color: #555;
  line-height: 1.6;
}
</style>
