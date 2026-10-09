import type { Project } from "./types.ts";

/*
 * Every statement here comes from the October 2026 audit: the time tracker's
 * source and dated backups, and commit logs exported from each repository.
 * Professional projects use generic titles because their code is private.
 * Do not add results, dates or features that aren't backed by that evidence.
 */

const timeTracker: Project = {
  slug: "time-tracker",
  title: "Git to NetSuite Time Tracker",
  kind: "personal",
  tagline:
    "A local tool that turns my git commits into ready-to-paste NetSuite time entries.",
  period: "Aug 2026 to now",
  problem:
    "Every month I log my work into NetSuite's time tracking grid. Rebuilding what I did each day meant digging through commits across several repositories, and a month of entries took two to three working days.",
  overview:
    "The tool scans my local repositories, keeps only my own commits, groups them by day and project, and gives me memo text to paste into NetSuite. It never touches NetSuite itself: my role has no API access, and automating the form was more fragile than copy and paste. It runs entirely on my machine with nothing to install beyond Python and git.",
  role: "Sole developer. I designed, built, tested and use it.",
  stack: ["Python (standard library only)", "Git CLI", "JavaScript, HTML and CSS without libraries", "Bash and AppleScript"],
  integrations: ["Local git repositories", "NetSuite (by copy and paste, deliberately not by API)"],
  stats: [
    {
      value: "2–3 days → 3–4 hours",
      label: "to log a month of work in NetSuite",
      source: "My own estimate, before and after the tool",
    },
    {
      value: "0",
      label: "third-party packages",
      source: "Python standard library and plain browser JavaScript",
    },
  ],
  phases: [
    {
      title: "A shared engine with two front doors",
      period: "25 Aug 2026",
      summary:
        "One engine reads git history and tracks what has been logged. A command-line tool and a local web page both use it, so they never disagree.",
      milestones: [
        {
          id: "tt-engine",
          title: "Commit engine and sync state",
          date: "2026-08-25",
          ref: "first build",
          refKind: "build",
          change:
            "Reads commits across all branches with git log, skips merges, filters to my author email, and records a starting point per repository plus each commit I have marked as logged.",
          significance:
            "Marking commits one at a time means I can log part of a backlog and the rest is still waiting next time. Nothing is skipped or counted twice.",
          verification: "code",
        },
        {
          id: "tt-launcher",
          title: "Double-click launcher that tidies up after itself",
          date: "2026-08-25",
          ref: "2026-08-25f",
          refKind: "build",
          change:
            "The page sends a signal when its tab closes. A fresh random token on every page load lets the server tell a real close from a refresh, then it exits with a special code so the launcher can close its own Terminal window.",
          significance:
            "Browsers can't say whether a page is closing or reloading. The token check settles it without guessing from timing.",
          verification: "tested",
        },
      ],
    },
    {
      title: "Finding the right work quickly",
      period: "25–31 Aug 2026",
      summary:
        "Tools for choosing where tracking starts in each repository and narrowing what's on screen.",
      milestones: [
        {
          id: "tt-find-commit",
          title: "Find a starting commit by hash or message",
          date: "2026-08-27",
          ref: "README, 27 Aug",
          refKind: "build",
          change:
            "Search by part of a commit message or paste a commit hash. A weekly activity chart shows when each repository was busy.",
          significance:
            "Resolving the exact hash first, then falling back to message search, avoids a git quirk where adding --all returns the wrong commit.",
          verification: "code",
        },
        {
          id: "tt-date-filter",
          title: "Date filters that respect my timezone",
          date: "2026-08-27",
          ref: "README, 27 Aug",
          refKind: "build",
          change:
            "Filter by last week, month, three months or a custom range, computed in local time.",
          significance:
            "Converting dates through UTC would shift my +08:00 commits onto the wrong day, so the filters build dates from local parts only.",
          verification: "code",
        },
      ],
    },
    {
      title: "Summaries for daily tracking",
      period: "31 Aug 2026",
      summary:
        "Short summaries per day and project for pasting into tracking, built by rules rather than AI to keep the tool offline and dependency-free.",
      milestones: [
        {
          id: "tt-summaries",
          title: "Rule-based daily summaries",
          date: "2026-08-31",
          ref: "2026-08-31d",
          refKind: "build",
          change:
            "Drops merges and noise, keeps only each commit's title, removes duplicates and caps each summary at six items. Busy days continue in follow-up summaries of the next six.",
          significance:
            "My commit messages pack a title and details onto one line. Keeping just the title turned a several-kilobyte wall of text into a few hundred characters.",
          verification: "code",
        },
      ],
    },
    {
      title: "History and control",
      period: "2 Sep 2026",
      summary: "Three builds in one day, each confirmed by comparing the dated backups of the source.",
      milestones: [
        {
          id: "tt-selected-summary",
          title: "Sort order and summaries of chosen commits",
          date: "2026-09-02",
          ref: "2026-09-02",
          refKind: "build",
          change:
            "Oldest-first or newest-first ordering everywhere, and a summary built from whichever commits I tick.",
          significance: "Shared summary-building code means both entry points behave identically.",
          verification: "diff",
        },
        {
          id: "tt-synced-view",
          title: "A permanent record of logged work",
          date: "2026-09-02",
          ref: "2026-09-02b",
          refKind: "build",
          change:
            "A read-only Synced tab rebuilds full commit details from the stored hashes, in batches, and copes with hashes that no longer exist.",
          significance:
            "This meant removing automatic clean-up of the sync state, trading a smaller file for a complete history.",
          verification: "diff",
        },
        {
          id: "tt-compact",
          title: "Clean-up on request",
          date: "2026-09-02",
          ref: "2026-09-02c",
          refKind: "build",
          change:
            "A per-repository Compact button that only runs once nothing is pending, and explains why when it refuses.",
          significance: "Shrinking the state file became a deliberate choice instead of a silent side effect.",
          verification: "diff",
        },
      ],
    },
    {
      title: "Hardening before going public",
      period: "9 Oct 2026",
      summary: "Two issues found in a code audit, fixed before the source is published.",
      milestones: [
        {
          id: "tt-hardening",
          title: "Request checks and a branch-safe clean-up",
          date: "2026-10-09",
          ref: "2026-10-09",
          refKind: "build",
          change:
            "The local server now refuses requests from other websites and from look-alike hostnames. Clean-up only clears logged commits the current branch contains.",
          significance:
            "Any site open in the browser could previously change the tool's settings, and clean-up could make logged work from other branches reappear.",
          verification: "tested",
        },
      ],
    },
  ],
  sourceNote:
    "Personal project. The source will be linked here once it is under version control with personal paths removed.",
  sceneSpot: "monitor",
};

