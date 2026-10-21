/*
 * Snapshots of each project, of two kinds:
 *  - "screenshot": a real capture of the actual app, run against demo data.
 *    Only for projects whose code is Ryle's own. Images live in public/snapshots/.
 *  - everything else: an illustration of a verified feature, drawn here from
 *    blocks with invented demo data. Used where real screens can't be shown
 *    (work projects, or apps we haven't run yet).
 * Each kind is labelled differently on the site. Never put real names,
 * clients, figures or internal company screens in here.
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
  frame: "browser" | "phone" | "terminal" | "screenshot";
  /** For real screenshots: the image under public/, and its pixel size. */
  image?: { src: string; width: number; height: number };
  /** Address bar text, app bar title, or terminal window title. */
  title: string;
  /** What the illustration shows. Also used as its text alternative. */
  caption: string;
  blocks: Block[];
}

export const snapshots: Record<string, Snapshot[]> = {
  "time-tracker": [
    {
      id: "tt-real-unsynced",
      frame: "screenshot",
      title: "Unsynced commits",
      caption: "A day's commits grouped by repository, ticked and ready to log, each with its own copy-ready memo.",
      image: { src: "/snapshots/time-tracker/unsynced.webp", width: 1600, height: 1975 },
      blocks: [],
    },
    {
      id: "tt-real-summary",
      frame: "screenshot",
      title: "Daily summary",
      caption: "One click turns a day of commits into a short, editable summary per repository.",
      image: { src: "/snapshots/time-tracker/summary.webp", width: 1520, height: 1180 },
      blocks: [],
    },
    {
      id: "tt-real-synced",
      frame: "screenshot",
      title: "Synced history",
      caption: "The Synced tab keeps a permanent, read-only record of everything already logged.",
      image: { src: "/snapshots/time-tracker/synced.webp", width: 1600, height: 1145 },
      blocks: [],
    },
    {
      id: "tt-real-overview",
      frame: "screenshot",
      title: "Settings and tracked repositories",
      caption: "Setup: who to track, where the repositories live, and each one's starting point.",
      image: { src: "/snapshots/time-tracker/overview.webp", width: 1600, height: 1015 },
      blocks: [],
    },
  ],
  sweltrack: [
    {
      id: "sw-real-payslip",
      frame: "screenshot",
      title: "Computed payslip",
      caption: "A computed payslip: earnings, government deductions and withholding tax, beside the attendance logs they came from.",
      image: { src: "/snapshots/sweltrack/payslip.webp", width: 1600, height: 841 },
      blocks: [],
    },
    {
      id: "sw-real-dashboard",
      frame: "screenshot",
      title: "Payroll dashboard",
      caption: "Remittance deadlines for SSS, PhilHealth, Pag-IBIG and BIR, with year-to-date contributions.",
      image: { src: "/snapshots/sweltrack/dashboard.webp", width: 1600, height: 427 },
      blocks: [],
    },
    {
      id: "sw-real-roster",
      frame: "screenshot",
      title: "Team roster",
      caption: "The weekly roster: shifts per employee, with batch editing, one-day overrides and change requests.",
      image: { src: "/snapshots/sweltrack/roster.webp", width: 1600, height: 814 },
      blocks: [],
    },
    {
      id: "sw-real-login",
      frame: "screenshot",
      title: "Sign in",
      caption: "The sign-in page.",
      image: { src: "/snapshots/sweltrack/login.webp", width: 1600, height: 835 },
      blocks: [],
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

export function isScreenshot(s: Snapshot): boolean {
  return s.frame === "screenshot" && !!s.image;
}

export function getSnapshots(slug: string): Snapshot[] {
  return snapshots[slug] ?? [];
}
