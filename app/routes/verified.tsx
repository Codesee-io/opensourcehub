import type { MetaFunction } from "@remix-run/node";
import ExternalLink from "../components/ExternalLink";

export const meta: MetaFunction = () => ({
  title: "Verified Maintainer Program",
});

const About = () => {
  return (
    <>
      <header className="mx-auto max-w-2xl px-4 mb-12 pt-12 text-center">
        <h1 className="text-3xl my-3 font-semibold text-center">
          Verified Maintainer Program
        </h1>
      </header>
      <main className="mx-auto max-w-2xl px-4 mb-20">
        <div className="">
          <p className="mb-4">
            The OSH Verification program is a simple way for contributors to
            discover projects that have been reviewed and curated by the OSH
            team.
          </p>
          <p className="mb-1">Maintainers also receive many perks such as:</p>
          <ul className="list-inside list-disc">
            <li>
              Distinguished promotions on the OSH website and its communities
            </li>
            <li>Featured in Console by OSH weekly newsletter</li>
            <li>Access to a CodeSee Business or Enterprise Plan</li>
            <li>...and many more benefits!</li>
          </ul>
        </div>
        <div className="p-6 bg-white rounded-lg border border-light-border my-12">
          <h2 className="text-xl font-semibold mb-4">How to get verified</h2>
          <p className="mb-4">
            Want to get verified? Our two requirements are that your project is
            active and noteworthy. Learn more about what's required before
            following the steps to submit your project for Verification.
          </p>
          <p className="font-bold mb-1">Active</p>
          <p className="mb-4">
            Verified projects are actively maintained and receive at least 4+
            PRs from contributors every 30 days.
          </p>
          <p className="font-bold mb-1">Noteworthy</p>
          <p>
            Verified projects are widely known and/or impactful in the world of
            open source. Noteworthiness is determined through the purpose of the
            project, number of stars, notable maintainers/contributors working
            on the project, etc.
          </p>
        </div>
        <div className="space-y-4 p-6 bg-white rounded-lg border border-light-border text-center">
          <h2 className="text-lg font-semibold mb-2">
            Submit your project to be verified on Open Source Hub today!
          </h2>
          <p>
            <ExternalLink href="https://forms.gle/xnoTCrRzazZrSVG96">
              Get verified!
            </ExternalLink>
          </p>
        </div>
      </main>
    </>
  );
};

export default About;
