/**
 * Google Search Console Integration Examples
 *
 * Complete examples demonstrating how to use the GoogleSearchConsole class
 * for monitoring and improving search performance.
 */

import {
  createGoogleSearchConsole,
  formatGSCDate,
  getLastNDays,
  type GoogleSearchConsole,
  type SearchAnalyticsQuery
} from '../src/analytics/GoogleSearchConsole.js';

// ============================================================================
// Example 1: Basic Setup and Configuration
// ============================================================================

export function basicSetup() {
  // Create a Google Search Console instance
  const gsc = createGoogleSearchConsole({
    siteUrl: 'https://example.com',
    credentials: {
      accessToken: process.env.GSC_ACCESS_TOKEN || 'your-oauth-token'
    },
    defaultDateRange: 30,
    debug: true // Enable debug logging during development
  });

  return gsc;
}

// ============================================================================
// Example 2: Get Performance Summary
// ============================================================================

export async function performanceSummaryExample() {
  const gsc = basicSetup();

  // Get last 30 days of data
  const { startDate, endDate } = getLastNDays(30);

  const summary = await gsc.getPerformanceSummary(startDate, endDate);

  console.log('=== Performance Summary (Last 30 Days) ===');
  console.log(`Period: ${summary.period.startDate} to ${summary.period.endDate}`);
  console.log(`Total Clicks: ${summary.totalClicks.toLocaleString()}`);
  console.log(`Total Impressions: ${summary.totalImpressions.toLocaleString()}`);
  console.log(`Average CTR: ${(summary.averageCtr * 100).toFixed(2)}%`);
  console.log(`Average Position: ${summary.averagePosition.toFixed(1)}`);

  return summary;
}

// ============================================================================
// Example 3: Analyze Top Performing Queries
// ============================================================================

export async function topQueriesExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  // Get top 20 queries
  const topQueries = await gsc.getTopQueries(startDate, endDate, 20);

  console.log('\n=== Top 20 Search Queries ===\n');

  topQueries.forEach((query, index) => {
    console.log(`${index + 1}. "${query.query}"`);
    console.log(`   Clicks: ${query.clicks.toLocaleString()}`);
    console.log(`   Impressions: ${query.impressions.toLocaleString()}`);
    console.log(`   CTR: ${(query.ctr * 100).toFixed(2)}%`);
    console.log(`   Average Position: ${query.position.toFixed(1)}`);
    console.log('');
  });

  return topQueries;
}

// ============================================================================
// Example 4: Analyze Top Performing Pages
// ============================================================================

