import { FC } from "react";
import { Link } from "@remix-run/react";
import { MarkGithubIcon, LinkIcon } from "@primer/octicons-react";
import Tag from "./Tag";
import { GitHubData, Project } from "~/types";
import TwitterIcon from "./icons/TwitterIcon";
import ProjectAvatar from "./ProjectAvatar";
import MapIcon from "./icons/MapIcon";
import ProjectCardStats from "./ProjectCardStats";

type Props = {
  project: Project;
  githubData?: GitHubData;
  activeTags?: string[];
};

const ProjectCard: FC<Props> = ({ project, githubData, activeTags = [] }) => {
  const { attributes, slug } = project;

  return (
    <div
      className="p-4 bg-white flex flex-col w-full rounded-lg"
      style={{ maxWidth: 400, border: "1px solid #d8d8d8" }}
    >
      {/* The container below should take up as much vertical space as possible
      so that the GitHub stats are vertically-aligned in a row even when the
      number of tag varies between projects. */}
      <div className="flex-grow">
        <div className="flex gap-4">
          {!!attributes.avatar && (
            <ProjectAvatar
              avatar={attributes.avatar}
              alt={attributes.name}
              size={48}
            />
          )}
          <div>
            <h3 className="font-semibold text-light-type text-xl">
              <Link
                to={"/" + slug}
                className="supports-hover:hover:text-light-interactive"
              >
                {attributes.name}
              </Link>
            </h3>
            <div className="flex space-x-2">
              <a
                href={attributes.repoUrl}
                target="_blank"
                title="Visit this repository"
                rel="noreferrer"
                className="flex text-light-type-medium supports-hover:hover:text-light-interactive p-1"
              >
                <MarkGithubIcon size={20} />
              </a>
              {attributes.featuredMap?.url && (
                <a
                  href={attributes.featuredMap.url}
                  target="_blank"
                  title={"View this project's CodeSee map"}
                  rel="noreferrer"
                  className="flex text-light-type-medium supports-hover:hover:text-light-interactive p-1"
                >
                  <MapIcon width={20} />
                </a>
              )}
              {attributes.websiteUrl && (
                <a
                  href={attributes.websiteUrl}
                  target="_blank"
                  title="Visit this project's website"
                  rel="noreferrer"
                  className="flex text-light-type-medium supports-hover:hover:text-light-interactive p-1"
                >
                  <LinkIcon size={20} />
                </a>
              )}
              {attributes.twitterUrl && (
                <a
                  href={attributes.twitterUrl}
                  target="_blank"
                  title="Visit this project's Twitter feed"
                  rel="noreferrer"
                  className="flex text-light-type-medium supports-hover:hover:text-light-interactive p-1"
                >
                  <TwitterIcon className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>
        {attributes.description && (
          <p
            className="text-sm text-light-type mt-2 overflow-hidden"
            style={{
              lineClamp: 3,
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              display: "-webkit-box",
              height: 60,
              maxHeight: 60,
              lineHeight: "20px",
            }}
          >
            {attributes.description}
          </p>
        )}
        <ProjectCardStats className="mt-4" stats={githubData} />
      </div>
      <div>
        <hr className="-ml-4 -mr-4 mt-2" style={{ borderColor: "#d8d8d8" }} />
        <div className="mt-4">
          <div>
            <span className="uppercase text-light-type-medium text-xs mr-6">
              Project type
            </span>
            {attributes.tags?.map((badge) => (
              <Tag
                tag={badge}
                key={badge}
                className="mr-2 mb-2"
                isActive={activeTags.includes(badge)}
              />
            ))}
          </div>
          <div>
            <span className="uppercase text-light-type-medium text-xs mr-6">
              Tech
            </span>
            {attributes.languages?.map((badge) => (
              <Tag
                tag={badge}
                key={badge}
                className="mr-2 mb-2"
                isActive={activeTags.includes(badge)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
