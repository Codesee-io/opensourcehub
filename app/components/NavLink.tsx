import React, { FunctionComponent } from "react";
import { Link } from "@remix-run/react";
import cx from "classnames";
import ExternalLink from "../components/ExternalLink";

type Props = {
  to: string;
  className?: string;
};

function isExternalLink(url: string) {
  return url.startsWith("http");
}

const NavLink: FunctionComponent<Props> = ({ children, to, className }) => {
  if (isExternalLink(to)) {
    return (
      <ExternalLink
        href={to}
        className={cx(
          "px-3 py-1 supports-hover:hover:text-yellow-300 inline-block rounded",
          className
        )}
      >
        {children}
      </ExternalLink>
    );
  }

  return (
    <Link
      to={to}
      className={cx(
        "px-3 py-1 supports-hover:hover:text-yellow-300 inline-block rounded",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default NavLink;