export async function topPagesExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  const topPages = await gsc.getTopPages(startDate, endDate, 20);

  console.log('\n=== Top 20 Pages ===\n');

  topPages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.url}`);
    console.log(`   Clicks: ${page.clicks.toLocaleString()}`);
    console.log(`   Impressions: ${page.impressions.toLocaleString()}`);
    console.log(`   CTR: ${(page.ctr * 100).toFixed(2)}%`);
    console.log(`   Position: ${page.position.toFixed(1)}`);
    console.log('');
  });

  return topPages;
}

// ============================================================================
// Example 5: Device Performance Analysis
// ============================================================================

export async function deviceAnalysisExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  const deviceData = await gsc.getPerformanceByDevice(startDate, endDate);

  console.log('\n=== Performance by Device ===\n');

  const devices: Array<'DESKTOP' | 'MOBILE' | 'TABLET'> = ['DESKTOP', 'MOBILE', 'TABLET'];

  devices.forEach(deviceType => {
    const data = deviceData.get(deviceType);
    if (data) {
      console.log(`${deviceType}:`);
      console.log(`  Clicks: ${data.clicks.toLocaleString()}`);
      console.log(`  Impressions: ${data.impressions.toLocaleString()}`);
      console.log(`  CTR: ${(data.ctr * 100).toFixed(2)}%`);
      console.log(`  Position: ${data.position.toFixed(1)}`);
      console.log('');
    }
  });

  // Calculate mobile percentage
  const mobile = deviceData.get('MOBILE');
  const desktop = deviceData.get('DESKTOP');

  if (mobile && desktop) {
    const totalClicks = mobile.clicks + desktop.clicks;
    const mobilePercentage = (mobile.clicks / totalClicks) * 100;
    console.log(`Mobile Traffic: ${mobilePercentage.toFixed(1)}% of total clicks`);
  }

  return deviceData;
}

// ============================================================================
// Example 6: Geographic Performance Analysis
// ============================================================================

export async function geographicAnalysisExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  const countryData = await gsc.getPerformanceByCountry(startDate, endDate, 20);

  console.log('\n=== Performance by Country (Top 20) ===\n');

  countryData.forEach((item, index) => {
    console.log(`${index + 1}. ${item.country}`);
    console.log(`   Clicks: ${item.data.clicks.toLocaleString()}`);
    console.log(`   Impressions: ${item.data.impressions.toLocaleString()}`);
    console.log(`   CTR: ${(item.data.ctr * 100).toFixed(2)}%`);
    console.log(`   Position: ${item.data.position.toFixed(1)}`);
    console.log('');
  });

  return countryData;
}

// ============================================================================
// Example 7: Period Comparison
// ============================================================================

export async function periodComparisonExample() {
  const gsc = basicSetup();

  // Compare this month vs last month
  const currentMonth = getLastNDays(30);
  const previousMonth = {
    startDate: formatGSCDate(new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)),
    endDate: formatGSCDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
  };

  const comparison = await gsc.comparePerformance(
    currentMonth.startDate,
    currentMonth.endDate,
    previousMonth.startDate,
    previousMonth.endDate
  );

  console.log('\n=== Performance Comparison ===\n');

  console.log(`Current Period: ${comparison.current.period.startDate} to ${comparison.current.period.endDate}`);
  console.log(`Previous Period: ${comparison.previous.period.startDate} to ${comparison.previous.period.endDate}\n`);

  const formatChange = (change: { absolute: number; percentage: number }) => {
    const sign = change.absolute >= 0 ? '+' : '';
    return `${sign}${change.absolute.toLocaleString()} (${sign}${change.percentage.toFixed(1)}%)`;
  };

  console.log(`Clicks: ${comparison.current.totalClicks.toLocaleString()} ${formatChange(comparison.changes.clicks)}`);
  console.log(`Impressions: ${comparison.current.totalImpressions.toLocaleString()} ${formatChange(comparison.changes.impressions)}`);
  console.log(`CTR: ${(comparison.current.averageCtr * 100).toFixed(2)}% ${formatChange(comparison.changes.ctr)}`);
  console.log(`Position: ${comparison.current.averagePosition.toFixed(1)} ${formatChange(comparison.changes.position)}`);

  return comparison;
}

// ============================================================================
// Example 8: URL Inspection
// ============================================================================

export async function urlInspectionExample() {
  const gsc = basicSetup();

  const urlsToInspect = [
    'https://example.com/',
    'https://example.com/blog/post-1',
    'https://example.com/products/item-123'
  ];

  console.log('\n=== URL Inspection Results ===\n');

  for (const url of urlsToInspect) {
    try {
      const result = await gsc.inspectUrl(url);

      console.log(`URL: ${result.inspectionUrl}`);
      console.log(`Indexed: ${result.isIndexed ? '✅ Yes' : '❌ No'}`);
      console.log(`Status: ${result.indexStatus}`);

      if (result.googleCanonicalUrl) {
        console.log(`Canonical: ${result.googleCanonicalUrl}`);
      }

      if (result.lastCrawlTime) {
        console.log(`Last Crawled: ${new Date(result.lastCrawlTime).toLocaleString()}`);
      }

      if (result.richResults && result.richResults.length > 0) {
        console.log('Rich Results:');
        result.richResults.forEach(rr => {
          console.log(`  - ${rr.type} (${rr.status})`);
        });
      }

      const allIssues = [
        ...(result.crawlIssues || []),
        ...(result.indexingIssues || []),
        ...(result.mobileUsabilityIssues || [])
      ];

      if (allIssues.length > 0) {
        console.log('⚠️  Issues:');
        allIssues.forEach(issue => console.log(`  - ${issue}`));
      }

      console.log('');

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Error inspecting ${url}:`, error);
    }
  }
}

