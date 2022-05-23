import { InfoIcon } from "@primer/octicons-react";
import type { FC } from "react";
import type { GitHubData } from "~/types";
import { formatMetric } from "~/utils/format-metric";

const STATS_ARE_MISSING = process.env.NODE_ENV !== "production";

type Props = {
  className?: string;
  stats?: GitHubData;
};

const ProjectCardStats: FC<Props> = ({ stats, className }) => {
  return (
    <div className={className}>
      <h2 className="text-xs font-semibold text-light-interactive mb-2">
        Last 30 days:
      </h2>
      <div className="flex justify-between text-black-500">
        <div className="text-xs text-light-type-medium">
          <span className="font-semibold">
            {formatMetric({
              count: stats?.totalOpenIssues || 0,
              maybeMore: false,
            })}
          </span>
          <span className="ml-1 uppercase">Open issues</span>
        </div>
        <div className="text-xs text-light-type-medium">
          <span className="font-semibold">
            {formatMetric(stats?.prsCreated)}
          </span>
          <span className="ml-1 uppercase">PRs opened</span>
        </div>
        <div className="text-xs text-light-type-medium">
          <span className="font-semibold">
            {formatMetric(stats?.contributors)}
          </span>
          <span className="ml-1 uppercase">Contributors</span>
        </div>
      </div>
      {STATS_ARE_MISSING && (
        <div
          title="This text is only visible during local development"
          className="mt-2 text-xs flex items-center text-gray-400"
        >
          <InfoIcon size={12} className="mr-1" />
          Stats appear on production
        </div>
      )}
    </div>
  );
};

export default ProjectCardStats;
