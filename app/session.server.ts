import { Octokit } from "@octokit/rest";
import { createCookieSessionStorage, redirect, Session } from "@remix-run/node";
import { DecodedIdToken } from "firebase-admin/auth";
import { getUserByUid } from "./database.server";
import { auth } from "./firebase.server";
import { User, UserInfo } from "./types";

/**
 * The fake access token fabricated by the Firebase auth emulator.
 */
const FIREBASE_FAKE_ACCESS_TOKEN =
  "FirebaseAuthEmulatorFakeAccessToken_github.com";

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
 * Returns information from GitHub about the user associated with the access
 * token. If we're running this code in development using the Firebase
 * emulators, we will fake the data.
 */
export async function getGitHubUserDataFromClaims(
  accessToken: string,
  decodedClaims: DecodedIdToken
): Promise<{ login: string; picture?: string; email?: string | null }> {
  if (
    process.env.NODE_ENV === "development" &&
    accessToken === FIREBASE_FAKE_ACCESS_TOKEN
  ) {
    return {
      login: "test-" + decodedClaims.name.split(" ").join("-").toLowerCase(),
      picture: decodedClaims.picture,
      email: decodedClaims.email,
    };
  } else {
    // We use the accessToken to fetch the user from GitHub. This is required
    // because it's the only way to get the "login" field! However, we could
    // probably save it once we've fetched it once.
    const octokit = new Octokit({
      auth: accessToken,
    });
    const { data } = await octokit.request("GET /user");
    return {
      login: data.login,
      picture: data.avatar_url,
      email: data.email || null,
    };
  }
}

export async function getClaimsFromSession(session: Session) {
  const idToken = session.get("idToken");

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

  return decodedClaims;
}

/**
 * Returns the user that's currently logged in, or null if there is none.
 *
 * @see https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
 */
export async function getCurrentUser(session: Session): Promise<User | null> {
  const claims = await getClaimsFromSession(session);

  if (!claims) {
    return null;
  }

  return await getUserByUid(claims.uid);
}

/**
 * Returns the user that's currently logged in or redirects to the path
 * provided (defaults to /login).
 */
export async function getCurrentUserOrRedirect(
  request: Request,
  redirectTo = "/login"
) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getCurrentUser(session);

  if (!user) {
    session.unset("idToken");
    session.unset("accessToken");
    throw redirect(redirectTo, {
      headers: {
        // It's possible that there is no current user but that the session still
        // exists. So to avoid infinite redirects, we destroy the session before
        // redirecting.
        "Set-Cookie": await destroySession(session),
      },
    });
  }

  return user;
}

export async function isLoggedIn(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.has("idToken");
}

export async function getCurrentUserInfo(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = await getCurrentUser(session);
  if (!user) {
    return null;
  }

  const userInfo: UserInfo = {
    displayName: user.displayName,
    githubLogin: user.githubLogin,
    pictureUrl: user.pictureUrl,
  };
  return userInfo;
}
