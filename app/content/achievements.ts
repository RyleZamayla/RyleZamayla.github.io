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
    "id": "commits",
    "quest": "main",
    "title": "2,476 commits across eight projects",
    "detail": "Non-merge commits under my name, June 2023 to October 2026.",
    "source": "Commit history exported from each repository",
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
    "title": "254 commits in SwelTrack's first twelve days",
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
