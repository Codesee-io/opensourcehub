import type { FC } from "react";
import { Link } from "@remix-run/react";
import { DISCORD_LINK, RESOURCES_LINK, ROUTES } from "~/utils/constants";
import CodeSeeWordmark from "~/images/CodeSeeWordmark";
import logo from "~/images/logo.png";
import ButtonLink from "./ButtonLink";

const Footer: FC = () => (
  <footer className="bg-gradient text-black-400 px-4 py-10">
    <Link to="/" className="block" aria-label="Home">
      <img
        src={logo}
        alt=""
        className="my-2 mx-auto"
        style={{ height: 30, width: 180 }}
      />
    </Link>
    <div className="flex items-center justify-center text-center px-2 mt-7">
      <ButtonLink to="/contribute">List Your Project</ButtonLink>
    </div>
    <div className="text-sm text-white text-center font-semibold flex gap-6 justify-center mt-5 mb-12">
      <Link className="supports-hover:hover:text-yellow-300" to="/">
        Projects
      </Link>
      <Link className="supports-hover:hover:text-yellow-300" to={ROUTES.ABOUT}>
        About
      </Link>
      <Link
        className="supports-hover:hover:text-yellow-300"
        to={RESOURCES_LINK}
      >
        Resources
      </Link>
      <a
        className="supports-hover:hover:text-yellow-300"
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
