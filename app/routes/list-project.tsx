import { Octokit } from "@octokit/rest";
import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { FC, useState } from "react";
import ReactSelect, { MultiValue } from "react-select";
import Button from "~/components/Button";
import TextArea from "~/components/TextArea";
import TextField from "~/components/TextField";
import { getRepoOwnerAndName } from "~/utils/repo-url";
import {
  ROLE_INTERESTS,
  SUBJECT_INTERESTS,
  TECH_INTERESTS,
} from "~/utils/tags";
import formStyles from "~/styles/forms.css";
import TwitterIcon from "~/components/icons/TwitterIcon";
import { LinkIcon, MarkGithubIcon } from "@primer/octicons-react";
import { getTemplateContent, ProjectTemplateFields } from "~/utils/template";
import { getAccessToken, getCurrentUser } from "~/session.server";

export function links() {
  return [{ rel: "stylesheet", href: formStyles }];
}

export const action: ActionFunction = async ({ request }) => {
  const currentUser = await getCurrentUser(request);
  const accessToken = await getAccessToken(request);

  if (!currentUser || !accessToken) {
    throw new Error("You must be logged in to save your profile");
  }

  // TODO validation
  const formData = await request.formData();

  // Required fields
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const maintainer = currentUser.githubLogin;
  const repoUrl = formData.get("repoUrl")?.toString();

  if (!name || !description || !repoUrl) {
    throw new Error("Invalid payload");
  }

  if (!repoUrl) {
    throw new Error("Missing repository URL");
  }

  const octokit = new Octokit({
    auth: accessToken,
  });

  const { owner: repoOwner, name: repoName } = getRepoOwnerAndName(repoUrl);

  const contributionOverview: ProjectTemplateFields["contributionOverview"] = {
    automatedDevEnvironment: formData
      .get("automatedDevEnvironment")
      ?.toString(),
    idealEffort: formData.get("idealEffort")?.toString(),
    isMentorshipAvailable: !!formData.get("isMentorshipAvailable"),
    mainLocation: formData.get("mainLocation")?.toString(),
  };

  const mdxContent = await getTemplateContent({
    name,
    repoUrl,
    description,
    maintainer,
    created: new Date().toISOString(),

    // avatar: formData.get("avatar")?.toString(),
    contributing: formData.get("contributing")?.toString(),
    overview: formData.get("overview")?.toString(),
    contributionOverview,
    currentlySeeking: formData.get("currentlySeeking")?.toString().split(","),
    languages: formData.get("languages")?.toString().split(","),
    tags: formData.get("tags")?.toString().split(","),
    // featuredMap: {
    //   url: "https://app.codesee.io/maps/public/12345",
    //   description: "Map of our microservices",
    // },
    // learnLinks: [
    //   {
    //     title: "Learn React",
    //     url: "https://learn-react.com",
    //   },
    //   {
    //     title: "What is JSX?",
    //     url: "https://google.com/?q=what+is+jsx",
    //   },
    // ],
    // maps: [
    //   {
    //     url: "https://app.codesee.io/maps/public/12345",
    //     description: "Stuff and things",
    //     subTitle: "A subtitle goes here",
    //   },
    //   {
    //     url: "https://app.codesee.io/maps/public/67890",
    //     description: "Things and stuff",
    //   },
    // ],
    twitterUrl: formData.get("twitterUrl")?.toString(),
    websiteUrl: formData.get("websiteUrl")?.toString(),
  });

  return json({ result: "you did it you big nerd" });

  // Check whether we already have a project for this repository
  try {
    await octokit.request("GET /repos/{owner}/{repo}/contents/{path}", {
      owner: "Codesee-io",
      repo: "opensourcehub",
      path: `public/projects/${repoOwner}/${repoName}.mdx`,
      ref: "main",
    });
  } catch (e) {
    if ((e as any).status !== 404) {
      throw e;
    }
    // File did not exist, we'll fall through and create it
  }

  // Create a new pull request
  const branchName = `project/${repoOwner}/${repoName}-${Date.now()}`;

  // https://docs.github.com/en/rest/git/refs
  // Get a reference to the last commit on the `main` branch of OSH
  const { data: mainRef } = await octokit.request(
    "GET /repos/{owner}/{repo}/git/ref/{ref}",
    {
      owner: "Codesee-io",
      repo: "opensourcehub",
      ref: `heads/main`,
    }
  );

  try {
    console.log(`Creating branch ${branchName}`);
    await octokit.request("POST /repos/{owner}/{repo}/git/refs", {
      owner: "Codesee-io",
      repo: "opensourcehub",
      ref: `refs/heads/${branchName}`,
      sha: mainRef.object.sha,
    });
  } catch (error) {
    return json({
      error:
        "Unable to create a branch for your content. Is your project already listed?",
    });
  }

  try {
    await octokit.request("PUT /repos/{owner}/{repo}/contents/{path}", {
      owner: "Codesee-io",
      repo: "opensourcehub",
      path: `public/projects/${repoOwner}/${repoName}-${Date.now()}.mdx`,
      message: `Add the ${repoName} project`,
      content: mdxContent,
      branch: branchName,
      // sha: newRef.object.sha // Required to push additional changes to a PR
    });
  } catch (error) {
    return json({
      error:
        "Unable to create a file for your content. Is your project already listed?",
    });
  }

  const { data: createPRData } = await octokit.request(
    "POST /repos/{owner}/{repo}/pulls",
    {
      owner: "Codesee-io",
      repo: "opensourcehub",
      title: `[project] Add ${repoOwner}/${repoName}`,
      head: branchName,
      base: "main",
      body: `Adding a new project to Open Source Hub`,
      maintainer_can_modify: true,
    }
  );

  return json({
    pullRequestUrl: createPRData.html_url,
  });
};

