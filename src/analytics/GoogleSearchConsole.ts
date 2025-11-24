/**
 * Google Search Console Integration
 *
 * This module provides a comprehensive interface for interacting with Google Search Console API.
 * It enables monitoring search performance, managing sitemaps, inspecting URLs, and analyzing
 * search analytics data.
 *
 * @module GoogleSearchConsole
 * @see https://developers.google.com/webmaster-tools
 */

/**
 * Search Analytics Dimension Types
 */
export type SearchDimension = 'query' | 'page' | 'country' | 'device' | 'searchAppearance' | 'date';

/**
 * Device Types
 */
export type DeviceType = 'DESKTOP' | 'MOBILE' | 'TABLET';

/**
 * Search Appearance Types
 */
export type SearchAppearanceType =
  | 'AMP_BLUE_LINKS'
  | 'AMP_STORIES'
  | 'RICH_RESULTS'
  | 'VIDEO'
  | 'IMAGE'
  | 'NEWS';

/**
 * URL Inspection Status
 */
export type InspectionStatus =
  | 'INDEXED'
  | 'SUBMITTED_AND_INDEXED'
  | 'CRAWLED_NOT_INDEXED'
  | 'DISCOVERED_NOT_INDEXED'
  | 'PAGE_WITH_REDIRECT'
  | 'SOFT_404'
  | 'DUPLICATE'
  | 'BLOCKED_BY_ROBOTS'
  | 'NOT_FOUND'
  | 'ERROR';

/**
 * Sitemap Status
 */
export type SitemapStatus = 'SUCCESS' | 'WARNING' | 'ERROR' | 'PENDING';

/**
 * Configuration for Google Search Console API
 */
export interface GSCConfig {
  /** Your site URL (must be verified in Google Search Console) */
  siteUrl: string;

  /** Google API Key or OAuth2 credentials */
  credentials: GSCCredentials;

  /** Optional: Default date range for queries (in days) */
  defaultDateRange?: number;

  /** Optional: Enable debug logging */
  debug?: boolean;

  /** Optional: API endpoint override (for testing) */
  apiEndpoint?: string;
}

/**
 * Authentication Credentials
 */
export interface GSCCredentials {
  /** OAuth2 access token */
  accessToken?: string;

  /** API Key (less secure, limited functionality) */
  apiKey?: string;

  /** OAuth2 refresh token */
  refreshToken?: string;

  /** Client ID for OAuth2 */
  clientId?: string;

  /** Client Secret for OAuth2 */
  clientSecret?: string;
}

/**
 * Search Analytics Query Parameters
 */
export interface SearchAnalyticsQuery {
  /** Start date (YYYY-MM-DD) */
  startDate: string;

  /** End date (YYYY-MM-DD) */
  endDate: string;

  /** Dimensions to group by */
  dimensions?: SearchDimension[];

  /** Filter queries (e.g., country, device) */
  dimensionFilterGroups?: DimensionFilterGroup[];

  /** Type of search (web, image, video, news) */
  searchType?: 'web' | 'image' | 'video' | 'news';

  /** Aggregation type */
  aggregationType?: 'auto' | 'byPage' | 'byProperty';

  /** Maximum number of rows to return */
  rowLimit?: number;

  /** Zero-based index of the first row to return */
  startRow?: number;
}

/**
 * Dimension Filter Group
 */
export interface DimensionFilterGroup {
  filters: DimensionFilter[];
  groupType?: 'and';
}

/**
 * Dimension Filter
 */
export interface DimensionFilter {
  dimension: SearchDimension;
  operator: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'includingRegex' | 'excludingRegex';
  expression: string;
}

/**
 * Search Analytics Row
 */
export interface SearchAnalyticsRow {
  /** Keys corresponding to the requested dimensions */
  keys?: string[];

  /** Number of clicks */
  clicks: number;

  /** Number of impressions */
  impressions: number;

  /** Click-through rate (clicks / impressions) */
  ctr: number;

  /** Average position in search results */
  position: number;
}

/**
 * Search Analytics Response
 */
export interface SearchAnalyticsResponse {
  rows: SearchAnalyticsRow[];
  responseAggregationType?: string;
}

/**
 * URL Inspection Result
 */
export interface URLInspectionResult {
  /** The inspected URL */
  inspectionUrl: string;

  /** Index status */
  indexStatus: InspectionStatus;

