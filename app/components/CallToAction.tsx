import { AnchorHTMLAttributes, FunctionComponent } from "react";
import cx from "classnames";
import { linkStyle } from "~/utils/linkStyle";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  format?: string;
  inverse?: boolean;
};

const CallToAction: FunctionComponent<Props> = ({
  children,
  className,
  format,
  inverse,
  ...otherProps
}) => {
  return (
    <a
      className={cx(
        "rounded-lg px-8 py-2 font-semibold",
        linkStyle({ format, inverse }),
        className
      )}
      {...otherProps}
    >
      {children}
    </a>
  );
};

export default CallToAction;
