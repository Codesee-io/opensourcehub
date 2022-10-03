import { graphql } from "@octokit/graphql";
import { App } from "@octokit/app";
import type { graphql as GraphQLType } from "@octokit/graphql/dist-types/types";
import githubData from "./data/autogenerated/github.json";
import type { GitHubData, PullRequestDetails, User } from "./types";

export function getGitHubData() {
  return githubData as { [key: string]: GitHubData };
}

export function getGitHubDataForProject(slug: string) {
  return getGitHubData()[slug] || undefined;
}

let graphqlAPI: GraphQLType;

function getGithubAPI() {
  if (!process.env.GITHUB_PERSONAL_ACCESS_TOKEN) {
    throw new Error("Missing GITHUB_PERSONAL_ACCESS_TOKEN");
  }

  if (!graphqlAPI) {
    graphqlAPI = graphql.defaults({
      headers: {
        authorization: `token ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      },
    });
  }

  return graphqlAPI;
}

export async function getPullRequestInfo(
  repoOwner: string,
  repoName: string,
  pullRequestNumber: string
) {
  type ReturnValue = {
    repository: {
      pullRequest: PullRequestDetails;
    };
  };

  const value = await getGithubAPI()<ReturnValue>(
    `
    query pullRequestDetails($owner: String!, $name: String!, $pullRequestNumber: Int!) {
      repository(name: $name, owner: $owner) {
        pullRequest(number: $pullRequestNumber) {
          author {
            login
            url
          }
          url
          number
          merged
          title
          participants(first:100) {
            nodes {
              login
            }
          }
          repository {
            nameWithOwner
            url
          }
        }
      }
    }
  `,
    {
      owner: repoOwner,
      name: repoName,
      pullRequestNumber: parseInt(pullRequestNumber, 10),
    }
  );

  return value.repository.pullRequest;
}

/**
 * Accesses the "OSH Bot" GitHub app in order to make requests to the GitHub API
 * without user credentials.
 */
async function getGitHubApp() {
  if (!process.env.GITHUB_OSH_BOT_APP_ID) {
    throw new Error("Missing GITHUB_OSH_BOT_APP_ID");
  }
  if (!process.env.GITHUB_OSH_BOT_PRIVATE_KEY_BASE_64) {
    throw new Error("Missing GITHUB_OSH_BOT_PRIVATE_KEY_BASE_64");
  }
  if (!process.env.GITHUB_OSH_BOT_CLIENT_ID) {
    throw new Error("Missing GITHUB_OSH_BOT_CLIENT_ID");
  }
  if (!process.env.GITHUB_OSH_BOT_CLIENT_SECRET) {
    throw new Error("Missing GITHUB_OSH_BOT_CLIENT_SECRET");
  }
  if (!process.env.GITHUB_OSH_BOT_INSTALLATION_ID) {
    throw new Error("Missing GITHUB_OSH_BOT_INSTALLATION_ID");
  }

  // The app id is a number
  const parsedAppId = parseInt(process.env.GITHUB_OSH_BOT_APP_ID);

  // The private key is encoded in base 64 so we convert it back to plain text
  const parsedPrivateKey = Buffer.from(
    process.env.GITHUB_OSH_BOT_PRIVATE_KEY_BASE_64,
    "base64"
  ).toString("utf-8");

  const app = new App({
    appId: parsedAppId,
    privateKey: parsedPrivateKey,
    oauth: {
      clientId: process.env.GITHUB_OSH_BOT_CLIENT_ID,
      clientSecret: process.env.GITHUB_OSH_BOT_CLIENT_SECRET,
    },
  });

  const octokit = await app.getInstallationOctokit(
    parseInt(process.env.GITHUB_OSH_BOT_INSTALLATION_ID)
  );

  return octokit;
}

const TARGET_OWNER = "Codesee-io";
const TARGET_REPO = "opensourcehub";

export type FileToUpload = {
  content: string;
  filePath: string;
  encoding: "utf-8" | "base64";
};

/**
 * Create a new branch with a new commit that contains one or more files, and
 * then open a pull request as the current user.
 *
 * I want to thank the GitHub API for making this needlessly difficult.
 */
export async function createNewPullRequest(
  user: User,
  files: FileToUpload[],
  projectDirectory: string,
  projectName: string
) {
  const appOctokit = await getGitHubApp();
  if (!appOctokit) {
    throw new Error(
      "Unable to instantiate a new GitHub app Octokit in createNewPullRequest()"
    );
  }

  // Create a blob for each file
  const allFileBlobs = await Promise.all(
    files.map((file) =>
      appOctokit.request("POST /repos/{owner}/{repo}/git/blobs", {
        owner: TARGET_OWNER,
        repo: TARGET_REPO,
        content: file.content,
        encoding: file.encoding,
      })
    )
  );

  // Grab a reference to the main branch of the repo
  const { data: mainRef } = await appOctokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      ref: `heads/main`,
    }
  );

  const branchName = `project/add-${projectName.toLowerCase()}-${Date.now()}`;

  // Create a new branch
  const { data: branch } = await appOctokit.request(
    "POST /repos/{owner}/{repo}/git/refs",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      ref: `refs/heads/${branchName}`,
      sha: mainRef.object.sha,
    }
  );

  // Grab the tree of the branch we just created
  const { data: originalTree } = await appOctokit.request(
    "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      tree_sha: branch.object.sha,
    }
  );

  // Create a new tree based on the branch -- this basically tells git how to
  // structure the hierarchy of the files we're creating.
  const { data: updatedTree } = await appOctokit.request(
    "POST /repos/{owner}/{repo}/git/trees",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      base_tree: originalTree.sha,
      tree: files.map((file, index) => ({
        path: `public/projects/${projectDirectory}/${file.filePath}`,
        mode: "100644" as "100644",
        type: "blob" as "blob",
        sha: allFileBlobs[index].data.sha,
      })),
    }
  );

  // Commit the new tree
  let commitMessage = `List the "${projectName}" project`;
  if (user.email) {
    // Needs 2 empty lines above the "Co-authored-by" keyword
    commitMessage += `\n\n\nCo-authored-by: ${user.githubLogin} <${user.email}>`;
  }
  const { data: commit } = await appOctokit.request(
    "POST /repos/{owner}/{repo}/git/commits",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      // The 2 empty lines in the commit message are required!
      message: commitMessage,
      tree: updatedTree.sha,
      parents: [branch.object.sha],
    }
  );

  // Update the new branch with the ref to the commit
  await appOctokit.request("PATCH /repos/{owner}/{repo}/git/refs/{ref}", {
    owner: TARGET_OWNER,
    repo: TARGET_REPO,
    ref: `heads/${branchName}`, // Don't prefix with "ref/"
    sha: commit.sha,
  });

  // Create a pull request
  const { data: createPRData } = await appOctokit.request(
    "POST /repos/{owner}/{repo}/pulls",
    {
      owner: TARGET_OWNER,
      repo: TARGET_REPO,
      title: `[project] Add ${projectName}`,
      head: branchName,
      base: "main",
      body: `### Add a new project to Open Source Hub :tada:

Author: @${user.githubLogin}
Repository: https://github.com/${projectDirectory}/${projectName}
`,
      maintainer_can_modify: true,
    }
  );

  // Return the URL of the new pull request
  return {
    pullRequestUrl: createPRData.html_url,
  };
}
