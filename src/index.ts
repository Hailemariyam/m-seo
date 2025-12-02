// src/index.ts
// Entry point for m-seo package - Framework-agnostic SEO library

// Core modules (100% framework-independent)
export { SeoEngine, type SeoConfig, type MetaTag, type LinkTag } from './core/SeoEngine.js';
export { SitemapGenerator, type SitemapUrl, type SitemapOptions } from './core/SitemapGenerator.js';
export { RobotsManager, type RobotRule, type RobotsConfig } from './core/RobotsManager.js';
export { StructuredDataManager, type StructuredData } from './core/StructuredDataManager.js';
export {
  UrlManager,
  createUrlManager,
  slug,
  normalizeUrl,
  type UrlConfig,
  type SlugOptions,
  type UrlComponents,
  type RedirectRule,
  type AlternateUrl,
  type PaginationUrls
} from './core/UrlManager.js';
export {
  Internationalization,
  createI18n,
  COMMON_LOCALES,
  type I18nConfig,
  type LocaleData,
  type Translation,
  type Translations,
  type HreflangTag,
  type LocalizedMetadata,
  type PluralRule
} from './core/Internationalization.js';

// Analytics modules (browser-based)
export { GoogleAnalytics, createGoogleAnalytics, type GAConfig, type PageViewData, type EventData, type TransactionData, type TransactionItem, type UserProperties, type SEOMetrics } from './analytics/GoogleAnalytics.js';
export { BotDetection } from './analytics/BotDetection.js';
export {
  GoogleSearchConsole,
  createGoogleSearchConsole,
  formatGSCDate,
  getLastNDays,
  type GSCConfig,
  type GSCCredentials,
  type SearchAnalyticsQuery,
  type SearchAnalyticsResponse,
  type SearchAnalyticsRow,
  type URLInspectionResult,
  type SitemapInfo,
  type PerformanceSummary,
  type TopQuery,
  type TopPage,
  type CoverageIssue,
  type SearchDimension,
  type DeviceType,
  type SearchAppearanceType,
  type InspectionStatus,
  type SitemapStatus
} from './analytics/GoogleSearchConsole.js';
export {
  SeoAuditEngine,
  createSeoAuditEngine,
  quickAudit,
  compareAudits,
  type AuditConfig,
  type AuditIssue,
  type AuditCategory,
  type MetaTagsAudit,
  type ContentAudit,
  type PerformanceAudit,
  type MobileAudit,
  type TechnicalAudit,
  type AccessibilityAudit,
  type SchemaAudit,
  type LinkAudit,
  type ImageAudit,
  type SecurityAudit,
  type AuditResult,
  type AuditReport
} from './analytics/SeoAuditEngine.js';
export {
  SeoReportGenerator,
  createSeoReportGenerator,
  generateQuickReport,
  type ReportConfig,
  type ReportSection,
  type ReportMetric,
  type AnalyticsData,
  type SearchConsoleData,
  type KeywordData,
  type BacklinkData,
  type CompetitorData,
  type ReportData,
  type GeneratedReport,
  type ReportFormat
} from './analytics/SeoReportGenerator.js';

// Integrations (v1.1.1)
export {
  CMSPlugins,
  type CMSPlatform,
  type CMSConfig,
  type CMSContent,
  type CMSSeoData,
  type CMSIntegrationResult,
  type WebhookPayload,
  type BatchOperation,
  type BatchResult,
  type CMSAnalytics
} from './integrations/CMSPlugins-advanced.js';

export {
  AIContentAnalysis,
  type AIContentConfig,
  type ReadabilityScores,
  type KeywordAnalysis,
  type ContentQualityMetrics,
  type SentimentAnalysis,
  type ToneAnalysis,
  type PlagiarismResult,
  type SEORecommendation,
  type ContentSuggestion,
  type AdvancedContentAnalysisResult,
  type BatchAnalysisRequest,
  type BatchAnalysisResult,
  type ExportOptions
} from './integrations/AIContentAnalysis.js';

export {
  ImageOptimizer,
  type ImageOptimizationConfig,
  type ImageAnalysisResult,
  type OptimizedImage
} from './integrations/ImageOptimizer.js';

export {
  VideoSeo,
  type VideoSeoConfig,
  type VideoSchemaMarkup,
  type VideoOptimizationResult
} from './integrations/VideoSeo.js';

export {
  SocialPreviewGenerator,
  type OpenGraphData,
  type TwitterCardData,
  type SocialPreviewConfig,
  type SocialPreviewResult,
  type PreviewValidation
} from './integrations/SocialPreviewGenerator.js';

// Adapters
export {
  NextAdapter,
  createNextAdapter,
  generateBreadcrumbJsonLd,
  generateArticleJsonLd,
  generateProductJsonLd,
  generateFaqJsonLd,
  type NextSeoConfig,
  type NextAppSeoConfig,
  type NextAdapterOptions
} from './adapters/NextAdapter.js';

// You can use these modules in ANY environment:
// - Node.js (Express, Fastify, Koa)
// - Deno
// - Bun
// - Browser (React, Vue, Angular, vanilla JS)
// - Edge runtimes (Cloudflare Workers, Vercel Edge)
// - Static site generators