// ============================================================================
// Example 9: Sitemap Management
// ============================================================================

export async function sitemapManagementExample() {
  const gsc = basicSetup();

  console.log('\n=== Sitemap Management ===\n');

  // List all sitemaps
  const sitemaps = await gsc.listSitemaps();

  console.log(`Found ${sitemaps.length} sitemap(s):\n`);

  sitemaps.forEach(sitemap => {
    console.log(`Sitemap: ${sitemap.path}`);
    console.log(`  Status: ${sitemap.status}`);
    console.log(`  URLs Submitted: ${sitemap.urlsSubmitted?.toLocaleString() || 'N/A'}`);
    console.log(`  URLs Indexed: ${sitemap.urlsIndexed?.toLocaleString() || 'N/A'}`);

    if (sitemap.urlsSubmitted && sitemap.urlsIndexed) {
      const coverage = (sitemap.urlsIndexed / sitemap.urlsSubmitted) * 100;
      console.log(`  Index Coverage: ${coverage.toFixed(1)}%`);
    }

    if (sitemap.lastSubmitted) {
      console.log(`  Last Submitted: ${new Date(sitemap.lastSubmitted).toLocaleString()}`);
    }

    if (sitemap.errors && sitemap.errors.length > 0) {
      console.log(`  Errors (${sitemap.errors.length}):`);
      sitemap.errors.forEach(err => {
        console.log(`    - ${err.message}`);
      });
    }

    console.log('');
  });

  // Submit a new sitemap (example)
  // await gsc.submitSitemap('https://example.com/sitemap.xml');
  // console.log('✅ Sitemap submitted successfully');

  return sitemaps;
}

// ============================================================================
// Example 10: Advanced Query Filtering
// ============================================================================

export async function advancedFilteringExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  // Example: Get mobile traffic for US only
  const query: SearchAnalyticsQuery = {
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    dimensionFilterGroups: [
      {
        filters: [
          {
            dimension: 'country',
            operator: 'equals',
            expression: 'usa'
          },
          {
            dimension: 'device',
            operator: 'equals',
            expression: 'MOBILE'
          }
        ]
      }
    ],
    rowLimit: 100
  };

  const data = await gsc.getSearchAnalytics(query);

  console.log('\n=== Mobile Traffic from USA ===\n');
  console.log(`Found ${data.rows.length} queries\n`);

  data.rows.slice(0, 10).forEach((row, index) => {
    const [query, page] = row.keys || [];
    console.log(`${index + 1}. Query: "${query}"`);
    console.log(`   Page: ${page}`);
    console.log(`   Clicks: ${row.clicks}, CTR: ${(row.ctr * 100).toFixed(2)}%`);
    console.log('');
  });

  return data;
}

// ============================================================================
// Example 11: Find Low-Hanging Fruit (Optimization Opportunities)
// ============================================================================

