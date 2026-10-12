import { achievements } from "../content/achievements.ts";
import { useReveal } from "../hooks/useReveal.ts";
import { PixelIcon } from "./PixelIcon";

const QUEST_LABEL = { main: "Main quest", side: "Side quest" } as const;

/** A game-style quest journal. Each completed quest gets a stamp as it scrolls in. */
export function QuestLog() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.15);
  const total = achievements.length;
  return (
    <div ref={ref} className={`questlog ${revealClass}`}>
      <div className="questlog__bar-row">
        <p className="questlog__title">Journal</p>
        <p className="questlog__progress">
          <span className="questlog__bar" aria-hidden="true">
            <span />
          </span>
          {total}/{total} complete
        </p>
      </div>
      <ul className="quests">
        {achievements.map((a, i) => (
          <li key={a.id} className={`quest quest--${a.quest}`} style={{ "--i": i } as React.CSSProperties}>
            <span className="quest__icon">
              <PixelIcon name={a.quest} size={30} color={a.quest === "main" ? "#ff9e5e" : "#6fd3a6"} accent="#efe6d2" />
            </span>
            <div className="quest__body">
              <p className="quest__type">{QUEST_LABEL[a.quest]}</p>
              <h3>{a.title}</h3>
              <p>{a.detail}</p>
              <p className="quest__source">Source: {a.source}</p>
            </div>
            <span className="quest__stamp">Complete</span>
            <span className="xp-pop" aria-hidden="true">
              +XP
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
