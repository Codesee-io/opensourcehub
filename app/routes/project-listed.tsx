import { useSearchParams } from "@remix-run/react";
import { FC } from "react";
import ButtonLink from "~/components/ButtonLink";
import ExternalLink from "~/components/ExternalLink";

const ProjectListedPage: FC = () => {
  const [params] = useSearchParams();

  const pullRequestUrl = params.get("pr");

  return (
    <div className="max-w-screen-sm mx-auto my-20">
      <h1 className="text-2xl text-light-type font-semibold mb-4">
        Your project was submitted!
      </h1>
      <p className="text-light-type mb-2">
        Our team will review your submission in order to list your project as
        soon as possible.
      </p>
      {pullRequestUrl && (
        <p className="text-light-type">
          If we have any feedback, we'll inform you{" "}
          <ExternalLink href={pullRequestUrl}>in the pull request</ExternalLink>
          .
        </p>
      )}
      <ButtonLink to="/" className="mt-6">
        Go home
      </ButtonLink>
    </div>
  );
};

export default ProjectListedPage;
