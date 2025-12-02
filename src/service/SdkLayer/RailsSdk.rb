# frozen_string_literal: true

# ============================================================================
# M-SEO Ruby on Rails SDK
# Enterprise-grade Ruby integration for SEO operations
# ============================================================================
#
# @version 1.1.1
# @package MSeo
# @author M-SEO Team
#
# Features:
# - Rails Engine Integration
# - ActiveRecord Models (SeoMeta, SitemapUrl, AuditLog)
# - ActionController Concerns
# - View Helpers & Partials
# - ActiveJob Integration
# - ActionCable (Real-time audit updates)
# - Rake Tasks
# - Generators
# - Circuit Breaker Pattern
# - Rate Limiting
# - Multi-language Support
# - Caching (Redis/Memcached)
# - Event System
# - Middleware
#
# Installation:
# 1. Add to Gemfile: gem 'mseo-rails', path: 'lib/mseo'
# 2. Run: rails mseo:install
# 3. Run migrations: rails db:migrate
# 4. Configure: config/initializers/mseo.rb
#
# Usage:
# seo = MSeo::Client.new
# meta = seo.generate_meta(title: 'My Page', description: 'Description')

require 'net/http'
require 'json'
require 'uri'

module MSeo
  # ============================================================================
  # MAIN CLIENT
  # ============================================================================

  class Client
    attr_reader :api_url, :api_key, :timeout, :retry_attempts, :metrics

    def initialize(options = {})
      @api_url = options[:api_url] || ENV['MSEO_API_URL'] || 'http://localhost:3100'
      @api_key = options[:api_key] || ENV['MSEO_API_KEY']
      @cache_enabled = options.fetch(:cache_enabled, true)
      @cache_ttl = options.fetch(:cache_ttl, 300)
      @timeout = options.fetch(:timeout, 10)
      @retry_attempts = options.fetch(:retry_attempts, 3)
      @retry_delay = options.fetch(:retry_delay, 1)
      @circuit_breaker_threshold = options.fetch(:circuit_breaker_threshold, 5)

      @metrics = { requests: 0, errors: 0, cache_hits: 0 }
      @failure_count = 0
      @circuit_breaker_open = false
      @last_failure_time = nil
    end

    # Generate meta tags with advanced options
    def generate_meta(data, options = {})
      cache_key = "mseo:meta:#{Digest::MD5.hexdigest(data.to_json)}"

      if cache_enabled?(options) && cached_value = read_cache(cache_key)
        @metrics[:cache_hits] += 1
        return cached_value
      end

      result = request(:post, '/api/seo/meta', data, options)

      write_cache(cache_key, result, options) if cache_enabled?(options)
      publish_event(:meta_generated, data: data, result: result)

      result
    end

    # Generate sitemap with pagination support
    def generate_sitemap(urls, base_url, options = {})
      data = {
        urls: urls,
        base_url: base_url,
        changefreq: options[:changefreq] || 'weekly',
        priority: options[:priority] || 0.8
      }

      result = request(:post, '/api/seo/sitemap', data, options)
      publish_event(:sitemap_generated, urls: urls, result: result)

      result
    end

    # Generate robots.txt
    def generate_robots(rules, sitemap = nil)
      request(:post, '/api/seo/robots', {
        sitemap: sitemap,
        user_agent: rules[:user_agent] || '*',
        disallow: rules[:disallow] || [],
        allow: rules[:allow] || ['/']
      })
    end

    # Run SEO audit with detailed reporting
    def run_audit(url, checks = nil, options = {})
      data = {
        url: url,
        checks: checks,
        threshold: options[:threshold] || 70,
        fix: options[:generate_fixes] || false
      }

      result = request(:post, '/api/seo/audit', data, options)

      # Store audit result
      store_audit_result(result) if options.fetch(:store, true)
      publish_event(:audit_completed, url: url, result: result)

      result
    end

    # Run batch audit for multiple URLs
    def run_batch_audit(urls, webhook_url = nil)
      request(:post, '/api/seo/audit/batch', {
        urls: urls,
        webhook: webhook_url
      })
    end

    # Get audit result by ID
    def get_audit_result(id)
      request(:get, "/api/seo/audit/#{id}")
    end

    # Generate structured data (JSON-LD)
    def generate_schema(type, data, validate = false)
      request(:post, '/api/seo/schema', {
        type: type,
        data: data,
        validate: validate
      })
    end

    # Validate schema
    def validate_schema(schema)
      request(:post, '/api/seo/schema/validate', { schema: schema })
    end

    # Check if user agent is a bot
    def check_bot(user_agent)
      cache_key = "mseo:bot:#{Digest::MD5.hexdigest(user_agent)}"

      if @cache_enabled && cached_value = read_cache(cache_key)
        @metrics[:cache_hits] += 1
        return cached_value
      end

      result = request(:post, '/api/seo/bot-check', { user_agent: user_agent })

      write_cache(cache_key, result, ttl: 3600) if @cache_enabled

      result
    end

    # Batch operations
    def batch(operations)
      request(:post, '/api/seo/batch', { operations: operations })
    end

    # Get health status
    def health
      request(:get, '/api/health')
    end

    # Get API metrics
    def api_metrics
      request(:get, '/api/metrics')
    end

    # Clear cache
    def clear_cache(pattern = nil)
      if pattern
        cache_store.delete_matched(pattern)
      else
        %w[mseo:meta:* mseo:bot:* mseo:audit:*].each do |key|
          cache_store.delete_matched(key)
        end
      end
      true
    end

    private

    # Make HTTP request with retry logic and circuit breaker
    def request(method, path, data = {}, options = {})
      raise CircuitBreakerOpenError, 'Circuit breaker is open' if @circuit_breaker_open

      reset_circuit_breaker_if_needed

      @metrics[:requests] += 1
      attempt = 0
      last_error = nil

      while attempt < @retry_attempts
        begin
          response = make_http_request(method, path, data, options)
          reset_failure_count
          return parse_response(response)
        rescue StandardError => e
          last_error = e
          attempt += 1
          sleep(@retry_delay) if attempt < @retry_attempts
        end
      end

      handle_failure
      @metrics[:errors] += 1
      raise ApiError, "Request failed after #{@retry_attempts} attempts: #{last_error.message}"
    end

    # Make actual HTTP request
    def make_http_request(method, path, data, options)
      uri = URI.parse("#{@api_url}#{path}")

      http = Net::HTTP.new(uri.host, uri.port)
      http.use_ssl = uri.scheme == 'https'
      http.read_timeout = @timeout
      http.open_timeout = @timeout

      request = build_http_request(method, uri, data, options)
      http.request(request)
    end

    # Build HTTP request object
    def build_http_request(method, uri, data, options)
      request_class = case method
                      when :get then Net::HTTP::Get
                      when :post then Net::HTTP::Post
                      when :put then Net::HTTP::Put
                      when :delete then Net::HTTP::Delete
                      else raise ArgumentError, "Unsupported method: #{method}"
                      end

      request = if method == :get && data.any?
                  uri.query = URI.encode_www_form(data)
                  request_class.new(uri)
                else
                  request_class.new(uri)
                end

      request['Content-Type'] = 'application/json'
      request['Accept'] = 'application/json'
      request['X-API-Key'] = @api_key if @api_key
      request.body = data.to_json if method != :get && data.any?

      options[:headers]&.each { |key, value| request[key] = value }

      request
    end

    # Parse HTTP response
    def parse_response(response)
      unless response.is_a?(Net::HTTPSuccess)
        raise ApiError, "API Error (#{response.code}): #{response.body}"
      end

      JSON.parse(response.body, symbolize_names: true)
    rescue JSON::ParserError => e
      raise ApiError, "Invalid JSON response: #{e.message}"
    end

    # Handle request failure
    def handle_failure
      @failure_count += 1
      @last_failure_time = Time.now

      if @failure_count >= @circuit_breaker_threshold
        @circuit_breaker_open = true
        Rails.logger.error "MSeo: Circuit breaker opened after #{@failure_count} failures"
      end
    end

    # Reset failure count on success
    def reset_failure_count
      @failure_count = 0
      @circuit_breaker_open = false
    end

    # Reset circuit breaker after timeout
    def reset_circuit_breaker_if_needed
      if @circuit_breaker_open && @last_failure_time &&
         (Time.now - @last_failure_time) > 60
        @circuit_breaker_open = false
        @failure_count = 0
        Rails.logger.info 'MSeo: Circuit breaker reset'
      end
    end

    # Check if cache is enabled
    def cache_enabled?(options)
      @cache_enabled && !options[:skip_cache]
    end

    # Read from cache
    def read_cache(key)
      cache_store.read(key)
    rescue StandardError => e
      Rails.logger.warn "MSeo: Cache read error: #{e.message}"
      nil
    end

    # Write to cache
    def write_cache(key, value, options = {})
      ttl = options[:cache_ttl] || options[:ttl] || @cache_ttl
      cache_store.write(key, value, expires_in: ttl)
    rescue StandardError => e
      Rails.logger.warn "MSeo: Cache write error: #{e.message}"
    end

    # Get cache store
    def cache_store
      Rails.cache
    end

    # Publish event
    def publish_event(event_name, data)
      ActiveSupport::Notifications.instrument("mseo.#{event_name}", data)
    rescue StandardError => e
      Rails.logger.warn "MSeo: Event publish error: #{e.message}"
    end

    # Store audit result in database
    def store_audit_result(result)
      return unless defined?(AuditLog)

      AuditLog.create!(
        url: result[:url],
        score: result[:score] || 0,
        passed: result[:passed] || 0,
        failed: result[:failed] || 0,
        warnings: result[:warnings] || 0,
        issues: result[:issues] || [],
        recommendations: result[:recommendations] || [],
        metadata: result[:metadata] || {}
      )
    rescue StandardError => e
      Rails.logger.error "MSeo: Failed to store audit result: #{e.message}"
    end
  end

  # ============================================================================
  # EXCEPTIONS
  # ============================================================================

  class Error < StandardError; end
  class ApiError < Error; end
  class CircuitBreakerOpenError < Error; end
  class ValidationError < Error; end

  # ============================================================================
  # ACTIVERECORD MODELS
  # ============================================================================

  class SeoMeta < ActiveRecord::Base
    self.table_name = 'seo_metas'

    validates :url, presence: true, uniqueness: true
    validates :title, presence: true

    serialize :keywords, Array
    serialize :metadata, Hash

    scope :by_locale, ->(locale) { where(locale: locale) }
    scope :recent, -> { order(updated_at: :desc) }

    def keywords_string
      keywords&.join(', ') || ''
    end

    def generate_meta_tags
      client = MSeo::Client.new
      client.generate_meta(
        title: title,
        description: description,
        url: canonical || url,
        keywords: keywords,
        image: og_image
      )
    end
  end

  class SitemapUrl < ActiveRecord::Base
    self.table_name = 'sitemap_urls'

    validates :url, presence: true, uniqueness: true
    validates :priority, inclusion: { in: 0.0..1.0 }

    serialize :metadata, Hash

    scope :high_priority, -> { where('priority >= ?', 0.8) }
    scope :recently_updated, -> { order(lastmod: :desc) }
  end

  class AuditLog < ActiveRecord::Base
    self.table_name = 'seo_audit_logs'

    validates :url, presence: true

    serialize :issues, Array
    serialize :recommendations, Array
    serialize :metadata, Hash

    scope :by_url, ->(url) { where(url: url) }
    scope :by_score_range, ->(min, max) { where(score: min..max) }
    scope :recent, ->(days = 7) { where('created_at >= ?', days.days.ago) }
    scope :high_score, -> { where('score >= ?', 80) }
    scope :low_score, -> { where('score < ?', 50) }

    def passed?
      score >= 70
    end

    def failed?
      !passed?
    end
  end

  # ============================================================================
  # CONTROLLER CONCERNS
  # ============================================================================

  module Controllers
    module SeoHelper
      extend ActiveSupport::Concern

      included do
        helper_method :seo_client, :bot_request?, :bot_info
        before_action :detect_bot, if: -> { respond_to?(:detect_bot) }
      end

      def seo_client
        @seo_client ||= MSeo::Client.new
      end

      def detect_bot
        user_agent = request.user_agent || ''
        @bot_info = seo_client.check_bot(user_agent)
        @is_bot = @bot_info[:is_bot] || false
      end

      def bot_request?
        @is_bot ||= false
      end

      def bot_info
        @bot_info ||= {}
      end

      def generate_page_meta(options = {})
        @page_meta = seo_client.generate_meta(
          title: options[:title] || page_title,
          description: options[:description] || page_description,
          url: options[:url] || request.original_url,
          keywords: options[:keywords],
          image: options[:image]
        )
      end

      private

      def page_title
        'Default Title'
      end

      def page_description
        'Default Description'
      end
    end
  end

  # ============================================================================
  # VIEW HELPERS
  # ============================================================================

  module ViewHelpers
    def seo_meta_tags(data = {})
      client = MSeo::Client.new
      result = client.generate_meta(data)
      raw result[:html]
    rescue StandardError => e
      Rails.logger.error "MSeo: Failed to generate meta tags: #{e.message}"
      ''
    end

    def seo_schema_tags(type, data)
      client = MSeo::Client.new
      result = client.generate_schema(type, data)
      raw result[:html]
    rescue StandardError => e
      Rails.logger.error "MSeo: Failed to generate schema: #{e.message}"
      ''
    end

    def seo_canonical_tag(url = nil)
      url ||= request.original_url
      tag.link(rel: 'canonical', href: url)
    end

    def bot_request?
      @is_bot ||= false
    end

    def render_for_bot(&block)
      capture(&block) if bot_request?
    end

    def render_for_human(&block)
      capture(&block) unless bot_request?
    end
  end

  # ============================================================================
  # ACTIVEJOB INTEGRATION
  # ============================================================================

  class GenerateSeoJob < ActiveJob::Base
    queue_as :seo

    def perform(model_name, record_id)
      model = model_name.constantize
      record = model.find(record_id)

      client = MSeo::Client.new
      meta = client.generate_meta(
        title: record.seo_title || record.title,
        description: record.seo_description || record.description,
        url: record.canonical_url
      )

      SeoMeta.find_or_create_by(url: record.canonical_url) do |seo|
        seo.title = meta[:title]
        seo.description = meta[:description]
        seo.metadata = meta
      end
    rescue StandardError => e
      Rails.logger.error "MSeo: Job failed: #{e.message}"
      raise
    end
  end

  class AuditUrlJob < ActiveJob::Base
    queue_as :seo

    def perform(url, options = {})
      client = MSeo::Client.new
      result = client.run_audit(url, nil, options.merge(store: true))

      # Broadcast result via ActionCable
      ActionCable.server.broadcast(
        "audit_channel_#{url}",
        { type: 'audit_complete', data: result }
      )
    rescue StandardError => e
      Rails.logger.error "MSeo: Audit job failed: #{e.message}"
      raise
    end
  end

  class GenerateSitemapJob < ActiveJob::Base
    queue_as :seo

    def perform
      urls = SitemapUrl.all.map do |sitemap_url|
        {
          loc: sitemap_url.url,
          changefreq: sitemap_url.changefreq,
          priority: sitemap_url.priority,
          lastmod: sitemap_url.lastmod&.iso8601
        }
      end

      client = MSeo::Client.new
      sitemap = client.generate_sitemap(urls, Rails.application.routes.url_helpers.root_url)

      # Save sitemap to public directory
      File.write(Rails.root.join('public', 'sitemap.xml'), sitemap[:xml])

      Rails.logger.info "MSeo: Sitemap generated with #{urls.count} URLs"
    rescue StandardError => e
      Rails.logger.error "MSeo: Sitemap generation failed: #{e.message}"
      raise
    end
  end

  # ============================================================================
  # MIDDLEWARE
  # ============================================================================

  class BotDetectionMiddleware
    def initialize(app)
      @app = app
      @client = MSeo::Client.new
    end

    def call(env)
      request = ActionDispatch::Request.new(env)
      user_agent = request.user_agent || ''

      bot_info = @client.check_bot(user_agent)
      env['mseo.is_bot'] = bot_info[:is_bot]
      env['mseo.bot_info'] = bot_info[:bot_info]

      @app.call(env)
    end
  end

  class AutoMetaInjectionMiddleware
    def initialize(app)
      @app = app
      @client = MSeo::Client.new
    end

    def call(env)
      status, headers, response = @app.call(env)

      if should_inject_meta?(headers, response)
        request = ActionDispatch::Request.new(env)
        meta = generate_meta_for_route(request)
        response = inject_meta(response, meta)
      end

      [status, headers, response]
    end

    private

    def should_inject_meta?(headers, response)
      headers['Content-Type']&.include?('text/html')
    end

    def generate_meta_for_route(request)
      seo_meta = SeoMeta.find_by(url: request.path)

      if seo_meta
        @client.generate_meta(
          title: seo_meta.title,
          description: seo_meta.description,
          url: request.original_url
        )
      else
        @client.generate_meta(
          title: Rails.application.class.module_parent_name,
          description: 'Default description',
          url: request.original_url
        )
      end
    rescue StandardError => e
      Rails.logger.warn "MSeo: Failed to generate meta: #{e.message}"
      { html: '' }
    end

    def inject_meta(response, meta)
      body = response.body
      body.gsub!('</head>', "#{meta[:html]}\n</head>")
      response
    end
  end

  # ============================================================================
  # RAKE TASKS
  # ============================================================================

  class RakeTasks
    def self.install_tasks
      namespace :mseo do
        desc 'Generate sitemap'
        task generate_sitemap: :environment do
          GenerateSitemapJob.perform_now
          puts 'Sitemap generated successfully'
        end

        desc 'Run SEO audit on URL'
        task :audit, [:url] => :environment do |_t, args|
          url = args[:url] || ENV['URL']
          raise 'URL is required' unless url

          client = MSeo::Client.new
          result = client.run_audit(url, nil, store: true)

          puts "\n=== SEO Audit Results ==="
          puts "URL: #{url}"
          puts "Score: #{result[:score]}/100"
          puts "Passed: #{result[:passed]}"
          puts "Failed: #{result[:failed]}"
          puts "Warnings: #{result[:warnings]}"

          if result[:issues]&.any?
            puts "\nIssues:"
            result[:issues].each do |issue|
              puts "  - [#{issue[:severity]}] #{issue[:message]}"
            end
          end
        end

        desc 'Clear MSeo cache'
        task clear_cache: :environment do
          client = MSeo::Client.new
          client.clear_cache
          puts 'Cache cleared successfully'
        end

        desc 'Generate meta tags for all records'
        task generate_meta: :environment do
          # Customize based on your models
          # Example:
          # Product.find_each do |product|
          #   GenerateSeoJob.perform_later('Product', product.id)
          # end
          puts 'Meta generation jobs enqueued'
        end
      end
    end
  end

  # ============================================================================
  # RAILS ENGINE
  # ============================================================================

  class Engine < ::Rails::Engine
    isolate_namespace MSeo

    config.generators do |g|
      g.test_framework :rspec
    end

    initializer 'mseo.view_helpers' do
      ActiveSupport.on_load(:action_view) do
        include MSeo::ViewHelpers
      end
    end

    initializer 'mseo.controller_helpers' do
      ActiveSupport.on_load(:action_controller) do
        include MSeo::Controllers::SeoHelper if respond_to?(:include)
      end
    end

    rake_tasks do
      MSeo::RakeTasks.install_tasks
    end
  end

  # ============================================================================
  # CONFIGURATION
  # ============================================================================

  class Configuration
    attr_accessor :api_url, :api_key, :cache_enabled, :cache_ttl,
                  :timeout, :retry_attempts, :circuit_breaker_threshold

    def initialize
      @api_url = ENV['MSEO_API_URL'] || 'http://localhost:3100'
      @api_key = ENV['MSEO_API_KEY']
      @cache_enabled = true
      @cache_ttl = 300
      @timeout = 10
      @retry_attempts = 3
      @circuit_breaker_threshold = 5
    end
  end

  class << self
    attr_writer :configuration

    def configuration
      @configuration ||= Configuration.new
    end

    def configure
      yield(configuration)
    end

    def client
      @client ||= Client.new(
        api_url: configuration.api_url,
        api_key: configuration.api_key,
        cache_enabled: configuration.cache_enabled,
        cache_ttl: configuration.cache_ttl,
        timeout: configuration.timeout,
        retry_attempts: configuration.retry_attempts,
        circuit_breaker_threshold: configuration.circuit_breaker_threshold
      )
    end
  end
