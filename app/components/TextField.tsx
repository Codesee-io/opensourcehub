import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
} from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  description?: string;
  id: string;
  label: ReactNode;
};

const TextField = (props: Props, ref: ForwardedRef<HTMLInputElement>) => {
  const { label, id, description, ...otherProps } = props;

  return (
    <>
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      {description && (
        <p className="text-light-type-medium text-sm mb-2">{description}</p>
      )}
      <input
        className="input"
        type="text"
        id={id}
        name={id}
        {...otherProps}
        ref={ref}
      />
    </>
  );
};

export default forwardRef<HTMLInputElement, Props>(TextField);
