# Internationalization (i18n) Guide

Complete guide to implementing multi-language SEO with the Internationalization module.

## Table of Contents

- [Overview](#overview)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Features](#features)
- [API Reference](#api-reference)
- [Examples](#examples)
- [Best Practices](#best-practices)

## Overview

The Internationalization module provides comprehensive multi-language support for SEO:

- **Locale Management**: Detect and manage user locales
- **Translations**: Organize and retrieve translated content
- **Hreflang Tags**: Generate hreflang tags for international SEO
- **RTL Support**: Handle right-to-left languages
- **Date/Number Formatting**: Locale-specific formatting
- **Currency Formatting**: Format prices by locale
- **Pluralization**: Handle plural forms correctly
- **Locale Detection**: Auto-detect from URL, browser, cookies, localStorage
- **URL Strategies**: Path, subdomain, domain, or query-based locales
- **Metadata Localization**: Manage SEO metadata per language

## Installation

```bash
npm install m-seo
```

## Quick Start

```typescript
import { createI18n } from 'm-seo';

// Create i18n instance
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr', 'de'],
  fallbackLocale: 'en',
  urlStrategy: 'path'
});

// Load translations
await i18n.loadTranslations('en', {
  welcome: {
    message: 'Hello, {{name}}!',
    description: 'Welcome to our site'
  }
});

// Set current locale
i18n.setLocale('es');

// Translate
const message = i18n.t('welcome.message', { name: 'John' });
// Result: "Hola, John!"

// Generate hreflang tags
const hreflangTags = i18n.generateHreflangTags('/products', 'https://example.com');
```

## Configuration

### I18nConfig Interface

```typescript
interface I18nConfig {
  // Default language (required)
  defaultLocale: string;
  
  // Supported languages (required)
  supportedLocales: string[];
  
  // Fallback language
  fallbackLocale?: string;
  
  // Translation files path pattern
  loadPath?: string;
  
  // Auto-detect locale from browser/URL
  detectLocale?: boolean;
  
  // Cookie name for locale storage
  cookieName?: string;
  
  // localStorage key for locale
  localStorageKey?: string;
  
  // URL strategy for locales
  urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
  
  // RTL locales
  rtlLocales?: string[];
  
  // Date format options per locale
  dateFormats?: Record<string, Intl.DateTimeFormatOptions>;
  
  // Number format options per locale
  numberFormats?: Record<string, Intl.NumberFormatOptions>;
}
```

### LocaleData Interface

```typescript
interface LocaleData {
  code: string;              // e.g., 'en', 'es-MX'
  name: string;              // e.g., 'English', 'Spanish'
  nativeName: string;        // e.g., 'English', 'Español'
  direction: 'ltr' | 'rtl';  // Text direction
  currency?: string;         // e.g., 'USD', 'EUR'
  dateFormat?: string;       // e.g., 'MM/DD/YYYY'
  timeFormat?: string;       // e.g., '12h', '24h'
}
```

## Features

### 1. Locale Detection

Auto-detect user locale from multiple sources:

```typescript
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  detectLocale: true,
  urlStrategy: 'path'
});

// Detection order:
// 1. URL (/es/products)
// 2. localStorage
// 3. Cookie
// 4. Browser language
// 5. Default locale

const detectedLocale = i18n.detectLocale();
i18n.setLocale(detectedLocale);
```

### 2. URL Strategies

Choose how locales appear in URLs:

```typescript
// Path-based (recommended)
// URLs: /en/products, /es/products, /fr/products
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'path'
});

// Subdomain-based
// URLs: en.example.com, es.example.com, fr.example.com
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'subdomain'
});

// Query parameter-based
// URLs: example.com?lang=en, example.com?lang=es
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'query'
});

// No locale in URL (use cookie/localStorage)
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'none'
});
```

### 3. Translations

Manage translations with nested keys:

```typescript
// Load translations
await i18n.loadTranslations('en', {
  nav: {
    home: 'Home',
    products: 'Products',
    about: 'About Us'
  },
  product: {
    title: 'Product Details',
    price: 'Price: {{amount}}',
    description: 'Description'
  }
});

await i18n.loadTranslations('es', {
  nav: {
    home: 'Inicio',
    products: 'Productos',
    about: 'Sobre Nosotros'
  },
  product: {
    title: 'Detalles del Producto',
    price: 'Precio: {{amount}}',
    description: 'Descripción'
  }
});

// Use translations
i18n.setLocale('es');
const title = i18n.t('product.title');
// Result: "Detalles del Producto"

// With interpolation
const price = i18n.t('product.price', { amount: '$99.99' });
// Result: "Precio: $99.99"

// Specific locale
const enTitle = i18n.t('product.title', {}, 'en');
// Result: "Product Details"
```

### 4. Pluralization

Handle plural forms correctly:

```typescript
await i18n.loadTranslations('en', {
  items: {
    zero: 'No items',
    one: '{{count}} item',
    other: '{{count}} items'
  }
});

i18n.pluralize('items', 0); // "No items"
i18n.pluralize('items', 1); // "1 item"
i18n.pluralize('items', 5); // "5 items"
```

### 5. Hreflang Tags for SEO

Generate hreflang tags for multi-language sites:

```typescript
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr', 'de'],
  urlStrategy: 'path'
});

const hreflangTags = i18n.generateHreflangTags(
  '/products',
  'https://example.com',
  { includeXDefault: true, xDefaultLocale: 'en' }
);

console.log(hreflangTags);
// [
//   { hreflang: 'en', href: 'https://example.com/products' },
//   { hreflang: 'es', href: 'https://example.com/es/products' },
//   { hreflang: 'fr', href: 'https://example.com/fr/products' },
//   { hreflang: 'de', href: 'https://example.com/de/products' },
//   { hreflang: 'x-default', href: 'https://example.com/products' }
// ]

// In HTML:
hreflangTags.forEach(tag => {
  console.log(`<link rel="alternate" hreflang="${tag.hreflang}" href="${tag.href}" />`);
});
```

### 6. RTL Support

Handle right-to-left languages:

```typescript
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'ar', 'he'],
  rtlLocales: ['ar', 'he']
});

// Check direction
i18n.setLocale('ar');
const isRTL = i18n.isRTL(); // true
const direction = i18n.getDirection(); // 'rtl'

// Automatically updates HTML dir attribute
// <html dir="rtl" lang="ar">
```

### 7. Date Formatting

Format dates according to locale:

```typescript
const date = new Date('2024-03-15');

i18n.setLocale('en-US');
i18n.formatDate(date); // "March 15, 2024"

i18n.setLocale('es');
i18n.formatDate(date); // "15 de marzo de 2024"

i18n.setLocale('de');
i18n.formatDate(date); // "15. März 2024"

// Custom format
i18n.formatDate(date, {
  year: 'numeric',
  month: 'short',
  day: '2-digit'
});
```

### 8. Number Formatting

Format numbers according to locale:

```typescript
const number = 1234567.89;

i18n.setLocale('en-US');
i18n.formatNumber(number); // "1,234,567.89"

i18n.setLocale('de-DE');
i18n.formatNumber(number); // "1.234.567,89"

i18n.setLocale('fr-FR');
i18n.formatNumber(number); // "1 234 567,89"

// Custom format
i18n.formatNumber(number, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});
```

### 9. Currency Formatting

Format currency amounts by locale:

```typescript
const amount = 1234.56;

i18n.setLocale('en-US');
i18n.formatCurrency(amount, 'USD'); // "$1,234.56"

i18n.setLocale('es-ES');
i18n.formatCurrency(amount, 'EUR'); // "1.234,56 €"

i18n.setLocale('ja-JP');
i18n.formatCurrency(amount, 'JPY'); // "¥1,235"

// Auto-detect currency from locale
i18n.setLocale('en-GB');
i18n.formatCurrency(amount); // "£1,234.56"
```

### 10. Relative Time

Format relative time ("3 days ago"):

```typescript
const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

i18n.setLocale('en');
i18n.formatRelativeTime(threeDaysAgo); // "3 days ago"

i18n.setLocale('es');
i18n.formatRelativeTime(threeDaysAgo); // "hace 3 días"

i18n.setLocale('fr');
i18n.formatRelativeTime(threeDaysAgo); // "il y a 3 jours"
```

### 11. Localized Metadata

Manage SEO metadata per language:

```typescript
const metadata = {
  en: {
    title: 'Our Products - Best Quality',
    description: 'Browse our selection of high-quality products',
    keywords: ['products', 'quality', 'shop'],
    ogTitle: 'Our Products',
    ogDescription: 'High-quality products for everyone',
    ogImage: 'https://example.com/images/products-en.jpg'
  },
  es: {
    title: 'Nuestros Productos - Mejor Calidad',
    description: 'Explore nuestra selección de productos de alta calidad',
    keywords: ['productos', 'calidad', 'tienda'],
    ogTitle: 'Nuestros Productos',
    ogDescription: 'Productos de alta calidad para todos',
    ogImage: 'https://example.com/images/products-es.jpg'
  }
};

i18n.setLocale('es');
const localizedMeta = i18n.getLocalizedMetadata(metadata);

console.log(localizedMeta.title); // "Nuestros Productos - Mejor Calidad"
console.log(localizedMeta.description); // "Explore nuestra selección..."
```

### 12. Locale Switcher

Generate locale switcher data:

```typescript
const switcherData = i18n.getLocaleSwitcherData('/products', 'https://example.com');

console.log(switcherData);
// [
//   {
//     code: 'en',
//     name: 'English',
//     nativeName: 'English',
//     url: 'https://example.com/products',
//     active: true
//   },
//   {
//     code: 'es',
//     name: 'Spanish',
//     nativeName: 'Español',
//     url: 'https://example.com/es/products',
//     active: false
//   },
//   {
//     code: 'fr',
//     name: 'French',
//     nativeName: 'Français',
//     url: 'https://example.com/fr/products',
//     active: false
//   }
// ]

// Use in UI:
switcherData.forEach(locale => {
  console.log(`<a href="${locale.url}" class="${locale.active ? 'active' : ''}">
    ${locale.nativeName}
  </a>`);
});
```

## API Reference

### Core Methods

#### `setLocale(locale: string)`
Set the current locale.

**Parameters:**
- `locale: string` - Locale code (e.g., 'en', 'es-MX')

#### `getLocale()`
Get the current locale.

**Returns:** `string` - Current locale code

#### `detectLocale()`
Auto-detect locale from URL, storage, browser.

**Returns:** `string` - Detected locale code

#### `translate(key, params?, locale?)`
Translate a key with optional interpolation.

**Alias:** `t()`

**Parameters:**
- `key: string` - Translation key (e.g., 'nav.home')
- `params?: Record<string, any>` - Interpolation parameters
- `locale?: string` - Override current locale

**Returns:** `string` - Translated text

#### `pluralize(key, count, params?)`
Get plural form based on count.

**Parameters:**
- `key: string` - Translation key
- `count: number` - Count for pluralization
- `params?: Record<string, any>` - Additional parameters

**Returns:** `string` - Pluralized text

#### `formatDate(date, options?, locale?)`
Format date according to locale.

**Parameters:**
- `date: Date` - Date to format
- `options?: Intl.DateTimeFormatOptions` - Format options
- `locale?: string` - Override current locale

**Returns:** `string` - Formatted date

#### `formatNumber(number, options?, locale?)`
Format number according to locale.

**Parameters:**
- `number: number` - Number to format
- `options?: Intl.NumberFormatOptions` - Format options
- `locale?: string` - Override current locale

**Returns:** `string` - Formatted number

#### `formatCurrency(amount, currency?, locale?)`
Format currency amount.

**Parameters:**
- `amount: number` - Amount to format
- `currency?: string` - Currency code (e.g., 'USD', 'EUR')
- `locale?: string` - Override current locale

**Returns:** `string` - Formatted currency

#### `formatRelativeTime(date, locale?)`
Format relative time (e.g., "3 days ago").

**Parameters:**
- `date: Date` - Date to format
- `locale?: string` - Override current locale

**Returns:** `string` - Formatted relative time

#### `generateHreflangTags(path, baseUrl, options?)`
Generate hreflang tags for SEO.

**Parameters:**
- `path: string` - URL path
- `baseUrl: string` - Base site URL
- `options?: { includeXDefault?: boolean; xDefaultLocale?: string }` - Options

**Returns:** `HreflangTag[]` - Array of hreflang tags

#### `getLocalizedUrl(path, locale, baseUrl)`
Get localized URL for a path.

**Parameters:**
- `path: string` - URL path
- `locale: string` - Target locale
- `baseUrl: string` - Base site URL

**Returns:** `string` - Localized URL

#### `isRTL(locale?)`
Check if locale is right-to-left.

**Parameters:**
- `locale?: string` - Locale to check (default: current)

**Returns:** `boolean` - True if RTL

#### `getDirection(locale?)`
Get text direction for locale.

**Parameters:**
- `locale?: string` - Locale to check (default: current)

**Returns:** `'ltr' | 'rtl'` - Text direction

#### `getLocaleData(locale?)`
Get locale metadata.

**Parameters:**
- `locale?: string` - Locale to get (default: current)

**Returns:** `LocaleData | undefined` - Locale metadata

#### `getSupportedLocales()`
Get all supported locales.

**Returns:** `string[]` - Array of locale codes

#### `isLocaleSupported(locale)`
Check if locale is supported.

**Parameters:**
- `locale: string` - Locale to check

**Returns:** `boolean` - True if supported

## Examples

See [examples/internationalization-examples.ts](../examples/internationalization-examples.ts) for comprehensive examples.

## Best Practices

### 1. Use Path-Based URLs

Path-based locales are recommended for SEO:

```typescript
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'path'
});

// URLs: /en/products, /es/products, /fr/products
```

### 2. Always Include Hreflang Tags

Critical for international SEO:

```typescript
const hreflangTags = i18n.generateHreflangTags(currentPath, baseUrl, {
  includeXDefault: true,
  xDefaultLocale: 'en'
});

// Add to <head>
hreflangTags.forEach(tag => {
  // <link rel="alternate" hreflang="{tag.hreflang}" href="{tag.href}" />
});
```

### 3. Set HTML Lang and Dir Attributes

Automatically handled by `setLocale()`:

```typescript
i18n.setLocale('ar');
// Sets: <html lang="ar" dir="rtl">
```

### 4. Use Fallback Locale

Always specify a fallback:

```typescript
const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  fallbackLocale: 'en' // Fallback if translation missing
});
```

### 5. Organize Translations

Use nested keys for organization:

```typescript
{
  nav: { home: 'Home', products: 'Products' },
  product: { title: 'Product', price: 'Price' },
  footer: { copyright: '© 2024 Company' }
}
```

### 6. Localize All Metadata

Provide localized metadata for each language:

```typescript
const metadata = {
  en: { title: 'Products', description: 'Our products' },
  es: { title: 'Productos', description: 'Nuestros productos' }
};
```

### 7. Handle RTL Languages

Test with RTL languages:

```typescript
const rtlLocales = ['ar', 'he', 'fa', 'ur'];
// CSS: [dir="rtl"] { text-align: right; }
```

### 8. Use Locale Switcher

Provide easy language switching:

```typescript
const switcherData = i18n.getLocaleSwitcherData(currentPath, baseUrl);
// Render as dropdown or links
```

## Integration with Frameworks

### React

```typescript
import { createI18n } from 'm-seo';
import { useEffect, useState } from 'react';

const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr']
});

function App() {
  const [locale, setLocale] = useState(i18n.getLocale());
  
  useEffect(() => {
    const detected = i18n.detectLocale();
    i18n.setLocale(detected);
    setLocale(detected);
  }, []);
  
  const changeLocale = (newLocale: string) => {
    i18n.setLocale(newLocale);
    setLocale(newLocale);
  };
  
  return (
    <div>
      <h1>{i18n.t('welcome.message')}</h1>
      <select value={locale} onChange={(e) => changeLocale(e.target.value)}>
        {i18n.getSupportedLocales().map(loc => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
    </div>
  );
}
```

### Next.js

```typescript
import { createI18n } from 'm-seo';
import { GetServerSideProps } from 'next';

const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr'],
  urlStrategy: 'path'
});

export const getServerSideProps: GetServerSideProps = async ({ locale }) => {
  await i18n.loadTranslations(locale || 'en', /* translations */);
  
  return {
    props: {
      locale: locale || 'en'
    }
  };
};

export default function Page({ locale }: { locale: string }) {
  i18n.setLocale(locale);
  
  const hreflangTags = i18n.generateHreflangTags(
    '/products',
    process.env.NEXT_PUBLIC_BASE_URL!
  );
  
  return (
    <>
      <Head>
        {hreflangTags.map(tag => (
          <link
            key={tag.hreflang}
            rel="alternate"
            hrefLang={tag.hreflang}
            href={tag.href}
          />
        ))}
      </Head>
      <h1>{i18n.t('products.title')}</h1>
    </>
  );
}
```

### Vue

```vue
<script setup lang="ts">
import { createI18n } from 'm-seo';
import { ref, onMounted } from 'vue';

const i18n = createI18n({
  defaultLocale: 'en',
  supportedLocales: ['en', 'es', 'fr']
});

const locale = ref(i18n.getLocale());

onMounted(() => {
  const detected = i18n.detectLocale();
  i18n.setLocale(detected);
  locale.value = detected;
});

const changeLocale = (newLocale: string) => {
  i18n.setLocale(newLocale);
  locale.value = newLocale;
};
</script>

<template>
  <div>
    <h1>{{ i18n.t('welcome.message') }}</h1>
    <select :value="locale" @change="changeLocale($event.target.value)">
      <option v-for="loc in i18n.getSupportedLocales()" :key="loc" :value="loc">
        {{ loc }}
      </option>
    </select>
  </div>
</template>
```

## Common Locale Codes

The module includes the `COMMON_LOCALES` constant:

```typescript
import { COMMON_LOCALES } from 'm-seo';

console.log(COMMON_LOCALES.ENGLISH);      // 'en'
console.log(COMMON_LOCALES.SPANISH);      // 'es'
console.log(COMMON_LOCALES.FRENCH);       // 'fr'
console.log(COMMON_LOCALES.GERMAN);       // 'de'
console.log(COMMON_LOCALES.JAPANESE);     // 'ja'
console.log(COMMON_LOCALES.CHINESE_CN);   // 'zh-CN'
console.log(COMMON_LOCALES.ARABIC);       // 'ar'
// ... and more
```

## Related Guides

- [URL Manager Guide](./URL_MANAGER_GUIDE.md)
- [SEO Audit Engine Guide](./SEO_AUDIT_ENGINE_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/yourusername/m-seo).
