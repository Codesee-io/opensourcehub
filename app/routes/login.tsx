import { MarkGithubIcon } from "@primer/octicons-react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { GithubAuthProvider, UserCredential } from "firebase/auth";
import { FC, useState } from "react";
import Button from "~/components/Button";
import { signInWithGitHubPopup } from "~/firebase.client";
import { getFirebaseClientConfig } from "~/firebase.server";
import { createUserSession, isLoggedIn } from "~/session.server";
import { ROUTES } from "~/utils/constants";

export const meta: MetaFunction = () => ({
  title: "Log in to Open Source Hub",
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

enum FormState {
  Idle,
  Authenticating,
  Redirecting,
  Failed,
}

const Login: FC = () => {
  const [formState, setFormState] = useState(FormState.Idle);
  const { firebaseClientConfig } = useLoaderData();

  const submit = useSubmit();

  const signIn = async () => {
    setFormState(FormState.Authenticating);

    let result: UserCredential;
    try {
      result = await signInWithGitHubPopup(firebaseClientConfig);
    } catch (err) {
      setFormState(FormState.Failed);
      return;
    }

    const idToken = await result.user.getIdToken();

    const credential = GithubAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (idToken && accessToken) {
      setFormState(FormState.Redirecting);

      // Once we're logged in, we need to store the session on the server. We do
      // this by POSTing to this page, which is handled by the action function.
      const formData = new FormData();
      formData.append("idToken", idToken);
      formData.append("accessToken", accessToken);
      submit(formData, { method: "post", action: "/login" });
    } else {
      setFormState(FormState.Failed);
    }
  };

  return (
    <div className="px-4">
      <main className="bg-white border border-light-border rounded-lg my-8 px-4 py-12 max-w-xl text-center mx-auto space-y-4">
        <h1 className="text-light-type text-2xl font-semibold">
          Log in to Open Source Hub
        </h1>
        <p className="text-light-type">
          Use your GitHub account to create and manage your profile.
        </p>
        <Button
          variant="brand"
          type="button"
          onClick={signIn}
          disabled={[FormState.Authenticating, FormState.Redirecting].includes(
            formState
          )}
        >
          <span className="mr-2">Log in with GitHub</span>
          <MarkGithubIcon />
        </Button>
        {formState === FormState.Authenticating && (
          <p>Authenticating with GitHub...</p>
        )}
        {formState === FormState.Redirecting && (
          <p>Pulling up your profile...</p>
        )}
        {formState === FormState.Failed && (
          <p>Unable to log you in, please try again</p>
        )}
      </main>
      <div className="text-light-type text-sm max-w-xl mx-auto px-4 mb-12 space-y-2">
        <p>
          By logging in to Open Source Hub, you can claim your public profile
          page where you can list your interests, connect your Discord account,
          and show off the open-source contributions you're most proud of.
        </p>
        <p>
          Usage of Open Source Hub is subject to our{" "}
          <Link
            to={ROUTES.TERMS_CONDITIONS}
            className="text-light-interactive font-semibold hover:underline"
          >
            terms of use
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default Login;
