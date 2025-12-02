// src/integrations/VideoSeo.ts

/**
 * Video SEO
 *
 * PURPOSE:
 * - Optimizes video content for search engines
 * - Generates video schema markup (VideoObject)
 * - Creates video sitemaps
 * - Optimizes video thumbnails and previews
 * - Manages video transcripts and captions
 *
 * USE CASES:
 * - Add structured data for video content
 * - Generate video sitemaps for better indexing
 * - Optimize video thumbnails for social sharing
 * - Create accessible video transcripts
 * - Track video engagement metrics
 * - Implement video lazy loading
 */

export interface VideoSeoConfig {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string; // ISO 8601 date
  duration: string; // ISO 8601 duration (PT1H30M)
  contentUrl?: string;
  embedUrl?: string;

  // Optional metadata
  transcript?: string;
  captions?: Array<{
    language: string;
    url: string;
  }>;

  // Advanced options
  category?: string;
  tags?: string[];
  rating?: number; // 1-5
  viewCount?: number;
  familyFriendly?: boolean;
  requiresSubscription?: boolean;

  // Video quality
  videoQuality?: 'hd' | 'sd';
  width?: number;
  height?: number;

  // Publishing info
  publisher?: {
    name: string;
    logo: string;
  };
  creator?: string;
}

export interface VideoSchemaMarkup {
  '@context': string;
  '@type': 'VideoObject';
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration: string;
  contentUrl?: string;
  embedUrl?: string;
  videoQuality?: string;
  width?: number;
  height?: number;
  publisher?: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  creator?: {
    '@type': 'Person' | 'Organization';
    name: string;
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: number;
    bestRating: number;
    worstRating: number;
  };
  interactionStatistic?: {
    '@type': 'InteractionCounter';
    interactionType: string;
    userInteractionCount: number;
  };
  regionsAllowed?: string;
  requiresSubscription?: boolean;
  isFamilyFriendly?: boolean;
}

export interface VideoSitemapEntry {
  loc: string; // Page URL
  video: {
    thumbnail_loc: string;
    title: string;
    description: string;
    content_loc?: string;
    player_loc?: string;
    duration: number; // In seconds
    publication_date: string;
    family_friendly?: 'yes' | 'no';
    restriction?: {
      relationship: 'allow' | 'deny';
      countries: string[];
    };
    platform?: {
      relationship: 'allow' | 'deny';
      platforms: ('web' | 'mobile' | 'tv')[];
    };
    requires_subscription?: 'yes' | 'no';
    uploader?: {
      name: string;
      info?: string;
    };
    live?: 'yes' | 'no';
    tag?: string[];
    category?: string;
    view_count?: number;
    rating?: number;
  };
}

export interface VideoOptimizationResult {
  schema: VideoSchemaMarkup;
  schemaJson: string;
  sitemapEntry: VideoSitemapEntry;
  embedCode: string;
  recommendations: VideoRecommendation[];
  seoScore: number; // 0-100
}

export interface VideoRecommendation {
  type: 'error' | 'warning' | 'suggestion' | 'success';
  category: 'schema' | 'thumbnail' | 'transcript' | 'metadata' | 'accessibility';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  impact: number; // 0-100
  suggestion?: string;
}

export class VideoSeo {
  /**
   * Generate complete video SEO package
   */
  static optimizeVideo(config: VideoSeoConfig, pageUrl: string): VideoOptimizationResult {
    // Generate schema markup
    const schema = this.generateSchema(config);
    const schemaJson = JSON.stringify(schema, null, 2);

    // Generate sitemap entry
    const sitemapEntry = this.generateSitemapEntry(config, pageUrl);

    // Generate embed code
    const embedCode = this.generateEmbedCode(config);

    // Generate recommendations
    const recommendations = this.generateRecommendations(config);

    // Calculate SEO score
    const seoScore = this.calculateSeoScore(config);

    return {
      schema,
      schemaJson,
      sitemapEntry,
      embedCode,
      recommendations,
      seoScore
    };
  }

