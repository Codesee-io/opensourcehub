import { db } from "./firebase.server";
import { User, UserProfile } from "./types";

const USER_PROFILES_COLLECTION = "profiles";

function getProfileKeyForUser(user: User) {
  return `github_${user.githubLogin}`;
}

function getProfileKeyForSlug(slug: string) {
  return `github_${slug}`;
}

export async function createProfileForUser(user: User) {
  const profile: UserProfile = {
    displayName: user.displayName,
    userUid: user.uid,
    githubUrl: `https://github.com/${user.githubLogin}`,
    pictureUrl: user.avatar,
  };

  await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(getProfileKeyForUser(user))
    .set(profile);
}

export async function updateProfileForUser(
  user: User,
  updatedProfile: UserProfile
) {
  const profileKey = getProfileKeyForUser(user);

  await db
    .collection(USER_PROFILES_COLLECTION)
    .doc(profileKey)
    .set(updatedProfile, { merge: true });
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
