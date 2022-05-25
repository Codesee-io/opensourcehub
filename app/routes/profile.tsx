import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { getCurrentUserOrRedirect } from "~/session.server";
import { getProfileRouteForUser } from "~/utils/routes";

// If the user is logged in, we attempt to redirect them to their profile
export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getCurrentUserOrRedirect(request);
  return redirect(getProfileRouteForUser(currentUser));
};
