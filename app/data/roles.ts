import { Tag } from "~/types";
import tagColors from "./tagColors";

const roles: Tag[] = [
  {
    label: "Developers",
    id: "developers",
    color: tagColors.brown,
  },
  {
    label: "Backend Developers",
    id: "backend_developers",
    color: tagColors.cyan,
  },
  {
    label: "Maintainers",
    id: "maintainers",
    color: tagColors.goldYellow,
  },
  {
    label: "Frontend Developers",
    id: "frontend_developers",
    color: tagColors.grassGreen,
  },
  {
    label: "DevOps",
    id: "devops",
    color: tagColors.hotPink,
  },
  {
    label: "Technical Writers",
    id: "technical_writers",
    color: tagColors.hunterGreen,
  },
  {
    label: "UX",
    id: "ux",
    color: tagColors.lavender,
  },
  {
    label: "Designers",
    id: "designers",
    color: tagColors.oceanBlue,
  },
  {
    label: "Testers",
    id: "testers",
    color: tagColors.ochre,
  },
  {
    label: "Project Owners",
    id: "project_owners",
    color: tagColors.purple,
  },
  {
    label: "Code Reviewers",
    id: "reviewers",
    color: tagColors.rose,
  },
  {
    label: "Mentors",
    id: "mentors",
    color: tagColors.rust,
  },
  {
    label: "Researchers",
    id: "researchers",
    color: tagColors.scarlet,
  },
  {
    label: "Issue Triage",
    id: "issue_triage",
    color: tagColors.seaGreen,
  },
];

export default roles;
