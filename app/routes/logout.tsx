import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { destroySession, getSession } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  session.unset("idToken");
  session.unset("accessToken");

  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export const loader = () => {
  // Redirect to the home page
  return redirect("/");
};
