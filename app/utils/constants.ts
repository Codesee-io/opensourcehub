import { SelectOption } from "~/types";

export const HOW_TO_LIST_PROJECT_LINK =
  "https://github.com/codesee-io/opensourcehub#how-to-list-your-project";

export const DISCORD_LINK = "https://discord.gg/opensource";
export const HOW_CODESEE_WORKS_LINK =
  "https://www.codesee.io/how-codesee-works";
export const RESOURCES_LINK = "https://learn.codesee.io/tag/community/";
export const REPO_LINK = "https://github.com/Codesee-io/opensourcehub";
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTRIBUTE: "/contribute",
  LOGIN: "/login",
  LOGOUT: "/logout",
  PRIVACY: "/privacy",
  TERMS_CONDITIONS: "/terms-conditions",
  LIST_PROJECT: "/list-project",
  VERIFIED: "/verified",
};

// Button, Link Types
export const LINK_FORMATS = {
  primary: "primary",
  secondary: "secondary",
  custom: "custom",
};

// Project sort options
export enum ProjectSortOrder {
  MostOpenIssues = "most open issues",
  MostActive = "most active",
  MostPopular = "most popular",
  MostRecentlyAdded = "most recently added",
}

export const SORT_OPTIONS: SelectOption[] = [
  {
    label: "Sort by: Recently added",
    value: ProjectSortOrder.MostRecentlyAdded,
  },
  {
    label: "Sort by: Most open issues",
    value: ProjectSortOrder.MostOpenIssues,
  },
  { label: "Sort by: Most active", value: ProjectSortOrder.MostActive },
  { label: "Sort by: Most popular", value: ProjectSortOrder.MostPopular },
];

export const SHOW_PROFILE_LINK = true;

export const ALL_PROJECTS_HEADER_ID = "all-projects-header";
