// examples/react-url-i18n-examples.tsx
/**
 * React examples for URL Manager and Internationalization
 *
 * These examples demonstrate how to use the new hooks in React applications
 */

import React, { useState, useEffect } from 'react';
import {
  useUrlManager,
  useCanonical,
  useHreflang,
  useI18n,
  useLocaleDetection,
  useLocaleSwitcher
} from 'm-seo/adapters/ReactSPAAdapter';

// ============================================================================
// Example 1: Basic URL Manager Usage
// ============================================================================

export function ProductPage() {
  const [productName] = useState('Premium Leather Shoes');

  const urlManager = useUrlManager({
    baseUrl: 'https://example.com',
    trailingSlash: true,
    forceLowerCase: true
  });

  const slug = urlManager.createSlug(productName, { removeDiacritics: true });
  const canonical = urlManager.getCanonical(`/products/${slug}`);

  return (
    <div>
      <h1>{productName}</h1>
      <p>Product URL: {canonical}</p>
      <p>Slug: {slug}</p>
    </div>
  );
}

// ============================================================================
// Example 2: Auto Canonical Tag
// ============================================================================

export function BlogPost({ postId, postTitle }: { postId: string; postTitle: string }) {
  const urlManager = useUrlManager({
    baseUrl: 'https://blog.example.com',
    trailingSlash: false
  });

  const slug = urlManager.createSlug(postTitle);

  // Automatically adds canonical link tag to document head
  const canonical = useCanonical(`/blog/${slug}`, {
    baseUrl: 'https://blog.example.com'
  });

  return (
    <article>
      <h1>{postTitle}</h1>
      <p>Canonical URL: {canonical}</p>
      <div>Blog content...</div>
    </article>
  );
}

// ============================================================================
// Example 3: Multi-language Product Page with Hreflang
// ============================================================================

