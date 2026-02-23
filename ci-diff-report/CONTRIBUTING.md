# Contributing to CI Diff Report

First off, thank you for considering contributing to CI Diff Report! 🎉

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps which reproduce the problem**
* **Provide specific examples to demonstrate the steps**
* **Describe the behavior you observed after following the steps**
* **Explain which behavior you expected to see instead and why**
* **Include screenshots and animated GIFs if possible**
* **Include your environment details** (OS, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests

* Fill in the required template
* Follow the TypeScript / JavaScript style guides
* Include appropriate test coverage
* Document new code with JSDoc comments
* End all files with a newline

## Development Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/deltalinse.git
cd deltalinse

# Install dependencies
npm install

# Start development mode with watch
npm run dev

# Build the project
npm run build

# Test with examples
node dist/cli.js examples/old_results.xml examples/new_results.xml
```

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

### Code Organization

```
src/
├── cli.ts              # CLI interface only
├── core/
│   ├── parser.ts       # Core parsing logic
│   ├── comparator.ts   # Comparison logic
│   └── types.ts        # Shared interfaces
├── analysis/
│   ├── clusterer.ts    # Clustering algorithm
│   └── analyzer.ts     # Additional analysis
└── output/
    ├── reporter.ts     # HTML generation
    └── pr-comment.ts   # Markdown generation
```

## Testing

Test your changes locally before submitting:

```bash
# Build
npm run build

# Run with examples
node dist/cli.js examples/old_results.xml examples/new_results.xml --pr-comment

# Verify output
open report.html
```

## Documentation

* Update README.md if you change functionality
* Update CHANGELOG.md with your changes
* Add comments to complex logic
* Keep documentation examples up-to-date

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
