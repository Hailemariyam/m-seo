import express from 'express';
import { BotDetection } from 'm-seo';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3003;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});

// Bot detection and logging middleware
app.use((req, res, next) => {
  const userAgent = req.headers['user-agent'] || '';
  const isBot = BotDetection.isBot(userAgent);
  req.isBot = isBot;

  // Add bot detection header
  if (isBot) {
    const botInfo = BotDetection.getBotInfo(userAgent);
    res.setHeader('X-Bot-Detected', 'true');
    if (botInfo) {
      res.setHeader('X-Bot-Name', botInfo.name || 'unknown');
    }
  }

  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - Bot: ${isBot}`);
  next();
});

// Helper function to generate meta tags HTML
function generateMetaTagsHTML(options) {
  const { title, description, canonical, ogTitle, ogDescription, ogType = 'website', ogUrl, ogImage, twitterCard = 'summary_large_image' } = options;

  let html = '';
  if (title) {
    html += `<title>${title}</title>\n`;
    html += `  <meta property="og:title" content="${ogTitle || title}">\n`;
    html += `  <meta name="twitter:title" content="${title}">\n`;
  }
  if (description) {
    html += `  <meta name="description" content="${description}">\n`;
    html += `  <meta property="og:description" content="${ogDescription || description}">\n`;
    html += `  <meta name="twitter:description" content="${description}">\n`;
  }
  if (canonical) {
    html += `  <link rel="canonical" href="${canonical}">\n`;
  }
  if (ogType) {
    html += `  <meta property="og:type" content="${ogType}">\n`;
  }
  if (ogUrl) {
    html += `  <meta property="og:url" content="${ogUrl}">\n`;
  }
  if (ogImage) {
    html += `  <meta property="og:image" content="${ogImage}">\n`;
    html += `  <meta name="twitter:image" content="${ogImage}">\n`;
  }
  if (twitterCard) {
    html += `  <meta name="twitter:card" content="${twitterCard}">\n`;
  }
  return html;
}

// Home page
app.get('/', (req, res) => {
  const meta = generateMetaTagsHTML({
    title: 'Home - M-SEO Express Test',
    description: 'Welcome to M-SEO Express test application demonstrating SEO features',
    canonical: 'http://localhost:3003/',
    ogTitle: 'M-SEO Express Test',
    ogDescription: 'Framework-agnostic SEO toolkit',
    ogType: 'website',
    ogUrl: 'http://localhost:3003/',
    ogImage: 'http://localhost:3003/og-image.jpg',
  });

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'M-SEO Express Test',
    url: 'http://localhost:3003',
    description: 'Express.js SEO test application',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'http://localhost:3003/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  res.send(renderPage({
    title: 'Home',
    meta,
    structuredData: websiteSchema,
    content: `
      <div class="page-header">
        <h1 class="page-title">🏠 Welcome to M-SEO Express Test</h1>
        <p class="page-subtitle">Framework-agnostic SEO toolkit demonstration</p>
      </div>

      <div class="card">
        <h2>Express.js + M-SEO</h2>
        <p>
          This is a server-side rendered Express.js application demonstrating
          M-SEO's capabilities for traditional Node.js web servers.
        </p>
        <p>
          <strong>Bot Detected:</strong> ${req.isBot ? 'Yes ✅' : 'No ❌'}
        </p>
      </div>

      <div class="grid">
        <div class="stat-card">
          <h4>Framework</h4>
          <div class="stat-value">Express.js</div>
        </div>
        <div class="stat-card" style="border-left-color: var(--secondary)">
          <h4>Port</h4>
          <div class="stat-value" style="color: var(--secondary)">3003</div>
        </div>
      </div>

      <div class="card">
        <h2>Features Demonstrated</h2>
        <ul>
          <li>✅ Server-side meta tag generation</li>
          <li>✅ Bot detection middleware</li>
          <li>✅ Security headers</li>
          <li>✅ Structured data (JSON-LD)</li>
          <li>✅ Dynamic sitemap</li>
          <li>✅ Robots.txt</li>
          <li>✅ Open Graph tags</li>
          <li>✅ Twitter Cards</li>
        </ul>
      </div>
    `,
  }));
});

// About page
app.get('/about', (req, res) => {
  const meta = generateMetaTagsHTML({
    title: 'About - M-SEO Express Test',
    description: 'Learn about M-SEO and Express.js integration',
    canonical: 'http://localhost:3003/about',
  });

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'M-SEO',
    url: 'http://localhost:3003',
    logo: 'http://localhost:3003/logo.png',
    description: 'Framework-agnostic SEO toolkit for modern web applications',
    sameAs: [
      'https://github.com/Hailemariyam/m-seo',
      'https://npmjs.com/package/m-seo',
    ],
  };

  res.send(renderPage({
    title: 'About',
    meta,
    structuredData: organizationSchema,
    content: `
      <div class="page-header">
        <h1 class="page-title">ℹ️ About M-SEO</h1>
        <p class="page-subtitle">Framework-agnostic SEO toolkit</p>
      </div>

      <div class="card">
        <h2>What is M-SEO?</h2>
        <p>
          M-SEO is a TypeScript SEO library that works with React, Vue, Next.js, Express,
          and vanilla JavaScript. It provides a consistent API across all frameworks.
        </p>

        <h3>Why Express?</h3>
        <p>
          Express.js is perfect for server-side rendered applications where you have
          full control over the HTML output. M-SEO makes it easy to add SEO-friendly
          meta tags, structured data, and security headers.
        </p>

        <h3>Key Features</h3>
        <div class="grid">
          <div style="background: var(--light); padding: 1rem; border-radius: 4px;">
            <h4 style="color: var(--primary)">Server-Side Rendering</h4>
            <p>Full HTML control</p>
          </div>
          <div style="background: var(--light); padding: 1rem; border-radius: 4px;">
            <h4 style="color: var(--primary)">Bot Detection</h4>
            <p>Middleware integration</p>
          </div>
          <div style="background: var(--light); padding: 1rem; border-radius: 4px;">
            <h4 style="color: var(--primary)">Security Headers</h4>
            <p>Built-in protection</p>
          </div>
          <div style="background: var(--light); padding: 1rem; border-radius: 4px;">
            <h4 style="color: var(--primary)">Zero Dependencies</h4>
            <p>Pure TypeScript</p>
          </div>
        </div>
      </div>
    `,
  }));
});

// Blog post
app.get('/blog/:slug', (req, res) => {
  const { slug } = req.params;

  const posts = {
    'getting-started': {
      title: 'Getting Started with M-SEO and Express',
      description: 'Learn how to integrate M-SEO with Express.js applications',
      author: 'M-SEO Team',
      date: '2024-12-01',
      content: 'Complete guide to using M-SEO with Express.js...',
    },
  };

  const post = posts[slug] || posts['getting-started'];

  const meta = generateMetaTagsHTML({
    title: post.title,
    description: post.description,
    canonical: `http://localhost:3003/blog/${slug}`,
    ogType: 'article',
    ogUrl: `http://localhost:3003/blog/${slug}`,
  });

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    author: {
      '@type': 'Person',
      name: post.author,
    },
    datePublished: post.date,
    publisher: {
      '@type': 'Organization',
      name: 'M-SEO',
      logo: {
        '@type': 'ImageObject',
        url: 'http://localhost:3003/logo.png',
      },
    },
  };

  res.send(renderPage({
    title: post.title,
    meta,
    structuredData: articleSchema,
    content: `
      <div class="page-header">
        <h1 class="page-title">📝 ${post.title}</h1>
        <p class="page-subtitle">By ${post.author} • ${post.date}</p>
      </div>

      <div class="card">
        <div class="article-content">
          <p>${post.description}</p>
          <p>${post.content}</p>
        </div>

        <div style="margin-top: 2rem; padding-top: 1rem; border-top: 1px solid var(--border);">
          <span class="badge badge-primary">Express.js</span>
          <span class="badge badge-success">SEO</span>
          <span class="badge badge-secondary">Tutorial</span>
        </div>
      </div>

      <div class="card">
        <h3>Structured Data</h3>
        <p>This page includes Article schema for rich search results.</p>
        <pre style="background: var(--light); padding: 1rem; border-radius: 4px; overflow-x: auto;">${JSON.stringify(articleSchema, null, 2)}</pre>
      </div>
    `,
  }));
});

