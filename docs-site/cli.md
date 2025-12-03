# Command Line Interface (CLI)

M-SEO includes a powerful command-line interface for SEO operations. Use it for quick tasks, automation, CI/CD pipelines, or starting the REST API server for multi-language SDKs.

## Installation

::: code-group

```bash [Global Install]
# Install globally
npm install -g m-seo

# Use anywhere
m-seo --help
m-seo --version
```

```bash [npx (No Install)]
# Use directly without installation
npx m-seo --help
npx m-seo audit -u https://example.com
```

:::

## Quick Reference

| Command | Description |
|---------|-------------|
| `meta` | Generate SEO meta tags |
| `sitemap` | Generate XML sitemap |
| `robots` | Generate robots.txt |
| `audit` | Run comprehensive SEO audit |
| `audit-batch` | Audit multiple URLs |
| `schema` | Generate structured data (JSON-LD) |
| `bot-check` | Check if user agent is a bot |
| `validate` | Validate existing meta tags and SEO |
| `watch` | Monitor URLs for SEO changes |
| `server` | Start REST API server |

## Commands

### Generate Meta Tags

Create SEO-optimized meta tags for any page.

```bash
m-seo meta \
  -t "My Awesome Page" \
  -d "Comprehensive guide to web development" \
  -u "https://example.com" \
  -k "web,development,seo" \
  -i "https://example.com/og-image.jpg" \
  -o meta-tags.html
```

**Options:**
- `-t, --title` - Page title (required)
- `-d, --description` - Page description (required)
- `-u, --url` - Canonical URL (required)
- `-k, --keywords` - Keywords (comma-separated)
- `-i, --image` - OG image URL
- `-o, --output` - Output file path
- `-f, --format` - Output format (html|json)

**Example Output:**

```html
<title>My Awesome Page</title>
<meta name="description" content="Comprehensive guide to web development">
<meta name="keywords" content="web,development,seo">
<link rel="canonical" href="https://example.com">
<meta property="og:title" content="My Awesome Page">
<meta property="og:description" content="Comprehensive guide to web development">
<meta property="og:image" content="https://example.com/og-image.jpg">
<meta property="og:url" content="https://example.com">
<meta name="twitter:card" content="summary_large_image">
```

### Run SEO Audit

Analyze a webpage and get detailed SEO recommendations.

```bash
# HTML report
m-seo audit -u https://example.com -f html -o report.html

# JSON output
m-seo audit -u https://example.com -f json -o audit.json

# Markdown report with fixes
m-seo audit -u https://example.com -f md --fix

# With score threshold
m-seo audit -u https://example.com -t 80
```

**Options:**
- `-u, --url` - URL to audit (required)
- `-o, --output` - Output file path
- `-f, --format` - Output format (json|html|md)
- `-t, --threshold` - Minimum score threshold (default: 70)
- `--fix` - Generate fix recommendations

**Audit Checks:**
- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph and Twitter Cards
- ✅ Structured data (JSON-LD)
- ✅ Image alt attributes
- ✅ Heading structure (H1, H2, etc.)
- ✅ Mobile responsiveness
- ✅ Page load performance
- ✅ Security headers
- ✅ Canonical URLs
- ✅ Internal/external links

### Batch Audit Multiple URLs

Audit multiple pages at once with parallel processing.

```bash
# Create urls.txt with one URL per line
echo "https://example.com
https://example.com/about
https://example.com/contact
https://example.com/blog" > urls.txt

# Run batch audit
m-seo audit-batch \
  -u urls.txt \
  -o ./reports \
  -f json \
  -p 5

# With custom threshold
m-seo audit-batch -u urls.txt -o ./reports -t 85
```

**Options:**
- `-u, --urls` - URLs file (required)
- `-o, --output` - Output directory
- `-f, --format` - Output format (default: json)
- `-p, --parallel` - Parallel requests (default: 5)
- `-t, --threshold` - Minimum score threshold

### Generate Sitemap

Create XML sitemaps from URL lists or JSON data.

```bash
# From URLs file
m-seo sitemap -u urls.txt -o sitemap.xml

# From JSON
m-seo sitemap -u '[
  {"loc": "https://example.com", "priority": 1.0, "changefreq": "daily"},
  {"loc": "https://example.com/about", "priority": 0.8, "changefreq": "weekly"},
  {"loc": "https://example.com/blog", "priority": 0.9, "changefreq": "daily"}
]' -o sitemap.xml

# With compression
m-seo sitemap -u urls.txt -o sitemap.xml -c

# Custom settings
m-seo sitemap \
  -u urls.txt \
  -o sitemap.xml \
  --changefreq weekly \
  --priority 0.8
```

