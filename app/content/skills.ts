import type { Skill, SkillGroup } from "./types.ts";

export const skillGroups: SkillGroup[] = ["Backend", "Mobile", "Integrations", "Security", "Frontend", "Tooling"];

/** Every skill must point at milestones that show it. tests/content.test.ts enforces this. */
export const skills: Skill[] = [
  { id: "laravel", name: "Laravel", group: "Backend", evidence: ["sw-leave", "fo-tracking-api", "cp-tickets", "fb-sso"] },
  { id: "livewire", name: "Livewire", group: "Backend", evidence: ["sw-leave", "sw-schedules"] },
  { id: "filament", name: "Filament", group: "Backend", evidence: ["cp-tickets", "cp-mfa"] },
  { id: "domain-logic", name: "Payroll and business rules", group: "Backend", evidence: ["sw-daily-rate", "sw-premiums", "sw-corrections", "fo-kpi"] },
  { id: "flutter", name: "Flutter", group: "Mobile", evidence: ["fa-offline", "fa-sync", "fa-signoff", "ws-transactions", "ws-tour"] },
  { id: "offline-sync", name: "Offline-first sync", group: "Mobile", evidence: ["fa-sync", "fa-queue", "fa-audit", "fa-breaker"] },
  { id: "local-first", name: "Local-first data (SQLite)", group: "Mobile", evidence: ["ws-foundation", "ws-backup", "ws-lock"] },
  { id: "push", name: "Push notifications", group: "Mobile", evidence: ["fa-push"] },
  { id: "m365", name: "Microsoft 365 and Graph", group: "Integrations", evidence: ["fo-onedrive", "cp-graph"] },
  { id: "maps", name: "Maps (Google Maps, OpenStreetMap)", group: "Integrations", evidence: ["fo-maps", "is-map"] },
  { id: "netsuite", name: "NetSuite", group: "Integrations", evidence: ["fo-reconcile"] },
  { id: "mcp", name: "MCP connectors for AI assistants", group: "Integrations", evidence: ["fo-mcp"] },
  { id: "system-links", name: "System-to-system APIs", group: "Integrations", evidence: ["fo-tracking-api", "cp-connection", "cp-feedback", "fo-signoff"] },
  { id: "device-security", name: "On-device security (passcode, biometrics)", group: "Security", evidence: ["ws-lock"] },
  { id: "sso", name: "Single sign-on with Entra ID", group: "Security", evidence: ["fb-sso", "fo-mcp"] },
  { id: "access-control", name: "Access control and audit trails", group: "Security", evidence: ["pw-access", "pw-audit", "fb-fields", "fb-audit"] },
  { id: "hardening", name: "Security hardening", group: "Security", evidence: ["sw-tenant", "sw-auth", "pw-uploads", "tt-hardening"] },
  { id: "vue", name: "Vue", group: "Frontend", evidence: ["fb-presence"] },
  { id: "vanilla-ui", name: "Dependency-free web UI", group: "Frontend", evidence: ["tt-summaries", "tt-synced-view", "tt-date-filter", "is-board"] },
  { id: "node", name: "Node.js", group: "Backend", evidence: ["is-sim", "is-admin", "is-editor"] },
  { id: "charts", name: "Charts, reports and export", group: "Frontend", evidence: ["ws-stats", "ws-export"] },
  { id: "localisation", name: "Localisation (English, Bisaya)", group: "Frontend", evidence: ["is-i18n"] },
  { id: "python", name: "Python", group: "Tooling", evidence: ["tt-engine", "tt-synced-view", "tf-core"] },
  { id: "windows-automation", name: "Windows automation", group: "Tooling", evidence: ["tf-core", "tf-runas", "tf-system"] },
  { id: "simulation", name: "Simulation and test tooling", group: "Tooling", evidence: ["is-sim", "is-admin", "ws-sample"] },
  { id: "git", name: "Git internals", group: "Tooling", evidence: ["tt-engine", "tt-find-commit", "tt-hardening"] },
  { id: "testing", name: "Automated testing", group: "Tooling", evidence: ["pw-tests", "sw-premiums", "tf-tests", "ws-sample"] },
  { id: "concurrency", name: "Concurrency and locking", group: "Tooling", evidence: ["fb-locks", "fa-queue", "sw-tenant"] },
];
