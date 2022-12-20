import { Link } from "@remix-run/react";
import { CSSProperties, FC } from "react";

function isExternalLink(url: string) {
  return url.startsWith("http");
}

type Props = {
  to: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
};

const SmartLink: FC<Props> = ({ to, children, ...otherProps }) => {
  if (isExternalLink(to)) {
    return (
      <a href={to} rel="noreferrer" target="_blank" {...otherProps}>
        {children}
      </a>
    );
  }

  return (
    <Link to={to} {...otherProps}>
      {children}
    </Link>
  );
};

export default SmartLink;
