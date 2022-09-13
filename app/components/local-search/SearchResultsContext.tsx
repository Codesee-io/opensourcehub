import { createContext } from "react";
import { ProjectSortOrder, SORT_OPTIONS } from "~/utils/constants";

type SearchContext = {
  filteredProjectIds: string[];
  allActiveTags: string[];
  sortOption: ProjectSortOrder;
  clearAllTags: () => void;
  filterByTag: (tag: string) => void;
  searchByText: (search: string) => void;
  setSortOption: (option: ProjectSortOrder) => void;
};

const SearchResultsContext = createContext<SearchContext>({
  filteredProjectIds: [],
  allActiveTags: [],
  sortOption: SORT_OPTIONS[0].value,
  clearAllTags: () => {},
  filterByTag: () => {},
  searchByText: () => {},
  setSortOption: () => {},
});

export const SearchResultsProvider = SearchResultsContext.Provider;
export default SearchResultsContext;
