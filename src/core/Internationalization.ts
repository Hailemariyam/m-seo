// src/core/Internationalization.ts

/**
 * Internationalization (i18n) Manager
 * 
 * Advanced internationalization features for SEO:
 * - Multi-language content management
 * - Hreflang tag generation
 * - Locale detection and routing
 * - Translation management
 * - RTL support
 * - Currency and number formatting
 * - Date/time localization
 * - Pluralization rules
 * - Language fallbacks
 * - SEO metadata per locale
 * 
 * @example
 * ```typescript
 * const i18n = new Internationalization({
 *   defaultLocale: 'en',
 *   supportedLocales: ['en', 'es', 'fr', 'de'],
 *   fallbackLocale: 'en'
 * });
 * 
 * const translated = i18n.translate('welcome.message', { name: 'John' });
 * const hreflangTags = i18n.generateHreflangTags('/products');
 * ```
 */

export interface I18nConfig {
  defaultLocale: string;
  supportedLocales: string[];
  fallbackLocale?: string;
  loadPath?: string;
  detectLocale?: boolean;
  cookieName?: string;
  localStorageKey?: string;
  urlStrategy?: 'path' | 'subdomain' | 'domain' | 'query';
  rtlLocales?: string[];
  dateFormats?: Record<string, Intl.DateTimeFormatOptions>;
  numberFormats?: Record<string, Intl.NumberFormatOptions>;
}

export interface LocaleData {
  code: string;
  name: string;
  nativeName: string;
  direction: 'ltr' | 'rtl';
  currency?: string;
  dateFormat?: string;
  timeFormat?: string;
}

export interface Translation {
  [key: string]: string | Translation;
}

export interface Translations {
  [locale: string]: Translation;
}

export interface HreflangTag {
  hreflang: string;
  href: string;
}

export interface LocalizedMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export interface PluralRule {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

/**
 * Internationalization Manager Class
 */
export class Internationalization {
  private config: Required<I18nConfig>;
  private currentLocale: string;
  private translations: Translations = {};
  private localeData: Map<string, LocaleData> = new Map();

  constructor(config: I18nConfig) {
    this.config = {
      fallbackLocale: config.defaultLocale,
      loadPath: '/locales/{locale}.json',
      detectLocale: true,
      cookieName: 'locale',
      localStorageKey: 'locale',
      urlStrategy: 'path',
      rtlLocales: ['ar', 'he', 'fa', 'ur'],
      dateFormats: {},
      numberFormats: {},
      ...config
    };

    this.currentLocale = this.config.defaultLocale;
    this.initializeLocaleData();
  }

