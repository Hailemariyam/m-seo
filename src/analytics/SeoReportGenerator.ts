// src/analytics/SeoReportGenerator.ts

/**
 * SEO Report Generator
 *
 * Generates comprehensive, customizable SEO reports in multiple formats:
 * - HTML reports with charts and visualizations
 * - PDF reports (via HTML conversion)
 * - Excel/CSV reports for data analysis
 * - JSON reports for API consumption
 * - Markdown reports for documentation
 *
 * Combines data from multiple sources:
 * - SEO Audit Engine results
 * - Google Analytics metrics
 * - Google Search Console data
 * - Custom metrics and KPIs
 *
 * @example
 * ```typescript
 * const generator = new SeoReportGenerator({
 *   title: 'Monthly SEO Report',
 *   period: { start: '2024-01-01', end: '2024-01-31' }
 * });
 *
 * generator.addAuditData(auditResults);
 * generator.addAnalyticsData(gaData);
 * generator.addSearchConsoleData(gscData);
 *
 * const report = await generator.generate('html');
 * ```
 */

import type { AuditResult } from './SeoAuditEngine.js';

export interface ReportConfig {
  title: string;
  subtitle?: string;
  period?: {
    start: string;
    end: string;
  };
  author?: string;
  company?: string;
  logo?: string;
  theme?: 'light' | 'dark' | 'professional' | 'modern';
  includeCharts?: boolean;
  includeRecommendations?: boolean;
  includeExecutiveSummary?: boolean;
  customSections?: ReportSection[];
}

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  order?: number;
  type?: 'text' | 'chart' | 'table' | 'metrics' | 'custom';
}

export interface ReportMetric {
  label: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  icon?: string;
  color?: string;
  description?: string;
}

export interface AnalyticsData {
  pageViews: number;
  sessions: number;
  users: number;
  bounceRate: number;
  avgSessionDuration: number;
  conversions?: number;
  conversionRate?: number;
  topPages?: Array<{
    path: string;
    views: number;
    avgTime: number;
    bounceRate?: number;
    conversions?: number;
  }>;
  topSources?: Array<{
    source: string;
    users: number;
    percentage: number;
  }>;
  deviceBreakdown?: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
}

export interface SearchConsoleData {
  totalClicks: number;
  totalImpressions: number;
  averageCTR: number;
  averagePosition: number;
  topQueries?: Array<{
    query: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  topPages?: Array<{
    page: string;
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  }>;
  countryBreakdown?: Array<{
    country: string;
    clicks: number;
    impressions: number;
  }>;
}

export interface KeywordData {
  keyword: string;
  position: number;
  previousPosition?: number;
  searchVolume?: number;
  difficulty?: number;
  url?: string;
  change?: number;
}

export interface BacklinkData {
  totalBacklinks: number;
  referringDomains: number;
  domainAuthority?: number;
  topBacklinks?: Array<{
    url: string;
    domain: string;
    authority: number;
    anchor: string;
    type?: 'dofollow' | 'nofollow';
    firstSeen?: string;
  }>;
}

export interface CompetitorData {
  name: string;
  url: string;
  metrics: {
    organicKeywords?: number;
    organicTraffic?: number;
    backlinks?: number;
    domainAuthority?: number;
    topKeywords?: string[];
    contentPages?: number;
    blogPosts?: number;
  };
}

export interface ReportData {
  config: ReportConfig;
  audit?: AuditResult;
  analytics?: AnalyticsData;
  searchConsole?: SearchConsoleData;
  keywords?: KeywordData[];
  backlinks?: BacklinkData;
  competitors?: CompetitorData[];
  customMetrics?: ReportMetric[];
  sections?: ReportSection[];
}

export interface GeneratedReport {
  format: ReportFormat;
  content: string;
  metadata: {
    generatedAt: Date;
    title: string;
    period?: string;
    pageCount?: number;
  };
}

export type ReportFormat = 'html' | 'pdf' | 'json' | 'csv' | 'markdown' | 'excel';

export class SeoReportGenerator {
  private data: Partial<ReportData>;
  private config: ReportConfig;

  constructor(config: ReportConfig) {
    this.config = {
      includeCharts: true,
      includeRecommendations: true,
      includeExecutiveSummary: true,
      theme: 'professional',
      ...config
    };
    this.data = { config: this.config };
  }

