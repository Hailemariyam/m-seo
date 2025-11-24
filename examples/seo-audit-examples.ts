// examples/seo-audit-examples.ts
// Comprehensive examples for SEO Audit Engine

import {
  SeoAuditEngine,
  createSeoAuditEngine,
  quickAudit,
  compareAudits,
  type AuditResult,
  type AuditIssue
} from '../src/index.js';

// ============================================================================
// Example 1: Basic SEO Audit
// ============================================================================

export async function example1_BasicAudit() {
  console.log('=== Example 1: Basic SEO Audit ===\n');

  const engine = new SeoAuditEngine({
    url: 'https://example.com'
  });

  const results = await engine.runFullAudit();

  console.log(`Overall Score: ${results.overallScore}/100`);
  console.log(`Total Issues: ${results.summary.totalIssues}`);
  console.log(`Critical: ${results.summary.criticalIssues}`);
  console.log(`Warnings: ${results.summary.warnings}`);
  console.log(`Info: ${results.summary.infoItems}`);

  console.log('\nTop 5 Issues:');
  results.issues
    .slice(0, 5)
    .forEach((issue, idx) => {
      console.log(`${idx + 1}. [${issue.severity.toUpperCase()}] ${issue.title}`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   Impact: ${issue.impact}/100 | Effort: ${issue.effort}`);
      console.log(`   Fix: ${issue.recommendation}\n`);
    });
}

// ============================================================================
// Example 2: Quick Audit Helper
// ============================================================================

export async function example2_QuickAudit() {
  console.log('=== Example 2: Quick Audit Helper ===\n');

  // One-liner audit
  const results = await quickAudit('https://example.com');

  console.log(`SEO Score: ${results.overallScore}/100`);
  console.log(`Audit completed at: ${results.timestamp.toISOString()}`);

  // Show category scores
  console.log('\nCategory Scores:');
  Object.entries(results.categoryScores).forEach(([category, score]) => {
    const emoji = score >= 90 ? '🟢' : score >= 70 ? '🟡' : '🔴';
    console.log(`${emoji} ${category}: ${score}/100`);
  });
}

// ============================================================================
// Example 3: Generate HTML Report
// ============================================================================

export async function example3_GenerateHTMLReport() {
  console.log('=== Example 3: Generate HTML Report ===\n');

  const engine = new SeoAuditEngine({
    url: 'https://example.com'
  });

  const report = await engine.generateReport('html');

  console.log('Report generated with formats:');
  console.log(`- JSON: ${report.json.length} characters`);
  console.log(`- HTML: ${report.html?.length || 0} characters`);

  // In real implementation, save to file:
  // import { writeFileSync } from 'fs';
  // writeFileSync('seo-audit-report.html', report.html!);
  // writeFileSync('seo-audit-report.json', report.json);

  console.log('\nHTML report ready to save!');
}

// ============================================================================
// Example 4: Generate Markdown Report
// ============================================================================

export async function example4_GenerateMarkdownReport() {
  console.log('=== Example 4: Generate Markdown Report ===\n');

  const engine = new SeoAuditEngine({
    url: 'https://example.com'
  });

  const report = await engine.generateReport('markdown');

  console.log('Markdown Report Preview:');
  console.log(report.markdown?.substring(0, 500) + '...\n');

  // Save to file:
  // writeFileSync('SEO-AUDIT.md', report.markdown!);
}

// ============================================================================
// Example 5: Focus on Critical Issues
// ============================================================================

export async function example5_CriticalIssues() {
  console.log('=== Example 5: Focus on Critical Issues ===\n');

  const results = await quickAudit('https://example.com');

  const criticalIssues = results.issues.filter(
    issue => issue.severity === 'critical'
  );

  console.log(`Found ${criticalIssues.length} critical issues:\n`);

  criticalIssues.forEach((issue, idx) => {
    console.log(`${idx + 1}. ${issue.title}`);
    console.log(`   Category: ${issue.category}`);
    console.log(`   Impact: ${issue.impact}/100`);
    console.log(`   Element: ${issue.element || 'N/A'}`);
    console.log(`   Description: ${issue.description}`);
    console.log(`   Recommendation: ${issue.recommendation}`);
    console.log(`   Effort to fix: ${issue.effort}\n`);
  });

  if (criticalIssues.length === 0) {
    console.log('🎉 No critical issues found!');
  }
}

// ============================================================================
// Example 6: Find Quick Wins
// ============================================================================

export async function example6_QuickWins() {
  console.log('=== Example 6: Find Quick Wins ===\n');

  const results = await quickAudit('https://example.com');

  // High impact, low effort = quick wins
  const quickWins = results.issues.filter(
    issue => issue.impact >= 70 && issue.effort === 'low'
  );

  console.log(`Found ${quickWins.length} quick wins (high impact, low effort):\n`);

  quickWins
    .sort((a, b) => b.impact - a.impact)
    .forEach((issue, idx) => {
      console.log(`${idx + 1}. ${issue.title}`);
      console.log(`   Impact: ${issue.impact}/100`);
      console.log(`   Category: ${issue.category}`);
      console.log(`   Fix: ${issue.recommendation}\n`);
    });

  // Also show medium-effort high-impact issues
  const mediumEffortHighImpact = results.issues.filter(
    issue => issue.impact >= 70 && issue.effort === 'medium'
  );

  console.log(`\nHigh-impact medium-effort issues: ${mediumEffortHighImpact.length}`);
}

// ============================================================================
// Example 7: Compare Audits (Track Progress)
// ============================================================================

export async function example7_CompareAudits() {
  console.log('=== Example 7: Compare Audits ===\n');

  // Simulate "before" audit
  const beforeAudit = await quickAudit('https://example.com');
  console.log(`Initial Score: ${beforeAudit.overallScore}/100`);
  console.log(`Initial Issues: ${beforeAudit.summary.totalIssues}\n`);

  // Simulate making improvements (in reality, this would be after actual changes)
  console.log('Making SEO improvements...\n');

  // Simulate "after" audit
  const afterAudit = await quickAudit('https://example.com');
  console.log(`New Score: ${afterAudit.overallScore}/100`);
  console.log(`New Issues: ${afterAudit.summary.totalIssues}\n`);

  // Compare results
  const comparison = compareAudits(beforeAudit, afterAudit);

  console.log('=== Comparison Results ===');
  console.log(comparison.summary);
  console.log(`Score change: ${comparison.scoreDiff > 0 ? '+' : ''}${comparison.scoreDiff} points`);
  console.log(`Issues change: ${comparison.issuesDiff > 0 ? '+' : ''}${comparison.issuesDiff}`);
  console.log(`Status: ${comparison.improved ? '✅ Improved' : '⚠️ Needs attention'}\n`);

  console.log('Category-by-Category Changes:');
  Object.entries(comparison.categoryChanges).forEach(([category, change]) => {
    if (change !== 0) {
      const icon = change > 0 ? '📈' : '📉';
      console.log(`${icon} ${category}: ${change > 0 ? '+' : ''}${change} points`);
    }
  });
}

// ============================================================================
// Example 8: Audit Multiple Pages
// ============================================================================

export async function example8_AuditMultiplePages() {
  console.log('=== Example 8: Audit Multiple Pages ===\n');

  const urls = [
    'https://example.com',
    'https://example.com/about',
    'https://example.com/products',
    'https://example.com/contact',
    'https://example.com/blog'
  ];

  console.log(`Auditing ${urls.length} pages...\n`);

  const results = await Promise.all(
    urls.map(url => quickAudit(url))
  );

  // Display results
  console.log('Results:\n');
  results.forEach((result, idx) => {
    const emoji = result.overallScore >= 90 ? '🟢' :
                  result.overallScore >= 70 ? '🟡' : '🔴';
    console.log(`${emoji} ${urls[idx]}`);
    console.log(`   Score: ${result.overallScore}/100`);
    console.log(`   Issues: ${result.summary.totalIssues} (${result.summary.criticalIssues} critical)\n`);
  });

  // Find best and worst pages
  const scores = results.map((r, i) => ({ url: urls[i], score: r.overallScore }));
  const best = scores.reduce((a, b) => a.score > b.score ? a : b);
  const worst = scores.reduce((a, b) => a.score < b.score ? a : b);

  console.log('Summary:');
  console.log(`🏆 Best page: ${best.url} (${best.score}/100)`);
  console.log(`⚠️  Worst page: ${worst.url} (${worst.score}/100)`);

  const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
  console.log(`📊 Average score: ${avgScore.toFixed(1)}/100`);
}

// ============================================================================
// Example 9: Meta Tags Analysis
// ============================================================================

export async function example9_MetaTagsAnalysis() {
  console.log('=== Example 9: Meta Tags Analysis ===\n');

  const results = await quickAudit('https://example.com');

  console.log('Meta Tags Report:');
  console.log(`Score: ${results.metaTags.score}/100\n`);

  console.log('📌 Title Tag:');
  console.log(`   Text: ${results.metaTags.title || 'MISSING'}`);
  console.log(`   Length: ${results.metaTags.titleLength || 0} characters`);
  console.log(`   Status: ${(results.metaTags.titleLength || 0) >= 50 && (results.metaTags.titleLength || 0) <= 60 ? '✅ Optimal' : '⚠️ Needs adjustment'}\n`);

  console.log('📝 Meta Description:');
  console.log(`   Text: ${results.metaTags.description || 'MISSING'}`);
  console.log(`   Length: ${results.metaTags.descriptionLength || 0} characters`);
  console.log(`   Status: ${(results.metaTags.descriptionLength || 0) >= 150 && (results.metaTags.descriptionLength || 0) <= 160 ? '✅ Optimal' : '⚠️ Needs adjustment'}\n`);

  console.log('🔗 Canonical URL:');
  console.log(`   ${results.metaTags.canonical || 'MISSING'}\n`);

  console.log('📱 Viewport:');
  console.log(`   ${results.metaTags.viewport || 'MISSING'}\n`);

  console.log('🤖 Robots:');
  console.log(`   ${results.metaTags.robots || 'Not specified'}\n`);

  // Show meta-specific issues
  const metaIssues = results.issues.filter(i => i.category === 'meta-tags');
  if (metaIssues.length > 0) {
    console.log(`Issues found: ${metaIssues.length}`);
    metaIssues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.title}`);
      console.log(`    ${issue.recommendation}`);
    });
  }
}

