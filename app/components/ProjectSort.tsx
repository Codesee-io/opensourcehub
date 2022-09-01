import { FunctionComponent } from "react";
import useSearch from "~/components/local-search/useSearch";
import { ProjectSortOrder, SORT_OPTIONS } from "../utils/constants";

const ProjectSort: FunctionComponent = () => {
  const { sortOption, setSortOption } = useSearch();

  return (
    <select
      aria-label="Sort projects"
      onChange={(e) => setSortOption(e.currentTarget.value as ProjectSortOrder)}
      value={sortOption}
      className="input-select"
    >
      {SORT_OPTIONS.map((x) => (
        <option key={x.value} value={x.value}>
          {x.label}
        </option>
      ))}
    </select>
  );
};

export default ProjectSort;
