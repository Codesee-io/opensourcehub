import { ButtonHTMLAttributes, FunctionComponent } from "react";
import cx from "classnames";
import { linkStyle } from "~/utils/linkStyle";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  format?: string;
  inverse?: boolean;
};

const Button: FunctionComponent<Props> = ({
  children,
  className,
  format,
  inverse,
  ...otherProps
}) => {
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center rounded-lg px-8 py-1 font-semibold",
        linkStyle({ format, inverse }),
        className
      )}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
