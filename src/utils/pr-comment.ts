/**
 * PR Comment Generator
 * Generates markdown summary suitable for GitHub/GitLab PR comments
 */

import type { ReportSummary } from '../types/index.js';

export class PRCommentGenerator {
  generate(summary: ReportSummary): string {
    const lines: string[] = [];

    lines.push('## 🧪 Test Report Diff\n');

    // Summary metrics
    lines.push('### Summary');
    lines.push('|  |  |');
    lines.push('|---|---|');

    if (summary.newFailures > 0) {
      lines.push(
        `| 🔴 **New Failures** | ${summary.newFailures} |`
      );
    }

    if (summary.fixedFailures > 0) {
      lines.push(
        `| ✅ **Fixed Tests** | ${summary.fixedFailures} |`
      );
    }

    if (summary.flakyTests > 0) {
      lines.push(
        `| ⚠️ **Flaky Tests** | ${summary.flakyTests} |`
      );
    }

    if (summary.slowerTests > 0) {
      lines.push(
        `| ⏱️ **Slower (>20%)** | ${summary.slowerTests} |`
      );
    }

    lines.push('');

    // Regressions detail
    if (summary.regressions.length > 0) {
      lines.push('### 🔴 Regressions\n');
      summary.regressions.slice(0, 10).forEach((r) => {
        lines.push(`- **${r.test.className}**::`);
        lines.push(`  \`${r.test.name}\``);
        if (r.test.error) {
          lines.push(`  - Error: ${r.test.error.type}`);
          lines.push(
            `  - Message: ${r.test.error.message.substring(0, 100)}...`
          );
        }
      });
      if (summary.regressions.length > 10) {
        lines.push(
          `\n*... and ${summary.regressions.length - 10} more*`
        );
      }
      lines.push('');
    }

    // Fixes detail
    if (summary.fixedFailures > 0) {
      lines.push('### ✅ Fixed Tests\n');
      summary.fixes.slice(0, 10).forEach((f) => {
        lines.push(`- ${f.test.className}::\`${f.test.name}\``);
      });
      if (summary.fixes.length > 10) {
        lines.push(`\n*... and ${summary.fixes.length - 10} more*`);
      }
      lines.push('');
    }

    // Flaky tests
    if (summary.flakyTests > 0) {
      lines.push('### ⚠️ Flaky Tests\n');
      summary.flaky.slice(0, 5).forEach((f) => {
        lines.push(
          `- ${f.test.className}::\`${f.test.name}\` (${f.oldStatus} → ${f.newStatus})`
        );
      });
      if (summary.flaky.length > 5) {
        lines.push(`\n*... and ${summary.flaky.length - 5} more*`);
      }
      lines.push('');
    }

    // Failure clusters
    if (summary.clusters.length > 0) {
      lines.push('### 🔗 Grouped Failures\n');
      summary.clusters.slice(0, 3).forEach((cluster) => {
        lines.push(
          `- **${cluster.errorType}** (${cluster.count} failures)`
        );
        lines.push(
          `  - \`${cluster.errorMessage.substring(0, 80)}...\``
        );
      });
      if (summary.clusters.length > 3) {
        lines.push(
          `\n*... and ${summary.clusters.length - 3} more clusters*`
        );
      }
      lines.push('');
    }

    // Footer
    lines.push(
      `---\n_Generated at ${new Date(summary.generatedAt).toLocaleString()}_`
    );

    return lines.join('\n');
  }
}
