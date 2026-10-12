import { useEffect, useRef, useState } from "react";
import { motionIsOn } from "../lib/motion.ts";

/*
 * Plays an entrance animation the first time an element scrolls into view.
 * Content is only hidden once JavaScript has run AND motion is on ("armed"),
 * so without JS, or with motion paused, everything is simply visible.
 */
export function useReveal<T extends Element>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "armed" | "in">("idle");

  useEffect(() => {
    const el = ref.current;
    if (!el || !motionIsOn() || !("IntersectionObserver" in window)) return;
    setState("armed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setState("in");
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  const revealClass = state === "idle" ? "" : state === "armed" ? "reveal-armed" : "reveal-armed is-in";
  return { ref, revealClass };
}
