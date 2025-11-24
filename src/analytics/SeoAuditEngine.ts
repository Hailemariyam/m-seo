// src/analytics/SeoAuditEngine.ts

/**
 * SEO Audit Engine
 *
 * Comprehensive SEO analysis tool that audits websites for:
 * - Meta tags optimization
 * - Content quality and structure
 * - Performance metrics
 * - Mobile-friendliness
 * - Technical SEO issues
 * - Accessibility
 * - Schema markup
 * - Link analysis
 *
 * @example
 * ```typescript
 * const auditEngine = new SeoAuditEngine({
 *   url: 'https://example.com',
 *   includePerformance: true,
 *   includeAccessibility: true
 * });
 *
 * const results = await auditEngine.runFullAudit();
 * console.log(`SEO Score: ${results.overallScore}/100`);
 * console.log(`Issues found: ${results.issues.length}`);
 * ```
 */

export interface AuditConfig {
  url: string;
  includePerformance?: boolean;
  includeAccessibility?: boolean;
  includeMobileCheck?: boolean;
  includeSchemaValidation?: boolean;
  userAgent?: string;
  timeout?: number;
  followRedirects?: boolean;
  maxRedirects?: number;
}

export interface AuditIssue {
  category: AuditCategory;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  element?: string;
  recommendation: string;
  impact: number; // 0-100
  effort: 'low' | 'medium' | 'high';
}

export type AuditCategory =
  | 'meta-tags'
  | 'content'
  | 'performance'
  | 'mobile'
  | 'technical'
  | 'accessibility'
  | 'schema'
  | 'links'
  | 'images'
  | 'security';

export interface MetaTagsAudit {
  title?: string;
  titleLength?: number;
  description?: string;
  descriptionLength?: number;
  keywords?: string[];
  ogTags?: Record<string, string>;
  twitterTags?: Record<string, string>;
  canonical?: string;
  robots?: string;
  viewport?: string;
  issues: AuditIssue[];
  score: number;
}

export interface ContentAudit {
  wordCount: number;
  headings: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
    h5: number;
    h6: number;
  };
  h1Tags: string[];
  paragraphCount: number;
  averageParagraphLength: number;
  readabilityScore?: number;
  keywordDensity?: Record<string, number>;
  issues: AuditIssue[];
  score: number;
}

export interface PerformanceAudit {
  loadTime?: number;
  pageSize?: number;
  requestCount?: number;
  imageCount?: number;
  scriptCount?: number;
  styleCount?: number;
  compressionEnabled?: boolean;
  cacheHeaders?: boolean;
  minificationScore?: number;
  issues: AuditIssue[];
  score: number;
}

export interface MobileAudit {
  hasViewportTag: boolean;
  viewportContent?: string;
  isMobileFriendly: boolean;
  touchTargetSize?: number;
  fontSizeReadable: boolean;
  contentFitsViewport: boolean;
  issues: AuditIssue[];
  score: number;
}

export interface TechnicalAudit {
  httpStatusCode?: number;
  redirectChain?: string[];
  hasSSL: boolean;
  robotsTxt?: string;
  sitemapUrl?: string;
  hasHreflang?: boolean;
  structuredData?: any[];
  brokenLinks?: string[];
  issues: AuditIssue[];
  score: number;
}

export interface AccessibilityAudit {
  hasAltTags: boolean;
  missingAltCount: number;
  ariaLabels: number;
  landmarkRoles: number;
  formLabels: number;
  colorContrast?: number;
  keyboardNavigable?: boolean;
  issues: AuditIssue[];
  score: number;
}

export interface SchemaAudit {
  hasSchema: boolean;
  schemaTypes: string[];
  validationErrors: string[];
  recommendations: string[];
  issues: AuditIssue[];
  score: number;
}

export interface LinkAudit {
  internalLinks: number;
  externalLinks: number;
  brokenLinks: number;
  nofollowLinks: number;
  linkDensity: number;
  orphanedPages?: number;
  issues: AuditIssue[];
  score: number;
}

