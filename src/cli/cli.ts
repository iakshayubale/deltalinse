#!/usr/bin/env node

/**
 * CLI Entry Point
 * Orchestrates parsing, comparing, analyzing, and reporting test results
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CLIOptions } from '../types/index.js';
import { TestResultParser } from '../parsers/junit.js';
import { TestComparator } from '../core/comparator.js';
import { FailureClusterer } from '../core/clusterer.js';
import { ReportGenerator } from '../formatters/html-report.js';
import { PRCommentGenerator } from '../utils/pr-comment.js';

async function main() {
  try {
    const args = process.argv.slice(2);
    
    // Handle --help flag
    if (args.includes('--help') || args.includes('-h')) {
      printHelp();
      process.exit(0);
    }
    
    // Handle --version flag
    if (args.includes('--version') || args.includes('-v')) {
      printVersion();
      process.exit(0);
    }
    
    const options = parseArgs(args);

    // Validate inputs
    if (!options.oldReport || !options.newReport) {
      console.error(
        '❌ Usage: deltalinse <old-report.xml> <new-report.xml> [--output report.html] [--pr-comment]'
      );
      console.error('\nRun "deltalinse --help" for more information');
      process.exit(1);
    }

    if (!fs.existsSync(options.oldReport)) {
      console.error(`❌ Old report not found: ${options.oldReport}`);
      process.exit(1);
    }

    if (!fs.existsSync(options.newReport)) {
      console.error(`❌ New report not found: ${options.newReport}`);
      process.exit(1);
    }

    console.log('📊 Analyzing test results...');

    // Parse results
    const parser = new TestResultParser();
    const oldResults = parser.parse(options.oldReport);
    const newResults = parser.parse(options.newReport);

    console.log(
      `✓ Old Results: ${oldResults.totalTests} tests (${oldResults.passed} passed, ${oldResults.failed} failed)`
    );
    console.log(
      `✓ New Results: ${newResults.totalTests} tests (${newResults.passed} passed, ${newResults.failed} failed)`
    );

    // Compare results
    const comparator = new TestComparator();
    const comparisons = comparator.compare(oldResults, newResults, options.threshold || 20);

    // Cluster failures
    const clusterer = new FailureClusterer();
    const clusters = clusterer.cluster(comparisons);

    // Generate report
    const generator = new ReportGenerator();
    const summary = generator.generateSummary(comparisons, clusters);

    // Output metrics
    console.log('\n📈 Results:');
    console.log(`  🔴 New Failures: ${summary.newFailures}`);
    console.log(`  ✅ Fixed Tests: ${summary.fixedFailures}`);
    console.log(`  ⚠️  Flaky Tests: ${summary.flakyTests}`);
    console.log(`  ⏱️  Slower Tests (>20%): ${summary.slowerTests}`);
    console.log(`  🔗 Failure Clusters: ${summary.clusters.length}`);

    // Generate HTML report
    const html = generator.generateHTML(summary);
    const outputPath = options.output || 'report.html';
    fs.writeFileSync(outputPath, html);
    console.log(`\n✅ HTML Report generated: ${outputPath}`);

    // Generate PR comment if requested
    if (options.prComment) {
      const prCommentGenerator = new PRCommentGenerator();
      const prComment = prCommentGenerator.generate(summary);
      console.log('\n📝 PR Comment Preview:');
      console.log('─'.repeat(60));
      console.log(prComment);
      console.log('─'.repeat(60));
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

function printHelp(): void {
  console.log(`
DeltaLinse - The Git Diff for Test Results
v1.1.0

Usage:
  deltalinse <old-report.xml> <new-report.xml> [options]

Arguments:
  <old-report.xml>        Path to baseline JUnit XML test results
  <new-report.xml>        Path to current JUnit XML test results

Options:
  --output <file>         Output HTML report path (default: report.html)
  --pr-comment            Generate GitHub PR comment markdown
  --threshold <number>    Slowness threshold in percent (default: 20)
  --help, -h              Show this help message
  --version, -v           Show version number

Examples:
  # Generate HTML report
  deltalinse old_results.xml new_results.xml

  # Custom output path
  deltalinse old.xml new.xml --output my-report.html

  # Generate PR comment
  deltalinse old.xml new.xml --pr-comment

  # Set performance threshold to 30%
  deltalinse old.xml new.xml --threshold 30

Documentation:
  https://github.com/iakshayubale/deltalinse
  `);
}

function printVersion(): void {
  console.log('1.1.0');
}

function parseArgs(args: string[]): CLIOptions {
  const options: CLIOptions = {
    oldReport: '',
    newReport: '',
    output: undefined,
    prComment: false,
    threshold: 20,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--output' && args[i + 1]) {
      options.output = args[++i];
    } else if (arg === '--pr-comment') {
      options.prComment = true;
    } else if (arg === '--threshold' && args[i + 1]) {
      options.threshold = parseInt(args[++i], 10);
    } else if (!arg.startsWith('--')) {
      if (!options.oldReport) {
        options.oldReport = arg;
      } else if (!options.newReport) {
        options.newReport = arg;
      }
    }
  }

  return options;
}

main();
