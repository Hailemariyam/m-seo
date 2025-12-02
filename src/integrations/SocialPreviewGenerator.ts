// src/integrations/SocialPreviewGenerator.ts

/**
 * Social Preview Generator
 *
 * PURPOSE:
 * - Generates rich social media preview cards (Open Graph, Twitter Cards)
 * - Creates visual previews for social media sharing
 * - Validates social meta tags
 * - Tests how content appears on different platforms
 *
 * USE CASES:
 * - Preview how links will appear on Facebook, Twitter, LinkedIn
 * - Generate optimized social sharing images
 * - Validate Open Graph and Twitter Card tags
 * - A/B test different social preview configurations
 * - Debug social media sharing issues
 */

export interface SocialPlatform {
  facebook: 'facebook';
  twitter: 'twitter';
  linkedin: 'linkedin';
  pinterest: 'pinterest';
  whatsapp: 'whatsapp';
  telegram: 'telegram';
  reddit: 'reddit';
}

export interface OpenGraphData {
  title: string;
  description: string;
  image: string;
  url: string;
  type?: 'website' | 'article' | 'video' | 'music' | 'book' | 'profile';
  siteName?: string;
  locale?: string;

  // Article-specific
  articleAuthor?: string;
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];

  // Video-specific
  videoUrl?: string;
  videoSecureUrl?: string;
  videoType?: string;
  videoWidth?: number;
  videoHeight?: number;
  videoDuration?: number;

  // Image-specific
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  imageType?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  site?: string;
  creator?: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;

  // App card specific
  appNameIphone?: string;
  appIdIphone?: string;
  appNameIpad?: string;
  appIdIpad?: string;
  appNameGoogleplay?: string;
  appIdGoogleplay?: string;

  // Player card specific
  playerUrl?: string;
  playerWidth?: number;
  playerHeight?: number;
  playerStream?: string;
}

export interface SocialPreviewConfig {
  og?: Partial<OpenGraphData>;
  twitter?: Partial<TwitterCardData>;
  generateImage?: boolean;
  imageTemplate?: 'default' | 'modern' | 'minimal' | 'bold';
  imageSize?: {
    width: number;
    height: number;
  };
}

export interface PreviewValidation {
  isValid: boolean;
  platform: keyof SocialPlatform;
  errors: string[];
  warnings: string[];
  suggestions: string[];
  requiredTags: string[];
  optionalTags: string[];
  score: number; // 0-100
}

export interface SocialPreviewResult {
  platform: keyof SocialPlatform;
  title: string;
  description: string;
  image: string;
  url: string;
  preview: {
    html: string;
    styles: string;
  };
  validation: PreviewValidation;
  meta: {
    titleLength: number;
    descriptionLength: number;
    imageAspectRatio?: string;
    imageDimensions?: { width: number; height: number };
  };
}

export class SocialPreviewGenerator {
  /**
   * Generate social preview for a specific platform
   */
  static generatePreview(
    platform: keyof SocialPlatform,
    config: SocialPreviewConfig
  ): SocialPreviewResult {
    const og = config.og || {};
    const twitter = config.twitter || {};

    const title = platform === 'twitter' ? (twitter.title || og.title || '') : (og.title || '');
    const description = platform === 'twitter'
      ? (twitter.description || og.description || '')
      : (og.description || '');
    const image = platform === 'twitter' ? (twitter.image || og.image || '') : (og.image || '');
    const url = og.url || '';

    const validation = this.validatePreview(platform, { og, twitter });
    const preview = this.renderPreview(platform, { title, description, image, url });

    return {
      platform,
      title,
      description,
      image,
      url,
      preview,
      validation,
      meta: {
        titleLength: title.length,
        descriptionLength: description.length,
        imageAspectRatio: this.calculateAspectRatio(og.imageWidth, og.imageHeight),
        imageDimensions: og.imageWidth && og.imageHeight
          ? { width: og.imageWidth, height: og.imageHeight }
          : undefined
      }
    };
  }

