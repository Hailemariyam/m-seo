/**
 * Complete React Example for m-seo Library
 *
 * This example demonstrates all features available in the React adapter:
 * - useSeo hook for meta tags
 * - useStructuredData for JSON-LD
 * - useBreadcrumbs for navigation
 * - SeoHead component
 * - JsonLd component
 * - withSeo HOC
 *
 * INSTALLATION:
 * npm install m-seo react react-dom
 *
 * USAGE:
 * Copy the patterns from this file into your React application
 */

// @ts-nocheck - This is a reference example
import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Import React-specific hooks and components
import {
  useSeo,
  SeoHead,
  useStructuredData,
  useBreadcrumbs,
  JsonLd,
  withSeo,
  ReactSPAAdapter
} from 'm-seo/adapters/ReactSPAAdapter';

// Import core utilities (framework-agnostic)
import { SeoEngine, StructuredDataManager } from 'm-seo';

/**
 * Example 1: Basic SEO with useSeo Hook
 * Perfect for simple pages that need title and description
 */
export function HomePage() {
  useSeo({
    title: 'Home - My React App',
    description: 'Welcome to my amazing React application with SEO support',
    keywords: ['react', 'seo', 'typescript', 'm-seo'],
    canonical: 'https://example.com',
    ogImage: 'https://example.com/images/home-og.jpg',
    siteName: 'My React App',
    author: 'Your Name',
    themeColor: '#3490dc',
    locale: 'en_US'
  });

  return (
    <div className="container">
      <h1>Welcome to My React App</h1>
      <p>This page has full SEO meta tags managed by m-seo!</p>
      <p>Check the page source to see all the meta tags.</p>
    </div>
  );
}

/**
 * Example 2: Using SeoHead Component (Alternative to hook)
 * Same functionality as useSeo, but as a component
 */
export function AboutPage() {
  return (
    <div>
      <SeoHead
        title="About Us - My React App"
        description="Learn more about our company and mission"
        keywords={['about', 'company', 'mission']}
        canonical="https://example.com/about"
      />

      <h1>About Us</h1>
      <p>We build amazing things with React and SEO!</p>
    </div>
  );
}

/**
 * Example 3: Blog Post with Structured Data
 * Demonstrates useStructuredData and Article schema
 */
interface BlogPostProps {
  title: string;
  content: string;
  author: string;
  publishDate: string;
  modifiedDate?: string;
  image?: string;
}

export function BlogPost({
  title,
  content,
  author,
  publishDate,
  modifiedDate,
  image
}: BlogPostProps) {
  // Set basic SEO
  useSeo({
    title: `${title} - Blog`,
    description: content.substring(0, 160),
    ogImage: image,
    canonical: `https://example.com/blog/${title.toLowerCase().replace(/\s+/g, '-')}`
  });

  // Add Article structured data
  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: content.substring(0, 160),
    image: image,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: 'My Blog',
      logo: {
        '@type': 'ImageObject',
        url: 'https://example.com/logo.png'
      }
    }
  });

  return (
    <article>
      <h1>{title}</h1>
      <p className="meta">By {author} on {publishDate}</p>
      <div className="content">{content}</div>
    </article>
  );
}

/**
 * Example 4: Using JsonLd Component
 * Alternative way to add structured data
 */
export function ProductPage() {
  const productSchema = {
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
  };

  return (
    <div>
      <SeoHead
        title="Amazing Product - Shop"
        description="The best product you can buy for only $99.99"
        ogImage="https://example.com/product.jpg"
      />

      <JsonLd data={productSchema} />

      <h1>Amazing Product</h1>
      <p>Price: $99.99</p>
      <p>Rating: 4.8/5 (127 reviews)</p>
    </div>
  );
}

/**
 * Example 5: Using Breadcrumbs
 * Great for navigation and SEO
 */
export function CategoryPage() {
  useBreadcrumbs([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Products', url: 'https://example.com/products' },
    { name: 'Electronics', url: 'https://example.com/products/electronics' }
  ]);

  return (
    <div>
      <SeoHead
        title="Electronics - Products"
        description="Browse our electronics category"
      />

      <nav aria-label="Breadcrumb">
        <a href="/">Home</a> /
        <a href="/products">Products</a> /
        <span>Electronics</span>
      </nav>

      <h1>Electronics</h1>
    </div>
  );
}

/**
 * Example 6: Dynamic SEO Based on Data
 * Shows how to update SEO when data changes
 */
