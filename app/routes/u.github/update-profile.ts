import { ActionFunction, redirect } from "@remix-run/node";
import { updateProfileForUser } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
import { getProfileRouteForUser } from "~/utils/routes";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const currentUser = await getCurrentUser(session);

  if (!currentUser) {
    throw new Error("You must be logged in to save your profile");
  }

  const formData = await request.formData();

  const twitterUrl = formData.get("twitter")?.toString();
  const linkedinUrl = formData.get("linkedin")?.toString();

  // TODO
  // const techInterests = formData.get("techInterests");
  // const subjectInterests = formData.get("subjectInterests");
  // const contributionInterests = formData.get("contributionInterests");
  // const joinDiscord = formData.get("joinDiscord");

  await updateProfileForUser(currentUser, {
    displayName: currentUser.displayName,
    userId: currentUser.uid,
    pictureUrl: currentUser.pictureUrl,
    linkedinUrl,
    twitterUrl,
  });

  return redirect(getProfileRouteForUser(currentUser));
};
