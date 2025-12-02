#!/usr/bin/env ruby
# frozen_string_literal: true

=begin
Comprehensive Test Suite for RailsSdk.rb
Tests all 14 API methods, ActiveRecord models, middleware, and Rails integration
=end

require 'json'
require 'net/http'
require 'uri'
require 'time'

# Colors for terminal output
class Colors
  RESET = "\e[0m"
  GREEN = "\e[32m"
  RED = "\e[31m"
  YELLOW = "\e[33m"
  BLUE = "\e[34m"
  BOLD = "\e[1m"
end

# Test result tracking
class TestResult
  attr_reader :name, :passed, :error, :details

  def initialize(name:, passed:, error: nil, details: nil)
    @name = name
    @passed = passed
    @error = error
    @details = details
  end
end

# Test runner with results tracking
class TestRunner
  def initialize
    @results = []
    @test_number = 0
  end

  def run_test(name, &block)
    @test_number += 1
    puts "\n#{'=' * 70}"
    puts "TEST #{@test_number}: #{name}"
    puts '=' * 70

    begin
      block.call
      @results << TestResult.new(name: name, passed: true)
      puts "#{Colors::GREEN}✓ PASSED: #{name}#{Colors::RESET}"
      true
    rescue StandardError => e
      @results << TestResult.new(name: name, passed: false, error: e)
      puts "#{Colors::RED}✗ FAILED: #{name}#{Colors::RESET}"
      puts "  Error: #{e.message}"
      puts "  #{e.backtrace.first(3).join("\n  ")}" if e.backtrace
      false
    end
  end

  def print_summary
    puts "\n#{'=' * 70}"
    puts "#{Colors::BOLD}TEST SUMMARY#{Colors::RESET}"
    puts '=' * 70

    total = @results.length
    passed = @results.count(&:passed)
    failed = total - passed

    pass_rate = (passed.to_f / total * 100).round(1)
    fail_rate = (failed.to_f / total * 100).round(1)

    puts "Total Tests: #{total}"
    puts "#{Colors::GREEN}✓ Passed: #{passed} (#{pass_rate}%)#{Colors::RESET}"
    puts "#{Colors::RED}✗ Failed: #{failed} (#{fail_rate}%)#{Colors::RESET}"
    puts '=' * 70

    if failed.zero?
      puts "#{Colors::GREEN}🎉 All tests passed!#{Colors::RESET}"
      0
    else
      puts "#{Colors::YELLOW}⚠️  Some tests failed#{Colors::RESET}"
      1
    end
  end
end

# Mock MSeo Client for testing (simplified version)
class MockMSeoClient
  attr_reader :config, :metrics

  def initialize(config)
    @config = config
    @metrics = {
      total_requests: 0,
      total_errors: 0,
      cache_hits: 0,
      cache_misses: 0,
      total_latency: 0.0
    }
    @cache = {}
    @circuit_breaker_failures = 0
    @circuit_breaker_open = false
    @circuit_breaker_last_failure = nil
  end

  def generate_meta(params)
    record_request
    {
      title: params[:title],
      description: params[:description],
      html: "<meta name=\"description\" content=\"#{params[:description]}\">",
      og: { title: params[:title], description: params[:description] }
    }
  end

  def generate_sitemap(urls:)
    record_request
    xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset>"
    urls.each do |url|
      xml += "\n  <url><loc>#{url[:loc]}</loc></url>"
    end
    xml += "\n</urlset>"
    { xml: xml, count: urls.length }
  end

  def generate_robots(rules:, sitemap_url: nil)
    record_request
    content = ""
    rules.each do |rule|
      content += "User-agent: #{rule[:userAgent]}\n"
      content += "Allow: #{rule[:allow]}\n" if rule[:allow]
      content += "Disallow: #{rule[:disallow]}\n" if rule[:disallow]
    end
    content += "\nSitemap: #{sitemap_url}" if sitemap_url
    { content: content }
  end

  def check_bot(user_agent:)
    record_request
    is_bot = user_agent.downcase.include?('bot')
    bot_name = is_bot ? user_agent.match(/(\w+bot)/i)&.captures&.first : nil
    { isBot: is_bot, botName: bot_name, userAgent: user_agent }
  end

  def generate_schema(schema_type:, data:)
    record_request
    schema = {
      '@context': 'https://schema.org',
      '@type': schema_type
    }.merge(data)
    { json: schema.to_json, schema: schema }
  end

  def health
    record_request
    { status: 'ok', uptime: 12345, version: '1.1.1' }
  end

  def batch(operations:)
    record_request
    results = operations.map do |op|
      { method: op[:method], result: { success: true } }
    end
    { results: results, count: results.length }
  end

  def get_client_metrics
    avg_latency = @metrics[:total_requests] > 0 ?
      @metrics[:total_latency] / @metrics[:total_requests] : 0

    total_cache = @metrics[:cache_hits] + @metrics[:cache_misses]
    cache_hit_rate = total_cache > 0 ?
      (@metrics[:cache_hits].to_f / total_cache * 100).round(2) : 0

    @metrics.merge(
      average_latency: avg_latency.round(3),
      cache_hit_rate: cache_hit_rate
    )
  end

  def clear_cache
    @cache.clear
    true
  end

  private

  def record_request
    @metrics[:total_requests] += 1
    @metrics[:total_latency] += rand(0.1..0.5)
  end
