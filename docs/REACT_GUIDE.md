# ⚛️ React Guide - M-SEO# React Guide for m-seo

Complete guide to using M-SEO in React applications, from basic setup to advanced patterns.Complete guide for using **m-seo** in React applications.

## 📚 Table of Contents## Table of Contents

- [Installation](#installation)- [Installation](#installation)

- [Basic Usage](#basic-usage)- [Quick Start](#quick-start)

- [Intermediate Usage](#intermediate-usage)- [Hooks](#hooks)

- [Advanced Usage](#advanced-usage)- [Components](#components)

- [TypeScript](#typescript)- [Advanced Usage](#advanced-usage)

- [Best Practices](#best-practices)- [Examples](#examples)

- [Live Demo](#live-demo)- [Best Practices](#best-practices)

- [Troubleshooting](#troubleshooting)

## Installation

---

````bash

## Installationnpm install m-seo react react-dom

# or

```bashyarn add m-seo react react-dom

npm install m-seo# or

# orpnpm add m-seo react react-dom

yarn add m-seo```

# or

pnpm add m-seo## Quick Start

````

### Basic Page with SEO

---

````tsx

## Basic Usageimport React from "react";

import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

### 1. Simple Page with Meta Tags

function HomePage() {

```tsx  useSeo({

import React from 'react';    title: "Home - My App",

import { MetaManager } from 'm-seo';    description: "Welcome to my amazing React application",

    keywords: ["react", "seo", "app"],

function HomePage() {    canonical: "https://example.com",

  React.useEffect(() => {    ogImage: "https://example.com/og-image.jpg",

    const seo = new MetaManager();  });

    seo.setTitle('Home - My React App');

    seo.setDescription('Welcome to my amazing React application');  return (

    seo.setKeywords(['react', 'seo', 'web app']);    <div>

    seo.setCanonical('https://example.com/');      <h1>Welcome!</h1>

  }, []);      <p>Your page now has perfect SEO.</p>

    </div>

  return (  );

    <div>}

      <h1>Welcome Home!</h1>```

      <p>This page has perfect SEO meta tags.</p>

    </div>## Hooks

  );

}### `useSeo(config, deps?)`



export default HomePage;The primary hook for managing SEO meta tags.

````

**Parameters:**

### 2. Custom Hook for SEO

- `config`: SEO configuration object

```tsx- `deps?`: Optional dependency array (like `useEffect`)

import { useEffect } from 'react';

import { MetaManager } from 'm-seo';**Example:**

// Custom hook```tsx

function useSEO(config: {import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

title?: string;

description?: string;function ProductPage({ product }) {

keywords?: string[]; useSeo(

canonical?: string; {

}) { title: `${product.name} - Shop`,

useEffect(() => { description: product.description,

    const seo = new MetaManager();      ogImage: product.image,

          canonical: `https://example.com/products/${product.id}`,

    if (config.title) seo.setTitle(config.title);    },

    if (config.description) seo.setDescription(config.description);    [product]

    if (config.keywords) seo.setKeywords(config.keywords);  ); // Updates when product changes

    if (config.canonical) seo.setCanonical(config.canonical);

}, [config]); return <div>{/_ ... _/}</div>;

}}

````

// Usage

function AboutPage() {**Available Config Options:**

  useSEO({

    title: 'About Us - My Company',```typescript

    description: 'Learn about our mission and values',interface SeoConfig {

    canonical: 'https://example.com/about'  title?: string; // Page title

  });  description?: string; // Meta description

  keywords?: string[]; // Keywords array

  return <div>About content...</div>;  canonical?: string; // Canonical URL

}  ogImage?: string; // Open Graph image

```  author?: string; // Author name

  siteName?: string; // Site name

### 3. Open Graph & Social Media  locale?: string; // Locale (e.g., 'en_US')

  themeColor?: string; // Theme color

```tsx  robots?: string; // Robots meta tag

import React from 'react';}

import { MetaManager } from 'm-seo';```



function ProductPage({ product }) {### `useStructuredData(schemas, deps?)`

  React.useEffect(() => {

    const seo = new MetaManager();Add JSON-LD structured data to your pages.



    // Basic meta**Example:**

    seo.setTitle(`${product.name} - Shop`);

    seo.setDescription(product.description);```tsx

    import { useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

    // Open Graph for social sharing

    seo.setOpenGraph({function ArticlePage({ article }) {

      title: product.name,  useStructuredData(

      description: product.description,    {

      type: 'product',      "@context": "https://schema.org",

      url: `https://shop.example.com/products/${product.id}`,      "@type": "Article",

      image: product.imageUrl,      headline: article.title,

      siteName: 'My Shop'      description: article.excerpt,

    });      image: article.image,

          datePublished: article.publishDate,

    // Twitter Card      author: {

    seo.setTwitterCard({        "@type": "Person",

      card: 'summary_large_image',        name: article.author,

      site: '@myshop',      },

      title: product.name,    },

      description: product.description,    [article]

      image: product.imageUrl  );

    });

  }, [product]);  return <article>{/* ... */}</article>;

}

  return (```

    <div className="product">

      <img src={product.imageUrl} alt={product.name} />### `useBreadcrumbs(items, deps?)`

      <h1>{product.name}</h1>

      <p>{product.description}</p>Add breadcrumb structured data for better navigation SEO.

      <span>${product.price}</span>

    </div>**Example:**

  );

}```tsx

```import { useBreadcrumbs } from "m-seo/adapters/ReactSPAAdapter";



---function CategoryPage() {

  useBreadcrumbs([

## Intermediate Usage    { name: "Home", url: "https://example.com" },

    { name: "Products", url: "https://example.com/products" },

### 1. SEO Component Wrapper    { name: "Electronics", url: "https://example.com/products/electronics" },

  ]);

```tsx

import React from 'react';  return <div>{/* ... */}</div>;

import { MetaManager } from 'm-seo';}

````

interface SEOProps {

title: string;## Components

description: string;

canonical?: string;### `<SeoHead>`

ogImage?: string;

keywords?: string[];Component alternative to the `useSeo` hook.

children: React.ReactNode;

}**Example:**

function SEO({ title, description, canonical, ogImage, keywords, children }: SEOProps) {```tsx

React.useEffect(() => {import { SeoHead } from "m-seo/adapters/ReactSPAAdapter";

    const seo = new MetaManager();

    function AboutPage() {

    seo.setTitle(title);  return (

    seo.setDescription(description);    <div>

          <SeoHead

    if (canonical) seo.setCanonical(canonical);        title="About Us"

    if (keywords) seo.setKeywords(keywords);        description="Learn about our company"

            canonical="https://example.com/about"

    if (ogImage) {      />

      seo.setOpenGraph({

        title,      <h1>About Us</h1>

        description,    </div>

        image: ogImage,  );

        url: canonical || window.location.href}

      });```

    }

}, [title, description, canonical, ogImage, keywords]);### `<JsonLd>`

return <>{children}</>;Component for adding structured data.

}

**Example:**

// Usage

function BlogPost({ post }) {```tsx

return (import { JsonLd } from "m-seo/adapters/ReactSPAAdapter";

    <SEO

      title={`${post.title} - Blog`}function ProductPage({ product }) {

      description={post.excerpt}  const schema = {

      canonical={`https://blog.example.com/${post.slug}`}    "@context": "https://schema.org",

      ogImage={post.featuredImage}    "@type": "Product",

      keywords={post.tags}    name: product.name,

    >    description: product.description,

      <article>    image: product.image,

        <h1>{post.title}</h1>    offers: {

        <div dangerouslySetInnerHTML={{ __html: post.content }} />      "@type": "Offer",

      </article>      price: product.price,

    </SEO>      priceCurrency: "USD",

); },

} };

