import {
  ChangeEvent,
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
} from "react";
import Checkbox from "./Checkbox";
import useSearch from "./local-search/useSearch";
import cx from "classnames";
import CloseIcon from "./icons/CloseIcon";
import SidebarButton from "./sidebar/SidebarButton";
import { pluralize } from "../utils/formatting";
import SecondaryButton from "./SecondaryButton";

type Props = {
  allLanguages: string[];
  allTags: string[];
  allSeeking: string[];
  showSidebar: boolean;
  setShowSidebar: Dispatch<SetStateAction<boolean>>;
};

const SidebarWithFilters: FunctionComponent<Props> = ({
  allLanguages,
  allTags,
  allSeeking,
  showSidebar,
  setShowSidebar,
}) => {
  const {
    filters,
    filterByTag,
    filteredProjectIds,
    clearAllFilters,
    filterByHasCodeSeeMap,
    filterByVerified,
  } = useSearch();

  useEffect(
    function preventBodyScroll() {
      if (showSidebar) {
        // TODO use this for the modals because it has padding
        document.body.classList.add("prevent-mobile-scroll");
      } else {
        document.body.classList.remove("prevent-mobile-scroll");
      }
    },
    [showSidebar]
  );

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;
    filterByTag(value);
  };

  const hasFilters =
    filters.tags.length > 0 || filters.hasCodeSeeMap || filters.isVerified;

  return (
    <>
      <div
        data-qa="sidebar-backdrop"
        className={cx("sidebar-backdrop", { active: showSidebar })}
        onClick={() => setShowSidebar(false)}
      />
      <aside
        data-qa="sidebar"
        className={cx("sidebar shrink-0 flex flex-col bg-black-30", {
          active: showSidebar,
        })}
      >
        <div className="text-black-500 shadow-menu p-4 md:px-8 h-16 shrink-0 flex items-center justify-between">
          <h3 className="text-xl font-semibold">Filters</h3>
          {hasFilters && (
            <>
              <span className="grow text-black-300 ml-4">
                {filteredProjectIds.length}{" "}
                {pluralize(filteredProjectIds.length, "result", "results")}
              </span>
              <SecondaryButton onClick={clearAllFilters} className="mr-6">
                Clear
              </SecondaryButton>
            </>
          )}

          <button
            onClick={() => setShowSidebar(false)}
            type="button"
            aria-label="Close the filters"
          >
            <CloseIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4 md:px-8 text-black-500 max-h-full overflow-auto pb-12">
          <h4 className="font-semibold mb-3">Features</h4>
          <div className="space-y-1">
            <Checkbox
              onChange={(e) => filterByHasCodeSeeMap(e.target.checked)}
              checked={filters.hasCodeSeeMap}
            >
              Has a CodeSee Map
            </Checkbox>
            <Checkbox
              onChange={(e) => filterByVerified(e.target.checked)}
              checked={filters.isVerified}
            >
              Is verified
            </Checkbox>
          </div>
          <h4 className="font-semibold mb-3 mt-6">Language</h4>
          {allLanguages.map((language) => (
            <Checkbox
              onChange={onCheckboxChange}
              value={language}
              checked={filters.tags.includes(language)}
              key={language}
              labelProps={{ className: "mb-1" }}
            >
              {language}
            </Checkbox>
          ))}
          <h4 className="font-semibold mb-3 mt-6">Focus</h4>
          {allTags.map((tag) => (
            <Checkbox
              onChange={onCheckboxChange}
              value={tag}
              checked={filters.tags.includes(tag)}
              key={tag}
              labelProps={{ className: "mb-1" }}
            >
              {tag}
            </Checkbox>
          ))}
          <h4 className="font-semibold mb-3 mt-6">Currently seeking</h4>
          {allSeeking.map((seeking) => (
            <Checkbox
              onChange={onCheckboxChange}
              value={seeking}
              checked={filters.tags.includes(seeking)}
              key={seeking}
              labelProps={{ className: "mb-1" }}
            >
              {seeking}
            </Checkbox>
          ))}
        </div>
      </aside>
      <SidebarButton
        onClick={() => setShowSidebar(true)}
        numFilters={filters.tags.length}
      />
    </>
  );
};

export default SidebarWithFilters;
