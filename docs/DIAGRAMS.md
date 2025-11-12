# M-SEO: Framework-Agnostic Architecture Diagram

## How It Works

```
╔════════════════════════════════════════════════════════════════╗
║                    YOUR APPLICATION                             ║
║                                                                 ║
║  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      ║
║  │  React   │  │   Vue    │  │ Express  │  │ Vanilla  │      ║
║  │  App     │  │   App    │  │  Server  │  │    JS    │      ║
║  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘      ║
║       │             │              │             │             ║
║       └─────────────┴──────────────┴─────────────┘             ║
║                             │                                   ║
╚═════════════════════════════╪═══════════════════════════════════╝
                              │
                        import { ... }
                              │
                              ▼
╔════════════════════════════════════════════════════════════════╗
║                    M-SEO LIBRARY                                ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐    ║
║  │              CORE (Framework-Agnostic)                  │    ║
║  │                                                          │    ║
║  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │    ║
║  │  │  SeoEngine   │  │   Sitemap    │  │   Robots     │ │    ║
║  │  │              │  │  Generator   │  │   Manager    │ │    ║
║  │  │ • Meta tags  │  │              │  │              │ │    ║
║  │  │ • Open Graph │  │ • XML output │  │ • Rules      │ │    ║
║  │  │ • Twitter    │  │ • Multi-lang │  │ • Sitemaps   │ │    ║
║  │  └──────────────┘  └──────────────┘  └──────────────┘ │    ║
║  │                                                          │    ║
║  │  ┌──────────────────────────────────────────────────┐  │    ║
║  │  │       StructuredDataManager                       │  │    ║
║  │  │  • Website schema  • Article schema              │  │    ║
║  │  │  • Organization    • Breadcrumbs                 │  │    ║
║  │  │  • JSON-LD output                                │  │    ║
║  │  └──────────────────────────────────────────────────┘  │    ║
║  │                                                          │    ║
║  │  ✓ Pure TypeScript                                      │    ║
║  │  ✓ Zero dependencies                                    │    ║
║  │  ✓ Returns plain objects/strings                        │    ║
║  └────────────────────────────────────────────────────────┘    ║
║                                                                 ║
║  ┌────────────────────────────────────────────────────────┐    ║
║  │         ADAPTERS (Optional Framework Integration)       │    ║
║  │                                                          │    ║
║  │  Express │ Next.js │ Nuxt │ React │ Angular │ Nest     │    ║
║  │  (Thin wrappers around core functionality)             │    ║
║  └────────────────────────────────────────────────────────┘    ║
╚════════════════════════════════════════════════════════════════╝
                              │
                              ▼
╔════════════════════════════════════════════════════════════════╗
║                        OUTPUT                                   ║
║                                                                 ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        ║
║  │ HTML Tags    │  │ XML Sitemap  │  │ robots.txt   │        ║
║  │ <meta ...>   │  │ <url>...</url│  │ User-agent:* │        ║
║  │ <title>...   │  │ <loc>...</loc│  │ Allow: /     │        ║
║  └──────────────┘  └──────────────┘  └──────────────┘        ║
║                                                                 ║
║  ┌─────────────────────────────────────────────────────┐      ║
║  │ JSON-LD (Structured Data)                           │      ║
║  │ <script type="application/ld+json">                 │      ║
║  │ { "@context": "https://schema.org", ... }           │      ║
║  │ </script>                                            │      ║
║  └─────────────────────────────────────────────────────┘      ║
╚════════════════════════════════════════════════════════════════╝
```

## Data Flow Example

```
User Code (Any Framework)
        │
        │  const seo = new SeoEngine({ title: 'Hello' })
        ▼
    SeoEngine
        │
        │  seo.generateMetaTags()
        ▼
  Plain Objects
  [{ name: 'title', content: 'Hello' }, ...]
        │
        │  User chooses how to use:
        ├─► React: map to <meta> components
        ├─► Express: convert to HTML string
        ├─► Next.js: use in generateMetadata()
        └─► Vanilla: append to document.head
```

## Why This Architecture?

```
┌─────────────────────────────────────────────────────────┐
│ Traditional Approach (Framework-Specific)                │
│                                                          │
│  react-helmet → Only works with React                   │
│  vue-meta     → Only works with Vue                     │
│  next-seo     → Only works with Next.js                 │
│                                                          │
│  ❌ Can't reuse across frameworks                        │
│  ❌ Framework lock-in                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ M-SEO Approach (Framework-Agnostic)                     │
│                                                          │
│  m-seo → Works with ANY framework                       │
│       ├─► React                                          │
│       ├─► Vue                                            │
│       ├─► Angular                                        │
│       ├─► Express                                        │
│       ├─► Next.js                                        │
│       ├─► Nuxt                                           │
│       └─► Vanilla JS                                     │
│                                                          │
│  ✅ Reusable everywhere                                  │
│  ✅ No framework lock-in                                 │
│  ✅ Future-proof                                         │
└─────────────────────────────────────────────────────────┘
```

## Universal Compatibility Matrix

```
┌──────────────────┬──────┬──────┬──────┬──────┬──────┬──────┐
│ Environment      │ SSR  │ SSG  │ CSR  │ API  │ Edge │ CLI  │
├──────────────────┼──────┼──────┼──────┼──────┼──────┼──────┤
│ Node.js          │  ✅  │  ✅  │  N/A │  ✅  │  N/A │  ✅  │
│ Browser          │  N/A │  N/A │  ✅  │  N/A │  N/A │  N/A │
│ Deno             │  ✅  │  ✅  │  N/A │  ✅  │  ✅  │  ✅  │
│ Bun              │  ✅  │  ✅  │  N/A │  ✅  │  N/A │  ✅  │
│ Cloudflare Edge  │  ✅  │  N/A │  N/A │  ✅  │  ✅  │  N/A │
│ Vercel Edge      │  ✅  │  N/A │  N/A │  ✅  │  ✅  │  N/A │
└──────────────────┴──────┴──────┴──────┴──────┴──────┴──────┘

Legend:
  SSR = Server-Side Rendering
  SSG = Static Site Generation
  CSR = Client-Side Rendering
  API = REST API / Serverless
  Edge = Edge Runtime
  CLI = Command Line
```

## Key Principles

```
╔═══════════════════════════════════════════════════════╗
║  FRAMEWORK-AGNOSTIC DESIGN PRINCIPLES                 ║
╠═══════════════════════════════════════════════════════╣
║                                                        ║
║  1. No Framework Dependencies                         ║
║     → Pure TypeScript/JavaScript only                 ║
║                                                        ║
║  2. Plain Data Structures                             ║
║     → Return objects, arrays, strings                 ║
║     → NOT framework-specific components               ║
║                                                        ║
║  3. Environment Agnostic                              ║
║     → Works in Node.js AND browsers                   ║
║                                                        ║
║  4. Adapter Pattern                                   ║
║     → Core = framework-agnostic                       ║
║     → Adapters = thin framework wrappers              ║
║                                                        ║
║  5. User Control                                      ║
║     → Library provides data                           ║
║     → User decides how to use it                      ║
║                                                        ║
╚═══════════════════════════════════════════════════════╝
```
