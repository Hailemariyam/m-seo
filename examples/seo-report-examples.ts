/**
 * SEO Report Generator Examples
 *
 * Comprehensive examples showing how to use the SeoReportGenerator
 * to create professional SEO reports in multiple formats.
 */

import {
  SeoReportGenerator,
  createSeoReportGenerator,
  generateQuickReport,
  quickAudit,
  type ReportConfig,
  type AnalyticsData,
  type SearchConsoleData,
  type KeywordData,
  type BacklinkData,
  type CompetitorData,
  type ReportMetric,
  type ReportSection
} from '../src/index';
import { writeFileSync } from 'fs';
import { join } from 'path';

// ==============================================
// Example 1: Basic Report Generation
// ==============================================

export async function example1_basicReport() {
  console.log('Example 1: Basic Report Generation');

  // Create generator with minimal config
  const generator = new SeoReportGenerator({
    title: 'Basic SEO Report',
    period: {
      start: '2024-01-01',
      end: '2024-01-31'
    }
  });

  // Add audit data
  const auditResults = await quickAudit('https://example.com');
  generator.addAuditData(auditResults);

  // Generate HTML report
  const htmlReport = await generator.generate('html');
  console.log('HTML Report Generated');
  console.log(`Size: ${htmlReport.content.length} bytes`);
  console.log(`Generated at: ${new Date().toISOString()}`);

  // Save to file
  writeFileSync('./basic-report.html', htmlReport.content);
  console.log('Saved to: basic-report.html\n');

  return htmlReport;
}

// ==============================================
// Example 2: Complete Multi-Source Report
// ==============================================

