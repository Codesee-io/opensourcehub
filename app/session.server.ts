import { Octokit } from "@octokit/rest";
import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { DecodedIdToken } from "firebase-admin/auth";
import {
  createProfileForUser,
  createUser,
  getUserByUid,
  getUserProfileBySlug,
} from "./database.server";
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

const storage =
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

const fiveMinutesInSeconds = 60 * 5;
const fiveMinutesInMilliseconds = fiveMinutesInSeconds * 1000;

const twoWeeksInSeconds = 60 * 60 * 24 * 14;
const twoWeeksInMilliseconds = twoWeeksInSeconds * 1000;

// Session last 2 weeks by default. For testing purposes, we can add a
// DEBUG_SESSION environment variable to make the sessions last 5 minutes, which
// is the minimum allowed time for a session
const COOKIE_EXPIRATION = {
  seconds: process.env.DEBUG_SESSION ? fiveMinutesInSeconds : twoWeeksInSeconds,
  milliseconds: process.env.DEBUG_SESSION
    ? fiveMinutesInMilliseconds
    : twoWeeksInMilliseconds,
};

/**
 * Use this to register a new user or log in an existing user. This creates a
 * session cookie, which can then be used to authenticate further requests.
 *
 * This method has 2 potential side effects:
 * - if the user doesn't exist, it creates a new User document in Firestore
 * - if the user doesn't have a profile, it creates a new UserProfile document
 *   in Firestore
 */
export async function createUserSession(idToken: string, accessToken: string) {
  const token = await auth.createSessionCookie(idToken, {
    expiresIn: COOKIE_EXPIRATION.milliseconds,
  });
  const session = await storage.getSession();
  session.set("token", token);

  // Check that we have a matching user for this token. If not, create one.
  const decodedToken = await auth.verifySessionCookie(token, true);
  let user = await getUserByUid(decodedToken.uid);

  if (user == null) {
    user = await createUser(decodedToken, accessToken);
  }

  // Check whether the user has a profile page. If not, ask them to create one.
  let redirectPath: string;
  const profile = await getUserProfileBySlug(user.githubLogin);

  if (profile) {
    // If the user already has a profile, we redirect to it
    redirectPath = `/u/github/${user.githubLogin}`;
  } else {
    // If the user doesn't have a profile yet, we create one and send them to
    // the Welcome page to enter some information
    await createProfileForUser(user);

    redirectPath = `/u/github/${user.githubLogin}/welcome`;
  }

  return redirect(redirectPath, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getCurrentSession(request: Request) {
  const cookieSession = await storage.getSession(request.headers.get("Cookie"));
  const token = cookieSession.get("token");
  if (!token) return null;

  try {
    const tokenUser = await auth.verifySessionCookie(token, true);
    return tokenUser;
  } catch (error) {
    return null;
  }
}

export async function destroyUserSession(request: Request, redirectTo = "/") {
  const session = await storage.getSession(request.headers.get("Cookie"));
  const newCookie = await storage.destroySession(session);

  return redirect(redirectTo, { headers: { "Set-Cookie": newCookie } });
}

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

/**
 * Returns the user that's currently logged in, or null if there is none.
 *
 * @see https://firebase.google.com/docs/auth/admin/verify-id-tokens#web
 */
export async function getCurrentUser(request: Request): Promise<User | null> {
  const claims = await getCurrentSession(request);

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
  const user = await getCurrentUser(request);

  if (!user) {
    return destroyUserSession(request, redirectTo);
  }

  return user;
}

export async function isLoggedIn(request: Request) {
  const session = await storage.getSession(request.headers.get("Cookie"));
  return session.has("idToken");
}

export async function getCurrentUserInfo(request: Request) {
  const user = await getCurrentUser(request);
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
