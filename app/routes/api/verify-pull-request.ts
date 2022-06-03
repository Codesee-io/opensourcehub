import { ActionFunction, json } from "@remix-run/node";
import { getPullRequestInfo } from "~/github.server";
import { PullRequestDetails } from "~/types";
import { isValidPullRequestUrl } from "~/utils/repo-url";

type SuccessResponse = PullRequestDetails & {
  isValid: true;
};

type ErrorResponse = {
  isValid: false;
};

const errorResponse = new Response(
  JSON.stringify({ isValid: false } as ErrorResponse),
  {
    status: 400,
    statusText: "Malformed request",
  }
);

export type VerifyPullRequestResponse = SuccessResponse | ErrorResponse;

/**
 * Takes a pull request URL and verifies the repo is public and that the PR
 * exists.
 */
export const action: ActionFunction = async ({ request }) => {
  // Check that we have a valid url in the payload
  const data = await request.formData();
  const url = data.get("url")?.toString();

  if (typeof url !== "string") {
    return errorResponse;
  }

  const pullRequestDetails = isValidPullRequestUrl(url);

  if (pullRequestDetails == false) {
    return errorResponse;
  }

  // Make an API call to GitHub
  try {
    const pullRequestInfo = await getPullRequestInfo(
      pullRequestDetails.owner,
      pullRequestDetails.name,
      pullRequestDetails.pullRequestNumber
    );

    const successResponse: SuccessResponse = {
      isValid: true,
      ...pullRequestInfo,
    };

    return json(successResponse);
  } catch (err: any) {
    return errorResponse;
  }
};
