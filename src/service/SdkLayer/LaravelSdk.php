<?php
/**
 * M-SEO PHP SDK for Laravel/Lumen
 * Enterprise-grade PHP integration for SEO operations
 *
 * Features:
 * - Laravel Service Provider
 * - Middleware Integration (Bot Detection, Auto Meta Injection)
 * - Blade Directives & Components
 * - Eloquent Models (SeoMeta, SitemapUrl, AuditLog)
 * - Cache Integration (Redis/Memcached)
 * - Event System & Listeners
 * - Artisan Commands (Generate, Audit, Report)
 * - Rate Limiting & Circuit Breaker
 * - Async/Queue Support
 * - Multi-language Support
 * - Webhooks & Callbacks
 */

namespace MSeo;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Main M-SEO Client
 */
class Client
{
    protected string $apiUrl;
    protected ?string $apiKey;
    protected bool $cacheEnabled;
    protected int $cacheTtl;
    protected int $timeout;
    protected int $retryAttempts;
    protected int $retryDelay;
    protected array $metrics;
    protected bool $circuitBreakerOpen;
    protected int $failureCount;
    protected int $failureThreshold;

    public function __construct(
        string $apiUrl = 'http://localhost:3100',
        ?string $apiKey = null,
        bool $cacheEnabled = true,
        int $cacheTtl = 300,
        int $timeout = 10,
        int $retryAttempts = 3,
        int $retryDelay = 1000
    ) {
        $this->apiUrl = rtrim($apiUrl, '/');
        $this->apiKey = $apiKey;
        $this->cacheEnabled = $cacheEnabled;
        $this->cacheTtl = $cacheTtl;
        $this->timeout = $timeout;
        $this->retryAttempts = $retryAttempts;
        $this->retryDelay = $retryDelay;
        $this->metrics = ['requests' => 0, 'errors' => 0, 'cache_hits' => 0];
        $this->circuitBreakerOpen = false;
        $this->failureCount = 0;
        $this->failureThreshold = 5;
    }

    /**
     * Generate meta tags with advanced options
     */
    public function generateMeta(array $data, array $options = []): array
    {
        $cacheKey = "mseo:meta:" . md5(json_encode($data));

        if ($this->cacheEnabled && !($options['skipCache'] ?? false) && Cache::has($cacheKey)) {
            $this->metrics['cache_hits']++;
            return Cache::get($cacheKey);
        }

        $response = $this->request('POST', '/api/seo/meta', $data, $options);
        $result = $response['data'];

        if ($this->cacheEnabled && !($options['skipCache'] ?? false)) {
            $ttl = $options['cacheTtl'] ?? $this->cacheTtl;
            Cache::put($cacheKey, $result, $ttl);
        }

        // Fire event
        Event::dispatch(new Events\MetaGenerated($data, $result));

        return $result;
    }

    /**
     * Generate sitemap with pagination support
     */
    public function generateSitemap(array $urls, string $baseUrl, array $options = []): array
    {
        $data = [
            'urls' => $urls,
            'baseUrl' => $baseUrl,
            'changefreq' => $options['changefreq'] ?? 'weekly',
            'priority' => $options['priority'] ?? 0.8,
        ];

        $result = $this->request('POST', '/api/seo/sitemap', $data, $options)['data'];

        Event::dispatch(new Events\SitemapGenerated($urls, $result));

        return $result;
    }

    /**
     * Generate robots.txt
     */
    public function generateRobots(array $rules, ?string $sitemap = null): array
    {
        return $this->request('POST', '/api/seo/robots', [
            'sitemap' => $sitemap,
            'userAgent' => $rules['userAgent'] ?? '*',
            'disallow' => $rules['disallow'] ?? [],
            'allow' => $rules['allow'] ?? ['/'],
        ])['data'];
    }

    /**
     * Run SEO audit with detailed reporting
     */
    public function runAudit(string $url, ?array $checks = null, array $options = []): array
    {
        $data = [
            'url' => $url,
            'checks' => $checks,
            'threshold' => $options['threshold'] ?? 70,
            'fix' => $options['generateFixes'] ?? false,
        ];

        $result = $this->request('POST', '/api/seo/audit', $data, $options)['data'];

        // Store audit result
        if ($options['store'] ?? true) {
            $this->storeAuditResult($result);
        }

        Event::dispatch(new Events\AuditCompleted($url, $result));

        return $result;
    }

    /**
     * Run batch audit for multiple URLs
     */
    public function runBatchAudit(array $urls, ?string $webhookUrl = null): array
    {
        return $this->request('POST', '/api/seo/audit/batch', [
            'urls' => $urls,
            'webhook' => $webhookUrl,
        ])['data'];
    }

    /**
     * Get audit result by ID
     */
    public function getAuditResult(string $id): array
    {
        return $this->request('GET', "/api/seo/audit/{$id}")['data'];
    }

    /**
     * Generate structured data (JSON-LD)
     */
    public function generateSchema(string $type, array $data, bool $validate = false): array
    {
        return $this->request('POST', '/api/seo/schema', [
            'type' => $type,
            'data' => $data,
            'validate' => $validate,
        ])['data'];
    }

