# Framework-Agnostic Architecture Guide

## Why Framework-Agnostic?

Building a framework-agnostic library means creating a **core** that works **everywhere**, without being tied to any specific framework, runtime, or platform.

## Benefits

1. **Universal Compatibility** - Works with React, Vue, Angular, Express, Next.js, Svelte, vanilla JS, etc.
2. **Future-Proof** - If frameworks change or you switch frameworks, the SEO logic stays the same
3. **Lightweight** - No framework dependencies means smaller bundle size
4. **Testing** - Easier to test pure logic without framework setup
5. **Flexibility** - Users choose how to integrate it into their stack

## Architecture Principles

### ✅ DO: Core Layer

The core should be:

```typescript
// ✅ Pure TypeScript/JavaScript
// ✅ No framework dependencies
// ✅ Works in Node.js AND browsers
// ✅ Returns plain objects/strings

import { SeoEngine } from "m-seo";

const seo = new SeoEngine({ title: "Hello" });
const tags = seo.generateMetaTags(); // Returns plain array
const html = seo.toHtmlString(); // Returns plain string
```

### ✅ DO: Adapter Layer

Framework-specific adapters are thin wrappers:

```typescript
// adapters/ExpressAdapter.ts
import { SeoEngine } from "../core/SeoEngine.js";
import { Request, Response } from "express";

export class ExpressAdapter {
  static middleware(config) {
    return (req: Request, res: Response, next) => {
      const seo = new SeoEngine(config); // Use core
      res.locals.seo = seo.toHtmlString();
      next();
    };
  }
}
```

### ❌ DON'T: Framework Dependencies in Core

```typescript
// ❌ BAD - React dependency in core
import React from "react";

export class SeoEngine {
  render() {
    return <meta name="title" />; // Framework-specific
  }
}
```

```typescript
// ✅ GOOD - Framework-agnostic core
export class SeoEngine {
  generateMetaTags() {
    return [{ name: "title", content: "..." }]; // Plain objects
  }
}
```

## Implementation Pattern

### 1. Core Modules (Framework-Agnostic)

Located in `/src/core/`:

- Pure TypeScript
- No runtime dependencies
- Returns plain data structures (objects, arrays, strings)
- Works in any JavaScript environment

**Example:**

```typescript
// src/core/SeoEngine.ts
export class SeoEngine {
  generateMetaTags(): MetaTag[] {
    return [{ name: "title", content: this.config.title }];
  }
}
```

### 2. Adapters (Framework-Specific)

Located in `/src/adapters/`:

- Thin wrappers around core
- Framework-specific integrations
- Optional - users can use core directly

**Example:**

```typescript
// src/adapters/ReactAdapter.tsx
import { SeoEngine } from "../core/SeoEngine.js";

export function useSeo(config: SeoConfig) {
  const seo = new SeoEngine(config);

  useEffect(() => {
    // Apply meta tags using browser APIs
    const tags = seo.generateMetaTags();
    // ... DOM manipulation
  }, [config]);
}
```

### 3. Examples (Show Usage)

Located in `/examples/`:

- Demonstrate usage in different frameworks
- Help users understand integration patterns

## API Design for Framework-Agnosticism

### ✅ Good API Design

```typescript
// Returns data, not framework-specific components
class SitemapGenerator {
  toXml(): string {} // Plain string
  toJson(): object[] {} // Plain objects
}

class SeoEngine {
  generateMetaTags(): MetaTag[] {} // Plain objects
  toHtmlString(): string {} // Plain string
}
```

### ❌ Bad API Design

```typescript
// Framework-specific return types
class SeoEngine {
  render(): JSX.Element {} // React-specific
  getComponent(): Component {} // Vue-specific
  directive(): Directive {} // Angular-specific
}
```

## Testing

Framework-agnostic code is easier to test:

```typescript
// No framework setup needed
import { SeoEngine } from "./SeoEngine.js";

test("generates meta tags", () => {
  const seo = new SeoEngine({ title: "Test" });
  const tags = seo.generateMetaTags();
  expect(tags).toContainEqual({
    name: "title",
    content: "Test",
  });
});
```

## Real-World Usage

### Vanilla JS

```javascript
const seo = new SeoEngine({ title: "Hello" });
document.head.innerHTML += seo.toHtmlString();
```

### React

```jsx
function MyComponent() {
  const seo = new SeoEngine({ title: "Hello" });
  useEffect(() => {
    seo.generateMetaTags().forEach((tag) => {
      // Apply to DOM
    });
  }, []);
}
```

### Express

```javascript
app.get("/", (req, res) => {
  const seo = new SeoEngine({ title: "Hello" });
  res.send(`<head>${seo.toHtmlString()}</head>`);
});
```

### Next.js

```jsx
export async function generateMetadata() {
  const seo = new SeoEngine({ title: "Hello" });
  return {
    title: seo.getConfig().title,
    // ... use generated data
  };
}
```

## Key Takeaways

1. **Core = Pure JavaScript** - No framework dependencies
2. **Adapters = Thin wrappers** - Optional convenience layers
3. **Data over Components** - Return plain objects/strings
4. **Universal APIs** - Works in Node.js, browsers, edge runtimes
5. **User Choice** - Let users decide how to integrate

This approach ensures **m-seo** can be used anywhere JavaScript runs, without being locked into any specific framework or platform.
