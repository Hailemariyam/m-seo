/**
 * React Bot Detection Examples
 *
 * These examples demonstrate the useBotDetection() hook for
 * advanced bot handling and optimization scenarios.
 *
 * INSTALLATION:
 * npm install m-seo react react-dom
 *
 * USAGE:
 * Import and use these patterns in your React application
 */

// @ts-nocheck - This is a reference example
import React, { useEffect } from 'react';
import { useSeo, useBotDetection } from 'm-seo/adapters/ReactSPAAdapter';

/**
 * Example 1: Basic Bot Detection
 * Show different content for bots vs. users
 */
export function BotAwareContent() {
  const { isBot, botName, botType } = useBotDetection();

  if (isBot) {
    return (
      <div className="bot-content">
        <h1>Bot-Optimized Content</h1>
        <p>Detected: {botName || 'Unknown Bot'}</p>
        <p>Type: {botType}</p>
        <p>This is a simplified, SEO-friendly version of the page.</p>
      </div>
    );
  }

  return (
    <div className="user-content">
      <h1>Interactive User Experience</h1>
      <ComplexInteractiveFeatures />
      <RichAnimations />
      <VideoPlayer />
    </div>
  );
}

/**
 * Example 2: Different Content by Bot Type
 * Serve optimized content based on bot purpose
 */
export function ProductPage({ product }) {
  const { isSearchEngine, isSocialMedia, isBot } = useBotDetection();

  // Basic SEO for all visitors
  useSeo({
    title: `${product.name} - $${product.price}`,
    description: product.description,
    ogImage: product.image
  });

  if (isSearchEngine) {
    // SEO-optimized content for Google, Bing, etc.
    return (
      <div className="seo-view">
        <h1>{product.name}</h1>
        <p><strong>Price:</strong> ${product.price}</p>
        <p>{product.description}</p>
        <ul>
          {product.features.map((feature, i) => (
            <li key={i}>{feature}</li>
          ))}
        </ul>
      </div>
    );
  }

  if (isSocialMedia) {
    // Rich preview for Facebook, Twitter, LinkedIn
    return (
      <div className="social-preview">
        <img src={product.image} alt={product.name} />
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <button>Buy Now - ${product.price}</button>
      </div>
    );
  }

  // Full interactive app for real users
  return (
    <div className="interactive-product">
      <ProductGallery images={product.images} />
      <ProductDetails product={product} />
      <ProductReviews />
      <RelatedProducts />
      <LiveChat />
    </div>
  );
}

/**
 * Example 3: Analytics Separation
 * Track bot vs. user traffic separately
 */
export function AnalyticsPage() {
  const { getAnalyticsCategory, botInfo, isBot } = useBotDetection();

  useEffect(() => {
    const category = getAnalyticsCategory();

    if (category === 'user') {
      // Track real users
      window.gtag('event', 'page_view', {
        visitor_type: 'user',
        page_title: document.title
      });
    } else {
      // Track bots separately
      window.gtag('event', 'bot_visit', {
        visitor_type: 'bot',
        bot_name: botInfo.name,
        bot_type: botInfo.type,
        bot_category: category,
        page_title: document.title
      });
    }
  }, []);

  return (
    <div>
      <h1>Analytics Page</h1>
      {isBot ? (
        <p>Bot traffic tracked in separate category</p>
      ) : (
        <p>User traffic tracked normally</p>
      )}
    </div>
  );
}

/**
 * Example 4: Block AI Scrapers
 * Prevent AI training data collection
 */
export function ProtectedContent({ content }) {
  const { isAIBot, botName } = useBotDetection();

  if (isAIBot) {
    return (
      <div className="blocked-content">
        <h1>Access Restricted</h1>
        <p>AI scraping is not permitted on this content.</p>
        <p>Detected: {botName}</p>
        <p>
          If you're a legitimate service, please contact us for API access.
        </p>
      </div>
    );
  }

  return (
    <article>
      <h1>{content.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content.html }} />
    </article>
  );
}

/**
 * Example 5: Security Monitoring
 * Detect and log suspicious bot activity
 */
export function SecurityMonitor() {
  const { getBotSuspicionScore, botInfo, isBot } = useBotDetection();

  useEffect(() => {
    const score = getBotSuspicionScore();

    if (score > 80) {
      // High suspicion - log and alert
      console.warn('🚨 Suspicious bot activity detected', {
        score,
        botInfo,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      // Send security alert
      fetch('/api/security/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'suspicious_bot',
          score,
          details: botInfo,
          url: window.location.href
        })
      });
    } else if (isBot && score > 50) {
      // Medium suspicion - just log
      console.info('⚠️ Possible bot detected', { score, botInfo });
    }
  }, []);

  return null; // Silent security component
}

/**
 * Example 6: Conditional Feature Loading
 * Don't load heavy features for bots
 */
export function SmartFeatureLoader() {
  const { shouldRenderClientSide } = useBotDetection();

  useSeo({
    title: 'Feature-Rich Page',
    description: 'Page with smart feature loading'
  });

  return (
    <div>
      <h1>Smart Feature Loader</h1>

      {/* Always render static content */}
      <StaticContent />

      {/* Only load for real users */}
      {shouldRenderClientSide && (
        <>
          <VideoPlayer />
          <InteractiveChart />
          <RealtimeChat />
          <AnimatedComponents />
        </>
      )}
    </div>
  );
}

/**
 * Example 7: A/B Testing Exclusion
 * Exclude bots from A/B tests
 */
