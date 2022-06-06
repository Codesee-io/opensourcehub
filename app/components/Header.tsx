import { FC } from "react";
import { Link } from "@remix-run/react";
import { RESOURCES_LINK, ABOUT_LINK, DISCORD_LINK } from "../utils/constants";
import NavLink from "./NavLink";
import logo from "~/images/logo.png";
import DiscordIcon from "./icons/DiscordIcon";
import HeaderDropdown from "./HeaderDropdown";
import { UserInfo } from "~/types";

type Props = {
  userInfo?: UserInfo | null;
};

const Header: FC<Props> = ({ userInfo }) => {
  return (
    <header className="bg-indigo-850 sm:sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="block" aria-label="Home">
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
              <div className="flex items-center gap-1">
                <span>Discord</span>
                <DiscordIcon role="img" className="w-5 h-5" />
              </div>
            </NavLink>
          </div>
          {/* Hide the Log in/out buttons for now  
          {userInfo ? (
            <HeaderDropdown userInfo={userInfo} />
          ) : (
            <NavLink to="/login">Log in</NavLink>
          )}*/}
        </div>
      </div>
    </header>
  );
};

export default Header;
