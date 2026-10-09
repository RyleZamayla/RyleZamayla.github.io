import type { Achievement } from "./types.ts";

export const achievements: Achievement[] = [
  {
    id: "time-back",
    title: "Cut monthly time tracking from days to hours",
    detail: "Logging a month of work in NetSuite went from 2–3 working days to 3–4 hours with my time tracker.",
    source: "My own estimate",
    evidence: ["tt-engine", "tt-summaries"],
  },
  {
    id: "commits",
    title: "2,455 commits across six projects",
    detail: "Non-merge commits under my name from October 2025 to October 2026.",
    source: "Commit history exported from each repository",
    evidence: [],
  },
  {
    id: "signoff",
    title: "Shipped digital sign-off across three systems",
    detail: "Collected on the technician app, stored and rendered as a PDF by the operations platform, and shown to clients in the portal.",
    source: "Commit history, Aug 2026",
    evidence: ["fa-signoff", "fo-signoff", "cp-signoff"],
  },
  {
    id: "sweltrack",
    title: "254 commits in SwelTrack's first twelve days",
    detail: "254 commits between 1 and 12 July 2026 covering leave, time records, payroll rules, billing and a security pass.",
    source: "Commit history",
    evidence: ["sw-leave", "sw-premiums", "sw-tenant"],
  },
  {
    id: "sso",
    title: "Put Microsoft sign-in in front of two systems",
    detail: "Entra ID authentication for the floor planning board and for an AI assistant connector.",
    source: "Commit history",
    evidence: ["fb-sso", "fo-mcp"],
  },
];
