# Examples

Real-world examples for using **m-seo** in different frameworks and scenarios.

## Table of Contents

- [React Examples](#react-examples)
- [Next.js Examples](#nextjs-examples)
- [Vue Examples](#vue-examples)
- [Express Examples](#express-examples)
- [Nuxt Examples](#nuxt-examples)
- [Svelte Examples](#svelte-examples)
- [Static HTML Examples](#static-html-examples)
- [Advanced Examples](#advanced-examples)

---

## React Examples

### Basic Page SEO

```jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home - My React App",
    description: "Welcome to my awesome React application",
    canonical: "https://example.com",
    ogImage: "https://example.com/og-home.jpg",
    keywords: ["react", "spa", "web app"],
  });

  return (
    <div>
      <h1>Welcome Home</h1>
      <p>This is the homepage</p>
    </div>
  );
}
```

### Blog Post with Structured Data

```jsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function BlogPost({ post }) {
  useSeo({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    canonical: `https://example.com/blog/${post.slug}`,
    ogImage: post.coverImage,
    ogType: "article",
    author: post.author.name,
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: `https://example.com/authors/${post.author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: "My Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://example.com/logo.png",
      },
    },
    description: post.excerpt,
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <img src={post.coverImage} alt={post.title} />
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### E-commerce Product Page

```jsx
import {
  useSeo,
  useStructuredData,
  useBreadcrumbs,
} from "m-seo/adapters/ReactSPAAdapter";

function ProductPage({ product, category }) {
  useSeo({
    title: `${product.name} - Shop`,
    description: product.description,
    canonical: `https://example.com/products/${product.slug}`,
    ogImage: product.images[0],
    ogType: "product",
  });

  useBreadcrumbs([
    { name: "Home", url: "https://example.com" },
    { name: "Shop", url: "https://example.com/shop" },
    { name: category.name, url: `https://example.com/shop/${category.slug}` },
    { name: product.name, url: `https://example.com/products/${product.slug}` },
  ]);

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.description,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: `https://example.com/products/${product.slug}`,
      priceCurrency: "USD",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "My Store",
      },
    },
    aggregateRating:
      product.reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.averageRating,
            reviewCount: product.reviews.length,
          }
        : undefined,
  });

  return (
    <div className="product">
      <h1>{product.name}</h1>
      <img src={product.images[0]} alt={product.name} />
      <p className="price">${product.price}</p>
      <p>{product.description}</p>
      <button>Add to Cart</button>
    </div>
  );
}
```

### Using Components Instead of Hooks

```jsx
import { SeoHead, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function AboutPage() {
  return (
    <div>
      <SeoHead
        title="About Us - Company"
        description="Learn more about our company and mission"
        canonical="https://example.com/about"
        ogImage="https://example.com/og-about.jpg"
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "My Company",
          url: "https://example.com",
          logo: "https://example.com/logo.png",
          description: "We build amazing products",
          contactPoint: {
            "@type": "ContactPoint",
            telephone: "+1-555-1234",
            contactType: "customer service",
          },
        }}
      />

      <h1>About Us</h1>
      <p>We are an amazing company...</p>
    </div>
  );
}
```

---

## Next.js Examples

### App Router (Next.js 13+)

```tsx
// app/layout.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Next.js App",
  description: "Welcome to my app",
};

// app/page.tsx
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Home page description",
  openGraph: {
    title: "Home",
    description: "Home page description",
    images: ["/og-home.jpg"],
  },
};

export default function HomePage() {
  return <h1>Home</h1>;
}
```

### Pages Router (Next.js 12 and below)

```tsx
// pages/index.tsx
import Head from "next/head";
import { SeoEngine } from "m-seo";

export default function HomePage() {
  const seo = new SeoEngine({
    title: "Home - My Next.js App",
    description: "Welcome to my Next.js application",
    canonical: "https://example.com",
    ogImage: "https://example.com/og-home.jpg",
  });

  return (
    <>
      <Head>
        <title>{seo.getConfig().title}</title>
        {seo.generateMetaTags().map((tag, i) => (
          <meta key={i} {...tag} />
        ))}
        {seo.generateLinkTags().map((tag, i) => (
          <link key={i} {...tag} />
        ))}
      </Head>
      <h1>Home</h1>
    </>
  );
}
```

### Dynamic Blog Post with SSR

```tsx
// pages/blog/[slug].tsx
import Head from "next/head";
import { SeoEngine, StructuredDataManager } from "m-seo";
import { GetServerSideProps } from "next";

interface Props {
  post: {
    title: string;
    excerpt: string;
    content: string;
    coverImage: string;
    publishedAt: string;
    author: { name: string };
  };
}

