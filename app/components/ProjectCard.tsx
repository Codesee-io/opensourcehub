import { FC } from "react";
import { Link } from "@remix-run/react";
import Tag from "./Tag";
import { GitHubData, Project } from "~/types";
import ProjectAvatar from "./ProjectAvatar";
import ProjectCardStats from "./ProjectCardStats";
import MapIcon from "./icons/MapIcon";

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
        <div className="flex gap-4 items-center">
          {!!attributes.avatar && (
            <ProjectAvatar
              avatar={attributes.avatar}
              alt={attributes.name}
              size={48}
            />
          )}

          <h3 className="font-semibold text-light-type text-xl">
            <Link
              to={"/" + slug}
              className="supports-hover:hover:text-light-interactive"
            >
              {attributes.name}
            </Link>
          </h3>
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
        {attributes.featuredMap && (
          <p className="flex gap-1 items-center text-sm text-light-type mt-2">
            <MapIcon className="w-4 h-4 text-light-interactive" />
            <span>Features a CodeSee Map</span>
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
                // isActive={activeTags.includes(badge)}
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
                // isActive={activeTags.includes(badge)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
