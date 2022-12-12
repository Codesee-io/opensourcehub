import { ActionFunction, json } from "@remix-run/node";
import { getPullRequestInfo } from "~/github.server";
import { PullRequestDetails } from "~/types";
import { isValidPullRequestUrl } from "~/utils/repo-url";

type SuccessResponse = PullRequestDetails & {
  isValid: true;
};

type ErrorResponse = {
  isValid: false;
  reason: string;
};

export type VerifyPullRequestResponse = SuccessResponse | ErrorResponse;

/**
 * Takes a pull request URL and verifies the repo is public and that the PR
 * exists.
 */
export const action: ActionFunction = async ({ request }) => {
  // Check that we have a valid url in the payload
  const clonedRequest = request.clone();
  const data = await clonedRequest.formData();
  const url = data.get("url")?.toString();

  const pullRequestDetails = isValidPullRequestUrl(url);

  if (pullRequestDetails === false) {
    const error: ErrorResponse = {
      isValid: false,
      reason: "Pull request URL formatted incorrectly",
    };
    return json(error, {
      status: 400,
      statusText: "Malformed request",
    });
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
    const error: ErrorResponse = {
      isValid: false,
      reason: "Pull request not found",
    };
    return json(error, {
      status: 404,
      statusText: "Not found",
    });
  }
};
