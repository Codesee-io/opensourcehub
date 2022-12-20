import { FC, useEffect, useRef, useState } from "react";
import cx from "classnames";

const WORDS = ["understandable", "actionable", "visible"];

enum AnimState {
  Idle = "idle",
  Deleting = "deleting",
  Typing = "typing",
}

type State = {
  animState: AnimState;
  charIndex: number;
  wordIndex: number;
};

const useTypewriter = () => {
  const [state, setState] = useState<State>({
    animState: AnimState.Idle,
    charIndex: WORDS[0].length,
    wordIndex: 0,
  });

  const interval = useRef(-1);

  useEffect(() => {
    const startDeleting = () => {
      setState((prev) => ({
        animState: AnimState.Deleting,
        charIndex: WORDS[prev.wordIndex].length - 1,
        wordIndex: prev.wordIndex,
      }));

      interval.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.charIndex > 0) {
            return { ...prev, charIndex: prev.charIndex - 1 };
          } else {
            // We're done, start typing again
            window.clearInterval(interval.current);
            interval.current = window.setTimeout(() => startTyping(), 500);

            return { ...prev, charIndex: 0 };
          }
        });
      }, 50);
    };

    const startTyping = () => {
      setState((prev) => ({
        animState: AnimState.Typing,
        wordIndex: (prev.wordIndex + 1) % WORDS.length,
        charIndex: 1,
      }));

      interval.current = window.setInterval(() => {
        setState((prev) => {
          if (prev.charIndex < WORDS[prev.wordIndex].length - 1) {
            return {
              ...prev,
              charIndex: prev.charIndex + 1,
            };
          } else {
            // We're done, start idling
            window.clearInterval(interval.current);
            startIdling();

            return {
              ...prev,
              charIndex: WORDS[prev.wordIndex].length,
            };
          }
        });
      }, 50);
    };

    const startIdling = () => {
      setState((prev) => ({ ...prev, animState: AnimState.Idle }));
      interval.current = window.setTimeout(() => startDeleting(), 2000);
    };

    // Start deleting in x seconds
    interval.current = window.setTimeout(() => startDeleting(), 3000);

    return () => {
      window.clearTimeout(interval.current);
      window.clearInterval(interval.current);
    };
  }, []);

  return {
    currentText: WORDS[state.wordIndex].substring(0, state.charIndex),
    isAnimating:
      state.animState === AnimState.Typing ||
      state.animState === AnimState.Deleting,
  };
};

const AnimatedTitle: FC = () => {
  const { currentText, isAnimating } = useTypewriter();

  return (
    <h1 className="text-yellow-300 font-semibold text-3xl px-2 lg:text-4xl text-center mb-6">
      Open Source is <br className="lg:hidden" />
      <span className="text-white inline-block text-left transition-opacity">
        {currentText}
      </span>
      <span
        className={cx("pointer-events-none", { "animate-blink": !isAnimating })}
      >
        |
      </span>
    </h1>
  );
};

export default AnimatedTitle;
