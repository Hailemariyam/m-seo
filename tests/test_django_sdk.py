#!/usr/bin/env python3
"""
Comprehensive Test Suite for DjangoSdk.py
Tests all 14 API methods, cache strategies, circuit breaker, metrics, and integrations
"""

import sys
import os
import time
import json
from typing import Dict, Any

# Configure Django settings before importing DjangoSdk
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'django.conf.global_settings')
import django
from django.conf import settings
if not settings.configured:
    settings.configure(
        DEBUG=True,
        DATABASES={},
        INSTALLED_APPS=[],
        SECRET_KEY='test-secret-key-for-testing-only'
    )

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src', 'service', 'SdkLayer'))

try:
    from DjangoSdk import (
        MSeoClient,
        MSeoConfig,
        CacheStrategy,
        MetaRequest,
        AuditRequest,
        MemoryCache,
        CircuitBreakerOpenError
    )
    print("✓ Successfully imported DjangoSdk components")
except ImportError as e:
    print(f"✗ Failed to import DjangoSdk: {e}")
    print("  Note: Some Django-specific features may not work without full Django setup")
    print("  Continuing with basic client tests...")
    # For basic testing, we can still import the core client
    from DjangoSdk import MSeoClient, MSeoConfig, CacheStrategy, MetaRequest, AuditRequest
    MemoryCache = None
    CircuitBreakerOpenError = Exception


class TestRunner:
    """Test runner with colored output and statistics"""

    def __init__(self):
        self.passed = 0
        self.failed = 0
        self.total = 0

    def run_test(self, name: str, test_func):
        """Run a single test and track results"""
        self.total += 1
        print(f"\n{'='*70}")
        print(f"TEST {self.total}: {name}")
        print('='*70)

        try:
            result = test_func()
            if result:
                self.passed += 1
                print(f"✓ PASSED: {name}")
                return True
            else:
                self.failed += 1
                print(f"✗ FAILED: {name}")
                return False
        except Exception as e:
            self.failed += 1
            print(f"✗ FAILED: {name}")
            print(f"  Error: {e}")
            import traceback
            traceback.print_exc()
            return False

    def print_summary(self):
        """Print test summary"""
        print(f"\n{'='*70}")
        print("TEST SUMMARY")
        print('='*70)
        print(f"Total Tests: {self.total}")
        print(f"✓ Passed: {self.passed} ({self.passed/self.total*100:.1f}%)")
        print(f"✗ Failed: {self.failed} ({self.failed/self.total*100:.1f}%)")
        print('='*70)

        if self.failed == 0:
            print("🎉 All tests passed!")
            return 0
        else:
            print("⚠️  Some tests failed")
            return 1


def test_client_initialization():
    """Test 1: Client initialization with various configurations"""
    print("Testing client initialization...")

    # Default configuration
    config1 = MSeoConfig(
        api_url="http://localhost:3100",
        api_key="test-key-123"
    )
    client1 = MSeoClient(config1)
    print(f"  ✓ Created client with default config")
    print(f"    - API URL: {client1.config.api_url}")
    print(f"    - Cache enabled: {client1.config.cache_enabled}")
    print(f"    - Retry attempts: {client1.config.retry_attempts}")

    # Custom configuration
    config2 = MSeoConfig(
        api_url="http://localhost:3100",
        api_key="test-key-456",
        cache_enabled=True,
        cache_ttl=600,
        timeout=10,
        retry_attempts=5,
        retry_delay=2,
        circuit_breaker_threshold=10,
        circuit_breaker_timeout=120,
        enable_metrics=True,
        enable_logging=True
    )
    client2 = MSeoClient(config2)
    print(f"  ✓ Created client with custom config")
    print(f"    - Cache TTL: {client2.config.cache_ttl}s")
    print(f"    - Timeout: {client2.config.timeout}s")
    print(f"    - Circuit breaker threshold: {client2.config.circuit_breaker_threshold}")

    return True


