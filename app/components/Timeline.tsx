import type { Phase } from "../content/types.ts";
import { verificationLabel } from "../content/types.ts";
import { formatDate } from "../lib/format.ts";
import { useReveal } from "../hooks/useReveal.ts";

/** Development phases. Each phase can be collapsed; each milestone has its own anchor. */
export function Timeline({ phases }: { phases: Phase[] }) {
  return (
    <ol className="timeline">
      {phases.map((phase) => (
        <PhaseItem key={phase.title} phase={phase} />
      ))}
    </ol>
  );
}

/** Reveals on its own as it scrolls in: the marker lights up, then milestones slide out from the line. */
function PhaseItem({ phase }: { phase: Phase }) {
  const { ref, revealClass } = useReveal<HTMLLIElement>();
  return (
    <li ref={ref} className={`phase ${revealClass}`}>
      <details open>
        <summary>
          <span className="phase__title">{phase.title}</span>
          <span className="phase__period">{phase.period}</span>
        </summary>
        <p className="phase__summary">{phase.summary}</p>
        <ul className="milestones">
          {phase.milestones.map((m, i) => (
            <li key={m.id} id={m.id} className="milestone" style={{ "--i": i } as React.CSSProperties}>
              <h3 className="milestone__title">{m.title}</h3>
              <p className="milestone__meta">
                <time dateTime={m.date}>{formatDate(m.date)}</time>
                {m.ref && (
                  <span>
                    {m.refKind === "commit" ? "Commit " : "Build "}
                    <code>{m.ref}</code>
                  </span>
                )}
                <span className={`verify verify--${m.verification}`}>{verificationLabel[m.verification]}</span>
              </p>
              <p>{m.change}</p>
              <p className="muted">
                <strong>Why it mattered:</strong> {m.significance}
              </p>
            </li>
          ))}
        </ul>
      </details>
    </li>
  );
}