  /**
   * Initialize locale data for all supported locales
   */
  private initializeLocaleData(): void {
    const localeNames: Record<string, { name: string; nativeName: string; currency?: string }> = {
      'en': { name: 'English', nativeName: 'English', currency: 'USD' },
      'en-US': { name: 'English (United States)', nativeName: 'English (United States)', currency: 'USD' },
      'en-GB': { name: 'English (United Kingdom)', nativeName: 'English (United Kingdom)', currency: 'GBP' },
      'es': { name: 'Spanish', nativeName: 'Español', currency: 'EUR' },
      'es-ES': { name: 'Spanish (Spain)', nativeName: 'Español (España)', currency: 'EUR' },
      'es-MX': { name: 'Spanish (Mexico)', nativeName: 'Español (México)', currency: 'MXN' },
      'fr': { name: 'French', nativeName: 'Français', currency: 'EUR' },
      'fr-FR': { name: 'French (France)', nativeName: 'Français (France)', currency: 'EUR' },
      'de': { name: 'German', nativeName: 'Deutsch', currency: 'EUR' },
      'de-DE': { name: 'German (Germany)', nativeName: 'Deutsch (Deutschland)', currency: 'EUR' },
      'it': { name: 'Italian', nativeName: 'Italiano', currency: 'EUR' },
      'pt': { name: 'Portuguese', nativeName: 'Português', currency: 'EUR' },
      'pt-BR': { name: 'Portuguese (Brazil)', nativeName: 'Português (Brasil)', currency: 'BRL' },
      'ja': { name: 'Japanese', nativeName: '日本語', currency: 'JPY' },
      'zh': { name: 'Chinese', nativeName: '中文', currency: 'CNY' },
      'zh-CN': { name: 'Chinese (Simplified)', nativeName: '简体中文', currency: 'CNY' },
      'zh-TW': { name: 'Chinese (Traditional)', nativeName: '繁體中文', currency: 'TWD' },
      'ko': { name: 'Korean', nativeName: '한국어', currency: 'KRW' },
      'ar': { name: 'Arabic', nativeName: 'العربية', currency: 'SAR' },
      'he': { name: 'Hebrew', nativeName: 'עברית', currency: 'ILS' },
      'ru': { name: 'Russian', nativeName: 'Русский', currency: 'RUB' },
      'pl': { name: 'Polish', nativeName: 'Polski', currency: 'PLN' },
      'tr': { name: 'Turkish', nativeName: 'Türkçe', currency: 'TRY' },
      'nl': { name: 'Dutch', nativeName: 'Nederlands', currency: 'EUR' },
      'sv': { name: 'Swedish', nativeName: 'Svenska', currency: 'SEK' },
      'da': { name: 'Danish', nativeName: 'Dansk', currency: 'DKK' },
      'no': { name: 'Norwegian', nativeName: 'Norsk', currency: 'NOK' },
      'fi': { name: 'Finnish', nativeName: 'Suomi', currency: 'EUR' },
      'cs': { name: 'Czech', nativeName: 'Čeština', currency: 'CZK' },
      'hu': { name: 'Hungarian', nativeName: 'Magyar', currency: 'HUF' },
      'ro': { name: 'Romanian', nativeName: 'Română', currency: 'RON' },
      'th': { name: 'Thai', nativeName: 'ไทย', currency: 'THB' },
      'vi': { name: 'Vietnamese', nativeName: 'Tiếng Việt', currency: 'VND' },
      'id': { name: 'Indonesian', nativeName: 'Bahasa Indonesia', currency: 'IDR' },
      'hi': { name: 'Hindi', nativeName: 'हिन्दी', currency: 'INR' }
    };

    this.config.supportedLocales.forEach(locale => {
      const localeInfo = localeNames[locale] || {
        name: locale,
        nativeName: locale,
        currency: 'USD'
      };

      this.localeData.set(locale, {
        code: locale,
        name: localeInfo.name,
        nativeName: localeInfo.nativeName,
        direction: this.config.rtlLocales.includes(locale) ? 'rtl' : 'ltr',
        currency: localeInfo.currency,
        dateFormat: this.getDefaultDateFormat(locale),
        timeFormat: this.getDefaultTimeFormat(locale)
      });
    });
  }

  /**
   * Get default date format for locale
   */
  private getDefaultDateFormat(locale: string): string {
    const formats: Record<string, string> = {
      'en': 'MM/DD/YYYY',
      'en-US': 'MM/DD/YYYY',
      'en-GB': 'DD/MM/YYYY',
      'es': 'DD/MM/YYYY',
      'fr': 'DD/MM/YYYY',
      'de': 'DD.MM.YYYY',
      'ja': 'YYYY/MM/DD',
      'zh': 'YYYY-MM-DD',
      'ko': 'YYYY.MM.DD'
    };
    return formats[locale] || 'DD/MM/YYYY';
  }

  /**
   * Get default time format for locale
   */
  private getDefaultTimeFormat(locale: string): string {
    const formats: Record<string, string> = {
      'en': '12h',
      'en-US': '12h',
      'en-GB': '24h',
      'es': '24h',
      'fr': '24h',
      'de': '24h',
      'ja': '24h',
      'zh': '24h',
      'ko': '12h'
    };
    return formats[locale] || '24h';
  }

  /**
   * Load translations for a locale
   */
  async loadTranslations(locale: string, translations: Translation): Promise<void> {
    this.translations[locale] = translations;
  }

