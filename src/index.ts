/**
 * Main entry point for programmatic usage
 * Export all classes for building custom tools on top of CI Diff Report
 */

export { TestResultParser } from './parser.js';
export { TestComparator } from './comparator.js';
export { FailureClusterer } from './clusterer.js';
export { ReportGenerator } from './reporter.js';
export { PRCommentGenerator } from './pr-comment.js';

export type {
  TestResult,
  TestSuite,
  ParsedResults,
  TestComparison,
  FailureCluster,
  ReportSummary,
  CLIOptions,
} from './types.js';
