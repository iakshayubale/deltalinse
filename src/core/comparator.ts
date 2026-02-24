/**
 * Test Result Comparator
 * Compares old and new test results to identify regressions, fixes, and changes
 */

import type { ParsedResults, TestComparison, TestResult } from '../types/index.js';

export class TestComparator {
  compare(
    oldResults: ParsedResults,
    newResults: ParsedResults,
    durationThreshold: number = 20 // percentage
  ): TestComparison[] {
    const oldMap = this.buildTestMap(oldResults);
    const newMap = this.buildTestMap(newResults);
    const comparisons: TestComparison[] = [];

    // Compare existing tests
    for (const [key, newTest] of newMap) {
      const oldTest = oldMap.get(key);

      if (oldTest) {
        comparisons.push(
          this.compareTests(oldTest, newTest, durationThreshold)
        );
      } else {
        // New test
        comparisons.push({
          test: newTest,
          oldStatus: 'new',
          newStatus: newTest.status,
          statusChanged: newTest.status === 'failed',
          durationChange: 0,
          durationChangePercent: 0,
          isRegression: newTest.status === 'failed',
          isFixed: false,
          isFlaky: false,
        });
      }
    }

    // Check for removed tests (they're considered regressions)
    for (const [key, oldTest] of oldMap) {
      if (!newMap.has(key)) {
        comparisons.push({
          test: oldTest,
          oldStatus: oldTest.status,
          newStatus: 'failed', // missing test is a regression
          statusChanged: true,
          durationChange: 0,
          durationChangePercent: 0,
          isRegression: true,
          isFixed: false,
          isFlaky: false,
        });
      }
    }

    return comparisons;
  }

  private compareTests(
    oldTest: TestResult,
    newTest: TestResult,
    durationThreshold: number
  ): TestComparison {
    const statusChanged = oldTest.status !== newTest.status;
    const isRegression = oldTest.status === 'passed' && newTest.status === 'failed';
    const isFixed = oldTest.status === 'failed' && newTest.status === 'passed';

    const durationChange = newTest.duration - oldTest.duration;
    const durationChangePercent =
      oldTest.duration > 0
        ? (durationChange / oldTest.duration) * 100
        : 0;

    const isFlaky = statusChanged && newTest.status !== 'skipped';

    return {
      test: newTest,
      oldStatus: oldTest.status,
      newStatus: newTest.status,
      statusChanged,
      durationChange,
      durationChangePercent,
      isRegression,
      isFixed,
      isFlaky,
    };
  }

  private buildTestMap(
    results: ParsedResults
  ): Map<string, TestResult> {
    const map = new Map<string, TestResult>();

    for (const suite of results.suites) {
      for (const test of suite.tests) {
        const key = `${test.className}::${test.name}`;
        map.set(key, test);
      }
    }

    return map;
  }

  // Detect flaky tests that appear multiple times in same result
  detectFlakiness(comparisons: TestComparison[]): TestComparison[] {
    const testCounts = new Map<string, number>();

    for (const comparison of comparisons) {
      const key = `${comparison.test.className}::${comparison.test.name}`;
      testCounts.set(key, (testCounts.get(key) || 0) + 1);
    }

    return comparisons.map((c) => {
      const key = `${c.test.className}::${c.test.name}`;
      if (testCounts.get(key)! > 1) {
        c.isFlaky = true;
      }
      return c;
    });
  }
}