export interface ImageAudit {
  totalImages: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  averageImageSize?: number;
  lazyLoadedImages: number;
  responsiveImages: number;
  nextGenFormats: number;
  issues: AuditIssue[];
  score: number;
}

export interface SecurityAudit {
  hasHttps: boolean;
  mixedContent: boolean;
  securityHeaders: {
    hsts?: boolean;
    csp?: boolean;
    xFrameOptions?: boolean;
    xContentTypeOptions?: boolean;
  };
  vulnerabilities: string[];
  issues: AuditIssue[];
  score: number;
}

export interface AuditResult {
  url: string;
  timestamp: Date;
  overallScore: number;
  categoryScores: Record<AuditCategory, number>;
  metaTags: MetaTagsAudit;
  content: ContentAudit;
  performance?: PerformanceAudit;
  mobile?: MobileAudit;
  technical: TechnicalAudit;
  accessibility?: AccessibilityAudit;
  schema?: SchemaAudit;
  links: LinkAudit;
  images: ImageAudit;
  security: SecurityAudit;
  issues: AuditIssue[];
  recommendations: string[];
  summary: {
    criticalIssues: number;
    warnings: number;
    infoItems: number;
    totalIssues: number;
  };
}

export interface AuditReport {
  result: AuditResult;
  html?: string;
  json: string;
  markdown?: string;
}

export class SeoAuditEngine {
  private config: Required<AuditConfig>;
  private htmlContent?: string;

  constructor(config: AuditConfig) {
    this.config = {
      includePerformance: true,
      includeAccessibility: true,
      includeMobileCheck: true,
      includeSchemaValidation: true,
      userAgent: 'Mozilla/5.0 (compatible; SeoAuditBot/1.0)',
      timeout: 30000,
      followRedirects: true,
      maxRedirects: 5,
      ...config
    };
  }

  /**
   * Run a full SEO audit on the configured URL
   * @returns Complete audit results
   */
  async runFullAudit(): Promise<AuditResult> {
    // Fetch the page content
    await this.fetchPage();

    // Run all audits in parallel where possible
    const [
      metaTags,
      content,
      performance,
      mobile,
      technical,
      accessibility,
      schema,
      links,
      images,
      security
    ] = await Promise.all([
      this.auditMetaTags(),
      this.auditContent(),
      this.config.includePerformance ? this.auditPerformance() : Promise.resolve(undefined),
      this.config.includeMobileCheck ? this.auditMobile() : Promise.resolve(undefined),
      this.auditTechnical(),
      this.config.includeAccessibility ? this.auditAccessibility() : Promise.resolve(undefined),
      this.config.includeSchemaValidation ? this.auditSchema() : Promise.resolve(undefined),
      this.auditLinks(),
      this.auditImages(),
      this.auditSecurity()
    ]);

    // Collect all issues
    const allIssues: AuditIssue[] = [
      ...metaTags.issues,
      ...content.issues,
      ...(performance?.issues || []),
      ...(mobile?.issues || []),
      ...technical.issues,
      ...(accessibility?.issues || []),
      ...(schema?.issues || []),
      ...links.issues,
      ...images.issues,
      ...security.issues
    ];

    // Calculate category scores
    const categoryScores: Record<AuditCategory, number> = {
      'meta-tags': metaTags.score,
      'content': content.score,
      'performance': performance?.score || 0,
      'mobile': mobile?.score || 0,
      'technical': technical.score,
      'accessibility': accessibility?.score || 0,
      'schema': schema?.score || 0,
      'links': links.score,
      'images': images.score,
      'security': security.score
    };

    // Calculate overall score (weighted average)
    const overallScore = this.calculateOverallScore(categoryScores);

    // Generate recommendations
    const recommendations = this.generateRecommendations(allIssues);

    const result: AuditResult = {
      url: this.config.url,
      timestamp: new Date(),
      overallScore,
      categoryScores,
      metaTags,
      content,
      performance,
      mobile,
      technical,
      accessibility,
      schema,
      links,
      images,
      security,
      issues: allIssues,
      recommendations,
      summary: {
        criticalIssues: allIssues.filter(i => i.severity === 'critical').length,
        warnings: allIssues.filter(i => i.severity === 'warning').length,
        infoItems: allIssues.filter(i => i.severity === 'info').length,
        totalIssues: allIssues.length
      }
    };

    return result;
  }

