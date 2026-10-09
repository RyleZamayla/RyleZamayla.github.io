import { useMemo, useState } from "react";
import { Link } from "react-router";
import { skills, skillGroups } from "../content/skills.ts";
import { allMilestones } from "../content/projects.ts";
import { formatDate } from "../lib/format.ts";
import { useReveal } from "../hooks/useReveal.ts";

const XP_CELLS = 4;

export function SkillTree() {
  const [selectedId, setSelectedId] = useState(skills[0]!.id);
  const index = useMemo(() => new Map(allMilestones().map((m) => [m.milestone.id, m])), []);
  const selected = skills.find((s) => s.id === selectedId)!;
  const evidence = selected.evidence.map((id) => index.get(id)!).filter(Boolean);
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.15);
  let nodeIndex = 0;

  return (
    <div className={`skilltree ${revealClass}`} ref={ref}>
      <div className="skilltree__branches">
        {skillGroups.map((group) => (
          <div key={group} className="branch">
            <h3 className="branch__name">{group}</h3>
            <ul className="branch__nodes">
              {skills
                .filter((s) => s.group === group)
                .map((s) => (
                  <li key={s.id} style={{ "--n": nodeIndex++ } as React.CSSProperties}>
                    <button
                      type="button"
                      className="node"
                      aria-pressed={s.id === selectedId}
                      aria-controls="skill-evidence"
                      onClick={() => setSelectedId(s.id)}
                    >
                      <span className="node__name">{s.name}</span>
                      <span className="node__count" aria-label={`${s.evidence.length} pieces of evidence`}>
                        {s.evidence.length}
                      </span>
                      <span className="xp" aria-hidden="true">
                        {Array.from({ length: XP_CELLS }, (_, i) => (
                          <span key={i} className={i < s.evidence.length ? "xp__cell is-full" : "xp__cell"} style={{ "--c": i } as React.CSSProperties} />
                        ))}
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <section id="skill-evidence" className="evidence" aria-live="polite" aria-labelledby="evidence-heading">
        <h3 id="evidence-heading" key={`h-${selectedId}`} className="unlock">
          {selected.name}: the evidence
        </h3>
        <ul key={selectedId} className="evidence__list">
          {evidence.map(({ project, milestone }, i) => (
            <li key={milestone.id} style={{ "--i": i } as React.CSSProperties}>
              <Link viewTransition to={`/projects/${project.slug}#${milestone.id}`}>{milestone.title}</Link>
              <span className="muted small">
                {" "}
                in {project.title}, {formatDate(milestone.date)}
                {milestone.ref ? `, ${milestone.refKind === "commit" ? "commit" : "build"} ${milestone.ref}` : ""}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
