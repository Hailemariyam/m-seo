# 🚀 M-SEO Service Layer - Complete Usage Guide

**Enterprise-grade SEO tools for all programming languages and platforms**

The M-SEO service layer provides three powerful ways to integrate SEO functionality into **any application**, regardless of the programming language or framework:

1. **CLI Interface** - Command-line tools for DevOps & CI/CD
2. **REST API Server** - HTTP API for language-agnostic access
3. **SDK Layer** - Native SDKs for Python, PHP, Ruby, Go

---

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [CLI Interface](#cli-interface)
- [REST API Server](#rest-api-server)
- [Python SDK (Django/Flask)](#python-sdk-djangoflask)
- [PHP SDK (Laravel)](#php-sdk-laravel)
- [Ruby SDK (Rails)](#ruby-sdk-rails)
- [Go SDK](#go-sdk)
- [Advanced Features](#advanced-features)
- [Production Deployment](#production-deployment)

---

## 🏃 Quick Start

### Installation

```bash
# Install M-SEO globally
npm install -g m-seo

# Or use npx (no installation needed)
npx m-seo --help
```

### Your First Command

```bash
# Generate meta tags
m-seo meta \
  --title "My Awesome Product" \
  --description "The best product you'll ever use" \
  --url "https://mysite.com/products/awesome" \
  --keywords "seo,optimization,meta-tags"
```

Output:

```html
<title>My Awesome Product</title>
<meta name="description" content="The best product you'll ever use" />
<link rel="canonical" href="https://mysite.com/products/awesome" />
<meta name="keywords" content="seo,optimization,meta-tags" />
<meta property="og:title" content="My Awesome Product" />
<meta property="og:description" content="The best product you'll ever use" />
<meta property="og:url" content="https://mysite.com/products/awesome" />
```

---

## 💻 CLI Interface

The CLI provides **8 powerful commands** for SEO operations:

### 1. Generate Meta Tags

```bash
# Basic usage
m-seo meta -t "Page Title" -d "Description" -u "https://example.com"

# With all options
m-seo meta \
  --title "Product Name - Best Price" \
  --description "Amazing product with great features" \
  --url "https://example.com/products/123" \
  --keywords "product,seo,optimization" \
  --image "https://example.com/image.jpg" \
  --output meta.html \
  --format html
```

**Output Formats:**

- `html` - Ready-to-use HTML meta tags (default)
- `json` - Structured JSON data

### 2. Generate XML Sitemap

```bash
# From URLs file (one URL per line)
m-seo sitemap --urls urls.txt --output sitemap.xml

# From JSON file
m-seo sitemap --urls sitemap-data.json --output sitemap.xml --compress

# Inline JSON
m-seo sitemap --urls '[
  {"loc": "https://example.com", "priority": 1.0, "changefreq": "daily"},
  {"loc": "https://example.com/about", "priority": 0.8, "changefreq": "weekly"}
]'
```

**urls.txt example:**

```
https://example.com
https://example.com/about
https://example.com/products
https://example.com/contact
```

**sitemap-data.json example:**

```json
[
  {
    "loc": "https://example.com",
    "changefreq": "daily",
    "priority": 1.0,
    "lastmod": "2025-12-02"
  },
  {
    "loc": "https://example.com/products",
    "changefreq": "weekly",
    "priority": 0.8
  }
]
```

### 3. Generate robots.txt

```bash
# Basic usage
m-seo robots --sitemap "https://example.com/sitemap.xml"

# With disallow rules
m-seo robots \
  --sitemap "https://example.com/sitemap.xml" \
  --disallow "/admin,/private,/api" \
  --user-agent "*" \
  --output robots.txt
```

Output:

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /private
Disallow: /api
Sitemap: https://example.com/sitemap.xml
```

### 4. Run SEO Audit

```bash
# Basic audit
m-seo audit --url "https://example.com"

# Full audit with HTML report
m-seo audit \
  --url "https://example.com" \
  --output report.html \
  --format html \
  --threshold 80 \
  --fix

# JSON output
m-seo audit -u "https://example.com" -o report.json -f json
```

**Output:**

```
══════════════════════════════════════════════════════════
SEO Audit Report - https://example.com
══════════════════════════════════════════════════════════

Score: 85/100
Passed: 12 | Failed: 3 | Warnings: 5

Issues:
  ❌ [Meta Tags] Missing meta description
     Fix: Add <meta name="description" content="...">

  ⚠️ [Performance] Page load time: 3.2s
     Fix: Optimize images and enable compression

  ℹ️ [Schema] No structured data found
     Fix: Add JSON-LD schema markup

Recommendations:
  • Add meta description (150-160 characters)
  • Optimize images for web
  • Implement structured data
  • Improve page load time
  • Add alt text to all images

══════════════════════════════════════════════════════════
```

### 5. Batch Audit Multiple URLs

```bash
# Audit multiple URLs
m-seo audit-batch \
  --urls urls.txt \
  --output ./audit-results \
  --format json \
  --parallel 5

# With custom threshold
m-seo audit-batch -u urls.txt -o ./reports -t 80 -p 10
```

**Output structure:**

```
audit-results/
├── summary.json
├── url-1-report.json
├── url-2-report.json
└── ...
```

**summary.json:**

```json
{
  "totalUrls": 50,
  "averageScore": 78.5,
  "passed": 42,
  "failed": 8,
  "results": [...]
}
```

### 6. Generate Structured Data (Schema.org)

```bash
# Article schema
m-seo schema \
  --type article \
  --data '{"title": "My Article", "author": "John Doe", "publishedAt": "2025-12-02"}' \
  --validate

# Product schema from file
m-seo schema -t product -d product-data.json -o schema.json -v
```

**product-data.json:**

```json
{
  "name": "Premium Widget",
  "description": "The best widget on the market",
  "image": "https://example.com/widget.jpg",
  "price": "99.99",
  "currency": "USD"
}
```

**Output:**

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Widget",
  "description": "The best widget on the market",
  "image": "https://example.com/widget.jpg",
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD"
  }
}
```

### 7. Bot Detection

```bash
# Check if user agent is a bot
m-seo bot-check --user-agent "Googlebot/2.1" --detailed

# Test different user agents
m-seo bot-check -u "Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)"
```

**Output:**

```json
{
  "isBot": true,
  "botInfo": {
    "name": "Googlebot",
    "category": "Search Engine",
    "userAgent": "Googlebot/2.1"
  }
}
```

### 8. Watch URLs for Changes

```bash
# Monitor URLs every 5 minutes
m-seo watch \
  --urls "https://example.com,https://example.com/products" \
  --interval 300 \
  --notify console

# With webhook notification
m-seo watch \
  -u "https://example.com" \
  -i 60 \
  -n webhook
```

---

## 🌐 REST API Server

Start a production-ready REST API server for **language-agnostic SEO operations**.

### Starting the Server

```bash
# Basic server
m-seo server

# Custom configuration
m-seo server \
  --port 3100 \
  --host 0.0.0.0 \
  --api-key "your_secret_key_here" \
  --cors
```

**Server starts on:** `http://localhost:3100`

### API Endpoints

#### 1. Generate Meta Tags

```bash
curl -X POST http://localhost:3100/api/seo/meta \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "title": "Product Name",
    "description": "Product description",
    "url": "https://example.com/product",
    "keywords": ["product", "seo"],
    "image": "https://example.com/image.jpg"
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "html": "<title>Product Name</title>...",
    "meta": {
      "title": "Product Name",
      "description": "Product description",
      "canonical": "https://example.com/product"
    },
    "openGraph": {
      "og:title": "Product Name",
      "og:description": "Product description",
      "og:url": "https://example.com/product",
      "og:image": "https://example.com/image.jpg"
    }
  },
  "timestamp": "2025-12-02T10:00:00.000Z"
}
```

#### 2. Run SEO Audit

```bash
curl -X POST http://localhost:3100/api/seo/audit \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "url": "https://example.com",
    "checks": ["meta", "performance", "schema"]
  }'
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": "1733140800000-abc123",
    "url": "https://example.com",
    "score": 85,
    "passed": 12,
    "failed": 3,
    "warnings": 5,
    "issues": [
      {
        "type": "error",
        "category": "Meta Tags",
        "message": "Missing meta description",
        "impact": "high"
      }
    ],
    "recommendations": ["Add meta description", "Optimize images"],
    "metadata": {
      "timestamp": "2025-12-02T10:00:00.000Z",
      "duration": 1250
    }
  }
}
```

#### 3. Generate Sitemap

```bash
curl -X POST http://localhost:3100/api/seo/sitemap \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      {"loc": "https://example.com", "priority": 1.0},
      {"loc": "https://example.com/about", "priority": 0.8}
    ],
    "baseUrl": "https://example.com"
  }'
```

#### 4. Batch Operations

```bash
curl -X POST http://localhost:3100/api/seo/batch \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your_api_key" \
  -d '{
    "operations": [
      {
        "path": "/api/seo/meta",
        "method": "POST",
        "body": {"title": "Page 1", "description": "...", "url": "..."}
      },
      {
        "path": "/api/seo/audit",
        "method": "POST",
        "body": {"url": "https://example.com"}
      }
    ]
  }'
```

#### 5. Health Check & Metrics

```bash
# Health check
curl http://localhost:3100/api/health

# Metrics
curl http://localhost:3100/api/metrics \
  -H "X-API-Key: your_api_key"
```

### API Documentation

Access interactive API docs:

- **HTML Docs:** `http://localhost:3100/api/docs`
- **OpenAPI Spec:** `http://localhost:3100/api/openapi.json`

---

## 🐍 Python SDK (Django/Flask)

### Installation

```bash
pip install requests  # Dependency
# Copy DjangoSdk.py to your project
```

### Django Integration

#### 1. Setup

```python
# settings.py
MIDDLEWARE = [
    'path.to.DjangoSeoMiddleware',
    ...
]

MSEO_API_URL = "http://localhost:3100"
MSEO_API_KEY = "your_api_key"
MSEO_ENABLED = True
```

#### 2. Class-Based Views

```python
# views.py
from django.views.generic import DetailView
from mseo import DjangoSeoMixin
from .models import Product

class ProductDetailView(DjangoSeoMixin, DetailView):
    model = Product
    template_name = 'product.html'

    def get_seo_meta(self):
        product = self.get_object()
        return {
            'title': f"{product.name} - Best Price Online",
            'description': product.description[:160],
            'url': self.request.build_absolute_uri(),
            'image': product.image.url if product.image else None,
            'keywords': product.tags,
        }
```

#### 3. Templates

```html
<!-- templates/product.html -->
{% load mseo_tags %}
<!DOCTYPE html>
<html>
  <head>
    {{ seo_meta.html|safe }} {% mseo_schema 'product' product_data %}
  </head>
  <body>
    <h1>{{ product.name }}</h1>
    <p>{{ product.description }}</p>
  </body>
</html>
```

#### 4. Django Models

```python
# models.py
from mseo import create_django_models

SeoMeta, SitemapUrl = create_django_models()

# Usage
class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def get_seo_meta(self):
        return SeoMeta.objects.get_or_create(
            path=f'/products/{self.id}',
            defaults={
                'title': self.name,
                'description': self.description,
            }
        )[0]
```

### Flask Integration

```python
from flask import Flask, render_template
from mseo import FlaskSeo

app = Flask(__name__)
app.config['MSEO_API_URL'] = 'http://localhost:3100'
app.config['MSEO_API_KEY'] = 'your_api_key'

seo = FlaskSeo(app)

@app.route('/product/<int:id>')
@seo.meta(
    title=lambda: f"Product {id} - Best Price",
    description="Amazing product with great features",
    url=lambda: request.url,
)
def product(id):
    return render_template('product.html', id=id)

# Template access
# {{ seo_meta('title'='My Page', description='...', url='...') | safe }}
```

### Async Support (Django 4.1+)

```python
from mseo import AsyncMSeoClient
from django.views import View

class AsyncProductView(View):
    async def get(self, request, id):
        client = AsyncMSeoClient(
            api_url="http://localhost:3100",
            api_key="your_api_key"
        )

        meta = await client.generate_meta_async(
            title="Product Name",
            description="Description",
            url=request.build_absolute_uri()
        )

        return render(request, 'product.html', {'seo_meta': meta})
```

---

## 🐘 PHP SDK (Laravel)

### Laravel Integration

#### 1. Controller Usage

```php
<?php

use App\Models\Product;
use MSeo\Client;

class ProductController extends Controller
{
    protected Client $seo;

    public function __construct(Client $seo)
    {
        $this->seo = $seo;
    }

    public function show(Product $product)
    {
        $meta = $this->seo->generateMeta([
            'title' => $product->name . ' - Best Price',
            'description' => $product->description,
            'url' => route('products.show', $product),
            'image' => $product->image_url,
            'keywords' => $product->tags,
        ]);

        return view('products.show', compact('product', 'meta'));
    }

    public function sitemap()
    {
        $urls = Product::all()->map(fn($p) => [
            'loc' => route('products.show', $p),
            'changefreq' => 'daily',
            'priority' => 0.8,
        ])->toArray();

        $sitemap = $this->seo->generateSitemap($urls, config('app.url'));

        return response($sitemap['xml'], 200)
            ->header('Content-Type', 'application/xml');
    }
}
```

#### 2. Blade Templates

```php
<!DOCTYPE html>
<html>
<head>
    {!! $meta['html'] ?? '' !!}
</head>
<body>
    <h1>{{ $product->name }}</h1>
    <p>{{ $product->description }}</p>
</body>
</html>
```

#### 3. Middleware

```php
// app/Http/Middleware/BotDetection.php
use MSeo\Client;

class BotDetection
{
    protected Client $seo;

    public function __construct(Client $seo)
    {
        $this->seo = $seo;
    }

    public function handle($request, Closure $next)
    {
        $userAgent = $request->header('User-Agent', '');
        $botInfo = $this->seo->checkBot($userAgent);

        $request->attributes->add([
            'is_bot' => $botInfo['isBot'],
            'bot_info' => $botInfo['botInfo'] ?? null,
        ]);

        return $next($request);
    }
}
```

---

## 🔥 Advanced Features

### 1. CI/CD Integration

```yaml
# .github/workflows/seo-audit.yml
name: SEO Audit

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Install M-SEO
        run: npm install -g m-seo

      - name: Run SEO Audit
        run: |
          m-seo audit \
            --url "https://staging.example.com" \
            --threshold 80 \
            --output audit-report.html \
            --format html

      - name: Upload Report
        uses: actions/upload-artifact@v2
        with:
          name: seo-audit
          path: audit-report.html
```

### 2. Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

# Build TypeScript
RUN npm run build

# Expose API port
EXPOSE 3100

CMD ["node", "bin/m-seo", "server", "--port", "3100", "--host", "0.0.0.0"]
```

```yaml
# docker-compose.yml
version: "3.8"

services:
  mseo-api:
    build: .
    ports:
      - "3100:3100"
    environment:
      - MSEO_API_KEY=your_secret_key
      - NODE_ENV=production
    restart: unless-stopped
```

### 3. Monitoring & Alerting

```bash
# Monitor URLs and send alerts
m-seo watch \
  --urls "https://example.com,https://example.com/products" \
  --interval 300 \
  --notify webhook \
  --webhook-url "https://hooks.slack.com/services/YOUR/WEBHOOK/URL"
```

### 4. Caching Strategies

**Redis caching (Python):**

```python
from mseo import MSeoClient
import redis

redis_client = redis.Redis(host='localhost', port=6379)

class CachedMSeoClient(MSeoClient):
    def generate_meta(self, **kwargs):
        cache_key = f"mseo:meta:{hash(str(kwargs))}"
        cached = redis_client.get(cache_key)

        if cached:
            return json.loads(cached)

        result = super().generate_meta(**kwargs)
        redis_client.setex(cache_key, 300, json.dumps(result))
        return result
```

---

## 🚢 Production Deployment

### Environment Configuration

```bash
# .env
MSEO_API_URL=http://localhost:3100
MSEO_API_KEY=your_production_api_key
MSEO_CACHE_ENABLED=true
MSEO_CACHE_TTL=300
MSEO_RATE_LIMIT_MAX=100
MSEO_RATE_LIMIT_WINDOW=60000
```

### Security Best Practices

1. **Always use API keys in production**
2. **Enable rate limiting**
3. **Use HTTPS for API server**
4. **Implement request validation**
5. **Monitor API usage and errors**

### Performance Optimization

- Enable caching (Redis/Memcached)
- Use batch operations for multiple requests
- Implement CDN for static SEO assets
- Monitor and optimize API response times
- Use async operations where possible

### Monitoring

```bash
# Health check
curl http://api.example.com/api/health

# Metrics
curl -H "X-API-Key: your_key" \
  http://api.example.com/api/metrics
```

---

## 📚 Additional Resources

- **Main Documentation:** [README.md](../README.md)
- **Service Architecture:** [SERVICE_LAYER_ARCHITECTURE.md](./SERVICE_LAYER_ARCHITECTURE.md)
- **Framework Guides:** [Getting Started](./GETTING_STARTED.md)
- **API Reference:** http://localhost:3100/api/docs

---

## 🤝 Support

- **GitHub Issues:** https://github.com/yourusername/m-seo/issues
- **Discussions:** https://github.com/yourusername/m-seo/discussions
- **Documentation:** https://mseo.dev

---

**Built with ❤️ by the M-SEO Team**
