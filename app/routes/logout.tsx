import { json, LoaderFunction, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { useSubmit } from "@remix-run/react";
import { FC, useEffect } from "react";
import {
  destroySession,
  getCurrentUserOrRedirect,
  getSession,
} from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  let session = await getSession(request.headers.get("Cookie"));
  session.unset("idToken");
  session.unset("accessToken");

  return redirect("/", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  await getCurrentUserOrRedirect(request);

  return json({});
};

const LogOut: FC = () => {
  const submit = useSubmit();

  useEffect(() => {
    submit(null, { method: "post", action: "/logout" });
  }, [submit]);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg my-8 px-6 py-12 border border-light-border text-center">
      <p className="text-light-type">Logging you out 👋</p>
    </div>
  );
};

export default LogOut;
