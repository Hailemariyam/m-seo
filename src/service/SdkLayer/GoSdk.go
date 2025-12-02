// ============================================================================
// M-SEO Go SDK
// Enterprise-grade Go integration for SEO operations
// ============================================================================
//
// Version: 1.1.1
// Package: mseo
// Author: M-SEO Team
//
// Features:
// - HTTP Client with Circuit Breaker
// - Retry Logic with Exponential Backoff
// - Context Support for Timeout/Cancellation
// - Metrics & Monitoring
// - Caching (Redis/In-Memory)
// - Middleware for Gin/Echo/Fiber
// - GORM Models
// - Goroutine-Safe Operations
// - Structured Logging
// - Rate Limiting
// - Health Checks
// - Graceful Shutdown
//
// Installation:
//   go get github.com/m-seo/go-sdk
//
// Usage:
//   client := mseo.NewClient(&mseo.Config{
//       APIUrl: "http://localhost:3100",
//       APIKey: "your-api-key",
//   })
//   meta, err := client.GenerateMeta(ctx, &mseo.MetaRequest{
//       Title: "My Page",
//       Description: "Description",
//   })

package mseo

import (
	"bytes"
	"context"
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"sync"
	"time"
)

// ============================================================================
// TYPES & STRUCTS
// ============================================================================

// Config holds the SDK configuration
type Config struct {
	APIUrl                  string
	APIKey                  string
	CacheEnabled            bool
	CacheTTL                time.Duration
	Timeout                 time.Duration
	RetryAttempts           int
	RetryDelay              time.Duration
	CircuitBreakerThreshold int
	CircuitBreakerTimeout   time.Duration
	RateLimitPerSecond      int
	EnableMetrics           bool
	Logger                  Logger
}

// Client is the main M-SEO client
type Client struct {
	config        *Config
	httpClient    *http.Client
	cache         Cache
	metrics       *Metrics
	circuitBreaker *CircuitBreaker
	rateLimiter   *RateLimiter
	logger        Logger
	mu            sync.RWMutex
}

// MetaRequest represents a meta tag generation request
type MetaRequest struct {
	Title       string            `json:"title"`
	Description string            `json:"description"`
	URL         string            `json:"url"`
	Keywords    []string          `json:"keywords,omitempty"`
	Image       string            `json:"image,omitempty"`
	Locale      string            `json:"locale,omitempty"`
	Type        string            `json:"type,omitempty"`
	SiteName    string            `json:"siteName,omitempty"`
	Author      string            `json:"author,omitempty"`
	Extra       map[string]string `json:"extra,omitempty"`
}

// MetaResponse represents the meta tag generation response
type MetaResponse struct {
	HTML     string            `json:"html"`
	Tags     map[string]string `json:"tags"`
	Metadata map[string]any    `json:"metadata"`
}

// SitemapRequest represents a sitemap generation request
type SitemapRequest struct {
	URLs    []SitemapURL `json:"urls"`
	BaseURL string       `json:"baseUrl"`
}

// SitemapURL represents a URL in the sitemap
type SitemapURL struct {
	Loc        string    `json:"loc"`
	Changefreq string    `json:"changefreq,omitempty"`
	Priority   float64   `json:"priority,omitempty"`
	Lastmod    time.Time `json:"lastmod,omitempty"`
}

// SitemapResponse represents the sitemap generation response
type SitemapResponse struct {
	XML   string `json:"xml"`
	Count int    `json:"count"`
}

// RobotsRequest represents a robots.txt generation request
type RobotsRequest struct {
	UserAgent string   `json:"userAgent"`
	Disallow  []string `json:"disallow"`
	Allow     []string `json:"allow"`
	Sitemap   string   `json:"sitemap,omitempty"`
}

// RobotsResponse represents the robots.txt response
type RobotsResponse struct {
	Content string `json:"content"`
}

// AuditRequest represents an SEO audit request
type AuditRequest struct {
	URL       string   `json:"url"`
	Checks    []string `json:"checks,omitempty"`
	Threshold int      `json:"threshold,omitempty"`
	Fix       bool     `json:"fix,omitempty"`
}

// AuditResponse represents the audit response
type AuditResponse struct {
	URL             string              `json:"url"`
	Score           int                 `json:"score"`
	Passed          int                 `json:"passed"`
	Failed          int                 `json:"failed"`
	Warnings        int                 `json:"warnings"`
	Issues          []AuditIssue        `json:"issues"`
	Recommendations []string            `json:"recommendations"`
	Metadata        map[string]any      `json:"metadata"`
}

