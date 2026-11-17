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
  | { type: "rows"; rows: { label: string; meta?: string; chip?: { text: string; tone: Tone }; check?: boolean; avatar?: string }[] }
  | { type: "table"; head: string[]; rows: string[][]; highlight?: number }
  | { type: "banner"; tone: Tone; text: string }
  | { type: "code"; lines: string[] }
  | { type: "grid"; cols: number; cells: Tone[]; legend?: { tone: Tone; text: string }[] }
  | { type: "fields"; fields: { label: string; value: string; readonly?: boolean }[] }
  | { type: "buttons"; items: { text: string; primary?: boolean }[] }
  | { type: "scanner"; hint: string }
  | { type: "signature"; label: string }
  /* Richer pieces, used to draw private work systems more faithfully. */
  | { type: "split"; ratio?: "1:1" | "2:1" | "3:2"; left: Block[]; right: Block[] }
  | { type: "filters"; search?: string; chips: { text: string; active?: boolean }[] }
  | { type: "bars"; title: string; labels: string[]; values: number[]; highlight?: number; target?: number }
  | { type: "line"; title: string; points: number[]; from?: string; to?: string }
  | { type: "rings"; items: { value: number; label: string; tone: Tone }[] }
  | { type: "map"; pins: { x: number; y: number; tone: Tone; label?: string; n?: string; big?: boolean }[]; route?: [number, number][]; variant?: 0 | 1 }
  | { type: "floor"; cols: number; rows: number; zones: FloorZone[]; legend?: { tone: Tone; text: string }[] }
  | { type: "feed"; title?: string; items: { time: string; title: string; meta?: string; tone?: Tone; tag?: string }[] }
  | { type: "steps"; items: string[]; active: number }
  | { type: "kv"; items: { k: string; v: string; tone?: Tone }[]; cols?: 1 | 2 }
  | { type: "queue"; items: { label: string; meta?: string; state: "synced" | "sending" | "waiting" | "retry" | "paused" }[] }
  | { type: "doc"; title: string; ref: string; lines: { k: string; v: string }[]; signed?: boolean; stamp?: string }
  | { type: "compare"; max: number; items: { label: string; value: number; display: string; note: string; best?: boolean }[] }
  | { type: "photos"; labels: string[] }
  | { type: "tabbar"; items: string[]; active: number }
  | { type: "otp"; digits: string; hint: string }
  | { type: "matrix"; head: string[]; rows: { label: string; cells: boolean[] }[] };

export interface FloorZone {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  status: "use" | "free" | "locked" | "hold";
  /** Initials of whoever is editing a locked bay. */
  editor?: string;
}

/** Left navigation and top bar for browser-style illustrations of work systems. */
export interface Shell {
  brand: string;
  nav: string[];
  active: number;
  crumb: string;
  user: string;
}

