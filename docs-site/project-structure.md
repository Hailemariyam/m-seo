# Project Structure

Understanding the **m-seo** codebase architecture and organization.

## Directory Overview

```
m-seo/
├── src/                    # Source code (TypeScript)
│   ├── index.ts           # Main entry point
│   ├── core/              # Core framework-agnostic modules
│   ├── adapters/          # Framework-specific adapters
│   ├── analytics/         # Analytics and SEO tools
│   ├── automation/        # Automation utilities
│   ├── integrations/      # Third-party integrations
│   ├── middleware/        # Server middleware
│   ├── service/           # Service layer
│   └── utils/             # Utility functions
├── dist/                  # Compiled JavaScript (generated)
├── docs/                  # In-depth technical guides
├── docs-site/             # Documentation website
├── examples/              # Usage examples
├── test-app/              # Interactive test application
├── tests/                 # Test files
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # Main documentation
└── LICENSE                # MIT License
```

---

## Source Code Structure

### `/src` - Main Source Directory

The source code is organized into logical modules:

#### `index.ts` - Main Entry Point

The main entry point that exports all public APIs:

```typescript
// Core exports
export { SeoEngine, createSEO } from "./core/SeoEngine";
export { SitemapGenerator } from "./core/SitemapGenerator";
export { RobotsManager } from "./core/RobotsManager";
export { StructuredDataManager } from "./core/StructuredDataManager";

// Utils
export { UrlManager } from "./core/UrlManager";
export { Internationalization } from "./core/Internationalization";

// Types
export type { SeoConfig, MetaTag, LinkTag } from "./types";
```

---

### `/src/core` - Framework-Agnostic Core

The heart of m-seo - pure TypeScript with zero framework dependencies.

#### **SeoEngine.ts**

Universal SEO tag generator. Works everywhere.

```typescript
class SeoEngine {
  constructor(config: SeoConfig);
  generateMetaTags(): MetaTag[];
  generateLinkTags(): LinkTag[];
  toHtmlString(): string;
  updateConfig(newConfig: Partial<SeoConfig>): void;
  getConfig(): SeoConfig;
  static setDefaults(defaults: Partial<SeoConfig>): void;
}
```

**Responsibilities:**

- Generate meta tags (description, keywords, author, etc.)
- Generate Open Graph tags
- Generate Twitter Card tags
- Generate link tags (canonical, alternate)
- Output as HTML strings or objects

**Example:**

```typescript
const seo = new SeoEngine({
  title: "My Page",
  description: "Page description",
  ogImage: "https://example.com/og.jpg",
});

const html = seo.toHtmlString();
```

---

#### **SitemapGenerator.ts**

XML sitemap generation.

```typescript
class SitemapGenerator {
  constructor(options?: SitemapOptions);
  addUrl(url: SitemapUrl): void;
  toXml(): string;
  toJson(): SitemapUrl[];
  clear(): void;
}
```

**Responsibilities:**

- Add URLs with metadata (lastmod, changefreq, priority)
- Support multi-language alternate URLs
- Generate XML sitemap format
- Export as JSON for APIs

**Example:**

```typescript
const sitemap = new SitemapGenerator({
  hostname: "https://example.com",
});

sitemap.addUrl({ loc: "/", priority: 1.0 });
const xml = sitemap.toXml();
```

---

#### **RobotsManager.ts**

Robots.txt generation and management.

```typescript
class RobotsManager {
  addRule(rule: RobotRule): void;
  allowAll(): RobotsManager;
  disallowAll(): RobotsManager;
  setSitemap(url: string): RobotsManager;
  setHost(host: string): RobotsManager;
  toString(): string;
}
```

**Responsibilities:**

- Define crawl rules for bots
- Block/allow specific paths
- Set sitemap URL
- Set preferred host
- Generate robots.txt content

**Example:**

```typescript
const robots = new RobotsManager();
robots.allowAll();
robots.setSitemap("https://example.com/sitemap.xml");
console.log(robots.toString());
```

---

#### **StructuredDataManager.ts**

Schema.org JSON-LD structured data.

