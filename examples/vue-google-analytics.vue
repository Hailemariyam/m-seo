<!--
/**
 * Vue 3 Google Analytics Integration Examples
 *
 * This file demonstrates how to use the Google Analytics integration
 * in Vue 3 applications with the VueSPAAdapter.
 *
 * ⚠️ IMPORTANT NOTE:
 * This file contains 10 separate component examples for documentation purposes.
 * In a real Vue 3 application, each example would be in its own .vue file.
 * Vue does NOT support multiple <script setup> blocks in a single file.
 *
 * To use these examples:
 * 1. Copy the <script> and <template> sections you need
 * 2. Create a new .vue file (e.g., ProductPage.vue, Dashboard.vue)
 * 3. Paste the copied code into the new file
 * 4. Adjust imports and props as needed for your application
 */
-->

<!-- ============================================================================ -->
<!-- Example 1: Basic Setup with Auto Page View Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import {
  useGoogleAnalytics,
  usePageViewTracking,
} from "../src/adapters/VueSPAAdapter";
import { useRouter } from "vue-router";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
  anonymizeIp: true,
  debug: process.env.NODE_ENV === "development",
});

const router = useRouter();
usePageViewTracking(analytics, router);
</script>

<template>
  <div class="app">
    <h1>My App with Google Analytics</h1>
    <router-view />
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 2: E-commerce Product Page -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { onMounted } from "vue";
import {
  useGoogleAnalytics,
  useEventTracking,
  useTransactionTracking,
} from "../src/adapters/VueSPAAdapter";

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
}

const props = defineProps<{ product: Product }>();

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const trackEvent = useEventTracking(analytics);
const trackTransaction = useTransactionTracking(analytics);

// Track product view on mount
onMounted(() => {
  trackEvent("view_item", {
    category: "E-commerce",
    items: [
      {
        item_id: props.product.id,
        item_name: props.product.name,
        item_category: props.product.category,
        price: props.product.price,
        quantity: 1,
      },
    ],
  });
});

const handleAddToCart = () => {
  trackEvent("add_to_cart", {
    category: "E-commerce",
    value: props.product.price,
    currency: "USD",
    items: [
      {
        item_id: props.product.id,
        item_name: props.product.name,
        price: props.product.price,
        quantity: 1,
      },
    ],
  });

  console.log("Added to cart");
};

const handlePurchase = () => {
  trackTransaction({
    transaction_id: `ORDER-${Date.now()}`,
    value: props.product.price,
    currency: "USD",
    tax: props.product.price * 0.08,
    shipping: 9.99,
    items: [
      {
        item_id: props.product.id,
        item_name: props.product.name,
        item_category: props.product.category,
        price: props.product.price,
        quantity: 1,
      },
    ],
  });

  console.log("Purchase complete");
};
</script>

<template>
  <div class="product-page">
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
    <p class="price">${{ product.price }}</p>
    <button @click="handleAddToCart">Add to Cart</button>
    <button @click="handlePurchase">Buy Now</button>
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 3: SaaS Dashboard with User Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { watch } from "vue";
import {
  useGoogleAnalytics,
  useUserTracking,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

interface User {
  id: string;
  name: string;
  plan: string;
  subscription: string;
  totalSpent: number;
}

const props = defineProps<{ currentUser: User }>();

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
  enhancedMeasurement: {
    scrollTracking: true,
    outboundLinks: true,
    fileDownloads: true,
    siteSearch: false,
    videoEngagement: false,
  },
});

const setUser = useUserTracking(analytics);
const trackEvent = useEventTracking(analytics);

// Set user properties when user changes
watch(
  () => props.currentUser,
  (user) => {
    if (user) {
      setUser({
        user_id: user.id,
        user_type: user.plan,
        subscription_plan: user.subscription,
        lifetime_value: user.totalSpent,
      });
    }
  },
  { immediate: true }
);

const handleFeatureUse = (featureName: string) => {
  trackEvent("feature_use", {
    category: "Product",
    label: featureName,
    feature_name: featureName,
  });
};

const handleUpgrade = () => {
  trackEvent("upgrade_click", {
    category: "Conversion",
    label: "Pro Plan",
    current_plan: props.currentUser.plan,
  });
};
</script>

