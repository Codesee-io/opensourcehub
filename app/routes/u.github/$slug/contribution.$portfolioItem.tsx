import { Form, useLoaderData } from "@remix-run/react";
import { FC } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import TextField from "~/components/TextField";
import { updatePortfolioItem, getPortfolioItemById } from "~/database.server";
import { getCurrentUser } from "~/session.server";
import { UpdatePortfolioItemPayload, PortfolioItem } from "~/types";
import { getProfileRouteForUser } from "~/utils/routes";
import TextArea from "~/components/TextArea";
import ButtonLink from "~/components/ButtonLink";
import Button from "~/components/Button";

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.slug as string; // This can't be undefined or we wouldn't be here
  const portfolioItemId = params.portfolioItem as string;

  const [user, portfolioItem] = await Promise.all([
    getCurrentUser(request),
    getPortfolioItemById(portfolioItemId),
  ]);

  if (!user || !portfolioItem) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({
    slug,
    portfolioItem,
    profileUrl: getProfileRouteForUser(user),
  } as LoaderData);
};

type LoaderData = {
  slug: string;
  portfolioItem: PortfolioItem;
  profileUrl: string;
};

export const action: ActionFunction = async ({ request, params }) => {
  const portfolioItemId = params.portfolioItem as string;
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    throw new Error("You must be logged in to edit portfolio items");
  }

  const formData = await request.formData();

  const dateCompleted = formData.get("dateCompleted")?.toString();
  const description = formData.get("description")?.toString();
  const title = formData.get("title")?.toString();

  if (
    typeof dateCompleted !== "string" ||
    typeof description !== "string" ||
    typeof title !== "string"
  ) {
    throw new Error("Invalid parameters");
  }

  const updatedPortfolioItem: UpdatePortfolioItemPayload = {
    dateCompleted,
    description,
    title,
  };

  await updatePortfolioItem(portfolioItemId, updatedPortfolioItem);

  return redirect(getProfileRouteForUser(currentUser));
};

const Contribution: FC = () => {
  const { slug, profileUrl, portfolioItem } = useLoaderData<LoaderData>();

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white max-w-2xl mx-auto rounded-lg border p-8 w-full relative overflow-hidden">
          <h2 className="text-xl font-semibold text-light-type mb-2">
            Edit your contribution
          </h2>
          <p className="text-sm text-light-type-medium mb-4">
            Your contributions appear on your public profile.
          </p>
          <Form
            method="post"
            action={`/u/github/${slug}/contribution`}
            className="space-y-4"
          >
            <div>
              <TextField
                id="pullRequestUrl"
                readOnly
                label="Pull request URL"
                value={portfolioItem.pullRequestUrl}
              />
            </div>
            <div>
              <TextField
                id="title"
                label="Title"
                defaultValue={portfolioItem.title}
              />
            </div>
            <div>
              <TextArea
                id="description"
                label="Description"
                placeholder="What makes this contribution special to you?"
                style={{ minHeight: 100 }}
                defaultValue={portfolioItem.description}
              />
            </div>
            <div>
              <TextField
                id="dateCompleted"
                label="Date completed"
                defaultValue={portfolioItem.dateCompleted}
              />
            </div>
            <div className="flex items-center justify-end gap-4 pt-6">
              <ButtonLink to={profileUrl} variant="secondary">
                Cancel
              </ButtonLink>
              <Button variant="brand">Save</Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
