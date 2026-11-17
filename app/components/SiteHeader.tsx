import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { profile } from "../content/profile.ts";
import { chapters, useChapterSpy } from "../lib/story.ts";
import { MotionToggle } from "./MotionToggle";

const sections = [
  { to: "/#about", label: "About" },
  { to: "/#skills", label: "Skills" },
  { to: "/#quests", label: "Quest log" },
  { to: "/#contact", label: "Contact" },
];

type Chapter = (typeof chapters)[number];

export function SiteHeader() {
  const header = useRef<HTMLElement>(null);
  const { pathname } = useLocation();
  const [chapter, setChapter] = useState<Chapter | null>(null);
  useChapterSpy(pathname === "/", setChapter);

  // Tell the page how tall the sticky header is so anchor links land below it.
  useEffect(() => {
    const el = header.current;
    if (!el) return;
    const set = () => document.documentElement.style.setProperty("--header-h", `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const here = chapter?.nav ?? null;
  return (
    <header ref={header} className="site-header">
      <div className="wrap site-header__inner">
        <Link to="/" viewTransition className="brand" aria-label={`${profile.name}, home`}>
          <span className="brand__mark" aria-hidden="true">
            RZ
          </span>
          <span className="brand__name">Ryle Zamayla</span>
        </Link>
        <nav aria-label="Main">
          <ul className="nav">
            <li>
              <NavLink to="/projects" end={false} viewTransition className={here === "/projects" ? "is-here" : undefined}>
                Projects
              </NavLink>
            </li>
            {sections.map((s) => (
              <li key={s.to}>
                <Link to={s.to} className={here === s.to ? "is-here" : undefined} aria-current={here === s.to ? "location" : undefined}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="hud-chapter" aria-hidden="true">
          {chapter && chapter.id !== "start" ? chapter.label : ""}
        </p>
        <MotionToggle />
      </div>
    </header>
  );
}
