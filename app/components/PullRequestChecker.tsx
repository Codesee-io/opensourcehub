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
      {fetcher.data?.isValid === false && (
        <p>This is not a valid pull request URL</p>
      )}
      {(fetcher.data == null || fetcher.data.isValid == false) && (
        <div>
          <div className="mb-4">
            <TextField
              id="url"
              label="Pull request URL"
              type="url"
              required
              disabled={fetcher.state === "submitting"}
            />
          </div>
          <Button format="secondary" disabled={fetcher.state === "submitting"}>
            Check URL
          </Button>
        </div>
      )}
    </fetcher.Form>
  );
};

export default PullRequestChecker;
