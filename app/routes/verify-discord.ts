import { LoaderFunction, redirect } from "@remix-run/node";
import { getCurrentUserOrRedirect } from "~/session.server";
import { getDiscordAccessToken, getDiscordUserId } from "~/discord.server";
import { getProfileRouteForUser } from "~/utils/routes";
import { updateUser } from "~/database.server";

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getCurrentUserOrRedirect(request);

  // Get the `code` param from the URL -- this was added by Discord after
  // successful authentication
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    throw redirect("/profile");
  }

  const accessToken = await getDiscordAccessToken(code);

  const discordUserId = await getDiscordUserId(accessToken);

  await updateUser(currentUser.uid, { discordUserId });

  return redirect(getProfileRouteForUser(currentUser));
};
