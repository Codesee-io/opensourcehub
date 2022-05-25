import { FC, InputHTMLAttributes, ReactNode } from "react";

type Props = InputHTMLAttributes<HTMLTextAreaElement> & {
  label: ReactNode;
  id: string;
};

const TextArea: FC<Props> = ({ label, id, ...otherProps }) => {
  return (
    <>
      <label className="input-label" htmlFor={id}>
        {label}
      </label>
      <textarea className="input" id={id} name={id} {...otherProps} />
    </>
  );
};

export default TextArea;
