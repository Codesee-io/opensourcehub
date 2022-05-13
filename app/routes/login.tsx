import type { FC } from "react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { json, redirect } from "@remix-run/node";
import { Octokit } from "@octokit/rest";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { commitSession, getCurrentUser, getSession } from "~/session.server";
import RootLayout from "~/components/RootLayout";
import Button from "~/components/Button";
import { getFirebaseClientConfig } from "~/firebase.server";
import { initFirebaseClient } from "~/firebase.client";
import { createProfileForUser, getUserProfileBySlug } from "~/database.server";

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
  const accessToken = formData.get("accessToken");

  // Save the session in a cookie with the user's tokens
  let session = await getSession(request.headers.get("Cookie"));
  session.set("idToken", idToken);
  session.set("accessToken", accessToken);

  // Check whether the user has a profile page. If not, ask them to create one.
  const user = await getCurrentUser(session);

  if (!user) {
    throw new Error(
      "Unable to create a profile, please refresh the page and try again"
    );
  }

  let redirectPath: string;
  const profile = await getUserProfileBySlug(user.githubLogin);

  if (profile) {
    // If the user already has a profile, we redirect to it
    redirectPath = `/u/github/${user.githubLogin}`;
  } else {
    // If the user doesn't have a profile yet, we create one and send them to
    // the Welcome page to enter some information
    await createProfileForUser(user);

    redirectPath = `/u/github/${user.githubLogin}/welcome`;
  }

  // Send the user to the main page after login
  return redirect(redirectPath, {
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
    githubAuth.addScope("read:user");

    const result = await signInWithPopup(firebaseClientAuth, githubAuth);
    const idToken = await result.user.getIdToken();

    const credential = GithubAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (idToken && accessToken) {
      // Once we're logged in, we need to store the session on the server. We do
      // this by POSTing to this page, which is handled by the action function.
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("accessToken", accessToken);
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