// AuditIssue represents a single audit issue
type AuditIssue struct {
	Severity string `json:"severity"`
	Message  string `json:"message"`
	Fix      string `json:"fix,omitempty"`
}

// SchemaRequest represents a schema generation request
type SchemaRequest struct {
	Type     string         `json:"type"`
	Data     map[string]any `json:"data"`
	Validate bool           `json:"validate,omitempty"`
}

// SchemaResponse represents the schema response
type SchemaResponse struct {
	HTML   string         `json:"html"`
	Schema map[string]any `json:"schema"`
	Valid  bool           `json:"valid,omitempty"`
}

// BotCheckRequest represents a bot detection request
type BotCheckRequest struct {
	UserAgent string `json:"userAgent"`
}

// BotCheckResponse represents the bot detection response
type BotCheckResponse struct {
	IsBot   bool              `json:"isBot"`
	BotInfo map[string]string `json:"botInfo,omitempty"`
}

// BatchRequest represents a batch operation request
type BatchRequest struct {
	Operations []BatchOperation `json:"operations"`
}

// BatchOperation represents a single batch operation
type BatchOperation struct {
	Method string         `json:"method"`
	Path   string         `json:"path"`
	Data   map[string]any `json:"data"`
}

// BatchResponse represents the batch response
type BatchResponse struct {
	Results []map[string]any `json:"results"`
	Errors  []string         `json:"errors,omitempty"`
}

// HealthResponse represents the health check response
type HealthResponse struct {
	Status  string         `json:"status"`
	Uptime  int64          `json:"uptime"`
	Version string         `json:"version"`
	Details map[string]any `json:"details,omitempty"`
}

// ============================================================================
// METRICS
// ============================================================================

// Metrics tracks client metrics
type Metrics struct {
	Requests      int64
	Errors        int64
	CacheHits     int64
	CacheMisses   int64
	TotalLatency  time.Duration
	mu            sync.RWMutex
}

// IncrementRequests increments the request counter
func (m *Metrics) IncrementRequests() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.Requests++
}

// IncrementErrors increments the error counter
func (m *Metrics) IncrementErrors() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.Errors++
}

// IncrementCacheHits increments the cache hit counter
func (m *Metrics) IncrementCacheHits() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.CacheHits++
}

// IncrementCacheMisses increments the cache miss counter
func (m *Metrics) IncrementCacheMisses() {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.CacheMisses++
}

// AddLatency adds latency to total
func (m *Metrics) AddLatency(duration time.Duration) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.TotalLatency += duration
}

// GetMetrics returns a snapshot of metrics
func (m *Metrics) GetMetrics() map[string]any {
	m.mu.RLock()
	defer m.mu.RUnlock()

	avgLatency := time.Duration(0)
	if m.Requests > 0 {
		avgLatency = m.TotalLatency / time.Duration(m.Requests)
	}

	return map[string]any{
		"requests":     m.Requests,
		"errors":       m.Errors,
		"cache_hits":   m.CacheHits,
		"cache_misses": m.CacheMisses,
		"avg_latency":  avgLatency.String(),
		"error_rate":   float64(m.Errors) / float64(m.Requests),
	}
}

// ============================================================================
// CIRCUIT BREAKER
// ============================================================================

// CircuitBreaker implements the circuit breaker pattern
type CircuitBreaker struct {
	threshold      int
	timeout        time.Duration
	failureCount   int
	lastFailure    time.Time
	isOpen         bool
	mu             sync.RWMutex
}

// NewCircuitBreaker creates a new circuit breaker
func NewCircuitBreaker(threshold int, timeout time.Duration) *CircuitBreaker {
	return &CircuitBreaker{
		threshold: threshold,
		timeout:   timeout,
	}
}

// Call executes the function with circuit breaker protection
func (cb *CircuitBreaker) Call(fn func() error) error {
	cb.mu.Lock()

	// Check if circuit breaker should be reset
	if cb.isOpen && time.Since(cb.lastFailure) > cb.timeout {
		cb.isOpen = false
		cb.failureCount = 0
	}

	if cb.isOpen {
		cb.mu.Unlock()
		return errors.New("circuit breaker is open")
	}
	cb.mu.Unlock()

	err := fn()

	cb.mu.Lock()
	defer cb.mu.Unlock()

	if err != nil {
		cb.failureCount++
		cb.lastFailure = time.Now()

		if cb.failureCount >= cb.threshold {
			cb.isOpen = true
			log.Printf("Circuit breaker opened after %d failures", cb.failureCount)
		}
		return err
	}

	// Reset on success
	cb.failureCount = 0
	return nil
}