**Options:**
- `-u, --urls` - URLs file or JSON array (required)
- `-o, --output` - Output file (default: sitemap.xml)
- `--changefreq` - Change frequency (default: weekly)
- `--priority` - Default priority (default: 0.8)
- `-c, --compress` - Compress to .gz

**Example Output:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

### Generate Robots.txt

Create robots.txt with custom rules.

```bash
m-seo robots \
  -s https://example.com/sitemap.xml \
  -d "/admin,/private,/api" \
  -u "*" \
  -o robots.txt

# Multiple user agents
m-seo robots \
  -s https://example.com/sitemap.xml \
  -d "/admin" \
  -u "Googlebot,Bingbot" \
  -o robots.txt
```

**Options:**
- `-s, --sitemap` - Sitemap URL (required)
- `-o, --output` - Output file (default: robots.txt)
- `-d, --disallow` - Paths to disallow (comma-separated)
- `-u, --user-agent` - User agent (default: *)

**Example Output:**

```
User-agent: *
Disallow: /admin
Disallow: /private
Disallow: /api
Sitemap: https://example.com/sitemap.xml
```

### Bot Detection

Check if a user agent string belongs to a bot.

```bash
# Basic check
m-seo bot-check -u "Mozilla/5.0 (compatible; Googlebot/2.1)"

# Detailed info
m-seo bot-check -u "Googlebot/2.1" -d

# Check multiple user agents
m-seo bot-check -u "Mozilla/5.0 (compatible; bingbot/2.0)"
m-seo bot-check -u "facebookexternalhit/1.1"
m-seo bot-check -u "Twitterbot/1.0"
```

**Output Example:**

```
✓ Bot detected: Googlebot
Type: Search Engine
Category: Major Search Engine
Crawl Delay: 0s
Respect Robots.txt: Yes
```

### Generate Structured Data

Create Schema.org JSON-LD markup.

```bash
# Product schema
m-seo schema -t product -d '{
  "name": "Premium Widget",
  "price": "99.99",
  "currency": "USD",
  "description": "High-quality widget",
  "brand": "WidgetCo",
  "sku": "WDG-001"
}' -o product-schema.json

# Article schema from file
m-seo schema -t article -d article-data.json -v

# Organization schema
m-seo schema -t organization -d '{
  "name": "My Company",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png"
}'
```

**Options:**
- `-t, --type` - Schema type (article|product|organization)
- `-d, --data` - JSON data file or inline JSON
- `-o, --output` - Output file path
- `-v, --validate` - Validate schema

**Supported Schema Types:**
- `article` - Article, BlogPosting, NewsArticle
- `product` - Product with reviews and offers
- `organization` - Organization, LocalBusiness
- `person` - Person profile
- `event` - Event with date and location
- `recipe` - Recipe with ingredients
- `faq` - FAQ Page

### Start REST API Server

Start a REST API server for multi-language SDK access (Python, PHP, Ruby, Go).

```bash
# Basic server
m-seo server --port 3100

# With authentication
m-seo server \
  --port 3100 \
  --api-key your_secret_key \
  --cors

# Custom host
m-seo server --port 3100 --host 0.0.0.0
```

**Options:**
- `-p, --port` - Server port (default: 3100)
- `-h, --host` - Server host (default: 0.0.0.0)
- `-k, --api-key` - API key for authentication
- `--cors` - Enable CORS

**API Endpoints:**

```bash
# Health check
GET http://localhost:3100/health

# Generate meta tags
POST http://localhost:3100/api/meta
{
  "title": "My Page",
  "description": "Description",
  "url": "https://example.com"
}

# Generate sitemap
POST http://localhost:3100/api/sitemap
{
  "urls": [
    {"loc": "https://example.com", "priority": 1.0}
  ]
}

# Run audit
POST http://localhost:3100/api/audit
{
  "url": "https://example.com"
}
```

**Use with SDKs:**

```python
# Python (Django/Flask/FastAPI)
from mseo import MSeoClient
client = MSeoClient(api_url='http://localhost:3100', api_key='your_key')
```

```php
// PHP (Laravel)
use MSeo\Client;
$client = new Client('http://localhost:3100', 'your_key');
```

```ruby
# Ruby (Rails)
require 'mseo'
client = MSeo::Client.new('http://localhost:3100', 'your_key')
```

```go
// Go
import "github.com/yourusername/m-seo-go"
client := mseo.NewClient("http://localhost:3100", "your_key")
```

### Validate Existing SEO

