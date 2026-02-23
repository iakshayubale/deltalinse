# 🧪 CI Diff Report

[![Build Status](https://img.shields.io/github/actions/workflow/status/yourusername/ci-diff-report/build-and-test.yml?branch=main&style=flat-square)](https://github.com/yourusername/ci-diff-report/actions)
[![npm version](https://img.shields.io/npm/v/ci-diff-report?style=flat-square)](https://www.npmjs.com/package/ci-diff-report)
[![npm downloads](https://img.shields.io/npm/dm/ci-diff-report?style=flat-square)](https://www.npmjs.com/package/ci-diff-report)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/ci-diff-report?style=flat-square)](https://nodejs.org/)

> **The Git Diff for Test Results**
> 
> See exactly what changed in your tests in seconds. No server. No config.

## Why CI Diff Report?

Instead of pretty dashboards, you get laser-focused insight into what actually broke in your pull request:

- **Pass → Fail** (red) — New regressions
- **Fail → Pass** (green) — Fixed tests
- **Flaky Detection** — Tests that unreliably fail/pass
- **Performance Regression** — Tests running >20% slower
- **Failure Clustering** — Similar failures grouped together

All in a **single HTML file** with zero setup required.

## Quick Start

```bash
# Install
npm install -g ci-diff-report

# Generate report
ci-diff-report old_results.xml new_results.xml

# Output
# ✅ HTML Report generated: report.html

# With PR comment preview
ci-diff-report old_results.xml new_results.xml --pr-comment
```

## Features

### 🎯 Automatic Regression Highlighting

Instantly see:
- Tests that regressed (pass → fail)
- Tests that were fixed (fail → pass)
- Flaky tests (inconsistent behavior)
- Performance regressions (duration >20% increase)

### 📄 Single Self-Contained HTML

Everything embedded:
- CSS styling
- JavaScript interactivity
- JSON data
- No external dependencies
- Shareable anywhere (Slack, email, PR comments)

### 🔗 Failure Clustering

Failures grouped by:
- Error type similarity
- Error message similarity
- Stacktrace patterns

Helps identify systemic issues vs one-off failures.

### 💬 PR Comment Ready

Generate markdown summaries perfect for adding to pull requests:

```markdown
## 🧪 Test Summary
| | |
|---|---|
| 🔴 **New Failures** | 2 |
| ✅ **Fixed Tests** | 1 |
| ⚠️ **Flaky Tests** | 3 |
| ⏱️ **Slower (>20%)** | 5 |
```

## Installation

### via npm (Recommended)

**Global Installation**
```bash
npm install -g ci-diff-report
ci-diff-report old_results.xml new_results.xml
```

**Local Installation (in project)**
```bash
npm install --save-dev ci-diff-report
npx ci-diff-report old_results.xml new_results.xml
```

### via npx (No Installation)
```bash
npx ci-diff-report old_results.xml new_results.xml
```

### via GitHub Releases
Download the latest release from [Releases](https://github.com/iakshayubale/ci-diff-report/releases)

### via Homebrew (macOS)
```bash
# Coming soon
brew install ci-diff-report
```

## Installation

### Global CLI
```bash
npm install -g ci-diff-report
```

### Local
```bash
npm install --save-dev ci-diff-report
npx ci-diff-report old.xml new.xml
```

## Usage

### Basic
```bash
ci-diff-report old_results.xml new_results.xml
```

### With Custom Output
```bash
ci-diff-report old_results.xml new_results.xml --output my-report.html
```

### Generate PR Comment
```bash
ci-diff-report old_results.xml new_results.xml --pr-comment
```

### Custom Duration Threshold
```bash
# Mark tests as slow if >30% slower (default: 20%)
ci-diff-report old_results.xml new_results.xml --threshold 30
```

## Supported Test Formats

- JUnit XML (standard format from most CI systems)
- Works with: Jest, Pytest, Maven, Gradle, GitHub Actions, GitLab CI, Jenkins, CircleCI, etc.

## CI/CD Integration

### GitHub Actions

```yaml
- name: Generate test report diff
  if: always()
  run: |
    npx ci-diff-report old_results.xml new_results.xml --pr-comment
```

### GitLab CI

```yaml
test_report_diff:
  script:
    - npx ci-diff-report old_results.xml new_results.xml --pr-comment
  artifacts:
    paths:
      - report.html
```

### Jenkins

```groovy
stage('Test Report') {
  steps {
    sh 'npx ci-diff-report ${WORKSPACE}/old.xml ${WORKSPACE}/new.xml'
  }
}
```

## Architecture

```
┌─────────────────────┐
│   CLI Entry Point   │
└──────────┬──────────┘
           │
    ┌──────┴──────┐
    ▼             ▼
 [old.xml]    [new.xml]
    │             │
    └──────┬──────┘
           │
    ┌──────▼──────────┐
    │ Parse Results   │ (JUnit XML)
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │  Compare Tests  │ (Detect regressions, fixes, flaky)
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Cluster Failures│ (Group by similarity)
    └──────┬──────────┘
           │
    ┌──────▼──────────┐
    │ Generate Report │ (HTML + JSON + CSS + JS)
    └──────┬──────────┘
           │
      [report.html] ◄─── Single self-contained file
```

## Example Workflow

1. Run tests for base branch: `old_results.xml`
2. Run tests for feature branch: `new_results.xml`
3. Generate diff: `ci-diff-report old_results.xml new_results.xml`
4. Open `report.html` in browser
5. See exactly what changed
6. Share link or add to PR

## Key Differentiators

| Feature | CI Diff Report | Traditional Dashboards |
|---------|---|---|
| **Setup** | 0 minutes | 30+ minutes |
| **Focus** | What changed | Pretty charts |
| **Storage** | Single HTML file | Database + backend |
| **Sharing** | Email/Slack/PR | Link to dashboard |
| **Learning curve** | Instant | Days |
| **Git-friendly** | Yes (commit report.html) | No |

## Development

### Build
```bash
npm run build
```

### Watch mode
```bash
npm run dev
```

### Test with examples
```bash
npm run build
node dist/cli.js examples/old_results.xml examples/new_results.xml --pr-comment
```

## Why This Works

Most teams ask: **"Our test reports aren't pretty enough"**

But developers really want: **"I don't know what actually broke in this PR"**

CI Diff Report answers the second question better than anyone by:
- Being stateless (no server)
- Being diff-focused (what changed?)
- Being zero-setup (one command)
- Being developer-first (solves real problems)

## License

MIT

## Contributing

We're early stage and focused on the core use case. Suggestions welcome!

---

**Made for developers who care about test signal.**