export async function example2_completeReport() {
  console.log('Example 2: Complete Multi-Source Report');

  const generator = new SeoReportGenerator({
    title: 'Monthly SEO Performance Report',
    subtitle: 'Comprehensive Analysis & Recommendations',
    period: {
      start: '2024-01-01',
      end: '2024-01-31'
    },
    author: 'SEO Team',
    company: 'Acme Corporation',
    theme: 'professional'
  });

  // 1. Add SEO Audit Data
  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  // 2. Add Google Analytics Data
  const analyticsData: AnalyticsData = {
    pageViews: 45230,
    sessions: 28150,
    users: 18420,
    bounceRate: 42.5,
    avgSessionDuration: 195,
    conversions: 342,
    conversionRate: 1.22,
    topPages: [
      {
        path: '/products/widget-pro',
        views: 8500,
        avgTime: 245,
        bounceRate: 38.2,
        conversions: 85
      },
      {
        path: '/blog/seo-guide',
        views: 6200,
        avgTime: 312,
        bounceRate: 28.5,
        conversions: 12
      },
      {
        path: '/pricing',
        views: 5800,
        avgTime: 180,
        bounceRate: 45.0,
        conversions: 125
      }
    ],
    topSources: [
      { source: 'organic', users: 12450, percentage: 67.6 },
      { source: 'direct', users: 4230, percentage: 23.0 },
      { source: 'referral', users: 1150, percentage: 6.2 },
      { source: 'social', users: 590, percentage: 3.2 }
    ],
    deviceBreakdown: {
      desktop: 58,
      mobile: 37,
      tablet: 5
    }
  };
  generator.addAnalyticsData(analyticsData);

  // 3. Add Search Console Data
  const searchConsoleData: SearchConsoleData = {
    totalClicks: 15420,
    totalImpressions: 385200,
    averageCTR: 4.0,
    averagePosition: 12.5,
    topQueries: [
      {
        query: 'best widget software',
        clicks: 1250,
        impressions: 18500,
        ctr: 6.76,
        position: 3.2
      },
      {
        query: 'widget pro review',
        clicks: 890,
        impressions: 12300,
        ctr: 7.24,
        position: 2.8
      },
      {
        query: 'affordable widgets',
        clicks: 680,
        impressions: 15600,
        ctr: 4.36,
        position: 5.1
      }
    ],
    topPages: [
      {
        page: '/products/widget-pro',
        clicks: 3200,
        impressions: 45000,
        ctr: 7.11,
        position: 2.5
      },
      {
        page: '/blog/seo-guide',
        clicks: 2100,
        impressions: 38000,
        ctr: 5.53,
        position: 4.2
      }
    ],
    countryBreakdown: [
      { country: 'United States', clicks: 8500, impressions: 185000 },
      { country: 'United Kingdom', clicks: 3200, impressions: 82000 },
      { country: 'Canada', clicks: 1850, impressions: 56000 }
    ]
  };
  generator.addSearchConsoleData(searchConsoleData);

  // 4. Add Keyword Rankings
  const keywords: KeywordData[] = [
    {
      keyword: 'widget software',
      position: 3,
      previousPosition: 5,
      change: -2,
      searchVolume: 12000,
      difficulty: 65,
      url: '/products/widget-pro'
    },
    {
      keyword: 'best widgets 2024',
      position: 8,
      previousPosition: 6,
      change: 2,
      searchVolume: 8500,
      difficulty: 58,
      url: '/products'
    },
    {
      keyword: 'widget tutorial',
      position: 2,
      previousPosition: 2,
      change: 0,
      searchVolume: 5600,
      difficulty: 42,
      url: '/blog/widget-tutorial'
    },
    {
      keyword: 'widget pricing',
      position: 1,
      previousPosition: 3,
      change: -2,
      searchVolume: 4200,
      difficulty: 38,
      url: '/pricing'
    }
  ];
  generator.addKeywordData(keywords);

  // 5. Add Backlink Data
  const backlinkData: BacklinkData = {
    totalBacklinks: 2450,
    referringDomains: 385,
    domainAuthority: 58,
    topBacklinks: [
      {
        url: 'https://techblog.com/best-widget-tools',
        domain: 'techblog.com',
        authority: 72,
        anchor: 'Widget Pro review',
        type: 'dofollow',
        firstSeen: '2024-01-15'
      },
      {
        url: 'https://industry-news.com/widgets',
        domain: 'industry-news.com',
        authority: 68,
        anchor: 'leading widget software',
        type: 'dofollow',
        firstSeen: '2024-01-08'
      },
      {
        url: 'https://softwarelist.io/widgets',
        domain: 'softwarelist.io',
        authority: 65,
        anchor: 'widget solutions',
        type: 'dofollow',
        firstSeen: '2024-01-22'
      }
    ]
  };
  generator.addBacklinkData(backlinkData);

  // 6. Add Competitor Data
  const competitors: CompetitorData[] = [
    {
      name: 'Competitor A',
      url: 'https://competitor-a.com',
      metrics: {
        organicKeywords: 15200,
        organicTraffic: 85000,
        backlinks: 5400,
        domainAuthority: 68,
        topKeywords: ['widget software', 'best widgets']
      }
    },
    {
      name: 'Competitor B',
      url: 'https://competitor-b.com',
      metrics: {
        organicKeywords: 12800,
        organicTraffic: 62000,
        backlinks: 3800,
        domainAuthority: 61,
        topKeywords: ['widget tools', 'widget reviews']
      }
    },
    {
      name: 'Competitor C',
      url: 'https://competitor-c.com',
      metrics: {
        organicKeywords: 8500,
        organicTraffic: 42000,
        backlinks: 2200,
        domainAuthority: 54,
        topKeywords: ['widget pricing', 'cheap widgets']
      }
    }
  ];
  generator.addCompetitorData(competitors);

  // Generate report
  const report = await generator.generate('html');
  writeFileSync('./complete-report.html', report.content);
  console.log('Complete report saved to: complete-report.html\n');

  return report;
}

// ==============================================
// Example 3: All Report Formats
// ==============================================

export async function example3_allFormats() {
  console.log('Example 3: Generate All Report Formats');

  const generator = new SeoReportGenerator({
    title: 'Multi-Format SEO Report',
    period: { start: '2024-01-01', end: '2024-01-31' }
  });

  // Add some data
  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  generator.addAnalyticsData({
    pageViews: 25000,
    sessions: 15000,
    users: 10000,
    bounceRate: 45.0,
    avgSessionDuration: 180
  });

  // Generate HTML
  const htmlReport = await generator.generate('html');
  writeFileSync('./report.html', htmlReport.content);
  console.log('✓ HTML report saved');

  // Generate JSON
  const jsonReport = await generator.generate('json');
  writeFileSync('./report.json', jsonReport.content);
  console.log('✓ JSON report saved');

  // Generate Markdown
  const mdReport = await generator.generate('markdown');
  writeFileSync('./report.md', mdReport.content);
  console.log('✓ Markdown report saved');

  // Generate CSV
  const csvReport = await generator.generate('csv');
  writeFileSync('./report.csv', csvReport.content);
  console.log('✓ CSV report saved');

  console.log('\nAll formats generated successfully!\n');

  return {
    html: htmlReport,
    json: jsonReport,
    markdown: mdReport,
    csv: csvReport
  };
}

