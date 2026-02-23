/**
 * Core type definitions for test results and report data structures
 */

export interface TestResult {
  name: string;
  className: string;
  status: 'passed' | 'failed' | 'skipped';
  duration: number; // milliseconds
  error?: {
    type: string;
    message: string;
    stacktrace: string;
  };
  stdout?: string;
  stderr?: string;
}

export interface TestSuite {
  name: string;
  tests: TestResult[];
  timestamp?: string;
  duration: number;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
}

export interface ParsedResults {
  suites: TestSuite[];
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  totalDuration: number;
}

export interface TestComparison {
  test: TestResult;
  oldStatus: 'passed' | 'failed' | 'skipped' | 'new';
  newStatus: 'passed' | 'failed' | 'skipped';
  statusChanged: boolean;
  durationChange: number; // milliseconds, negative = faster
  durationChangePercent: number;
  isRegression: boolean; // was passing, now failing
  isFixed: boolean; // was failing, now passing
  isFlaky: boolean; // happens across runs
}

export interface FailureCluster {
  id: string;
  tests: TestComparison[];
  errorType: string;
  errorMessage: string;
  similarity: 'high' | 'medium' | 'low';
  count: number;
}

export interface ReportSummary {
  totalTests: number;
  newFailures: number;
  fixedFailures: number;
  flakyTests: number;
  slowerTests: number;
  fasterTests: number;
  regressions: TestComparison[];
  fixes: TestComparison[];
  flaky: TestComparison[];
  performanceRegression: TestComparison[];
  clusters: FailureCluster[];
  generatedAt: string;
}

export interface CLIOptions {
  oldReport: string;
  newReport: string;
  output?: string;
  prComment?: boolean;
  threshold?: number; // duration change threshold in %
}
