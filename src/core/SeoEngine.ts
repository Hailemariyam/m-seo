// src/core/SeoEngine.ts

/**
 * Framework-agnostic SEO Engine
 * Works in any environment: Node.js, Browser, Deno, Bun, etc.
 */

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  author?: string;
  siteName?: string;
  locale?: string;
  themeColor?: string;
  robots?: string;
}

export interface MetaTag {
  name?: string;
  property?: string;
  content: string;
  httpEquiv?: string;
}

export interface LinkTag {
  rel: string;
  href: string;
  hreflang?: string;
  sizes?: string;
  type?: string;
}

export class SeoEngine {
  private config: SeoConfig;

  constructor(config: SeoConfig = {}) {
    this.config = config;
  }

  /**
   * Generate meta tags from config (framework-agnostic)
   * Returns plain objects that can be used anywhere
   */
  generateMetaTags(): MetaTag[] {
    const tags: MetaTag[] = [];

    if (this.config.title) {
      tags.push({ name: 'title', content: this.config.title });
      tags.push({ property: 'og:title', content: this.config.title });
      tags.push({ name: 'twitter:title', content: this.config.title });
    }

    if (this.config.description) {
      tags.push({ name: 'description', content: this.config.description });
      tags.push({ property: 'og:description', content: this.config.description });
      tags.push({ name: 'twitter:description', content: this.config.description });
    }

    if (this.config.keywords && this.config.keywords.length > 0) {
      tags.push({ name: 'keywords', content: this.config.keywords.join(', ') });
    }

    if (this.config.ogImage) {
      tags.push({ property: 'og:image', content: this.config.ogImage });
      tags.push({ name: 'twitter:image', content: this.config.ogImage });
      tags.push({ name: 'twitter:card', content: 'summary_large_image' });
    }

    if (this.config.author) {
      tags.push({ name: 'author', content: this.config.author });
    }

    if (this.config.siteName) {
      tags.push({ property: 'og:site_name', content: this.config.siteName });
    }

    if (this.config.locale) {
      tags.push({ property: 'og:locale', content: this.config.locale });
    }

    if (this.config.themeColor) {
      tags.push({ name: 'theme-color', content: this.config.themeColor });
    }

    if (this.config.robots) {
      tags.push({ name: 'robots', content: this.config.robots });
    }

    tags.push({ property: 'og:type', content: 'website' });

    return tags;
  }

  /**
   * Generate link tags (canonical, alternate, etc.)
   */
  generateLinkTags(): LinkTag[] {
    const links: LinkTag[] = [];

    if (this.config.canonical) {
      links.push({ rel: 'canonical', href: this.config.canonical });
      links.push({ rel: 'alternate', href: this.config.canonical, hreflang: this.config.locale || 'en' });
    }

    return links;
  }

  /**
   * Generate HTML string for meta tags (for SSR or static sites)
   */
  toHtmlString(): string {
    const metaTags = this.generateMetaTags();
    const linkTags = this.generateLinkTags();

    const metaHtml = metaTags
      .map(tag => {
        if (tag.name) return `<meta name="${tag.name}" content="${this.escapeHtml(tag.content)}">`;
        if (tag.property) return `<meta property="${tag.property}" content="${this.escapeHtml(tag.content)}">`;
        if (tag.httpEquiv) return `<meta http-equiv="${tag.httpEquiv}" content="${this.escapeHtml(tag.content)}">`;
        return '';
      })
      .join('\n');

    const linkHtml = linkTags
      .map(link => {
        let attrs = `rel="${link.rel}" href="${this.escapeHtml(link.href)}"`;
        if (link.hreflang) attrs += ` hreflang="${link.hreflang}"`;
        if (link.sizes) attrs += ` sizes="${link.sizes}"`;
        if (link.type) attrs += ` type="${link.type}"`;
        return `<link ${attrs}>`;
      })
      .join('\n');

    const titleHtml = this.config.title ? `<title>${this.escapeHtml(this.config.title)}</title>` : '';

    return [titleHtml, metaHtml, linkHtml].filter(Boolean).join('\n');
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<SeoConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Get current configuration
   */
  getConfig(): SeoConfig {
    return { ...this.config };
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m] || m);
  }
}