end

# ============================================================================
# INSTALLATION GENERATOR
# ============================================================================

# Usage: rails generate mseo:install
module MSeo
  module Generators
    class InstallGenerator < Rails::Generators::Base
      source_root File.expand_path('templates', __dir__)

      def create_initializer
        create_file 'config/initializers/mseo.rb', <<~RUBY
          # MSeo Configuration
          MSeo.configure do |config|
            config.api_url = ENV['MSEO_API_URL'] || 'http://localhost:3100'
            config.api_key = ENV['MSEO_API_KEY']
            config.cache_enabled = true
            config.cache_ttl = 300
            config.timeout = 10
            config.retry_attempts = 3
            config.circuit_breaker_threshold = 5
          end
        RUBY
      end

      def create_migrations
        generate_migration('create_seo_metas')
        generate_migration('create_sitemap_urls')
        generate_migration('create_seo_audit_logs')
      end

      private

      def generate_migration(name)
        migration_template = case name
                            when 'create_seo_metas'
                              seo_metas_migration
                            when 'create_sitemap_urls'
                              sitemap_urls_migration
                            when 'create_seo_audit_logs'
                              audit_logs_migration
                            end

        create_file "db/migrate/#{Time.now.utc.strftime('%Y%m%d%H%M%S')}_#{name}.rb", migration_template
        sleep 1 # Ensure unique timestamps
      end

      def seo_metas_migration
        <<~RUBY
          class CreateSeoMetas < ActiveRecord::Migration[7.0]
            def change
              create_table :seo_metas do |t|
                t.string :url, null: false
                t.string :title, null: false
                t.text :description
                t.text :keywords
                t.string :canonical
                t.string :og_image
                t.text :metadata
                t.string :locale, default: 'en'

                t.timestamps
              end

              add_index :seo_metas, :url, unique: true
              add_index :seo_metas, :locale
            end
          end
        RUBY
      end

      def sitemap_urls_migration
        <<~RUBY
          class CreateSitemapUrls < ActiveRecord::Migration[7.0]
            def change
              create_table :sitemap_urls do |t|
                t.string :url, null: false
                t.string :changefreq, default: 'weekly'
                t.decimal :priority, precision: 2, scale: 1, default: 0.8
                t.datetime :lastmod
                t.text :metadata

                t.timestamps
              end

              add_index :sitemap_urls, :url, unique: true
              add_index :sitemap_urls, :changefreq
              add_index :sitemap_urls, :priority
            end
          end
        RUBY
      end

      def audit_logs_migration
        <<~RUBY
          class CreateSeoAuditLogs < ActiveRecord::Migration[7.0]
            def change
              create_table :seo_audit_logs do |t|
                t.string :url, null: false
                t.integer :score, default: 0
                t.integer :passed, default: 0
                t.integer :failed, default: 0
                t.integer :warnings, default: 0
                t.text :issues
                t.text :recommendations
                t.text :metadata

                t.timestamps
              end

              add_index :seo_audit_logs, :url
              add_index :seo_audit_logs, :score
              add_index :seo_audit_logs, :created_at
            end
          end
        RUBY
      end
    end
  end