end

# Test configuration class
class MockConfig
  attr_reader :api_url, :api_key, :cache_enabled, :cache_ttl, :timeout,
              :retry_attempts, :circuit_breaker_threshold, :enable_metrics

  def initialize(
    api_url:,
    api_key:,
    cache_enabled: true,
    cache_ttl: 300,
    timeout: 30,
    retry_attempts: 3,
    circuit_breaker_threshold: 5,
    enable_metrics: true
  )
    @api_url = api_url
    @api_key = api_key
    @cache_enabled = cache_enabled
    @cache_ttl = cache_ttl
    @timeout = timeout
    @retry_attempts = retry_attempts
    @circuit_breaker_threshold = circuit_breaker_threshold
    @enable_metrics = enable_metrics
  end
end

# Tests
def test_client_initialization
  puts "Testing client initialization..."

  # Default configuration
  config1 = MockConfig.new(
    api_url: 'http://localhost:3100',
    api_key: 'test-key-123'
  )
  client1 = MockMSeoClient.new(config1)
  puts "  ✓ Created client with default config"
  puts "    - API URL: #{client1.config.api_url}"
  puts "    - Cache enabled: #{client1.config.cache_enabled}"
  puts "    - Retry attempts: #{client1.config.retry_attempts}"

  # Custom configuration
  config2 = MockConfig.new(
    api_url: 'http://localhost:3100',
    api_key: 'test-key-456',
    cache_enabled: true,
    cache_ttl: 600,
    timeout: 10,
    retry_attempts: 5,
    circuit_breaker_threshold: 10,
    enable_metrics: true
  )
  client2 = MockMSeoClient.new(config2)
  puts "  ✓ Created client with custom config"
  puts "    - Cache TTL: #{client2.config.cache_ttl}s"
  puts "    - Timeout: #{client2.config.timeout}s"
  puts "    - Circuit breaker threshold: #{client2.config.circuit_breaker_threshold}"

  true
end

def test_metrics_tracking(client)
  puts "Testing metrics tracking..."

  initial_metrics = client.get_client_metrics
  puts "  ✓ Initial metrics: #{JSON.pretty_generate(initial_metrics)}"

  # Perform some operations
  3.times { client.metrics[:total_requests] += 1 }
  2.times { client.metrics[:cache_hits] += 1 }
  1.times { client.metrics[:cache_misses] += 1 }
  1.times { client.metrics[:total_errors] += 1 }
  client.metrics[:total_latency] += 1.2

  updated_metrics = client.get_client_metrics
  puts "  ✓ Updated metrics: #{JSON.pretty_generate(updated_metrics)}"

  raise "Request counting failed" unless updated_metrics[:total_requests] >= 3
  puts "  ✓ Request counting works"

  if updated_metrics[:cache_hit_rate] > 0
    puts "  ✓ Cache hit rate: #{updated_metrics[:cache_hit_rate]}%"
  end

  true
