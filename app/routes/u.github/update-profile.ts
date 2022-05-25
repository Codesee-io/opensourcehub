import { ActionFunction, redirect } from "@remix-run/node";
import { updateProfileForUser } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
import { UserProfile } from "~/types";
import { getProfileRouteForUser } from "~/utils/routes";

function arrayFromString(value?: string): string[] {
  if (!value) return [];
  return value.split(",");
}

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (!currentUser) {
    throw new Error("You must be logged in to save your profile");
  }

  const formData = await request.formData();

  const displayName = formData.get("displayName")?.toString();
  const twitterUrl = formData.get("twitter")?.toString();
  const linkedinUrl = formData.get("linkedin")?.toString();
  const intro = formData.get("intro")?.toString();

  // The tags come in as a comma-delimited string, like
  // "bash,nextjs,javascript". They can also be an empty string.
  const techInterests = arrayFromString(
    formData.get("techInterests")?.toString()
  );
  const subjectInterests = arrayFromString(
    formData.get("subjectInterests")?.toString()
  );
  const roleInterests = arrayFromString(
    formData.get("roleInterests")?.toString()
  );

  const updatedProfile: Partial<UserProfile> = {
    userId: currentUser.uid,
    pictureUrl: currentUser.pictureUrl,
    linkedinUrl,
    twitterUrl,
    techInterests,
    subjectInterests,
    roleInterests,
    intro,
  };

  if (typeof displayName === "string" && displayName.length > 0) {
    updatedProfile.displayName = displayName;
  }

  await updateProfileForUser(currentUser, updatedProfile);

  return redirect(getProfileRouteForUser(currentUser));
};
