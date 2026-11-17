import type { Achievement } from "./types.ts";

export const achievements: Achievement[] = [
  {
    "id": "time-back",
    "quest": "side",
    "title": "Cut monthly time tracking from days to hours",
    "detail": "A month of NetSuite time logging: 2–3 days down to 3–4 hours.",
    "source": "My own estimate",
    "evidence": [
      "tt-engine",
      "tt-summaries"
    ]
  },
  {
    "id": "freelance",
    "quest": "main",
    "title": "5+ years as a freelance developer",
    "detail": "Web and mobile software built for clients on a project basis.",
    "source": "My own account",
    "evidence": []
  },
  {
    "id": "isbogi",
    "quest": "side",
    "title": "Built a research pilot with its own control panel",
    "detail": "A simulated van fleet, a live map and a facilitator panel for running repeatable user tests, in November 2026.",
    "source": "Project history",
    "evidence": [
      "is-sim",
      "is-admin"
    ]
  },
  {
    "id": "wais",
    "quest": "side",
    "title": "Built a private money app in six days",
    "detail": "WAIS went from an empty project to backup, passcode lock and a guided tour, 9–14 November 2026.",
    "source": "Commit history",
    "evidence": [
      "ws-foundation",
      "ws-backup",
      "ws-tour"
    ]
  },
  {
    "id": "commits",
    "quest": "main",
    "title": "Building and shipping across web, mobile and automation",
    "detail": "Ten projects, from personal apps to today's work systems.",
    "source": "Project histories",
    "evidence": []
  },
  {
    "id": "signoff",
    "quest": "main",
    "title": "Shipped digital sign-off across three systems",
    "detail": "Captured on the phone, rendered to PDF by the platform, shown to clients in the portal.",
    "source": "Commit history, Aug 2026",
    "evidence": [
      "fa-signoff",
      "fo-signoff",
      "cp-signoff"
    ]
  },
  {
    "id": "sweltrack",
    "quest": "side",
    "title": "Built SwelTrack's core in twelve days",
    "detail": "Leave, time records, payroll rules, billing and a security pass, 1–12 July 2026.",
    "source": "Commit history",
    "evidence": [
      "sw-leave",
      "sw-premiums",
      "sw-tenant"
    ]
  },
  {
    "id": "sso",
    "quest": "main",
    "title": "Put Microsoft sign-in in front of two systems",
    "detail": "Entra ID sign-in for the floor planner and an AI assistant connector.",
    "source": "Commit history",
    "evidence": [
      "fb-sso",
      "fo-mcp"
    ]
  },
  {
    "id": "sync",
    "quest": "main",
    "title": "A phone that never loses a job",
    "detail": "Found a data-format drift between the app and its server, then replaced polling with an ordered queue and added a circuit breaker.",
    "source": "Commit history, Jul – Oct 2026",
    "evidence": ["fa-audit", "fa-queue", "fa-breaker", "fa-sync"]
  },
  {
    "id": "harden-day",
    "quest": "main",
    "title": "Hardened an app in a single day",
    "detail": "Access control, an audit trail, safe file uploads and fast automated tests, all on 16 September 2026.",
    "source": "Commit history",
    "evidence": ["pw-access", "pw-audit", "pw-uploads", "pw-tests"]
  },
  {
    "id": "portal",
    "quest": "main",
    "title": "A client portal, from zero to linked",
    "detail": "Two-factor accounts, ticket tracking, sign-offs and a health-checked link to the operations platform, in about two months.",
    "source": "Commit history, Aug – Oct 2026",
    "evidence": ["cp-mfa", "cp-tickets", "cp-signoff", "cp-connection", "cp-feedback"]
  },
  {
    "id": "security",
    "quest": "main",
    "title": "Left every codebase safer than I found it",
    "detail": "Tenant isolation, stronger passwords, safe uploads, request checks and a release guard, across four projects.",
    "source": "Commit history",
    "evidence": ["sw-tenant", "sw-auth", "pw-uploads", "tt-hardening", "fa-release-guard"]
  },
  {
    "id": "board",
    "quest": "main",
    "title": "Taught a shared board to play nice",
    "detail": "Live edit locks, presence and field-level permissions, so several teams can plan one floor without overwriting each other.",
    "source": "Commit history, Jul – Sep 2026",
    "evidence": ["fb-locks", "fb-presence", "fb-fields"]
  },
  {
    "id": "savings",
    "quest": "main",
    "title": "Integrations that save time and money",
    "detail": "Background OneDrive uploads that retry, cached travel-time lookups and a reworked KPI score.",
    "source": "Commit history, Dec 2025 – Jan 2026",
    "evidence": ["fo-onedrive", "fo-maps", "fo-kpi"]
  },
  {
    "id": "mcp",
    "quest": "main",
    "title": "Gave an AI assistant a secure front door",
    "detail": "An MCP connector secured with Entra ID, so AI tools only see data as a signed-in user.",
    "source": "Commit history, Jul 2026",
    "evidence": ["fo-mcp"]
  },
  {
    "id": "reconcile",
    "quest": "main",
    "title": "Made operations and finance agree",
    "detail": "Projects matched to their NetSuite records, so both teams see the same job.",
    "source": "Commit history, May 2026",
    "evidence": ["fo-reconcile"]
  },
  {
    "id": "taskforge",
    "quest": "side",
    "title": "Scheduled tasks that never double up",
    "detail": "Apply a TaskForge profile twice and nothing changes: tests and safe storage from day one.",
    "source": "Commit history, Apr 2026",
    "evidence": ["tf-core", "tf-tests", "tf-persistence"]
  },
  {
    "id": "bisaya",
    "quest": "side",
    "title": "Speaks the commuter's language",
    "detail": "ISBOGI switches between English and Bisaya, and warns when its data goes stale.",
    "source": "Project history, Nov 2026",
    "evidence": ["is-i18n", "is-weak"]
  }
];
