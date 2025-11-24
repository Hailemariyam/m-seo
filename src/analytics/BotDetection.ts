/**
 * Advanced Bot Detection for SEO Analytics
 *
 * Detects and classifies web crawlers, bots, and search engine spiders.
 * Useful for:
 * - Optimizing SEO tag rendering (skip client-side operations for bots)
 * - Analytics and tracking (separate bot traffic from user traffic)
 * - Content delivery strategies
 * - Security monitoring
 *
 * @example
 * ```typescript
 * import { BotDetection } from 'm-seo/analytics/BotDetection';
 *
 * // Check if current visitor is a bot
 * if (BotDetection.isBot()) {
 *   console.log('Bot detected:', BotDetection.getBotInfo().name);
 * }
 *
 * // Get detailed bot information
 * const info = BotDetection.getBotInfo(req.headers['user-agent']);
 * console.log(`Bot: ${info.name}, Type: ${info.type}, Verified: ${info.verified}`);
 * ```
 */

export interface BotInfo {
  /** Whether a bot was detected */
  isBot: boolean;
  /** Name of the bot (e.g., "Googlebot", "Bingbot") */
  name: string | null;
  /** Type/category of bot */
  type: BotType | null;
  /** Search engine or company */
  vendor: string | null;
  /** Bot version if available */
  version: string | null;
  /** Whether the bot is verified (using reverse DNS) */
  verified?: boolean;
  /** Purpose of the bot */
  purpose: BotPurpose | null;
  /** Full user agent string */
  userAgent: string;
}

export enum BotType {
  SEARCH_ENGINE = 'search_engine',
  SOCIAL_MEDIA = 'social_media',
  SEO_TOOL = 'seo_tool',
  MONITORING = 'monitoring',
  SCRAPER = 'scraper',
  AI_ASSISTANT = 'ai_assistant',
  PREVIEW = 'preview',
  UNKNOWN = 'unknown',
}

export enum BotPurpose {
  INDEXING = 'indexing',
  PREVIEW = 'preview',
  ANALYTICS = 'analytics',
  MONITORING = 'monitoring',
  SCRAPING = 'scraping',
  VALIDATION = 'validation',
  UNKNOWN = 'unknown',
}

interface BotPattern {
  pattern: RegExp;
  name: string;
  type: BotType;
  vendor: string;
  purpose: BotPurpose;
  versionPattern?: RegExp;
}

