import type { Skill, SkillGroup } from "./types.ts";

export const skillGroups: SkillGroup[] = ["Backend", "Mobile", "Integrations", "Security", "Frontend", "Tooling"];

/** Every skill must point at milestones that show it. tests/content.test.ts enforces this. */
export const skills: Skill[] = [
  { id: "laravel", name: "Laravel", group: "Backend", evidence: ["sw-leave", "fo-tracking-api", "cp-tickets", "fb-sso"] },
  { id: "livewire", name: "Livewire", group: "Backend", evidence: ["sw-leave", "sw-schedules"] },
  { id: "filament", name: "Filament", group: "Backend", evidence: ["cp-tickets", "cp-mfa"] },
  { id: "domain-logic", name: "Payroll and business rules", group: "Backend", evidence: ["sw-daily-rate", "sw-premiums", "sw-corrections", "fo-kpi"] },
  { id: "flutter", name: "Flutter", group: "Mobile", evidence: ["fa-offline", "fa-sync", "fa-signoff"] },
  { id: "offline-sync", name: "Offline-first sync", group: "Mobile", evidence: ["fa-sync", "fa-queue", "fa-audit", "fa-breaker"] },
  { id: "push", name: "Push notifications", group: "Mobile", evidence: ["fa-push"] },
  { id: "m365", name: "Microsoft 365 and Graph", group: "Integrations", evidence: ["fo-onedrive", "cp-graph"] },
  { id: "maps", name: "Google Maps APIs", group: "Integrations", evidence: ["fo-maps"] },
  { id: "netsuite", name: "NetSuite", group: "Integrations", evidence: ["fo-reconcile"] },
  { id: "mcp", name: "MCP connectors for AI assistants", group: "Integrations", evidence: ["fo-mcp"] },
  { id: "system-links", name: "System-to-system APIs", group: "Integrations", evidence: ["fo-tracking-api", "cp-connection", "cp-feedback", "fo-signoff"] },
  { id: "sso", name: "Single sign-on with Entra ID", group: "Security", evidence: ["fb-sso", "fo-mcp"] },
  { id: "access-control", name: "Access control and audit trails", group: "Security", evidence: ["pw-access", "pw-audit", "fb-fields", "fb-audit"] },
  { id: "hardening", name: "Security hardening", group: "Security", evidence: ["sw-tenant", "sw-auth", "pw-uploads", "tt-hardening"] },
  { id: "vue", name: "Vue", group: "Frontend", evidence: ["fb-presence"] },
  { id: "vanilla-ui", name: "Dependency-free web UI", group: "Frontend", evidence: ["tt-summaries", "tt-synced-view", "tt-date-filter"] },
  { id: "python", name: "Python", group: "Tooling", evidence: ["tt-engine", "tt-synced-view"] },
  { id: "git", name: "Git internals", group: "Tooling", evidence: ["tt-engine", "tt-find-commit", "tt-hardening"] },
  { id: "testing", name: "Automated testing", group: "Tooling", evidence: ["pw-tests", "sw-premiums"] },
  { id: "concurrency", name: "Concurrency and locking", group: "Tooling", evidence: ["fb-locks", "fa-queue", "sw-tenant"] },
];
