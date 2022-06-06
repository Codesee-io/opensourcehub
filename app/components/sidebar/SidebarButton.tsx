import { FC } from "react";
import Button from "../Button";
import SlidersIcon from "../icons/SlidersIcon";

type Props = {
  onClick: () => void;
  numFilters: number;
};

const SidebarButton: FC<Props> = ({ onClick, numFilters }) => (
  <Button
    type="button"
    onClick={onClick}
    aria-label="Show the filters"
    className="shadow-lg fixed bottom-6 md:bottom-10 right-6 z-20"
  >
    <span className="hidden md:inline-block tracking-wide mr-4 font-semibold">
      Filters
    </span>
    <SlidersIcon className="w-7 h-7 md:w-5 md:h-5" />
    {numFilters > 0 && (
      <span
        className="bg-magenta-500 block px-1 font-semibold text-xs text-white rounded-lg absolute top-0 -right-1"
        style={{ minWidth: 16 }}
      >
        {numFilters}
      </span>
    )}
  </Button>
);

export default SidebarButton;
