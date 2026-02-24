/**
 * Main entry point for programmatic usage
 * Export all classes for building custom tools on top of CI Diff Report
 */

export { TestResultParser } from './parsers/junit.js';
export { TestComparator } from './core/comparator.js';
export { FailureClusterer } from './core/clusterer.js';
export { ReportGenerator } from './formatters/html-report.js';
export { PRCommentGenerator } from './utils/pr-comment.js';

export type {
  TestResult,
  TestSuite,
  ParsedResults,
  TestComparison,
  FailureCluster,
  ReportSummary,
  CLIOptions,
} from './types/index.js';