  /**
   * Add SEO audit data to the report
   */
  addAuditData(auditResult: AuditResult): this {
    this.data.audit = auditResult;
    return this;
  }

  /**
   * Add Google Analytics data to the report
   */
  addAnalyticsData(analyticsData: AnalyticsData): this {
    this.data.analytics = analyticsData;
    return this;
  }

  /**
   * Add Google Search Console data to the report
   */
  addSearchConsoleData(searchConsoleData: SearchConsoleData): this {
    this.data.searchConsole = searchConsoleData;
    return this;
  }

  /**
   * Add keyword ranking data to the report
   */
  addKeywordData(keywords: KeywordData[]): this {
    this.data.keywords = keywords;
    return this;
  }

  /**
   * Add backlink data to the report
   */
  addBacklinkData(backlinkData: BacklinkData): this {
    this.data.backlinks = backlinkData;
    return this;
  }

  /**
   * Add competitor analysis data to the report
   */
  addCompetitorData(competitors: CompetitorData[]): this {
    this.data.competitors = competitors;
    return this;
  }

  /**
   * Add custom metrics to the report
   */
  addCustomMetrics(metrics: ReportMetric[]): this {
    this.data.customMetrics = metrics;
    return this;
  }

  /**
   * Add custom sections to the report
   */
  addCustomSection(section: ReportSection): this {
    if (!this.data.sections) {
      this.data.sections = [];
    }
    this.data.sections.push(section);
    return this;
  }

  /**
   * Generate the report in specified format
   */
  async generate(format: ReportFormat = 'html'): Promise<GeneratedReport> {
    switch (format) {
      case 'html':
        return this.generateHTML();
      case 'json':
        return this.generateJSON();
      case 'markdown':
        return this.generateMarkdown();
      case 'csv':
        return this.generateCSV();
      case 'pdf':
        return this.generatePDF();
      case 'excel':
        return this.generateExcel();
      default:
        throw new Error(`Unsupported format: ${format}`);
    }
  }

  /**
   * Generate HTML report
   */
  private generateHTML(): GeneratedReport {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.config.title}</title>
  <style>
    ${this.getHTMLStyles()}
  </style>
</head>
<body class="theme-${this.config.theme}">
  <div class="report-container">
    ${this.generateHTMLHeader()}
    ${this.config.includeExecutiveSummary ? this.generateExecutiveSummary() : ''}
    ${this.generateHTMLMetricsOverview()}
    ${this.data.audit ? this.generateAuditSection() : ''}
    ${this.data.analytics ? this.generateAnalyticsSection() : ''}
    ${this.data.searchConsole ? this.generateSearchConsoleSection() : ''}
    ${this.data.keywords ? this.generateKeywordSection() : ''}
    ${this.data.backlinks ? this.generateBacklinkSection() : ''}
    ${this.data.competitors ? this.generateCompetitorSection() : ''}
    ${this.generateCustomSections()}
    ${this.config.includeRecommendations ? this.generateRecommendationsSection() : ''}
    ${this.generateHTMLFooter()}
  </div>
  ${this.config.includeCharts ? this.generateChartScripts() : ''}
</body>
</html>
    `.trim();

    return {
      format: 'html',
      content: html,
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  /**
   * Generate JSON report
   */
  private generateJSON(): GeneratedReport {
    const jsonData = {
      title: this.config.title,
      subtitle: this.config.subtitle,
      period: this.config.period,
      generatedAt: new Date().toISOString(),
      ...this.data
    };

    return {
      format: 'json',
      content: JSON.stringify(jsonData, null, 2),
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  /**
   * Generate Markdown report
   */
  private generateMarkdown(): GeneratedReport {
    let markdown = `# ${this.config.title}\n\n`;

    if (this.config.subtitle) {
      markdown += `${this.config.subtitle}\n\n`;
    }

    if (this.config.period) {
      markdown += `**Report Period:** ${this.config.period.start} to ${this.config.period.end}\n\n`;
    }

    markdown += `**Generated:** ${new Date().toISOString()}\n\n`;
    markdown += `---\n\n`;

    // Executive Summary
    if (this.config.includeExecutiveSummary) {
      markdown += `## Executive Summary\n\n`;
      markdown += this.generateMarkdownExecutiveSummary();
      markdown += `\n---\n\n`;
    }