// Analytics page
app.get('/analytics', (req, res) => {
  const meta = generateMetaTagsHTML({
    title: 'Analytics - M-SEO Express Test',
    description: 'SEO analytics and bot detection demonstration',
    canonical: 'http://localhost:3003/analytics',
  });

  const userAgent = req.headers['user-agent'] || 'Unknown';
  const botInfo = BotDetection.getBotInfo(userAgent);

  res.send(renderPage({
    title: 'Analytics',
    meta,
    content: `
      <div class="page-header">
        <h1 class="page-title">📊 Analytics Dashboard</h1>
        <p class="page-subtitle">Bot detection & SEO monitoring</p>
      </div>

      <div class="grid">
        <div class="stat-card">
          <h4>Bot Detected</h4>
          <div class="stat-value">${req.isBot ? 'Yes' : 'No'}</div>
          <p style="margin-top: 0.5rem; color: var(--gray)">
            ${req.isBot ? 'Search engine crawler' : 'Regular visitor'}
          </p>
        </div>
        <div class="stat-card" style="border-left-color: var(--secondary)">
          <h4>Bot Type</h4>
          <div class="stat-value" style="color: var(--secondary)">${botInfo?.name || 'N/A'}</div>
          <p style="margin-top: 0.5rem; color: var(--gray)">
            ${botInfo?.type || 'Unknown'}
          </p>
        </div>
      </div>

      <div class="card">
        <h2>User Agent</h2>
        <pre style="white-space: pre-wrap; word-break: break-all; background: var(--light); padding: 1rem; border-radius: 4px;">${userAgent}</pre>
      </div>

      <div class="card">
        <h2>Request Headers</h2>
        <pre style="background: var(--light); padding: 1rem; border-radius: 4px; overflow-x: auto;">${JSON.stringify(req.headers, null, 2)}</pre>
      </div>

      <div class="card">
        <h2>Express Middleware</h2>
        <p>This application demonstrates:</p>
        <ul style="padding-left: 1.5rem;">
          <li>Bot detection middleware for all routes</li>
          <li>Security headers automatically applied</li>
          <li>Request logging with bot identification</li>
          <li>Server-side SEO meta tag generation</li>
        </ul>
      </div>
    `,
  }));
});

