import { LoaderFunction, redirect } from "@remix-run/node";
import { destroySession, getCurrentUser, getSession } from "~/session.server";
import { getDiscordAccessToken, getDiscordUserId } from "~/discord.server";
import { getProfileRouteForUser } from "~/utils/routes";
import { updateUser } from "~/database.server";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (!currentUser) {
    // Redirect to the login page
    return redirect("/login", {
      headers: {
        // It's possible that there is not current user but that the session still
        // exists. So to avoid infinite redirects, we destroy the session before
        // redirecting.
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  // Get the `code` param from the URL -- this was added by Discord after
  // successful authentication
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw new Error("No code");
  }

  const accessToken = await getDiscordAccessToken(code);

  const discordUserId = await getDiscordUserId(accessToken);

  await updateUser(currentUser.uid, { discordUserId });

  return redirect(getProfileRouteForUser(currentUser));
};
