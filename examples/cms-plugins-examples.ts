/**
 * CMS Plugins Integration - Usage Examples
 *
 * This file demonstrates how to use the advanced CMS integration features
 */

import {
  CMSPlugins,
  CMSConfig,
  CMSPlatform,
  BatchOperation,
  WebhookPayload
} from '../src/integrations/CMSPlugins-advanced';

// =============================================================================
// EXAMPLE 1: Basic WordPress Integration
// =============================================================================
async function basicWordPressIntegration() {
  console.log('\n=== Example 1: Basic WordPress Integration ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    username: 'admin',
    password: 'your-app-password', // WordPress Application Password
    enableCache: true,
    cacheTTL: 3600, // 1 hour
    retryAttempts: 3,
    retryDelay: 1000
  };

  try {
    // Fetch content from WordPress
    const content = await CMSPlugins.fetchContent(wpConfig, '123');
    console.log('Fetched content:', {
      id: content.id,
      title: content.title,
      excerpt: content.excerpt?.substring(0, 100)
    });

    // Generate SEO data
    const result = await CMSPlugins.generateSeoData(wpConfig, content);
    console.log('Generated SEO data:', {
      success: result.success,
      title: result.seoData.title,
      description: result.seoData.description,
      warnings: result.warnings
    });

    // Sync back to WordPress
    if (result.success) {
      const syncResult = await CMSPlugins.syncSeoToCMS(
        wpConfig,
        content.id,
        result.seoData
      );
      console.log('Sync result:', syncResult);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 2: Advanced WordPress with AI Enhancement
// =============================================================================
async function advancedWordPressWithAI() {
  console.log('\n=== Example 2: Advanced WordPress with AI Enhancement ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://myblog.com',
    username: 'admin',
    password: 'your-app-password',
    enableCache: true,
    cacheTTL: 3600,
    retryAttempts: 3,
    rateLimit: {
      maxRequests: 100,
      perSeconds: 60
    }
  };

  try {
    const content = await CMSPlugins.fetchContent(wpConfig, '456');

    // Generate SEO with AI enhancement
    const result = await CMSPlugins.generateSeoData(wpConfig, content, {
      enhanceWithAI: true,
      targetKeywords: ['SEO', 'WordPress', 'optimization', 'best practices'],
      locale: 'en-US'
    });

    console.log('AI-Enhanced SEO Data:');
    console.log('- Title:', result.seoData.title);
    console.log('- Description:', result.seoData.description);
    console.log('- Keywords:', result.seoData.keywords?.join(', '));
    console.log('- Warnings:', result.warnings);
    console.log('- Processing time:', result.metadata?.processingTime + 'ms');

    // Display generated meta tags
    console.log('\nGenerated Meta Tags:');
    console.log(result.generatedMeta);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 3: Batch Processing Multiple Posts
// =============================================================================
async function batchProcessing() {
  console.log('\n=== Example 3: Batch Processing ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    apiKey: 'your-api-key',
    enableCache: true,
    batchSize: 5, // Process 5 at a time
    rateLimit: {
      maxRequests: 60,
      perSeconds: 60
    }
  };

  const operations: BatchOperation[] = [
    { contentId: '1', operation: 'fetch' },
    { contentId: '2', operation: 'fetch' },
    { contentId: '3', operation: 'fetch' },
    { contentId: '4', operation: 'fetch' },
    { contentId: '5', operation: 'fetch' },
    {
      contentId: '6',
      operation: 'sync',
      data: {
        title: 'Updated SEO Title',
        description: 'Updated meta description for better SEO',
        keywords: ['keyword1', 'keyword2']
      }
    }
  ];

  try {
    console.log('Processing', operations.length, 'operations...');
    const result = await CMSPlugins.batchProcess(wpConfig, operations);

    console.log('\nBatch Results:');
    console.log('- Success:', result.success);
    console.log('- Failed:', result.failed);
    console.log('- Total time:', result.totalProcessingTime + 'ms');
    console.log('- Average per item:', Math.round(result.totalProcessingTime / operations.length) + 'ms');

    // Show individual results
    result.results.forEach((item, index) => {
      console.log(`\n  [${index + 1}] Content ID: ${item.contentId}`);
      console.log(`      Status: ${item.success ? '✓ Success' : '✗ Failed'}`);
      if (item.error) {
        console.log(`      Error: ${item.error}`);
      }
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 4: Webhook Integration
// =============================================================================
async function webhookIntegration() {
  console.log('\n=== Example 4: Webhook Integration ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    apiKey: 'your-api-key',
    enableWebhooks: true,
    webhookUrl: 'https://your-server.com/webhook',
    webhookSecret: 'your-webhook-secret'
  };

  // Register webhook listener for WordPress events
  CMSPlugins.registerWebhookListener('wordpress', async (payload: WebhookPayload) => {
    console.log('\n📢 Webhook received:', payload.event);
    console.log('   Content ID:', payload.contentId);
    console.log('   Timestamp:', payload.timestamp);

    // Auto-optimize SEO when content is published
    if (payload.event === 'content.published' && payload.content) {
      console.log('   Auto-optimizing SEO...');

      const seoResult = await CMSPlugins.generateSeoData(wpConfig, payload.content, {
        enhanceWithAI: true,
        targetKeywords: ['auto-generated']
      });

      if (seoResult.success) {
        await CMSPlugins.syncSeoToCMS(wpConfig, payload.contentId, seoResult.seoData);
        console.log('   ✓ SEO data synced automatically');
      }
    }

    // Handle content updates
    if (payload.event === 'content.updated' && payload.content) {
      console.log('   Content updated, checking SEO...');
      // Add your logic here
    }
  });

  console.log('Webhook listener registered for WordPress events');
  console.log('Listening for: content.created, content.updated, content.published, content.deleted');

  // Simulate webhook processing (in real app, this comes from CMS)
  const mockPayload: WebhookPayload = {
    event: 'content.published',
    platform: 'wordpress',
    contentId: '789',
    content: {
      id: '789',
      title: 'New Blog Post',
      content: '<p>This is a new blog post about SEO optimization...</p>',
      excerpt: 'Learn about SEO optimization',
      publishedDate: new Date().toISOString()
    },
    timestamp: new Date().toISOString()
  };

  await CMSPlugins.processWebhook('wordpress', mockPayload);
}

// =============================================================================
// EXAMPLE 5: Scheduled Sync
// =============================================================================
async function scheduledSync() {
  console.log('\n=== Example 5: Scheduled Auto-Sync ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    apiKey: 'your-api-key',
    autoSync: true,
    syncInterval: 30, // Sync every 30 minutes
    syncFields: ['title', 'description', 'keywords']
  };

  const contentIds = ['1', '2', '3', '4', '5'];

  console.log('Setting up scheduled sync for', contentIds.length, 'posts');
  console.log('Sync interval:', wpConfig.syncInterval, 'minutes');

  // Schedule automatic sync
  const syncTimer = CMSPlugins.scheduleSync(
    wpConfig,
    contentIds,
    (result) => {
      console.log('\n📅 Scheduled sync completed:');
      console.log('   Success:', result.success);
      console.log('   Failed:', result.failed);
      console.log('   Time:', new Date().toLocaleTimeString());
    }
  );

  console.log('✓ Scheduled sync started (timer ID:', syncTimer, ')');
  console.log('To stop sync: CMSPlugins.clearScheduledSync(syncTimer)');

  // In a real application, you would keep this running
  // For demo, we'll clear it after a short time
  setTimeout(() => {
    CMSPlugins.clearScheduledSync(syncTimer);
    console.log('\n✓ Scheduled sync stopped');
  }, 5000);
}

// =============================================================================
// EXAMPLE 6: Export Content to Different Formats
// =============================================================================
async function exportContent() {
  console.log('\n=== Example 6: Export Content ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    apiKey: 'your-api-key'
  };

  const contentIds = ['1', '2', '3'];

  try {
    // Export as JSON
    console.log('Exporting as JSON...');
    const jsonExport = await CMSPlugins.exportContent(wpConfig, contentIds, 'json');
    console.log('JSON export:', jsonExport.substring(0, 200) + '...');

    // Export as CSV
    console.log('\nExporting as CSV...');
    const csvExport = await CMSPlugins.exportContent(wpConfig, contentIds, 'csv');
    console.log('CSV export:', csvExport.substring(0, 200) + '...');

    // Export as Markdown
    console.log('\nExporting as Markdown...');
    const mdExport = await CMSPlugins.exportContent(wpConfig, contentIds, 'markdown');
    console.log('Markdown export:', mdExport.substring(0, 200) + '...');

    // Export as XML
    console.log('\nExporting as XML...');
    const xmlExport = await CMSPlugins.exportContent(wpConfig, contentIds, 'xml');
    console.log('XML export:', xmlExport.substring(0, 200) + '...');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 7: Import Content from External Source
// =============================================================================
async function importContent() {
  console.log('\n=== Example 7: Import Content ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    username: 'admin',
    password: 'your-app-password'
  };

  const jsonData = JSON.stringify([
    {
      id: 'import-1',
      title: 'Imported Post 1',
      content: '<p>This is an imported blog post about SEO.</p>',
      excerpt: 'Learn about SEO basics',
      tags: ['SEO', 'Marketing']
    },
    {
      id: 'import-2',
      title: 'Imported Post 2',
      content: '<p>Another imported post about content marketing.</p>',
      excerpt: 'Content marketing strategies',
      tags: ['Content', 'Marketing']
    }
  ]);

  try {
    console.log('Importing content from JSON...');
    const result = await CMSPlugins.importContent(wpConfig, jsonData, 'json');

    console.log('\nImport Results:');
    console.log('- Success:', result.success);
    console.log('- Failed:', result.failed);
    console.log('- Total time:', result.totalProcessingTime + 'ms');

    result.results.forEach((item, index) => {
      console.log(`\n  [${index + 1}] ${item.success ? '✓' : '✗'} ${item.contentId}`);
      if (item.error) {
        console.log(`      Error: ${item.error}`);
      }
    });
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 8: Ghost CMS Integration
// =============================================================================
async function ghostCMSIntegration() {
  console.log('\n=== Example 8: Ghost CMS Integration ===\n');

  const ghostConfig: CMSConfig = {
    platform: 'ghost',
    apiUrl: 'https://yourblog.ghost.io',
    apiKey: 'your-content-api-key',
    enableCache: true,
    cacheTTL: 1800 // 30 minutes
  };

  try {
    // Fetch content from Ghost
    const content = await CMSPlugins.fetchContent(ghostConfig, 'post-id-123');
    console.log('Ghost content fetched:', {
      id: content.id,
      title: content.title,
      slug: content.slug,
      tags: content.tags
    });

    // Generate SEO data for Ghost
    const result = await CMSPlugins.generateSeoData(ghostConfig, content, {
      enhanceWithAI: true,
      targetKeywords: ['ghost', 'blogging', 'cms']
    });

    console.log('\nSEO Data for Ghost:');
    console.log('- Title:', result.seoData.title);
    console.log('- Description:', result.seoData.description);
    console.log('- OG Image:', result.seoData.ogImage);
    console.log('- Twitter Card:', result.seoData.twitterCard);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// EXAMPLE 9: Generate WordPress Plugin
// =============================================================================
function generateWordPressPlugin() {
  console.log('\n=== Example 9: Generate WordPress Plugin ===\n');

  const pluginCode = CMSPlugins.generateWordPressPlugin(
    'https://your-mseo-server.com',
    'your-api-key-here'
  );

  console.log('WordPress Plugin Code Generated:');
  console.log('File: wp-content/plugins/m-seo-integration/m-seo-integration.php\n');
  console.log(pluginCode);
  console.log('\n✓ Save this code as a WordPress plugin to auto-sync SEO data');
}

// =============================================================================
// EXAMPLE 10: Delete Content
// =============================================================================
async function deleteContent() {
  console.log('\n=== Example 10: Delete Content ===\n');

  const wpConfig: CMSConfig = {
    platform: 'wordpress',
    apiUrl: 'https://example.com',
    username: 'admin',
    password: 'your-app-password'
  };

  try {
    const result = await CMSPlugins.deleteContent(wpConfig, '999');
    console.log('Delete result:', result);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
  }
}

// =============================================================================
// RUN ALL EXAMPLES
// =============================================================================
async function runAllExamples() {
  console.log('\n' + '='.repeat(70));
  console.log('CMS PLUGINS INTEGRATION - COMPREHENSIVE EXAMPLES');
  console.log('='.repeat(70));

  await basicWordPressIntegration();
  await advancedWordPressWithAI();
  await batchProcessing();
  await webhookIntegration();
  await scheduledSync();
  await exportContent();
  await importContent();
  await ghostCMSIntegration();
  generateWordPressPlugin();
  await deleteContent();

  console.log('\n' + '='.repeat(70));
  console.log('ALL EXAMPLES COMPLETED');
  console.log('='.repeat(70) + '\n');
}

// Run if executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  basicWordPressIntegration,
  advancedWordPressWithAI,
  batchProcessing,
  webhookIntegration,
  scheduledSync,
  exportContent,
  importContent,
  ghostCMSIntegration,
  generateWordPressPlugin,
  deleteContent
};
