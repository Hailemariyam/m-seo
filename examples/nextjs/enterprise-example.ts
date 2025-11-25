// examples/nextjs/enterprise-example.ts

import {
  createNextAdapter,
  SeoEngine,
  SitemapGenerator,
  UrlManager,
  Internationalization,
  StructuredDataManager,
  GoogleAnalytics,
  BotDetection,
  SeoAuditEngine,
  SeoReportGenerator,
  generateProductJsonLd
} from 'm-seo';

// Instantiate core and analytics modules
const seoEngine = new SeoEngine({ siteName: 'My Store' });
const sitemapGenerator = new SitemapGenerator({ hostname: 'https://mystore.com' });
const urlManager = new UrlManager({ baseUrl: 'https://mystore.com', trailingSlash: false });
const i18n = new Internationalization({ defaultLocale: 'en-US', supportedLocales: ['en-US', 'fr', 'de'] });
const structuredDataManager = new StructuredDataManager();
const googleAnalytics = new GoogleAnalytics({ measurementId: 'G-XXXXXXXXXX', autoPageView: true });
const botDetection = new BotDetection();
const seoAuditEngine = new SeoAuditEngine({ url: 'https://mystore.com', includePerformance: true });
const seoReportGenerator = new SeoReportGenerator({ title: 'Monthly SEO Report', period: { start: '2025-11-01', end: '2025-11-30' } });

// Create the enterprise NextAdapter
export const seo = createNextAdapter({
  baseUrl: 'https://mystore.com',
  siteName: 'My Store',
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,
  seoEngine,
  sitemapGenerator,
  urlManager,
  i18n,
  structuredDataManager,
  googleAnalytics,
  botDetection,
  seoAuditEngine,
  seoReportGenerator,
});

// Example: Generate metadata for a product page
// Example: Generate metadata for a product page
// Usage: Pass a product object with required fields
export function generateMetadata(product: {
  name: string;
  description: string;
  image: string;
  id: string;
}) {
  return seo.generateMetadata({
    title: product.name,
    description: product.description,
    openGraph: {
      type: 'product',
      images: [{ url: product.image }],
    },
    canonical: urlManager.getCanonical(`/products/${product.id}`),
  });
}

// Example: Generate JSON-LD for a product
export function getProductJsonLd(product: {
  name: string;
  description: string;
  image: string;
  brand?: string;
  price: number;
  inStock: boolean;
  id: string;
  rating?: number;
  reviewCount?: number;
}) {
  return generateProductJsonLd({
    name: product.name,
    description: product.description,
    image: product.image,
    brand: product.brand,
    offers: {
      price: product.price,
      priceCurrency: 'USD',
      availability: product.inStock ? 'InStock' : 'OutOfStock',
      url: urlManager.getCanonical(`/products/${product.id}`),
    },
    aggregateRating: product.rating && product.reviewCount ? {
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    } : undefined,
  });
}

// Example: Run SEO audit
export async function runSeoAudit() {
  const seoAdapter = seo as any;
  if (typeof seoAdapter.runSeoAudit === 'function') {
    return await seoAdapter.runSeoAudit('https://mystore.com');
  }
  if (seoAdapter.seoAuditEngine && typeof seoAdapter.seoAuditEngine.audit === 'function') {
    return await seoAdapter.seoAuditEngine.audit('https://mystore.com');
  }
  throw new Error('SEO audit engine not available');
}

// Example: Middleware for bot detection and security headers
// Example: Middleware for bot detection and security headers
// Usage: Call in Next.js middleware
// import { NextResponse } from 'next/server';
export function middleware(request: { headers: Map<string, string> }) {
  // Simulate NextResponse for example
  const response = {
    headers: new Map<string, string>(),
    setHeader(k: string, v: string) { this.headers.set(k, v); },
    next() { return this; }
  };
  Object.entries(seo.generateMiddlewareHeaders()).forEach(([k, v]) => response.setHeader(k, String(v)));
  const userAgent = request.headers.get('user-agent') || '';
  let isBot = false;
  let botInfo = null;
  const seoAdapter = seo as any;
  if (typeof seoAdapter.detectBot === 'function') {
    isBot = seoAdapter.detectBot(userAgent);
    botInfo = typeof seoAdapter.getBotInfo === 'function' ? seoAdapter.getBotInfo(userAgent) : null;
  } else if (seoAdapter.botDetection && typeof seoAdapter.botDetection.isBot === 'function') {
    isBot = seoAdapter.botDetection.isBot(userAgent);
    botInfo = typeof seoAdapter.botDetection.getBotInfo === 'function' ? seoAdapter.botDetection.getBotInfo(userAgent) : null;
  }
  if (isBot) {
    response.setHeader('X-Bot-Detected', botInfo?.name || 'unknown');
  }
  return response;
}

// Example: Analytics page
// Example: Analytics page (pseudo-code, not actual React)
export async function AnalyticsPage() {
  const seoAdapter = seo as any;
  const audit = await seoAdapter.runSeoAudit('https://mystore.com');
  return {
    title: 'SEO Audit Results',
    audit,
  };
}
