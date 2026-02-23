# 🔍 DeltaLinse

[![Build Status](https://img.shields.io/github/actions/workflow/status/iakshayubale/deltalinse/build-and-test.yml?branch=main&style=flat-square)](https://github.com/iakshayubale/deltalinse/actions)
[![npm version](https://img.shields.io/npm/v/deltalinse?style=flat-square)](https://www.npmjs.com/package/deltalinse)
[![npm downloads](https://img.shields.io/npm/dm/deltalinse?style=flat-square)](https://www.npmjs.com/package/deltalinse)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/deltalinse?style=flat-square)](https://nodejs.org/)

**🎯 Like Git Diff, but for Test Results**

See exactly what changed in your tests between two runs. In seconds. In a single HTML file. Zero setup.

---

## The Problem: Test Result Blindness 🤔

You've just merged a pull request. CI runs. Tests pass/fail. You get an email notification. Then... what?

### ❌ Old Way: The Dashboard Hunting Game

```
❌ 150 tests ran - which ones matter?
❌ 8 failed - are these NEW failures?
❌ Were any tests FIXED in this PR?
❌ Is test X flaky or legitimately broken?
❌ Are tests slower than yesterday?
❌ Why are these 3 failures similar?
❌ Time spent: 15+ minutes
❌ Clarity: Confused
```

### ✅ New Way: DeltaLinse - Instant Clarity

```
✅ Compare two test runs in ONE command
✅ NEW failures highlighted in RED
✅ FIXED tests highlighted in GREEN  
✅ FLAKY tests marked immediately
✅ SIMILAR failures grouped together
✅ PERFORMANCE regressions flagged
✅ Time spent: 30 seconds
✅ Clarity: Crystal clear
```

**Think of it this way:**

| Traditional Tools | DeltaLinse |
|---|---|
| **Git**: Shows entire repo | **Git Diff**: Shows only changes ✨ |
| **Test Dashboards**: Show all results | **DeltaLinse**: Show only changes ✨ |

---

## Why This Tool Exists

### The Real Problem We Solve

**Dashboards show you EVERYTHING. DeltaLinse shows you what CHANGED.**

When your CI runs tests:
- Dashboard says: "150 total tests, 148 passed, 2 failed"
- DeltaLinse answers: "Were those 2 failures NEW? Were any old failures FIXED? Are they FLAKY?"

### Why Your Team Needs This

Your team doesn't care about all test results. Your team cares about:
- ✅ "Did I break anything new?"
- ✅ "Did I fix something?"
- ✅ "Is this a real failure or flaky?"
- ✅ "Are tests running slower?"

**Existing tools miss this entirely.**

---

## How We're Different

## How We're Different

### 🚀 vs. Test Dashboards (Allure, Kiln, TestNG)
**Dashboard**: "Here are 500 test results arranged nicely."  
**DeltaLinse**: "Here are the differences. Focus on what changed." ✨

### 🚀 vs. CI Platforms (Jenkins, GitHub Actions)  
**CI Platform**: "Your build passed/failed. Check the logs."  
**DeltaLinse**: "Here's what CHANGED in test results between builds." ✨

### 🚀 vs. Metrics Tools (Grafana, Prometheus)
**Metrics**: "Test counts over the last 30 days."  
**DeltaLinse**: "What changed THIS run vs LAST run?" ✨

### 🚀 vs. Log Aggregators (ELK, Splunk)
**Aggregator**: "Search through millions of test logs manually."  
**DeltaLinse**: "Failures grouped by similarity. Your answers ready." ✨

---

## What You Get

### 🎯 Automatic Regression Highlighting
Instantly see what changed:

```
✅ FIXED:        3 tests (were failing, now passing) - GREEN
🔴 NEW FAILURES: 5 tests (were passing, now failing) - RED
⚠️  FLAKY:       2 tests (unstable, fail/pass varies) - YELLOW
🐢 SLOW:         7 tests (now >20% slower) - ORANGE
🔗 GROUPED:      Similar failures clustered by cause
```

### 📊 Interactive Heatmap
Visual test suite health at a glance:
- Color gradient from red (0% pass rate) to green (100% pass rate)
- Shows top 15 test suites by health status
- Hover for detailed pass/fail counts
- Instantly spot failures in your test matrix

### 💾 Single HTML File
Everything embedded - nothing external needed:
- ✅ CSS styling (no stylesheets)
- ✅ JavaScript interactivity (works offline)
- ✅ JSON data (all comparisons)
- ✅ Heatmap visualization
- ✅ Share via Slack, Email, S3, or Comments

### 🔗 Failure Clustering
Similar failures grouped together:
- Groups by error message similarity (Levenshtein distance)
- Identifies patterns across failures
- Help you spot root causes faster

### ⚡ Zero Configuration
```bash
# That's literally it
deltalinse old_results.xml new_results.xml
```

No YAML files. No databases. No servers. No authentication.

### 💬 PR Comment Ready
Generate markdown for pull requests instantly:
```bash
deltalinse old_results.xml new_results.xml --pr-comment
```

---

## Real-World Use Cases

### Use Case 1: Pull Request Testing
**Scenario**: You just opened a PR with 50 test changes.

**Old way**: 
- CI dashboard shows 142/150 passing
- You have no idea which tests changed status
- You check logs manually (30 minutes)

**With DeltaLinse**:
```bash
deltalinse main-tests.xml feature-tests.xml
# Instant report shows:
# 🟢 5 tests FIXED
# 🔴 2 tests BROKE (investigate!)
# 🟡 1 test is FLAKY
```

### Use Case 2: Performance Regression Detection
**Scenario**: Tests running slowly but you don't know which ones.

```bash
deltalinse baseline.xml current.xml
# Report highlights tests now >20% slower
# Helps catch performance regressions early
```

### Use Case 3: Flaky Test Isolation
**Scenario**: "Is test X legitimately broken or just flaky?"

```bash
deltalinse yesterday-tests.xml today-tests.xml
# 🟡 Test marked as FLAKY if it fails sometimes, passes sometimes
# Ready to isolate and fix
```

### Use Case 4: Release Verification
**Scenario**: "Did we break anything from the last version?"

```bash
deltalinse v1.0.0-tests.xml v1.1.0-tests.xml
# Compare test results between versions
# Ensure zero regressions before shipping
```

---

## Installation

### ⚡ Quick Start (Global)

### ⚡ Quick Start (Global)
```bash
npm install -g deltalinse
deltalinse old_results.xml new_results.xml
# ✅ Opens report.html automatically
```

### 📦 Other Installation Methods

**Local to Project** (Recommended for CI)
```bash
npm install --save-dev deltalinse
npx deltalinse old_results.xml new_results.xml
```

**Via npx** (No Install Needed)
```bash
npx deltalinse old_results.xml new_results.xml
```

**From GitHub Releases**
Download directly: [github.com/iakshayubale/deltalinse/releases](https://github.com/iakshayubale/deltalinse/releases)

---

## Usage

## Usage

```bash
# Basic usage
deltalinse old_results.xml new_results.xml

# Custom output file
deltalinse old_results.xml new_results.xml --output my-report.html

# Generate PR comment markdown
deltalinse old_results.xml new_results.xml --pr-comment

# Custom slow threshold (default: 20% slower)
deltalinse old_results.xml new_results.xml --threshold 30
```

---

## Supported Formats

✅ **JUnit XML** (Standard format from most CI systems)

Compatible with:
- Jest
- Pytest  
- Maven Surefire
- Gradle Test Reports
- GitHub Actions
- GitLab CI
- Jenkins
- CircleCI
- Azure DevOps

---

## CI/CD Integration Examples

### GitHub Actions
```yaml
- name: Generate test report diff
  if: always()
  run: npx deltalinse old_results.xml new_results.xml --pr-comment
```

### GitLab CI
```yaml
test_report_diff:
  script:
    - npx deltalinse old_results.xml new_results.xml --pr-comment
  artifacts:
    paths:
      - report.html
```

### Jenkins
```groovy
stage('Test Report') {
  steps {
    sh 'npx deltalinse old.xml new.xml'
  }
}
```

---

## Why Teams Choose DeltaLinse

✅ **Developers**: Instant clarity on what your changes broke  
✅ **QA**: See exactly which tests regressed  
✅ **CI/CD**: Integrate in 30 seconds, zero config  
✅ **Release Mgmt**: Verify zero regressions before shipping  
✅ **Team Leads**: Beautiful reports to share  

---

## The Philosophy

**Every dashboard tries to SHOW MORE.** 

**DeltaLinse shows what CHANGED.**

Just like `git diff` changed how we review code, DeltaLinse changes how we review test results.

---

## Key Features

|  |  |
|---|---|
| 🎯 **Regression Detection** | See pass→fail instantly |
| ✅ **Fix Detection** | See fail→pass with green |
| ⚠️ **Flaky Tests** | Identify unstable tests |
| 🐢 **Performance Analysis** | Find >20% slower tests |
| 🔗 **Error Clustering** | Group similar failures |
| 📊 **Heatmap** | Color-coded test health |
| 💬 **PR Comments** | Ready-made markdown |
| 📁 **Single File** | No server needed |
| ⚡ **Zero Config** | Works out of the box |
| 🔒 **Private** | Runs locally |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Want to help?**
- Report bugs
- Suggest features
- Improve documentation
- Add format support
- Optimize performance

---

## Resources

- **[QUICKSTART.md](QUICKSTART.md)** - 2-minute quick start
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Developer guidelines
- **[CHANGELOG.md](CHANGELOG.md)** - Version history & releases
- **[GitHub Issues](https://github.com/iakshayubale/deltalinse/issues)** - Bug reports & features

---

## License

MIT © 2026 - Free for commercial and personal use

---

## Made with ❤️ for teams who care about test quality

*DeltaLinse: The Git Diff for Test Results*
