import { Link } from "@remix-run/react";
import { FC } from "react";
import cx from "classnames";
import { UserInfo } from "~/types";
import { NAV_LINKS } from "./Header";
import CloseIcon from "./icons/CloseIcon";

type Props = {
  userInfo?: UserInfo | null;
  isOpen: boolean;
  onRequestClose: () => void;
};

const MobileNavigation: FC<Props> = ({ userInfo, isOpen, onRequestClose }) => (
  <div
    className={cx(
      "md:hidden fixed inset-0 transition-all bg-indigo-850 text-white p-8 flex flex-col items-center justify-center",
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
    >
      <CloseIcon />
    </button>
    {userInfo == null ? null : (
      // Hide the Log in/out buttons for now
      // <ButtonLink to={ROUTES.LOGIN} className="mb-8">
      //   Log in
      // </ButtonLink>
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
        <Link
          to={link.to}
          key={`mobile-link-${i}`}
          className="flex items-center justify-center"
        >
          {link.text}
        </Link>
      ))}
    </div>
  </div>
);

export default MobileNavigation;