export async function optimizationOpportunitiesExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  // Get all queries
  const data = await gsc.getSearchAnalytics({
    startDate,
    endDate,
    dimensions: ['query', 'page'],
    rowLimit: 1000
  });

  console.log('\n=== SEO Optimization Opportunities ===\n');

  // 1. High impressions, low CTR (title/description optimization needed)
  const lowCtrOpportunities = data.rows
    .filter(row => row.impressions > 100 && row.ctr < 0.02 && row.position < 20)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 10);

  console.log('1. Low CTR Opportunities (Improve Title/Meta Description):\n');
  lowCtrOpportunities.forEach((row, i) => {
    const [query, page] = row.keys || [];
    console.log(`${i + 1}. Query: "${query}"`);
    console.log(`   Page: ${page}`);
    console.log(`   Impressions: ${row.impressions}, CTR: ${(row.ctr * 100).toFixed(2)}%, Position: ${row.position.toFixed(1)}`);
    console.log(`   💡 Potential: ${Math.round(row.impressions * 0.05 - row.clicks)} more clicks if CTR reaches 5%`);
    console.log('');
  });

  // 2. Position 11-20 (just below first page - content optimization needed)
  const secondPageOpportunities = data.rows
    .filter(row => row.position >= 11 && row.position <= 20 && row.impressions > 50)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10);

  console.log('\n2. Second Page Opportunities (Content Optimization):\n');
  secondPageOpportunities.forEach((row, i) => {
    const [query, page] = row.keys || [];
    console.log(`${i + 1}. Query: "${query}"`);
    console.log(`   Page: ${page}`);
    console.log(`   Position: ${row.position.toFixed(1)}, Impressions: ${row.impressions}`);
    console.log(`   💡 Move to first page for ~3x more visibility`);
    console.log('');
  });

  // 3. High position, low clicks (investigate)
  const underperformingOpportunities = data.rows
    .filter(row => row.position <= 5 && row.clicks < 10 && row.impressions > 20)
    .sort((a, b) => a.position - b.position)
    .slice(0, 10);

  console.log('\n3. Underperforming Pages (High Position, Low Clicks):\n');
  underperformingOpportunities.forEach((row, i) => {
    const [query, page] = row.keys || [];
    console.log(`${i + 1}. Query: "${query}"`);
    console.log(`   Page: ${page}`);
    console.log(`   Position: ${row.position.toFixed(1)}, Clicks: ${row.clicks}, Impressions: ${row.impressions}`);
    console.log(`   💡 Check for canniblization or improve title/meta`);
    console.log('');
  });

  return {
    lowCtr: lowCtrOpportunities,
    secondPage: secondPageOpportunities,
    underperforming: underperformingOpportunities
  };
}

// ============================================================================
// Example 12: SEO Health Check
// ============================================================================

export async function seoHealthCheckExample() {
  const gsc = basicSetup();
  const { startDate, endDate } = getLastNDays(30);

  console.log('\n=== SEO Health Check ===\n');

  // Get overall metrics
  const summary = await gsc.getPerformanceSummary(startDate, endDate);
  const deviceData = await gsc.getPerformanceByDevice(startDate, endDate);
  const sitemaps = await gsc.listSitemaps();

  // Calculate health score
  let score = 100;
  const issues: string[] = [];
  const recommendations: string[] = [];

  // Check 1: CTR
  if (summary.averageCtr < 0.02) {
    score -= 15;
    issues.push('❌ Low average CTR (< 2%)');
    recommendations.push('Improve meta titles and descriptions');
  } else if (summary.averageCtr < 0.05) {
    score -= 5;
    issues.push('⚠️  Average CTR could be better (< 5%)');
  }

  // Check 2: Mobile traffic
  const mobile = deviceData.get('MOBILE');
  const desktop = deviceData.get('DESKTOP');
  if (mobile && desktop) {
    const mobilePercentage = (mobile.clicks / (mobile.clicks + desktop.clicks)) * 100;
    if (mobilePercentage < 40) {
      score -= 10;
      issues.push('❌ Low mobile traffic (< 40%)');
      recommendations.push('Ensure mobile-friendly design and performance');
    }
  }

  // Check 3: Sitemap coverage
  const mainSitemap = sitemaps[0];
  if (mainSitemap && mainSitemap.urlsSubmitted && mainSitemap.urlsIndexed) {
    const coverage = (mainSitemap.urlsIndexed / mainSitemap.urlsSubmitted) * 100;
    if (coverage < 70) {
      score -= 20;
      issues.push(`❌ Low sitemap coverage (${coverage.toFixed(1)}%)`);
      recommendations.push('Check for indexing issues and fix sitemap errors');
    } else if (coverage < 90) {
      score -= 10;
      issues.push(`⚠️  Sitemap coverage could be better (${coverage.toFixed(1)}%)`);
    }
  }

  // Check 4: Average position
  if (summary.averagePosition > 20) {
    score -= 15;
    issues.push('❌ Low average position (> 20)');
    recommendations.push('Improve content quality and on-page SEO');
  } else if (summary.averagePosition > 10) {
    score -= 5;
    issues.push('⚠️  Average position could be better (> 10)');
  }

  // Report
  console.log(`SEO Health Score: ${Math.max(0, score)}/100\n`);

  if (issues.length === 0) {
    console.log('✅ No major issues found! Your SEO looks healthy.\n');
  } else {
    console.log('Issues Found:\n');
    issues.forEach(issue => console.log(`  ${issue}`));
    console.log('');
  }

  if (recommendations.length > 0) {
    console.log('Recommendations:\n');
    recommendations.forEach((rec, i) => console.log(`  ${i + 1}. ${rec}`));
    console.log('');
  }

  console.log('Key Metrics:');
  console.log(`  Total Clicks: ${summary.totalClicks.toLocaleString()}`);
  console.log(`  Average CTR: ${(summary.averageCtr * 100).toFixed(2)}%`);
  console.log(`  Average Position: ${summary.averagePosition.toFixed(1)}`);
  if (mobile && desktop) {
    const mobilePercentage = (mobile.clicks / (mobile.clicks + desktop.clicks)) * 100;
    console.log(`  Mobile Traffic: ${mobilePercentage.toFixed(1)}%`);
  }

  return {
    score: Math.max(0, score),
    issues,
    recommendations,
    metrics: summary
  };
}

