import { MarkGithubIcon } from "@primer/octicons-react";
import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, Outlet, useCatch, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import Button from "~/components/Button";
import DiscordIcon from "~/components/icons/DiscordIcon";
import EditIcon from "~/components/icons/EditIcon";
import LinkedInIcon from "~/components/icons/LinkedInIcon";
import TwitterIcon from "~/components/icons/TwitterIcon";
import Interests from "~/components/profile/Interests";
import RootLayout from "~/components/RootLayout";
import { getUserProfileBySlug } from "~/database.server";
import { getCurrentUser, getSession } from "~/session.server";
import { UserProfile } from "~/types";

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug as string; // This can't be undefined or we wouldn't be here

  const session = await getSession(request.headers.get("Cookie"));
  const user = await getCurrentUser(session);
  const profile = await getUserProfileBySlug(slug);

  if (!profile) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const payload: LoaderData = {
    profile,
    canEdit: profile.userId === user?.uid,
    hasVerifiedDiscord: typeof user?.discordUserId === "string",
  };

  return json(payload);
};

type LoaderData = {
  profile: UserProfile;
  canEdit: boolean;
  hasVerifiedDiscord: boolean;
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
  const { profile, canEdit, hasVerifiedDiscord } = useLoaderData<LoaderData>();

  return (
    <RootLayout>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white border border-light-border p-6 rounded-lg">
          <div className="flex gap-6 mb-4 relative">
            <div className="flex-shrink-0">
              {profile.pictureUrl && (
                <img
                  src={profile.pictureUrl}
                  style={{ width: 108, height: 108 }}
                  alt={`${profile.displayName}'s avatar`}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div className="space-x-2 text-light-interactive font-semibold mt-2">
                {profile.githubUrl && (
                  <a
                    className="inline-flex p-1 text-light-type-medium hover:text-light-interactive"
                    href={profile.githubUrl}
                    title={`Visit ${profile.displayName}'s GitHub profile`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MarkGithubIcon size={20} />
                  </a>
                )}
                {profile.twitterUrl && (
                  <a
                    className="inline-flex p-1 text-light-type-medium hover:text-light-interactive"
                    href={profile.twitterUrl}
                    title={`Visit ${profile.displayName}'s Twitter feed`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <TwitterIcon className="w-5 h-5" />
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a
                    className="inline-flex p-1 text-light-type-medium hover:text-light-interactive"
                    href={profile.linkedinUrl}
                    title={`Visit ${profile.displayName}'s LinkedIn profile`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <LinkedInIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
            <div>
              <h1 className="text-4xl text-light-type font-semibold mb-4">
                {profile.displayName}
                {canEdit && hasVerifiedDiscord && (
                  <span
                    title="You've verified your Discord account"
                    className="ml-4 inline-block p-1 rounded-full bg-discord-blurple text-white text-xs"
                  >
                    <DiscordIcon className="w-3 h-3" />
                  </span>
                )}
              </h1>
              {profile.intro && (
                <p className="text-sm text-light-type-medium max-w-2xl whitespace-pre-line">
                  {profile.intro}
                </p>
              )}
              {canEdit && !profile.intro && (
                <p className="text-sm">
                  Why not{" "}
                  <Link
                    to="edit"
                    className="text-light-interactive hover:underline font-semibold"
                  >
                    introduce yourself
                  </Link>{" "}
                  on your profile?
                </p>
              )}
            </div>

            {canEdit && (
              <Link
                to="edit"
                title="Edit your profile"
                className="absolute p-1 -top-1 -right-1 rounded hover:text-light-interactive"
              >
                <EditIcon />
              </Link>
            )}
          </div>
          <Interests {...profile} />
          {canEdit && !hasVerifiedDiscord && (
            <Form action="/api/discord-auth-url" method="post" className="mt-6">
              <Button type="submit">Verify on Discord</Button>
            </Form>
          )}
        </div>
      </main>
      <Outlet />
    </RootLayout>
  );
};

export default ProfilePage;
