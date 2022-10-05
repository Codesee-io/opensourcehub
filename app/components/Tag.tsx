import { FC } from "react";
import cx from "classnames";

type Props = {
  tag: string;
  className?: string;
  filled?: boolean;
};

const Tag: FC<Props> = ({ tag, className, filled }) => {
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2 py-0.5 text-xs border font-semibold lowercase whitespace-nowrap",
        className,
        {
          "text-light-type-medium border-light-type-disabled": !filled,
          "bg-light-type-medium text-white": filled,
        }
      )}
    >
      {tag}
    </span>
  );
};

export default Tag;
