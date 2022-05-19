import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import Button from "~/components/Button";
import RootLayout from "~/components/RootLayout";
import { getUserProfileBySlug } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
import { User, UserProfile } from "~/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug;

  if (typeof slug !== "string") {
    return redirect("/");
  }

  const session = await getSession(request.headers.get("Cookie"));
  const user = await getCurrentUser(session);
  const profile = await getUserProfileBySlug(slug);

  if (!profile) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  if (profile.userId === user?.uid) {
    // If the project is tied to the current user, send the user data down
    return json({ profile, user } as LoaderData);
  } else {
    // Otherwise, send only the profile data
    return json({ profile, user: null } as LoaderData);
  }
};

type LoaderData = {
  profile: UserProfile;
  user: User | null;
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <RootLayout>
        <main className="max-w-xl mx-auto p-4 py-16">
          <h2 className="font-semibold text-2xl mb-2 text-black-500">
            There is profile here <span role="img">🙀</span>
          </h2>
          <p className="text-light-type-medium mb-4">
            Maybe the URL is incorrect or the person you're looking took down
            their profile.
          </p>
          <p>
            <Link
              to="/"
              className="text-light-interactive font-semibold hover:underline"
            >
              Go home
            </Link>
          </p>
        </main>
      </RootLayout>
    );
  }

  return (
    <RootLayout>
      <main className="max-w-xl mx-auto p-4 py-16">
        <h2 className="font-semibold text-2xl mb-2 text-black-500">
          {caught.status} {caught.statusText}
        </h2>
        <p className="text-light-type-medium mb-4">
          Something went terribly wrong
        </p>
        <p>
          <Link
            to="/"
            className="text-light-interactive font-semibold hover:underline"
          >
            Go home
          </Link>
        </p>
      </main>
    </RootLayout>
  );
}

const ProfilePage: FC = () => {
  const { profile, user } = useLoaderData<LoaderData>();

  const canEdit = user != null;
  const hasVerifiedDiscord =
    user != null && typeof user.discordUserId === "string";

  return (
    <RootLayout>
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white border border-black-50 p-6 rounded-lg">
          <div className="flex gap-6">
            {profile.pictureUrl && (
              <img
                src={profile.pictureUrl}
                style={{ width: 108, height: 108 }}
                alt={`${profile.displayName}'s avatar`}
                className="rounded-full flex-shrink-0"
              />
            )}
            <div>
              <h1 className="text-4xl text-light-type font-semibold">
                {profile.displayName}
              </h1>
              <div className="space-x-4 text-light-interactive font-semibold">
                {profile.githubUrl && (
                  <a className="hover:underline" href={profile.githubUrl}>
                    GitHub
                  </a>
                )}
                {profile.twitterUrl && (
                  <a className="hover:underline" href={profile.twitterUrl}>
                    Twitter
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a className="hover:underline" href={profile.linkedinUrl}>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            {canEdit && (
              <div>
                {hasVerifiedDiscord ? (
                  <div>
                    <span
                      title="You've verified your Discord account"
                      className="inline-block px-2 py-1 rounded bg-discord-blurple text-white text-xs"
                    >
                      Discord verified
                    </span>
                  </div>
                ) : (
                  <Form action="/api/discord-auth-url" method="post">
                    <Button type="submit">Verify on Discord</Button>
                  </Form>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Outlet />
    </RootLayout>
  );
};

export default ProfilePage;
