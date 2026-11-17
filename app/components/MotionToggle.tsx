import { useEffect, useState } from "react";
import { motionIsOn, setMotion } from "../lib/motion.ts";

/** Pause or play every animation on the site. Rendered after hydration only. */
export function MotionToggle() {
  const [on, setOn] = useState<boolean | null>(null);
  useEffect(() => setOn(motionIsOn()), []);
  if (on === null) return <span className="motion-toggle motion-toggle--placeholder" aria-hidden="true" />;

  return (
    <button
      type="button"
      className="motion-toggle"
      aria-pressed={!on}
      onClick={() => {
        setMotion(!on);
        setOn(!on);
      }}
    >
      <span className={`motion-toggle__icon ${on ? "is-pause" : "is-play"}`} aria-hidden="true" />
      <span className="motion-toggle__label">{on ? "Pause animations" : "Play animations"}</span>
    </button>
  );
}
