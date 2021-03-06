import { ActionFunction } from "@remix-run/node";
import { deletePortfolioItem } from "~/database.server";
import {
  getCurrentSession,
  getCurrentUser,
  redirectAndCommitSession,
} from "~/session.server";
import { getProfileRouteForUser } from "~/utils/routes";

/**
 * Deletes a portfolio item from the database, then redirects to the current
 * user's profile.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const id = formData.get("id")?.toString();

  if (typeof id !== "string") {
    return new Response(null, {
      status: 400,
      statusText: "Malformed request",
    });
  }

  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    return new Response(null, {
      status: 401,
      statusText: "Not authorized",
    });
  }

  await deletePortfolioItem(currentUser, id);

  // Redirect to the profile page and flash a confirmation message
  const session = await getCurrentSession(request);
  session.flash("globalMessage", "Portfolio item successfully deleted");

  return redirectAndCommitSession(session, getProfileRouteForUser(currentUser));
};
