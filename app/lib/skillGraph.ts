import { MAX_LEVEL, secretSkills, skillGroups, skills } from "../content/skills.ts";
import type { SkillGroup } from "../content/types.ts";

/*
 * The skill web: where each skill sits, which skills connect, and how to find a
 * path between two of them. The layout is computed once, deterministically
 * (no randomness), so the server-rendered page and the browser agree, and a
 * test can prove no two labels overlap.
 */
export const W = 1000;
export const H = 640;
export const HUB = { x: 500, y: 326 };

export type BranchName = SkillGroup | "Garage";
export interface GNode {
  id: string;
  name: string;
  branch: BranchName;
  /** Verified level, 0 to MAX_LEVEL. Secret skills have none. */
  level: number;
  secret: boolean;
  x: number;
  y: number;
  /** Label box in the same units, used to keep labels from overlapping. */
  w: number;
  h: number;
}
export interface GBranch {
  name: BranchName;
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Where each branch's island sits on the canvas. */
const ISLAND: Record<BranchName, { x: number; y: number }> = {
  Backend: { x: 172, y: 160 }, Mobile: { x: 500, y: 150 }, Integrations: { x: 828, y: 160 },
  Tooling: { x: 172, y: 490 }, Frontend: { x: 500, y: 498 }, Security: { x: 828, y: 490 },
  Garage: { x: 820, y: 326 },
};
const RX = 104;
const RY = 98;

/** Label size in canvas units: long names wrap onto two lines. */
function labelBox(name: string, hasLevel: boolean) {
  const textW = name.length * 6.1;
  const w = Math.min(138, Math.max(84, 46 + textW + (hasLevel ? 0 : 0)));
  const lines = Math.ceil(textW / (w - 46));
  return { w, h: lines > 1 ? 46 : 32 };
}

function place(branch: BranchName, ids: { id: string; name: string; level: number; secret: boolean }[]): GNode[] {
  const c = ISLAND[branch];
  // The strongest skills come first, starting at the top and going clockwise.
  const ordered = [...ids].sort((a, b) => b.level - a.level || a.name.localeCompare(b.name));
  const n = ordered.length;
  return ordered.map((s, i) => {
    // Garage is a short row beside the hub; every other island is a ring.
    const a = branch === "Garage" ? Math.PI * (i === 0 ? 1 : 0) : -Math.PI / 2 + (i * 2 * Math.PI) / n;
    const spread = branch === "Garage" ? 112 : 1;
    const box = labelBox(s.name, !s.secret);
    return {
      ...s,
      branch,
      x: c.x + (branch === "Garage" ? Math.cos(a) * spread : Math.cos(a) * RX),
      y: c.y + (branch === "Garage" ? 0 : Math.sin(a) * RY),
      w: box.w,
      h: box.h,
    };
  });
}

const nodes: GNode[] = [
  ...skillGroups.flatMap((g) =>
    place(g, skills.filter((s) => s.group === g).map((s) => ({ id: s.id, name: s.name, level: Math.min(s.evidence.length, MAX_LEVEL), secret: false }))),
  ),
  ...place("Garage", secretSkills.map((s) => ({ id: s.id, name: s.name, level: 0, secret: true }))),
];

const branches: GBranch[] = ([...skillGroups, "Garage"] as BranchName[]).map((name) => ({ name, x: ISLAND[name].x, y: ISLAND[name].y, w: 100, h: 30 }));

/** A few passes nudge apart any labels that still touch. Fixed iteration count: fully deterministic. */
function relax() {
  const boxes: { x: number; y: number; w: number; h: number; fixed?: boolean }[] = [
    { x: HUB.x, y: HUB.y, w: 100, h: 100, fixed: true },
    ...branches,
    ...nodes,
  ];
  const margin = 8;
  for (let iter = 0; iter < 200; iter++) {
    let moved = false;
    for (let i = 0; i < boxes.length; i++) {
      for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i]!;
        const b = boxes[j]!;
        const ox = (a.w + b.w) / 2 + 6 - Math.abs(a.x - b.x);
        const oy = (a.h + b.h) / 2 + 6 - Math.abs(a.y - b.y);
        if (ox <= 0 || oy <= 0) continue;
        moved = true;
        const axis = oy < ox ? "y" : "x";
        const amount = axis === "y" ? oy : ox;
        const dir = Math.sign(b[axis] - a[axis]) || (i % 2 ? 1 : -1);
        const share = a.fixed || b.fixed ? 1 : 0.5;
        if (!a.fixed) a[axis] -= dir * amount * share;
        if (!b.fixed) b[axis] += dir * amount * share;
      }
    }
    for (const b of boxes) {
      if (b.fixed) continue;
      b.x = Math.min(W - b.w / 2 - margin, Math.max(b.w / 2 + margin, b.x));
      b.y = Math.min(H - b.h / 2 - margin, Math.max(b.h / 2 + margin, b.y));
    }
    if (!moved) break;
  }
  for (const n of nodes) { n.x = Math.round(n.x * 10) / 10; n.y = Math.round(n.y * 10) / 10; }
  for (const b of branches) { b.x = Math.round(b.x * 10) / 10; b.y = Math.round(b.y * 10) / 10; }
}
relax();