  /**
   * Validate social preview data for a platform
   */
  static validatePreview(
    platform: keyof SocialPlatform,
    data: { og?: Partial<OpenGraphData>; twitter?: Partial<TwitterCardData> }
  ): PreviewValidation {
    const errors: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    const requiredTags: string[] = [];
    const optionalTags: string[] = [];

    // Platform-specific validation
    switch (platform) {
      case 'facebook':
        return this.validateFacebook(data.og, errors, warnings, suggestions, requiredTags, optionalTags);
      case 'twitter':
        return this.validateTwitter(data.twitter, errors, warnings, suggestions, requiredTags, optionalTags);
      case 'linkedin':
        return this.validateLinkedIn(data.og, errors, warnings, suggestions, requiredTags, optionalTags);
      default:
        return this.validateGeneric(data.og, errors, warnings, suggestions, requiredTags, optionalTags);
    }
  }

  /**
   * Generate meta tags for social platforms
   */
  static generateMetaTags(config: SocialPreviewConfig): string {
    const tags: string[] = [];

    // Open Graph tags
    if (config.og) {
      const og = config.og;
      if (og.title) tags.push(`<meta property="og:title" content="${this.escape(og.title)}">`);
      if (og.description) tags.push(`<meta property="og:description" content="${this.escape(og.description)}">`);
      if (og.image) tags.push(`<meta property="og:image" content="${this.escape(og.image)}">`);
      if (og.url) tags.push(`<meta property="og:url" content="${this.escape(og.url)}">`);
      if (og.type) tags.push(`<meta property="og:type" content="${og.type}">`);
      if (og.siteName) tags.push(`<meta property="og:site_name" content="${this.escape(og.siteName)}">`);
      if (og.locale) tags.push(`<meta property="og:locale" content="${og.locale}">`);

      if (og.imageWidth) tags.push(`<meta property="og:image:width" content="${og.imageWidth}">`);
      if (og.imageHeight) tags.push(`<meta property="og:image:height" content="${og.imageHeight}">`);
      if (og.imageAlt) tags.push(`<meta property="og:image:alt" content="${this.escape(og.imageAlt)}">`);

      // Article tags
      if (og.articleAuthor) tags.push(`<meta property="article:author" content="${this.escape(og.articleAuthor)}">`);
      if (og.articlePublishedTime) tags.push(`<meta property="article:published_time" content="${og.articlePublishedTime}">`);
      if (og.articleModifiedTime) tags.push(`<meta property="article:modified_time" content="${og.articleModifiedTime}">`);
      if (og.articleSection) tags.push(`<meta property="article:section" content="${this.escape(og.articleSection)}">`);
      if (og.articleTags) {
        og.articleTags.forEach(tag => {
          tags.push(`<meta property="article:tag" content="${this.escape(tag)}">`);
        });
      }
    }

    // Twitter Card tags
    if (config.twitter) {
      const tw = config.twitter;
      if (tw.card) tags.push(`<meta name="twitter:card" content="${tw.card}">`);
      if (tw.site) tags.push(`<meta name="twitter:site" content="${tw.site}">`);
      if (tw.creator) tags.push(`<meta name="twitter:creator" content="${tw.creator}">`);
      if (tw.title) tags.push(`<meta name="twitter:title" content="${this.escape(tw.title)}">`);
      if (tw.description) tags.push(`<meta name="twitter:description" content="${this.escape(tw.description)}">`);
      if (tw.image) tags.push(`<meta name="twitter:image" content="${this.escape(tw.image)}">`);
      if (tw.imageAlt) tags.push(`<meta name="twitter:image:alt" content="${this.escape(tw.imageAlt)}">`);
    }

    return tags.join('\n');
  }

  /**
   * Test social preview by generating debug URL
   */
  static getDebugUrls(url: string): Record<keyof SocialPlatform, string> {
    const encodedUrl = encodeURIComponent(url);

    return {
      facebook: `https://developers.facebook.com/tools/debug/?q=${encodedUrl}`,
      twitter: `https://cards-dev.twitter.com/validator?url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/post-inspector/inspect/${encodedUrl}`,
      pinterest: `https://developers.pinterest.com/tools/url-debugger/?link=${encodedUrl}`,
      whatsapp: url, // WhatsApp doesn't have public debugger
      telegram: url, // Telegram doesn't have public debugger
      reddit: url // Reddit doesn't have public debugger
    };
  }

