#!/usr/bin/env node

/**
 * CLI Entry Point
 * Orchestrates parsing, comparing, analyzing, and reporting test results
 */

import * as fs from 'fs';
import * as path from 'path';
import type { CLIOptions } from './types.js';
import { TestResultParser } from './parser.js';
import { TestComparator } from './comparator.js';
import { FailureClusterer } from './clusterer.js';
import { ReportGenerator } from './reporter.js';
import { PRCommentGenerator } from './pr-comment.js';

async function main() {
  try {
    const args = process.argv.slice(2);
    const options = parseArgs(args);

    // Validate inputs
    if (!options.oldReport || !options.newReport) {
      console.error(
        '❌ Usage: ci-diff-report <old-report.xml> <new-report.xml> [--output report.html] [--pr-comment]'
      );
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
