import { SelectOption } from "~/types";

export const HOW_TO_LIST_PROJECT_LINK =
  "https://github.com/codesee-io/opensourcehub#how-to-list-your-project";

export const DISCORD_LINK = "https://discord.gg/JbAChX3a3a";
export const ABOUT_LINK = "/about";
export const RESOURCES_LINK = "/resources";
export const REPO_LINK = "https://github.com/Codesee-io/opensourcehub";

// Auth Link
export const SIGNIN_LINK = "/login";
export const SIGNUP_LINK = "/signup";

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