type TagsState = {
  languages: MultiValue<{ label: string; value: string }>;
  currentlySeeking: MultiValue<{ label: string; value: string }>;
  tags: MultiValue<{ label: string; value: string }>;
};

const ListProject: FC = () => {
  const actionData = useActionData();
  console.log(actionData);

  const [tags, setTags] = useState<TagsState>({
    languages: [],
    currentlySeeking: [],
    tags: [],
  });

  const updateTags =
    (key: keyof TagsState) =>
    (updatedTags: MultiValue<{ label: string; value: string }>) => {
      setTags({ ...tags, [key]: updatedTags });
    };

  return (
    <div>
      <main className="max-w-6xl mx-auto pt-12 px-2 pb-24">
        <h1 className="text-light-type text-2xl font-semibold mb-8">
          List your project
        </h1>
        <Form action="/list-project" method="post">
          <div className="px-4 mb-8 space-y-4">
            <div>
              <TextField id="name" label="Project name" required />
            </div>
            <div>
              <TextField
                id="repoUrl"
                label={
                  <>
                    <MarkGithubIcon className="w-4 h-4 mr-1" /> GitHub
                    repository
                  </>
                }
                defaultValue="https://github.com/Codesee-io/opensourcehub"
                required
              />
            </div>
            <div>
              <TextField id="description" label="Description" required />
            </div>
            <div className="flex gap-4">
              <div className="grow">
                <TextField
                  type="url"
                  label={
                    <>
                      <LinkIcon className="w-4 h-4 mr-1" /> Website URL
                    </>
                  }
                  id="websiteUrl"
                />
              </div>
              <div className="grow">
                <TextField
                  type="url"
                  label={
                    <>
                      <TwitterIcon className="w-4 h-4 mr-1" /> Twitter URL
                    </>
                  }
                  id="twitterUrl"
                />
              </div>
            </div>
          </div>

          <div className="md:flex gap-6 bg-white border border-light-border p-4 rounded-lg mb-8">
            <div className="mb-6 md:mb-0 flex-auto md:w-2/3">
              <h2 className="font-bold text-lg mb-4">Taxonomy</h2>
              <div className="space-y-4">
                <div className="h-20">
                  <label className="input-label">Tech focus</label>
                  <input
                    type="hidden"
                    name="languages"
                    value={tags.languages.map((t) => t.value).join(",")}
                  />
                  <ReactSelect
                    classNamePrefix="custom-react-select"
                    className="mt-1"
                    placeholder="What technologies does your project cover?"
                    options={TECH_INTERESTS}
                    isMulti
                    onChange={updateTags("languages")}
                  />
                </div>
                <div className="h-20">
                  <label className="input-label">Contributor roles</label>
                  <input
                    type="hidden"
                    name="currentlySeeking"
                    value={tags.currentlySeeking.map((t) => t.value).join(",")}
                  />
                  <ReactSelect
                    classNamePrefix="custom-react-select"
                    className="mt-1"
                    placeholder="What kind of contributors are you looking for?"
                    options={ROLE_INTERESTS}
                    isMulti
                    onChange={updateTags("currentlySeeking")}
                  />
                </div>
                <div className="h-20">
                  <label className="input-label">Subjects</label>
                  <input
                    type="hidden"
                    name="tags"
                    value={tags.tags.map((t) => t.value).join(",")}
                  />
                  <ReactSelect
                    classNamePrefix="custom-react-select"
                    className="mt-1"
                    placeholder="What is your project about?"
                    options={SUBJECT_INTERESTS}
                    isMulti
                    onChange={updateTags("tags")}
                  />
                </div>
              </div>
            </div>
            <div className="flex-auto md:w-1/3">
              <h2 className="font-bold text-lg mb-4">Contribution overview</h2>
              <div className="space-y-4">
                <div className="h-20">
                  <TextField
                    id="automatedDevEnvironment"
                    label="Automated dev environment"
                    placeholder="gitpod.io"
                  />
                </div>
                <div className="h-20">
                  <TextField
                    id="mainLocation"
                    label="Maintainer location"
                    placeholder="Africa"
                  />
                </div>
                <div className="h-20">
                  <TextField
                    id="idealEffort"
                    label="Ideal contributor effort"
                    placeholder="1 PR per month"
                  />
                </div>
                <div className="pb-4">
                  <label className="text-sm flex gap-2 text-light-type-medium font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      name="isMentorshipAvailable"
                      className="cursor-pointer"
                    />
                    Mentorship is available
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className=" bg-white border border-light-border p-4 rounded-lg mb-6">
            <h2 className="font-bold text-lg mb-4">Content</h2>
            <div className="mb-4">
              <TextArea
                id="overview"
                label="Overview"
                style={{ minHeight: 200 }}
                placeholder="What is your project about? What does it do?"
              />
            </div>
            <div className="mb-4">
              <TextArea
                id="contributing"
                label="Contributing"
                style={{ minHeight: 200 }}
                placeholder="Explain how contributors can onboarding most efficiently."
              />
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border border-light-border p-4 rounded-lg flex gap-4 items-center shadow-lg">
            <Button variant="brand">Submit</Button>
            <Button type="button">Preview</Button>
            <span className="text-light-type-medium text-sm">
              ← Preview your project before submitting it 👀
            </span>
          </div>
        </Form>
      </main>
    </div>
  );
};

export default ListProject;
