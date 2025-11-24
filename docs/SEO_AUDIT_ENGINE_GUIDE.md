# SEO Audit Engine Guide

Complete guide for using the **SEO Audit Engine** - a comprehensive SEO analysis tool that audits websites for meta tags, content quality, performance, accessibility, and more.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Audit Categories](#audit-categories)
7. [API Reference](#api-reference)
8. [Usage Examples](#usage-examples)
9. [Report Formats](#report-formats)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

---

## Overview

The SEO Audit Engine is a powerful tool for analyzing websites and identifying SEO issues. It provides:

- **10 Audit Categories**: Meta tags, content, performance, mobile, technical, accessibility, schema, links, images, security
- **Severity Levels**: Critical, warning, and info classifications
- **Actionable Recommendations**: Specific steps to fix each issue
- **Multiple Report Formats**: JSON, HTML, and Markdown outputs
- **Scoring System**: Overall and category-specific scores (0-100)
- **Issue Prioritization**: Impact and effort estimates for each issue

---

## Features

### Comprehensive Analysis

- ✅ **Meta Tags**: Title, description, Open Graph, Twitter Cards, canonical tags
- ✅ **Content Quality**: Word count, heading structure, readability, keyword density
- ✅ **Performance**: Load time, page size, request count, compression
- ✅ **Mobile-Friendliness**: Viewport tags, responsive design checks
- ✅ **Technical SEO**: HTTPS, redirects, robots.txt, sitemaps, hreflang
- ✅ **Accessibility**: Alt tags, ARIA labels, keyboard navigation, color contrast
- ✅ **Schema Markup**: Structured data validation and recommendations
- ✅ **Link Analysis**: Internal/external links, broken links, link density
- ✅ **Image Optimization**: Alt tags, lazy loading, responsive images
- ✅ **Security**: HTTPS, mixed content, security headers

### Smart Recommendations

Each issue includes:

- **Impact Score** (0-100): How much it affects SEO
- **Effort Estimate** (low/medium/high): How difficult to fix
- **Specific Recommendation**: Actionable steps to resolve

---

## Installation

```bash
npm install m-seo
```

---

## Quick Start

### Basic Audit

```typescript
import { SeoAuditEngine } from "m-seo";

const engine = new SeoAuditEngine({
  url: "https://example.com",
});

const results = await engine.runFullAudit();

console.log(`SEO Score: ${results.overallScore}/100`);
console.log(`Issues found: ${results.issues.length}`);
console.log(`Critical issues: ${results.summary.criticalIssues}`);
```

### Quick Audit Helper

```typescript
import { quickAudit } from "m-seo";

const results = await quickAudit("https://example.com");
console.log(results);
```

### Generate Report

```typescript
const report = await engine.generateReport("html");

// Save to file
import { writeFileSync } from "fs";
writeFileSync("seo-audit.html", report.html!);
```

---

## Configuration

### AuditConfig Interface

```typescript
interface AuditConfig {
  url: string; // URL to audit (required)
  includePerformance?: boolean; // Run performance audit (default: true)
  includeAccessibility?: boolean; // Run accessibility audit (default: true)
  includeMobileCheck?: boolean; // Run mobile audit (default: true)
  includeSchemaValidation?: boolean; // Run schema audit (default: true)
  userAgent?: string; // Custom user agent
  timeout?: number; // Request timeout in ms (default: 30000)
  followRedirects?: boolean; // Follow redirects (default: true)
  maxRedirects?: number; // Max redirects to follow (default: 5)
}
```

### Configuration Examples

#### Minimal Configuration

```typescript
const engine = new SeoAuditEngine({
  url: "https://example.com",
});
```

#### Full Configuration

```typescript
const engine = new SeoAuditEngine({
  url: "https://example.com",
  includePerformance: true,
  includeAccessibility: true,
  includeMobileCheck: true,
  includeSchemaValidation: true,
  userAgent: "MyBot/1.0",
  timeout: 60000,
  followRedirects: true,
  maxRedirects: 3,
});
```

#### Performance-Focused Audit

```typescript
const engine = new SeoAuditEngine({
  url: "https://example.com",
  includePerformance: true,
  includeAccessibility: false,
  includeMobileCheck: false,
  includeSchemaValidation: false,
});
```

---

## Audit Categories

### 1. Meta Tags Audit

Checks for proper meta tag implementation:

- **Title Tag**: Length (50-60 chars optimal), presence
- **Meta Description**: Length (150-160 chars optimal), presence
- **Canonical Tag**: Prevents duplicate content issues
- **Viewport Tag**: Required for mobile responsiveness
- **Open Graph Tags**: For social media sharing
- **Twitter Cards**: For Twitter sharing
- **Robots Tag**: Search engine indexing directives

**Example Result:**

```typescript
{
  title: "Example Page - Best Product",
  titleLength: 28,
  description: "Discover our amazing products...",
  descriptionLength: 155,
  canonical: "https://example.com/page",
  viewport: "width=device-width, initial-scale=1.0",
  score: 90,
  issues: [...]
}
```

### 2. Content Audit

Analyzes content quality and structure:

- **Word Count**: Minimum 300 words recommended
- **Heading Structure**: H1-H6 hierarchy
- **H1 Tags**: Should have exactly one
- **Paragraph Count**: Number of paragraphs
- **Average Paragraph Length**: Readability metric
- **Keyword Density**: Keyword usage analysis

**Example Result:**

```typescript
{
  wordCount: 1250,
  headings: { h1: 1, h2: 5, h3: 8, h4: 2, h5: 0, h6: 0 },
  h1Tags: ["Main Page Heading"],
  paragraphCount: 15,
  averageParagraphLength: 83.3,
  score: 95,
  issues: [...]
}
```

### 3. Performance Audit

Measures page performance metrics:

- **Load Time**: Target < 2 seconds
- **Page Size**: Should be optimized
- **Request Count**: Fewer is better
- **Compression**: GZIP/Brotli enabled
- **Cache Headers**: Proper caching setup
- **Minification**: CSS/JS minification

**Example Result:**

```typescript
{
  loadTime: 1800,
  pageSize: 1200000,
  requestCount: 35,
  imageCount: 15,
  scriptCount: 6,
  compressionEnabled: true,
  cacheHeaders: true,
  score: 88,
  issues: [...]
}
```

### 4. Mobile Audit

Checks mobile-friendliness:

- **Viewport Tag**: Must be present
- **Mobile-Friendly**: Responsive design check
- **Touch Target Size**: Buttons/links size
- **Font Size**: Readable on mobile
- **Content Width**: Fits viewport

### 5. Technical Audit

Verifies technical SEO factors:

- **HTTPS**: SSL certificate
- **HTTP Status Code**: Should be 200
- **Redirect Chain**: Check for redirect loops
- **Robots.txt**: Crawling directives
- **Sitemap**: XML sitemap presence
- **Hreflang**: International targeting

### 6. Accessibility Audit

Checks accessibility compliance:

- **Alt Tags**: Images must have alt text
- **ARIA Labels**: Screen reader support
- **Landmark Roles**: Semantic HTML
- **Form Labels**: All inputs labeled
- **Color Contrast**: WCAG compliance
- **Keyboard Navigation**: Tab navigation

### 7. Schema Audit

Validates structured data:

- **Schema Presence**: JSON-LD or Microdata
- **Schema Types**: Organization, Article, Product, etc.
- **Validation Errors**: Syntax and semantic errors
- **Recommendations**: Suggested schema types

### 8. Link Audit

Analyzes link structure:

- **Internal Links**: Site navigation
- **External Links**: Outbound links
- **Broken Links**: 404 errors
- **Nofollow Links**: Link equity
- **Link Density**: Links per words
- **Orphaned Pages**: Unreachable pages

### 9. Image Audit

Checks image optimization:

- **Alt Tags**: Descriptive alt text
- **Lazy Loading**: Performance optimization
- **Responsive Images**: srcset/picture elements
- **Image Size**: File size optimization
- **Next-Gen Formats**: WebP, AVIF support

### 10. Security Audit

Verifies security best practices:

- **HTTPS**: Secure connection
- **Mixed Content**: HTTP on HTTPS pages
- **Security Headers**: HSTS, CSP, X-Frame-Options
- **Vulnerabilities**: Known security issues

---

## API Reference

### SeoAuditEngine Class

#### Constructor

```typescript
new SeoAuditEngine(config: AuditConfig)
```

Creates a new audit engine instance.

#### runFullAudit()

```typescript
async runFullAudit(): Promise<AuditResult>
```

Runs a complete SEO audit on the configured URL.

**Returns:** Complete audit results with scores, issues, and recommendations.

#### generateReport()

```typescript
async generateReport(format: 'json' | 'html' | 'markdown'): Promise<AuditReport>
```

Generates an audit report in the specified format.

**Parameters:**

- `format`: Output format ('json', 'html', or 'markdown')

**Returns:** AuditReport with formatted content.

---

### Helper Functions

#### createSeoAuditEngine()

```typescript
function createSeoAuditEngine(config: AuditConfig): SeoAuditEngine;
```

Factory function to create audit engine instance.

#### quickAudit()

```typescript
async function quickAudit(
  url: string,
  options?: Partial<AuditConfig>
): Promise<AuditResult>;
```

Quick audit helper - creates engine and runs audit in one call.

**Example:**

```typescript
const results = await quickAudit("https://example.com", {
  includePerformance: true,
});
```

#### compareAudits()

```typescript
function compareAudits(before: AuditResult, after: AuditResult);
```

Compare two audit results to track improvements.

**Returns:**

```typescript
{
  scoreDiff: number; // Overall score change
  issuesDiff: number; // Issue count change
  categoryChanges: Record<string, number>; // Category score changes
  improved: boolean; // Whether score improved
  summary: string; // Summary text
}
```

**Example:**

```typescript
const before = await quickAudit("https://example.com");
// Make improvements...
const after = await quickAudit("https://example.com");

const comparison = compareAudits(before, after);
console.log(comparison.summary); // "Score improved by 15 points"
```

---

## Usage Examples

### Example 1: Basic SEO Audit

```typescript
import { SeoAuditEngine } from "m-seo";

async function auditWebsite() {
  const engine = new SeoAuditEngine({
    url: "https://example.com",
  });

  const results = await engine.runFullAudit();

  console.log(`Overall Score: ${results.overallScore}/100`);
  console.log(`Critical Issues: ${results.summary.criticalIssues}`);
  console.log(`Warnings: ${results.summary.warnings}`);

  // Show top 5 issues
  results.issues.slice(0, 5).forEach((issue, idx) => {
    console.log(`${idx + 1}. [${issue.severity}] ${issue.title}`);
    console.log(`   Impact: ${issue.impact}/100`);
    console.log(`   Fix: ${issue.recommendation}`);
  });
}

auditWebsite();
```

### Example 2: Generate HTML Report

```typescript
import { SeoAuditEngine } from "m-seo";
import { writeFileSync } from "fs";

async function generateReport() {
  const engine = new SeoAuditEngine({
    url: "https://example.com",
  });

  const report = await engine.generateReport("html");

  // Save to file
  writeFileSync("seo-audit.html", report.html!);
  writeFileSync("seo-audit.json", report.json);

  console.log("Reports saved!");
}

generateReport();
```

### Example 3: Focus on Critical Issues

```typescript
import { quickAudit } from "m-seo";

async function findCriticalIssues() {
  const results = await quickAudit("https://example.com");

  const criticalIssues = results.issues.filter(
    (issue) => issue.severity === "critical"
  );

  console.log(`Found ${criticalIssues.length} critical issues:`);

  criticalIssues.forEach((issue) => {
    console.log(`\n${issue.title}`);
    console.log(`Category: ${issue.category}`);
    console.log(`Impact: ${issue.impact}/100`);
    console.log(`Effort: ${issue.effort}`);
    console.log(`Recommendation: ${issue.recommendation}`);
  });
}

findCriticalIssues();
```

### Example 4: Track Improvements Over Time

```typescript
import { quickAudit, compareAudits } from "m-seo";

async function trackProgress() {
  // Initial audit
  const baseline = await quickAudit("https://example.com");
  console.log(`Baseline score: ${baseline.overallScore}/100`);

  // After making improvements...
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const followUp = await quickAudit("https://example.com");
  console.log(`New score: ${followUp.overallScore}/100`);

  // Compare results
  const comparison = compareAudits(baseline, followUp);
  console.log(`\n${comparison.summary}`);
  console.log(
    `Score change: ${comparison.scoreDiff > 0 ? "+" : ""}${
      comparison.scoreDiff
    }`
  );
  console.log(
    `Issues change: ${comparison.issuesDiff > 0 ? "+" : ""}${
      comparison.issuesDiff
    }`
  );

  // Show category changes
  console.log("\nCategory Changes:");
  Object.entries(comparison.categoryChanges).forEach(([category, change]) => {
    if (change !== 0) {
      console.log(`  ${category}: ${change > 0 ? "+" : ""}${change}`);
    }
  });
}

trackProgress();
```

### Example 5: Audit Multiple Pages

```typescript
import { quickAudit } from "m-seo";

async function auditMultiplePages() {
  const urls = [
    "https://example.com",
    "https://example.com/about",
    "https://example.com/products",
    "https://example.com/contact",
  ];

  const results = await Promise.all(urls.map((url) => quickAudit(url)));

  results.forEach((result, idx) => {
    console.log(`\n${urls[idx]}`);
    console.log(`Score: ${result.overallScore}/100`);
    console.log(`Issues: ${result.summary.totalIssues}`);
    console.log(`Critical: ${result.summary.criticalIssues}`);
  });

  // Find page with best score
  const bestPage = results.reduce(
    (best, current, idx) =>
      current.overallScore > best.score
        ? { url: urls[idx], score: current.overallScore }
        : best,
    { url: "", score: 0 }
  );

  console.log(
    `\nBest performing page: ${bestPage.url} (${bestPage.score}/100)`
  );
}

auditMultiplePages();
```

### Example 6: Custom Configuration

```typescript
import { SeoAuditEngine } from "m-seo";

async function customAudit() {
  const engine = new SeoAuditEngine({
    url: "https://example.com",
    includePerformance: true,
    includeAccessibility: true,
    includeMobileCheck: true,
    includeSchemaValidation: false, // Skip schema validation
    timeout: 60000, // 60 second timeout
    userAgent: "CustomBot/1.0",
  });

  const results = await engine.runFullAudit();

  // Process results...
}

customAudit();
```

### Example 7: Filter by Impact and Effort

```typescript
import { quickAudit } from "m-seo";

async function findQuickWins() {
  const results = await quickAudit("https://example.com");

  // Find high-impact, low-effort issues (quick wins)
  const quickWins = results.issues.filter(
    (issue) => issue.impact >= 70 && issue.effort === "low"
  );

  console.log(`Found ${quickWins.length} quick wins:\n`);

  quickWins.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.title}`);
    console.log(`   Impact: ${issue.impact}/100`);
    console.log(`   Fix: ${issue.recommendation}\n`);
  });
}