Validate meta tags and SEO on existing pages.

```bash
# Validate all
m-seo validate -u https://example.com

# Specific checks
m-seo validate -u https://example.com -c meta,og,schema

# Save report
m-seo validate -u https://example.com -o validation-report.json
```

**Options:**
- `-u, --url` - URL to validate (required)
- `-c, --checks` - Specific checks (meta|og|schema|perf)
- `-o, --output` - Output file path

**Validation Checks:**
- `meta` - Meta tags (title, description, keywords)
- `og` - Open Graph tags
- `twitter` - Twitter Card tags
- `schema` - Structured data validation
- `perf` - Performance metrics

### Watch URLs for Changes

Monitor URLs and get notified of SEO changes.

```bash
# Watch URLs
m-seo watch \
  -u "https://example.com,https://example.com/blog" \
  -i 300 \
  -n console

# Watch with file notification
m-seo watch \
  -u urls.txt \
  -i 60 \
  -n file

# Watch with webhook
m-seo watch \
  -u urls.txt \
  -i 300 \
  -n webhook
```

**Options:**
- `-u, --urls` - URLs to watch (comma-separated or file)
- `-i, --interval` - Check interval in seconds (default: 300)
- `-n, --notify` - Notification method (console|file|webhook)

**Monitored Changes:**
- Title changes
- Meta description changes
- OG image updates
- Schema changes
- HTTP status changes
- Redirect changes

## Global Options

These options work with all commands:

```bash
--help          Show command help
--version       Show CLI version
--verbose       Verbose output
--quiet         Suppress output
--json          JSON output format
--no-color      Disable colored output
```

## Examples

### Complete Workflow

```bash
# 1. Generate meta tags for all pages
m-seo meta -t "Home" -d "Welcome" -u "https://example.com" -o home-meta.html
m-seo meta -t "About" -d "About us" -u "https://example.com/about" -o about-meta.html

# 2. Create sitemap from URLs
echo "https://example.com
https://example.com/about
https://example.com/blog" > urls.txt
m-seo sitemap -u urls.txt -o sitemap.xml

# 3. Generate robots.txt
m-seo robots -s https://example.com/sitemap.xml -d "/admin,/private"

# 4. Run audit
m-seo audit-batch -u urls.txt -o ./reports -f html

# 5. Start monitoring
m-seo watch -u urls.txt -i 300 -n console
```

### CI/CD Integration

```yaml
# .github/workflows/seo-audit.yml
name: SEO Audit
on: [push]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
      - name: Install m-seo
        run: npm install -g m-seo
      - name: Run SEO Audit
        run: |
          m-seo audit -u https://example.com -f json -o audit.json -t 80
      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: seo-audit
          path: audit.json
```

### Automation Script

```bash
#!/bin/bash
# seo-automation.sh

# Audit all pages
m-seo audit-batch -u urls.txt -o ./reports -f json -p 10

# Generate sitemaps
m-seo sitemap -u urls.txt -o public/sitemap.xml -c

# Update robots.txt
m-seo robots -s https://example.com/sitemap.xml -o public/robots.txt

# Start monitoring
m-seo watch -u urls.txt -i 3600 -n webhook &

echo "SEO automation complete!"
```

## Environment Variables

Configure CLI behavior with environment variables:

```bash
# API endpoint for server command
export MSEO_API_URL=http://localhost:3100

# Default API key
export MSEO_API_KEY=your_secret_key

# Default output directory
export MSEO_OUTPUT_DIR=./seo-reports

# Enable debug mode
export MSEO_DEBUG=true

# Disable colors
export NO_COLOR=1
```

## Troubleshooting

### Common Issues

**"Command not found: m-seo"**
- Solution: Install globally with `npm install -g m-seo` or use `npx m-seo`

**"Error: Cannot find module"**
- Solution: Reinstall the package with `npm install -g m-seo --force`

**"403 Forbidden" when auditing**
- Solution: The website may be blocking requests. Try with `--user-agent` flag

**Server port already in use**
- Solution: Use a different port with `--port 3101`

### Debug Mode

Enable verbose logging:

```bash
m-seo audit -u https://example.com --verbose
```

Get help for any command:

```bash
m-seo <command> --help
m-seo audit --help
m-seo server --help
```

## Next Steps

- [Getting Started Guide](./getting-started.md) - Learn programmatic API
- [API Reference](./api.md) - Complete API documentation
- [Examples](./examples.md) - Real-world usage examples
- [Multi-Language SDKs](./getting-started.md#multi-language-sdks) - Python, PHP, Ruby, Go SDKs
