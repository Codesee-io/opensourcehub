const GITHUB_HOST = "https://github.com/" as const;
const GITLAB_HOST = "https://gitlab.com/" as const;

export function getRepoOwnerAndName(repoUrl: string) {
  if (repoUrl.startsWith(GITHUB_HOST)) {
    const [owner, name] = repoUrl.slice(GITHUB_HOST.length).split("/");
    return { owner, name };
  }

  if (repoUrl.startsWith(GITLAB_HOST)) {
    const [owner, name] = repoUrl.slice(GITLAB_HOST.length).split("/");
    return { owner, name };
  }

  throw new Error(
    `Only GitHub and GitLab repositories are permitted at this time`
  );
}

export function getSlugFromRepoUrl(repoUrl: string) {
  const { owner, name } = getRepoOwnerAndName(repoUrl);
  return `${owner}/${name}`.toLowerCase();
}

/**
 * Returns details about the pull/merge request from a URL, or `false` if the
 * URL isn't a valid pull/merge request.
 *
 * @example urlIsPullRequest("https://github.com/Codesee-io/opensourcehub/pull/20") // true
 * @example urlIsPullRequest("https://gitlab.com/gitlab-org/gitlab-foss/-/merge_requests/3305") // true
 */
export function isValidPullRequestUrl(url?: string) {
  if (typeof url !== "string") {
    return false;
  }

  if (url.startsWith(GITHUB_HOST)) {
    // A merge request URL in GitHub looks like this:
    // https://github.com/Codesee-io/opensourcehub/pull/20
    const [owner, name, pull, pullRequestNumber] = url
      .slice(GITHUB_HOST.length)
      .split("/");

    if (!owner || !name || !pull || !pullRequestNumber) {
      return false;
    }

    if (pull !== "pull") {
      return false;
    }

    if (isNaN(parseInt(pullRequestNumber, 10))) {
      return false;
    }

    return { owner, name, pullRequestNumber };
  }

  if (url.startsWith(GITLAB_HOST)) {
    // A merge request URL in GitLab looks like this:
    // https://gitlab.com/gitlab-org/gitlab-foss/-/merge_requests/3305
    const [owner, name, dash, merge, pullRequestNumber] = url
      .slice(GITLAB_HOST.length)
      .split("/");

    if (!owner || !name || !dash || !merge || !pullRequestNumber) {
      return false;
    }

    if (dash !== "-" || merge !== "merge_requests") {
      return false;
    }

    if (isNaN(parseInt(pullRequestNumber, 10))) {
      return false;
    }

    return { owner, name, pullRequestNumber };
  }

  return false;
}
