<template>
  <div class="home-page">
    <h1>Home Page</h1>
    <p>Welcome to my Vue site with SEO!</p>
  </div>
</template>

<script setup lang="ts">
import { useSeo } from "../../src/adapters/VueSPAAdapter";

// Basic SEO setup
useSeo({
  title: "Home - My Vue Site",
  description: "Welcome to my Vue-powered website with full SEO support",
  keywords: ["vue", "seo", "web development", "m-seo"],
  author: "Your Name",
  canonical: "https://example.com/",
  themeColor: "#42b883",
});
</script>

<style scoped>
.home-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #42b883;
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

p {
  font-size: 1.2rem;
  color: #2c3e50;
}
</style>
