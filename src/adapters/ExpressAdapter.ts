


import type { Request, Response, NextFunction } from 'express';

export interface ExpressAdapterOptions {
  siteName?: string;
  baseUrl?: string;
  enableSecurity?: boolean;
  enableCaching?: boolean;
  enableGeoSeo?: boolean;
  enableCsp?: boolean;
  cspDirectives?: Record<string, string>;
  enableRateLimit?: boolean;
  rateLimiter?: { consume: (key: string) => Promise<void> };
  allowedOrigins?: string[];
  seoEngine?: any;
  googleAnalytics?: any;
  botDetection?: any;
  seoAuditEngine?: any;
  customHeaders?: Record<string, string>;
}

export class ExpressAdapter {
	private options: ExpressAdapterOptions;

	constructor(options: ExpressAdapterOptions = {}) {
		this.options = options;
	}

	/**
	 * Advanced Express middleware for security, SEO, analytics, and bot detection
	 */
	middleware() {
			return (req: Request, res: Response, next: NextFunction) => {
				(async () => {
			// --- Security Headers ---
			if (this.options.enableSecurity) {
				res.setHeader('X-Content-Type-Options', 'nosniff');
				res.setHeader('X-Frame-Options', 'SAMEORIGIN');
				res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
				res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
				res.setHeader('X-XSS-Protection', '1; mode=block');
				res.setHeader('Permissions-Policy', 'geolocation=(), microphone=()');
				if (this.options.allowedOrigins && req.headers.origin) {
					if (this.options.allowedOrigins.includes(req.headers.origin)) {
						res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
					}
				}
			}

			// --- Content Security Policy ---
			if (this.options.enableCsp) {
				const defaultCsp = {
					"default-src": "'self'",
					"script-src": "'self' 'unsafe-inline' 'unsafe-eval'",
					"style-src": "'self' 'unsafe-inline'",
					"img-src": "'self' data: https:",
					"font-src": "'self' data: https:",
					"connect-src": "'self' https:"
				};
				const csp = { ...defaultCsp, ...(this.options.cspDirectives || {}) };
				const cspHeader = Object.entries(csp).map(([k, v]) => `${k} ${v}`).join('; ');
				res.setHeader('Content-Security-Policy', cspHeader);
			}

			// --- Rate Limiting ---
					if (this.options.enableRateLimit && this.options.rateLimiter) {
									this.options.rateLimiter.consume(req.ip || '').catch(() => {
										res.status(429).send('Too Many Requests');
									});
					}

			// --- Custom Headers ---
			if (this.options.customHeaders) {
				Object.entries(this.options.customHeaders).forEach(([k, v]) => {
					res.setHeader(k, v);
				});
			}

			// --- Bot Detection ---
			if (this.options.botDetection && typeof this.options.botDetection.isBot === 'function') {
				const userAgent = req.headers['user-agent'] || '';
				if (this.options.botDetection.isBot(userAgent)) {
					res.setHeader('X-Bot-Detected', 'true');
					if (typeof this.options.botDetection.getBotInfo === 'function') {
						const botInfo = this.options.botDetection.getBotInfo(userAgent);
						res.setHeader('X-Bot-Name', botInfo?.name || 'unknown');
					}
				}
			}

			// --- SEO Headers ---
			if (this.options.seoEngine && typeof this.options.seoEngine.generateHeaders === 'function') {
				const headers = this.options.seoEngine.generateHeaders({ url: req.url });
				Object.entries(headers).forEach(([key, value]) => {
					res.setHeader(key, value as string);
				});
			}

			// --- Analytics Integration ---
			if (this.options.googleAnalytics && typeof this.options.googleAnalytics.trackRequest === 'function') {
				this.options.googleAnalytics.trackRequest({ req });
			}

			// --- SEO Audit (async hook, does not block response) ---
			if (this.options.seoAuditEngine && typeof this.options.seoAuditEngine.audit === 'function') {
				this.options.seoAuditEngine.audit(req.url).catch(() => {});
			}

					next();
				})();
			};
	}

	/**
	 * Generate metadata for a route
	 */
	generateMetadata(meta: Record<string, any>) {
		if (this.options.seoEngine && typeof this.options.seoEngine.generateMetadata === 'function') {
			return this.options.seoEngine.generateMetadata(meta);
		}
		return meta;
	}

	/**
	 * Run SEO audit for a given URL
	 */
	async runSeoAudit(url: string) {
		if (this.options.seoAuditEngine && typeof this.options.seoAuditEngine.audit === 'function') {
			return await this.options.seoAuditEngine.audit(url);
		}
		return null;
	}

	/**
	 * Get analytics instance (if available)
	 */
	getAnalyticsInstance() {
		return this.options.googleAnalytics || null;
	}

	/**
	 * Extensibility: add custom middleware logic
	 */
	use(fn: (req: Request, res: Response, next: NextFunction) => void) {
		return fn;
	}
}
