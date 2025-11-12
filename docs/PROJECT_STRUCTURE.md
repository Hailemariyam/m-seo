# M-SEO - Project Structure

## Directory Overview

```
m-seo/
├── src/                    # Source code
│   ├── core/              # Framework-agnostic core (MAIN FOCUS)
│   │   ├── SeoEngine.ts             # Meta tags, Open Graph, Twitter cards
│   │   ├── SitemapGenerator.ts      # XML sitemap generation
│   │   ├── RobotsManager.ts         # robots.txt management
│   │   ├── StructuredDataManager.ts # Schema.org JSON-LD
│   │   ├── UrlManager.ts            # URL utilities (placeholder)
│   │   └── Internationalization.ts  # i18n support (placeholder)
│   │
│   ├── adapters/          # Framework-specific adapters (optional)
│   │   ├── ExpressAdapter.ts        # Express.js integration
│   │   ├── NextAdapter.ts           # Next.js integration
│   │   ├── ReactSPAAdapter.ts       # React SPA integration
│   │   ├── NuxtAdapter.ts           # Nuxt.js integration
│   │   ├── AngularAdapter.ts        # Angular integration
│   │   └── NestAdapter.ts           # NestJS integration
│   │
│   ├── analytics/         # SEO analytics (future)
│   │   ├── BotDetection.ts
│   │   ├── GoogleAnalytics.ts
│   │   ├── GoogleSearchConsole.ts
│   │   ├── SeoAuditEngine.ts
│   │   └── SeoReportGenerator.ts
│   │
│   ├── automation/        # SEO automation (future)
│   │   ├── AutoMetaTags.ts
│   │   ├── AutoSchema.ts
│   │   ├── DeployHooks.ts
│   │   ├── PullRequestSeoBot.ts
│   │   └── SeoLint.ts
│   │
│   ├── integrations/      # Third-party integrations (future)
│   │   ├── AIContentAnalysis.ts
│   │   ├── CMSPlugins.ts
│   │   ├── ImageOptimizer.ts
│   │   ├── SocialPreviewGenerator.ts
│   │   └── VideoSeo.ts
│   │
│   ├── middleware/        # HTTP middleware (future)
│   │   ├── CacheManager.ts
│   │   ├── GeoSeo.ts
│   │   ├── HeaderManager.ts
│   │   └── SecurityHeaders.ts
│   │
│   ├── service/           # Service layer (future)
│   │   ├── CliInterface.ts
│   │   ├── RestApiServer.ts
│   │   └── SdkLayer/
│   │       ├── DjangoSdk.py
│   │       ├── GoSdk.go
│   │       ├── LaravelSdk.php
│   │       └── RailsSdk.rb
│   │
│   ├── utils/             # Utilities (future)
│   │   ├── CacheUtils.ts
│   │   ├── Logger.ts
│   │   ├── Scheduler.ts
│   │   ├── TemplateEngine.ts
│   │   └── Validation.ts
│   │
│   └── index.ts           # Main entry point
│
├── examples/              # Usage examples
│   ├── vanilla-usage.ts   # Pure JS usage
│   ├── express-adapter.ts # Express.js example
│   ├── react-usage.tsx    # React example
│   └── test-vanilla.js    # Runnable test
│
├── docs/                  # Documentation
│   └── ARCHITECTURE.md    # Architecture guide
│
├── dist/                  # Compiled output (generated)
│   ├── core/              # Compiled core modules
│   ├── adapters/          # Compiled adapters
│   └── index.js           # Main entry
│
├── tests/                 # Unit tests (empty - future)
│
├── package.json           # NPM package config
├── tsconfig.json          # TypeScript config
└── README.md              # Main documentation
```

## Module Status

### ✅ Implemented

#### Core Modules (100% Framework-Agnostic)

- **SeoEngine** - Meta tags, Open Graph, Twitter cards generation
- **SitemapGenerator** - XML sitemap generation with multi-language support
- **RobotsManager** - robots.txt generation and management
- **StructuredDataManager** - Schema.org JSON-LD structured data

### 📝 Placeholder (Future Implementation)

- **adapters/** - Framework-specific integrations
- **analytics/** - SEO analytics and reporting
- **automation/** - Automated SEO tasks
- **integrations/** - Third-party service integrations
- **middleware/** - HTTP middleware for various frameworks
- **service/** - CLI, REST API, multi-language SDKs
- **utils/** - Helper utilities

## Development Workflow

### Building

```bash
npm run build        # Compile TypeScript to JavaScript
npm run dev          # Watch mode for development
npm run clean        # Remove dist folder
```

### Testing

```bash
node examples/test-vanilla.js  # Test the core library
```

### Project Philosophy

1. **Core First** - All essential SEO functionality in `/src/core/`
2. **Framework-Agnostic** - Core has zero framework dependencies
3. **Adapters Optional** - Thin wrappers for framework conveniences
4. **Extensible** - Easy to add new modules and integrations

## Entry Points

- **Main**: `dist/index.js` - Exports core modules
- **Core**: `dist/core/*.js` - Individual core modules
- **Adapters**: `dist/adapters/*.js` - Framework-specific adapters

## TypeScript Configuration

- **Module System**: ES2022 (native ESM)
- **Target**: ES2020
- **Output**: `dist/` with source maps and declaration files
- **Strict Mode**: Enabled
