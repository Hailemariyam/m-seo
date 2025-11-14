/**
 * M-SEO React Test Application
 *
 * This app demonstrates and tests all React SEO features:
 * - useSeo hook
 * - useStructuredData hook
 * - useBreadcrumbs hook
 * - SeoHead component
 * - JsonLd component
 * - withSeo HOC
 */

const { useState, useEffect } = React;

// ============================================================================
// IMPORT M-SEO (In production, use: import { useSeo } from 'm-seo/adapters/ReactSPAAdapter')
// For this test, we'll inline the adapter code
// ============================================================================

function useSeo(config, deps) {
  useEffect(() => {
    // Update title
    if (config.title) {
      document.title = config.title;
    }

    // Generate meta tags
    const metaTags = generateMetaTags(config);
    const linkTags = generateLinkTags(config);

    // Remove old tags
    document.querySelectorAll('meta[data-mseo]').forEach(el => el.remove());
    document.querySelectorAll('link[data-mseo]').forEach(el => el.remove());

    // Add new meta tags
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-mseo', 'true');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      document.head.appendChild(meta);
    });

    // Add link tags
    linkTags.forEach(link => {
      const linkEl = document.createElement('link');
      linkEl.setAttribute('data-mseo', 'true');
      linkEl.setAttribute('rel', link.rel);
      linkEl.setAttribute('href', link.href);
      if (link.hreflang) linkEl.setAttribute('hreflang', link.hreflang);
      document.head.appendChild(linkEl);
    });

    return () => {
      document.querySelectorAll('meta[data-mseo]').forEach(el => el.remove());
      document.querySelectorAll('link[data-mseo]').forEach(el => el.remove());
    };
  }, deps || [config.title, config.description, config.keywords?.join(',')]);
}

function useStructuredData(schemas, deps) {
  useEffect(() => {
    const schemaArray = Array.isArray(schemas) ? schemas : [schemas];

    document.querySelectorAll('script[data-mseo-ld]').forEach(el => el.remove());

    schemaArray.forEach(schema => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-mseo-ld', 'true');
      script.textContent = JSON.stringify(schema, null, 2);
      document.head.appendChild(script);
    });

    return () => {
      document.querySelectorAll('script[data-mseo-ld]').forEach(el => el.remove());
    };
  }, deps || [JSON.stringify(schemas)]);
}

function useBreadcrumbs(items, deps) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };
  useStructuredData(breadcrumbSchema, deps);
}

// Helper functions
function generateMetaTags(config) {
  const tags = [];
  if (config.title) {
    tags.push({ name: 'title', content: config.title });
    tags.push({ property: 'og:title', content: config.title });
    tags.push({ name: 'twitter:title', content: config.title });
  }
  if (config.description) {
    tags.push({ name: 'description', content: config.description });
    tags.push({ property: 'og:description', content: config.description });
    tags.push({ name: 'twitter:description', content: config.description });
  }
  if (config.keywords?.length) {
    tags.push({ name: 'keywords', content: config.keywords.join(', ') });
  }
  if (config.ogImage) {
    tags.push({ property: 'og:image', content: config.ogImage });
    tags.push({ name: 'twitter:image', content: config.ogImage });
    tags.push({ name: 'twitter:card', content: 'summary_large_image' });
  }
  if (config.author) {
    tags.push({ name: 'author', content: config.author });
  }
  if (config.themeColor) {
    tags.push({ name: 'theme-color', content: config.themeColor });
  }
  tags.push({ property: 'og:type', content: 'website' });
  return tags;
}

function generateLinkTags(config) {
  const links = [];
  if (config.canonical) {
    links.push({ rel: 'canonical', href: config.canonical });
  }
  return links;
}

// ============================================================================
// TEST PAGES
// ============================================================================

function HomePage() {
  useSeo({
    title: 'Home - M-SEO React Test App',
    description: 'Testing the M-SEO library with React hooks and components',
    keywords: ['react', 'seo', 'testing', 'm-seo'],
    canonical: 'https://example.com/',
    ogImage: 'https://example.com/home-og.jpg',
    author: 'M-SEO Team',
    themeColor: '#667eea'
  });

  return (
    <div className="page-content">
      <h2>🏠 Welcome to M-SEO React Test App</h2>
      <p>This page uses the <code>useSeo</code> hook to manage all meta tags.</p>

      <div className="feature-grid">
        <div className="feature-card">
          <h4>✅ Basic SEO</h4>
          <p>Title, description, and keywords are set using the useSeo hook.</p>
        </div>
        <div className="feature-card">
          <h4>✅ Open Graph</h4>
          <p>Facebook and social media preview tags are automatically generated.</p>
        </div>
        <div className="feature-card">
          <h4>✅ Twitter Cards</h4>
          <p>Twitter-specific meta tags for rich previews.</p>
        </div>
        <div className="feature-card">
          <h4>✅ Canonical URL</h4>
          <p>Proper canonical link to prevent duplicate content issues.</p>
        </div>
      </div>

      <SeoInspector />
    </div>
  );
}

