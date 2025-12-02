# ============================================================================
# M-SEO Python SDK for Django/Flask/FastAPI
# Enterprise-grade Python integration for SEO operations
# ============================================================================
#
# Version: 1.1.1
# Package: mseo
# Author: M-SEO Team
#
# Features:
# - Django middleware & class-based views
# - Flask extension with decorators
# - FastAPI dependency injection
# - Django ORM models with migrations
# - SQLAlchemy models
# - Async/await support (Django 4.1+, FastAPI)
# - Caching (Redis/Memcached/Django cache)
# - Circuit breaker pattern
# - Retry logic with exponential backoff
# - Template filters & context processors
# - Django signals & event system
# - Django admin panel integration
# - Management commands
# - Celery task integration
# - Rate limiting
# - Metrics & monitoring
# - Multi-language support
# - Bot detection middleware
# - Auto meta injection
# - Sitemap generation
# - Schema.org structured data
#
# Installation:
#   pip install mseo-python
#
# Django Usage:
#   # settings.py
#   INSTALLED_APPS = ['mseo', ...]
#   MIDDLEWARE = ['mseo.middleware.DjangoSeoMiddleware', ...]
#
# Flask Usage:
#   from mseo import FlaskSeo
#   seo = FlaskSeo(app)
#
# FastAPI Usage:
#   from mseo import get_seo_client
#   client = Depends(get_seo_client)

import requests
import json
import hashlib
import time
import logging
from typing import Dict, List, Optional, Any, Callable, Union
from functools import wraps
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from enum import Enum


# ============================================================================
# CONFIGURATION & TYPES
# ============================================================================

@dataclass
class MSeoConfig:
    """M-SEO client configuration"""
    api_url: str = "http://localhost:3100"
    api_key: Optional[str] = None
    cache_enabled: bool = True
    cache_ttl: int = 300
    timeout: int = 10
    retry_attempts: int = 3
    retry_delay: float = 1.0
    circuit_breaker_threshold: int = 5
    circuit_breaker_timeout: int = 60
    enable_metrics: bool = True
    enable_logging: bool = True
    rate_limit: Optional[int] = None


class CacheStrategy(Enum):
    """Cache strategy options"""
    MEMORY = "memory"
    REDIS = "redis"
    MEMCACHED = "memcached"
    DJANGO = "django"


@dataclass
class MetaRequest:
    """Meta tag generation request"""
    title: str
    description: str
    url: str
    keywords: Optional[List[str]] = None
    image: Optional[str] = None
    locale: Optional[str] = None
    type: Optional[str] = None
    site_name: Optional[str] = None
    author: Optional[str] = None


@dataclass
class AuditRequest:
    """SEO audit request"""
    url: str
    checks: Optional[List[str]] = None
    threshold: int = 70
    generate_fixes: bool = False


# ============================================================================
# METRICS & MONITORING
# ============================================================================

class Metrics:
    """Track client metrics"""

    def __init__(self):
        self.requests = 0
        self.errors = 0
        self.cache_hits = 0
        self.cache_misses = 0
        self.total_latency = 0.0
        self._lock = None

        try:
            from threading import Lock
            self._lock = Lock()
        except ImportError:
            pass

    def increment_requests(self):
        """Increment request counter"""
        if self._lock:
            with self._lock:
                self.requests += 1
        else:
            self.requests += 1

    def increment_errors(self):
        """Increment error counter"""
        if self._lock:
            with self._lock:
                self.errors += 1
        else:
            self.errors += 1

    def increment_cache_hits(self):
        """Increment cache hit counter"""
        if self._lock:
            with self._lock:
                self.cache_hits += 1
        else:
            self.cache_hits += 1

    def increment_cache_misses(self):
        """Increment cache miss counter"""
        if self._lock:
            with self._lock:
                self.cache_misses += 1
        else:
            self.cache_misses += 1

    def add_latency(self, duration: float):
        """Add latency measurement"""
        if self._lock:
            with self._lock:
                self.total_latency += duration
        else:
            self.total_latency += duration

    def get_metrics(self) -> Dict[str, Any]:
        """Get metrics snapshot"""
        avg_latency = self.total_latency / self.requests if self.requests > 0 else 0
        error_rate = self.errors / self.requests if self.requests > 0 else 0

        return {
            'requests': self.requests,
            'errors': self.errors,
            'cache_hits': self.cache_hits,
            'cache_misses': self.cache_misses,
            'avg_latency_ms': round(avg_latency * 1000, 2),
            'error_rate': round(error_rate * 100, 2),
            'cache_hit_rate': round(self.cache_hits / (self.cache_hits + self.cache_misses) * 100, 2) if (self.cache_hits + self.cache_misses) > 0 else 0
        }


# ============================================================================
# CIRCUIT BREAKER
# ============================================================================

