# Google Search Console Integration Guide

Complete guide for integrating Google Search Console API with the m-seo package.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Authentication](#authentication)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The Google Search Console integration provides a comprehensive interface for monitoring and improving your site's search performance. It enables you to:

- **Monitor search performance** - Track clicks, impressions, CTR, and rankings
- **Analyze search queries** - Discover what users search for to find your site
- **Inspect URLs** - Check indexing status and identify issues
- **Manage sitemaps** - Submit and monitor sitemap processing
- **Request indexing** - Speed up content discovery (limited use cases)
- **Compare periods** - Track performance changes over time

## Features

### ✅ Search Analytics

- Get search performance data (clicks, impressions, CTR, position)
- Filter by query, page, country, device, search appearance
- Group data by multiple dimensions
- Compare different time periods
- Export top performing queries and pages

### ✅ URL Inspection

- Check if URLs are indexed by Google
- View canonical URL selection
- Identify crawling and indexing issues
- Check mobile usability
- Detect rich results (structured data)

### ✅ Sitemap Management

- List all submitted sitemaps
- View sitemap processing status
- Submit new sitemaps
- Delete outdated sitemaps
- Monitor indexing progress

### ✅ Performance Tracking

- Get overall performance summaries
- Track by device type (desktop, mobile, tablet)
- Analyze by country
- Monitor CTR and position changes
- Compare current vs. previous periods

## Installation

```bash
npm install m-seo
```

The Google Search Console module is included in the main package.

## Authentication

Google Search Console API requires OAuth2 authentication. You'll need to:

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google Search Console API**

### 2. Set up OAuth2 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Configure the consent screen
4. Create credentials for **Web application** or **Desktop app**
5. Note your **Client ID** and **Client Secret**

### 3. Get an Access Token

You can use the [OAuth2 Playground](https://developers.google.com/oauthplayground/) to get tokens:

1. Go to OAuth2 Playground
2. Click settings (⚙️) and use your own OAuth credentials
3. Select **Search Console API v1** scopes:
   - `https://www.googleapis.com/auth/webmasters`
   - `https://www.googleapis.com/auth/webmasters.readonly`
4. Authorize and exchange authorization code for tokens

### 4. Verify Site Ownership

Make sure your site is verified in [Google Search Console](https://search.google.com/search-console):

1. Add your property (domain or URL prefix)
2. Complete verification (HTML file, DNS, Google Analytics, etc.)
3. Wait for data to accumulate (can take 24-48 hours)

## Quick Start

### Basic Setup

```typescript
import { createGoogleSearchConsole } from "m-seo";

const gsc = createGoogleSearchConsole({
  siteUrl: "https://example.com",
  credentials: {
    accessToken: "YOUR_OAUTH2_ACCESS_TOKEN",
  },
  debug: true, // Enable logging
});
```

### Get Search Performance

```typescript
// Get last 30 days of data
const { startDate, endDate } = getLastNDays(30);

const summary = await gsc.getPerformanceSummary(startDate, endDate);

console.log("Total Clicks:", summary.totalClicks);
console.log("Total Impressions:", summary.totalImpressions);
console.log("Average CTR:", (summary.averageCtr * 100).toFixed(2) + "%");
console.log("Average Position:", summary.averagePosition.toFixed(1));
```

### Get Top Queries

```typescript
const topQueries = await gsc.getTopQueries(startDate, endDate, 10);

topQueries.forEach((query, index) => {
  console.log(`${index + 1}. "${query.query}"`);
  console.log(`   Clicks: ${query.clicks}, Impressions: ${query.impressions}`);
  console.log(
    `   CTR: ${(query.ctr * 100).toFixed(
      2
    )}%, Position: ${query.position.toFixed(1)}`
  );
});
```

### Inspect a URL

```typescript
const result = await gsc.inspectUrl("https://example.com/important-page");

console.log("Indexed:", result.isIndexed);
console.log("Status:", result.indexStatus);
console.log("Canonical URL:", result.googleCanonicalUrl);

if (result.indexingIssues && result.indexingIssues.length > 0) {
  console.log("Issues:", result.indexingIssues);
}
```

### Submit a Sitemap

```typescript
await gsc.submitSitemap("https://example.com/sitemap.xml");

// Check submission status
const sitemap = await gsc.getSitemap("https://example.com/sitemap.xml");
console.log("URLs Submitted:", sitemap.urlsSubmitted);
console.log("URLs Indexed:", sitemap.urlsIndexed);
```

## API Reference

### Constructor

```typescript
new GoogleSearchConsole(config: GSCConfig)
```

**Config Options:**

- `siteUrl` (string) - Your verified site URL
- `credentials` (GSCCredentials) - OAuth2 or API key credentials
- `defaultDateRange` (number) - Default days for queries (default: 30)
- `debug` (boolean) - Enable debug logging (default: false)
- `apiEndpoint` (string) - API endpoint override (for testing)

### Search Analytics Methods

#### getSearchAnalytics(query)

Get raw search analytics data with full control over parameters.

```typescript
const data = await gsc.getSearchAnalytics({
  startDate: "2024-01-01",
  endDate: "2024-01-31",
  dimensions: ["query", "page"],
  rowLimit: 1000,
  startRow: 0,
});
```

**Parameters:**

- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `dimensions` - Array of dimensions to group by
- `dimensionFilterGroups` - Filters to apply
- `searchType` - Type: 'web', 'image', 'video', 'news'
- `aggregationType` - Aggregation: 'auto', 'byPage', 'byProperty'
- `rowLimit` - Max rows (default: 1000)
- `startRow` - Start index (for pagination)

#### getPerformanceSummary(startDate, endDate)

Get aggregated performance metrics.

```typescript
const summary = await gsc.getPerformanceSummary("2024-01-01", "2024-01-31");
```

**Returns:**

```typescript
{
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  period: {
    startDate: string;
    endDate: string;
  }
}
```

#### getTopQueries(startDate, endDate, limit)

Get top performing search queries.

```typescript
const queries = await gsc.getTopQueries("2024-01-01", "2024-01-31", 20);
```

#### getTopPages(startDate, endDate, limit)

Get top performing pages.

```typescript
const pages = await gsc.getTopPages("2024-01-01", "2024-01-31", 20);
```

#### getPerformanceByDevice(startDate, endDate)

Get performance grouped by device type.

```typescript
const deviceData = await gsc.getPerformanceByDevice("2024-01-01", "2024-01-31");

const mobileData = deviceData.get("MOBILE");
console.log("Mobile clicks:", mobileData?.clicks);
```

#### getPerformanceByCountry(startDate, endDate, limit)

Get performance grouped by country.

```typescript
const countryData = await gsc.getPerformanceByCountry(
  "2024-01-01",
  "2024-01-31",
  20
);

countryData.forEach(({ country, data }) => {
  console.log(`${country}: ${data.clicks} clicks`);
});
```

#### comparePerformance(currentStart, currentEnd, previousStart, previousEnd)

Compare performance between two periods.

```typescript
const comparison = await gsc.comparePerformance(
  "2024-02-01",
  "2024-02-29",
  "2024-01-01",
  "2024-01-31"
);

console.log("Click change:", comparison.changes.clicks.percentage + "%");
```

### URL Inspection Methods

#### inspectUrl(url)

Inspect a specific URL.

```typescript
const result = await gsc.inspectUrl("https://example.com/page");
```

**Returns:**

```typescript
{
  inspectionUrl: string;
  indexStatus: InspectionStatus;
  isIndexed: boolean;
  lastCrawlTime?: string;
  discoveryTime?: string;
  canonicalUrl?: string;
  userCanonicalUrl?: string;
  googleCanonicalUrl?: string;
  crawlIssues?: string[];
  indexingIssues?: string[];
  mobileUsabilityIssues?: string[];
  richResults?: RichResult[];
}
```

### Sitemap Methods

#### listSitemaps()

List all submitted sitemaps.

```typescript
const sitemaps = await gsc.listSitemaps();
```

#### getSitemap(sitemapUrl)

Get information about a specific sitemap.

```typescript
const sitemap = await gsc.getSitemap("https://example.com/sitemap.xml");
```

#### submitSitemap(sitemapUrl)

Submit a sitemap to Google.

```typescript
await gsc.submitSitemap("https://example.com/sitemap.xml");
```

#### deleteSitemap(sitemapUrl)

Remove a sitemap from Google Search Console.

```typescript
await gsc.deleteSitemap("https://example.com/old-sitemap.xml");
```

### Indexing Methods

#### requestIndexing(url, type)

Request indexing for a specific URL.

⚠️ **Important:** This API has strict quotas and is primarily for:

- Job postings
- Livestream videos

For regular content, submit a sitemap instead.

```typescript
await gsc.requestIndexing("https://example.com/job-posting", "URL_UPDATED");
```

### Helper Functions

#### formatGSCDate(date)

Format a date for GSC API.

```typescript
const formattedDate = formatGSCDate(new Date());
// Returns: '2024-11-24'
```

#### getLastNDays(days)

Get date range for last N days.

```typescript
const { startDate, endDate } = getLastNDays(30);
```

## Usage Examples

### Example 1: Performance Dashboard

```typescript
import { createGoogleSearchConsole, getLastNDays } from "m-seo";

async function buildDashboard() {
  const gsc = createGoogleSearchConsole({
    siteUrl: "https://example.com",
    credentials: {
      accessToken: process.env.GSC_ACCESS_TOKEN!,
    },
  });

  const { startDate, endDate } = getLastNDays(30);

  // Get overall performance
  const summary = await gsc.getPerformanceSummary(startDate, endDate);

  // Get top queries
  const topQueries = await gsc.getTopQueries(startDate, endDate, 10);

  // Get device breakdown
  const deviceData = await gsc.getPerformanceByDevice(startDate, endDate);

  // Build dashboard
  return {
    summary,
    topQueries,
    devices: {
      mobile: deviceData.get("MOBILE"),
      desktop: deviceData.get("DESKTOP"),
      tablet: deviceData.get("TABLET"),
    },
  };
}
```

### Example 2: SEO Report Generator

```typescript
async function generateSEOReport() {
  const gsc = createGoogleSearchConsole({
    siteUrl: "https://example.com",
    credentials: { accessToken: process.env.GSC_ACCESS_TOKEN! },
  });

  const { startDate, endDate } = getLastNDays(30);
  const prevEnd = formatGSCDate(new Date(startDate));
  const prevStart = formatGSCDate(
    new Date(new Date(startDate).getTime() - 30 * 24 * 60 * 60 * 1000)
  );

  // Compare with previous period
  const comparison = await gsc.comparePerformance(
    startDate,
    endDate,
    prevStart,
    prevEnd
  );

  // Get top performers
  const [topQueries, topPages] = await Promise.all([
    gsc.getTopQueries(startDate, endDate, 20),
    gsc.getTopPages(startDate, endDate, 20),
  ]);

  // Generate report
  console.log("=== SEO Performance Report ===\n");

  console.log(`Period: ${startDate} to ${endDate}`);
  console.log(
    `Clicks: ${comparison.current.totalClicks} (${
      comparison.changes.clicks.percentage > 0 ? "+" : ""
    }${comparison.changes.clicks.percentage.toFixed(1)}%)`
  );
  console.log(
    `Impressions: ${comparison.current.totalImpressions} (${
      comparison.changes.impressions.percentage > 0 ? "+" : ""
    }${comparison.changes.impressions.percentage.toFixed(1)}%)`
  );

  console.log("\n=== Top 10 Queries ===");
  topQueries.slice(0, 10).forEach((q, i) => {
    console.log(
      `${i + 1}. "${q.query}" - ${q.clicks} clicks, pos ${q.position.toFixed(
        1
      )}`
    );
  });

  console.log("\n=== Top 10 Pages ===");
  topPages.slice(0, 10).forEach((p, i) => {
    console.log(`${i + 1}. ${p.url} - ${p.clicks} clicks`);
  });
}
```

### Example 3: URL Health Checker

```typescript
async function checkUrlHealth(urls: string[]) {
  const gsc = createGoogleSearchConsole({
    siteUrl: "https://example.com",
    credentials: { accessToken: process.env.GSC_ACCESS_TOKEN! },
  });

  const results = [];

  for (const url of urls) {
    try {
      const result = await gsc.inspectUrl(url);

      results.push({
        url,
        indexed: result.isIndexed,
        status: result.indexStatus,
        canonical: result.googleCanonicalUrl,
        issues: [
          ...(result.crawlIssues || []),
          ...(result.indexingIssues || []),
          ...(result.mobileUsabilityIssues || []),
        ],
      });

      // Rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error inspecting ${url}:`, error);
    }
  }

  // Filter problematic URLs
  const problematicUrls = results.filter(
    (r) => !r.indexed || r.issues.length > 0
  );

  console.log(`\nChecked ${results.length} URLs`);
  console.log(`Indexed: ${results.filter((r) => r.indexed).length}`);
  console.log(`Issues found: ${problematicUrls.length}`);

  if (problematicUrls.length > 0) {
    console.log("\n=== URLs with Issues ===");
    problematicUrls.forEach((r) => {
      console.log(`\n${r.url}`);
      console.log(`  Status: ${r.status}`);
      if (r.issues.length > 0) {
        console.log(`  Issues: ${r.issues.join(", ")}`);
      }
    });
  }

  return results;
}
```

### Example 4: Sitemap Monitor

```typescript
async function monitorSitemaps() {
  const gsc = createGoogleSearchConsole({
    siteUrl: "https://example.com",
    credentials: { accessToken: process.env.GSC_ACCESS_TOKEN! },
  });

  const sitemaps = await gsc.listSitemaps();

  console.log("=== Sitemap Status ===\n");

  for (const sitemap of sitemaps) {
    console.log(`Sitemap: ${sitemap.path}`);
    console.log(`  Status: ${sitemap.status}`);
    console.log(`  Submitted: ${sitemap.urlsSubmitted}`);
    console.log(`  Indexed: ${sitemap.urlsIndexed}`);
    console.log(
      `  Coverage: ${(
        ((sitemap.urlsIndexed || 0) / (sitemap.urlsSubmitted || 1)) *
        100
      ).toFixed(1)}%`
    );

    if (sitemap.errors && sitemap.errors.length > 0) {
      console.log(`  Errors: ${sitemap.errors.length}`);
      sitemap.errors.forEach((err) => {
        console.log(`    - ${err.message} (${err.count || 1})`);
      });
    }

    console.log("");
  }

  // Alert if indexing rate is low
  const lowIndexing = sitemaps.filter((s) => {
    const rate = (s.urlsIndexed || 0) / (s.urlsSubmitted || 1);
    return s.urlsSubmitted && s.urlsSubmitted > 0 && rate < 0.7;
  });

  if (lowIndexing.length > 0) {
    console.log("⚠️  Warning: Low indexing rate on:");
    lowIndexing.forEach((s) => console.log(`   - ${s.path}`));
  }
}
```

### Example 5: Query Opportunity Finder

```typescript
async function findQueryOpportunities() {
  const gsc = createGoogleSearchConsole({
    siteUrl: "https://example.com",
    credentials: { accessToken: process.env.GSC_ACCESS_TOKEN! },
  });

  const { startDate, endDate } = getLastNDays(30);

  // Get queries with high impressions but low CTR
  const data = await gsc.getSearchAnalytics({
    startDate,
    endDate,
    dimensions: ["query"],
    rowLimit: 1000,
  });

  const opportunities = data.rows
    .filter((row) => {
      const impressions = row.impressions;
      const ctr = row.ctr;
      const position = row.position;

      // High impressions, low CTR, good position
      return impressions > 100 && ctr < 0.02 && position < 10;
    })
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20);

  console.log("=== CTR Improvement Opportunities ===\n");
  console.log("Queries with high impressions but low CTR:\n");

  opportunities.forEach((row, i) => {
    const query = row.keys?.[0] || "Unknown";
    console.log(`${i + 1}. "${query}"`);
    console.log(`   Impressions: ${row.impressions}`);
    console.log(`   CTR: ${(row.ctr * 100).toFixed(2)}%`);
    console.log(`   Position: ${row.position.toFixed(1)}`);
    console.log(
      `   Potential clicks if CTR was 5%: ${Math.round(row.impressions * 0.05)}`
    );
    console.log("");
  });

  return opportunities;
}
```

## Best Practices

### 1. Authentication

✅ **Use OAuth2 for production**

```typescript
// Good - OAuth2 with refresh token
{
  accessToken: process.env.GSC_ACCESS_TOKEN,
  refreshToken: process.env.GSC_REFRESH_TOKEN,
  clientId: process.env.GSC_CLIENT_ID,
  clientSecret: process.env.GSC_CLIENT_SECRET
}
```

❌ **Don't hardcode credentials**

```typescript
// Bad - hardcoded token
{
  accessToken: "ya29.a0AfH6SMBx...";
}
```

### 2. Rate Limiting

The API has quotas. Respect them:

```typescript
// Add delays between requests
for (const url of urls) {
  await gsc.inspectUrl(url);
  await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay
}
```

### 3. Date Ranges

GSC data has a 3-day delay for fresh data:

```typescript
// Good - account for data delay
const endDate = formatGSCDate(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000));
const startDate = formatGSCDate(
  new Date(Date.now() - 33 * 24 * 60 * 60 * 1000)
);
```

### 4. Error Handling

Always handle API errors:

```typescript
try {
  const data = await gsc.getSearchAnalytics(query);
} catch (error) {
  if (error.message.includes("403")) {
    console.error("Permission denied. Check site verification.");
  } else if (error.message.includes("429")) {
    console.error("Rate limit exceeded. Slow down requests.");
  } else {
    console.error("API error:", error);
  }
}
```

### 5. Caching

Cache results to reduce API calls:

```typescript
const cache = new Map();

