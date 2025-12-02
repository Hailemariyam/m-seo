// AI Content Analysis - Usage Examples

import { AIContentAnalysis, AIContentConfig } from '../src/integrations/AIContentAnalysis';

/**
 * Example 1: Basic Content Analysis
 */
async function basicAnalysis() {
  console.log('=== Example 1: Basic Analysis ===\n');

  const result = await AIContentAnalysis.analyzeContent({
    text: `
      Content marketing is a strategic marketing approach focused on creating and
      distributing valuable, relevant, and consistent content to attract and retain
      a clearly defined audience. The goal is to drive profitable customer action.

      Content marketing helps businesses build trust with their audience by providing
      helpful information rather than just promotional messages. This approach leads
      to better customer relationships and increased brand loyalty.
    `,
    targetKeyword: 'content marketing',
    contentType: 'blog-post',
    minWordCount: 300
  });

  console.log(`Overall Score: ${result.summary.overallScore}/100 (${result.summary.grade})`);
  console.log(`Status: ${result.summary.status}`);
  console.log(`Readability: ${result.summary.readabilityScore}/100`);
  console.log(`SEO: ${result.summary.seoScore}/100`);
  console.log(`Quality: ${result.summary.contentQualityScore}/100`);
  console.log(`\nWord Count: ${result.metrics.wordCount}`);
  console.log(`Flesch Reading Ease: ${result.readability.fleschReadingEase.toFixed(1)}`);
  console.log(`Target Audience: ${result.readability.targetAudience}`);
  console.log(`\nRecommendations: ${result.recommendations.length}`);
  result.recommendations.slice(0, 3).forEach((rec, i) => {
    console.log(`  ${i + 1}. [${rec.priority}] ${rec.title}`);
  });
}

/**
 * Example 2: Advanced Analysis with AI
 */
async function advancedAnalysis() {
  console.log('\n=== Example 2: Advanced Analysis ===\n');

  const config: AIContentConfig = {
    text: `
      Artificial intelligence is revolutionizing the way we work and live.
      From chatbots to self-driving cars, AI is everywhere. This technology
      is amazing and will change everything!
    `,
    targetKeyword: 'artificial intelligence',

    // Enable advanced features
    enableAI: false, // Set to true with API key for real AI
    analyzeSentiment: true,
    analyzeTone: true,

    // Performance settings
    enableCache: true,
    cacheTTL: 3600
  };

  const result = await AIContentAnalysis.analyzeContent(config);

  console.log(`Overall Score: ${result.summary.overallScore}/100`);

  if (result.sentiment) {
    console.log(`\nSentiment: ${result.sentiment.overall} (${result.sentiment.score.toFixed(2)})`);
    console.log(`Confidence: ${(result.sentiment.confidence * 100).toFixed(1)}%`);
  }

  if (result.tone) {
    console.log(`\nTone: ${result.tone.primary}`);
    console.log(`Characteristics: ${result.tone.characteristics.join(', ')}`);
  }
}

/**
 * Example 3: Batch Processing
 */
async function batchAnalysis() {
  console.log('\n=== Example 3: Batch Processing ===\n');

  const articles = [
    {
      id: 'post1',
      config: {
        text: 'SEO is crucial for online visibility. Search engines rank content based on relevance and quality.',
        targetKeyword: 'SEO'
      }
    },
    {
      id: 'post2',
      config: {
        text: 'Web development requires knowledge of HTML, CSS, and JavaScript. Modern frameworks make it easier.',
        targetKeyword: 'web development'
      }
    },
    {
      id: 'post3',
      config: {
        text: 'Cloud computing enables businesses to scale infrastructure on demand. AWS, Azure, and GCP are leaders.',
        targetKeyword: 'cloud computing'
      }
    }
  ];

  const batchResult = await AIContentAnalysis.batchAnalyze({
    items: articles,
    onProgress: (completed, total) => {
      console.log(`Progress: ${completed}/${total} (${Math.round(completed/total*100)}%)`);
    }
  });

  console.log(`\n✅ Batch Complete!`);
  console.log(`Total Items: ${batchResult.totalItems}`);
  console.log(`Completed: ${batchResult.completed}`);
  console.log(`Failed: ${batchResult.failed}`);
  console.log(`Total Time: ${batchResult.totalTime}ms`);
  console.log(`Average Time: ${batchResult.averageTime}ms per item`);

  console.log(`\nResults:`);
  batchResult.results.forEach((result, i) => {
    console.log(`  ${i + 1}. Score: ${result.summary.overallScore}/100 (${result.summary.grade})`);
  });
}

/**
 * Example 4: Plagiarism Detection
 */
async function plagiarismCheck() {
  console.log('\n=== Example 4: Plagiarism Detection ===\n');

  const result = await AIContentAnalysis.analyzeContent({
    text: 'Content marketing is a strategic approach to creating valuable content.',
    detectPlagiarism: true,
    compareWith: [
      'Content marketing is a strategic marketing approach focused on creating valuable content.',
      'A different article about completely unrelated topics like cooking recipes.'
    ]
  });

  if (result.plagiarism) {
    console.log(`Status: ${result.plagiarism.status}`);
    console.log(`Overall Similarity: ${result.plagiarism.overallSimilarity.toFixed(1)}%`);
    console.log(`Unique Content: ${result.plagiarism.uniquePercentage.toFixed(1)}%`);
    console.log(`Detected: ${result.plagiarism.detected ? 'Yes ⚠️' : 'No ✅'}`);

    if (result.plagiarism.matches.length > 0) {
      console.log(`\nMatches Found:`);
      result.plagiarism.matches.forEach((match, i) => {
        console.log(`  ${i + 1}. ${match.similarity.toFixed(1)}% similar`);
        console.log(`     Matched: "${match.matchedText.slice(0, 50)}..."`);
      });
    }
  }
}

