import { CSSProperties, FC } from "react";
import cx from "classnames";

type Props = {
  tag: string;
  className?: string;
  color?: string;
  filled?: boolean;
};

const Tag: FC<Props> = ({ tag, className, color, filled }) => {
  const style: CSSProperties = {};
  if (color) {
    if (filled) {
      style.backgroundColor = color;
      style.borderColor = color;
      style.color = "white";
    } else {
      style.borderColor = color;
      style.color = color;
    }
  }
  return (
    <span
      className={cx(
        "inline-flex rounded-full px-2 py-0.5 text-xs border font-semibold lowercase whitespace-nowrap",
        className,
        {
          "text-light-type-medium border-light-type-disabled":
            color == null && !filled,
          "bg-light-type-medium text-white": color == null && filled,
        }
      )}
      style={style}
    >
      {tag}
    </span>
  );
};

export default Tag;
