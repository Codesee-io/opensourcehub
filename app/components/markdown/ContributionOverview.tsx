import type { FC } from "react";
import { GitPullRequestIcon, ClockIcon } from "@primer/octicons-react";
import ToolsIcon from "../icons/ToolsIcon";
import UsersIcon from "../icons/UsersIcon";
import InfoIcon from "../icons/InfoIcon";
import type { Project } from "~/types";

type Props = {
  contributionOverview: Project["attributes"]["contributionOverview"];
};

const ContributionOverview: FC<Props> = ({ contributionOverview }) => {
  if (!contributionOverview) {
    return (
      <p className="text-light-type-medium text-sm">
        The maintainers of this project have not provided a contribution
        overview.
      </p>
    );
  }

  const {
    mainLocation,
    isMentorshipAvailable,
    automatedDevEnvironment,
    idealEffort,
    extras,
  } = contributionOverview;

  return (
    <div className="text-light-type text-sm space-y-2">
      {mainLocation && (
        <p className="flex items-center">
          <ClockIcon size={16} className="fill-light-interactive mr-2" />
          <span>Most contributors are in {mainLocation}</span>
        </p>
      )}
      {idealEffort && (
        <p className="flex items-center">
          <GitPullRequestIcon
            size={16}
            className="fill-light-interactive mr-2"
          />
          <span>Ideal: {idealEffort}</span>
        </p>
      )}
      {isMentorshipAvailable && (
        <p className="flex items-center">
          <UsersIcon className="inline-block mr-2 text-light-interactive" />
          Mentorship &amp; pairing available
        </p>
      )}
      {automatedDevEnvironment && (
        <p className="flex items-center">
          <ToolsIcon className="inline-block mr-2 text-light-interactive" />
          <a href={automatedDevEnvironment} target="_blank" rel="noreferrer">
            Automated dev environment available
          </a>
        </p>
      )}
      {extras &&
        extras.map((extra, index) => (
          <p key={`extra-${index}`} className="flex items-center">
            <InfoIcon className="inline-block w-4 h-4 mr-2 text-light-interactive" />
            {extra}
          </p>
        ))}
    </div>
  );
};

export default ContributionOverview;
