import { ActionFunction, redirect } from "@remix-run/node";
import { updateProfileForUser } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
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

  const twitterUrl = formData.get("twitter")?.toString();
  const linkedinUrl = formData.get("linkedin")?.toString();

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

  await updateProfileForUser(currentUser, {
    displayName: currentUser.displayName,
    userId: currentUser.uid,
    pictureUrl: currentUser.pictureUrl,
    linkedinUrl,
    twitterUrl,
    techInterests,
    subjectInterests,
    roleInterests,
  });

  return redirect(getProfileRouteForUser(currentUser));
};
