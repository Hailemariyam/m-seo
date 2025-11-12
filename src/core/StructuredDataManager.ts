// src/core/StructuredDataManager.ts

/**
 * Framework-agnostic Structured Data Manager
 * Manages Schema.org JSON-LD structured data
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type StructuredData = Record<string, any> & {
  '@context': string;
  '@type': string;
};

export class StructuredDataManager {
  private schemas: StructuredData[] = [];

  /**
   * Add structured data schema
   */
  addSchema(schema: StructuredData): this {
    // Ensure required fields
    if (!schema['@context']) {
      schema['@context'] = 'https://schema.org';
    }

    if (!schema['@type']) {
      throw new Error('Schema must have @type property');
    }

    this.schemas.push(schema);
    return this;
  }

  /**
   * Add Website schema
   */
  addWebsite(data: {
    name: string;
    url: string;
    description?: string;
    author?: { name: string; url?: string };
  }): this {
    return this.addSchema({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: data.name,
      url: data.url,
      description: data.description,
      author: data.author ? {
        '@type': 'Person',
        name: data.author.name,
        url: data.author.url
      } : undefined
    });
  }

  /**
   * Add Organization schema
   */
  addOrganization(data: {
    name: string;
    url: string;
    logo?: string;
    description?: string;
    sameAs?: string[];
  }): this {
    return this.addSchema({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: data.name,
      url: data.url,
      logo: data.logo,
      description: data.description,
      sameAs: data.sameAs
    });
  }

  /**
   * Add Article schema
   */
  addArticle(data: {
    headline: string;
    description?: string;
    image?: string | string[];
    datePublished?: string;
    dateModified?: string;
    author?: { name: string };
  }): this {
    return this.addSchema({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: data.headline,
      description: data.description,
      image: data.image,
      datePublished: data.datePublished,
      dateModified: data.dateModified,
      author: data.author ? {
        '@type': 'Person',
        name: data.author.name
      } : undefined
    });
  }

  /**
   * Add BreadcrumbList schema
   */
  addBreadcrumb(items: { name: string; url: string }[]): this {
    return this.addSchema({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    });
  }

  /**
   * Generate JSON-LD script tag content
   */
  toHtmlScript(): string {
    if (this.schemas.length === 0) return '';

    const jsonLd = this.schemas.length === 1
      ? this.schemas[0]
      : this.schemas;

    return `<script type="application/ld+json">
${JSON.stringify(jsonLd, null, 2)}
</script>`;
  }

  /**
   * Get all schemas as JSON
   */
  toJson(): StructuredData[] {
    return [...this.schemas];
  }

  /**
   * Clear all schemas
   */
  clear(): this {
    this.schemas = [];
    return this;
  }

  /**
   * Get schema count
   */
  getSchemaCount(): number {
    return this.schemas.length;
  }
}
