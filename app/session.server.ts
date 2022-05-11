import { createCookieSessionStorage, Session } from "@remix-run/node";
import { auth } from "./firebase.server";

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
export async function getCurrentUser(session: Session) {
  const idToken = session.get("idToken");

  const error = session.get("error");
  if (error) {
    console.log("~~ we have an error!", error);
    throw new Error(error);
  }

  if (typeof idToken !== "string") {
    return null;
  }

  const decodedClaims = await auth.verifyIdToken(idToken);
  return decodedClaims;
}
