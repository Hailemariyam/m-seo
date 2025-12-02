# CMS Plugins Testing Guide

Complete guide for testing the advanced CMS Plugins integration system.

## Table of Contents

- [Quick Start](#quick-start)
- [Testing Methods](#testing-methods)
- [Unit Tests](#unit-tests)
- [Integration Tests](#integration-tests)
- [Manual Testing](#manual-testing)
- [WordPress Setup](#wordpress-setup)
- [Ghost CMS Setup](#ghost-cms-setup)
- [Troubleshooting](#troubleshooting)

---

## Quick Start

### 1. Run Example Scripts

```bash
# Navigate to project root
cd /home/cyber/m-seo

# Run all examples
npx ts-node examples/cms-plugins-examples.ts

# Run specific example
npx ts-node -e "
  import { basicWordPressIntegration } from './examples/cms-plugins-examples';
  basicWordPressIntegration();
"
```

### 2. Run Unit Tests

```bash
# Run all tests
npm test

# Run only CMS tests
npm test cms-plugins

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### 3. Test in Your Application

```typescript
import { CMSPlugins } from "m-seo";

const config = {
  platform: "wordpress",
  apiUrl: "https://your-site.com",
  username: "admin",
  password: "your-app-password",
};

const content = await CMSPlugins.fetchContent(config, "123");
console.log(content);
```

---

## Testing Methods

### Method 1: Local Development Server

```bash
# Start M-SEO server
cd /home/cyber/m-seo
npm run dev

# In another terminal, run test app
cd test-express-app
npm run dev

# Test CMS endpoints
curl http://localhost:3100/api/cms/wordpress \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Content here",
    "excerpt": "Excerpt"
  }'
```

### Method 2: Direct Integration Testing

```typescript
// test-integration.ts
import { CMSPlugins, CMSConfig } from "./src/integrations/CMSPlugins-advanced";

async function testWordPress() {
  const config: CMSConfig = {
    platform: "wordpress",
    apiUrl: "https://your-wordpress-site.com",
    username: "admin",
    password: "your-application-password",
    enableCache: true,
    retryAttempts: 3,
  };

  try {
    // Test 1: Fetch content
    console.log("Test 1: Fetching content...");
    const content = await CMSPlugins.fetchContent(config, "1");
    console.log("✓ Content fetched:", content.title);

    // Test 2: Generate SEO
    console.log("\nTest 2: Generating SEO data...");
    const seo = await CMSPlugins.generateSeoData(config, content);
    console.log("✓ SEO generated:", seo.seoData.title);

    // Test 3: Sync back
    console.log("\nTest 3: Syncing to CMS...");
    const sync = await CMSPlugins.syncSeoToCMS(config, content.id, seo.seoData);
    console.log("✓ Synced:", sync.message);

    console.log("\n✓ All tests passed!");
  } catch (error) {
    console.error("✗ Test failed:", error);
  }
}

testWordPress();
```

### Method 3: Mock Testing

```typescript
// test-mock.ts
import { CMSPlugins } from "./src/integrations/CMSPlugins-advanced";

// Mock fetch globally
global.fetch = async (url: string) => {
  return {
    ok: true,
    json: async () => ({
      id: 1,
      title: { rendered: "Mock Post" },
      content: { rendered: "Mock content" },
      date: new Date().toISOString(),
    }),
  } as Response;
};

async function testWithMocks() {
  const config = {
    platform: "wordpress" as const,
    apiUrl: "https://mock.com",
    apiKey: "mock-key",
  };

  const content = await CMSPlugins.fetchContent(config, "1");
  console.log("Mock test passed:", content.title);
}

testWithMocks();
```

---

## Unit Tests

### Running Tests

```bash
# Install test dependencies
npm install --save-dev vitest @vitest/ui

# Run tests
npm test

# Run with UI
npm run test:ui

# Run specific test file
npx vitest run tests/cms-plugins.test.ts

# Run in watch mode
npx vitest watch tests/cms-plugins.test.ts
```

### Test Coverage

```bash
# Generate coverage report
npm test -- --coverage

# View coverage in browser
npx vitest --coverage --ui
```

### Key Test Scenarios

- ✅ Content fetching from WordPress
- ✅ Caching functionality
- ✅ Retry logic on failures
- ✅ SEO data generation
- ✅ Meta tag generation
- ✅ Batch processing
- ✅ Export to JSON/CSV/XML/Markdown
- ✅ Import from external sources
- ✅ Webhook processing
- ✅ Rate limiting
- ✅ Error handling

---

## Integration Tests

### Test with Real WordPress Site

1. **Set up WordPress**:

```bash
# Install WordPress locally with Docker
docker run -d \
  --name wordpress \
  -p 8080:80 \
  -e WORDPRESS_DB_HOST=db \
  -e WORDPRESS_DB_USER=wordpress \
  -e WORDPRESS_DB_PASSWORD=wordpress \
  wordpress:latest
```

2. **Create Application Password**:

   - Go to WordPress Admin → Users → Profile
   - Scroll to "Application Passwords"
   - Name: "M-SEO Integration"
   - Click "Add New Application Password"
   - Copy the generated password

3. **Test Integration**:

```typescript
const wpConfig = {
  platform: "wordpress" as const,
  apiUrl: "http://localhost:8080",
  username: "admin",
  password: "your-app-password-here",
  enableCache: true,
};

// Fetch post
const content = await CMSPlugins.fetchContent(wpConfig, "1");
console.log("Fetched:", content.title);

// Generate SEO
const seo = await CMSPlugins.generateSeoData(wpConfig, content);
console.log("SEO:", seo.seoData);

// Sync back
await CMSPlugins.syncSeoToCMS(wpConfig, content.id, seo.seoData);
```

### Test with Ghost CMS

1. **Set up Ghost locally**:

```bash
# Install Ghost CLI
npm install -g ghost-cli

# Create Ghost instance
mkdir ghost-test && cd ghost-test
ghost install local
ghost start
```

2. **Get API Keys**:

   - Go to Ghost Admin → Integrations
   - Create custom integration
   - Copy Content API Key

3. **Test Integration**:

```typescript
const ghostConfig = {
  platform: "ghost" as const,
  apiUrl: "http://localhost:2368",
  apiKey: "your-content-api-key",
};

const content = await CMSPlugins.fetchContent(ghostConfig, "post-slug");
console.log("Ghost content:", content);
```

---

## Manual Testing

### Test 1: Basic WordPress Integration

```bash
# Create test file
cat > test-wordpress.ts << 'EOF'
import { CMSPlugins } from './src/integrations/CMSPlugins-advanced';

async function test() {
  const config = {
    platform: 'wordpress' as const,
    apiUrl: 'https://demo.wp-api.org',
    enableCache: false
  };

  // Fetch post 1
  const content = await CMSPlugins.fetchContent(config, '1');
  console.log('Title:', content.title);
  console.log('Content:', content.content.substring(0, 100) + '...');
  console.log('Published:', content.publishedDate);

  // Generate SEO
  const seo = await CMSPlugins.generateSeoData(config, content);
  console.log('\nSEO Title:', seo.seoData.title);
  console.log('Meta Description:', seo.seoData.description);
  console.log('Warnings:', seo.warnings);

  console.log('\nGenerated Meta Tags:');
  console.log(seo.generatedMeta);
}

test().catch(console.error);
EOF

# Run test
npx ts-node test-wordpress.ts
```

### Test 2: Batch Processing

```bash
cat > test-batch.ts << 'EOF'
import { CMSPlugins } from './src/integrations/CMSPlugins-advanced';

async function test() {
  const config = {
    platform: 'wordpress' as const,
    apiUrl: 'https://demo.wp-api.org',
    batchSize: 3
  };

  const operations = [
    { contentId: '1', operation: 'fetch' as const },
    { contentId: '2', operation: 'fetch' as const },
    { contentId: '3', operation: 'fetch' as const },
    { contentId: '4', operation: 'fetch' as const },
    { contentId: '5', operation: 'fetch' as const }
  ];

  const result = await CMSPlugins.batchProcess(config, operations);

  console.log('Batch Results:');
  console.log('- Success:', result.success);
  console.log('- Failed:', result.failed);
  console.log('- Total time:', result.totalProcessingTime + 'ms');
  console.log('- Average:', Math.round(result.totalProcessingTime / operations.length) + 'ms per item');
}

test().catch(console.error);
EOF

npx ts-node test-batch.ts
```

### Test 3: Export Functionality

```bash
cat > test-export.ts << 'EOF'
import { CMSPlugins } from './src/integrations/CMSPlugins-advanced';
import { writeFileSync } from 'fs';

async function test() {
  const config = {
    platform: 'wordpress' as const,
    apiUrl: 'https://demo.wp-api.org'
  };

  const contentIds = ['1', '2', '3'];

  // Export as JSON
  const json = await CMSPlugins.exportContent(config, contentIds, 'json');
  writeFileSync('export.json', json);
  console.log('✓ Exported to export.json');

  // Export as CSV
  const csv = await CMSPlugins.exportContent(config, contentIds, 'csv');
  writeFileSync('export.csv', csv);
  console.log('✓ Exported to export.csv');

  // Export as Markdown
  const md = await CMSPlugins.exportContent(config, contentIds, 'markdown');
  writeFileSync('export.md', md);
  console.log('✓ Exported to export.md');

  // Export as XML
  const xml = await CMSPlugins.exportContent(config, contentIds, 'xml');
  writeFileSync('export.xml', xml);
  console.log('✓ Exported to export.xml');
}

test().catch(console.error);
EOF

npx ts-node test-export.ts
ls -lh export.*
```

### Test 4: Webhook Processing

```bash
cat > test-webhook.ts << 'EOF'
import { CMSPlugins } from './src/integrations/CMSPlugins-advanced';

// Register listener
CMSPlugins.registerWebhookListener('wordpress', (payload) => {
  console.log('📢 Webhook received!');
  console.log('  Event:', payload.event);
  console.log('  Content ID:', payload.contentId);
  console.log('  Timestamp:', payload.timestamp);
});

// Simulate webhook
async function test() {
  const payload = {
    event: 'content.published' as const,
    platform: 'wordpress' as const,
    contentId: '123',
    content: {
      id: '123',
      title: 'Test Post',
      content: 'Content here',
      publishedDate: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };

  const result = await CMSPlugins.processWebhook('wordpress', payload);
  console.log('\nWebhook result:', result);
}

test().catch(console.error);
EOF

npx ts-node test-webhook.ts
```

---

## WordPress Setup

### Using WP-CLI

```bash
# Install WordPress
wp core download
wp core config --dbname=wordpress --dbuser=root --dbpass=password
wp core install --url=localhost --title="Test Site" --admin_user=admin --admin_password=password --admin_email=admin@test.com

# Create test posts
wp post create --post_title="Test Post 1" --post_content="Content 1" --post_status=publish
wp post create --post_title="Test Post 2" --post_content="Content 2" --post_status=publish
wp post create --post_title="Test Post 3" --post_content="Content 3" --post_status=publish

# Enable REST API
wp rewrite structure '/%postname%/' --hard
```

### Install M-SEO Plugin

```bash
# Generate plugin
node -e "
  const { CMSPlugins } = require('./dist/integrations/CMSPlugins-advanced.js');
  const code = CMSPlugins.generateWordPressPlugin('http://localhost:3100', 'your-api-key');
  require('fs').writeFileSync('m-seo-plugin.php', code);
  console.log('Plugin created: m-seo-plugin.php');
"

# Install plugin
mkdir -p /path/to/wordpress/wp-content/plugins/m-seo-integration
cp m-seo-plugin.php /path/to/wordpress/wp-content/plugins/m-seo-integration/

# Activate
wp plugin activate m-seo-integration
```

---

## Ghost CMS Setup

### Install Ghost Locally

```bash
# Install Ghost CLI
npm install -g ghost-cli@latest

# Create directory
mkdir ghost-local && cd ghost-local

# Install Ghost
ghost install local

# Start Ghost
ghost start

# Get URL
echo "Ghost running at: http://localhost:2368"
echo "Admin at: http://localhost:2368/ghost"
```

### Configure Integration

1. Go to `http://localhost:2368/ghost/#/settings/integrations`
2. Click "Add custom integration"
3. Name it "M-SEO"
4. Copy the Content API Key
5. Use in your config:

```typescript
const ghostConfig = {
  platform: "ghost" as const,
  apiUrl: "http://localhost:2368",
  apiKey: "your-content-api-key-here",
};
```

---

## Troubleshooting

### Common Issues

#### 1. Authentication Errors

**Problem**: `401 Unauthorized` when accessing WordPress

**Solution**:

```typescript
// Use Application Password, not regular password
const config = {
  platform: "wordpress" as const,
  apiUrl: "https://your-site.com",
  username: "admin",
  password: "xxxx xxxx xxxx xxxx xxxx xxxx", // Application password format
};
```

#### 2. CORS Errors

**Problem**: CORS policy blocking requests

**Solution**:

```php
// Add to WordPress wp-config.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

#### 3. Rate Limiting

**Problem**: Too many requests error

**Solution**:

```typescript
const config = {
  platform: "wordpress" as const,
  apiUrl: "https://your-site.com",
  rateLimit: {
    maxRequests: 60,
    perSeconds: 60,
  },
};
```

#### 4. Timeout Errors

**Problem**: Requests timing out

**Solution**:

```typescript
const config = {
  platform: "wordpress" as const,
  apiUrl: "https://your-site.com",
  timeout: 60000, // 60 seconds
  retryAttempts: 5,
  retryDelay: 2000,
};
```

### Debug Mode

```typescript
// Enable debug logging
const config = {
  platform: "wordpress" as const,
  apiUrl: "https://your-site.com",
  // ... other options
};

try {
  const content = await CMSPlugins.fetchContent(config, "1");
  console.log("Success:", content);
} catch (error) {
  console.error("Error details:", {
    message: error.message,
    stack: error.stack,
    config: config,
  });
}
```

### Test Network Connectivity

```bash
# Test WordPress REST API
curl https://your-site.com/wp-json/wp/v2/posts/1

# Test with auth
curl https://your-site.com/wp-json/wp/v2/posts/1 \
  -u "admin:xxxx xxxx xxxx xxxx xxxx xxxx"

# Test Ghost API
curl "http://localhost:2368/ghost/api/v3/content/posts/?key=your-api-key"
```

---

## Performance Testing

### Benchmark Batch Processing

```typescript
import { CMSPlugins } from "./src/integrations/CMSPlugins-advanced";

async function benchmark() {
  const config = {
    platform: "wordpress" as const,
    apiUrl: "https://demo.wp-api.org",
    batchSize: 10,
  };

  const operations = Array.from({ length: 50 }, (_, i) => ({
    contentId: String(i + 1),
    operation: "fetch" as const,
  }));

  console.time("Batch process 50 items");
  const result = await CMSPlugins.batchProcess(config, operations);
  console.timeEnd("Batch process 50 items");

  console.log({
    success: result.success,
    failed: result.failed,
    avgTime: Math.round(result.totalProcessingTime / operations.length) + "ms",
  });
}

benchmark();
```

### Cache Performance

```typescript
async function testCache() {
  const config = {
    platform: "wordpress" as const,
    apiUrl: "https://demo.wp-api.org",
    enableCache: true,
    cacheTTL: 3600,
  };

  // First fetch (no cache)
  console.time("First fetch (no cache)");
  await CMSPlugins.fetchContent(config, "1");
  console.timeEnd("First fetch (no cache)");

  // Second fetch (from cache)
  console.time("Second fetch (cached)");
  await CMSPlugins.fetchContent(config, "1");
  console.timeEnd("Second fetch (cached)");
}

testCache();
```

---

## Next Steps

1. **Create REST API endpoints** - Integrate with M-SEO server
2. **Add real AI integration** - Connect OpenAI/Claude for enhancement
3. **Build dashboard UI** - Visual interface for CMS management
4. **Write E2E tests** - Full workflow testing
5. **Deploy to production** - Production WordPress/Ghost setup

---

## Support

For issues or questions:

- Check error logs in M-SEO server
- Enable debug mode in config
- Review WordPress/Ghost API documentation
- Check CORS and authentication settings

Happy testing! 🚀
