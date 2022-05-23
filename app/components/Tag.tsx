import React, { FunctionComponent } from "react";
import cx from "classnames";

type Props = {
  tag: string;
  className?: string;
  isActive?: boolean;
};

const Tag: FunctionComponent<Props> = ({ tag, className, isActive }) => {
  return (
    <span
      className={cx(
        "inline-block rounded-full px-2 py-0.5 text-xs border font-semibold lowercase",
        className,
        {
          "text-light-type-medium border-light-type-low": !isActive,
          "bg-light-interactive-fill border-light-interactive text-light-interactive":
            isActive,
        }
      )}
    >
      {tag}
    </span>
  );
};

export default Tag;
