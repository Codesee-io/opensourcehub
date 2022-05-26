import { Form, Link } from "@remix-run/react";
import cx from "classnames";
import { FC, useEffect, useRef, useState } from "react";
import { UserInfo } from "~/types";

type Props = {
  userInfo: UserInfo;
};

const HeaderDropdown: FC<Props> = ({ userInfo }) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: Event) {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as HTMLElement)
      ) {
        setMenuIsOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  // TODO close the dropdown when an item is clicked

  return (
    <div className="relative flex ml-6" ref={containerRef}>
      <button
        className="bg-light-interactive-fill rounded-full w-8 h-8"
        type="button"
        onClick={() => setMenuIsOpen((prev) => !prev)}
      ></button>
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
        <div className="flex gap-4">
          {userInfo.pictureUrl && (
            <img
              src={userInfo.pictureUrl}
              className="w-5 h-5 rounded-full"
              alt="Your avatar"
            />
          )}
          <div>
            <p>{userInfo.displayName}</p>
            <p>{userInfo.githubLogin}</p>
          </div>
        </div>
        <Link
          to="/profile"
          className="text-sm text-light-type hover:text-light-interactive hover:bg-light-interactive-fill px-4 py-2"
        >
          Profile
        </Link>
        <Form method="post" action="/logout" className="w-full">
          <button className="text-sm w-full text-left text-brand-warm hover:bg-light-interactive-fill px-4 py-2">
            Log out
          </button>
        </Form>
      </div>
    </div>
  );
};

export default HeaderDropdown;
