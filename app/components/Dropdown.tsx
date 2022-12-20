import { CSSProperties, FC } from "react";
import cx from "classnames";

type Props = {
  isOpen: boolean;
  style?: CSSProperties;
};

const Dropdown: FC<Props> = ({ children, isOpen, style }) => (
  <div
    className={cx(
      "bg-white top-full mt-2 rounded-lg py-2 -right-2 flex flex-col shadow-2",
      {
        hidden: !isOpen,
        absolute: isOpen,
      }
    )}
    style={style}
  >
    <span className="bottom-full right-4 border-8 border-transparent border-b-white absolute w-0 h-0" />
    {children}
  </div>
);

export default Dropdown;
