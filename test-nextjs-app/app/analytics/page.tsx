'use client';

import { useState, useEffect } from 'react';

export default function AnalyticsPage() {
  const [botDetected, setBotDetected] = useState(false);
  const [userAgent, setUserAgent] = useState('');
  const [auditResults, setAuditResults] = useState<any>(null);

  useEffect(() => {
    // Get user agent
    setUserAgent(navigator.userAgent);

    // Simple bot detection
    const isBot = /bot|crawler|spider/i.test(navigator.userAgent);
    setBotDetected(isBot);

    // Simulate SEO audit
    setTimeout(() => {
      setAuditResults({
        score: 95,
        checks: [
          { name: 'Title tag present', passed: true },
          { name: 'Meta description present', passed: true },
          { name: 'Open Graph tags', passed: true },
          { name: 'Structured data', passed: true },
          { name: 'Mobile friendly', passed: true },
          { name: 'Page speed', passed: true },
        ],
        recommendations: [
          'Consider adding more internal links',
          'Image alt texts are well optimized',
        ],
      });
    }, 1000);
  }, []);

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">📊 Analytics Dashboard</h1>
        <p className="page-subtitle">SEO Audit & Bot Detection</p>
      </div>

      <div className="grid">
        <div className="stat-card">
          <h4>Bot Detected</h4>
          <div className="stat-value">{botDetected ? 'Yes' : 'No'}</div>
          <p style={{ marginTop: '0.5rem', color: 'var(--gray)' }}>
            {botDetected ? 'Search engine bot' : 'Regular user'}
          </p>
        </div>

        <div className="stat-card" style={{ borderLeftColor: 'var(--secondary)' }}>
          <h4>SEO Score</h4>
          <div className="stat-value" style={{ color: 'var(--secondary)' }}>
            {auditResults?.score || '...'}
          </div>
          <p style={{ marginTop: '0.5rem', color: 'var(--gray)' }}>
            Out of 100
          </p>
        </div>
      </div>

      <div className="card">
        <h2>User Agent</h2>
        <pre style={{ marginTop: '1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {userAgent || 'Loading...'}
        </pre>
      </div>

      {auditResults && (
        <div className="card">
          <h2>SEO Audit Results</h2>

          <h3>Checks Performed</h3>
          <div style={{ marginTop: '1rem' }}>
            {auditResults.checks.map((check: any, index: number) => (
              <div key={index} style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ marginRight: '0.5rem' }}>
                  {check.passed ? '✅' : '❌'}
                </span>
                {check.name}
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '1.5rem' }}>Recommendations</h3>
          <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
            {auditResults.recommendations.map((rec: string, index: number) => (
              <li key={index} style={{ padding: '0.25rem 0' }}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h2>Enterprise Features Demo</h2>
        <p>
          This page demonstrates M-SEO's enterprise features like bot detection
          and SEO auditing. In a real application, you would:
        </p>
        <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem' }}>
          <li>Run SEO audits programmatically with <code>SeoAuditEngine</code></li>
          <li>Detect bots in middleware for optimized content delivery</li>
          <li>Track analytics with Google Analytics 4 integration</li>
          <li>Generate SEO reports with <code>SeoReportGenerator</code></li>
          <li>Monitor Search Console data programmatically</li>
        </ul>

        <div style={{ marginTop: '1rem' }}>
          <span className="badge badge-primary">Bot Detection</span>
          <span className="badge badge-success">SEO Audit</span>
          <span className="badge badge-secondary">Analytics</span>
        </div>
      </div>
    </>
  );
}
