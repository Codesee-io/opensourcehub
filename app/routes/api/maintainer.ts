import { ActionFunction, json } from "@remix-run/node";
import { getUserByUid } from "~/database.server";
import { getProjectsMaintainedByUser } from "~/projects.server";

/**
 * This API endpoint verifies that a user is listed as the maintainer of at
 * least 1 project in OSH. It expects a `userId` in the payload and a valid
 * bearer token.
 */
export const action: ActionFunction = async ({ request }) => {
  // Check that we have a valid userId in the payload
  const data = await request.json();
  const { userId } = data;
  if (typeof userId !== "string") {
    return new Response(null, {
      status: 500,
      statusText: "Malformed request",
    });
  }

  // Check that we have a valid API key
  const authHeader = request.headers.get("Authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const receivedToken = authHeader.substring("Bearer ".length);

    if (receivedToken !== process.env.BOT_API_KEY) {
      if (typeof userId !== "string") {
        return new Response(null, {
          status: 403,
          statusText: "Forbidden",
        });
      }
    }
  } else {
    return new Response(null, {
      status: 403,
      statusText: "Forbidden",
    });
  }

  // Check that this user has uploaded a project to OSH
  const user = await getUserByUid(userId);

  if (!user) {
    return new Response(null, {
      status: 404,
      statusText: "Not found",
    });
  }

  const projectsForUser = getProjectsMaintainedByUser(user);

  return json({
    isMaintainer: projectsForUser.length > 0,
  });
};
