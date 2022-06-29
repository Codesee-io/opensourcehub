import { FunctionComponent } from "react";
import dayjs from "dayjs";
import { PostOrPage } from "@tryghost/content-api";

type Props = {
  blogPost: PostOrPage;
};

const BlogCard: FunctionComponent<Props> = ({ blogPost }) => {
  const author = (blogPost.authors || [])[0];

  return (
    <div className="relative flex flex-col w-full" style={{ maxWidth: 400 }}>
      <div className="flex-grow">
        <a
          href={blogPost.url}
          target="_blank"
          className="mb-2"
          rel="noreferrer"
        >
          <img
            src={blogPost.feature_image || ""}
            alt="Read this article on CodeSee Learn"
            className="post-image rounded-lg mb-6 object-cover"
            style={{
              height: 225,
              width: 400,
              boxShadow:
                "0 6px 10px 0 rgb(0 0 0 / 12%), 0 1px 18px 0 rgb(0 0 0 / 10%), 0 3px 5px 0 rgb(0 0 0 / 15%)",
            }}
          />
        </a>
        <div className="mt-6">
          <a href={blogPost.url} target="_blank" rel="noreferrer">
            <h3 className="text-lg font-semibold text-light-type">
              {blogPost.title}
            </h3>
          </a>
          {blogPost.custom_excerpt && (
            <a href={blogPost.url} target="_blank" rel="noreferrer">
              <p className="text-sm mt-3">{blogPost.custom_excerpt}</p>
            </a>
          )}
        </div>
        <div className="flex items-center mt-4">
          <a
            href={author.url || "/"}
            target="_blank"
            className="inline-block"
            rel="noreferrer"
          >
            <img
              src={author.profile_image || ""}
              alt={`Visit ${author.name}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
            />
          </a>
          <div>
            <a
              href={author.url || "/"}
              target="_blank"
              className="ml-3 inline-block font-medium"
              rel="noreferrer"
            >
              {author.name}
            </a>
            <div className="flex items-center">
              <div className="bg-indigo-500 w-0.5 h-5 mr-2 ml-3"></div>
              <time dateTime={blogPost.updated_at || new Date().toISOString()}>
                {dayjs(blogPost.updated_at || new Date().toISOString()).format(
                  "MMMM DD, YYYY"
                )}
              </time>
              <div className="mx-1"> - </div>
              <div>{blogPost.reading_time} min read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
