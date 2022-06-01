import { Form, Link } from "@remix-run/react";
import cx from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { UserInfo } from "~/types";
import UserIcon from "./icons/UserIcon";

type Props = {
  userInfo: UserInfo;
};

const HeaderDropdown: FC<Props> = ({ userInfo }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(function closeOnClickOutside() {
    function handleClickOutside(event: Event) {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as HTMLElement)
      ) {
        setMenuIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative flex ml-6" ref={containerRef}>
      <button
        className="p-1 supports-hover:hover:text-yellow-300 rounded-full"
        type="button"
        onClick={() => setMenuIsOpen((prev) => !prev)}
      >
        <UserIcon className="w-6 h-6" />
      </button>
      <div
        className={cx(
          "bg-white top-full mt-2 rounded-lg py-2 -right-2 w-56 flex flex-col shadow-2",
          {
            hidden: !menuIsOpen,
            absolute: menuIsOpen,
          }
        )}
      >
        <span className="bottom-full right-4 border-8 border-transparent border-b-white absolute w-0 h-0" />
        <div className="flex gap-2 px-4 py-2 border-b mb-2">
          {userInfo.pictureUrl && (
            <img
              src={userInfo.pictureUrl}
              className="w-10 h-10 rounded-full"
              alt="Your avatar"
            />
          )}
          <div className="overflow-hidden">
            <p
              className="text-sm text-light-type font-semibold truncate"
              title={userInfo.displayName}
            >
              {userInfo.displayName}
            </p>
            <p
              className="text-xs text-light-type-medium truncate"
              title={userInfo.githubLogin}
            >
              {userInfo.githubLogin}
            </p>
          </div>
        </div>
        <Link
          to="/profile"
          className="text-sm text-light-type hover:text-light-interactive hover:bg-light-interactive-fill px-4 py-2"
          onClick={() => setMenuIsOpen((prev) => !prev)}
        >
          Profile
        </Link>
        <Form
          method="post"
          action="/logout"
          className="w-full"
          onSubmit={() => setMenuIsOpen((prev) => !prev)}
        >
          <button className="text-sm w-full text-left text-brand-warm hover:bg-light-interactive-fill px-4 py-2">
            Log out
          </button>
        </Form>
      </div>
    </div>
  );
};

export default HeaderDropdown;
