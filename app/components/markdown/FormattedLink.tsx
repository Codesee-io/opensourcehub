import type { FC } from "react";

type Props = {
  href: string;
};

const FormattedLink: FC<Props> = ({ href, children }) => (
  <a href={href} className="link" target="_blank" rel="noreferrer">
    {children}
  </a>
);

export default FormattedLink;
