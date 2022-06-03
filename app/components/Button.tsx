import { ButtonHTMLAttributes, FunctionComponent } from "react";
import cx from "classnames";
import { buttonStyle, ButtonVariant } from "~/utils/linkStyle";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const Button: FunctionComponent<Props> = ({
  children,
  className,
  variant = "primary",
  ...otherProps
}) => {
  return (
    <button className={cx(buttonStyle(variant), className)} {...otherProps}>
      {children}
    </button>
  );
};

export default Button;
