import { useEffect, useRef, useState } from "react";

const SEQUENCE = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

/** The Konami code toggles a CRT scanline mode. Purely cosmetic. */
export function CheatCode() {
  const progress = useRef(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      progress.current = key === SEQUENCE[progress.current] ? progress.current + 1 : key === SEQUENCE[0] ? 1 : 0;
      if (progress.current === SEQUENCE.length) {
        progress.current = 0;
        const on = document.documentElement.classList.toggle("crt");
        setMessage(on ? "Cheat accepted: CRT mode on. Enter it again to switch off." : "CRT mode off.");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3500);
    return () => clearTimeout(t);
  }, [message]);

  return (
    <div className={`toast${message ? " is-shown" : ""}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
