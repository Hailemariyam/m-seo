# m-seo Documentation Website

This directory contains the documentation website for **m-seo**, built with [VitePress](https://vitepress.dev/).

## Quick Start

### Install VitePress

```bash
npm install -D vitepress
```

### Run Development Server

```bash
npx vitepress dev docs-site
```

The docs will be available at `http://localhost:5173`.

### Build for Production

```bash
npx vitepress build docs-site
```

The static site will be generated in `docs-site/.vitepress/dist`.

### Preview Production Build

```bash
npx vitepress preview docs-site
```

## Documentation Structure

```
docs-site/
├── .vitepress/
│   ├── config.ts          # VitePress configuration
│   ├── theme/
│   │   └── index.ts       # Custom theme (optional)
│   └── README.md          # VitePress setup guide
├── index.md               # Homepage
├── getting-started.md     # Installation & setup guide
├── api.md                 # Complete API reference
├── examples.md            # Real-world usage examples
├── faq.md                 # Frequently asked questions
├── project-structure.md   # Codebase architecture
└── README.md              # This file
```

## Features

- **Fast & Modern** - Built with Vite for instant hot module reloading
- **Markdown-Based** - Write docs in Markdown with Vue component support
- **Search** - Built-in search functionality
- **Responsive** - Mobile-friendly design
- **Dark Mode** - Automatic dark/light theme
- **Syntax Highlighting** - Code blocks with syntax highlighting

## Writing Documentation

### Markdown Syntax

VitePress supports GitHub Flavored Markdown plus additional features:

#### Code Blocks

```typescript
import { SeoEngine } from "m-seo";

const seo = new SeoEngine({
  title: "My Page",
  description: "Page description",
});
```

#### Code Groups

::: code-group

```bash [npm]
npm install m-seo
```

```bash [yarn]
yarn add m-seo
```

:::

#### Custom Containers

::: tip
This is a tip
:::

::: warning
This is a warning
:::

::: danger
This is a danger message
:::

#### Tables

| Feature | Status |
| ------- | ------ |
| React   | ✅     |
| Vue     | ✅     |
| Express | ✅     |

### Frontmatter

Add frontmatter to customize page metadata:

```yaml
---
title: Custom Page Title
description: Custom description
layout: home
---
```

## Customization

### Theme Configuration

Edit `.vitepress/config.ts` to customize:

- Navigation menu
- Sidebar
- Footer
- Social links
- Search
- Theme colors

### Custom Theme

Edit `.vitepress/theme/index.ts` to add custom components or styles.

## Deployment

### GitHub Pages

Add to your `package.json`:

```json
{
  "scripts": {
    "docs:build": "vitepress build docs-site",
    "docs:preview": "vitepress preview docs-site"
  }
}
```

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Docs

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run docs:build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs-site/.vitepress/dist
```

### Vercel

1. Import your GitHub repo to Vercel
2. Set build command: `npx vitepress build docs-site`
3. Set output directory: `docs-site/.vitepress/dist`

### Netlify

Add `netlify.toml`:

```toml
[build]
  command = "npx vitepress build docs-site"
  publish = "docs-site/.vitepress/dist"
```

## Links

- [VitePress Documentation](https://vitepress.dev/)
- [Markdown Guide](https://www.markdownguide.org/)
- [m-seo GitHub](https://github.com/Hailemariyam/m-seo)

---

**Built with ❤️ using VitePress**
