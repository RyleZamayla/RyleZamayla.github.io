import { achievements } from "../content/achievements.ts";
import { allMilestones } from "../content/projects.ts";
import type { Achievement } from "../content/types.ts";

/*
 * Loot is the quest log with game rules on top. A quest's rarity is simply how
 * many verified milestones back it, so a legendary drop is one with a lot of
 * receipts, not one I decided to call legendary. Quests that rest on my own
 * account alone are common.
 */
export type Rarity = "common" | "rare" | "epic" | "legendary";
export const RARITY_ORDER: Rarity[] = ["common", "rare", "epic", "legendary"];
export const RARITY_LABEL: Record<Rarity, string> = { common: "Common", rare: "Rare", epic: "Epic", legendary: "Legendary" };
export const RARITY_XP: Record<Rarity, number> = { common: 25, rare: 50, epic: 100, legendary: 200 };
export const RARITY_RULE: Record<Rarity, string> = {
  common: "My own account",
  rare: "1 to 2 milestones",
  epic: "3 milestones",
  legendary: "4 or more milestones",
};

export function rarityOf(a: Pick<Achievement, "evidence">): Rarity {
  const n = a.evidence.length;
  return n === 0 ? "common" : n <= 2 ? "rare" : n === 3 ? "epic" : "legendary";
}

export interface Proof {
  id: string;
  title: string;
  date: string;
  projectSlug: string;
  projectTitle: string;
}
export interface Loot {
  achievement: Achievement;
  rarity: Rarity;
  xp: number;
  proof: Proof[];
  /** The latest milestone behind it, if any. */
  date: string | null;
  projects: string[];
}

const index = new Map(allMilestones().map((m) => [m.milestone.id, m]));

export function lootFor(a: Achievement): Loot {
  const proof: Proof[] = a.evidence
    .map((id) => index.get(id))
    .filter((e): e is NonNullable<typeof e> => !!e)
    .map((e) => ({ id: e.milestone.id, title: e.milestone.title, date: e.milestone.date, projectSlug: e.project.slug, projectTitle: e.project.title }));
  const rarity = rarityOf(a);
  return {
    achievement: a,
    rarity,
    xp: RARITY_XP[rarity],
    proof,
    date: proof.length ? proof.map((p) => p.date).sort().at(-1)! : null,
    projects: [...new Set(proof.map((p) => p.projectTitle))],
  };
}

export const loot: Loot[] = achievements.map(lootFor);
export const totalXp = loot.reduce((n, l) => n + l.xp, 0);

/** Newest first (quests with no dated proof last), or rarest first. */
export function sortLoot(list: Loot[], by: "recent" | "rarity"): Loot[] {
  const rarityRank = (l: Loot) => RARITY_ORDER.indexOf(l.rarity);
  const recent = (a: Loot, b: Loot) => (b.date ?? "").localeCompare(a.date ?? "");
  return [...list].sort(by === "recent" ? (a, b) => recent(a, b) || rarityRank(b) - rarityRank(a) : (a, b) => rarityRank(b) - rarityRank(a) || recent(a, b));
}
