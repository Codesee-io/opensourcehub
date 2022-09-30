import type { FC } from "react";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useCatch, Link } from "@remix-run/react";

import { getProject } from "~/projects.server";
import type { CodeSeeMapMetadata, GitHubData, Project } from "~/types";
import { getGitHubDataForProject } from "~/github.server";
import markdownStyles from "~/styles/markdown.css";
import { getCodeSeeMapMetadata } from "~/codesee.server";
import ProjectTemplate from "~/components/ProjectTemplate";

export function links() {
  return [{ rel: "stylesheet", href: markdownStyles }];
}

export const loader: LoaderFunction = async ({ params }) => {
  const { projectOwner, project: projectName } = params;

  const slug = `${projectOwner}/${projectName}`.toLowerCase();
  const project = getProject(slug);
  const githubData = getGitHubDataForProject(slug);

  let featuredMapMetadata: CodeSeeMapMetadata | undefined;
  if (project?.attributes.featuredMap?.url) {
    // Grab the map's metadata
    featuredMapMetadata = await getCodeSeeMapMetadata(
      project.attributes.featuredMap.url
    );
  }

  // If we couldn't find a matching project, throw a 404
  // https://remix.run/docs/en/v1/guides/not-found
  if (!project) {
    throw new Response("Not Found", {
      status: 404,
    });
  }

  return json({ githubData, project, featuredMapMetadata });
};

export const meta: MetaFunction = ({ data }) => {
  if (data?.project?.attributes?.name) {
    const project = data.project as Project;
    return {
      title: `Open Source Hub | ${project.attributes.name}`,
      "og:title": project.attributes.name,
      "og:description": project.attributes.description,
    };
  }

  return {
    title: `Open Source Hub | 404`,
  };
};

type LoaderData = {
  project: Project;
  githubData: GitHubData;
  featuredMapMetadata: CodeSeeMapMetadata;
};

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return (
      <main className="max-w-xl mx-auto p-4 py-16">
        <h2 className="font-semibold text-2xl mb-2 text-black-500">
          There is no project here <span role="img">🙀</span>
        </h2>
        <p className="text-black-400 mb-4">
          Maybe the URL is incorrect or the project you're looking for was taken
          down. There are plenty more projects to check out, though!
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
      <p className="text-black-400 mb-4">Something went terribly wrong</p>
      <p>
        <Link to="/" className="link">
          Go home
        </Link>
      </p>
    </main>
  );
}

const ProjectPage: FC = () => {
  const { project, githubData, featuredMapMetadata } =
    useLoaderData<LoaderData>();

  return (
    <ProjectTemplate
      project={project}
      githubData={githubData}
      featuredMapMetadata={featuredMapMetadata}
    />
  );
};

export default ProjectPage;
