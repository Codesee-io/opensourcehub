import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import ButtonLink from "~/components/ButtonLink";
import { ROUTES } from "~/utils/constants";
import ExternalLink from "../components/ExternalLink";

export const meta: MetaFunction = () => ({
  title: "About Open Source Hub",
});

const About = () => {
  return (
    <>
      <header className="mx-auto max-w-2xl px-4 mb-12 pt-12 text-center">
        <h1 className="text-3xl my-3 font-semibold text-center">
          Let's onboard better.
        </h1>
        <p className="text-center max-w-sm mx-auto mb-6">
          Helping contributors and maintainers eliminate the barriers to taking
          on a new codebase.
        </p>
        <div className="flex gap-4 justify-center">
          <ButtonLink to="/contribute">List your project</ButtonLink>
          <ButtonLink to="/verified">Get verified</ButtonLink>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 mb-20">
        <h2 className="text-2xl font-semibold mb-4 px-6">
          About Open Source Hub
        </h2>
        <div className="space-y-4 p-6 bg-white rounded-lg border border-light-border">
          <p>
            Open Source Hub was created to connect projects to people and ease
            codebase onboarding.
          </p>
          <p>
            Maintainers can tag their projects to topics like 'education' and
            'social good', so contributors can search, select, and quickly
            onboard to the projects that matter most to them. OSH also offers a{" "}
            <Link to={ROUTES.VERIFIED} className="link">
              Verified Program
            </Link>{" "}
            for maintainers to have their projects highlighted on the website
            and within OSH's communities.
          </p>
          <p>
            Open Source Hub allows maintainers to provide contribution best
            practices, support guidance, and interactive visual walkthroughs of
            their codebase using CodeSee Maps.
          </p>
          <p>
            With Maps, understand how files are connected, see how a pull
            request fits into the larger architecture, and more.
          </p>
          <p>
            <ExternalLink href="https://www.codesee.io">
              Learn more about CodeSee Maps
            </ExternalLink>
          </p>
        </div>
      </main>
    </>
  );
};

export default About;