findQuickWins();
```

### Example 8: Category-Specific Analysis

```typescript
import { quickAudit } from "m-seo";

async function analyzeMeta() {
  const results = await quickAudit("https://example.com");

  console.log("=== Meta Tags Analysis ===\n");
  console.log(`Score: ${results.metaTags.score}/100`);
  console.log(
    `Title: ${results.metaTags.title} (${results.metaTags.titleLength} chars)`
  );
  console.log(
    `Description: ${results.metaTags.description?.substring(0, 50)}... (${
      results.metaTags.descriptionLength
    } chars)`
  );
  console.log(`Canonical: ${results.metaTags.canonical || "Missing"}`);
  console.log(`Viewport: ${results.metaTags.viewport || "Missing"}`);

  // Meta tag issues
  const metaIssues = results.issues.filter((i) => i.category === "meta-tags");
  console.log(`\nMeta Tag Issues: ${metaIssues.length}`);
  metaIssues.forEach((issue) => {
    console.log(`  - [${issue.severity}] ${issue.title}`);
  });
}

analyzeMeta();
```

### Example 9: Performance Monitoring

```typescript
import { quickAudit } from "m-seo";

async function monitorPerformance() {
  const results = await quickAudit("https://example.com", {
    includePerformance: true,
  });

  if (results.performance) {
    console.log("=== Performance Metrics ===\n");
    console.log(`Score: ${results.performance.score}/100`);
    console.log(`Load Time: ${results.performance.loadTime}ms`);
    console.log(
      `Page Size: ${(results.performance.pageSize! / 1024 / 1024).toFixed(2)}MB`
    );
    console.log(`Requests: ${results.performance.requestCount}`);
    console.log(`Images: ${results.performance.imageCount}`);
    console.log(`Scripts: ${results.performance.scriptCount}`);
    console.log(
      `Compression: ${results.performance.compressionEnabled ? "Yes" : "No"}`
    );

    // Performance issues
    const perfIssues = results.issues.filter(
      (i) => i.category === "performance"
    );
    if (perfIssues.length > 0) {
      console.log("\nPerformance Issues:");
      perfIssues.forEach((issue) => {
        console.log(`  - ${issue.title}: ${issue.recommendation}`);
      });
    }
  }
}

