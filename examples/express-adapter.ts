/**
 * Express.js Adapter Example
 * Shows how to create a thin adapter layer for Express
 */

import express, { Request, Response, NextFunction } from 'express';
import { SeoEngine, SitemapGenerator, RobotsManager } from '../src/index.js';

const app = express();

// Initialize SEO tools (framework-agnostic core)
const sitemap = new SitemapGenerator({
  hostname: 'https://example.com',
  defaultChangefreq: 'weekly',
  defaultPriority: 0.5
});

const robots = new RobotsManager();
robots.allowAll().setSitemap('https://example.com/sitemap.xml');

// Add routes to sitemap automatically
sitemap
  .addUrl({ loc: '/', priority: 1.0, changefreq: 'daily' })
  .addUrl({ loc: '/about', priority: 0.8 })
  .addUrl({ loc: '/contact', priority: 0.7 });

// Middleware: Inject SEO meta tags into response
function seoMiddleware(config: {
  title: string;
  description: string;
  keywords?: string[];
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Create SEO engine with route-specific config
    const seo = new SeoEngine({
      ...config,
      canonical: `https://example.com${req.path}`
    });

    // Attach to response locals so templates can use it
    res.locals.seoTags = seo.toHtmlString();
    res.locals.seoData = seo.generateMetaTags();

    next();
  };
}

// Routes with SEO middleware
app.get('/',
  seoMiddleware({
    title: 'Home - My Site',
    description: 'Welcome to my site',
    keywords: ['home', 'welcome']
  }),
  (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          ${res.locals.seoTags}
        </head>
        <body>
          <h1>Home Page</h1>
          <p>SEO tags injected automatically!</p>
        </body>
      </html>
    `);
  }
);

app.get('/about',
  seoMiddleware({
    title: 'About Us - My Site',
    description: 'Learn about us'
  }),
  (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          ${res.locals.seoTags}
        </head>
        <body>
          <h1>About Page</h1>
        </body>
      </html>
    `);
  }
);

// Serve sitemap.xml (using framework-agnostic core)
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.send(sitemap.toXml());
});

// Serve robots.txt (using framework-agnostic core)
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(robots.toString());
});

// API endpoint to get SEO data as JSON
app.get('/api/seo/sitemap', (req, res) => {
  res.json(sitemap.toJson());
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Sitemap: http://localhost:${PORT}/sitemap.xml`);
  console.log(`Robots: http://localhost:${PORT}/robots.txt`);
});
