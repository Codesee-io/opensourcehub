import type { FC } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { commitSession, getSession } from "~/session.server";
import RootLayout from "~/components/RootLayout";
import Button from "~/components/Button";
import { getFirebaseClientConfig } from "~/firebase.server";
import { initFirebaseClient } from "~/firebase.client";

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));

  if (session.has("idToken")) {
    // Redirect to the profile page if we're already signed in
    return redirect("/profile");
  }

  const data = {
    error: session.get("error"),
    firebaseClientConfig: getFirebaseClientConfig(),
  };

  return json(data, {
    headers: { "Set-Cookie": await commitSession(session) },
  });
};

/**
 * Handler triggered when a form is POSTed to this URL. Using the idToken field
 * from the payload, we commit a new session on the server. This allows us to
 * retrieve the user's session after the user closes the page or their browser.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  // Save the session in a cookie with the user's tokens
  let session = await getSession(request.headers.get("Cookie"));
  session.set("idToken", idToken);

  // Send the user to the main page after login
  return redirect("/profile", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

const Login: FC = () => {
  const { firebaseClientConfig } = useLoaderData();

  const submit = useSubmit();

  const signIn = async () => {
    const firebaseClientAuth = initFirebaseClient(firebaseClientConfig);

    const githubAuth = new GithubAuthProvider();

    const result = await signInWithPopup(firebaseClientAuth, githubAuth);
    const idToken = await result.user.getIdToken();

    if (idToken) {
      // Once we're logged in, we need to store the session on the server. We do
      // this by POSTing to this page, which is handled by the action function.
      const formData = new FormData();
      formData.append("idToken", idToken);
      submit(formData, { method: "post", action: "/login" });
    } else {
      alert("Sign-in failed, please try again");
    }
  };

  return (
    <RootLayout>
      <main className="px-4 py-12 max-w-2xl text-center mx-auto space-y-4">
        <p className="text-black-400">
          Use your GitHub account to log in and manage your profile.
        </p>
        <Button onClick={signIn}>Log in with GitHub</Button>
      </main>
    </RootLayout>
  );
};

export default Login;
