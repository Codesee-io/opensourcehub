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
import {
  getPortfolioItemsForUserId,
  getUserProfileBySlug,
} from "~/database.server";
import {
  commitSession,
  getCurrentSession,
  getCurrentUser,
} from "~/session.server";
import { getProjectByRepoUrl } from "~/projects.server";
import { PortfolioItem, Project, UserProfile } from "~/types";
import { parseMarkdown } from "~/utils/markdown";
import markdownStyles from "~/styles/markdown.css";
import DocumentPinIcon from "~/components/icons/DocumentPinIcon";
import ButtonLink from "~/components/ButtonLink";
import { getPortfolioItemEditRoute } from "~/utils/routes";
import PortfolioItemCard from "~/components/PortfolioItemCard";
import FlashMessage from "~/components/FlashMessage";

export function links() {
  return [{ rel: "stylesheet", href: markdownStyles }];
}

type PortfolioItemWithExtras = PortfolioItem & {
  project?: Project;
  editRoute?: string;
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const slug = params.slug as string; // This can't be undefined or we wouldn't be here

  // Grab the user and the matching profile in parallel
  const [user, profile, session] = await Promise.all([
    getCurrentUser(request),
    getUserProfileBySlug(slug),
    getCurrentSession(request),
  ]);

  if (!profile) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  const portfolioItems = await getPortfolioItemsForUserId(profile?.userId);

  const portfolioItemsWithProjects: PortfolioItemWithExtras[] = portfolioItems
    .map((item) => ({
      ...item,
      description: parseMarkdown(item.description),
      project: getProjectByRepoUrl(item.pullRequestUrl),
      editRoute: user ? getPortfolioItemEditRoute(user, item) : undefined,
    }))
    .sort((a, b) => {
      return (
        new Date(b.dateCompleted).getTime() -
        new Date(a.dateCompleted).getTime()
      );
    });

  const message = (session.get("globalMessage") as string) || null;

  const payload: LoaderData = {
    profile,
    canEdit: profile.userId === user?.uid,
    hasVerifiedDiscord: typeof user?.discordUserId === "string",
    portfolioItems: portfolioItemsWithProjects,
    message,
  };

  // We must commit the session to clear the flash message
  return json(payload, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
};

type LoaderData = {
  message: string | null;
  profile: UserProfile;
  canEdit: boolean;
  hasVerifiedDiscord: boolean;
  portfolioItems: PortfolioItemWithExtras[];
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <main className="max-w-xl mx-auto p-4 py-16">
        <h2 className="font-semibold text-2xl mb-2 text-black-500">
          There is no profile here <span role="img">🙀</span>
        </h2>
        <p className="text-light-type-medium mb-4">
          Maybe the URL is incorrect or the person you're looking took down
          their profile.
        </p>
        <p>
          <Link to="/" className="link">
            Go home
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="max-w-xl mx-auto p-4 py-16">
      <h2 className="font-semibold text-2xl mb-2 text-black-500">
        {caught.status} {caught.statusText}
      </h2>
      <p className="text-light-type-medium mb-4">
        Something went terribly wrong
      </p>
      <p>
        <Link to="/" className="link">
          Go home
        </Link>
      </p>
    </main>
  );
}

const ProfilePage: FC = () => {
  const { profile, canEdit, hasVerifiedDiscord, portfolioItems, message } =
    useLoaderData<LoaderData>();

  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white border border-light-border p-6 rounded-lg">
          {message && (
            <div className="fixed bottom-8 right-8 z-50">
              <FlashMessage kind="success">{message}</FlashMessage>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-6 mb-4 relative">
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
          {canEdit && (
            <ButtonLink to={"/list-project"}>List a project</ButtonLink>
          )}
        </div>
        <section className="mx-auto max-w-6xl my-8">
          <div className="flex justify-between items-center mb-4">
            {(portfolioItems.length > 0 || canEdit) && (
              <h2 className="text-light-type text-xl font-semibold">
                Portfolio
              </h2>
            )}
            {canEdit && (
              <Link
                to="contribution"
                className="font-semibold text-light-interactive supports-hover:hover:underline"
              >
                + Add contribution
              </Link>
            )}
          </div>
          {canEdit && portfolioItems.length === 0 && (
            <div className="text-center space-y-4 p-6 border-2 border-dashed border-light-type-disabled rounded-lg">
              <span className="inline-flex text-light-type-medium">
                <DocumentPinIcon />
              </span>
              <p className="max-w-lg mx-auto">
                List your favorite contributions on your profile! Your portfolio
                will be visible by anyone who visits Open Source Hub, so it's
                your chance to shine ✨
              </p>
              <ButtonLink to="contribution" className="inline-block">
                Add contribution
              </ButtonLink>
            </div>
          )}
          <div className="space-y-8 max-w-4xl">
            {portfolioItems.map((item) => (
              <PortfolioItemCard
                key={item.id}
                canEdit={canEdit}
                portfolioItem={item}
                editRoute={item.editRoute}
                project={item.project}
              />
            ))}
          </div>
        </section>
      </main>
      <Outlet />
    </>
  );
};

export default ProfilePage;
