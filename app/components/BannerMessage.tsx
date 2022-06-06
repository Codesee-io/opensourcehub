import { FC } from "react";
import cx from "classnames";
import CloseIcon from "./icons/CloseIcon";

type Props = {
  kind: "success" | "error";
  onHide?: () => void;
};

const BannerMessage: FC<Props> = ({ kind, children, onHide }) => {
  return (
    <div
      className={cx(
        "flex rounded-lg px-4 py-2 max-w-full gap-2 justify-between",
        {
          "bg-success-light text-success-dark": kind === "success",
          "bg-warning-light text-warning-dark": kind === "error",
        }
      )}
      style={{ width: 560 }}
    >
      <p>{children}</p>
      <button type="button" onClick={onHide} name="Hide this message">
        <CloseIcon />
      </button>
    </div>
  );
};

export default BannerMessage;
