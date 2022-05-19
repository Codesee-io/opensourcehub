import crypto from "node:crypto";
import DiscordOauth2 from "discord-oauth2";

const DISCORD_REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://opensourcehub.io/verify-discord"
    : "http://localhost:3000/verify-discord";

const DISCORD_SCOPES = ["identify"];

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
