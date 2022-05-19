import { ActionFunction, LoaderFunction, redirect } from "@remix-run/node";
import DiscordOauth from "discord-oauth2";
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

  // Grab an access token from the user's code
  const accessToken = await getDiscordAccessToken(code);

  // Grab the user's Discord id
  const discordUserId = await getDiscordUserId(accessToken);

  // Save the user's Discord id in our database
  await updateUser(currentUser.uid, { discordUserId });

  return redirect(getProfileRouteForUser(currentUser));
};

export const action: ActionFunction = async () => {
  // Make sure the user is logged in

  // If the user has already identified with Discord, we can exit early

  // Interface with Discord
  const discordAuth = new DiscordOauth();

  await discordAuth
    .tokenRequest({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,

      code: "query code",
      scope: "identify guilds",
      grantType: "authorization_code",

      redirectUri: "http://localhost:3000/discord/callback",
    })
    .then(console.log);
};
