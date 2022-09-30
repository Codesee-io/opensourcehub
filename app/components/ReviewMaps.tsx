import type { FC } from "react";
import type { Project } from "~/types";
import ExternalLink from "./ExternalLink";

type Props = {
  reviewMaps: Project["attributes"]["reviewMapUrls"];
};

const ReviewMaps: FC<Props> = ({ reviewMaps = [] }) => {
  if (reviewMaps.length === 0) return null;

  return (
    <section>
      <h3 className="mt-4 mb-2 font-medium">Most impactful Review Maps</h3>
      <ul className="list-disc list-inside">
        {reviewMaps.map((url, i) => (
          <li key={`map-${i}`}>
            <ExternalLink href={url}>{url}</ExternalLink>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ReviewMaps;
