import { FC } from "react";
import { Project } from "~/types";
import ProjectTemplate from "./ProjectTemplate";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";

type Props = {
  isOpen: boolean;
  project?: Project;
  closePreview: () => void;
};

/**
 * Renders a modal that contains a ProjectTemplate. Use this component to
 * preview what a new project will look like.
 *
 * @see list-project.tsx
 */
const ProjectPreview: FC<Props> = ({ isOpen, project, closePreview }) => {
  return (
    <ModalWrapper isOpen={isOpen}>
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
    </ModalWrapper>
  );
};

export default ProjectPreview;