```typescript
class StructuredDataManager {
  addSchema(schema: object): void;
  addWebsite(data: WebsiteSchema): void;
  addOrganization(data: OrganizationSchema): void;
  addArticle(data: ArticleSchema): void;
  addBreadcrumb(items: BreadcrumbItem[]): void;
  toHtmlScript(): string;
  toJson(): object[];
  clear(): void;
}
```

**Responsibilities:**

- Manage JSON-LD schemas
- Provide helpers for common schemas
- Output as HTML `<script>` tags
- Export as JSON

**Example:**

```typescript
const sd = new StructuredDataManager();
sd.addOrganization({
  name: "My Company",
  url: "https://example.com",
  logo: "https://example.com/logo.png",
});

const script = sd.toHtmlScript();
```

---

#### **UrlManager.ts**

URL manipulation and validation.

```typescript
class UrlManager {
  static normalize(url: string): string;
  static isValid(url: string): boolean;
  static join(...parts: string[]): string;
  static getAbsolute(relative: string, base: string): string;
}
```

---

#### **Internationalization.ts**

Multi-language support utilities.

```typescript
class Internationalization {
  static getHreflangTags(alternates: AlternateUrl[]): LinkTag[];
  static getLocaleMetaTags(locale: string): MetaTag[];
}
```

---

### `/src/adapters` - Framework-Specific Adapters

Adapters provide framework-specific APIs while using the core underneath.

#### **ReactSPAAdapter.ts**

React hooks and components for SPAs.

**Exports:**

```typescript
// Hooks
function useSeo(config: SeoConfig): void
function useStructuredData(schema: object): void
function useBreadcrumbs(items: BreadcrumbItem[]): void

// Components
function SeoHead(props: SeoConfig): JSX.Element
function JsonLd(props: { data: object }): JSX.Element

// HOC
function withSeo(Component, seoConfig): Component

// Class
class ReactSPAAdapter { ... }
```

**Example:**

```jsx
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";

function HomePage() {
  useSeo({ title: "Home", description: "Welcome" });
  return <h1>Home</h1>;
}
```

---

#### **ExpressAdapter.ts**

Express.js middleware and helpers.

**Exports:**

```typescript
function ExpressAdapter(options: ExpressAdapterOptions): Middleware;

class ExpressAdapter {
  constructor(options?: ExpressAdapterOptions);
  middleware(): Middleware;
  renderSeo(config: SeoConfig): string;
}
```

**Example:**

```javascript
const express = require("express");
const { ExpressAdapter } = require("m-seo/adapters/ExpressAdapter");

const app = express();
app.use(ExpressAdapter({ defaults: { siteName: "My Site" } }));
```

---

#### Other Adapters

- **NextAdapter.ts** - Next.js helpers (planned)
- **NuxtAdapter.ts** - Nuxt.js helpers (planned)
- **AngularAdapter.ts** - Angular services (planned)
- **NestAdapter.ts** - NestJS decorators (planned)

---

### `/src/analytics` - Analytics & SEO Tools

#### **GoogleAnalytics.ts**

Google Analytics integration.

#### **GoogleSearchConsole.ts**

Google Search Console API wrapper.

#### **SeoAuditEngine.ts**

SEO audit and analysis.

#### **SeoReportGenerator.ts**

Generate SEO reports.

#### **BotDetection.ts**

Detect search engine bots.

---

### `/src/automation` - Automation Utilities

#### **AutoMetaTags.ts**

Automatically generate meta tags from content.

#### **AutoSchema.ts**

Automatically generate schema.org data.

#### **SeoLint.ts**

Lint SEO configurations.

#### **DeployHooks.ts**

Deployment automation.

#### **PullRequestSeoBot.ts**

GitHub PR bot for SEO checks.

---

### `/src/integrations` - Third-Party Integrations

#### **ImageOptimizer.ts**

Image optimization for OG images.

#### **SocialPreviewGenerator.ts**

Generate social media preview cards.

#### **AIContentAnalysis.ts**

AI-powered content analysis.

#### **CMSPlugins.ts**

CMS integrations (WordPress, Contentful, etc.)

#### **VideoSeo.ts**

Video SEO utilities.

---

### `/src/middleware` - Server Middleware

#### **CacheManager.ts**

Cache SEO data.

#### **HeaderManager.ts**

HTTP header management.

#### **SecurityHeaders.ts**

Security headers (CSP, HSTS, etc.)

