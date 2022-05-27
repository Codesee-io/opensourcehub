import { HeadersFunction, MetaFunction } from "@remix-run/node";
import { FC } from "react";
import tagColors from "~/data/tagColors";

export const meta: MetaFunction = () => ({
  title: "Design | Open-Source Hub",
});

export const headers: HeadersFunction = () => {
  return {
    // We don't want search engines to index this page
    "X-Robots-Tag": "noindex",
  };
};

const Design: FC = () => {
  return (
    <main className="py-12 md:py-20 px-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-semibold leading-relaxed text-center mt-4 mb-8">
        Open-Source Hub Design
      </h1>

      <h2 className="text-xl font-semibold text-light-type leading-loose">
        Tag colors
      </h2>
      <p className="text-light-type-medium mb-4">
        Tags require colors that pass AAA contrast ratio against white.
      </p>
      <table className="w-full">
        <tbody>
          {(Object.keys(tagColors) as (keyof typeof tagColors)[]).map((key) => (
            <tr key={key} className="hover:bg-white">
              <td className="py-1 px-4">{key}</td>
              <td className="py-1 px-4 font-mono text-sm">{tagColors[key]}</td>
              <td className="py-1 px-4">
                <span
                  className="bg-white border text-xs rounded-full px-2 items-center inline-flex h-6 font-semibold"
                  style={{ color: tagColors[key], borderColor: tagColors[key] }}
                >
                  label
                </span>
              </td>
              <td className="py-1 px-4">
                <span
                  className="text-white text-xs rounded-full px-2 items-center inline-flex h-6 font-semibold"
                  style={{ background: tagColors[key] }}
                >
                  label
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Design;
