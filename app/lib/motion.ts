/*
 * One switch controls every animation on the site: the class "motion-on" on
 * <html>. It's set before first paint by an inline script (so nothing flickers)
 * from the visitor's saved choice, falling back to their system setting.
 * The header's pause button flips it and remembers the choice.
 */
export const MOTION_KEY = "motion";

export const motionBootScript = `(function(){try{var d=document.documentElement.classList;var s=localStorage.getItem("${MOTION_KEY}");var rm=window.matchMedia("(prefers-reduced-motion: reduce)").matches;if(s==="on"||(s!=="off"&&!rm)){d.add("motion-on")}else{d.add("motion-off")}}catch(e){}})();`;

export function motionIsOn(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains("motion-on");
}

export function setMotion(on: boolean) {
  const c = document.documentElement.classList;
  c.toggle("motion-on", on);
  c.toggle("motion-off", !on);
  try {
    localStorage.setItem(MOTION_KEY, on ? "on" : "off");
  } catch {
    /* private mode: the choice just won't persist */
  }
}
