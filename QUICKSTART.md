# 🚀 Quick Start Guide - Production Ready

> **Get actionable test insights in 30 seconds**

## Installation (Choose One)

### Option 1: Global (Recommended for CI/CD)
```bash
npm install -g deltalinse
```

After install, you can use `deltalinse` from anywhere:
```bash
deltalinse old_results.xml new_results.xml
```

### Option 2: Local Project (Recommended for Teams)
```bash
npm install --save-dev deltalinse
```

Then use via npx:
```bash
npx deltalinse old_results.xml new_results.xml
```

### Option 3: No Installation (Quick Test)
```bash
npx deltalinse old_results.xml new_results.xml
```

---

## Real-World Usage Examples

### Example 1: Compare Pull Request Tests

**Scenario**: You opened a PR and want to know if you broke anything

```bash
# Locally
npm test > my-branch-tests.xml
git checkout main
npm test > main-tests.xml

# Generate comparison
deltalinse main-tests.xml my-branch-tests.xml

# Opens report.html showing:
# ✅ What tests were fixed
# 🔴 What tests broke
# ⚠️ Which tests are flaky
# 🐢 Which tests got slower
```

### Example 2: GitHub Actions Workflow

Save this as `.github/workflows/test-report.yml`:

```yaml
name: Test Report Diff

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Test base branch
        run: |
          git checkout origin/main
          npm test -- --xml=base-tests.xml || true

      - name: Test PR branch
        run: |
          git checkout ${{ github.head_ref }}
          npm test -- --xml=pr-tests.xml || true

      - name: Generate report
        if: always()
        run: npx deltalinse base-tests.xml pr-tests.xml

      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: report.html
```

Now every PR automatically shows test diffs! 🎉

### Example 3: GitLab CI Pipeline

Save as `.gitlab-ci.yml`:

```yaml
test-report:
  stage: test
  script:
    - npm test -- --xml=current.xml || true
    - git checkout origin/main
    - npm test -- --xml=main.xml || true
    - npx deltalinse main.xml current.xml
  artifacts:
    paths:
      - report.html
    when: always
```

### Example 4: Jenkins Pipeline

In your `Jenkinsfile`:

```groovy
pipeline {
  stages {
    stage('Test Report Diff') {
      steps {
        script {
          sh 'npm test > new-tests.xml || true'
          sh 'git checkout main && npm test > main-tests.xml || true'
          sh 'npx deltalinse main-tests.xml new-tests.xml'
        }
      }
      post {
        always {
          archiveArtifacts artifacts: 'report.html', allowEmptyArchive: true
        }
      }
    }
  }
}
```

### Example 5: Local Development - Team Handoff

```bash
# Developer 1: Work on feature
npm test > feature-tests.xml

# For Code Review - send both files:
zip test-report.zip feature-tests.xml main-tests.xml

# Reviewer can check locally:
unzip test-report.zip
deltalinse main-tests.xml feature-tests.xml
# Opens full report in browser ✅
```

---

## Different Test Frameworks

### Jest
```bash
npm test -- --json --outputFile=results.json
# Convert to JUnit XML, then:
deltalinse old.xml new.xml
```

### Pytest
```bash
pytest --junit-xml=results.xml
deltalinse old.xml new.xml
```

### Maven
```bash
mvn test
# XML files in: target/surefire-reports/
deltalinse target/surefire-reports/*.xml
```

### Gradle
```bash
./gradlew test
# XML files in: build/test-results/
deltalinse build/test-results/test/*.xml
```

### .NET/NUnit
```bash
dotnet test --logger "trx;LogFileName=results.trx"
# Convert TRX to JUnit XML, then:
deltalinse old.xml new.xml
```

---

## Common Commands

### Basic (Most Common)
```bash
deltalinse old_results.xml new_results.xml
# ✨ Creates report.html in current directory
```

### Custom Output Location
```bash
deltalinse old_results.xml new_results.xml --output /path/to/report.html
```

### Generate PR Comment
```bash
deltalinse old_results.xml new_results.xml --pr-comment
# Outputs markdown ready for GitHub/GitLab PRs
```

