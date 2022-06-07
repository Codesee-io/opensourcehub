import React, { FC } from "react";

type Props = {
  error: string | null;
};

const FieldError: FC<Props> = ({ error }) => {
  if (error) {
    return <p className="text-sm text-warning-dark mt-1">{error}</p>;
  }

  return null;
};

export default FieldError;