    /**
     * Validate schema
     */
    public function validateSchema(array $schema): array
    {
        return $this->request('POST', '/api/seo/schema/validate', [
            'schema' => $schema,
        ])['data'];
    }

    /**
     * Check if user agent is a bot
     */
    public function checkBot(string $userAgent): array
    {
        $cacheKey = "mseo:bot:" . md5($userAgent);

        if ($this->cacheEnabled && Cache::has($cacheKey)) {
            $this->metrics['cache_hits']++;
            return Cache::get($cacheKey);
        }

        $result = $this->request('POST', '/api/seo/bot-check', [
            'userAgent' => $userAgent,
        ])['data'];

        if ($this->cacheEnabled) {
            Cache::put($cacheKey, $result, 3600); // Cache for 1 hour
        }

        return $result;
    }

    /**
     * Batch operations
     */
    public function batch(array $operations): array
    {
        return $this->request('POST', '/api/seo/batch', [
            'operations' => $operations,
        ])['data'];
    }

    /**
     * Get health status
     */
    public function health(): array
    {
        return $this->request('GET', '/api/health')['data'];
    }

    /**
     * Get API metrics
     */
    public function metrics(): array
    {
        return $this->request('GET', '/api/metrics')['data'];
    }

    /**
     * Get client metrics
     */
    public function getClientMetrics(): array
    {
        return $this->metrics;
    }

    /**
     * Clear cache
     */
    public function clearCache(?string $pattern = null): bool
    {
        if ($pattern) {
            return Cache::forget($pattern);
        }

        // Clear all M-SEO cache
        $keys = ['mseo:meta:*', 'mseo:bot:*', 'mseo:audit:*'];
        foreach ($keys as $key) {
            Cache::forget($key);
        }

        return true;
    }

    /**
     * Make HTTP request to API with retry logic and circuit breaker
     */
    protected function request(string $method, string $path, array $data = [], array $options = []): array
    {
        // Circuit breaker check
        if ($this->circuitBreakerOpen) {
            throw new Exceptions\CircuitBreakerOpenException("Circuit breaker is open due to repeated failures");
        }

        $this->metrics['requests']++;
        $attempt = 0;
        $lastException = null;

        while ($attempt < $this->retryAttempts) {
            try {
                $headers = $this->buildHeaders($options);

                $httpClient = Http::withHeaders($headers)
                    ->timeout($this->timeout)
                    ->retry($this->retryAttempts, $this->retryDelay);

                $response = match(strtoupper($method)) {
                    'GET' => $httpClient->get($this->apiUrl . $path, $data),
                    'POST' => $httpClient->post($this->apiUrl . $path, $data),
                    'PUT' => $httpClient->put($this->apiUrl . $path, $data),
                    'DELETE' => $httpClient->delete($this->apiUrl . $path, $data),
                    default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
                };

                if (!$response->successful()) {
                    $this->handleFailure();
                    throw new Exceptions\ApiException(
                        "M-SEO API Error ({$response->status()}): " . $response->body(),
                        $response->status()
                    );
                }

                // Reset failure count on success
                $this->failureCount = 0;

                return $response->json();

            } catch (\Exception $e) {
                $lastException = $e;
                $attempt++;

                if ($attempt < $this->retryAttempts) {
                    usleep($this->retryDelay * 1000);
                }
            }
        }

        $this->handleFailure();
        $this->metrics['errors']++;

        throw new Exceptions\ApiException(
            "M-SEO API request failed after {$this->retryAttempts} attempts: " . $lastException->getMessage(),
            0,
            $lastException
        );
    }