export default function BlogPost({ post }: Props) {
  const seo = new SeoEngine({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    ogImage: post.coverImage,
    ogType: "article",
  });

  const sd = new StructuredDataManager();
  sd.addArticle({
    headline: post.title,
    datePublished: post.publishedAt,
    author: { name: post.author.name },
    image: post.coverImage,
  });

  return (
    <>
      <Head>
        <title>{seo.getConfig().title}</title>
        {seo.generateMetaTags().map((tag, i) => (
          <meta key={i} {...tag} />
        ))}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(sd.toJson()),
          }}
        />
      </Head>
      <article>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await fetchPost(params?.slug as string);
  return { props: { post } };
};
```

---

## Vue Examples

### Vue 3 Composition API

```vue
<script setup>
import { onMounted } from "vue";
import { SeoEngine, StructuredDataManager } from "m-seo";

const props = defineProps({
  post: Object,
});

onMounted(() => {
  const seo = new SeoEngine({
    title: `${props.post.title} - Blog`,
    description: props.post.excerpt,
    canonical: `https://example.com/blog/${props.post.slug}`,
    ogImage: props.post.coverImage,
  });

  // Update document title
  document.title = seo.getConfig().title;

  // Inject meta tags
  const metaTags = seo.generateMetaTags();
  metaTags.forEach((tag) => {
    const meta = document.createElement("meta");
    Object.keys(tag).forEach((key) => {
      meta.setAttribute(key, tag[key]);
    });
    document.head.appendChild(meta);
  });

  // Add structured data
  const sd = new StructuredDataManager();
  sd.addArticle({
    headline: props.post.title,
    datePublished: props.post.publishedAt,
    author: { name: props.post.author.name },
  });

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(sd.toJson());
  document.head.appendChild(script);
});
</script>

<template>
  <article>
    <h1>{{ post.title }}</h1>
    <div v-html="post.content"></div>
  </article>
</template>
```

### Vue 2 Options API

```vue
<script>
import { SeoEngine } from "m-seo";

export default {
  name: "HomePage",
  mounted() {
    const seo = new SeoEngine({
      title: "Home - My Vue App",
      description: "Welcome to my Vue application",
      canonical: "https://example.com",
    });

    document.title = seo.getConfig().title;

    const metaTags = seo.generateMetaTags();
    metaTags.forEach((tag) => {
      const meta = document.createElement("meta");
      if (tag.name) meta.setAttribute("name", tag.name);
      if (tag.property) meta.setAttribute("property", tag.property);
      meta.setAttribute("content", tag.content);
      document.head.appendChild(meta);
    });
  },
};
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

---

## Express Examples

### Basic Express Server with SEO

```javascript
const express = require("express");
const { SeoEngine, SitemapGenerator, RobotsManager } = require("m-seo");

const app = express();

// Homepage
app.get("/", (req, res) => {
  const seo = new SeoEngine({
    title: "Home - My Express App",
    description: "Welcome to my Express application",
    canonical: "https://example.com",
    ogImage: "https://example.com/og-home.jpg",
  });

  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        ${seo.toHtmlString()}
      </head>
      <body>
        <h1>Home</h1>
        <p>Welcome to my Express app</p>
      </body>
    </html>
  `);
});

// Blog post
app.get("/blog/:slug", async (req, res) => {
  const post = await getPost(req.params.slug);

  const seo = new SeoEngine({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    canonical: `https://example.com/blog/${post.slug}`,
    ogImage: post.coverImage,
  });

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        ${seo.toHtmlString()}
      </head>
      <body>
        <article>
          <h1>${post.title}</h1>
          <div>${post.content}</div>
        </article>
      </body>
    </html>
  `);
});

// Sitemap
const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
});

sitemap.addUrl({ loc: "/", changefreq: "daily", priority: 1.0 });
sitemap.addUrl({ loc: "/about", changefreq: "monthly", priority: 0.8 });
sitemap.addUrl({ loc: "/blog", changefreq: "weekly", priority: 0.9 });

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  res.send(sitemap.toXml());
});

// Robots.txt
const robots = new RobotsManager();
robots.allowAll().setSitemap("https://example.com/sitemap.xml");

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(robots.toString());
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

### Express Middleware

```javascript
const express = require("express");
const { ExpressAdapter } = require("m-seo/adapters/ExpressAdapter");

const app = express();

// Use SEO middleware
app.use(
  ExpressAdapter({
    defaults: {
      siteName: "My Express App",
      locale: "en_US",
      themeColor: "#3490dc",
      author: "John Doe",
    },
    sitemapRoute: "/sitemap.xml",
    robotsRoute: "/robots.txt",
  })
);

// Routes automatically inherit default SEO config
app.get("/", (req, res) => {
  res.render("home", {
    seo: {
      title: "Home",
      description: "Welcome home",
    },
  });
});

app.listen(3000);
```

---

## Nuxt Examples

### Nuxt 3

```vue
<!-- pages/index.vue -->
<script setup>
import { useSeoMeta, useHead } from "#app";
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "Home - My Nuxt App",
  description: "Welcome to my Nuxt application",
  ogImage: "https://example.com/og-home.jpg",
});

const config = seo.getConfig();

useHead({
  title: config.title,
  meta: seo.generateMetaTags(),
  link: seo.generateLinkTags(),
});
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

### Nuxt 2