async function getCachedData(
  key: string,
  fetcher: () => Promise<any>,
  ttl: number
) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

// Use it
const summary = await getCachedData(
  "performance-30d",
  () => gsc.getPerformanceSummary(startDate, endDate),
  30 * 60 * 1000 // 30 minutes
);
```

## Troubleshooting

### Issue: "Permission denied" errors

**Cause:** Site not verified or API not enabled

**Solution:**

1. Verify site ownership in Search Console
2. Enable Search Console API in Google Cloud Console
3. Ensure OAuth scopes include `webmasters` or `webmasters.readonly`

### Issue: No data returned

**Cause:** Data delay or new site

**Solutions:**

1. Wait 24-48 hours after site verification
2. Use date ranges at least 3 days in the past
3. Check if site has actually received search traffic

### Issue: "Invalid credentials"

**Cause:** Expired or invalid access token

**Solutions:**

1. Refresh OAuth2 token
2. Check token expiration (typically 1 hour)
3. Implement automatic token refresh

```typescript
async function refreshAccessToken(refreshToken: string) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GSC_CLIENT_ID!,
      client_secret: process.env.GSC_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();
  return data.access_token;
}
```

### Issue: Rate limit exceeded

**Cause:** Too many requests

**Solutions:**

1. Implement exponential backoff
2. Add delays between requests
3. Batch operations when possible

```typescript
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i) * 1000; // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries exceeded");
}
```

### Issue: Sitemap not processing

**Causes:**

- Sitemap has errors
- Robots.txt blocks access
- Server errors

**Solutions:**

1. Validate sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html
2. Check robots.txt allows Googlebot
3. Verify sitemap is accessible publicly
4. Check for server errors in sitemap logs

---

## Additional Resources

- [Official API Documentation](https://developers.google.com/webmaster-tools/search-console-api-original)
- [Search Console Help](https://support.google.com/webmasters)
- [OAuth2 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [API Quotas & Limits](https://developers.google.com/webmaster-tools/limits)

## Support

For issues specific to this integration, please check the [GitHub repository](https://github.com/Hailemariyam/m-seo).

For Google Search Console API issues, refer to the [official documentation](https://developers.google.com/webmaster-tools).
