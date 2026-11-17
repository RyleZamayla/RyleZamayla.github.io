import type { Skill, SkillGroup } from "./types.ts";

export const skillGroups: SkillGroup[] = ["Backend", "Mobile", "Integrations", "Security", "Frontend", "Tooling"];

/** One level is one verified milestone, up to this many. */
export const MAX_LEVEL = 5;

/*
 * Every skill points at the milestones that show it, and tests/content.test.ts
 * enforces it. That test also makes sure every milestone in the case studies
 * backs at least one skill, so new work can't be added without the tree
 * noticing. "links" are the connections drawn in the skill web: skills that
 * were used together, or that one builds on.
 */
export const skills: Skill[] = [
  // Backend
  { id: "laravel", name: "Laravel", group: "Backend", evidence: ["sw-leave", "fo-tracking-api", "cp-tickets", "fb-sso", "sw-billing"], links: ["livewire", "filament", "domain-logic", "system-links", "sso", "hardening"] },
  { id: "livewire", name: "Livewire", group: "Backend", evidence: ["sw-leave", "sw-schedules"], links: ["laravel", "filament", "vanilla-ui"] },
  { id: "filament", name: "Filament", group: "Backend", evidence: ["cp-tickets", "cp-mfa"], links: ["laravel", "livewire", "access-control"] },
  { id: "domain-logic", name: "Payroll and business rules", group: "Backend", evidence: ["sw-daily-rate", "sw-premiums", "sw-corrections", "fo-kpi", "sw-routing", "ws-accounts", "ws-fx"], links: ["laravel", "testing", "netsuite", "local-first"] },
  { id: "node", name: "Node.js", group: "Backend", evidence: ["is-sim", "is-admin", "is-editor"], links: ["simulation", "maps", "localisation", "realtime"] },
  { id: "realtime", name: "Real-time collaboration", group: "Backend", evidence: ["fb-presence", "fb-locks", "is-sim"], links: ["vue", "concurrency", "node", "access-control"] },
  { id: "resilience", name: "Queues, retries and breakers", group: "Backend", evidence: ["fo-onedrive", "fa-queue", "fa-breaker", "is-weak"], links: ["offline-sync", "concurrency", "m365", "system-links"] },

  // Mobile
  { id: "flutter", name: "Flutter", group: "Mobile", evidence: ["fa-offline", "fa-sync", "fa-signoff", "ws-transactions", "ws-tour"], links: ["offline-sync", "local-first", "push", "charts", "theming", "documents-pdf"] },
  { id: "offline-sync", name: "Offline-first sync", group: "Mobile", evidence: ["fa-sync", "fa-queue", "fa-audit", "fa-breaker", "is-weak"], links: ["flutter", "local-first", "resilience", "concurrency", "system-links"] },
  { id: "local-first", name: "Local-first data (SQLite)", group: "Mobile", evidence: ["ws-foundation", "ws-backup", "ws-lock", "tf-persistence"], links: ["flutter", "device-security", "offline-sync", "domain-logic", "python"] },
  { id: "push", name: "Push notifications", group: "Mobile", evidence: ["fa-push"], links: ["flutter", "system-links"] },

  // Integrations
  { id: "m365", name: "Microsoft 365 and Graph", group: "Integrations", evidence: ["fo-onedrive", "cp-graph"], links: ["sso", "system-links", "resilience"] },
  { id: "maps", name: "Maps (Google Maps, OpenStreetMap)", group: "Integrations", evidence: ["fo-maps", "is-map"], links: ["system-links", "node"] },
  { id: "netsuite", name: "NetSuite", group: "Integrations", evidence: ["fo-reconcile"], links: ["system-links", "domain-logic"] },
  { id: "mcp", name: "MCP connectors for AI assistants", group: "Integrations", evidence: ["fo-mcp"], links: ["sso", "system-links"] },
  { id: "system-links", name: "System-to-system APIs", group: "Integrations", evidence: ["fo-tracking-api", "cp-connection", "cp-feedback", "fo-signoff", "cp-signoff"], links: ["laravel", "m365", "netsuite", "mcp", "documents-pdf", "offline-sync", "push", "resilience", "maps"] },
  { id: "documents-pdf", name: "Sign-off documents and PDFs", group: "Integrations", evidence: ["fa-signoff", "fo-signoff", "cp-signoff"], links: ["system-links", "flutter", "laravel"] },

  // Security
  { id: "device-security", name: "On-device security (passcode, biometrics)", group: "Security", evidence: ["ws-lock"], links: ["local-first", "access-control"] },
  { id: "sso", name: "Single sign-on with Entra ID", group: "Security", evidence: ["fb-sso", "fo-mcp"], links: ["laravel", "m365", "mcp", "access-control"] },
  { id: "access-control", name: "Access control and audit trails", group: "Security", evidence: ["pw-access", "pw-audit", "fb-fields", "fb-audit", "cp-mfa"], links: ["sso", "hardening", "filament", "device-security", "realtime"] },
  { id: "hardening", name: "Security hardening", group: "Security", evidence: ["sw-tenant", "sw-auth", "pw-uploads", "tt-hardening", "fa-release-guard"], links: ["access-control", "testing", "laravel", "git"] },

  // Frontend
  { id: "vue", name: "Vue", group: "Frontend", evidence: ["fb-presence"], links: ["realtime", "vanilla-ui"] },
  { id: "vanilla-ui", name: "Dependency-free web UI", group: "Frontend", evidence: ["tt-summaries", "tt-synced-view", "tt-date-filter", "tt-selected-summary", "is-board"], links: ["vue", "livewire", "localisation", "python", "charts"] },
  { id: "charts", name: "Charts, reports and export", group: "Frontend", evidence: ["ws-stats", "ws-export"], links: ["flutter", "vanilla-ui"] },
  { id: "localisation", name: "Localisation (English, Bisaya)", group: "Frontend", evidence: ["is-i18n"], links: ["node", "vanilla-ui"] },
  { id: "theming", name: "Theming (dark and light)", group: "Frontend", evidence: ["ws-light"], links: ["flutter", "charts"] },

  // Tooling
  { id: "python", name: "Python", group: "Tooling", evidence: ["tt-engine", "tt-synced-view", "tf-core"], links: ["git", "windows-automation", "vanilla-ui", "scripting", "local-first"] },
  { id: "windows-automation", name: "Windows automation", group: "Tooling", evidence: ["tf-core", "tf-runas", "tf-system"], links: ["python", "scripting"] },
  { id: "simulation", name: "Simulation and test tooling", group: "Tooling", evidence: ["is-sim", "is-admin", "ws-sample"], links: ["node", "testing"] },
  { id: "git", name: "Git internals", group: "Tooling", evidence: ["tt-engine", "tt-find-commit", "tt-hardening", "tt-compact"], links: ["python", "hardening"] },
  { id: "testing", name: "Automated testing", group: "Tooling", evidence: ["pw-tests", "sw-premiums", "tf-tests", "ws-sample"], links: ["simulation", "domain-logic", "hardening"] },
  { id: "concurrency", name: "Concurrency and locking", group: "Tooling", evidence: ["fb-locks", "fa-queue", "sw-tenant"], links: ["realtime", "resilience", "offline-sync"] },
  { id: "scripting", name: "Shell and launcher scripting", group: "Tooling", evidence: ["tt-launcher"], links: ["python", "windows-automation"] },
];

/*
 * The hidden "Garage" branch, unlocked by exploring every skill above. These
 * are self-reported hobbies, so they have no case study behind them and the
 * page says so. They are kept apart from `skills` so the evidence rules above
 * stay strict.
 */
export interface SecretSkill {
  id: string;
  name: string;
  links: string[];
}
export const secretSkills: SecretSkill[] = [
  { id: "garage-moto", name: "Motorcycle teardown and engine builds", links: ["garage-pc"] },
  { id: "garage-pc", name: "PC setups and configurations", links: ["garage-moto", "windows-automation"] },
];