  /** Whether the page is indexed */
  isIndexed: boolean;

  /** Crawl date */
  lastCrawlTime?: string;

  /** Discovered date */
  discoveryTime?: string;

  /** Canonical URL */
  canonicalUrl?: string;

  /** User-declared canonical URL */
  userCanonicalUrl?: string;

  /** Google-selected canonical URL */
  googleCanonicalUrl?: string;

  /** Crawling issues */
  crawlIssues?: string[];

  /** Indexing issues */
  indexingIssues?: string[];

  /** Mobile usability issues */
  mobileUsabilityIssues?: string[];

  /** Rich results found */
  richResults?: RichResult[];
}

/**
 * Rich Result Information
 */
export interface RichResult {
  type: string;
  status: 'VALID' | 'INVALID' | 'WARNING';
  items?: number;
  issues?: string[];
}

/**
 * Sitemap Information
 */
export interface SitemapInfo {
  /** Sitemap URL */
  path: string;

  /** Last download time */
  lastDownloaded?: string;

  /** Last submission time */
  lastSubmitted?: string;

  /** Whether it's a sitemap index */
  isSitemapsIndex?: boolean;

  /** Sitemap status */
  status?: SitemapStatus;

  /** Number of URLs submitted */
  urlsSubmitted?: number;

  /** Number of URLs indexed */
  urlsIndexed?: number;

  /** Errors encountered */
  errors?: SitemapError[];

  /** Warnings */
  warnings?: SitemapWarning[];
}

/**
 * Sitemap Error
 */
export interface SitemapError {
  code: string;
  message: string;
  count?: number;
}

/**
 * Sitemap Warning
 */
export interface SitemapWarning {
  code: string;
  message: string;
  count?: number;
}

/**
 * Search Performance Summary
 */
export interface PerformanceSummary {
  totalClicks: number;
  totalImpressions: number;
  averageCtr: number;
  averagePosition: number;
  period: {
    startDate: string;
    endDate: string;
  };
}

/**
 * Top Performing Query
 */
export interface TopQuery {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Top Performing Page
 */
export interface TopPage {
  url: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Coverage Issue
 */
export interface CoverageIssue {
  type: 'error' | 'warning' | 'excluded' | 'valid';
  category: string;
  count: number;
  examples?: string[];
}

/**
 * Google Search Console Client
 *
 * Provides methods to interact with Google Search Console API for monitoring
 * and improving your site's search performance.
 *
 * @example
 * ```typescript
 * const gsc = new GoogleSearchConsole({
 *   siteUrl: 'https://example.com',
 *   credentials: {
 *     accessToken: 'your-oauth-token'
 *   }
 * });
 *
 * // Get search analytics
 * const data = await gsc.getSearchAnalytics({
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   dimensions: ['query', 'page']
 * });
 * ```
 */
export class GoogleSearchConsole {
  private config: Required<GSCConfig>;
  private baseUrl: string;

  constructor(config: GSCConfig) {
    this.config = {
      defaultDateRange: 30,
      debug: false,
      apiEndpoint: 'https://searchconsole.googleapis.com/v1',
      ...config
    };

    this.baseUrl = this.config.apiEndpoint;

    if (this.config.debug) {
      console.log('[GSC] Initialized with site:', this.config.siteUrl);
    }
  }

