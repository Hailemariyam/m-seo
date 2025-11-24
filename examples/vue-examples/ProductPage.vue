<template>
  <div class="product-page">
    <div class="product-grid">
      <div class="product-images">
        <img :src="product.image" :alt="product.name" class="main-image" />
      </div>

      <div class="product-details">
        <h1>{{ product.name }}</h1>

        <div class="rating">
          <span class="stars">★★★★★</span>
          <span class="rating-count">({{ product.reviewCount }} reviews)</span>
        </div>

        <p class="description">{{ product.description }}</p>

        <div class="price-section">
          <span class="price">${{ product.price }}</span>
          <span v-if="product.oldPrice" class="old-price"
            >${{ product.oldPrice }}</span
          >
        </div>

        <div class="availability">
          <span
            :class="['status', product.inStock ? 'in-stock' : 'out-of-stock']"
          >
            {{ product.inStock ? "In Stock" : "Out of Stock" }}
          </span>
        </div>

        <button class="add-to-cart" :disabled="!product.inStock">
          Add to Cart
        </button>

        <div class="product-info">
          <p><strong>Brand:</strong> {{ product.brand }}</p>
          <p><strong>SKU:</strong> {{ product.sku }}</p>
          <p><strong>Category:</strong> {{ product.category }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSeo, useStructuredData } from "../../src/adapters/VueSPAAdapter";

const product = ref({
  name: "Premium Wireless Headphones",
  description:
    "High-quality noise-canceling wireless headphones with 30-hour battery life and premium sound quality.",
  price: 199.99,
  oldPrice: 249.99,
  currency: "USD",
  image: "https://example.com/products/headphones.jpg",
  brand: "AudioTech",
  sku: "ATP-WH-001",
  category: "Electronics > Audio > Headphones",
  inStock: true,
  availability: "https://schema.org/InStock",
  rating: 4.5,
  reviewCount: 128,
  condition: "https://schema.org/NewCondition",
});

// Product SEO
useSeo({
  title: `${product.value.name} - Shop Now`,
  description: product.value.description,
  keywords: ["headphones", "wireless", "noise-canceling", product.value.brand],
  ogImage: product.value.image,
  canonical: `https://example.com/products/${product.value.sku}`,
});

// Product structured data
useStructuredData({
  "@context": "https://schema.org",
  "@type": "Product",
  name: product.value.name,
  description: product.value.description,
  image: product.value.image,
  brand: {
    "@type": "Brand",
    name: product.value.brand,
  },
  sku: product.value.sku,
  category: product.value.category,
  offers: {
    "@type": "Offer",
    price: product.value.price,
    priceCurrency: product.value.currency,
    availability: product.value.availability,
    itemCondition: product.value.condition,
    priceValidUntil: "2025-12-31",
    url: `https://example.com/products/${product.value.sku}`,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: product.value.rating,
    reviewCount: product.value.reviewCount,
    bestRating: 5,
    worstRating: 1,
  },
});
</script>

<style scoped>
.product-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.product-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
}

.main-image {
  width: 100%;
  border-radius: 8px;
}

.product-details h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.stars {
  color: #ffd700;
  font-size: 1.2rem;
}

.rating-count {
  color: #666;
}

.description {
  line-height: 1.6;
  color: #555;
  margin-bottom: 1.5rem;
}

.price-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #42b883;
}

.old-price {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.availability {
  margin-bottom: 1rem;
}

.status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 600;
}

.in-stock {
  background: #d4edda;
  color: #155724;
}

.out-of-stock {
  background: #f8d7da;
  color: #721c24;
}

.add-to-cart {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 2rem;
}

.add-to-cart:hover:not(:disabled) {
  background: #35a372;
}

.add-to-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.product-info {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.product-info p {
  margin: 0.5rem 0;
  color: #666;
}

@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
