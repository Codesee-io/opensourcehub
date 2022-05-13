import { ActionFunction, redirect } from "@remix-run/node";
import { updateProfileForUser } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
import { UserProfile } from "~/types";
import { getProfileRouteForUser } from "~/utils/routes";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (!currentUser) {
    throw new Error("You must be logged in to save your profile");
  }

  const formData = await request.formData();

  const twitterUrl = formData.get("twitter")?.toString() ?? "";
  const linkedinUrl = formData.get("linkedin")?.toString() ?? "";

  // TODO
  // const techInterests = formData.get("techInterests");
  // const subjectInterests = formData.get("subjectInterests");
  // const contributionInterests = formData.get("contributionInterests");
  // const joinDiscord = formData.get("joinDiscord");

  const userProfile: UserProfile = {
    displayName: currentUser.displayName,
    userUid: currentUser.uid,
    pictureUrl: currentUser.avatar,
    linkedinUrl,
    twitterUrl,
  };

  await updateProfileForUser(currentUser, userProfile);

  return redirect(getProfileRouteForUser(currentUser));
};
