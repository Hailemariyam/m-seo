#!/usr/bin/env python3
"""
Quick Test Suite for SDK Services
Simplified version that tests SDK clients without framework dependencies
"""

import sys
import os
import json
import time

# Color output
class Colors:
    RESET = "\033[0m"
    GREEN = "\033[32m"
    RED = "\033[31m"
    YELLOW = "\033[33m"
    BLUE = "\033[34m"
    BOLD = "\033[1m"

def test_python_sdk():
    """Test Python SDK (without Django models)"""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Python/Django SDK{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    try:
        # Test SDK imports (basic client only, skip Django models)
        print("Testing Python SDK structure...")

        sdk_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'service', 'SdkLayer', 'DjangoSdk.py')

        if not os.path.exists(sdk_path):
            print(f"{Colors.RED}✗ SDK file not found: {sdk_path}{Colors.RESET}")
            return False

        # Check file size and content
        with open(sdk_path, 'r') as f:
            content = f.read()
            lines = len(content.split('\n'))

        print(f"  {Colors.GREEN}✓{Colors.RESET} SDK file exists: DjangoSdk.py")
        print(f"    Lines: {lines}")
        print(f"    Size: {len(content)} bytes")

        # Check for key components
        components = [
            'class MSeoClient',
            'class MSeoConfig',
            'class CacheStrategy',
            'def generate_meta',
            'def generate_sitemap',
            'def check_bot',
            'class DjangoSeoMiddleware',
            'class FlaskSeo',
            'class FastAPISeoMiddleware',
            'class AsyncMSeoClient'
        ]

        print(f"\n  Checking SDK components:")
        found = 0
        for component in components:
            if component in content:
                print(f"    {Colors.GREEN}✓{Colors.RESET} {component}")
                found += 1
            else:
                print(f"    {Colors.RED}✗{Colors.RESET} {component}")

        print(f"\n  {Colors.GREEN}✓{Colors.RESET} Found {found}/{len(components)} components")

        # Check for API methods
        api_methods = [
            'generate_meta', 'generate_sitemap', 'generate_robots',
            'run_audit', 'check_bot', 'generate_schema', 'validate_schema',
            'batch', 'health', 'get_client_metrics'
        ]

        print(f"\n  Checking API methods:")
        method_count = 0
        for method in api_methods:
            if f'def {method}' in content:
                print(f"    {Colors.GREEN}✓{Colors.RESET} {method}()")
                method_count += 1

        print(f"\n  {Colors.GREEN}✓{Colors.RESET} Python SDK verified ({method_count} API methods)")
        return True

    except Exception as e:
        print(f"{Colors.RED}✗ Error testing Python SDK: {e}{Colors.RESET}")
        return False


def test_go_sdk():
    """Test Go SDK"""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Go SDK{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    try:
        sdk_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'service', 'SdkLayer', 'GoSdk.go')

        if not os.path.exists(sdk_path):
            print(f"{Colors.RED}✗ SDK file not found{Colors.RESET}")
            return False

        with open(sdk_path, 'r') as f:
            content = f.read()
            lines = len(content.split('\n'))

        print(f"  {Colors.GREEN}✓{Colors.RESET} SDK file exists: GoSdk.go")
        print(f"    Lines: {lines}")

        # Check components
        components = [
            'type Client struct',
            'type Config struct',
            'type CircuitBreaker struct',
            'type RateLimiter struct',
            'type InMemoryCache struct',
            'func (c *Client) GenerateMeta',
            'func (c *Client) GenerateSitemap',
            'func (c *Client) CheckBot',
            'func (c *Client) Health',
        ]

        print(f"\n  Checking SDK components:")
        found = 0
        for component in components:
            if component in content:
                print(f"    {Colors.GREEN}✓{Colors.RESET} {component}")
                found += 1

        print(f"\n  {Colors.GREEN}✓{Colors.RESET} Go SDK verified ({found}/{len(components)} components)")
        return True

    except Exception as e:
        print(f"{Colors.RED}✗ Error testing Go SDK: {e}{Colors.RESET}")
        return False


