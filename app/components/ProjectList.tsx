import { FunctionComponent } from "react";
import { Project, GitHubData } from "../types";
import ProjectListWrapper from "./local-search/ProjectListWrapper";
import useSearch from "./local-search/useSearch";
import ProjectCard from "./ProjectCard";
import { ProjectSortOrder } from "~/utils/constants";

type Props = {
  allProjects: Project[];
  githubDataSet: { [key: string]: GitHubData };
  helpfulnessDataSet: { [slug: string]: number };
};

const ProjectList: FunctionComponent<Props> = ({
  allProjects,
  githubDataSet,
}) => {
  // The githubDataSet can be empty when users don't fetch data from GitHub, so
  // we guard against that scenario here.
  const dataSetIsEmpty = Object.keys(githubDataSet).length === 0;

  const {
    filteredProjectIds,
    filters: { tags, sortOption },
  } = useSearch();

  if (filteredProjectIds.length === 0) {
    return (
      <div className="text-center px-4 mt-24 mb-32 flex-grow">
        <h3 className="text-black-500 text-2xl font-semibold mb-4">
          No results
        </h3>
        <p className="text-black-300">
          No projects matched your search. Try adjusting your filters.
        </p>
      </div>
    );
  }

  const filteredProjects = allProjects.filter((project) =>
    filteredProjectIds.includes(project.slug)
  );

  if (!dataSetIsEmpty) {
    switch (sortOption) {
      case ProjectSortOrder.MostOpenIssues:
        // Sort projects by most open issues (highest count of opened issues)
        filteredProjects.sort((projectA, projectB) => {
          return (
            githubDataSet[projectB.slug].totalOpenIssues -
            githubDataSet[projectA.slug].totalOpenIssues
          );
        });
        break;
      case ProjectSortOrder.MostActive:
        // Sort projects by most active (highest count of recently-closed PRs)
        filteredProjects.sort((projectA, projectB) => {
          return (
            githubDataSet[projectB.slug].prsMerged.count -
            githubDataSet[projectA.slug].prsMerged.count
          );
        });
        break;
      case ProjectSortOrder.MostPopular:
        // Sort projects by most popularity (highest number of contributors)
        filteredProjects.sort((projectA, projectB) => {
          return (
            githubDataSet[projectB.slug].totalContributors -
            githubDataSet[projectA.slug].totalContributors
          );
        });
        break;
      case ProjectSortOrder.MostRecentlyAdded:
        // Sort projects by most popularity (highest number of contributors)
        filteredProjects.sort((projectA, projectB) => {
          return (
            new Date(projectB.attributes.created).getTime() -
            new Date(projectA.attributes.created).getTime()
          );
        });
        break;
    }
  }

  return (
    <ProjectListWrapper>
      {filteredProjects.map((project) => (
        <ProjectCard
          key={project.slug}
          project={project}
          githubData={githubDataSet[project.slug]}
          activeTags={tags}
        />
      ))}
    </ProjectListWrapper>
  );
};

export default ProjectList;
