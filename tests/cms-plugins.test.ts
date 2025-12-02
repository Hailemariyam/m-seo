/**
 * CMS Plugins Integration - Unit Tests
 *
 * Run with: npm test
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  CMSPlugins,
  CMSConfig,
  CMSContent,
  CMSSeoData,
  BatchOperation
} from '../src/integrations/CMSPlugins-advanced';

// Mock fetch globally
global.fetch = vi.fn();

describe('CMSPlugins Integration', () => {
  let mockConfig: CMSConfig;
  let mockContent: CMSContent;

  beforeEach(() => {
    mockConfig = {
      platform: 'wordpress',
      apiUrl: 'https://test.com',
      username: 'admin',
      password: 'password',
      enableCache: false,
      retryAttempts: 1,
      timeout: 5000
    };

    mockContent = {
      id: '123',
      title: 'Test Post',
      content: '<p>This is a test post about SEO optimization and best practices.</p>',
      excerpt: 'Test excerpt',
      publishedDate: '2025-12-02T00:00:00Z',
      tags: ['seo', 'testing'],
      slug: 'test-post'
    };

    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // ==========================================================================
  // Content Fetching Tests
  // ==========================================================================

  describe('fetchContent', () => {
    it('should fetch WordPress content successfully', async () => {
      const mockResponse = {
        id: 123,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: 'Test excerpt' },
        date: '2025-12-02T00:00:00Z',
        modified: '2025-12-02T00:00:00Z',
        slug: 'test-post',
        categories: [1, 2],
        tags: [3, 4]
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const content = await CMSPlugins.fetchContent(mockConfig, '123');

      expect(content).toBeDefined();
      expect(content.id).toBe('123');
      expect(content.title).toBe('Test Post');
      expect(content.content).toBe('<p>Test content</p>');
    });

    it('should use cache when enabled', async () => {
      mockConfig.enableCache = true;
      mockConfig.cacheTTL = 3600;

      const mockResponse = {
        id: 123,
        title: { rendered: 'Test Post' },
        content: { rendered: '<p>Test content</p>' },
        excerpt: { rendered: 'Test excerpt' },
        date: '2025-12-02T00:00:00Z',
        slug: 'test-post'
      };

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // First call - should fetch from API
      const content1 = await CMSPlugins.fetchContent(mockConfig, '123');
      expect(global.fetch).toHaveBeenCalledTimes(1);

      // Second call - should use cache
      const content2 = await CMSPlugins.fetchContent(mockConfig, '123');
      expect(global.fetch).toHaveBeenCalledTimes(1); // No additional call
      expect(content1).toEqual(content2);
    });

    it('should retry on failure', async () => {
      mockConfig.retryAttempts = 3;
      mockConfig.retryDelay = 100;

      (global.fetch as any)
        .mockRejectedValueOnce(new Error('Network error'))
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 123,
            title: { rendered: 'Test Post' },
            content: { rendered: 'Content' },
            date: '2025-12-02T00:00:00Z'
          })
        });

      const content = await CMSPlugins.fetchContent(mockConfig, '123');
      expect(content).toBeDefined();
      expect(global.fetch).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      mockConfig.retryAttempts = 2;
      mockConfig.retryDelay = 50;

      (global.fetch as any).mockRejectedValue(new Error('Network error'));

      await expect(
        CMSPlugins.fetchContent(mockConfig, '123')
      ).rejects.toThrow('Network error');

      expect(global.fetch).toHaveBeenCalledTimes(2);
    });
  });

  // ==========================================================================
  // SEO Data Generation Tests
  // ==========================================================================

  describe('generateSeoData', () => {
    it('should generate basic SEO data', async () => {
      const result = await CMSPlugins.generateSeoData(mockConfig, mockContent);

      expect(result.success).toBe(true);
      expect(result.platform).toBe('wordpress');
      expect(result.contentId).toBe('123');
      expect(result.seoData).toBeDefined();
      expect(result.seoData.title).toBe('Test Post');
      expect(result.generatedMeta).toContain('<title>Test Post</title>');
    });

    it('should include meta tags in generated output', async () => {
      const result = await CMSPlugins.generateSeoData(mockConfig, mockContent);

      expect(result.generatedMeta).toContain('og:title');
      expect(result.generatedMeta).toContain('meta name="description"');
    });

    it('should warn about SEO issues', async () => {
      const longTitleContent = {
        ...mockContent,
        title: 'This is a very long title that exceeds the recommended 60 character limit for SEO optimization',
        excerpt: undefined
      };

      const result = await CMSPlugins.generateSeoData(mockConfig, longTitleContent);

      expect(result.warnings).toBeDefined();
      expect(result.warnings?.length).toBeGreaterThan(0);
      expect(result.warnings).toContain('SEO title too long (>60 chars)');
      expect(result.warnings).toContain('Missing meta description');
    });

    it('should enhance with AI when enabled', async () => {
      const result = await CMSPlugins.generateSeoData(mockConfig, mockContent, {
        enhanceWithAI: true,
        targetKeywords: ['seo', 'wordpress', 'optimization'],
        locale: 'en-US'
      });

      expect(result.success).toBe(true);
      expect(result.seoData.keywords).toBeDefined();
      expect(result.seoData.keywords?.length).toBeGreaterThan(0);
    });
  });

  // ==========================================================================
  // Sync Tests
  // ==========================================================================

  describe('syncSeoToCMS', () => {
    it('should sync SEO data to WordPress', async () => {
      const seoData: CMSSeoData = {
        title: 'Optimized Title',
        description: 'Optimized description',
        keywords: ['seo', 'wordpress']
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      const result = await CMSPlugins.syncSeoToCMS(mockConfig, '123', seoData);

      expect(result.success).toBe(true);
      expect(result.message).toContain('synced successfully');
    });

    it('should handle sync errors gracefully', async () => {
      const seoData: CMSSeoData = {
        title: 'Test'
      };

      (global.fetch as any).mockRejectedValueOnce(new Error('API Error'));

      const result = await CMSPlugins.syncSeoToCMS(mockConfig, '123', seoData);

      expect(result.success).toBe(false);
      expect(result.message).toContain('failed');
    });
  });

  // ==========================================================================
  // Batch Processing Tests
  // ==========================================================================

  describe('batchProcess', () => {
    it('should process batch operations', async () => {
      mockConfig.batchSize = 2;

      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          title: { rendered: 'Test' },
          content: { rendered: 'Content' },
          date: '2025-12-02T00:00:00Z'
        })
      });

      const operations: BatchOperation[] = [
        { contentId: '1', operation: 'fetch' },
        { contentId: '2', operation: 'fetch' },
        { contentId: '3', operation: 'fetch' }
      ];

      const result = await CMSPlugins.batchProcess(mockConfig, operations);

      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
      expect(result.results.length).toBe(3);
    });

    it('should handle partial failures in batch', async () => {
      (global.fetch as any)
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            id: 1,
            title: { rendered: 'Test' },
            content: { rendered: 'Content' },
            date: '2025-12-02T00:00:00Z'
          })
        })
        .mockRejectedValueOnce(new Error('Fetch failed'));

      const operations: BatchOperation[] = [
        { contentId: '1', operation: 'fetch' },
        { contentId: '2', operation: 'fetch' }
      ];

      const result = await CMSPlugins.batchProcess(mockConfig, operations);

      expect(result.success).toBe(1);
      expect(result.failed).toBe(1);
    });
  });

  // ==========================================================================
  // Export Tests
  // ==========================================================================

  describe('exportContent', () => {
    beforeEach(() => {
      (global.fetch as any).mockResolvedValue({
        ok: true,
        json: async () => ({
          id: 1,
          title: { rendered: 'Test Post' },
          content: { rendered: 'Test content' },
          excerpt: { rendered: 'Test excerpt' },
          date: '2025-12-02T00:00:00Z',
          slug: 'test-post'
        })
      });
    });

    it('should export as JSON', async () => {
      const result = await CMSPlugins.exportContent(mockConfig, ['1', '2'], 'json');
      expect(result).toBeDefined();
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it('should export as CSV', async () => {
      const result = await CMSPlugins.exportContent(mockConfig, ['1'], 'csv');
      expect(result).toBeDefined();
      expect(result).toContain('id,title,content');
    });

    it('should export as XML', async () => {
      const result = await CMSPlugins.exportContent(mockConfig, ['1'], 'xml');
      expect(result).toBeDefined();
      expect(result).toContain('<?xml version="1.0"');
      expect(result).toContain('<contents>');
    });

    it('should export as Markdown', async () => {
      const result = await CMSPlugins.exportContent(mockConfig, ['1'], 'markdown');
      expect(result).toBeDefined();
      expect(result).toContain('# Test Post');
    });
  });

  // ==========================================================================
  // Webhook Tests
  // ==========================================================================

  describe('webhooks', () => {
    it('should register webhook listener', () => {
      const mockCallback = vi.fn();

      CMSPlugins.registerWebhookListener('wordpress', mockCallback);

      // This is a registration function, no immediate callback
      expect(mockCallback).not.toHaveBeenCalled();
    });

    it('should process webhook payload', async () => {
      const mockCallback = vi.fn();
      CMSPlugins.registerWebhookListener('wordpress', mockCallback);

      const payload = {
        event: 'content.published' as const,
        platform: 'wordpress' as const,
        contentId: '123',
        timestamp: new Date().toISOString()
      };

      const result = await CMSPlugins.processWebhook('wordpress', payload);

      expect(result.success).toBe(true);
      expect(mockCallback).toHaveBeenCalledWith(payload);
    });
  });

  // ==========================================================================
  // WordPress Plugin Generation Tests
  // ==========================================================================

  describe('generateWordPressPlugin', () => {
    it('should generate WordPress plugin code', () => {
      const plugin = CMSPlugins.generateWordPressPlugin(
        'https://api.example.com',
        'test-api-key'
      );

      expect(plugin).toContain('Plugin Name: M-SEO Integration');
      expect(plugin).toContain('https://api.example.com');
      expect(plugin).toContain('test-api-key');
      expect(plugin).toContain('save_post');
      expect(plugin).toContain('wp_head');
    });
  });

  // ==========================================================================
  // Meta Tag Generation Tests
  // ==========================================================================

  describe('meta tag generation', () => {
    it('should generate all standard meta tags', async () => {
      const content = {
        ...mockContent,
        featuredImage: 'https://example.com/image.jpg'
      };

      const result = await CMSPlugins.generateSeoData(mockConfig, content);

      expect(result.generatedMeta).toContain('<title>');
      expect(result.generatedMeta).toContain('meta name="description"');
      expect(result.generatedMeta).toContain('meta property="og:title"');
      expect(result.generatedMeta).toContain('meta property="og:description"');
      expect(result.generatedMeta).toContain('meta property="og:image"');
    });

    it('should escape HTML in meta tags', async () => {
      const dangerousContent = {
        ...mockContent,
        title: 'Test <script>alert("xss")</script> Post',
        excerpt: 'Excerpt with "quotes" and <tags>'
      };

      const result = await CMSPlugins.generateSeoData(mockConfig, dangerousContent);

      expect(result.generatedMeta).not.toContain('<script>');
      expect(result.generatedMeta).toContain('&lt;script&gt;');
      expect(result.generatedMeta).toContain('&quot;');
    });
  });
});
