// examples/url-internationalization-examples.ts
/**
 * Complete examples for URL Manager and Internationalization
 * 
 * These examples demonstrate real-world usage of both modules
 * working together for international SEO optimization.
 */

import {
  createUrlManager,
  createI18n,
  slug,
  normalizeUrl,
  COMMON_LOCALES,
  type UrlConfig,
  type I18nConfig
} from 'm-seo';

// ============================================================================
// PART 1: URL MANAGER EXAMPLES
// ============================================================================

console.log('\n=== URL MANAGER EXAMPLES ===\n');

// Example 1: Basic URL Manager Setup
console.log('1. Basic URL Manager Setup');
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true,
  forceHttps: true,
  forceLowerCase: true,
  removeWww: true
});

console.log('Canonical URL:', urlManager.getCanonical('/products/shoes'));
console.log('Normalized:', urlManager.normalize('HTTP://WWW.EXAMPLE.COM/Products'));
console.log('');

// Example 2: SEO-Friendly Slugs
console.log('2. SEO-Friendly Slugs');
console.log('Basic slug:', slug('Hello World 2024!'));
console.log('With diacritics:', slug('Café résumé français', { removeDiacritics: true }));
console.log('Custom separator:', slug('Node.js Tutorial', { separator: '_' }));
console.log('Truncated:', slug('This is a very long title that needs truncating', { truncate: 30 }));
console.log('Custom replacements:', slug('C++ Programming Guide', {
  customReplacements: { '++': 'plus-plus' }
}));
console.log('');

// Example 3: Query Parameter Management
console.log('3. Query Parameter Management');
const cleanUrlManager = createUrlManager({
  baseUrl: 'https://example.com',
  ignoreQueryParams: ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid']
});

const dirtyUrl = 'https://example.com/products?id=123&utm_source=google&utm_campaign=spring';
console.log('Original:', dirtyUrl);
console.log('Cleaned:', cleanUrlManager.cleanQueryParams(dirtyUrl));

const params = cleanUrlManager.getQueryParams('/products?id=123&color=red&size=large');
console.log('Extracted params:', params);

const withParams = cleanUrlManager.addQueryParams('/products', { sort: 'price', order: 'asc' });
console.log('Added params:', withParams);

const withoutParams = cleanUrlManager.removeQueryParams(
  '/products?id=123&color=red&size=large',
  ['color', 'size']
);
console.log('Removed params:', withoutParams);
console.log('');

// Example 4: Redirect Management
console.log('4. Redirect Management');
const redirectManager = createUrlManager({ baseUrl: 'https://example.com' });

// Add simple redirect
redirectManager.addRedirect({
  from: '/old-page',
  to: '/new-page',
  statusCode: 301
});

// Add pattern-based redirect
redirectManager.addRedirect({
  from: /^\/blog\/(\d+)$/,
  to: '/articles/$1',
  statusCode: 301
});

// Add redirect with query preservation
redirectManager.addRedirect({
  from: '/legacy',
  to: '/modern',
  statusCode: 301,
  preserveQuery: true
});

const redirect1 = redirectManager.getRedirect('/old-page');
console.log('Redirect /old-page to:', redirect1?.to);

const redirect2 = redirectManager.getRedirect('/blog/123');
console.log('Redirect /blog/123 to:', redirect2?.to);
console.log('');

// Example 5: Pagination URLs
console.log('5. Pagination URLs');
const pagination = urlManager.generatePaginationUrls('/products', 3, 10);
console.log('Pagination URLs:');
console.log('  First:', pagination.first);
console.log('  Prev:', pagination.prev);
console.log('  Current:', pagination.current);
console.log('  Next:', pagination.next);
console.log('  Last:', pagination.last);
console.log('  Canonical:', pagination.canonical);

// Path-based pagination
const pathPagination = urlManager.generatePaginationUrls('/products', 2, 5, {
  useQuery: false
});
console.log('\nPath-based pagination:');
console.log('  Current:', pathPagination.current);
console.log('');

// Example 6: Mobile URL Variants
console.log('6. Mobile URL Variants');
const mobileUrl = 'https://example.com/products/phones';

console.log('Original:', mobileUrl);
console.log('Subdomain:', urlManager.generateMobileUrl(mobileUrl, 'subdomain'));
console.log('Parameter:', urlManager.generateMobileUrl(mobileUrl, 'parameter'));
console.log('Separate path:', urlManager.generateMobileUrl(mobileUrl, 'separate'));
console.log('');

// Example 7: URL Validation
console.log('7. URL Validation');
const urls = [
  'https://example.com/products',
  'javascript:alert("XSS")',
  '/../../etc/passwd',
  'http://example.com/page',
  'https://example.com/<script>alert(1)</script>'
];