// ==============================================
// Example 4: Custom Metrics Report
// ==============================================

export async function example4_customMetrics() {
  console.log('Example 4: Custom Metrics Report');

  const generator = new SeoReportGenerator({
    title: 'Custom KPI Dashboard',
    subtitle: 'Business Metrics & SEO Performance'
  });

  // Add custom business metrics
  const customMetrics: ReportMetric[] = [
    {
      label: 'Conversion Rate',
      value: '3.45%',
      change: 15,
      changeType: 'increase',
      color: '#10b981',
      description: 'Overall site conversion rate'
    },
    {
      label: 'Revenue from Organic',
      value: '$42,500',
      change: 22,
      changeType: 'increase',
      format: 'currency',
      color: '#10b981'
    },
    {
      label: 'Lead Generation',
      value: 245,
      change: 8,
      changeType: 'increase',
      format: 'number',
      color: '#10b981'
    },
    {
      label: 'Average Order Value',
      value: '$156',
      change: -3,
      changeType: 'decrease',
      format: 'currency',
      color: '#ef4444'
    },
    {
      label: 'Email Signups',
      value: 1842,
      change: 35,
      changeType: 'increase',
      format: 'number',
      color: '#10b981'
    },
    {
      label: 'Page Speed Score',
      value: 92,
      change: 5,
      changeType: 'increase',
      format: 'number',
      color: '#10b981'
    }
  ];

  generator.addCustomMetrics(customMetrics);

  // Also add standard SEO data
  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  const report = await generator.generate('html');
  writeFileSync('./custom-metrics-report.html', report.content);
  console.log('Custom metrics report saved\n');

  return report;
}

// ==============================================
// Example 5: Custom Sections Report
// ==============================================

export async function example5_customSections() {
  console.log('Example 5: Custom Sections Report');

  const generator = new SeoReportGenerator({
    title: 'Extended SEO Report',
    subtitle: 'With Custom Analysis Sections'
  });

  // Add custom section: Social Media Performance
  const socialSection: ReportSection = {
    id: 'social-media',
    title: 'Social Media Performance',
    content: `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="label">Facebook Engagement</div>
          <div class="value">12.5K</div>
          <div class="change positive">+18%</div>
        </div>
        <div class="metric-card">
          <div class="label">Twitter Followers</div>
          <div class="value">8.2K</div>
          <div class="change positive">+12%</div>
        </div>
        <div class="metric-card">
          <div class="label">LinkedIn Connections</div>
          <div class="value">5.4K</div>
          <div class="change positive">+8%</div>
        </div>
      </div>
      <h4>Top Performing Posts</h4>
      <ul>
        <li>SEO Best Practices Guide - 2.4K engagements</li>
        <li>Widget Pro Launch Announcement - 1.8K engagements</li>
        <li>Customer Success Story - 1.2K engagements</li>
      </ul>
    `,
    order: 5
  };
  generator.addCustomSection(socialSection);

  // Add custom section: Goals & Action Items
  const goalsSection: ReportSection = {
    id: 'goals',
    title: 'Q2 2024 Goals & Action Plan',
    content: `
      <h4>Primary Goals</h4>
      <ul>
        <li>Improve overall SEO score from 78 to 85+</li>
        <li>Increase organic traffic by 30%</li>
        <li>Achieve top 3 rankings for 5 primary keywords</li>
        <li>Reduce critical SEO issues to zero</li>
        <li>Improve Core Web Vitals scores</li>
      </ul>

      <h4>Action Items</h4>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Priority</th>
            <th>Owner</th>
            <th>Deadline</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Fix missing meta descriptions</td>
            <td>High</td>
            <td>Content Team</td>
            <td>Feb 15</td>
          </tr>
          <tr>
            <td>Optimize images for speed</td>
            <td>High</td>
            <td>Dev Team</td>
            <td>Feb 20</td>
          </tr>
          <tr>
            <td>Build backlinks from DA60+ sites</td>
            <td>Medium</td>
            <td>SEO Team</td>
            <td>Mar 30</td>
          </tr>
        </tbody>
      </table>
    `,
    order: 10
  };
  generator.addCustomSection(goalsSection);

  // Add standard data
  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  const report = await generator.generate('html');
  writeFileSync('./custom-sections-report.html', report.content);
  console.log('Custom sections report saved\n');

  return report;
}

