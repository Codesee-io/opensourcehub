import { FC } from "react";
import { ALL_PROJECTS_HEADER_ID } from "~/utils/constants";
import Button from "./Button";
import useSearch from "./local-search/useSearch";

const VerifiedProjectsButton: FC = () => {
  const { filterByVerified } = useSearch();

  const showVerifiedProjects = () => {
    filterByVerified(true);

    // Scroll the page to the list of projects
    if (typeof document !== "undefined" && typeof window !== "undefined") {
      const element = document.getElementById(ALL_PROJECTS_HEADER_ID);
      if (element) {
        const top = element.getBoundingClientRect().top + window.scrollY - 64;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return <Button onClick={showVerifiedProjects}>Find verified projects</Button>;
};

export default VerifiedProjectsButton;
