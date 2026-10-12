/** How a claim was checked during the audit. Shown on every milestone. */
export type Verification =
  | "commit" // a commit with this reference exists in the repo's history
  | "diff" // confirmed by comparing dated backup files of the source
  | "code" // the feature is present in the source code
  | "tested"; // reproduced and tested against real git repos / a running server

export const verificationLabel: Record<Verification, string> = {
  commit: "Commit in history",
  diff: "Confirmed by backup diff",
  code: "Present in source",
  tested: "Tested end to end",
};

export interface Milestone {
  /** Unique across all projects; skills and achievements point at these. */
  id: string;
  title: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Short commit hash, or a build label for projects without git history. */
  ref?: string;
  refKind?: "commit" | "build";
  /** What changed, in plain words. */
  change: string;
  /** Why it mattered technically. */
  significance: string;
  verification: Verification;
}

export interface Phase {
  title: string;
  period: string;
  summary: string;
  milestones: Milestone[];
}

export interface Stat {
  value: string;
  label: string;
  /** Where the number comes from, shown next to it. */
  source: string;
}

export type ProjectKind = "personal" | "professional";

export interface Project {
  slug: string;
  title: string;
  kind: ProjectKind;
  /** One sentence for cards and meta descriptions. */
  tagline: string;
  period: string;
  problem: string;
  overview: string;
  /** One-line, evidence-backed proof shown in the "at a glance" card. */
  outcome: string;
  role: string;
  stack: string[];
  integrations: string[];
  stats: Stat[];
  phases: Phase[];
  /** Plain statement of what can and can't be shown, and why. */
  sourceNote: string;
  /** Where this project sits in the landing-page scene. */
  sceneSpot: "monitor" | "laptop" | "phone" | "rack" | "board" | "tablet" | "notebook" | "clock" | "queue-sign";
}

export interface Skill {
  id: string;
  name: string;
  group: SkillGroup;
  /** Milestone ids that demonstrate this skill. Checked by tests/content.test.ts. */
  evidence: string[];
}

export type SkillGroup = "Backend" | "Mobile" | "Frontend" | "Integrations" | "Security" | "Tooling";

export interface Achievement {
  id: string;
  /** Main quests are professional work; side quests are personal projects. */
  quest: "main" | "side";
  title: string;
  detail: string;
  source: string;
  /** Optional milestone ids backing the achievement. */
  evidence: string[];
}
