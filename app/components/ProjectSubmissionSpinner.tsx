import { FC } from "react";
import Spinner from "./Spinner";

type Props = {
  state: "idle" | "submitting" | "loading";
};
/**
 * Renders a modal if the provided state is "submitting". Use this when
 * submitting the "new project" form because the submisson can be slow.
 *
 * @see list-projects.tsx
 */
const ProjectSubmissionSpinner: FC<Props> = ({ state }) => {
  if (state === "submitting") {
    return (
      <div className="fixed inset-0 bg-black-900/75 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-light-type mb-2 flex items-center">
            <Spinner className="mr-2 h-5 w-5" /> Submitting your project...
          </h2>
          <ul className="list-disc list-inside text-light-type">
            <li>Validating the form</li>
            <li>Uploading files to GitHub</li>
            <li>Opening a pull request on your behalf</li>
          </ul>
        </div>
      </div>
    );
  }

  return null;
};

export default ProjectSubmissionSpinner;