  /**
   * Set current locale
   */
  setLocale(locale: string): void {
    if (!this.config.supportedLocales.includes(locale)) {
      console.warn(`Locale ${locale} is not supported. Using fallback.`);
      locale = this.config.fallbackLocale;
    }

    this.currentLocale = locale;

    // Persist to storage if in browser
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.config.localStorageKey, locale);
      document.cookie = `${this.config.cookieName}=${locale}; path=/; max-age=31536000`;
      
      // Update HTML lang attribute
      document.documentElement.lang = locale;
      
      // Update dir attribute for RTL
      const direction = this.getDirection(locale);
      document.documentElement.dir = direction;
    }
  }

  /**
   * Get current locale
   */
  getLocale(): string {
    return this.currentLocale;
  }

  /**
   * Detect locale from browser/URL/storage
   */
  detectLocale(): string {
    if (!this.config.detectLocale) {
      return this.config.defaultLocale;
    }

    // 1. Check URL
    const urlLocale = this.detectLocaleFromUrl();
    if (urlLocale) return urlLocale;

    // 2. Check localStorage
    if (typeof window !== 'undefined') {
      const storageLocale = localStorage.getItem(this.config.localStorageKey);
      if (storageLocale && this.config.supportedLocales.includes(storageLocale)) {
        return storageLocale;
      }

      // 3. Check cookie
      const cookieLocale = this.getCookieLocale();
      if (cookieLocale) return cookieLocale;

      // 4. Check browser language
      const parts = navigator.language.split('-');
      const browserLocale = parts[0];
      if (browserLocale && this.config.supportedLocales.includes(browserLocale)) {
        return browserLocale;
      }
    }

    return this.config.defaultLocale;
  }

  /**
   * Detect locale from URL
   */
  private detectLocaleFromUrl(): string | null {
    if (typeof window === 'undefined') return null;

    const { pathname, hostname, search } = window.location;

    switch (this.config.urlStrategy) {
      case 'path':
        // Example: /es/products
        const pathParts = pathname.split('/').filter(Boolean);
        const locale = pathParts[0];
        return locale && this.config.supportedLocales.includes(locale) ? locale : null;

      case 'subdomain':
        // Example: es.example.com
        const hostParts = hostname.split('.');
        const subdomain = hostParts[0];
        return subdomain && this.config.supportedLocales.includes(subdomain) ? subdomain : null;

      case 'query':
        // Example: ?lang=es
        const params = new URLSearchParams(search);
        const queryLocale = params.get('lang') || params.get('locale');
        return queryLocale && this.config.supportedLocales.includes(queryLocale) ? queryLocale : null;

      default:
        return null;
    }
  }

  /**
   * Get locale from cookie
   */
  private getCookieLocale(): string | null {
    if (typeof document === 'undefined') return null;
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const parts = cookie.trim().split('=');
      const name = parts[0];
      const value = parts[1];
      if (name === this.config.cookieName && value) {
        return this.config.supportedLocales.includes(value) ? value : null;
      }
    }
    return null;
    return null;
  }

  /**
   * Translate key with optional interpolation
   */
  translate(key: string, params?: Record<string, any>, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const translation = this.getTranslation(key, targetLocale);

    if (!translation) {
      console.warn(`Translation missing for key: ${key} in locale: ${targetLocale}`);
      return key;
    }

    // Interpolate parameters
    if (params) {
      return this.interpolate(translation, params);
    }

    return translation;
  }

  /**
   * Short alias for translate
   */
  t(key: string, params?: Record<string, any>, locale?: string): string {
    return this.translate(key, params, locale);
  }

  /**
   * Get translation from nested key
   */
  private getTranslation(key: string, locale: string): string | null {
    const keys = key.split('.');
    let current: any = this.translations[locale];

    if (!current && locale !== this.config.fallbackLocale) {
      // Try fallback locale
      current = this.translations[this.config.fallbackLocale];
    }

    if (!current) return null;

    for (const k of keys) {
      current = current[k];
      if (current === undefined) return null;
    }

    return typeof current === 'string' ? current : null;
  }

  /**
   * Interpolate parameters into translation
   */
  private interpolate(text: string, params: Record<string, any>): string {
    let result = text;

    Object.entries(params).forEach(([key, value]) => {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    });

    return result;
  }

  /**
   * Pluralize translation based on count
   */
  pluralize(key: string, count: number, params?: Record<string, any>): string {
    const pluralKey = this.getPluralKey(count);
    const fullKey = `${key}.${pluralKey}`;
    
    const translation = this.getTranslation(fullKey, this.currentLocale);
    
    if (translation) {
      return this.interpolate(translation, { count, ...params });
    }

    // Fallback to 'other'
    return this.translate(`${key}.other`, { count, ...params });
  }

  /**
   * Get plural key based on count and locale
   */
  private getPluralKey(count: number): string {
    // Simplified pluralization rules
    // In production, use Intl.PluralRules or a library like i18next
    if (count === 0) return 'zero';
    if (count === 1) return 'one';
    if (count === 2) return 'two';
    return 'other';
  }

  /**
   * Format date according to locale
   */
  formatDate(date: Date, options?: Intl.DateTimeFormatOptions, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const formatOptions = options || this.config.dateFormats[targetLocale] || {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Intl.DateTimeFormat(targetLocale, formatOptions).format(date);
  }

  /**
   * Format number according to locale
   */
  formatNumber(number: number, options?: Intl.NumberFormatOptions, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const formatOptions = options || this.config.numberFormats[targetLocale] || {};

    return new Intl.NumberFormat(targetLocale, formatOptions).format(number);
  }

  /**
   * Format currency according to locale
   */
  formatCurrency(amount: number, currency?: string, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const localeData = this.localeData.get(targetLocale);
    const currencyCode = currency || localeData?.currency || 'USD';

    return new Intl.NumberFormat(targetLocale, {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  }

  /**
   * Format relative time (e.g., "3 days ago")
   */
  formatRelativeTime(date: Date, locale?: string): string {
    const targetLocale = locale || this.currentLocale;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    const rtf = new Intl.RelativeTimeFormat(targetLocale, { numeric: 'auto' });

    if (years > 0) return rtf.format(-years, 'year');
    if (months > 0) return rtf.format(-months, 'month');
    if (days > 0) return rtf.format(-days, 'day');
    if (hours > 0) return rtf.format(-hours, 'hour');
    if (minutes > 0) return rtf.format(-minutes, 'minute');
    return rtf.format(-seconds, 'second');
  }

  /**
   * Generate hreflang tags for SEO
   */
  generateHreflangTags(
    path: string,
    baseUrl: string,
    options?: { includeXDefault?: boolean; xDefaultLocale?: string }
  ): HreflangTag[] {
    const tags: HreflangTag[] = [];

    this.config.supportedLocales.forEach(locale => {
      const href = this.getLocalizedUrl(path, locale, baseUrl);
      tags.push({ hreflang: locale, href });
    });

    // Add x-default
    if (options?.includeXDefault) {
      const defaultLocale = options.xDefaultLocale || this.config.defaultLocale;
      const href = this.getLocalizedUrl(path, defaultLocale, baseUrl);
      tags.push({ hreflang: 'x-default', href });
    }

    return tags;
  }

  /**
   * Get localized URL
   */
  getLocalizedUrl(path: string, locale: string, baseUrl: string): string {
    // Remove trailing slash from baseUrl
    const cleanBaseUrl = baseUrl.replace(/\/$/, '');
    
    switch (this.config.urlStrategy) {
      case 'path':
        // Only add locale prefix if not default locale
        if (locale === this.config.defaultLocale) {
          return `${cleanBaseUrl}${path}`;
        }
        return `${cleanBaseUrl}/${locale}${path}`;

      case 'subdomain':
        const url = new URL(cleanBaseUrl);
        if (locale !== this.config.defaultLocale) {
          url.hostname = `${locale}.${url.hostname}`;
        }
        return `${url.origin}${path}`;

      case 'query':
        return `${cleanBaseUrl}${path}?lang=${locale}`;

      default:
        return `${cleanBaseUrl}${path}`;
    }
  }

  /**
   * Get text direction for locale
   */
  getDirection(locale?: string): 'ltr' | 'rtl' {
    const targetLocale = locale || this.currentLocale;
    const localeData = this.localeData.get(targetLocale);
    return localeData?.direction || 'ltr';
  }

  /**
   * Check if locale is RTL
   */
  isRTL(locale?: string): boolean {
    return this.getDirection(locale) === 'rtl';
  }

  /**
   * Get locale data
   */
  getLocaleData(locale?: string): LocaleData | undefined {
    const targetLocale = locale || this.currentLocale;
    return this.localeData.get(targetLocale);
  }

  /**
   * Get all supported locales
   */
  getSupportedLocales(): string[] {
    return this.config.supportedLocales;
  }

  /**
   * Get all locale data
   */
  getAllLocaleData(): LocaleData[] {
    return Array.from(this.localeData.values());
  }

  /**
   * Check if locale is supported
   */
  isLocaleSupported(locale: string): boolean {
    return this.config.supportedLocales.includes(locale);
  }

  getLocalizedMetadata(
    metadata: Record<string, LocalizedMetadata>,
    locale?: string
  ): LocalizedMetadata {
    const targetLocale = locale || this.currentLocale;
    const localeMetadata = metadata[targetLocale];
    const fallbackMetadata = metadata[this.config.defaultLocale];
    
    if (localeMetadata) return localeMetadata;
    if (fallbackMetadata) return fallbackMetadata;
    
    // Return empty metadata as last resort
    return {
      title: '',
      description: ''
    };
  }

  /**
   * Generate locale switcher data
   */
  getLocaleSwitcherData(currentPath: string, baseUrl: string): Array<{
    code: string;
    name: string;
    nativeName: string;
    url: string;
    active: boolean;
  }> {
    return this.config.supportedLocales.map(locale => {
      const localeData = this.localeData.get(locale);
      return {
        code: locale,
        name: localeData?.name || locale,
        nativeName: localeData?.nativeName || locale,
        url: this.getLocalizedUrl(currentPath, locale, baseUrl),
        active: locale === this.currentLocale
      };
    });
  }

  /**
   * Get browser locale preference
   */
  getBrowserLocale(): string {
    if (typeof navigator === 'undefined') {
      return this.config.defaultLocale;
    }

    const browserLang = navigator.language || this.config.defaultLocale;
    
    // Try exact match first
    if (this.config.supportedLocales.includes(browserLang)) {
      return browserLang;
    }

    // Try language without region
    const langParts = browserLang.split('-');
    const lang = langParts[0];
    if (lang && this.config.supportedLocales.includes(lang)) {
      return lang;
    }

    return this.config.defaultLocale;
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<I18nConfig>): void {
    this.config = { ...this.config, ...config };
  }
}

/**
 * Helper function to create i18n instance
 */
export function createI18n(config: I18nConfig): Internationalization {
  return new Internationalization(config);
}

/**
 * Default locale codes
 */
export const COMMON_LOCALES = {
  ENGLISH: 'en',
  ENGLISH_US: 'en-US',
  ENGLISH_GB: 'en-GB',
  SPANISH: 'es',
  SPANISH_ES: 'es-ES',
  SPANISH_MX: 'es-MX',
  FRENCH: 'fr',
  GERMAN: 'de',
  ITALIAN: 'it',
  PORTUGUESE: 'pt',
  PORTUGUESE_BR: 'pt-BR',
  JAPANESE: 'ja',
  CHINESE: 'zh',
  CHINESE_CN: 'zh-CN',
  CHINESE_TW: 'zh-TW',
  KOREAN: 'ko',
  ARABIC: 'ar',
  HEBREW: 'he',
  RUSSIAN: 'ru',
  POLISH: 'pl',
  TURKISH: 'tr',
  DUTCH: 'nl',
  SWEDISH: 'sv',
  DANISH: 'da',
  NORWEGIAN: 'no',
  FINNISH: 'fi'
} as const;
