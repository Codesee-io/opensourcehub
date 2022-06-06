import { FC, useEffect, useRef, useState } from "react";
import BannerMessage from "./BannerMessage";

const TIMER_MS = 10_000;

type Props = {
  kind: "success" | "error";
};

const FlashMessage: FC<Props> = ({ children, kind }) => {
  const [visible, setVisible] = useState(true);
  const timer = useRef<number>();

  useEffect(() => {
    function hideMessage() {
      setVisible(false);
    }

    timer.current = window.setTimeout(hideMessage, TIMER_MS);
  }, []);

  const hideManually = () => {
    setVisible(false);
    if (timer.current) {
      window.clearTimeout(timer.current);
    }
  };

  if (visible) {
    return (
      <BannerMessage kind={kind} onHide={hideManually} children={children} />
    );
  }
  return null;
};

export default FlashMessage;
