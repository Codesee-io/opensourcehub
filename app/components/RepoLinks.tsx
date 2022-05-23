import { FC } from "react";
import { MarkGithubIcon, LinkIcon } from "@primer/octicons-react";
import { ProjectAttributes } from "~/types";
import TwitterIcon from "./icons/TwitterIcon";
import DocumentIcon from "./icons/DocumentIcon";

type Props = {
  frontmatter: ProjectAttributes;
};

const RepoLinks: FC<Props> = ({ frontmatter }) => {
  return (
    <div className="flex-grow mb-4 basis-2/3">
      <div className="flex space-x-4 mb-4 text-sm">
        <a
          target="_blank"
          className="flex gap-1 items-center text-light-interactive hover:underline"
          href={frontmatter.repoUrl}
          title="Visit this repository on GitHub"
          rel="noreferrer"
        >
          <MarkGithubIcon size={20} />
          <span>GitHub</span>
        </a>
        {frontmatter.twitterUrl && (
          <a
            target="_blank"
            className="flex gap-1 items-center text-light-interactive hover:underline"
            href={frontmatter.twitterUrl}
            title="Connect with this community on Twitter"
            rel="noreferrer"
          >
            <TwitterIcon className="w-5 h-5" />
            <span>Twitter</span>
          </a>
        )}
        {frontmatter.websiteUrl && (
          <a
            target="_blank"
            className="flex gap-1 items-center text-light-interactive hover:underline"
            href={frontmatter.websiteUrl}
            title="Visit this project's website"
            rel="noreferrer"
          >
            <LinkIcon size={20} />
            <span>Website</span>
          </a>
        )}
      </div>
      <p className="text-light-type text-sm mb-6">{frontmatter.description}</p>
      <p>
        <a
          href={frontmatter.repoUrl + "#readme"}
          target="_blank"
          rel="noreferrer"
          className="flex gap-1 text-light-interactive hover:underline font-medium text-lg items-center"
        >
          <DocumentIcon />
          <span>Readme</span>
        </a>
      </p>
    </div>
  );
};

export default RepoLinks;
