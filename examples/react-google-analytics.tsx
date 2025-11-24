/**
 * React Google Analytics Integration Examples
 *
 * This file demonstrates how to use the Google Analytics integration
 * in React applications with the ReactSPAAdapter.
 */

import React, { useEffect, useState } from 'react';
import {
  useGoogleAnalytics,
  usePageViewTracking,
  useEventTracking,
  useTransactionTracking,
  useUserTracking,
  useSEOTracking
} from '../src/adapters/ReactSPAAdapter';

// ============================================================================
// Example 1: Basic Setup with Auto Page View Tracking
// ============================================================================

export function App() {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true,
    anonymizeIp: true,
    debug: process.env.NODE_ENV === 'development'
  });

  // In a real app with React Router:
  // const location = useLocation();
  // usePageViewTracking(analytics, location.pathname);

  return (
    <div>
      <h1>My App with Google Analytics</h1>
    </div>
  );
}

// ============================================================================
// Example 2: E-commerce Product Page
// ============================================================================

export function ProductPage({ product }: any) {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  const trackEvent = useEventTracking(analytics);
  const trackTransaction = useTransactionTracking(analytics);

  // Track product view on mount
  useEffect(() => {
    if (analytics && product) {
      trackEvent('view_item', {
        category: 'E-commerce',
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: 1
        }]
      });
    }
  }, [product?.id]);

  const handleAddToCart = () => {
    trackEvent('add_to_cart', {
      category: 'E-commerce',
      value: product.price,
      currency: 'USD',
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        quantity: 1
      }]
    });

    console.log('Added to cart');
  };

  const handlePurchase = () => {
    trackTransaction({
      transaction_id: `ORDER-${Date.now()}`,
      value: product.price,
      currency: 'USD',
      tax: product.price * 0.08,
      shipping: 9.99,
      items: [{
        item_id: product.id,
        item_name: product.name,
        item_category: product.category,
        price: product.price,
        quantity: 1
      }]
    });

    console.log('Purchase complete');
  };

  return (
    <div className="product-page">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p className="price">${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handlePurchase}>Buy Now</button>
    </div>
  );
}

// ============================================================================
// Example 3: SaaS Dashboard with User Tracking
// ============================================================================

export function Dashboard({ currentUser }: any) {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true,
    enhancedMeasurement: {
      scrollTracking: true,
      outboundLinks: true,
      fileDownloads: true,
      siteSearch: false,
      videoEngagement: false
    }
  });

  const setUser = useUserTracking(analytics);
  const trackEvent = useEventTracking(analytics);

  // Set user properties when user logs in
  useEffect(() => {
    if (currentUser && analytics) {
      setUser({
        user_id: currentUser.id,
        user_type: currentUser.plan,
        subscription_plan: currentUser.subscription,
        lifetime_value: currentUser.totalSpent
      });
    }
  }, [currentUser?.id]);

  const handleFeatureUse = (featureName: string) => {
    trackEvent('feature_use', {
      category: 'Product',
      label: featureName,
      feature_name: featureName
    });
  };

  const handleUpgrade = () => {
    trackEvent('upgrade_click', {
      category: 'Conversion',
      label: 'Pro Plan',
      current_plan: currentUser.plan
    });
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {currentUser.name}!</h1>
      <button onClick={() => handleFeatureUse('analytics')}>
        View Analytics
      </button>
      <button onClick={() => handleFeatureUse('reports')}>
        Generate Reports
      </button>
      <button onClick={handleUpgrade}>
        Upgrade to Pro
      </button>
    </div>
  );
}

// ============================================================================
// Example 4: Blog with SEO Tracking
// ============================================================================

