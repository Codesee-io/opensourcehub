import { isValidPullRequestUrl } from "./repo-url";

const CODESEE_REVIEW_MAP_PREFIXES = [
  "https://app.codesee.io/maps/review/github",
  "https://app.codesee.io/r/reviews?pr=",
];

const CODESEE_REVIEW_MAPS_BUCKET =
  "https://s3.us-east-2.amazonaws.com/maps.codesee.io/images/github/";

export function isValidReviewMapUrl(url: string) {
  return CODESEE_REVIEW_MAP_PREFIXES.some((prefix) => url.startsWith(prefix));
}

/**
 *
 * @example getReviewMapImageUrlFromPullRequest("https://github.com/distributeaid/shipment-tracker/pull/819")
 * // https://s3.us-east-2.amazonaws.com/maps.codesee.io/images/github/distributeaid/shipment-tracker/819/latest.svg
 */
export function getReviewMapImageUrlFromPullRequest(url: string) {
  const prDetails = isValidPullRequestUrl(url);
  if (prDetails) {
    const { owner, name, pullRequestNumber } = prDetails;
    return (
      CODESEE_REVIEW_MAPS_BUCKET +
      `${owner}/${name}/${pullRequestNumber}/latest.svg`
    );
  }

  return null;
}