// Sitemap
app.get('/sitemap.xml', (req, res) => {
  const urls = [
    { loc: 'http://localhost:3003/', changefreq: 'daily', priority: '1.0' },
    { loc: 'http://localhost:3003/about', changefreq: 'monthly', priority: '0.8' },
    { loc: 'http://localhost:3003/analytics', changefreq: 'weekly', priority: '0.7' },
    { loc: 'http://localhost:3003/blog/getting-started', changefreq: 'monthly', priority: '0.6' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.header('Content-Type', 'application/xml');
  res.send(sitemap);
});

// Robots.txt
app.get('/robots.txt', (req, res) => {
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: http://localhost:3003/sitemap.xml`;

  res.type('text/plain');
  res.send(robots);
});

// API endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    isBot: req.isBot,
  });
});

// 404 handler
app.use((req, res) => {
  const meta = generateMetaTagsHTML({
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist',
  });

  res.status(404).send(renderPage({
    title: '404 - Not Found',
    meta,
    content: `
      <div class="page-header">
        <h1 class="page-title">404 - Page Not Found</h1>
        <p class="page-subtitle">The page you're looking for doesn't exist</p>
      </div>
      <div class="card">
        <p><a href="/" style="color: var(--primary)">← Back to Home</a></p>
      </div>
    `,
  }));
});

// Helper function to render HTML pages
function renderPage({ title, meta, structuredData, content }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${meta}
  ${structuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>` : ''}
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <nav class="navbar">
    <div class="nav-container">
      <a href="/" class="logo">M-SEO Express</a>
      <div class="nav-links">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/analytics">Analytics</a>
        <a href="/blog/getting-started">Blog</a>
      </div>
    </div>
  </nav>

  <main class="container">
    ${content}
  </main>

  <footer class="footer">
    <div class="container">
      <p>&copy; 2024 M-SEO Express Test. Framework-agnostic SEO toolkit.</p>
      <div style="margin-top: 0.5rem;">
        <a href="https://github.com/Hailemariyam/m-seo" target="_blank" style="color: var(--primary)">GitHub</a>
        •
        <a href="/sitemap.xml" style="color: var(--primary)">Sitemap</a>
        •
        <a href="/robots.txt" style="color: var(--primary)">Robots.txt</a>
      </div>
    </div>
  </footer>
</body>
</html>
  `.trim();
}

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║   🚀 M-SEO Express Test Server                            ║
║                                                            ║
║   Server running at: http://localhost:${PORT}              ║
║                                                            ║
║   Routes:                                                  ║
║   • GET  /                  - Home page                    ║
║   • GET  /about             - About page                   ║
║   • GET  /analytics         - Analytics dashboard          ║
║   • GET  /blog/:slug        - Blog posts                   ║
║   • GET  /sitemap.xml       - Sitemap                      ║
║   • GET  /robots.txt        - Robots.txt                   ║
║   • GET  /api/health        - Health check                 ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
  `);
});