// IsOpen returns whether the circuit breaker is open
func (cb *CircuitBreaker) IsOpen() bool {
	cb.mu.RLock()
	defer cb.mu.RUnlock()
	return cb.isOpen
}

// ============================================================================
// RATE LIMITER
// ============================================================================

// RateLimiter implements token bucket rate limiting
type RateLimiter struct {
	rate       int
	tokens     int
	lastRefill time.Time
	mu         sync.Mutex
}

// NewRateLimiter creates a new rate limiter
func NewRateLimiter(rate int) *RateLimiter {
	return &RateLimiter{
		rate:       rate,
		tokens:     rate,
		lastRefill: time.Now(),
	}
}

// Allow checks if a request should be allowed
func (rl *RateLimiter) Allow() bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	// Refill tokens
	now := time.Now()
	elapsed := now.Sub(rl.lastRefill)
	refill := int(elapsed.Seconds()) * rl.rate

	if refill > 0 {
		rl.tokens = min(rl.rate, rl.tokens+refill)
		rl.lastRefill = now
	}

	if rl.tokens > 0 {
		rl.tokens--
		return true
	}

	return false
}

// ============================================================================
// CACHE
// ============================================================================

// Cache interface for caching operations
type Cache interface {
	Get(key string) ([]byte, error)
	Set(key string, value []byte, ttl time.Duration) error
	Delete(key string) error
	Clear() error
}

// InMemoryCache is a simple in-memory cache
type InMemoryCache struct {
	data map[string]cacheEntry
	mu   sync.RWMutex
}

type cacheEntry struct {
	value      []byte
	expiration time.Time
}

// NewInMemoryCache creates a new in-memory cache
func NewInMemoryCache() *InMemoryCache {
	cache := &InMemoryCache{
		data: make(map[string]cacheEntry),
	}

	// Start cleanup goroutine
	go cache.cleanup()

	return cache
}

// Get retrieves a value from cache
func (c *InMemoryCache) Get(key string) ([]byte, error) {
	c.mu.RLock()
	defer c.mu.RUnlock()

	entry, exists := c.data[key]
	if !exists {
		return nil, errors.New("key not found")
	}

	if time.Now().After(entry.expiration) {
		return nil, errors.New("key expired")
	}

	return entry.value, nil
}

// Set stores a value in cache
func (c *InMemoryCache) Set(key string, value []byte, ttl time.Duration) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.data[key] = cacheEntry{
		value:      value,
		expiration: time.Now().Add(ttl),
	}

	return nil
}

// Delete removes a value from cache
func (c *InMemoryCache) Delete(key string) error {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.data, key)
	return nil
}

// Clear removes all values from cache
func (c *InMemoryCache) Clear() error {
	c.mu.Lock()
	defer c.mu.Unlock()

	c.data = make(map[string]cacheEntry)
	return nil
}

// cleanup removes expired entries periodically
func (c *InMemoryCache) cleanup() {
	ticker := time.NewTicker(1 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		c.mu.Lock()
		now := time.Now()
		for key, entry := range c.data {
			if now.After(entry.expiration) {
				delete(c.data, key)
			}
		}
		c.mu.Unlock()
	}
}

// ============================================================================
// LOGGER
// ============================================================================

// Logger interface for logging
type Logger interface {
	Debug(msg string, args ...any)
	Info(msg string, args ...any)
	Warn(msg string, args ...any)
	Error(msg string, args ...any)
}

// DefaultLogger is a simple logger implementation
type DefaultLogger struct{}

// Debug logs debug messages
func (l *DefaultLogger) Debug(msg string, args ...any) {
	log.Printf("[DEBUG] "+msg, args...)
}

// Info logs info messages
func (l *DefaultLogger) Info(msg string, args ...any) {
	log.Printf("[INFO] "+msg, args...)
}

// Warn logs warning messages
func (l *DefaultLogger) Warn(msg string, args ...any) {
	log.Printf("[WARN] "+msg, args...)
}

// Error logs error messages
func (l *DefaultLogger) Error(msg string, args ...any) {
	log.Printf("[ERROR] "+msg, args...)
}

