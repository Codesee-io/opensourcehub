import { FC } from "react";
import Button from "./Button";
import ModalWrapper from "./ModalWrapper";

type Props = {
  isOpen: boolean;
  hasMap: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const ProjectSubmissionConfirmation: FC<Props> = ({
  isOpen,
  hasMap,
  onCancel,
  onConfirm,
}) => {
  return (
    <ModalWrapper isOpen={isOpen}>
      <div className="h-full flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 shadow-lg max-w-sm">
          <h2 className="text-lg font-semibold text-light-type mb-2 flex items-center">
            Ready to submit your project?
          </h2>
          <p className="text-light-type text-sm">
            This will open a pull request in the Open Source Hub repository,
            where someone from the team will review your changes.
          </p>
          {!hasMap && (
            <p className="text-sm text-warning-dark mt-2">
              ⚠️ We highly recommend adding a featured map to attact more
              contributors.
            </p>
          )}
          <div className="mt-6 flex gap-4 justify-between">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Edit
            </Button>
            <Button type="button" variant="brand" onClick={onConfirm}>
              Submit
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default ProjectSubmissionConfirmation;