### Custom Performance Threshold
```bash
# Mark tests as slow if >30% slower (default is 20%)
deltalinse old_results.xml new_results.xml --threshold 30
```

### Verbose Mode
```bash
# See detailed analysis (coming soon)
deltalinse old_results.xml new_results.xml --verbose
```

---

## What The Report Shows

### 📊 Summary Cards
- **New Failures**: Pass→Fail (🔴 RED)
- **Fixed Tests**: Fail→Pass (✅ GREEN)
- **Flaky Tests**: Inconsistent results (⚠️ YELLOW)
- **Slower Tests**: >20% duration increase (🐢 ORANGE)

### 📈 Interactive Heatmap
- Color-coded by pass rate (red 0% → green 100%)
- Top 15 test suites
- Hover for details

### 📋 Detailed Tabs
- **All Changes**: Every test that changed
- **New Failures**: What broke
- **Fixed**: What improved
- **Flaky**: What's unreliable
- **Slower**: Performance regressions
- **Error Clusters**: Similar failures grouped

---

## Real-World Scenarios

### Scenario 1: "Did I break anything?"
```bash
# Your branch
npm test > my-tests.xml
# Main branch
git stash && git checkout main && npm test > main-tests.xml

deltalinse main-tests.xml my-tests.xml
# RED = you broke something 🔴
# GREEN = you fixed something ✅
```

### Scenario 2: "Is this test flaky?"
```bash
# Run same test 3 times
npm test > run1.xml
npm test > run2.xml

deltalinse run1.xml run2.xml
# See if same tests fail in different runs? = FLAKY ⚠️
```

### Scenario 3: "Are tests getting slower?"
```bash
# Yesterday
npm test > yesterday.xml

# Today
npm test > today.xml

deltalinse yesterday.xml today.xml
# Shows which tests are >20% slower (🐢 ORANGE)
```

### Scenario 4: "Safe to release v1.1.0?"
```bash
# Last version that shipped
npm test > v1.0.0-tests.xml

# Current build
npm test > v1.1.0-tests.xml

deltalinse v1.0.0-tests.xml v1.1.0-tests.xml
# Any regressions before release? = See immediately
```

---

## Share The Report

### Email
```bash
# Report is self-contained HTML, just attach it
mail -s "Test Report" team@company.com < report.html
```

### Slack
1. Upload `report.html` to Slack
2. Share the file link with team
3. Anyone can open and view

### GitHub PR
```bash
# Commit report or upload as artifact
git add report.html
git commit -m "test: add test report diff"
git push

# Paste link in PR comment
```

### S3 / Cloud Storage
```bash
# Save to persistent location
aws s3 cp report.html s3://my-bucket/test-reports/

# Share S3 URL with team
```

---

## Production Checklist

✅ **Installation**: Works globally or locally  
✅ **Test Framework**: Generates

 JUnit XML  
✅ **Report**: Opens in browser  
✅ **Sharing**: Works everywhere (email, Slack, PR, web)  
✅ **CI/CD Integration**: Works in GitHub, GitLab, Jenkins, CircleCI  
✅ **No Dependencies**: Single HTML file, no server needed  
✅ **Privacy**: Runs locally, nothing sent to cloud  

---

## Next Steps

1. **Generate your first report**
   ```bash
   deltalinse old_tests.xml new_tests.xml
   open report.html
   ```

2. **Integrate with your CI/CD**
   - GitHub Actions: See Example 2 above
   - GitLab: See Example 3 above
   - Jenkins: See Example 4 above

3. **Share with your team**
   - Commit `report.html` to PR
   - Upload to your storage
   - Paste in chat/email

4. **Customize as needed**
   - Different output location: `--output`
   - Performance threshold: `--threshold`
   - PR markdown: `--pr-comment`

---

## Troubleshooting

### "Report not found"
Make sure you have two test result XML files in JUnit format

### "Tests not recognized"
Verify your XML is JUnit compatible (most CI systems are)

### "Slow tests not showing"
Check your test XML includes duration fields