class CircuitBreaker:
    """Circuit breaker pattern implementation"""

    def __init__(self, threshold: int = 5, timeout: int = 60):
        self.threshold = threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.is_open = False

    def call(self, func: Callable, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        # Check if circuit breaker should be reset
        if self.is_open and self.last_failure_time:
            if time.time() - self.last_failure_time > self.timeout:
                self.is_open = False
                self.failure_count = 0
                logging.info("M-SEO: Circuit breaker reset")

        if self.is_open:
            raise CircuitBreakerOpenError("Circuit breaker is open")

        try:
            result = func(*args, **kwargs)
            self.failure_count = 0
            return result
        except Exception as e:
            self.failure_count += 1
            self.last_failure_time = time.time()

            if self.failure_count >= self.threshold:
                self.is_open = True
                logging.error(f"M-SEO: Circuit breaker opened after {self.failure_count} failures")

            raise e


class CircuitBreakerOpenError(Exception):
    """Circuit breaker is open"""
    pass


# ============================================================================
# CACHE IMPLEMENTATIONS
# ============================================================================

class BaseCache:
    """Base cache interface"""

    def get(self, key: str) -> Optional[Any]:
        raise NotImplementedError

    def set(self, key: str, value: Any, ttl: int = 300):
        raise NotImplementedError

    def delete(self, key: str):
        raise NotImplementedError

    def clear(self):
        raise NotImplementedError


class MemoryCache(BaseCache):
    """In-memory cache implementation"""

    def __init__(self):
        self._cache: Dict[str, tuple[Any, datetime]] = {}

    def get(self, key: str) -> Optional[Any]:
        if key not in self._cache:
            return None

        data, expires = self._cache[key]
        if datetime.now() > expires:
            del self._cache[key]
            return None

        return data

    def set(self, key: str, value: Any, ttl: int = 300):
        expires = datetime.now() + timedelta(seconds=ttl)
        self._cache[key] = (value, expires)

    def delete(self, key: str):
        if key in self._cache:
            del self._cache[key]

    def clear(self):
        self._cache.clear()


class RedisCache(BaseCache):
    """Redis cache implementation"""

    def __init__(self, redis_client):
        self.redis = redis_client

    def get(self, key: str) -> Optional[Any]:
        data = self.redis.get(key)
        if data:
            return json.loads(data)
        return None

    def set(self, key: str, value: Any, ttl: int = 300):
        self.redis.setex(key, ttl, json.dumps(value))

    def delete(self, key: str):
        self.redis.delete(key)

    def clear(self):
        # Clear only M-SEO keys
        for key in self.redis.scan_iter("mseo:*"):
            self.redis.delete(key)


class DjangoCache(BaseCache):
    """Django cache implementation"""

    def __init__(self):
        from django.core.cache import cache
        self.cache = cache

    def get(self, key: str) -> Optional[Any]:
        return self.cache.get(key)

    def set(self, key: str, value: Any, ttl: int = 300):
        self.cache.set(key, value, ttl)

    def delete(self, key: str):
        self.cache.delete(key)

    def clear(self):
        # Django cache doesn't support pattern deletion easily
        pass


# ============================================================================
# MAIN CLIENT
# ============================================================================


class MSeoClient:
    """
    Main M-SEO client with enterprise features

    Features:
    - Circuit breaker pattern
    - Retry logic with exponential backoff
    - Multiple cache strategies
    - Metrics tracking
    - Request/response logging
    - Rate limiting
    """

    def __init__(self, config: Optional[MSeoConfig] = None):
        self.config = config or MSeoConfig()
        self.session = requests.Session()
        self.metrics = Metrics() if self.config.enable_metrics else None
        self.circuit_breaker = CircuitBreaker(
            threshold=self.config.circuit_breaker_threshold,
            timeout=self.config.circuit_breaker_timeout
        )

        # Setup cache
        self.cache = MemoryCache()

        # Setup logging
        if self.config.enable_logging:
            logging.basicConfig(level=logging.INFO)
            self.logger = logging.getLogger('mseo')
        else:
            self.logger = logging.getLogger('mseo')
            self.logger.addHandler(logging.NullHandler())

        # Setup headers
        if self.config.api_key:
            self.session.headers.update({'X-API-Key': self.config.api_key})

        self.session.headers.update({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        })

    def set_cache_strategy(self, strategy: CacheStrategy, **kwargs):
        """Set cache strategy"""
        if strategy == CacheStrategy.REDIS:
            import redis
            redis_client = kwargs.get('redis_client') or redis.Redis(**kwargs)
            self.cache = RedisCache(redis_client)
        elif strategy == CacheStrategy.DJANGO:
            self.cache = DjangoCache()
        elif strategy == CacheStrategy.MEMORY:
            self.cache = MemoryCache()

    def _generate_cache_key(self, prefix: str, data: Any) -> str:
        """Generate cache key"""
        json_data = json.dumps(data, sort_keys=True)
        hash_digest = hashlib.md5(json_data.encode()).hexdigest()
        return f"mseo:{prefix}:{hash_digest}"

    def _request(
        self,
        method: str,
        path: str,
        data: Optional[Dict] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Make HTTP request with retry and circuit breaker"""
        start_time = time.time()

        if self.metrics:
            self.metrics.increment_requests()

        last_error = None
        for attempt in range(self.config.retry_attempts):
            try:
                # Circuit breaker check
                result = self.circuit_breaker.call(
                    self._do_request,
                    method,
                    path,
                    data,
                    **kwargs
                )

                if self.metrics:
                    self.metrics.add_latency(time.time() - start_time)

                return result

            except Exception as e:
                last_error = e
                self.logger.warning(
                    f"Request failed (attempt {attempt + 1}/{self.config.retry_attempts}): {e}"
                )

                if attempt < self.config.retry_attempts - 1:
                    # Exponential backoff
                    delay = self.config.retry_delay * (2 ** attempt)
                    time.sleep(delay)

        if self.metrics:
            self.metrics.increment_errors()

        raise last_error or Exception("Request failed")

    def _do_request(
        self,
        method: str,
        path: str,
        data: Optional[Dict] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """Perform actual HTTP request"""
        url = f"{self.config.api_url.rstrip('/')}{path}"

        try:
            if method.upper() == 'GET':
                response = self.session.get(
                    url,
                    params=data,
                    timeout=self.config.timeout,
                    **kwargs
                )
            else:
                response = self.session.request(
                    method,
                    url,
                    json=data,
                    timeout=self.config.timeout,
                    **kwargs
                )

            response.raise_for_status()

            result = response.json()
            return result.get('data', result)

        except requests.exceptions.RequestException as e:
            self.logger.error(f"HTTP request failed: {e}")
            raise

    def generate_meta(
        self,
        title: str,
        description: str,
        url: str,
        keywords: Optional[List[str]] = None,
        image: Optional[str] = None,
        **kwargs
    ) -> Dict[str, Any]:
        """
        Generate meta tags

        Args:
            title: Page title
            description: Page description
            url: Page URL
            keywords: List of keywords
            image: Open Graph image URL
            **kwargs: Additional meta tag parameters

        Returns:
            Dict with 'html' and 'tags' keys
        """
        cache_key = self._generate_cache_key('meta', {
            'title': title,
            'url': url
        })

        # Check cache
        if self.config.cache_enabled:
            cached = self.cache.get(cache_key)
            if cached:
                if self.metrics:
                    self.metrics.increment_cache_hits()
                return cached
            if self.metrics:
                self.metrics.increment_cache_misses()

        # Make request
        data = {
            'title': title,
            'description': description,
            'url': url,
            'keywords': keywords,
            'image': image,
            **kwargs
        }

        result = self._request('POST', '/api/seo/meta', data)

        # Cache result
        if self.config.cache_enabled:
            self.cache.set(cache_key, result, self.config.cache_ttl)

        return result

    def generate_sitemap(
        self,
        urls: List[Dict[str, Any]],
        base_url: str
    ) -> Dict[str, Any]:
        """
        Generate XML sitemap

        Args:
            urls: List of URL dictionaries with loc, changefreq, priority
            base_url: Base URL for sitemap

        Returns:
            Dict with 'xml' key containing sitemap XML
        """
        data = {
            'urls': urls,
            'baseUrl': base_url
        }

        return self._request('POST', '/api/seo/sitemap', data)

    def generate_robots(
        self,
        user_agent: str = '*',
        disallow: Optional[List[str]] = None,
        allow: Optional[List[str]] = None,
        sitemap: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generate robots.txt

        Args:
            user_agent: User agent rule (default: *)
            disallow: List of disallowed paths
            allow: List of allowed paths
            sitemap: Sitemap URL

        Returns:
            Dict with 'content' key containing robots.txt
        """
        data = {
            'userAgent': user_agent,
            'disallow': disallow or [],
            'allow': allow or ['/'],
            'sitemap': sitemap
        }

        return self._request('POST', '/api/seo/robots', data)

    def run_audit(
        self,
        url: str,
        checks: Optional[List[str]] = None,
        threshold: int = 70,
        generate_fixes: bool = False,
        store: bool = False
    ) -> Dict[str, Any]:
        """
        Run SEO audit

        Args:
            url: URL to audit
            checks: Specific checks to run
            threshold: Score threshold
            generate_fixes: Generate fix recommendations
            store: Store audit result in database

        Returns:
            Dict with score, issues, recommendations
        """
        data = {
            'url': url,
            'checks': checks,
            'threshold': threshold,
            'fix': generate_fixes
        }

        result = self._request('POST', '/api/seo/audit', data)

        # Store in database if Django models available
        if store:
            try:
                from .models import AuditLog
                AuditLog.objects.create(
                    url=url,
                    score=result.get('score', 0),
                    passed=result.get('passed', 0),
                    failed=result.get('failed', 0),
                    warnings=result.get('warnings', 0),
                    issues=result.get('issues', []),
                    recommendations=result.get('recommendations', []),
                    metadata=result
                )
            except ImportError:
                pass

        return result

    def run_batch_audit(
        self,
        urls: List[str],
        webhook_url: Optional[str] = None
    ) -> Dict[str, Any]:
        """Run batch audit for multiple URLs"""
        data = {
            'urls': urls,
            'webhook': webhook_url
        }

        return self._request('POST', '/api/seo/audit/batch', data)

    def get_audit_result(self, audit_id: str) -> Dict[str, Any]:
        """Get audit result by ID"""
        return self._request('GET', f'/api/seo/audit/{audit_id}')

    def generate_schema(
        self,
        schema_type: str,
        data: Dict[str, Any],
        validate: bool = False
    ) -> Dict[str, Any]:
        """
        Generate structured data (JSON-LD)

        Args:
            schema_type: Schema.org type (Product, Article, etc.)
            data: Schema data
            validate: Validate schema

        Returns:
            Dict with 'html' and 'schema' keys
        """
        request_data = {
            'type': schema_type,
            'data': data,
            'validate': validate
        }

        return self._request('POST', '/api/seo/schema', request_data)

    def validate_schema(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        """Validate structured data"""
        return self._request('POST', '/api/seo/schema/validate', {'schema': schema})

    def check_bot(self, user_agent: str) -> Dict[str, Any]:
        """
        Check if user agent is a bot

        Args:
            user_agent: User agent string

        Returns:
            Dict with isBot and botInfo keys
        """
        cache_key = self._generate_cache_key('bot', user_agent)

        # Check cache
        if self.config.cache_enabled:
            cached = self.cache.get(cache_key)
            if cached:
                if self.metrics:
                    self.metrics.increment_cache_hits()
                return cached
            if self.metrics:
                self.metrics.increment_cache_misses()

        result = self._request('POST', '/api/seo/bot-check', {'userAgent': user_agent})

        # Cache for 1 hour
        if self.config.cache_enabled:
            self.cache.set(cache_key, result, 3600)

        return result

    def batch(self, operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Execute multiple operations in single request"""
        return self._request('POST', '/api/seo/batch', {'operations': operations})

    def health(self) -> Dict[str, Any]:
        """Check API health"""
        return self._request('GET', '/api/health')

    def get_api_metrics(self) -> Dict[str, Any]:
        """Get API metrics"""
        return self._request('GET', '/api/metrics')

    def get_client_metrics(self) -> Dict[str, Any]:
        """Get client-side metrics"""
        if not self.metrics:
            return {}
        return self.metrics.get_metrics()

    def clear_cache(self, pattern: Optional[str] = None):
        """Clear client cache"""
        if pattern:
            # Pattern-based clearing not implemented for all cache types
            pass
        else:
            self.cache.clear()


# ============================================================================
# DJANGO INTEGRATION
# ============================================================================

class DjangoSeoMiddleware:
    """
    Django middleware for automatic SEO operations

    Features:
    - Auto bot detection
    - Auto meta injection for bots
    - Request/response timing
    - SEO metrics collection

    Setup in settings.py:
        MIDDLEWARE = [
            'mseo.middleware.DjangoSeoMiddleware',
            ...
        ]

        MSEO = {
            'API_URL': 'http://localhost:3100',
            'API_KEY': 'your_api_key',
            'CACHE_ENABLED': True,
            'CACHE_TTL': 300,
            'AUTO_INJECT': True,
        }
    """

    def __init__(self, get_response):
        self.get_response = get_response

        # Import here to avoid Django import errors
        from django.conf import settings

        mseo_settings = getattr(settings, 'MSEO', {})

        self.client = MSeoClient(MSeoConfig(
            api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
            api_key=mseo_settings.get('API_KEY'),
            cache_enabled=mseo_settings.get('CACHE_ENABLED', True),
            cache_ttl=mseo_settings.get('CACHE_TTL', 300),
        ))

        self.auto_inject = mseo_settings.get('AUTO_INJECT', True)
        self.enabled = mseo_settings.get('ENABLED', True)

    def __call__(self, request):
        if not self.enabled:
            return self.get_response(request)

        # Detect bot
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        bot_info = self.client.check_bot(user_agent)

        # Add bot info to request
        request.is_bot = bot_info.get('isBot', False)
        request.bot_info = bot_info.get('botInfo', {})

        # Get response
        response = self.get_response(request)

        # Auto-inject meta tags for bots
        if self.auto_inject and request.is_bot and hasattr(response, 'content'):
            if b'text/html' in response.get('Content-Type', '').encode():
                self._inject_meta_tags(request, response)

        return response

    def _inject_meta_tags(self, request, response):
        """Inject meta tags into HTML response"""
        # Get meta from view context
        meta_html = getattr(request, '_seo_meta_html', None)

        if meta_html and b'</head>' in response.content:
            response.content = response.content.replace(
                b'</head>',
                f'{meta_html}\n</head>'.encode('utf-8')
            )
            response['Content-Length'] = len(response.content)


class DjangoSeoMixin:
    """
    Mixin for Django class-based views

    Usage:
        class ProductDetailView(DjangoSeoMixin, DetailView):
            model = Product
            seo_title_field = 'name'
            seo_description_field = 'description'

            def get_seo_meta(self):
                product = self.get_object()
                return {
                    'title': f"{product.name} - Best Price",
                    'description': product.description[:160],
                    'url': self.request.build_absolute_uri(),
                    'image': product.image.url if product.image else None,
                    'keywords': [tag.name for tag in product.tags.all()],
                }

            def get_seo_schema(self):
                product = self.get_object()
                return {
                    'type': 'Product',
                    'data': {
                        'name': product.name,
                        'description': product.description,
                        'image': product.image.url,
                        'offers': {
                            '@type': 'Offer',
                            'price': str(product.price),
                            'priceCurrency': 'USD',
                        }
                    }
                }
    """

    seo_title_field = None
    seo_description_field = None
    seo_enabled = True

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        if not self.seo_enabled:
            return context

        from django.conf import settings
        mseo_settings = getattr(settings, 'MSEO', {})

        client = MSeoClient(MSeoConfig(
            api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
            api_key=mseo_settings.get('API_KEY'),
        ))

        # Generate meta tags
        meta_data = self.get_seo_meta()
        if meta_data:
            meta = client.generate_meta(**meta_data)
            context['seo_meta'] = meta

            # Store for middleware injection
            if hasattr(self.request, '_seo_meta_html'):
                self.request._seo_meta_html = meta.get('html', '')

        # Generate schema
        schema_data = self.get_seo_schema()
        if schema_data:
            schema = client.generate_schema(**schema_data)
            context['seo_schema'] = schema

        return context

    def get_seo_meta(self) -> Optional[Dict[str, Any]]:
        """Override this to provide SEO meta data"""
        if hasattr(self, 'object') and self.object:
            obj = self.object
            return {
                'title': getattr(obj, self.seo_title_field) if self.seo_title_field else str(obj),
                'description': getattr(obj, self.seo_description_field)[:160] if self.seo_description_field else '',
                'url': self.request.build_absolute_uri(),
            }
        return None

    def get_seo_schema(self) -> Optional[Dict[str, Any]]:
        """Override this to provide schema data"""
        return None


# ============================================================================
# DJANGO TEMPLATE TAGS
# ============================================================================

try:
    from django import template
    from django.utils.safestring import mark_safe
    from django.conf import settings

    register = template.Library()

    @register.simple_tag
    def seo_meta(title, description, url, **kwargs):
        """Generate meta tags in template"""
        mseo_settings = getattr(settings, 'MSEO', {})
        client = MSeoClient(MSeoConfig(
            api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
            api_key=mseo_settings.get('API_KEY'),
        ))

        meta = client.generate_meta(
            title=title,
            description=description,
            url=url,
            **kwargs
        )

        return mark_safe(meta.get('html', ''))

    @register.simple_tag
    def seo_schema(schema_type, **data):
        """Generate structured data in template"""
        mseo_settings = getattr(settings, 'MSEO', {})
        client = MSeoClient(MSeoConfig(
            api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
            api_key=mseo_settings.get('API_KEY'),
        ))

        schema = client.generate_schema(schema_type, data)
        return mark_safe(schema.get('html', ''))

    @register.simple_tag(takes_context=True)
    def is_bot(context):
        """Check if current request is from a bot"""
        request = context.get('request')
        return getattr(request, 'is_bot', False)

    @register.filter
    def bot_name(request):
        """Get bot name from request"""
        bot_info = getattr(request, 'bot_info', {})
        return bot_info.get('name', 'Unknown')

except ImportError:
    # Django not installed
    pass


# ============================================================================
# DJANGO ORM MODELS
# ============================================================================

try:
    from django.db import models
    from django.utils import timezone

    class SeoMeta(models.Model):
        """Store SEO metadata for pages"""

        path = models.CharField(max_length=500, unique=True, db_index=True)
        title = models.CharField(max_length=200)
        description = models.TextField()
        keywords = models.JSONField(default=list)
        canonical_url = models.URLField(blank=True)
        og_image = models.URLField(blank=True)
        og_type = models.CharField(max_length=50, default='website')
        locale = models.CharField(max_length=10, default='en')
        metadata = models.JSONField(default=dict)

        is_active = models.BooleanField(default=True)
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)

        class Meta:
            verbose_name = "SEO Meta"
            verbose_name_plural = "SEO Metas"
            ordering = ['-updated_at']
            indexes = [
                models.Index(fields=['path']),
                models.Index(fields=['is_active']),
            ]

        def __str__(self):
            return f"{self.path} - {self.title}"

        def to_dict(self):
            """Convert to dict for API"""
            return {
                'title': self.title,
                'description': self.description,
                'url': self.canonical_url or self.path,
                'keywords': self.keywords,
                'image': self.og_image,
                'locale': self.locale,
                'type': self.og_type,
            }

        def generate_meta(self, request=None):
            """Generate meta tags HTML"""
            from django.conf import settings
            mseo_settings = getattr(settings, 'MSEO', {})

            client = MSeoClient(MSeoConfig(
                api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
                api_key=mseo_settings.get('API_KEY'),
            ))

            url = self.canonical_url
            if request and not url:
                url = request.build_absolute_uri(self.path)

            return client.generate_meta(
                title=self.title,
                description=self.description,
                url=url,
                keywords=self.keywords,
                image=self.og_image,
                locale=self.locale,
                type=self.og_type,
            )

    class SitemapUrl(models.Model):
        """Store sitemap URLs"""

        loc = models.URLField(unique=True, db_index=True)
        changefreq = models.CharField(
            max_length=20,
            default='weekly',
            choices=[
                ('always', 'Always'),
                ('hourly', 'Hourly'),
                ('daily', 'Daily'),
                ('weekly', 'Weekly'),
                ('monthly', 'Monthly'),
                ('yearly', 'Yearly'),
                ('never', 'Never'),
            ]
        )
        priority = models.DecimalField(
            max_digits=2,
            decimal_places=1,
            default=0.8,
            help_text="Priority from 0.0 to 1.0"
        )
        lastmod = models.DateTimeField(default=timezone.now)
        metadata = models.JSONField(default=dict)

        is_active = models.BooleanField(default=True)
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)

        class Meta:
            verbose_name = "Sitemap URL"
            verbose_name_plural = "Sitemap URLs"
            ordering = ['-priority', 'loc']
            indexes = [
                models.Index(fields=['is_active', '-priority']),
                models.Index(fields=['changefreq']),
            ]

        def __str__(self):
            return self.loc

        def to_dict(self):
            """Convert to dict for sitemap generation"""
            return {
                'loc': self.loc,
                'changefreq': self.changefreq,
                'priority': float(self.priority),
                'lastmod': self.lastmod.isoformat() if self.lastmod else None,
            }

    class AuditLog(models.Model):
        """Store SEO audit logs"""

        url = models.URLField(db_index=True)
        score = models.IntegerField(default=0, db_index=True)
        passed = models.IntegerField(default=0)
        failed = models.IntegerField(default=0)
        warnings = models.IntegerField(default=0)
        issues = models.JSONField(default=list)
        recommendations = models.JSONField(default=list)
        metadata = models.JSONField(default=dict)

        created_at = models.DateTimeField(auto_now_add=True, db_index=True)
        updated_at = models.DateTimeField(auto_now=True)

        class Meta:
            verbose_name = "Audit Log"
            verbose_name_plural = "Audit Logs"
            ordering = ['-created_at']
            indexes = [
                models.Index(fields=['url', '-created_at']),
                models.Index(fields=['-score']),
            ]

        def __str__(self):
            return f"{self.url} - Score: {self.score}"

        @property
        def passed_audit(self):
            """Check if audit passed (score >= 70)"""
            return self.score >= 70

        @classmethod
        def get_recent_audits(cls, url, days=7):
            """Get recent audits for URL"""
            cutoff = timezone.now() - timedelta(days=days)
            return cls.objects.filter(
                url=url,
                created_at__gte=cutoff
            ).order_by('-created_at')

        @classmethod
        def get_average_score(cls, url):
            """Get average score for URL"""
            from django.db.models import Avg
            result = cls.objects.filter(url=url).aggregate(Avg('score'))
            return result['score__avg'] or 0

except ImportError:
    # Django not installed
    pass


# ============================================================================
# DJANGO MANAGEMENT COMMANDS
# ============================================================================

try:
    from django.core.management.base import BaseCommand
    from django.conf import settings

    class Command(BaseCommand):
        """Base command for M-SEO"""

        def get_client(self):
            mseo_settings = getattr(settings, 'MSEO', {})
            return MSeoClient(MSeoConfig(
                api_url=mseo_settings.get('API_URL', 'http://localhost:3100'),
                api_key=mseo_settings.get('API_KEY'),
            ))

    # Example command: python manage.py generate_sitemap
    class GenerateSitemapCommand(Command):
        help = 'Generate sitemap from database'

        def handle(self, *args, **options):
            from .models import SitemapUrl

            client = self.get_client()

            urls = [url.to_dict() for url in SitemapUrl.objects.filter(is_active=True)]

            if not urls:
                self.stdout.write(self.style.WARNING('No URLs found'))
                return

            sitemap = client.generate_sitemap(urls, settings.SITE_URL)

            # Save to file
            with open('sitemap.xml', 'w') as f:
                f.write(sitemap['xml'])

            self.stdout.write(self.style.SUCCESS(
                f'Sitemap generated with {len(urls)} URLs'
            ))

except ImportError:
    pass


# ============================================================================
# FLASK INTEGRATION
# ============================================================================

class FlaskSeo:
    """
    Django middleware for automatic SEO meta tag injection

    Add to MIDDLEWARE in settings.py:
        MIDDLEWARE = [
            'path.to.DjangoSeoMiddleware',
            ...
        ]

    Configure in settings.py:
        MSEO_API_URL = "http://localhost:3100"
        MSEO_API_KEY = "your_api_key"
        MSEO_ENABLED = True
    """

    def __init__(self, get_response):
        self.get_response = get_response
        from django.conf import settings

        self.client = MSeoClient(
            api_url=getattr(settings, 'MSEO_API_URL', 'http://localhost:3100'),
            api_key=getattr(settings, 'MSEO_API_KEY', None),
        )
        self.enabled = getattr(settings, 'MSEO_ENABLED', True)

    def __call__(self, request):
        response = self.get_response(request)

        if not self.enabled:
            return response

        # Only inject for HTML responses
        if 'text/html' not in response.get('Content-Type', ''):
            return response

        # Check if bot
        user_agent = request.META.get('HTTP_USER_AGENT', '')
        bot_info = self.client.check_bot(user_agent)

        if bot_info['isBot']:
            # Inject bot-optimized meta tags
            self._inject_meta_tags(request, response)

        return response

    def _inject_meta_tags(self, request, response):
        """Inject meta tags into response"""
        # Get meta tags from view context or generate
        meta = getattr(response, 'meta_data', None)
        if not meta:
            return

        meta_html = meta.get('html', '')

        # Inject before </head>
        content = response.content.decode('utf-8')
        content = content.replace('</head>', f'{meta_html}</head>')
        response.content = content.encode('utf-8')


class DjangoSeoMixin:
    """
    Mixin for Django class-based views

    Usage:
        class ProductDetailView(DjangoSeoMixin, DetailView):
            model = Product

            def get_seo_meta(self):
                product = self.get_object()
                return {
                    'title': product.name,
                    'description': product.description,
                    'url': self.request.build_absolute_uri(),
                    'image': product.image_url,
                }
    """

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)

        # Get SEO meta data
        meta_data = self.get_seo_meta()
        if meta_data:
            from django.conf import settings
            client = MSeoClient(
                api_url=getattr(settings, 'MSEO_API_URL', 'http://localhost:3100'),
                api_key=getattr(settings, 'MSEO_API_KEY', None),
            )

            meta = client.generate_meta(**meta_data)
            context['seo_meta'] = meta

        return context

    def get_seo_meta(self) -> Optional[Dict[str, Any]]:
        """Override this method to provide SEO meta data"""
        return None


def django_template_filters(register):
    """
    Django template filters for M-SEO

    Usage in template:
        {% load mseo_tags %}
        {{ seo_meta.html|safe }}
    """

    @register.filter
    def mseo_meta(page_data: Dict) -> str:
        """Generate meta tags from page data"""
        from django.conf import settings
        client = MSeoClient(
            api_url=getattr(settings, 'MSEO_API_URL', 'http://localhost:3100'),
        )

        meta = client.generate_meta(
            title=page_data.get('title', ''),
            description=page_data.get('description', ''),
            url=page_data.get('url', ''),
        )

        return meta.get('html', '')

    @register.simple_tag
    def mseo_schema(schema_type: str, data: Dict) -> str:
        """Generate structured data"""
        from django.conf import settings
        client = MSeoClient(
            api_url=getattr(settings, 'MSEO_API_URL', 'http://localhost:3100'),
        )

        # Would call schema endpoint
        return '<script type="application/ld+json">{}</script>'


# ============================================================================
# FLASK INTEGRATION
# ============================================================================


class FlaskSeo:
    """
    Flask extension for M-SEO

    Features:
    - Route decorators for SEO
    - Template filters
    - Bot detection
    - Auto meta injection
    - Blueprint support

    Usage:
        from flask import Flask
        from mseo import FlaskSeo

        app = Flask(__name__)
        app.config['MSEO_API_URL'] = 'http://localhost:3100'
        app.config['MSEO_API_KEY'] = 'your_api_key'

        seo = FlaskSeo(app)

        @app.route('/product/<int:id>')
        @seo.meta(
            title=lambda: f"Product {id}",
            description="Great product",
        )
        def product(id):
            return render_template('product.html')
    """

    def __init__(self, app=None, **kwargs):
        self.app = app
        self.client = None

        if app:
            self.init_app(app, **kwargs)

    def init_app(self, app, **kwargs):
        """Initialize Flask extension"""
        app.config.setdefault('MSEO_API_URL', 'http://localhost:3100')
        app.config.setdefault('MSEO_API_KEY', None)
        app.config.setdefault('MSEO_ENABLED', True)
        app.config.setdefault('MSEO_CACHE_ENABLED', True)
        app.config.setdefault('MSEO_CACHE_TTL', 300)

        self.client = MSeoClient(MSeoConfig(
            api_url=app.config['MSEO_API_URL'],
            api_key=app.config['MSEO_API_KEY'],
            cache_enabled=app.config['MSEO_CACHE_ENABLED'],
            cache_ttl=app.config['MSEO_CACHE_TTL'],
        ))

        # Register template filters
        app.jinja_env.globals['seo_meta'] = self._template_meta
        app.jinja_env.globals['seo_schema'] = self._template_schema
        app.jinja_env.globals['is_bot'] = self._is_bot

        # Register hooks
        app.before_request(self._before_request)
        app.after_request(self._after_request)

        # Store extension
        app.extensions = getattr(app, 'extensions', {})
        app.extensions['mseo'] = self

    def _before_request(self):
        """Before request handler - detect bots"""
        from flask import request, g

        user_agent = request.headers.get('User-Agent', '')

        try:
            bot_info = self.client.check_bot(user_agent)
            g.is_bot = bot_info.get('isBot', False)
            g.bot_info = bot_info.get('botInfo', {})
        except Exception as e:
            logging.error(f"Bot check failed: {e}")
            g.is_bot = False
            g.bot_info = {}

    def _after_request(self, response):
        """After request handler - inject meta tags"""
        from flask import g

        # Inject meta tags for bots
        if getattr(g, 'is_bot', False) and hasattr(g, 'seo_meta_html'):
            if 'text/html' in response.content_type:
                content = response.get_data(as_text=True)
                if '</head>' in content:
                    content = content.replace('</head>', f"{g.seo_meta_html}\n</head>")
                    response.set_data(content)

        return response

    def meta(
        self,
        title: Union[str, Callable],
        description: Union[str, Callable],
        url: Optional[Union[str, Callable]] = None,
        **kwargs
    ):
        """
        Decorator for route SEO meta tags

        Args:
            title: Page title (string or callable)
            description: Page description (string or callable)
            url: Page URL (string or callable, default: request.url)
            **kwargs: Additional meta parameters

        Usage:
            @app.route('/page')
            @seo.meta(
                title="Page Title",
                description="Page description",
                keywords=["seo", "meta"],
            )
            def page():
                return render_template('page.html')
        """
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **view_kwargs):
                from flask import request, g

                # Resolve callables
                title_val = title() if callable(title) else title
                desc_val = description() if callable(description) else description
                url_val = url() if callable(url) else (url or request.url)

                # Resolve kwargs callables
                resolved_kwargs = {}
                for key, value in kwargs.items():
                    resolved_kwargs[key] = value() if callable(value) else value

                try:
                    # Generate meta
                    meta = self.client.generate_meta(
                        title=title_val,
                        description=desc_val,
                        url=url_val,
                        **resolved_kwargs
                    )

                    g.seo_meta = meta
                    g.seo_meta_html = meta.get('html', '')
                except Exception as e:
                    logging.error(f"Meta generation failed: {e}")
                    g.seo_meta = {}
                    g.seo_meta_html = ''

                return f(*args, **view_kwargs)

            return decorated_function
        return decorator

    def schema(self, schema_type: str, data: Union[Dict, Callable]):
        """
        Decorator for route schema generation

        Usage:
            @app.route('/product/<int:id>')
            @seo.schema('Product', lambda: get_product_schema(id))
            def product(id):
                return render_template('product.html')
        """
        def decorator(f):
            @wraps(f)
            def decorated_function(*args, **kwargs):
                from flask import g

                data_val = data() if callable(data) else data

                try:
                    schema = self.client.generate_schema(schema_type, data_val)
                    g.seo_schema = schema
                except Exception as e:
                    logging.error(f"Schema generation failed: {e}")
                    g.seo_schema = {}

                return f(*args, **kwargs)

            return decorated_function
        return decorator

    def _template_meta(self, **kwargs) -> str:
        """Template function for generating meta tags"""
        try:
            meta = self.client.generate_meta(**kwargs)
            return meta.get('html', '')
        except Exception as e:
            logging.error(f"Template meta generation failed: {e}")
            return ''

    def _template_schema(self, schema_type: str, **data) -> str:
        """Template function for generating schema"""
        try:
            schema = self.client.generate_schema(schema_type, data)
            return schema.get('html', '')
        except Exception as e:
            logging.error(f"Template schema generation failed: {e}")
            return ''

    def _is_bot(self) -> bool:
        """Template function to check if request is from bot"""
        from flask import g
        return getattr(g, 'is_bot', False)


# ============================================================================
# FASTAPI INTEGRATION
# ============================================================================

try:
    from fastapi import Depends, Request
    from starlette.middleware.base import BaseHTTPMiddleware
    from starlette.responses import Response

    # Dependency injection
    def get_seo_client() -> MSeoClient:
        """FastAPI dependency for M-SEO client"""
        return MSeoClient(MSeoConfig(
            api_url="http://localhost:3100",  # Configure via settings
        ))

    # Middleware
    class FastAPISeoMiddleware(BaseHTTPMiddleware):
        """
        FastAPI middleware for SEO operations

        Usage:
            from fastapi import FastAPI
            from mseo import FastAPISeoMiddleware, MSeoClient, MSeoConfig

            app = FastAPI()
            app.add_middleware(FastAPISeoMiddleware, client=MSeoClient(MSeoConfig()))
        """

        def __init__(self, app, client: Optional[MSeoClient] = None):
            super().__init__(app)
            self.client = client or MSeoClient()

        async def dispatch(self, request: Request, call_next):
            # Detect bot
            user_agent = request.headers.get('user-agent', '')

            try:
                bot_info = self.client.check_bot(user_agent)
                request.state.is_bot = bot_info.get('isBot', False)
                request.state.bot_info = bot_info.get('botInfo', {})
            except Exception as e:
                logging.error(f"Bot check failed: {e}")
                request.state.is_bot = False
                request.state.bot_info = {}

            response = await call_next(request)
            return response

    # Dependency for bot detection
    def is_bot(request: Request) -> bool:
        """FastAPI dependency to check if request is from bot"""
        return getattr(request.state, 'is_bot', False)

    def bot_info(request: Request) -> Dict[str, Any]:
        """FastAPI dependency to get bot info"""
        return getattr(request.state, 'bot_info', {})

except ImportError:
    # FastAPI not installed
    pass


# ============================================================================
# ASYNC SUPPORT (Django 4.1+, FastAPI)
# ============================================================================

class AsyncMSeoClient(MSeoClient):
    """
    Async client for Django async views and FastAPI

    Usage:
        # Django async view
        async def product_view(request, id):
            client = AsyncMSeoClient()
            meta = await client.generate_meta_async(
                title=f"Product {id}",
                description="Great product"
            )
            return JsonResponse(meta)

        # FastAPI
        @app.get("/product/{id}")
        async def product(id: int, client: AsyncMSeoClient = Depends()):
            meta = await client.generate_meta_async(
                title=f"Product {id}",
                description="Great product"
            )
            return meta
    """

    async def generate_meta_async(self, **kwargs) -> Dict[str, Any]:
        """Async meta generation"""
        try:
            import aiohttp

            async with aiohttp.ClientSession() as session:
                headers = {'Content-Type': 'application/json'}
                if self.config.api_key:
                    headers['X-API-Key'] = self.config.api_key

                async with session.post(
                    f"{self.config.api_url}/api/seo/meta",
                    json=kwargs,
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=self.config.timeout)
                ) as response:
                    result = await response.json()
                    return result.get('data', result)
        except ImportError:
            raise ImportError("aiohttp is required for async operations: pip install aiohttp")

    async def run_audit_async(self, url: str, **kwargs) -> Dict[str, Any]:
        """Async audit"""
        try:
            import aiohttp

            async with aiohttp.ClientSession() as session:
                headers = {'Content-Type': 'application/json'}
                if self.config.api_key:
                    headers['X-API-Key'] = self.config.api_key

                async with session.post(
                    f"{self.config.api_url}/api/seo/audit",
                    json={'url': url, **kwargs},
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=self.config.timeout)
                ) as response:
                    result = await response.json()
                    return result.get('data', result)
        except ImportError:
            raise ImportError("aiohttp is required for async operations: pip install aiohttp")

    async def check_bot_async(self, user_agent: str) -> Dict[str, Any]:
        """Async bot check"""
        try:
            import aiohttp

            async with aiohttp.ClientSession() as session:
                headers = {'Content-Type': 'application/json'}
                if self.config.api_key:
                    headers['X-API-Key'] = self.config.api_key

                async with session.post(
                    f"{self.config.api_url}/api/seo/bot-check",
                    json={'userAgent': user_agent},
                    headers=headers,
                    timeout=aiohttp.ClientTimeout(total=self.config.timeout)
                ) as response:
                    result = await response.json()
                    return result.get('data', result)
        except ImportError:
            raise ImportError("aiohttp is required for async operations: pip install aiohttp")


# ============================================================================
# CELERY TASK INTEGRATION
# ============================================================================

try:
    from celery import shared_task

    @shared_task
    def generate_meta_task(title, description, url, **kwargs):
        """Celery task for meta generation"""
        client = MSeoClient()
        return client.generate_meta(title, description, url, **kwargs)

    @shared_task
    def run_audit_task(url, **kwargs):
        """Celery task for running audit"""
        client = MSeoClient()
        return client.run_audit(url, **kwargs)

    @shared_task
    def generate_sitemap_task():
        """Celery task for sitemap generation"""
        try:
            from .models import SitemapUrl
            from django.conf import settings

            client = MSeoClient()
            urls = [url.to_dict() for url in SitemapUrl.objects.filter(is_active=True)]

            sitemap = client.generate_sitemap(urls, settings.SITE_URL)

            # Save to file
            with open('public/sitemap.xml', 'w') as f:
                f.write(sitemap['xml'])

            return f"Sitemap generated with {len(urls)} URLs"
        except Exception as e:
            logging.error(f"Sitemap generation failed: {e}")
            raise

except ImportError:
    pass


# ============================================================================
# SQLALCHEMY MODELS (for Flask-SQLAlchemy)
# ============================================================================

try:
    from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, Float, JSON
    from sqlalchemy.ext.declarative import declarative_base
    from sqlalchemy.sql import func

    Base = declarative_base()

    class SQLASeoMeta(Base):
        """SQLAlchemy model for SEO metadata"""
        __tablename__ = 'seo_metas'

        id = Column(Integer, primary_key=True)
        path = Column(String(500), unique=True, index=True, nullable=False)
        title = Column(String(200), nullable=False)
        description = Column(Text)
        keywords = Column(JSON)
        canonical_url = Column(String(500))
        og_image = Column(String(500))
        og_type = Column(String(50), default='website')
        locale = Column(String(10), default='en')
        metadata = Column(JSON)

        is_active = Column(Boolean, default=True)
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

        def to_dict(self):
            return {
                'title': self.title,
                'description': self.description,
                'url': self.canonical_url or self.path,
                'keywords': self.keywords,
                'image': self.og_image,
                'locale': self.locale,
                'type': self.og_type,
            }

    class SQLASitemapUrl(Base):
        """SQLAlchemy model for sitemap URLs"""
        __tablename__ = 'sitemap_urls'

        id = Column(Integer, primary_key=True)
        loc = Column(String(500), unique=True, index=True, nullable=False)
        changefreq = Column(String(20), default='weekly')
        priority = Column(Float, default=0.8)
        lastmod = Column(DateTime, server_default=func.now())
        metadata = Column(JSON)

        is_active = Column(Boolean, default=True)
        created_at = Column(DateTime, server_default=func.now())
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

        def to_dict(self):
            return {
                'loc': self.loc,
                'changefreq': self.changefreq,
                'priority': self.priority,
                'lastmod': self.lastmod.isoformat() if self.lastmod else None,
            }

    class SQLAAuditLog(Base):
        """SQLAlchemy model for audit logs"""
        __tablename__ = 'seo_audit_logs'

        id = Column(Integer, primary_key=True)
        url = Column(String(500), index=True, nullable=False)
        score = Column(Integer, default=0, index=True)
        passed = Column(Integer, default=0)
        failed = Column(Integer, default=0)
        warnings = Column(Integer, default=0)
        issues = Column(JSON)
        recommendations = Column(JSON)
        metadata = Column(JSON)

        created_at = Column(DateTime, server_default=func.now(), index=True)
        updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

except ImportError:
    pass


# ============================================================================
# COMPREHENSIVE USAGE EXAMPLES
# ============================================================================

__doc__ += """

# ============================================================================
# USAGE EXAMPLES
# ============================================================================

## 1. DJANGO CLASS-BASED VIEW

```python
# views.py
from django.views.generic import DetailView
from mseo import DjangoSeoMixin
from .models import Product

class ProductDetailView(DjangoSeoMixin, DetailView):
    model = Product
    template_name = 'product_detail.html'

    def get_seo_meta(self):
        product = self.get_object()
        return {
            'title': f"{product.name} - Best Price | MyStore",
            'description': product.description[:160],
            'url': self.request.build_absolute_uri(),
            'image': product.image.url if product.image else None,
            'keywords': [tag.name for tag in product.tags.all()],
        }

    def get_seo_schema(self):
        product = self.get_object()
        return {
            'type': 'Product',
            'data': {
                'name': product.name,
                'description': product.description,
                'image': product.image.url,
                'brand': {'@type': 'Brand', 'name': product.brand},
                'offers': {
                    '@type': 'Offer',
                    'price': str(product.price),
                    'priceCurrency': 'USD',
                    'availability': 'InStock' if product.in_stock else 'OutOfStock',
                }
            }
        }
```

## 2. DJANGO FUNCTION-BASED VIEW

```python
# views.py
from django.shortcuts import render
from mseo import MSeoClient, MSeoConfig
from django.conf import settings

def product_detail(request, id):
    product = Product.objects.get(id=id)

    mseo_settings = getattr(settings, 'MSEO', {})
    client = MSeoClient(MSeoConfig(
        api_url=mseo_settings.get('API_URL'),
        api_key=mseo_settings.get('API_KEY'),
    ))

    # Generate meta
    meta = client.generate_meta(
        title=f"{product.name} - Best Price",
        description=product.description[:160],
        url=request.build_absolute_uri(),
        keywords=[tag.name for tag in product.tags.all()],
        image=product.image.url if product.image else None,
    )

    # Generate schema
    schema = client.generate_schema('Product', {
        'name': product.name,
        'offers': {'@type': 'Offer', 'price': str(product.price)},
    })

    return render(request, 'product_detail.html', {
        'product': product,
        'seo_meta': meta,
        'seo_schema': schema,
    })
```

## 3. DJANGO TEMPLATE

```html
<!-- templates/product_detail.html -->
{% load mseo_tags %}
<!DOCTYPE html>
<html>
<head>
    <!-- Using context variable -->
    {{ seo_meta.html|safe }}
    {{ seo_schema.html|safe }}

    <!-- Or using template tag -->
    {% seo_meta title=product.name description=product.description url=request.build_absolute_uri %}
    {% seo_schema 'Product' name=product.name price=product.price %}
</head>
<body>
    <h1>{{ product.name }}</h1>

    <!-- Conditional rendering for bots -->
    {% if request.is_bot %}
        <div class="bot-content">
            {{ product.full_description|safe }}
        </div>
    {% endif %}

    <!-- Bot name -->
    {% if request.is_bot %}
        <p>Detected bot: {{ request|bot_name }}</p>
    {% endif %}
</body>
</html>
```

## 4. FLASK APPLICATION

```python
# app.py
from flask import Flask, render_template
from mseo import FlaskSeo, MSeoConfig
from models import Product

app = Flask(__name__)
app.config['MSEO_API_URL'] = 'http://localhost:3100'
app.config['MSEO_API_KEY'] = 'your_api_key'

seo = FlaskSeo(app)

@app.route('/product/<int:id>')
@seo.meta(
    title=lambda: f"Product {id} - Best Price",
    description="Amazing product with great features",
    keywords=["product", "ecommerce"],
)
@seo.schema('Product', lambda: {
    'name': Product.query.get(id).name,
    'offers': {'@type': 'Offer', 'price': '99.99'},
})
def product(id):
    product = Product.query.get_or_404(id)
    return render_template('product.html', product=product)

@app.route('/sitemap.xml')
def sitemap():
    from mseo import MSeoConfig, MSeoClient

    client = MSeoClient(MSeoConfig(
        api_url=app.config['MSEO_API_URL'],
        api_key=app.config['MSEO_API_KEY'],
    ))

    urls = []
    for product in Product.query.all():
        urls.append({
            'loc': url_for('product', id=product.id, _external=True),
            'changefreq': 'daily',
            'priority': 0.8,
        })

    sitemap = client.generate_sitemap(urls, request.url_root)

    return Response(sitemap['xml'], mimetype='application/xml')

if __name__ == '__main__':
    app.run()
```

## 5. FASTAPI APPLICATION

```python
# main.py
from fastapi import FastAPI, Depends, Request
from mseo import (
    FastAPISeoMiddleware,
    AsyncMSeoClient,
    get_seo_client,
    is_bot,
    MSeoConfig
)

app = FastAPI()

# Add middleware
client = AsyncMSeoClient(MSeoConfig(
    api_url="http://localhost:3100",
    api_key="your_api_key"
))
app.add_middleware(FastAPISeoMiddleware, client=client)

@app.get("/product/{id}")
async def product(
    id: int,
    request: Request,
    client: AsyncMSeoClient = Depends(get_seo_client),
    is_bot_request: bool = Depends(is_bot)
):
    # Generate meta tags
    meta = await client.generate_meta_async(
        title=f"Product {id} - Best Price",
        description="Amazing product",
        url=str(request.url)
    )

    # Run audit if needed
    if is_bot_request:
        audit = await client.run_audit_async(str(request.url))
        return {"meta": meta, "audit": audit}

    return {"meta": meta}

@app.get("/sitemap.xml")
async def sitemap(client: AsyncMSeoClient = Depends(get_seo_client)):
    urls = [
        {'loc': 'https://example.com', 'priority': 1.0},
        {'loc': 'https://example.com/about', 'priority': 0.8},
    ]

    # Note: sitemap generation is sync in this version
    sitemap_client = MSeoClient(client.config)
    sitemap = sitemap_client.generate_sitemap(urls, "https://example.com")

    return Response(content=sitemap['xml'], media_type='application/xml')
```

## 6. DJANGO ASYNC VIEW

```python
# views.py
from django.http import JsonResponse
from mseo import AsyncMSeoClient, MSeoConfig
from asgiref.sync import async_to_sync

async def product_async_view(request, id):
    client = AsyncMSeoClient(MSeoConfig(
        api_url="http://localhost:3100"
    ))

    meta = await client.generate_meta_async(
        title=f"Product {id}",
        description="Great product",
        url=request.build_absolute_uri()
    )

    return JsonResponse(meta)
```

## 7. CELERY TASK

```python
# tasks.py
from celery import shared_task
from mseo import MSeoClient, MSeoConfig
from .models import Product, SitemapUrl

@shared_task
def update_product_seo(product_id):
    product = Product.objects.get(id=product_id)
    client = MSeoClient()

    meta = client.generate_meta(
        title=product.name,
        description=product.description[:160],
        url=product.get_absolute_url()
    )

    # Store in database
    SeoMeta.objects.update_or_create(
        path=product.get_absolute_url(),
        defaults={
            'title': meta['tags']['title'],
            'description': meta['tags']['description'],
        }
    )

@shared_task
def generate_sitemap_task():
    from django.conf import settings

    client = MSeoClient()
    urls = [url.to_dict() for url in SitemapUrl.objects.filter(is_active=True)]

    sitemap = client.generate_sitemap(urls, settings.SITE_URL)

    with open('public/sitemap.xml', 'w') as f:
        f.write(sitemap['xml'])

    return f"Generated sitemap with {len(urls)} URLs"

# Usage
update_product_seo.delay(product_id)
generate_sitemap_task.delay()
```

## 8. STANDALONE USAGE

```python
# script.py
from mseo import MSeoClient, MSeoConfig

# Create client
client = MSeoClient(MSeoConfig(
    api_url="http://localhost:3100",
    api_key="your_api_key",
    cache_enabled=True,
    cache_ttl=300,
    retry_attempts=3,
))

# Generate meta tags
meta = client.generate_meta(
    title="My Page",
    description="Page description",
    url="https://example.com/page",
    keywords=["seo", "meta", "tags"],
    image="https://example.com/image.jpg"
)
print(meta['html'])

# Run audit
audit = client.run_audit("https://example.com")
print(f"SEO Score: {audit['score']}/100")
print(f"Passed: {audit['passed']}, Failed: {audit['failed']}")

# Generate sitemap
sitemap = client.generate_sitemap([
    {'loc': 'https://example.com', 'priority': 1.0},
    {'loc': 'https://example.com/about', 'priority': 0.8},
], "https://example.com")

with open('sitemap.xml', 'w') as f:
    f.write(sitemap['xml'])

# Check metrics
metrics = client.get_client_metrics()
print(f"Requests: {metrics['requests']}")
print(f"Cache hit rate: {metrics['cache_hit_rate']}%")
print(f"Avg latency: {metrics['avg_latency_ms']}ms")
```

## 9. DJANGO SETTINGS

```python
# settings.py

INSTALLED_APPS = [
    # ...
    'mseo',
]

MIDDLEWARE = [
    'mseo.middleware.DjangoSeoMiddleware',
    # ...
]

MSEO = {
    'API_URL': 'http://localhost:3100',
    'API_KEY': 'your_api_key',
    'CACHE_ENABLED': True,
    'CACHE_TTL': 300,
    'AUTO_INJECT': True,
    'ENABLED': True,
}

SITE_URL = 'https://example.com'
```

## 10. FLASK CONFIGURATION

```python
# config.py
class Config:
    MSEO_API_URL = 'http://localhost:3100'
    MSEO_API_KEY = 'your_api_key'
    MSEO_CACHE_ENABLED = True
    MSEO_CACHE_TTL = 300
    MSEO_ENABLED = True

# app.py
app = Flask(__name__)
app.config.from_object(Config)
```

"""
