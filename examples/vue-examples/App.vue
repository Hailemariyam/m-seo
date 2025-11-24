<template>
  <div id="app">
    <nav class="main-nav">
      <router-link to="/">Home</router-link>
      <router-link to="/blog">Blog</router-link>
      <router-link to="/product">Product</router-link>
      <router-link to="/breadcrumbs">Breadcrumbs</router-link>
      <router-link to="/faq">FAQ</router-link>
    </nav>

    <main>
      <router-view />
    </main>

    <footer class="main-footer">
      <p>&copy; 2025 Vue SEO Example. Powered by m-seo.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
// This is the main App component
// SEO is handled by individual page components
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: #2c3e50;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-nav {
  background: #42b883;
  padding: 1rem 2rem;
  display: flex;
  gap: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-nav a {
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.main-nav a:hover {
  background: rgba(255, 255, 255, 0.2);
}

.main-nav a.router-link-active {
  background: rgba(255, 255, 255, 0.3);
}

main {
  flex: 1;
}

.main-footer {
  background: #2c3e50;
  color: white;
  text-align: center;
  padding: 2rem;
  margin-top: 4rem;
}
</style>