```vue
<!-- pages/index.vue -->
<script>
import { SeoEngine } from "m-seo";

export default {
  head() {
    const seo = new SeoEngine({
      title: "Home - My Nuxt App",
      description: "Welcome to my Nuxt application",
    });

    return {
      title: seo.getConfig().title,
      meta: seo.generateMetaTags(),
      link: seo.generateLinkTags(),
    };
  },
};
</script>

<template>
  <div>
    <h1>Home</h1>
  </div>
</template>
```

---

## Svelte Examples

### SvelteKit

```svelte
<!-- routes/+page.svelte -->
<script>
  import { onMount } from 'svelte';
  import { SeoEngine } from 'm-seo';

  onMount(() => {
    const seo = new SeoEngine({
      title: 'Home - My Svelte App',
      description: 'Welcome to my Svelte application',
      canonical: 'https://example.com'
    });

    document.title = seo.getConfig().title;

    const metaTags = seo.generateMetaTags();
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      Object.keys(tag).forEach(key => {
        meta.setAttribute(key, tag[key]);
      });
      document.head.appendChild(meta);
    });
  });
</script>

<svelte:head>
  <title>Home - My Svelte App</title>
</svelte:head>

<h1>Home</h1>
```

---

## Static HTML Examples

### Pure JavaScript

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Loading...</title>
  </head>
  <body>
    <h1>Home</h1>

    <script type="module">
      import { SeoEngine } from "https://cdn.skypack.dev/m-seo";

      const seo = new SeoEngine({
        title: "Home - My Static Site",
        description: "Welcome to my static website",
        canonical: window.location.href,
        ogImage: "https://example.com/og.jpg",
        keywords: ["static", "html", "website"],
      });

      // Set title
      document.title = seo.getConfig().title;

      // Inject meta tags
      const metaTags = seo.generateMetaTags();
      metaTags.forEach((tag) => {
        const meta = document.createElement("meta");
        if (tag.name) meta.setAttribute("name", tag.name);
        if (tag.property) meta.setAttribute("property", tag.property);
        meta.setAttribute("content", tag.content);
        document.head.appendChild(meta);
      });

      // Inject link tags
      const linkTags = seo.generateLinkTags();
      linkTags.forEach((tag) => {
        const link = document.createElement("link");
        Object.keys(tag).forEach((key) => {
          link.setAttribute(key, tag[key]);
        });
        document.head.appendChild(link);
      });
    </script>
  </body>
</html>
```

---

## Advanced Examples

### Dynamic Sitemap Generation

```javascript
const express = require("express");
const { SitemapGenerator } = require("m-seo");

const app = express();

app.get("/sitemap.xml", async (req, res) => {
  const sitemap = new SitemapGenerator({
    hostname: "https://example.com",
  });

  // Static pages
  sitemap.addUrl({ loc: "/", changefreq: "daily", priority: 1.0 });
  sitemap.addUrl({ loc: "/about", changefreq: "monthly", priority: 0.8 });

  // Dynamic blog posts from database
  const posts = await Post.findAll();
  posts.forEach((post) => {
    sitemap.addUrl({
      loc: `/blog/${post.slug}`,
      lastmod: post.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    });
  });

  // Dynamic products
  const products = await Product.findAll();
  products.forEach((product) => {
    sitemap.addUrl({
      loc: `/products/${product.slug}`,
      lastmod: product.updatedAt,
      changefreq: "daily",
      priority: 0.9,
    });
  });

  res.type("application/xml");
  res.send(sitemap.toXml());
});

app.listen(3000);
```

### Multi-language Support

```javascript
const { SitemapGenerator } = require("m-seo");

const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
});

sitemap.addUrl({
  loc: "/en/blog/post-1",
  alternates: [
    { hreflang: "en", href: "https://example.com/en/blog/post-1" },
    { hreflang: "es", href: "https://example.com/es/blog/post-1" },
    { hreflang: "fr", href: "https://example.com/fr/blog/post-1" },
    { hreflang: "x-default", href: "https://example.com/en/blog/post-1" },
  ],
});
```

### FAQ Schema

```jsx
import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function FAQPage({ faqs }) {
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  });

  return (
    <div>
      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq) => (
        <div key={faq.id}>
          <h2>{faq.question}</h2>
          <p>{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}
```

### Video Schema

```jsx
import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function VideoPage({ video }) {
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.title,
    description: video.description,
    thumbnailUrl: video.thumbnail,
    uploadDate: video.uploadedAt,
    duration: video.duration, // ISO 8601 format: PT1M30S
    contentUrl: video.url,
    embedUrl: video.embedUrl,
  });

  return (
    <div>
      <h1>{video.title}</h1>
      <video src={video.url} poster={video.thumbnail} controls />
    </div>
  );
}
```

---

## Next Steps

- **[Read API Reference](api.md)** - Detailed API documentation
- **[Check FAQ](faq.md)** - Common questions
- **[View Project Structure](project-structure.md)** - Code organization

Need more examples? [Open an issue](https://github.com/Hailemariyam/m-seo/issues) or contribute your own!
