import { Link } from "@remix-run/react";
import { RemixLinkProps } from "@remix-run/react/components";
import cx from "classnames";
import { FC } from "react";
import { buttonStyle, ButtonVariant } from "~/utils/linkStyle";

type Props = RemixLinkProps & {
  variant?: ButtonVariant;
};

const ButtonLink: FC<Props> = ({
  children,
  className,
  variant = "primary",
  ...otherProps
}) => {
  return (
    <Link {...otherProps} className={cx(buttonStyle(variant), className)}>
      {children}
    </Link>
  );
};

export default ButtonLink;
