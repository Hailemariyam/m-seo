# Next.js Examples - TypeScript Errors Fixed ✅

## Issue Summary

The Next.js example files in `examples/nextjs/` had multiple TypeScript compilation errors:

1. **Import Path Errors**: Using `@/lib/seo` path alias that doesn't exist in standalone examples
2. **Type Safety Issues**: Missing type assertions when setting headers
3. **API Mismatches**: Passing arguments to methods that don't accept them
4. **Platform-specific Properties**: Using `request.geo` which only exists on Vercel Edge Runtime

## Files Fixed

### 1. `middleware-example.ts`

**Problems Fixed:**

- ❌ `import { seo } from '@/lib/seo'` - non-existent path alias
- ❌ `seo.generateMiddlewareHeaders(request)` - method takes no arguments
- ❌ `security.getHeaders('strict')` - method takes no arguments
- ❌ `response.headers.set(k, v)` - missing type assertion for `v`
- ❌ `request.geo?.country` - property doesn't exist in base NextRequest type

**Solutions Applied:**

```typescript
// ✅ Import from local setup file
import { advancedSeo as seo } from "./setup";

// ✅ Call without arguments
const headers = seo.generateMiddlewareHeaders();
const securityHeaders = security.getHeaders();

// ✅ Add type assertions for header values
Object.entries(headers).forEach(([k, v]) => response.headers.set(k, String(v)));

// ✅ Add TypeScript suppression with documentation
// @ts-expect-error - geo property is available on Vercel Edge Runtime
const country = (request.geo?.country as string | undefined) || "US";
```

### 2. `sitemap-robots-examples.ts`

**Problems Fixed:**

- ❌ `import { seo } from '@/lib/seo'` - non-existent path alias

**Solutions Applied:**

```typescript
// ✅ Import from local setup file
import { advancedSeo as seo } from "./setup";
```

## Changes Made

### middleware-example.ts

1. **Updated import statement** (line 14):

   ```diff
   - import { seo } from '@/lib/seo';
   + import { advancedSeo as seo } from './setup';
   ```

   Added documentation comment explaining this is for standalone examples.

2. **Fixed method calls** - Removed arguments:

   ```diff
   - const headers = seo.generateMiddlewareHeaders(request);
   + const headers = seo.generateMiddlewareHeaders();

   - const securityHeaders = security.getHeaders('strict');
   + const securityHeaders = security.getHeaders();
   ```

3. **Added type assertions** for all header.set() calls:

   ```diff
   - response.headers.set(k, v);
   + response.headers.set(k, String(v));
   ```

4. **Fixed geo property access** (line 93):
   ```diff
   - const country = request.geo?.country || 'US';
   + // @ts-expect-error - geo property is available on Vercel Edge Runtime
   + const country = (request.geo?.country as string | undefined) || 'US';
   ```
   Added comment explaining this is Vercel-specific.

### sitemap-robots-examples.ts

1. **Updated import statement** (line 11):
   ```diff
   - import { seo } from '@/lib/seo';
   + import { advancedSeo as seo } from './setup';
   ```
   Added documentation comment for clarity.

## TypeScript Verification

All files now compile without errors:

```bash
✅ examples/nextjs/setup.ts - No errors found
✅ examples/nextjs/middleware-example.ts - No errors found
✅ examples/nextjs/sitemap-robots-examples.ts - No errors found
✅ examples/nextjs/app-router-page.tsx - No errors found
✅ examples/nextjs/enterprise-example.ts - No errors found
```

## Usage Notes

### For Real Next.js Applications

In actual Next.js projects, create a `lib/seo.ts` file:

```typescript
// lib/seo.ts
import { createNextAdapter } from "m-seo";

export const seo = createNextAdapter({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://example.com",
  siteName: "My Site",
  // ... other options
});
```

Then import in your middleware:

```typescript
// middleware.ts
import { seo } from "@/lib/seo";
```

### For Standalone Examples

The example files now use relative imports from `./setup.ts` to work as standalone TypeScript files without requiring a full Next.js project structure.

## Platform-Specific Features

### Vercel Edge Runtime

The `request.geo` property is only available on Vercel's Edge Runtime:

```typescript
// Works on Vercel
const country = request.geo?.country;

// For other platforms (Cloudflare, AWS, etc.)
const country =
  request.headers.get("CF-IPCountry") || // Cloudflare
  request.headers.get("CloudFront-Viewer-Country") || // AWS
  "US";
```

## API Reference

### Methods Updated

All methods now correctly match the M-SEO API:

```typescript
// ✅ Correct - No parameters
seo.generateMiddlewareHeaders(): Record<string, string>
security.getHeaders(): Record<string, string>

// ❌ Incorrect - These were wrong in examples
seo.generateMiddlewareHeaders(request) // ❌ No parameter accepted
security.getHeaders('strict') // ❌ Preset set during initialization
```

## Files Modified

- `examples/nextjs/middleware-example.ts` - 8 fixes applied
- `examples/nextjs/sitemap-robots-examples.ts` - 1 fix applied

## Related Documentation

- **Next.js Guide**: [docs/NEXT_JS_GUIDE.md](../docs/NEXT_JS_GUIDE.md)
- **Middleware Guide**: [docs/MIDDLEWARE_GUIDE.md](../docs/MIDDLEWARE_GUIDE.md)
- **Test Application**: [test-nextjs-app/](../test-nextjs-app/)

---

**Status**: ✅ **COMPLETE** - All Next.js examples now TypeScript error-free
**Date**: December 2, 2025
**Files Fixed**: 2 of 5 (others already correct)
