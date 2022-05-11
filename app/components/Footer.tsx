import type { FC } from "react";
import { Link } from "@remix-run/react";
import CallToAction from "~/components/CallToAction";
import {
  HOW_TO_LIST_PROJECT_LINK,
  DISCORD_LINK,
  REPO_LINK,
  RESOURCES_LINK,
  // SIGNIN_LINK,
  // SIGNUP_LINK,
  LINK_FORMATS,
  ABOUR_LINK,
} from "~/utils/constants";
import CodeSeeWordmark from "~/images/CodeSeeWordmark";
import logo from "~/images/logo.png";

import gradientStyles from "~/styles/gradient.css";

export function links() {
  return [{ rel: "stylesheet", href: gradientStyles }];
}

const Footer: FC = () => (
  <footer className="bg-graident text-black-400 px-4 py-10">
    <Link to="/" className="block">
      <img src={logo} alt="" className="my-2 mx-auto" style={{ height: 35 }} />
    </Link>
    <div className="flex items-center justify-center text-center px-2 mt-7">
      <CallToAction
        href={HOW_TO_LIST_PROJECT_LINK}
        rel="noopener"
        target="_blank"
        format={LINK_FORMATS.primary}
        inverse={true}
      >
        List Your Project
      </CallToAction>
      {/* Temporarily hide */}
      {/* <CallToAction
        href={isLoggedIn ? HOW_TO_LIST_PROJECT_LINK : SIGNUP_LINK}
        rel="noopener"
        target="_blank"
        format={LINK_FORMATS.secondary}
        inverse={true}
        className="ml-5"
      >
        Contribute to a project
      </CallToAction>
      <CallToAction
        href={SIGNIN_LINK}
        format={LINK_FORMATS.custom}
        className="bg-yellow-300 text-black-500 ml-5"
      >
        Sign In
      </CallToAction> */}
    </div>
    <div className="text-sm text-white text-center font-semibold flex gap-6 justify-center mt-5 mb-12">
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={"/"}
        target="_blank"
        rel="noreferrer"
      >
        Projects
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={ABOUR_LINK}
        target="_blank"
        rel="noreferrer"
      >
        About
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={RESOURCES_LINK}
        target="_blank"
        rel="noreferrer"
      >
        Resources
      </a>
      <a
        className="supports-hover:hover:text-yellow-300 ml-1"
        href={DISCORD_LINK}
        target="_blank"
        rel="noreferrer"
      >
        Join Us
      </a>
    </div>
    <p className="text-sm text-center text-white flex items-center justify-center">
      Built with tea and love by
      <a
        className="opacity-100 supports-hover:hover:opacity-75 ml-1"
        href="https://www.codesee.io"
        target="_blank"
        rel="noreferrer"
        aria-label="CodeSee"
      >
        <CodeSeeWordmark width="100" className="h-4" />
      </a>
    </p>
  </footer>
);

export default Footer;