### "Can't open report.html"
- Save report to same directory as command
- Use absolute path: `--output /full/path/report.html`
- Open in any modern browser

---

## Tips & Tricks

💡 **Tip 1**: Commit `report.html` to PR so reviewers see test changes immediately

💡 **Tip 2**: Use with `--pr-comment` to auto-generate markdown for pull requests

💡 **Tip 3**: Compare any two test XML files, not just before/after of same branch

💡 **Tip 4**: Report is self-contained - share via email, Slack, or upload anywhere

💡 **Tip 5**: Run multiple times and compare - great for flaky test detection

---

**Ready? Run your first report:**
```bash
deltalinse old_results.xml new_results.xml
```

✨ **That's it! You now have crystal-clear test insights** ✨
- **⏱️ Performance**: Tests running significantly slower

### 📋 Detailed Tabs
1. **Regressions** - Click to see error details
2. **Fixes** - What got better
3. **Flaky** - Unreliable tests
4. **Performance** - Duration changes
5. **Clusters** - Similar errors grouped

## Advanced Usage

### Generate PR Comment
Perfect for adding to pull requests:
```bash
deltalinse old.xml new.xml --pr-comment
```

Outputs markdown like:
```
## 🧪 Test Summary
| 🔴 New Failures | 2 |
| ✅ Fixed Tests | 1 |
| ⚠️ Flaky Tests | 3 |
```

### Custom Output Location
```bash
deltalinse old.xml new.xml --output reports/latest.html
```

### Adjust Performance Threshold
```bash
# Mark tests as slow if >30% slower (instead of default 20%)
deltalinse old.xml new.xml --threshold 30
```

## Programmatic Usage

Use in your own tools:

```javascript
import { 
  TestResultParser,
  TestComparator,
  ReportGenerator 
} from 'deltalinse';

const parser = new TestResultParser();
const oldResults = parser.parse('old.xml');
const newResults = parser.parse('new.xml');

const comparator = new TestComparator();
const comparisons = comparator.compare(oldResults, newResults);

const generator = new ReportGenerator();
const summary = generator.generateSummary(comparisons, []);
const html = generator.generateHTML(summary);

// Use html however you want
```

## CI/CD Examples

### GitHub Actions
```yaml
jobs:
  test-report-diff:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run tests
        run: npm test -- --json --outputFile=new_results.json
      
      - name: Download base results
        run: |
          git fetch origin main:main
          git checkout main
          npm test -- --json --outputFile=old_results.json 2>/dev/null || true
          git checkout -
      
      - name: Generate report
        if: always()
        run: |
          npx deltalinse old_results.json new_results.json
          
      - name: Upload report
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-report
          path: report.html
```

### GitLab CI
```yaml
test_report:
  image: node:18
  script:
    - npm install -g deltalinse
    - npm test
    - deltalinse old_results.xml new_results.xml
  artifacts:
    paths:
      - report.html
    when: always
```

### Jenkins
```groovy
pipeline {
  stages {
    stage('Test') {
      steps {
        sh 'npm test -- --json --outputFile=new_results.json'
      }
    }
    
    stage('Report Diff') {
      steps {
        sh '''
          npm install -g deltalinse
          deltalinse ${WORKSPACE}/old_results.json \
                         ${WORKSPACE}/new_results.json
        '''
      }
    }
  }
  
  post {
    always {
      archiveArtifacts 'report.html'
    }
  }
}
```

## Troubleshooting

**Report is empty?**
- Make sure both XML files are valid JUnit format
- Check file paths are correct

**Performance threshold not working?**
- Use `--threshold` as a number (e.g., `--threshold 30`)

**HTML report won't open?**
- Try a modern browser (Chrome, Firefox, Safari, Edge)
- Some browsers block local file access; use a local server: `python3 -m http.server`

**Need help?**
- Check examples: `examples/old_results.xml` and `examples/new_results.xml`
- Run: `deltalinse --help` (coming soon)

---

That's it! You now have a beautiful, shareable test report showing exactly what changed. 🚀
