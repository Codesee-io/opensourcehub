import { FunctionComponent } from "react";
import dayjs from "dayjs";
import cx from "classnames";
import { PostOrPage } from "@tryghost/content-api";

type Props = {
  blogPost: PostOrPage;
};

const BlogCard: FunctionComponent<Props> = ({ blogPost }) => {
  const tags = (blogPost.tags || [])
    .filter((tag) => tag.visibility === "public")
    .slice(0, 2);
  const author = (blogPost.authors || [])[0];

  return (
    <div className="relative flex flex-col w-full" style={{ maxWidth: 400 }}>
      <div className="flex-grow">
        <a href={blogPost.url} target="_blank" className="mb-2">
          <img
            src={blogPost.og_image || ""}
            alt="Read this article on CodeSee Learn"
            className="post-image"
          />
        </a>
        <div className="flex">
          {tags.map((tag) => (
            <a
              key={tag.id}
              href={tag.url}
              target="_blank"
              className={cx("post-tag mr-2", {
                "bg-indigo-500": tag.visibility === "public",
              })}
            >
              {tag.visibility === "public" ? tag.name : ""}
            </a>
          ))}
        </div>
        <div className="mt-6">
          <a href={blogPost.url} target="_blank">
            <h1 className="post-title text-lg font-bold text-black-500">
              {blogPost.title}
            </h1>
          </a>
          {blogPost.custom_excerpt && (
            <a href={blogPost.url} target="_blank">
              <p className="post-excerpt text-sm overflow-hidden mt-3">
                {blogPost.custom_excerpt}
              </p>
            </a>
          )}
        </div>
        <div className="post-meta mt-4">
          <a href={author.url || "/"} target="_blank" className="inline-block">
            <img
              src={author ? author.profile_image || "" : ""}
              alt={author.name?.charAt(0) || ""}
              className="post-author-image"
            />
          </a>
          <div>
            <a
              href={author.url || "/"}
              target="_blank"
              className="flex items-center inline-block"
            >
              <div className="ml-3">{author.name}</div>
            </a>
            <div className="flex items-center">
              <div className="post-vertical-line-small more"></div>
              <time dateTime={blogPost.updated_at || new Date().toISOString()}>
                {dayjs(blogPost.updated_at || new Date().toISOString()).format(
                  "MMMM DD, YYYY"
                )}
              </time>
              <div className="post-dash"> - </div>
              <div>{blogPost.reading_time} min read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
