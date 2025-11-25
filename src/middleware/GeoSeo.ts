/**
 * GeoSeo - Geographic and Location-Based SEO Optimization
 *
 * Purpose:
 * - Optimize SEO for location-specific content
 * - Handle multi-region websites with proper hreflang
 * - Implement geo-targeted meta tags and structured data
 * - Manage local business SEO (Google My Business integration)
 * - Serve location-specific sitemaps
 * - Detect user location for personalized SEO
 *
 * Use Cases:
 * - Multi-country e-commerce sites
 * - Local business directories
 * - Restaurant chains with multiple locations
 * - Real estate websites
 * - Event platforms with location-based listings
 * - Service providers with regional coverage
 *
 * Application:
 * - Express middleware for geo-detection and redirects
 * - Next.js/Nuxt middleware for ISR with geo-targeting
 * - React/Vue components for location-aware meta tags
 * - CDN edge functions for geo-based content delivery
 */

export interface GeoLocation {
  country: string; // ISO 3166-1 alpha-2 code (e.g., 'US')
  countryName: string;
  region?: string; // State/Province code
  regionName?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  currency?: string;
  languages?: string[]; // Preferred languages
}

export interface LocalBusiness {
  name: string;
  type: string; // Schema.org type (e.g., 'Restaurant', 'Store')
  address: {
    streetAddress: string;
    addressLocality: string; // City
    addressRegion: string; // State/Province
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  telephone?: string;
  email?: string;
  url?: string;
  openingHours?: string[]; // e.g., ['Mo-Fr 09:00-17:00']
  priceRange?: string; // e.g., '$$'
  image?: string;
  servesCuisine?: string[]; // For restaurants
  paymentAccepted?: string[]; // e.g., ['Cash', 'Credit Card']
}

export interface GeoSeoConfig {
  defaultCountry?: string;
  enableAutoDetection?: boolean;
  enableRedirects?: boolean; // Redirect to geo-specific URLs
  cookieName?: string;
  ipGeolocationService?: (ip: string) => Promise<GeoLocation>;
  supportedRegions?: string[]; // List of supported country codes
  regionalUrls?: Record<string, string>; // Country code -> base URL mapping
}

export interface GeoMetaTags {
  'geo.region'?: string; // e.g., 'US-CA'
  'geo.placename'?: string; // e.g., 'San Francisco'
  'geo.position'?: string; // e.g., '37.7749;-122.4194'
  'ICBM'?: string; // Same as geo.position
  'DC.title'?: string; // Dublin Core title
}

/**
 * Geographic SEO Manager
 *
 * Features:
 * - IP-based geolocation detection
 * - Location-specific meta tags and structured data
 * - Multi-region hreflang management
 * - Local business schema generation
 * - Geo-targeted canonical URLs
 * - Location-based sitemap generation
 */
export class GeoSeo {
  private config: Required<GeoSeoConfig>;
  private detectedLocations: Map<string, GeoLocation>; // IP -> Location cache

  constructor(config: GeoSeoConfig = {}) {
    this.config = {
      defaultCountry: config.defaultCountry ?? 'US',
      enableAutoDetection: config.enableAutoDetection ?? true,
      enableRedirects: config.enableRedirects ?? false,
      cookieName: config.cookieName ?? 'geo_location',
      ipGeolocationService: config.ipGeolocationService ?? this.defaultGeolocation.bind(this),
      supportedRegions: config.supportedRegions ?? [],
      regionalUrls: config.regionalUrls ?? {},
    };

    this.detectedLocations = new Map();
  }

  /**
   * Detect user location from IP address
   *
   * @example
   * ```typescript
   * const geoSeo = new GeoSeo();
   * const location = await geoSeo.detectLocation('8.8.8.8');
   * // Returns: { country: 'US', countryName: 'United States', ... }
   * ```
   */
  async detectLocation(ip: string): Promise<GeoLocation> {
    // Check cache first
    if (this.detectedLocations.has(ip)) {
      return this.detectedLocations.get(ip)!;
    }

    const location = await this.config.ipGeolocationService(ip);
    this.detectedLocations.set(ip, location);

    return location;
  }

