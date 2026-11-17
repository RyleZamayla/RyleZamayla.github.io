import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { formatDate } from "../lib/format.ts";
import { RARITY_LABEL, RARITY_ORDER, RARITY_RULE, loot, sortLoot, totalXp, type Loot } from "../lib/loot.ts";
import { useReveal } from "../hooks/useReveal.ts";
import { PixelArt, chestClosedRows, chestOpenRows, chestPalette } from "./PixelArt";
import { PixelIcon } from "./PixelIcon";
import { CountUp } from "./Reveal";

const QUEST_LABEL = { main: "Main quest", side: "Side quest" } as const;
const FIRST_PAGE = 6;

type Filter = "all" | "main" | "side";
type Sort = "recent" | "rarity";

/** The proof behind a quest: each milestone links to its spot on the project's timeline. */
function Proof({ l }: { l: Loot }) {
  if (l.proof.length === 0) return <p className="quest__source">Source: {l.achievement.source}</p>;
  return (
    <details className="quest__proof">
      <summary>
        Show the proof <span>({l.proof.length} {l.proof.length === 1 ? "milestone" : "milestones"})</span>
      </summary>
      <ul>
        {l.proof.map((p) => (
          <li key={p.id}>
            <Link to={`/projects/${p.projectSlug}#${p.id}`}>{p.title}</Link>
            <small>
              {p.projectTitle} · {formatDate(p.date)}
            </small>
          </li>
        ))}
      </ul>
      <p className="quest__source">Source: {l.achievement.source}</p>
    </details>
  );
}

function RarityBadge({ r }: { r: Loot["rarity"] }) {
  return <span className={`rarity rarity--${r}`}>{RARITY_LABEL[r]}</span>;
}

/** A loot card: the quest, how rare it is, and the receipts. */
function LootCard({ l, i }: { l: Loot; i: number }) {
  const a = l.achievement;
  return (
    <li className={`quest quest--${a.quest} loot--${l.rarity}`} style={{ "--i": i } as React.CSSProperties}>
      <span className="quest__icon">
        <PixelIcon name={a.quest} size={30} color={a.quest === "main" ? "#ff9e5e" : "#6fd3a6"} accent="#efe6d2" />
      </span>
      <div className="quest__body">
        <p className="quest__type">
          <span>{QUEST_LABEL[a.quest]}</span>
          <RarityBadge r={l.rarity} />
          <span className="quest__xp">+{l.xp} XP</span>
        </p>
        <h3>{a.title}</h3>
        <p>{a.detail}</p>
        {l.projects.length > 0 && (
          <p className="quest__meta">
            {l.date && <time dateTime={l.date}>{formatDate(l.date)}</time>}
            {l.date && " · "}
            {l.projects.join(", ")}
          </p>
        )}
        <Proof l={l} />
      </div>
      <span className="quest__stamp">Complete</span>
    </li>
  );
}

/**
 * A game-style journal: every quest is complete, each with a rarity, XP and
 * proof. Filter and sort it, or open the chest for a random drop.
 */
