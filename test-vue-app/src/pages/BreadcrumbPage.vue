<template>
  <div class="page">
    <div class="card">
      <h1>🍞 Breadcrumb Navigation Test</h1>
      <p>Testing breadcrumb structured data with visual breadcrumbs</p>

      <div class="breadcrumb-display">
        <span v-for="(item, index) in breadcrumbs" :key="index">
          <a :href="item.url">{{ item.name }}</a>
          <span v-if="index < breadcrumbs.length - 1"> → </span>
        </span>
      </div>

      <div class="info-box">
        <h3>🗺️ Breadcrumb Schema Applied:</h3>
        <p>Check DevTools for BreadcrumbList structured data</p>
        <ul>
          <li v-for="(item, index) in breadcrumbs" :key="index">
            Position {{ index + 1 }}: {{ item.name }} ({{ item.url }})
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useSeo, useBreadcrumbs } from "../../../src/adapters/VueSPAAdapter.ts";

const breadcrumbs = reactive([
  { name: "Home", url: "https://example.com/" },
  { name: "Category", url: "https://example.com/category" },
  { name: "Subcategory", url: "https://example.com/category/subcategory" },
  {
    name: "Current Page",
    url: "https://example.com/category/subcategory/page",
  },
]);

useSeo({
  title: "Breadcrumb Navigation - Vue SEO Test",
  description: "Testing breadcrumb structured data implementation",
});

useBreadcrumbs(breadcrumbs);
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
  margin-bottom: 1.5rem;
}

.breadcrumb-display {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  font-size: 0.95rem;
}

.breadcrumb-display a {
  color: #667eea;
  text-decoration: none;
}

.breadcrumb-display a:hover {
  text-decoration: underline;
}

.breadcrumb-display span {
  color: #999;
}

.info-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
}

.info-box h3 {
  color: #667eea;
  margin-bottom: 1rem;
}

.info-box ul {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
}

.info-box li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
}

.info-box li:last-child {
  border-bottom: none;
}
</style>