  /**
   * Generate geo-specific meta tags
   *
   * @example
   * ```typescript
   * const tags = geoSeo.getGeoMetaTags({
   *   country: 'US',
   *   region: 'CA',
   *   city: 'San Francisco',
   *   latitude: 37.7749,
   *   longitude: -122.4194
   * });
   * ```
   */
  getGeoMetaTags(location: Partial<GeoLocation>): GeoMetaTags {
    const tags: GeoMetaTags = {};

    // geo.region format: ISO-3166-1 + ISO-3166-2
    if (location.country && location.region) {
      tags['geo.region'] = `${location.country}-${location.region}`;
    } else if (location.country) {
      tags['geo.region'] = location.country;
    }

    if (location.city) {
      tags['geo.placename'] = location.city;
    }

    if (location.latitude !== undefined && location.longitude !== undefined) {
      const position = `${location.latitude};${location.longitude}`;
      tags['geo.position'] = position;
      tags['ICBM'] = position; // Legacy format
    }

    return tags;
  }

  /**
   * Generate LocalBusiness structured data (Schema.org)
   *
   * @example
   * ```typescript
   * const schema = geoSeo.getLocalBusinessSchema({
   *   name: 'Joe\'s Coffee Shop',
   *   type: 'CoffeeShop',
   *   address: {
   *     streetAddress: '123 Main St',
   *     addressLocality: 'San Francisco',
   *     addressRegion: 'CA',
   *     postalCode: '94102',
   *     addressCountry: 'US'
   *   },
   *   geo: { latitude: 37.7749, longitude: -122.4194 },
   *   telephone: '+1-415-555-0123',
   *   openingHours: ['Mo-Fr 07:00-18:00', 'Sa-Su 08:00-16:00']
   * });
   * ```
   */
  getLocalBusinessSchema(business: LocalBusiness): Record<string, any> {
    const schema: Record<string, any> = {
      '@context': 'https://schema.org',
      '@type': business.type,
      name: business.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address.streetAddress,
        addressLocality: business.address.addressLocality,
        addressRegion: business.address.addressRegion,
        postalCode: business.address.postalCode,
        addressCountry: business.address.addressCountry,
      },
    };

    if (business.geo) {
      schema.geo = {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      };
    }

    if (business.telephone) {
      schema.telephone = business.telephone;
    }

    if (business.email) {
      schema.email = business.email;
    }

    if (business.url) {
      schema.url = business.url;
    }

    if (business.image) {
      schema.image = business.image;
    }

    if (business.openingHours) {
      schema.openingHoursSpecification = this.formatOpeningHours(business.openingHours);
    }

    if (business.priceRange) {
      schema.priceRange = business.priceRange;
    }

    if (business.servesCuisine) {
      schema.servesCuisine = business.servesCuisine;
    }

    if (business.paymentAccepted) {
      schema.paymentAccepted = business.paymentAccepted;
    }

    return schema;
  }

  /**
   * Format opening hours for Schema.org
   */
  private formatOpeningHours(hours: string[]): Array<Record<string, any>> {
    return hours.map(hour => {
      const parts = hour.split(' ');
      if (parts.length !== 2) return null;

      const days = parts[0];
      const time = parts[1];

      if (!days || !time) return null;

      const timeParts = time.split('-');
      if (timeParts.length !== 2) return null;

      const opens = timeParts[0];
      const closes = timeParts[1];

      if (!opens || !closes) return null;

      return {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: this.expandDayRange(days),
        opens,
        closes,
      };
    }).filter(Boolean) as Array<Record<string, any>>;
  }

  /**
   * Expand day range (e.g., 'Mo-Fr' -> ['Monday', 'Tuesday', ...])
   */
  private expandDayRange(range: string): string[] {
    const dayMap: Record<string, string> = {
      Mo: 'Monday',
      Tu: 'Tuesday',
      We: 'Wednesday',
      Th: 'Thursday',
      Fr: 'Friday',
      Sa: 'Saturday',
      Su: 'Sunday',
    };

    if (range.includes('-')) {
      const parts = range.split('-');
      if (parts.length !== 2) return [];

      const start = parts[0];
      const end = parts[1];

      if (!start || !end) return [];

      const days = Object.keys(dayMap);
      const startIdx = days.indexOf(start);
      const endIdx = days.indexOf(end);

      if (startIdx === -1 || endIdx === -1) return [];

      return days
        .slice(startIdx, endIdx + 1)
        .map(day => dayMap[day])
        .filter((day): day is string => day !== undefined);
    }

    const mappedDay = dayMap[range];
    return mappedDay ? [mappedDay] : [];
  }

