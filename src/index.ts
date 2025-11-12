// src/index.ts
// Entry point for m-seo package - Framework-agnostic SEO library

// Core modules (100% framework-independent)
export { SeoEngine, type SeoConfig, type MetaTag, type LinkTag } from './core/SeoEngine.js';
export { SitemapGenerator, type SitemapUrl, type SitemapOptions } from './core/SitemapGenerator.js';
export { RobotsManager, type RobotRule, type RobotsConfig } from './core/RobotsManager.js';
export { StructuredDataManager, type StructuredData } from './core/StructuredDataManager.js';

// You can use these modules in ANY environment:
// - Node.js (Express, Fastify, Koa)
// - Deno
// - Bun
// - Browser (React, Vue, Angular, vanilla JS)
// - Edge runtimes (Cloudflare Workers, Vercel Edge)
// - Static site generators
