import { GitHubMetric } from "~/types";

export function formatMetric(metric?: GitHubMetric) {
  if (metric == null) {
    return "0";
  }

  if (metric.maybeMore) {
    if (metric.count > 20) {
      return Math.floor(metric.count / 10) * 10 + "+";
    } else {
      return metric.count + "+";
    }
  }
  return metric.count;
}