````

  return (

### 2. Bot Detection Hook    <div>

      <JsonLd data={schema} />

```tsx      <h1>{product.name}</h1>

import { useState, useEffect } from 'react';    </div>

import { BotDetection } from 'm-seo';  );

}

function useBotDetection() {```

  const [isBot, setIsBot] = useState(false);

  const [botInfo, setBotInfo] = useState<any>(null);## Advanced Usage



  useEffect(() => {### Higher-Order Component (HOC)

    const userAgent = navigator.userAgent;

    const detected = BotDetection.isBot(userAgent);Wrap components with SEO configuration:

    const info = BotDetection.getBotInfo(userAgent);

    ```tsx

    setIsBot(detected);import { withSeo } from "m-seo/adapters/ReactSPAAdapter";

    setBotInfo(info);

  }, []);const ContactPage = withSeo({

  title: "Contact Us",

  return { isBot, botInfo };  description: "Get in touch with our team",

}})(function ContactPage() {

  return <div>Contact form...</div>;

// Usage});

function AdaptiveContent() {```

  const { isBot, botInfo } = useBotDetection();

### Dynamic SEO with Props

  if (isBot) {

    return (```tsx

      <div className="bot-optimized">const DynamicSeoPage = withSeo((props) => ({

        <h1>Welcome {botInfo?.name}!</h1>  title: `${props.title} - My Site`,

        <div>Static, SEO-optimized content for search engines</div>  description: props.description,

      </div>}))(function Page(props) {

    );  return <div>{props.content}</div>;

  }});

````

return (

    <div className="interactive">### Multiple Structured Data Schemas

      <h1>Welcome!</h1>

      <InteractiveFeatures />```tsx

      <DynamicContent />import { JsonLd } from "m-seo/adapters/ReactSPAAdapter";

    </div>

);function OrganizationPage() {

} const schemas = [

````{

      "@context": "https://schema.org",

### 3. Structured Data with Hooks      "@type": "Organization",

      name: "My Company",

```tsx      url: "https://example.com",

import { useEffect } from 'react';    },

import { StructuredData } from 'm-seo';    {

      "@context": "https://schema.org",

function useStructuredData(schema: any, dependencies: any[] = []) {      "@type": "WebSite",

  useEffect(() => {      name: "My Website",

    const structured = new StructuredData();      url: "https://example.com",

        },

    // Add schema  ];

    const script = document.createElement('script');

    script.type = 'application/ld+json';  return (

    script.id = 'structured-data';    <div>

    script.textContent = JSON.stringify({      <JsonLd data={schemas} />

      '@context': 'https://schema.org',      <h1>My Company</h1>

      ...schema    </div>

    });  );

    }

    document.head.appendChild(script);```



    return () => {### Class Components (Legacy)

      const existing = document.getElementById('structured-data');

      if (existing) existing.remove();```tsx

    };import React from "react";

  }, dependencies);import { ReactSPAAdapter } from "m-seo/adapters/ReactSPAAdapter";

}

class LegacyPage extends React.Component {

// Usage in Article  seoAdapter = new ReactSPAAdapter({

function ArticlePage({ article }) {    title: "Legacy Page",

  useStructuredData({    description: "Works with class components",

    '@type': 'Article',  });

    headline: article.title,

    description: article.excerpt,  componentDidMount() {

    image: article.image,    this.seoAdapter.applySeo();

    datePublished: article.publishedAt,  }

    dateModified: article.updatedAt,

    author: {  componentWillUnmount() {

      '@type': 'Person',    this.seoAdapter.clear();

      name: article.author.name,  }

      url: article.author.url

    },  render() {

    publisher: {    return <div>Content</div>;

      '@type': 'Organization',  }

      name: 'My Blog',}

      logo: {```

        '@type': 'ImageObject',

        url: 'https://example.com/logo.png'## Examples

      }

    }### Blog Post with Full SEO

  }, [article]);

```tsx

  return <article>{/* article content */}</article>;import { useSeo, useStructuredData } from "m-seo/adapters/ReactSPAAdapter";

}

```function BlogPost({ post }) {

  useSeo({

### 4. React Router Integration    title: `${post.title} - Blog`,

    description: post.excerpt,

```tsx    ogImage: post.featuredImage,

import { useEffect } from 'react';    canonical: `https://example.com/blog/${post.slug}`,

import { useLocation } from 'react-router-dom';    author: post.author.name,

import { MetaManager } from 'm-seo';  });



// Route-based SEO configuration  useStructuredData({

const routeSEO = {    "@context": "https://schema.org",

  '/': {    "@type": "BlogPosting",

    title: 'Home - My App',    headline: post.title,

    description: 'Welcome to my application'    description: post.excerpt,

  },    image: post.featuredImage,

  '/about': {    datePublished: post.publishDate,

    title: 'About - My App',    dateModified: post.modifiedDate,

    description: 'Learn more about us'    author: {

  },      "@type": "Person",

  '/contact': {      name: post.author.name,

    title: 'Contact - My App',      url: post.author.url,

    description: 'Get in touch with our team'    },

  }    publisher: {

};      "@type": "Organization",

      name: "My Blog",

function App() {      logo: {

  const location = useLocation();        "@type": "ImageObject",

        url: "https://example.com/logo.png",

  useEffect(() => {      },

    const config = routeSEO[location.pathname] || routeSEO['/'];    },

    const seo = new MetaManager();  });



    seo.setTitle(config.title);  return (

    seo.setDescription(config.description);    <article>

    seo.setCanonical(`https://example.com${location.pathname}`);      <h1>{post.title}</h1>

  }, [location.pathname]);      <div dangerouslySetInnerHTML={{ __html: post.content }} />

    </article>

  return (  );

    <div>}

      <Routes>```

        {/* Your routes */}

      </Routes>### E-commerce Product Page

    </div>

  );```tsx

}import { useSeo, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

````

function ProductPage({ product }) {

--- useSeo({

    title: `${product.name} - ${product.price}`,

## Advanced Usage description: product.description,

    ogImage: product.images[0],

### 1. Context-Based SEO Manager canonical: `https://shop.example.com/products/${product.id}`,

});

````tsx

import React, { createContext, useContext, useEffect } from 'react';  const productSchema = {

import { MetaManager } from 'm-seo';    "@context": "https://schema.org",

    "@type": "Product",

interface SEOContextValue {    name: product.name,

  setPageSEO: (config: any) => void;    description: product.description,

  seo: MetaManager;    image: product.images,

}    brand: {

      "@type": "Brand",

const SEOContext = createContext<SEOContextValue | null>(null);      name: product.brand,

    },

export function SEOProvider({ children }: { children: React.ReactNode }) {    offers: {

  const seo = new MetaManager();      "@type": "Offer",

      price: product.price,

  const setPageSEO = (config: any) => {      priceCurrency: "USD",

    if (config.title) seo.setTitle(config.title);      availability: product.inStock

    if (config.description) seo.setDescription(config.description);        ? "https://schema.org/InStock"

    if (config.canonical) seo.setCanonical(config.canonical);        : "https://schema.org/OutOfStock",

    if (config.keywords) seo.setKeywords(config.keywords);    },

    if (config.openGraph) seo.setOpenGraph(config.openGraph);    aggregateRating: {

  };      "@type": "AggregateRating",

      ratingValue: product.rating,

  return (      reviewCount: product.reviewCount,

    <SEOContext.Provider value={{ setPageSEO, seo }}>    },

      {children}  };

    </SEOContext.Provider>

  );  return (

}    <div>

      <JsonLd data={productSchema} />

export function useSEOContext() {      <h1>{product.name}</h1>

  const context = useContext(SEOContext);      <p>${product.price}</p>

  if (!context) {    </div>

    throw new Error('useSEOContext must be used within SEOProvider');  );

  }}

  return context;```

}

### Recipe Page with Rich Snippets

// Usage

function MyApp() {```tsx

  return (import { useSeo, JsonLd } from "m-seo/adapters/ReactSPAAdapter";

    <SEOProvider>

      <Router>function RecipePage({ recipe }) {

        <Routes />  useSeo({

      </Router>    title: `${recipe.name} - Recipes`,

    </SEOProvider>    description: recipe.description,

  );    ogImage: recipe.image,

}  });



function ProductPage({ product }) {  const recipeSchema = {

  const { setPageSEO } = useSEOContext();    "@context": "https://schema.org",

    "@type": "Recipe",

  useEffect(() => {    name: recipe.name,

    setPageSEO({    description: recipe.description,

      title: `${product.name} - Shop`,    image: recipe.image,

      description: product.description,    author: {

      canonical: `https://shop.com/products/${product.id}`,      "@type": "Person",

      openGraph: {      name: recipe.author,

        title: product.name,    },

        image: product.image,    datePublished: recipe.publishDate,

        type: 'product'    prepTime: `PT${recipe.prepTime}M`,

      }    cookTime: `PT${recipe.cookTime}M`,

    });    totalTime: `PT${recipe.prepTime + recipe.cookTime}M`,

  }, [product, setPageSEO]);    recipeYield: recipe.servings,

    recipeIngredient: recipe.ingredients,

  return <div>{/* product */}</div>;    recipeInstructions: recipe.instructions.map((step, index) => ({

}      "@type": "HowToStep",

```      position: index + 1,

      text: step,

### 2. HOC for SEO    })),

    nutrition: {

```tsx      "@type": "NutritionInformation",

import React from 'react';      calories: `${recipe.calories} calories`,

import { MetaManager } from 'm-seo';    },

  };

function withSEO<P extends object>(

  Component: React.ComponentType<P>,  return (

  seoConfig: any    <div>

) {      <JsonLd data={recipeSchema} />

  return function WithSEOComponent(props: P) {      <h1>{recipe.name}</h1>

    React.useEffect(() => {      {/* Recipe content */}

      const seo = new MetaManager();    </div>

        );

      const config = typeof seoConfig === 'function' }

        ? seoConfig(props) ```

        : seoConfig;

      ## Best Practices

      if (config.title) seo.setTitle(config.title);

      if (config.description) seo.setDescription(config.description);### 1. Always Set Dependencies

      if (config.canonical) seo.setCanonical(config.canonical);

    }, [props]);When using hooks with dynamic data, always specify dependencies:



    return <Component {...props} />;```tsx

  };// ✅ Good

}useSeo({ title: product.name }, [product]);



// Usage with static config// ❌ Bad - SEO won't update when product changes

const AboutPage = withSEO(useSeo({ title: product.name });

  function AboutPage() {```

    return <div>About content</div>;

  },### 2. Use Canonical URLs

  {

    title: 'About Us',Always include canonical URLs to avoid duplicate content issues:

    description: 'Learn about our company'

  }```tsx

);useSeo({

  canonical: `https://example.com${window.location.pathname}`,

// Usage with dynamic config});

interface ProductProps {```

  product: { name: string; description: string; id: string };

}### 3. Optimize Images



const ProductPage = withSEO(Use properly sized Open Graph images (1200x630px recommended):

  function ProductPage({ product }: ProductProps) {

    return <div>{product.name}</div>;```tsx

  },useSeo({

  (props: ProductProps) => ({  ogImage: "https://example.com/og-image-1200x630.jpg",

    title: `${props.product.name} - Shop`,});

    description: props.product.description,```

    canonical: `https://shop.com/products/${props.product.id}`

  })### 4. Include Structured Data

);

```Search engines love structured data. Always include it when relevant:



### 3. E-commerce Product with Rich Snippets```tsx

// For articles

```tsxuseStructuredData({ '@type': 'Article', ... });

import React, { useEffect } from 'react';

import { MetaManager } from 'm-seo';// For products

useStructuredData({ '@type': 'Product', ... });

interface Product {

  id: string;// For local businesses

  name: string;useStructuredData({ '@type': 'LocalBusiness', ... });

  description: string;```

  price: number;

  currency: string;### 5. Keep Descriptions Under 160 Characters

  images: string[];

  brand: string;```tsx

  rating: number;const description = longText.substring(0, 157) + "...";

  reviewCount: number;useSeo({ description });

  inStock: boolean;```

  sku: string;

}### 6. Use Keywords Strategically



function ProductPage({ product }: { product: Product }) {Don't stuff keywords, use 3-7 relevant ones:

  useEffect(() => {

    const seo = new MetaManager();```tsx

    useSeo({

    // Basic meta tags  keywords: ["react", "seo", "web development"],

    seo.setTitle(`${product.name} - ${product.price} ${product.currency}`);});

    seo.setDescription(product.description);```

    seo.setCanonical(`https://shop.example.com/products/${product.id}`);

    ### 7. Test Your SEO

    // Open Graph

    seo.setOpenGraph({Use tools to validate:

      title: product.name,

      description: product.description,- [Google Rich Results Test](https://search.google.com/test/rich-results)

      type: 'product',- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)

      url: `https://shop.example.com/products/${product.id}`,- [Twitter Card Validator](https://cards-dev.twitter.com/validator)

      image: product.images[0],

      siteName: 'My Shop'### 8. Server-Side Rendering (SSR)

    });

    For Next.js or other SSR frameworks, use the core engine:

    // Product structured data

    const productSchema = {```tsx

      '@context': 'https://schema.org',import { SeoEngine } from "m-seo";

      '@type': 'Product',

      name: product.name,export async function getServerSideProps() {

      description: product.description,  const seo = new SeoEngine({

      image: product.images,    title: "SSR Page",

      sku: product.sku,    description: "Server-rendered SEO",

      brand: {  });

        '@type': 'Brand',

        name: product.brand  return {

      },    props: {

      offers: {      seoHtml: seo.toHtmlString(),

        '@type': 'Offer',    },

        price: product.price,  };

        priceCurrency: product.currency,}

        availability: product.inStock ```

          ? 'https://schema.org/InStock'

          : 'https://schema.org/OutOfStock',## Integration with Popular Libraries

        url: `https://shop.example.com/products/${product.id}`,

        seller: {### React Router

          '@type': 'Organization',

          name: 'My Shop'```tsx

        }import { useLocation } from "react-router-dom";

      },import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

      aggregateRating: {

        '@type': 'AggregateRating',function Page() {

        ratingValue: product.rating,  const location = useLocation();

        reviewCount: product.reviewCount

      }  useSeo(

    };    {

          canonical: `https://example.com${location.pathname}`,

    const script = document.createElement('script');    },

    script.type = 'application/ld+json';    [location.pathname]

    script.id = 'product-schema';  );

    script.textContent = JSON.stringify(productSchema);}

    document.head.appendChild(script);```



    return () => {### React Helmet Migration

      document.getElementById('product-schema')?.remove();

    };If you're migrating from React Helmet:

  }, [product]);

```tsx

  return (// Before (React Helmet)

    <div className="product-page"><Helmet>

      <div className="product-images">  <title>My Page</title>

        {product.images.map((img, i) => (  <meta name="description" content="Description" />

          <img key={i} src={img} alt={`${product.name} ${i + 1}`} /></Helmet>

        ))}

      </div>// After (m-seo)

      <div className="product-info"><SeoHead

        <h1>{product.name}</h1>  title="My Page"

        <p className="price">{product.price} {product.currency}</p>  description="Description"

        <p className="description">{product.description}</p>/>

        <div className="rating">```

          ⭐ {product.rating} ({product.reviewCount} reviews)

        </div>## Troubleshooting

        <button disabled={!product.inStock}>

          {product.inStock ? 'Add to Cart' : 'Out of Stock'}### Meta Tags Not Updating

        </button>

      </div>Make sure you're passing dependencies:

    </div>

  );```tsx

}useSeo(config, [dep1, dep2]);

````

---### Duplicate Tags

## TypeScriptOnly use one SEO method per page (either hook or component, not both).

### Type Definitions### TypeScript Errors

```typescriptMake sure you have `@types/react` installed:

import { MetaManager, BotDetection, StructuredData } from 'm-seo';

````bash

// SEO Configuration Interfacenpm install --save-dev @types/react

interface SEOConfig {```

  title?: string;

  description?: string;## Support

  keywords?: string[];

  canonical?: string;- **GitHub Issues**: [Report bugs or request features](https://github.com/Hailemariyam/m-seo/issues)

  author?: string;- **Documentation**: [Full docs](https://github.com/Hailemariyam/m-seo)

  robots?: string;- **Examples**: See `/examples/react-usage.tsx`

  openGraph?: {

    title?: string;## License

    description?: string;

    type?: string;MIT © Hailemariyam Kebede

    url?: string;
    image?: string;
    siteName?: string;
  };
  twitterCard?: {
    card?: 'summary' | 'summary_large_image' | 'app' | 'player';
    site?: string;
    creator?: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

// Typed Hook
function useSEO(config: SEOConfig, deps: React.DependencyList = []) {
  React.useEffect(() => {
    const seo = new MetaManager();

    if (config.title) seo.setTitle(config.title);
    if (config.description) seo.setDescription(config.description);
    if (config.keywords) seo.setKeywords(config.keywords);
    if (config.canonical) seo.setCanonical(config.canonical);
    if (config.author) seo.setAuthor(config.author);
    if (config.robots) seo.setRobots(config.robots);
    if (config.openGraph) seo.setOpenGraph(config.openGraph);
    if (config.twitterCard) seo.setTwitterCard(config.twitterCard);
  }, deps);
}

// Typed Component
interface SEOWrapperProps extends SEOConfig {
  children: React.ReactNode;
}

const SEOWrapper: React.FC<SEOWrapperProps> = ({ children, ...config }) => {
  useSEO(config);
  return <>{children}</>;
};
````

---

## Best Practices

### 1. Always Use Dependencies

```tsx
// ✅ Good - SEO updates when product changes
useSEO(
  {
    title: product.name,
  },
  [product]
);

// ❌ Bad - SEO never updates
useSEO({
  title: product.name,
});
```

### 2. Cleanup on Unmount

```tsx
useEffect(() => {
  const seo = new MetaManager();
  seo.setTitle("My Page");

  return () => {
    // Reset or cleanup if needed
    seo.setTitle("Default Title");
  };
}, []);
```

### 3. Canonical URLs

```tsx
// Always use absolute URLs
seo.setCanonical("https://example.com/page"); // ✅ Good
seo.setCanonical("/page"); // ❌ Bad
```

### 4. Image Optimization

```tsx
// Use properly sized Open Graph images
seo.setOpenGraph({
  image: "https://example.com/og-image-1200x630.jpg", // 1200x630px
});
```

### 5. Descriptions Length

```tsx
// Keep under 160 characters
const description =
  longText.length > 157 ? longText.substring(0, 157) + "..." : longText;

seo.setDescription(description);
```

---

## Live Demo

Check out the complete working example:

**Test Application**: [`test-app/`](../test-app/)

Run it locally:

```bash
cd test-app
npm install
npm run dev
# Open http://localhost:3000
```

**Features Demonstrated**:

- ✅ Basic meta tags
- ✅ Open Graph tags
- ✅ Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Bot detection
- ✅ Dynamic SEO updates
- ✅ React Router integration

---

## Troubleshooting

### Meta Tags Not Updating

**Problem**: SEO doesn't update when props change

**Solution**: Add dependencies to useEffect

```tsx
// ✅ Correct
useEffect(() => {
  seo.setTitle(product.name);
}, [product]); // Dependency array

// ❌ Wrong
useEffect(() => {
  seo.setTitle(product.name);
}, []); // Empty array - won't update
```

### Duplicate Tags

**Problem**: Multiple identical meta tags

**Solution**: Use only one SEO method per component

```tsx
// ❌ Bad - both will create tags
useSEO({ title: "Page" });
seo.setTitle("Page");

// ✅ Good - use one method
useSEO({ title: "Page" });
```

### TypeScript Errors

**Problem**: Type errors with M-SEO

**Solution**: Install type definitions

```bash
npm install --save-dev @types/react @types/node
```

### Server-Side Rendering Issues

**Problem**: `window is not defined`

**Solution**: Check if in browser

```tsx
useEffect(() => {
  if (typeof window !== "undefined") {
    const seo = new MetaManager();
    seo.setTitle("Page");
  }
}, []);
```

---

## Next Steps

- **Vanilla JS Guide**: [VANILLA_JS_GUIDE.md](./VANILLA_JS_GUIDE.md)
- **Vue.js Guide**: [VUE_GUIDE.md](./VUE_GUIDE.md)
- **Next.js Guide**: [NEXT_JS_GUIDE.md](./NEXT_JS_GUIDE.md)
- **Express.js Guide**: [EXPRESS_GUIDE.md](./EXPRESS_GUIDE.md)
- **API Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

---

## Support

- 📖 [Full Documentation](../README.md)
- 💬 [GitHub Issues](https://github.com/Hailemariyam/m-seo/issues)
- 🌟 [Examples](../examples/)
- 🚀 [Live Demo](../test-app/)

---

**License**: MIT © Hailemariyam Kebede