export function ABTestPage() {
  const { isBot } = useBotDetection();
  const [variant, setVariant] = React.useState('control');

  useEffect(() => {
    if (!isBot) {
      // Only A/B test real users
      const testVariant = Math.random() > 0.5 ? 'variant-a' : 'variant-b';
      setVariant(testVariant);

      // Track experiment
      analytics.track('ab_test_view', {
        experiment: 'homepage_redesign',
        variant: testVariant
      });
    }
  }, [isBot]);

  if (isBot) {
    // Bots always see control version
    return <ControlVersion />;
  }

  return variant === 'variant-a' ? <VariantA /> : <VariantB />;
}

/**
 * Example 8: Rate Limiting Hint
 * Provide different rate limits for bots
 */
export function APIRequestComponent() {
  const { isBot, isSEOTool, isSearchEngine } = useBotDetection();

  const getRateLimit = () => {
    if (isSearchEngine) return 100; // High limit for search engines
    if (isSEOTool) return 50; // Medium for SEO tools
    if (isBot) return 10; // Low for other bots
    return 1000; // High for users
  };

  useEffect(() => {
    const rateLimit = getRateLimit();

    // Set rate limit header hint for API requests
    fetch('/api/data', {
      headers: {
        'X-Rate-Limit-Hint': rateLimit.toString()
      }
    });
  }, []);

  return <div>API Request Component</div>;
}

/**
 * Example 9: SEO Tool Optimization
 * Provide extra details for SEO analysis tools
 */
export function SEOToolFriendlyPage() {
  const { isSEOTool, botName } = useBotDetection();

  useSeo({
    title: 'SEO-Optimized Page',
    description: 'Page optimized for SEO tools and crawlers'
  });

  return (
    <div>
      <h1>SEO-Optimized Content</h1>

      {/* Regular content */}
      <MainContent />

      {/* Extra metadata for SEO tools */}
      {isSEOTool && (
        <div style={{ display: 'none' }} data-seo-meta="true">
          <p>Tool detected: {botName}</p>
          <p>Page type: Article</p>
          <p>Word count: 1250</p>
          <p>Reading time: 5 minutes</p>
          <p>Target keywords: SEO, optimization, tools</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 10: Complete Bot Strategy
 * Comprehensive bot handling in a real app
 */
export function CompleteBotStrategy() {
  const {
    isBot,
    botInfo,
    isSearchEngine,
    isSocialMedia,
    isAIBot,
    isSEOTool,
    shouldRenderClientSide,
    getAnalyticsCategory,
    getBotSuspicionScore
  } = useBotDetection();

  useEffect(() => {
    // 1. Security check
    const suspicionScore = getBotSuspicionScore();
    if (suspicionScore > 80) {
      console.warn('High bot suspicion', { score: suspicionScore, botInfo });
    }

    // 2. Analytics tracking
    const category = getAnalyticsCategory();
    analytics.track('page_view', {
      visitor_type: category,
      is_bot: isBot,
      bot_details: isBot ? botInfo : null
    });

    // 3. Log bot visits
    if (isBot) {
      console.log('Bot visit:', {
        name: botInfo.name,
        type: botInfo.type,
        purpose: botInfo.purpose
      });
    }
  }, []);

  // Basic SEO (always applied)
  useSeo({
    title: 'Complete Bot Strategy Example',
    description: 'Demonstrating comprehensive bot handling'
  });

  // 4. Block AI scrapers
  if (isAIBot) {
    return <AIScraperBlocked botName={botInfo.name} />;
  }

  // 5. Optimized content for search engines
  if (isSearchEngine) {
    return <SEOOptimizedView />;
  }

  // 6. Rich preview for social media
  if (isSocialMedia) {
    return <SocialPreviewView />;
  }

  // 7. Extra details for SEO tools
  if (isSEOTool) {
    return <SEOToolView />;
  }

  // 8. Full experience for real users
  return (
    <div>
      <FullUserExperience />
      {shouldRenderClientSide && <ClientSideFeatures />}
      <SecurityMonitor />
    </div>
  );
}

// Placeholder components
function ComplexInteractiveFeatures() {
  return <div>Complex features...</div>;
}
function RichAnimations() {
  return <div>Animations...</div>;
}
function VideoPlayer() {
  return <div>Video player...</div>;
}
function ProductGallery({ images }) {
  return <div>Gallery...</div>;
}
function ProductDetails({ product }) {
  return <div>Details...</div>;
}
function ProductReviews() {
  return <div>Reviews...</div>;
}
function RelatedProducts() {
  return <div>Related...</div>;
}
function LiveChat() {
  return <div>Chat...</div>;
}
function StaticContent() {
  return <div>Static content</div>;
}
function InteractiveChart() {
  return <div>Chart...</div>;
}
function RealtimeChat() {
  return <div>Chat...</div>;
}
function AnimatedComponents() {
  return <div>Animations...</div>;
}
function ControlVersion() {
  return <div>Control</div>;
}
function VariantA() {
  return <div>Variant A</div>;
}
function VariantB() {
  return <div>Variant B</div>;
}
function MainContent() {
  return <div>Main content</div>;
}
function AIScraperBlocked({ botName }) {
  return <div>Blocked: {botName}</div>;
}
function SEOOptimizedView() {
  return <div>SEO view</div>;
}
function SocialPreviewView() {
  return <div>Social preview</div>;
}
function SEOToolView() {
  return <div>SEO tool view</div>;
}
function FullUserExperience() {
  return <div>Full experience</div>;
}
function ClientSideFeatures() {
  return <div>Client-side features</div>;
}

export default {
  BotAwareContent,
  ProductPage,
  AnalyticsPage,
  ProtectedContent,
  SecurityMonitor,
  SmartFeatureLoader,
  ABTestPage,
  APIRequestComponent,
  SEOToolFriendlyPage,
  CompleteBotStrategy
};
