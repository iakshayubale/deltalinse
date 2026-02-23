/**
 * Failure Clustering
 * Groups failures by error similarity (stacktrace & message)
 */

import type { TestComparison, FailureCluster } from './types.js';

export class FailureClusterer {
  cluster(comparisons: TestComparison[]): FailureCluster[] {
    const failedTests = comparisons.filter(
      (c) => c.newStatus === 'failed' && c.oldStatus !== 'failed'
    );

    const clusters = new Map<string, FailureCluster>();
    let clusterId = 0;

    for (const comparison of failedTests) {
      if (!comparison.test.error) {
        continue;
      }

      let foundCluster = false;

      // Try to match with existing clusters
      for (const cluster of clusters.values()) {
        const similarity = this.calculateSimilarity(
          comparison.test.error,
          cluster.errorType,
          cluster.errorMessage
        );

        if (similarity >= 0.7) {
          cluster.tests.push(comparison);
          cluster.count++;
          foundCluster = true;
          break;
        }
      }

      // Create new cluster if no match
      if (!foundCluster) {
        const error = comparison.test.error;
        const id = `cluster-${clusterId++}`;

        clusters.set(id, {
          id,
          tests: [comparison],
          errorType: error.type,
          errorMessage: error.message,
          similarity: 'high',
          count: 1,
        });
      }
    }

    return Array.from(clusters.values()).sort((a, b) => b.count - a.count);
  }

  private calculateSimilarity(
    error: { type: string; message: string; stacktrace: string },
    errorType: string,
    errorMessage: string
  ): number {
    let similarity = 0;

    // Type match
    if (error.type === errorType) {
      similarity += 0.4;
    }

    // Message similarity (levenshtein-like)
    const messageSimilarity = this.stringSimilarity(
      error.message,
      errorMessage
    );
    similarity += messageSimilarity * 0.6;

    return Math.min(similarity, 1.0);
  }

  private stringSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) {
      return 1.0;
    }

    const editDistance = this.getEditDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private getEditDistance(s1: string, s2: string): number {
    const costs: number[] = [];

    for (let i = 0; i <= s1.length; i++) {
      let lastValue = i;
      for (let j = 0; j <= s2.length; j++) {
        if (i === 0) {
          costs[j] = j;
        } else if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          }
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
      if (i > 0) costs[s2.length] = lastValue;
    }

    return costs[s2.length];
  }
}