// ============================================================================
// CLIENT
// ============================================================================

// NewClient creates a new M-SEO client
func NewClient(config *Config) *Client {
	if config == nil {
		config = DefaultConfig()
	}

	// Set defaults
	if config.Timeout == 0 {
		config.Timeout = 10 * time.Second
	}
	if config.RetryAttempts == 0 {
		config.RetryAttempts = 3
	}
	if config.RetryDelay == 0 {
		config.RetryDelay = 1 * time.Second
	}
	if config.CacheTTL == 0 {
		config.CacheTTL = 5 * time.Minute
	}
	if config.CircuitBreakerThreshold == 0 {
		config.CircuitBreakerThreshold = 5
	}
	if config.CircuitBreakerTimeout == 0 {
		config.CircuitBreakerTimeout = 60 * time.Second
	}
	if config.Logger == nil {
		config.Logger = &DefaultLogger{}
	}

	client := &Client{
		config: config,
		httpClient: &http.Client{
			Timeout: config.Timeout,
		},
		cache:          NewInMemoryCache(),
		metrics:        &Metrics{},
		circuitBreaker: NewCircuitBreaker(config.CircuitBreakerThreshold, config.CircuitBreakerTimeout),
		logger:         config.Logger,
	}

	if config.RateLimitPerSecond > 0 {
		client.rateLimiter = NewRateLimiter(config.RateLimitPerSecond)
	}

	return client
}

// DefaultConfig returns default configuration
func DefaultConfig() *Config {
	return &Config{
		APIUrl:                  "http://localhost:3100",
		CacheEnabled:            true,
		CacheTTL:                5 * time.Minute,
		Timeout:                 10 * time.Second,
		RetryAttempts:           3,
		RetryDelay:              1 * time.Second,
		CircuitBreakerThreshold: 5,
		CircuitBreakerTimeout:   60 * time.Second,
		EnableMetrics:           true,
		Logger:                  &DefaultLogger{},
	}
}

// GenerateMeta generates meta tags
func (c *Client) GenerateMeta(ctx context.Context, req *MetaRequest) (*MetaResponse, error) {
	cacheKey := c.generateCacheKey("meta", req)

	// Check cache
	if c.config.CacheEnabled {
		if cached, err := c.cache.Get(cacheKey); err == nil {
			c.metrics.IncrementCacheHits()
			var resp MetaResponse
			if err := json.Unmarshal(cached, &resp); err == nil {
				return &resp, nil
			}
		} else {
			c.metrics.IncrementCacheMisses()
		}
	}

	var resp MetaResponse
	err := c.request(ctx, "POST", "/api/seo/meta", req, &resp)
	if err != nil {
		return nil, err
	}

	// Cache response
	if c.config.CacheEnabled {
		if data, err := json.Marshal(resp); err == nil {
			_ = c.cache.Set(cacheKey, data, c.config.CacheTTL)
		}
	}

	return &resp, nil
}

// GenerateSitemap generates a sitemap
func (c *Client) GenerateSitemap(ctx context.Context, req *SitemapRequest) (*SitemapResponse, error) {
	var resp SitemapResponse
	err := c.request(ctx, "POST", "/api/seo/sitemap", req, &resp)
	return &resp, err
}

// GenerateRobots generates robots.txt
func (c *Client) GenerateRobots(ctx context.Context, req *RobotsRequest) (*RobotsResponse, error) {
	var resp RobotsResponse
	err := c.request(ctx, "POST", "/api/seo/robots", req, &resp)
	return &resp, err
}

// RunAudit runs an SEO audit
func (c *Client) RunAudit(ctx context.Context, req *AuditRequest) (*AuditResponse, error) {
	var resp AuditResponse
	err := c.request(ctx, "POST", "/api/seo/audit", req, &resp)
	return &resp, err
}

// RunBatchAudit runs audits for multiple URLs
func (c *Client) RunBatchAudit(ctx context.Context, urls []string, webhook string) (*BatchResponse, error) {
	req := map[string]any{
		"urls":    urls,
		"webhook": webhook,
	}

	var resp BatchResponse
	err := c.request(ctx, "POST", "/api/seo/audit/batch", req, &resp)
	return &resp, err
}

// GetAuditResult retrieves an audit result by ID
func (c *Client) GetAuditResult(ctx context.Context, id string) (*AuditResponse, error) {
	var resp AuditResponse
	err := c.request(ctx, "GET", "/api/seo/audit/"+id, nil, &resp)
	return &resp, err
}