export interface Snapshot {
  id: string;
  frame: "browser" | "phone" | "terminal" | "screenshot";
  /** For real screenshots: the image under public/, and its pixel size. */
  image?: { src: string; width: number; height: number };
  /** Address bar text, app bar title, or terminal window title. */
  title: string;
  /** Optional app shell (sidebar and top bar) around the blocks. */
  shell?: Shell;
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
      id: "tf-real-gui",
      frame: "screenshot",
      title: "TaskForge window",
      caption: "The TaskForge window: validate and apply a profile file, with a dry-run switch and a live output log.",
      image: { src: "/snapshots/taskforge/gui-main.webp", width: 1600, height: 1147 },
      blocks: [],
    },
    {
      id: "tf-real-gui-new",
      frame: "screenshot",
      title: "Create a profile",
      caption: "The profile builder: schedule, weekdays, action and retry policy, saved as the JSON file TaskForge applies.",
      image: { src: "/snapshots/taskforge/gui-new.webp", width: 1400, height: 1378 },
      blocks: [],
    },
    {
      id: "tf-real-terminal",
      frame: "screenshot",
      title: "TaskForge command line",
      caption: "The command line: a valid profile, a dry run that registers nothing, and a profile rejected with a clear error.",
      image: { src: "/snapshots/taskforge/terminal.webp", width: 1600, height: 788 },
      blocks: [],
    },
  ],
  wais: [
    {
      id: "ws-real-journal",
      frame: "screenshot",
      title: "Journal",
      caption: "The daily journal: a streak, a weekly recap and each day's transactions, on sample data.",
      image: { src: "/snapshots/wais/journal.webp", width: 600, height: 1304 },
      blocks: [],
    },
    {
      id: "ws-real-insights",
      frame: "screenshot",
      title: "Insights",
      caption: "Spending by category for the month, on sample data.",
      image: { src: "/snapshots/wais/insights.webp", width: 600, height: 1304 },
      blocks: [],
    },
    {
      id: "ws-real-accounts",
      frame: "screenshot",
      title: "Accounts",
      caption: "Net worth and account balances, including a credit card with its billing cycle, on sample data.",
      image: { src: "/snapshots/wais/accounts.webp", width: 600, height: 1304 },
      blocks: [],
    },
  ],
  isbogi: [
    {
      id: "is-real-board",
      frame: "screenshot",
      title: "Departures board",
      caption: "The next van at a stop, with countdown and seats free. Simulated vehicle data.",
      image: { src: "/snapshots/isbogi/board.webp", width: 600, height: 1298 },
      blocks: [],
    },
    {
      id: "is-real-trip",
      frame: "screenshot",
      title: "Trip detail",
      caption: "A van's countdown and seat map. Simulated vehicle data.",
      image: { src: "/snapshots/isbogi/trip.webp", width: 600, height: 1298 },
      blocks: [],
    },
    {
      id: "is-real-map",
      frame: "screenshot",
      title: "Live map",
      caption: "Vans on all four routes, coloured by seats left. Simulated vehicle data.",
      image: { src: "/snapshots/isbogi/map.webp", width: 600, height: 1298 },
      blocks: [],
    },
    {
      id: "is-real-panel",
      frame: "screenshot",
      title: "Facilitator panel",
      caption: "Session control: fleet status and live map, used to run test scenarios.",
      image: { src: "/snapshots/isbogi/admin.webp", width: 1600, height: 1000 },
      blocks: [],
    },
  ],
  "field-operations-platform": [
    {
      id: "fo-dashboard",
      frame: "browser",
      title: "ops.example/dashboard",
      shell: { brand: "Ops", nav: ["Dashboard", "Tasks", "Bookings", "Projects", "KPIs", "Documents"], active: 0, crumb: "Dashboard", user: "TS" },
      caption: "The operations dashboard: open work, service-level tracking and who is on what.",
      blocks: [
        { type: "stats", items: [{ value: "42", label: "open tasks" }, { value: "7", label: "due today" }, { value: "96%", label: "on time" }, { value: "3", label: "unassigned" }] },
        {
          type: "split",
          ratio: "3:2",
          left: [{ type: "bars", title: "Tasks closed per week", labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"], values: [31, 28, 35, 33, 38, 36, 41, 44], highlight: 7, target: 36 }],
          right: [{ type: "rings", items: [{ value: 96, label: "On time", tone: "mint" }, { value: 88, label: "First reply", tone: "ember" }] }],
        },
        {
          type: "rows",
          rows: [
            { avatar: "TS", label: "Device offline · Site 14", meta: "Support · SLA 2h left", chip: { text: "Due 2h", tone: "ember" } },
            { avatar: "RM", label: "New install · Site 22", meta: "Deployment · Thu 09:00", chip: { text: "Booked", tone: "mint" } },
            { avatar: "JD", label: "Maintenance visit · Site 03", meta: "Support · Completed", chip: { text: "Done", tone: "muted" } },
          ],
        },
      ],
    },
    {
      id: "fo-booking",
      frame: "browser",
      title: "ops.example/bookings/new",
      shell: { brand: "Ops", nav: ["Dashboard", "Tasks", "Bookings", "Projects", "KPIs", "Documents"], active: 2, crumb: "Bookings / New", user: "TS" },
      caption: "Booking a technician: nearest first by travel time, with distance lookups cached to avoid repeat charges.",
      blocks: [
        { type: "heading", text: "Book a technician", meta: "Site 14 · Install visit" },
        {
          type: "split",
          ratio: "1:1",
          left: [
            {
              type: "map",
              variant: 0,
              route: [[52, 80], [52, 55], [92, 55], [128, 38]],
              pins: [
                { x: 128, y: 38, tone: "ember", label: "Site 14", big: true },
                { x: 52, y: 80, tone: "mint", n: "2", label: "18 min" },
                { x: 168, y: 82, tone: "mint", n: "5", label: "34 min" },
                { x: 24, y: 24, tone: "muted", n: "11", label: "52 min" },
              ],
            },
          ],
          right: [
            {
              type: "rows",
              rows: [
                { avatar: "02", label: "Tech 02", meta: "18 min · cached", chip: { text: "Book", tone: "mint" } },
                { avatar: "05", label: "Tech 05", meta: "34 min · cached", chip: { text: "Book", tone: "mint" } },
                { avatar: "11", label: "Tech 11", meta: "52 min · fresh", chip: { text: "Book", tone: "muted" } },
              ],
            },
            { type: "kv", items: [{ k: "Lookups today", v: "41" }, { k: "From cache", v: "38", tone: "mint" }] },
          ],
        },
      ],
    },
    {
      id: "fo-reconcile",
      frame: "browser",
      title: "ops.example/projects/reconcile",
      shell: { brand: "Ops", nav: ["Dashboard", "Tasks", "Bookings", "Projects", "KPIs", "Documents"], active: 3, crumb: "Projects / Reconciliation", user: "TS" },
      caption: "Matching projects to their finance records, with document uploads running in the background.",
      blocks: [
        { type: "filters", search: "Search projects", chips: [{ text: "All 24", active: true }, { text: "Matched 19" }, { text: "Needs review 3" }, { text: "Unlinked 2" }] },
        {
          type: "table",
          head: ["Project", "Ops", "Finance", "Status"],
          rows: [
            ["Install · Site 22", "OP-0418", "NS-7731", "Matched"],
            ["Refresh · Site 07", "OP-0421", "NS-7740", "Matched"],
            ["Repair · Site 14", "OP-0425", "NS-7745", "Needs review"],
            ["Install · Site 31", "OP-0433", "-", "Unlinked"],
          ],
          highlight: 2,
        },
        {
          type: "feed",
          title: "Background jobs",
          items: [
            { time: "10:42", title: "sign-off-1042.pdf", meta: "Uploaded to OneDrive", tone: "mint" },
            { time: "10:41", title: "site-photos-0418.zip", meta: "Retrying, attempt 2 of 3", tone: "ember" },
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
      caption: "A job on site: progress, photos and checklist, saved on the phone even with no signal.",
      blocks: [
        { type: "banner", tone: "ember", text: "Offline · 3 changes waiting to sync" },
        { type: "kv", cols: 2, items: [{ k: "Site", v: "Site 14" }, { k: "Window", v: "09:00 to 11:00" }, { k: "Type", v: "Repair" }, { k: "Contact", v: "On site" }] },
        { type: "steps", items: ["Arrive", "Work", "Photos", "Sign"], active: 1 },
        { type: "rows", rows: [{ check: true, label: "Arrived on site" }, { check: true, label: "Replaced media player" }, { check: false, label: "Upload photos" }] },
        { type: "photos", labels: ["Before", "After", "Rack"] },
        { type: "tabbar", items: ["Jobs", "Scan", "Sync", "Me"], active: 0 },
      ],
    },
    {
      id: "fa-sync",
      frame: "phone",
      title: "Sync",
      caption: "The sync queue: changes wait in order, and a circuit breaker pauses sync when the server keeps failing.",
      blocks: [
        { type: "banner", tone: "ember", text: "Server unavailable · sync paused" },
        { type: "kv", cols: 2, items: [{ k: "Next retry", v: "04:00" }, { k: "Failures", v: "5 in a row", tone: "ember" }] },
        {
          type: "queue",
          items: [
            { label: "Status: On site", meta: "Job 1042 · 10:41", state: "synced" },
            { label: "Photos × 3", meta: "Job 1042 · waiting", state: "paused" },
            { label: "Sign-off", meta: "Job 1042 · waiting", state: "waiting" },
            { label: "Status: Complete", meta: "Job 1042 · waiting", state: "waiting" },
          ],
        },
        { type: "buttons", items: [{ text: "Retry now", primary: true }] },
        { type: "tabbar", items: ["Jobs", "Scan", "Sync", "Me"], active: 2 },
      ],
    },
    {
      id: "fa-signoff",
      frame: "phone",
      title: "Sign-off",
      caption: "Collecting a customer sign-off from a template stored on the phone; it uploads when signal returns.",
      blocks: [
        { type: "banner", tone: "mint", text: "Template stored on this phone" },
        { type: "doc", title: "Service sign-off", ref: "Job 1042", lines: [{ k: "Site", v: "Site 14" }, { k: "Work done", v: "Replaced media player" }, { k: "Date", v: "17 Aug 2026" }], signed: true },
        { type: "buttons", items: [{ text: "Clear" }, { text: "Save and sync later", primary: true }] },
      ],
    },
    {
      id: "fa-jobs",
      frame: "phone",
      title: "Jobs",
      caption: "Today's jobs, with a push notification when new work is assigned.",
      blocks: [
        { type: "banner", tone: "mint", text: "New job assigned · Site 22" },
        { type: "tabs", items: ["Today", "Upcoming", "Done"], active: 0 },
        {
          type: "rows",
          rows: [
            { label: "Repair · Site 14", meta: "09:00 · 12 km", chip: { text: "Active", tone: "mint" } },
            { label: "Install · Site 22", meta: "13:00 · 28 km", chip: { text: "New", tone: "ember" } },
            { label: "Check · Site 03", meta: "16:30 · 9 km", chip: { text: "Next", tone: "muted" } },
          ],
        },
        { type: "scanner", hint: "Scan a job code to open it" },
        { type: "tabbar", items: ["Jobs", "Scan", "Sync", "Me"], active: 0 },
      ],
    },
  ],
  "client-service-portal": [
    {
      id: "cp-tickets",
      frame: "browser",
      title: "portal.example/tickets",
      shell: { brand: "Portal", nav: ["Tickets", "Sign-offs", "Feedback", "Account"], active: 0, crumb: "Tickets", user: "CL" },
      caption: "Clients following their own tickets, with the full status history of each one.",
      blocks: [
        { type: "filters", search: "Search tickets", chips: [{ text: "All", active: true }, { text: "Open" }, { text: "Resolved" }] },
        {
          type: "split",
          ratio: "3:2",
          left: [
            {
              type: "table",
              head: ["Ticket", "Site", "Status"],
              rows: [
                ["#2291", "Site 14", "In progress"],
                ["#2288", "Site 03", "Resolved"],
                ["#2284", "Site 22", "Scheduled"],
                ["#2275", "Site 22", "Resolved"],
              ],
              highlight: 0,
            },
          ],
          right: [
            { type: "heading", text: "Ticket #2291", meta: "In progress" },
            { type: "steps", items: ["Logged", "Booked", "On site", "Done"], active: 2 },
            {
              type: "feed",
              items: [
                { time: "10:42", title: "Technician on site", tone: "mint" },
                { time: "09:15", title: "Visit booked for today", tone: "mint" },
                { time: "Mon", title: "Ticket logged", tone: "muted" },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "cp-signoffs",
      frame: "browser",
      title: "portal.example/sign-offs",
      shell: { brand: "Portal", nav: ["Tickets", "Sign-offs", "Feedback", "Account"], active: 1, crumb: "Sign-offs", user: "CL" },
      caption: "Completed sign-offs from the technician app, linked to each site and available as PDFs.",
      blocks: [
        {
          type: "split",
          ratio: "1:1",
          left: [
            { type: "heading", text: "Completed sign-offs", meta: "24" },
            {
              type: "rows",
              rows: [
                { label: "Install · Site 22", meta: "18 Aug 2026", chip: { text: "PDF", tone: "mint" } },
                { label: "Repair · Site 14", meta: "15 Aug 2026", chip: { text: "PDF", tone: "mint" } },
                { label: "Check · Site 03", meta: "12 Aug 2026", chip: { text: "PDF", tone: "mint" } },
                { label: "Install · Site 07", meta: "04 Aug 2026", chip: { text: "PDF", tone: "mint" } },
              ],
            },
          ],
          right: [{ type: "doc", title: "Service sign-off", ref: "Install · Site 22", lines: [{ k: "Site", v: "Site 22" }, { k: "Work done", v: "New install" }, { k: "Signed", v: "18 Aug 2026" }], signed: true, stamp: "SIGNED" }],
        },
      ],
    },
    {
      id: "cp-account",
      frame: "browser",
      title: "portal.example/account",
      shell: { brand: "Portal", nav: ["Tickets", "Sign-offs", "Feedback", "Account"], active: 3, crumb: "Account / Security", user: "CL" },
      caption: "Two-factor sign-in, and feedback that is forwarded to the operations team as a work item.",
      blocks: [
        {
          type: "split",
          ratio: "1:1",
          left: [
            { type: "heading", text: "Two-factor sign-in" },
            { type: "otp", digits: "482913", hint: "Enter the code from your authenticator app" },
            { type: "buttons", items: [{ text: "Verify", primary: true }] },
          ],
          right: [
            { type: "heading", text: "Send feedback" },
            { type: "fields", fields: [{ label: "Subject", value: "Visit went well" }, { label: "Message", value: "Quick and tidy work." }] },
            { type: "buttons", items: [{ text: "Send", primary: true }] },
            { type: "banner", tone: "mint", text: "Sent to the operations team" },
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
      shell: { brand: "Floor", nav: ["Board", "Projects", "Zones", "Audit", "Users"], active: 0, crumb: "Board / Hall 1", user: "PL" },
      caption: "The shared floor: bays by zone, what occupies each, and a lock on any bay someone is editing.",
      blocks: [
        { type: "banner", tone: "ember", text: "Bay C2 is being edited by Planning" },
        {
          type: "floor",
          cols: 12,
          rows: 6,
          legend: [
            { tone: "mint", text: "In use" },
            { tone: "ember", text: "Locked for editing" },
            { tone: "paper", text: "On hold" },
            { tone: "muted", text: "Free" },
          ],
          zones: [
            { x: 0, y: 0, w: 3, h: 2, label: "A1", sub: "Project 7", status: "use" },
            { x: 3, y: 0, w: 3, h: 2, label: "A2", sub: "Project 12", status: "use" },
            { x: 6, y: 0, w: 3, h: 2, label: "A3", sub: "Free", status: "free" },
            { x: 9, y: 0, w: 3, h: 2, label: "A4", sub: "Project 4", status: "hold" },
            { x: 0, y: 2, w: 3, h: 2, label: "B1", sub: "Project 2", status: "use" },
            { x: 3, y: 2, w: 3, h: 2, label: "B2", sub: "Project 9", status: "use" },
            { x: 6, y: 2, w: 3, h: 2, label: "B3", sub: "Free", status: "free" },
            { x: 9, y: 2, w: 3, h: 2, label: "B4", sub: "Project 15", status: "use" },
            { x: 0, y: 4, w: 4, h: 2, label: "C1", sub: "Project 3", status: "use" },
            { x: 4, y: 4, w: 4, h: 2, label: "C2", sub: "Project 9", status: "locked", editor: "PL" },
            { x: 8, y: 4, w: 4, h: 2, label: "C3", sub: "Free", status: "free" },
          ],
        },
      ],
    },
    {
      id: "fb-permissions",
      frame: "browser",
      title: "floor.example/bays/c2",
      shell: { brand: "Floor", nav: ["Board", "Projects", "Zones", "Audit", "Users"], active: 0, crumb: "Board / Bay C2", user: "PL" },
      caption: "Editing a bay: each team can change only the fields it owns, checked on every save.",
      blocks: [
        { type: "heading", text: "Bay C2", meta: "Lock held by you · 02:14" },
        {
          type: "split",
          ratio: "1:1",
          left: [
            {
              type: "fields",
              fields: [
                { label: "Project", value: "Project 9", readonly: true },
                { label: "Stage", value: "Testing" },
                { label: "Dates", value: "02 Sep to 18 Sep" },
                { label: "Customer", value: "Restricted", readonly: true },
              ],
            },
            { type: "buttons", items: [{ text: "Release lock" }, { text: "Save", primary: true }] },
          ],
          right: [
            { type: "heading", text: "Who can edit" },
            { type: "matrix", head: ["Team", "Stage", "Dates", "Cust."], rows: [{ label: "Planning", cells: [true, true, false] }, { label: "Production", cells: [true, false, false] }, { label: "Sales", cells: [false, false, true] }] },
          ],
        },
      ],
    },
    {
      id: "fb-audit",
      frame: "browser",
      title: "floor.example/audit",
      shell: { brand: "Floor", nav: ["Board", "Projects", "Zones", "Audit", "Users"], active: 3, crumb: "Audit log", user: "AD" },
      caption: "An audit log that records who really made each change, even when an admin acts as another user.",
      blocks: [
        { type: "filters", search: "Search changes", chips: [{ text: "All", active: true }, { text: "Moves" }, { text: "Stage" }, { text: "Acting as" }] },
        {
          type: "feed",
          items: [
            { time: "10:42", title: "Moved Project 7 to Bay A3", meta: "Admin, acting as Planner", tone: "ember", tag: "Acting as" },
            { time: "10:15", title: "Changed stage to Testing", meta: "Production team", tone: "mint" },
            { time: "09:58", title: "Locked Bay C2 for editing", meta: "Planning team", tone: "mint" },
            { time: "09:31", title: "Put Project 4 on hold", meta: "Planning team", tone: "mint" },
          ],
        },
        { type: "banner", tone: "mint", text: "Impersonation is recorded against the real user" },
      ],
    },
  ],
  "procurement-workflow": [
    {
      id: "pw-compare",
      frame: "browser",
      title: "procure.example/requests/118",
      shell: { brand: "Procure", nav: ["Requests", "Vendors", "Approvals", "Reports"], active: 0, crumb: "Requests / #118", user: "BU" },
      caption: "A pricing request: where it is in the process, and vendor quotes compared side by side.",
      blocks: [
        { type: "heading", text: "Pricing request #118", meta: "4 line items" },
        { type: "steps", items: ["Raised", "Quotes in", "Review", "Approved", "Ordered"], active: 2 },
        {
          type: "compare",
          max: 450,
          items: [
            { label: "Vendor A", value: 412, display: "$412", note: "3 weeks" },
            { label: "Vendor B", value: 389, display: "$389", note: "4 weeks", best: true },
            { label: "Vendor C", value: 405, display: "$405", note: "2 weeks" },
          ],
        },
        { type: "kv", cols: 2, items: [{ k: "Requested by", v: "Facilities" }, { k: "Needed by", v: "30 Sep" }] },
      ],
    },
    {
      id: "pw-lines",
      frame: "browser",
      title: "procure.example/requests/118/items",
      shell: { brand: "Procure", nav: ["Requests", "Vendors", "Approvals", "Reports"], active: 0, crumb: "Requests / #118 / Items", user: "BU" },
      caption: "Each line item tracked through the request, with quote documents attached and checked on upload.",
      blocks: [
        { type: "filters", chips: [{ text: "All 4", active: true }, { text: "Quoted 2" }, { text: "Awaiting 1" }, { text: "Approved 1" }] },
        {
          type: "split",
          ratio: "3:2",
          left: [
            {
              type: "rows",
              rows: [
                { label: "Laptops × 4", meta: "Line 1 · Vendor B", chip: { text: "Quoted", tone: "mint" } },
                { label: "Dock stations × 4", meta: "Line 2 · no quote yet", chip: { text: "Waiting", tone: "ember" } },
                { label: "Monitors × 4", meta: "Line 3 · Vendor C", chip: { text: "Approved", tone: "mint" } },
                { label: "Cables × 8", meta: "Line 4 · Vendor A", chip: { text: "Quoted", tone: "mint" } },
              ],
            },
          ],
          right: [
            { type: "heading", text: "Attachments" },
            {
              type: "rows",
              rows: [
                { label: "quote-b.pdf", meta: "Scanned · private", chip: { text: "OK", tone: "mint" } },
                { label: "quote-c.pdf", meta: "Scanned · private", chip: { text: "OK", tone: "mint" } },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "pw-access",
      frame: "browser",
      title: "procure.example/admin/roles",
      shell: { brand: "Procure", nav: ["Requests", "Vendors", "Approvals", "Reports"], active: 2, crumb: "Admin / Roles", user: "AD" },
      caption: "Roles and permissions defined in one place, with an audit trail of every change.",
      blocks: [
        {
          type: "split",
          ratio: "3:2",
          left: [
            { type: "heading", text: "Roles and permissions" },
            { type: "matrix", head: ["Role", "Create", "Quote", "Approve", "Admin"], rows: [{ label: "Requester", cells: [true, false, false, false] }, { label: "Buyer", cells: [true, true, false, false] }, { label: "Approver", cells: [false, false, true, false] }, { label: "Admin", cells: [true, true, true, true] }] },
          ],
          right: [
            {
              type: "feed",
              title: "Audit trail",
              items: [
                { time: "16:02", title: "Approved request #118", meta: "Approver", tone: "mint" },
                { time: "15:40", title: "Added quote, Vendor B", meta: "Buyer", tone: "mint" },
                { time: "15:12", title: "Created request #118", meta: "Requester", tone: "muted" },
              ],
            },
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

/*
 * Product tiles for project lists: a brand lockup beside one or two devices
 * showing the project's own snapshots. Headlines describe what the project
 * does, in plain words, and never promise more than the case study shows.
 */
export interface ThumbSpec {
  /** Short wordmark shown on the tile. Company projects use generic names. */
  name: string;
  /** One or two characters for the app-icon mark. */
  mark: string;
  headline: string;
  platform: string;
  accent: string;
  accent2: string;
  /** window: one large window. phone: two phones. duo: window plus a phone in front. stack: two windows. */
  layout: "window" | "phone" | "duo" | "stack";
  /** Snapshot id of the main device. */
  main: string;
  /** Snapshot id of the second device, if the layout has one. */
  second?: string;
  /** Draw browser chrome around landscape screenshots that have none of their own. */
  chrome?: boolean;
}

export const thumbs: Record<string, ThumbSpec> = {
  "time-tracker": { name: "Time Tracker", mark: "TT", headline: "Commits to timesheets.", platform: "Local web app", accent: "#6fd3a6", accent2: "#2f8f78", layout: "window", main: "tt-real-unsynced", chrome: true },
  sweltrack: { name: "SwelTrack", mark: "ST", headline: "Payroll for Philippine rules.", platform: "Web app", accent: "#7aa8ff", accent2: "#3a56c8", layout: "window", main: "sw-real-payslip", chrome: true },
  taskforge: { name: "TaskForge", mark: "TF", headline: "Scheduled tasks, from JSON.", platform: "Windows", accent: "#b39cff", accent2: "#5b45c4", layout: "stack", main: "tf-real-gui", second: "tf-real-terminal" },
  wais: { name: "WAIS", mark: "W", headline: "Money, kept on your phone.", platform: "iPhone and Android", accent: "#5cc4b8", accent2: "#1f7f86", layout: "phone", main: "ws-real-journal", second: "ws-real-insights" },
  isbogi: { name: "ISBOGI", mark: "IS", headline: "Live van arrivals and seats.", platform: "Mobile web", accent: "#f5c518", accent2: "#1e4fb0", layout: "duo", main: "is-real-panel", second: "is-real-board", chrome: true },
  "field-operations-platform": { name: "Field Ops", mark: "FO", headline: "Support, bookings and KPIs.", platform: "Web platform", accent: "#ff9e5e", accent2: "#c2562a", layout: "window", main: "fo-dashboard" },
  "field-technician-app": { name: "Technician", mark: "FT", headline: "Works with no signal.", platform: "Mobile app", accent: "#6fd3a6", accent2: "#2a7f9a", layout: "phone", main: "fa-job", second: "fa-sync" },
  "client-service-portal": { name: "Client Portal", mark: "CP", headline: "Track tickets, get sign-offs.", platform: "Web portal", accent: "#ff8fb1", accent2: "#a83c78", layout: "window", main: "cp-tickets" },
  "floor-planning-board": { name: "Floor Plan", mark: "FP", headline: "Plan the floor together.", platform: "Web app", accent: "#ffcf5c", accent2: "#b0721e", layout: "window", main: "fb-board" },
  "procurement-workflow": { name: "Procure", mark: "PR", headline: "Quotes and approvals, together.", platform: "Web app", accent: "#7ad7f0", accent2: "#2c6fb0", layout: "window", main: "pw-compare" },
};

export function getThumb(slug: string): ThumbSpec | undefined {
  return thumbs[slug];
}
