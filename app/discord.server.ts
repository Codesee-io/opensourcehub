import crypto from "node:crypto";
import DiscordOauth2 from "discord-oauth2";

const DISCORD_REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://opensourcehub.io/verify-discord"
    : "http://localhost:3000/verify-discord";

/**
 * List of Discord scopes we need for the OAuth handshake. In our case, all
 * we want is the user's ID, so we use a single scope.
 * @see https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
 */
const DISCORD_SCOPES = ["identify"];

function assertDiscordEnvironmentVariables() {
  if (!process.env.DISCORD_CLIENT_ID) {
    throw new Error("Missing environment variable DISCORD_CLIENT_ID");
  }
  if (!process.env.DISCORD_CLIENT_SECRET) {
    throw new Error("Missing environment variable DISCORD_CLIENT_SECRET");
  }
}

export async function getDiscordAccessToken(code: string) {
  const discordAuth = new DiscordOauth2();

  const token = await discordAuth.tokenRequest({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    code,
    scope: DISCORD_SCOPES,
    grantType: "authorization_code",
    redirectUri: DISCORD_REDIRECT_URI,
  });

  return token.access_token;
}

export async function getDiscordUserId(accessToken: string) {
  const discordAuth = new DiscordOauth2();
  const discordUser = await discordAuth.getUser(accessToken);

  return discordUser.id;
}

export function getDiscordOAuthUrl() {
  assertDiscordEnvironmentVariables();

  const oauth = new DiscordOauth2({
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    redirectUri: DISCORD_REDIRECT_URI,
  });

  const url = oauth.generateAuthUrl({
    scope: ["identify"],
    state: crypto.randomBytes(16).toString("hex"),
  });

  return url;
}
