/*
 * Illustrated "snapshots" of each project. These are NOT screenshots: they are
 * drawings of features the audit verified, filled with invented demo data, and
 * every one is captioned as an illustration on the site. Never put real names,
 * clients, figures or internal screens in here.
 */

export type Tone = "mint" | "ember" | "muted" | "paper";

export type Block =
  | { type: "tabs"; items: string[]; active: number }
  | { type: "heading"; text: string; meta?: string }
  | { type: "stats"; items: { value: string; label: string }[] }
  | { type: "rows"; rows: { label: string; meta?: string; chip?: { text: string; tone: Tone }; check?: boolean }[] }
  | { type: "table"; head: string[]; rows: string[][]; highlight?: number }
  | { type: "banner"; tone: Tone; text: string }
  | { type: "code"; lines: string[] }
  | { type: "grid"; cols: number; cells: Tone[]; legend?: { tone: Tone; text: string }[] }
  | { type: "fields"; fields: { label: string; value: string }[] }
  | { type: "buttons"; items: { text: string; primary?: boolean }[] }
  | { type: "scanner"; hint: string }
  | { type: "signature"; label: string };

export interface Snapshot {
  id: string;
  frame: "browser" | "phone" | "terminal";
  /** Address bar text, app bar title, or terminal window title. */
  title: string;
  /** What the illustration shows. Also used as its text alternative. */
  caption: string;
  blocks: Block[];
}