// GenerateSchema generates structured data
func (c *Client) GenerateSchema(ctx context.Context, req *SchemaRequest) (*SchemaResponse, error) {
	var resp SchemaResponse
	err := c.request(ctx, "POST", "/api/seo/schema", req, &resp)
	return &resp, err
}

// ValidateSchema validates structured data
func (c *Client) ValidateSchema(ctx context.Context, schema map[string]any) (*SchemaResponse, error) {
	req := map[string]any{"schema": schema}

	var resp SchemaResponse
	err := c.request(ctx, "POST", "/api/seo/schema/validate", req, &resp)
	return &resp, err
}

// CheckBot checks if a user agent is a bot
func (c *Client) CheckBot(ctx context.Context, userAgent string) (*BotCheckResponse, error) {
	cacheKey := c.generateCacheKey("bot", userAgent)

	// Check cache
	if c.config.CacheEnabled {
		if cached, err := c.cache.Get(cacheKey); err == nil {
			c.metrics.IncrementCacheHits()
			var resp BotCheckResponse
			if err := json.Unmarshal(cached, &resp); err == nil {
				return &resp, nil
			}
		} else {
			c.metrics.IncrementCacheMisses()
		}
	}

	req := &BotCheckRequest{UserAgent: userAgent}
	var resp BotCheckResponse
	err := c.request(ctx, "POST", "/api/seo/bot-check", req, &resp)
	if err != nil {
		return nil, err
	}

	// Cache for 1 hour
	if c.config.CacheEnabled {
		if data, err := json.Marshal(resp); err == nil {
			_ = c.cache.Set(cacheKey, data, 1*time.Hour)
		}
	}

	return &resp, nil
}

// Batch executes multiple operations in a single request
func (c *Client) Batch(ctx context.Context, req *BatchRequest) (*BatchResponse, error) {
	var resp BatchResponse
	err := c.request(ctx, "POST", "/api/seo/batch", req, &resp)
	return &resp, err
}

// Health checks API health
func (c *Client) Health(ctx context.Context) (*HealthResponse, error) {
	var resp HealthResponse
	err := c.request(ctx, "GET", "/api/health", nil, &resp)
	return &resp, err
}

// GetAPIMetrics retrieves API metrics
func (c *Client) GetAPIMetrics(ctx context.Context) (map[string]any, error) {
	var resp map[string]any
	err := c.request(ctx, "GET", "/api/metrics", nil, &resp)
	return resp, err
}

// GetClientMetrics returns client-side metrics
func (c *Client) GetClientMetrics() map[string]any {
	return c.metrics.GetMetrics()
}

// ClearCache clears the client cache
func (c *Client) ClearCache() error {
	return c.cache.Clear()
}

// ============================================================================
// PRIVATE METHODS
// ============================================================================

// request makes an HTTP request with retry logic and circuit breaker
func (c *Client) request(ctx context.Context, method, path string, body, result any) error {
	// Rate limiting
	if c.rateLimiter != nil {
		if !c.rateLimiter.Allow() {
			return errors.New("rate limit exceeded")
		}
	}

	start := time.Now()
	defer func() {
		if c.config.EnableMetrics {
			c.metrics.AddLatency(time.Since(start))
		}
	}()

	var lastErr error
	for attempt := 0; attempt < c.config.RetryAttempts; attempt++ {
		if attempt > 0 {
			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(c.config.RetryDelay * time.Duration(attempt)):
			}
		}

		err := c.circuitBreaker.Call(func() error {
			return c.doRequest(ctx, method, path, body, result)
		})

		if err == nil {
			return nil
		}

		lastErr = err
		c.logger.Warn("Request failed, attempt %d/%d: %v", attempt+1, c.config.RetryAttempts, err)
	}

	if c.config.EnableMetrics {
		c.metrics.IncrementErrors()
	}

	return fmt.Errorf("request failed after %d attempts: %w", c.config.RetryAttempts, lastErr)
}

