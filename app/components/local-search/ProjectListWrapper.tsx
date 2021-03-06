import React, { FunctionComponent } from "react";

const ProjectListWrapper: FunctionComponent = ({ children }) => {
  return (
    <div
      className="px-2 md:px-0 grid gap-8 projects-wrapper"
      data-qa="project-list-wrapper"
    >
      {children}
    </div>
  );
};

export default ProjectListWrapper;
