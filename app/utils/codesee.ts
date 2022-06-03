const CODESEE_REVIEW_MAP_PREFIXES = [
  "https://app.codesee.io/maps/review/github",
  "https://app.codesee.io/r/reviews?pr=",
];

export function isValidReviewMapUrl(url: string) {
  return CODESEE_REVIEW_MAP_PREFIXES.some((prefix) => url.startsWith(prefix));
}
