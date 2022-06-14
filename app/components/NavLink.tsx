import { FC } from "react";
import { Link } from "@remix-run/react";
import cx from "classnames";

type Props = {
  to: string;
  className?: string;
};

function isExternalLink(url: string) {
  return url.startsWith("http");
}

const NavLink: FC<Props> = ({ children, to, className }) => {
  if (isExternalLink(to)) {
    return (
      <a
        href={to}
        className={cx(
          "px-3 py-1 supports-hover:hover:text-yellow-300 flex items-center",
          className
        )}
        rel="noreferrer"
        target="_blank"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      className={cx(
        "px-3 py-1 supports-hover:hover:text-yellow-300 flex items-center",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
