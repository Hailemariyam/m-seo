# URL Manager & Internationalization Adapter Guide

This guide covers the React and Vue adapter integrations for URL Manager and Internationalization features in m-seo.

## Table of Contents

- [Overview](#overview)
- [React Hooks](#react-hooks)
  - [useUrlManager](#useurlmanager)
  - [useCanonical](#usecanonical)
  - [useHreflang](#usehreflang)
  - [useI18n](#usei18n)
  - [useLocaleDetection](#uselocaledetection)
  - [useLocaleSwitcher](#uselocaleswitcher)
- [Vue Composables](#vue-composables)
  - [useUrlManager (Vue)](#useurlmanager-vue)
  - [useCanonical (Vue)](#usecanonical-vue)
  - [useHreflang (Vue)](#usehreflang-vue)
  - [useI18n (Vue)](#usei18n-vue)
  - [useLocaleDetection (Vue)](#uselocaledetection-vue)
  - [useLocaleSwitcher (Vue)](#uselocaleswitcher-vue)
- [Features](#features)
- [Examples](#examples)

---

## Overview

The m-seo adapters provide framework-native integration for URL management and internationalization features. These hooks and composables:

- **Automatically manage SEO tags** (canonical, hreflang) in the document head
- **Integrate with bot detection** to skip unnecessary DOM updates for crawlers
- **Provide clean APIs** following React and Vue best practices
- **Handle cleanup** automatically on component unmount
- **Support reactivity** in Vue with computed and ref
- **Optimize performance** with React's useMemo and useCallback

---

## React Hooks

### useUrlManager

Creates a memoized UrlManager instance for generating SEO-friendly URLs.

**Signature:**

```typescript
useUrlManager(config: UrlConfig): UrlManager
```

**Parameters:**

- `config`: UrlConfig object
  - `baseUrl`: Base URL for the site
  - `trailingSlash?`: Add trailing slashes (default: false)
  - `forceLowerCase?`: Force URLs to lowercase (default: true)
  - `localePrefix?`: Locale prefix strategy ('path' | 'subdomain' | 'domain' | 'none')
  - `defaultLocale?`: Default locale code

**Returns:** UrlManager instance with methods:

- `createSlug(text, options?)`: Create URL-safe slugs
- `getCanonical(path, options?)`: Generate canonical URLs
- `generatePaginationUrls(basePath, current, total)`: Pagination URLs
- `addQueryParams(url, params)`: Add query parameters
- And more...

**Example:**

```tsx
function ProductPage({ productName }: { productName: string }) {
  const urlManager = useUrlManager({
    baseUrl: "https://example.com",
    trailingSlash: true,
    forceLowerCase: true,
  });

  const slug = urlManager.createSlug(productName, { removeDiacritics: true });
  const canonical = urlManager.getCanonical(`/products/${slug}`);

  return (
    <div>
      <h1>{productName}</h1>
      <p>Product URL: {canonical}</p>
    </div>
  );
}
```

---

### useCanonical

Generates a canonical URL and automatically adds the canonical link tag to the document head.

**Signature:**

```typescript
useCanonical(
  path: string,
  config: UrlConfig & { locale?: string }
): string
```

**Parameters:**

- `path`: URL path (e.g., '/products/shoes')
- `config`: UrlConfig with optional locale

**Returns:** Canonical URL as a string

**Features:**

- Automatically adds `<link rel="canonical" href="...">` to document.head
- Bot-aware: skips DOM updates for crawlers (they read from HTML directly)
- Removes the tag on component unmount
- Updates the tag when path or config changes

**Example:**

```tsx
function BlogPost({ slug }: { slug: string }) {
  const canonical = useCanonical(`/blog/${slug}`, {
    baseUrl: "https://blog.example.com",
    locale: "en",
  });

  return (
    <article>
      <h1>Blog Post</h1>
      {/* Canonical tag is automatically added to <head> */}
      <p>Canonical: {canonical}</p>
    </article>
  );
}
```

---

### useHreflang

Generates hreflang alternate URLs and automatically adds hreflang link tags to the document head.

**Signature:**

```typescript
useHreflang(
  path: string,
  baseUrl: string,
  options: {
    locales: string[];
    urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
    includeDefault?: boolean;
  }
): HreflangTag[]
```

**Parameters:**

- `path`: Current page path
- `baseUrl`: Base URL
- `options`:
  - `locales`: Array of locale codes (e.g., ['en', 'es', 'fr'])
  - `urlStrategy`: How to structure localized URLs (default: 'path')
  - `includeDefault`: Include x-default tag (default: false)

**Returns:** Array of HreflangTag objects:

```typescript
interface HreflangTag {
  hreflang: string; // Locale code or 'x-default'
  href: string; // Full URL
}
```

**Features:**

- Automatically adds `<link rel="alternate" hreflang="..." href="...">` tags
- Supports multiple URL strategies (path, subdomain, domain, query)
- Optional x-default for language fallback
- Removes tags on unmount
- Bot-aware

**Example:**

```tsx
function ProductPage({ productId }: { productId: string }) {
  const hreflangTags = useHreflang(
    `/products/${productId}`,
    "https://example.com",
    {
      locales: ["en", "es", "fr", "de"],
      urlStrategy: "path",
      includeDefault: true,
    }
  );

  return (
    <div>
      <h2>Available in {hreflangTags.length} languages</h2>
      {/* Hreflang tags are automatically added to <head> */}
      <ul>
        {hreflangTags.map((tag) => (
          <li key={tag.hreflang}>
            {tag.hreflang}: {tag.href}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

---

### useI18n

Provides full internationalization state management with React hooks.

**Signature:**

```typescript
useI18n(config: I18nConfig): {
  i18n: Internationalization;
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date, options?: DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency: string, options?: NumberFormatOptions) => string;
  formatRelativeTime: (date: Date) => string;
}
```

**Parameters:**

- `config`: I18nConfig object
  - `defaultLocale`: Default locale code
  - `supportedLocales`: Array of supported locale codes
  - `fallbackLocale?`: Fallback when translation missing
  - `detectLocale?`: Auto-detect from browser/URL
  - `urlStrategy?`: Locale URL strategy
  - `storageKey?`: LocalStorage key for persistence

**Returns:** Object with:

- `i18n`: Full Internationalization instance
- `locale`: Current locale (reactive state)
- `setLocale`: Function to change locale
- `t`: Translation function
- `formatDate`, `formatNumber`, `formatCurrency`, `formatRelativeTime`: Formatting utilities

**Example:**

```tsx
function WelcomePage() {
  const { t, locale, setLocale, formatCurrency, i18n } = useI18n({
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr"],
    fallbackLocale: "en",
  });

  useEffect(() => {
    i18n.loadTranslations("en", {
      welcome: { title: "Welcome", message: "Hello, {{name}}!" },
    });
    i18n.loadTranslations("es", {
      welcome: { title: "Bienvenido", message: "¡Hola, {{name}}!" },
    });
  }, [i18n]);

  return (
    <div>
      <h1>{t("welcome.title")}</h1>
      <p>{t("welcome.message", { name: "John" })}</p>
      <p>Price: {formatCurrency(99.99, "USD")}</p>

      <select value={locale} onChange={(e) => setLocale(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
      </select>
    </div>
  );
}
```

---

### useLocaleDetection

Automatically detects the user's preferred locale from URL, localStorage, cookies, or browser settings.

**Signature:**

```typescript
useLocaleDetection(config: I18nConfig): string
```

**Parameters:**

- `config`: I18nConfig (same as useI18n)

**Returns:** Detected locale code as a string

**Features:**

- Checks URL path, subdomain, domain, or query parameter
- Checks localStorage (persisted preference)
- Checks cookies
- Falls back to browser language (navigator.language)
- Sets the locale automatically on mount

**Example:**

```tsx
function App() {
  const locale = useLocaleDetection({
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr", "de", "ja"],
    detectLocale: true,
    urlStrategy: "path",
    storageKey: "user-locale",
  });

  return (
    <div>
      <h1>Welcome!</h1>
      <p>Detected locale: {locale}</p>
    </div>
  );
}
```

---

### useLocaleSwitcher

Provides data and functionality for building a language switcher UI.

**Signature:**

```typescript
useLocaleSwitcher(config: I18nConfig & { baseUrl: string }): {
  locales: Array<{
    code: string;
    name: string;
    nativeName: string;
    url: string;
    active: boolean;
  }>;
  currentLocale: string;
  switchLocale: (locale: string) => void;
}
```

**Parameters:**

- `config`: I18nConfig with additional `baseUrl` property

**Returns:** Object with:

- `locales`: Array of locale objects with URLs
- `currentLocale`: Current active locale
- `switchLocale`: Function to navigate to a different locale

**Example:**

```tsx
function LanguageSwitcher() {
  const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr", "de"],
    baseUrl: "https://example.com",
    urlStrategy: "path",
  });

  return (
    <div className="language-switcher">
      <h3>Choose Language</h3>

      {/* As a dropdown */}
      <select
        value={currentLocale}
        onChange={(e) => switchLocale(e.target.value)}
      >
        {locales.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.nativeName} {loc.active ? "✓" : ""}
          </option>
        ))}
      </select>

      {/* As links */}
      <div className="language-links">
        {locales.map((loc) => (
          <a
            key={loc.code}
            href={loc.url}
            className={loc.active ? "active" : ""}
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
```

---

## Vue Composables

All Vue composables support **reactive props** using Vue 3's `Ref<T>` and `computed()`. This means you can pass refs or computed values, and the composables will automatically react to changes.

### useUrlManager (Vue)

Creates a reactive UrlManager instance.

**Signature:**

```typescript
useUrlManager(config: UrlConfig | Ref<UrlConfig>): UrlManager
```

**Parameters:**

- `config`: UrlConfig or Ref<UrlConfig> (reactive)

**Returns:** Computed UrlManager instance

**Example:**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useUrlManager } from "m-seo/adapters/VueSPAAdapter";

const productName = ref("Premium Leather Shoes");

const urlManager = useUrlManager({
  baseUrl: "https://example.com",
  trailingSlash: true,
  forceLowerCase: true,
});

const slug = computed(() =>
  urlManager.createSlug(productName.value, { removeDiacritics: true })
);

const canonical = computed(() =>
  urlManager.getCanonical(`/products/${slug.value}`)
);
</script>

<template>
  <div>
    <h1>{{ productName }}</h1>
    <p>Product URL: {{ canonical }}</p>
    <p>Slug: {{ slug }}</p>
  </div>
</template>
```

---

### useCanonical (Vue)

Generates a reactive canonical URL and automatically manages the canonical link tag.

**Signature:**

```typescript
useCanonical(
  path: string | Ref<string>,
  config: UrlConfig & { locale?: string }
): Ref<string>
```

**Parameters:**

- `path`: URL path (can be reactive)
- `config`: UrlConfig with optional locale

**Returns:** Ref<string> - reactive canonical URL

**Features:**

- **Reactive**: Watches path changes and updates DOM
- Automatically adds/updates `<link rel="canonical">`
- Removes tag on unmount
- Bot-aware

**Example:**

```vue
<script setup lang="ts">
import { ref, computed } from "vue";
import { useUrlManager, useCanonical } from "m-seo/adapters/VueSPAAdapter";

const props = defineProps<{
  postTitle: string;
}>();

const urlManager = useUrlManager({
  baseUrl: "https://blog.example.com",
});

const slug = computed(() => urlManager.createSlug(props.postTitle));

// Canonical updates automatically when slug changes
const canonical = useCanonical(
  computed(() => `/blog/${slug.value}`),
  { baseUrl: "https://blog.example.com" }
);
</script>

<template>
  <article>
    <h1>{{ postTitle }}</h1>
    <p>Canonical: {{ canonical }}</p>
  </article>
</template>
```

---

### useHreflang (Vue)

Generates reactive hreflang tags and automatically manages them in the document head.

**Signature:**

```typescript
useHreflang(
  path: string | Ref<string>,
  baseUrl: string,
  options: {
    locales: string[];
    urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
    includeDefault?: boolean;
  }
): Ref<HreflangTag[]>
```

**Parameters:**

- `path`: Current page path (can be reactive)
- `baseUrl`: Base URL
- `options`: Same as React version

**Returns:** Ref<HreflangTag[]> - reactive array of hreflang tags

**Features:**

- **Reactive**: Watches path changes and updates DOM
- Automatically adds/updates hreflang tags
- Removes tags on unmount
- Bot-aware

**Example:**

```vue
<script setup lang="ts">
import { ref } from "vue";
import { useHreflang } from "m-seo/adapters/VueSPAAdapter";

const props = defineProps<{
  productId: string;
}>();

const hreflangTags = useHreflang(
  `/products/${props.productId}`,
  "https://example.com",
  {
    locales: ["en", "es", "fr", "de"],
    urlStrategy: "path",
    includeDefault: true,
  }
);
</script>

<template>
  <div>
    <h2>Available in {{ hreflangTags.length }} languages</h2>
    <ul>
      <li v-for="tag in hreflangTags" :key="tag.hreflang">
        {{ tag.hreflang }}: {{ tag.href }}
      </li>
    </ul>
  </div>
</template>
```

---

### useI18n (Vue)

Provides full internationalization with Vue 3 reactivity.

**Signature:**

```typescript
useI18n(config: I18nConfig | Ref<I18nConfig>): {
  i18n: Internationalization;
  locale: Ref<string>;
  setLocale: (locale: string) => void;
  t: (key: string, params?: Record<string, any>) => string;
  formatDate: (date: Date, options?: DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: NumberFormatOptions) => string;
  formatCurrency: (amount: number, currency: string, options?: NumberFormatOptions) => string;
  formatRelativeTime: (date: Date) => string;
}
```

**Parameters:**

- `config`: I18nConfig or Ref<I18nConfig>

**Returns:** Object with:

- `locale`: **Ref<string>** (reactive, can use v-model)
- Other properties same as React version

**Example:**

```vue
<script setup lang="ts">
import { onMounted } from "vue";
import { useI18n } from "m-seo/adapters/VueSPAAdapter";

const { t, locale, setLocale, formatCurrency, i18n } = useI18n({
  defaultLocale: "en",
  supportedLocales: ["en", "es", "fr"],
  fallbackLocale: "en",
});

onMounted(async () => {
  await i18n.loadTranslations("en", {
    welcome: { title: "Welcome", message: "Hello, {{name}}!" },
  });
  await i18n.loadTranslations("es", {
    welcome: { title: "Bienvenido", message: "¡Hola, {{name}}!" },
  });
});
</script>

<template>
  <div>
    <h1>{{ t("welcome.title") }}</h1>
    <p>{{ t("welcome.message", { name: "John" }) }}</p>
    <p>Price: {{ formatCurrency(99.99, "USD") }}</p>

    <!-- v-model works because locale is a Ref -->
    <select v-model="locale" @change="setLocale(locale)">
      <option value="en">English</option>
      <option value="es">Español</option>
      <option value="fr">Français</option>
    </select>
  </div>
</template>
```

---

### useLocaleDetection (Vue)

Automatically detects user's locale and returns it as a reactive ref.

**Signature:**

```typescript
useLocaleDetection(config: I18nConfig | Ref<I18nConfig>): Ref<string>
```

**Parameters:**

- `config`: I18nConfig or Ref<I18nConfig>

**Returns:** Ref<string> - detected locale

**Example:**

```vue
<script setup lang="ts">
import { useLocaleDetection } from "m-seo/adapters/VueSPAAdapter";

const locale = useLocaleDetection({
  defaultLocale: "en",
  supportedLocales: ["en", "es", "fr", "de"],
  detectLocale: true,
  urlStrategy: "path",
});
</script>

<template>
  <div>
    <h1>Welcome!</h1>
    <p>Detected locale: {{ locale }}</p>
  </div>
</template>
```

---

### useLocaleSwitcher (Vue)

Provides reactive language switcher data.

**Signature:**

```typescript
useLocaleSwitcher(config: I18nConfig & { baseUrl: string }): {
  locales: Ref<Array<LocaleInfo>>;
  currentLocale: Ref<string>;
  switchLocale: (locale: string) => void;
}
```

**Parameters:**

- `config`: I18nConfig with `baseUrl`

**Returns:** Object with reactive refs

**Example:**

```vue
<script setup lang="ts">
import { useLocaleSwitcher } from "m-seo/adapters/VueSPAAdapter";

const { locales, currentLocale, switchLocale } = useLocaleSwitcher({
  defaultLocale: "en",
  supportedLocales: ["en", "es", "fr", "de"],
  baseUrl: "https://example.com",
  urlStrategy: "path",
});
</script>

<template>
  <div class="language-switcher">
    <h3>Choose Language</h3>

    <!-- As a dropdown -->
    <select :value="currentLocale" @change="switchLocale($event.target.value)">
      <option v-for="loc in locales" :key="loc.code" :value="loc.code">
        {{ loc.nativeName }} {{ loc.active ? "✓" : "" }}
      </option>
    </select>

    <!-- As links -->
    <div class="language-links">
      <a
        v-for="loc in locales"
        :key="loc.code"
        :href="loc.url"
        :class="{ active: loc.active }"
        @click.prevent="switchLocale(loc.code)"
      >
        {{ loc.nativeName }}
      </a>
    </div>
  </div>
</template>
```

---

## Features

### ✅ Automatic SEO Tag Management

Both React hooks and Vue composables automatically add and remove SEO tags from the document head:

- **Canonical tags**: `<link rel="canonical" href="...">`
- **Hreflang tags**: `<link rel="alternate" hreflang="..." href="...">`

No manual DOM manipulation required!

### ✅ Bot Detection Integration

All DOM updates check `BotDetection.shouldRenderClientSide()` to skip unnecessary updates for search engine crawlers. Bots read the initial HTML, so client-side updates are redundant.

### ✅ Framework-Native Patterns

- **React**: Uses `useMemo`, `useCallback`, `useEffect` for optimization
- **Vue**: Uses `computed`, `ref`, `watch`, `onUnmounted` for reactivity

### ✅ Automatic Cleanup

All hooks and composables clean up after themselves:

- Remove DOM elements on unmount
- Clear watchers and effects
- Prevent memory leaks

### ✅ TypeScript Support

Full type safety with TypeScript interfaces and type inference.

### ✅ Performance Optimized

- React: Memoized instances, stable callbacks
- Vue: Computed values, efficient watchers

---

## Examples

See these files for complete working examples:

- **React**: `/examples/react-url-i18n-examples.tsx`

  - Basic URL Manager usage
  - Auto canonical tags
  - Multi-language products with hreflang
  - Full i18n integration
  - Auto locale detection
  - Language switcher component
  - E-commerce examples
  - Pagination with i18n
  - Number/date/currency formatting

- **Vue**: `/examples/vue-url-i18n-examples.vue`
  - All the same examples as React, but Vue-style
  - Demonstrates reactive props
  - Shows v-model integration
  - Includes styling examples

---

## Migration Guide

### From Manual URL Management

**Before:**

```tsx
function ProductPage({ productId }: { productId: string }) {
  const slug = productId.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const canonicalUrl = `https://example.com/products/${slug}`;

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "canonical";
    link.href = canonicalUrl;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [canonicalUrl]);

  return <div>...</div>;
}
```

**After:**

```tsx
function ProductPage({ productId }: { productId: string }) {
  const urlManager = useUrlManager({ baseUrl: "https://example.com" });
  const slug = urlManager.createSlug(productId);
  const canonical = useCanonical(`/products/${slug}`, {
    baseUrl: "https://example.com",
  });

  return <div>...</div>;
}
```

### From Manual i18n

**Before:**

```tsx
function WelcomePage() {
  const [locale, setLocale] = useState("en");
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    fetch(`/translations/${locale}.json`)
      .then((r) => r.json())
      .then(setTranslations);
  }, [locale]);

  const t = (key: string) => {
    return key.split(".").reduce((obj, k) => obj?.[k], translations) || key;
  };

  return <div>{t("welcome.title")}</div>;
}
```

**After:**

```tsx
function WelcomePage() {
  const { t, locale, setLocale, i18n } = useI18n({
    defaultLocale: "en",
    supportedLocales: ["en", "es", "fr"],
  });

  useEffect(() => {
    i18n.loadTranslations("en", { welcome: { title: "Welcome" } });
  }, [i18n]);

  return <div>{t("welcome.title")}</div>;
}
```

---

## Best Practices

1. **Use canonical and hreflang together** for multi-language sites
2. **Let the hooks manage DOM** - don't manually add/remove tags
3. **Load translations early** in component lifecycle
4. **Use locale detection** for better UX
5. **Provide a language switcher** for user preference
6. **Test with bot detection** to ensure SEO tags work correctly
7. **Use TypeScript** for type safety
8. **Cache UrlManager instances** at app level if possible

---

## Troubleshooting

### Tags not appearing in `<head>`

- Check if `BotDetection.isBot()` returns true (tags skip client-side rendering for bots)
- Verify the component is mounted
- Check browser console for errors

### Locale not persisting

- Set `storageKey` in i18n config
- Verify localStorage is available
- Check cookie settings if using cookies

### URLs not updating

- For Vue: Ensure you're passing reactive refs, not static values
- For React: Check dependency arrays in useEffect
- Verify config is updated correctly

### TypeScript errors

- Import types: `import type { UrlConfig, I18nConfig } from 'm-seo'`
- Ensure TypeScript version >= 4.7
- Check `tsconfig.json` includes `"moduleResolution": "node"`

---

## API Reference

Full API documentation:

- [URL Manager Guide](./URL_MANAGER_GUIDE.md)
- [Internationalization Guide](./INTERNATIONALIZATION_GUIDE.md)
- [React Guide](./REACT_GUIDE.md)
- [Vue Guide](./VUE_GUIDE.md)

---

## Support

For issues, questions, or feature requests:

1. Check the examples in `/examples/`
2. Read the full guides in `/docs/`
3. Search existing GitHub issues
4. Open a new issue with reproduction steps

---

**Happy coding! 🚀**
