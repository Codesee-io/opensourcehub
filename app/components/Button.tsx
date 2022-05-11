import { ButtonHTMLAttributes, FunctionComponent } from "react";
import cx from "classnames";
import { linkStyle } from "~/utils/linkStyle";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  format?: string;
  inverse?: boolean;
};

const Button: FunctionComponent<Props> = ({
  children,
  type = "button",
  className,
  format,
  inverse,
  ...otherProps
}) => {
  return (
    <button
      className={cx(
        "rounded-lg px-8 py-1 font-semibold",
        linkStyle({ format, inverse }),
        className
      )}
      type={type}
      {...otherProps}
    >
      {children}
    </button>
  );
};

export default Button;
