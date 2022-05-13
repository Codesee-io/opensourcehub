import { Octokit } from "@octokit/rest";
import { createCookieSessionStorage, Session } from "@remix-run/node";
import { DecodedIdToken } from "firebase-admin/auth";
import { auth } from "./firebase.server";
import { User } from "./types";

const sessionCookieSecret = process.env.SESSION_COOKIE_SECRET;
if (!sessionCookieSecret) {
  throw new Error(
    "Please provide a SESSION_COOKIE_SECRET environment variable"
  );
}

const { getSession, commitSession, destroySession } =
  // Remix's built-in session handling
  // https://remix.run/docs/en/v1/api/remix#sessions
  createCookieSessionStorage({
    cookie: {
      // Firebase token
      name: "fb:token",
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 14, // 2 weeks
      path: "/",
      sameSite: "lax",
      // https://remix.run/docs/en/v1/api/remix#signing-cookies
      secrets: [sessionCookieSecret],
      secure: true,
    },
  });

export { getSession, commitSession, destroySession };

/**
 * Returns the user that's currently logged in, or null if there is none.
 *
 * @see https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
 */
export async function getCurrentUser(session: Session): Promise<User | null> {
  const idToken = session.get("idToken");
  const accessToken = session.get("accessToken");

  const error = session.get("error");
  if (error) {
    throw new Error(error);
  }

  if (typeof idToken !== "string") {
    return null;
  }

  let decodedClaims: DecodedIdToken | undefined;

  try {
    decodedClaims = await auth.verifyIdToken(idToken);
  } catch (err) {
    // The session isn't valid anymore so return undefined
    return null;
  }

  // We use the accessToken to fetch the user from GitHub. This is required
  // because it's the only way to get the "login" field! However, we could
  // probably save it once we've fetched it once.
  const octokit = new Octokit({
    auth: accessToken,
  });
  const { data: githubUserData } = await octokit.request("GET /user");

  const user: User = {
    uid: decodedClaims.uid,
    githubLogin: githubUserData.login,
    displayName: decodedClaims.name,
    avatar: decodedClaims.picture || githubUserData.avatar_url,
    email: decodedClaims.email || githubUserData.email || undefined,
  };

  return user;
}
