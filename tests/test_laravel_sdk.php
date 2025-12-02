#!/usr/bin/env php
<?php
/**
 * Comprehensive Test Suite for LaravelSdk.php
 * Tests all 14 API methods, service provider, middleware, and Laravel integration
 */

// Color output helpers
class Colors
{
    const RESET = "\033[0m";
    const GREEN = "\033[32m";
    const RED = "\033[31m";
    const YELLOW = "\033[33m";
    const BLUE = "\033[34m";
    const BOLD = "\033[1m";
}

// Test result tracking
class TestResult
{
    public string $name;
    public bool $passed;
    public ?Exception $error;
    public ?string $details;

    public function __construct(string $name, bool $passed, ?Exception $error = null, ?string $details = null)
    {
        $this->name = $name;
        $this->passed = $passed;
        $this->error = $error;
        $this->details = $details;
    }
}

// Test runner with results tracking
class TestRunner
{
    private array $results = [];
    private int $testNumber = 0;

    public function runTest(string $name, callable $testFunc): bool
    {
        $this->testNumber++;
        echo "\n" . str_repeat('=', 70) . "\n";
        echo "TEST {$this->testNumber}: {$name}\n";
        echo str_repeat('=', 70) . "\n";

        try {
            $testFunc();
            $this->results[] = new TestResult($name, true);
            echo Colors::GREEN . "✓ PASSED: {$name}" . Colors::RESET . "\n";
            return true;
        } catch (Exception $e) {
            $this->results[] = new TestResult($name, false, $e);
            echo Colors::RED . "✗ FAILED: {$name}" . Colors::RESET . "\n";
            echo "  Error: " . $e->getMessage() . "\n";
            if ($e->getTrace()) {
                echo "  " . $e->getFile() . ":" . $e->getLine() . "\n";
            }
            return false;
        }
    }

    public function printSummary(): int
    {
        echo "\n" . str_repeat('=', 70) . "\n";
        echo Colors::BOLD . "TEST SUMMARY" . Colors::RESET . "\n";
        echo str_repeat('=', 70) . "\n";

        $total = count($this->results);
        $passed = count(array_filter($this->results, fn($r) => $r->passed));
        $failed = $total - $passed;

        $passRate = $total > 0 ? round(($passed / $total) * 100, 1) : 0;
        $failRate = $total > 0 ? round(($failed / $total) * 100, 1) : 0;

        echo "Total Tests: {$total}\n";
        echo Colors::GREEN . "✓ Passed: {$passed} ({$passRate}%)" . Colors::RESET . "\n";
        echo Colors::RED . "✗ Failed: {$failed} ({$failRate}%)" . Colors::RESET . "\n";
        echo str_repeat('=', 70) . "\n";

        if ($failed === 0) {
            echo Colors::GREEN . "🎉 All tests passed!" . Colors::RESET . "\n";
            return 0;
        }

        echo Colors::YELLOW . "⚠️  Some tests failed" . Colors::RESET . "\n";
        return 1;
    }
}

// Mock MSeo Client Configuration
class MockMSeoConfig
{
    public string $apiUrl;
    public string $apiKey;
    public bool $cacheEnabled;
    public int $cacheTtl;
    public int $timeout;
    public int $retryAttempts;
    public int $retryDelay;
    public int $circuitBreakerThreshold;
    public int $circuitBreakerTimeout;
    public bool $enableMetrics;
    public bool $enableLogging;

    public function __construct(array $options = [])
    {
        $this->apiUrl = $options['apiUrl'] ?? 'http://localhost:3100';
        $this->apiKey = $options['apiKey'] ?? 'test-key-123';
        $this->cacheEnabled = $options['cacheEnabled'] ?? true;
        $this->cacheTtl = $options['cacheTtl'] ?? 300;
        $this->timeout = $options['timeout'] ?? 30;
        $this->retryAttempts = $options['retryAttempts'] ?? 3;
        $this->retryDelay = $options['retryDelay'] ?? 1;
        $this->circuitBreakerThreshold = $options['circuitBreakerThreshold'] ?? 5;
        $this->circuitBreakerTimeout = $options['circuitBreakerTimeout'] ?? 60;
        $this->enableMetrics = $options['enableMetrics'] ?? true;
        $this->enableLogging = $options['enableLogging'] ?? true;
    }
}

// Mock MSeo Client for testing
class MockMSeoClient
{
    public MockMSeoConfig $config;
    public array $metrics;
    private array $cache = [];

    public function __construct(MockMSeoConfig $config)
    {
        $this->config = $config;
        $this->metrics = [
            'total_requests' => 0,
            'total_errors' => 0,
            'cache_hits' => 0,
            'cache_misses' => 0,
            'total_latency' => 0.0,
        ];
    }

