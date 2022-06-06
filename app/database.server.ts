import { DecodedIdToken } from "firebase-admin/auth";
import { nanoid } from "nanoid";
import { db } from "./firebase.server";
import { getGitHubUserDataFromClaims } from "./session.server";
import {
  CreatePortfolioItemPayload,
  PortfolioItem,
  UpdatePortfolioItemPayload,
  User,
  UserProfile,
} from "./types";
import { deleteEmptyFields } from "./utils/delete-empty-fields";

// The names of collections in Firestore. Don't change these unless you're
// absolutely sure of what you're doing!
const USER_PROFILES_COLLECTION = "profiles";
const USERS_COLLECTION = "users";
const PORTFOLIO_ITEMS_COLLECTION = "portfolioItems";

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
export async function createUser(
  decodedToken: DecodedIdToken,
  accessToken: string
) {
  const githubUserData = await getGitHubUserDataFromClaims(
    accessToken,
    decodedToken
  );

  const uid = decodedToken.uid;

  const user: User = {
    uid,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    githubLogin: githubUserData.login,
    displayName: decodedToken.name || githubUserData.login, // There isn't always a name in the claims!
    pictureUrl: decodedToken.picture || githubUserData.picture,
    email: decodedToken.email || githubUserData.email,
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

export async function createPortfolioItem(item: CreatePortfolioItemPayload) {
  const portfolioItem: PortfolioItem = {
    ...item,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    id: nanoid(),
  };

  try {
    await db
      .collection(PORTFOLIO_ITEMS_COLLECTION)
      .doc(portfolioItem.id)
      .create(portfolioItem);

    return portfolioItem;
  } catch (_) {
    return null;
  }
}

export async function updatePortfolioItem(
  id: string,
  item: UpdatePortfolioItemPayload
) {
  const portfolioItem: Partial<PortfolioItem> = {
    ...item,
    updatedAt: new Date().toISOString(),
  };

  await db
    .collection(PORTFOLIO_ITEMS_COLLECTION)
    .doc(id)
    .set(portfolioItem, { merge: true });
}

export async function getPortfolioItemById(id: string) {
  const itemOrNull = await db
    .collection(PORTFOLIO_ITEMS_COLLECTION)
    .doc(id)
    .get();

  try {
    return itemOrNull.data() as PortfolioItem;
  } catch (_) {
    return null;
  }
}

export async function getPortfolioItemsForUserId(userId: string) {
  const snapshot = await db
    .collection(PORTFOLIO_ITEMS_COLLECTION)
    .where("userId", "==", userId)
    .get();

  const items: PortfolioItem[] = [];

  snapshot.forEach((doc) => {
    items.push(doc.data() as PortfolioItem);
  });

  return items;
}

export async function deletePortfolioItem(user: User, id: string) {
  const item = await getPortfolioItemById(id);

  // Enforce that only the owner of a portfolio item can delete it
  if (item && item.userId === user.uid) {
    return await db.collection(PORTFOLIO_ITEMS_COLLECTION).doc(id).delete();
  }

  throw new Error("Not authorized to delete this portfolio item");
}