#### **GeoSeo.ts**

Geo-targeted SEO.

---

### `/src/utils` - Utility Functions

#### **Logger.ts**

Logging utilities.

#### **Validation.ts**

Input validation.

#### **TemplateEngine.ts**

Template rendering.

#### **CacheUtils.ts**

Caching helpers.

#### **Scheduler.ts**

Task scheduling.

---

## Built Output Structure

### `/dist` - Compiled Code

After running `npm run build`, TypeScript compiles to JavaScript:

```
dist/
├── index.js                # Main entry point
├── index.d.ts              # Type definitions
├── core/
│   ├── SeoEngine.js
│   ├── SeoEngine.d.ts
│   ├── SitemapGenerator.js
│   ├── SitemapGenerator.d.ts
│   └── ...
├── adapters/
│   ├── ReactSPAAdapter.js
│   ├── ReactSPAAdapter.d.ts
│   └── ...
└── ...
```

**Module Format:**

- **ESM (ES Modules)** - `import/export` syntax
- Tree-shakable for optimal bundle size

---

## Documentation Structure

### `/docs` - Technical Guides

In-depth technical documentation:

- `ARCHITECTURE.md` - System architecture
- `PROJECT_STRUCTURE.md` - Codebase organization
- `REACT_GUIDE.md` - React usage guide
- `SERVER_OPTIONS.md` - Server deployment options
- `QUICK_REFERENCE.md` - Quick reference card

### `/docs-site` - Documentation Website

User-facing documentation (VitePress):

- `index.md` - Homepage
- `getting-started.md` - Installation & setup
- `api.md` - API reference
- `examples.md` - Usage examples
- `faq.md` - FAQ
- `.vitepress/config.ts` - VitePress configuration

---

## Examples & Testing

### `/examples` - Usage Examples

Real-world usage examples:

- `react-usage.tsx` - React examples
- `express-adapter.ts` - Express examples
- `vanilla-usage.ts` - Vanilla JS examples
- `test-vanilla.js` - Test script

### `/test-app` - Interactive Test App

Live React test application:

- `index.html` - HTML template
- `app.jsx` - React test app with 4 pages
- Features: Live SEO inspector, multiple examples

**Run:** `npm run test:react`

### `/tests` - Test Files

Unit and integration tests (planned).

---

## Configuration Files

### `package.json`

Package configuration and scripts:

```json
{
  "name": "m-seo",
  "version": "1.0.1",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": "./dist/index.js",
    "./adapters/*": "./dist/adapters/*.js"
  },
  "scripts": {
    "build": "tsc",
    "test:react": "npx serve test-app -p 3000"
  }
}
```

### `tsconfig.json`

TypeScript compiler configuration:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Development Workflow

### Build Process

```bash
# Compile TypeScript to JavaScript
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev

# Clean build
npm run clean && npm run build
```

### Testing

```bash
# Run React test app
npm run test:react

# Run vanilla JS tests
npm test
```

### Publishing

```bash
# Build and publish to npm
npm run build
npm publish
```

---

## Architecture Principles

### 1. Framework-Agnostic Core

The core modules have **zero framework dependencies**:

```typescript
// ✅ Core - no dependencies
import { SeoEngine } from "m-seo";

// ✅ Framework adapter - uses core
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";
```

### 2. Tree-Shakable Exports

Users only bundle what they use:

```typescript
// Only imports SeoEngine code
import { SeoEngine } from "m-seo";

// Doesn't bundle sitemap/robots code
```

### 3. Type-Safe

Full TypeScript support with strict types:

```typescript
const seo = new SeoEngine({
  title: "Home", // ✅ Required
  description: "Welcome", // ✅ Required
  ogImage: "https://...", // ✅ Optional, but typed
});
```

### 4. Modular Design

Each module has a single responsibility:

- `SeoEngine` → Meta tags
- `SitemapGenerator` → Sitemaps
- `RobotsManager` → robots.txt
- `StructuredDataManager` → JSON-LD

---

## Next Steps

- **[Getting Started](getting-started.md)** - Start using m-seo
- **[API Reference](api.md)** - Explore the full API
- **[Examples](examples.md)** - See real-world usage
- **[FAQ](faq.md)** - Common questions

---

**Want to contribute?** See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.