/**
 * Example 5: Keyword Analysis
 */
async function keywordAnalysis() {
  console.log('\n=== Example 5: Keyword Analysis ===\n');

  const result = await AIContentAnalysis.analyzeContent({
    text: `
      Machine learning is a subset of artificial intelligence. Machine learning
      algorithms learn from data. Deep learning is a type of machine learning
      that uses neural networks. Machine learning applications are everywhere.
    `,
    targetKeyword: 'machine learning'
  });

  const keyword = result.keywords[0];
  if (keyword) {
    console.log(`Keyword: "${keyword.keyword}"`);
    console.log(`Occurrences: ${keyword.count}`);
    console.log(`Density: ${keyword.density.toFixed(2)}%`);
    console.log(`Prominence: ${keyword.prominence.toFixed(1)}/100`);
    console.log(`\nDistribution:`);
    console.log(`  First Paragraph: ${keyword.distribution.firstParagraph}`);
    console.log(`  Headings: ${keyword.distribution.headings}`);
    console.log(`  Body: ${keyword.distribution.body}`);
    console.log(`  Last Paragraph: ${keyword.distribution.lastParagraph}`);

    if (keyword.variations.length > 1) {
      console.log(`\nVariations Found: ${keyword.variations.slice(1).join(', ')}`);
    }
  }
}

/**
 * Example 6: Export Reports
 */
async function exportReports() {
  console.log('\n=== Example 6: Export Reports ===\n');

  const result = await AIContentAnalysis.analyzeContent({
    text: 'Sample content for report generation. This is a test article about SEO.',
    targetKeyword: 'SEO'
  });

  // Export as JSON
  const jsonReport = await AIContentAnalysis.exportReport(result, {
    format: 'json'
  });
  console.log('JSON Report Length:', jsonReport.length, 'bytes');

  // Export as Markdown
  const markdownReport = await AIContentAnalysis.exportReport(result, {
    format: 'markdown',
    includeRecommendations: true,
    template: 'detailed'
  });
  console.log('\nMarkdown Report:\n');
  console.log(markdownReport.slice(0, 500) + '...\n');
}

/**
 * Example 7: Cache Management
 */
async function cacheManagement() {
  console.log('\n=== Example 7: Cache Management ===\n');

  const content = {
    text: 'Test content for caching demonstration.',
    enableCache: true,
    cacheTTL: 60 // 60 seconds
  };

  // First analysis (not cached)
  console.log('First analysis (cache miss)...');
  const start1 = Date.now();
  const result1 = await AIContentAnalysis.analyzeContent(content);
  const time1 = Date.now() - start1;
  console.log(`Time: ${time1}ms, Cached: ${result1.cached}`);

  // Second analysis (cached)
  console.log('\nSecond analysis (cache hit)...');
  const start2 = Date.now();
  const result2 = await AIContentAnalysis.analyzeContent(content);
  const time2 = Date.now() - start2;
  console.log(`Time: ${time2}ms, Cached: ${result2.cached}`);
  console.log(`Speed improvement: ${Math.round(time1 / time2)}x faster!`);

  // Cache stats
  const stats = AIContentAnalysis.getCacheStats();
  console.log(`\nCache Statistics:`);
  console.log(`  Total Entries: ${stats.size}`);
  console.log(`  Entries:`, stats.entries.slice(0, 3));

  // Clear cache
  AIContentAnalysis.clearCache();
  console.log('\n✅ Cache cleared!');
}

/**
 * Example 8: Historical Analysis
 */
async function historicalTracking() {
  console.log('\n=== Example 8: Historical Tracking ===\n');

  // Perform multiple analyses
  await AIContentAnalysis.analyzeContent({
    text: 'First analysis content.'
  });

  await AIContentAnalysis.analyzeContent({
    text: 'Second analysis content.'
  });

  // Get history
  const history = AIContentAnalysis.getHistory(5);
  console.log(`Recent Analyses: ${history.length}`);

  history.forEach((analysis, i) => {
    const date = new Date(analysis.timestamp);
    console.log(`${i + 1}. ${date.toLocaleString()} - Score: ${analysis.summary.overallScore}/100`);
  });
}

/**
 * Run all examples
 */
async function runAllExamples() {
  try {
    await basicAnalysis();
    await advancedAnalysis();
    await batchAnalysis();
    await plagiarismCheck();
    await keywordAnalysis();
    await exportReports();
    await cacheManagement();
    await historicalTracking();

    console.log('\n✅ All examples completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples();
}

export {
  basicAnalysis,
  advancedAnalysis,
  batchAnalysis,
  plagiarismCheck,
  keywordAnalysis,
  exportReports,
  cacheManagement,
  historicalTracking
};