// ==============================================
// Example 6: Theme Comparison
// ==============================================

export async function example6_themes() {
  console.log('Example 6: Theme Comparison');

  const themes: Array<'light' | 'dark' | 'professional' | 'modern'> = [
    'light',
    'dark',
    'professional',
    'modern'
  ];

  const auditData = await quickAudit('https://example.com');

  for (const theme of themes) {
    const generator = new SeoReportGenerator({
      title: `SEO Report - ${theme.charAt(0).toUpperCase() + theme.slice(1)} Theme`,
      theme
    });

    generator.addAuditData(auditData);
    generator.addAnalyticsData({
      pageViews: 30000,
      sessions: 18000,
      users: 12000,
      bounceRate: 44.5,
      avgSessionDuration: 185
    });

    const report = await generator.generate('html');
    writeFileSync(`./report-${theme}.html`, report.content);
    console.log(`✓ ${theme} theme report saved`);
  }

  console.log('\nAll theme variants generated!\n');
}

// ==============================================
// Example 7: Competitor Analysis Report
// ==============================================

export async function example7_competitorAnalysis() {
  console.log('Example 7: Competitor Analysis Report');

  const generator = new SeoReportGenerator({
    title: 'Competitive SEO Analysis',
    subtitle: 'Market Position & Opportunities',
    theme: 'professional'
  });

  const competitors: CompetitorData[] = [
    {
      name: 'Our Website',
      url: 'https://example.com',
      metrics: {
        organicKeywords: 8500,
        organicTraffic: 45000,
        backlinks: 2400,
        domainAuthority: 52,
        topKeywords: [
          'widget software',
          'best widgets',
          'widget tools'
        ],
        contentPages: 350,
        blogPosts: 125
      }
    },
    {
      name: 'Market Leader',
      url: 'https://market-leader.com',
      metrics: {
        organicKeywords: 25000,
        organicTraffic: 180000,
        backlinks: 12500,
        domainAuthority: 78,
        topKeywords: [
          'widgets',
          'widget platform',
          'enterprise widgets'
        ],
        contentPages: 850,
        blogPosts: 420
      }
    },
    {
      name: 'Direct Competitor',
      url: 'https://competitor.com',
      metrics: {
        organicKeywords: 12000,
        organicTraffic: 68000,
        backlinks: 4200,
        domainAuthority: 61,
        topKeywords: [
          'widget solutions',
          'widget software',
          'widget api'
        ],
        contentPages: 480,
        blogPosts: 215
      }
    },
    {
      name: 'Emerging Player',
      url: 'https://emerging.com',
      metrics: {
        organicKeywords: 5200,
        organicTraffic: 28000,
        backlinks: 1800,
        domainAuthority: 48,
        topKeywords: [
          'modern widgets',
          'widget startup',
          'widget innovation'
        ],
        contentPages: 180,
        blogPosts: 95
      }
    }
  ];

  generator.addCompetitorData(competitors);

  // Add custom analysis section
  generator.addCustomSection({
    id: 'competitive-insights',
    title: 'Key Competitive Insights',
    content: `
      <h4>Opportunities</h4>
      <ul>
        <li><strong>Content Gap:</strong> Market leader has 3x more blog content - opportunity for content expansion</li>
        <li><strong>Backlink Acquisition:</strong> Our backlink growth rate (+15% monthly) outpaces competitors</li>
        <li><strong>Keyword Targeting:</strong> 3,500 keywords where competitors rank but we don't</li>
        <li><strong>Emerging Markets:</strong> Low competition in "modern widget" and "widget API" keywords</li>
      </ul>

      <h4>Threats</h4>
      <ul>
        <li><strong>Domain Authority Gap:</strong> 26 points behind market leader</li>
        <li><strong>Traffic Share:</strong> We have only 15% of total market organic traffic</li>
        <li><strong>Top Keywords:</strong> Direct competitor dominates 8 of our target keywords</li>
      </ul>

      <h4>Recommended Actions</h4>
      <ol>
        <li>Launch aggressive content marketing campaign (target: 50 blog posts/quarter)</li>
        <li>Focus on building DA60+ backlinks (target: 100 new domains/quarter)</li>
        <li>Target underserved keywords with low competition</li>
        <li>Improve technical SEO to match competitor site speed</li>
      </ol>
    `,
    order: 2
  });

  const report = await generator.generate('html');
  writeFileSync('./competitor-analysis.html', report.content);
  console.log('Competitor analysis report saved\n');

  return report;
}

