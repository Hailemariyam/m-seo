import { seo, generateStructuredData } from '../../../lib/seo';
import type { Metadata } from 'next';
import SeoInspector from '../../components/SeoInspector';

const product = {
  name: 'M-SEO Pro Package',
  description: 'Complete SEO solution for modern web applications',
  price: 99.99,
  currency: 'USD',
  image: 'http://localhost:3002/products/example.jpg',
  brand: 'M-SEO',
  inStock: true,
  rating: 4.8,
  reviewCount: 127,
};

export const metadata: Metadata = seo.generateMetadata({
  title: product.name,
  description: product.description,
  openGraph: {
    title: product.name,
    description: product.description,
    type: 'website', // Note: 'product' is not a valid type in Next.js Metadata API
    images: [
      {
        url: product.image,
        width: 1200,
        height: 630,
        alt: product.name,
      },
    ],
  },
});

export default function ProductPage() {
  const productSchema = generateStructuredData('Product', {
    name: product.name,
    description: product.description,
    image: product.image,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: 'http://localhost:3002/products/example',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="page-header">
        <h1 className="page-title">🛍️ {product.name}</h1>
        <p className="page-subtitle">{product.brand}</p>
      </div>

      <div className="card">
        <div className="grid">
          <div>
            <h2>Product Details</h2>
            <p>{product.description}</p>

            <h3 style={{ marginTop: '1.5rem' }}>Price</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              ${product.price} {product.currency}
            </p>

            <h3>Availability</h3>
            <p>
              {product.inStock ? (
                <span className="badge badge-success">In Stock</span>
              ) : (
                <span className="badge badge-secondary">Out of Stock</span>
              )}
            </p>
          </div>

          <div>
            <h3>Customer Rating</h3>
            <p style={{ fontSize: '2rem', color: 'var(--secondary)' }}>
              ⭐ {product.rating}/5
            </p>
            <p style={{ color: 'var(--gray)' }}>
              Based on {product.reviewCount} reviews
            </p>

            <h3 style={{ marginTop: '1.5rem' }}>SEO Features</h3>
            <div>
              <span className="badge badge-primary">Product Schema</span>
              <span className="badge badge-success">Pricing Info</span>
              <span className="badge badge-secondary">Ratings</span>
            </div>
          </div>
        </div>
      </div>

      <SeoInspector metadata={metadata} structuredData={productSchema} />
    </>
  );
}
