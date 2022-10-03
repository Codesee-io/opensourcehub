import { createContext } from "react";
import { ProjectSortOrder, SORT_OPTIONS } from "~/utils/constants";
import { Filters } from "./SearchWrapper";

type SearchContext = {
  filteredProjectIds: string[];
  filters: Filters;
  clearAllFilters: () => void;
  filterByTag: (tag: string) => void;
  filterByHasCodeSeeMap: (hasMap: boolean) => void;
  searchByText: (search: string) => void;
  setSortOption: (option: ProjectSortOrder) => void;
};

export function getDefaultFilters(): Filters {
  return {
    hasCodeSeeMap: false,
    search: "",
    sortOption: SORT_OPTIONS[0].value,
    tags: [],
  };
}

const SearchResultsContext = createContext<SearchContext>({
  filters: getDefaultFilters(),
  filteredProjectIds: [],
  clearAllFilters: () => {},
  filterByTag: () => {},
  filterByHasCodeSeeMap: () => {},
  searchByText: () => {},
  setSortOption: () => {},
});

export const SearchResultsProvider = SearchResultsContext.Provider;
export default SearchResultsContext;
