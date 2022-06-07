import { FC } from "react";

const RequiredMarker: FC = () => (
  <span
    className="text-warning-dark ml-1 font-normal"
    title="This field is required"
  >
    *
  </span>
);

export default RequiredMarker;
