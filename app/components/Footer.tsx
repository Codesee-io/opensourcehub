import type { FC } from "react";
import { Link } from "@remix-run/react";
import {
  DISCORD_LINK,
  HOW_CODESEE_WORKS_LINK,
  ROUTES,
} from "~/utils/constants";
import CodeSeeWordmark from "~/images/CodeSeeWordmark";
import logoPoweredBy from "~/images/powered_by_codesee.png";
import ButtonLink from "./ButtonLink";

const Footer: FC = () => (
  <footer className="bg-gradient text-black-400 px-4 py-10">
    <Link to={HOW_CODESEE_WORKS_LINK} className="block" aria-label="Home">
      <img src={logoPoweredBy} alt="" className="my-2 mx-auto" width="200" />
    </Link>
    <div className="flex items-center justify-center text-center px-2 mt-7">
      <ButtonLink to={ROUTES.CONTRIBUTE}>List Your Project</ButtonLink>
    </div>
    <div className="text-sm text-white text-center font-semibold flex flex-col md:flex-row gap-2 md:gap-6 justify-center mt-5 mb-4">
      <Link className="supports-hover:hover:text-yellow-300" to={ROUTES.HOME}>
        Projects
      </Link>
      <Link className="supports-hover:hover:text-yellow-300" to={ROUTES.ABOUT}>
        About
      </Link>
      <Link
        className="supports-hover:hover:text-yellow-300"
        to={ROUTES.CONTRIBUTE}
      >
        Contribute
      </Link>
      <a
        className="supports-hover:hover:text-yellow-300"
        href={DISCORD_LINK}
        target="_blank"
        rel="noreferrer"
      >
        Discord
      </a>
    </div>
    <div className="flex gap-2 md:gap-6 flex-col md:flex-row text-sm text-white text-center justify-center mb-10">
      <Link
        className="supports-hover:hover:text-yellow-300"
        to={ROUTES.PRIVACY}
      >
        Privacy
      </Link>
      <Link
        className="supports-hover:hover:text-yellow-300"
        to={ROUTES.TERMS_CONDITIONS}
      >
        Terms &amp; conditions
      </Link>
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
