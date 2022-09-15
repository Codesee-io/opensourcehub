import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FC } from "react";
import ExternalLink from "~/components/ExternalLink";
import ProjectCard from "~/components/ProjectCard";
import { getGitHubDataForProject } from "~/github.server";
import { getProject } from "~/projects.server";
import { GitHubData, Project } from "~/types";
import {
  DISCORD_LINK,
  HOW_TO_LIST_PROJECT_LINK,
  REPO_LINK,
} from "~/utils/constants";

const EXAMPLE_PROJECTS = ["thamara/time-to-leave", "akshat157/meditate-app"];

export const loader: LoaderFunction = async () => {
  const exampleProjects = EXAMPLE_PROJECTS.map((slug) =>
    getProject(slug)
  ).filter((x) => !!x) as Project[];

  const githubData: { [slug: string]: GitHubData } = {};

  exampleProjects.forEach((project) => {
    githubData[project.slug] = getGitHubDataForProject(project.slug);
  });

  return json({
    exampleProjects,
    githubData,
  });
};

type LoaderData = {
  exampleProjects: Project[];
  githubData: { [slug: string]: GitHubData };
};

const Contribute: FC = () => {
  const { exampleProjects, githubData } = useLoaderData<LoaderData>();

  return (
    <main className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-semibold leading-large mb-6">
        How to list your project
      </h1>
      <div className="bg-white p-6 rounded-lg space-y-2 border border-light-border">
        <p>
          Open Source Hub is a website where the maintainers of open-source
          projects can list their repositories and get the attention of
          potential contributors.
        </p>
        <p>
          To list your project, please{" "}
          <ExternalLink href={HOW_TO_LIST_PROJECT_LINK}>
            follow the steps in the README
          </ExternalLink>
          , and feel free to ask questions in{" "}
          <ExternalLink href={REPO_LINK}>GitHub</ExternalLink> or our{" "}
          <ExternalLink href={DISCORD_LINK}>Discord server</ExternalLink>.
        </p>
      </div>
      <h2 className="mt-8 text-xl font-semibold leading-large mb-4">
        Project inspiration
      </h2>
      <div className="flex flex-col md:flex-row gap-4">
        {exampleProjects.map((project) => (
          <ProjectCard
            project={project}
            key={project.slug}
            githubData={githubData[project.slug]}
          />
        ))}
      </div>
    </main>
  );
};

export default Contribute;