urls.forEach(url => {
  const result = urlManager.validateUrl(url);
  console.log(`${url}:`);
  console.log(`  Valid: ${result.valid}`);
  if (result.issues.length > 0) {
    console.log(`  Issues: ${result.issues.join(', ')}`);
  }
});
console.log('');

// Example 8: Breadcrumb Generation
console.log('8. Breadcrumb Generation');
const breadcrumbs = urlManager.generateBreadcrumbs('/products/electronics/phones/smartphones');
console.log('Breadcrumbs:');
breadcrumbs.forEach(crumb => {
  console.log(`  ${crumb.name} -> ${crumb.url}`);
});
console.log('');

// Example 9: URL Parsing and Building
console.log('9. URL Parsing and Building');
const testUrl = 'https://example.com:8080/products/phones?sort=price&order=asc#reviews';
const components = urlManager.parseUrl(testUrl);
console.log('Parsed components:');
console.log('  Protocol:', components.protocol);
console.log('  Hostname:', components.hostname);
console.log('  Port:', components.port);
console.log('  Pathname:', components.pathname);
console.log('  Search:', components.search);
console.log('  Hash:', components.hash);

const rebuilt = urlManager.buildUrl(components, true);
console.log('Rebuilt URL:', rebuilt);
console.log('');

// ============================================================================
// PART 2: INTERNATIONALIZATION EXAMPLES
// ============================================================================

console.log('\n=== INTERNATIONALIZATION EXAMPLES ===\n');

// Example 10: Basic i18n Setup
console.log('10. Basic i18n Setup');
const i18n = createI18n({
  defaultLocale: COMMON_LOCALES.ENGLISH,
  supportedLocales: [
    COMMON_LOCALES.ENGLISH,
    COMMON_LOCALES.SPANISH,
    COMMON_LOCALES.FRENCH,
    COMMON_LOCALES.GERMAN
  ],
  fallbackLocale: COMMON_LOCALES.ENGLISH,
  urlStrategy: 'path',
  rtlLocales: [COMMON_LOCALES.ARABIC, COMMON_LOCALES.HEBREW]
});

console.log('Current locale:', i18n.getLocale());
console.log('Supported locales:', i18n.getSupportedLocales().join(', '));
console.log('');

// Example 11: Loading Translations
console.log('11. Loading Translations');
await i18n.loadTranslations('en', {
  nav: {
    home: 'Home',
    products: 'Products',
    about: 'About Us',
    contact: 'Contact'
  },
  product: {
    title: 'Product Details',
    price: 'Price: {{amount}}',
    description: 'Description',
    addToCart: 'Add to Cart',
    inStock: 'In stock: {{count}} items'
  },
  cart: {
    items: {
      zero: 'Your cart is empty',
      one: 'You have {{count}} item',
      other: 'You have {{count}} items'
    }
  }
});

await i18n.loadTranslations('es', {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    about: 'Sobre Nosotros',
    contact: 'Contacto'
  },
  product: {
    title: 'Detalles del Producto',
    price: 'Precio: {{amount}}',
    description: 'Descripción',
    addToCart: 'Agregar al Carrito',
    inStock: 'En stock: {{count}} artículos'
  },
  cart: {
    items: {
      zero: 'Tu carrito está vacío',
      one: 'Tienes {{count}} artículo',
      other: 'Tienes {{count}} artículos'
    }
  }
});

await i18n.loadTranslations('fr', {
  nav: {
    home: 'Accueil',
    products: 'Produits',
    about: 'À Propos',
    contact: 'Contact'
  },
  product: {
    title: 'Détails du Produit',
    price: 'Prix : {{amount}}',
    description: 'Description',
    addToCart: 'Ajouter au Panier',
    inStock: 'En stock : {{count}} articles'
  },
  cart: {
    items: {
      zero: 'Votre panier est vide',
      one: 'Vous avez {{count}} article',
      other: 'Vous avez {{count}} articles'
    }
  }
});

console.log('Translations loaded successfully');
console.log('');

// Example 12: Using Translations
console.log('12. Using Translations');
i18n.setLocale('en');
console.log('English:', i18n.t('nav.home'));
console.log('English:', i18n.t('product.price', { amount: '$99.99' }));

i18n.setLocale('es');
console.log('Spanish:', i18n.t('nav.home'));
console.log('Spanish:', i18n.t('product.price', { amount: '$99.99' }));

i18n.setLocale('fr');
console.log('French:', i18n.t('nav.home'));
console.log('French:', i18n.t('product.price', { amount: '99,99 €' }));
console.log('');

// Example 13: Pluralization
console.log('13. Pluralization');
i18n.setLocale('en');
console.log('0 items:', i18n.pluralize('cart.items', 0));
console.log('1 item:', i18n.pluralize('cart.items', 1));
console.log('5 items:', i18n.pluralize('cart.items', 5));