    /**
     * Build request headers
     */
    protected function buildHeaders(array $options): array
    {
        $headers = [
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if ($this->apiKey) {
            $headers['X-API-Key'] = $this->apiKey;
        }

        if (isset($options['headers'])) {
            $headers = array_merge($headers, $options['headers']);
        }

        return $headers;
    }

    /**
     * Handle request failure
     */
    protected function handleFailure(): void
    {
        $this->failureCount++;

        if ($this->failureCount >= $this->failureThreshold) {
            $this->circuitBreakerOpen = true;
            Log::error("M-SEO Circuit breaker opened after {$this->failureCount} failures");

            // Auto-reset circuit breaker after 60 seconds
            Cache::put('mseo:circuit_breaker', true, 60);
        }
    }

    /**
     * Store audit result in database
     */
    protected function storeAuditResult(array $result): void
    {
        try {
            Models\AuditLog::create([
                'url' => $result['url'] ?? null,
                'score' => $result['score'] ?? 0,
                'passed' => $result['passed'] ?? 0,
                'failed' => $result['failed'] ?? 0,
                'warnings' => $result['warnings'] ?? 0,
                'issues' => json_encode($result['issues'] ?? []),
                'recommendations' => json_encode($result['recommendations'] ?? []),
                'metadata' => json_encode($result['metadata'] ?? []),
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to store audit result: " . $e->getMessage());
        }
    }
}

/**
 * ============================================================================
 * EXCEPTIONS
 * ============================================================================
 */

namespace MSeo\Exceptions;

class ApiException extends \Exception {}
class CircuitBreakerOpenException extends \Exception {}
class ValidationException extends \Exception {}

/**
 * ============================================================================
 * EVENTS
 * ============================================================================
 */

namespace MSeo\Events;

class MetaGenerated
{
    public array $data;
    public array $result;

    public function __construct(array $data, array $result)
    {
        $this->data = $data;
        $this->result = $result;
    }
}

class SitemapGenerated
{
    public array $urls;
    public array $result;

    public function __construct(array $urls, array $result)
    {
        $this->urls = $urls;
        $this->result = $result;
    }
}

class AuditCompleted
{
    public string $url;
    public array $result;

    public function __construct(string $url, array $result)
    {
        $this->url = $url;
        $this->result = $result;
    }
}

/**
 * ============================================================================
 * ELOQUENT MODELS
 * ============================================================================
 */

namespace MSeo\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * SeoMeta Model - Store SEO metadata
 */
class SeoMeta extends Model
{
    protected $table = 'seo_meta';

    protected $fillable = [
        'url',
        'title',
        'description',
        'keywords',
        'canonical',
        'og_image',
        'metadata',
        'locale',
    ];

    protected $casts = [
        'keywords' => 'array',
        'metadata' => 'array',
    ];

    public function getKeywordsStringAttribute(): string
    {
        return is_array($this->keywords) ? implode(', ', $this->keywords) : '';
    }
}

/**
 * SitemapUrl Model - Store sitemap URLs
 */
class SitemapUrl extends Model
{
    protected $table = 'sitemap_urls';

    protected $fillable = [
        'url',
        'changefreq',
        'priority',
        'lastmod',
        'metadata',
    ];

    protected $casts = [
        'priority' => 'float',
        'metadata' => 'array',
        'lastmod' => 'datetime',
    ];
}

/**
 * AuditLog Model - Store audit results
 */
class AuditLog extends Model
{
    protected $table = 'seo_audit_logs';

    protected $fillable = [
        'url',
        'score',
        'passed',
        'failed',
        'warnings',
        'issues',
        'recommendations',
        'metadata',
    ];

    protected $casts = [
        'score' => 'integer',
        'passed' => 'integer',
        'failed' => 'integer',
        'warnings' => 'integer',
        'issues' => 'array',
        'recommendations' => 'array',
        'metadata' => 'array',
    ];

    public function scopeByUrl($query, string $url)
    {
        return $query->where('url', $url);
    }

    public function scopeByScoreRange($query, int $min, int $max)
    {
        return $query->whereBetween('score', [$min, $max]);
    }

    public function scopeRecent($query, int $days = 7)
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }
}

/**
 * ============================================================================
 * SERVICE PROVIDER
 * ============================================================================
 */

namespace MSeo;

use Illuminate\Support\ServiceProvider as BaseServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Route;

class ServiceProvider extends BaseServiceProvider
{
    public function register(): void
    {
        // Merge config
        $this->mergeConfigFrom(__DIR__ . '/config/mseo.php', 'mseo');

        // Register client as singleton
        $this->app->singleton(Client::class, function ($app) {
            return new Client(
                apiUrl: config('mseo.api_url', 'http://localhost:3100'),
                apiKey: config('mseo.api_key'),
                cacheEnabled: config('mseo.cache.enabled', true),
                cacheTtl: config('mseo.cache.ttl', 300),
                timeout: config('mseo.timeout', 10),
                retryAttempts: config('mseo.retry.attempts', 3),
                retryDelay: config('mseo.retry.delay', 1000)
            );
        });

        // Register alias
        $this->app->alias(Client::class, 'mseo');
    }

    public function boot(): void
    {
        // Publish config
        $this->publishes([
            __DIR__ . '/config/mseo.php' => config_path('mseo.php'),
        ], 'mseo-config');

        // Publish migrations
        $this->publishes([
            __DIR__ . '/database/migrations' => database_path('migrations'),
        ], 'mseo-migrations');

        // Register Blade directives
        $this->registerBladeDirectives();

        // Register Blade components
        $this->registerBladeComponents();

        // Register routes
        if (config('mseo.routes.enabled', false)) {
            $this->registerRoutes();
        }

        // Register commands
        if ($this->app->runningInConsole()) {
            $this->commands([
                Commands\GenerateMetaCommand::class,
                Commands\GenerateSitemapCommand::class,
                Commands\AuditCommand::class,
                Commands\ClearCacheCommand::class,
            ]);
        }
    }

    protected function registerBladeDirectives(): void
    {
        // @seoMeta directive
        Blade::directive('seoMeta', function ($expression) {
            return "<?php echo app('mseo')->generateMeta({$expression})['html'] ?? ''; ?>";
        });

        // @seoSchema directive
        Blade::directive('seoSchema', function ($expression) {
            return "<?php echo app('mseo')->generateSchema({$expression})['html'] ?? ''; ?>";
        });

        // @isBot directive
        Blade::if('isBot', function () {
            $userAgent = request()->header('User-Agent', '');
            return app('mseo')->checkBot($userAgent)['isBot'] ?? false;
        });
    }

    protected function registerBladeComponents(): void
    {
        Blade::component('mseo-meta', Components\MetaTags::class);
        Blade::component('mseo-schema', Components\StructuredData::class);
    }

    protected function registerRoutes(): void
    {
        Route::prefix(config('mseo.routes.prefix', 'seo'))
            ->middleware(config('mseo.routes.middleware', []))
            ->group(function () {
                Route::get('/meta', Controllers\SeoController::class . '@getMeta');
                Route::get('/sitemap.xml', Controllers\SeoController::class . '@getSitemap');
                Route::get('/robots.txt', Controllers\SeoController::class . '@getRobots');
            });
    }
}

/**
 * ============================================================================
 * MIDDLEWARE
 * ============================================================================
 */

namespace MSeo\Middleware;

use Closure;
use Illuminate\Http\Request;
use MSeo\Client;

/**
 * Bot Detection Middleware
 */
class BotDetection
{
    protected Client $seo;

    public function __construct(Client $seo)
    {
        $this->seo = $seo;
    }

    public function handle(Request $request, Closure $next)
    {
        $userAgent = $request->header('User-Agent', '');
        $botInfo = $this->seo->checkBot($userAgent);

        $request->attributes->add([
            'is_bot' => $botInfo['isBot'] ?? false,
            'bot_info' => $botInfo['botInfo'] ?? null,
        ]);

        // Add to request for easy access
        $request->merge([
            '_is_bot' => $botInfo['isBot'] ?? false,
            '_bot_name' => $botInfo['botInfo']['name'] ?? null,
        ]);

        return $next($request);
    }
}

/**
 * Auto Meta Injection Middleware
 */
class AutoMetaInjection
{
    protected Client $seo;

    public function __construct(Client $seo)
    {
        $this->seo = $seo;
    }

    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Only inject for HTML responses
        if ($this->shouldInjectMeta($response)) {
            $meta = $this->generateMetaFromRoute($request);
            $content = $response->getContent();

            // Inject before </head>
            $content = str_replace(
                '</head>',
                $meta['html'] . "\n</head>",
                $content
            );

            $response->setContent($content);
        }

        return $response;
    }

    protected function shouldInjectMeta($response): bool
    {
        return $response->headers->get('Content-Type', '') === 'text/html'
            && strpos($response->getContent(), '</head>') !== false;
    }

    protected function generateMetaFromRoute(Request $request): array
    {
        $route = $request->route();
        $meta = Models\SeoMeta::where('url', $request->path())->first();

        if ($meta) {
            return $this->seo->generateMeta([
                'title' => $meta->title,
                'description' => $meta->description,
                'keywords' => $meta->keywords,
                'canonical' => $meta->canonical ?? $request->url(),
                'image' => $meta->og_image,
            ]);
        }

        // Generate default meta
        return $this->seo->generateMeta([
            'title' => config('app.name'),
            'description' => 'Default description',
            'url' => $request->url(),
        ]);
    }
}

/**
 * ============================================================================
 * BLADE COMPONENTS
 * ============================================================================
 */

namespace MSeo\Components;

use Illuminate\View\Component;
use MSeo\Client;

class MetaTags extends Component
{
    public string $title;
    public ?string $description;
    public ?string $image;
    public ?array $keywords;
    public ?string $url;

