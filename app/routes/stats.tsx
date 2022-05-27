import type { FC } from "react";
import type {
  MetaFunction,
  LoaderFunction,
  HeadersFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { getProjects, getProjectsMetadata } from "../projects.server";
import type { Project, ProjectCategory } from "../types";

export const meta: MetaFunction = () => ({
  title: "Stats | Open-Source Hub",
});

export const headers: HeadersFunction = () => {
  return {
    // We don't want search engines to index this page
    "X-Robots-Tag": "noindex",
  };
};

export const loader: LoaderFunction = async () => {
  const allProjects = getProjects();

  const { allLanguages, allTags, allSeeking } = getProjectsMetadata();

  const allMaintainers = Array.from(
    new Set(allProjects.map((project) => project.attributes.maintainer))
  );

  const data: LoaderData = {
    allProjects,
    allLanguages,
    allTags,
    allSeeking,
    allMaintainers,
  };

  return json(data);
};

type LoaderData = {
  allProjects: Project[];
  allLanguages: ProjectCategory[];
  allTags: ProjectCategory[];
  allSeeking: ProjectCategory[];
  allMaintainers: string[];
};

const StatsPage: FC = () => {
  const { allLanguages, allTags, allProjects, allMaintainers } =
    useLoaderData<LoaderData>();
  const firstTimerFriendlyTag = allTags.find(
    (tag) => tag.fieldValue === "First Timer Friendly"
  );
  const numFirstTimerFriendlyIssues = firstTimerFriendlyTag?.totalCount || 0;
  const numLanguages = allLanguages.length;
  const numProjects = allProjects.length;

  const sortedLanguages = allLanguages
    .sort((a, b) => Math.sign(b.totalCount - a.totalCount))
    .slice(0, 5);

  const sortedTags = allTags
    .sort((a, b) => Math.sign(b.totalCount - a.totalCount))
    .slice(0, 5);

  const numMaps = allProjects.filter(
    (project) => project.attributes.featuredMap != null
  ).length;
  const percentMaps = ((numMaps / numProjects) * 100).toFixed();

  return (
    <main className="py-12 md:py-20 px-4 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold leading-relaxed text-center mt-4 mb-8">
        Stats and trends
      </h1>
      <h2 className="text-xl text-black-500 font-bold mb-2">
        Raw project stats
      </h2>
      <ul className="list-disc list-inside mb-12">
        <li>
          {numProjects} projects listed by {allMaintainers.length} maintainers
        </li>
        <li>{numFirstTimerFriendlyIssues} 'First Timer Friendly' projects</li>
        <li>{numLanguages} languages and frameworks represented</li>
        <li>
          {numMaps} projects feature a CodeSee map! That's {percentMaps}% of
          them 🎉
        </li>
      </ul>
      <h2 className="text-xl text-black-500 font-bold mb-2">Trends</h2>
      <div className="space-y-1 mb-4">
        <p>The 5 most frequent languages and frameworks are:</p>
        <ol className="list-decimal list-inside">
          {sortedLanguages.map((lang) => (
            <li key={lang.fieldValue}>{lang.fieldValue}</li>
          ))}
        </ol>
      </div>
      <div className="space-y-1 mb-16">
        <p>The 5 most frequent tags are:</p>
        <ol className="list-decimal list-inside">
          {sortedTags.map((lang) => (
            <li key={lang.fieldValue}>{lang.fieldValue}</li>
          ))}
        </ol>
      </div>
    </main>
  );
};

export default StatsPage;