  // Private helper methods

  private static validateFacebook(
    og: Partial<OpenGraphData> | undefined,
    errors: string[],
    warnings: string[],
    suggestions: string[],
    requiredTags: string[],
    optionalTags: string[]
  ): PreviewValidation {
    requiredTags.push('og:title', 'og:description', 'og:image', 'og:url');
    optionalTags.push('og:type', 'og:site_name', 'og:locale');

    if (!og?.title) errors.push('og:title is required');
    else if (og.title.length > 90) warnings.push(`Title too long (${og.title.length}/90 chars)`);
    else if (og.title.length > 60) suggestions.push('Consider shorter title (60 chars recommended)');

    if (!og?.description) errors.push('og:description is required');
    else if (og.description.length > 300) warnings.push(`Description too long (${og.description.length}/300 chars)`);
    else if (og.description.length > 200) suggestions.push('Consider shorter description (200 chars recommended)');

    if (!og?.image) errors.push('og:image is required');
    else {
      if (og.imageWidth && og.imageWidth < 600) {
        warnings.push(`Image width too small (${og.imageWidth}px, min 600px)`);
      }
      if (!og.imageWidth || !og.imageHeight) {
        suggestions.push('Add og:image:width and og:image:height for better performance');
      }
    }

    if (!og?.url) errors.push('og:url is required');

    const score = this.calculateScore(errors.length, warnings.length, suggestions.length);

    return {
      isValid: errors.length === 0,
      platform: 'facebook',
      errors,
      warnings,
      suggestions,
      requiredTags,
      optionalTags,
      score
    };
  }

  private static validateTwitter(
    twitter: Partial<TwitterCardData> | undefined,
    errors: string[],
    warnings: string[],
    suggestions: string[],
    requiredTags: string[],
    optionalTags: string[]
  ): PreviewValidation {
    requiredTags.push('twitter:card', 'twitter:title', 'twitter:description', 'twitter:image');
    optionalTags.push('twitter:site', 'twitter:creator', 'twitter:image:alt');

    if (!twitter?.card) errors.push('twitter:card is required');

    if (!twitter?.title) errors.push('twitter:title is required');
    else if (twitter.title.length > 70) warnings.push(`Title too long (${twitter.title.length}/70 chars)`);

    if (!twitter?.description) errors.push('twitter:description is required');
    else if (twitter.description.length > 200) warnings.push(`Description too long (${twitter.description.length}/200 chars)`);

    if (!twitter?.image) errors.push('twitter:image is required');
    else if (!twitter.imageAlt) {
      suggestions.push('Add twitter:image:alt for accessibility');
    }

    if (!twitter?.site) suggestions.push('Add twitter:site for attribution');

    const score = this.calculateScore(errors.length, warnings.length, suggestions.length);

    return {
      isValid: errors.length === 0,
      platform: 'twitter',
      errors,
      warnings,
      suggestions,
      requiredTags,
      optionalTags,
      score
    };
  }

  private static validateLinkedIn(
    og: Partial<OpenGraphData> | undefined,
    errors: string[],
    warnings: string[],
    suggestions: string[],
    requiredTags: string[],
    optionalTags: string[]
  ): PreviewValidation {
    requiredTags.push('og:title', 'og:description', 'og:image', 'og:url');

    if (!og?.title) errors.push('og:title is required');
    if (!og?.description) errors.push('og:description is required');
    if (!og?.image) errors.push('og:image is required');
    if (!og?.url) errors.push('og:url is required');

    const score = this.calculateScore(errors.length, warnings.length, suggestions.length);

    return {
      isValid: errors.length === 0,
      platform: 'linkedin',
      errors,
      warnings,
      suggestions,
      requiredTags,
      optionalTags,
      score
    };
  }

