import type { FC } from "react";
import { Link } from "@remix-run/react";
import {
  // HOW_TO_LIST_PROJECT_LINK,
  RESOURCES_LINK,
  ABOUT_LINK,
  DISCORD_LINK,
  // SIGNIN_LINK,
  // SIGNUP_LINK,
  // LINK_FORMATS,
} from "../utils/constants";
// import CallToAction from "./CallToAction";
import NavLink from "./NavLink";
import logo from "~/images/logo.png";

const Header: FC = () => (
  <header className="bg-indigo-850 sm:sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
      <Link to="/" className="block">
        <img src={logo} alt="" className="my-2" style={{ height: 35 }} />
      </Link>
      <div className="flex items-center justify-center text-white whitespace-nowrap">
        <div className="hidden sm:block">
          <NavLink to={"/"}>Projects</NavLink>
        </div>
        <div className="hidden sm:block">
          <NavLink to={RESOURCES_LINK}>Learn</NavLink>
        </div>
        <div className="hidden sm:block">
          <NavLink to={ABOUT_LINK}>About</NavLink>
        </div>
        <div className="hidden sm:block">
          <NavLink to={DISCORD_LINK}>
            <div className="flex">
              Discord
              <img
                src="/icon_clyde_white_RGB.png"
                alt=""
                className="pl-1"
                style={{
                  width: "24px",
                  height: "16px",
                  alignSelf: "center",
                }}
              />
            </div>
          </NavLink>
        </div>

        {/* Hide the "Log out" button for now
        <Form method="post" action="/logout">
          <button className="px-3 py-1 supports-hover:hover:bg-blue-900 inline-block rounded">
            Log out
          </button>
        </Form> */}

        {/* Temporarily hide */}
        {/* <div className="hidden md:block ml-5">
          <NavLink
            to={SIGNIN_LINK}
            className="text-yellow-300 hover:text-indigo-50"
          >
            Sign in
          </NavLink>
          <CallToAction
            href={SIGNUP_LINK}
            format={LINK_FORMATS.secondary}
            inverse={true}
          >
            Sign up
          </CallToAction>
        </div> */}
      </div>
    </div>
  </header>
);

export default Header;
