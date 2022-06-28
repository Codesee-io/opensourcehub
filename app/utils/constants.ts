import { SelectOption } from "~/types";

export const HOW_TO_LIST_PROJECT_LINK =
  "https://github.com/codesee-io/opensourcehub#how-to-list-your-project";

export const DISCORD_LINK = "https://discord.gg/opensource";
export const RESOURCES_LINK = "https://resources.opensourcehub.io";
export const REPO_LINK = "https://github.com/Codesee-io/opensourcehub";
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTRIBUTE: "/contribute",
  LOGIN: "/login",
  LOGOUT: "/logout",
  PRIVACY: "/privacy",
  TERMS_CONDITIONS: "/terms-conditions",
};

// Button, Link Types
export const LINK_FORMATS = {
  primary: "primary",
  secondary: "secondary",
  custom: "custom",
};

// Project sort options
export const OPTION_MOST_OPEN_ISSUES = "most_open_issues";
export const OPTION_MOST_ACTIVE = "most_active";
export const OPTION_MOST_POPULARITY = "most_popularity";
export const SORT_OPTIONS: SelectOption[] = [
  { label: "Sort by: Most open issues", value: OPTION_MOST_OPEN_ISSUES },
  { label: "Sort by: Most active", value: OPTION_MOST_ACTIVE },
  { label: "Sort by: Most popularity", value: OPTION_MOST_POPULARITY },
];

export const SHOW_PROFILE_LINK = true;