    // Metrics Overview
    markdown += `## Key Metrics\n\n`;
    markdown += this.generateMarkdownMetrics();
    markdown += `\n---\n\n`;

    // Audit Section
    if (this.data.audit) {
      markdown += `## SEO Audit Results\n\n`;
      markdown += `**Overall Score:** ${this.data.audit.overallScore}/100\n\n`;
      markdown += `### Issues Summary\n\n`;
      markdown += `- Critical Issues: ${this.data.audit.summary.criticalIssues}\n`;
      markdown += `- Warnings: ${this.data.audit.summary.warnings}\n`;
      markdown += `- Info Items: ${this.data.audit.summary.infoItems}\n\n`;

      markdown += `### Category Scores\n\n`;
      Object.entries(this.data.audit.categoryScores).forEach(([category, score]) => {
        const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
        markdown += `- ${emoji} **${category}:** ${score}/100\n`;
      });
      markdown += `\n---\n\n`;
    }

    // Analytics Section
    if (this.data.analytics) {
      markdown += `## Google Analytics Data\n\n`;
      markdown += `- **Page Views:** ${this.formatNumber(this.data.analytics.pageViews)}\n`;
      markdown += `- **Sessions:** ${this.formatNumber(this.data.analytics.sessions)}\n`;
      markdown += `- **Users:** ${this.formatNumber(this.data.analytics.users)}\n`;
      markdown += `- **Bounce Rate:** ${this.data.analytics.bounceRate.toFixed(2)}%\n`;
      markdown += `- **Avg Session Duration:** ${this.formatDuration(this.data.analytics.avgSessionDuration)}\n\n`;
      markdown += `---\n\n`;
    }

    // Search Console Section
    if (this.data.searchConsole) {
      markdown += `## Google Search Console Data\n\n`;
      markdown += `- **Total Clicks:** ${this.formatNumber(this.data.searchConsole.totalClicks)}\n`;
      markdown += `- **Total Impressions:** ${this.formatNumber(this.data.searchConsole.totalImpressions)}\n`;
      markdown += `- **Average CTR:** ${this.data.searchConsole.averageCTR.toFixed(2)}%\n`;
      markdown += `- **Average Position:** ${this.data.searchConsole.averagePosition.toFixed(1)}\n\n`;

      if (this.data.searchConsole.topQueries && this.data.searchConsole.topQueries.length > 0) {
        markdown += `### Top Queries\n\n`;
        markdown += `| Query | Clicks | Impressions | CTR | Position |\n`;
        markdown += `|-------|--------|-------------|-----|----------|\n`;
        this.data.searchConsole.topQueries.slice(0, 10).forEach(q => {
          markdown += `| ${q.query} | ${q.clicks} | ${q.impressions} | ${q.ctr.toFixed(2)}% | ${q.position.toFixed(1)} |\n`;
        });
        markdown += `\n`;
      }
      markdown += `---\n\n`;
    }

    // Keywords Section
    if (this.data.keywords && this.data.keywords.length > 0) {
      markdown += `## Keyword Rankings\n\n`;
      markdown += `| Keyword | Position | Change | Search Volume |\n`;
      markdown += `|---------|----------|--------|---------------|\n`;
      this.data.keywords.slice(0, 20).forEach(k => {
        const change = k.change !== undefined ? (k.change > 0 ? `📈 +${k.change}` : k.change < 0 ? `📉 ${k.change}` : '—') : '—';
        markdown += `| ${k.keyword} | ${k.position} | ${change} | ${k.searchVolume || '—'} |\n`;
      });
      markdown += `\n---\n\n`;
    }

    // Recommendations
    if (this.config.includeRecommendations && this.data.audit) {
      markdown += `## Recommendations\n\n`;
      this.data.audit.recommendations.forEach((rec, idx) => {
        markdown += `${idx + 1}. ${rec}\n`;
      });
      markdown += `\n---\n\n`;
    }

    markdown += `\n*Report generated by m-seo on ${new Date().toLocaleDateString()}*\n`;

