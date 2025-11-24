<!--
/**
 * Download Tracker Component Example
 *
 * This example shows how to track file downloads with Google Analytics.
 * Both automatic tracking (via enhancedMeasurement) and manual tracking are demonstrated.
 */
-->

<script setup lang="ts">
import { useGoogleAnalytics } from "../src/adapters/VueSPAAdapter";

const analytics = useGoogleAnalytics({
  measurementId: "G-XXXXXXXXXX",
  filterBots: true,
  enhancedMeasurement: {
    scrollTracking: false,
    outboundLinks: false,
    siteSearch: false,
    videoEngagement: false,
    fileDownloads: true, // Enable automatic file download tracking
  },
});

// Manual download tracking for custom scenarios
const handleManualDownload = (fileName: string, fileUrl: string) => {
  analytics.trackDownload(fileName, fileUrl);

  // Trigger download
  window.location.href = fileUrl;
};
</script>

<template>
  <div class="downloads">
    <h2>Resources</h2>

    <!-- Automatic tracking (via enhancedMeasurement) -->
    <a href="/files/whitepaper.pdf" download>
      Download Whitepaper (Auto-tracked)
    </a>

    <!-- Manual tracking -->
    <button
      @click="
        handleManualDownload('product-guide.pdf', '/files/product-guide.pdf')
      "
    >
      Download Product Guide (Manual tracking)
    </button>
  </div>
</template>

<style scoped>
.downloads {
  padding: 20px;
}

button,
a {
  display: block;
  margin: 10px 0;
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  text-decoration: none;
  cursor: pointer;
}

button:hover,
a:hover {
  background: #0056b3;
}
</style>
