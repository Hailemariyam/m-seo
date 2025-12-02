# 📦 Import Path Clarification - M-SEO

## ❓ Why Different Import Paths?

You might notice different import patterns in the documentation vs the test applications. Here's why:

---

## ✅ For Production Apps (After `npm install m-seo`)

When you install M-SEO via npm and use it in your production application, **always use these import paths**:

### React

```javascript
import {
  useSeo,
  useStructuredData,
  useBotDetection,
} from "m-seo/adapters/ReactSPAAdapter";
import { MetaManager, StructuredData } from "m-seo";
```

### Vue

```javascript
import {
  useSeo,
  useStructuredData,
  useBreadcrumbs,
} from "m-seo/adapters/VueSPAAdapter";
import { MetaManager, StructuredData } from "m-seo";
```

### Next.js

```javascript
import { createNextAdapter } from "m-seo";
```

### Express

```javascript
import { MetaManager, BotDetection, StructuredData } from "m-seo";
```

### Vanilla JS

```javascript
import { MetaManager, StructuredData, BotDetection } from "m-seo";
```

---

## 🧪 Test Applications (Development/Demo)

The test applications (`test-app/`, `test-vue-app/`, etc.) use **inline code** instead of importing from the npm package because:

1. **Self-Contained Demos**: They work without needing to install the package
2. **Development Testing**: Used for testing the library during development
3. **Browser Compatibility**: Some demos run directly in the browser without a build step

### Example from test-app/app.jsx

```javascript
// Comment in test app
// IMPORT M-SEO (In production, use: import { useSeo } from 'm-seo/adapters/ReactSPAAdapter')
// For this test, we'll inline the adapter code

function useSeo(config, deps) {
  // ... inline implementation
}
```

---

## 📚 How The Package Exports Work

The `package.json` defines these exports:

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./adapters/*": {
      "types": "./dist/adapters/*.d.ts",
      "import": "./dist/adapters/*.js"
    }
  }
}
```

This means:

| Import Statement                   | Resolves To                          |
| ---------------------------------- | ------------------------------------ |
| `'m-seo'`                          | `./dist/index.js`                    |
| `'m-seo/adapters/ReactSPAAdapter'` | `./dist/adapters/ReactSPAAdapter.js` |
| `'m-seo/adapters/VueSPAAdapter'`   | `./dist/adapters/VueSPAAdapter.js`   |

---

## ✅ Verification

After installing m-seo, you can verify the import paths work:

```bash
# Install the package
npm install m-seo

# Check what's exported
node -e "import('m-seo').then(m => console.log(Object.keys(m)))"

# Check adapter exports
node -e "import('m-seo/adapters/ReactSPAAdapter').then(m => console.log(Object.keys(m)))"
```

---

## 🎯 Quick Reference

### ✅ DO (In Your Production App)

```javascript
// ✅ Import from package
import { useSeo } from "m-seo/adapters/ReactSPAAdapter";
import { MetaManager } from "m-seo";
```

### ❌ DON'T

```javascript
// ❌ Don't import from source files
import { useSeo } from "m-seo/src/adapters/ReactSPAAdapter";

// ❌ Don't import from dist (only in special cases)
import { useSeo } from "m-seo/dist/adapters/ReactSPAAdapter";

// ❌ Don't try to import non-existent paths
import { useSeo } from "m-seo/adapters";
```

---

## 🔍 Why This Matters

1. **TypeScript Support**: Correct imports ensure proper type checking
2. **Tree Shaking**: Modern bundlers can optimize with proper exports
3. **Future Compatibility**: Export paths are stable across versions
4. **IDE Autocomplete**: Better IntelliSense with correct imports

---

## 📖 Summary

- **Documentation examples** = Production-ready code (use these!)
- **Test applications** = Development/demo code (learn from these, but don't copy the imports)
- **Import from `'m-seo/adapters/[Adapter]'`** = Always correct for production

---

**Questions?** Check the [Getting Started Guide](./GETTING_STARTED.md) or open an issue on GitHub!
