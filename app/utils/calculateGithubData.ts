import type { graphql } from "@octokit/graphql/dist-types/types";
import axios from "axios";
import type { GitHubData, GitHubIssueData } from "../types";
import { getInfoFromGitHubUrl } from "./getInfoFromGitHubUrl";

type QueryReturnValue = {
  repository: {
    mergedPullRequests: {
      pageInfo: {
        startCursor: string;
        endCursor: string;
      };
      totalCount: number;
      nodes: Array<{
        createdAt: string;
        mergedAt: string;
        number: string;
        author: {
          login?: string;
          botId?: string;
        };
      }>;
    };
    openPullRequests: {
      pageInfo: {
        startCursor: string;
        endCursor: string;
      };
      totalCount: number;
      nodes: Array<{
        createdAt: string;
        number: string;
        author: {
          login?: string;
          botId?: string;
        };
      }>;
    };
    issues: {
      nodes: Array<GitHubIssueData>;
      totalCount: number;
      pageInfo: {
        startCursor: string;
        endCursor: string;
      };
    };
  };
};

function repoInfoQuery(githubAPI: graphql, owner: string, repoName: string) {
  return githubAPI<QueryReturnValue>(
    `
    query repoInfo($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        mergedPullRequests:pullRequests(first: 100, orderBy: {field: UPDATED_AT, direction: DESC}, states: MERGED) {
          pageInfo {
            startCursor
            endCursor
          }
          totalCount
          nodes {
            createdAt
            mergedAt
            number
            author {
              ... on Bot {
                botId: id
              }
              ... on User {
                login
              }
            }
    
          }
        }
        openPullRequests:pullRequests(first: 100, orderBy: {field: CREATED_AT, direction: DESC}) {
          pageInfo {
            startCursor
            endCursor
          }
          totalCount
          nodes {
            createdAt
            number
            author {
              ... on Bot {
                botId: id
              }
              ... on User {
                login
              }
            }
          }
        }
        issues(
          states: OPEN
          orderBy: {field: CREATED_AT, direction: DESC}
          first: 10
        ) {
          nodes {
            id
            number
            publishedAt
            title
            url
            labels(first: 100) {
              nodes {
                name
              }
              totalCount
            }
          }
          totalCount
          pageInfo {
            endCursor
            hasNextPage
            startCursor
          }
        }
      }
    }
  `,
    { owner, name: repoName }
  );
}

export async function calculateGithubData(githubAPI: any, repoUrl: string) {
  const { owner, repoName } = getInfoFromGitHubUrl(repoUrl);

  if (!owner || !repoName) {
    throw new Error(`The url "${repoUrl}" is not a valid GitHub repo URL"`);
  }

  // TODO we used to cache this data during Gatsby builds, but we took that out
  // when we moved to Remix and Vercel. We could definitely bring it back if
  // needed!

  // const today = new Date().toISOString().substring(0, "YYYY-MM-DD".length);
  // const cacheKey = `github:${owner}/${repoName}:${today}`;
  // const cached = await cache.get(cacheKey);

  // if (cached && !process.env.GITHUB_IGNORE_BUILD_CACHE) {
  //   return cached;
  // }

  try {
    const repoInfo = await repoInfoQuery(githubAPI, owner, repoName);
    const { openPullRequests, mergedPullRequests, issues } =
      repoInfo.repository;

    let mergedThisMonth = 0;
    const contributorsThisMonth = new Set();
    let thereMayBeMoreMergeData = mergedPullRequests.totalCount > 100;

    mergedPullRequests.nodes.forEach(({ mergedAt, author }) => {
      // If author.botId is set, this means that the author is a bot because specifically cast
      // the author as a bot and get the id in the query.
      if (author?.botId) {
        return false;
      }
      const date = new Date(mergedAt).getTime();
      const now = Date.now();
      const isThisMonth = now - date < 30 /* days */ * 24 * 60 * 60 * 1000;

      if (isThisMonth) {
        mergedThisMonth += 1;
        if (author?.login) {
          contributorsThisMonth.add(author.login);
        }
      } else {
        // This PR is from more than a month ago.
        // Since the data is sorted (by updated_at),
        // this PROBABLY means we have fetched all relevant data
        thereMayBeMoreMergeData = false; // most likely
      }
    });

    let openedThisMonth = 0;
    let thereMayBeMoreCreatedData = openPullRequests.totalCount > 100;
    openPullRequests.nodes.forEach(({ createdAt, author }) => {
      // If author.botId is set, this means that the author is a bot because specifically cast
      // the author as a bot and get the id in the query.
      if (author?.botId) {
        // TODO: Do we want to include bots?
        return;
      }
      const date = new Date(createdAt).getTime();
      const now = Date.now();
      const isThisMonth = now - date < 30 /* days */ * 24 * 60 * 60 * 1000;
      if (isThisMonth) {
        openedThisMonth++;
        if (author?.login) {
          contributorsThisMonth.add(author.login);
        }
      } else {
        // This PR is from more than a month ago.
        // Since the data is sorted (by created_at),
        // this PROBABLY means we have fetched all relevant data
        thereMayBeMoreCreatedData = false; // most likely
      }
    });

    // When we use pagination, we get some information in the Response Header about the total amount of pages according to how many items per page we are requesting (using the "per_page" parameter)
    // So a trick could be requesting the list of contributors with one item per page:
    const contributors = await axios(
      `https://api.github.com/repos/${owner}/${repoName}/contributors?per_page=1`,
      {
        method: "GET",
        headers: {
          accept: "application/vnd.github.v3+json",
          authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
        },
      }
    );
    // Doing this in our Response Header there will be a Link property with the following content:
    // The below is an example format of Link property
    // link: '<https://api.github.com/repositories/100050317/contributors?per_page=1&page=2>; rel="next", <https://api.github.com/repositories/100050317/contributors?per_page=1&page=13>; rel="last"'
    const linkHeader = contributors.headers["link"];
    const totalContributors = linkHeader
      ? Number(
          (linkHeader || "")
            .substring(0, linkHeader.length - 13)
            .split("&page=")[2] || 0
        )
      : 0;

    const githubData: GitHubData = {
      prsMerged: {
        count: mergedThisMonth,
        maybeMore: thereMayBeMoreMergeData,
      },
      prsCreated: {
        count: openedThisMonth,
        maybeMore: thereMayBeMoreCreatedData,
      },
      totalContributors,
      contributors: {
        count: contributorsThisMonth.size,
        maybeMore: thereMayBeMoreMergeData || thereMayBeMoreCreatedData,
      },
      totalOpenIssues: issues.totalCount,
      helpIssues: issues.nodes.filter((issue) =>
        issue.labels.nodes.some((i) => i.name === "help wanted")
      ),
      hacktoberfestIssues: issues.nodes.filter((issue) =>
        issue.labels.nodes.some((i) => i.name === "hacktoberfest")
      ),
    };

    // await cache.set(cacheKey, githubData);

    return githubData;
  } catch (err) {
    console.warn(`Unable to fetch "${repoUrl}"`);
  }
}
