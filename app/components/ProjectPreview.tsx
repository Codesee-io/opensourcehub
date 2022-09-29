import { FC } from "react";
import cx from "classnames";
import { Project } from "~/types";
import ProjectTemplate from "./ProjectTemplate";
import Button from "./Button";

type Props = {
  isOpen: boolean;
  project?: Project;
  closePreview: () => void;
};

const ProjectPreview: FC<Props> = ({ isOpen, project, closePreview }) => {
  return (
    <div
      className={cx("fixed inset-0 p-2 md:p-6 z-50 bg-black-700/75", {
        hidden: !isOpen,
      })}
    >
      <div className="max-w-6xl mx-auto shadow-lg bg-black-30 rounded-lg border-t-4 border-light-interactive">
        <div className="bg-light-interactive px-4 pb-4 pt-3 flex justify-between items-center">
          <h2 className="font-semibold text-xl text-white text-center">
            Preview your project
          </h2>
          <Button onClick={closePreview}>Close</Button>
        </div>
        <div className="p-2">
          {project && <ProjectTemplate project={project} />}
        </div>
      </div>
    </div>
  );
};

export default ProjectPreview;