  private static validateGeneric(
    og: Partial<OpenGraphData> | undefined,
    errors: string[],
    warnings: string[],
    suggestions: string[],
    requiredTags: string[],
    optionalTags: string[]
  ): PreviewValidation {
    if (!og?.title) warnings.push('Title recommended');
    if (!og?.description) warnings.push('Description recommended');
    if (!og?.image) warnings.push('Image recommended');

    const score = this.calculateScore(errors.length, warnings.length, suggestions.length);

    return {
      isValid: true,
      platform: 'facebook', // default
      errors,
      warnings,
      suggestions,
      requiredTags,
      optionalTags,
      score
    };
  }

  private static renderPreview(
    platform: keyof SocialPlatform,
    data: { title: string; description: string; image: string; url: string }
  ): { html: string; styles: string } {
    // Generate HTML preview based on platform
    const html = `
      <div class="social-preview social-preview-${platform}">
        <div class="preview-image">
          <img src="${data.image}" alt="${data.title}" />
        </div>
        <div class="preview-content">
          <div class="preview-title">${data.title}</div>
          <div class="preview-description">${data.description}</div>
          <div class="preview-url">${data.url}</div>
        </div>
      </div>
    `;

    const styles = `
      .social-preview {
        border: 1px solid #ddd;
        border-radius: 8px;
        overflow: hidden;
        max-width: 600px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .preview-image img {
        width: 100%;
        height: auto;
        display: block;
      }
      .preview-content {
        padding: 12px;
      }
      .preview-title {
        font-weight: 600;
        font-size: 16px;
        margin-bottom: 4px;
        color: #1d1d1f;
      }
      .preview-description {
        font-size: 14px;
        color: #6e6e73;
        margin-bottom: 4px;
      }
      .preview-url {
        font-size: 12px;
        color: #86868b;
      }
    `;

    return { html, styles };
  }

  private static calculateScore(errors: number, warnings: number, suggestions: number): number {
    let score = 100;
    score -= errors * 25; // -25 per error
    score -= warnings * 10; // -10 per warning
    score -= suggestions * 5; // -5 per suggestion
    return Math.max(0, score);
  }

  private static calculateAspectRatio(width?: number, height?: number): string | undefined {
    if (!width || !height) return undefined;
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
    const divisor = gcd(width, height);
    return `${width / divisor}:${height / divisor}`;
  }

  private static escape(text: string): string {
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
 * // 1. Generate Facebook preview
 * const fbPreview = SocialPreviewGenerator.generatePreview('facebook', {
 *   og: {
 *     title: 'My Awesome Article',
 *     description: 'This is a great article about SEO',
 *     image: 'https://example.com/image.jpg',
 *     url: 'https://example.com/article',
 *     type: 'article',
 *     imageWidth: 1200,
 *     imageHeight: 630
 *   }
 * });
 *
 * // 2. Generate Twitter Card preview
 * const twitterPreview = SocialPreviewGenerator.generatePreview('twitter', {
 *   twitter: {
 *     card: 'summary_large_image',
 *     title: 'My Awesome Article',
 *     description: 'This is a great article',
 *     image: 'https://example.com/image.jpg',
 *     site: '@mysite',
 *     creator: '@author'
 *   }
 * });
 *
 * // 3. Validate social preview
 * const validation = SocialPreviewGenerator.validatePreview('facebook', {
 *   og: {
 *     title: 'My Title',
 *     description: 'My Description',
 *     image: 'https://example.com/image.jpg',
 *     url: 'https://example.com'
 *   }
 * });
 *
 * // 4. Generate meta tags
 * const metaTags = SocialPreviewGenerator.generateMetaTags({
 *   og: {
 *     title: 'My Page',
 *     description: 'Description',
 *     image: 'https://example.com/image.jpg',
 *     url: 'https://example.com'
 *   },
 *   twitter: {
 *     card: 'summary_large_image',
 *     site: '@mysite'
 *   }
 * });
 *
 * // 5. Get debug URLs for testing
 * const debugUrls = SocialPreviewGenerator.getDebugUrls('https://example.com/page');
 * console.log(debugUrls.facebook); // Facebook debugger URL
 * console.log(debugUrls.twitter);  // Twitter validator URL
 */
