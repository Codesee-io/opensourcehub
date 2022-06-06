import { json, LoaderFunction } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { FC, FormEvent, useState } from "react";
import TextField from "~/components/TextField";
import { getCurrentUserOrRedirect } from "~/session.server";
import { User } from "~/types";
import formStyles from "~/styles/forms.css";
import Button from "~/components/Button";
import CloseIcon from "~/components/icons/CloseIcon";
import { getProfileRouteForUser } from "~/utils/routes";
import ReactSelect, { MultiValue } from "react-select";
import {
  ROLE_INTERESTS,
  SUBJECT_INTERESTS,
  TECH_INTERESTS,
} from "~/utils/tags";
import TwitterIcon from "~/components/icons/TwitterIcon";
import LinkedInIcon from "~/components/icons/LinkedInIcon";
import ButtonLink from "~/components/ButtonLink";
import { DISCORD_LINK } from "~/utils/constants";

export function links() {
  return [{ rel: "stylesheet", href: formStyles }];
}

export const loader: LoaderFunction = async ({ request }) => {
  const currentUser = await getCurrentUserOrRedirect(request);
  return json({ user: currentUser } as LoaderData);
};

type LoaderData = {
  user: User;
};

type TagsState = {
  techInterests: MultiValue<{ label: string; value: string }>;
  roleInterests: MultiValue<{ label: string; value: string }>;
  subjectInterests: MultiValue<{ label: string; value: string }>;
};

const Welcome: FC = () => {
  const { user } = useLoaderData<LoaderData>();

  const [tags, setTags] = useState<TagsState>({
    techInterests: [],
    roleInterests: [],
    subjectInterests: [],
  });

  const updateTags =
    (key: keyof TagsState) =>
    (updatedTags: MultiValue<{ label: string; value: string }>) => {
      setTags({ ...tags, [key]: updatedTags });
    };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    // If the user checked the "Join Discord" checkbox, we open Discord in a new tab
    const formData = new FormData(event.currentTarget);
    if (formData.get("joinDiscord")) {
      window.open(DISCORD_LINK);
    }

    // And then Remix handles the actual submission!
  };

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div
          className="bg-white max-w-7xl mx-auto rounded-lg border p-8 w-full relative overflow-hidden"
          style={{ paddingLeft: "calc(185px + 2rem)" }}
        >
          <div className="modal-decoration" />
          <div className="flex gap-6 mb-8">
            {user.pictureUrl && (
              <img
                src={user.pictureUrl}
                style={{ width: 108, height: 108 }}
                className="rounded-full flex-shrink-0"
                alt="Your avatar on GitHub"
              />
            )}
            <div>
              <h1 className="font-semibold text-2xl mb-2 text-light-type">
                Welcome contributor!
              </h1>
              <p className="max-w-md text-light-type-low text-sm">
                You're almost done creating your profile on{" "}
                <strong>Open-Source Hub</strong> using your GitHub account (
                {user.githubLogin})
              </p>
            </div>
            <Link to="/profile" className="absolute top-6 right-6 p-2">
              <CloseIcon />
            </Link>
          </div>
          <div>
            <p className="font-medium mb-4 text-light-type">
              Tell us more about yourself
            </p>
            <Form
              method="post"
              action="/u/github/update-profile"
              onSubmit={onFormSubmit}
            >
              <div className="lg:flex gap-8">
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="h-20">
                    <TextField
                      required
                      defaultValue={user.displayName || ""}
                      label="Display name"
                      id="displayName"
                      autoFocus
                    />
                  </div>
                  <div className="h-20">
                    <TextField
                      label={
                        <span className="flex items-center gap-1">
                          <TwitterIcon className="w-4 h-4" /> Twitter
                        </span>
                      }
                      id="twitter"
                    />
                  </div>
                  <div className="h-20">
                    <TextField
                      label={
                        <span className="flex items-center gap-1">
                          <LinkedInIcon className="w-4 h-4" /> LinkedIn
                        </span>
                      }
                      id="linkedin"
                    />
                  </div>
                </div>
                <div className="w-full lg:w-1/2 space-y-4">
                  <div className="h-20">
                    <label className="input-label">Tech interests</label>
                    <input
                      type="hidden"
                      name="techInterests"
                      value={tags.techInterests.map((t) => t.value).join(",")}
                    />
                    <ReactSelect
                      classNamePrefix="custom-react-select"
                      className="mt-1"
                      placeholder="What technologies interest you?"
                      options={TECH_INTERESTS}
                      isMulti
                      onChange={updateTags("techInterests")}
                    />
                  </div>
                  <div className="h-20">
                    <label className="input-label">
                      Subject matter interests
                    </label>
                    <input
                      type="hidden"
                      name="subjectInterests"
                      value={tags.subjectInterests
                        .map((t) => t.value)
                        .join(",")}
                    />
                    <ReactSelect
                      classNamePrefix="custom-react-select"
                      className="mt-1"
                      placeholder="What subjects are you interested in?"
                      options={SUBJECT_INTERESTS}
                      isMulti
                      onChange={updateTags("subjectInterests")}
                    />
                  </div>
                  <div className="h-20">
                    <label className="input-label">
                      Contribution interests
                    </label>
                    <input
                      type="hidden"
                      name="roleInterests"
                      value={tags.roleInterests.map((t) => t.value).join(",")}
                    />
                    <ReactSelect
                      classNamePrefix="custom-react-select"
                      className="mt-1"
                      placeholder="What roles interest you?"
                      options={ROLE_INTERESTS}
                      isMulti
                      onChange={updateTags("roleInterests")}
                    />
                  </div>
                  <div className="pt-10">
                    <label className="text-sm flex gap-2 text-light-type-medium">
                      <input type="checkbox" name="joinDiscord" />
                      Join the Open-Source Hub Discord server
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-16 flex justify-end gap-6">
                <ButtonLink to={getProfileRouteForUser(user)}>
                  Cancel
                </ButtonLink>
                <Button variant="brand">Save</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Welcome;