export function QuestLog() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.1);
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<Sort>("recent");
  const [all, setAll] = useState(false);
  const [drop, setDrop] = useState<Loot | null>(null);
  const [rolls, setRolls] = useState(0);
  // While the chest is rolling, `reel` holds the loot currently flashing by.
  const [reel, setReel] = useState<Loot | null>(null);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const counts = useMemo(() => ({ all: loot.length, main: loot.filter((l) => l.achievement.quest === "main").length, side: loot.filter((l) => l.achievement.quest === "side").length }), []);
  const shown = useMemo(() => sortLoot(loot.filter((l) => filter === "all" || l.achievement.quest === filter), sort), [filter, sort]);
  const visible = all ? shown : shown.slice(0, FIRST_PAGE);
  const legendary = loot.filter((l) => l.rarity === "legendary").length;
  const projectsTouched = new Set(loot.flatMap((l) => l.projects)).size;

  const ROLL_MS = 2400;
  const openChest = () => {
    if (reel) return;
    // Fair roll, but never the same drop twice in a row.
    const pool = loot.filter((l) => l !== drop);
    const final = pool[Math.floor(Math.random() * pool.length)]!;
    const land = () => {
      setReel(null);
      setDrop(final);
      setRolls((n) => n + 1);
    };
    if (!document.documentElement.classList.contains("motion-on")) return land();
    // A slot-machine reel: quick flashes that slow down, then land on the drop.
    setDrop(null);
    const start = performance.now();
    let last: Loot | undefined;
    const tick = () => {
      const t = (performance.now() - start) / ROLL_MS;
      if (t >= 1) return land();
      let next = loot[Math.floor(Math.random() * loot.length)]!;
      if (next === last) next = loot[(loot.indexOf(next) + 1) % loot.length]!;
      last = next;
      setReel(next);
      timer.current = window.setTimeout(tick, 60 + t * t * 320);
    };
    tick();
  };

  return (
    <div ref={ref} className={`questlog ${revealClass}`}>
      <ul className="loot__stats" aria-label="Loot totals">
        <li>
          <b>
            {loot.length}/{loot.length}
          </b>
          <span>quests complete</span>
        </li>
        <li>
          <b>
            <CountUp value={String(totalXp)} />
          </b>
          <span>loot XP</span>
        </li>
        <li>
          <b>{legendary}</b>
          <span>legendary drops</span>
        </li>
        <li>
          <b>{projectsTouched}</b>
          <span>projects touched</span>
        </li>
      </ul>

      <div className="loot__controls">
        <div className="loot__chips" role="group" aria-label="Filter quests">
          {(["all", "main", "side"] as Filter[]).map((f) => (
            <button key={f} type="button" aria-pressed={filter === f} onClick={() => { setFilter(f); setAll(false); }}>
              {f === "all" ? "All" : f === "main" ? "Main quests" : "Side quests"} <span>{counts[f]}</span>
            </button>
          ))}
        </div>
        <div className="loot__right">
          <div className="loot__chips loot__chips--sort" role="group" aria-label="Sort quests">
            <button type="button" aria-pressed={sort === "recent"} onClick={() => setSort("recent")}>Newest</button>
            <button type="button" aria-pressed={sort === "rarity"} onClick={() => setSort("rarity")}>Rarest</button>
          </div>
          <button type="button" className={`chest-btn${reel ? " is-rolling" : ""}`} onClick={openChest} aria-disabled={reel ? true : undefined}>
            <PixelArt className="chest-btn__art" rows={drop || reel ? chestOpenRows : chestClosedRows} palette={chestPalette} />
            {reel ? "Rolling…" : drop ? "Roll again" : "Open the chest"}
          </button>
        </div>
      </div>

      <ul className="rarity-key" aria-label="How rarity works">
        {RARITY_ORDER.map((r) => (
          <li key={r}>
            <RarityBadge r={r} /> {RARITY_RULE[r]}
          </li>
        ))}
      </ul>

      {reel && (
        <section className={`drop drop--reel loot--${reel.rarity}`} aria-hidden="true">
          <p className="drop__tag">
            Rolling the chest <RarityBadge r={reel.rarity} />
          </p>
          <h3>{reel.achievement.title}</h3>
          <span className="drop__bar" style={{ animationDuration: `${ROLL_MS}ms` }} />
        </section>
      )}

      {drop && !reel && (
        <section className={`drop loot--${drop.rarity}`} key={rolls} aria-live="polite" aria-label="Loot drop">
          <p className="drop__tag">
            Loot drop <RarityBadge r={drop.rarity} /> <span>+{drop.xp} XP</span>
          </p>
          <h3>{drop.achievement.title}</h3>
          <p>{drop.achievement.detail}</p>
          <Proof l={drop} />
          <button type="button" className="drop__close" onClick={() => setDrop(null)} aria-label="Close the loot drop">
            ×
          </button>
        </section>
      )}

      <ul className="quests">
        {visible.map((l, i) => (
          <LootCard key={l.achievement.id} l={l} i={i} />
        ))}
      </ul>
      {shown.length > FIRST_PAGE && (
        <p className="loot__more">
          <button type="button" className="gbtn" onClick={() => setAll((v) => !v)}>
            {all ? "Show fewer" : `Show all ${shown.length} quests`}
          </button>
        </p>
      )}
    </div>
  );
}
