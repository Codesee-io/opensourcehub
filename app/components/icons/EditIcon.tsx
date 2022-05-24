import type { FC, SVGProps } from "react";

// Icon from the lovely folks at https://myicons.co/ 💜

const EditIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.293 12.707L20.707 6.29301C21.098 5.90201 21.098 5.26901 20.707 4.87901L19.121 3.29301C18.73 2.90201 18.097 2.90201 17.707 3.29301L11.293 9.70701C11.105 9.89501 11 10.149 11 10.414V13H13.586C13.851 13 14.105 12.895 14.293 12.707V12.707Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 13H7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 17H21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 21H21"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default EditIcon;
