<template>
  <div class="page">
    <div class="card">
      <div class="product-header">
        <h1>🛍️ {{ product.name }}</h1>
        <div class="price">${{ product.price }}</div>
      </div>

      <div class="rating">
        ⭐ {{ product.rating }} / 5 ({{ product.reviewCount }} reviews)
      </div>

      <p>{{ product.description }}</p>

      <div class="info-box">
        <h3>🏪 Product Schema Applied:</h3>
        <ul>
          <li>Type: Product</li>
          <li>Name: {{ product.name }}</li>
          <li>Price: ${{ product.price }} {{ product.currency }}</li>
          <li>Rating: {{ product.rating }}/5</li>
          <li>Availability: {{ product.availability }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import {
  useSeo,
  useStructuredData,
  useOpenGraph,
} from "../../../src/adapters/VueSPAAdapter.ts";

const product = reactive({
  name: "Vue SEO Toolkit",
  price: 49.99,
  currency: "USD",
  description:
    "Complete SEO solution for Vue.js applications with meta tags, structured data, and more.",
  rating: 4.8,
  reviewCount: 127,
  availability: "InStock",
  image: "https://example.com/product.jpg",
});

useSeo({
  title: `${product.name} - Products`,
  description: product.description,
  keywords: ["vue", "seo", "toolkit", "product"],
});

useOpenGraph({
  type: "product",
  title: product.name,
  description: product.description,
  image: product.image,
});

const schemas = [
  {
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

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

h1 {
  color: #667eea;
  margin: 0;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #28a745;
}

.rating {
  color: #ffc107;
  font-size: 1.1rem;
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

.info-box ul {
  list-style: none;
  padding: 0;
}

.info-box li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-box li:last-child {
  border-bottom: none;
}
</style>
