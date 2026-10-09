import { useEffect, useRef, useState } from "react";
import { useReveal } from "../hooks/useReveal.ts";
import { motionIsOn } from "../lib/motion.ts";

/** A section whose divider draws across, heading wipes in and content rises as it scrolls into view. */
export function Band({
  id,
  alt = false,
  labelledBy,
  children,
}: {
  id: string;
  alt?: boolean;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const { ref, revealClass } = useReveal<HTMLElement>();
  return (
    <section ref={ref} id={id} className={`band${alt ? " band--alt" : ""} ${revealClass}`} aria-labelledby={labelledBy}>
      <div className="wrap">{children}</div>
    </section>
  );
}

/** Generic wrapper: "rise" moves up into place, "wipe" reveals left to right. */
export function Reveal({
  variant = "rise",
  className = "",
  children,
}: {
  variant?: "rise" | "wipe";
  className?: string;
  children: React.ReactNode;
}) {
  const { ref, revealClass } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal reveal--${variant} ${className} ${revealClass}`}>
      {children}
    </div>
  );
}

/**
 * Whole numbers like "1,427" count up from zero once visible. The real value is
 * always in the HTML and announced to screen readers; only the visual ticks.
 */
export function CountUp({ value }: { value: string }) {
  const numeric = /^\d[\d,]*$/.test(value) ? Number(value.replace(/,/g, "")) : null;
  const { ref, revealClass } = useReveal<HTMLSpanElement>();
  const [shown, setShown] = useState<string>(value);
  const started = useRef(false);

  useEffect(() => {
    if (numeric === null || !motionIsOn()) return;
    if (revealClass === "reveal-armed") setShown("0");
    if (!revealClass.includes("is-in") || started.current) return;
    started.current = true;
    const steps = 12;
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setShown(Math.round((numeric * i) / steps).toLocaleString("en-US"));
      if (i >= steps) clearInterval(timer);
    }, 55);
    return () => clearInterval(timer);
  }, [numeric, revealClass]);

  if (numeric === null) return <>{value}</>;
  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown}</span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

/** A thin pixel bar along the top of the screen that fills as you scroll. */
export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let frame = 0;
    function update() {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      // Snap to 2% steps so it moves like a pixel meter, not a smooth slider.
      if (bar.current) bar.current.style.transform = `scaleX(${Math.round(ratio * 50) / 50})`;
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
