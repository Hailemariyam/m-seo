# URL Manager Guide

Complete guide to using the URL Manager for SEO-optimized URL handling.

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

The URL Manager provides comprehensive URL management for SEO optimization:

- **Canonical URLs**: Generate canonical URLs with locale support
- **Normalization**: Consistent URL formatting (trailing slashes, lowercase, HTTPS)
- **Slug Generation**: Create SEO-friendly slugs with diacritics support
- **Redirects**: Manage 301/302/303/307/308 redirects
- **Pagination**: Generate pagination URLs and links
- **Hreflang**: Create hreflang alternate URLs for multi-language sites
- **Validation**: Security and format validation
- **Mobile URLs**: Generate mobile-specific URL variants
- **Query Parameters**: Filter and manage query parameters
- **Breadcrumbs**: Generate breadcrumb navigation URLs

## Installation

```bash
npm install m-seo
```

## Quick Start

```typescript
import { createUrlManager } from 'm-seo';

// Create URL manager instance
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true,
  forceHttps: true,
  forceLowerCase: true
});

// Generate canonical URL
const canonical = urlManager.getCanonical('/products/my-product');
// Result: https://example.com/products/my-product/

// Create SEO-friendly slug
const slug = urlManager.createSlug('Hello World - 2024!');
// Result: hello-world-2024

// Normalize URL
const normalized = urlManager.normalize('HTTP://EXAMPLE.COM/Path?utm_source=google');
// Result: https://example.com/path/
```

## Configuration

### UrlConfig Interface

```typescript
interface UrlConfig {
  // Base site URL (required)
  baseUrl: string;
  
  // Add/remove trailing slashes
  trailingSlash?: boolean;
  
  // Force HTTPS protocol
  forceHttps?: boolean;
  
  // Convert URLs to lowercase
  forceLowerCase?: boolean;
  
  // Remove www subdomain
  removeWww?: boolean;
  
  // Default language/locale
  defaultLocale?: string;
  
  // Locale URL strategy
  localePrefix?: 'path' | 'subdomain' | 'domain' | 'none';
  
  // Whitelist query parameters
  allowedQueryParams?: string[];
  
  // Blacklist query parameters (e.g., UTM params)
  ignoreQueryParams?: string[];
  
  // Slug generation options
  slugOptions?: SlugOptions;
}
```

### SlugOptions Interface

```typescript
interface SlugOptions {
  // Separator character (default: '-')
  separator?: string;
  
  // Convert to lowercase
  lowercase?: boolean;
  
  // Remove accents/diacritics
  removeDiacritics?: boolean;
  
  // Maximum length
  truncate?: number;
  
  // Allowed characters regex
  allowedChars?: RegExp;
  
  // Preserve original case
  preserveCase?: boolean;
  
  // Custom character replacements
  customReplacements?: Record<string, string>;
}
```

## Features

### 1. Canonical URLs

Generate canonical URLs for SEO:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true
});

// Basic canonical URL
const canonical = urlManager.getCanonical('/products/shoes');
// Result: https://example.com/products/shoes/

// With locale
const localizedCanonical = urlManager.getCanonical('/products/shoes', {
  locale: 'es'
});
// Result: https://example.com/es/products/shoes/

// Strip query parameters
const cleanCanonical = urlManager.getCanonical('/products?utm_source=google', {
  stripQuery: true
});
// Result: https://example.com/products/
```

### 2. URL Normalization

Ensure consistent URL formatting:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true,
  forceHttps: true,
  forceLowerCase: true,
  removeWww: true
});

const normalized = urlManager.normalize('HTTP://WWW.EXAMPLE.COM/Products/Shoes');
// Result: https://example.com/products/shoes/
```

### 3. SEO-Friendly Slugs

Create URL-safe slugs from text:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

// Basic slug
const slug1 = urlManager.createSlug('Hello World!');
// Result: hello-world

// With diacritics removal
const slug2 = urlManager.createSlug('Café résumé', {
  removeDiacritics: true
});
// Result: cafe-resume

// Custom separator
const slug3 = urlManager.createSlug('Hello World', {
  separator: '_'
});
// Result: hello_world

// Truncate
const slug4 = urlManager.createSlug('This is a very long title', {
  truncate: 20
});
// Result: this-is-a-very-long

// Custom replacements
const slug5 = urlManager.createSlug('C++ Programming', {
  customReplacements: { '++': 'plus-plus' }
});
// Result: c-plus-plus-programming
```

### 4. Redirect Management

Manage HTTP redirects:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

// Add 301 redirect
urlManager.addRedirect({
  from: '/old-page',
  to: '/new-page',
  statusCode: 301
});

// Add redirect with regex
urlManager.addRedirect({
  from: /^\/blog\/(\d+)$/,
  to: '/articles/$1',
  statusCode: 301
});

// Check for redirect
const redirect = urlManager.getRedirect('/old-page');
if (redirect) {
  console.log(redirect.to); // '/new-page'
  console.log(redirect.statusCode); // 301
}

// Preserve query string
urlManager.addRedirect({
  from: '/old',
  to: '/new',
  statusCode: 301,
  preserveQuery: true
});
```