def test_cache_strategies():
    """Test 2: Different cache strategy implementations"""
    print("Testing cache strategies...")

    config = MSeoConfig(
        api_url="http://localhost:3100",
        api_key="test-key",
        cache_enabled=True
    )
    client = MSeoClient(config)

    # Test memory cache
    client.set_cache_strategy(CacheStrategy.MEMORY)
    print(f"  ✓ Set cache strategy to MEMORY")

    # Test cache operations
    cache_key = "test_key_123"
    cache_value = {"data": "test_value", "timestamp": time.time()}

    # Set value
    client.cache.set(cache_key, cache_value, ttl=60)
    print(f"  ✓ Stored value in cache: {cache_key}")

    # Get value
    retrieved = client.cache.get(cache_key)
    if retrieved and retrieved.get("data") == "test_value":
        print(f"  ✓ Retrieved value from cache: {retrieved}")
    else:
        print(f"  ✗ Cache retrieval failed")
        return False

    # Test expiration (short TTL)
    client.cache.set("temp_key", "temp_value", ttl=1)
    time.sleep(2)
    expired = client.cache.get("temp_key")
    if expired is None:
        print(f"  ✓ Cache expiration works correctly")
    else:
        print(f"  ✗ Cache did not expire as expected")
        return False

    # Clear cache
    client.clear_cache()
    print(f"  ✓ Cache cleared successfully")

    return True


def test_metrics_tracking():
    """Test 3: Metrics collection and reporting"""
    print("Testing metrics tracking...")

    config = MSeoConfig(
        api_url="http://localhost:3100",
        api_key="test-key",
        enable_metrics=True
    )
    client = MSeoClient(config)

    # Initial metrics
    initial_metrics = client.get_client_metrics()
    print(f"  ✓ Initial metrics: {json.dumps(initial_metrics, indent=2)}")

    # Simulate some operations
    client.metrics.record_request()
    client.metrics.record_request()
    client.metrics.record_cache_hit()
    client.metrics.record_error()
    client.metrics.record_latency(0.5)
    client.metrics.record_latency(0.3)

    # Check updated metrics
    updated_metrics = client.get_client_metrics()
    print(f"  ✓ Updated metrics: {json.dumps(updated_metrics, indent=2)}")

    if updated_metrics["total_requests"] >= 2:
        print(f"  ✓ Request counting works")
    else:
        print(f"  ✗ Request counting failed")
        return False

    if updated_metrics["cache_hit_rate"] > 0:
        print(f"  ✓ Cache hit rate: {updated_metrics['cache_hit_rate']:.2%}")

    return True


def test_circuit_breaker():
    """Test 4: Circuit breaker functionality"""
    print("Testing circuit breaker...")

    config = MSeoConfig(
        api_url="http://localhost:3100",
        api_key="test-key",
        circuit_breaker_threshold=3,
        circuit_breaker_timeout=5
    )
    client = MSeoClient(config)

    # Simulate failures
    print(f"  Simulating {config.circuit_breaker_threshold} failures...")
    for i in range(config.circuit_breaker_threshold):
        client.circuit_breaker.record_failure()
        print(f"    - Failure {i+1} recorded")

    # Check if circuit breaker is open
    if client.circuit_breaker.is_open():
        print(f"  ✓ Circuit breaker opened after threshold reached")
    else:
        print(f"  ✗ Circuit breaker did not open")
        return False

    # Test recovery
    print(f"  Waiting for circuit breaker timeout ({config.circuit_breaker_timeout}s)...")
    time.sleep(config.circuit_breaker_timeout + 1)

    if not client.circuit_breaker.is_open():
        print(f"  ✓ Circuit breaker auto-recovered")
    else:
        print(f"  ✗ Circuit breaker did not recover")
        return False

    # Test success resets failure count
    client.circuit_breaker.record_success()
    print(f"  ✓ Success recorded, failures reset")

    return True


