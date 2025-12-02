/**
 * M-SEO Next.js Setup Example
 *
 * This file shows how to configure the Next.js adapter
 * with all available options.
 */

import { createNextAdapter } from 'm-seo';

/**
 * Basic Setup - Minimal configuration
 */
export const basicSeo = createNextAdapter({
  baseUrl: 'https://example.com',
  siteName: 'My Website',
});

/**
 * Advanced Setup - Full features enabled
 */
export const advancedSeo = createNextAdapter({
  // Core Configuration
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com',
  siteName: 'My Awesome Site',
  defaultLocale: 'en-US',
  locales: ['en-US', 'es', 'fr', 'de', 'ja'],

  // Feature Toggles
  enableCaching: true,
  enableSecurity: true,
  enableGeoSeo: true,
  enableAutoSitemap: true,
  enableResourceHints: true,

  // Cache Configuration
  cacheOptions: {
    defaultTtl: 3600, // 1 hour
    namespace: 'next-seo',
  },

  // Security Configuration
  securityPreset: 'balanced', // 'strict' | 'balanced' | 'relaxed'
  customSecurityHeaders: {
    'X-Custom-Header': 'value',
  },

  // Performance Optimization
  preconnectDomains: [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdn.example.com',
  ],
  dnsPrefetchDomains: [
    'https://www.google-analytics.com',
    'https://analytics.example.com',
  ],

  // Geographic SEO
  geoOptions: {
    enableAutoDetection: true,
    defaultRegion: 'US',
    supportedRegions: ['US', 'UK', 'EU', 'APAC'],
  },
});

/**
 * E-commerce Setup - Optimized for online stores
 */
export const ecommerceSeo = createNextAdapter({
  baseUrl: 'https://shop.example.com',
  siteName: 'My Store',
  enableCaching: true,
  enableSecurity: true,
  securityPreset: 'strict', // Stricter for payment pages
  enableGeoSeo: true, // For multi-region pricing
  preconnectDomains: [
    'https://cdn.shopify.com',
    'https://checkout.stripe.com',
  ],
});

/**
 * Blog Setup - Optimized for content sites
 */
export const blogSeo = createNextAdapter({
  baseUrl: 'https://blog.example.com',
  siteName: 'My Blog',
  enableCaching: true,
  cacheOptions: {
    defaultTtl: 7200, // 2 hours for articles
  },
  enableSecurity: true,
  securityPreset: 'relaxed', // More permissive for embeds
  preconnectDomains: [
    'https://fonts.googleapis.com',
  ],
});

/**
 * Multi-region Setup - For global sites
 */
export const globalSeo = createNextAdapter({
  baseUrl: 'https://example.com',
  siteName: 'Global Site',
  defaultLocale: 'en-US',
  locales: [
    'en-US', 'en-GB', 'en-AU',
    'es-ES', 'es-MX',
    'fr-FR', 'fr-CA',
    'de-DE', 'de-AT',
    'ja-JP', 'zh-CN',
  ],
  enableGeoSeo: true,
  geoOptions: {
    enableAutoDetection: true,
    defaultRegion: 'US',
    supportedRegions: ['US', 'UK', 'EU', 'APAC', 'LATAM'],
  },
  enableCaching: true,
  enableSecurity: true,
  securityPreset: 'balanced',
});