  /**
   * Get search analytics data
   *
   * @param query - Search analytics query parameters
   * @returns Search analytics data
   *
   * @example
   * ```typescript
   * const analytics = await gsc.getSearchAnalytics({
   *   startDate: '2024-01-01',
   *   endDate: '2024-01-31',
   *   dimensions: ['query', 'page'],
   *   rowLimit: 100
   * });
   * ```
   */
  async getSearchAnalytics(query: SearchAnalyticsQuery): Promise<SearchAnalyticsResponse> {
    const url = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/searchAnalytics/query`;

    const body = {
      startDate: query.startDate,
      endDate: query.endDate,
      dimensions: query.dimensions || [],
      dimensionFilterGroups: query.dimensionFilterGroups || [],
      searchType: query.searchType || 'web',
      aggregationType: query.aggregationType || 'auto',
      rowLimit: query.rowLimit || 1000,
      startRow: query.startRow || 0
    };

    if (this.config.debug) {
      console.log('[GSC] Fetching search analytics:', body);
    }

    const response = await this.makeRequest<SearchAnalyticsResponse>(url, 'POST', body);
    return response;
  }

  /**
   * Get performance summary for a date range
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Performance summary
   */
  async getPerformanceSummary(startDate: string, endDate: string): Promise<PerformanceSummary> {
    const response = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: []
    });

    const totals = response.rows[0] || {
      clicks: 0,
      impressions: 0,
      ctr: 0,
      position: 0
    };

    return {
      totalClicks: totals.clicks,
      totalImpressions: totals.impressions,
      averageCtr: totals.ctr,
      averagePosition: totals.position,
      period: { startDate, endDate }
    };
  }

  /**
   * Get top performing queries
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param limit - Number of queries to return
   * @returns Top queries
   */
  async getTopQueries(startDate: string, endDate: string, limit: number = 10): Promise<TopQuery[]> {
    const response = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['query'],
      rowLimit: limit
    });

    return response.rows.map(row => ({
      query: row.keys?.[0] || '',
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position
    }));
  }

  /**
   * Get top performing pages
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param limit - Number of pages to return
   * @returns Top pages
   */
  async getTopPages(startDate: string, endDate: string, limit: number = 10): Promise<TopPage[]> {
    const response = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: limit
    });

    return response.rows.map(row => ({
      url: row.keys?.[0] || '',
      clicks: row.clicks,
      impressions: row.impressions,
      ctr: row.ctr,
      position: row.position
    }));
  }

  /**
   * Get performance by device type
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @returns Performance data grouped by device
   */
  async getPerformanceByDevice(startDate: string, endDate: string): Promise<Map<DeviceType, SearchAnalyticsRow>> {
    const response = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['device']
    });

    const deviceMap = new Map<DeviceType, SearchAnalyticsRow>();

    response.rows.forEach(row => {
      const device = row.keys?.[0] as DeviceType;
      if (device) {
        deviceMap.set(device, row);
      }
    });

    return deviceMap;
  }

  /**
   * Get performance by country
   *
   * @param startDate - Start date (YYYY-MM-DD)
   * @param endDate - End date (YYYY-MM-DD)
   * @param limit - Number of countries to return
   * @returns Performance data grouped by country
   */
  async getPerformanceByCountry(startDate: string, endDate: string, limit: number = 20): Promise<Array<{ country: string; data: SearchAnalyticsRow }>> {
    const response = await this.getSearchAnalytics({
      startDate,
      endDate,
      dimensions: ['country'],
      rowLimit: limit
    });

    return response.rows.map(row => ({
      country: row.keys?.[0] || '',
      data: row
    }));
  }

  /**
   * Inspect a specific URL
   *
   * @param url - URL to inspect
   * @returns URL inspection result
   *
   * @example
   * ```typescript
   * const result = await gsc.inspectUrl('https://example.com/page');
   * console.log('Indexed:', result.isIndexed);
   * console.log('Status:', result.indexStatus);
   * ```
   */
  async inspectUrl(url: string): Promise<URLInspectionResult> {
    const endpoint = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/urlInspection/index:inspect`;

    const body = {
      inspectionUrl: url,
      siteUrl: this.config.siteUrl
    };

    if (this.config.debug) {
      console.log('[GSC] Inspecting URL:', url);
    }

    const response = await this.makeRequest<any>(endpoint, 'POST', body);

    // Parse the response into our structured format
    const inspectionResult = response.inspectionResult || {};
    const indexStatusResult = inspectionResult.indexStatusResult || {};

    return {
      inspectionUrl: url,
      indexStatus: this.parseIndexStatus(indexStatusResult),
      isIndexed: indexStatusResult.verdict === 'PASS',
      lastCrawlTime: indexStatusResult.lastCrawlTime,
      canonicalUrl: indexStatusResult.googleCanonicalUrl,
      userCanonicalUrl: indexStatusResult.userCanonicalUrl,
      googleCanonicalUrl: indexStatusResult.googleCanonicalUrl,
      crawlIssues: inspectionResult.crawlIssues || [],
      indexingIssues: inspectionResult.indexingIssues || [],
      mobileUsabilityIssues: inspectionResult.mobileUsabilityIssues || [],
      richResults: this.parseRichResults(inspectionResult.richResultsResult)
    };
  }

