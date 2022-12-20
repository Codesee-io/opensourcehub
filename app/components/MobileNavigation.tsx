import { FC } from "react";
import cx from "classnames";
import { UserInfo } from "~/types";
import { COMMUNITY_LINKS, NAV_LINKS } from "./Header";
import CloseIcon from "./icons/CloseIcon";
import { ROUTES, SHOW_PROFILE_LINK } from "~/utils/constants";
import ButtonLink from "./ButtonLink";
import NavLink from "./NavLink";

type Props = {
  userInfo?: UserInfo | null;
  isOpen: boolean;
  onRequestClose: () => void;
};

const MobileNavigation: FC<Props> = ({ userInfo, isOpen, onRequestClose }) => (
  <div
    className={cx(
      "lg:hidden fixed inset-0 transition-all bg-indigo-850 text-white p-8 flex flex-col items-center justify-center",
      {
        "translate-x-0 opacity-100": isOpen,
        "translate-x-full opacity-0": !isOpen,
      }
    )}
  >
    <button
      type="button"
      className="p-2 absolute top-4 right-4"
      onClick={onRequestClose}
      name="Close the mobile navigation menu"
    >
      <CloseIcon />
    </button>
    {SHOW_PROFILE_LINK && userInfo == null && (
      <div className="flex gap-4 mb-8">
        <ButtonLink to={ROUTES.LOGIN}>Log in</ButtonLink>
        <ButtonLink to={ROUTES.LOGIN} variant="accent">
          Sign up
        </ButtonLink>
      </div>
    )}
    {userInfo != null && (
      <div
        className={cx("mb-8 transition-transform delay-75", {
          "-translate-y-4": !isOpen,
          "translate-y-0": isOpen,
        })}
      >
        {userInfo.pictureUrl && (
          <img
            src={userInfo.pictureUrl}
            className="w-16 h-16 rounded-full mx-auto shadow"
            alt="Your avatar"
          />
        )}
        <div className="overflow-hidden text-center opacity-90">
          <p
            className="text-xl font-semibold truncate"
            title={userInfo.displayName}
          >
            {userInfo.displayName}
          </p>
          <p className="text-lg truncate" title={userInfo.githubLogin}>
            {userInfo.githubLogin}
          </p>
        </div>
      </div>
    )}
    <div
      className={cx("space-y-4 text-xl transition-transform delay-75", {
        "translate-y-4": !isOpen,
        "translate-y-0": isOpen,
      })}
      onClick={onRequestClose}
    >
      {NAV_LINKS.map((link, i) => (
        <NavLink
          to={link.to}
          key={`mobile-link-${i}`}
          className="flex items-center justify-center"
        >
          {link.text}
        </NavLink>
      ))}
      {COMMUNITY_LINKS.map((link, i) => (
        <NavLink
          to={link.to}
          key={`mobile-community-link-${i}`}
          className="flex items-center justify-center"
        >
          {link.text}
        </NavLink>
      ))}
    </div>
  </div>
);

export default MobileNavigation;
