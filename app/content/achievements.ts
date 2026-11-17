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
  }
];