  /**
   * List all sitemaps for the site
   *
   * @returns Array of sitemap information
   *
   * @example
   * ```typescript
   * const sitemaps = await gsc.listSitemaps();
   * sitemaps.forEach(sitemap => {
   *   console.log(`${sitemap.path}: ${sitemap.urlsIndexed}/${sitemap.urlsSubmitted} indexed`);
   * });
   * ```
   */
  async listSitemaps(): Promise<SitemapInfo[]> {
    const url = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/sitemaps`;

    if (this.config.debug) {
      console.log('[GSC] Listing sitemaps');
    }

    const response = await this.makeRequest<{ sitemap: any[] }>(url, 'GET');

    return (response.sitemap || []).map(this.parseSitemapInfo);
  }

  /**
   * Get information about a specific sitemap
   *
   * @param sitemapUrl - URL of the sitemap
   * @returns Sitemap information
   */
  async getSitemap(sitemapUrl: string): Promise<SitemapInfo> {
    const url = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    if (this.config.debug) {
      console.log('[GSC] Getting sitemap:', sitemapUrl);
    }

    const response = await this.makeRequest<any>(url, 'GET');
    return this.parseSitemapInfo(response);
  }

  /**
   * Submit a sitemap to Google Search Console
   *
   * @param sitemapUrl - URL of the sitemap to submit
   *
   * @example
   * ```typescript
   * await gsc.submitSitemap('https://example.com/sitemap.xml');
   * ```
   */
  async submitSitemap(sitemapUrl: string): Promise<void> {
    const url = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    if (this.config.debug) {
      console.log('[GSC] Submitting sitemap:', sitemapUrl);
    }

    await this.makeRequest<void>(url, 'PUT');
  }

  /**
   * Delete a sitemap from Google Search Console
   *
   * @param sitemapUrl - URL of the sitemap to delete
   */
  async deleteSitemap(sitemapUrl: string): Promise<void> {
    const url = `${this.baseUrl}/sites/${encodeURIComponent(this.config.siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`;

    if (this.config.debug) {
      console.log('[GSC] Deleting sitemap:', sitemapUrl);
    }

    await this.makeRequest<void>(url, 'DELETE');
  }

  /**
   * Request indexing for a specific URL
   *
   * Note: This uses the Indexing API, which has strict quotas and is primarily
   * for job postings and livestream videos. For other content, submit a sitemap instead.
   *
   * @param url - URL to request indexing for
   * @param type - Update type ('URL_UPDATED' or 'URL_DELETED')
   */
  async requestIndexing(url: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<void> {
    const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

    const body = {
      url: url,
      type: type
    };

    if (this.config.debug) {
      console.log('[GSC] Requesting indexing:', url, type);
    }

    await this.makeRequest<void>(endpoint, 'POST', body);
  }

  /**
   * Get index coverage issues
   *
   * Note: This is a simplified implementation. The actual API response structure
   * may vary and require additional parsing.
   *
   * @returns Array of coverage issues
   */
  async getCoverageIssues(): Promise<CoverageIssue[]> {
    // This would typically call the URL Testing Tools API
    // For now, we'll return a placeholder
    if (this.config.debug) {
      console.log('[GSC] Getting coverage issues (placeholder)');
    }

    // In a real implementation, this would make API calls to get actual data
    return [];
  }

  /**
   * Compare performance between two periods
   *
   * @param currentStart - Start date for current period
   * @param currentEnd - End date for current period
   * @param previousStart - Start date for previous period
   * @param previousEnd - End date for previous period
   * @returns Comparison data
   */
  async comparePerformance(
    currentStart: string,
    currentEnd: string,
    previousStart: string,
    previousEnd: string
  ): Promise<{
    current: PerformanceSummary;
    previous: PerformanceSummary;
    changes: {
      clicks: { absolute: number; percentage: number };
      impressions: { absolute: number; percentage: number };
      ctr: { absolute: number; percentage: number };
      position: { absolute: number; percentage: number };
    };
  }> {
    const [current, previous] = await Promise.all([
      this.getPerformanceSummary(currentStart, currentEnd),
      this.getPerformanceSummary(previousStart, previousEnd)
    ]);

    const calculateChange = (current: number, previous: number) => ({
      absolute: current - previous,
      percentage: previous > 0 ? ((current - previous) / previous) * 100 : 0
    });

    return {
      current,
      previous,
      changes: {
        clicks: calculateChange(current.totalClicks, previous.totalClicks),
        impressions: calculateChange(current.totalImpressions, previous.totalImpressions),
        ctr: calculateChange(current.averageCtr, previous.averageCtr),
        position: calculateChange(current.averagePosition, previous.averagePosition)
      }
    };
  }

  /**
   * Make an authenticated request to the API
   *
   * @private
   */
  private async makeRequest<T>(url: string, method: string, body?: any): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    // Add authentication
    if (this.config.credentials.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.credentials.accessToken}`;
    } else if (this.config.credentials.apiKey) {
      url += (url.includes('?') ? '&' : '?') + `key=${this.config.credentials.apiKey}`;
    } else {
      throw new Error('No valid credentials provided. Please provide either accessToken or apiKey.');
    }

    const options: RequestInit = {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) })
    };

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GSC API Error (${response.status}): ${errorText}`);
      }

      // Handle empty responses (e.g., from DELETE)
      if (response.status === 204 || method === 'DELETE') {
        return {} as T;
      }

      return await response.json() as T;
    } catch (error) {
      if (this.config.debug) {
        console.error('[GSC] Request failed:', error);
      }
      throw error;
    }
  }

  /**
   * Parse index status from API response
   *
   * @private
   */
  private parseIndexStatus(indexStatusResult: any): InspectionStatus {
    if (!indexStatusResult.verdict) return 'ERROR';

    switch (indexStatusResult.verdict) {
      case 'PASS':
        return 'INDEXED';
      case 'PARTIAL':
        return 'CRAWLED_NOT_INDEXED';
      case 'FAIL':
        if (indexStatusResult.coverageState === 'Submitted and indexed') {
          return 'SUBMITTED_AND_INDEXED';
        }
        return 'NOT_FOUND';
      default:
        return 'ERROR';
    }
  }

  /**
   * Parse rich results from API response
   *
   * @private
   */
  private parseRichResults(richResultsResult: any): RichResult[] {
    if (!richResultsResult?.detectedItems) return [];

    return richResultsResult.detectedItems.map((item: any) => ({
      type: item.richResultType || 'unknown',
      status: item.verdict || 'VALID',
      items: item.items?.length || 0,
      issues: item.issues || []
    }));
  }

  /**
   * Parse sitemap information from API response
   *
   * @private
   */
  private parseSitemapInfo(data: any): SitemapInfo {
    return {
      path: data.path,
      lastDownloaded: data.lastDownloaded,
      lastSubmitted: data.lastSubmitted,
      isSitemapsIndex: data.isSitemapsIndex,
      status: this.parseSitemapStatus(data.warnings, data.errors),
      urlsSubmitted: parseInt(data.contents?.[0]?.submitted || '0'),
      urlsIndexed: parseInt(data.contents?.[0]?.indexed || '0'),
      errors: data.errors || [],
      warnings: data.warnings || []
    };
  }

  /**
   * Parse sitemap status from errors and warnings
   *
   * @private
   */
  private parseSitemapStatus(warnings?: any[], errors?: any[]): SitemapStatus {
    if (errors && errors.length > 0) return 'ERROR';
    if (warnings && warnings.length > 0) return 'WARNING';
    return 'SUCCESS';
  }
}

/**
 * Helper function to create a Google Search Console instance
 *
 * @param config - Configuration object
 * @returns GoogleSearchConsole instance
 *
 * @example
 * ```typescript
 * const gsc = createGoogleSearchConsole({
 *   siteUrl: 'https://example.com',
 *   credentials: {
 *     accessToken: process.env.GSC_ACCESS_TOKEN
 *   }
 * });
 * ```
 */
export function createGoogleSearchConsole(config: GSCConfig): GoogleSearchConsole {
  return new GoogleSearchConsole(config);
}

/**
 * Helper function to format date for GSC API (YYYY-MM-DD)
 *
 * @param date - Date object or string
 * @returns Formatted date string
 */
export function formatGSCDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const formatted = d.toISOString().split('T')[0];
  if (!formatted) {
    throw new Error('Invalid date provided to formatGSCDate');
  }
  return formatted;
}

/**
 * Helper function to get date range for last N days
 *
 * @param days - Number of days
 * @returns Object with startDate and endDate
 */
export function getLastNDays(days: number): { startDate: string; endDate: string } {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return {
    startDate: formatGSCDate(startDate),
    endDate: formatGSCDate(endDate)
  };
}
