import { FC, useState } from "react";
import ReactSelect, { MultiValue } from "react-select";
import {
  getTag,
  ROLE_INTERESTS,
  SUBJECT_INTERESTS,
  TECH_INTERESTS,
} from "~/utils/tags";
import formStyles from "~/styles/forms.css";
import { json, LoaderFunction } from "@remix-run/node";
import { getCurrentUserOrRedirect } from "~/session.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getProfileRouteForUser } from "~/utils/routes";
import Button from "~/components/Button";
import CloseIcon from "~/components/icons/CloseIcon";
import TextField from "~/components/TextField";
import { UserProfile } from "~/types";
import { getUserProfileBySlug } from "~/database.server";
import TwitterIcon from "~/components/icons/TwitterIcon";
import LinkedInIcon from "~/components/icons/LinkedInIcon";
import TextArea from "~/components/TextArea";

export function links() {
  return [{ rel: "stylesheet", href: formStyles }];
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const currentUser = await getCurrentUserOrRedirect(request);

  const slug = params.slug as string;

  // If the profile is undefined, the parent route will throw a 404
  const profile = (await getUserProfileBySlug(slug)) as UserProfile;

  const payload: LoaderData = {
    profile,
    profileRoute: getProfileRouteForUser(currentUser),
  };

  return json(payload);
};

type LoaderData = {
  profileRoute: string;
  profile: UserProfile;
};

type TagsState = {
  techInterests: MultiValue<{ label: string; value: string }>;
  roleInterests: MultiValue<{ label: string; value: string }>;
  subjectInterests: MultiValue<{ label: string; value: string }>;
};

const Edit: FC = () => {
  const { profileRoute, profile } = useLoaderData<LoaderData>();

  const [tags, setTags] = useState<TagsState>({
    techInterests: (profile.techInterests ?? [])
      .map((i) => getTag("techInterests", i))
      .map((t) => ({ label: t.label, value: t.id })),
    roleInterests: (profile.roleInterests ?? [])
      .map((i) => getTag("roleInterests", i))
      .map((t) => ({ label: t.label, value: t.id })),
    subjectInterests: (profile.subjectInterests ?? [])
      .map((i) => getTag("subjectInterests", i))
      .map((t) => ({ label: t.label, value: t.id })),
  });

  const updateTags =
    (key: keyof TagsState) =>
    (updatedTags: MultiValue<{ label: string; value: string }>) => {
      setTags({ ...tags, [key]: updatedTags });
    };

  return (
    <section className="fixed inset-0 z-50 bg-light-background-shaded bg-opacity-75 overflow-auto">
      <div className="py-8 px-4 flex items-center justify-center min-h-screen">
        <div className="bg-white max-w-2xl mx-auto rounded-lg border p-8 w-full relative">
          <h1 className="font-semibold text-2xl mb-4 text-light-type">
            Edit your profile
          </h1>
          <Link to={profileRoute} className="absolute top-6 right-6 p-2">
            <CloseIcon />
          </Link>
          <div>
            <Form method="post" action="/u/github/update-profile">
              <div className="space-y-4">
                <div>
                  <TextArea
                    label="Introduction"
                    defaultValue={profile.intro}
                    id="intro"
                    autoFocus
                    style={{ minHeight: 120 }}
                  />
                </div>
                <div className="h-20">
                  <TextField
                    label="Display name"
                    id="displayName"
                    defaultValue={profile.displayName}
                    required
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
                    defaultValue={profile.twitterUrl}
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
                    defaultValue={profile.linkedinUrl}
                  />
                </div>
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
                    value={tags.techInterests}
                  />
                </div>
                <div className="h-20">
                  <label className="input-label">
                    Subject matter interests
                  </label>
                  <input
                    type="hidden"
                    name="subjectInterests"
                    value={tags.subjectInterests.map((t) => t.value).join(",")}
                  />
                  <ReactSelect
                    classNamePrefix="custom-react-select"
                    className="mt-1"
                    placeholder="What subjects are you interested in?"
                    options={SUBJECT_INTERESTS}
                    isMulti
                    onChange={updateTags("subjectInterests")}
                    value={tags.subjectInterests}
                  />
                </div>
                <div className="h-20">
                  <label className="input-label">Contribution interests</label>
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
                    value={tags.roleInterests}
                  />
                </div>
              </div>
              <div className="mt-16 flex justify-end gap-6">
                <Link
                  to={profileRoute}
                  className="px-6 text-light-interactive hover:bg-light-interactive-fill rounded-lg font-semibold flex items-center justify-center"
                >
                  Cancel
                </Link>
                <Button>Save changes</Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Edit;
