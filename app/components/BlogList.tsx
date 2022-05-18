import { FunctionComponent } from "react";
import { PostOrPage } from "@tryghost/content-api";
import ProjectListWrapper from "./local-search/ProjectListWrapper";
import BlogCard from "./BlogCard";

type Props = {
  blogPosts: PostOrPage[];
};

const BlogList: FunctionComponent<Props> = ({ blogPosts }) => {
  if (blogPosts.length === 0) {
    return <></>;
  }

  return (
    <ProjectListWrapper>
      {blogPosts.map((blogPost) => (
        <BlogCard key={blogPost.id} blogPost={blogPost} />
      ))}
    </ProjectListWrapper>
  );
};

export default BlogList;