monitorPerformance();
```

### Example 10: Accessibility Check

```typescript
import { quickAudit } from "m-seo";

async function checkAccessibility() {
  const results = await quickAudit("https://example.com", {
    includeAccessibility: true,
  });

  if (results.accessibility) {
    console.log("=== Accessibility Report ===\n");
    console.log(`Score: ${results.accessibility.score}/100`);
    console.log(`Missing Alt Tags: ${results.accessibility.missingAltCount}`);
    console.log(`ARIA Labels: ${results.accessibility.ariaLabels}`);
    console.log(`Landmark Roles: ${results.accessibility.landmarkRoles}`);

    // Critical accessibility issues
    const a11yIssues = results.issues.filter(
      (i) => i.category === "accessibility" && i.severity === "critical"
    );

    if (a11yIssues.length > 0) {
      console.log("\nCritical Accessibility Issues:");
      a11yIssues.forEach((issue) => {
        console.log(`  - ${issue.title}`);
        console.log(`    ${issue.recommendation}`);
      });
    }
  }
}

checkAccessibility();
```

---

## Report Formats

### JSON Report

```typescript
const report = await engine.generateReport("json");
const data = JSON.parse(report.json);
// Use programmatically
```

### HTML Report

```typescript
const report = await engine.generateReport("html");
// Save or display in browser
writeFileSync("report.html", report.html!);
```

Features:

- Overall score display
- Category breakdown
- Color-coded severity
- Detailed issue cards
- Responsive design

### Markdown Report

```typescript
const report = await engine.generateReport("markdown");
// Great for documentation
writeFileSync("AUDIT.md", report.markdown!);
```

---

## Best Practices

### 1. Regular Audits

Run audits regularly to catch issues early:

```typescript
// Weekly audit
setInterval(async () => {
  const results = await quickAudit("https://example.com");
  if (results.summary.criticalIssues > 0) {
    sendAlert(`${results.summary.criticalIssues} critical issues found`);
  }
}, 7 * 24 * 60 * 60 * 1000); // Weekly
```

### 2. Focus on High-Impact Issues

Prioritize issues by impact:

```typescript
const sortedByImpact = results.issues.sort((a, b) => b.impact - a.impact);
```

### 3. Track Progress

Compare audits over time:

```typescript
const comparison = compareAudits(lastWeek, thisWeek);
if (comparison.improved) {
  console.log("SEO is improving!");
}
```

### 4. Automated Monitoring

Integrate into CI/CD:

```typescript
// In your deployment pipeline
const results = await quickAudit(deploymentUrl);
if (results.overallScore < 70) {
  throw new Error("SEO score too low, blocking deployment");
}
```

### 5. Category-Specific Focus

Address one category at a time for better results.

---

## Troubleshooting

### Issue: Timeout Errors

**Solution:** Increase timeout:

```typescript
const engine = new SeoAuditEngine({
  url: "https://example.com",
  timeout: 60000, // 60 seconds
});
```

### Issue: Inaccurate Scores

**Cause:** The current implementation uses placeholder data for demonstration.

**Solution:** In production, integrate with real HTML parsing (jsdom, cheerio) and performance monitoring tools.

### Issue: Missing Features

Some advanced features require additional setup:

- Performance metrics: Integrate with Lighthouse or similar tools
- Accessibility: Use axe-core or similar libraries
- Schema validation: Use Google's Structured Data Testing Tool API

---

## Next Steps

1. **Integrate with Google Analytics** - Track audit scores alongside traffic data
2. **Automate Audits** - Schedule regular audits and send reports
3. **Custom Scoring** - Adjust category weights for your needs
4. **Team Alerts** - Send Slack/email notifications for critical issues
5. **Historical Tracking** - Store audit results in database for trend analysis

---

## Learn More

- [Project Structure](./PROJECT_STRUCTURE.md)
- [Google Analytics Guide](./GOOGLE_ANALYTICS_GUIDE.md)
- [Google Search Console Guide](./GOOGLE_SEARCH_CONSOLE_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Need help?** Open an issue on GitHub or check the examples folder for more use cases.
