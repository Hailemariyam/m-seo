/**
 * M-SEO Next.js App Router - Page Examples
 *
 * Examples of using M-SEO in Next.js App Router pages
 */

import {
  createNextAdapter,
  generateArticleJsonLd,
  generateBreadcrumbJsonLd,
  generateProductJsonLd,
  generateFaqJsonLd
} from '../../src';

// Create your SEO adapter (configure as needed)
const seo = createNextAdapter({
  baseUrl: 'https://example.com',
  siteName: 'My Awesome Site',
  defaultLocale: 'en-US',
  enableCaching: true,
  enableSecurity: true,
});

/**
 * Example 1: Basic Home Page
 */
export const metadata = seo.generateMetadata({
  title: 'Home - My Awesome Site',
  description: 'Welcome to our site. Discover amazing content and features.',
  keywords: ['nextjs', 'seo', 'react', 'web development'],

  openGraph: {
    title: 'My Awesome Site',
    description: 'Welcome to our site',
    url: 'https://example.com',
    siteName: 'My Site',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'My Site Homepage',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    site: '@mysite',
    creator: '@creator',
    title: 'My Awesome Site',
    description: 'Welcome to our site',
    images: ['/twitter-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
});

export const viewport = seo.generateViewport({
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
});

function HomePage() {
  return (
    <main>
      <h1>Welcome to My Awesome Site</h1>
      <p>Discover amazing content and features.</p>
    </main>
  );
}

/**
 * Example 2: Blog Post Page with JSON-LD
 */
interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  // Fetch post data
  const post = await fetchBlogPost(params.slug);

  return seo.generateMetadata({
    title: post.title,
    description: post.excerpt,

    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://example.com/blog/${params.slug}`,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  });
}

async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await fetchBlogPost(params.slug);

  // Generate Article JSON-LD
  const articleSchema = generateArticleJsonLd({
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      name: post.author.name,
      url: `https://example.com/authors/${post.author.slug}`,
    },
    publisher: {
      name: 'My Site',
      logo: 'https://example.com/logo.png',
    },
  });

  // Generate Breadcrumb JSON-LD
  const breadcrumbSchema = generateBreadcrumbJsonLd([
    { name: 'Home', url: 'https://example.com' },
    { name: 'Blog', url: 'https://example.com/blog' },
    { name: post.title, url: `https://example.com/blog/${params.slug}` },
  ]);

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Content */}
      <article>
        <h1>{post.title}</h1>
        <time dateTime={post.publishedAt}>{post.publishedAt}</time>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </>
  );
}

/**
 * Example 3: Product Page with E-commerce Schema
 */

interface ProductPageProps {
  params: { id: string };
}

async function ProductPage({ params }: ProductPageProps) {
  const product = await fetchProduct(params.id);

  const productSchema = generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.images,
    brand: product.brand,
    sku: product.sku,
    offers: {
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      url: `https://example.com/products/${params.id}`,
      priceValidUntil: product.salePriceValidUntil,
      seller: {
        name: 'My Store',
      },
    },
    aggregateRating: product.rating ? {
      ratingValue: product.rating.average,
      reviewCount: product.rating.count,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p>${product.price}</p>
      </div>
    </>
  );
}

/**
 * Example 4: FAQ Page
 */

function FAQPage() {
  const faqs = [
    {
      question: 'What is M-SEO?',
      answer: 'M-SEO is a comprehensive SEO library for Next.js that includes caching, security, and geographic features.',
    },
    {
      question: 'How do I install M-SEO?',
      answer: 'Install M-SEO using npm: npm install m-seo',
    },
    {
      question: 'Is M-SEO better than next-seo?',
      answer: 'Yes! M-SEO includes built-in middleware, caching, security headers, and automatic sitemap generation.',
    },
  ];

  const faqSchema = generateFaqJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h1>Frequently Asked Questions</h1>
      {faqs.map((faq, i) => (
        <div key={i}>
          <h2>{faq.question}</h2>
          <p>{faq.answer}</p>
        </div>
      ))}
    </>
  );
}

// Helper function (mock)
async function fetchBlogPost(slug: string) {
  return {
    title: 'Sample Blog Post',
    slug,
    excerpt: 'This is a sample blog post',
    content: '<p>Content here</p>',
    coverImage: '/blog/sample.jpg',
    publishedAt: '2025-11-25T00:00:00Z',
    updatedAt: '2025-11-25T12:00:00Z',
    author: {
      name: 'John Doe',
      slug: 'john-doe',
    },
  };
}

async function fetchProduct(id: string) {
  return {
    id,
    name: 'Sample Product',
    description: 'Sample product description',
    price: 99.99,
    images: ['/products/sample.jpg'],
    brand: 'My Brand',
    sku: 'SKU123',
    inStock: true,
    salePriceValidUntil: '2025-12-31',
    rating: {
      average: 4.5,
      count: 100,
    },
  };
}
