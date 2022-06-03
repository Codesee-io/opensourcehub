import type { FC } from "react";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { createUserSession, isLoggedIn } from "~/session.server";
import Button from "~/components/Button";
import { getFirebaseClientConfig } from "~/firebase.server";
import { initFirebaseClient } from "~/firebase.client";

export const meta: MetaFunction = () => ({
  title: "Log in to Open-Source Hub",
});

export const loader: LoaderFunction = async ({ request }) => {
  if (await isLoggedIn(request)) {
    // Redirect to the profile page if we're already signed in
    return redirect("/profile");
  }

  const data = {
    firebaseClientConfig: getFirebaseClientConfig(),
  };

  return json(data);
};

/**
 * Handler triggered when a form is POSTed to this URL. Using the idToken field
 * from the payload, we commit a new session on the server. This allows us to
 * retrieve the user's session after the user closes the page or their browser.
 */
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const idToken = formData.get("idToken")?.toString();
  const accessToken = formData.get("accessToken")?.toString();

  if (!idToken || !accessToken) {
    throw new Error("Missing idToken or accessToken when attempting to log in");
  }

  return await createUserSession(idToken, accessToken);
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
    <main className="px-4 py-12 max-w-2xl text-center mx-auto space-y-4">
      <p className="text-black-400">
        Use your GitHub account to log in and manage your profile.
      </p>
      <Button type="button" onClick={signIn}>
        Log in with GitHub
      </Button>
    </main>
  );
};

export default Login;