  /**
   * Fetch the page content
   */
  private async fetchPage(): Promise<void> {
    // Placeholder for actual HTTP request
    // In real implementation, would use fetch/axios
    this.htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Example Page</title>
</head>
<body>
  <h1>Example Content</h1>
  <p>This is example content.</p>
</body>
</html>`;
  }

  /**
   * Audit meta tags
   */
  private async auditMetaTags(): Promise<MetaTagsAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    // Extract meta tags from HTML
    const title = this.extractMetaTag('title');
    const description = this.extractMetaTag('meta[name="description"]');
    const keywords = this.extractMetaTag('meta[name="keywords"]')?.split(',').map(k => k.trim()) || [];
    const canonical = this.extractMetaTag('link[rel="canonical"]');
    const robots = this.extractMetaTag('meta[name="robots"]');
    const viewport = this.extractMetaTag('meta[name="viewport"]');

    // Check title
    const titleLength = title?.length || 0;
    if (!title) {
      issues.push({
        category: 'meta-tags',
        severity: 'critical',
        title: 'Missing Title Tag',
        description: 'Page has no title tag',
        recommendation: 'Add a descriptive title tag between 50-60 characters',
        impact: 95,
        effort: 'low'
      });
      score -= 30;
    } else if (titleLength < 30) {
      issues.push({
        category: 'meta-tags',
        severity: 'warning',
        title: 'Title Too Short',
        description: `Title is only ${titleLength} characters`,
        recommendation: 'Expand title to 50-60 characters for better visibility',
        impact: 60,
        effort: 'low'
      });
      score -= 15;
    } else if (titleLength > 70) {
      issues.push({
        category: 'meta-tags',
        severity: 'warning',
        title: 'Title Too Long',
        description: `Title is ${titleLength} characters (may be truncated)`,
        recommendation: 'Shorten title to 50-60 characters',
        impact: 50,
        effort: 'low'
      });
      score -= 10;
    }

    // Check description
    const descriptionLength = description?.length || 0;
    if (!description) {
      issues.push({
        category: 'meta-tags',
        severity: 'critical',
        title: 'Missing Meta Description',
        description: 'Page has no meta description',
        recommendation: 'Add a compelling meta description between 150-160 characters',
        impact: 90,
        effort: 'low'
      });
      score -= 25;
    } else if (descriptionLength < 100) {
      issues.push({
        category: 'meta-tags',
        severity: 'warning',
        title: 'Meta Description Too Short',
        description: `Description is only ${descriptionLength} characters`,
        recommendation: 'Expand description to 150-160 characters',
        impact: 55,
        effort: 'low'
      });
      score -= 10;
    } else if (descriptionLength > 170) {
      issues.push({
        category: 'meta-tags',
        severity: 'warning',
        title: 'Meta Description Too Long',
        description: `Description is ${descriptionLength} characters`,
        recommendation: 'Shorten description to 150-160 characters',
        impact: 45,
        effort: 'low'
      });
      score -= 8;
    }

    // Check canonical
    if (!canonical) {
      issues.push({
        category: 'meta-tags',
        severity: 'warning',
        title: 'Missing Canonical Tag',
        description: 'Page has no canonical URL specified',
        recommendation: 'Add canonical tag to prevent duplicate content issues',
        impact: 40,
        effort: 'low'
      });
      score -= 10;
    }

    // Check viewport
    if (!viewport) {
      issues.push({
        category: 'meta-tags',
        severity: 'critical',
        title: 'Missing Viewport Tag',
        description: 'Page lacks viewport meta tag',
        recommendation: 'Add viewport meta tag for mobile responsiveness',
        impact: 85,
        effort: 'low'
      });
      score -= 20;
    }

    // Extract Open Graph and Twitter tags
    const ogTags = this.extractOGTags();
    const twitterTags = this.extractTwitterTags();

    if (Object.keys(ogTags).length === 0) {
      issues.push({
        category: 'meta-tags',
        severity: 'info',
        title: 'Missing Open Graph Tags',
        description: 'No Open Graph tags found',
        recommendation: 'Add OG tags for better social media sharing',
        impact: 30,
        effort: 'low'
      });
      score -= 5;
    }

    return {
      title,
      titleLength,
      description,
      descriptionLength,
      keywords,
      ogTags,
      twitterTags,
      canonical,
      robots,
      viewport,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit content quality and structure
   */
  private async auditContent(): Promise<ContentAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    // Extract content metrics
    const wordCount = this.countWords();
    const headings = this.countHeadings();
    const h1Tags = this.extractH1Tags();
    const paragraphCount = this.countParagraphs();
    const averageParagraphLength = wordCount / Math.max(paragraphCount, 1);

    // Check word count
    if (wordCount < 300) {
      issues.push({
        category: 'content',
        severity: 'warning',
        title: 'Low Word Count',
        description: `Page has only ${wordCount} words`,
        recommendation: 'Expand content to at least 300 words for better SEO',
        impact: 70,
        effort: 'medium'
      });
      score -= 20;
    }

    // Check H1 tags
    if (h1Tags.length === 0) {
      issues.push({
        category: 'content',
        severity: 'critical',
        title: 'Missing H1 Tag',
        description: 'Page has no H1 heading',
        recommendation: 'Add exactly one H1 tag with primary keyword',
        impact: 90,
        effort: 'low'
      });
      score -= 25;
    } else if (h1Tags.length > 1) {
      issues.push({
        category: 'content',
        severity: 'warning',
        title: 'Multiple H1 Tags',
        description: `Page has ${h1Tags.length} H1 tags`,
        recommendation: 'Use only one H1 tag per page',
        impact: 60,
        effort: 'low'
      });
      score -= 15;
    }

    // Check heading hierarchy
    if (headings.h1 > 0 && headings.h2 === 0) {
      issues.push({
        category: 'content',
        severity: 'info',
        title: 'No H2 Headings',
        description: 'Page has no H2 headings for content structure',
        recommendation: 'Add H2 headings to improve content organization',
        impact: 40,
        effort: 'low'
      });
      score -= 10;
    }

    // Check paragraph length
    if (averageParagraphLength > 150) {
      issues.push({
        category: 'content',
        severity: 'info',
        title: 'Long Paragraphs',
        description: `Average paragraph length is ${averageParagraphLength.toFixed(0)} words`,
        recommendation: 'Break long paragraphs into smaller chunks (100-150 words)',
        impact: 30,
        effort: 'low'
      });
      score -= 5;
    }

    return {
      wordCount,
      headings,
      h1Tags,
      paragraphCount,
      averageParagraphLength,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit performance metrics
   */
  private async auditPerformance(): Promise<PerformanceAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    // Placeholder performance metrics
    const loadTime = 2500; // ms
    const pageSize = 1500000; // bytes
    const requestCount = 45;
    const imageCount = 20;
    const scriptCount = 8;
    const styleCount = 4;

    // Check load time
    if (loadTime > 3000) {
      issues.push({
        category: 'performance',
        severity: 'critical',
        title: 'Slow Page Load',
        description: `Page loads in ${loadTime}ms`,
        recommendation: 'Optimize images, minify CSS/JS, enable compression',
        impact: 95,
        effort: 'high'
      });
      score -= 30;
    } else if (loadTime > 2000) {
      issues.push({
        category: 'performance',
        severity: 'warning',
        title: 'Moderate Load Time',
        description: `Page loads in ${loadTime}ms`,
        recommendation: 'Further optimize for faster loading',
        impact: 60,
        effort: 'medium'
      });
      score -= 15;
    }

    // Check page size
    if (pageSize > 2000000) {
      issues.push({
        category: 'performance',
        severity: 'warning',
        title: 'Large Page Size',
        description: `Page size is ${(pageSize / 1024 / 1024).toFixed(2)}MB`,
        recommendation: 'Optimize images and remove unused assets',
        impact: 70,
        effort: 'medium'
      });
      score -= 20;
    }

    // Check request count
    if (requestCount > 50) {
      issues.push({
        category: 'performance',
        severity: 'warning',
        title: 'Too Many Requests',
        description: `Page makes ${requestCount} HTTP requests`,
        recommendation: 'Combine files, use sprites, implement lazy loading',
        impact: 65,
        effort: 'high'
      });
      score -= 15;
    }

    return {
      loadTime,
      pageSize,
      requestCount,
      imageCount,
      scriptCount,
      styleCount,
      compressionEnabled: true,
      cacheHeaders: true,
      minificationScore: 85,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit mobile-friendliness
   */
  private async auditMobile(): Promise<MobileAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    const viewportContent = this.extractMetaTag('meta[name="viewport"]');
    const hasViewportTag = !!viewportContent;

    if (!hasViewportTag) {
      issues.push({
        category: 'mobile',
        severity: 'critical',
        title: 'No Viewport Meta Tag',
        description: 'Page is not optimized for mobile devices',
        recommendation: 'Add viewport meta tag',
        impact: 95,
        effort: 'low'
      });
      score -= 40;
    }

    // Check for mobile-unfriendly patterns
    const hasFixedWidth = this.htmlContent?.includes('width="') || false;
    if (hasFixedWidth) {
      issues.push({
        category: 'mobile',
        severity: 'warning',
        title: 'Fixed Width Elements',
        description: 'Page contains fixed-width elements',
        recommendation: 'Use responsive width values (%, vw)',
        impact: 60,
        effort: 'medium'
      });
      score -= 20;
    }

    return {
      hasViewportTag,
      viewportContent,
      isMobileFriendly: hasViewportTag && !hasFixedWidth,
      fontSizeReadable: true,
      contentFitsViewport: true,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit technical SEO factors
   */
  private async auditTechnical(): Promise<TechnicalAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    const hasSSL = this.config.url.startsWith('https://');
    const hasHreflang = this.htmlContent?.includes('hreflang') || false;

    if (!hasSSL) {
      issues.push({
        category: 'technical',
        severity: 'critical',
        title: 'No HTTPS',
        description: 'Site is not using HTTPS',
        recommendation: 'Install SSL certificate and redirect HTTP to HTTPS',
        impact: 100,
        effort: 'medium'
      });
      score -= 30;
    }

    // Check for robots.txt
    // In real implementation, would make separate request

    return {
      httpStatusCode: 200,
      hasSSL,
      hasHreflang,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit accessibility
   */
  private async auditAccessibility(): Promise<AccessibilityAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    // Count images and alt tags
    const totalImages = (this.htmlContent?.match(/<img/g) || []).length;
    const imagesWithAlt = (this.htmlContent?.match(/<img[^>]+alt=/g) || []).length;
    const missingAltCount = totalImages - imagesWithAlt;

    if (missingAltCount > 0) {
      issues.push({
        category: 'accessibility',
        severity: 'warning',
        title: 'Missing Alt Tags',
        description: `${missingAltCount} images missing alt attributes`,
        recommendation: 'Add descriptive alt text to all images',
        impact: 70,
        effort: 'low'
      });
      score -= Math.min(30, missingAltCount * 5);
    }

    // Check for ARIA labels
    const ariaLabels = (this.htmlContent?.match(/aria-label=/g) || []).length;
    const landmarkRoles = (this.htmlContent?.match(/role="(main|navigation|banner|contentinfo|complementary)"/g) || []).length;

    if (landmarkRoles === 0) {
      issues.push({
        category: 'accessibility',
        severity: 'info',
        title: 'No ARIA Landmarks',
        description: 'Page lacks ARIA landmark roles',
        recommendation: 'Add ARIA roles for better screen reader navigation',
        impact: 40,
        effort: 'low'
      });
      score -= 10;
    }

    return {
      hasAltTags: missingAltCount === 0,
      missingAltCount,
      ariaLabels,
      landmarkRoles,
      formLabels: 0,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit schema markup
   */
  private async auditSchema(): Promise<SchemaAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    const hasSchema = this.htmlContent?.includes('application/ld+json') ||
                      this.htmlContent?.includes('itemscope') || false;
    const schemaTypes: string[] = [];

    if (!hasSchema) {
      issues.push({
        category: 'schema',
        severity: 'info',
        title: 'No Schema Markup',
        description: 'Page has no structured data',
        recommendation: 'Add JSON-LD schema markup for rich snippets',
        impact: 50,
        effort: 'medium'
      });
      score -= 20;
    }

    return {
      hasSchema,
      schemaTypes,
      validationErrors: [],
      recommendations: [],
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit links
   */
  private async auditLinks(): Promise<LinkAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    // Count links
    const allLinks = (this.htmlContent?.match(/<a[^>]+href=/g) || []).length;
    const externalLinks = (this.htmlContent?.match(/<a[^>]+href="http/g) || []).length;
    const internalLinks = allLinks - externalLinks;
    const nofollowLinks = (this.htmlContent?.match(/rel="nofollow"/g) || []).length;

    const linkDensity = allLinks / Math.max(this.countWords(), 1) * 100;

    if (linkDensity > 3) {
      issues.push({
        category: 'links',
        severity: 'warning',
        title: 'High Link Density',
        description: `Link density is ${linkDensity.toFixed(2)}%`,
        recommendation: 'Reduce number of links or increase content',
        impact: 50,
        effort: 'medium'
      });
      score -= 15;
    }

    return {
      internalLinks,
      externalLinks,
      brokenLinks: 0,
      nofollowLinks,
      linkDensity,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit images
   */
  private async auditImages(): Promise<ImageAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    const totalImages = (this.htmlContent?.match(/<img/g) || []).length;
    const imagesWithAlt = (this.htmlContent?.match(/<img[^>]+alt=/g) || []).length;
    const imagesWithoutAlt = totalImages - imagesWithAlt;
    const lazyLoadedImages = (this.htmlContent?.match(/loading="lazy"/g) || []).length;
    const responsiveImages = (this.htmlContent?.match(/<picture|srcset=/g) || []).length;

    if (totalImages > 0 && lazyLoadedImages === 0) {
      issues.push({
        category: 'images',
        severity: 'info',
        title: 'No Lazy Loading',
        description: 'Images are not lazy-loaded',
        recommendation: 'Add loading="lazy" to images below the fold',
        impact: 40,
        effort: 'low'
      });
      score -= 10;
    }

    if (totalImages > 0 && responsiveImages === 0) {
      issues.push({
        category: 'images',
        severity: 'info',
        title: 'No Responsive Images',
        description: 'No responsive images detected',
        recommendation: 'Use srcset or <picture> for responsive images',
        impact: 45,
        effort: 'medium'
      });
      score -= 10;
    }

    return {
      totalImages,
      imagesWithAlt,
      imagesWithoutAlt,
      lazyLoadedImages,
      responsiveImages,
      nextGenFormats: 0,
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Audit security
   */
  private async auditSecurity(): Promise<SecurityAudit> {
    const issues: AuditIssue[] = [];
    let score = 100;

    const hasHttps = this.config.url.startsWith('https://');
    const mixedContent = hasHttps && (this.htmlContent?.includes('src="http://') || this.htmlContent?.includes('href="http://') || false);

    if (!hasHttps) {
      issues.push({
        category: 'security',
        severity: 'critical',
        title: 'No HTTPS',
        description: 'Site not using HTTPS',
        recommendation: 'Install SSL certificate',
        impact: 100,
        effort: 'medium'
      });
      score -= 50;
    }

    if (mixedContent) {
      issues.push({
        category: 'security',
        severity: 'critical',
        title: 'Mixed Content',
        description: 'Page contains HTTP resources on HTTPS',
        recommendation: 'Update all resources to use HTTPS',
        impact: 90,
        effort: 'medium'
      });
      score -= 30;
    }

    return {
      hasHttps,
      mixedContent,
      securityHeaders: {
        hsts: false,
        csp: false,
        xFrameOptions: false,
        xContentTypeOptions: false
      },
      vulnerabilities: [],
      issues,
      score: Math.max(0, score)
    };
  }

  /**
   * Calculate overall score from category scores
   */
  private calculateOverallScore(categoryScores: Record<AuditCategory, number>): number {
    const weights: Record<AuditCategory, number> = {
      'meta-tags': 15,
      'content': 20,
      'performance': 15,
      'mobile': 10,
      'technical': 15,
      'accessibility': 8,
      'schema': 5,
      'links': 7,
      'images': 3,
      'security': 2
    };

    let totalScore = 0;
    let totalWeight = 0;

    for (const [category, score] of Object.entries(categoryScores)) {
      const weight = weights[category as AuditCategory] || 0;
      totalScore += score * weight;
      totalWeight += weight;
    }

    return Math.round(totalScore / totalWeight);
  }

  /**
   * Generate recommendations based on issues
   */
  private generateRecommendations(issues: AuditIssue[]): string[] {
    // Sort issues by impact and group by category
    const sortedIssues = [...issues].sort((a, b) => b.impact - a.impact);

    const recommendations: string[] = [];
    const criticalIssues = sortedIssues.filter(i => i.severity === 'critical');

    if (criticalIssues.length > 0) {
      recommendations.push(`Fix ${criticalIssues.length} critical issues immediately`);
    }

    // Get top 5 issues by impact
    sortedIssues.slice(0, 5).forEach(issue => {
      recommendations.push(issue.recommendation);
    });

    return [...new Set(recommendations)]; // Remove duplicates
  }

  /**
   * Generate audit report in multiple formats
   */
  async generateReport(format: 'json' | 'html' | 'markdown' = 'json'): Promise<AuditReport> {
    const result = await this.runFullAudit();

    const report: AuditReport = {
      result,
      json: JSON.stringify(result, null, 2)
    };

    if (format === 'markdown' || format === 'html') {
      report.markdown = this.generateMarkdownReport(result);
    }

    if (format === 'html') {
      report.html = this.generateHtmlReport(result);
    }

    return report;
  }

  /**
   * Generate markdown report
   */
  private generateMarkdownReport(result: AuditResult): string {
    let md = `# SEO Audit Report\n\n`;
    md += `**URL:** ${result.url}\n`;
    md += `**Date:** ${result.timestamp.toISOString()}\n`;
    md += `**Overall Score:** ${result.overallScore}/100\n\n`;

    md += `## Summary\n\n`;
    md += `- Critical Issues: ${result.summary.criticalIssues}\n`;
    md += `- Warnings: ${result.summary.warnings}\n`;
    md += `- Info Items: ${result.summary.infoItems}\n`;
    md += `- Total Issues: ${result.summary.totalIssues}\n\n`;

    md += `## Category Scores\n\n`;
    for (const [category, score] of Object.entries(result.categoryScores)) {
      md += `- ${category}: ${score}/100\n`;
    }

    md += `\n## Issues\n\n`;
    result.issues.forEach((issue, idx) => {
      md += `### ${idx + 1}. ${issue.title} (${issue.severity})\n\n`;
      md += `**Category:** ${issue.category}\n`;
      md += `**Impact:** ${issue.impact}/100\n`;
      md += `**Effort:** ${issue.effort}\n\n`;
      md += `${issue.description}\n\n`;
      md += `**Recommendation:** ${issue.recommendation}\n\n`;
    });

    return md;
  }

