import type { Phase } from "../content/types.ts";
import { verificationLabel } from "../content/types.ts";
import { formatDate } from "../lib/format.ts";

/** Development phases. Each phase can be collapsed; each milestone has its own anchor. */
export function Timeline({ phases }: { phases: Phase[] }) {
  return (
    <ol className="timeline">
      {phases.map((phase) => (
        <li key={phase.title} className="phase">
          <details open>
            <summary>
              <span className="phase__title">{phase.title}</span>
              <span className="phase__period">{phase.period}</span>
            </summary>
            <p className="phase__summary">{phase.summary}</p>
            <ul className="milestones">
              {phase.milestones.map((m) => (
                <li key={m.id} id={m.id} className="milestone">
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
      ))}
    </ol>
  );
}