// ============================================================================
// Example 10: Content Quality Analysis
// ============================================================================

export async function example10_ContentAnalysis() {
  console.log('=== Example 10: Content Quality Analysis ===\n');

  const results = await quickAudit('https://example.com');

  console.log('Content Report:');
  console.log(`Score: ${results.content.score}/100\n`);

  console.log('📊 Content Metrics:');
  console.log(`   Word Count: ${results.content.wordCount}`);
  console.log(`   Paragraphs: ${results.content.paragraphCount}`);
  console.log(`   Avg Paragraph Length: ${results.content.averageParagraphLength.toFixed(1)} words\n`);

  console.log('📑 Heading Structure:');
  console.log(`   H1: ${results.content.headings.h1} ${results.content.headings.h1 === 1 ? '✅' : '⚠️'}`);
  console.log(`   H2: ${results.content.headings.h2}`);
  console.log(`   H3: ${results.content.headings.h3}`);
  console.log(`   H4: ${results.content.headings.h4}`);
  console.log(`   H5: ${results.content.headings.h5}`);
  console.log(`   H6: ${results.content.headings.h6}\n`);

  if (results.content.h1Tags.length > 0) {
    console.log('H1 Content:');
    results.content.h1Tags.forEach(h1 => {
      console.log(`   "${h1}"`);
    });
    console.log();
  }

  // Content-specific issues
  const contentIssues = results.issues.filter(i => i.category === 'content');
  if (contentIssues.length > 0) {
    console.log(`Issues found: ${contentIssues.length}`);
    contentIssues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.title}`);
      console.log(`    ${issue.recommendation}`);
    });
  }
}

// ============================================================================
// Example 11: Performance Monitoring
// ============================================================================

export async function example11_PerformanceMonitoring() {
  console.log('=== Example 11: Performance Monitoring ===\n');

  const results = await quickAudit('https://example.com', {
    includePerformance: true
  });

  if (results.performance) {
    console.log('Performance Report:');
    console.log(`Score: ${results.performance.score}/100\n`);

    console.log('⚡ Metrics:');
    console.log(`   Load Time: ${results.performance.loadTime}ms ${results.performance.loadTime! < 2000 ? '✅' : '⚠️'}`);
    console.log(`   Page Size: ${(results.performance.pageSize! / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   Requests: ${results.performance.requestCount}\n`);

    console.log('📦 Resources:');
    console.log(`   Images: ${results.performance.imageCount}`);
    console.log(`   Scripts: ${results.performance.scriptCount}`);
    console.log(`   Stylesheets: ${results.performance.styleCount}\n`);

    console.log('🔧 Optimizations:');
    console.log(`   Compression: ${results.performance.compressionEnabled ? '✅ Enabled' : '❌ Disabled'}`);
    console.log(`   Cache Headers: ${results.performance.cacheHeaders ? '✅ Set' : '❌ Missing'}`);
    console.log(`   Minification: ${results.performance.minificationScore}/100\n`);

    // Performance issues
    const perfIssues = results.issues.filter(i => i.category === 'performance');
    if (perfIssues.length > 0) {
      console.log(`Performance Issues: ${perfIssues.length}`);
      perfIssues.forEach(issue => {
        console.log(`  - ${issue.title}`);
        console.log(`    Impact: ${issue.impact}/100 | Effort: ${issue.effort}`);
        console.log(`    Fix: ${issue.recommendation}\n`);
      });
    }
  }
}

// ============================================================================
// Example 12: Mobile-Friendliness Check
// ============================================================================

export async function example12_MobileFriendliness() {
  console.log('=== Example 12: Mobile-Friendliness Check ===\n');

  const results = await quickAudit('https://example.com', {
    includeMobileCheck: true
  });

  if (results.mobile) {
    console.log('Mobile Report:');
    console.log(`Score: ${results.mobile.score}/100\n`);

    console.log('📱 Mobile Optimizations:');
    console.log(`   Viewport Tag: ${results.mobile.hasViewportTag ? '✅ Present' : '❌ Missing'}`);
    if (results.mobile.viewportContent) {
      console.log(`   Viewport Content: ${results.mobile.viewportContent}`);
    }
    console.log(`   Mobile Friendly: ${results.mobile.isMobileFriendly ? '✅ Yes' : '❌ No'}`);
    console.log(`   Font Size: ${results.mobile.fontSizeReadable ? '✅ Readable' : '⚠️ Too small'}`);
    console.log(`   Content Fits: ${results.mobile.contentFitsViewport ? '✅ Yes' : '⚠️ Overflow'}\n`);

    // Mobile issues
    const mobileIssues = results.issues.filter(i => i.category === 'mobile');
    if (mobileIssues.length > 0) {
      console.log(`Mobile Issues: ${mobileIssues.length}`);
      mobileIssues.forEach(issue => {
        console.log(`  - [${issue.severity}] ${issue.title}`);
        console.log(`    ${issue.recommendation}\n`);
      });
    } else {
      console.log('✅ No mobile issues found!');
    }
  }
}

// ============================================================================
// Example 13: Accessibility Audit
// ============================================================================

export async function example13_AccessibilityAudit() {
  console.log('=== Example 13: Accessibility Audit ===\n');

  const results = await quickAudit('https://example.com', {
    includeAccessibility: true
  });

  if (results.accessibility) {
    console.log('Accessibility Report:');
    console.log(`Score: ${results.accessibility.score}/100\n`);

    console.log('♿ Accessibility Features:');
    console.log(`   Alt Tags: ${results.accessibility.hasAltTags ? '✅ Complete' : '⚠️ Incomplete'}`);
    console.log(`   Missing Alt: ${results.accessibility.missingAltCount} images`);
    console.log(`   ARIA Labels: ${results.accessibility.ariaLabels}`);
    console.log(`   Landmark Roles: ${results.accessibility.landmarkRoles}`);
    console.log(`   Form Labels: ${results.accessibility.formLabels}\n`);

    // Accessibility issues by severity
    const a11yIssues = results.issues.filter(i => i.category === 'accessibility');
    const critical = a11yIssues.filter(i => i.severity === 'critical');
    const warnings = a11yIssues.filter(i => i.severity === 'warning');
    const info = a11yIssues.filter(i => i.severity === 'info');

    console.log('Issues Breakdown:');
    console.log(`   Critical: ${critical.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Info: ${info.length}\n`);

    if (critical.length > 0) {
      console.log('🚨 Critical Accessibility Issues:');
      critical.forEach(issue => {
        console.log(`  - ${issue.title}`);
        console.log(`    ${issue.recommendation}\n`);
      });
    }
  }
}

// ============================================================================
// Example 14: Image Optimization Check
// ============================================================================

export async function example14_ImageOptimization() {
  console.log('=== Example 14: Image Optimization ===\n');

  const results = await quickAudit('https://example.com');

  console.log('Image Report:');
  console.log(`Score: ${results.images.score}/100\n`);

  console.log('🖼️  Image Statistics:');
  console.log(`   Total Images: ${results.images.totalImages}`);
  console.log(`   With Alt Text: ${results.images.imagesWithAlt} (${results.images.totalImages > 0 ? ((results.images.imagesWithAlt / results.images.totalImages) * 100).toFixed(1) : 0}%)`);
  console.log(`   Without Alt: ${results.images.imagesWithoutAlt}\n`);

  console.log('⚡ Optimizations:');
  console.log(`   Lazy Loading: ${results.images.lazyLoadedImages}/${results.images.totalImages}`);
  console.log(`   Responsive Images: ${results.images.responsiveImages}/${results.images.totalImages}`);
  console.log(`   Next-Gen Formats: ${results.images.nextGenFormats}/${results.images.totalImages}\n`);

  // Image issues
  const imageIssues = results.issues.filter(i => i.category === 'images');
  if (imageIssues.length > 0) {
    console.log(`Image Issues: ${imageIssues.length}`);
    imageIssues.forEach(issue => {
      console.log(`  - ${issue.title} (Impact: ${issue.impact}/100)`);
      console.log(`    ${issue.recommendation}\n`);
    });
  }
}

// ============================================================================
// Example 15: Security Audit
// ============================================================================

export async function example15_SecurityAudit() {
  console.log('=== Example 15: Security Audit ===\n');

  const results = await quickAudit('https://example.com');

  console.log('Security Report:');
  console.log(`Score: ${results.security.score}/100\n`);

  console.log('🔒 Security Status:');
  console.log(`   HTTPS: ${results.security.hasHttps ? '✅ Enabled' : '❌ Disabled'}`);
  console.log(`   Mixed Content: ${results.security.mixedContent ? '⚠️ Detected' : '✅ None'}\n`);

  console.log('🛡️  Security Headers:');
  console.log(`   HSTS: ${results.security.securityHeaders.hsts ? '✅' : '❌'}`);
  console.log(`   CSP: ${results.security.securityHeaders.csp ? '✅' : '❌'}`);
  console.log(`   X-Frame-Options: ${results.security.securityHeaders.xFrameOptions ? '✅' : '❌'}`);
  console.log(`   X-Content-Type-Options: ${results.security.securityHeaders.xContentTypeOptions ? '✅' : '❌'}\n`);

  if (results.security.vulnerabilities.length > 0) {
    console.log(`🚨 Vulnerabilities Found: ${results.security.vulnerabilities.length}`);
    results.security.vulnerabilities.forEach(vuln => {
      console.log(`  - ${vuln}`);
    });
    console.log();
  }

  // Security issues
  const securityIssues = results.issues.filter(i => i.category === 'security');
  if (securityIssues.length > 0) {
    console.log('Security Issues:');
    securityIssues.forEach(issue => {
      console.log(`  - [${issue.severity}] ${issue.title}`);
      console.log(`    ${issue.recommendation}\n`);
    });
  }
}

// ============================================================================
// Example 16: Custom Audit Configuration
// ============================================================================

export async function example16_CustomConfiguration() {
  console.log('=== Example 16: Custom Audit Configuration ===\n');

  // Performance-focused audit
  const perfEngine = new SeoAuditEngine({
    url: 'https://example.com',
    includePerformance: true,
    includeAccessibility: false,
    includeMobileCheck: false,
    includeSchemaValidation: false,
    timeout: 60000
  });

  const perfResults = await perfEngine.runFullAudit();
  console.log(`Performance-Only Audit Score: ${perfResults.performance?.score || 0}/100\n`);

  // Accessibility-focused audit
  const a11yEngine = new SeoAuditEngine({
    url: 'https://example.com',
    includePerformance: false,
    includeAccessibility: true,
    includeMobileCheck: true,
    includeSchemaValidation: false
  });

  const a11yResults = await a11yEngine.runFullAudit();
  console.log(`Accessibility-Only Audit Score: ${a11yResults.accessibility?.score || 0}/100\n`);

  // Full audit with custom settings
  const fullEngine = createSeoAuditEngine({
    url: 'https://example.com',
    includePerformance: true,
    includeAccessibility: true,
    includeMobileCheck: true,
    includeSchemaValidation: true,
    userAgent: 'CustomSEOBot/2.0',
    timeout: 45000,
    followRedirects: true,
    maxRedirects: 3
  });

  const fullResults = await fullEngine.runFullAudit();
  console.log(`Full Audit Score: ${fullResults.overallScore}/100`);
}

// ============================================================================
// Main execution
// ============================================================================

async function runAllExamples() {
  const examples = [
    example1_BasicAudit,
    example2_QuickAudit,
    example3_GenerateHTMLReport,
    example4_GenerateMarkdownReport,
    example5_CriticalIssues,
    example6_QuickWins,
    example7_CompareAudits,
    example8_AuditMultiplePages,
    example9_MetaTagsAnalysis,
    example10_ContentAnalysis,
    example11_PerformanceMonitoring,
    example12_MobileFriendliness,
    example13_AccessibilityAudit,
    example14_ImageOptimization,
    example15_SecurityAudit,
    example16_CustomConfiguration
  ];

  console.log('SEO Audit Engine - Comprehensive Examples\n');
  console.log('==========================================\n');

  for (const example of examples) {
    try {
      await example();
      console.log('\n' + '='.repeat(80) + '\n');
    } catch (error) {
      console.error(`Error in ${example.name}:`, error);
    }
  }
}

// Uncomment to run all examples
// runAllExamples();
