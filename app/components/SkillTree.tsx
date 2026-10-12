import { useMemo, useState } from "react";
import { Link } from "react-router";
import { skills, skillGroups } from "../content/skills.ts";
import { allMilestones } from "../content/projects.ts";
import { formatDate } from "../lib/format.ts";
import { useReveal } from "../hooks/useReveal.ts";
import { PixelIcon } from "./PixelIcon";

const MAX_LEVEL = 4;

/*
 * An RPG-style talent tree. A skill's level is simply how many verified
 * milestones show it (capped at 4), so the "levels" are evidence, not a
 * self-rating, and the page says so.
 */
export function SkillTree() {
  const [selectedId, setSelectedId] = useState(skills[0]!.id);
  const index = useMemo(() => new Map(allMilestones().map((m) => [m.milestone.id, m])), []);
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.1);

  const selected = skills.find((s) => s.id === selectedId)!;
  const evidence = selected.evidence.map((id) => index.get(id)!).filter(Boolean);
  const projectCount = new Set(evidence.map((e) => e.project.slug)).size;
  const level = Math.min(selected.evidence.length, MAX_LEVEL);
  let nodeIndex = 0;

  return (
    <div className={`skilltree ${revealClass}`} ref={ref}>
      <p className="skilltree__key">
        <span className="gem gem--2" aria-hidden="true" /> {skills.length} skills in {skillGroups.length} branches. 1 level
        = 1 verified milestone.
      </p>
      <div className="skilltree__layout">
        <div className="skilltree__branches">
          {skillGroups.map((group) => {
            const groupSkills = skills.filter((s) => s.group === group);
            return (
              <section key={group} className="branch" aria-labelledby={`branch-${group}`}>
                <header className="branch__head">
                  <span className="branch__icon">
                    <PixelIcon name={group} size={22} />
                  </span>
                  <h3 id={`branch-${group}`} className="branch__name">
                    {group}
                  </h3>
                  <span className="branch__count">{groupSkills.length}</span>
                </header>
                <ul className="branch__nodes">
                  {groupSkills.map((s) => {
                    const lv = Math.min(s.evidence.length, MAX_LEVEL);
                    return (
                      <li key={s.id} style={{ "--n": nodeIndex++ } as React.CSSProperties}>
                        <button
                          type="button"
                          className="node"
                          aria-pressed={s.id === selectedId}
                          aria-controls="skill-evidence"
                          aria-label={`${s.name}, level ${lv}`}
                          onClick={() => setSelectedId(s.id)}
                        >
                          <span className={`gem gem--${lv}`} aria-hidden="true" />
                          <span className="node__name">{s.name}</span>
                          <span className="node__lv" aria-hidden="true">
                            Lv {lv}
                          </span>
                          <span className="xp" aria-hidden="true">
                            {Array.from({ length: MAX_LEVEL }, (_, i) => (
                              <span
                                key={i}
                                className={i < lv ? "xp__cell is-full" : "xp__cell"}
                                style={{ "--c": i } as React.CSSProperties}
                              />
                            ))}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>

        <section id="skill-evidence" className="evidence" aria-live="polite" aria-labelledby="evidence-heading">
          <div className="evidence__head" key={`h-${selectedId}`}>
            <span className={`gem gem--lg gem--${level} unlock-gem`} aria-hidden="true" />
            <div>
              <h3 id="evidence-heading" className="unlock">
                {selected.name}
              </h3>
              <p className="evidence__meta">
                <span>
                  Lv {level}
                  {level === MAX_LEVEL ? " (max)" : ""}
                </span>
                <span>
                  {projectCount} {projectCount === 1 ? "project" : "projects"}
                </span>
                <span>{selected.group}</span>
              </p>
            </div>
          </div>
          <p className="evidence__label">Unlocked by</p>
          <ul key={selectedId} className="evidence__list">
            {evidence.map(({ project, milestone }, i) => (
              <li key={milestone.id} style={{ "--i": i } as React.CSSProperties}>
                <Link viewTransition to={`/projects/${project.slug}#${milestone.id}`}>
                  {milestone.title}
                </Link>
                <span className="muted small">
                  {project.title} · {formatDate(milestone.date)}
                  {milestone.ref ? ` · ${milestone.refKind === "commit" ? "commit" : "build"} ${milestone.ref}` : ""}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
