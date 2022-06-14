import { FC } from "react";
import DoubleArrowIcon from "./icons/DoubleArrowIcon";

function scrollToTheTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

const BackToTopButton: FC = () => (
  <button
    onClick={scrollToTheTop}
    type="button"
    className="w-12 h-12 rounded-full sticky bottom-6 left-4 md:hidden bg-light-interactive-fill text-light-interactive flex items-center justify-center shadow-lg"
    style={{ marginTop: "calc(100vh + 4rem)" }}
  >
    <DoubleArrowIcon className="-rotate-90" />
  </button>
);

export default BackToTopButton;
