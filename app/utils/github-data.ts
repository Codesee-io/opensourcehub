import type { GitHubData, Project } from "../types";
import { calculateGithubData } from "./calculateGithubData";
const { graphql: github } = require("@octokit/graphql");
const cliProgress = require("cli-progress");
require("dotenv").config();

type ReturnType = {
  githubDataSet: { [key: string]: GitHubData };
  invalidProjectSlugs: Set<string>;
};

export async function getGitHubDataForProjects(
  projects: Project[]
): Promise<ReturnType> {
  let githubAPI;
  if (
    process.env.GITHUB_PERSONAL_ACCESS_TOKEN &&
    process.env.NODE_ENV === "production"
  ) {
    githubAPI = github.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  } else if (process.env.NODE_ENV !== "production") {
    console.log(
      "Not fetching data from GitHub because we're not on production"
    );
    return {
      githubDataSet: {},
      invalidProjectSlugs: new Set(),
    };
  } else if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    console.log("No GitHub API Token set, GitHub data will not be available.");
    return {
      githubDataSet: {},
      invalidProjectSlugs: new Set(),
    };
  }

  const githubDataSet: { [key: string]: GitHubData } = {};

  const progressBar = new cliProgress.SingleBar(
    {},
    cliProgress.Presets.shades_classic
  );

  console.log(`Fetching project data from GitHub`);
  progressBar.start(projects.length, 0);

  const invalidProjectSlugs = new Set<string>();

  for (const project of projects) {
    const repoUrl = project.attributes.repoUrl;
    progressBar.increment();

    if (repoUrl.startsWith("https://github.com")) {
      const githubData = await calculateGithubData(githubAPI, repoUrl);

      if (githubData) {
        githubDataSet[project.slug] = {
          prsMerged: githubData.prsMerged,
          prsCreated: githubData.prsCreated,
          totalContributors: githubData.totalContributors,
          contributors: githubData.contributors,
          totalOpenIssues: githubData.totalOpenIssues,
          helpIssues: githubData.helpIssues,
          hacktoberfestIssues: githubData.hacktoberfestIssues,
        };
      } else {
        // We were unable to fetch data from GitHub for this project. This
        // usually means it was archived, so we don't want to list it on the
        // site.
        invalidProjectSlugs.add(project.slug);
      }
    }
  }

  progressBar.stop();

  return { githubDataSet, invalidProjectSlugs };
}