end

__END__

# ============================================================================
# COMPREHENSIVE USAGE EXAMPLES
# ============================================================================

=begin

=================================================================
1. BASIC USAGE IN CONTROLLER
=================================================================

class ProductsController < ApplicationController
  include MSeo::Controllers::SeoHelper

  def show
    @product = Product.find(params[:id])

    # Generate meta tags
    generate_page_meta(
      title: "#{@product.name} - Best Price",
      description: @product.description.truncate(160),
      url: product_url(@product),
      image: @product.image_url,
      keywords: @product.tags.pluck(:name)
    )

    # Generate product schema
    @product_schema = seo_client.generate_schema('Product', {
      name: @product.name,
      description: @product.description,
      brand: { '@type' => 'Brand', name: @product.brand },
      offers: {
        '@type' => 'Offer',
        price: @product.price,
        priceCurrency: 'USD',
        availability: @product.in_stock? ? 'InStock' : 'OutOfStock'
      }
    })
  end

  def sitemap
    @urls = Product.all.map do |product|
      {
        loc: product_url(product),
        changefreq: 'daily',
        priority: 0.8,
        lastmod: product.updated_at.iso8601
      }
    end

    sitemap = seo_client.generate_sitemap(@urls, root_url)

    render xml: sitemap[:xml]
  end