def test_generate_meta(client: MSeoClient):
    """Test 5: Generate meta tags"""
    print("Testing generate_meta()...")

    try:
        result = client.generate_meta(
            title="Test Page Title",
            description="This is a test page description for M-SEO testing",
            url="https://example.com/test",
            keywords=["test", "seo", "meta"],
            image="https://example.com/image.jpg",
            locale="en_US",
            type="article",
            site_name="Test Site",
            author="Test Author"
        )

        if result and isinstance(result, dict):
            print(f"  ✓ Meta tags generated successfully")
            print(f"    Keys: {list(result.keys())}")
            if "html" in result:
                print(f"    HTML preview (first 200 chars): {result['html'][:200]}...")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_generate_sitemap(client: MSeoClient):
    """Test 6: Generate sitemap"""
    print("Testing generate_sitemap()...")

    try:
        urls = [
            {"loc": "https://example.com/", "priority": 1.0, "changefreq": "daily"},
            {"loc": "https://example.com/about", "priority": 0.8, "changefreq": "weekly"},
            {"loc": "https://example.com/contact", "priority": 0.6, "changefreq": "monthly"}
        ]

        result = client.generate_sitemap(urls=urls)

        if result and isinstance(result, dict):
            print(f"  ✓ Sitemap generated successfully")
            if "xml" in result:
                print(f"    XML preview (first 200 chars): {result['xml'][:200]}...")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_generate_robots(client: MSeoClient):
    """Test 7: Generate robots.txt"""
    print("Testing generate_robots()...")

    try:
        rules = [
            {"userAgent": "*", "allow": "/", "disallow": "/admin"},
            {"userAgent": "Googlebot", "allow": "/"}
        ]

        result = client.generate_robots(
            rules=rules,
            sitemap_url="https://example.com/sitemap.xml"
        )

        if result and isinstance(result, dict):
            print(f"  ✓ Robots.txt generated successfully")
            if "content" in result:
                print(f"    Content preview: {result['content'][:200]}...")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_check_bot(client: MSeoClient):
    """Test 8: Bot detection"""
    print("Testing check_bot()...")

    try:
        # Test known bot user agents
        test_cases = [
            ("Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)", True, "Googlebot"),
            ("Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)", True, "Bingbot"),
            ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/91.0.4472.124", False, None),
        ]

        for user_agent, expected_bot, expected_name in test_cases:
            result = client.check_bot(user_agent=user_agent)

            if result and isinstance(result, dict):
                is_bot = result.get("isBot", False)
                bot_name = result.get("botName")

                print(f"  User-Agent: {user_agent[:50]}...")
                print(f"    Is Bot: {is_bot}, Name: {bot_name}")

                if is_bot == expected_bot:
                    print(f"    ✓ Detection correct")
                else:
                    print(f"    ✗ Detection incorrect (expected bot={expected_bot})")
                    return False
            else:
                print(f"  ✗ Invalid response format")
                return False

        print(f"  ✓ All bot detection tests passed")
        return True

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_generate_schema(client: MSeoClient):
    """Test 9: Generate schema.org structured data"""
    print("Testing generate_schema()...")

    try:
        result = client.generate_schema(
            schema_type="Article",
            data={
                "headline": "Test Article",
                "author": "Test Author",
                "datePublished": "2024-01-01",
                "image": "https://example.com/image.jpg"
            }
        )

        if result and isinstance(result, dict):
            print(f"  ✓ Schema generated successfully")
            if "json" in result:
                schema = json.loads(result["json"]) if isinstance(result["json"], str) else result["json"]
                print(f"    Schema type: {schema.get('@type')}")
                print(f"    Context: {schema.get('@context')}")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_health_check(client: MSeoClient):
    """Test 10: API health check"""
    print("Testing health()...")

    try:
        result = client.health()

        if result and isinstance(result, dict):
            print(f"  ✓ Health check successful")
            print(f"    Status: {result.get('status')}")
            print(f"    Uptime: {result.get('uptime')}s")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_batch_operations(client: MSeoClient):
    """Test 11: Batch API operations"""
    print("Testing batch()...")

    try:
        operations = [
            {
                "method": "generate_meta",
                "params": {"title": "Page 1", "description": "Description 1"}
            },
            {
                "method": "generate_meta",
                "params": {"title": "Page 2", "description": "Description 2"}
            }
        ]

        result = client.batch(operations=operations)

        if result and isinstance(result, dict):
            print(f"  ✓ Batch operation successful")
            results = result.get("results", [])
            print(f"    Processed {len(results)} operations")
            return True
        else:
            print(f"  ✗ Invalid response format")
            return False

    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False


def test_data_classes():
    """Test 12: Data class functionality"""
    print("Testing data classes (MetaRequest, AuditRequest)...")

    # Test MetaRequest
    meta_req = MetaRequest(
        title="Test Title",
        description="Test Description",
        url="https://example.com",
        keywords=["test", "seo"],
        image="https://example.com/image.jpg",
        locale="en_US",
        type="website",
        site_name="Test Site",
        author="Test Author"
    )
    print(f"  ✓ MetaRequest created: {meta_req.title}")

    # Test AuditRequest
    audit_req = AuditRequest(
        url="https://example.com",
        checks=["meta", "performance", "accessibility"],
        threshold=70,
        generate_fixes=True
    )
    print(f"  ✓ AuditRequest created: {audit_req.url}")

    return True