  /**
   * Generate HTML report
   */
  private generateHtmlReport(result: AuditResult): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SEO Audit Report - ${result.url}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .score { font-size: 48px; font-weight: bold; }
    .critical { color: #d32f2f; }
    .warning { color: #f57c00; }
    .info { color: #0288d1; }
    .issue { border-left: 4px solid #ccc; padding: 10px; margin: 10px 0; }
    .category-scores { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
    .category-card { background: #f5f5f5; padding: 15px; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>SEO Audit Report</h1>
  <p><strong>URL:</strong> ${result.url}</p>
  <p><strong>Date:</strong> ${result.timestamp.toISOString()}</p>

  <div class="score">${result.overallScore}/100</div>

  <h2>Summary</h2>
  <ul>
    <li>Critical Issues: ${result.summary.criticalIssues}</li>
    <li>Warnings: ${result.summary.warnings}</li>
    <li>Info Items: ${result.summary.infoItems}</li>
  </ul>

  <h2>Category Scores</h2>
  <div class="category-scores">
    ${Object.entries(result.categoryScores).map(([cat, score]) => `
      <div class="category-card">
        <strong>${cat}</strong><br>
        ${score}/100
      </div>
    `).join('')}
  </div>

  <h2>Issues</h2>
  ${result.issues.map((issue, idx) => `
    <div class="issue ${issue.severity}">
      <h3>${idx + 1}. ${issue.title}</h3>
      <p><strong>Severity:</strong> ${issue.severity} | <strong>Impact:</strong> ${issue.impact}/100</p>
      <p>${issue.description}</p>
      <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
    </div>
  `).join('')}
</body>
</html>
    `.trim();
  }

  // Helper methods for extracting data from HTML
  private extractMetaTag(_selector: string): string | undefined {
    // Placeholder - would use DOM parser in real implementation
    return undefined;
  }

  private extractOGTags(): Record<string, string> {
    // Placeholder
    return {};
  }

  private extractTwitterTags(): Record<string, string> {
    // Placeholder
    return {};
  }

  private countWords(): number {
    if (!this.htmlContent) return 0;
    const text = this.htmlContent.replace(/<[^>]*>/g, '');
    return text.split(/\s+/).filter(w => w.length > 0).length;
  }

  private countHeadings(): ContentAudit['headings'] {
    return {
      h1: (this.htmlContent?.match(/<h1/g) || []).length,
      h2: (this.htmlContent?.match(/<h2/g) || []).length,
      h3: (this.htmlContent?.match(/<h3/g) || []).length,
      h4: (this.htmlContent?.match(/<h4/g) || []).length,
      h5: (this.htmlContent?.match(/<h5/g) || []).length,
      h6: (this.htmlContent?.match(/<h6/g) || []).length,
    };
  }

  private extractH1Tags(): string[] {
    // Placeholder
    return [];
  }

  private countParagraphs(): number {
    return (this.htmlContent?.match(/<p/g) || []).length;
  }
}

/**
 * Create a new SEO Audit Engine instance
 * @param config Audit configuration
 * @returns SeoAuditEngine instance
 */
export function createSeoAuditEngine(config: AuditConfig): SeoAuditEngine {
  return new SeoAuditEngine(config);
}

/**
 * Quick audit - runs audit and returns results
 * @param url URL to audit
 * @param options Optional audit options
 * @returns Audit results
 */
export async function quickAudit(
  url: string,
  options?: Partial<AuditConfig>
): Promise<AuditResult> {
  const engine = new SeoAuditEngine({ url, ...options });
  return engine.runFullAudit();
}

/**
 * Compare two audit results
 * @param before Previous audit result
 * @param after Current audit result
 * @returns Comparison with improvements and regressions
 */
export function compareAudits(before: AuditResult, after: AuditResult) {
  const scoreDiff = after.overallScore - before.overallScore;
  const issuesDiff = after.summary.totalIssues - before.summary.totalIssues;

  const categoryChanges: Record<string, number> = {};
  for (const category of Object.keys(after.categoryScores) as AuditCategory[]) {
    categoryChanges[category] = after.categoryScores[category] - before.categoryScores[category];
  }

  return {
    scoreDiff,
    issuesDiff,
    categoryChanges,
    improved: scoreDiff > 0,
    summary: `Score ${scoreDiff > 0 ? 'improved' : 'declined'} by ${Math.abs(scoreDiff)} points`
  };
}
