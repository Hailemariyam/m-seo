// src/core/SitemapGenerator.ts

/**
 * Framework-agnostic Sitemap Generator
 * Generates XML sitemaps following sitemap.org protocol
 */

export interface SitemapUrl {
  loc: string;
  lastmod?: string | Date;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
  alternates?: { hreflang: string; href: string }[];
}

export interface SitemapOptions {
  hostname: string;
  defaultChangefreq?: SitemapUrl['changefreq'];
  defaultPriority?: number;
}

export class SitemapGenerator {
  private urls: SitemapUrl[] = [];
  private options: SitemapOptions;

  constructor(options: SitemapOptions) {
    this.options = options;
  }

  /**
   * Add a single URL to the sitemap
   */
  addUrl(url: SitemapUrl): this {
    // Validate priority
    if (url.priority !== undefined && (url.priority < 0 || url.priority > 1)) {
      throw new Error('Priority must be between 0 and 1');
    }

    // Ensure absolute URL
    const loc = url.loc.startsWith('http')
      ? url.loc
      : `${this.options.hostname}${url.loc.startsWith('/') ? '' : '/'}${url.loc}`;

    const processedUrl: SitemapUrl = {
      loc,
      lastmod: url.lastmod,
      alternates: url.alternates
    };

    if (url.changefreq || this.options.defaultChangefreq) {
      processedUrl.changefreq = url.changefreq || this.options.defaultChangefreq;
    }

    if (url.priority !== undefined || this.options.defaultPriority !== undefined) {
      processedUrl.priority = url.priority !== undefined ? url.priority : this.options.defaultPriority;
    }

    this.urls.push(processedUrl);

    return this;
  }

  /**
   * Add multiple URLs
   */
  addUrls(urls: SitemapUrl[]): this {
    urls.forEach(url => this.addUrl(url));
    return this;
  }

  /**
   * Generate XML sitemap string
   */
  toXml(): string {
    const formatDate = (date: string | Date | undefined): string | undefined => {
      if (!date) return undefined;
      const d = typeof date === 'string' ? new Date(date) : date;
      return d.toISOString().split('T')[0];
    };

    const urlElements = this.urls.map(url => {
      let xml = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>\n`;

      if (url.lastmod) {
        xml += `    <lastmod>${formatDate(url.lastmod)}</lastmod>\n`;
      }

      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
      }

      if (url.priority !== undefined) {
        xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
      }

      // Add hreflang alternates
      if (url.alternates && url.alternates.length > 0) {
        url.alternates.forEach(alt => {
          xml += `    <xhtml:link rel="alternate" hreflang="${alt.hreflang}" href="${this.escapeXml(alt.href)}" />\n`;
        });
      }

      xml += `  </url>`;
      return xml;
    }).join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlElements}
</urlset>`;
  }

  /**
   * Get sitemap as JSON (useful for APIs)
   */
  toJson(): SitemapUrl[] {
    return [...this.urls];
  }

  /**
   * Clear all URLs
   */
  clear(): this {
    this.urls = [];
    return this;
  }

  /**
   * Get URL count
   */
  getUrlCount(): number {
    return this.urls.length;
  }

  private escapeXml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    };
    return text.replace(/[&<>"']/g, m => map[m] || m);
  }
}
