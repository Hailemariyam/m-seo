# Vue Bot Detection Examples

This directory contains comprehensive examples of using the `useBotDetection()` composable from m-seo's Vue adapter.

## ⚠️ Important Note About TypeScript Errors

The file `vue-bot-detection.vue` is a **multi-example showcase file** containing 10+ different component examples in a single file. This is for documentation purposes only.

**TypeScript will show errors** in this file because:
- Multiple `<script setup>` blocks exist in one file
- Variables from one example aren't available in other examples' templates
- This is a limitation of Vue SFC structure (only one script block per file is valid)

**These errors are EXPECTED and do NOT indicate bugs in the m-seo library.**

## ✅ How to Use These Examples

### Option 1: Copy Individual Examples

Each example is clearly marked with comments like:

```vue
<!-- Example X: Description -->
<script setup lang="ts">
// File: ComponentName.vue
...
</script>

<template>
...
</template>
```

**Copy each example to its own separate `.vue` file** and use it in your project.

### Option 2: Check react-bot-detection.tsx

The React examples file (`react-bot-detection.tsx`) demonstrates the same patterns in a more TypeScript-friendly format since React supports multiple function components in one file.

## 📚 Available Examples

1. **Basic Bot Aware Content** - Show different content for bots vs. users
2. **Different Content by Bot Type** - Customize by search engine, social media, etc.
3. **Analytics Separation** - Track bots separately from users
4. **Block AI Scrapers** - Prevent AI bots from accessing content
5. **Security Monitoring** - Detect suspicious bot activity
6. **Conditional Feature Loading** - Skip expensive features for bots
7. **A/B Testing Exclusion** - Exclude bots from experiments
8. **SEO Tool Optimization** - Provide extra metadata for SEO tools
9. **Rate Limiting** - Adjust rate limits based on visitor type
10. **Complete Bot Strategy** - Comprehensive bot handling example

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install m-seo vue vue-router
```

### 2. Use in Your Component

Create a new file `MyComponent.vue`:

```vue
<script setup lang="ts">
import { useBotDetection } from 'm-seo/adapters/VueSPAAdapter';

const {
  isBot,
  isAIBot,
  isSearchEngine,
  isSocialMedia,
  isSEOTool,
  botName,
  botType,
  shouldRenderClientSide
} = useBotDetection();
</script>

<template>
  <div v-if="isBot">
    <h1>Bot-Optimized Content</h1>
    <p>Detected: {{ botName || 'Unknown Bot' }}</p>
  </div>
  
  <div v-else>
    <h1>Full User Experience</h1>
    <ComplexFeatures />
  </div>
</template>
```

## 🔧 Available Properties

The `useBotDetection()` composable returns:

```typescript
{
  isBot: boolean,              // Is this a bot?
  botInfo: BotInfo,            // Full bot information
  botType: string,             // Bot type (search, social, etc.)
  botName: string,             // Bot name (Googlebot, etc.)
  isSearchEngine: boolean,     // Is this a search engine?
  isSocialMedia: boolean,      // Is this social media?
  isSEOTool: boolean,          // Is this an SEO tool?
  isAIBot: boolean,            // Is this an AI scraper?
  shouldRenderClientSide: boolean,  // Should render client-side?
  getAnalyticsCategory: () => string,  // Get analytics category
  getBotSuspicionScore: () => number   // Get suspicion score (0-100)
}
```

## 📖 Full Documentation

For complete documentation, see:
- [Bot Detection Guide](../docs/BOT_DETECTION_COMPLETE.md)
- [Vue Adapter Guide](../docs/VUE_GUIDE.md)
- [Architecture Overview](../docs/ARCHITECTURE.md)

## ❓ Troubleshooting

### "Property 'isAIBot' does not exist"

This error appears in the multi-example showcase file only. If you see it in your own component:

1. Make sure you're destructuring from `useBotDetection()`:
   ```typescript
   const { isAIBot } = useBotDetection();
   ```

2. Check your import:
   ```typescript
   import { useBotDetection } from 'm-seo/adapters/VueSPAAdapter';
   ```

3. Restart your TypeScript server (VS Code: Cmd/Ctrl + Shift + P → "Restart TS Server")

### Still Having Issues?

The properties are definitely exported - check `src/adapters/VueSPAAdapter.ts` lines 600-610 to see the return object.

If you continue having issues in your own files (not the example file), please file an issue at: https://github.com/Hailemariyam/m-seo/issues

---

**Happy bot detection!** 🤖✨
