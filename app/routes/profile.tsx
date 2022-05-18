import { redirect } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";
import { destroySession, getCurrentUser, getSession } from "~/session.server";
import { getProfileRouteForUser } from "~/utils/routes";

// If the user is logged in, we attempt to redirect them to their profile
export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (currentUser) {
    return redirect(getProfileRouteForUser(currentUser));
  }

  // Redirect to the login page
  return redirect("/login", {
    headers: {
      // It's possible that there is not current user but that the session still
      // exists. So to avoid infinite redirects, we destroy the session before
      // redirecting.
      "Set-Cookie": await destroySession(session),
    },
  });
};