export const graphNodes = nodes;
export const graphBranches = branches;
const byId = new Map(nodes.map((n) => [n.id, n]));
export const nodeById = (id: string) => byId.get(id);

/** Every connection between two skills, once each, in a stable order. */
export const graphEdges: [string, string][] = (() => {
  const seen = new Set<string>();
  const out: [string, string][] = [];
  const all = [...skills.map((s) => [s.id, s.links] as const), ...secretSkills.map((s) => [s.id, s.links] as const)];
  for (const [id, links] of all) {
    for (const other of links) {
      const key = [id, other].sort().join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push([id, other]);
    }
  }
  return out;
})();

const adjacency = (() => {
  const m = new Map<string, Set<string>>();
  for (const [a, b] of graphEdges) {
    if (!m.has(a)) m.set(a, new Set());
    if (!m.has(b)) m.set(b, new Set());
    m.get(a)!.add(b);
    m.get(b)!.add(a);
  }
  return m;
})();
export const neighborsOf = (id: string): string[] => [...(adjacency.get(id) ?? [])];

/** The shortest chain of skills from one to another, or null if they aren't connected. */
export function shortestPath(from: string, to: string): string[] | null {
  if (from === to) return [from];
  const prev = new Map<string, string>([[from, from]]);
  const queue = [from];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of adjacency.get(cur) ?? []) {
      if (prev.has(next)) continue;
      prev.set(next, cur);
      if (next === to) {
        const path = [to];
        let at = to;
        while (at !== from) { at = prev.get(at)!; path.unshift(at); }
        return path;
      }
      queue.push(next);
    }
  }
  return null;
}

/** The skill nearest in a direction, for arrow-key travel around the web. */
export function nearestInDirection(fromId: string, dir: "left" | "right" | "up" | "down", candidates: string[]): string | null {
  const from = byId.get(fromId);
  if (!from) return null;
  const vx = dir === "left" ? -1 : dir === "right" ? 1 : 0;
  const vy = dir === "up" ? -1 : dir === "down" ? 1 : 0;
  let best: string | null = null;
  let bestScore = Infinity;
  for (const id of candidates) {
    if (id === fromId) continue;
    const n = byId.get(id);
    if (!n) continue;
    const dx = n.x - from.x;
    const dy = n.y - from.y;
    const along = dx * vx + dy * vy;
    if (along <= 4) continue;
    const across = Math.abs(dx * vy) + Math.abs(dy * vx);
    const score = Math.hypot(along, across * 2.2);
    if (score < bestScore) { bestScore = score; best = id; }
  }
  return best;
}
