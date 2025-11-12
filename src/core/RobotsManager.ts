// src/core/RobotsManager.ts

/**
 * Framework-agnostic Robots.txt Manager
 * Generates and manages robots.txt content
 */

export interface RobotRule {
  userAgent: string;
  allow?: string[];
  disallow?: string[];
  crawlDelay?: number;
}

export interface RobotsConfig {
  rules: RobotRule[];
  sitemap?: string | string[];
  host?: string;
}

export class RobotsManager {
  private config: RobotsConfig;

  constructor(config: RobotsConfig = { rules: [] }) {
    this.config = config;
  }

  /**
   * Add a robot rule
   */
  addRule(rule: RobotRule): this {
    this.config.rules.push(rule);
    return this;
  }

  /**
   * Allow all robots (permissive)
   */
  allowAll(): this {
    this.config.rules = [{
      userAgent: '*',
      allow: ['/']
    }];
    return this;
  }

  /**
   * Disallow all robots (restrictive)
   */
  disallowAll(): this {
    this.config.rules = [{
      userAgent: '*',
      disallow: ['/']
    }];
    return this;
  }

  /**
   * Set sitemap URL(s)
   */
  setSitemap(sitemap: string | string[]): this {
    this.config.sitemap = sitemap;
    return this;
  }

  /**
   * Set preferred host
   */
  setHost(host: string): this {
    this.config.host = host;
    return this;
  }

  /**
   * Generate robots.txt content
   */
  toString(): string {
    let content = '';

    // Add rules
    this.config.rules.forEach(rule => {
      content += `User-agent: ${rule.userAgent}\n`;

      if (rule.allow) {
        rule.allow.forEach(path => {
          content += `Allow: ${path}\n`;
        });
      }

      if (rule.disallow) {
        rule.disallow.forEach(path => {
          content += `Disallow: ${path}\n`;
        });
      }

      if (rule.crawlDelay !== undefined) {
        content += `Crawl-delay: ${rule.crawlDelay}\n`;
      }

      content += '\n';
    });

    // Add sitemaps
    if (this.config.sitemap) {
      const sitemaps = Array.isArray(this.config.sitemap)
        ? this.config.sitemap
        : [this.config.sitemap];

      sitemaps.forEach(url => {
        content += `Sitemap: ${url}\n`;
      });
    }

    // Add host
    if (this.config.host) {
      content += `\nHost: ${this.config.host}\n`;
    }

    return content.trim();
  }

  /**
   * Get configuration
   */
  getConfig(): RobotsConfig {
    return { ...this.config };
  }
}
