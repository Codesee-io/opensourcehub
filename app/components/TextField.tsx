import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";
import RequiredMarker from "./RequiredMarker";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  description?: string;
  id: string;
  label: ReactNode;
};

const TextField = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { label, description, ...otherProps } = props;

  return (
    <>
      <label className="input-label" htmlFor={otherProps.id}>
        {label}
        {otherProps.required && <RequiredMarker />}
      </label>
      {description && (
        <p className="text-light-type-medium text-sm mb-2">{description}</p>
      )}
      <input
        className="input"
        type="text"
        name={otherProps.id}
        {...otherProps}
        ref={ref}
      />
    </>
  );
};

export default forwardRef<HTMLInputElement, Props>(TextField);