export function BlogPost({ post }: any) {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  const trackSEO = useSEOTracking(analytics);
  const trackEvent = useEventTracking(analytics);

  useEffect(() => {
    // Track organic search landing
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q');
    const source = params.get('source');

    if (query && analytics) {
      trackSEO({
        organic_source: source || 'unknown',
        search_query: query
      });
    }

    // Track time on page after 30 seconds
    const timer = setTimeout(() => {
      if (analytics) {
        analytics.trackTimeOnPage();
      }
    }, 30000);

    return () => clearTimeout(timer);
  }, [post?.id]);

  const handleShare = (platform: string) => {
    trackEvent('share', {
      category: 'Social',
      label: platform,
      content_type: 'article',
      content_title: post.title,
      share_platform: platform
    });

    console.log(`Sharing to ${platform}`);
  };

  const handleNewsletterSignup = () => {
    trackEvent('newsletter_signup', {
      category: 'Conversion',
      label: 'Article Bottom',
      signup_location: 'article_bottom'
    });
  };

  return (
    <article className="blog-post">
      <h1>{post.title}</h1>
      <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />

      <div className="social-share">
        <button onClick={() => handleShare('twitter')}>Share on Twitter</button>
        <button onClick={() => handleShare('facebook')}>Share on Facebook</button>
        <button onClick={() => handleShare('linkedin')}>Share on LinkedIn</button>
      </div>

      <div className="newsletter">
        <button onClick={handleNewsletterSignup}>Subscribe to Newsletter</button>
      </div>
    </article>
  );
}

// ============================================================================
// Example 5: Form with Conversion Tracking
// ============================================================================

