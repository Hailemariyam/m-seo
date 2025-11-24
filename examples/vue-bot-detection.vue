<!--
  Vue Bot Detection Examples

  These examples demonstrate the useBotDetection() composable for
  advanced bot handling and optimization scenarios.

  ⚠️ IMPORTANT: This is a multi-example showcase file. Each example
  is indicated by comments like "Example X:" and "File: ComponentName.vue".
  In a real project, each example would be in its own separate .vue file.

  TypeScript may show errors because variables from one script block
  aren't available in other examples' templates - this is expected for
  a showcase file. Copy individual examples to separate files for use.

  INSTALLATION:
  npm install m-seo vue vue-router

  USAGE:
  Import and use these patterns in your Vue 3 application
-->

<script setup lang="ts">
import { useSeo, useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { onMounted } from "vue";

const {
  shouldRenderClientSide,
  isBot,
  botInfo,
  isSearchEngine,
  isSocialMedia,
  isAIBot,
  isSEOTool,
  getAnalyticsCategory,
  getBotSuspicionScore,
} = useBotDetection();

/**
 * Example 1: Basic Bot Detection
 * Show different content for bots vs. users
 */
</script>

<template>
  <div>
    <h1>Vue Bot Detection Examples</h1>
  </div>
</template>

<!-- Example 1: Basic Bot Aware Content -->
<script setup lang="ts">
// File: BotAwareContent.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";

const { isBot, botName, botType } = useBotDetection();
</script>

<template>
  <div v-if="isBot" class="bot-content">
    <h1>Bot-Optimized Content</h1>
    <p>Detected: {{ botName || "Unknown Bot" }}</p>
    <p>Type: {{ botType }}</p>
    <p>This is a simplified, SEO-friendly version of the page.</p>
  </div>

  <div v-else class="user-content">
    <h1>Interactive User Experience</h1>
    <ComplexInteractiveFeatures />
    <RichAnimations />
    <VideoPlayer />
  </div>
</template>

<!-- Example 2: Different Content by Bot Type -->
<script setup lang="ts">
// File: ProductPage.vue
import { useSeo, useBotDetection } from "m-seo/adapters/VueSPAAdapter";

const props = defineProps<{ product: Product }>();

const { isSearchEngine, isSocialMedia, isBot } = useBotDetection();

// Basic SEO for all visitors
useSeo({
  title: `${props.product.name} - $${props.product.price}`,
  description: props.product.description,
  ogImage: props.product.image,
});
</script>

<template>
  <!-- SEO-optimized for search engines -->
  <div v-if="isSearchEngine" class="seo-view">
    <h1>{{ product.name }}</h1>
    <p><strong>Price:</strong> ${{ product.price }}</p>
    <p>{{ product.description }}</p>
    <ul>
      <li v-for="(feature, i) in product.features" :key="i">
        {{ feature }}
      </li>
    </ul>
  </div>

  <!-- Rich preview for social media -->
  <div v-else-if="isSocialMedia" class="social-preview">
    <img :src="product.image" :alt="product.name" />
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <button>Buy Now - ${{ product.price }}</button>
  </div>

  <!-- Full interactive app for users -->
  <div v-else class="interactive-product">
    <ProductGallery :images="product.images" />
    <ProductDetails :product="product" />
    <ProductReviews />
    <RelatedProducts />
    <LiveChat />
  </div>
</template>

<!-- Example 3: Analytics Separation -->
<script setup lang="ts">
// File: AnalyticsPage.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { onMounted } from "vue";

const { getAnalyticsCategory, botInfo, isBot } = useBotDetection();

onMounted(() => {
  const category = getAnalyticsCategory();

  if (category === "user") {
    // Track real users
    window.gtag("event", "page_view", {
      visitor_type: "user",
      page_title: document.title,
    });
  } else {
    // Track bots separately
    window.gtag("event", "bot_visit", {
      visitor_type: "bot",
      bot_name: botInfo.name,
      bot_type: botInfo.type,
      bot_category: category,
      page_title: document.title,
    });
  }
});
</script>

<template>
  <div>
    <h1>Analytics Page</h1>
    <p v-if="isBot">Bot traffic tracked in separate category</p>
    <p v-else>User traffic tracked normally</p>
  </div>
</template>

<!-- Example 4: Block AI Scrapers -->
<script setup lang="ts">
// File: ProtectedContent.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";

const props = defineProps<{ content: { title: string; html: string } }>();
const { isAIBot, botName } = useBotDetection();
</script>

<template>
  <div v-if="isAIBot" class="blocked-content">
    <h1>Access Restricted</h1>
    <p>AI scraping is not permitted on this content.</p>
    <p>Detected: {{ botName }}</p>
    <p>If you're a legitimate service, please contact us for API access.</p>
  </div>

  <article v-else>
    <h1>{{ content.title }}</h1>
    <div v-html="content.html"></div>
  </article>
</template>

<!-- Example 5: Security Monitoring -->
<script setup lang="ts">
// File: SecurityMonitor.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { onMounted } from "vue";

const { getBotSuspicionScore, botInfo, isBot } = useBotDetection();

onMounted(() => {
  const score = getBotSuspicionScore();

  if (score > 80) {
    // High suspicion - log and alert
    console.warn("🚨 Suspicious bot activity detected", {
      score,
      botInfo,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    });

    // Send security alert
    fetch("/api/security/alert", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "suspicious_bot",
        score,
        details: botInfo,
        url: window.location.href,
      }),
    });
  } else if (isBot && score > 50) {
    // Medium suspicion - just log
    console.info("⚠️ Possible bot detected", { score, botInfo });
  }
});
</script>

