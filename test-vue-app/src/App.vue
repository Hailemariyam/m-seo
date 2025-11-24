<template>
  <div id="app">
    <nav class="navbar">
      <h1>🚀 m-seo Vue.js Test App</h1>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/blog/getting-started-with-vue-seo"
          >Blog Post</router-link
        >
        <router-link to="/product/vue-seo-toolkit">Product</router-link>
        <router-link to="/breadcrumbs">Breadcrumbs</router-link>
        <router-link to="/faq">FAQ</router-link>
      </div>
    </nav>

    <main>
      <router-view />
    </main>

    <footer>
      <p>Testing Vue SPA Adapter from m-seo package</p>
      <p>Open DevTools → Elements → &lt;head&gt; to see SEO meta tags!</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar h1 {
  color: #667eea;
  margin-bottom: 0.5rem;
}

.nav-links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-links a {
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s;
  font-weight: 500;
}

.nav-links a:hover {
  background: #667eea;
  color: white;
}

.nav-links a.router-link-active {
  background: #667eea;
  color: white;
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 1rem;
  text-align: center;
}

footer p {
  margin: 0.25rem 0;
}
</style>
