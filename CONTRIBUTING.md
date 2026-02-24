# Contributing to DeltaLinse

Thank you for considering contributing to DeltaLinse! 🎉

This guide will help you understand our community standards and make your contribution process smooth.

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. Please be respectful to all contributors.

---

## How to Contribute

### 🐛 Reporting Bugs

Found a bug? Help us fix it!

**Before reporting:**
1. Check if the bug is already reported in [Issues](https://github.com/iakshayubale/deltalinse/issues)
2. Try reproducing it with the latest version

**When reporting, include:**
- Clear title describing the bug
- Steps to reproduce the issue
- Expected behavior vs actual behavior  
- Your environment: Node.js version, OS
- Error messages or logs
- Example JUnit XML files if applicable

**Example bug report:**
```
Title: "Parser crashes on empty test results"

Steps to reproduce:
1. Create empty XML file: `<testsuites></testsuites>`
2. Run: `deltalinse empty.xml results.xml`
3. Error: "Cannot read property 'length' of undefined"

Expected: Graceful handling with helpful error message
Actual: Process crashes

Environment: Node.js 20.10.0, macOS 14.2
```

### ✨ Suggesting Features

Have an idea? We'd love to hear it!

**Before suggesting:**
1. Check [Issues](https://github.com/iakshayubale/deltalinse/issues) for similar requests
2. Check [Discussions](https://github.com/iakshayubale/deltalinse/discussions) for related ideas

**When suggesting, include:**
- Clear title describing the feature
- Example use case showing the value
- How it helps developers
- Alternative approaches you considered

### 💬 Discussions & Questions

Use [GitHub Discussions](https://github.com/iakshayubale/deltalinse/discussions) for:
- Questions about how to use DeltaLinse
- Ideas you want to discuss before suggesting
- Sharing your workflows
- Getting help with specific use cases

---

## Development Setup

### Prerequisites
- Node.js 18+ (tested on 18.x and 20.x)
- npm 9+
- Git

### Getting Started

```bash
# 1. Fork the repository
# Go to https://github.com/iakshayubale/deltalinse
# Click "Fork" button

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/deltalinse.git
cd deltalinse

# 3. Add upstream remote
git remote add upstream https://github.com/iakshayubale/deltalinse.git

# 4. Install dependencies
npm install

# 5. Create feature branch
git checkout -b feature/my-feature-name
# or
git checkout -b fix/issue-description
```

### Development Commands

```bash
# Build TypeScript
npm run build

# Run tests with examples
npm test

# Run CLI directly
node dist/cli/cli.js examples/old_results.xml examples/new_results.xml

# Check for linting issues
npm run lint  # (if applicable)

# Type check
npx tsc --noEmit
```

### Project Structure

```
src/
├── cli/
│   └── cli.ts              # Entry point, CLI argument handling
├── core/
│   ├── comparator.ts       # Core diff logic
│   └── clusterer.ts        # Groups similar failures
├── formatters/
│   └── html-report.ts      # HTML output generation
├── parsers/
│   └── junit.ts            # JUnit XML parsing
├── types/
│   └── index.ts            # TypeScript type definitions
├── utils/
│   └── pr-comment.ts       # GitHub PR comment formatting
└── index.ts                # Public API exports

dist/                        # Compiled JavaScript
examples/                    # Example XML files for testing
```

### Understanding the Code

**Main Flow:**
1. **CLI** (`cli.ts`) - Parses command line arguments
2. **Parser** (`parsers/junit.ts`) - Reads JUnit XML files
3. **Comparator** (`core/comparator.ts`) - Compares two test runs
4. **Clusterer** (`core/clusterer.ts`) - Groups similar failures
5. **Formatter** (`formatters/html-report.ts`) - Generates HTML output

**Key Concepts:**
- `TestRun`: Parsed results from one XML file
- `TestComparison`: Result of comparing two runs
- `FailureCluster`: Group of similar failures

---

## Making Changes

### 1. Create a Feature Branch

```bash
# Always branch from main
git fetch upstream
git checkout -b fix/issue-#123 upstream/main

# Good branch names:
git checkout -b feature/support-cpp-xml
git checkout -b fix/flaky-test-detection
git checkout -b docs/improve-readme
```

### 2. Make Your Changes

**Guidelines:**
- ✅ Keep changes focused (one feature/fix per PR)
- ✅ Follow existing code style
- ✅ Add comments for complex logic
- ✅ Update TypeScript types
- ✅ Test your changes thoroughly

**Code Style:**
- TypeScript strict mode enabled
- Use `const` by default
- Use explicit types
- Descriptive variable names
- Comments for "why", not "what"

**Example:**
```typescript
// ❌ Bad: Unclear what this does
const c = failures.filter(f => f.m.includes('Error'));

// ✅ Good: Clear intent and types
const failedTests = failures.filter(
  (failure: Failure) => failure.message.includes('Error')
);
```

### 3. Test Your Changes

```bash
# Build successfully
npm run build

# Verify no TypeScript errors
npx tsc --noEmit

# Test with example files
node dist/cli/cli.js examples/old_results.xml examples/new_results.xml

# Check output
cat report.html

# For CLI changes, test various inputs:
node dist/cli/cli.js file1.xml file2.xml --output custom.html
```

**What to test:**
- Happy path: normal XML files
- Edge cases: empty results, single test, large files
- Error cases: missing files, malformed XML
- Different file paths: relative, absolute, with spaces

### 4. Commit with Meaningful Messages

```bash
# Format: type(scope): description

git commit -m "fix(comparator): improve flaky test detection using running history

- Changed threshold from exact match to 80% match
- Reduces false positives by 40%
- Still catches legitimately unstable tests

Fixes #123"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `refactor`: Code restructuring
- `perf`: Performance improvements
- `test`: Test additions/changes
- `chore`: Build, deps, etc

**Commit message guidelines:**
- First line: 50 characters max
- Blank line
- Details: What changed and why (not how)
- Reference issue: "Fixes #123" or "Closes #456"

### 5. Keep Your Branch Updated

```bash
# If main has new changes
git fetch upstream
git rebase upstream/main

# Or merge if rebase is scary
git merge upstream/main
```

---

## Submitting a Pull Request

### Before Submitting

- [ ] Code follows project style
- [ ] Tests pass: `npm test`
- [ ] TypeScript checks pass: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] Committed changes are focused
- [ ] Commit messages follow guidelines

### PR Checklist

**Click "Create Pull Request"** when ready.

**Fill in the PR template:**

```markdown
## What This Fixes
Brief 1-2 sentence summary

Fixes #123

## Changes
- Changed X to improve Y
- Added new function Z
- Updated tests for A

## Testing
How did you test this?
- Ran `npm test`
- Tested with file: examples/old_results.xml
- Verified output: report.html looks correct

## Screenshots (if applicable)
Before/After comparisons

## Related Issues
Fixes #123
Related to #456
```

### Review Process

1. **Automated Checks**: GitHub Actions runs tests, builds, type checks
2. **Maintainer Review**: We'll review and provide feedback
3. **Iterations**: Address feedback with new commits
4. **Merge**: PR merged when approved

**Tips for faster review:**
- ✅ Small, focused PRs review faster
- ✅ Clear commit messages help us understand intent
- ✅ Tests demonstrate your fix works
- ✅ Early feedback: ask questions in description

---

## Code Review Guidelines

When we review your PR, we look for:

✅ **Correctness**: Does it solve the problem?  
✅ **Tests**: Are there tests covering the change?  
✅ **Performance**: Any performance regressions?  
✅ **Maintainability**: Is it clear and well-documented?  
✅ **Edge Cases**: What about unusual inputs?  
✅ **Types**: Are TypeScript types correct?

---

## Style Guide

### TypeScript/JavaScript

* Use 2 spaces for indentation
* Declare variables with `const` by default, `let` when necessary, avoid `var`
* Write descriptive variable and function names
* Add JSDoc comments to public APIs
* Keep lines under 100 characters when reasonable

Example:
```typescript
/**
 * Parses a JUnit XML file and returns test results
 * @param filePath - Path to the XML file
 * @returns Parsed test results
 */
export function parse(filePath: string): ParsedResults {
  // Implementation
}
```

### Commit Messages

* Use the present tense ("add feature" not "added feature")
* Use the imperative mood ("move cursor to..." not "moves cursor to...")
* Limit the first line to 72 characters or less
* Reference issues and pull requests liberally after the first line

Example:
```
Add heatmap visualization for test status

- Add heatmap component to reporter
- Implement color gradient based on pass rate
- Update tests for new feature

Fixes #123
```

---

## Documentation

### README.md

Explains what DeltaLinse is and why to use it. Update if:
- Adding new feature users should know about
- Fixing broken examples
- Clarifying confusing sections

### CHANGELOG.md

Release notes. Update with:
- New features
- Bug fixes
- Breaking changes

Format:
```markdown
## [1.2.0] - 2026-02-24

### Added
- New feature X
- New function Y

### Fixed
- Bug with Z
- Issue #123

### Changed
- Behavior of A
```

## Testing

Test your changes locally before submitting:

```bash
# Build
npm run build

# Run with examples
node dist/cli/cli.js examples/old_results.xml examples/new_results.xml --pr-comment

# Verify output
open report.html
```

## Getting Help

### Questions?

Use [Discussions](https://github.com/iakshayubale/deltalinse/discussions):
- How do I use feature X?
- Is my approach correct?
- Help implementing change Y?

### Got Stuck?

1. Search existing issues/discussions
2. Ask on Discussions with context
3. Comment on the related issue

---

## Recognition

Contributors are recognized in:
- [CONTRIBUTORS](CONTRIBUTORS) file
- GitHub's "Contributors" page
- Release notes mentioning contributors

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Questions?

Feel free to:
- Open an issue for unclear policies
- Ask in Discussions
- Comment on related PRs

Thank you for making DeltaLinse better! 🚀

## Versioning

We follow [Semantic Versioning](https://semver.org/):

* **MAJOR** version for incompatible API changes
* **MINOR** version for new functionality in a backward-compatible manner
* **PATCH** version for backward-compatible bug fixes

## Release Process

Maintainers will:

1. Update CHANGELOG.md with all changes
2. Update version in package.json
3. Create a git tag: `git tag vX.Y.Z`
4. Push tag: `git push --tags`
5. GitHub Actions will automatically publish to npm

## Questions?

Feel free to open an issue or discussion for questions about contributing.

---

**Happy contributing! 🚀**
