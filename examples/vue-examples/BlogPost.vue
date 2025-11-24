<template>
  <article class="blog-post">
    <header>
      <h1>{{ post.title }}</h1>
      <div class="meta">
        <time :datetime="post.publishedAt">{{
          formatDate(post.publishedAt)
        }}</time>
        <span class="author">By {{ post.author }}</span>
      </div>
    </header>

    <img :src="post.image" :alt="post.title" class="featured-image" />

    <div class="content" v-html="post.content"></div>

    <footer>
      <div class="tags">
        <span v-for="tag in post.tags" :key="tag" class="tag">{{ tag }}</span>
      </div>
    </footer>
  </article>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useSeo, useStructuredData } from "../../src/adapters/VueSPAAdapter";

const post = ref({
  title: "Understanding Vue 3 Composition API",
  content:
    "<p>Vue 3 brings powerful new features with the Composition API...</p><p>Learn how to use it effectively in your projects.</p>",
  excerpt:
    "Learn about the Composition API in Vue 3 and how it improves code organization",
  publishedAt: "2025-11-24T10:00:00Z",
  updatedAt: "2025-11-24T15:30:00Z",
  author: "Jane Developer",
  image: "https://example.com/blog/vue3-composition.jpg",
  tags: ["vue", "composition-api", "vue-3", "javascript"],
  readingTime: "5 min read",
});

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// SEO meta tags
useSeo({
  title: `${post.value.title} - My Blog`,
  description: post.value.excerpt,
  keywords: post.value.tags,
  ogImage: post.value.image,
  canonical: `https://example.com/blog/vue3-composition-api`,
  author: post.value.author,
});

// Article structured data
useStructuredData({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: post.value.title,
  description: post.value.excerpt,
  image: post.value.image,
  datePublished: post.value.publishedAt,
  dateModified: post.value.updatedAt,
  author: {
    "@type": "Person",
    name: post.value.author,
  },
  publisher: {
    "@type": "Organization",
    name: "My Blog",
    logo: {
      "@type": "ImageObject",
      url: "https://example.com/logo.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://example.com/blog/vue3-composition-api",
  },
});
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.meta {
  display: flex;
  gap: 1rem;
  color: #666;
  margin-bottom: 2rem;
}

.featured-image {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.content {
  line-height: 1.8;
  font-size: 1.1rem;
  color: #2c3e50;
}

.tags {
  display: flex;
  gap: 0.5rem;
  margin-top: 2rem;
}

.tag {
  background: #42b883;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.9rem;
}
</style>