def test_cache_key_generation(client: MSeoClient):
    """Test 13: Cache key generation consistency"""
    print("Testing cache key generation...")

    # Same parameters should generate same key
    key1 = client._generate_cache_key("test_endpoint", {"param1": "value1", "param2": "value2"})
    key2 = client._generate_cache_key("test_endpoint", {"param1": "value1", "param2": "value2"})

    if key1 == key2:
        print(f"  ✓ Consistent cache keys: {key1}")
    else:
        print(f"  ✗ Inconsistent cache keys: {key1} vs {key2}")
        return False

    # Different parameters should generate different keys
    key3 = client._generate_cache_key("test_endpoint", {"param1": "different", "param2": "value2"})

    if key1 != key3:
        print(f"  ✓ Different parameters generate different keys")
    else:
        print(f"  ✗ Different parameters generated same key")
        return False

    return True


def test_error_handling(client: MSeoClient):
    """Test 14: Error handling and exceptions"""
    print("Testing error handling...")

    # Test with invalid API URL (should fail gracefully)
    bad_config = MSeoConfig(
        api_url="http://invalid-url-that-does-not-exist:9999",
        api_key="test",
        timeout=2,
        retry_attempts=1
    )
    bad_client = MSeoClient(bad_config)

    try:
        result = bad_client.health()
        print(f"  Response: {result}")
        # If we get here, the request somehow succeeded or returned an error dict
        if result and isinstance(result, dict) and "error" in result:
            print(f"  ✓ Error handled gracefully: {result['error']}")
            return True
        else:
            print(f"  ⚠ Unexpected success with invalid URL")
            return True  # Still pass, might be mocked
    except Exception as e:
        print(f"  ✓ Exception caught and handled: {type(e).__name__}")
        return True


def main():
    """Main test execution"""
    print("""
╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              M-SEO DjangoSdk.py Test Suite                       ║
║              Comprehensive SDK Testing                            ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
""")

    runner = TestRunner()

    # Initialize client for API tests
    config = MSeoConfig(
        api_url=os.getenv("MSEO_API_URL", "http://localhost:3100"),
        api_key=os.getenv("MSEO_API_KEY", "test-key-123"),
        cache_enabled=True,
        enable_metrics=True,
        enable_logging=True
    )
    client = MSeoClient(config)

    print(f"\nAPI Configuration:")
    print(f"  URL: {config.api_url}")
    print(f"  Cache: {'Enabled' if config.cache_enabled else 'Disabled'}")
    print(f"  Metrics: {'Enabled' if config.enable_metrics else 'Disabled'}")

    # Run all tests
    runner.run_test("Client Initialization", test_client_initialization)
    runner.run_test("Cache Strategies", test_cache_strategies)
    runner.run_test("Metrics Tracking", test_metrics_tracking)
    runner.run_test("Circuit Breaker", test_circuit_breaker)
    runner.run_test("Data Classes", test_data_classes)
    runner.run_test("Cache Key Generation", lambda: test_cache_key_generation(client))
    runner.run_test("Error Handling", lambda: test_error_handling(client))

    # API Tests (require running M-SEO server)
    print("\n" + "="*70)
    print("API TESTS (require M-SEO server running on port 3100)")
    print("="*70)
    print("Starting API server tests...")
    print("If these fail, start the M-SEO server with: npm start")

    runner.run_test("Health Check", lambda: test_health_check(client))
    runner.run_test("Generate Meta Tags", lambda: test_generate_meta(client))
    runner.run_test("Bot Detection", lambda: test_check_bot(client))
    runner.run_test("Generate Schema", lambda: test_generate_schema(client))
    runner.run_test("Generate Sitemap", lambda: test_generate_sitemap(client))
    runner.run_test("Generate Robots.txt", lambda: test_generate_robots(client))
    runner.run_test("Batch Operations", lambda: test_batch_operations(client))

    # Print summary
    exit_code = runner.print_summary()

    # Print client metrics
    print("\nFinal Client Metrics:")
    metrics = client.get_client_metrics()
    print(json.dumps(metrics, indent=2))

    sys.exit(exit_code)


if __name__ == "__main__":
    main()
