import { FC, useEffect } from "react";

type Props = {
  isOpen: boolean;
};

const ModalWrapper: FC<Props> = ({ children, isOpen }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);

  if (isOpen) {
    return (
      <div className="fixed inset-0 bg-black-900/75 z-50 p-4 overflow-auto">
        {children}
      </div>
    );
  }

  return null;
};

export default ModalWrapper;