i18n.setLocale('es');
console.log('0 artículos:', i18n.pluralize('cart.items', 0));
console.log('1 artículo:', i18n.pluralize('cart.items', 1));
console.log('5 artículos:', i18n.pluralize('cart.items', 5));
console.log('');

// Example 14: Date Formatting
console.log('14. Date Formatting');
const date = new Date('2024-03-15T10:30:00');

i18n.setLocale('en-US');
console.log('US English:', i18n.formatDate(date));

i18n.setLocale('es-ES');
console.log('Spanish:', i18n.formatDate(date));

i18n.setLocale('de-DE');
console.log('German:', i18n.formatDate(date));

i18n.setLocale('ja-JP');
console.log('Japanese:', i18n.formatDate(date));

// Custom format
i18n.setLocale('en');
console.log('Custom:', i18n.formatDate(date, {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
}));
console.log('');

// Example 15: Number Formatting
console.log('15. Number Formatting');
const number = 1234567.89;

i18n.setLocale('en-US');
console.log('US English:', i18n.formatNumber(number));

i18n.setLocale('de-DE');
console.log('German:', i18n.formatNumber(number));

i18n.setLocale('fr-FR');
console.log('French:', i18n.formatNumber(number));

i18n.setLocale('ja-JP');
console.log('Japanese:', i18n.formatNumber(number));
console.log('');

// Example 16: Currency Formatting
console.log('16. Currency Formatting');
const amount = 1234.56;

i18n.setLocale('en-US');
console.log('USD:', i18n.formatCurrency(amount, 'USD'));

i18n.setLocale('es-ES');
console.log('EUR:', i18n.formatCurrency(amount, 'EUR'));

i18n.setLocale('ja-JP');
console.log('JPY:', i18n.formatCurrency(amount, 'JPY'));

i18n.setLocale('en-GB');
console.log('GBP (auto):', i18n.formatCurrency(amount));
console.log('');

// Example 17: Relative Time
console.log('17. Relative Time');
const now = new Date();
const hour = 60 * 60 * 1000;
const day = 24 * hour;

const dates = {
  '1 hour ago': new Date(now.getTime() - hour),
  '1 day ago': new Date(now.getTime() - day),
  '3 days ago': new Date(now.getTime() - 3 * day),
  '1 week ago': new Date(now.getTime() - 7 * day)
};

Object.entries(dates).forEach(([label, date]) => {
  i18n.setLocale('en');
  const en = i18n.formatRelativeTime(date);
  
  i18n.setLocale('es');
  const es = i18n.formatRelativeTime(date);
  
  console.log(`${label}: EN="${en}", ES="${es}"`);
});
console.log('');

// Example 18: RTL Support
console.log('18. RTL Support');
const rtlLocales = ['ar', 'he'];
rtlLocales.forEach(locale => {
  i18n.setLocale(locale);
  const localeData = i18n.getLocaleData();
  console.log(`${locale}:`);
  console.log(`  Name: ${localeData?.nativeName}`);
  console.log(`  Direction: ${i18n.getDirection()}`);
  console.log(`  Is RTL: ${i18n.isRTL()}`);
});
console.log('');

// Example 19: Locale Data
console.log('19. Locale Data');
i18n.setLocale('es-MX');
const localeData = i18n.getLocaleData();
console.log('Spanish (Mexico):');
console.log('  Code:', localeData?.code);
console.log('  Name:', localeData?.name);
console.log('  Native Name:', localeData?.nativeName);
console.log('  Direction:', localeData?.direction);
console.log('  Currency:', localeData?.currency);
console.log('  Date Format:', localeData?.dateFormat);
console.log('  Time Format:', localeData?.timeFormat);
console.log('');

// Example 20: Locale Switcher Data
console.log('20. Locale Switcher Data');
const switcherData = i18n.getLocaleSwitcherData('/products', 'https://example.com');
console.log('Locale switcher data:');
switcherData.forEach(locale => {
  console.log(`  ${locale.code} (${locale.nativeName}): ${locale.url} ${locale.active ? '(active)' : ''}`);
});
console.log('');

// ============================================================================
// PART 3: COMBINED EXAMPLES (URL Manager + i18n)
// ============================================================================

console.log('\n=== COMBINED EXAMPLES ===\n');

// Example 21: Multi-language URL Management
console.log('21. Multi-language URL Management');
const multiLangUrlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true,
  localePrefix: 'path',
  defaultLocale: 'en'
});

const locales = ['en', 'es', 'fr', 'de'];
locales.forEach(locale => {
  const canonical = multiLangUrlManager.getCanonical('/products/shoes', { locale });
  console.log(`${locale}: ${canonical}`);
});
console.log('');

