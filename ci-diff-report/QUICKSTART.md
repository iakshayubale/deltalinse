# Quick Start Guide

## 5-Minute Tutorial

### 1. Install
```bash
npm install -g ci-diff-report
# or
npm install --save-dev ci-diff-report
```

### 2. Get Test Results
You need two JUnit XML test result files:
- `old_results.xml` - Results from base/main branch
- `new_results.xml` - Results from feature branch

Most CI systems generate these automatically:
- **Jest**: Add `--json --outputFile=results.json` to test command, convert with ci-diff-report
- **Pytest**: Use `pytest --junit-xml=results.xml`
- **Maven**: Generates in `target/surefire-reports/`
- **GitHub Actions**: Use `EnricoMi/publish-unit-test-result-action`

### 3. Generate Report
```bash
ci-diff-report old_results.xml new_results.xml
```

This creates `report.html` in your current directory.

### 4. Open Report
```bash
open report.html  # macOS
xdg-open report.html  # Linux
start report.html  # Windows
```

### 5. Share
- **Email**: Attach `report.html`
- **Slack**: Upload as file
- **GitHub PR**: Commit and link
- **Any chat**: Works everywhere

## What You'll See

The report shows:

### 📊 Summary Dashboard
- **🔴 New Failures**: Tests that started failing
- **✅ Fixed Tests**: Tests that started passing
- **⚠️ Flaky Tests**: Tests with inconsistent results
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
ci-diff-report old.xml new.xml --pr-comment
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
ci-diff-report old.xml new.xml --output reports/latest.html
```

### Adjust Performance Threshold
```bash
# Mark tests as slow if >30% slower (instead of default 20%)
ci-diff-report old.xml new.xml --threshold 30
```

## Programmatic Usage

Use in your own tools:

```javascript
import { 
  TestResultParser,
  TestComparator,
  ReportGenerator 
} from 'ci-diff-report';

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
          npx ci-diff-report old_results.json new_results.json
          
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
    - npm install -g ci-diff-report
    - npm test
    - ci-diff-report old_results.xml new_results.xml
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
          npm install -g ci-diff-report
          ci-diff-report ${WORKSPACE}/old_results.json \
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
- Run: `ci-diff-report --help` (coming soon)

---

That's it! You now have a beautiful, shareable test report showing exactly what changed. 🚀
