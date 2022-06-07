import { FC, InputHTMLAttributes, ReactNode } from "react";
import RequiredMarker from "./RequiredMarker";

type Props = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  id: string;
};

const TextArea: FC<Props> = ({ label, id, ...otherProps }) => {
  return (
    <>
      <label className="input-label" htmlFor={id}>
        {label}
        {otherProps.required && <RequiredMarker />}
      </label>
      <textarea className="input" id={id} name={id} {...otherProps} />
    </>
  );
};

export default TextArea;