// ==============================================
// Example 8: Keyword Tracking Report
// ==============================================

export async function example8_keywordTracking() {
  console.log('Example 8: Keyword Tracking Report');

  const generator = new SeoReportGenerator({
    title: 'Keyword Rankings Report',
    subtitle: 'Monthly Position Tracking',
    period: { start: '2024-01-01', end: '2024-01-31' }
  });

  const keywords: KeywordData[] = [
    // Winners - Improved rankings
    {
      keyword: 'widget software comparison',
      position: 2,
      previousPosition: 7,
      change: -5,
      searchVolume: 8900,
      difficulty: 62,
      url: '/compare'
    },
    {
      keyword: 'best widget tools 2024',
      position: 1,
      previousPosition: 4,
      change: -3,
      searchVolume: 12000,
      difficulty: 68,
      url: '/blog/best-tools'
    },
    {
      keyword: 'widget tutorial beginners',
      position: 3,
      previousPosition: 8,
      change: -5,
      searchVolume: 5600,
      difficulty: 45,
      url: '/tutorial'
    },

    // Stable - No change
    {
      keyword: 'widget pricing',
      position: 1,
      previousPosition: 1,
      change: 0,
      searchVolume: 4200,
      difficulty: 38,
      url: '/pricing'
    },
    {
      keyword: 'widget documentation',
      position: 2,
      previousPosition: 2,
      change: 0,
      searchVolume: 3100,
      difficulty: 35,
      url: '/docs'
    },

    // Losers - Dropped rankings
    {
      keyword: 'enterprise widgets',
      position: 12,
      previousPosition: 8,
      change: 4,
      searchVolume: 9500,
      difficulty: 72,
      url: '/enterprise'
    },
    {
      keyword: 'widget api integration',
      position: 15,
      previousPosition: 11,
      change: 4,
      searchVolume: 6800,
      difficulty: 58,
      url: '/api'
    }
  ];

  generator.addKeywordData(keywords);

  // Add custom summary
  generator.addCustomSection({
    id: 'keyword-summary',
    title: 'Keyword Performance Summary',
    content: `
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="label">Total Keywords Tracked</div>
          <div class="value">47</div>
        </div>
        <div class="metric-card">
          <div class="label">Keywords Improved</div>
          <div class="value">18</div>
          <div class="change positive">+38%</div>
        </div>
        <div class="metric-card">
          <div class="label">Keywords Declined</div>
          <div class="value">8</div>
          <div class="change negative">-17%</div>
        </div>
        <div class="metric-card">
          <div class="label">Stable Rankings</div>
          <div class="value">21</div>
          <div class="change">45%</div>
        </div>
      </div>

      <h4>Top Movers</h4>
      <ul>
        <li>✅ "widget software comparison" jumped from #7 to #2 (+5 positions)</li>
        <li>✅ "widget tutorial beginners" improved from #8 to #3 (+5 positions)</li>
        <li>✅ "best widget tools 2024" climbed to #1 from #4 (+3 positions)</li>
        <li>⚠️ "enterprise widgets" dropped from #8 to #12 (-4 positions)</li>
        <li>⚠️ "widget api integration" fell from #11 to #15 (-4 positions)</li>
      </ul>
    `,
    order: 1
  });

  const report = await generator.generate('html');
  writeFileSync('./keyword-tracking.html', report.content);
  console.log('Keyword tracking report saved\n');

  return report;
}

// ==============================================
// Example 9: Quick Report Helper
// ==============================================

export async function example9_quickReport() {
  console.log('Example 9: Quick Report Helper');

  // Run audit
  const auditResults = await quickAudit('https://example.com');

  // Generate report in one line
  const report = await generateQuickReport(
    'Quick SEO Audit',
    { audit: auditResults },
    'html'
  );

  writeFileSync('./quick-report.html', report.content);
  console.log('Quick report generated and saved\n');

  return report;
}

