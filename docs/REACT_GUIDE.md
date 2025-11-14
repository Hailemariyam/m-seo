# React Guide for m-seo

Complete guide for using **m-seo** in React applications.

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Hooks](#hooks)
- [Components](#components)
- [Advanced Usage](#advanced-usage)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Installation

```bash
npm install m-seo react react-dom
# or
yarn add m-seo react react-dom
# or
pnpm add m-seo react react-dom
```

## Quick Start

### Basic Page with SEO

```tsx
import React from "react";
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({
    title: "Home - My App",
    description: "Welcome to my amazing React application",
    keywords: ["react", "seo", "app"],
    canonical: "https://example.com",
    ogImage: "https://example.com/og-image.jpg",
  });

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Your page now has perfect SEO.</p>
    </div>
  );
}
```

## Hooks

### `useSeo(config, deps?)`

The primary hook for managing SEO meta tags.

**Parameters:**

- `config`: SEO configuration object
- `deps?`: Optional dependency array (like `useEffect`)

**Example:**

```tsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function ProductPage({ product }) {
  useSeo(
    {
      title: `${product.name} - Shop`,
      description: product.description,
      ogImage: product.image,
      canonical: `https://example.com/products/${product.id}`,
    },
    [product]
  ); // Updates when product changes

  return <div>{/* ... */}</div>;
}
```

**Available Config Options:**

```typescript
interface SeoConfig {
  title?: string; // Page title
  description?: string; // Meta description
  keywords?: string[]; // Keywords array
  canonical?: string; // Canonical URL
  ogImage?: string; // Open Graph image
  author?: string; // Author name
  siteName?: string; // Site name
  locale?: string; // Locale (e.g., 'en_US')
  themeColor?: string; // Theme color
  robots?: string; // Robots meta tag
}
```

### `useStructuredData(schemas, deps?)`

Add JSON-LD structured data to your pages.

**Example:**

```tsx
import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function ArticlePage({ article }) {
  useStructuredData(
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.title,
      description: article.excerpt,
      image: article.image,
      datePublished: article.publishDate,
      author: {
        "@type": "Person",
        name: article.author,
      },
    },
    [article]
  );

  return <article>{/* ... */}</article>;
}
```

### `useBreadcrumbs(items, deps?)`

Add breadcrumb structured data for better navigation SEO.

**Example:**

```tsx
import { useBreadcrumbs } from "m-seo/adapters/ReactSPAAdapter";

function CategoryPage() {
  useBreadcrumbs([
    { name: "Home", url: "https://example.com" },
    { name: "Products", url: "https://example.com/products" },
    { name: "Electronics", url: "https://example.com/products/electronics" },
  ]);

  return <div>{/* ... */}</div>;
}
```

## Components

### `<SeoHead>`

Component alternative to the `useSeo` hook.

**Example:**

```tsx
import { SeoHead } from "m-seo/adapters/ReactSPAAdapter";

function AboutPage() {
  return (
    <div>
      <SeoHead
        title="About Us"
        description="Learn about our company"
        canonical="https://example.com/about"
      />

      <h1>About Us</h1>
    </div>
  );
}
```

### `<JsonLd>`

Component for adding structured data.

**Example:**

```tsx
import { JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function ProductPage({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.image,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
    },
  };

  return (
    <div>
      <JsonLd data={schema} />
      <h1>{product.name}</h1>
    </div>
  );
}
```

## Advanced Usage

### Higher-Order Component (HOC)

Wrap components with SEO configuration:

```tsx
import { withSeo } from "m-seo/adapters/ReactSPAAdapter";

const ContactPage = withSeo({
  title: "Contact Us",
  description: "Get in touch with our team",
})(function ContactPage() {
  return <div>Contact form...</div>;
});
```

### Dynamic SEO with Props

```tsx
const DynamicSeoPage = withSeo((props) => ({
  title: `${props.title} - My Site`,
  description: props.description,
}))(function Page(props) {
  return <div>{props.content}</div>;
});
```

### Multiple Structured Data Schemas

```tsx
import { JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function OrganizationPage() {
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "My Company",
      url: "https://example.com",
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "My Website",
      url: "https://example.com",
    },
  ];

  return (
    <div>
      <JsonLd data={schemas} />
      <h1>My Company</h1>
    </div>
  );
}
```

### Class Components (Legacy)

```tsx
import React from "react";
import { ReactSPAAdapter } from "m-seo/adapters/ReactSPAAdapter";

class LegacyPage extends React.Component {
  seoAdapter = new ReactSPAAdapter({
    title: "Legacy Page",
    description: "Works with class components",
  });

  componentDidMount() {
    this.seoAdapter.applySeo();
  }

  componentWillUnmount() {
    this.seoAdapter.clear();
  }

  render() {
    return <div>Content</div>;
  }
}
```

## Examples

### Blog Post with Full SEO

```tsx
import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

