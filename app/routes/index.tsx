import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useMemo, useState } from "react";
import GhostContentAPI, { PostOrPage } from "@tryghost/content-api";

import type { GitHubData, Project, ProjectCategory } from "~/types";
import {
  HOW_TO_LIST_PROJECT_LINK,
  LINK_FORMATS,
  // SIGNUP_LINK,
} from "../utils/constants";
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
import CallToAction from "~/components/CallToAction";
import Wave from "~/images/Wave";

import selectStyles from "~/styles/select.css";
import gradientStyles from "~/styles/gradient.css";
import headerStyles from "~/styles/header.css";
import projectsStyles from "~/styles/projects-list.css";

export function links() {
  return [
    { rel: "stylesheet", href: selectStyles },
    { rel: "stylesheet", href: gradientStyles },
    { rel: "stylesheet", href: headerStyles },
    { rel: "stylesheet", href: projectsStyles },
  ];
}

export const meta: MetaFunction = () => ({
  title: "Open-Source Hub | Find open-source projects",
});

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
      version: "v5.0", // v5.0 is correct, but Ghost borked their own versions
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
    allLanguages,
    allTags,
    allSeeking,
    githubData,
    blogPosts,
  };

  return json(payload);
};

type LoaderData = {
  projects: Project[];
  searchIndex: any;
  helpfulness: any;
  allLanguages: ProjectCategory[];
  allTags: ProjectCategory[];
  allSeeking: ProjectCategory[];
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

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  const tags = useMemo(() => {
    return {
      allLanguages: allLanguages.map((lang) => lang.fieldValue).sort(),
      allTags: allTags.map((lang) => lang.fieldValue).sort(),
      allSeeking: allSeeking.map((lang) => lang.fieldValue).sort(),
    };
  }, [allLanguages, allSeeking, allTags]);

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
          <CallToAction
            href={HOW_TO_LIST_PROJECT_LINK}
            rel="noopener"
            target="_blank"
            format={LINK_FORMATS.primary}
            inverse={true}
          >
            List Your Project
          </CallToAction>
          {/* Temporarily hide */}
          {/* <CallToAction
            href={isLoggedIn ? HOW_TO_LIST_PROJECT_LINK : SIGNUP_LINK}
            rel="noopener"
            target="_blank"
            format={LINK_FORMATS.secondary}
            inverse={true}
            className="ml-5"
          >
            Contribute to a project
          </CallToAction> */}
        </div>

        <div className="header-wave mt-12">
          <Wave />
        </div>
      </div>

      {blogPosts.length > 0 && (
        <div className="mx-auto mb-20" style={{ maxWidth: 1600 }}>
          <div className="filters-wrapper">
            <h1 className="w-full font-bold text-left">Blog Posts</h1>
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
            <h1 className="font-bold mr-2">All Projects</h1>
            <ToggleFiltersButton onClick={() => setShowSidebar(true)} />
          </div>
          <div className="w-full md:w-56 mt-3 md:mt-0">
            <ProjectSort />
          </div>
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
            allLanguages={tags.allLanguages}
            allTags={tags.allTags}
            allSeeking={tags.allSeeking}
          />
        </div>
      </SearchWrapper>
    </>
  );
}