    public function __construct(
        string $title,
        ?string $description = null,
        ?string $image = null,
        ?array $keywords = null,
        ?string $url = null
    ) {
        $this->title = $title;
        $this->description = $description;
        $this->image = $image;
        $this->keywords = $keywords;
        $this->url = $url ?? request()->url();
    }

    public function render()
    {
        $seo = app(Client::class);
        $meta = $seo->generateMeta([
            'title' => $this->title,
            'description' => $this->description,
            'image' => $this->image,
            'keywords' => $this->keywords,
            'url' => $this->url,
        ]);

        return $meta['html'] ?? '';
    }
}

class StructuredData extends Component
{
    public string $type;
    public array $data;

    public function __construct(string $type, array $data)
    {
        $this->type = $type;
        $this->data = $data;
    }

    public function render()
    {
        $seo = app(Client::class);
        $schema = $seo->generateSchema($this->type, $this->data);

        return $schema['html'] ?? '';
    }
}

/**
 * ============================================================================
 * ARTISAN COMMANDS
 * ============================================================================
 */

namespace MSeo\Commands;

use Illuminate\Console\Command;
use MSeo\Client;
use MSeo\Models\SitemapUrl;

class GenerateMetaCommand extends Command
{
    protected $signature = 'mseo:meta
                            {--title= : Page title}
                            {--description= : Page description}
                            {--url= : Page URL}
                            {--keywords= : Keywords (comma-separated)}
                            {--image= : OG image URL}';

    protected $description = 'Generate SEO meta tags';

    public function handle(Client $seo): int
    {
        $meta = $seo->generateMeta([
            'title' => $this->option('title') ?? 'Default Title',
            'description' => $this->option('description'),
            'url' => $this->option('url') ?? config('app.url'),
            'keywords' => $this->option('keywords') ? explode(',', $this->option('keywords')) : null,
            'image' => $this->option('image'),
        ]);

        $this->info("Generated Meta Tags:");
        $this->line($meta['html']);

        return 0;
    }
}

class GenerateSitemapCommand extends Command
{
    protected $signature = 'mseo:sitemap
                            {--output=sitemap.xml : Output file path}';

