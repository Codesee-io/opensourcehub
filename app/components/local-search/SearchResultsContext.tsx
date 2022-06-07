import { createContext } from "react";
import { SORT_OPTIONS } from "~/utils/constants";

type SearchContext = {
  filteredProjectIds: string[];
  allActiveTags: string[];
  sortOption: string;
  clearAllTags: () => void;
  filterByTag: (tag: string) => void;
  searchByText: (search: string) => void;
  setSortOption: (option: string) => void;
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
