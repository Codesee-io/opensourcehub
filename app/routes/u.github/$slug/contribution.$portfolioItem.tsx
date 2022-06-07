import { Form, useActionData, useLoaderData } from "@remix-run/react";
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
import DeletePortfolioItemForm from "~/components/DeletePortfolioItemForm";
import FieldError from "~/components/FieldError";
import { validateDateString, validateString } from "~/utils/validation";

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

  // Validate the required fields, and return an object of validation errors if
  // necessary
  const validationErrors = {
    dateCompleted: validateDateString(dateCompleted),
    description: validateString(description, { minLength: 10 }),
    title: validateString(title, { minLength: 5 }),
  };

  if (Object.values(validationErrors).some(Boolean)) {
    return { validationErrors };
  }

  // We're all validated! Let's update the portfolio item. It's gross that we're
  // casting most fields as strings to keep TypeScript happy, but it's not smart
  // enough to know what we validated those fields. There's probably a way to
  // improve that :thinking_face:
  const updatedPortfolioItem: UpdatePortfolioItemPayload = {
    dateCompleted: dateCompleted as string,
    description: description as string,
    title: title as string,
  };

  await updatePortfolioItem(portfolioItemId, updatedPortfolioItem);

  return redirect(getProfileRouteForUser(currentUser));
};

const Contribution: FC = () => {
  const actionData = useActionData();

  const { slug, profileUrl, portfolioItem } = useLoaderData<LoaderData>();

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white max-w-2xl mx-auto rounded-lg border p-4 lg:p-8 w-full relative overflow-hidden">
          <h2 className="text-xl font-semibold text-light-type mb-2">
            Edit your contribution
          </h2>
          <p className="text-sm text-light-type-medium mb-4">
            Your contributions appear on your public profile.
          </p>
          <Form
            method="post"
            action={`/u/github/${slug}/contribution/${portfolioItem.id}`}
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
              <FieldError error={actionData?.validationErrors?.title} />
            </div>
            <div>
              <TextArea
                id="description"
                label="Description"
                placeholder="What makes this contribution special to you?"
                style={{ minHeight: 100 }}
                defaultValue={portfolioItem.description}
              />
              <FieldError error={actionData?.validationErrors?.description} />
            </div>
            <div>
              <TextField
                id="dateCompleted"
                label="Date completed"
                defaultValue={portfolioItem.dateCompleted}
              />
              <FieldError error={actionData?.validationErrors?.dateCompleted} />
            </div>
            <div className="flex flex-col sm:flex-row items-center sm:justify-end gap-4 pt-6">
              <DeletePortfolioItemForm id={portfolioItem.id} />
              <div className="ml-auto flex gap-2">
                <ButtonLink to={profileUrl}>Cancel</ButtonLink>
                <Button variant="brand">Save changes</Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    </section>
  );
};

export default Contribution;
