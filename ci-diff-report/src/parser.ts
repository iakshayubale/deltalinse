/**
 * JUnit XML Parser
 * Converts JUnit XML test results to our internal format
 */

import * as fs from 'fs';
import { XMLParser } from 'fast-xml-parser';
import type { TestResult, TestSuite, ParsedResults } from './types.js';

export class TestResultParser {
  private parser: XMLParser;

  constructor() {
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: '@_',
      parseAttributeValue: true,
    });
  }

  parse(filePath: string): ParsedResults {
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = this.parser.parse(content);

    const testsuites = parsed.testsuites || { testsuite: parsed.testsuite };
    const suites = Array.isArray(testsuites.testsuite)
      ? testsuites.testsuite
      : [testsuites.testsuite];

    const results: TestSuite[] = suites.map((suite: any) =>
      this.parseSuite(suite)
    );

    const totalTests = results.reduce((acc, s) => acc + s.totalTests, 0);
    const passed = results.reduce((acc, s) => acc + s.passed, 0);
    const failed = results.reduce((acc, s) => acc + s.failed, 0);
    const skipped = results.reduce((acc, s) => acc + s.skipped, 0);
    const totalDuration = results.reduce((acc, s) => acc + s.duration, 0);

    return {
      suites: results,
      timestamp: new Date().toISOString(),
      totalTests,
      passed,
      failed,
      skipped,
      totalDuration,
    };
  }

  private parseSuite(suite: any): TestSuite {
    const testcases = Array.isArray(suite.testcase)
      ? suite.testcase
      : suite.testcase
        ? [suite.testcase]
        : [];

    const tests: TestResult[] = testcases.map((tc: any) =>
      this.parseTestCase(tc, suite['@_name'] || 'unknown')
    );

    const passed = tests.filter((t) => t.status === 'passed').length;
    const failed = tests.filter((t) => t.status === 'failed').length;
    const skipped = tests.filter((t) => t.status === 'skipped').length;

    return {
      name: suite['@_name'] || 'unknown',
      tests,
      timestamp: suite['@_timestamp'],
      duration: (suite['@_time'] || 0) * 1000, // convert to ms
      totalTests: tests.length,
      passed,
      failed,
      skipped,
    };
  }

  private parseTestCase(testcase: any, suiteName: string): TestResult {
    const name = testcase['@_name'] || 'unknown';
    const duration = (testcase['@_time'] || 0) * 1000; // convert to ms

    // Determine status
    let status: 'passed' | 'failed' | 'skipped' = 'passed';
    let error: TestResult['error'] | undefined;

    if (testcase.skipped) {
      status = 'skipped';
    } else if (testcase.failure) {
      status = 'failed';
      const failure = Array.isArray(testcase.failure)
        ? testcase.failure[0]
        : testcase.failure;
      error = {
        type: failure['@_type'] || 'AssertionError',
        message: failure['@_message'] || failure['#text'] || '',
        stacktrace: failure['#text'] || '',
      };
    } else if (testcase.error) {
      status = 'failed';
      const err = Array.isArray(testcase.error)
        ? testcase.error[0]
        : testcase.error;
      error = {
        type: err['@_type'] || 'Error',
        message: err['@_message'] || err['#text'] || '',
        stacktrace: err['#text'] || '',
      };
    }

    return {
      name,
      className: testcase['@_classname'] || suiteName,
      status,
      duration,
      error,
      stdout: testcase['system-out']?.['#text'],
      stderr: testcase['system-err']?.['#text'],
    };
  }
}
