import { achievements } from "../content/achievements.ts";
import { useReveal } from "../hooks/useReveal.ts";

export function QuestLog() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.2);
  return (
    <div ref={ref} className={`questlog ${revealClass}`}>
      <p className="questlog__progress">
        <span className="questlog__bar" aria-hidden="true">
          <span />
        </span>
        {achievements.length} of {achievements.length} quests complete
      </p>
      <ul className="quests">
        {achievements.map((a, i) => (
          <li key={a.id} className="quest" style={{ "--i": i } as React.CSSProperties}>
            <span className="quest__check" aria-hidden="true" />
            <div>
              <h3>
                {a.title}
                <span className="xp-pop" aria-hidden="true">
                  +XP
                </span>
              </h3>
              <p>{a.detail}</p>
              <p className="muted small">Source: {a.source}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
