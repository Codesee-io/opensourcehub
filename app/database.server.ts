import { Session } from "@remix-run/node";
import { db } from "./firebase.server";
import {
  getClaimsFromSession,
  getGitHubUserDataFromClaims,
} from "./session.server";
import { User, UserProfile } from "./types";
import { deleteEmptyFields } from "./utils/delete-empty-fields";

// The names of collections in Firestore. Don't change these unless you're
// absolutely sure of what you're doing!
const USER_PROFILES_COLLECTION = "profiles";
const USERS_COLLECTION = "users";

const GITHUB_PROFILE_PREFIX = "github_";

function getProfileKeyForUser(user: User) {
  return GITHUB_PROFILE_PREFIX + user.githubLogin;
}

function getProfileKeyForSlug(slug: string) {
  return GITHUB_PROFILE_PREFIX + slug;
}

/**
 * Create a new user in Firestore and return it. This makes a call to the GitHub
 * API with the user's access token to access and store their `login`.
 */
export async function createUser(session: Session) {
  // We need to make an API call to GitHub to get the user's login
  const claims = await getClaimsFromSession(session);

  if (!claims) {
    throw new Error("Unable to decode claims before creating user");
  }

  const githubUserData = await getGitHubUserDataFromClaims(
    session.get("accessToken"),
    claims
  );

  const uid = claims.uid;

  const user: User = {
    uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    githubLogin: githubUserData.login,
    displayName: claims.name || githubUserData.login, // There isn't always a name in the claims!
    pictureUrl: claims.picture || githubUserData.picture,
    email: claims.email || githubUserData.email,
  };

  // The create() method fails if the user already exists
  await db.collection(USERS_COLLECTION).doc(uid).create(user);

  return user;
}

/**
 * Fetch a user in our database by their unique `uid`
 */
export async function getUserByUid(uid: string) {
  const user = await db.collection(USERS_COLLECTION).doc(uid).get();

  try {
    return user.data() as User;
  } catch (_) {
    return null;
  }
}

/**
 * Creates a profile for a specific user and then returns it. If there's already
 * a profile, this will fail.
 */
export async function createProfileForUser(user: User) {
  const profile: UserProfile = {
    displayName: user.displayName,
    userId: user.uid,
    githubUrl: `https://github.com/${user.githubLogin}`,
    pictureUrl: user.pictureUrl,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    roleInterests: [],
    subjectInterests: [],
    techInterests: [],
  };

  try {
    await db
      .collection(USER_PROFILES_COLLECTION)
      .doc(getProfileKeyForUser(user))
      .create(profile);

    return profile;
  } catch (_) {
    return null;
  }
}

/**
 * Updates a User Profile in the database. The following fields are stripped
 * from the payload:
 * - createdAt
 * - updatedAt (filled in automatically)
 * - userId
 * - githubUrl
 */
export async function updateProfileForUser(
  user: User,
  updatedProfile: Partial<UserProfile>
) {
  const profileKey = getProfileKeyForUser(user);

  // Delete the fields we don't want to alter
  delete updatedProfile.createdAt;
  delete updatedProfile.userId;
  delete updatedProfile.githubUrl;

  // Send the correct time stamp
  updatedProfile.updatedAt = new Date().toISOString();

  await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(profileKey)
    .set(deleteEmptyFields(updatedProfile), { merge: true });
}

/**
 * Updates a User in the database. The following fields are stripped from the
 * payload:
 * - createdAt
 * - updatedAt (filled in automatically)
 * - uid
 * - githubLogin
 */
export async function updateUser(uid: string, user: Partial<User>) {
  // Delete the fields we don't want to alter
  delete user.createdAt;
  delete user.uid;
  delete user.githubLogin;

  // Send the correct time stamp
  user.updatedAt = new Date().toISOString();

  await db.collection(USERS_COLLECTION).doc(uid).set(user, { merge: true });
}

export async function getUserProfileBySlug(
  slug: string
): Promise<UserProfile | null> {
  const profileOrNull = await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(getProfileKeyForSlug(slug))
    .get();

  try {
    return profileOrNull.data() as UserProfile;
  } catch (_) {
    return null;
  }
}
