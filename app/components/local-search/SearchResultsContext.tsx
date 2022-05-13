import { createContext } from "react";
import { SelectOption } from "~/types";
import { SORT_OPTIONS } from "~/utils/constants";

type SearchContext = {
  filteredProjectIds: string[];
  allActiveTags: string[];
  sortOption: SelectOption;
  clearAllTags: () => void;
  filterByTag: (tag: string) => void;
  searchByText: (search: string) => void;
  setSortOption: (option: SelectOption) => void;
};

const SearchResultsContext = createContext<SearchContext>({
  filteredProjectIds: [],
  allActiveTags: [],
  sortOption: SORT_OPTIONS[0],
  clearAllTags: () => {},
  filterByTag: () => {},
  searchByText: () => {},
  setSortOption: () => {},
});

export const SearchResultsProvider = SearchResultsContext.Provider;
export default SearchResultsContext;
