import { InfoIcon } from "@primer/octicons-react";
import type { FC } from "react";
import type { GitHubData } from "../types";
import { formatMetric } from "~/utils/format-metric";

const STATS_ARE_MISSING = process.env.NODE_ENV !== "production";

type Props = {
  className?: string;
  stats?: GitHubData;
};

const RepoStats: FC<Props> = ({ stats, className }) => {
  return (
    <div className={className}>
      <h2 className="text-sm text-light-interactive mb-4">Last 30 days:</h2>
      <div className="flex justify-between text-black-500 space-x-4 text-center">
        <div>
          <div className="text-2xl text-light-type font-semibold">
            {formatMetric({
              count: stats?.totalOpenIssues || 0,
              maybeMore: false,
            })}
          </div>
          <small className="text-light-type-medium text-xs uppercase whitespace-nowrap">
            Open issues
          </small>
        </div>
        <div
          style={{
            width: "10px",
            paddingRight: "10px",
            borderRight:
              "1px solid rgba(240, 242, 246, var(--tw-border-opacity))",
          }}
        ></div>
        <div>
          <div className="text-2xl text-light-type font-semibold">
            {formatMetric(stats?.prsCreated)}
          </div>
          <small className="text-light-type-medium text-xs uppercase whitespace-nowrap">
            PRs opened
          </small>
        </div>
        <div>
          <div className="text-2xl text-light-type font-semibold">
            {formatMetric(stats?.contributors)}
          </div>
          <small className="text-light-type-medium text-xs uppercase whitespace-nowrap">
            Contributors
          </small>
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

export default RepoStats;
