import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { MAX_LEVEL, skillGroups, skills } from "../content/skills.ts";
import { allMilestones } from "../content/projects.ts";
import { profile } from "../content/profile.ts";
import { formatDate } from "../lib/format.ts";
import { H, HUB, W, graphBranches, graphEdges, graphNodes, neighborsOf, nearestInDirection, nodeById, shortestPath, type BranchName, type GNode } from "../lib/skillGraph.ts";
import { useReveal } from "../hooks/useReveal.ts";
import { PixelIcon, type PixelIconName } from "./PixelIcon";
import { GarageVault } from "./GarageEgg";

/*
 * The skill web. Every skill is a star with a level (one verified milestone =
 * one level), and lines join skills that were used together. It is meant to be
 * played with: hover to light up a skill's connections, click for the proof,
 * trace a path between any two skills, ask for a surprise, or explore every
 * skill to unlock the hidden Garage branch.
 */
const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(2)}%`;
const hasMilestoneIndex = new Map(allMilestones().map((m) => [m.milestone.id, m]));
const skillById = new Map(skills.map((s) => [s.id, s]));
const spokeIds = (b: BranchName) => graphNodes.filter((n) => n.branch === b).map((n) => n.id);

/** A gentle curve between two points; the bend alternates side so crossing lines separate. */
function curve(ax: number, ay: number, bx: number, by: number, i: number) {
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const len = Math.hypot(bx - ax, by - ay) || 1;
  const bend = Math.min(60, len * 0.14) * (i % 2 ? 1 : -1);
  return `M${ax} ${ay} Q${mx + (-(by - ay) / len) * bend} ${my + ((bx - ax) / len) * bend} ${bx} ${by}`;
}

export function SkillTree() {
  const { ref, revealClass } = useReveal<HTMLDivElement>(0.12);
  const wrap = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [focusBranch, setFocusBranch] = useState<BranchName | null>(null);
  const [trace, setTrace] = useState(false);
  const [traceFrom, setTraceFrom] = useState<string | null>(null);
  const [path, setPath] = useState<string[] | null>(null);
  const [visited, setVisited] = useState<Set<string>>(() => new Set());
  const [sparkKey, setSparkKey] = useState(0);
  const [note, setNote] = useState("");

  const [konami, setKonami] = useState(false);
  const [vault, setVault] = useState(false);
  const closeVault = useCallback(() => setVault(false), []);
  const unlocked = konami || skills.every((s) => visited.has(s.id));
  const visible = useCallback((n: GNode) => !n.secret || unlocked, [unlocked]);
  const nodes = useMemo(() => graphNodes.filter(visible), [visible]);

  const activeId = hoverId ?? selectedId;
  const lit = useMemo(() => new Set(activeId ? [activeId, ...neighborsOf(activeId)] : []), [activeId]);
  const pathNodes = useMemo(() => new Set(path ?? []), [path]);
  const pathEdges = useMemo(() => {
    const s = new Set<string>();
    if (path) for (let i = 0; i < path.length - 1; i++) s.add([path[i], path[i + 1]].sort().join("|"));
    return s;
  }, [path]);

  const select = (id: string) => {
    setSelectedId((cur) => (cur === id ? null : id));
    setVisited((v) => (v.has(id) ? v : new Set(v).add(id)));
    setSparkKey((k) => k + 1);
    setPath(null);
  };

  const onNode = (id: string) => {
    if (!trace) return select(id);
    if (!traceFrom || path) {
      setTraceFrom(id);
      setPath(null);
      setSelectedId(null);
      setNote(`${nodeById(id)?.name}: now pick a second skill.`);
      return;
    }
    if (id === traceFrom) return;
    const found = shortestPath(traceFrom, id);
    setPath(found);
    setNote(
      found
        ? `${found.map((p) => nodeById(p)?.name).join("  →  ")}  ·  ${found.length - 1} ${found.length === 2 ? "hop" : "hops"}`
        : "These two aren't connected.",
    );
  };

  const surprise = () => {
    const pool = nodes.filter((n) => !n.secret && !visited.has(n.id));
    const choices = pool.length ? pool : nodes;
    const pick = choices[Math.floor(Math.random() * choices.length)]!;
    setTrace(false);
    setTraceFrom(null);
    setPath(null);
    setSelectedId(pick.id);
    setVisited((v) => new Set(v).add(pick.id));
    setSparkKey((k) => k + 1);
    setNote(`Surprise: ${pick.name}.`);
  };

  const reset = () => {
    setSelectedId(null);
    setTrace(false);
    setTraceFrom(null);
    setPath(null);
    setFocusBranch(null);
    setNote("");
  };

  // The reward: the page dims and a garage door waits to be cranked open.
  useEffect(() => {
    if (!unlocked) return;
    setNote("Secret branch unlocked: the Garage door is waiting.");
    setVault(true);
  }, [unlocked]);

  // The old way in: ↑ ↑ ↓ ↓ ← → ← → B A, anywhere on the page.
  useEffect(() => {
    const code = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      i = k === code[i] ? i + 1 : k === code[0] ? 1 : 0;
      if (i === code.length) {
        i = 0;
        setKonami(true);
        setVault(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Arrow keys travel around the web; Escape closes the card.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedId(null);
      return;
    }
    const dir = ({ ArrowLeft: "left", ArrowRight: "right", ArrowUp: "up", ArrowDown: "down" } as const)[e.key as "ArrowLeft"];
    const from = (e.target as HTMLElement).closest<HTMLElement>("[data-node]")?.dataset.node;
    if (!dir || !from) return;
    const target = nearestInDirection(from, dir, nodes.map((n) => n.id));
    if (!target) return;
    e.preventDefault();
    wrap.current?.querySelector<HTMLElement>(`[data-node="${target}"]`)?.focus();
  };

  const selected = selectedId ? nodeById(selectedId) : null;
  const explored = skills.filter((s) => visited.has(s.id)).length;
  const verified = new Set(skills.flatMap((s) => s.evidence)).size;

  return (
    <div className={`skillweb ${revealClass}`} ref={ref}>
      <div className="gtools">
        <p className="gtools__stat">
          <span className="gem gem--3" aria-hidden="true" />
          <span>
            <b>{skills.length}</b> skills in <b>{skillGroups.length}</b> branches, powered by <b>{verified}</b> verified milestones. One
            level = one milestone, up to {MAX_LEVEL}.
          </span>
        </p>
        <div className="gtools__buttons">
          <button type="button" className="gbtn" aria-pressed={trace} onClick={() => { setTrace((t) => !t); setTraceFrom(null); setPath(null); setNote(trace ? "" : "Trace a path: pick any two skills and I'll show how they connect."); }}>
            Trace a path
          </button>
          <button type="button" className="gbtn" onClick={surprise}>
            Surprise me
          </button>
          <button type="button" className="gbtn gbtn--quiet" onClick={reset}>
            Reset
          </button>
        </div>
      </div>
      <div className="gprogress" aria-label={`Explored ${explored} of ${skills.length} skills`}>
        <span className="gprogress__bar" aria-hidden="true">
          <span style={{ width: `${(explored / skills.length) * 100}%` }} />
        </span>
        <span className="gprogress__text">
          {unlocked ? "Secret branch unlocked" : `Explored ${explored}/${skills.length}. Visit them all to unlock something.`}
        </span>
        {unlocked && (
          <button type="button" className="gbtn" onClick={() => setVault(true)}>
            Re-enter the Garage
          </button>
        )}
      </div>
      <div className="gdock" aria-live="polite">
        {note && <p className="gnote">{note}</p>}
        {selected ? (
          <SkillCard node={selected} onClose={() => setSelectedId(null)} onPick={select} visible={visible} />
        ) : (
          !note && (
            <div className="gdock__hint">
              <p>Hover a skill to see what it connects to. Click one for the proof behind it. Arrow keys travel the web.</p>
              <ul className="glegend" aria-label="Level colours">
                {[1, 2, 3, 4, 5].map((l) => (
                  <li key={l}>
                    <span className={`gem gem--${l}`} aria-hidden="true" /> Level {l}
                    {l === MAX_LEVEL ? " (max)" : ""}
                  </li>
                ))}
                <li>
                  <span className="gem gem--s" aria-hidden="true" /> Self-reported
                </li>
              </ul>
            </div>
          )
        )}
      </div>

      <div className="constellation" ref={wrap} onKeyDown={onKeyDown} role="group" aria-label="Skill web">
        <svg className="gedges" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
          {graphBranches
            .filter((b) => b.name !== "Garage" || unlocked)
            .map((b) => (
              <line key={`h-${b.name}`} className={`gspoke gspoke--hub${focusBranch && focusBranch !== b.name ? " is-dim" : ""}`} x1={HUB.x} y1={HUB.y} x2={b.x} y2={b.y} />
            ))}
          {nodes.map((n) => {
            const b = graphBranches.find((x) => x.name === n.branch)!;
            return <line key={`s-${n.id}`} className={`gspoke${focusBranch && focusBranch !== n.branch ? " is-dim" : ""}`} x1={b.x} y1={b.y} x2={n.x} y2={n.y} />;
          })}
          {graphEdges.map(([a, b], i) => {
            const A = nodeById(a)!;
            const B = nodeById(b)!;
            if (!visible(A) || !visible(B)) return null;
            const key = [a, b].sort().join("|");
            const isPath = pathEdges.has(key);
            const isLit = !path && !!activeId && (a === activeId || b === activeId);
            const dim = (path && !isPath) || (!path && activeId && !isLit) || (focusBranch && A.branch !== focusBranch && B.branch !== focusBranch);
            return <path key={key} d={curve(A.x, A.y, B.x, B.y, i)} pathLength={1} className={`gedge${isLit ? " is-lit" : ""}${isPath ? " is-path" : ""}${dim ? " is-dim" : ""}`} style={{ "--n": i } as React.CSSProperties} />;
          })}
        </svg>

        <div className="ghub" style={{ "--x": pct(HUB.x, W), "--y": pct(HUB.y, H) } as React.CSSProperties}>
          <img src={profile.avatar.src} alt="" width="72" height="90" loading="lazy" />
          <span>Player 0</span>
        </div>

        {([...skillGroups, "Garage"] as BranchName[]).map((g) => {
          const b = graphBranches.find((x) => x.name === g)!;
          const secretBranch = g === "Garage";
          if (secretBranch && !unlocked) return null;
          return (
            <div key={g} className={`gbranch${focusBranch && focusBranch !== g ? " is-dim" : ""}${secretBranch ? " is-secret" : ""}`} data-branch={g}>
              <button type="button" className="gbranch__label" aria-pressed={focusBranch === g} style={{ "--x": pct(b.x, W), "--y": pct(b.y, H) } as React.CSSProperties} onClick={() => setFocusBranch((cur) => (cur === g ? null : g))}>
                {!secretBranch && <PixelIcon name={g as PixelIconName} size={18} />}
                {g}
              </button>
              {spokeIds(g).map((id) => {
                const n = nodeById(id)!;
                const idx = graphNodes.indexOf(n);
                const isSel = selectedId === id;
                const isLit = lit.has(id);
                return (
                  <button
                    key={id}
                    type="button"
                    data-node={id}
                    className={`gnode${isSel ? " is-selected" : ""}${isLit ? " is-lit" : ""}${activeId && !isLit ? " is-dim" : ""}${pathNodes.has(id) ? " is-path" : ""}${traceFrom === id ? " is-from" : ""}${visited.has(id) ? " is-visited" : ""}${n.secret ? " is-secret" : ""}`}
                    style={{ "--x": pct(n.x, W), "--y": pct(n.y, H), "--n": idx } as React.CSSProperties}
                    aria-pressed={isSel}
                    aria-label={n.secret ? `${n.name}, self-reported` : `${n.name}, level ${n.level} of ${MAX_LEVEL}`}
                    onClick={() => onNode(id)}
                    onMouseEnter={() => setHoverId(id)}
                    onMouseLeave={() => setHoverId(null)}
                    onFocus={() => setHoverId(id)}
                    onBlur={() => setHoverId(null)}
                  >
                    <span className={`gem gem--${n.secret ? "s" : n.level}`} aria-hidden="true" />
                    <span className="gnode__text">
                      <span className="gnode__name">{n.name}</span>
                      {!n.secret && (
                        <span className="gnode__pips" aria-hidden="true">
                          {Array.from({ length: MAX_LEVEL }, (_, i) => (
                            <i key={i} className={i < n.level ? "is-full" : undefined} />
                          ))}
                        </span>
                      )}
                    </span>
                    {isSel && (
                      <span className="sparks" key={sparkKey} aria-hidden="true">
                        {Array.from({ length: 8 }, (_, i) => (
                          <i key={i} style={{ "--a": `${i * 45}deg` } as React.CSSProperties} />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>
      {vault && <GarageVault onClose={closeVault} />}
    </div>
  );
}

function SkillCard({ node, onClose, onPick, visible }: { node: GNode; onClose: () => void; onPick: (id: string) => void; visible: (n: GNode) => boolean }) {
  const skill = skillById.get(node.id);
  const evidence = (skill?.evidence ?? []).map((id) => hasMilestoneIndex.get(id)!).filter(Boolean);
  const projectCount = new Set(evidence.map((e) => e.project.slug)).size;
  const worksWith = neighborsOf(node.id).map((id) => nodeById(id)!).filter(visible);
  return (
    <aside className="gcard" aria-label={`${node.name}: details`}>
      <button type="button" className="gcard__close" onClick={onClose} aria-label="Close details">
        ×
      </button>
      <header className="gcard__head">
        <span className={`gem gem--lg gem--${node.secret ? "s" : node.level} unlock-gem`} aria-hidden="true" />
        <div>
          <h3>{node.name}</h3>
          {node.secret ? (
            <p className="gcard__meta">Self-reported · no case study</p>
          ) : (
            <p className="gcard__meta">
              Level {node.level} of {MAX_LEVEL} · {projectCount} {projectCount === 1 ? "project" : "projects"} · {node.branch}
            </p>
          )}
        </div>
      </header>
      <div className="gcard__proof">
        {node.secret ? (
          <p className="gcard__secret">
            This one lives in the Garage: I do it for fun, so there&rsquo;s no repository to point at. Ask me about it.
          </p>
        ) : (
          <>
            <p className="gcard__label">Unlocked by</p>
            <ul className="gcard__list">
              {evidence.map((e) => (
                <li key={e.milestone.id}>
                  <Link to={`/projects/${e.project.slug}#${e.milestone.id}`}>{e.milestone.title}</Link>
                  <small>
                    {e.project.title} · {formatDate(e.milestone.date)}
                  </small>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="gcard__with">
        <p className="gcard__label">Works with</p>
        <ul className="gcard__chips">
          {worksWith.map((n) => (
            <li key={n.id}>
              <button type="button" onClick={() => onPick(n.id)}>
                {n.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