    return {
      format: 'markdown',
      content: markdown,
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  /**
   * Generate CSV report
   */
  private generateCSV(): GeneratedReport {
    let csv = '';

    // Header
    csv += `SEO Report,${this.config.title}\n`;
    if (this.config.period) {
      csv += `Period,${this.config.period.start} to ${this.config.period.end}\n`;
    }
    csv += `Generated,${new Date().toISOString()}\n\n`;

    // Metrics
    if (this.data.audit) {
      csv += `\nSEO Audit Metrics\n`;
      csv += `Metric,Value\n`;
      csv += `Overall Score,${this.data.audit.overallScore}\n`;
      csv += `Critical Issues,${this.data.audit.summary.criticalIssues}\n`;
      csv += `Warnings,${this.data.audit.summary.warnings}\n`;
      csv += `Info Items,${this.data.audit.summary.infoItems}\n`;
    }

    if (this.data.analytics) {
      csv += `\nAnalytics Metrics\n`;
      csv += `Metric,Value\n`;
      csv += `Page Views,${this.data.analytics.pageViews}\n`;
      csv += `Sessions,${this.data.analytics.sessions}\n`;
      csv += `Users,${this.data.analytics.users}\n`;
      csv += `Bounce Rate,${this.data.analytics.bounceRate}%\n`;
    }

    if (this.data.searchConsole) {
      csv += `\nSearch Console Metrics\n`;
      csv += `Metric,Value\n`;
      csv += `Total Clicks,${this.data.searchConsole.totalClicks}\n`;
      csv += `Total Impressions,${this.data.searchConsole.totalImpressions}\n`;
      csv += `Average CTR,${this.data.searchConsole.averageCTR}%\n`;
      csv += `Average Position,${this.data.searchConsole.averagePosition}\n`;

      if (this.data.searchConsole.topQueries) {
        csv += `\nTop Queries\n`;
        csv += `Query,Clicks,Impressions,CTR,Position\n`;
        this.data.searchConsole.topQueries.forEach(q => {
          csv += `"${q.query}",${q.clicks},${q.impressions},${q.ctr},${q.position}\n`;
        });
      }
    }

    if (this.data.keywords) {
      csv += `\nKeyword Rankings\n`;
      csv += `Keyword,Position,Change,Search Volume\n`;
      this.data.keywords.forEach(k => {
        csv += `"${k.keyword}",${k.position},${k.change || ''},${k.searchVolume || ''}\n`;
      });
    }

    return {
      format: 'csv',
      content: csv,
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  /**
   * Generate PDF report (placeholder - would need PDF library)
   */
  private generatePDF(): GeneratedReport {
    // In production, would use libraries like:
    // - puppeteer (HTML to PDF)
    // - pdfkit
    // - jsPDF

    // Could convert HTML report to PDF
    // const htmlReport = this.generateHTML();

    return {
      format: 'pdf',
      content: '<!-- PDF generation requires additional libraries like puppeteer -->',
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  /**
   * Generate Excel report (placeholder)
   */
  private generateExcel(): GeneratedReport {
    // In production, would use libraries like:
    // - exceljs
    // - xlsx

    return {
      format: 'excel',
      content: '<!-- Excel generation requires additional libraries like exceljs -->',
      metadata: {
        generatedAt: new Date(),
        title: this.config.title,
        period: this.config.period ? `${this.config.period.start} - ${this.config.period.end}` : undefined
      }
    };
  }

  // HTML Generation Helper Methods

  private getHTMLStyles(): string {
    return `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        line-height: 1.6;
        color: #333;
        background: #f5f5f5;
      }
      .theme-professional { background: #f8f9fa; }
      .theme-modern { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
      .theme-dark { background: #1a1a1a; color: #e0e0e0; }
      .theme-light { background: #ffffff; }

      .report-container {
        max-width: 1200px;
        margin: 0 auto;
        background: white;
        box-shadow: 0 0 40px rgba(0,0,0,0.1);
      }
      .theme-dark .report-container { background: #2a2a2a; }

      .report-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 60px 40px;
        text-align: center;
      }
      .report-header h1 {
        font-size: 2.5em;
        margin-bottom: 10px;
        font-weight: 700;
      }
      .report-header .subtitle {
        font-size: 1.2em;
        opacity: 0.9;
      }
      .report-header .period {
        margin-top: 20px;
        font-size: 1em;
        opacity: 0.8;
      }

      .section {
        padding: 40px;
        border-bottom: 1px solid #eee;
      }
      .section h2 {
        font-size: 2em;
        margin-bottom: 20px;
        color: #667eea;
      }
      .theme-dark .section h2 { color: #9f7aea; }

      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        margin: 30px 0;
      }
      .metric-card {
        background: #f8f9fa;
        padding: 25px;
        border-radius: 12px;
        border-left: 4px solid #667eea;
        transition: transform 0.2s;
      }
      .metric-card:hover { transform: translateY(-5px); }
      .theme-dark .metric-card { background: #333; }

      .metric-card .label {
        font-size: 0.9em;
        color: #666;
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .metric-card .value {
        font-size: 2.2em;
        font-weight: 700;
        color: #333;
      }
      .theme-dark .metric-card .value { color: #e0e0e0; }

      .metric-card .change {
        font-size: 0.9em;
        margin-top: 8px;
      }
      .change.positive { color: #10b981; }
      .change.negative { color: #ef4444; }

      .score-badge {
        display: inline-block;
        font-size: 3em;
        font-weight: 700;
        color: white;
        background: linear-gradient(135deg, #10b981, #059669);
        padding: 20px 40px;
        border-radius: 50px;
        box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
      }
      .score-badge.warning { background: linear-gradient(135deg, #f59e0b, #d97706); }
      .score-badge.danger { background: linear-gradient(135deg, #ef4444, #dc2626); }

      .chart-container {
        margin: 30px 0;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 12px;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
      }
      th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #eee;
      }
      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #667eea;
      }
      tr:hover { background: #f8f9fa; }

      .issue-list {
        margin: 20px 0;
      }
      .issue-item {
        padding: 15px;
        margin: 10px 0;
        border-left: 4px solid #667eea;
        background: #f8f9fa;
        border-radius: 4px;
      }
      .issue-item.critical { border-left-color: #ef4444; }
      .issue-item.warning { border-left-color: #f59e0b; }
      .issue-item.info { border-left-color: #3b82f6; }

      .recommendation-list {
        margin: 20px 0;
      }
      .recommendation {
        padding: 15px 15px 15px 45px;
        margin: 10px 0;
        background: #ecfdf5;
        border-radius: 8px;
        position: relative;
      }
      .recommendation:before {
        content: '✓';
        position: absolute;
        left: 15px;
        top: 15px;
        color: #10b981;
        font-size: 1.5em;
        font-weight: 700;
      }

      .footer {
        padding: 40px;
        text-align: center;
        background: #f8f9fa;
        color: #666;
        font-size: 0.9em;
      }

      @media print {
        body { background: white; }
        .report-container { box-shadow: none; }
        .section { page-break-inside: avoid; }
      }
    `;
  }

  private generateHTMLHeader(): string {
    let header = `<div class="report-header">`;

    if (this.config.logo) {
      header += `<img src="${this.config.logo}" alt="Logo" style="max-height: 60px; margin-bottom: 20px;">`;
    }

    header += `<h1>${this.config.title}</h1>`;

    if (this.config.subtitle) {
      header += `<div class="subtitle">${this.config.subtitle}</div>`;
    }

    if (this.config.period) {
      header += `<div class="period">Report Period: ${this.config.period.start} to ${this.config.period.end}</div>`;
    }

    header += `</div>`;
    return header;
  }

  private generateExecutiveSummary(): string {
    let summary = `<div class="section executive-summary">`;
    summary += `<h2>📊 Executive Summary</h2>`;

    if (this.data.audit) {
      const scoreClass = this.data.audit.overallScore >= 80 ? '' :
                        this.data.audit.overallScore >= 60 ? 'warning' : 'danger';
      summary += `<div style="text-align: center; margin: 30px 0;">`;
      summary += `<div class="score-badge ${scoreClass}">${this.data.audit.overallScore}/100</div>`;
      summary += `<p style="margin-top: 15px; font-size: 1.1em; color: #666;">Overall SEO Health Score</p>`;
      summary += `</div>`;
    }

    summary += `<p style="font-size: 1.1em; line-height: 1.8; margin: 20px 0;">`;
    summary += this.generateSummaryText();
    summary += `</p>`;

    summary += `</div>`;
    return summary;
  }

  private generateSummaryText(): string {
    const parts: string[] = [];

    if (this.data.audit) {
      if (this.data.audit.overallScore >= 80) {
        parts.push(`Your website demonstrates strong SEO performance with an overall score of ${this.data.audit.overallScore}/100.`);
      } else if (this.data.audit.overallScore >= 60) {
        parts.push(`Your website shows moderate SEO performance with an overall score of ${this.data.audit.overallScore}/100. There are opportunities for improvement.`);
      } else {
        parts.push(`Your website requires significant SEO improvements with a current score of ${this.data.audit.overallScore}/100.`);
      }

      if (this.data.audit.summary.criticalIssues > 0) {
        parts.push(`${this.data.audit.summary.criticalIssues} critical issues require immediate attention.`);
      }
    }

    if (this.data.searchConsole) {
      parts.push(`Your content received ${this.formatNumber(this.data.searchConsole.totalClicks)} clicks from ${this.formatNumber(this.data.searchConsole.totalImpressions)} impressions in search results.`);
    }

    if (this.data.analytics) {
      parts.push(`The website attracted ${this.formatNumber(this.data.analytics.users)} users across ${this.formatNumber(this.data.analytics.sessions)} sessions.`);
    }

    return parts.join(' ');
  }

  private generateHTMLMetricsOverview(): string {
    let html = `<div class="section metrics-overview">`;
    html += `<h2>📈 Key Performance Indicators</h2>`;
    html += `<div class="metrics-grid">`;

    // Add metrics based on available data
    if (this.data.audit) {
      html += this.createMetricCard('SEO Score', `${this.data.audit.overallScore}/100`,
        undefined, this.data.audit.overallScore >= 80 ? 'positive' : 'negative');
      html += this.createMetricCard('Total Issues', this.data.audit.summary.totalIssues.toString(),
        undefined, 'neutral');
    }

    if (this.data.analytics) {
      html += this.createMetricCard('Total Users', this.formatNumber(this.data.analytics.users));
      html += this.createMetricCard('Page Views', this.formatNumber(this.data.analytics.pageViews));
      html += this.createMetricCard('Bounce Rate', `${this.data.analytics.bounceRate.toFixed(1)}%`);
      html += this.createMetricCard('Avg. Session Duration', this.formatDuration(this.data.analytics.avgSessionDuration));
    }

    if (this.data.searchConsole) {
      html += this.createMetricCard('Total Clicks', this.formatNumber(this.data.searchConsole.totalClicks));
      html += this.createMetricCard('Impressions', this.formatNumber(this.data.searchConsole.totalImpressions));
      html += this.createMetricCard('Average CTR', `${this.data.searchConsole.averageCTR.toFixed(2)}%`);
      html += this.createMetricCard('Avg. Position', this.data.searchConsole.averagePosition.toFixed(1));
    }

    if (this.data.customMetrics) {
      this.data.customMetrics.forEach(metric => {
        html += this.createMetricCard(metric.label, metric.value.toString(),
          metric.change, metric.changeType);
      });
    }

    html += `</div></div>`;
    return html;
  }

  private createMetricCard(label: string, value: string, change?: number, changeType?: string): string {
    let card = `<div class="metric-card">`;
    card += `<div class="label">${label}</div>`;
    card += `<div class="value">${value}</div>`;

    if (change !== undefined) {
      const changeClass = changeType || (change > 0 ? 'positive' : change < 0 ? 'negative' : 'neutral');
      const changeSymbol = change > 0 ? '↑' : change < 0 ? '↓' : '—';
      card += `<div class="change ${changeClass}">${changeSymbol} ${Math.abs(change)}%</div>`;
    }

    card += `</div>`;
    return card;
  }

  private generateAuditSection(): string {
    if (!this.data.audit) return '';

    let html = `<div class="section audit-section">`;
    html += `<h2>🔍 SEO Audit Results</h2>`;

    // Category scores
    html += `<h3>Category Performance</h3>`;
    html += `<div class="metrics-grid">`;
    Object.entries(this.data.audit.categoryScores).forEach(([category, score]) => {
      html += this.createMetricCard(category, `${score}/100`);
    });
    html += `</div>`;

    // Top issues
    if (this.data.audit.issues.length > 0) {
      html += `<h3 style="margin-top: 40px;">Top Issues</h3>`;
      html += `<div class="issue-list">`;
      this.data.audit.issues.slice(0, 10).forEach(issue => {
        html += `<div class="issue-item ${issue.severity}">`;
        html += `<strong>${issue.title}</strong> [${issue.severity.toUpperCase()}]<br>`;
        html += `<span style="color: #666;">${issue.description}</span><br>`;
        html += `<span style="color: #10b981;">💡 ${issue.recommendation}</span>`;
        html += `</div>`;
      });
      html += `</div>`;
    }

    html += `</div>`;
    return html;
  }

  private generateAnalyticsSection(): string {
    if (!this.data.analytics) return '';

    let html = `<div class="section analytics-section">`;
    html += `<h2>📊 Google Analytics</h2>`;

    // Top pages
    if (this.data.analytics.topPages && this.data.analytics.topPages.length > 0) {
      html += `<h3>Top Pages</h3>`;
      html += `<table>`;
      html += `<thead><tr><th>Page</th><th>Views</th><th>Avg. Time</th></tr></thead>`;
      html += `<tbody>`;
      this.data.analytics.topPages.slice(0, 10).forEach(page => {
        html += `<tr>`;
        html += `<td>${page.path}</td>`;
        html += `<td>${this.formatNumber(page.views)}</td>`;
        html += `<td>${this.formatDuration(page.avgTime)}</td>`;
        html += `</tr>`;
      });
      html += `</tbody></table>`;
    }

    html += `</div>`;
    return html;
  }

  private generateSearchConsoleSection(): string {
    if (!this.data.searchConsole) return '';

    let html = `<div class="section search-console-section">`;
    html += `<h2>🔎 Google Search Console</h2>`;

    // Top queries
    if (this.data.searchConsole.topQueries && this.data.searchConsole.topQueries.length > 0) {
      html += `<h3>Top Performing Queries</h3>`;
      html += `<table>`;
      html += `<thead><tr><th>Query</th><th>Clicks</th><th>Impressions</th><th>CTR</th><th>Position</th></tr></thead>`;
      html += `<tbody>`;
      this.data.searchConsole.topQueries.slice(0, 10).forEach(query => {
        html += `<tr>`;
        html += `<td>${query.query}</td>`;
        html += `<td>${this.formatNumber(query.clicks)}</td>`;
        html += `<td>${this.formatNumber(query.impressions)}</td>`;
        html += `<td>${query.ctr.toFixed(2)}%</td>`;
        html += `<td>${query.position.toFixed(1)}</td>`;
        html += `</tr>`;
      });
      html += `</tbody></table>`;
    }

    html += `</div>`;
    return html;
  }

  private generateKeywordSection(): string {
    if (!this.data.keywords || this.data.keywords.length === 0) return '';

    let html = `<div class="section keyword-section">`;
    html += `<h2>🎯 Keyword Rankings</h2>`;
    html += `<table>`;
    html += `<thead><tr><th>Keyword</th><th>Position</th><th>Change</th><th>Volume</th></tr></thead>`;
    html += `<tbody>`;

    this.data.keywords.slice(0, 20).forEach(keyword => {
      html += `<tr>`;
      html += `<td>${keyword.keyword}</td>`;
      html += `<td>${keyword.position}</td>`;
      html += `<td>${keyword.change !== undefined ? (keyword.change > 0 ? `<span class="change positive">↑ ${keyword.change}</span>` : keyword.change < 0 ? `<span class="change negative">↓ ${Math.abs(keyword.change)}</span>` : '—') : '—'}</td>`;
      html += `<td>${keyword.searchVolume || '—'}</td>`;
      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  private generateBacklinkSection(): string {
    if (!this.data.backlinks) return '';

    let html = `<div class="section backlink-section">`;
    html += `<h2>🔗 Backlink Profile</h2>`;
    html += `<div class="metrics-grid">`;
    html += this.createMetricCard('Total Backlinks', this.formatNumber(this.data.backlinks.totalBacklinks));
    html += this.createMetricCard('Referring Domains', this.formatNumber(this.data.backlinks.referringDomains));
    if (this.data.backlinks.domainAuthority) {
      html += this.createMetricCard('Domain Authority', this.data.backlinks.domainAuthority.toString());
    }
    html += `</div></div>`;
    return html;
  }

  private generateCompetitorSection(): string {
    if (!this.data.competitors || this.data.competitors.length === 0) return '';

    let html = `<div class="section competitor-section">`;
    html += `<h2>🏆 Competitor Analysis</h2>`;
    html += `<table>`;
    html += `<thead><tr><th>Competitor</th><th>Keywords</th><th>Traffic</th><th>Backlinks</th><th>DA</th></tr></thead>`;
    html += `<tbody>`;

    this.data.competitors.forEach(comp => {
      html += `<tr>`;
      html += `<td><strong>${comp.name}</strong><br><small>${comp.url}</small></td>`;
      html += `<td>${comp.metrics.organicKeywords ? this.formatNumber(comp.metrics.organicKeywords) : '—'}</td>`;
      html += `<td>${comp.metrics.organicTraffic ? this.formatNumber(comp.metrics.organicTraffic) : '—'}</td>`;
      html += `<td>${comp.metrics.backlinks ? this.formatNumber(comp.metrics.backlinks) : '—'}</td>`;
      html += `<td>${comp.metrics.domainAuthority || '—'}</td>`;
      html += `</tr>`;
    });

    html += `</tbody></table></div>`;
    return html;
  }

  private generateCustomSections(): string {
    if (!this.data.sections || this.data.sections.length === 0) return '';

    const sortedSections = [...this.data.sections].sort((a, b) => (a.order || 999) - (b.order || 999));

    return sortedSections.map(section => `
      <div class="section custom-section">
        <h2>${section.title}</h2>
        ${section.content}
      </div>
    `).join('');
  }

  private generateRecommendationsSection(): string {
    if (!this.data.audit || !this.data.audit.recommendations.length) return '';

    let html = `<div class="section recommendations-section">`;
    html += `<h2>💡 Key Recommendations</h2>`;
    html += `<div class="recommendation-list">`;

    this.data.audit.recommendations.forEach(rec => {
      html += `<div class="recommendation">${rec}</div>`;
    });

    html += `</div></div>`;
    return html;
  }

  private generateHTMLFooter(): string {
    return `
      <div class="footer">
        <p>Report generated by <strong>m-seo</strong> on ${new Date().toLocaleString()}</p>
        ${this.config.company ? `<p>${this.config.company}</p>` : ''}
        ${this.config.author ? `<p>Prepared by: ${this.config.author}</p>` : ''}
      </div>
    `;
  }

  private generateChartScripts(): string {
    // Placeholder for chart library integration (Chart.js, D3.js, etc.)
    return `
      <script>
        // Chart generation would go here
        console.log('Charts enabled');
      </script>
    `;
  }

  private generateMarkdownExecutiveSummary(): string {
    return this.generateSummaryText();
  }

  private generateMarkdownMetrics(): string {
    let md = '';

    if (this.data.audit) {
      md += `- **SEO Score:** ${this.data.audit.overallScore}/100\n`;
      md += `- **Total Issues:** ${this.data.audit.summary.totalIssues}\n`;
    }

    if (this.data.analytics) {
      md += `- **Users:** ${this.formatNumber(this.data.analytics.users)}\n`;
      md += `- **Sessions:** ${this.formatNumber(this.data.analytics.sessions)}\n`;
      md += `- **Page Views:** ${this.formatNumber(this.data.analytics.pageViews)}\n`;
    }

    if (this.data.searchConsole) {
      md += `- **Clicks:** ${this.formatNumber(this.data.searchConsole.totalClicks)}\n`;
      md += `- **Impressions:** ${this.formatNumber(this.data.searchConsole.totalImpressions)}\n`;
    }

    return md;
  }

  // Utility methods

  private formatNumber(num: number): string {
    return new Intl.NumberFormat().format(num);
  }

  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

/**
 * Create a new SEO Report Generator instance
 */
export function createSeoReportGenerator(config: ReportConfig): SeoReportGenerator {
  return new SeoReportGenerator(config);
}

/**
 * Quick report generation helper
 */
export async function generateQuickReport(
  title: string,
  data: Partial<ReportData>,
  format: ReportFormat = 'html'
): Promise<GeneratedReport> {
  const generator = new SeoReportGenerator({ title });

  if (data.audit) generator.addAuditData(data.audit);
  if (data.analytics) generator.addAnalyticsData(data.analytics);
  if (data.searchConsole) generator.addSearchConsoleData(data.searchConsole);
  if (data.keywords) generator.addKeywordData(data.keywords);
  if (data.backlinks) generator.addBacklinkData(data.backlinks);
  if (data.competitors) generator.addCompetitorData(data.competitors);

  return generator.generate(format);
}
