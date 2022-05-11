import { LINK_FORMATS } from "./constants";

export function linkStyle({
  format = LINK_FORMATS.primary,
  inverse = false,
}: {
  format?: string;
  inverse?: boolean;
}) {
  let classByFormatInverse = "";
  if (format === LINK_FORMATS.primary) {
    classByFormatInverse = !inverse
      ? "bg-indigo-500 text-white supports-hover:hover:bg-indigo-400"
      : "bg-violet-200 text-indigo-500 supports-hover:hover:bg-indigo-50";
  } else if (format === LINK_FORMATS.secondary) {
    classByFormatInverse = !inverse
      ? "bg-transparent border-2 border-indigo-500 text-indigo-500 supports-hover:hover:border-indigo-400 supports-hover:hover:text-indigo-400"
      : "bg-transparent border-2 border-white text-white supports-hover:hover:border-indigo-50 supports-hover:hover:text-indigo-50";
  } else {
    classByFormatInverse =
      "bg-yellow-200 text-black-500 supports-hover:hover:bg-yellow-300";
  }

  return classByFormatInverse;
}