const swelTrack: Project = {
  slug: "sweltrack",
  title: "SwelTrack",
  kind: "personal",
  tagline: "An HR and payroll system built around Philippine payroll rules.",
  period: "Jul 2026",
  problem:
    "Philippine payroll has rules that generic HR tools handle poorly: daily rates derived from monthly pay, holiday and rest-day premiums, de minimis benefits and time-record corrections.",
  overview:
    "SwelTrack covers leave, schedules, daily time records, corrections, payroll runs and self-service requests, with each company's data kept separate. It is set up as a subscription product with plans and purchasable add-ons.",
  role: "Sole developer of a personal project.",
  stack: ["Laravel", "Livewire", "Alpine.js", "Tom Select"],
  integrations: [],
  stats: [
    { value: "254", label: "commits", source: "Commit history, 1–12 Jul 2026" },
    { value: "9", label: "active days", source: "Commit history" },
  ],
  phases: [
    {
      title: "Foundations and leave",
      period: "1 Jul 2026",
      summary: "Project setup, leave management and the first payroll rule.",
      milestones: [
        {
          id: "sw-leave",
          title: "Leave management module",
          date: "2026-07-01",
          ref: "bb85e97",
          refKind: "commit",
          change: "Leave requests and approvals as Livewire components, with balances tracked through the approval lifecycle.",
          significance: "Set the pattern of domain events, exceptions and policies the rest of the system follows.",
          verification: "commit",
        },
        {
          id: "sw-daily-rate",
          title: "Correct daily rate calculation",
          date: "2026-07-01",
          ref: "b7af22f",
          refKind: "commit",
          change: "Annualises monthly pay before dividing it into a daily rate.",
          significance: "Dividing monthly pay directly gives the wrong rate, and every downstream payroll figure depends on it.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Time, schedules and corrections",
      period: "1–10 Jul 2026",
      summary: "Work schedules, daily time records and a priced correction flow.",
      milestones: [
        {
          id: "sw-schedules",
          title: "Work schedules with bulk assignment",
          date: "2026-07-01",
          ref: "b338df5",
          refKind: "commit",
          change: "Create schedules and assign them to many employees at once.",
          significance: "Schedules are the baseline that attendance and premiums are measured against.",
          verification: "commit",
        },
        {
          id: "sw-corrections",
          title: "Priced time-record corrections",
          date: "2026-07-09",
          ref: "a00151e",
          refKind: "commit",
          change: "A service that prices and approves corrections to daily time records.",
          significance: "Corrections change pay, so they go through one audited path instead of direct edits.",
          verification: "commit",
        },
        {
          id: "sw-routing",
          title: "Self-service request routing",
          date: "2026-07-08",
          ref: "4db9974",
          refKind: "commit",
          change: "Employee requests resolve to the right approver automatically and escalate when needed.",
          significance: "Keeps approval rules in one place rather than in each form.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Payroll rules and billing",
      period: "3–8 Jul 2026",
      summary: "Premiums, benefits and the subscription model.",
      milestones: [
        {
          id: "sw-premiums",
          title: "Tested holiday and rest-day premiums",
          date: "2026-07-08",
          ref: "c8e12b2",
          refKind: "commit",
          change: "Tests for special-holiday and rest-day premiums in payroll processing.",
          significance: "Premium rules are easy to get subtly wrong; tests pin the expected pay down.",
          verification: "commit",
        },
        {
          id: "sw-billing",
          title: "Plans and purchasable add-ons",
          date: "2026-07-03",
          ref: "f80594e",
          refKind: "commit",
          change: "Add-on billing built on top of subscription plans.",
          significance: "Lets features be sold separately without forking the plan model.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Security hardening",
      period: "12 Jul 2026",
      summary: "A pass focused on tenant isolation, sessions and passwords. The same day also removed public sign-up (707af55) and added baseline security headers (58623a8).",
      milestones: [
        {
          id: "sw-tenant",
          title: "Tenant isolation and duplicate-run protection",
          date: "2026-07-12",
          ref: "0d90ee1",
          refKind: "commit",
          change: "Blocks one company from tampering with another's data by changing an id, and prevents two payroll runs being created at once.",
          significance: "In a multi-company payroll system these are the failures with real financial consequences.",
          verification: "commit",
        },
        {
          id: "sw-auth",
          title: "Stronger passwords and policy-based authorisation",
          date: "2026-07-12",
          ref: "de1d3a5",
          refKind: "commit",
          change: "Stronger password rules, and payroll authorisation moved from gates to Laravel policies.",
          significance: "Moves access rules next to the models they protect, where they are easier to test.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Personal project. Source code is private for now.",
  sceneSpot: "notebook",
};

const fieldOps: Project = {
  slug: "field-operations-platform",
  title: "Field Operations & Support Platform",
  kind: "professional",
  tagline: "The internal system behind support tickets, deployments and field technician bookings.",
  period: "Oct 2025 to now",
  problem:
    "Support, deployment and field-service work was spread across spreadsheets, shared drives and separate tools, which made it hard to schedule technicians, track progress and report on service levels.",
  overview:
    "A web platform for support and deployment tasks, technician bookings, KPI reporting and document handling. It syncs files with Microsoft 365, reconciles projects with the finance system, and exposes data to AI assistants through a secured connector.",
  role: "Developer on a private company codebase; the largest share of my professional commits.",
  stack: ["Laravel", "Livewire", "Alpine.js"],
  integrations: ["Microsoft OneDrive and SharePoint", "Google Maps Distance Matrix", "Microsoft Entra ID", "NetSuite", "Model Context Protocol (MCP)"],
  stats: [
    { value: "1,427", label: "commits", source: "Commit history, Oct 2025 – Oct 2026" },
    { value: "160", label: "active days", source: "Commit history" },
  ],
  phases: [
    {
      title: "Integrations that save time and money",
      period: "Dec 2025 – Jan 2026",
      summary: "Background file uploads and cheaper travel-time lookups.",
      milestones: [
        {
          id: "fo-onedrive",
          title: "Background uploads to OneDrive",
          date: "2025-12-04",
          ref: "9c1d026f",
          refKind: "commit",
          change: "File uploads to OneDrive run as queued background jobs.",
          significance: "Users no longer wait on slow uploads, and failed uploads can retry.",
          verification: "commit",
        },
        {
          id: "fo-maps",
          title: "Cheaper travel-time lookups",
          date: "2026-01-23",
          ref: "a4b4bfc6",
          refKind: "commit",
          change: "Caching and other optimisations for Google's Distance Matrix API, including lookups that work in either direction.",
          significance: "Each lookup is billed, so reusing results directly cuts running costs.",
          verification: "commit",
        },
        {
          id: "fo-kpi",
          title: "KPI scoring rework",
          date: "2026-01-07",
          ref: "a0c133d2",
          refKind: "commit",
          change: "Reworked how first-level support KPIs are synced and scored.",
          significance: "Service reporting depends on these numbers being calculated consistently.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Field tracking and finance reconciliation",
      period: "Apr – May 2026",
      summary: "An API for the technician app and matching projects to the finance system.",
      milestones: [
        {
          id: "fo-tracking-api",
          title: "Technician tracking API",
          date: "2026-04-28",
          ref: "d85dd56c",
          refKind: "commit",
          change: "A model, service, controller and routes for technician job tracking.",
          significance: "Gave the mobile app a dedicated, versionable way to report progress.",
          verification: "commit",
        },
        {
          id: "fo-reconcile",
          title: "Project reconciliation with NetSuite",
          date: "2026-05-18",
          ref: "7360d17b",
          refKind: "commit",
          change: "Backend support for matching projects to their NetSuite records.",
          significance: "Keeps operational and financial views of the same project in step.",
          verification: "commit",
        },
      ],
    },
    {
      title: "AI access and digital sign-off",
      period: "Jul – Aug 2026",
      summary: "A secured connector for AI assistants, then the backend for digital sign-off.",
      milestones: [
        {
          id: "fo-mcp",
          title: "MCP connector secured with Entra ID",
          date: "2026-07-14",
          ref: "94ffcfb0",
          refKind: "commit",
          change: "Bearer-token authentication against Microsoft Entra ID for a Model Context Protocol connector.",
          significance: "AI assistants can query operational data only as an authenticated company user.",
          verification: "commit",
        },
        {
          id: "fo-signoff",
          title: "Sign-off templates and PDFs",
          date: "2026-08-18",
          ref: "17ff82b4",
          refKind: "commit",
          change: "Templates and responses for digital sign-off; signatures are stored and the PDF is rendered once when the app syncs.",
          significance: "Rendering once on sync avoids regenerating documents on every view.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
  sceneSpot: "rack",
};

const fieldApp: Project = {
  slug: "field-technician-app",
  title: "Field Technician Mobile App",
  kind: "professional",
  tagline: "A Flutter app technicians use on site, built to keep working without a connection.",
  period: "Oct 2025 to now",
  problem:
    "Technicians work in places with poor or no signal, but still need to scan jobs, record progress and collect sign-off.",
  overview:
    "Technicians scan a job's QR code, work through its stages, upload photos and collect a digital sign-off. Work is stored on the device and synced when a connection is available, with push notifications for new jobs.",
  role: "Developer on a private company codebase.",
  stack: ["Flutter", "Dart", "Drift (local database)"],
  integrations: ["Firebase Cloud Messaging", "Google Maps", "The operations platform's API"],
  stats: [
    { value: "435", label: "commits", source: "Commit history, Oct 2025 – Oct 2026" },
    { value: "68", label: "active days", source: "Commit history" },
  ],
  phases: [
    {
      title: "Working offline",
      period: "Oct – Nov 2025",
      summary: "QR job scanning, offline detection, background sync and push notifications.",
      milestones: [
        {
          id: "fa-offline",
          title: "Offline detection",
          date: "2025-10-23",
          ref: "d33d94d",
          refKind: "commit",
          change: "Detects lost connectivity and disables actions that need the network.",
          significance: "Prevents half-finished requests that would leave a job in an unclear state.",
          verification: "commit",
        },
        {
          id: "fa-sync",
          title: "Screen-aware background sync",
          date: "2025-10-27",
          ref: "4ac6143",
          refKind: "commit",
          change: "Background sync that adapts to which screen the technician is using.",
          significance: "Data stays fresh without fighting the technician's edits.",
          verification: "commit",
        },
        {
          id: "fa-push",
          title: "Push notifications",
          date: "2025-10-31",
          ref: "9c5bc05",
          refKind: "commit",
          change: "Firebase Cloud Messaging set up for job notifications.",
          significance: "Technicians hear about new work without polling.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Digital sign-off on device",
      period: "Feb – Aug 2026",
      summary: "Sign-off fields, then local templates that sync with the backend.",
      milestones: [
        {
          id: "fa-signoff",
          title: "Sign-off templates stored on the device",
          date: "2026-08-17",
          ref: "d9b7191",
          refKind: "commit",
          change: "Local database tables for sign-off templates and answers.",
          significance: "Sign-off can be collected with no signal and uploaded later.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Making sync reliable",
      period: "Jul – Oct 2026",
      summary: "An audit of the sync code, then structural fixes.",
      milestones: [
        {
          id: "fa-audit",
          title: "Found a critical sync bug",
          date: "2026-07-24",
          ref: "0284d11",
          refKind: "commit",
          change: "Documented a follow-up audit that found the app's and server's record formats had drifted apart.",
          significance: "Silent format drift can lose data, so finding it mattered more than any single feature.",
          verification: "commit",
        },
        {
          id: "fa-queue",
          title: "Queued sync instead of polling",
          date: "2026-08-26",
          ref: "5e6ad0c",
          refKind: "commit",
          change: "Replaced a polling sync lock with a first-in, first-out queue.",
          significance: "Sync requests run in order without busy-waiting.",
          verification: "commit",
        },
        {
          id: "fa-breaker",
          title: "Circuit breaker for the server",
          date: "2026-10-08",
          ref: "4f525a2",
          refKind: "commit",
          change: "Sync requests stop for a while when the server keeps failing.",
          significance: "Protects a struggling server and the phone's battery from endless retries.",
          verification: "commit",
        },
        {
          id: "fa-release-guard",
          title: "Release build guard",
          date: "2026-08-26",
          ref: "5a4352b",
          refKind: "commit",
          change: "Release builds refuse to ship with development-style configuration.",
          significance: "Catches a whole class of misconfigured releases before they reach devices.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
  sceneSpot: "phone",
};

const clientPortal: Project = {
  slug: "client-service-portal",
  title: "Client Service Portal",
  kind: "professional",
  tagline: "Where clients follow their tickets, see completed sign-offs and send feedback.",
  period: "Aug 2026 to now",
  problem: "Clients needed a self-service view of their tickets and completed work instead of asking for updates by email.",
  overview:
    "A portal with ticket tracking, two-factor sign-in, user administration, sign-off documents and a public feedback form. It exchanges data with the operations platform in both directions.",
  role: "Developer on a private company codebase.",
  stack: ["Laravel", "Filament"],
  integrations: ["Microsoft Graph (email)", "The operations platform's API", "Real-time broadcasting"],
  stats: [
    { value: "154", label: "commits", source: "Commit history, Aug – Oct 2026" },
    { value: "16", label: "active days", source: "Commit history" },
  ],
  phases: [
    {
      title: "Accounts and tickets",
      period: "Aug 2026",
      summary: "User administration with two-factor sign-in, then ticket tracking.",
      milestones: [
        {
          id: "cp-mfa",
          title: "User administration with two-factor sign-in",
          date: "2026-08-13",
          ref: "5d09609",
          refKind: "commit",
          change: "Approval, disabling and two-factor management for portal users.",
          significance: "Client data sits behind accounts an administrator controls.",
          verification: "commit",
        },
        {
          id: "cp-tickets",
          title: "Ticket tracking",
          date: "2026-08-24",
          ref: "e041748",
          refKind: "commit",
          change: "Ticket screens and notifications built as a Filament resource.",
          significance: "Clients can follow progress themselves.",
          verification: "commit",
        },
        {
          id: "cp-signoff",
          title: "Completed sign-offs for clients",
          date: "2026-08-18",
          ref: "112cca3",
          refKind: "commit",
          change: "Storage for completed sign-offs, linked to the site where work happened.",
          significance: "Closes the loop on sign-offs collected in the technician app.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Connecting the systems",
      period: "Sep 2026",
      summary: "A health-checked connection to the operations platform and feedback forwarding.",
      milestones: [
        {
          id: "cp-connection",
          title: "Health-checked platform connection",
          date: "2026-09-03",
          ref: "f92d5c6",
          refKind: "commit",
          change: "A client for the operations platform that checks the connection and times the round trip.",
          significance: "Problems between systems show up as a clear status instead of silent failures.",
          verification: "commit",
        },
        {
          id: "cp-feedback",
          title: "Feedback forwarded to the operations team",
          date: "2026-09-21",
          ref: "bb2204e",
          refKind: "commit",
          change: "Verified feedback submissions are forwarded to the operations platform as work items.",
          significance: "Client feedback lands where the team already works.",
          verification: "commit",
        },
        {
          id: "cp-graph",
          title: "Email through Microsoft Graph",
          date: "2026-09-21",
          ref: "8bcac8c",
          refKind: "commit",
          change: "A Microsoft Graph mail transport for outgoing email.",
          significance: "Sends through the company's Microsoft 365 tenant instead of a separate mail service.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
  sceneSpot: "tablet",
};

const floorBoard: Project = {
  slug: "floor-planning-board",
  title: "Production Floor Planning Board",
  kind: "professional",
  tagline: "A shared board for placing projects into bays and zones, with live edit locks.",
  period: "Jul 2026 to now",
  problem: "Several teams plan the same production floor, so two people could overwrite each other's allocations.",
  overview:
    "A board showing bays and zones on the floor, which projects occupy them and what stage each is at. Sign-in uses the company's Microsoft accounts, permissions are checked field by field, and bays lock while someone edits them.",
  role: "Developer on a private company codebase.",
  stack: ["Laravel (API)", "Vue"],
  integrations: ["Microsoft Entra ID single sign-on", "IIS hosting"],
  stats: [
    { value: "148", label: "commits", source: "Commit history, Jul – Oct 2026" },
    { value: "9", label: "active days", source: "Commit history" },
  ],
  phases: [
    {
      title: "Secure foundations",
      period: "27–30 Jul 2026",
      summary: "Single sign-on, field-level permissions and an audit trail in the first week.",
      milestones: [
        {
          id: "fb-sso",
          title: "Entra ID sign-in",
          date: "2026-07-27",
          ref: "dc3804f",
          refKind: "commit",
          change: "Validates Microsoft Entra tokens and checks them on every request.",
          significance: "No separate passwords; access follows the company's Microsoft groups.",
          verification: "commit",
        },
        {
          id: "fb-fields",
          title: "Field-level permissions",
          date: "2026-07-28",
          ref: "5b2d176",
          refKind: "commit",
          change: "Saves are checked field by field against the user's permissions.",
          significance: "Teams can share one board while each changes only what it owns.",
          verification: "commit",
        },
        {
          id: "fb-audit",
          title: "Audit log that understands impersonation",
          date: "2026-07-30",
          ref: "19c0bbd",
          refKind: "commit",
          change: "Records who really made a change, even when an admin acts as another user.",
          significance: "Support access stays accountable.",
          verification: "commit",
        },
      ],
    },
    {
      title: "Working together live",
      period: "Aug – Sep 2026",
      summary: "Edit presence, locks and reports.",
      milestones: [
        {
          id: "fb-presence",
          title: "Live editing presence",
          date: "2026-08-06",
          ref: "b1be127",
          refKind: "commit",
          change: "Shows who is editing a locked bay.",
          significance: "People see a conflict before they hit it.",
          verification: "commit",
        },
        {
          id: "fb-locks",
          title: "Lock contention fix",
          date: "2026-09-08",
          ref: "cdc034a",
          refKind: "commit",
          change: "Fixed the expired-lock clean-up so one zone's locks don't block another's.",
          significance: "A concurrency bug that only shows up when several teams work at once.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
  sceneSpot: "board",
};

const procurement: Project = {
  slug: "procurement-workflow",
  title: "Procurement Pricing Workflow",
  kind: "professional",
  tagline: "Pricing requests, vendor comparison and approvals in one place.",
  period: "May – Sep 2026",
  problem: "Pricing requests needed a consistent way to collect specifications, compare vendors and track status.",
  overview:
    "A workflow for raising pricing requests, attaching files, comparing vendor quotes and tracking each line item's status, with administration screens for reference data.",
  role: "Developer on a private company codebase.",
  stack: ["Laravel", "Livewire"],
  integrations: ["GitHub Actions (tests)"],
  stats: [{ value: "37", label: "commits", source: "Commit history, May – Sep 2026" }],
  phases: [
    {
      title: "Remediation and hardening",
      period: "16 Sep 2026",
      summary: "A planned clean-up: access control, auditing, safer uploads and an automated test suite.",
      milestones: [
        {
          id: "pw-access",
          title: "Permission-based access control",
          date: "2026-09-16",
          ref: "af2bdbd",
          refKind: "commit",
          change: "Roles and permissions seeded from one canonical, repeatable source.",
          significance: "Access rules are defined once and can be re-applied safely.",
          verification: "commit",
        },
        {
          id: "pw-audit",
          title: "General audit trail",
          date: "2026-09-16",
          ref: "3452b1a",
          refKind: "commit",
          change: "One audit-trail mechanism for user events across the app.",
          significance: "Changes can be traced to a person consistently.",
          verification: "commit",
        },
        {
          id: "pw-uploads",
          title: "Safer file uploads",
          date: "2026-09-16",
          ref: "24d1c3f",
          refKind: "commit",
          change: "Random storage names and authorisation checks on uploaded files.",
          significance: "Files can't be guessed or opened by the wrong user.",
          verification: "commit",
        },
        {
          id: "pw-tests",
          title: "Fast automated tests",
          date: "2026-09-16",
          ref: "4684a80",
          refKind: "commit",
          change: "Tests run on SQLite, with fixes so older migrations work there.",
          significance: "Tests run quickly in CI without a database server.",
          verification: "commit",
        },
      ],
    },
  ],
  sourceNote: "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
  sceneSpot: "laptop",
};

export const projects: Project[] = [timeTracker, swelTrack, fieldOps, fieldApp, clientPortal, floorBoard, procurement];

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function allMilestones() {
  return projects.flatMap((project) =>
    project.phases.flatMap((phase) => phase.milestones.map((milestone) => ({ project, milestone }))),
  );
}