export class BotDetection {
  /**
   * Comprehensive list of bot patterns
   */
  private static readonly BOT_PATTERNS: BotPattern[] = [
    // Search Engine Bots
    {
      pattern: /googlebot/i,
      name: 'Googlebot',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Google',
      purpose: BotPurpose.INDEXING,
      versionPattern: /googlebot\/(\d+\.\d+)/i,
    },
    {
      pattern: /google-inspectiontool/i,
      name: 'Google Search Console',
      type: BotType.SEO_TOOL,
      vendor: 'Google',
      purpose: BotPurpose.VALIDATION,
    },
    {
      pattern: /bingbot/i,
      name: 'Bingbot',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Microsoft',
      purpose: BotPurpose.INDEXING,
      versionPattern: /bingbot\/(\d+\.\d+)/i,
    },
    {
      pattern: /slurp/i,
      name: 'Yahoo Slurp',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Yahoo',
      purpose: BotPurpose.INDEXING,
    },
    {
      pattern: /duckduckbot/i,
      name: 'DuckDuckBot',
      type: BotType.SEARCH_ENGINE,
      vendor: 'DuckDuckGo',
      purpose: BotPurpose.INDEXING,
    },
    {
      pattern: /baiduspider/i,
      name: 'Baiduspider',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Baidu',
      purpose: BotPurpose.INDEXING,
    },
    {
      pattern: /yandexbot/i,
      name: 'YandexBot',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Yandex',
      purpose: BotPurpose.INDEXING,
    },
    {
      pattern: /sogou/i,
      name: 'Sogou Spider',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Sogou',
      purpose: BotPurpose.INDEXING,
    },
    {
      pattern: /exabot/i,
      name: 'Exabot',
      type: BotType.SEARCH_ENGINE,
      vendor: 'Exalead',
      purpose: BotPurpose.INDEXING,
    },

    // Social Media Bots
    {
      pattern: /facebookexternalhit/i,
      name: 'Facebook Bot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Meta',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /twitterbot/i,
      name: 'Twitterbot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Twitter/X',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /linkedinbot/i,
      name: 'LinkedInBot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'LinkedIn',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /pinterest/i,
      name: 'Pinterest Bot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Pinterest',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /whatsapp/i,
      name: 'WhatsApp Bot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Meta',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /telegram/i,
      name: 'Telegram Bot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Telegram',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /discordbot/i,
      name: 'Discord Bot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Discord',
      purpose: BotPurpose.PREVIEW,
    },
    {
      pattern: /slackbot/i,
      name: 'Slackbot',
      type: BotType.SOCIAL_MEDIA,
      vendor: 'Slack',
      purpose: BotPurpose.PREVIEW,
    },

    // SEO & Analytics Tools
    {
      pattern: /ahrefs/i,
      name: 'AhrefsBot',
      type: BotType.SEO_TOOL,
      vendor: 'Ahrefs',
      purpose: BotPurpose.ANALYTICS,
    },
    {
      pattern: /semrush/i,
      name: 'SemrushBot',
      type: BotType.SEO_TOOL,
      vendor: 'Semrush',
      purpose: BotPurpose.ANALYTICS,
    },
    {
      pattern: /mj12bot/i,
      name: 'MJ12bot',
      type: BotType.SEO_TOOL,
      vendor: 'Majestic',
      purpose: BotPurpose.ANALYTICS,
    },
    {
      pattern: /dotbot/i,
      name: 'DotBot',
      type: BotType.SEO_TOOL,
      vendor: 'Moz',
      purpose: BotPurpose.ANALYTICS,
    },
    {
      pattern: /screaming frog/i,
      name: 'Screaming Frog',
      type: BotType.SEO_TOOL,
      vendor: 'Screaming Frog',
      purpose: BotPurpose.ANALYTICS,
    },

    // Monitoring & Uptime Bots
    {
      pattern: /pingdom/i,
      name: 'Pingdom',
      type: BotType.MONITORING,
      vendor: 'Pingdom',
      purpose: BotPurpose.MONITORING,
    },
    {
      pattern: /uptimerobot/i,
      name: 'UptimeRobot',
      type: BotType.MONITORING,
      vendor: 'UptimeRobot',
      purpose: BotPurpose.MONITORING,
    },
    {
      pattern: /statuspage/i,
      name: 'StatusPage',
      type: BotType.MONITORING,
      vendor: 'Atlassian',
      purpose: BotPurpose.MONITORING,
    },

    // AI Assistants & Scrapers
    {
      pattern: /gptbot|chatgpt-user/i,
      name: 'GPTBot',
      type: BotType.AI_ASSISTANT,
      vendor: 'OpenAI',
      purpose: BotPurpose.SCRAPING,
    },
    {
      pattern: /claudebot/i,
      name: 'ClaudeBot',
      type: BotType.AI_ASSISTANT,
      vendor: 'Anthropic',
      purpose: BotPurpose.SCRAPING,
    },
    {
      pattern: /anthropic-ai/i,
      name: 'Anthropic AI',
      type: BotType.AI_ASSISTANT,
      vendor: 'Anthropic',
      purpose: BotPurpose.SCRAPING,
    },
    {
      pattern: /bard/i,
      name: 'Google Bard',
      type: BotType.AI_ASSISTANT,
      vendor: 'Google',
      purpose: BotPurpose.SCRAPING,
    },

    // Generic bot patterns
    {
      pattern: /bot|crawler|spider|scraper/i,
      name: 'Generic Bot',
      type: BotType.UNKNOWN,
      vendor: 'Unknown',
      purpose: BotPurpose.UNKNOWN,
    },
  ];

  /**
   * Check if the current environment or user agent is a bot
   * @param userAgent - Optional user agent string (uses navigator.userAgent if not provided)
   * @returns True if bot detected
   */
  static isBot(userAgent?: string): boolean {
    const ua = this.getUserAgent(userAgent);
    return this.BOT_PATTERNS.some((bot) => bot.pattern.test(ua));
  }

