<template>
  <div class="page">
    <div class="card">
      <h1>🏠 Home Page</h1>
      <p>Testing basic SEO meta tags with Vue SPA Adapter</p>

      <div class="info-box">
        <h3>📋 Applied SEO Tags:</h3>
        <ul>
          <li>Title: {{ seoConfig.title }}</li>
          <li>Description: {{ seoConfig.description }}</li>
          <li>Keywords: {{ seoConfig.keywords?.join(", ") }}</li>
          <li>Canonical: {{ seoConfig.canonical }}</li>
        </ul>
      </div>

      <div class="action-box">
        <h3>🔧 Try Dynamic Updates:</h3>
        <button @click="updateTitle">Change Title</button>
        <button @click="updateDescription">Change Description</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useSeo, useOpenGraph } from "../../../src/adapters/VueSPAAdapter.ts";

const seoConfig = reactive({
  title: "Home - Vue SEO Test",
  description: "Testing Vue.js SEO adapter with reactive meta tags",
  keywords: ["vue", "seo", "meta tags", "spa"],
  canonical: "https://example.com/",
});

const ogConfig = {
  type: "website",
  title: "Home - Vue SEO Test",
  description: "Testing Vue.js SEO adapter",
  image: "https://example.com/og-image.jpg",
};

useSeo(seoConfig);
useOpenGraph(ogConfig);

const updateTitle = () => {
  seoConfig.title = `Updated at ${new Date().toLocaleTimeString()}`;
};

const updateDescription = () => {
  seoConfig.description = `Description updated at ${new Date().toLocaleTimeString()}`;
};
</script>

<style scoped>
.page {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
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

.info-box,
.action-box {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.info-box h3,
.action-box h3 {
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

.action-box {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

button {
  background: #667eea;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s;
}

button:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}
</style>
