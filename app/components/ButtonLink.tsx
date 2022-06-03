import { Link } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/components";
import cx from "classnames";
import { FC } from "react";
import { linkStyle } from "~/utils/linkStyle";

type Props = RemixLinkProps & {
  format?: string;
  inverse?: boolean;
};

const ButtonLink: FC<Props> = ({
  children,
  className,
  format,
  inverse,
  ...otherProps
}) => {
  return (
    <Link
      {...otherProps}
      className={cx(
        "inline-flex rounded-lg px-8 py-1 font-semibold",
        linkStyle({ format, inverse }),
        className
      )}
    >
      {children}
    </Link>
  );
};

export default ButtonLink;
