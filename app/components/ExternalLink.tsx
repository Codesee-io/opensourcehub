import { AnchorHTMLAttributes, FunctionComponent } from "react";
import cx from "classnames";

const ExternalLink: FunctionComponent<AnchorHTMLAttributes<HTMLAnchorElement>> =
  ({ children, className, ...props }) => (
    <a
      target="_blank"
      rel="noopener"
      className={cx(
        "text-light-interactive font-semibold supports-hover:hover:underline",
        className
      )}
      {...props}
    >
      {children}
    </a>
  );

export default ExternalLink;
