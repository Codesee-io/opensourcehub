import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import { ROUTES, DISCORD_LINK } from "../utils/constants";
import NavLink from "./NavLink";
import logo from "~/images/logo.png";
import DiscordIcon from "./icons/DiscordIcon";
import { UserInfo } from "~/types";
import MenuIcon from "./icons/MenuIcon";
import MobileNavigation from "./MobileNavigation";

type Props = {
  userInfo?: UserInfo | null;
};

export const NAV_LINKS = [
  {
    to: ROUTES.HOME,
    text: "Projects",
  },
  {
    to: ROUTES.CONTRIBUTE,
    text: "Contribute",
  },
  {
    to: ROUTES.ABOUT,
    text: "About",
  },
  // Hide the resources page until the content is ready
  // {
  //   to: RESOURCES_LINK,
  //   text: "Resources",
  // },
  {
    to: DISCORD_LINK,
    text: (
      <>
        Discord
        <DiscordIcon role="img" className="ml-1 w-5 h-5" />
      </>
    ),
  },
];

function bodyScrollLock(enable: boolean) {
  if (enable) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
}

const Header: FC<Props> = ({ userInfo }) => {
  const [isMobileNavVisible, setShowMobileNav] = useState(false);

  // Hide the mobile nav when we navigate around
  const { pathname } = useLocation();
  useEffect(() => {
    hideMobileNav();
  }, [pathname]);

  const hideMobileNav = () => {
    setShowMobileNav(false);
    bodyScrollLock(false);
  };

  const showMobileNav = () => {
    setShowMobileNav(true);
    bodyScrollLock(true);
  };

  return (
    <header className="bg-indigo-850 sticky top-0 z-40 h-12 flex items-center">
      <div className="max-w-7xl mx-auto flex px-4 items-center justify-between w-full">
        <Link to="/" className="block" aria-label="Home">
          <img
            src={logo}
            alt=""
            className="my-2"
            style={{ height: 30, width: 180 }}
          />
        </Link>
        <button
          type="button"
          className="p-2 text-white md:hidden"
          onClick={showMobileNav}
          aria-label="Show the mobile navigation menu"
        >
          <MenuIcon />
        </button>
        <div className="hidden md:flex items-center justify-center text-white whitespace-nowrap">
          {NAV_LINKS.map((link, index) => (
            <div className="hidden sm:block" key={`link-${index}`}>
              <NavLink to={link.to}>{link.text}</NavLink>
            </div>
          ))}
          {/* Hide the Log in/out buttons for now  
          {userInfo ? (
            <HeaderDropdown userInfo={userInfo} />
          ) : (
            <NavLink to={ROUTES.LOGIN}>Log in</NavLink>
          )}*/}
        </div>
      </div>
      <MobileNavigation
        isOpen={isMobileNavVisible}
        userInfo={userInfo}
        onRequestClose={hideMobileNav}
      />
    </header>
  );
};

export default Header;