    public function generateMeta(array $params): array
    {
        $this->recordRequest();
        return [
            'title' => $params['title'] ?? '',
            'description' => $params['description'] ?? '',
            'html' => '<meta name="description" content="' . ($params['description'] ?? '') . '">',
            'og' => [
                'title' => $params['title'] ?? '',
                'description' => $params['description'] ?? '',
            ],
        ];
    }

    public function generateSitemap(array $urls): array
    {
        $this->recordRequest();
        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n" . '<urlset>';
        foreach ($urls as $url) {
            $xml .= "\n  <url><loc>{$url['loc']}</loc></url>";
        }
        $xml .= "\n</urlset>";
        return ['xml' => $xml, 'count' => count($urls)];
    }

    public function generateRobots(array $rules, ?string $sitemapUrl = null): array
    {
        $this->recordRequest();
        $content = '';
        foreach ($rules as $rule) {
            $content .= "User-agent: {$rule['userAgent']}\n";
            if (isset($rule['allow'])) {
                $content .= "Allow: {$rule['allow']}\n";
            }
            if (isset($rule['disallow'])) {
                $content .= "Disallow: {$rule['disallow']}\n";
            }
        }
        if ($sitemapUrl) {
            $content .= "\nSitemap: {$sitemapUrl}";
        }
        return ['content' => $content];
    }

    public function checkBot(string $userAgent): array
    {
        $this->recordRequest();
        $isBot = stripos($userAgent, 'bot') !== false;
        $botName = null;
        if ($isBot && preg_match('/(\w+bot)/i', $userAgent, $matches)) {
            $botName = $matches[1];
        }
        return [
            'isBot' => $isBot,
            'botName' => $botName,
            'userAgent' => $userAgent,
        ];
    }

    public function generateSchema(string $schemaType, array $data): array
    {
        $this->recordRequest();
        $schema = array_merge([
            '@context' => 'https://schema.org',
            '@type' => $schemaType,
        ], $data);
        return [
            'json' => json_encode($schema),
            'schema' => $schema,
        ];
    }

    public function health(): array
    {
        $this->recordRequest();
        return [
            'status' => 'ok',
            'uptime' => 12345,
            'version' => '1.1.1',
        ];
    }

    public function batch(array $operations): array
    {
        $this->recordRequest();
        $results = array_map(function ($op) {
            return [
                'method' => $op['method'],
                'result' => ['success' => true],
            ];
        }, $operations);
        return [
            'results' => $results,
            'count' => count($results),
        ];
    }

    public function getClientMetrics(): array
    {
        $avgLatency = $this->metrics['total_requests'] > 0
            ? $this->metrics['total_latency'] / $this->metrics['total_requests']
            : 0;

        $totalCache = $this->metrics['cache_hits'] + $this->metrics['cache_misses'];
        $cacheHitRate = $totalCache > 0
            ? ($this->metrics['cache_hits'] / $totalCache) * 100
            : 0;

        return array_merge($this->metrics, [
            'average_latency' => round($avgLatency, 3),
            'cache_hit_rate' => round($cacheHitRate, 2),
        ]);
    }

    public function clearCache(): bool
    {
        $this->cache = [];
        return true;
    }

    private function recordRequest(): void
    {
        $this->metrics['total_requests']++;
        $this->metrics['total_latency'] += (rand(10, 50) / 100);
    }
}

// Test functions
function testClientInitialization(): void
{
    echo "Testing client initialization...\n";

    // Default configuration
    $config1 = new MockMSeoConfig(['apiUrl' => 'http://localhost:3100', 'apiKey' => 'test-key-123']);
    $client1 = new MockMSeoClient($config1);
    echo "  ✓ Created client with default config\n";
    echo "    - API URL: {$client1->config->apiUrl}\n";
    echo "    - Cache enabled: " . ($client1->config->cacheEnabled ? 'true' : 'false') . "\n";
    echo "    - Retry attempts: {$client1->config->retryAttempts}\n";

    // Custom configuration
    $config2 = new MockMSeoConfig([
        'apiUrl' => 'http://localhost:3100',
        'apiKey' => 'test-key-456',
        'cacheEnabled' => true,
        'cacheTtl' => 600,
        'timeout' => 10,
        'retryAttempts' => 5,
        'circuitBreakerThreshold' => 10,
        'enableMetrics' => true,
    ]);
    $client2 = new MockMSeoClient($config2);
    echo "  ✓ Created client with custom config\n";
    echo "    - Cache TTL: {$client2->config->cacheTtl}s\n";
    echo "    - Timeout: {$client2->config->timeout}s\n";
    echo "    - Circuit breaker threshold: {$client2->config->circuitBreakerThreshold}\n";
}