export function MultiLanguageProduct({ productId }: { productId: string }) {
  // Automatically adds hreflang tags to document head
  const hreflangTags = useHreflang('/products/' + productId, 'https://example.com', {
    locales: ['en', 'es', 'fr', 'de'],
    urlStrategy: 'path',
    includeDefault: true
  });

  return (
    <div>
      <h2>Multi-language Product</h2>
      <p>Available in {hreflangTags.length} languages</p>
      <ul>
        {hreflangTags.map(tag => (
          <li key={tag.hreflang}>
            {tag.hreflang}: {tag.href}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ============================================================================
// Example 4: Basic i18n Usage
// ============================================================================

export function WelcomePage() {
  const { t, locale, setLocale, formatDate, formatCurrency, i18n } = useI18n({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr'],
    fallbackLocale: 'en'
  });

  // Load translations on mount
  useEffect(() => {
    i18n.loadTranslations('en', {
      welcome: {
        title: 'Welcome to Our Site',
        message: 'Hello, {{name}}!',
        description: 'This is a multi-language website'
      }
    });

    i18n.loadTranslations('es', {
      welcome: {
        title: 'Bienvenido a Nuestro Sitio',
        message: '¡Hola, {{name}}!',
        description: 'Este es un sitio web multilingüe'
      }
    });

    i18n.loadTranslations('fr', {
      welcome: {
        title: 'Bienvenue sur Notre Site',
        message: 'Bonjour, {{name}}!',
        description: 'Ceci est un site web multilingue'
      }
    });
  }, [i18n]);

  return (
    <div>
      <h1>{t('welcome.title')}</h1>
      <p>{t('welcome.message', { name: 'John' })}</p>
      <p>{t('welcome.description')}</p>

      <div>
        <p>Today: {formatDate(new Date())}</p>
        <p>Price: {formatCurrency(99.99, 'USD')}</p>
      </div>

      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}

// ============================================================================
// Example 5: Auto Locale Detection
// ============================================================================

export function AutoDetectApp() {
  const locale = useLocaleDetection({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr', 'de', 'ja'],
    detectLocale: true,
    urlStrategy: 'path'
  });

  return (
    <div>
      <h2>Auto-Detected Locale</h2>
      <p>Your locale: {locale}</p>
      <p>We automatically detected your preferred language!</p>
    </div>
  );
}

// ============================================================================
// Example 6: Language Switcher Component
// ============================================================================

export function LanguageSwitcher() {
  const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr', 'de'],
    baseUrl: 'https://example.com',
    urlStrategy: 'path'
  });

  return (
    <div className="language-switcher">
      <h3>Choose Language</h3>
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
      >
        {locales.map(loc => (
          <option key={loc.code} value={loc.code}>
            {loc.nativeName} {loc.active ? '✓' : ''}
          </option>
        ))}
      </select>

      {/* Or as links */}
      <div className="language-links">
        {locales.map(loc => (
          <a
            key={loc.code}
            href={loc.url}
            className={loc.active ? 'active' : ''}
            onClick={(e) => {
              e.preventDefault();
              switchLocale(loc.code);
            }}
          >
            {loc.nativeName}
          </a>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 7: E-commerce Product with Full i18n
// ============================================================================

interface Product {
  id: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  price: number;
}

export function EcommerceProduct({ product }: { product: Product }) {
  const { t, locale, formatCurrency, i18n } = useI18n({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr'],
    urlStrategy: 'path'
  });

  const urlManager = useUrlManager({
    baseUrl: 'https://shop.example.com',
    trailingSlash: true,
    localePrefix: 'path',
    defaultLocale: 'en'
  });

  // Load product translations
  useEffect(() => {
    i18n.loadTranslations('en', {
      product: {
        addToCart: 'Add to Cart',
        inStock: 'In Stock',
        outOfStock: 'Out of Stock',
        shipping: 'Free Shipping'
      }
    });

    i18n.loadTranslations('es', {
      product: {
        addToCart: 'Agregar al Carrito',
        inStock: 'En Stock',
        outOfStock: 'Agotado',
        shipping: 'Envío Gratis'
      }
    });
  }, [i18n]);

  const productName = product.names[locale] || product.names['en'];
  const productSlug = urlManager.createSlug(productName, { removeDiacritics: true });

  // Auto-add canonical and hreflang tags
  const canonical = useCanonical(`/products/${productSlug}`, {
    baseUrl: 'https://shop.example.com',
    locale
  });

  const hreflangTags = useHreflang(`/products/${productSlug}`, 'https://shop.example.com', {
    locales: ['en', 'es', 'fr'],
    urlStrategy: 'path',
    includeDefault: true
  });

  const currency = locale === 'en' ? 'USD' : 'EUR';

  return (
    <div className="product">
      <h1>{productName}</h1>
      <p>{product.descriptions[locale]}</p>
      <p className="price">{formatCurrency(product.price, currency)}</p>
      <p className="shipping">{t('product.shipping')}</p>
      <button>{t('product.addToCart')}</button>

      <div className="seo-info">
        <small>Canonical: {canonical}</small>
        <small>Languages: {hreflangTags.length}</small>
      </div>
    </div>
  );
}

// ============================================================================
// Example 8: Complete Multi-language E-commerce Site
// ============================================================================

export function MultiLanguageShop() {
  const { t, locale, setLocale, formatCurrency, i18n } = useI18n({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr', 'de'],
    fallbackLocale: 'en',
    urlStrategy: 'path'
  });

  const urlManager = useUrlManager({
    baseUrl: 'https://shop.example.com',
    trailingSlash: true,
    forceLowerCase: true
  });

  const [products] = useState([
    {
      id: 'prod-1',
      names: {
        en: 'Premium Leather Shoes',
        es: 'Zapatos de Cuero Premium',
        fr: 'Chaussures en Cuir Premium',
        de: 'Premium Lederschuhe'
      },
      price: 159.99
    },
    {
      id: 'prod-2',
      names: {
        en: 'Classic Oxford',
        es: 'Oxford Clásico',
        fr: 'Oxford Classique',
        de: 'Klassischer Oxford'
      },
      price: 129.99
    }
  ]);

  useEffect(() => {
    // Load all translations
    i18n.loadTranslations('en', {
      shop: {
        title: 'Our Products',
        viewProduct: 'View Product',
        cart: 'Shopping Cart'
      }
    });

    i18n.loadTranslations('es', {
      shop: {
        title: 'Nuestros Productos',
        viewProduct: 'Ver Producto',
        cart: 'Carrito de Compras'
      }
    });
  }, [i18n]);

  return (
    <div>
      <header>
        <h1>{t('shop.title')}</h1>
        <LanguageSwitcher />
      </header>

      <div className="products-grid">
        {products.map(product => {
          const name = product.names[locale as keyof typeof product.names] || product.names.en;
          const slug = urlManager.createSlug(name);
          const url = urlManager.getCanonical(`/products/${slug}`, { locale });

          return (
            <div key={product.id} className="product-card">
              <h3>{name}</h3>
              <p>{formatCurrency(product.price, locale === 'en' ? 'USD' : 'EUR')}</p>
              <a href={url}>{t('shop.viewProduct')}</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// Example 9: Pagination with i18n
// ============================================================================

export function ProductListing({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const { t, i18n } = useI18n({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr']
  });

  const urlManager = useUrlManager({
    baseUrl: 'https://example.com',
    trailingSlash: true
  });

  const pagination = urlManager.generatePaginationUrls('/products', currentPage, totalPages);

  useEffect(() => {
    i18n.loadTranslations('en', {
      pagination: {
        previous: 'Previous',
        next: 'Next',
        page: 'Page {{current}} of {{total}}'
      }
    });

    i18n.loadTranslations('es', {
      pagination: {
        previous: 'Anterior',
        next: 'Siguiente',
        page: 'Página {{current}} de {{total}}'
      }
    });
  }, [i18n]);

  return (
    <div className="pagination">
      <p>{t('pagination.page', { current: currentPage, total: totalPages })}</p>

      {pagination.prev && (
        <a href={pagination.prev}>{t('pagination.previous')}</a>
      )}

      {pagination.next && (
        <a href={pagination.next}>{t('pagination.next')}</a>
      )}
    </div>
  );
}

// ============================================================================
// Example 10: Number Formatting and Date Formatting
// ============================================================================

export function FormattingDemo() {
  const { locale, setLocale, formatDate, formatNumber, formatCurrency, formatRelativeTime } = useI18n({
    defaultLocale: 'en',
    supportedLocales: ['en', 'es', 'fr', 'de', 'ja']
  });

  const now = new Date();
  const yesterday = new Date(Date.now() - 86400000);

  return (
    <div>
      <h1>Formatting Demo</h1>

      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="ja">日本語</option>
      </select>

      <div>
        <h3>Date Formatting</h3>
        <p>Full: {formatDate(now, { dateStyle: 'full' })}</p>
        <p>Long: {formatDate(now, { dateStyle: 'long' })}</p>
        <p>Short: {formatDate(now, { dateStyle: 'short' })}</p>
      </div>

      <div>
        <h3>Number Formatting</h3>
        <p>Decimal: {formatNumber(1234567.89)}</p>
        <p>Percentage: {formatNumber(0.45, { style: 'percent' })}</p>
      </div>

      <div>
        <h3>Currency Formatting</h3>
        <p>USD: {formatCurrency(99.99, 'USD')}</p>
        <p>EUR: {formatCurrency(99.99, 'EUR')}</p>
        <p>JPY: {formatCurrency(99.99, 'JPY')}</p>
      </div>

      <div>
        <h3>Relative Time</h3>
        <p>Now: {formatRelativeTime(now)}</p>
        <p>Yesterday: {formatRelativeTime(yesterday)}</p>
      </div>
    </div>
  );
}