export const snapshots: Record<string, Snapshot[]> = {
  "time-tracker": [
    {
      id: "tt-unsynced",
      frame: "browser",
      title: "localhost:8787",
      caption: "Unsynced commits grouped by day and repository, each with its own copy-ready memo.",
      blocks: [
        { type: "tabs", items: ["Unsynced", "Synced"], active: 0 },
        { type: "heading", text: "1 Sep 2026", meta: "demo-api · 3 commits" },
        {
          type: "rows",
          rows: [
            { check: true, label: "Add booking export to CSV", meta: "a1b2c3d", chip: { text: "Copy memo", tone: "mint" } },
            { check: true, label: "Fix timezone shift in date filter", meta: "4e5f6a7", chip: { text: "Copy memo", tone: "mint" } },
            { check: false, label: "Refactor sync state loading", meta: "8b9c0d1", chip: { text: "Copy memo", tone: "mint" } },
          ],
        },
        { type: "buttons", items: [{ text: "Mark checked as synced", primary: true }, { text: "Generate summary" }] },
      ],
    },
    {
      id: "tt-summary",
      frame: "browser",
      title: "localhost:8787 · daily summary",
      caption: "A rule-based daily summary: commit titles only, de-duplicated, ready to edit and copy.",
      blocks: [
        { type: "heading", text: "Summary for 1 Sep 2026", meta: "demo-api" },
        {
          type: "code",
          lines: ["Add booking export to CSV; Fix timezone shift", "in date filter; Refactor sync state loading;", "Add retry to report job (+2 more commits)"],
        },
        { type: "buttons", items: [{ text: "Copy", primary: true }, { text: "Summarize next 2" }] },
      ],
    },
  ],
  sweltrack: [
    {
      id: "sw-payroll",
      frame: "browser",
      title: "sweltrack.local/payroll",
      caption: "A payroll run where holiday and rest-day premiums are calculated from each person's schedule.",
      blocks: [
        { type: "heading", text: "Payroll run", meta: "1–15 Jul 2026 · Demo Co." },
        {
          type: "table",
          head: ["Employee", "Days", "Premiums", "Net pay"],
          rows: [
            ["J. Dela Cruz", "11", "₱1,240", "₱14,980"],
            ["M. Reyes", "10", "₱0", "₱12,600"],
            ["A. Santos", "11", "₱2,310", "₱16,050"],
          ],
          highlight: 2,
        },
        { type: "buttons", items: [{ text: "Approve run", primary: true }, { text: "Export" }] },
      ],
    },
    {
      id: "sw-leave",
      frame: "browser",
      title: "sweltrack.local/requests",
      caption: "Self-service requests routed to the right approver, including time-record corrections.",
      blocks: [
        { type: "tabs", items: ["Leave", "Corrections", "Schedules"], active: 0 },
        {
          type: "rows",
          rows: [
            { label: "Vacation leave · 2 days", meta: "J. Dela Cruz", chip: { text: "Approved", tone: "mint" } },
            { label: "Sick leave · 1 day", meta: "M. Reyes", chip: { text: "Pending", tone: "ember" } },
            { label: "Time correction · 8 Jul", meta: "A. Santos", chip: { text: "Pending", tone: "ember" } },
          ],
        },
        { type: "stats", items: [{ value: "12", label: "leave days left" }, { value: "2", label: "awaiting you" }] },
      ],
    },
  ],
  taskforge: [
    {
      id: "tf-profile",
      frame: "terminal",
      title: "profiles/reboot-morning.json",
      caption: "A TaskForge profile: one JSON file describes one scheduled task, its schedule and its action.",
      blocks: [
        {
          type: "code",
          lines: [
            "{",
            '  "profile_id": "reboot-morning",',
            '  "profile_type": "restart_system",',
            '  "schedules": [',
            '    { "schedule_type": "daily", "time": "08:00" }',
            "  ],",
            '  "action": { "method": "powershell" },',
            '  "run_level": "highest"',
            "}",
          ],
        },
      ],
    },
    {
      id: "tf-apply",
      frame: "terminal",
      title: "TaskForge",
      caption: "Applying a profile twice: the second run finds nothing to change, so no duplicate task is created.",
      blocks: [
        {
          type: "code",
          lines: [
            "$ taskforge apply reboot-morning",
            "✓ profile valid",
            "✓ registered task (SYSTEM account)",
            "$ taskforge apply reboot-morning",
            "✓ already in sync, nothing to change",
          ],
        },
      ],
    },
  ],
  "mobile-queue-app": [
    {
      id: "mq-scan",
      frame: "phone",
      title: "Queue",
      caption: "The QR code scanner screen.",
      blocks: [{ type: "scanner", hint: "Point the camera at your QR code" }],
    },
    {
      id: "mq-form",
      frame: "phone",
      title: "Join the queue",
      caption: "The student queue form.",
      blocks: [
        { type: "fields", fields: [{ label: "Student ID", value: "2023-00417" }, { label: "Service", value: "Enrollment" }] },
        { type: "buttons", items: [{ text: "Join queue", primary: true }] },
      ],
    },
  ],
  "field-operations-platform": [
    {
      id: "fo-dashboard",
      frame: "browser",
      title: "ops.example/dashboard",
      caption: "Support and deployment tasks with service-level tracking.",
      blocks: [
        { type: "stats", items: [{ value: "42", label: "open tasks" }, { value: "7", label: "due today" }, { value: "96%", label: "on time" }] },
        {
          type: "rows",
          rows: [
            { label: "Device offline · Site 14", meta: "Support", chip: { text: "Due 2h", tone: "ember" } },
            { label: "New install · Site 22", meta: "Deployment", chip: { text: "Booked", tone: "mint" } },
            { label: "Maintenance visit · Site 03", meta: "Support", chip: { text: "Done", tone: "muted" } },
          ],
        },
      ],
    },
    {
      id: "fo-booking",
      frame: "browser",
      title: "ops.example/bookings",
      caption: "Booking a technician, ranked by travel time from cached distance lookups.",
      blocks: [
        { type: "heading", text: "Book a technician", meta: "Site 14" },
        {
          type: "rows",
          rows: [
            { label: "Technician 02", meta: "18 min away", chip: { text: "Book", tone: "mint" } },
            { label: "Technician 05", meta: "34 min away", chip: { text: "Book", tone: "mint" } },
            { label: "Technician 11", meta: "52 min away", chip: { text: "Book", tone: "mint" } },
          ],
        },
      ],
    },
  ],
  "field-technician-app": [
    {
      id: "fa-job",
      frame: "phone",
      title: "Job 1042",
      caption: "Working offline: progress is saved on the phone and queued to sync later.",
      blocks: [
        { type: "banner", tone: "ember", text: "Offline · 3 changes waiting to sync" },
        {
          type: "rows",
          rows: [
            { check: true, label: "Arrived on site" },
            { check: true, label: "Photos uploaded" },
            { check: false, label: "Customer sign-off" },
          ],
        },
      ],
    },
    {
      id: "fa-signoff",
      frame: "phone",
      title: "Sign-off",
      caption: "Collecting a digital sign-off with no signal; it uploads when the phone reconnects.",
      blocks: [
        { type: "signature", label: "Customer signature" },
        { type: "buttons", items: [{ text: "Save and sync later", primary: true }] },
      ],
    },
  ],
  "client-service-portal": [
    {
      id: "cp-tickets",
      frame: "browser",
      title: "portal.example/tickets",
      caption: "Clients following their own tickets.",
      blocks: [
        {
          type: "table",
          head: ["Ticket", "Site", "Status"],
          rows: [
            ["#2291", "Site 14", "In progress"],
            ["#2288", "Site 03", "Resolved"],
            ["#2275", "Site 22", "Scheduled"],
          ],
          highlight: 0,
        },
      ],
    },
    {
      id: "cp-signoffs",
      frame: "browser",
      title: "portal.example/sign-offs",
      caption: "Completed sign-offs from the technician app, available to clients as PDFs.",
      blocks: [
        { type: "heading", text: "Completed sign-offs" },
        {
          type: "rows",
          rows: [
            { label: "Install sign-off · Site 22", meta: "18 Aug 2026", chip: { text: "PDF", tone: "mint" } },
            { label: "Repair sign-off · Site 14", meta: "15 Aug 2026", chip: { text: "PDF", tone: "mint" } },
          ],
        },
      ],
    },
  ],
  "floor-planning-board": [
    {
      id: "fb-board",
      frame: "browser",
      title: "floor.example/board",
      caption: "Bays on the floor and what occupies them; a bay locks while someone edits it.",
      blocks: [
        { type: "banner", tone: "ember", text: "Bay C2 is being edited by the Planning team" },
        {
          type: "grid",
          cols: 6,
          cells: ["mint", "mint", "muted", "ember", "mint", "muted", "muted", "mint", "ember", "mint", "muted", "mint"],
          legend: [
            { tone: "mint", text: "In use" },
            { tone: "ember", text: "Locked for editing" },
            { tone: "muted", text: "Free" },
          ],
        },
      ],
    },
    {
      id: "fb-audit",
      frame: "browser",
      title: "floor.example/audit",
      caption: "An audit log that records who really made a change, even when an admin acts as another user.",
      blocks: [
        { type: "heading", text: "Audit log" },
        {
          type: "rows",
          rows: [
            { label: "Moved Project 7 to Bay A3", meta: "Admin, acting as Planner", chip: { text: "10:42", tone: "muted" } },
            { label: "Changed stage to Testing", meta: "Production team", chip: { text: "10:15", tone: "muted" } },
          ],
        },
      ],
    },
  ],
  "procurement-workflow": [
    {
      id: "pw-compare",
      frame: "browser",
      title: "procure.example/requests/118",
      caption: "Comparing vendor quotes on a pricing request.",
      blocks: [
        { type: "heading", text: "Pricing request #118", meta: "3 quotes" },
        {
          type: "table",
          head: ["Vendor", "Unit price", "Lead time"],
          rows: [
            ["Vendor A", "$412", "3 weeks"],
            ["Vendor B", "$389", "4 weeks"],
            ["Vendor C", "$405", "2 weeks"],
          ],
          highlight: 1,
        },
      ],
    },
    {
      id: "pw-lines",
      frame: "browser",
      title: "procure.example/requests/118/items",
      caption: "Tracking each line item's status through the request.",
      blocks: [
        {
          type: "rows",
          rows: [
            { label: "Laptops × 4", meta: "Line 1", chip: { text: "Quoted", tone: "mint" } },
            { label: "Docking stations × 4", meta: "Line 2", chip: { text: "Awaiting quote", tone: "ember" } },
            { label: "Monitors × 4", meta: "Line 3", chip: { text: "Approved", tone: "mint" } },
          ],
        },
      ],
    },
  ],
};

export function getSnapshots(slug: string): Snapshot[] {
  return snapshots[slug] ?? [];
}
