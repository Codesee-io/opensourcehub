import { HeadersFunction } from "@remix-run/node";
import { FC } from "react";
import MarkdownComponent, { attributes } from "~/content/terms-conditions.md";
import markdownStyles from "~/styles/markdown.css";

export function links() {
  return [{ rel: "stylesheet", href: markdownStyles }];
}

export function meta() {
  return attributes.meta;
}

export const headers: HeadersFunction = () => {
  return attributes.headers;
};

const PrivacyPage: FC = () => {
  return (
    <div className="markdown-content max-w-3xl mx-auto px-4 py-8">
      <MarkdownComponent />
    </div>
  );
};

export default PrivacyPage;
