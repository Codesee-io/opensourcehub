import { ActionFunction, redirect } from "@remix-run/node";
import { getDiscordOAuthUrl } from "~/discord.server";

/**
 * Generates an OAuth URL to authenticate with Discord, and then redirects to
 * it. Once a user authenticates, we send them back to this website.
 */
export const action: ActionFunction = () => {
  const url = getDiscordOAuthUrl();
  return redirect(url);
};
