<template>
  <div class="breadcrumb-page">
    <nav aria-label="Breadcrumb" class="breadcrumb-nav">
      <ol class="breadcrumb-list">
        <li
          v-for="(crumb, index) in breadcrumbs"
          :key="crumb.url"
          class="breadcrumb-item"
        >
          <a :href="crumb.url">{{ crumb.name }}</a>
          <span v-if="index < breadcrumbs.length - 1" class="separator">/</span>
        </li>
      </ol>
    </nav>

    <h1>Current Page Content</h1>
    <p>
      This page demonstrates breadcrumb navigation with SEO structured data.
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useSeo, useBreadcrumbs } from "../../src/adapters/VueSPAAdapter";

const breadcrumbs = ref([
  { name: "Home", url: "https://example.com/" },
  { name: "Products", url: "https://example.com/products" },
  { name: "Electronics", url: "https://example.com/products/electronics" },
  {
    name: "Headphones",
    url: "https://example.com/products/electronics/headphones",
  },
]);

// Page SEO
useSeo({
  title: "Headphones - Electronics - Products",
  description: "Browse our selection of premium headphones",
  canonical: "https://example.com/products/electronics/headphones",
});

// Breadcrumb structured data
useBreadcrumbs(breadcrumbs);
</script>

<style scoped>
.breadcrumb-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.breadcrumb-nav {
  margin-bottom: 2rem;
}

.breadcrumb-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  flex-wrap: wrap;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item a {
  color: #42b883;
  text-decoration: none;
  padding: 0.5rem;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item:last-child a {
  color: #2c3e50;
  font-weight: 600;
}

.separator {
  color: #999;
  margin: 0 0.5rem;
}

h1 {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

p {
  color: #666;
  line-height: 1.6;
}
</style>
