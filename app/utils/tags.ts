import languages from "~/data/languages";
import roles from "~/data/roles";
import subjects from "~/data/subjects";
import { Tag } from "~/types";

type TagCategory = "techInterests" | "subjectInterests" | "roleInterests";

const techInterestsMap = new Map(languages.map((l) => [l.id, l]));
const roleInterestsMap = new Map(roles.map((l) => [l.id, l]));
const subjectInterestsMap = new Map(subjects.map((l) => [l.id, l]));

export function getTag(category: TagCategory, key: string) {
  if (category === "techInterests" && techInterestsMap.has(key)) {
    return techInterestsMap.get(key) as Tag;
  }
  if (category === "subjectInterests" && subjectInterestsMap.has(key)) {
    return subjectInterestsMap.get(key) as Tag;
  }
  if (category === "roleInterests" && roleInterestsMap.has(key)) {
    return roleInterestsMap.get(key) as Tag;
  }

  const fallback: Tag = {
    id: key,
    label: key,
  };
  return fallback;
}

export const TECH_INTERESTS = languages
  .map((l) => ({ value: l.id, label: l.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
export const SUBJECT_INTERESTS = subjects
  .map((l) => ({ value: l.id, label: l.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
export const ROLE_INTERESTS = roles
  .map((l) => ({ value: l.id, label: l.label }))
  .sort((a, b) => a.label.localeCompare(b.label));
