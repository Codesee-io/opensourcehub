import { ActionFunction, json } from "@remix-run/node";
import axios from "axios";
import { getReviewMapImageUrlFromPullRequest } from "~/utils/codesee";

/**
 * Checks whether a pull request has a Review Map image
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = formData.get("url")?.toString();

  if (typeof url !== "string") {
    return new Response(null, {
      status: 400,
      statusText: "Malformed request",
    });
  }

  const imageUrl = getReviewMapImageUrlFromPullRequest(url);

  if (imageUrl == null) {
    return new Response(null, {
      status: 400,
      statusText: "Malformed request",
    });
  }

  return await axios({
    url: imageUrl,
    method: "GET",
  })
    .then(() => {
      return json({ imageUrl });
    })
    .catch(() => {
      return json({}, { status: 404, statusText: "Not found" });
    });
};