<template>
  <!-- Silent security component -->
</template>

<!-- Example 6: Conditional Feature Loading -->
<script setup lang="ts">
// File: SmartFeatureLoader.vue
import { useSeo, useBotDetection } from "m-seo/adapters/VueSPAAdapter";

const { shouldRenderClientSide } = useBotDetection();

useSeo({
  title: "Feature-Rich Page",
  description: "Page with smart feature loading",
});
</script>

<template>
  <div>
    <h1>Smart Feature Loader</h1>

    <!-- Always render static content -->
    <StaticContent />

    <!-- Only load for real users -->
    <template v-if="shouldRenderClientSide">
      <VideoPlayer />
      <InteractiveChart />
      <RealtimeChat />
      <AnimatedComponents />
    </template>
  </div>
</template>

<!-- Example 7: A/B Testing Exclusion -->
<script setup lang="ts">
// File: ABTestPage.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { ref, onMounted } from "vue";

const { isBot } = useBotDetection();
const variant = ref("control");

onMounted(() => {
  if (!isBot) {
    // Only A/B test real users
    const testVariant = Math.random() > 0.5 ? "variant-a" : "variant-b";
    variant.value = testVariant;

    // Track experiment
    analytics.track("ab_test_view", {
      experiment: "homepage_redesign",
      variant: testVariant,
    });
  }
});
</script>

<template>
  <!-- Bots always see control version -->
  <ControlVersion v-if="isBot" />

  <!-- Users see test variants -->
  <VariantA v-else-if="variant === 'variant-a'" />
  <VariantB v-else />
</template>

<!-- Example 8: SEO Tool Optimization -->
<script setup lang="ts">
// File: SEOToolFriendlyPage.vue
import { useSeo, useBotDetection } from "m-seo/adapters/VueSPAAdapter";

const { isSEOTool, botName } = useBotDetection();

useSeo({
  title: "SEO-Optimized Page",
  description: "Page optimized for SEO tools and crawlers",
});
</script>

<template>
  <div>
    <h1>SEO-Optimized Content</h1>

    <!-- Regular content -->
    <MainContent />

    <!-- Extra metadata for SEO tools -->
    <div v-if="isSEOTool" style="display: none" data-seo-meta="true">
      <p>Tool detected: {{ botName }}</p>
      <p>Page type: Article</p>
      <p>Word count: 1250</p>
      <p>Reading time: 5 minutes</p>
      <p>Target keywords: SEO, optimization, tools</p>
    </div>
  </div>
</template>

<!-- Example 9: Rate Limiting -->
<script setup lang="ts">
// File: APIRequestComponent.vue
import { useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { computed, onMounted } from "vue";

const { isBot, isSEOTool, isSearchEngine } = useBotDetection();

const rateLimit = computed(() => {
  if (isSearchEngine) return 100; // High limit for search engines
  if (isSEOTool) return 50; // Medium for SEO tools
  if (isBot) return 10; // Low for other bots
  return 1000; // High for users
});

onMounted(() => {
  // Set rate limit header hint for API requests
  fetch("/api/data", {
    headers: {
      "X-Rate-Limit-Hint": rateLimit.value.toString(),
    },
// File: CompleteBotStrategy.vue
import { useSeo, useBotDetection } from "m-seo/adapters/VueSPAAdapter";
import { onMounted } from "vue";

onMounted(() => {
  // 1. Security check
  isSocialMedia,
  isAIBot,
  isSEOTool,
  getAnalyticsCategory,
  getBotSuspicionScore,
  shouldRenderClientSide,
} = useBotDetection();

onMounted(() => {
  // 1. Security check
  const suspicionScore = getBotSuspicionScore();
  if (suspicionScore > 80) {
    console.warn("High bot suspicion", { score: suspicionScore, botInfo });
  }

  // 2. Analytics tracking
  const category = getAnalyticsCategory();
  analytics.track("page_view", {
    visitor_type: category,
    is_bot: isBot,
    bot_details: isBot ? botInfo : null,
  });

  // 3. Log bot visits
  if (isBot) {
    console.log("Bot visit:", {
      name: botInfo.name,
      type: botInfo.type,
      purpose: botInfo.purpose,
    });
  }
});

// Basic SEO (always applied)
useSeo({
  title: "Complete Bot Strategy Example",
  description: "Demonstrating comprehensive bot handling",
});
</script>

<template>
  <!-- 4. Block AI scrapers -->
  <BlockedView v-if="isAIBot" />

  <!-- 5. Optimized content for search engines -->
  <SEOOptimizedView v-else-if="isSearchEngine" />

  <!-- 6. Rich preview for social media -->
  <SocialPreviewView v-else-if="isSocialMedia" />

  <!-- 7. Extra details for SEO tools -->
  <SEOToolView v-else-if="isSEOTool" />

  <!-- 8. Full experience for real users -->
  <div v-else>
    <FullUserExperience />
    <ClientSideFeatures v-if="shouldRenderClientSide" />
    <SecurityMonitor />
  </div>
</template>

<style scoped>
/* Add your styles here */
</style>
