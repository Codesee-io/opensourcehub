import {
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { FileToUpload } from "~/github.server";
import { User } from "~/types";
import { maybeStringToArray } from "~/utils/formatting";
import { getRepoOwnerAndName, isValidGitHubRepoUrl } from "~/utils/repo-url";
import { getTemplateContent, ProjectTemplateFields } from "~/utils/template";
import { isValidPublicCodebaseMapUrl } from "./codesee";
import { getRepeatableFieldValues } from "./forms";

export const MAX_AVATAR_SIZE_BYTES = 1024 * 1024 * 0.1; // 0.1 MB

type ReturnShape = {
  validationErrors?: { [key: string]: string };
  files: FileToUpload[];
  repoUrl?: string;
};

export async function parseListProjectForm(
  request: Request,
  currentUser: User
): Promise<ReturnShape> {
  // Use an upload handler to parse the form because it may contain an avatar
  // Learn more: https://remix.run/docs/en/v1/api/remix#uploadhandler
  const uploadHandler = unstable_createMemoryUploadHandler({
    maxPartSize: MAX_AVATAR_SIZE_BYTES,
  });
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // Required fields
  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const maintainer = currentUser.githubLogin;
  const repoUrl = formData.get("repoUrl")?.toString();

  const validationErrors: { [key: string]: string } = {};

  // Validate the required fields and return an object if there's any issue
  if (!name || !description || !repoUrl) {
    if (!name) {
      validationErrors.name = "Please give your project a name";
    }
    if (!description) {
      validationErrors.description =
        "Please describe your project in a few words";
    }
    if (!repoUrl) {
      validationErrors.repoUrl = "Please provide a GitHub repository URL";
    }

    return { validationErrors, files: [] };
  }

  // Exit early if the repoUrl is invalid
  if (!isValidGitHubRepoUrl(repoUrl)) {
    validationErrors.repoUrl = "Please provide a valid GitHub repository URL";
    return { validationErrors, files: [] };
  }

  const { name: repoName } = getRepoOwnerAndName(repoUrl);

  // Format a bunch of data from the form
  const contributionOverview: ProjectTemplateFields["contributionOverview"] = {
    automatedDevEnvironment: formData
      .get("automatedDevEnvironment")
      ?.toString(),
    idealEffort: formData.get("idealEffort")?.toString(),
    isMentorshipAvailable: !!formData.get("isMentorshipAvailable"),
    mainLocation: formData.get("mainLocation")?.toString(),
  };

  const avatarFile = formData.get("avatar") as File | null;
  let avatarFileName;
  if (avatarFile?.size) {
    const extension = avatarFile.name.split(".").pop();
    avatarFileName = `${repoName}.${extension}`;
  }

  const reviewMapUrls = getRepeatableFieldValues("reviewMapUrls", formData);

  let featuredMap: ProjectTemplateFields["featuredMap"];
  const featuredMapUrl = formData.get("featuredMapUrl")?.toString();
  const featuredMapDescription = formData
    .get("featuredMapDescription")
    ?.toString();
  if (featuredMapUrl) {
    // Validate the codebase map url
    if (isValidPublicCodebaseMapUrl(featuredMapUrl)) {
      featuredMap = {
        url: featuredMapUrl,
        description: featuredMapDescription,
      };
    } else {
      validationErrors.featuredMapUrl = "Please provide a valid public map URL";
    }
  }

  const contributing = formData.get("contributing")?.toString();
  const overview = formData.get("overview")?.toString();
  if (!contributing || contributing.length <= 0) {
    validationErrors.contributing = "Please fill out this field";
  }
  if (!overview || overview.length <= 0) {
    validationErrors.overview = "Please fill out this field";
  }

  const currentlySeeking = maybeStringToArray(
    formData.get("currentlySeeking")?.toString()
  );
  const languages = maybeStringToArray(formData.get("languages")?.toString());
  const tags = maybeStringToArray(formData.get("tags")?.toString());
  if (currentlySeeking.length === 0) {
    validationErrors.currentlySeeking = "Please choose at least one option";
  }
  if (languages.length === 0) {
    validationErrors.languages = "Please choose at least one option";
  }
  if (tags.length === 0) {
    validationErrors.tags = "Please choose at least one option";
  }

  // If there are any validation errors, return them
  if (Object.values(validationErrors).some(Boolean)) {
    return { validationErrors, files: [] };
  }

  // Generate a project YAML file that we'll upload to GitHub
  const mdxContent = getTemplateContent({
    // Required fields
    name,
    repoUrl,
    description,
    maintainer,
    created: new Date().toISOString(),

    // Optional fields
    avatar: avatarFileName,
    contributing,
    overview,
    contributionOverview,
    currentlySeeking: maybeStringToArray(
      formData.get("currentlySeeking")?.toString()
    ),
    languages: maybeStringToArray(formData.get("languages")?.toString()),
    tags: maybeStringToArray(formData.get("tags")?.toString()),
    featuredMap,
    reviewMapUrls,
    twitterUrl: formData.get("twitterUrl")?.toString(),
    websiteUrl: formData.get("websiteUrl")?.toString(),
  });

  const files: FileToUpload[] = [
    {
      content: mdxContent,
      filePath: `${repoName}.mdx`,
      encoding: "utf-8",
    },
  ];

  // If there's an avatar, upload it as a base-64 string so that GitHub knows
  // what to do
  if (avatarFile && avatarFileName) {
    const avatarBuffer = await avatarFile.arrayBuffer();
    files.push({
      content: Buffer.from(avatarBuffer).toString("base64"),
      filePath: avatarFileName,
      encoding: "base64",
    });
  }

  return { files, repoUrl };
}