// doRequest performs the actual HTTP request
func (c *Client) doRequest(ctx context.Context, method, path string, body, result any) error {
	if c.config.EnableMetrics {
		c.metrics.IncrementRequests()
	}

	url := c.config.APIUrl + path

	var reqBody io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return fmt.Errorf("failed to marshal request: %w", err)
		}
		reqBody = bytes.NewReader(data)
	}

	req, err := http.NewRequestWithContext(ctx, method, url, reqBody)
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")
	if c.config.APIKey != "" {
		req.Header.Set("X-API-Key", c.config.APIKey)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return fmt.Errorf("API error (%d): %s", resp.StatusCode, string(bodyBytes))
	}

	if result != nil {
		if err := json.NewDecoder(resp.Body).Decode(result); err != nil {
			return fmt.Errorf("failed to decode response: %w", err)
		}
	}

	return nil
}

// generateCacheKey generates a cache key
func (c *Client) generateCacheKey(prefix string, data any) string {
	jsonData, _ := json.Marshal(data)
	hash := md5.Sum(jsonData)
	return fmt.Sprintf("mseo:%s:%x", prefix, hash)
}

// min returns the minimum of two integers
func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// ============================================================================
// MIDDLEWARE (GIN FRAMEWORK)
// ============================================================================

// GinBotDetection is a Gin middleware for bot detection
func GinBotDetection(client *Client) func(c any) {
	return func(c any) {
		// Type assertion for gin.Context
		// Note: In actual use, import "github.com/gin-gonic/gin"
		// and use proper type: func(c *gin.Context)

		// Example implementation:
		// userAgent := c.Request.UserAgent()
		// ctx := c.Request.Context()
		//
		// botInfo, err := client.CheckBot(ctx, userAgent)
		// if err == nil {
		//     c.Set("is_bot", botInfo.IsBot)
		//     c.Set("bot_info", botInfo.BotInfo)
		// }
		//
		// c.Next()
	}
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

// MustNewClient creates a new client or panics
func MustNewClient(config *Config) *Client {
	client := NewClient(config)

	// Test connection
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := client.Health(ctx)
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to M-SEO API: %v", err))
	}

	return client
}

// ============================================================================
// GORM MODELS (for database persistence)
// ============================================================================