// ==============================================
// Example 10: Factory Function
// ==============================================

export async function example10_factoryFunction() {
  console.log('Example 10: Using Factory Function');

  // Create generator using factory function
  const generator = createSeoReportGenerator({
    title: 'Factory-Created Report',
    theme: 'modern'
  });

  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  const report = await generator.generate('html');
  writeFileSync('./factory-report.html', report.content);
  console.log('Factory-created report saved\n');

  return report;
}

// ==============================================
// Example 11: Client Deliverable Package
// ==============================================

export async function example11_clientPackage() {
  console.log('Example 11: Client Deliverable Package');

  const generator = new SeoReportGenerator({
    title: 'Q1 2024 SEO Performance Report',
    subtitle: 'Comprehensive Analysis for Client XYZ',
    period: { start: '2024-01-01', end: '2024-03-31' },
    author: 'SEO Agency Pro',
    company: 'Client XYZ Corp',
    logo: 'https://client-xyz.com/logo.png',
    theme: 'professional'
  });

  // Add comprehensive data
  const auditData = await quickAudit('https://client-xyz.com');
  generator.addAuditData(auditData);

  generator
    .addAnalyticsData({
      pageViews: 125000,
      sessions: 78000,
      users: 52000,
      bounceRate: 39.8,
      avgSessionDuration: 220,
      conversions: 1240,
      conversionRate: 1.59
    })
    .addSearchConsoleData({
      totalClicks: 45000,
      totalImpressions: 1200000,
      averageCTR: 3.75,
      averagePosition: 14.2
    })
    .addKeywordData([
      { keyword: 'primary keyword', position: 3, previousPosition: 8, change: -5, searchVolume: 15000 },
      { keyword: 'secondary keyword', position: 5, previousPosition: 12, change: -7, searchVolume: 8900 }
    ])
    .addBacklinkData({
      totalBacklinks: 3200,
      referringDomains: 450,
      domainAuthority: 61
    });

  // Generate multiple formats
  const htmlReport = await generator.generate('html');
  const jsonReport = await generator.generate('json');
  const mdReport = await generator.generate('markdown');
  const csvData = await generator.generate('csv');

  // Save all
  const outputDir = './client-deliverables';
  writeFileSync(`${outputDir}/client-xyz-q1-2024.html`, htmlReport.content);
  writeFileSync(`${outputDir}/client-xyz-q1-2024.json`, jsonReport.content);
  writeFileSync(`${outputDir}/client-xyz-q1-2024.md`, mdReport.content);
  writeFileSync(`${outputDir}/client-xyz-q1-2024.csv`, csvData.content);

  console.log('Client package created with 4 formats\n');

  return { htmlReport, jsonReport, mdReport, csvData };
}

// ==============================================
// Example 12: Automated Weekly Reports
// ==============================================

export async function example12_automatedWeekly() {
  console.log('Example 12: Automated Weekly Report');

  function getWeekNumber() {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.floor(diff / oneWeek) + 1;
  }

  function getLastWeekDates() {
    const now = new Date();
    const end = new Date(now);
    end.setDate(end.getDate() - 1);
    const start = new Date(end);
    start.setDate(start.getDate() - 7);

    return {
      start: start.toISOString().split('T')[0],
      end: end.toISOString().split('T')[0]
    };
  }

  const weekNumber = getWeekNumber();
  const dates = getLastWeekDates();

  const generator = new SeoReportGenerator({
    title: `Weekly SEO Report - Week ${weekNumber}`,
    period: dates,
    theme: 'modern'
  });

  // Fetch fresh data (simulated)
  const auditData = await quickAudit('https://example.com');

  generator
    .addAuditData(auditData)
    .addAnalyticsData({
      pageViews: 5200,
      sessions: 3100,
      users: 2400,
      bounceRate: 43.5,
      avgSessionDuration: 175
    });

  const report = await generator.generate('html');

  const filename = `weekly-report-${dates.start}.html`;
  writeFileSync(filename, report.content);
  console.log(`Weekly report saved: ${filename}\n`);

  // In production, you would:
  // await sendEmail({ to: 'team@example.com', html: report.content });

  return report;
}