<template>
  <div class="dashboard">
    <h1>Welcome, {{ currentUser.name }}!</h1>
    <button @click="handleFeatureUse('analytics')">View Analytics</button>
    <button @click="handleFeatureUse('reports')">Generate Reports</button>
    <button @click="handleUpgrade">Upgrade to Pro</button>
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 4: Blog with SEO Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import {
  useGoogleAnalytics,
  useSEOTracking,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

interface BlogPost {
  id: string;
  title: string;
  content: string;
}

const props = defineProps<{ post: BlogPost }>();

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const trackSEO = useSEOTracking(analytics);
const trackEvent = useEventTracking(analytics);

onMounted(() => {
  // Track organic search landing
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  const source = params.get("source");

  if (query) {
    trackSEO({
      organic_source: source || "unknown",
      search_query: query,
    });
  }

  // Track time on page after 30 seconds
  const timer = setTimeout(() => {
    analytics.trackTimeOnPage();
  }, 30000);

  onUnmounted(() => clearTimeout(timer));
});

const handleShare = (platform: string) => {
  trackEvent("share", {
    category: "Social",
    label: platform,
    content_type: "article",
    content_title: props.post.title,
    share_platform: platform,
  });

  console.log(`Sharing to ${platform}`);
};

const handleNewsletterSignup = () => {
  trackEvent("newsletter_signup", {
    category: "Conversion",
    label: "Article Bottom",
    signup_location: "article_bottom",
  });
};
</script>

<template>
  <article class="blog-post">
    <h1>{{ post.title }}</h1>
    <div class="content" v-html="post.content" />

    <div class="social-share">
      <button @click="handleShare('twitter')">Share on Twitter</button>
      <button @click="handleShare('facebook')">Share on Facebook</button>
      <button @click="handleShare('linkedin')">Share on LinkedIn</button>
    </div>

    <div class="newsletter">
      <button @click="handleNewsletterSignup">Subscribe to Newsletter</button>
    </div>
  </article>
</template>

<!-- ============================================================================ -->
<!-- Example 5: Form with Conversion Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { ref } from "vue";
import {
  useGoogleAnalytics,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const trackEvent = useEventTracking(analytics);

const formData = ref({
  name: "",
  email: "",
  message: "",
});

const handleSubmit = async () => {
  // Track form submission
  trackEvent("form_submit", {
    category: "Conversion",
    label: "Contact Form",
    form_name: "contact",
    form_destination: "sales",
  });

  try {
    // Submit form...
    console.log("Form submitted:", formData.value);

    // Track successful submission
    trackEvent("form_success", {
      category: "Conversion",
      label: "Contact Form",
      form_name: "contact",
    });
  } catch (error) {
    // Track error
    analytics.trackError(error as Error, false);

    trackEvent("form_error", {
      category: "Error",
      label: "Contact Form",
      error_message: (error as Error).message,
    });
  }
};

const handleFieldFocus = (fieldName: string) => {
  trackEvent("form_field_focus", {
    category: "Engagement",
    label: fieldName,
    form_name: "contact",
    field_name: fieldName,
    non_interaction: true,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="contact-form">
    <h2>Contact Us</h2>

    <input
      v-model="formData.name"
      type="text"
      placeholder="Name"
      @focus="handleFieldFocus('name')"
    />

    <input
      v-model="formData.email"
      type="email"
      placeholder="Email"
      @focus="handleFieldFocus('email')"
    />

    <textarea
      v-model="formData.message"
      placeholder="Message"
      @focus="handleFieldFocus('message')"
    />

    <button type="submit">Send Message</button>
  </form>
</template>

<!-- ============================================================================ -->
<!-- Example 6: Video Player with Engagement Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { ref } from "vue";
import {
  useGoogleAnalytics,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

const props = defineProps<{
  videoUrl: string;
  videoTitle: string;
}>();

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const trackEvent = useEventTracking(analytics);

const tracked = ref({
  started: false,
  "25": false,
  "50": false,
  "75": false,
  "90": false,
  completed: false,
});

const handlePlay = () => {
  if (!tracked.value.started) {
    trackEvent("video_start", {
      category: "Video",
      label: props.videoTitle,
      video_title: props.videoTitle,
      video_url: props.videoUrl,
    });
    tracked.value.started = true;
  }
};

const handleProgress = (event: Event) => {
  const video = event.target as HTMLVideoElement;
  const percent = (video.currentTime / video.duration) * 100;

  const checkProgress = (threshold: number) => {
    const key = threshold.toString() as keyof typeof tracked.value;
    if (percent >= threshold && !tracked.value[key]) {
      trackEvent("video_progress", {
        category: "Video",
        label: props.videoTitle,
        value: threshold,
        video_percent: threshold,
        video_title: props.videoTitle,
      });
      tracked.value[key] = true;
    }
  };

  if (percent >= 25 && percent < 50) checkProgress(25);
  if (percent >= 50 && percent < 75) checkProgress(50);
  if (percent >= 75 && percent < 90) checkProgress(75);
  if (percent >= 90) checkProgress(90);
};

const handleComplete = () => {
  if (!tracked.value.completed) {
    trackEvent("video_complete", {
      category: "Video",
      label: props.videoTitle,
      video_title: props.videoTitle,
    });
    tracked.value.completed = true;
  }
};
</script>

<template>
  <div class="video-player">
    <h3>{{ videoTitle }}</h3>
    <video
      :src="videoUrl"
      controls
      @play="handlePlay"
      @timeupdate="handleProgress"
      @ended="handleComplete"
    />
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 7: Error Handling with Error Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { onErrorCaptured } from "vue";
import {
  useGoogleAnalytics,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const trackEvent = useEventTracking(analytics);

// Capture errors in this component and its children
onErrorCaptured((error, instance, info) => {
  // Track error
  analytics.trackError(error, true);

  trackEvent("vue_error", {
    category: "Error",
    label: error.message,
    error_message: error.message,
    error_stack: error.stack,
    component_name: instance?.$options.name,
    error_info: info,
  });

  // Return false to stop error propagation
  return false;
});
</script>

<template>
  <div class="app-with-error-tracking">
    <slot />
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 8: A/B Testing Component -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  useGoogleAnalytics,
  useEventTracking,
} from "../src/adapters/VueSPAAdapter";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
  customDimensions: {
    dimension1: "experiment_variant",
  },
});

const trackEvent = useEventTracking(analytics);

const variant = ref(Math.random() < 0.5 ? "A" : "B");

onMounted(() => {
  // Track variant assignment
  trackEvent("experiment_view", {
    category: "A/B Test",
    label: "Homepage CTA Test",
    experiment_variant: variant.value,
  });
});

const handleCTAClick = () => {
  trackEvent("conversion", {
    category: "A/B Test",
    label: "CTA Click",
    experiment_variant: variant.value,
  });

  console.log("CTA clicked - Variant:", variant.value);
};
</script>

<template>
  <div class="ab-test">
    <button v-if="variant === 'A'" @click="handleCTAClick" class="cta-a">
      Get Started Now
    </button>
    <button v-else @click="handleCTAClick" class="cta-b">
      Start Your Free Trial
    </button>
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 9: Search Component with Search Tracking -->
<!-- ============================================================================ -->

<script setup lang="ts">
import { ref } from "vue";
import { useGoogleAnalytics } from "../src/adapters/VueSPAAdapter";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
});

const query = ref("");
const results = ref<any[]>([]);

const handleSearch = async () => {
  // Perform search...
  const searchResults: any[] = []; // Your search logic

  results.value = searchResults;

  // Track search
  analytics.trackSearch(query.value, searchResults.length);
};

const handleResultClick = (result: any, position: number) => {
  analytics.event("search_result_click", {
    category: "Site Search",
    label: result.title,
    search_term: query.value,
    result_position: position,
    result_id: result.id,
  });
};
</script>

<template>
  <div class="search">
    <form @submit.prevent="handleSearch">
      <input v-model="query" type="search" placeholder="Search..." />
      <button type="submit">Search</button>
    </form>

    <div class="results">
      <div
        v-for="(result, index) in results"
        :key="result.id"
        @click="handleResultClick(result, index + 1)"
      >
        {{ result.title }}
      </div>
    </div>
  </div>
</template>

<!-- ============================================================================ -->
<!-- Example 10: Download Tracker -->
<!-- ============================================================================ -->
<!--
  NOTE: Due to Vue's limitation of one <script setup> per file, Example 10
  has been moved to a separate file: examples/DownloadTracker.vue

  See that file for a complete, working example of download tracking with
  both automatic (via enhancedMeasurement) and manual tracking.

  Key features shown in DownloadTracker.vue:
  - Automatic file download tracking via enhancedMeasurement.fileDownloads
  - Manual download tracking with analytics.trackDownload()
  - Custom download event handling
-->

<!-- For reference, here's the approach used in DownloadTracker.vue: -->

<script setup lang="ts">
import { useGoogleAnalytics } from "../src/adapters/VueSPAAdapter";

// Example code - see examples/DownloadTracker.vue for the complete working version
const analyticsExample = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
  enhancedMeasurement: {
    fileDownloads: true, // Enable automatic file download tracking
  },
});

// Manual tracking function (see DownloadTracker.vue for implementation)
// const handleManualDownload = (fileName: string, fileUrl: string) => {
//   analytics.trackDownload(fileName, fileUrl);
//   window.location.href = fileUrl;
// };
</script>

<template>
  <div class="downloads-example">
    <p>
      📁 Complete Download Tracker example available in:
      <code>examples/DownloadTracker.vue</code>
    </p>
    <p>
      Features automatic and manual download tracking with Google Analytics.
    </p>
  </div>
</template>
