import type {
  HeadersFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import GhostContentAPI, { PostOrPage } from "@tryghost/content-api";

import type { GitHubData, Project } from "~/types";
import {
  generateSearchIndex,
  getProjects,
  getProjectsMetadata,
} from "~/projects.server";
import { getGitHubData } from "~/github.server";
import SearchWrapper from "~/components/local-search/SearchWrapper";
import BlogList from "~/components/BlogList";
import ProjectList from "~/components/ProjectList";
import SearchInput from "~/components/local-search/SearchInput";
import SidebarWithFilters from "~/components/SidebarWithFilters";
import ToggleFiltersButton from "~/components/ToggleFiltersButton";
import ProjectSort from "~/components/ProjectSort";
import Wave from "~/images/Wave";

import gradientStyles from "~/styles/gradient.css";
import headerStyles from "~/styles/header.css";
import projectsStyles from "~/styles/projects-list.css";
import ButtonLink from "~/components/ButtonLink";
import BackToTopButton from "~/components/BackToTopButton";

export function links() {
  return [
    { rel: "stylesheet", href: gradientStyles },
    { rel: "stylesheet", href: headerStyles },
    { rel: "stylesheet", href: projectsStyles },
  ];
}

export const meta: MetaFunction = () => ({
  title: "Open-Source Hub | Find open-source projects",
});

export let headers: HeadersFunction = () => {
  return {
    "Cache-Control": "public, s-maxage=60",
  };
};

export const loader: LoaderFunction = async () => {
  const projects = getProjects();

  const searchIndex = generateSearchIndex();

  const helpfulness = projects.reduce((prev, current) => {
    return { ...prev, [current.slug]: 0 };
  }, {});

  const { allLanguages, allTags, allSeeking } = getProjectsMetadata();
  const githubData = getGitHubData();

  let blogPosts: PostOrPage[] = [];
  if (process.env.GHOST_API_URL && process.env.GHOST_API_KEY) {
    const api = new GhostContentAPI({
      url: process.env.GHOST_API_URL,
      key: process.env.GHOST_API_KEY,
      version: "v5.0",
    });

    // By default, the Ghost Content API returns posts in reverse chronological
    // order by published date Fetch 3 most recent posts, including their
    // authors' information. We only include posts tagged "Community".
    try {
      blogPosts = await api.posts.browse({
        filter: "tag:community",
        limit: 3,
        include: ["authors"],
      });
    } catch (error) {
      blogPosts = [];
    }
  }

  const payload: LoaderData = {
    projects,
    searchIndex,
    helpfulness,
    allLanguages: allLanguages.map((lang) => lang.fieldValue).sort(),
    allTags: allTags.map((lang) => lang.fieldValue).sort(),
    allSeeking: allSeeking.map((lang) => lang.fieldValue).sort(),
    githubData,
    blogPosts,
  };

  return json(payload, {
    headers: {
      "Cache-Control": "public, s-maxage=60",
    },
  });
};

type LoaderData = {
  projects: Project[];
  searchIndex: any;
  helpfulness: any;
  allLanguages: string[];
  allTags: string[];
  allSeeking: string[];
  githubData: { [key: string]: GitHubData };
  blogPosts: PostOrPage[];
};

export default function Index() {
  const {
    projects,
    searchIndex,
    helpfulness,
    allLanguages,
    allTags,
    allSeeking,
    githubData,
    blogPosts,
  } = useLoaderData<LoaderData>();

  const [showSidebar, setShowSidebar] = useState(false);
  // The githubDataSet can be empty when users don't fetch data from GitHub, so
  // we guard against that scenario here.
  const githubDataIsEmpty = Object.keys(githubData).length === 0;

  return (
    <>
      <div className="bg-gradient mx-auto pt-12 md:pt-24 mb-12">
        <h1 className="text-yellow-300 font-semibold text-3xl lg:text-4xl text-center mb-4">
          Connecting People and Projects
        </h1>
        <p className="text-white text-center max-w-xl mx-auto mb-6 mt-2 px-2">
          Your next project is waiting to be discovered. Connect with devs
          across the globe, contribute to open source, and learn something new.
        </p>

        <div className="flex items-center justify-center text-center px-2 mt-3">
          <ButtonLink to="/contribute">List Your Project</ButtonLink>
        </div>

        <div className="header-wave mt-12">
          <Wave role="img" />
        </div>
      </div>

      {blogPosts.length > 0 && (
        <div className="mx-auto mb-20" style={{ maxWidth: 1600 }}>
          <div className="filters-wrapper">
            <h2 className="w-full font-bold text-left">Blog Posts</h2>
          </div>
          <BlogList blogPosts={blogPosts} />
        </div>
      )}

      <SearchWrapper searchIndex={searchIndex} allProjects={projects}>
        <div className="max-w-5xl space-x-4 flex justify-center mx-auto px-2 mb-4">
          <SearchInput />
        </div>
        <div className="filters-wrapper">
          <div className="flex items-center">
            <h2 className="font-bold mr-2">All Projects</h2>
            <ToggleFiltersButton onClick={() => setShowSidebar(true)} />
          </div>
          {githubDataIsEmpty ? (
            <span
              className="text-light-type-medium text-sm"
              title="Unable to sort projects because no GitHub data is available"
            >
              Sorting disabled
            </span>
          ) : (
            <div className="w-full md:w-56 mt-3 md:mt-0">
              <ProjectSort />
            </div>
          )}
        </div>
        <div className="mx-auto mb-32" style={{ maxWidth: 1600 }}>
          <ProjectList
            allProjects={projects}
            githubDataSet={githubData}
            helpfulnessDataSet={helpfulness}
          />
          <SidebarWithFilters
            showSidebar={showSidebar}
            setShowSidebar={setShowSidebar}
            allLanguages={allLanguages}
            allTags={allTags}
            allSeeking={allSeeking}
          />
        </div>
      </SearchWrapper>
      <BackToTopButton />
    </>
  );
}
