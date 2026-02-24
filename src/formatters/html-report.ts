/**
 * Report Generator
 * Creates a premium, single-file HTML report with embedded CSS, JS, and JSON
 */

import type { TestComparison, FailureCluster, ReportSummary } from '../types/index.js';

export class ReportGenerator {
  generateSummary(
    comparisons: TestComparison[],
    clusters: FailureCluster[]
  ): ReportSummary {
    const regressions = comparisons.filter((c) => c.isRegression);
    const fixes = comparisons.filter((c) => c.isFixed);
    const flaky = comparisons.filter((c) => c.isFlaky);
    const performanceRegression = comparisons.filter(
      (c) => c.durationChangePercent > 20 && c.newStatus === 'passed'
    );

    return {
      totalTests: comparisons.length,
      newFailures: regressions.length,
      fixedFailures: fixes.length,
      flakyTests: flaky.length,
      slowerTests: performanceRegression.length,
      fasterTests: comparisons.filter(
        (c) => c.durationChangePercent < -20 && c.newStatus === 'passed'
      ).length,
      regressions,
      fixes,
      flaky,
      performanceRegression,
      clusters,
      generatedAt: new Date().toISOString(),
    };
  }

  generateHTML(summary: ReportSummary): string {
    const styles = this.generateStyles();
    const scripts = this.generateScripts();
    const summary_json = JSON.stringify(summary);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Test Report Diff</title>
  <style>${styles}</style>
</head>
<body>
  <div id="app"></div>
  <script>
    window.reportData = ${summary_json};
  </script>
  <script>${scripts}</script>
</body>
</html>`;
  }

  private generateStyles(): string {
    return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
      color: #2d3748;
      line-height: 1.6;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    header {
      background: white;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    h1 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #1a202c;
    }

    .subtitle {
      color: #718096;
      font-size: 14px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 30px;
    }

    .stat-card {
      background: #f7fafc;
      border-left: 4px solid #cbd5e0;
      padding: 15px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .stat-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      transform: translateY(-2px);
    }

    .stat-card.positive {
      border-left-color: #48bb78;
      background: #f0fff4;
    }

    .stat-card.negative {
      border-left-color: #f56565;
      background: #fff5f5;
    }

    .stat-card.warning {
      border-left-color: #ed8936;
      background: #fffaf0;
    }

    .stat-label {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #718096;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .stat-value {
      font-size: 32px;
      font-weight: 700;
      color: #1a202c;
    }

    .stat-card.positive .stat-value {
      color: #22863a;
    }

    .stat-card.negative .stat-value {
      color: #cb2431;
    }

    .section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .section h2 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #1a202c;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }

    .tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid #e2e8f0;
    }

    .tab-btn {
      padding: 10px 16px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      font-weight: 500;
      color: #718096;
      transition: all 0.3s ease;
      font-size: 14px;
    }

    .tab-btn.active {
      border-bottom-color: #3182ce;
      color: #3182ce;
    }

    .tab-content {
      display: none;
    }

    .tab-content.active {
      display: block;
    }

    .test-group {
      margin-bottom: 20px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }

    .test-group-header {
      background: #f7fafc;
      padding: 12px;
      font-weight: 600;
      cursor: pointer;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .test-group-header:hover {
      background: #edf2f7;
    }

    .test-item {
      padding: 12px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .test-item:last-child {
      border-bottom: none;
    }

    .test-name {
      flex: 1;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 13px;
      color: #2d3748;
    }

    .test-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 10px;
    }

    .status-regression {
      background: #fed7d7;
      color: #742a2a;
    }

    .status-fixed {
      background: #c6f6d5;
      color: #22543d;
    }

    .status-flaky {
      background: #fed7e2;
      color: #742839;
    }

    .status-slower {
      background: #feebc8;
      color: #7c2d12;
    }

    .error-details {
      background: #f7fafc;
      border-left: 2px solid #f56565;
      padding: 12px;
      margin-top: 10px;
      border-radius: 4px;
      display: none;
    }

    .error-details.show {
      display: block;
    }

    .error-type {
      font-weight: 600;
      color: #742a2a;
      margin-bottom: 5px;
    }

    .error-message {
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 12px;
      color: #2d3748;
      word-break: break-word;
      max-height: 200px;
      overflow-y: auto;
    }

    .cluster {
      background: #f7fafc;
      border-left: 4px solid #ed8936;
      padding: 12px;
      margin-bottom: 10px;
      border-radius: 4px;
    }

    .cluster-count {
      display: inline-block;
      background: #ed8936;
      color: white;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 10px;
    }

    .empty-state {
      text-align: center;
      padding: 40px;
      color: #718096;
    }

    .empty-state-icon {
      font-size: 48px;
      margin-bottom: 15px;
    }

    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 8px;
    }

    .badge-new {
      background: #bee3f8;
      color: #2c5282;
    }

    .footer {
      text-align: center;
      padding: 20px;
      color: #718096;
      font-size: 12px;
    }

    .heatmap-section {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .heatmap-section h2 {
      font-size: 18px;
      margin-bottom: 15px;
      color: #1a202c;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 10px;
    }

    .heatmap-container {
      display: grid;
      gap: 2px;
      padding: 15px;
      background: #f7fafc;
      border-radius: 6px;
    }

    .heatmap-header {
      display: flex;
      gap: 8px;
      margin-bottom: 15px;
      flex-wrap: wrap;
      align-items: center;
    }

    .heatmap-legend {
      display: flex;
      gap: 15px;
      flex-wrap: wrap;
      align-items: center;
      font-size: 12px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .legend-color {
      width: 20px;
      height: 20px;
      border-radius: 3px;
      border: 1px solid #cbd5e0;
    }

    .heatmap-grid-container {
      overflow-x: auto;
    }

    .heatmap-grid {
      display: grid;
      grid-template-columns: 150px repeat(auto-fit, minmax(40px, 1fr));
      gap: 0;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }

    .heatmap-cell {
      aspect-ratio: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s ease;
      border-right: 1px solid rgba(255,255,255,0.1);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      text-shadow: 0 1px 2px rgba(0,0,0,0.1);
      position: relative;
    }

    .heatmap-cell:hover {
      transform: scale(1.05);
      box-shadow: inset 0 0 8px rgba(0,0,0,0.2);
      z-index: 10;
    }

    .heatmap-cell-label {
      padding: 8px;
      background: #f7fafc;
      color: #2d3748;
      font-weight: 600;
      font-size: 12px;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      word-break: break-word;
      overflow: hidden;
    }

    .heatmap-cell-label:hover {
      background: #edf2f7;
      transform: none;
    }

    .heatmap-cell[data-rate="0"] { background: #f56565; }
    .heatmap-cell[data-rate="10"] { background: #fc8181; }
    .heatmap-cell[data-rate="20"] { background: #f6ad55; }
    .heatmap-cell[data-rate="30"] { background: #ecc94b; }
    .heatmap-cell[data-rate="40"] { background: #c6f6d5; }
    .heatmap-cell[data-rate="50"] { background: #9ae6b4; }
    .heatmap-cell[data-rate="60"] { background: #68d391; }
    .heatmap-cell[data-rate="70"] { background: #48bb78; }
    .heatmap-cell[data-rate="80"] { background: #38a169; }
    .heatmap-cell[data-rate="90"] { background: #22543d; }
    .heatmap-cell[data-rate="100"] { background: #1e4620; }

    .heatmap-tooltip {
      position: absolute;
      background: #1a202c;
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 11px;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.2s;
      z-index: 100;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
    }

    .heatmap-cell:hover .heatmap-tooltip {
      opacity: 1;
    }

    @media (max-width: 768px) {
      .summary-grid {
        grid-template-columns: 1fr;
      }

      h1 {
        font-size: 24px;
      }

      .test-item {
        flex-direction: column;
        align-items: flex-start;
      }

      .test-status {
        margin-left: 0;
        margin-top: 8px;
      }

      .heatmap-grid {
        grid-template-columns: 100px repeat(auto-fit, minmax(30px, 1fr));
      }

      .heatmap-legend {
        flex-direction: column;
        align-items: flex-start;
      }
    }
    `;
  }

