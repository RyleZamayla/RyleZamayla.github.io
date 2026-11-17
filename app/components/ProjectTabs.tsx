import { useRef, useState } from "react";
import type { Project, ProjectKind } from "../content/types.ts";
import { FeaturedProject, ProjectList } from "./ProjectList";

const tabs: { kind: ProjectKind; label: string; note: string }[] = [
  { kind: "personal", label: "Personal projects", note: "Built on my own time." },
  {
    kind: "professional",
    label: "Company projects",
    note: "Systems I work on in my job. Their code is private, so they appear under generic names and are described from commit history only.",
  },
];

/** Two tabs, one per kind of project. Arrow keys move between tabs. */
export function ProjectTabs({ projects, featureFirst = false }: { projects: Project[]; featureFirst?: boolean }) {
  const [active, setActive] = useState<ProjectKind>("personal");
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  function onKeyDown(e: React.KeyboardEvent, i: number) {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = tabs[(i + step + tabs.length) % tabs.length]!;
    setActive(next.kind);
    refs.current[next.kind]?.focus();
  }

  const current = tabs.find((t) => t.kind === active)!;
  const list = projects.filter((p) => p.kind === active);
  const [first, ...rest] = list;

  return (
    <div className="ptabs">
      <div className="ptabs__list" role="tablist" aria-label="Project type">
        {tabs.map((t, i) => (
          <button
            key={t.kind}
            ref={(el) => {
              refs.current[t.kind] = el;
            }}
            type="button"
            role="tab"
            id={`ptab-${t.kind}`}
            aria-selected={active === t.kind}
            aria-controls="ptab-panel"
            tabIndex={active === t.kind ? 0 : -1}
            className="ptabs__tab"
            onClick={() => setActive(t.kind)}
            onKeyDown={(e) => onKeyDown(e, i)}
          >
            {t.label} <span className="ptabs__count">{projects.filter((p) => p.kind === t.kind).length}</span>
          </button>
        ))}
      </div>
      <div role="tabpanel" id="ptab-panel" aria-labelledby={`ptab-${active}`} key={active}>
        <p className="lede">{current.note}</p>
        {featureFirst && first ? (
          <>
            <FeaturedProject project={first} />
            <ProjectList projects={rest} />
          </>
        ) : (
          <ProjectList projects={list} />
        )}
      </div>
    </div>
  );
}