// ==============================================
// Example 13: Data-Only JSON Export
// ==============================================

export async function example13_dataExport() {
  console.log('Example 13: Data-Only JSON Export');

  const generator = new SeoReportGenerator({
    title: 'SEO Data Export'
  });

  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  generator.addAnalyticsData({
    pageViews: 30000,
    sessions: 18000,
    users: 12000,
    bounceRate: 42.0,
    avgSessionDuration: 190
  });

  // Generate JSON for API/database storage
  const jsonReport = await generator.generate('json');
  const data = JSON.parse(jsonReport.content);

  console.log('Data structure:', Object.keys(data));
  console.log('Audit score:', data.data.audit?.overallScore);
  console.log('Analytics pageviews:', data.data.analytics?.pageViews);

  writeFileSync('./seo-data-export.json', jsonReport.content);
  console.log('Data exported to JSON\n');

  return data;
}

// ==============================================
// Example 14: Markdown Documentation Report
// ==============================================

export async function example14_markdownDocs() {
  console.log('Example 14: Markdown Documentation Report');

  const generator = new SeoReportGenerator({
    title: 'SEO Status Report',
    subtitle: 'GitHub Documentation',
    period: { start: '2024-01-01', end: '2024-01-31' }
  });

  const auditData = await quickAudit('https://example.com');
  generator.addAuditData(auditData);

  // Generate markdown for GitHub/docs
  const mdReport = await generator.generate('markdown');
  writeFileSync('./SEO-STATUS.md', mdReport.content);
  console.log('Markdown report saved for documentation\n');

  return mdReport;
}

// ==============================================
// Example 15: CSV Data Analysis
// ==============================================

export async function example15_csvAnalysis() {
  console.log('Example 15: CSV Data Analysis Export');

  const generator = new SeoReportGenerator({
    title: 'SEO Metrics for Analysis'
  });

  generator
    .addAnalyticsData({
      pageViews: 40000,
      sessions: 25000,
      users: 16000,
      bounceRate: 41.5,
      avgSessionDuration: 200
    })
    .addSearchConsoleData({
      totalClicks: 18000,
      totalImpressions: 450000,
      averageCTR: 4.0,
      averagePosition: 11.5
    });

  // Generate CSV for Excel/Google Sheets
  const csvReport = await generator.generate('csv');
  writeFileSync('./seo-metrics.csv', csvReport.content);
  console.log('CSV data exported for spreadsheet analysis\n');

  return csvReport;
}

// ==============================================
// Example 16: Method Chaining
// ==============================================

export async function example16_methodChaining() {
  console.log('Example 16: Method Chaining Pattern');

  const auditData = await quickAudit('https://example.com');

  // Fluent interface - chain all methods
  const report = await new SeoReportGenerator({
    title: 'Chained Report',
    theme: 'modern'
  })
    .addAuditData(auditData)
    .addAnalyticsData({
      pageViews: 35000,
      sessions: 20000,
      users: 14000,
      bounceRate: 40.0,
      avgSessionDuration: 210
    })
    .addSearchConsoleData({
      totalClicks: 16000,
      totalImpressions: 400000,
      averageCTR: 4.0,
      averagePosition: 12.0
    })
    .addCustomMetrics([
      { label: 'Conversion Rate', value: '3.2%', change: 12, changeType: 'increase' }
    ])
    .generate('html');

  writeFileSync('./chained-report.html', report.content);
  console.log('Chained method report saved\n');

  return report;
}

// ==============================================
// Run All Examples
// ==============================================

export async function runAllExamples() {
  console.log('========================================');
  console.log('SEO Report Generator - All Examples');
  console.log('========================================\n');

  try {
    await example1_basicReport();
    await example2_completeReport();
    await example3_allFormats();
    await example4_customMetrics();
    await example5_customSections();
    await example6_themes();
    await example7_competitorAnalysis();
    await example8_keywordTracking();
    await example9_quickReport();
    await example10_factoryFunction();
    await example11_clientPackage();
    await example12_automatedWeekly();
    await example13_dataExport();
    await example14_markdownDocs();
    await example15_csvAnalysis();
    await example16_methodChaining();

    console.log('========================================');
    console.log('All examples completed successfully! ✅');
    console.log('========================================');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runAllExamples();
}
