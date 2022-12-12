import { useFetcher } from "@remix-run/react";
import { FC, useEffect } from "react";
import { VerifyPullRequestResponse } from "~/routes/api/verify-pull-request";
import Button from "./Button";
import TextField from "./TextField";

type Props = {
  onValidPullRequest: (url: string) => void;
  onInvalidPullRequest: () => void;
};

const PullRequestChecker: FC<Props> = (props) => {
  const fetcher = useFetcher<VerifyPullRequestResponse>();

  useEffect(() => {
    if (fetcher.type === "done") {
      if (fetcher.data.isValid) {
        props.onValidPullRequest(fetcher.data.url);
      } else {
        props.onInvalidPullRequest();
      }
    }
  }, [fetcher, props]);

  return (
    <fetcher.Form method="post" action="/api/verify-pull-request">
      {fetcher.data?.isValid && (
        <div className="rounded-lg border border-light-border p-4">
          <div className="text-sm text-light-type font-medium">
            {fetcher.data.title}
          </div>
          <div className="text-sm text-light-type-medium space-x-2">
            <a
              href={fetcher.data.author.url}
              target="_blank"
              rel="noreferrer"
              className="supports-hover:hover:underline"
            >
              By {fetcher.data.author.login}
            </a>{" "}
            &bull;{" "}
            <a
              href={fetcher.data.url}
              target="_blank"
              rel="noreferrer"
              className="supports-hover:hover:underline"
            >
              {fetcher.data.repository.nameWithOwner} #{fetcher.data.number}
            </a>
          </div>
        </div>
      )}
      {(fetcher.data == null || fetcher.data.isValid == false) && (
        <div>
          <div className="mb-4">
            <TextField
              id="url"
              label="Public pull request URL"
              description="Please provide the URL to the pull request in GitHub"
              type="url"
              required
              disabled={fetcher.state === "submitting"}
              autoComplete="off"
              placeholder="https://github.com/freeCodeCamp/freeCodeCamp/pull/123 (required)"
            />
          </div>
          <div className="flex gap-4 items-center">
            <Button disabled={fetcher.state === "submitting"}>Check URL</Button>
            {fetcher.data?.isValid === false && (
              <span className="text-sm text-warning-dark">
                This is not a valid public pull request URL
              </span>
            )}
          </div>
        </div>
      )}
    </fetcher.Form>
  );
};

export default PullRequestChecker;