export function UserProfile({ userId }: { userId: string }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Simulate fetching user data
    fetch(`/api/users/${userId}`)
      .then(res => res.json())
      .then(setUser);
  }, [userId]);

  // SEO updates automatically when user data changes
  useSeo({
    title: user ? `${user.name} - Profile` : 'Loading...',
    description: user?.bio || 'User profile',
    ogImage: user?.avatar,
    canonical: `https://example.com/users/${userId}`
  }, [user]); // Dependencies ensure SEO updates when user changes

  if (!user) return <div>Loading...</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.bio}</p>
    </div>
  );
}

/**
 * Example 7: Using Higher-Order Component (HOC)
 * Wrap any component with SEO configuration
 */
const ContactPageWithSeo = withSeo({
  title: 'Contact Us',
  description: 'Get in touch with our team',
  canonical: 'https://example.com/contact'
})(function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      <form>
        <input type="email" placeholder="Your email" />
        <textarea placeholder="Message"></textarea>
        <button type="submit">Send</button>
      </form>
    </div>
  );
});

/**
 * Example 8: Multiple Structured Data Schemas
 * Add multiple schemas to one page
 */
export function OrganizationPage() {
  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'My Company',
      url: 'https://example.com',
      logo: 'https://example.com/logo.png',
      sameAs: [
        'https://twitter.com/mycompany',
        'https://facebook.com/mycompany',
        'https://linkedin.com/company/mycompany'
      ]
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'My Company Website',
      url: 'https://example.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://example.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      }
    }
  ];

  return (
    <div>
      <SeoHead
        title="My Company - Official Site"
        description="We are a leading company in our industry"
        siteName="My Company"
      />

      <JsonLd data={schemas} />

      <h1>My Company</h1>
      <p>Official website</p>
    </div>
  );
}

/**
 * Example 9: Class-based Component with ReactSPAAdapter
 * For older React codebases using class components
 */
export class LegacyPage extends React.Component {
  private seoAdapter: ReactSPAAdapter;

  constructor(props: any) {
    super(props);
    this.seoAdapter = new ReactSPAAdapter({
      title: 'Legacy Page',
      description: 'Example using class components'
    });
  }

  componentDidMount() {
    this.seoAdapter.applySeo();

    this.seoAdapter.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Legacy Page'
    });
  }

  componentWillUnmount() {
    this.seoAdapter.clear();
  }

  render() {
    return (
      <div>
        <h1>Legacy Class Component</h1>
        <p>Works with class components too!</p>
      </div>
    );
  }
}

/**
 * Example 10: Complete App with Router
 * Shows integration with React Router
 */
export function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPost
          title="Getting Started with m-seo"
          content="Learn how to add SEO to your React app in minutes..."
          author="John Doe"
          publishDate="2025-01-15"
          image="https://example.com/blog-post.jpg"
        />;
      case 'product':
        return <ProductPage />;
      case 'contact':
        return <ContactPageWithSeo />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="app">
      <nav>
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('about')}>About</button>
        <button onClick={() => setCurrentPage('blog')}>Blog</button>
        <button onClick={() => setCurrentPage('product')}>Product</button>
        <button onClick={() => setCurrentPage('contact')}>Contact</button>
      </nav>

      <main>
        {renderPage()}
      </main>
    </div>
  );
}

/**
 * Example 11: Using Framework-Agnostic Core
 * You can also use the core SeoEngine directly
 */
export function ManualSeoPage() {
  useEffect(() => {
    const seoEngine = new SeoEngine({
      title: 'Manual SEO Control',
      description: 'Using SeoEngine directly for maximum control'
    });

    // Get meta tags as objects
    const metaTags = seoEngine.generateMetaTags();

    // Manually apply them (if you need custom logic)
    metaTags.forEach(tag => {
      const meta = document.createElement('meta');
      if (tag.name) meta.setAttribute('name', tag.name);
      if (tag.property) meta.setAttribute('property', tag.property);
      meta.setAttribute('content', tag.content);
      meta.setAttribute('data-custom', 'true');
      document.head.appendChild(meta);
    });

    return () => {
      document.querySelectorAll('meta[data-custom]').forEach((el: Element) => el.remove());
    };
  }, []);

  return <div><h1>Manual SEO Control</h1></div>;
}

/**
 * Example 12: Server-Side Rendering (SSR) Preparation
 * Generate SEO HTML for SSR frameworks like Next.js
 */
export function generateSeoHtml() {
  const seoEngine = new SeoEngine({
    title: 'SSR Page',
    description: 'This page is rendered on the server',
    ogImage: 'https://example.com/ssr.jpg'
  });

  // Get HTML string for injection in SSR
  const htmlString = seoEngine.toHtmlString();

  console.log('Inject this in your <head>:');
  console.log(htmlString);

  return htmlString;
}

// Export everything for easy importing
export default App;