// Example 22: Hreflang Tags with URL Manager
console.log('22. Hreflang Tags with URL Manager');
const hreflangTags = i18n.generateHreflangTags('/products', 'https://example.com', {
  includeXDefault: true,
  xDefaultLocale: 'en'
});

console.log('Hreflang tags for /products:');
hreflangTags.forEach(tag => {
  console.log(`  <link rel="alternate" hreflang="${tag.hreflang}" href="${tag.href}" />`);
});
console.log('');

// Example 23: Localized Metadata with SEO
console.log('23. Localized Metadata with SEO');
const metadata = {
  en: {
    title: 'Premium Shoes - Free Shipping',
    description: 'Shop our collection of premium shoes with free worldwide shipping.',
    keywords: ['shoes', 'premium', 'free shipping'],
    ogTitle: 'Premium Shoes',
    ogDescription: 'High-quality shoes for every occasion',
    ogImage: 'https://example.com/images/shoes-en.jpg'
  },
  es: {
    title: 'Zapatos Premium - Envío Gratis',
    description: 'Compra nuestra colección de zapatos premium con envío gratis mundial.',
    keywords: ['zapatos', 'premium', 'envío gratis'],
    ogTitle: 'Zapatos Premium',
    ogDescription: 'Zapatos de alta calidad para cada ocasión',
    ogImage: 'https://example.com/images/shoes-es.jpg'
  },
  fr: {
    title: 'Chaussures Premium - Livraison Gratuite',
    description: 'Achetez notre collection de chaussures premium avec livraison gratuite mondiale.',
    keywords: ['chaussures', 'premium', 'livraison gratuite'],
    ogTitle: 'Chaussures Premium',
    ogDescription: 'Chaussures de haute qualité pour toutes les occasions',
    ogImage: 'https://example.com/images/shoes-fr.jpg'
  }
};

['en', 'es', 'fr'].forEach(locale => {
  i18n.setLocale(locale);
  const meta = i18n.getLocalizedMetadata(metadata);
  const canonical = multiLangUrlManager.getCanonical('/products/shoes', { locale });
  
  console.log(`${locale.toUpperCase()}:`);
  console.log(`  Title: ${meta.title}`);
  console.log(`  Canonical: ${canonical}`);
  console.log(`  OG Image: ${meta.ogImage}`);
});
console.log('');

// Example 24: Localized Slugs
console.log('24. Localized Slugs');
const productNames = {
  en: 'Premium Leather Shoes',
  es: 'Zapatos de Cuero Premium',
  fr: 'Chaussures en Cuir Premium',
  de: 'Premium Lederschuhe'
};

Object.entries(productNames).forEach(([locale, name]) => {
  const productSlug = slug(name, { removeDiacritics: true });
  const fullUrl = multiLangUrlManager.getCanonical(`/products/${productSlug}`, { locale });
  console.log(`${locale}: ${fullUrl}`);
});
console.log('');

// Example 25: Complete E-commerce Example
console.log('25. Complete E-commerce Example');
interface Product {
  id: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  price: number;
  currency: string;
}

const product: Product = {
  id: 'shoe-001',
  names: {
    en: 'Classic Leather Oxford',
    es: 'Oxford de Cuero Clásico',
    fr: 'Oxford en Cuir Classique'
  },
  descriptions: {
    en: 'Timeless style meets modern comfort',
    es: 'Estilo atemporal se encuentra con comodidad moderna',
    fr: 'Le style intemporel rencontre le confort moderne'
  },
  price: 159.99,
  currency: 'USD'
};

function generateProductPage(product: Product, locale: string) {
  i18n.setLocale(locale);
  
  const productName = product.names[locale] || product.names['en'];
  const productSlug = slug(productName, { removeDiacritics: true });
  const url = multiLangUrlManager.getCanonical(`/products/${productSlug}`, { locale });
  const hreflang = i18n.generateHreflangTags(`/products/${productSlug}`, 'https://example.com');
  
  const meta = {
    title: productName,
    description: product.descriptions[locale],
    canonical: url,
    hreflang: hreflang
  };
  
  const localeCurrency = locale === 'en' ? 'USD' : 'EUR';
  const formattedPrice = i18n.formatCurrency(product.price, localeCurrency);
  
  return {
    url,
    meta,
    price: formattedPrice,
    addToCart: i18n.t('product.addToCart')
  };
}

['en', 'es', 'fr'].forEach(locale => {
  const page = generateProductPage(product, locale);
  console.log(`${locale.toUpperCase()}:`);
  console.log(`  URL: ${page.url}`);
  console.log(`  Title: ${page.meta.title}`);
  console.log(`  Price: ${page.price}`);
  console.log(`  Button: ${page.addToCart}`);
  console.log(`  Hreflang tags: ${page.meta.hreflang.length}`);
});

console.log('\n=== Examples Complete ===\n');