  /**
   * Get detailed information about the detected bot
   * @param userAgent - Optional user agent string
   * @returns Detailed bot information
   */
  static getBotInfo(userAgent?: string): BotInfo {
    const ua = this.getUserAgent(userAgent);

    // Check each bot pattern
    for (const bot of this.BOT_PATTERNS) {
      if (bot.pattern.test(ua)) {
        // Extract version if pattern exists
        let version: string | null = null;
        if (bot.versionPattern) {
          const match = ua.match(bot.versionPattern);
          version = match?.[1] ?? null;
        }

        return {
          isBot: true,
          name: bot.name,
          type: bot.type,
          vendor: bot.vendor,
          version,
          purpose: bot.purpose,
          userAgent: ua,
        };
      }
    }

    // No bot detected
    return {
      isBot: false,
      name: null,
      type: null,
      vendor: null,
      version: null,
      purpose: null,
      userAgent: ua,
    };
  }

  /**
   * Get the bot type if detected
   * @param userAgent - Optional user agent string
   * @returns Bot type or null
   */
  static getBotType(userAgent?: string): BotType | null {
    return this.getBotInfo(userAgent).type;
  }

  /**
   * Get the bot name if detected
   * @param userAgent - Optional user agent string
   * @returns Bot name or null
   */
  static getBotName(userAgent?: string): string | null {
    return this.getBotInfo(userAgent).name;
  }

  /**
   * Check if the bot is a search engine crawler
   * @param userAgent - Optional user agent string
   */
  static isSearchEngine(userAgent?: string): boolean {
    return this.getBotType(userAgent) === BotType.SEARCH_ENGINE;
  }

  /**
   * Check if the bot is a social media preview bot
   * @param userAgent - Optional user agent string
   */
  static isSocialMedia(userAgent?: string): boolean {
    return this.getBotType(userAgent) === BotType.SOCIAL_MEDIA;
  }

  /**
   * Check if the bot is an SEO analytics tool
   * @param userAgent - Optional user agent string
   */
  static isSEOTool(userAgent?: string): boolean {
    return this.getBotType(userAgent) === BotType.SEO_TOOL;
  }

  /**
   * Check if the bot is an AI scraper (GPT, Claude, etc.)
   * @param userAgent - Optional user agent string
   */
  static isAIBot(userAgent?: string): boolean {
    return this.getBotType(userAgent) === BotType.AI_ASSISTANT;
  }