### 5. Pagination URLs

Generate pagination links for SEO:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

const pagination = urlManager.generatePaginationUrls('/products', 3, 10);

console.log(pagination.first);    // https://example.com/products
console.log(pagination.prev);     // https://example.com/products?page=2
console.log(pagination.current);  // https://example.com/products?page=3
console.log(pagination.next);     // https://example.com/products?page=4
console.log(pagination.last);     // https://example.com/products?page=10

// Path-based pagination
const pathPagination = urlManager.generatePaginationUrls('/products', 2, 5, {
  usePath: true
});
console.log(pathPagination.current); // https://example.com/products/page/2
```

### 6. Hreflang Alternate URLs

Generate hreflang alternate URLs for international SEO:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  localePrefix: 'path',
  defaultLocale: 'en'
});

const alternates = urlManager.generateAlternates('/products', ['en', 'es', 'fr']);

console.log(alternates);
// [
//   { hreflang: 'en', href: 'https://example.com/products', media: null },
//   { hreflang: 'es', href: 'https://example.com/es/products', media: null },
//   { hreflang: 'fr', href: 'https://example.com/fr/products', media: null }
// ]

// With x-default
const alternatesWithDefault = urlManager.generateAlternates('/products', ['en', 'es'], {
  includeXDefault: true,
  xDefaultLocale: 'en'
});
```

### 7. URL Validation

Validate URLs for security and format:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

const result1 = urlManager.validateUrl('https://example.com/products');
console.log(result1.valid); // true
console.log(result1.issues); // []

const result2 = urlManager.validateUrl('javascript:alert("XSS")');
console.log(result2.valid); // false
console.log(result2.issues); // ['Dangerous protocol: javascript']

const result3 = urlManager.validateUrl('/../../etc/passwd');
console.log(result3.valid); // false
console.log(result3.issues); // ['Path traversal detected']
```

### 8. Mobile URLs

Generate mobile-specific URL variants:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

// Subdomain strategy
const mobileSubdomain = urlManager.generateMobileUrl(
  'https://example.com/products',
  'subdomain'
);
// Result: https://m.example.com/products

// Parameter strategy
const mobileParam = urlManager.generateMobileUrl(
  'https://example.com/products',
  'parameter'
);
// Result: https://example.com/products?mobile=true

// Separate path strategy
const mobilePath = urlManager.generateMobileUrl(
  'https://example.com/products',
  'separate'
);
// Result: https://example.com/mobile/products
```

### 9. Query Parameter Management

Filter and manage query parameters:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  ignoreQueryParams: ['utm_source', 'utm_medium', 'utm_campaign']
});

// Clean tracking parameters
const cleaned = urlManager.cleanQueryParams(
  'https://example.com/products?id=123&utm_source=google'
);
// Result: https://example.com/products?id=123

// Get query parameters
const params = urlManager.getQueryParams('https://example.com/products?id=123&color=red');
console.log(params); // { id: '123', color: 'red' }

// Add query parameters
const withParams = urlManager.addQueryParams('/products', { sort: 'price', order: 'asc' });
// Result: /products?sort=price&order=asc

// Remove query parameters
const withoutParams = urlManager.removeQueryParams(
  '/products?id=123&color=red&size=large',
  ['color', 'size']
);
// Result: /products?id=123
```

### 10. Breadcrumb URLs

Generate breadcrumb navigation:

```typescript
const urlManager = createUrlManager({ baseUrl: 'https://example.com' });

const breadcrumbs = urlManager.generateBreadcrumbs('/products/electronics/phones');

