# Pre-Launch Checklist

> **Status**: ✅ All code development complete. Project is ready for deployment.

## Phase 1: Pre-Deployment (Do This First)

### 1.1 Update Repository Metadata
- [x] Already updated with GitHub username: iakshayubale
  (This was done automatically)

- [ ] Update GitHub profile in `package.json`:
  ```json
  "author": "Your Name <your.email@example.com>"
  ```

- [ ] Update repository URLs if using different repo name:
  ```bash
  sed -i '' 's/ci-diff-report/YOUR_REPO_NAME/g' package.json
  ```

### 1.2 Verify Local Build
- [ ] Run build to ensure no TypeScript errors:
  ```bash
  npm run build
  ```
  Expected: ✅ TypeScript compilation successful

- [ ] Generate test report to verify CLI works:
  ```bash
  node dist/cli.js examples/old_results.xml examples/new_results.xml > report.html
  ```
  Expected: ✅ 22KB+ HTML file with heatmap section

- [ ] Inspect report.html in a browser
  - Should show stat cards with metrics
  - Should show colorful heatmap grid below
  - Should have tabs with details

## Phase 2: GitHub Repository Setup

### 2.1 Create GitHub Repository
- [ ] Go to [github.com/new](https://github.com/new)
- [ ] **Repository name**: `ci-diff-report`
- [ ] **Description**: "🔍 Diff-First Test Report Tool • Instant Regression Detection • Zero Setup"
- [ ] **Public** (checked)
- [ ] **Initialize with README**: Unchecked (we have our own)
- [ ] Click **Create repository**

### 2.2 Push Code to GitHub
```bash
cd /Users/akshayubale/git/ci-diff-report
git add .
git commit -m "Initial commit: ci-diff-report v1.0.0" || echo "Already committed"
git branch -M main
git remote add origin https://github.com/iakshayubale/ci-diff-report.git
git push -u origin main
```

- [ ] Verify push successful
- [ ] Check repo appears on GitHub with all files

## Phase 3: GitHub Secrets Configuration

### 3.1 Get npm Token
- [ ] Create/login to [npmjs.com](https://npmjs.com)
- [ ] Go to **Account Settings** → **Tokens** → **Generate New Token**
- [ ] Select **Automation** token type
- [ ] Copy the token (you'll only see it once)

### 3.2 Add Secret to GitHub
- [ ] Go to your repo: `github.com/iakshayubale/ci-diff-report`
- [ ] Click **Settings** → **Secrets and variables** → **Actions**
- [ ] Click **New repository secret**
  - **Name**: `NPM_TOKEN`
  - **Value**: Paste your npm token
- [ ] Click **Add secret**

- [ ] Verify secret appears in the list

## Phase 4: Create Initial Release

### 4.1 Tag Version
```bash
git tag v1.0.0 -m "Release v1.0.0: Initial public release"
git push origin v1.0.0
```

- [ ] Verify tag appears on GitHub under **Releases**

### 4.2 Monitor GitHub Actions
- [ ] Go to repo → **Actions** tab
- [ ] Wait for **Release** workflow to run (takes 1-2 minutes)
- [ ] Expected jobs:
  - `build` - Compiles and tests ✅
  - `publish` - Publishes to npm ✅

### 4.3 Verify npm Publication
- [ ] Go to [npmjs.com/package/ci-diff-report](https://npmjs.com/package/ci-diff-report)
- [ ] Verify v1.0.0 appears with all files
- [ ] Check package details page loads correctly

## Phase 5: Integration Testing

### 5.1 Global Installation
```bash
npm install -g ci-diff-report
ci-diff-report --help
```

- [ ] Command works globally
- [ ] Help text displays correctly

### 5.2 Project Installation
- [ ] In a new directory:
  ```bash
  npm init -y
  npm install ci-diff-report
  npx ci-diff-report --help
  ```

- [ ] Works via npx
- [ ] Works as local dependency

### 5.3 Real Test Scenario
- [ ] Generate two test XML files (or use examples)
- [ ] Run: `ci-diff-report old.xml new.xml`
- [ ] Verify report.html generates and opens correctly
- [ ] Check heatmap renders with colors

## Phase 6: Documentation & Community

### 6.1 Create GitHub Repo Description
- [ ] Add to repo **About** section:
  - **Description**: "🔍 Git diff for test results"
  - **Website**: Link to project if applicable
  - **Topics**: `testing`, `ci-cd`, `test-reporting`, `diff`, `automation`

### 6.2 Announce Release
- [ ] Add to relevant communities:
  - Dev.to post
  - Twitter/X announcement  
  - Dev subreddits
  - Local tech meetups

### 6.3 Monitor First Issues
- [ ] Check GitHub Issues regularly
- [ ] Respond to bug reports within 24 hours
- [ ] Use CONTRIBUTING.md for guidance

## Phase 7: Future Maintenance

### 7.1 Version Bumps
For new features:
```bash
# Update version in package.json
vim package.json  # Change version to 1.1.0

# Update CHANGELOG.md with new features

# Commit and tag
git add package.json CHANGELOG.md
git commit -m "docs: update for v1.1.0"
git tag v1.1.0
git push origin main
git push origin v1.1.0
```

### 7.2 Regular Tasks
- [ ] Review and respond to GitHub issues weekly
- [ ] Keep dependencies updated: `npm audit`
- [ ] Monitor GitHub Actions for failures
- [ ] Update documentation as features change

## Success Criteria

After completing all phases, verify:

✅ **npm package**: 
- Available at `npm install ci-diff-report`
- Has 50+ keywords
- Shows correct version
- Lists examples in docs

✅ **GitHub repo**:
- Main branch has all files
- README displays correctly
- Actions workflows have run successfully
- GitHub releases page populated

✅ **Functionality**:
- Global install works
- Local install works
- npx works
- Generates report with heatmap
- All 3 colors visible in heat map

✅ **Community ready**:
- Contributing guidelines clear
- Issue templates present
- PR template present
- CHANGELOG maintained
- License visible

## Common Issues & Solutions

**Issue**: GitHub Actions fails with "npm publish 404"
- **Solution**: Verify NPM_TOKEN secret is set correctly in GitHub Settings

**Issue**: Package appears on npm but not downloadable
- **Solution**: Wait 5-10 minutes for npm CDN to sync

**Issue**: Heatmap doesn't show in report.html
- **Solution**: Rebuild with `npm run build` and verify dist/reporter.js contains renderHeatmap

**Issue**: Old version still installed globally
- **Solution**: `npm uninstall -g ci-diff-report && npm install -g ci-diff-report`

## Support
For issues during deployment:
1. Check DEPLOYMENT.md for detailed steps
2. Check PRODUCTION_READY.md for validation
3. Review GitHub Actions logs for build failures
4. Check npm registry for publication status

---

**Last Updated**: Phase 3 Complete - All code ready for deployment
**Estimated Time to Complete**: 30-45 minutes
**Difficulty**: Medium (mostly pointing & clicking + 4 git commands)

Good luck! 🚀