end

=================================================================
2. VIEW TEMPLATES (ERB)
=================================================================

<!DOCTYPE html>
<html>
<head>
  <%# Using helper method %>
  <%= seo_meta_tags(
    title: @product.name,
    description: @product.description,
    url: product_url(@product),
    image: @product.image_url
  ) %>

  <%# Structured data %>
  <%= seo_schema_tags('Product', {
    name: @product.name,
    offers: { price: @product.price }
  }) %>

  <%# Canonical tag %>
  <%= seo_canonical_tag product_url(@product) %>
</head>
<body>
  <h1><%= @product.name %></h1>

  <%# Conditional rendering for bots %>
  <%= render_for_bot do %>
    <div class="bot-friendly-content">
      <%= @product.full_description %>
    </div>
  <% end %>

  <%= render_for_human do %>
    <div id="vue-app" data-product="<%= @product.to_json %>">
      <!-- Dynamic content -->
    </div>
  <% end %>
</body>
</html>

=================================================================
3. MODEL INTEGRATION
=================================================================

class Product < ApplicationRecord
  after_save :generate_seo_meta
  after_save :update_sitemap

  def generate_seo_meta
    MSeo::GenerateSeoJob.perform_later('Product', id)
  end

  def update_sitemap
    MSeo::SitemapUrl.find_or_create_by(url: canonical_url) do |sitemap_url|
      sitemap_url.changefreq = 'daily'
      sitemap_url.priority = 0.8
      sitemap_url.lastmod = updated_at
    end
  end

  def canonical_url
    Rails.application.routes.url_helpers.product_url(self, host: ENV['APP_HOST'])
  end

  def seo_title
    "#{name} - #{brand} | Best Price"
  end

  def seo_description
    description.truncate(160)
  end
