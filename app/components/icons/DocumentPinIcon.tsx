import type { FC, SVGProps } from "react";

const DocumentPinIcon: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 8V10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 13H17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 17H17"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.333 6H19C20.105 6 21 6.895 21 8V19C21 20.105 20.105 21 19 21H5C3.895 21 3 20.105 3 19V8C3 6.895 3.895 6 5 6H9.667"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.5 2.5V2.774C9.5 3.001 9.577 3.221 9.719 3.399L10.5 4.375V5.375L9.42 6.185C9.168 6.374 9.02 6.67 9.02 6.985V8H14.981V6.985C14.981 6.67 14.833 6.374 14.581 6.185L13.501 5.375V4.375L14.282 3.399C14.423 3.222 14.5 3.001 14.5 2.774V2.5C14.5 2.224 14.276 2 14 2H10C9.724 2 9.5 2.224 9.5 2.5Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DocumentPinIcon;