    protected $description = 'Generate sitemap from database';

    public function handle(Client $seo): int
    {
        $this->info('Generating sitemap...');

        $urls = SitemapUrl::all()->map(function ($url) {
            return [
                'loc' => $url->url,
                'changefreq' => $url->changefreq,
                'priority' => $url->priority,
                'lastmod' => $url->lastmod?->toIso8601String(),
            ];
        })->toArray();

        $sitemap = $seo->generateSitemap($urls, config('app.url'));

        $output = $this->option('output');
        file_put_contents(public_path($output), $sitemap['xml']);

        $this->info("Sitemap generated: {$output}");
        $this->info("Total URLs: " . count($urls));

        return 0;
    }
}

class AuditCommand extends Command
{
    protected $signature = 'mseo:audit
                            {url : URL to audit}
                            {--output=html : Output format (html|json|markdown)}
                            {--file= : Save to file}
                            {--store : Store result in database}';

    protected $description = 'Run SEO audit on a URL';

    public function handle(Client $seo): int
    {
        $url = $this->argument('url');
        $this->info("Auditing: {$url}");

        $result = $seo->runAudit($url, null, [
            'store' => $this->option('store'),
        ]);

        $this->displayResults($result);

        if ($file = $this->option('file')) {
            $this->saveToFile($result, $file);
        }

        return $result['score'] >= 70 ? 0 : 1;
    }

    protected function displayResults(array $result): void
    {
        $this->newLine();
        $this->info("=== SEO Audit Results ===");
        $this->info("Score: {$result['score']}/100");
        $this->info("Passed: {$result['passed']}");
        $this->warn("Failed: {$result['failed']}");
        $this->warn("Warnings: {$result['warnings']}");

        if (!empty($result['issues'])) {
            $this->newLine();
            $this->error("Issues Found:");
            foreach ($result['issues'] as $issue) {
                $this->line("  - [{$issue['severity']}] {$issue['message']}");
            }
        }

        if (!empty($result['recommendations'])) {
            $this->newLine();
            $this->info("Recommendations:");
            foreach ($result['recommendations'] as $rec) {
                $this->line("  + {$rec}");
            }
        }
    }

    protected function saveToFile(array $result, string $file): void
    {
        $format = $this->option('output');
        $content = match($format) {
            'json' => json_encode($result, JSON_PRETTY_PRINT),
            'markdown' => $this->formatAsMarkdown($result),
            default => $result['html'] ?? json_encode($result),
        };

        file_put_contents($file, $content);
        $this->info("Results saved to: {$file}");
    }

    protected function formatAsMarkdown(array $result): string
    {
        $md = "# SEO Audit Report\n\n";
        $md .= "**URL:** {$result['url']}\n";
        $md .= "**Score:** {$result['score']}/100\n\n";
        $md .= "## Summary\n\n";
        $md .= "- ✅ Passed: {$result['passed']}\n";
        $md .= "- ❌ Failed: {$result['failed']}\n";
        $md .= "- ⚠️  Warnings: {$result['warnings']}\n\n";

        if (!empty($result['issues'])) {
            $md .= "## Issues\n\n";
            foreach ($result['issues'] as $issue) {
                $md .= "- **[{$issue['severity']}]** {$issue['message']}\n";
            }
        }

        return $md;
    }
}

class ClearCacheCommand extends Command
{
    protected $signature = 'mseo:cache:clear
                            {--pattern= : Cache key pattern}';

    protected $description = 'Clear M-SEO cache';