function BlogPost({ post }) {
  useSeo({
    title: `${post.title} - Blog`,
    description: post.excerpt,
    ogImage: post.featuredImage,
    canonical: `https://example.com/blog/${post.slug}`,
    author: post.author.name,
  });

  useStructuredData({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage,
    datePublished: post.publishDate,
    dateModified: post.modifiedDate,
    author: {
      "@type": "Person",
      name: post.author.name,
      url: post.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: "My Blog",
      logo: {
        "@type": "ImageObject",
        url: "https://example.com/logo.png",
      },
    },
  });

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

### E-commerce Product Page

```tsx
import { useSeo, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function ProductPage({ product }) {
  useSeo({
    title: `${product.name} - ${product.price}`,
    description: product.description,
    ogImage: product.images[0],
    canonical: `https://shop.example.com/products/${product.id}`,
  });

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "USD",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  };

  return (
    <div>
      <JsonLd data={productSchema} />
      <h1>{product.name}</h1>
      <p>${product.price}</p>
    </div>
  );
}
```

### Recipe Page with Rich Snippets

```tsx
import { useSeo, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

function RecipePage({ recipe }) {
  useSeo({
    title: `${recipe.name} - Recipes`,
    description: recipe.description,
    ogImage: recipe.image,
  });

  const recipeSchema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.name,
    description: recipe.description,
    image: recipe.image,
    author: {
      "@type": "Person",
      name: recipe.author,
    },
    datePublished: recipe.publishDate,
    prepTime: `PT${recipe.prepTime}M`,
    cookTime: `PT${recipe.cookTime}M`,
    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,
    recipeYield: recipe.servings,
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.instructions.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      text: step,
    })),
    nutrition: {
      "@type": "NutritionInformation",
      calories: `${recipe.calories} calories`,
    },
  };

  return (
    <div>
      <JsonLd data={recipeSchema} />
      <h1>{recipe.name}</h1>
      {/* Recipe content */}
    </div>
  );
}
```

## Best Practices

### 1. Always Set Dependencies

When using hooks with dynamic data, always specify dependencies:

```tsx
// ✅ Good
useSeo({ title: product.name }, [product]);

// ❌ Bad - SEO won't update when product changes
useSeo({ title: product.name });
```

### 2. Use Canonical URLs

Always include canonical URLs to avoid duplicate content issues:

```tsx
useSeo({
  canonical: `https://example.com${window.location.pathname}`,
});
```

### 3. Optimize Images

Use properly sized Open Graph images (1200x630px recommended):

```tsx
useSeo({
  ogImage: "https://example.com/og-image-1200x630.jpg",
});
```

### 4. Include Structured Data

Search engines love structured data. Always include it when relevant:

```tsx
// For articles
useStructuredData({ '@type': 'Article', ... });

// For products
useStructuredData({ '@type': 'Product', ... });

// For local businesses
useStructuredData({ '@type': 'LocalBusiness', ... });
```

### 5. Keep Descriptions Under 160 Characters

```tsx
const description = longText.substring(0, 157) + "...";
useSeo({ description });
```

### 6. Use Keywords Strategically

Don't stuff keywords, use 3-7 relevant ones:

```tsx
useSeo({
  keywords: ["react", "seo", "web development"],
});
```

### 7. Test Your SEO

Use tools to validate:

- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### 8. Server-Side Rendering (SSR)

For Next.js or other SSR frameworks, use the core engine:

```tsx
import { SeoEngine } from "m-seo";

export async function getServerSideProps() {
  const seo = new SeoEngine({
    title: "SSR Page",
    description: "Server-rendered SEO",
  });

  return {
    props: {
      seoHtml: seo.toHtmlString(),
    },
  };
}
```

## Integration with Popular Libraries

### React Router

```tsx
import { useLocation } from "react-router-dom";
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function Page() {
  const location = useLocation();

  useSeo(
    {
      canonical: `https://example.com${location.pathname}`,
    },
    [location.pathname]
  );
}
```

### React Helmet Migration

If you're migrating from React Helmet:

```tsx
// Before (React Helmet)
<Helmet>
  <title>My Page</title>
  <meta name="description" content="Description" />
</Helmet>

// After (m-seo)
<SeoHead
  title="My Page"
  description="Description"
/>
```

## Troubleshooting

### Meta Tags Not Updating

Make sure you're passing dependencies:

```tsx
useSeo(config, [dep1, dep2]);
```

### Duplicate Tags

Only use one SEO method per page (either hook or component, not both).

### TypeScript Errors

Make sure you have `@types/react` installed:

```bash
npm install --save-dev @types/react
```

## Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/Hailemariyam/m-seo/issues)
- **Documentation**: [Full docs](https://github.com/Hailemariyam/m-seo)
- **Examples**: See `/examples/react-usage.tsx`

## License

MIT © Hailemariyam Kebede