export function ContactForm() {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  const trackEvent = useEventTracking(analytics);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Track form submission
    trackEvent('form_submit', {
      category: 'Conversion',
      label: 'Contact Form',
      form_name: 'contact',
      form_destination: 'sales'
    });

    try {
      // Submit form...
      console.log('Form submitted:', formData);

      // Track successful submission
      trackEvent('form_success', {
        category: 'Conversion',
        label: 'Contact Form',
        form_name: 'contact'
      });
    } catch (error) {
      // Track error
      if (analytics) {
        analytics.trackError(error as Error, false);
      }

      trackEvent('form_error', {
        category: 'Error',
        label: 'Contact Form',
        error_message: (error as Error).message
      });
    }
  };

  const handleFieldFocus = (fieldName: string) => {
    trackEvent('form_field_focus', {
      category: 'Engagement',
      label: fieldName,
      form_name: 'contact',
      field_name: fieldName,
      non_interaction: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Contact Us</h2>

      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        onFocus={() => handleFieldFocus('name')}
      />

      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        onFocus={() => handleFieldFocus('email')}
      />

      <textarea
        placeholder="Message"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        onFocus={() => handleFieldFocus('message')}
      />

      <button type="submit">Send Message</button>
    </form>
  );
}

// ============================================================================
// Example 6: Video Player with Engagement Tracking
// ============================================================================

export function VideoPlayer({ videoUrl, videoTitle }: any) {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  const trackEvent = useEventTracking(analytics);
  const [tracked, setTracked] = useState({
    started: false,
    '25': false,
    '50': false,
    '75': false,
    '90': false,
    completed: false
  });

  const handlePlay = () => {
    if (!tracked.started && analytics) {
      trackEvent('video_start', {
        category: 'Video',
        label: videoTitle,
        video_title: videoTitle,
        video_url: videoUrl
      });
      setTracked({ ...tracked, started: true });
    }
  };

  const handleProgress = (percent: number) => {
    const key = percent.toString() as keyof typeof tracked;
    if (!tracked[key] && analytics) {
      trackEvent('video_progress', {
        category: 'Video',
        label: videoTitle,
        value: percent,
        video_percent: percent,
        video_title: videoTitle
      });
      setTracked({ ...tracked, [key]: true });
    }
  };

  const handleComplete = () => {
    if (!tracked.completed && analytics) {
      trackEvent('video_complete', {
        category: 'Video',
        label: videoTitle,
        video_title: videoTitle
      });
      setTracked({ ...tracked, completed: true });
    }
  };

  return (
    <div className="video-player">
      <h3>{videoTitle}</h3>
      <video
        src={videoUrl}
        controls
        onPlay={handlePlay}
        onTimeUpdate={(e) => {
          const video = e.currentTarget;
          const percent = (video.currentTime / video.duration) * 100;
          if (percent >= 25 && percent < 50) handleProgress(25);
          if (percent >= 50 && percent < 75) handleProgress(50);
          if (percent >= 75 && percent < 90) handleProgress(75);
          if (percent >= 90) handleProgress(90);
        }}
        onEnded={handleComplete}
      />
    </div>
  );
}

// ============================================================================
// Example 7: Error Boundary with Error Tracking
// ============================================================================

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  private analytics: any;

  constructor(props: any) {
    super(props);
    this.state = { hasError: false };

    // Note: In real app, get analytics from context
    // this.analytics = useGoogleAnalytics({ measurementId: 'G-XXX' });
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Track error
    if (this.analytics) {
      this.analytics.trackError(error, true);
      this.analytics.event('react_error', {
        category: 'Error',
        label: error.message,
        error_message: error.message,
        error_stack: error.stack,
        component_stack: errorInfo.componentStack
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// ============================================================================
// Example 8: A/B Testing Component
// ============================================================================

export function ABTestComponent() {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true,
    customDimensions: {
      dimension1: 'experiment_variant'
    }
  });

  const trackEvent = useEventTracking(analytics);

  const [variant] = useState(() => Math.random() < 0.5 ? 'A' : 'B');

  useEffect(() => {
    // Track variant assignment
    if (analytics) {
      trackEvent('experiment_view', {
        category: 'A/B Test',
        label: 'Homepage CTA Test',
        experiment_variant: variant
      });
    }
  }, []);

  const handleCTAClick = () => {
    trackEvent('conversion', {
      category: 'A/B Test',
      label: 'CTA Click',
      experiment_variant: variant
    });

    console.log('CTA clicked - Variant:', variant);
  };

  return (
    <div className="ab-test">
      {variant === 'A' ? (
        <button onClick={handleCTAClick} className="cta-a">
          Get Started Now
        </button>
      ) : (
        <button onClick={handleCTAClick} className="cta-b">
          Start Your Free Trial
        </button>
      )}
    </div>
  );
}

// ============================================================================
// Example 9: Search Component with Search Tracking
// ============================================================================

export function SearchComponent() {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true
  });

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    // Perform search...
    interface SearchResult {
      id: string | number;
      title: string;
    }
    const searchResults: SearchResult[] = []; // Your search logic

    setResults(searchResults);

    // Track search
    if (analytics) {
      analytics.trackSearch(query, searchResults.length);
    }
  };

  const handleResultClick = (result: any, position: number) => {
    if (analytics) {
      analytics.event('search_result_click', {
        category: 'Site Search',
        label: result.title,
        search_term: query,
        result_position: position,
        result_id: result.id
      });
    }
  };

  return (
    <div className="search">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="results">
        {results.map((result, index) => (
          <div
            key={result.id}
            onClick={() => handleResultClick(result, index + 1)}
          >
            {result.title}
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Example 10: Download Tracker
// ============================================================================

export function DownloadComponent() {
  const analytics = useGoogleAnalytics({
    measurementId: 'G-XXXXXXXXXX',
    filterBots: true,
    enhancedMeasurement: {
      scrollTracking: false,
      outboundLinks: false,
      siteSearch: false,
      videoEngagement: false,
      fileDownloads: true  // Enable automatic file download tracking
    }
  });

  // Manual download tracking for custom scenarios
  const handleManualDownload = (fileName: string, fileUrl: string) => {
    if (analytics) {
      analytics.trackDownload(fileName, fileUrl);
    }

    // Trigger download
    window.location.href = fileUrl;
  };

  return (
    <div className="downloads">
      <h2>Resources</h2>

      {/* Automatic tracking (via enhancedMeasurement) */}
      <a href="/files/whitepaper.pdf" download>
        Download Whitepaper (Auto-tracked)
      </a>

      {/* Manual tracking */}
      <button
        onClick={() =>
          handleManualDownload('product-guide.pdf', '/files/product-guide.pdf')
        }
      >
        Download Product Guide (Manual tracking)
      </button>
    </div>
  );
}

export default {
  App,
  ProductPage,
  Dashboard,
  BlogPost,
  ContactForm,
  VideoPlayer,
  ErrorBoundary,
  ABTestComponent,
  SearchComponent,
  DownloadComponent
};