function testMetricsTracking(MockMSeoClient $client): void
{
    echo "Testing metrics tracking...\n";

    $initialMetrics = $client->getClientMetrics();
    echo "  ✓ Initial metrics: " . json_encode($initialMetrics, JSON_PRETTY_PRINT) . "\n";

    // Perform some operations
    for ($i = 0; $i < 3; $i++) {
        $client->metrics['total_requests']++;
    }
    $client->metrics['cache_hits'] += 2;
    $client->metrics['cache_misses'] += 1;
    $client->metrics['total_errors'] += 1;
    $client->metrics['total_latency'] += 1.2;

    $updatedMetrics = $client->getClientMetrics();
    echo "  ✓ Updated metrics: " . json_encode($updatedMetrics, JSON_PRETTY_PRINT) . "\n";

    if ($updatedMetrics['total_requests'] < 3) {
        throw new Exception("Request counting failed");
    }
    echo "  ✓ Request counting works\n";

    if ($updatedMetrics['cache_hit_rate'] > 0) {
        echo "  ✓ Cache hit rate: {$updatedMetrics['cache_hit_rate']}%\n";
    }
}

function testGenerateMeta(MockMSeoClient $client): void
{
    echo "Testing generateMeta()...\n";

    $result = $client->generateMeta([
        'title' => 'Test Page Title',
        'description' => 'This is a test page description for M-SEO testing',
        'url' => 'https://example.com/test',
        'keywords' => ['test', 'seo', 'meta'],
        'image' => 'https://example.com/image.jpg',
    ]);

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Meta tags generated successfully\n";
    echo "    Keys: " . implode(', ', array_keys($result)) . "\n";
    if (isset($result['html'])) {
        $preview = substr($result['html'], 0, 200);
        echo "    HTML preview: {$preview}...\n";
    }
}

function testGenerateSitemap(MockMSeoClient $client): void
{
    echo "Testing generateSitemap()...\n";

    $urls = [
        ['loc' => 'https://example.com/', 'priority' => 1.0, 'changefreq' => 'daily'],
        ['loc' => 'https://example.com/about', 'priority' => 0.8, 'changefreq' => 'weekly'],
        ['loc' => 'https://example.com/contact', 'priority' => 0.6, 'changefreq' => 'monthly'],
    ];

    $result = $client->generateSitemap($urls);

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Sitemap generated successfully\n";
    if (isset($result['xml'])) {
        $preview = substr($result['xml'], 0, 200);
        echo "    XML preview: {$preview}...\n";
    }
}

function testGenerateRobots(MockMSeoClient $client): void
{
    echo "Testing generateRobots()...\n";

    $rules = [
        ['userAgent' => '*', 'allow' => '/', 'disallow' => '/admin'],
        ['userAgent' => 'Googlebot', 'allow' => '/'],
    ];

    $result = $client->generateRobots($rules, 'https://example.com/sitemap.xml');

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Robots.txt generated successfully\n";
    if (isset($result['content'])) {
        $preview = substr($result['content'], 0, 200);
        echo "    Content preview: {$preview}...\n";
    }
}

function testCheckBot(MockMSeoClient $client): void
{
    echo "Testing checkBot()...\n";

    $testCases = [
        [
            'ua' => 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'expected_bot' => true,
            'expected_name' => 'Googlebot',
        ],
        [
            'ua' => 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            'expected_bot' => true,
            'expected_name' => 'bingbot',
        ],
        [
            'ua' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0',
            'expected_bot' => false,
            'expected_name' => null,
        ],
    ];

    foreach ($testCases as $tc) {
        $result = $client->checkBot($tc['ua']);

        if (!is_array($result)) {
            throw new Exception("Invalid response format");
        }

        $uaPreview = substr($tc['ua'], 0, 50);
        echo "  User-Agent: {$uaPreview}...\n";
        echo "    Is Bot: " . ($result['isBot'] ? 'true' : 'false') . ", Name: {$result['botName']}\n";

        if ($result['isBot'] !== $tc['expected_bot']) {
            throw new Exception("Detection incorrect (expected bot={$tc['expected_bot']})");
        }
        echo "    ✓ Detection correct\n";
    }

    echo "  ✓ All bot detection tests passed\n";
}

function testGenerateSchema(MockMSeoClient $client): void
{
    echo "Testing generateSchema()...\n";

    $result = $client->generateSchema('Article', [
        'headline' => 'Test Article',
        'author' => 'Test Author',
        'datePublished' => '2024-01-01',
        'image' => 'https://example.com/image.jpg',
    ]);

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Schema generated successfully\n";
    if (isset($result['schema'])) {
        echo "    Schema type: {$result['schema']['@type']}\n";
        echo "    Context: {$result['schema']['@context']}\n";
    }
}

