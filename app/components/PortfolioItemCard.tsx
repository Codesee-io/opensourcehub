import { Link } from "@remix-run/react";
import dayjs from "dayjs";
import { FC } from "react";
import { PortfolioItem, Project } from "~/types";
import { getReviewMapUrlFromPullRequestUrl } from "~/utils/codesee";
import EditIcon from "./icons/EditIcon";
import Tag from "./Tag";

type Props = {
  canEdit: boolean;
  portfolioItem: PortfolioItem;
  editRoute?: string;
  project?: Project;
};

const PortfolioItemCard: FC<Props> = (props) => {
  const reviewMapUrl = getReviewMapUrlFromPullRequestUrl(
    props.portfolioItem.pullRequestUrl
  );
  return (
    <article className="flex gap-4 w-full">
      <div className="hidden lg:block text-sm font-semibold text-light-type mt-4 flex-shrink-0 w-36">
        {dayjs(props.portfolioItem.dateCompleted).format("MMMM DD, YYYY")}
      </div>
      <div
        className="bg-white rounded-lg border border-light-border relative w-full"
        key={props.portfolioItem.id}
      >
        {props.canEdit && props.editRoute && (
          <Link
            to={props.editRoute}
            title="Edit this contribution"
            className="absolute p-1 top-2 right-2 rounded hover:text-light-interactive"
          >
            <EditIcon />
          </Link>
        )}
        <div className="flex">
          {props.portfolioItem.reviewMapImageUrl && reviewMapUrl && (
            <a href={reviewMapUrl} target="_blank" rel="noreferrer">
              <img
                src={props.portfolioItem.reviewMapImageUrl}
                alt=""
                className="hidden sm:block object-cover flex-shrink-0 border-r border-light-border rounded-tl-lg"
                style={{ height: 200, aspectRatio: "4 / 3" }}
              />
            </a>
          )}
          <div>
            <h3 className="px-4 mt-4 mb-2 mr-8">
              <a
                href={props.portfolioItem.pullRequestUrl}
                target="_blank"
                rel="noreferrer"
                className="text-light-interactive supports-hover:hover:underline text-lg font-medium"
              >
                {props.portfolioItem.title}
              </a>
            </h3>
            <div
              className="px-4 markdown-content"
              dangerouslySetInnerHTML={{
                __html: props.portfolioItem.description,
              }}
            />
          </div>
        </div>
        {props.project ? (
          <div className="flex flex-col md:flex-row border-t border-light-border py-4">
            <div className="flex-1">
              <div className="flex gap-3 items-center px-4">
                {props.project.attributes.avatar && (
                  <img
                    src={props.project.attributes.avatar}
                    className="rounded-full"
                    style={{ width: 40, height: 40 }}
                    alt=""
                  />
                )}
                <Link
                  to={"/" + props.project.slug}
                  className="text-light-interactive text-xl supports-hover:hover:underline"
                >
                  {props.project.attributes.name}
                </Link>
              </div>
              {props.project.attributes.description && (
                <p
                  className="px-4 text-sm text-light-type-medium mt-2 mb-4 overflow-hidden"
                  style={{
                    lineClamp: 3,
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                    display: "-webkit-box",
                    maxHeight: 60,
                    lineHeight: "20px",
                  }}
                >
                  {props.project.attributes.description}
                </p>
              )}
            </div>
            <div className="pt-4 px-4 flex-1">
              <div>
                <span className="uppercase text-light-type-medium text-xs mr-6">
                  Project type
                </span>
                {props.project.attributes.tags?.map((badge) => (
                  <Tag tag={badge} key={badge} className="mr-2 mb-2" />
                ))}
              </div>
              <div>
                <span className="uppercase text-light-type-medium text-xs mr-6">
                  Tech
                </span>
                {props.project.attributes.languages?.map((badge) => (
                  <Tag tag={badge} key={badge} className="mr-2 mb-2" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="pt-4 px-4 pb-4 border-t border-light-border text-light-type-medium text-sm space-y-2">
            <p>This project is listed not on Open Source Hub yet.</p>
            <p>
              If you are one of the maintainers, consider listing your project
              on{" "}
              <Link
                to="/contribute"
                className="font-semibold text-light-interactive supports-hover:hover:underline"
              >
                Open Source Hub!
              </Link>
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default PortfolioItemCard;
