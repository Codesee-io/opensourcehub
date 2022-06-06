import { Form, useLoaderData } from "@remix-run/react";
import { FC, useState } from "react";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node";
import PullRequestChecker from "~/components/PullRequestChecker";
import TextField from "~/components/TextField";
import { createPortfolioItem } from "~/database.server";
import { getCurrentUser } from "~/session.server";
import { CreatePortfolioItemPayload } from "~/types";
import { isValidReviewMapUrl } from "~/utils/codesee";
import { isValidPullRequestUrl } from "~/utils/repo-url";
import { getProfileRouteForUser } from "~/utils/routes";
import TextArea from "~/components/TextArea";
import Button from "~/components/Button";
import ButtonLink from "~/components/ButtonLink";
import { zeroPad } from "~/utils/strings";

// ISO 8601 format: YYYY-MM-DD
function getCurrentDate() {
  const now = new Date();
  return [
    now.getFullYear(),
    zeroPad(now.getMonth(), 2),
    zeroPad(now.getDate(), 2),
  ].join("-");
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const slug = params.slug as string; // This can't be undefined or we wouldn't be here

  const user = await getCurrentUser(request);
  if (!user) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ slug, profileUrl: getProfileRouteForUser(user) } as LoaderData);
};

type LoaderData = { slug: string; profileUrl: string };

export const action: ActionFunction = async ({ request }) => {
  const currentUser = await getCurrentUser(request);

  if (!currentUser) {
    throw new Error("You must be logged in to create portfolio items");
  }

  const formData = await request.formData();

  const dateCompleted = formData.get("dateCompleted")?.toString();
  const description = formData.get("description")?.toString();
  const pullRequestUrl = formData.get("pullRequestUrl")?.toString();
  const title = formData.get("title")?.toString();
  const reviewMapImageUrl = formData.get("reviewMapImageUrl")?.toString();

  if (
    typeof dateCompleted !== "string" ||
    typeof description !== "string" ||
    typeof pullRequestUrl !== "string" ||
    typeof title !== "string"
  ) {
    throw new Error("Invalid parameters");
  }

  if (isValidPullRequestUrl(pullRequestUrl) === false) {
    throw new Error("Invalid pull request URL");
  }

  const newPortfolioItem: CreatePortfolioItemPayload = {
    userId: currentUser.uid,
    dateCompleted,
    description,
    pullRequestUrl,
    title,
  };

  if (
    typeof reviewMapImageUrl === "string" &&
    isValidReviewMapUrl(reviewMapImageUrl)
  ) {
    newPortfolioItem.reviewMapImageUrl = reviewMapImageUrl;
  }

  await createPortfolioItem(newPortfolioItem);

  return redirect(getProfileRouteForUser(currentUser));
};

const Contribution: FC = () => {
  const { slug, profileUrl } = useLoaderData<LoaderData>();
  const [pullRequestUrl, setPullRequestUrl] = useState<string | null>(null);

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white max-w-2xl mx-auto rounded-lg border p-4 lg:p-8 w-full relative overflow-hidden">
          <h2 className="text-xl font-semibold text-light-type mb-2">
            Add a new contribution
          </h2>
          <p className="text-sm text-light-type-medium mb-4">
            Your contributions will appear on your public profile.
          </p>
          <PullRequestChecker
            onInvalidPullRequest={() => setPullRequestUrl("")}
            onValidPullRequest={(url) => setPullRequestUrl(url)}
          />
          <Form
            method="post"
            action={`/u/github/${slug}/contribution`}
            className="space-y-4"
          >
            <input
              type="hidden"
              value={pullRequestUrl || ""}
              name="pullRequestUrl"
              required
            />
            <div>
              <TextField id="title" label="Title" />
            </div>
            <div>
              <TextArea
                id="description"
                label="Description"
                placeholder="What makes this contribution special to you?"
                style={{ minHeight: 100 }}
              />
            </div>
            <div>
              <TextField
                id="dateCompleted"
                label="Date completed"
                type="date"
                defaultValue={getCurrentDate()}
              />
            </div>
            <div className="pt-6 flex items-center justify-end gap-4">
              <ButtonLink to={profileUrl}>Cancel</ButtonLink>
              <Button disabled={pullRequestUrl == null} variant="brand">
                Save
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
