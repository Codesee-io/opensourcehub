import { FC, useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import { NavLinkData } from "./Header";
import SmartLink from "./SmartLink";

type Props = {
  links: NavLinkData[];
};

const NavDropdown: FC<Props> = (props) => {
  const [popupIsOpen, setPopupIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(function closeOnClickOutside() {
    function handleClickOutside(event: Event) {
      if (
        containerRef.current &&
        event.target &&
        !containerRef.current.contains(event.target as HTMLElement)
      ) {
        setPopupIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  });

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="px-3 py-1 supports-hover:hover:text-yellow-300 rounded-full"
        type="button"
        onClick={() => setPopupIsOpen((prev) => !prev)}
      >
        Community
      </button>
      <Dropdown isOpen={popupIsOpen} style={{ width: 140, right: "2rem" }}>
        {props.links.map((link, index) => (
          <SmartLink
            to={link.to}
            key={index}
            className="dropdown-item"
            onClick={() => setPopupIsOpen(false)}
          >
            {link.text}
          </SmartLink>
        ))}
      </Dropdown>
    </div>
  );
};

export default NavDropdown;