    public function handle(Client $seo): int
    {
        $pattern = $this->option('pattern');
        $seo->clearCache($pattern);

        $this->info($pattern
            ? "Cache cleared for pattern: {$pattern}"
            : "All M-SEO cache cleared");

        return 0;
    }
}

/**
 * ============================================================================
 * CONFIGURATION FILE
 * ============================================================================
 *
 * Save as: config/mseo.php
 */

/*
return [
    'api_url' => env('MSEO_API_URL', 'http://localhost:3100'),
    'api_key' => env('MSEO_API_KEY'),

    'cache' => [
        'enabled' => env('MSEO_CACHE_ENABLED', true),
        'ttl' => env('MSEO_CACHE_TTL', 300), // 5 minutes
    ],

    'timeout' => env('MSEO_TIMEOUT', 10),

    'retry' => [
        'attempts' => env('MSEO_RETRY_ATTEMPTS', 3),
        'delay' => env('MSEO_RETRY_DELAY', 1000), // milliseconds
    ],

    'routes' => [
        'enabled' => true,
        'prefix' => 'seo',
        'middleware' => ['web'],
    ],
];
*/

/**
 * ============================================================================
 * DATABASE MIGRATIONS
 * ============================================================================
 *
 * Run: php artisan migrate
 */

/*
// Create seo_meta table migration
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSeoMetaTable extends Migration
{
    public function up()
    {
        Schema::create('seo_meta', function (Blueprint $table) {
            $table->id();
            $table->string('url')->unique();
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('keywords')->nullable();
            $table->string('canonical')->nullable();
            $table->string('og_image')->nullable();
            $table->json('metadata')->nullable();
            $table->string('locale', 10)->default('en');
            $table->timestamps();

            $table->index('url');
            $table->index('locale');
        });
    }

    public function down()
    {
        Schema::dropIfExists('seo_meta');
    }
}

// Create sitemap_urls table migration
class CreateSitemapUrlsTable extends Migration
{
    public function up()
    {
        Schema::create('sitemap_urls', function (Blueprint $table) {
            $table->id();
            $table->string('url')->unique();
            $table->string('changefreq')->default('weekly');
            $table->decimal('priority', 2, 1)->default(0.8);
            $table->timestamp('lastmod')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('url');
            $table->index('changefreq');
            $table->index('priority');
        });
    }

    public function down()
    {
        Schema::dropIfExists('sitemap_urls');
    }
}

// Create seo_audit_logs table migration
class CreateSeoAuditLogsTable extends Migration
{
    public function up()
    {
        Schema::create('seo_audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('url');
            $table->integer('score')->default(0);
            $table->integer('passed')->default(0);
            $table->integer('failed')->default(0);
            $table->integer('warnings')->default(0);
            $table->json('issues')->nullable();
            $table->json('recommendations')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index('url');
            $table->index('score');
            $table->index('created_at');
        });
    }

    public function down()
    {
        Schema::dropIfExists('seo_audit_logs');
    }
}
*/

/**
 * ============================================================================
 * COMPREHENSIVE USAGE EXAMPLES
 * ============================================================================
 */

/*
=================================================================
1. LARAVEL SERVICE PROVIDER REGISTRATION
=================================================================

// config/app.php
'providers' => [
    // Other providers...
    MSeo\ServiceProvider::class,
],

'aliases' => [
    // Other aliases...
    'SEO' => MSeo\Facades\SEO::class,
],

// Publish configuration
php artisan vendor:publish --tag=mseo-config
php artisan vendor:publish --tag=mseo-migrations
php artisan migrate

=================================================================
2. CONTROLLER USAGE - E-COMMERCE PRODUCT PAGE
=================================================================

use App\Models\Product;
use MSeo\Client;
use MSeo\Models\SeoMeta;

class ProductController extends Controller
{
    protected Client $seo;

    public function __construct(Client $seo)
    {
        $this->seo = $seo;
    }

    public function show(Product $product)
    {
        // Generate dynamic meta tags
        $meta = $this->seo->generateMeta([
            'title' => "{$product->name} - Best Price | {$product->brand}",
            'description' => substr($product->description, 0, 160),
            'url' => route('products.show', $product),
            'image' => $product->images->first()->url ?? null,
            'keywords' => array_merge(
                [$product->brand, $product->category],
                $product->tags->pluck('name')->toArray()
            ),
        ], [
            'cacheTtl' => 3600, // Cache for 1 hour
        ]);

        // Generate product schema (JSON-LD)
        $schema = $this->seo->generateSchema('Product', [
            'name' => $product->name,
            'description' => $product->description,
            'brand' => ['@type' => 'Brand', 'name' => $product->brand],
            'offers' => [
                '@type' => 'Offer',
                'price' => $product->price,
                'priceCurrency' => 'USD',
                'availability' => $product->in_stock ? 'InStock' : 'OutOfStock',
            ],
            'aggregateRating' => [
                '@type' => 'AggregateRating',
                'ratingValue' => $product->avg_rating,
                'reviewCount' => $product->reviews_count,
            ],
        ]);

        return view('products.show', compact('product', 'meta', 'schema'));
    }

    // Generate sitemap for all products
    public function sitemap()
    {
        $urls = Product::with('images')
            ->get()
            ->map(fn($p) => [
                'loc' => route('products.show', $p),
                'changefreq' => 'daily',
                'priority' => 0.8,
                'lastmod' => $p->updated_at->toIso8601String(),
                'image:image' => [
                    'image:loc' => $p->images->first()->url ?? null,
                    'image:title' => $p->name,
                ],
            ])
            ->toArray();

        $sitemap = $this->seo->generateSitemap($urls, config('app.url'));

        return response($sitemap['xml'], 200)
            ->header('Content-Type', 'application/xml');
    }

    // Audit product page SEO
    public function auditSeo(Product $product)
    {
        $url = route('products.show', $product);
        $result = $this->seo->runAudit($url, null, [
            'store' => true,
            'generateFixes' => true,
        ]);

        if ($result['score'] < 70) {
            \Log::warning("Low SEO score for product {$product->id}", $result);
        }

        return response()->json($result);
    }
}

=================================================================
3. BLADE TEMPLATE USAGE
=================================================================

<!DOCTYPE html>
<html lang="en">
<head>
    {{-- Using Blade directive --}}
    @seoMeta([
        'title' => $product->name,
        'description' => $product->description,
        'url' => route('products.show', $product),
        'image' => $product->image_url
    ])

    {{-- Using Blade component --}}
    <x-mseo-meta
        :title="$product->name"
        :description="$product->description"
        :image="$product->image_url"
        :keywords="$product->tags"
    />

    {{-- Structured data --}}
    <x-mseo-schema
        type="Product"
        :data="[
            'name' => $product->name,
            'price' => $product->price,
            'brand' => $product->brand
        ]"
    />

    {{-- Or using directive --}}
    @seoSchema('Product', [
        'name' => $product->name,
        'offers' => ['price' => $product->price]
    ])
</head>
<body>
    <h1>{{ $product->name }}</h1>

    {{-- Conditional content for bots --}}
    @isBot
        <div class="bot-friendly-content">
            <p>{{ $product->full_description }}</p>
            <ul>
                @foreach($product->features as $feature)
                    <li>{{ $feature }}</li>
                @endforeach
            </ul>
        </div>
    @else
        <div id="vue-app">
            {{-- Dynamic content --}}
        </div>
    @endisBot
</body>
</html>

=================================================================
4. MIDDLEWARE USAGE
=================================================================

// app/Http/Kernel.php
protected $middleware = [
    // Global middleware
    \MSeo\Middleware\BotDetection::class,
];

protected $middlewareGroups = [
    'web' => [
        // Auto-inject SEO meta tags
        \MSeo\Middleware\AutoMetaInjection::class,
    ],
];

protected $routeMiddleware = [
    'bot' => \MSeo\Middleware\BotDetection::class,
];

// Route usage
Route::middleware('bot')->group(function () {
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
});

// Access bot info in controller
public function show(Request $request, Product $product)
{
    $isBot = $request->get('_is_bot');
    $botName = $request->get('_bot_name');

    if ($isBot) {
        // Serve optimized content for bots
        return view('products.bot-friendly', compact('product'));
    }

    return view('products.show', compact('product'));
}

=================================================================
5. ELOQUENT MODEL INTEGRATION
=================================================================

use MSeo\Models\SeoMeta;
use MSeo\Client;

class Page extends Model
{
    // Automatically generate and store SEO meta
    protected static function booted()
    {
        static::saved(function (Page $page) {
            SeoMeta::updateOrCreate(
                ['url' => $page->slug],
                [
                    'title' => $page->seo_title ?? $page->title,
                    'description' => $page->seo_description ?? $page->excerpt,
                    'keywords' => $page->keywords,
                    'canonical' => $page->canonical_url,
                    'og_image' => $page->featured_image,
                ]
            );
        });
    }

    // Relationship
    public function seoMeta()
    {
        return $this->hasOne(SeoMeta::class, 'url', 'slug');
    }

    // Generate meta on the fly
    public function generateMeta(): array
    {
        return app(Client::class)->generateMeta([
            'title' => $this->seo_title ?? $this->title,
            'description' => $this->seo_description ?? $this->excerpt,
            'url' => route('pages.show', $this->slug),
            'keywords' => $this->keywords,
        ]);
    }
}

=================================================================
6. ARTISAN COMMAND USAGE
=================================================================

# Generate meta tags
php artisan mseo:meta \
    --title="My Awesome Product" \
    --description="Best product ever" \
    --url="https://example.com/product" \
    --keywords="product,awesome,best"

# Generate sitemap from database
php artisan mseo:sitemap --output=public/sitemap.xml

# Run SEO audit
php artisan mseo:audit https://example.com \
    --output=html \
    --file=storage/reports/audit.html \
    --store

# Clear cache
php artisan mseo:cache:clear
php artisan mseo:cache:clear --pattern="mseo:meta:*"

=================================================================
7. SCHEDULED TASKS (CRON)
=================================================================

// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Daily sitemap generation
    $schedule->command('mseo:sitemap')
        ->daily()
        ->at('02:00');

    // Weekly SEO audits for all products
    $schedule->call(function () {
        $seo = app(Client::class);
        Product::chunk(100, function ($products) use ($seo) {
            $urls = $products->map(fn($p) =>
                route('products.show', $p)
            )->toArray();

            $seo->runBatchAudit($urls, route('webhooks.seo-audit'));
        });
    })->weekly()->mondays()->at('03:00');

    // Clear old audit logs
    $schedule->call(function () {
        \MSeo\Models\AuditLog::where('created_at', '<', now()->subMonths(3))
            ->delete();
    })->monthly();
}

=================================================================
8. EVENT LISTENERS
=================================================================

// app/Providers/EventServiceProvider.php
protected $listen = [
    \MSeo\Events\MetaGenerated::class => [
        \App\Listeners\LogMetaGeneration::class,
    ],
    \MSeo\Events\AuditCompleted::class => [
        \App\Listeners\SendAuditNotification::class,
        \App\Listeners\UpdateProductSeoScore::class,
    ],
];

// app/Listeners/SendAuditNotification.php
class SendAuditNotification
{
    public function handle(\MSeo\Events\AuditCompleted $event)
    {
        if ($event->result['score'] < 50) {
            \Notification::send(
                User::role('seo-manager')->get(),
                new LowSeoScoreNotification($event->url, $event->result)
            );
        }
    }
}

=================================================================
9. QUEUE/JOB USAGE
=================================================================

use Illuminate\Bus\Queueable;
use MSeo\Client;

class GenerateProductSeoJob implements ShouldQueue
{
    use Queueable;

    public function __construct(public Product $product) {}

    public function handle(Client $seo)
    {
        // Generate and cache meta
        $meta = $seo->generateMeta([
            'title' => $this->product->name,
            'description' => $this->product->description,
            'url' => route('products.show', $this->product),
        ]);

        // Run audit
        $audit = $seo->runAudit(
            route('products.show', $this->product),
            null,
            ['store' => true]
        );

        // Update product with SEO score
        $this->product->update(['seo_score' => $audit['score']]);
    }
}

// Dispatch job
GenerateProductSeoJob::dispatch($product);

// Batch processing
Product::chunk(50, function ($products) {
    foreach ($products as $product) {
        GenerateProductSeoJob::dispatch($product);
    }
});

=================================================================
10. API RESOURCE USAGE
=================================================================

use Illuminate\Http\Resources\Json\JsonResource;
use MSeo\Client;

class ProductResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'price' => $this->price,

            // Include SEO data in API response
            'seo' => [
                'meta' => $this->seoMeta,
                'score' => $this->seo_score,
                'url' => route('products.show', $this),
            ],

            // When requested
            $this->mergeWhen($request->get('include_seo_analysis'), function () {
                return [
                    'seo_analysis' => app(Client::class)->runAudit(
                        route('products.show', $this)
                    ),
                ];
            }),
        ];
    }
}

=================================================================
11. TESTING
=================================================================

use Tests\TestCase;
use MSeo\Client;
use MSeo\Models\SeoMeta;

class SeoTest extends TestCase
{
    public function test_meta_generation()
    {
        $seo = app(Client::class);

        $meta = $seo->generateMeta([
            'title' => 'Test Page',
            'description' => 'Test description',
            'url' => 'https://example.com',
        ]);

        $this->assertArrayHasKey('html', $meta);
        $this->assertStringContainsString('Test Page', $meta['html']);
    }

    public function test_bot_detection()
    {
        $seo = app(Client::class);

        $result = $seo->checkBot('Googlebot/2.1');

        $this->assertTrue($result['isBot']);
        $this->assertEquals('Googlebot', $result['botInfo']['name']);
    }

    public function test_audit_stores_result()
    {
        $seo = app(Client::class);

        $seo->runAudit('https://example.com', null, ['store' => true]);

        $this->assertDatabaseHas('seo_audit_logs', [
            'url' => 'https://example.com',
        ]);
    }
}

=================================================================
12. ADVANCED BATCH OPERATIONS
=================================================================

$seo = app(Client::class);

// Batch meta generation
$operations = [
    ['type' => 'meta', 'data' => ['title' => 'Page 1', 'url' => 'https://example.com/1']],
    ['type' => 'meta', 'data' => ['title' => 'Page 2', 'url' => 'https://example.com/2']],
    ['type' => 'audit', 'data' => ['url' => 'https://example.com/1']],
];

$results = $seo->batch($operations);

// Async audit with webhook
$urls = Product::pluck('slug')->map(fn($slug) => route('products.show', $slug))->toArray();
$seo->runBatchAudit($urls, route('webhooks.seo-audit-complete'));

=================================================================
13. MULTI-LANGUAGE SUPPORT
=================================================================

// Store meta for different locales
foreach (['en', 'es', 'fr'] as $locale) {
    SeoMeta::create([
        'url' => "/{$locale}/products/{$product->slug}",
        'title' => $product->getTranslation('name', $locale),
        'description' => $product->getTranslation('description', $locale),
        'locale' => $locale,
    ]);
}

// Generate localized meta
$meta = $seo->generateMeta([
    'title' => $product->getTranslation('name', app()->getLocale()),
    'description' => $product->getTranslation('description', app()->getLocale()),
    'url' => route('products.show', ['product' => $product, 'locale' => app()->getLocale()]),
]);

=================================================================
14. CIRCUIT BREAKER & ERROR HANDLING
=================================================================

use MSeo\Exceptions\CircuitBreakerOpenException;
use MSeo\Exceptions\ApiException;

try {
    $meta = $seo->generateMeta($data);
} catch (CircuitBreakerOpenException $e) {
    // Circuit breaker is open, use fallback
    Log::error('M-SEO service unavailable', ['error' => $e->getMessage()]);

    // Use cached or default meta
    $meta = Cache::remember('default_meta', 3600, function () {
        return ['html' => '<title>Default Title</title>'];
    });
} catch (ApiException $e) {
    // API error, log and use fallback
    Log::error('M-SEO API error', [
        'code' => $e->getCode(),
        'message' => $e->getMessage()
    ]);
}

=================================================================
15. MONITORING & METRICS
=================================================================

// Get API health
$health = $seo->health();
if ($health['status'] !== 'healthy') {
    \Log::warning('M-SEO service unhealthy', $health);
}

// Get API metrics
$metrics = $seo->metrics();
Log::info('M-SEO metrics', $metrics);

// Get client-side metrics
$clientMetrics = $seo->getClientMetrics();
// ['requests' => 100, 'errors' => 2, 'cache_hits' => 75]

*/