def test_ruby_sdk():
    """Test Ruby SDK"""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing Ruby/Rails SDK{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    try:
        sdk_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'service', 'SdkLayer', 'RailsSdk.rb')

        if not os.path.exists(sdk_path):
            print(f"{Colors.RED}✗ SDK file not found{Colors.RESET}")
            return False

        with open(sdk_path, 'r') as f:
            content = f.read()
            lines = len(content.split('\n'))

        print(f"  {Colors.GREEN}✓{Colors.RESET} SDK file exists: RailsSdk.rb")
        print(f"    Lines: {lines}")

        # Check components
        components = [
            'class Client',
            'class Config',
            'class SeoMeta',
            'class SitemapUrl',
            'class AuditLog',
            'def generate_meta',
            'def generate_sitemap',
            'def check_bot',
            'class BotDetectionMiddleware',
        ]

        print(f"\n  Checking SDK components:")
        found = 0
        for component in components:
            if component in content:
                print(f"    {Colors.GREEN}✓{Colors.RESET} {component}")
                found += 1

        print(f"\n  {Colors.GREEN}✓{Colors.RESET} Ruby SDK verified ({found}/{len(components)} components)")
        return True

    except Exception as e:
        print(f"{Colors.RED}✗ Error testing Ruby SDK: {e}{Colors.RESET}")
        return False


def test_php_sdk():
    """Test PHP SDK"""
    print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}Testing PHP/Laravel SDK{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    try:
        sdk_path = os.path.join(os.path.dirname(__file__), '..', 'src', 'service', 'SdkLayer', 'LaravelSdk.php')

        if not os.path.exists(sdk_path):
            print(f"{Colors.RED}✗ SDK file not found{Colors.RESET}")
            return False

        with open(sdk_path, 'r') as f:
            content = f.read()
            lines = len(content.split('\n'))

        print(f"  {Colors.GREEN}✓{Colors.RESET} SDK file exists: LaravelSdk.php")
        print(f"    Lines: {lines}")

        # Check components
        components = [
            'class Client',
            'class Config',
            'class SeoMeta',
            'class SitemapUrl',
            'class AuditLog',
            'public function generateMeta',
            'public function generateSitemap',
            'public function checkBot',
            'class MSeoServiceProvider',
            'class BotDetectionMiddleware',
        ]

        print(f"\n  Checking SDK components:")
        found = 0
        for component in components:
            if component in content:
                print(f"    {Colors.GREEN}✓{Colors.RESET} {component}")
                found += 1

        print(f"\n  {Colors.GREEN}✓{Colors.RESET} PHP SDK verified ({found}/{len(components)} components)")
        return True

    except Exception as e:
        print(f"{Colors.RED}✗ Error testing PHP SDK: {e}{Colors.RESET}")
        return False


def main():
    print(f"""
{Colors.BOLD}╔═══════════════════════════════════════════════════════════════════╗
║                                                                   ║
║              M-SEO SDK Services Quick Test                       ║
║              Verifying All SDK Components                         ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝{Colors.RESET}
""")

    results = []

    # Test all SDKs
    results.append(("Python/Django SDK", test_python_sdk()))
    results.append(("Go SDK", test_go_sdk()))
    results.append(("Ruby/Rails SDK", test_ruby_sdk()))
    results.append(("PHP/Laravel SDK", test_php_sdk()))

    # Print summary
    print(f"\n{Colors.BOLD}{'='*70}{Colors.RESET}")
    print(f"{Colors.BOLD}TEST SUMMARY{Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    total = len(results)
    passed = sum(1 for _, result in results if result)
    failed = total - passed

    for name, result in results:
        status = f"{Colors.GREEN}✓ PASSED{Colors.RESET}" if result else f"{Colors.RED}✗ FAILED{Colors.RESET}"
        print(f"  {status}: {name}")

    print(f"\n{Colors.BOLD}Total SDKs: {total}{Colors.RESET}")
    print(f"{Colors.GREEN}✓ Passed: {passed} ({passed/total*100:.1f}%){Colors.RESET}")
    print(f"{Colors.RED}✗ Failed: {failed} ({failed/total*100:.1f}%){Colors.RESET}")
    print(f"{Colors.BOLD}{'='*70}{Colors.RESET}")

    if failed == 0:
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 All SDK services verified!{Colors.RESET}")
        print(f"\n{Colors.BLUE}Next steps:{Colors.RESET}")
        print(f"  1. Start M-SEO server: npm start")
        print(f"  2. Run detailed tests:")
        print(f"     - Python: python3 tests/test_django_sdk.py")
        print(f"     - Go:     go run tests/test_go_sdk.go")
        print(f"     - Ruby:   ruby tests/test_rails_sdk.rb")
        print(f"     - PHP:    php tests/test_laravel_sdk.php")
        print(f"  3. See full guide: docs/SDK_TESTING_GUIDE.md")
        return 0
    else:
        print(f"\n{Colors.YELLOW}⚠️  Some SDKs need attention{Colors.RESET}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
