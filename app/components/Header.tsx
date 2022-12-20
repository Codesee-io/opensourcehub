import { FC, ReactNode, useEffect, useState } from "react";
import { Link, useLocation } from "@remix-run/react";
import {
  ROUTES,
  DISCORD_LINK,
  SHOW_PROFILE_LINK,
  HOW_CODESEE_WORKS_LINK,
  RESOURCES_LINK,
} from "../utils/constants";
import NavLink from "./NavLink";
import wordmark from "~/images/osh_wordmark.svg";
import DiscordIcon from "./icons/DiscordIcon";
import { UserInfo } from "~/types";
import MenuIcon from "./icons/MenuIcon";
import MobileNavigation from "./MobileNavigation";
import HeaderDropdown from "./HeaderDropdown";
import CodeSeeWordmark from "~/images/CodeSeeWordmark";
import NavDropdown from "./NavDropdown";

type Props = {
  userInfo?: UserInfo | null;
};

export const NAV_LINKS: NavLinkData[] = [
  {
    to: ROUTES.HOME,
    text: "Projects",
  },
  {
    to: ROUTES.CONTRIBUTE,
    text: "Contribute",
  },
  {
    to: HOW_CODESEE_WORKS_LINK,
    text: "CodeSee ❤️ Open Source",
  },
];

export const COMMUNITY_LINKS: NavLinkData[] = [
  {
    to: DISCORD_LINK,
    text: (
      <>
        Discord
        <DiscordIcon role="img" className="ml-1 w-5 h-5" />
      </>
    ),
  },
  {
    to: ROUTES.ABOUT,
    text: "About",
  },
  {
    to: RESOURCES_LINK,
    text: "Resources",
  },
];

export type NavLinkData = {
  to: string;
  text: ReactNode;
};

function bodyScrollLock(enable: boolean) {
  if (enable) {
    document.body.classList.add("overflow-hidden");
  } else {
    document.body.classList.remove("overflow-hidden");
  }
}

const Header: FC<Props> = ({ userInfo }) => {
  const [isMobileNavVisible, setShowMobileNav] = useState(false);
  const [showCommunityDropdown, setShowCommunityDropdown] = useState(false);

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
        <div className="flex items-center">
          <a
            className="opacity-100 supports-hover:hover:opacity-75 ml-1"
            href={HOW_CODESEE_WORKS_LINK}
            target="_blank"
            rel="noreferrer"
            aria-label="CodeSee"
          >
            <CodeSeeWordmark width="100" className="h-4" />
          </a>
          <span className="inline-block mx-4 rotate-12 w-px bg-white opacity-50 h-6" />
          <Link to="/" className="flex items-center" aria-label="Home">
            <img
              src={wordmark}
              alt=""
              className="my-2"
              style={{ height: 21, width: 216 }}
            />
          </Link>
        </div>
        <button
          type="button"
          className="p-2 text-white lg:hidden"
          onClick={showMobileNav}
          aria-label="Show the mobile navigation menu"
        >
          <MenuIcon />
        </button>
        <div className="hidden lg:flex items-center justify-center text-white whitespace-nowrap">
          {NAV_LINKS.map((link, index) => (
            <div className="hidden sm:block" key={`link-${index}`}>
              <NavLink to={link.to}>{link.text}</NavLink>
            </div>
          ))}
          <NavDropdown links={COMMUNITY_LINKS} />
          {SHOW_PROFILE_LINK && userInfo && (
            <HeaderDropdown userInfo={userInfo} />
          )}
          {SHOW_PROFILE_LINK && userInfo == null && (
            <>
              <NavLink to={ROUTES.LOGIN}>Log in</NavLink>
              <Link
                className="bg-brand-highlight text-black-500 rounded-full px-4 py-1 ml-4 font-medium hover:opacity-80"
                to={ROUTES.LOGIN}
              >
                Sign up
              </Link>
            </>
          )}
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