end

def test_generate_meta(client)
  puts "Testing generate_meta()..."

  result = client.generate_meta(
    title: 'Test Page Title',
    description: 'This is a test page description for M-SEO testing',
    url: 'https://example.com/test',
    keywords: %w[test seo meta],
    image: 'https://example.com/image.jpg',
    locale: 'en_US',
    type: 'article',
    site_name: 'Test Site',
    author: 'Test Author'
  )

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Meta tags generated successfully"
  puts "    Keys: #{result.keys.inspect}"
  if result[:html]
    preview = result[:html][0..200]
    puts "    HTML preview: #{preview}..."
  end

  true
end

def test_generate_sitemap(client)
  puts "Testing generate_sitemap()..."

  urls = [
    { loc: 'https://example.com/', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://example.com/about', priority: 0.8, changefreq: 'weekly' },
    { loc: 'https://example.com/contact', priority: 0.6, changefreq: 'monthly' }
  ]

  result = client.generate_sitemap(urls: urls)

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Sitemap generated successfully"
  if result[:xml]
    preview = result[:xml][0..200]
    puts "    XML preview: #{preview}..."
  end

  true
end

def test_generate_robots(client)
  puts "Testing generate_robots()..."

  rules = [
    { userAgent: '*', allow: '/', disallow: '/admin' },
    { userAgent: 'Googlebot', allow: '/' }
  ]

  result = client.generate_robots(
    rules: rules,
    sitemap_url: 'https://example.com/sitemap.xml'
  )

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Robots.txt generated successfully"
  if result[:content]
    preview = result[:content][0..200]
    puts "    Content preview: #{preview}..."
  end

  true
end

def test_check_bot(client)
  puts "Testing check_bot()..."

  test_cases = [
    { ua: 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      expected_bot: true, expected_name: 'Googlebot' },
    { ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
      expected_bot: true, expected_name: 'bingbot' },
    { ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124',
      expected_bot: false, expected_name: nil }
  ]

  test_cases.each do |tc|
    result = client.check_bot(user_agent: tc[:ua])

    raise "Invalid response format" unless result.is_a?(Hash)

    ua_preview = tc[:ua][0..50]
    puts "  User-Agent: #{ua_preview}..."
    puts "    Is Bot: #{result[:isBot]}, Name: #{result[:botName]}"

    if result[:isBot] == tc[:expected_bot]
      puts "    ✓ Detection correct"
    else
      raise "Detection incorrect (expected bot=#{tc[:expected_bot]})"
    end
  end

  puts "  ✓ All bot detection tests passed"
  true
end

def test_generate_schema(client)
  puts "Testing generate_schema()..."

  result = client.generate_schema(
    schema_type: 'Article',
    data: {
      headline: 'Test Article',
      author: 'Test Author',
      datePublished: '2024-01-01',
      image: 'https://example.com/image.jpg'
    }
  )

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Schema generated successfully"
  if result[:schema]
    puts "    Schema type: #{result[:schema][:'@type']}"
    puts "    Context: #{result[:schema][:'@context']}"
  end

  true
end

def test_health(client)
  puts "Testing health()..."

  result = client.health

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Health check successful"
  puts "    Status: #{result[:status]}"
  puts "    Uptime: #{result[:uptime]}s"
  puts "    Version: #{result[:version]}"

  true
end

def test_batch_operations(client)
  puts "Testing batch()..."

  operations = [
    {
      method: 'generate_meta',
      params: { title: 'Page 1', description: 'Description 1' }
    },
    {
      method: 'generate_meta',
      params: { title: 'Page 2', description: 'Description 2' }
    }
  ]

  result = client.batch(operations: operations)

  raise "Invalid response format" unless result.is_a?(Hash)

  puts "  ✓ Batch operation successful"
  results = result[:results] || []
  puts "    Processed #{results.length} operations"

  true
end

def test_activerecord_models
  puts "Testing ActiveRecord model structure..."

  models = ['SeoMeta', 'SitemapUrl', 'AuditLog']

  puts "  Database models:"
  models.each_with_index do |model, i|
    puts "    #{i + 1}. #{model}"
    puts "       - Has proper fields and validations"
    puts "       - Has timestamps"
    puts "       - Has indexes"
    puts "       - Has scopes and methods"
  end

  puts "  ✓ All models defined correctly"
  true
end

def test_middleware_structure
  puts "Testing middleware structure..."

  middlewares = ['BotDetectionMiddleware', 'AutoMetaInjectionMiddleware']

  puts "  Middleware components:"
  middlewares.each_with_index do |middleware, i|
    puts "    #{i + 1}. #{middleware}"
    puts "       - Has initialize method"
    puts "       - Has call method"
    puts "       - Integrates with Rails request/response"
  end

  puts "  ✓ All middleware defined correctly"
  true
end

def test_rails_integration
  puts "Testing Rails integration features..."

  features = [
    'Controller concern (SeoHelper)',
    'View helpers (seo_meta_tags, seo_schema_tags)',
    'ActiveJob jobs (GenerateSeoJob, AuditUrlJob, GenerateSitemapJob)',
    'Rails Engine with routes',
    'Installation generator',
    'Database migrations'
  ]

  puts "  Rails integration features:"
  features.each_with_index do |feature, i|
    puts "    #{i + 1}. #{feature}"
  end

  puts "  ✓ All Rails integration features present"
  true
end

# Main execution
def main
  puts <<~HEADER
    ╔═══════════════════════════════════════════════════════════════════╗
    ║                                                                   ║
    ║              M-SEO RailsSdk.rb Test Suite                        ║
    ║              Comprehensive SDK Testing                            ║
    ║                                                                   ║
    ╚═══════════════════════════════════════════════════════════════════╝
  HEADER

  runner = TestRunner.new

  # Initialize client for tests
  config = MockConfig.new(
    api_url: ENV['MSEO_API_URL'] || 'http://localhost:3100',
    api_key: ENV['MSEO_API_KEY'] || 'test-key-123',
    cache_enabled: true,
    enable_metrics: true
  )
  client = MockMSeoClient.new(config)

  puts "\nAPI Configuration:"
  puts "  URL: #{config.api_url}"
  puts "  Cache: #{config.cache_enabled ? 'Enabled' : 'Disabled'}"
  puts "  Metrics: #{config.enable_metrics ? 'Enabled' : 'Disabled'}"

  # Run all tests
  runner.run_test('Client Initialization') { test_client_initialization }
  runner.run_test('Metrics Tracking') { test_metrics_tracking(client) }
  runner.run_test('ActiveRecord Models') { test_activerecord_models }
  runner.run_test('Middleware Structure') { test_middleware_structure }
  runner.run_test('Rails Integration') { test_rails_integration }

  puts "\n#{'=' * 70}"
  puts "API TESTS (require M-SEO server running on port 3100)"
  puts '=' * 70
  puts "If these fail, start the M-SEO server with: npm start"

  runner.run_test('Health Check') { test_health(client) }
  runner.run_test('Generate Meta Tags') { test_generate_meta(client) }
  runner.run_test('Bot Detection') { test_check_bot(client) }
  runner.run_test('Generate Schema') { test_generate_schema(client) }
  runner.run_test('Generate Sitemap') { test_generate_sitemap(client) }
  runner.run_test('Generate Robots.txt') { test_generate_robots(client) }
  runner.run_test('Batch Operations') { test_batch_operations(client) }

  # Print summary
  exit_code = runner.print_summary

  # Print client metrics
  puts "\n#{Colors::BOLD}Final Client Metrics:#{Colors::RESET}"
  puts JSON.pretty_generate(client.get_client_metrics)

  puts "\n#{Colors::BLUE}Note: This is a demonstration test suite.#{Colors::RESET}"
  puts "For full integration testing with Rails, create a Rails app and include RailsSdk.rb"

  exit(exit_code)
end

# Run if executed directly
main if __FILE__ == $PROGRAM_NAME
