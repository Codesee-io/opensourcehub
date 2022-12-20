import { FC } from "react";
import cx from "classnames";
import SmartLink from "./SmartLink";

type Props = {
  to: string;
  className?: string;
};

const NavLink: FC<Props> = ({ children, to, className }) => {
  return (
    <SmartLink
      className={cx(
        "px-3 py-1 supports-hover:hover:text-yellow-300 flex items-center",
        className
      )}
      to={to}
      children={children}
    />
  );
};

export default NavLink;
