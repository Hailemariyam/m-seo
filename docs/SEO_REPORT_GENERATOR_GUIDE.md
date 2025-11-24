# SEO Report Generator Guide

Complete guide for using the **SEO Report Generator** - a powerful tool for creating beautiful, comprehensive SEO reports in multiple formats.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Quick Start](#quick-start)
5. [Configuration](#configuration)
6. [Data Sources](#data-sources)
7. [Report Formats](#report-formats)
8. [API Reference](#api-reference)
9. [Usage Examples](#usage-examples)
10. [Customization](#customization)
11. [Best Practices](#best-practices)

---

## Overview

The SEO Report Generator creates professional, detailed reports from multiple SEO data sources including:

- 📊 **SEO Audit Results** - From SeoAuditEngine
- 📈 **Google Analytics Data** - Traffic and user metrics
- 🔍 **Google Search Console** - Search performance data
- 🎯 **Keyword Rankings** - Position tracking
- 🔗 **Backlink Analysis** - Link profile data
- 🏆 **Competitor Analysis** - Competitive benchmarking

**Output Formats:**

- 🌐 HTML - Beautiful, interactive reports
- 📄 PDF - Print-ready documents
- 📊 Excel/CSV - Data analysis
- 📝 Markdown - Documentation
- 🔌 JSON - API integration

---

## Features

### Multi-Source Integration

Combine data from various sources into one comprehensive report:

- ✅ SEO audit scores and issues
- ✅ Analytics metrics (pageviews, users, sessions)
- ✅ Search Console performance (clicks, impressions, CTR)
- ✅ Keyword rankings and changes
- ✅ Backlink profile statistics
- ✅ Competitor comparison data
- ✅ Custom metrics and KPIs

### Professional Presentation

- 🎨 **4 Built-in Themes** - Professional, Modern, Dark, Light
- 📊 **Charts & Visualizations** - Graph your data
- 📋 **Executive Summary** - High-level overview
- 💡 **Actionable Recommendations** - Fix suggestions
- 🎯 **Key Metrics Dashboard** - At-a-glance KPIs
- 📱 **Responsive Design** - Mobile-friendly HTML reports

### Flexible Output

- **HTML Reports** - Rich, interactive web pages
- **PDF Generation** - Professional documents (via HTML conversion)
- **CSV Export** - Spreadsheet-compatible data
- **Markdown** - GitHub/documentation-ready
- **JSON** - API and programmatic access
- **Excel** - Advanced data analysis (with extensions)

---

## Installation

```bash
npm install m-seo
```

---

## Quick Start

### Basic Report

```typescript
import { SeoReportGenerator } from "m-seo";

const generator = new SeoReportGenerator({
  title: "Monthly SEO Report",
  period: {
    start: "2024-01-01",
    end: "2024-01-31",
  },
});

// Add data
generator.addAuditData(auditResults);
generator.addAnalyticsData(analyticsData);
generator.addSearchConsoleData(searchConsoleData);

// Generate HTML report
const report = await generator.generate("html");

// Save or send
import { writeFileSync } from "fs";
writeFileSync("seo-report.html", report.content);
```

### Quick Report Helper

```typescript
import { generateQuickReport, quickAudit } from "m-seo";

// Combine audit with report generation
const auditResults = await quickAudit("https://example.com");

const report = await generateQuickReport(
  "SEO Report",
  { audit: auditResults },
  "html"
);

console.log("Report generated!");
```

---

## Configuration

### ReportConfig Interface

```typescript
interface ReportConfig {
  title: string; // Report title (required)
  subtitle?: string; // Report subtitle
  period?: {
    // Date range
    start: string; // Start date (YYYY-MM-DD)
    end: string; // End date (YYYY-MM-DD)
  };
  author?: string; // Report author name
  company?: string; // Company name
  logo?: string; // Logo URL/path
  theme?:
    | "light"
    | "dark" // Visual theme
    | "professional"
    | "modern";
  includeCharts?: boolean; // Include charts (default: true)
  includeRecommendations?: boolean; // Show recommendations (default: true)
  includeExecutiveSummary?: boolean; // Show summary (default: true)
  customSections?: ReportSection[]; // Custom content sections
}
```

### Configuration Examples

#### Minimal Configuration

```typescript
const generator = new SeoReportGenerator({
  title: "SEO Report",
});
```

#### Full Configuration

```typescript
const generator = new SeoReportGenerator({
  title: "Q1 2024 SEO Performance Report",
  subtitle: "Comprehensive Analysis and Recommendations",
  period: { start: "2024-01-01", end: "2024-03-31" },
  author: "SEO Team",
  company: "Acme Corporation",
  logo: "https://example.com/logo.png",
  theme: "professional",
  includeCharts: true,
  includeRecommendations: true,
  includeExecutiveSummary: true,
});
```

#### Custom Theme Example

```typescript
const generator = new SeoReportGenerator({
  title: "Monthly Report",
  theme: "dark", // Dark mode for presentations
  includeCharts: true,
});
```

---

## Data Sources

### 1. SEO Audit Data

```typescript
import { quickAudit } from "m-seo";

const auditResults = await quickAudit("https://example.com");
generator.addAuditData(auditResults);
```

Includes:

- Overall SEO score
- Category scores (meta tags, content, performance, etc.)
- Issues by severity
- Recommendations

### 2. Analytics Data

```typescript
const analyticsData = {
  pageViews: 15000,
  sessions: 8500,
  users: 5200,
  bounceRate: 45.2,
  avgSessionDuration: 180,
  conversions: 250,
  conversionRate: 2.94,
  topPages: [
    { path: "/products", views: 3200, avgTime: 240 },
    { path: "/about", views: 1800, avgTime: 120 },
  ],
  topSources: [
    { source: "organic", users: 3500, percentage: 67 },
    { source: "direct", users: 1200, percentage: 23 },
  ],
  deviceBreakdown: {
    desktop: 55,
    mobile: 40,
    tablet: 5,
  },
};

generator.addAnalyticsData(analyticsData);
```

### 3. Search Console Data

```typescript
const searchConsoleData = {
  totalClicks: 12500,
  totalImpressions: 250000,
  averageCTR: 5.0,
  averagePosition: 8.5,
  topQueries: [
    {
      query: "best seo tools",
      clicks: 850,
      impressions: 15000,
      ctr: 5.67,
      position: 3.2,
    },
  ],
  topPages: [
    {
      page: "/seo-guide",
      clicks: 1200,
      impressions: 18000,
      ctr: 6.67,
      position: 2.8,
    },
  ],
};

generator.addSearchConsoleData(searchConsoleData);
```

### 4. Keyword Data

```typescript
const keywords = [
  {
    keyword: "seo tools",
    position: 3,
    previousPosition: 5,
    change: -2, // Improved by 2 positions
    searchVolume: 12000,
    difficulty: 65,
    url: "/seo-tools",
  },
  {
    keyword: "seo audit",
    position: 8,
    change: 3, // Dropped 3 positions
    searchVolume: 8500,
  },
];

generator.addKeywordData(keywords);
```

### 5. Backlink Data

```typescript
const backlinkData = {
  totalBacklinks: 1250,
  referringDomains: 340,
  domainAuthority: 58,
  topBacklinks: [
    {
      url: "https://example.com/article",
      domain: "example.com",
      authority: 72,
      anchor: "best SEO tools",
    },
  ],
};

generator.addBacklinkData(backlinkData);
```

### 6. Competitor Data

```typescript
const competitors = [
  {
    name: "Competitor A",
    url: "https://competitor-a.com",
    metrics: {
      organicKeywords: 15000,
      organicTraffic: 85000,
      backlinks: 5400,
      domainAuthority: 68,
    },
  },
  {
    name: "Competitor B",
    url: "https://competitor-b.com",
    metrics: {
      organicKeywords: 12000,
      organicTraffic: 62000,
      backlinks: 3800,
      domainAuthority: 61,
    },
  },
];

generator.addCompetitorData(competitors);
```

### 7. Custom Metrics

```typescript
const customMetrics = [
  {
    label: "Conversion Rate",
    value: "2.85%",
    change: 15,
    changeType: "increase",
    color: "#10b981",
  },
  {
    label: "Page Speed Score",
    value: 92,
    change: -3,
    changeType: "decrease",
    format: "number",
  },
];

generator.addCustomMetrics(customMetrics);
```

---

## Report Formats

### HTML Reports

**Best for:** Client presentations, email reports, dashboards

```typescript
const report = await generator.generate("html");
writeFileSync("report.html", report.content);

// Features:
// - Interactive design
// - Responsive layout
// - Color-coded sections
// - Charts and graphs
// - Print-friendly
```

**Themes:**

- `professional` - Clean, corporate design (default)
- `modern` - Gradient backgrounds, contemporary
- `dark` - Dark mode for presentations
- `light` - Minimal, light background

### JSON Reports

**Best for:** API integration, data processing, storage

```typescript
const report = await generator.generate("json");
const data = JSON.parse(report.content);

// Use in applications:
// - Store in database
// - Send via API
// - Process with analytics tools
// - Archive historical data
```

### Markdown Reports

**Best for:** Documentation, GitHub, version control

```typescript
const report = await generator.generate("markdown");
writeFileSync("SEO-REPORT.md", report.content);

// Perfect for:
// - GitHub repositories
// - Documentation sites
// - Version-controlled reports
// - Confluence/Wiki pages
```

### CSV Reports

**Best for:** Spreadsheet analysis, data import

```typescript
const report = await generator.generate("csv");
writeFileSync("report.csv", report.content);

// Compatible with:
// - Excel
// - Google Sheets
// - Database imports
// - Data analysis tools
```

### PDF Reports

**Best for:** Professional documents, client delivery

```typescript
const report = await generator.generate("pdf");
// Note: Requires additional library (puppeteer, pdfkit)

// Use cases:
// - Client deliverables
// - Print documents
// - Email attachments
// - Archive reports
```

---

## API Reference

### SeoReportGenerator Class

#### Constructor

```typescript
new SeoReportGenerator(config: ReportConfig)
```

Creates a new report generator instance.

#### Methods

**addAuditData(auditResult: AuditResult): this**

- Add SEO audit results
- Returns `this` for chaining

**addAnalyticsData(analyticsData: AnalyticsData): this**

- Add Google Analytics data
- Returns `this` for chaining

**addSearchConsoleData(searchConsoleData: SearchConsoleData): this**

- Add Search Console data
- Returns `this` for chaining

**addKeywordData(keywords: KeywordData[]): this**

- Add keyword ranking data
- Returns `this` for chaining

**addBacklinkData(backlinkData: BacklinkData): this**

- Add backlink profile data
- Returns `this` for chaining

**addCompetitorData(competitors: CompetitorData[]): this**

- Add competitor analysis
- Returns `this` for chaining

**addCustomMetrics(metrics: ReportMetric[]): this**

- Add custom KPIs
- Returns `this` for chaining

**addCustomSection(section: ReportSection): this**

- Add custom content section
- Returns `this` for chaining

**generate(format: ReportFormat): Promise<GeneratedReport>**

- Generate report in specified format
- Returns report with content and metadata

---

## Usage Examples

### Example 1: Complete Monthly Report

```typescript
import { SeoReportGenerator, quickAudit } from "m-seo";

async function generateMonthlyReport() {
  // Run audit
  const audit = await quickAudit("https://example.com");

  // Create generator
  const generator = new SeoReportGenerator({
    title: "January 2024 SEO Report",
    subtitle: "Performance Analysis & Recommendations",
    period: { start: "2024-01-01", end: "2024-01-31" },
    company: "Acme Corp",
    theme: "professional",
  });

  // Add all data
  generator
    .addAuditData(audit)
    .addAnalyticsData({
      pageViews: 45000,
      sessions: 28000,
      users: 18500,
      bounceRate: 42.5,
      avgSessionDuration: 195,
    })
    .addSearchConsoleData({
      totalClicks: 15000,
      totalImpressions: 350000,
      averageCTR: 4.29,
      averagePosition: 12.3,
    });

  // Generate and save
  const report = await generator.generate("html");
  writeFileSync("monthly-report.html", report.content);

  console.log("Report generated successfully!");
}
```

### Example 2: Client Deliverable Package

```typescript
async function generateClientPackage() {
  const generator = new SeoReportGenerator({
    title: "Q1 2024 SEO Performance",
    author: "SEO Agency Name",
    company: "Client Company",
    logo: "./client-logo.png",
    theme: "professional",
  });

  // Add data...
  generator.addAuditData(auditData);

  // Generate multiple formats
  const htmlReport = await generator.generate("html");
  const pdfReport = await generator.generate("pdf");
  const csvData = await generator.generate("csv");

  // Save all formats
  writeFileSync("client-report.html", htmlReport.content);
  writeFileSync("client-report.pdf", pdfReport.content);
  writeFileSync("client-data.csv", csvData.content);
}
```

### Example 3: Automated Weekly Reports

```typescript
import { schedule } from "node-cron";

// Run every Monday at 9 AM
schedule("0 9 * * 1", async () => {
  const generator = new SeoReportGenerator({
    title: `Weekly SEO Report - Week ${getWeekNumber()}`,
    period: getLastWeekDates(),
  });

  // Fetch fresh data
  const audit = await quickAudit("https://example.com");
  const analytics = await fetchAnalyticsData();
  const gsc = await fetchSearchConsoleData();

  generator
    .addAuditData(audit)
    .addAnalyticsData(analytics)
    .addSearchConsoleData(gsc);

  const report = await generator.generate("html");

  // Email to team
  await sendEmail({
    to: "team@example.com",
    subject: "Weekly SEO Report",
    html: report.content,
  });
});
```

### Example 4: Competitor Comparison Report

```typescript
async function compareWithCompetitors() {
  const generator = new SeoReportGenerator({
    title: "Competitive SEO Analysis",
    subtitle: "Market Position & Opportunities",
  });

  generator.addCompetitorData([
    {
      name: "Our Website",
      url: "https://example.com",
      metrics: {
        organicKeywords: 8500,
        organicTraffic: 45000,
        backlinks: 2400,
        domainAuthority: 52,
      },
    },
    {
      name: "Competitor 1",
      url: "https://competitor1.com",
      metrics: {
        organicKeywords: 12000,
        organicTraffic: 68000,
        backlinks: 4200,
        domainAuthority: 61,
      },
    },
  ]);

  const report = await generator.generate("html");
  writeFileSync("competitor-analysis.html", report.content);
}
```

### Example 5: Keyword Tracking Report

```typescript
async function trackKeywordProgress() {
  const keywords = await fetchKeywordRankings();

  const generator = new SeoReportGenerator({
    title: "Keyword Ranking Report",
    period: { start: "2024-01-01", end: "2024-01-31" },
  });

  generator.addKeywordData(keywords);

  // Generate markdown for documentation
  const report = await generator.generate("markdown");
  writeFileSync("KEYWORD-REPORT.md", report.content);
}
```

### Example 6: Custom Sections

```typescript
const generator = new SeoReportGenerator({
  title: "Custom SEO Report",
});

// Add custom section
generator.addCustomSection({
  id: "social-media",
  title: "Social Media Performance",
  content: `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="label">Facebook Engagement</div>
        <div class="value">12.5K</div>
      </div>
      <div class="metric-card">
        <div class="label">Twitter Followers</div>
        <div class="value">8.2K</div>
      </div>
    </div>
  `,
  order: 5,
});

const report = await generator.generate("html");
```

---

## Customization

### Custom Metrics

Add business-specific KPIs:

```typescript
generator.addCustomMetrics([
  {
    label: "Lead Generation",
    value: 145,
    change: 12,
    changeType: "increase",
    format: "number",
  },
  {
    label: "Revenue from Organic",
    value: "$25,400",
    change: 8,
    changeType: "increase",
    format: "currency",
  },
]);
```

### Custom Sections

Add unique content:

```typescript
generator.addCustomSection({
  id: "goals",
  title: "Q2 Goals",
  content: `
    <ul>
      <li>Improve overall SEO score to 85+</li>
      <li>Increase organic traffic by 25%</li>
      <li>Reduce critical issues to zero</li>
    </ul>
  `,
  order: 1, // Show early in report
});
```

---

## Best Practices

### 1. Consistent Reporting Schedule

```typescript
// Weekly
schedule("0 9 * * 1", generateWeeklyReport);

// Monthly
schedule("0 9 1 * *", generateMonthlyReport);

// Quarterly
schedule("0 9 1 */3 *", generateQuarterlyReport);
```

### 2. Data Validation

```typescript
function validateData(data) {
  if (data.analytics && data.analytics.pageViews < 0) {
    throw new Error("Invalid pageviews");
  }
  // More validation...
}
```

### 3. Archive Reports

```typescript
const timestamp = new Date().toISOString().split("T")[0];
const filename = `seo-report-${timestamp}.html`;
writeFileSync(`./reports/${filename}`, report.content);
```

### 4. Email Delivery

```typescript
await sendEmail({
  to: "stakeholders@example.com",
  subject: `${config.title} - ${new Date().toLocaleDateString()}`,
  html: report.content,
  attachments: [{ filename: "report.pdf", content: pdfReport.content }],
});
```

---

## Next Steps

1. **Combine with SEO Audit Engine** - Automate data collection
2. **Integrate with Analytics** - Pull live Google Analytics data
3. **Schedule Reports** - Automate with cron jobs
4. **Custom Themes** - Brand reports with your colors
5. **Chart Integration** - Add Chart.js or D3.js visualizations

---

## Learn More

- [SEO Audit Engine Guide](./SEO_AUDIT_ENGINE_GUIDE.md)
- [Google Analytics Guide](./GOOGLE_ANALYTICS_GUIDE.md)
- [Google Search Console Guide](./GOOGLE_SEARCH_CONSOLE_GUIDE.md)
- [Quick Reference](./QUICK_REFERENCE.md)

---

**Ready to create beautiful SEO reports!** 📊✨