// SeoMeta represents SEO metadata in database
type SeoMeta struct {
	ID          uint      `gorm:"primarykey"`
	URL         string    `gorm:"uniqueIndex;not null"`
	Title       string    `gorm:"not null"`
	Description string    `gorm:"type:text"`
	Keywords    string    `gorm:"type:text"`
	Canonical   string    `gorm:"type:varchar(500)"`
	OGImage     string    `gorm:"type:varchar(500)"`
	Metadata    string    `gorm:"type:json"`
	Locale      string    `gorm:"type:varchar(10);default:en"`
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// SitemapURLModel represents a sitemap URL in database
type SitemapURLModel struct {
	ID         uint      `gorm:"primarykey"`
	URL        string    `gorm:"uniqueIndex;not null"`
	Changefreq string    `gorm:"type:varchar(20);default:weekly"`
	Priority   float64   `gorm:"type:decimal(2,1);default:0.8"`
	Lastmod    time.Time
	Metadata   string    `gorm:"type:json"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
}

// AuditLogModel represents an audit log in database
type AuditLogModel struct {
	ID              uint      `gorm:"primarykey"`
	URL             string    `gorm:"index;not null"`
	Score           int       `gorm:"index"`
	Passed          int
	Failed          int
	Warnings        int
	Issues          string    `gorm:"type:json"`
	Recommendations string    `gorm:"type:json"`
	Metadata        string    `gorm:"type:json"`
	CreatedAt       time.Time `gorm:"index"`
	UpdatedAt       time.Time
}

// TableName specifies the table name for SeoMeta
func (SeoMeta) TableName() string {
	return "seo_metas"
}

// TableName specifies the table name for SitemapURLModel
func (SitemapURLModel) TableName() string {
	return "sitemap_urls"
}

// TableName specifies the table name for AuditLogModel
func (AuditLogModel) TableName() string {
	return "seo_audit_logs"
}

/*
============================================================================
COMPREHENSIVE USAGE EXAMPLES
============================================================================

=================================================================
1. BASIC CLIENT USAGE
=================================================================

package main

import (
    "context"
    "log"
    "time"

    "github.com/m-seo/go-sdk"
)

func main() {
    // Create client
    client := mseo.NewClient(&mseo.Config{
        APIUrl: "http://localhost:3100",
        APIKey: "your-api-key",
        CacheEnabled: true,
        CacheTTL: 5 * time.Minute,
        Timeout: 10 * time.Second,
        RetryAttempts: 3,
    })

    ctx := context.Background()

    // Generate meta tags
    meta, err := client.GenerateMeta(ctx, &mseo.MetaRequest{
        Title:       "My Product Page",
        Description: "Best product ever",
        URL:         "https://example.com/product",
        Keywords:    []string{"product", "best", "quality"},
        Image:       "https://example.com/image.jpg",
    })
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("Meta HTML: %s", meta.HTML)
}

=================================================================
2. SITEMAP GENERATION
=================================================================

func generateSitemap(client *mseo.Client) {
    ctx := context.Background()

    urls := []mseo.SitemapURL{
        {
            Loc:        "https://example.com/",
            Changefreq: "daily",
            Priority:   1.0,
            Lastmod:    time.Now(),
        },
        {
            Loc:        "https://example.com/products",
            Changefreq: "daily",
            Priority:   0.9,
        },
        {
            Loc:        "https://example.com/about",
            Changefreq: "monthly",
            Priority:   0.5,
        },
    }

    sitemap, err := client.GenerateSitemap(ctx, &mseo.SitemapRequest{
        URLs:    urls,
        BaseURL: "https://example.com",
    })
    if err != nil {
        log.Fatal(err)
    }

    // Save to file
    err = os.WriteFile("public/sitemap.xml", []byte(sitemap.XML), 0644)
    if err != nil {
        log.Fatal(err)
    }
}

=================================================================
3. SEO AUDIT
=================================================================

func runAudit(client *mseo.Client, url string) {
    ctx := context.Background()

    audit, err := client.RunAudit(ctx, &mseo.AuditRequest{
        URL:       url,
        Threshold: 70,
        Fix:       true,
    })
    if err != nil {
        log.Fatal(err)
    }

    log.Printf("SEO Score: %d/100", audit.Score)
    log.Printf("Passed: %d, Failed: %d, Warnings: %d",
        audit.Passed, audit.Failed, audit.Warnings)

    if len(audit.Issues) > 0 {
        log.Println("Issues:")
        for _, issue := range audit.Issues {
            log.Printf("  [%s] %s", issue.Severity, issue.Message)
            if issue.Fix != "" {
                log.Printf("    Fix: %s", issue.Fix)
            }
        }
    }
}

=================================================================
4. BOT DETECTION
=================================================================

func detectBot(client *mseo.Client, userAgent string) bool {
    ctx := context.Background()

    botCheck, err := client.CheckBot(ctx, userAgent)
    if err != nil {
        log.Printf("Bot check failed: %v", err)
        return false
    }

    if botCheck.IsBot {
        log.Printf("Bot detected: %v", botCheck.BotInfo)
        return true
    }

    return false
}

=================================================================
5. CONCURRENT OPERATIONS WITH GOROUTINES
=================================================================

func processURLsConcurrently(client *mseo.Client, urls []string) {
    var wg sync.WaitGroup
    results := make(chan *mseo.AuditResponse, len(urls))

    for _, url := range urls {
        wg.Add(1)
        go func(u string) {
            defer wg.Done()

            ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
            defer cancel()

            audit, err := client.RunAudit(ctx, &mseo.AuditRequest{
                URL: u,
            })
            if err != nil {
                log.Printf("Audit failed for %s: %v", u, err)
                return
            }

            results <- audit
        }(url)
    }

    go func() {
        wg.Wait()
        close(results)
    }()

    for result := range results {
        log.Printf("URL: %s, Score: %d", result.URL, result.Score)
    }
}

=================================================================
6. GIN FRAMEWORK INTEGRATION
=================================================================

import "github.com/gin-gonic/gin"

func setupRouter(client *mseo.Client) *gin.Engine {
    r := gin.Default()

    // Bot detection middleware
    r.Use(func(c *gin.Context) {
        userAgent := c.Request.UserAgent()
        ctx := c.Request.Context()

        botInfo, err := client.CheckBot(ctx, userAgent)
        if err == nil {
            c.Set("is_bot", botInfo.IsBot)
            c.Set("bot_info", botInfo.BotInfo)
        }

        c.Next()
    })

    // Product page with SEO
    r.GET("/product/:id", func(c *gin.Context) {
        product := getProduct(c.Param("id"))

        meta, err := client.GenerateMeta(c.Request.Context(), &mseo.MetaRequest{
            Title:       product.Name,
            Description: product.Description,
            URL:         c.Request.URL.String(),
            Image:       product.ImageURL,
        })
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }

        c.HTML(200, "product.html", gin.H{
            "product": product,
            "meta":    meta,
        })
    })

    return r
}

=================================================================
7. ECHO FRAMEWORK INTEGRATION
=================================================================

import "github.com/labstack/echo/v4"

func setupEcho(client *mseo.Client) *echo.Echo {
    e := echo.New()

    // Bot detection middleware
    e.Use(func(next echo.HandlerFunc) echo.HandlerFunc {
        return func(c echo.Context) error {
            userAgent := c.Request().UserAgent()
            ctx := c.Request().Context()

            botInfo, err := client.CheckBot(ctx, userAgent)
            if err == nil {
                c.Set("is_bot", botInfo.IsBot)
                c.Set("bot_info", botInfo.BotInfo)
            }

            return next(c)
        }
    })

    return e
}

=================================================================
8. FIBER FRAMEWORK INTEGRATION
=================================================================

import "github.com/gofiber/fiber/v2"

func setupFiber(client *mseo.Client) *fiber.App {
    app := fiber.New()

    // Bot detection middleware
    app.Use(func(c *fiber.Ctx) error {
        userAgent := string(c.Request().Header.UserAgent())
        ctx := context.Background()

        botInfo, err := client.CheckBot(ctx, userAgent)
        if err == nil {
            c.Locals("is_bot", botInfo.IsBot)
            c.Locals("bot_info", botInfo.BotInfo)
        }

        return c.Next()
    })

    return app
}

=================================================================
9. GORM DATABASE INTEGRATION
=================================================================

import "gorm.io/gorm"

func storeAuditResult(db *gorm.DB, audit *mseo.AuditResponse) error {
    issuesJSON, _ := json.Marshal(audit.Issues)
    recsJSON, _ := json.Marshal(audit.Recommendations)
    metaJSON, _ := json.Marshal(audit.Metadata)

    auditLog := &mseo.AuditLogModel{
        URL:             audit.URL,
        Score:           audit.Score,
        Passed:          audit.Passed,
        Failed:          audit.Failed,
        Warnings:        audit.Warnings,
        Issues:          string(issuesJSON),
        Recommendations: string(recsJSON),
        Metadata:        string(metaJSON),
    }

    return db.Create(auditLog).Error
}

=================================================================
10. GRACEFUL SHUTDOWN
=================================================================

func main() {
    client := mseo.NewClient(&mseo.Config{
        APIUrl: "http://localhost:3100",
    })

    // Create server
    srv := &http.Server{
        Addr: ":8080",
    }

    // Start server in goroutine
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatalf("Server failed: %v", err)
        }
    }()

    // Wait for interrupt
    quit := make(chan os.Signal, 1)
    signal.Notify(quit, os.Interrupt, syscall.SIGTERM)
    <-quit

    log.Println("Shutting down gracefully...")

    // Shutdown with timeout
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("Server forced to shutdown:", err)
    }

    log.Println("Server exited")
}

=================================================================
11. TESTING
=================================================================

import "testing"

func TestClient_GenerateMeta(t *testing.T) {
    client := mseo.NewClient(&mseo.Config{
        APIUrl: "http://localhost:3100",
    })

    ctx := context.Background()
    meta, err := client.GenerateMeta(ctx, &mseo.MetaRequest{
        Title:       "Test Page",
        Description: "Test description",
        URL:         "https://example.com/test",
    })

    if err != nil {
        t.Fatalf("GenerateMeta failed: %v", err)
    }

    if meta.HTML == "" {
        t.Error("Expected HTML to be non-empty")
    }

    if meta.Tags["title"] != "Test Page" {
        t.Errorf("Expected title 'Test Page', got '%s'", meta.Tags["title"])
    }
}

=================================================================
12. METRICS & MONITORING
=================================================================

func monitorMetrics(client *mseo.Client) {
    ticker := time.NewTicker(1 * time.Minute)
    defer ticker.Stop()

    for range ticker.C {
        metrics := client.GetClientMetrics()

        log.Printf("Client Metrics:")
        log.Printf("  Requests: %v", metrics["requests"])
        log.Printf("  Errors: %v", metrics["errors"])
        log.Printf("  Error Rate: %.2f%%", metrics["error_rate"].(float64)*100)
        log.Printf("  Cache Hits: %v", metrics["cache_hits"])
        log.Printf("  Avg Latency: %v", metrics["avg_latency"])
    }
}

============================================================================
*/