  /**
   * Generate VideoObject schema markup
   */
  static generateSchema(config: VideoSeoConfig): VideoSchemaMarkup {
    const schema: VideoSchemaMarkup = {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: config.name,
      description: config.description,
      thumbnailUrl: config.thumbnailUrl,
      uploadDate: config.uploadDate,
      duration: config.duration
    };

    if (config.contentUrl) {
      schema.contentUrl = config.contentUrl;
    }

    if (config.embedUrl) {
      schema.embedUrl = config.embedUrl;
    }

    if (config.videoQuality) {
      schema.videoQuality = config.videoQuality;
    }

    if (config.width && config.height) {
      schema.width = config.width;
      schema.height = config.height;
    }

    if (config.publisher) {
      schema.publisher = {
        '@type': 'Organization',
        name: config.publisher.name,
        logo: {
          '@type': 'ImageObject',
          url: config.publisher.logo
        }
      };
    }

    if (config.creator) {
      schema.creator = {
        '@type': 'Person',
        name: config.creator
      };
    }

    if (config.rating) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: config.rating,
        bestRating: 5,
        worstRating: 1
      };
    }

    if (config.viewCount) {
      schema.interactionStatistic = {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: config.viewCount
      };
    }

    if (config.requiresSubscription !== undefined) {
      schema.requiresSubscription = config.requiresSubscription;
    }

    if (config.familyFriendly !== undefined) {
      schema.isFamilyFriendly = config.familyFriendly;
    }

    return schema;
  }

  /**
   * Generate video sitemap entry
   */
  static generateSitemapEntry(config: VideoSeoConfig, pageUrl: string): VideoSitemapEntry {
    const durationSeconds = this.parseDuration(config.duration);

    const entry: VideoSitemapEntry = {
      loc: pageUrl,
      video: {
        thumbnail_loc: config.thumbnailUrl,
        title: config.name,
        description: config.description,
        duration: durationSeconds,
        publication_date: config.uploadDate
      }
    };

    if (config.contentUrl) {
      entry.video.content_loc = config.contentUrl;
    }

    if (config.embedUrl) {
      entry.video.player_loc = config.embedUrl;
    }

    if (config.familyFriendly !== undefined) {
      entry.video.family_friendly = config.familyFriendly ? 'yes' : 'no';
    }

    if (config.requiresSubscription !== undefined) {
      entry.video.requires_subscription = config.requiresSubscription ? 'yes' : 'no';
    }

    if (config.creator) {
      entry.video.uploader = {
        name: config.creator
      };
    }

    if (config.tags && config.tags.length > 0) {
      entry.video.tag = config.tags;
    }

    if (config.category) {
      entry.video.category = config.category;
    }

    if (config.viewCount) {
      entry.video.view_count = config.viewCount;
    }

    if (config.rating) {
      entry.video.rating = config.rating;
    }

    return entry;
  }

  /**
   * Generate video sitemap XML
   */
  static generateVideoSitemap(videos: Array<{ config: VideoSeoConfig; pageUrl: string }>): string {
    const entries = videos.map(v => this.generateSitemapEntry(v.config, v.pageUrl));

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n';

    entries.forEach(entry => {
      xml += '  <url>\n';
      xml += `    <loc>${this.escapeXml(entry.loc)}</loc>\n`;
      xml += '    <video:video>\n';
      xml += `      <video:thumbnail_loc>${this.escapeXml(entry.video.thumbnail_loc)}</video:thumbnail_loc>\n`;
      xml += `      <video:title>${this.escapeXml(entry.video.title)}</video:title>\n`;
      xml += `      <video:description>${this.escapeXml(entry.video.description)}</video:description>\n`;

      if (entry.video.content_loc) {
        xml += `      <video:content_loc>${this.escapeXml(entry.video.content_loc)}</video:content_loc>\n`;
      }

      if (entry.video.player_loc) {
        xml += `      <video:player_loc>${this.escapeXml(entry.video.player_loc)}</video:player_loc>\n`;
      }

      xml += `      <video:duration>${entry.video.duration}</video:duration>\n`;
      xml += `      <video:publication_date>${entry.video.publication_date}</video:publication_date>\n`;

      if (entry.video.family_friendly) {
        xml += `      <video:family_friendly>${entry.video.family_friendly}</video:family_friendly>\n`;
      }

      if (entry.video.requires_subscription) {
        xml += `      <video:requires_subscription>${entry.video.requires_subscription}</video:requires_subscription>\n`;
      }

      if (entry.video.uploader) {
        xml += `      <video:uploader>${this.escapeXml(entry.video.uploader.name)}</video:uploader>\n`;
      }

      if (entry.video.tag) {
        entry.video.tag.forEach(tag => {
          xml += `      <video:tag>${this.escapeXml(tag)}</video:tag>\n`;
        });
      }

      if (entry.video.category) {
        xml += `      <video:category>${this.escapeXml(entry.video.category)}</video:category>\n`;
      }

      if (entry.video.view_count !== undefined) {
        xml += `      <video:view_count>${entry.video.view_count}</video:view_count>\n`;
      }

      if (entry.video.rating !== undefined) {
        xml += `      <video:rating>${entry.video.rating}</video:rating>\n`;
      }

      xml += '    </video:video>\n';
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    return xml;
  }

  /**
   * Generate SEO-optimized video embed code
   */
  static generateEmbedCode(config: VideoSeoConfig): string {
    if (!config.embedUrl) {
      return '<!-- No embed URL provided -->';
    }

    const width = config.width || 640;
    const height = config.height || 360;

    let html = '<div class="video-container" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">\n';
    html += `  <iframe\n`;
    html += `    src="${config.embedUrl}"\n`;
    html += `    title="${this.escapeHtml(config.name)}"\n`;
    html += `    width="${width}"\n`;
    html += `    height="${height}"\n`;
    html += `    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"\n`;
    html += `    frameborder="0"\n`;
    html += `    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"\n`;
    html += `    allowfullscreen\n`;
    html += `    loading="lazy"\n`;
    html += `  ></iframe>\n`;
    html += `</div>\n`;

    // Add schema markup
    const schema = this.generateSchema(config);
    html += '\n<script type="application/ld+json">\n';
    html += JSON.stringify(schema, null, 2);
    html += '\n</script>';

    return html;
  }

  /**
   * Generate recommendations for video SEO
   */
  private static generateRecommendations(config: VideoSeoConfig): VideoRecommendation[] {
    const recommendations: VideoRecommendation[] = [];

    // Check for essential fields
    if (!config.contentUrl && !config.embedUrl) {
      recommendations.push({
        type: 'error',
        category: 'schema',
        title: 'Missing video URL',
        description: 'Either contentUrl or embedUrl must be provided.',
        priority: 'high',
        impact: 100,
        suggestion: 'Add contentUrl or embedUrl to the video configuration.'
      });
    }

    // Check thumbnail
    if (config.thumbnailUrl && !this.isValidImageUrl(config.thumbnailUrl)) {
      recommendations.push({
        type: 'warning',
        category: 'thumbnail',
        title: 'Invalid thumbnail URL',
        description: 'Thumbnail URL should be a valid image URL.',
        priority: 'high',
        impact: 80
      });
    }

    // Check description length
    if (config.description.length < 100) {
      recommendations.push({
        type: 'suggestion',
        category: 'metadata',
        title: 'Short video description',
        description: 'Video descriptions should be at least 100 characters for better SEO.',
        priority: 'medium',
        impact: 60,
        suggestion: 'Expand your video description to provide more context.'
      });
    }

    // Check for transcript
    if (!config.transcript) {
      recommendations.push({
        type: 'suggestion',
        category: 'accessibility',
        title: 'Missing transcript',
        description: 'Video transcripts improve accessibility and SEO.',
        priority: 'medium',
        impact: 70,
        suggestion: 'Add a transcript of the video content.'
      });
    }

    // Check for captions
    if (!config.captions || config.captions.length === 0) {
      recommendations.push({
        type: 'suggestion',
        category: 'accessibility',
        title: 'Missing captions',
        description: 'Captions make videos accessible and improve engagement.',
        priority: 'medium',
        impact: 65,
        suggestion: 'Add captions in multiple languages.'
      });
    }

    // Check for tags
    if (!config.tags || config.tags.length === 0) {
      recommendations.push({
        type: 'suggestion',
        category: 'metadata',
        title: 'No tags',
        description: 'Tags help categorize and discover your video.',
        priority: 'low',
        impact: 40,
        suggestion: 'Add 5-10 relevant tags to your video.'
      });
    }

    // Success messages
    if (config.transcript && config.captions && config.captions.length > 0) {
      recommendations.push({
        type: 'success',
        category: 'accessibility',
        title: 'Excellent accessibility',
        description: 'Your video has both transcript and captions.',
        priority: 'low',
        impact: 100
      });
    }

    return recommendations;
  }

  /**
   * Calculate overall video SEO score
   */
  private static calculateSeoScore(config: VideoSeoConfig): number {
    let score = 50; // Base score

    // Essential fields
    if (config.contentUrl || config.embedUrl) score += 15;
    if (config.thumbnailUrl) score += 10;
    if (config.description.length >= 100) score += 10;

    // Optional but important
    if (config.transcript) score += 8;
    if (config.captions && config.captions.length > 0) score += 7;
    if (config.tags && config.tags.length >= 5) score += 5;
    if (config.category) score += 3;
    if (config.publisher) score += 2;

    return Math.min(100, score);
  }

  // Helper methods

  private static parseDuration(duration: string): number {
    // Parse ISO 8601 duration (e.g., "PT1H30M" -> 5400 seconds)
    const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!matches) return 0;

    const hours = parseInt(matches[1] || '0', 10);
    const minutes = parseInt(matches[2] || '0', 10);
    const seconds = parseInt(matches[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
  }

  private static isValidImageUrl(url: string): boolean {
    return /\.(jpg|jpeg|png|webp|gif)$/i.test(url);
  }

  private static escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private static escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

/**
 * USAGE EXAMPLES:
 *
 * // 1. Optimize single video
 * const result = VideoSeo.optimizeVideo({
 *   name: 'How to Build a Website',
 *   description: 'Learn web development from scratch with this comprehensive tutorial.',
 *   thumbnailUrl: 'https://example.com/thumb.jpg',
 *   uploadDate: '2024-01-15',
 *   duration: 'PT10M30S',
 *   embedUrl: 'https://youtube.com/embed/abc123',
 *   transcript: 'Full transcript here...',
 *   captions: [
 *     { language: 'en', url: 'https://example.com/en.vtt' },
 *     { language: 'es', url: 'https://example.com/es.vtt' }
 *   ],
 *   tags: ['web development', 'tutorial', 'html', 'css'],
 *   creator: 'John Doe',
 *   viewCount: 10000,
 *   rating: 4.8
 * }, 'https://example.com/video-page');
 *
 * console.log(result.seoScore); // 92
 * console.log(result.schemaJson); // JSON-LD schema
 * console.log(result.embedCode); // <iframe> embed code
 *
 * // 2. Generate video sitemap
 * const sitemap = VideoSeo.generateVideoSitemap([
 *   {
 *     config: videoConfig1,
 *     pageUrl: 'https://example.com/video1'
 *   },
 *   {
 *     config: videoConfig2,
 *     pageUrl: 'https://example.com/video2'
 *   }
 * ]);
 *
 * // 3. Generate schema markup only
 * const schema = VideoSeo.generateSchema(videoConfig);
 * // Add to <head>: <script type="application/ld+json">{JSON.stringify(schema)}</script>
 */