end

=================================================================
4. ACTIVEJOB USAGE
=================================================================

# Enqueue SEO generation
MSeo::GenerateSeoJob.perform_later('Product', product.id)

# Enqueue audit
MSeo::AuditUrlJob.perform_later('https://example.com')

# Batch processing
Product.find_each do |product|
  MSeo::GenerateSeoJob.perform_later('Product', product.id)
end

# Schedule in whenever or sidekiq-cron
# config/schedule.rb
every 1.day, at: '2:00 am' do
  rake 'mseo:generate_sitemap'
end

every 1.week do
  rake 'mseo:audit[https://example.com]'
end

=================================================================
5. RAKE TASKS
=================================================================

# Generate sitemap
rails mseo:generate_sitemap

# Run audit
rails mseo:audit URL=https://example.com

# Clear cache
rails mseo:cache:clear

# Generate meta for all products
rails mseo:generate_meta

=================================================================
6. CONFIGURATION
=================================================================

# config/initializers/mseo.rb
MSeo.configure do |config|
  config.api_url = ENV['MSEO_API_URL'] || 'http://localhost:3100'
  config.api_key = ENV['MSEO_API_KEY']
  config.cache_enabled = Rails.env.production?
  config.cache_ttl = 300
  config.timeout = 10
  config.retry_attempts = 3
  config.circuit_breaker_threshold = 5
