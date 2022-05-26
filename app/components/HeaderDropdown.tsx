import { Form, Link } from "@remix-run/react";
import cx from "classnames";
import { FC, useEffect, useRef, useState } from "react";

const HeaderDropdown: FC = () => {
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
        className="bg-light-interactive-fill rounded-full w-6 h-6"
        type="button"
        onClick={() => setMenuIsOpen((prev) => !prev)}
      ></button>
      <div
        className={cx(
          "bg-white top-full rounded-lg py-2 right-0 w-56 flex flex-col shadow-2",
          {
            hidden: !menuIsOpen,
            absolute: menuIsOpen,
          }
        )}
      >
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
