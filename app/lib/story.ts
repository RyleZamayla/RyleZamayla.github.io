import { useEffect, useRef } from "react";

/*
 * Scroll-driven chapters ("pinned" mode).
 *
 * On a big screen with animations on, a chapter is a tall section holding a
 * full-height stage that sticks to the screen while you scroll through it. The
 * hook below reads how far through the chapter you are and publishes it to CSS
 * as --p (0 to 1) and --sp (progress within the current step), and marks which
 * step is active. All the visuals are plain CSS reacting to those values.
 *
* Everything degrades: on short screens (phones held sideways), with animations paused or with
 * reduced motion, <html> never gets "story-pinned", chapters are ordinary
 * sections and every step is simply visible, one after another.
 */
export const PIN_QUERY = "(min-height: 560px)";

/** Runs before first paint (after the motion script) so the page never jumps when it hydrates. */
export const storyBootScript = `(function(){try{var d=document.documentElement;if(d.classList.contains("motion-on")&&window.matchMedia("${PIN_QUERY}").matches){d.classList.add("story-pinned")}}catch(e){}})();`;

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Keeps <html class="story-pinned"> in step with screen size and the animation switch. */
export function useStoryPinning() {
  useEffect(() => {
    const d = document.documentElement;
    const mq = window.matchMedia(PIN_QUERY);
    const sync = () => {
      const want = mq.matches && d.classList.contains("motion-on");
      if (want !== d.classList.contains("story-pinned")) d.classList.toggle("story-pinned", want);
    };
    sync();
    mq.addEventListener("change", sync);
    const mo = new MutationObserver(sync);
    mo.observe(d, { attributes: true, attributeFilter: ["class"] });
    return () => {
      mq.removeEventListener("change", sync);
      mo.disconnect();
    };
  }, []);
}

/**
 * Wires one chapter. Elements inside it with data-step-i="n" are the steps and
 * get is-active / is-past / is-next; elements with data-pip-i="n" are progress
 * markers and get is-active / is-done.
 */
export function useChapter<T extends HTMLElement>(steps: number) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const d = document.documentElement;
    const stepEls = Array.from(el.querySelectorAll<HTMLElement>("[data-step-i]"));
    const pipEls = Array.from(el.querySelectorAll<HTMLElement>("[data-pip-i]"));
    let raf = 0;
    let current = -1;

    const clear = () => {
      current = -1;
      stepEls.forEach((n) => n.classList.remove("is-active", "is-past", "is-next"));
      pipEls.forEach((n) => n.classList.remove("is-active", "is-done"));
      el.classList.remove("is-late");
      el.style.removeProperty("--p");
      el.style.removeProperty("--sp");
      delete el.dataset.step;
    };
    const apply = (i: number) => {
      current = i;
      stepEls.forEach((n) => {
        const k = Number(n.dataset.stepI);
        n.classList.toggle("is-active", k === i);
        n.classList.toggle("is-past", k < i);
        n.classList.toggle("is-next", k > i);
      });
      pipEls.forEach((n) => {
        const k = Number(n.dataset.pipI);
        n.classList.toggle("is-active", k === i);
        n.classList.toggle("is-done", k < i);
      });
      el.dataset.step = String(i);
    };
    const update = () => {
      raf = 0;
      if (!d.classList.contains("story-pinned")) {
        if (current !== -1 || el.style.getPropertyValue("--p")) clear();
        return;
      }
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      if (span <= 0) return;
      const p = clamp(-r.top / span);
      const i = Math.min(steps - 1, Math.floor(p * steps));
      el.style.setProperty("--p", p.toFixed(4));
      el.style.setProperty("--sp", clamp(p * steps - i).toFixed(3));
      el.classList.toggle("is-late", p > 0.5);
      if (i !== current) apply(i);
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    // Tabbing into a step that is currently hidden brings that step up.
    const onFocusIn = (e: FocusEvent) => {
      if (!d.classList.contains("story-pinned")) return;
      const step = (e.target as HTMLElement).closest<HTMLElement>("[data-step-i]");
      if (!step) return;
      const i = Number(step.dataset.stepI);
      if (i === current) return;
      const r = el.getBoundingClientRect();
      const span = r.height - window.innerHeight;
      window.scrollTo({ top: window.scrollY + r.top + span * ((i + 0.5) / steps), behavior: "instant" as ScrollBehavior });
    };

    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    el.addEventListener("focusin", onFocusIn);
    const mo = new MutationObserver(queue);
    mo.observe(d, { attributes: true, attributeFilter: ["class"] });
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      el.removeEventListener("focusin", onFocusIn);
      mo.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [steps]);
  return ref;
}

/** The chapters in order, for the header's "you are here" label. */
export const chapters = [
  { id: "start", label: "Title screen", nav: null },
  { id: "about", label: "Chapter I · The hub", nav: "/#about" },
  { id: "side-quests", label: "Chapter II · Side quests", nav: "/projects" },
  { id: "main-quest", label: "Chapter III · The main quest", nav: "/projects" },
  { id: "skills", label: "Chapter IV · Skill tree", nav: "/#skills" },
  { id: "quests", label: "Chapter V · Loot", nav: "/#quests" },
  { id: "contact", label: "Epilogue · Checkpoint", nav: "/#contact" },
] as const;

/** Which chapter is under the header right now. Only meaningful on the home page. */
export function useChapterSpy(enabled: boolean, onChange: (c: (typeof chapters)[number] | null) => void) {
  useEffect(() => {
    if (!enabled) {
      onChange(null);
      return;
    }
    let raf = 0;
    let last = "";
    const update = () => {
      raf = 0;
      const line = window.innerHeight * 0.35;
      let found: (typeof chapters)[number] | null = null;
      for (const c of chapters) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) found = c;
      }
      const id = found?.id ?? "";
      if (id !== last) {
        last = id;
        onChange(found);
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    update();
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      cancelAnimationFrame(raf);
    };
  }, [enabled, onChange]);
}