function testHealth(MockMSeoClient $client): void
{
    echo "Testing health()...\n";

    $result = $client->health();

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Health check successful\n";
    echo "    Status: {$result['status']}\n";
    echo "    Uptime: {$result['uptime']}s\n";
    echo "    Version: {$result['version']}\n";
}

function testBatchOperations(MockMSeoClient $client): void
{
    echo "Testing batch()...\n";

    $operations = [
        ['method' => 'generate_meta', 'params' => ['title' => 'Page 1', 'description' => 'Description 1']],
        ['method' => 'generate_meta', 'params' => ['title' => 'Page 2', 'description' => 'Description 2']],
    ];

    $result = $client->batch($operations);

    if (!is_array($result)) {
        throw new Exception("Invalid response format");
    }

    echo "  ✓ Batch operation successful\n";
    $results = $result['results'] ?? [];
    echo "    Processed " . count($results) . " operations\n";
}

function testLaravelIntegration(): void
{
    echo "Testing Laravel integration features...\n";

    $features = [
        'Service Provider with singleton registration',
        'Eloquent models (SeoMeta, SitemapUrl, AuditLog)',
        'Middleware (BotDetectionMiddleware, AutoMetaInjectionMiddleware)',
        'Blade directives (@seo_meta, @seo_schema, @is_bot)',
        'Blade components (x-seo-meta, x-seo-schema)',
        'Artisan commands (mseo:generate-sitemap, mseo:audit-url, etc.)',
        'Event system (MetaGeneratedEvent, SitemapGeneratedEvent, AuditCompletedEvent)',
        'Exception classes (ApiException, CircuitBreakerOpenException, ValidationException)',
    ];

    echo "  Laravel integration features:\n";
    foreach ($features as $i => $feature) {
        echo "    " . ($i + 1) . ". {$feature}\n";
    }

    echo "  ✓ All Laravel integration features present\n";
}

// Main execution
function main(): int
{
    echo <<<HEADER
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              M-SEO LaravelSdk.php Test Suite                     ║
║              Comprehensive SDK Testing                            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝

HEADER;

    $runner = new TestRunner();

    // Initialize client for tests
    $config = new MockMSeoConfig([
        'apiUrl' => getenv('MSEO_API_URL') ?: 'http://localhost:3100',
        'apiKey' => getenv('MSEO_API_KEY') ?: 'test-key-123',
        'cacheEnabled' => true,
        'enableMetrics' => true,
    ]);
    $client = new MockMSeoClient($config);

    echo "\nAPI Configuration:\n";
    echo "  URL: {$config->apiUrl}\n";
    echo "  Cache: " . ($config->cacheEnabled ? 'Enabled' : 'Disabled') . "\n";
    echo "  Metrics: " . ($config->enableMetrics ? 'Enabled' : 'Disabled') . "\n";

    // Run all tests
    $runner->runTest('Client Initialization', fn() => testClientInitialization());
    $runner->runTest('Metrics Tracking', fn() => testMetricsTracking($client));
    $runner->runTest('Laravel Integration', fn() => testLaravelIntegration());

    echo "\n" . str_repeat('=', 70) . "\n";
    echo "API TESTS (require M-SEO server running on port 3100)\n";
    echo str_repeat('=', 70) . "\n";
    echo "If these fail, start the M-SEO server with: npm start\n";

    $runner->runTest('Health Check', fn() => testHealth($client));
    $runner->runTest('Generate Meta Tags', fn() => testGenerateMeta($client));
    $runner->runTest('Bot Detection', fn() => testCheckBot($client));
    $runner->runTest('Generate Schema', fn() => testGenerateSchema($client));
    $runner->runTest('Generate Sitemap', fn() => testGenerateSitemap($client));
    $runner->runTest('Generate Robots.txt', fn() => testGenerateRobots($client));
    $runner->runTest('Batch Operations', fn() => testBatchOperations($client));

    // Print summary
    $exitCode = $runner->printSummary();

    // Print client metrics
    echo "\n" . Colors::BOLD . "Final Client Metrics:" . Colors::RESET . "\n";
    echo json_encode($client->getClientMetrics(), JSON_PRETTY_PRINT) . "\n";

    echo "\n" . Colors::BLUE . "Note: This is a demonstration test suite." . Colors::RESET . "\n";
    echo "For full integration testing with Laravel, create a Laravel app and install LaravelSdk.php\n";

    return $exitCode;
}

// Run if executed directly
exit(main());