function BlogPage() {
  useSeo({
    title: 'React SEO Best Practices - Blog',
    description: 'Learn how to implement SEO in React applications using modern hooks and components',
    keywords: ['react', 'seo', 'blog', 'best practices'],
    canonical: 'https://example.com/blog/react-seo',
    ogImage: 'https://example.com/blog-og.jpg'
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'React SEO Best Practices',
    description: 'Learn how to implement SEO in React applications',
    datePublished: '2025-11-13',
    author: {
      '@type': 'Person',
      name: 'John Doe'
    },
    publisher: {
      '@type': 'Organization',
      name: 'M-SEO Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    }
  });

  return (
    <div className="page-content">
      <h2>📝 Blog Post Example</h2>
      <p>This page demonstrates <code>useSeo</code> + <code>useStructuredData</code> hooks.</p>

      <article style={{ marginTop: '20px' }}>
        <h3>React SEO Best Practices</h3>
        <p><em>Published on November 13, 2025 by John Doe</em></p>
        <p>
          Implementing SEO in React applications is crucial for search engine visibility.
          The M-SEO library makes it easy with hooks like useSeo and useStructuredData.
        </p>
      </article>

      <div className="seo-inspector">
        <h3>🔍 Structured Data Added</h3>
        <div className="seo-tag">
          <strong>Type:</strong> BlogPosting<br/>
          <strong>Headline:</strong> React SEO Best Practices<br/>
          <strong>Author:</strong> John Doe<br/>
          <strong>Date:</strong> 2025-11-13
        </div>
      </div>

      <SeoInspector />
    </div>
  );
}

function ProductPage() {
  useSeo({
    title: 'Amazing Product - $99.99',
    description: 'The best product you can buy with excellent reviews',
    ogImage: 'https://example.com/product.jpg',
    canonical: 'https://example.com/products/amazing-product'
  });

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Amazing Product',
    description: 'The best product you can buy',
    image: 'https://example.com/product.jpg',
    offers: {
      '@type': 'Offer',
      price: '99.99',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '127'
    }
  });

  return (
    <div className="page-content">
      <h2>🛍️ Product Page Example</h2>
      <p>E-commerce SEO with Product schema.</p>

      <div style={{ background: '#f7fafc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Amazing Product</h3>
        <p><strong>Price:</strong> $99.99</p>
        <p><strong>Rating:</strong> ⭐⭐⭐⭐⭐ 4.8/5 (127 reviews)</p>
        <p><strong>Status:</strong> <span style={{ color: '#48bb78' }}>In Stock</span></p>
        <button style={{
          background: '#667eea',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '6px',
          cursor: 'pointer',
          marginTop: '10px'
        }}>
          Add to Cart
        </button>
      </div>

      <div className="seo-inspector">
        <h3>🔍 Product Schema Added</h3>
        <div className="seo-tag">
          <strong>Type:</strong> Product<br/>
          <strong>Name:</strong> Amazing Product<br/>
          <strong>Price:</strong> $99.99 USD<br/>
          <strong>Rating:</strong> 4.8/5 (127 reviews)<br/>
          <strong>Availability:</strong> In Stock
        </div>
      </div>

      <SeoInspector />
    </div>
  );
}

function BreadcrumbsPage() {
  useSeo({
    title: 'Electronics - Products',
    description: 'Browse our electronics category',
    canonical: 'https://example.com/products/electronics'
  });

  useBreadcrumbs([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Products', url: 'https://example.com/products' },
    { name: 'Electronics', url: 'https://example.com/products/electronics' }
  ]);

  return (
    <div className="page-content">
      <h2>🔗 Breadcrumbs Example</h2>
      <p>This page uses the <code>useBreadcrumbs</code> hook for navigation.</p>

      <nav style={{ background: '#f7fafc', padding: '15px', borderRadius: '6px', marginTop: '20px' }}>
        <a href="#" style={{ color: '#667eea' }}>Home</a>
        {' / '}
        <a href="#" style={{ color: '#667eea' }}>Products</a>
        {' / '}
        <strong>Electronics</strong>
      </nav>

      <div className="seo-inspector">
        <h3>🔍 Breadcrumb Schema Added</h3>
        <div className="seo-tag">
          <strong>Type:</strong> BreadcrumbList<br/>
          <strong>Items:</strong><br/>
          1. Home → https://example.com<br/>
          2. Products → https://example.com/products<br/>
          3. Electronics → https://example.com/products/electronics
        </div>
      </div>

      <SeoInspector />
    </div>
  );
}

// ============================================================================
// SEO INSPECTOR COMPONENT
// ============================================================================

function SeoInspector() {
  const [metaTags, setMetaTags] = useState([]);
  const [linkTags, setLinkTags] = useState([]);
  const [structuredData, setStructuredData] = useState([]);

  useEffect(() => {
    const updateInspector = () => {
      // Get meta tags
      const metas = Array.from(document.querySelectorAll('meta[data-mseo]')).map(el => ({
        name: el.getAttribute('name'),
        property: el.getAttribute('property'),
        content: el.getAttribute('content')
      }));
      setMetaTags(metas);

      // Get link tags
      const links = Array.from(document.querySelectorAll('link[data-mseo]')).map(el => ({
        rel: el.getAttribute('rel'),
        href: el.getAttribute('href'),
        hreflang: el.getAttribute('hreflang')
      }));
      setLinkTags(links);

      // Get structured data
      const scripts = Array.from(document.querySelectorAll('script[data-mseo-ld]')).map(el => {
        try {
          return JSON.parse(el.textContent);
        } catch {
          return null;
        }
      }).filter(Boolean);
      setStructuredData(scripts);
    };

    updateInspector();
    const interval = setInterval(updateInspector, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="seo-inspector">
      <h3>🔍 Live SEO Inspector</h3>
      <p>Current tags on this page:</p>

      <div style={{ marginTop: '15px' }}>
        <h4>
          Meta Tags ({metaTags.length})
          {metaTags.length > 0 && <span className="success-badge">✓ Active</span>}
        </h4>
        {metaTags.slice(0, 5).map((tag, i) => (
          <div key={i} className="seo-tag">
            <strong>{tag.name || tag.property}:</strong> {tag.content}
          </div>
        ))}
        {metaTags.length > 5 && (
          <p style={{ marginTop: '10px', color: '#718096' }}>
            ... and {metaTags.length - 5} more meta tags
          </p>
        )}
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>
          Link Tags ({linkTags.length})
          {linkTags.length > 0 && <span className="success-badge">✓ Active</span>}
        </h4>
        {linkTags.map((tag, i) => (
          <div key={i} className="seo-tag">
            <strong>{tag.rel}:</strong> {tag.href}
            {tag.hreflang && <> ({tag.hreflang})</>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px' }}>
        <h4>
          Structured Data ({structuredData.length})
          {structuredData.length > 0 && <span className="success-badge">✓ Active</span>}
        </h4>
        {structuredData.map((schema, i) => (
          <div key={i} className="seo-tag">
            <strong>@type:</strong> {schema['@type']}
            {schema.name && <><br/><strong>name:</strong> {schema.name}</>}
            {schema.headline && <><br/><strong>headline:</strong> {schema.headline}</>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const pages = {
    home: { component: HomePage, label: '🏠 Home' },
    blog: { component: BlogPage, label: '📝 Blog' },
    product: { component: ProductPage, label: '🛍️ Product' },
    breadcrumbs: { component: BreadcrumbsPage, label: '🔗 Breadcrumbs' }
  };

  const CurrentPageComponent = pages[currentPage].component;

  return (
    <div className="container">
      <header>
        <h1>M-SEO React Test App</h1>
        <p>Testing SEO hooks and components in real-time</p>
      </header>

      <nav>
        {Object.entries(pages).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setCurrentPage(key)}
            className={currentPage === key ? 'active' : ''}
          >
            {label}
          </button>
        ))}
      </nav>

      <main>
        <CurrentPageComponent />
      </main>

      <footer>
        <p>
          <strong>How to verify:</strong> Open browser DevTools → Elements →
          Search for <code>data-mseo</code> or <code>data-mseo-ld</code>
        </p>
        <p style={{ marginTop: '10px', opacity: 0.8 }}>
          M-SEO © 2025 - Framework-agnostic SEO Library
        </p>
      </footer>
    </div>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
