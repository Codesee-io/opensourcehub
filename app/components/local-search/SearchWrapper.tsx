import { Search } from "js-search";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  getDefaultFilters,
  SearchResultsProvider,
} from "./SearchResultsContext";
import { Project } from "../../types";
import { ProjectSortOrder, SORT_OPTIONS } from "~/utils/constants";

export type SearchIndexItem = {
  id: string;
  tags: string[];
  description: string;
  name: string;
};

type Props = {
  searchIndex: SearchIndexItem[];
  allProjects: Project[];
};

export type Filters = {
  search: string;
  tags: string[];
  sortOption: ProjectSortOrder;
  hasCodeSeeMap: boolean;
  isVerified: boolean;
};

const SearchWrapper: FunctionComponent<Props> = ({
  searchIndex,
  allProjects,
  children,
}) => {
  const [filters, setFilters] = useState<Filters>(getDefaultFilters());

  const projectSearch = useRef<Search>();
  const [filteredProjectSlugs, setFilteredProjectSlugs] = useState(
    allProjects.map((project) => project.slug)
  );

  useEffect(
    function buildSearchIndex() {
      const search = new Search("slug"); // `slug` is the unique identifier for search results
      search.addIndex("name");
      search.addIndex("languages");
      search.addIndex("tags");
      search.addIndex("description");

      search.addDocuments(searchIndex);

      projectSearch.current = search;
    },
    [searchIndex]
  );

  const performSearch = (searchValue: string) => {
    updateSearchResults(
      searchValue.trim(),
      filters.tags,
      filters.hasCodeSeeMap,
      filters.isVerified
    );
  };

  const filterByHasCodeSeeMap = (hasMap: boolean) => {
    updateSearchResults(
      filters.search,
      filters.tags,
      hasMap,
      filters.isVerified
    );
  };

  const filterByVerified = (isVerified: boolean) => {
    updateSearchResults(
      filters.search,
      filters.tags,
      filters.hasCodeSeeMap,
      isVerified
    );
  };

  const filterByTag = (tag: string) => {
    let newTagList: string[];
    if (filters.tags.includes(tag)) {
      newTagList = filters.tags.filter((t) => t !== tag);
    } else {
      newTagList = [...filters.tags, tag];
    }

    // Toggle tags in our list
    updateSearchResults(
      filters.search,
      newTagList,
      filters.hasCodeSeeMap,
      filters.isVerified
    );
  };

  const clearAllFilters = () => {
    updateSearchResults(filters.search, [], false, false);
  };

  const setSortOption = (sortOrder: ProjectSortOrder) => {
    const sortOption = SORT_OPTIONS.find((o) => o.value === sortOrder);
    if (sortOption?.value) {
      setFilters({
        ...filters,
        sortOption: sortOption.value,
      });
    }
  };

  /**
   * Perform the search and cache the results
   */
  const updateSearchResults = (
    newSearchValue: string,
    newTags: string[],
    hasCodeSeeMap: boolean,
    isVerified: boolean
  ) => {
    // Filter projects
    let filteredProjects = [...allProjects];

    if (hasCodeSeeMap) {
      filteredProjects = filteredProjects.filter(
        (p) => p.attributes.featuredMap != null
      );
    }

    if (isVerified) {
      filteredProjects = filteredProjects.filter(
        (p) => p.attributes.verified === true
      );
    }

    if (newTags.length > 0) {
      filteredProjects = filteredProjects.filter((project) => {
        // Only show projects that include ALL the tags
        const projectLangs = project.attributes.languages || [];
        const projectTags = project.attributes.tags || [];
        const projectSeeking = project.attributes.currentlySeeking || [];

        const allTagsForProject = [
          ...projectLangs,
          ...projectTags,
          ...projectSeeking,
        ];

        const projectHasAllTags = newTags.every((filteredTag) =>
          allTagsForProject.includes(filteredTag)
        );

        return projectHasAllTags;
      });
    }

    if (newSearchValue.length > 0) {
      const searchProjects =
        (projectSearch.current?.search(newSearchValue) as Project[]) || [];

      const matchingSlugs = searchProjects.map((project) => project.slug);
      filteredProjects = filteredProjects.filter((project) =>
        matchingSlugs.includes(project.slug)
      );
    }

    // Update the state
    setFilteredProjectSlugs(filteredProjects.map((project) => project.slug));
    setFilters({
      search: newSearchValue,
      tags: newTags,
      sortOption: filters.sortOption,
      hasCodeSeeMap,
      isVerified,
    });
  };

  return (
    <SearchResultsProvider
      value={{
        filters,
        filterByTag,
        filterByHasCodeSeeMap,
        filterByVerified,
        searchByText: performSearch,
        filteredProjectIds: filteredProjectSlugs,
        clearAllFilters,
        setSortOption,
      }}
    >
      {children}
    </SearchResultsProvider>
  );
};

export default SearchWrapper;