  /**
   * Generate geo-targeted canonical URL
   *
   * @example
   * ```typescript
   * const canonical = geoSeo.getGeoCanonical('/products', 'US');
   * // Returns: 'https://us.example.com/products'
   * ```
   */
  getGeoCanonical(path: string, country: string): string {
    const baseUrl = this.config.regionalUrls[country];

    if (!baseUrl) {
      return path;
    }

    return `${baseUrl}${path}`;
  }

  /**
   * Generate hreflang tags for multi-region sites
   *
   * @example
   * ```typescript
   * const hreflang = geoSeo.getRegionalHreflang('/products', {
   *   'en-US': 'https://us.example.com/products',
   *   'en-GB': 'https://uk.example.com/products',
   *   'fr-FR': 'https://fr.example.com/products'
   * });
   * ```
   */
  getRegionalHreflang(
    path: string,
    urls: Record<string, string>
  ): Array<{ hreflang: string; href: string }> {
    const tags: Array<{ hreflang: string; href: string }> = [];

    Object.entries(urls).forEach(([locale, baseUrl]) => {
      tags.push({
        hreflang: locale,
        href: `${baseUrl}${path}`,
      });
    });

    // Add x-default
    const defaultUrl = Object.values(urls)[0];
    if (defaultUrl) {
      tags.push({
        hreflang: 'x-default',
        href: `${defaultUrl}${path}`,
      });
    }

    return tags;
  }

  /**
   * Get redirect URL based on user location
   *
   * @example
   * ```typescript
   * const redirectUrl = geoSeo.getRedirectUrl('/products', { country: 'GB' });
   * if (redirectUrl) {
   *   res.redirect(302, redirectUrl);
   * }
   * ```
   */
  getRedirectUrl(currentPath: string, location: GeoLocation): string | null {
    if (!this.config.enableRedirects) {
      return null;
    }

    const regionalUrl = this.config.regionalUrls[location.country];

    if (!regionalUrl) {
      return null;
    }

    return `${regionalUrl}${currentPath}`;
  }

  /**
   * Check if region is supported
   */
  isRegionSupported(country: string): boolean {
    if (this.config.supportedRegions.length === 0) {
      return true; // No restrictions
    }

    return this.config.supportedRegions.includes(country);
  }

  /**
   * Default geolocation service (placeholder)
   * Override with actual IP geolocation API
   */
  private async defaultGeolocation(_ip: string): Promise<GeoLocation> {
    // In production, integrate with services like:
    // - MaxMind GeoIP2
    // - ipapi.co
    // - IP2Location
    // - CloudFlare Workers (via CF-IPCountry header)
    // The _ip parameter is prefixed with underscore to indicate it's intentionally unused
    // in this placeholder implementation but will be used when integrated with real services

    return {
      country: this.config.defaultCountry,
      countryName: 'Unknown',
      languages: ['en'],
    };
  }

  /**
   * Calculate distance between two coordinates (Haversine formula)
   * Useful for proximity-based search and "near me" functionality
   *
   * @returns Distance in kilometers
   *
   * @example
   * ```typescript
   * const distance = geoSeo.calculateDistance(
   *   37.7749, -122.4194, // San Francisco
   *   34.0522, -118.2437  // Los Angeles
   * );
   * // Returns: ~559 km
   * ```
   */
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  /**
   * Generate location-based breadcrumb structured data
   *
   * @example
   * ```typescript
   * const breadcrumbs = geoSeo.getLocationBreadcrumbs([
   *   { name: 'Home', url: 'https://example.com' },
   *   { name: 'United States', url: 'https://example.com/us' },
   *   { name: 'California', url: 'https://example.com/us/ca' },
   *   { name: 'San Francisco', url: 'https://example.com/us/ca/san-francisco' }
   * ]);
   * ```
   */
  getLocationBreadcrumbs(
    items: Array<{ name: string; url: string }>
  ): Record<string, any> {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }

  /**
   * Clear location cache
   */
  clearCache(): void {
    this.detectedLocations.clear();
  }
}
