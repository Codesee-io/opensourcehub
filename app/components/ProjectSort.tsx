import { FunctionComponent, useState, useEffect } from "react";
import Select from "react-select";
import useSearch from "~/components/local-search/useSearch";
import type { SelectOption } from "~/types";
import { SORT_OPTIONS } from "../utils/constants";

const ProjectSort: FunctionComponent = () => {
  const { sortOption, setSortOption } = useSearch();

  // There is a known issue when react-select SSR'd
  // Ref: https://github.com/JedWatson/react-select/issues/3590
  // Until getting resolved of that issue, will work with a temporary solution
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return (
    <Select
      aria-label="Sort projects"
      id="sort-projects-select"
      instanceId="sort-projects-select"
      className="react-select"
      classNamePrefix="react-select"
      name="form-field-name"
      options={SORT_OPTIONS}
      value={sortOption}
      onChange={(option) => setSortOption(option as SelectOption)}
    />
  );
};

export default ProjectSort;