// ============================================================================
// Example 13: Automated Weekly Report
// ============================================================================

export async function weeklyReportExample() {
  const gsc = basicSetup();

  const thisWeek = getLastNDays(7);
  const lastWeek = {
    startDate: formatGSCDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)),
    endDate: formatGSCDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  };

  console.log('\n=== Weekly SEO Report ===\n');
  console.log(`Report Date: ${new Date().toLocaleDateString()}\n`);

  // Get comparison data
  const comparison = await gsc.comparePerformance(
    thisWeek.startDate,
    thisWeek.endDate,
    lastWeek.startDate,
    lastWeek.endDate
  );

  // Get top performers
  const [topQueries, topPages] = await Promise.all([
    gsc.getTopQueries(thisWeek.startDate, thisWeek.endDate, 5),
    gsc.getTopPages(thisWeek.startDate, thisWeek.endDate, 5)
  ]);

  // Performance summary
  console.log('Performance Summary:');
  console.log(`This Week: ${thisWeek.startDate} to ${thisWeek.endDate}`);
  console.log(`Last Week: ${lastWeek.startDate} to ${lastWeek.endDate}\n`);

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  };

  console.log(`Clicks: ${comparison.current.totalClicks.toLocaleString()} (${formatChange(comparison.changes.clicks.percentage)})`);
  console.log(`Impressions: ${comparison.current.totalImpressions.toLocaleString()} (${formatChange(comparison.changes.impressions.percentage)})`);
  console.log(`CTR: ${(comparison.current.averageCtr * 100).toFixed(2)}% (${formatChange(comparison.changes.ctr.percentage)})`);
  console.log(`Position: ${comparison.current.averagePosition.toFixed(1)} (${formatChange(comparison.changes.position.percentage)})`);

  // Top queries
  console.log('\n\nTop 5 Queries This Week:');
  topQueries.forEach((q, i) => {
    console.log(`${i + 1}. "${q.query}" - ${q.clicks} clicks`);
  });

  // Top pages
  console.log('\n\nTop 5 Pages This Week:');
  topPages.forEach((p, i) => {
    console.log(`${i + 1}. ${p.url} - ${p.clicks} clicks`);
  });

  console.log('\n---\n');

  return {
    comparison,
    topQueries,
    topPages
  };
}

// ============================================================================
// Export all examples
// ============================================================================

export default {
  basicSetup,
  performanceSummaryExample,
  topQueriesExample,
  topPagesExample,
  deviceAnalysisExample,
  geographicAnalysisExample,
  periodComparisonExample,
  urlInspectionExample,
  sitemapManagementExample,
  advancedFilteringExample,
  optimizationOpportunitiesExample,
  seoHealthCheckExample,
  weeklyReportExample
};
