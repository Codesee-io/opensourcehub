import { FunctionComponent } from "react";
import dayjs from "dayjs";
import cx from "classnames";
import { PostOrPage } from "@tryghost/content-api";

type Props = {
  blogPost: PostOrPage;
};

const BlogCard: FunctionComponent<Props> = ({ blogPost }) => {
  const tag = (blogPost.tags || [])[0];
  const author = (blogPost.authors || [])[0];

  return (
    <div className="relative flex flex-col w-full" style={{ maxWidth: 400 }}>
      <div className="flex-grow">
        <a href={blogPost.url} target="_blank" className="mb-2">
          <img
            src={blogPost.og_image || ""}
            alt="blog-card-img"
            className="post-image"
          />
        </a>
        <div className="flex">
          <p
            className={cx("post-tag", {
              "bg-indigo-500": tag.visibility === "public",
            })}
          >
            {tag.visibility === "public" ? tag.name : ""}
          </p>
        </div>
        <div className="mt-6">
          <h1 className="post-title text-lg font-bold text-black-500">
            {blogPost.title}
          </h1>
          {blogPost.custom_excerpt && (
            <p className="post-excerpt text-sm overflow-hidden mt-3">
              {blogPost.custom_excerpt}
            </p>
          )}
        </div>
        <div className="post-meta mt-4">
          <a href={author.url || "/"} target="_blank" className="inline-block">
            <img
              src={author ? author.profile_image || "" : ""}
              alt="post-author-image"
              className="post-author-image"
            />
          </a>
          <div>
            <a
              href={author.url || "/"}
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