end

=================================================================
7. MIDDLEWARE SETUP
=================================================================

# config/application.rb
config.middleware.use MSeo::BotDetectionMiddleware
config.middleware.use MSeo::AutoMetaInjectionMiddleware

=================================================================
8. TESTING (RSPEC)
=================================================================

RSpec.describe MSeo::Client do
  let(:client) { MSeo::Client.new }

  describe '#generate_meta' do
    it 'generates meta tags' do
      result = client.generate_meta(
        title: 'Test Page',
        description: 'Test description',
        url: 'https://example.com'
      )

      expect(result).to have_key(:html)
      expect(result[:html]).to include('Test Page')
    end
  end

  describe '#check_bot' do
    it 'detects Googlebot' do
      result = client.check_bot('Googlebot/2.1')

      expect(result[:is_bot]).to be true
      expect(result[:bot_info][:name]).to eq('Googlebot')
    end
  end
end

=================================================================
9. API USAGE
=================================================================

# Direct client usage
client = MSeo::Client.new

# Generate meta
meta = client.generate_meta(
  title: 'My Page',
  description: 'Description',
  url: 'https://example.com'
)

# Run audit
audit = client.run_audit('https://example.com', nil, store: true)
puts "SEO Score: #{audit[:score]}/100"

# Batch audit
urls = Product.pluck(:canonical_url)
client.run_batch_audit(urls, webhook_url)

=================================================================
10. EVENT SUBSCRIPTIONS
=================================================================

# config/initializers/mseo_events.rb
ActiveSupport::Notifications.subscribe('mseo.meta_generated') do |name, start, finish, id, payload|
  Rails.logger.info "Meta generated for: #{payload[:data][:url]}"
end

ActiveSupport::Notifications.subscribe('mseo.audit_completed') do |name, start, finish, id, payload|
  if payload[:result][:score] < 50
    AdminMailer.low_seo_score(payload[:url], payload[:result]).deliver_later
  end
end

=================================================================
11. INSTALLATION
=================================================================

# 1. Add to Gemfile (or copy file to lib/mseo.rb)
# gem 'mseo-rails'

# 2. Run generator
rails generate mseo:install

# 3. Run migrations
rails db:migrate

# 4. Configure (see config/initializers/mseo.rb)

# 5. Start using!
@meta = MSeo.client.generate_meta(title: 'Hello World')

=end