console.log(breadcrumbs);
// [
//   { name: 'Products', url: 'https://example.com/products' },
//   { name: 'Electronics', url: 'https://example.com/products/electronics' },
//   { name: 'Phones', url: 'https://example.com/products/electronics/phones' }
// ]
```

## API Reference

### Core Methods

#### `getCanonical(path, options?)`
Generate canonical URL for a path.

**Parameters:**
- `path: string` - URL path
- `options?: { locale?: string; stripQuery?: boolean }` - Options

**Returns:** `string` - Canonical URL

#### `normalize(url, options?)`
Normalize URL according to configuration.

**Parameters:**
- `url: string` - URL to normalize
- `options?: { stripQuery?: boolean; forceLowerCase?: boolean }` - Override options

**Returns:** `string` - Normalized URL

#### `createSlug(text, options?)`
Create SEO-friendly slug from text.

**Parameters:**
- `text: string` - Text to slugify
- `options?: SlugOptions` - Slug options

**Returns:** `string` - URL-safe slug

#### `addRedirect(rule)`
Add redirect rule.

**Parameters:**
- `rule: RedirectRule` - Redirect configuration

#### `getRedirect(url)`
Check if URL has a redirect.

**Parameters:**
- `url: string` - URL to check

**Returns:** `RedirectRule | null` - Redirect rule or null

#### `generateAlternates(path, locales, options?)`
Generate hreflang alternate URLs.

**Parameters:**
- `path: string` - URL path
- `locales: string[]` - Supported locales
- `options?: { includeXDefault?: boolean; xDefaultLocale?: string }` - Options

**Returns:** `AlternateUrl[]` - Array of alternate URLs

#### `generatePaginationUrls(basePath, currentPage, totalPages, options?)`
Generate pagination URLs.

**Parameters:**
- `basePath: string` - Base path
- `currentPage: number` - Current page number
- `totalPages: number` - Total number of pages
- `options?: { usePath?: boolean; paramName?: string }` - Options

**Returns:** `PaginationUrls` - Pagination URLs object

#### `validateUrl(url)`
Validate URL for security and format.

**Parameters:**
- `url: string` - URL to validate

**Returns:** `{ valid: boolean; issues: string[] }` - Validation result

### Helper Functions

#### `createUrlManager(config)`
Factory function to create URL manager instance.

#### `slug(text, options?)`
Quick slug generator function.

#### `normalizeUrl(url, baseUrl, options?)`
Quick URL normalizer function.

## Examples

See [examples/url-manager-examples.ts](../examples/url-manager-examples.ts) for comprehensive examples.

## Best Practices

### 1. Use Canonical URLs

Always generate canonical URLs to prevent duplicate content issues:

```typescript
const canonical = urlManager.getCanonical(currentPath);
// Add to <head>: <link rel="canonical" href="{canonical}" />
```

### 2. Normalize All URLs

Ensure consistent URL formatting across your site:

```typescript
const normalized = urlManager.normalize(userInputUrl);
```

### 3. Filter Tracking Parameters

Remove tracking parameters from canonical URLs:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  ignoreQueryParams: ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid']
});
```

### 4. Use 301 Redirects

Use permanent (301) redirects for moved pages:

```typescript
urlManager.addRedirect({
  from: '/old-page',
  to: '/new-page',
  statusCode: 301
});
```

### 5. Implement Hreflang

Use hreflang tags for multi-language sites:

```typescript
const alternates = urlManager.generateAlternates(currentPath, supportedLocales);
// Add to <head>: <link rel="alternate" hreflang="..." href="..." />
```

### 6. Validate User Input

Always validate URLs from user input:

```typescript
const validation = urlManager.validateUrl(userUrl);
if (!validation.valid) {
  console.error('Invalid URL:', validation.issues);
}
```

### 7. Use Pagination Links

Implement proper pagination for SEO:

```typescript
const pagination = urlManager.generatePaginationUrls(basePath, page, total);
// Add to <head>:
// <link rel="prev" href="{pagination.prev}" />
// <link rel="next" href="{pagination.next}" />
```

### 8. Create Consistent Slugs

Use consistent slug generation across your site:

```typescript
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  slugOptions: {
    lowercase: true,
    removeDiacritics: true,
    separator: '-'
  }
});
```

## Integration with Frameworks

### Express.js

```typescript
import express from 'express';
import { createUrlManager } from 'm-seo';

const app = express();
const urlManager = createUrlManager({
  baseUrl: 'https://example.com',
  trailingSlash: true
});

app.get('/products/:slug', (req, res) => {
  const canonical = urlManager.getCanonical(req.path);
  res.render('product', { canonical });
});
```

### Next.js

```typescript
import { createUrlManager } from 'm-seo';

const urlManager = createUrlManager({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  trailingSlash: true
});

export default function ProductPage({ params }) {
  const canonical = urlManager.getCanonical(`/products/${params.slug}`);
  
  return (
    <Head>
      <link rel="canonical" href={canonical} />
    </Head>
  );
}
```

### React

```typescript
import { useEffect } from 'react';
import { createUrlManager } from 'm-seo';

const urlManager = createUrlManager({
  baseUrl: 'https://example.com'
});

function ProductPage() {
  useEffect(() => {
    const canonical = urlManager.getCanonical(window.location.pathname);
    
    // Add canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonical;
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  
  return <div>Product</div>;
}
```

## Related Guides

- [Internationalization Guide](./INTERNATIONALIZATION_GUIDE.md)
- [SEO Audit Engine Guide](./SEO_AUDIT_ENGINE_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/yourusername/m-seo).