  private generateScripts(): string {
    return `
    (function() {
      const data = window.reportData;

      // Render app
      const app = document.getElementById('app');
      app.innerHTML = render();

      // Attach event listeners
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const tab = e.target.dataset.tab;
          switchTab(tab);
        });
      });

      document.querySelectorAll('.test-group-header').forEach(header => {
        header.addEventListener('click', (e) => {
          e.currentTarget.nextElementSibling.classList.toggle('show');
        });
      });

      document.querySelectorAll('.test-item').forEach(item => {
        item.addEventListener('click', (e) => {
          const details = item.querySelector('.error-details');
          if (details) details.classList.toggle('show');
        });
      });

      function render() {
        return \`
          <div class="container">
            <header>
              <h1>🧪 Test Report Diff</h1>
              <p class="subtitle">See exactly what changed in your tests</p>
              <div class="summary-grid">
                <div class="stat-card \${data.newFailures > 0 ? 'negative' : 'positive'}">
                  <div class="stat-label">🔴 New Failures</div>
                  <div class="stat-value">\${data.newFailures}</div>
                </div>
                <div class="stat-card positive">
                  <div class="stat-label">✅ Fixed Tests</div>
                  <div class="stat-value">\${data.fixedFailures}</div>
                </div>
                <div class="stat-card warning">
                  <div class="stat-label">⚠️ Flaky Tests</div>
                  <div class="stat-value">\${data.flakyTests}</div>
                </div>
                <div class="stat-card \${data.slowerTests > 0 ? 'warning' : 'positive'}">
                  <div class="stat-label">⏱️ Slower (>20%)</div>
                  <div class="stat-value">\${data.slowerTests}</div>
                </div>
              </div>
            </header>

            <div class="heatmap-section">
              <h2>📊 Test Suite Health Heatmap</h2>
              \${renderHeatmap(data.regressions, data.fixes, data.flaky)}
            </div>

            <div class="section">
              <div class="tabs">
                <button class="tab-btn active" data-tab="regressions">Regressions (\${data.regressions.length})</button>
                <button class="tab-btn" data-tab="fixes">Fixes (\${data.fixes.length})</button>
                <button class="tab-btn" data-tab="flaky">Flaky (\${data.flakyTests})</button>
                <button class="tab-btn" data-tab="performance">Performance (\${data.slowerTests})</button>
                <button class="tab-btn" data-tab="clusters">Clusters (\${data.clusters.length})</button>
              </div>

              <div id="regressions" class="tab-content active">
                \${renderTests(data.regressions, 'regression')}
              </div>
              <div id="fixes" class="tab-content">
                \${renderTests(data.fixes, 'fixed')}
              </div>
              <div id="flaky" class="tab-content">
                \${renderTests(data.flaky, 'flaky')}
              </div>
              <div id="performance" class="tab-content">
                \${renderTests(data.performanceRegression, 'slower')}
              </div>
              <div id="clusters" class="tab-content">
                \${renderClusters(data.clusters)}
              </div>
            </div>

            <div class="footer">
              Generated at \${new Date(data.generatedAt).toLocaleString()}
            </div>
          </div>
        \`;
      }

      function renderTests(tests, type) {
        if (tests.length === 0) {
          return '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No \${type} tests found</p></div>';
        }

        const grouped = {};
        tests.forEach(test => {
          const suite = test.test.className;
          if (!grouped[suite]) grouped[suite] = [];
          grouped[suite].push(test);
        });

        return Object.entries(grouped).map(([suite, suiteTests]) => \`
          <div class="test-group">
            <div class="test-group-header">
              <span>\${suite}</span>
              <span>\${suiteTests.length} tests</span>
            </div>
            <div>
              \${suiteTests.map(t => \`
                <div class="test-item">
                  <div class="test-name">\${t.test.name}</div>
                  <div>
                    <span class="test-status status-\${type}">\${t.newStatus}</span>
                    \${t.durationChangePercent !== 0 ? \`<span class="badge badge-new">\${t.durationChangePercent > 0 ? '+' : ''}\${t.durationChangePercent.toFixed(1)}% time</span>\` : ''}
                  </div>
                  \${t.test.error ? \`
                    <div class="error-details">
                      <div class="error-type">\${t.test.error.type}</div>
                      <div class="error-message">\${t.test.error.message}</div>
                    </div>
                  \` : ''}
                </div>
              \`).join('')}
            </div>
          </div>
        \`).join('');
      }

      function renderClusters(clusters) {
        if (clusters.length === 0) {
          return '<div class="empty-state"><div class="empty-state-icon">✅</div><p>No failure clusters found</p></div>';
        }

        return clusters.map((cluster, i) => \`
          <div class="test-group">
            <div class="test-group-header">
              <span>\${cluster.errorType}</span>
              <span class="cluster-count">\${cluster.count} failures</span>
            </div>
            <div class="cluster">
              <div class="error-type">\${cluster.errorMessage}</div>
              <div style="margin-top: 10px; font-size: 12px; color: #718096;">
                Similar tests: \${cluster.tests.map(t => t.test.className + '::' + t.test.name).join(', ')}
              </div>
            </div>
          </div>
        \`).join('');
      }

      function renderHeatmap(regressions, fixes, flaky) {
        // Group all tests by className
        const suiteMap = new Map();
        const allTests = [...regressions, ...fixes, ...flaky];
        
        allTests.forEach(test => {
          const suite = test.test.className;
          if (!suiteMap.has(suite)) {
            suiteMap.set(suite, { total: 0, passed: 0 });
          }
          const stats = suiteMap.get(suite);
          stats.total++;
          if (!test.isRegression && test.newStatus === 'passed') {
            stats.passed++;
          }
        });

        const suites = Array.from(suiteMap.entries())
          .sort((a, b) => b[1].passed / b[1].total - a[1].passed / a[1].total)
          .slice(0, 15); // Show top 15 suites

        if (suites.length === 0) {
          return '<div class="empty-state"><div class="empty-state-icon">📊</div><p>No test suites to display</p></div>';
        }

        return \`
          <div class="heatmap-header">
            <div class="heatmap-legend">
              <span style="font-weight: 600; margin-right: 10px;">Pass Rate:</span>
              <div class="legend-item">
                <div class="legend-color" style="background: #f56565;"></div>
                <span>0%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #f6ad55;"></div>
                <span>25%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #c6f6d5;"></div>
                <span>50%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #48bb78;"></div>
                <span>75%</span>
              </div>
              <div class="legend-item">
                <div class="legend-color" style="background: #1e4620;"></div>
                <span>100%</span>
              </div>
            </div>
          </div>
          <div class="heatmap-grid-container">
            <div class="heatmap-grid">
              <div class="heatmap-cell-label" style="grid-column: 1; padding: 10px; text-align: center; background: #edf2f7;">Suite</div>
              \${suites.map((_, i) => \`
                <div class="heatmap-cell-label" style="grid-row: 1; text-align: center; font-size: 10px; color: #718096;">Test \${i + 1}</div>
              \`).join('')}
              \${suites.map(([suiteName, stats]) => {
                const passRate = (stats.passed / stats.total) * 100;
                const rateIndex = Math.round(passRate / 10) * 10;
                return \`
                  <div class="heatmap-cell-label">\${suiteName.substring(0, 20)}</div>
                  <div class="heatmap-cell" data-rate="\${rateIndex}" style="grid-column: 2 / span 1;">
                    <span style="position: relative;">
                      <span>\${Math.round(passRate)}%</span>
                      <div class="heatmap-tooltip">
                        \${stats.passed}/\${stats.total} passed
                      </div>
                    </span>
                  </div>
                \`;
              }).join('')}
            </div>
          </div>
        \`;
      }

      function switchTab(tab) {
        document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
        document.getElementById(tab).classList.add('active');
        event.target.classList.add('active');
      }
    })();
    `;
  }
}