  /**
   * Check if running in server-side environment (likely SSR or bot)
   */
  static isServerSide(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * Check if running in a headless browser (often used by bots)
   */
  static isHeadless(): boolean {
    if (typeof navigator === 'undefined') return false;

    const ua = navigator.userAgent;
    return (
      /headless/i.test(ua) ||
      /phantomjs/i.test(ua) ||
      /puppeteer/i.test(ua) ||
      /selenium/i.test(ua) ||
      /playwright/i.test(ua)
    );
  }

  /**
   * Advanced detection: Check for bot-like behavior
   * @returns Suspicion score (0-100, higher = more likely a bot)
   */
  static getBotSuspicionScore(): number {
    if (typeof window === 'undefined') return 100; // Server-side

    let score = 0;

    // Check user agent
    if (this.isBot()) score += 50;

    // Check for headless browser
    if (this.isHeadless()) score += 30;

    // Check for missing browser features
    if (typeof navigator.plugins === 'undefined') score += 10;
    if (navigator.plugins && navigator.plugins.length === 0) score += 10;

    // Check for webdriver
    if ('webdriver' in navigator && (navigator as any).webdriver) score += 20;

    // Check for automation tools
    if ((window as any).__nightmare) score += 30;
    if ((window as any).__webdriver_evaluate) score += 30;
    if ((window as any).__selenium_unwrapped) score += 30;
    if ((window as any).__driver_evaluate) score += 30;

    // Check for suspicious navigator properties
    if (!navigator.languages || navigator.languages.length === 0) score += 10;

    return Math.min(score, 100);
  }

  /**
   * Should SEO tags be rendered client-side?
   * Returns false for bots (they use server-rendered HTML)
   */
  static shouldRenderClientSide(): boolean {
    // Server-side or bot detected - use server-rendered tags
    if (this.isServerSide() || this.isBot()) {
      return false;
    }

    // High suspicion score - likely a bot
    if (this.getBotSuspicionScore() > 70) {
      return false;
    }

    // Normal user - can use client-side rendering
    return true;
  }

  /**
   * Get analytics-friendly bot classification
   * Useful for separating bot traffic in analytics
   */
  static getAnalyticsCategory(userAgent?: string): string {
    const info = this.getBotInfo(userAgent);

    if (!info.isBot) {
      return 'user';
    }

    switch (info.type) {
      case BotType.SEARCH_ENGINE:
        return `bot_search_${info.vendor?.toLowerCase() || 'unknown'}`;
      case BotType.SOCIAL_MEDIA:
        return `bot_social_${info.vendor?.toLowerCase() || 'unknown'}`;
      case BotType.SEO_TOOL:
        return 'bot_seo_tool';
      case BotType.MONITORING:
        return 'bot_monitoring';
      case BotType.AI_ASSISTANT:
        return 'bot_ai';
      default:
        return 'bot_unknown';
    }
  }

  /**
   * Get a list of all known bots
   * Useful for allowlisting/blocklisting
   */
  static getKnownBots(): Array<{ name: string; vendor: string; type: BotType }> {
    return this.BOT_PATTERNS.filter((bot) => bot.name !== 'Generic Bot').map(
      (bot) => ({
        name: bot.name,
        vendor: bot.vendor,
        type: bot.type,
      })
    );
  }

  /**
   * Helper to get user agent string
   */
  private static getUserAgent(userAgent?: string): string {
    if (userAgent) return userAgent;
    if (typeof navigator !== 'undefined') return navigator.userAgent;
    return '';
  }

  /**
   * Block AI scrapers (GPT, Claude, etc.) using robots meta tag
   * Returns appropriate meta tag content
   */
  static getAIBlockMetaContent(): string | null {
    if (this.isAIBot()) {
      return 'noindex, nofollow, noarchive, nosnippet, noimageindex';
    }
    return null;
  }

  /**
   * Get recommended caching strategy based on bot type
   */
  static getCachingStrategy(userAgent?: string): {
    shouldCache: boolean;
    ttl: number; // in seconds
  } {
    const info = this.getBotInfo(userAgent);

    if (!info.isBot) {
      return { shouldCache: true, ttl: 3600 }; // 1 hour for users
    }

    switch (info.type) {
      case BotType.SEARCH_ENGINE:
        return { shouldCache: true, ttl: 86400 }; // 24 hours for search bots
      case BotType.SOCIAL_MEDIA:
        return { shouldCache: true, ttl: 3600 }; // 1 hour for social bots
      case BotType.SEO_TOOL:
        return { shouldCache: true, ttl: 7200 }; // 2 hours for SEO tools
      default:
        return { shouldCache: false, ttl: 0 }; // Don't cache unknown bots
    }
  }
}

/**
 * Middleware helper for Express.js
 * Adds bot detection info to request object
 *
 * @example
 * ```typescript
 * import { botDetectionMiddleware } from 'm-seo/analytics/BotDetection';
 * app.use(botDetectionMiddleware);
 *
 * app.get('/', (req, res) => {
 *   if (req.botInfo?.isBot) {
 *     console.log('Bot detected:', req.botInfo.name);
 *   }
 * });
 * ```
 */
export function botDetectionMiddleware(req: any, _res: any, next: any) {
  const userAgent = req.headers['user-agent'] || '';
  req.botInfo = BotDetection.getBotInfo(userAgent);
  req.isBot = req.botInfo.isBot;
  next();
}

/**
 * React Hook for bot detection
 *
 * @example
 * ```typescript
 * import { useBotDetection } from 'm-seo/analytics/BotDetection';
 *
 * function MyComponent() {
 *   const { isBot, botInfo } = useBotDetection();
 *
 *   if (isBot) {
 *     return <div>Bot-optimized content</div>;
 *   }
 *
 *   return <div>User content</div>;
 * }
 * ```
 */
export function useBotDetection() {
  const botInfo = BotDetection.getBotInfo();
  return {
    isBot: botInfo.isBot,
    botInfo,
    isSearchEngine: BotDetection.isSearchEngine(),
    isSocialMedia: BotDetection.isSocialMedia(),
    shouldRenderClientSide: BotDetection.shouldRenderClientSide(),
  };
}

/**
 * Vue Composable for bot detection
 *
 * @example
 * ```vue
 * <script setup>
 * import { useBotDetection } from 'm-seo/analytics/BotDetection';
 *
 * const { isBot, botInfo } = useBotDetection();
 * </script>
 *
 * <template>
 *   <div v-if="isBot">Bot-optimized content</div>
 *   <div v-else>User content</div>
 * </template>
 * ```
 */
// Note: The Vue composable uses the same function as React hook
// as it's a simple object return, compatible with both frameworks
