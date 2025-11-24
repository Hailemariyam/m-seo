# Bot Detection Examples

This directory contains examples demonstrating the `useBotDetection()` hook/composable for advanced bot handling.

## 📁 Files

- **`react-bot-detection.tsx`** - React examples with `useBotDetection()` hook
- **`vue-bot-detection.vue`** - Vue examples with `useBotDetection()` composable (reference document)

## 🎯 Key Use Cases

### 1. **Show Different Content for Bots**

```tsx
const { isBot } = useBotDetection();

if (isBot) {
  return <BotOptimizedContent />;
}
return <InteractiveContent />;
```

### 2. **Separate Analytics Tracking**

```tsx
const { getAnalyticsCategory } = useBotDetection();
analytics.track("page_view", { category: getAnalyticsCategory() });
```

### 3. **Block AI Scrapers**

```tsx
const { isAIBot } = useBotDetection();

if (isAIBot) {
  return <AccessDenied />;
}
```

### 4. **Security Monitoring**

```tsx
const { getBotSuspicionScore } = useBotDetection();

if (getBotSuspicionScore() > 80) {
  console.warn("Suspicious bot detected");
}
```

### 5. **Conditional Feature Loading**

```tsx
const { shouldRenderClientSide } = useBotDetection();

{
  shouldRenderClientSide && <HeavyFeatures />;
}
```

## 📖 Documentation

- [Complete BotDetection API](../BOT_DETECTION_COMPLETE.md)
- [React/Vue Integration Guide](../ADAPTER_BOT_INTEGRATION.md)
- [React Adapter Guide](../docs/REACT_GUIDE.md)
- [Vue Adapter Guide](../docs/VUE_GUIDE.md)

## 💡 Note

**Existing examples work automatically!** The bot detection is already integrated into the adapters, so:

- `react-usage.tsx` - Already optimized (no changes needed)
- `vue-examples/` - Already optimized (no changes needed)
- `test-app/` - Already optimized (no changes needed)
- `test-vue-app/` - Already optimized (no changes needed)

These new examples show **advanced** use cases where you want explicit bot handling.
