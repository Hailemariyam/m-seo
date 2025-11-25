/**
 * M-SEO Next.js Middleware Example
 *
 * This middleware automatically applies security and performance headers
 * to all routes in your Next.js application.
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { seo } from '@/lib/seo';

/**
 * Basic Middleware - Apply SEO headers to all routes
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Generate and apply all headers (security, performance, caching)
  const headers = seo.generateMiddlewareHeaders(request);

  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  return response;
}

/**
 * Advanced Middleware - Conditional header application
 */
export function advancedMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  // Base headers for all routes
  const baseHeaders = seo.generateMiddlewareHeaders(request);
  Object.entries(baseHeaders).forEach(([k, v]) => response.headers.set(k, v));

  // Route-specific optimizations

  // API routes - Add CORS and rate limit headers
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    response.headers.set('X-RateLimit-Limit', '100');
  }

  // Static assets - Aggressive caching
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|css|js|woff2)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // Blog posts - Moderate caching
  if (pathname.startsWith('/blog/')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  // Admin pages - No caching, extra security
  if (pathname.startsWith('/admin/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // Product pages - Short cache with revalidation
  if (pathname.startsWith('/products/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
  }

  return response;
}

/**
 * Geographic Middleware - Redirect based on location
 */
export function geoMiddleware(request: NextRequest) {
  const geoSeo = seo.getGeoSeo();

  if (!geoSeo) {
    return NextResponse.next();
  }

  // Get visitor's country from headers
  const country = request.geo?.country || 'US';
  const { pathname } = request.nextUrl;

  // Redirect to localized version if not already there
  const localeMap: Record<string, string> = {
    'US': '/en-us',
    'GB': '/en-gb',
    'ES': '/es',
    'FR': '/fr',
    'DE': '/de',
    'JP': '/ja',
  };

  const targetLocale = localeMap[country] || '/en-us';

  // If user is on root and not in correct locale
  if (pathname === '/' && !pathname.startsWith(targetLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = targetLocale;
    return NextResponse.redirect(url);
  }

  const response = NextResponse.next();
  const headers = seo.generateMiddlewareHeaders(request);
  Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));

  return response;
}

/**
 * Security-focused Middleware
 */
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  // Get security headers with strict preset
  const security = seo.getSecurity();
  if (security) {
    const securityHeaders = security.getHeaders('strict');
    Object.entries(securityHeaders).forEach(([k, v]) => {
      response.headers.set(k, v);
    });
  }

  // Add additional custom security headers
  response.headers.set('X-Custom-Security', 'enabled');

  // Block requests with suspicious user agents
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.match(/malicious|bot|scraper/i)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  return response;
}

/**
 * Matcher Configuration
 */
export const config = {
  // Apply middleware to all routes except static files and Next.js internals
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

/**
 * Multi-environment Middleware
 */
export function envAwareMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd) {
    // Production: strict security
    const headers = seo.generateMiddlewareHeaders(request);
    Object.entries(headers).forEach(([k, v]) => response.headers.set(k, v));
  } else {
    // Development: relaxed for debugging
    response.headers.set('X-Development-Mode', 'true');
    // Still apply basic security
    const security = seo.getSecurity();
    if (security) {
      const devHeaders = security.getHeaders('relaxed');
      Object.entries(devHeaders).forEach(([k, v]) => response.headers.set(k, v));
    }
  }

  return response;
}

// Export default middleware
export { middleware as default };
