export function getRepoOwnerAndName(repoUrl: string) {
  const github = "https://github.com/";
  const gitlab = "https://gitlab.com/";

  if (repoUrl.startsWith(github)) {
    const [owner, name] = repoUrl.slice(github.length).split("/");
    return { owner, name };
  }

  if (repoUrl.startsWith(gitlab)) {
    const [owner, name] = repoUrl.slice(gitlab.length).split("/");
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
