import type { Project } from "./types.ts";

/*
 * Every statement here comes from the October 2026 audits: the time tracker's
 * source and dated backups, and commit logs exported from each repository.
 * Professional projects use generic titles because their code is private.
 * Keep it skimmable: taglines under ~10 words, one line per milestone field.
 * Do not add results, dates or features that aren't backed by that evidence.
 */

export const projects: Project[] = [
  {
    "slug": "time-tracker",
    "title": "Git to NetSuite Time Tracker",
    "kind": "personal",
    "tagline": "Turns my git commits into ready-to-paste NetSuite timesheets.",
    "period": "Aug 2026 to now",
    "problem": "Logging a month of work in NetSuite took 2–3 days of digging through commits.",
    "overview": "Scans my repositories, groups my commits by day and project, and writes the timesheet text for me. Runs locally with zero dependencies.",
    "role": "Sole developer",
    "stack": [
      "Python",
      "Git",
      "Vanilla JavaScript",
      "Bash"
    ],
    "integrations": [
      "AppleScript",
      "NetSuite"
    ],
    "stats": [
      {
        "value": "2–3 days → 3–4 hours",
        "label": "to log a month of work in NetSuite",
        "source": "My own estimate, before and after the tool"
      },
      {
        "value": "0",
        "label": "third-party packages",
        "source": "Python standard library and plain browser JavaScript"
      }
    ],
    "phases": [
      {
        "title": "A shared engine with two front doors",
        "period": "25 Aug 2026",
        "summary": "One engine powers a command line and a web page.",
        "milestones": [
          {
            "id": "tt-engine",
            "title": "Commit engine and sync state",
            "date": "2026-08-25",
            "ref": "first build",
            "refKind": "build",
            "change": "Reads commits on every branch and tracks which are logged.",
            "significance": "Logging part of a backlog never skips or double-counts work.",
            "verification": "code"
          },
          {
            "id": "tt-launcher",
            "title": "Double-click launcher that tidies up after itself",
            "date": "2026-08-25",
            "ref": "2026-08-25f",
            "refKind": "build",
            "change": "Double-click to start; closing the tab shuts it down cleanly.",
            "significance": "Tells a closed tab from a refresh without guessing.",
            "verification": "tested"
          }
        ]
      },
      {
        "title": "Finding the right work quickly",
        "period": "25–31 Aug 2026",
        "summary": "Find the right commits fast.",
        "milestones": [
          {
            "id": "tt-find-commit",
            "title": "Find a starting commit by hash or message",
            "date": "2026-08-27",
            "ref": "README, 27 Aug",
            "refKind": "build",
            "change": "Pick a starting commit by hash or message, with an activity chart.",
            "significance": "Quick setup, even on repos with long histories.",
            "verification": "code"
          },
          {
            "id": "tt-date-filter",
            "title": "Date filters that respect my timezone",
            "date": "2026-08-27",
            "ref": "README, 27 Aug",
            "refKind": "build",
            "change": "Week, month and custom filters in local time.",
            "significance": "Commits never land on the wrong day.",
            "verification": "code"
          }
        ]
      },
      {
        "title": "Summaries for daily tracking",
        "period": "31 Aug 2026",
        "summary": "Daily summaries in one click.",
        "milestones": [
          {
            "id": "tt-summaries",
            "title": "Rule-based daily summaries",
            "date": "2026-08-31",
            "ref": "2026-08-31d",
            "refKind": "build",
            "change": "One-click daily summaries, six items at a time.",
            "significance": "Kilobytes of commit text become a few lines.",
            "verification": "code"
          }
        ]
      },
      {
        "title": "History and control",
        "period": "2 Sep 2026",
        "summary": "Three builds in one day, each verified.",
        "milestones": [
          {
            "id": "tt-selected-summary",
            "title": "Sort order and summaries of chosen commits",
            "date": "2026-09-02",
            "ref": "2026-09-02",
            "refKind": "build",
            "change": "Sort order, plus summaries of hand-picked commits.",
            "significance": "One summary engine serves both views.",
            "verification": "diff"
          },
          {
            "id": "tt-synced-view",
            "title": "A permanent record of logged work",
            "date": "2026-09-02",
            "ref": "2026-09-02b",
            "refKind": "build",
            "change": "A permanent, read-only history of logged work.",
            "significance": "Every past entry stays checkable.",
            "verification": "diff"
          },
          {
            "id": "tt-compact",
            "title": "Clean-up on request",
            "date": "2026-09-02",
            "ref": "2026-09-02c",
            "refKind": "build",
            "change": "Clean-up runs only on request, and explains any refusal.",
            "significance": "Nothing is ever deleted silently.",
            "verification": "diff"
          }
        ]
      },
      {
        "title": "Hardening before going public",
        "period": "9 Oct 2026",
        "summary": "Two audit findings fixed before publishing.",
        "milestones": [
          {
            "id": "tt-hardening",
            "title": "Request checks and a branch-safe clean-up",
            "date": "2026-10-09",
            "ref": "2026-10-09",
            "refKind": "build",
            "change": "Blocks requests from other websites; clean-up is branch-safe.",
            "significance": "Two audit findings fixed before the code goes public.",
            "verification": "tested"
          }
        ]
      }
    ],
    "sourceNote": "Personal project. The source will be linked here once it is under version control with personal paths removed.",
    "sceneSpot": "monitor",
    "outcome": "Monthly time logging cut from 2–3 days to 3–4 hours (my estimate)."
  },
  {
    "slug": "sweltrack",
    "title": "SwelTrack",
    "kind": "personal",
    "tagline": "HR and payroll built for Philippine payroll rules.",
    "period": "Jul 2026",
    "problem": "Generic HR tools handle Philippine payroll poorly: premiums, benefits and time corrections.",
    "overview": "Leave, schedules, time records, payroll runs and self-service requests, with each company's data kept separate. Set up as a subscription product.",
    "role": "Sole developer",
    "stack": [
      "Laravel",
      "Livewire",
      "Alpine.js",
      "Tom Select"
    ],
    "integrations": [],
    "stats": [
      {
        "value": "254",
        "label": "commits",
        "source": "Commit history, 1–12 Jul 2026"
      },
      {
        "value": "9",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Foundations and leave",
        "period": "1 Jul 2026",
        "summary": "Setup, leave and the first payroll rule.",
        "milestones": [
          {
            "id": "sw-leave",
            "title": "Leave management module",
            "date": "2026-07-01",
            "ref": "bb85e97",
            "refKind": "commit",
            "change": "Leave requests and approvals with tracked balances.",
            "significance": "Set the pattern the rest of the system follows.",
            "verification": "commit"
          },
          {
            "id": "sw-daily-rate",
            "title": "Correct daily rate calculation",
            "date": "2026-07-01",
            "ref": "b7af22f",
            "refKind": "commit",
            "change": "Daily rates now annualise monthly pay first.",
            "significance": "Every payroll figure depends on this number.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Time, schedules and corrections",
        "period": "1–10 Jul 2026",
        "summary": "Schedules, time records and corrections.",
        "milestones": [
          {
            "id": "sw-schedules",
            "title": "Work schedules with bulk assignment",
            "date": "2026-07-01",
            "ref": "b338df5",
            "refKind": "commit",
            "change": "Create schedules and assign them in bulk.",
            "significance": "The baseline attendance and premiums are measured against.",
            "verification": "commit"
          },
          {
            "id": "sw-corrections",
            "title": "Priced time-record corrections",
            "date": "2026-07-09",
            "ref": "a00151e",
            "refKind": "commit",
            "change": "One priced, approved path for time-record corrections.",
            "significance": "Changes to pay are always audited.",
            "verification": "commit"
          },
          {
            "id": "sw-routing",
            "title": "Self-service request routing",
            "date": "2026-07-08",
            "ref": "4db9974",
            "refKind": "commit",
            "change": "Requests route to the right approver automatically.",
            "significance": "Approval rules live in one place.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Payroll rules and billing",
        "period": "3–8 Jul 2026",
        "summary": "Premiums, benefits and billing.",
        "milestones": [
          {
            "id": "sw-premiums",
            "title": "Tested holiday and rest-day premiums",
            "date": "2026-07-08",
            "ref": "c8e12b2",
            "refKind": "commit",
            "change": "Tests pin down holiday and rest-day premiums.",
            "significance": "Pay rules that are easy to get wrong stay right.",
            "verification": "commit"
          },
          {
            "id": "sw-billing",
            "title": "Plans and purchasable add-ons",
            "date": "2026-07-03",
            "ref": "f80594e",
            "refKind": "commit",
            "change": "Purchasable add-ons on top of subscription plans.",
            "significance": "Features can be sold separately.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Security hardening",
        "period": "12 Jul 2026",
        "summary": "Tenant isolation, sessions and passwords.",
        "milestones": [
          {
            "id": "sw-tenant",
            "title": "Tenant isolation and duplicate-run protection",
            "date": "2026-07-12",
            "ref": "0d90ee1",
            "refKind": "commit",
            "change": "Blocks cross-company data tampering and duplicate payroll runs.",
            "significance": "Prevents the failures that cost real money.",
            "verification": "commit"
          },
          {
            "id": "sw-auth",
            "title": "Stronger passwords and policy-based authorisation",
            "date": "2026-07-12",
            "ref": "de1d3a5",
            "refKind": "commit",
            "change": "Stronger passwords; authorisation moved into Laravel policies.",
            "significance": "Access rules sit next to what they protect.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Personal project. Source code is private for now.",
    "sceneSpot": "notebook",
    "outcome": "254 commits in 12 days, from first screen to a security pass."
  },
  {
    "slug": "taskforge",
    "title": "TaskForge",
    "kind": "personal",
    "tagline": "Manages Windows scheduled tasks from simple JSON files.",
    "period": "Apr 2026",
    "problem": "Setting up Windows scheduled tasks by hand is slow and hard to repeat.",
    "overview": "Each JSON profile defines one task. TaskForge creates, updates and removes the matching Windows tasks, and running it twice never creates duplicates.",
    "role": "Sole developer",
    "stack": [
      "Python"
    ],
    "integrations": [
      "Windows Task Scheduler",
      "PowerShell"
    ],
    "stats": [
      {
        "value": "15",
        "label": "commits",
        "source": "Commit history, 13–14 Apr 2026"
      },
      {
        "value": "2",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Core and tests",
        "period": "13 Apr 2026",
        "summary": "Core engine and tests on day one.",
        "milestones": [
          {
            "id": "tf-core",
            "title": "Modular profile engine",
            "date": "2026-04-13",
            "ref": "30dfc3b",
            "refKind": "commit",
            "change": "A modular Python engine for profiles and task lifecycles.",
            "significance": "Each task definition stays readable and repeatable.",
            "verification": "commit"
          },
          {
            "id": "tf-tests",
            "title": "Unit test suite from day one",
            "date": "2026-04-13",
            "ref": "56bcc2a",
            "refKind": "commit",
            "change": "A unit test suite, added the same day as the core.",
            "significance": "Behaviour is pinned down before it touches a real machine.",
            "verification": "commit"
          },
          {
            "id": "tf-persistence",
            "title": "Safe first-run storage",
            "date": "2026-04-13",
            "ref": "7593557",
            "refKind": "commit",
            "change": "Creates its own storage folders on first run, with a test.",
            "significance": "Works on a fresh machine first time.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Running as the right account",
        "period": "13–14 Apr 2026",
        "summary": "Run tasks as the right Windows account.",
        "milestones": [
          {
            "id": "tf-runas",
            "title": "Run-as accounts and logon types",
            "date": "2026-04-13",
            "ref": "f67cf26",
            "refKind": "commit",
            "change": "Tasks can run as a named Windows account.",
            "significance": "Automation gets exactly the permissions it needs.",
            "verification": "commit"
          },
          {
            "id": "tf-system",
            "title": "SYSTEM account fallback",
            "date": "2026-04-14",
            "ref": "0e62ce8",
            "refKind": "commit",
            "change": "Falls back to the SYSTEM account when none is given.",
            "significance": "Tasks register reliably without storing anyone's password.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Personal project. Source code is private for now.",
    "sceneSpot": "clock",
    "outcome": "Repeatable task setup with tests from the very first commit."
  },
  {
    "slug": "mobile-queue-app",
    "title": "Mobile Queue Management App",
    "kind": "personal",
    "tagline": "Flutter front end for a client's student queuing system.",
    "period": "Jun 2023",
    "problem": "A client needed a mobile front end for their student queue system.",
    "overview": "QR code scanning and a student queue form, with on-device storage.",
    "role": "Built the structure and screens (6 of 35 commits)",
    "stack": [
      "Flutter",
      "Dart"
    ],
    "integrations": [
      "QR scanning",
      "SQLite",
      "On-device storage"
    ],
    "stats": [
      {
        "value": "6",
        "label": "commits",
        "source": "Commit history, 5–6 Jun 2023 (of 35 in the project)"
      }
    ],
    "phases": [
      {
        "title": "Initial build",
        "period": "5–6 Jun 2023",
        "summary": "Setup, core screens and scope trimming.",
        "milestones": [
          {
            "id": "mq-setup",
            "title": "Project setup and first layout",
            "date": "2023-06-05",
            "ref": "2c78922",
            "refKind": "commit",
            "change": "Project setup and the first app layout.",
            "significance": "The structure the core screens were built on.",
            "verification": "commit"
          },
          {
            "id": "mq-scanner",
            "title": "QR code scanner screen",
            "date": "2023-06-06",
            "ref": "3362094",
            "refKind": "commit",
            "change": "The QR code scanner screen.",
            "significance": "Scanning is the app's main way in.",
            "verification": "commit"
          },
          {
            "id": "mq-form",
            "title": "Student queue form",
            "date": "2023-06-06",
            "ref": "ea59164",
            "refKind": "commit",
            "change": "The student queue form.",
            "significance": "Where a student's place in the queue is captured.",
            "verification": "commit"
          },
          {
            "id": "mq-trim",
            "title": "Trimmed to what the client needed",
            "date": "2023-06-06",
            "ref": "2f4e54e",
            "refKind": "commit",
            "change": "Removed navigation and a button the client didn't need.",
            "significance": "Kept the app focused on the brief.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Personal freelance project. The client is not named and the source is private.",
    "sceneSpot": "queue-sign",
    "outcome": "Delivered the app's foundation and core screens."
  },
  {
    "slug": "field-operations-platform",
    "title": "Field Operations & Support Platform",
    "kind": "professional",
    "tagline": "Runs support tickets, deployments and technician bookings.",
    "period": "Oct 2025 to now",
    "problem": "Support and field work was scattered across spreadsheets and separate tools.",
    "overview": "One platform for tasks, technician bookings, KPIs and documents, connected to Microsoft 365, Google Maps and NetSuite.",
    "role": "Developer",
    "stack": [
      "Laravel",
      "Livewire",
      "Alpine.js"
    ],
    "integrations": [
      "Microsoft OneDrive and SharePoint",
      "Google Maps Distance Matrix",
      "Microsoft Entra ID",
      "NetSuite",
      "Model Context Protocol (MCP)"
    ],
    "stats": [
      {
        "value": "1,427",
        "label": "commits",
        "source": "Commit history, Oct 2025 – Oct 2026"
      },
      {
        "value": "160",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Integrations that save time and money",
        "period": "Dec 2025 – Jan 2026",
        "summary": "Integrations that save time and money.",
        "milestones": [
          {
            "id": "fo-onedrive",
            "title": "Background uploads to OneDrive",
            "date": "2025-12-04",
            "ref": "9c1d026f",
            "refKind": "commit",
            "change": "File uploads to OneDrive run as background jobs.",
            "significance": "No waiting on slow uploads; failures retry.",
            "verification": "commit"
          },
          {
            "id": "fo-maps",
            "title": "Cheaper travel-time lookups",
            "date": "2026-01-23",
            "ref": "a4b4bfc6",
            "refKind": "commit",
            "change": "Cached Google Maps travel-time lookups.",
            "significance": "Fewer billed API calls.",
            "verification": "commit"
          },
          {
            "id": "fo-kpi",
            "title": "KPI scoring rework",
            "date": "2026-01-07",
            "ref": "a0c133d2",
            "refKind": "commit",
            "change": "Reworked how support KPIs are synced and scored.",
            "significance": "Service reports stay consistent.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Field tracking and finance reconciliation",
        "period": "Apr – May 2026",
        "summary": "An API for the field app; finance reconciliation.",
        "milestones": [
          {
            "id": "fo-tracking-api",
            "title": "Technician tracking API",
            "date": "2026-04-28",
            "ref": "d85dd56c",
            "refKind": "commit",
            "change": "A dedicated API for technician job tracking.",
            "significance": "The mobile app reports progress cleanly.",
            "verification": "commit"
          },
          {
            "id": "fo-reconcile",
            "title": "Project reconciliation with NetSuite",
            "date": "2026-05-18",
            "ref": "7360d17b",
            "refKind": "commit",
            "change": "Matches projects to their NetSuite records.",
            "significance": "Operations and finance see the same project.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "AI access and digital sign-off",
        "period": "Jul – Aug 2026",
        "summary": "AI access and digital sign-off.",
        "milestones": [
          {
            "id": "fo-mcp",
            "title": "MCP connector secured with Entra ID",
            "date": "2026-07-14",
            "ref": "94ffcfb0",
            "refKind": "commit",
            "change": "An AI assistant connector secured with Microsoft Entra ID.",
            "significance": "AI tools only see data as an authenticated user.",
            "verification": "commit"
          },
          {
            "id": "fo-signoff",
            "title": "Sign-off templates and PDFs",
            "date": "2026-08-18",
            "ref": "17ff82b4",
            "refKind": "commit",
            "change": "Sign-off templates, stored signatures and one-time PDF rendering.",
            "significance": "Documents aren't regenerated on every view.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
    "sceneSpot": "rack",
    "outcome": "My largest codebase: 1,427 commits across a full year."
  },
  {
    "slug": "field-technician-app",
    "title": "Field Technician Mobile App",
    "kind": "professional",
    "tagline": "The app technicians use on site, even with no signal.",
    "period": "Oct 2025 to now",
    "problem": "Technicians often work where there's poor or no signal.",
    "overview": "Scan a job, record progress, upload photos and collect sign-off offline. Everything syncs when the phone reconnects.",
    "role": "Developer",
    "stack": [
      "Flutter",
      "Dart",
      "Drift"
    ],
    "integrations": [
      "Firebase Cloud Messaging",
      "Google Maps",
      "REST APIs"
    ],
    "stats": [
      {
        "value": "435",
        "label": "commits",
        "source": "Commit history, Oct 2025 – Oct 2026"
      },
      {
        "value": "68",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Working offline",
        "period": "Oct – Nov 2025",
        "summary": "Offline-first from the start.",
        "milestones": [
          {
            "id": "fa-offline",
            "title": "Offline detection",
            "date": "2025-10-23",
            "ref": "d33d94d",
            "refKind": "commit",
            "change": "Detects lost signal and pauses network actions.",
            "significance": "No half-finished jobs.",
            "verification": "commit"
          },
          {
            "id": "fa-sync",
            "title": "Screen-aware background sync",
            "date": "2025-10-27",
            "ref": "4ac6143",
            "refKind": "commit",
            "change": "Background sync that adapts to the current screen.",
            "significance": "Fresh data without overwriting edits.",
            "verification": "commit"
          },
          {
            "id": "fa-push",
            "title": "Push notifications",
            "date": "2025-10-31",
            "ref": "9c5bc05",
            "refKind": "commit",
            "change": "Push notifications for new jobs.",
            "significance": "Technicians hear about work instantly.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Digital sign-off on device",
        "period": "Feb – Aug 2026",
        "summary": "Sign-off collected on the device.",
        "milestones": [
          {
            "id": "fa-signoff",
            "title": "Sign-off templates stored on the device",
            "date": "2026-08-17",
            "ref": "d9b7191",
            "refKind": "commit",
            "change": "Sign-off templates stored on the phone.",
            "significance": "Sign-off works with no signal.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Making sync reliable",
        "period": "Jul – Oct 2026",
        "summary": "Making sync reliable.",
        "milestones": [
          {
            "id": "fa-audit",
            "title": "Found a critical sync bug",
            "date": "2026-07-24",
            "ref": "0284d11",
            "refKind": "commit",
            "change": "An audit found the app and server data formats had drifted.",
            "significance": "Caught a silent data-loss risk.",
            "verification": "commit"
          },
          {
            "id": "fa-queue",
            "title": "Queued sync instead of polling",
            "date": "2026-08-26",
            "ref": "5e6ad0c",
            "refKind": "commit",
            "change": "Replaced a polling lock with a first-in, first-out queue.",
            "significance": "Sync runs in order, without busy-waiting.",
            "verification": "commit"
          },
          {
            "id": "fa-breaker",
            "title": "Circuit breaker for the server",
            "date": "2026-10-08",
            "ref": "4f525a2",
            "refKind": "commit",
            "change": "A circuit breaker pauses sync when the server keeps failing.",
            "significance": "Protects the server and the phone's battery.",
            "verification": "commit"
          },
          {
            "id": "fa-release-guard",
            "title": "Release build guard",
            "date": "2026-08-26",
            "ref": "5a4352b",
            "refKind": "commit",
            "change": "Release builds refuse development settings.",
            "significance": "Misconfigured releases never ship.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
    "sceneSpot": "phone",
    "outcome": "Found a data-format bug and rebuilt sync to be reliable."
  },
  {
    "slug": "client-service-portal",
    "title": "Client Service Portal",
    "kind": "professional",
    "tagline": "Lets clients track tickets and download sign-offs.",
    "period": "Aug 2026 to now",
    "problem": "Clients had to email to find out where their tickets stood.",
    "overview": "Ticket tracking, sign-off PDFs, two-factor sign-in and a feedback form, linked to the operations platform.",
    "role": "Developer",
    "stack": [
      "Laravel",
      "Filament"
    ],
    "integrations": [
      "Microsoft Graph",
      "REST APIs",
      "Real-time updates"
    ],
    "stats": [
      {
        "value": "154",
        "label": "commits",
        "source": "Commit history, Aug – Oct 2026"
      },
      {
        "value": "16",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Accounts and tickets",
        "period": "Aug 2026",
        "summary": "Accounts, tickets and sign-offs.",
        "milestones": [
          {
            "id": "cp-mfa",
            "title": "User administration with two-factor sign-in",
            "date": "2026-08-13",
            "ref": "5d09609",
            "refKind": "commit",
            "change": "User approval and two-factor sign-in management.",
            "significance": "Client data stays behind controlled accounts.",
            "verification": "commit"
          },
          {
            "id": "cp-tickets",
            "title": "Ticket tracking",
            "date": "2026-08-24",
            "ref": "e041748",
            "refKind": "commit",
            "change": "Ticket tracking with notifications.",
            "significance": "Clients check progress themselves.",
            "verification": "commit"
          },
          {
            "id": "cp-signoff",
            "title": "Completed sign-offs for clients",
            "date": "2026-08-18",
            "ref": "112cca3",
            "refKind": "commit",
            "change": "Completed sign-offs, linked to each site.",
            "significance": "Closes the loop from the technician app.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Connecting the systems",
        "period": "Sep 2026",
        "summary": "Connecting the systems.",
        "milestones": [
          {
            "id": "cp-connection",
            "title": "Health-checked platform connection",
            "date": "2026-09-03",
            "ref": "f92d5c6",
            "refKind": "commit",
            "change": "A health-checked link to the operations platform.",
            "significance": "Problems show as a clear status, not silent failures.",
            "verification": "commit"
          },
          {
            "id": "cp-feedback",
            "title": "Feedback forwarded to the operations team",
            "date": "2026-09-21",
            "ref": "bb2204e",
            "refKind": "commit",
            "change": "Client feedback becomes work items for the ops team.",
            "significance": "Feedback lands where the team already works.",
            "verification": "commit"
          },
          {
            "id": "cp-graph",
            "title": "Email through Microsoft Graph",
            "date": "2026-09-21",
            "ref": "8bcac8c",
            "refKind": "commit",
            "change": "Email sent through Microsoft Graph.",
            "significance": "Uses the company's Microsoft 365, not a separate service.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
    "sceneSpot": "tablet",
    "outcome": "Built from scratch in two months (154 commits)."
  },
  {
    "slug": "floor-planning-board",
    "title": "Production Floor Planning Board",
    "kind": "professional",
    "tagline": "A shared floor planner with live edit locks.",
    "period": "Jul 2026 to now",
    "problem": "Several teams plan the same floor and could overwrite each other.",
    "overview": "Bays and zones on one board, with Microsoft sign-in, field-level permissions, and locks while someone edits.",
    "role": "Developer",
    "stack": [
      "Laravel",
      "Vue"
    ],
    "integrations": [
      "Entra ID SSO",
      "IIS hosting"
    ],
    "stats": [
      {
        "value": "148",
        "label": "commits",
        "source": "Commit history, Jul – Oct 2026"
      },
      {
        "value": "9",
        "label": "active days",
        "source": "Commit history"
      }
    ],
    "phases": [
      {
        "title": "Secure foundations",
        "period": "27–30 Jul 2026",
        "summary": "Secure foundations in week one.",
        "milestones": [
          {
            "id": "fb-sso",
            "title": "Entra ID sign-in",
            "date": "2026-07-27",
            "ref": "dc3804f",
            "refKind": "commit",
            "change": "Microsoft Entra ID sign-in, checked on every request.",
            "significance": "No extra passwords; access follows company groups.",
            "verification": "commit"
          },
          {
            "id": "fb-fields",
            "title": "Field-level permissions",
            "date": "2026-07-28",
            "ref": "5b2d176",
            "refKind": "commit",
            "change": "Permissions checked field by field on every save.",
            "significance": "Teams share a board but change only what they own.",
            "verification": "commit"
          },
          {
            "id": "fb-audit",
            "title": "Audit log that understands impersonation",
            "date": "2026-07-30",
            "ref": "19c0bbd",
            "refKind": "commit",
            "change": "Audit log records the real user, even during impersonation.",
            "significance": "Support access stays accountable.",
            "verification": "commit"
          }
        ]
      },
      {
        "title": "Working together live",
        "period": "Aug – Sep 2026",
        "summary": "Working together live.",
        "milestones": [
          {
            "id": "fb-presence",
            "title": "Live editing presence",
            "date": "2026-08-06",
            "ref": "b1be127",
            "refKind": "commit",
            "change": "Shows who is editing a locked bay.",
            "significance": "People see conflicts before they happen.",
            "verification": "commit"
          },
          {
            "id": "fb-locks",
            "title": "Lock contention fix",
            "date": "2026-09-08",
            "ref": "cdc034a",
            "refKind": "commit",
            "change": "Fixed a lock clean-up bug that blocked other zones.",
            "significance": "A concurrency bug that only appears at scale.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
    "sceneSpot": "board",
    "outcome": "Sign-in, permissions and audit trail in place in the first week."
  },
  {
    "slug": "procurement-workflow",
    "title": "Procurement Pricing Workflow",
    "kind": "professional",
    "tagline": "Pricing requests, vendor quotes and approvals in one place.",
    "period": "May – Sep 2026",
    "problem": "Pricing requests had no consistent way to compare vendors or track status.",
    "overview": "Raise a request, compare vendor quotes and track every line item's status.",
    "role": "Developer",
    "stack": [
      "Laravel",
      "Livewire"
    ],
    "integrations": [
      "GitHub Actions"
    ],
    "stats": [
      {
        "value": "37",
        "label": "commits",
        "source": "Commit history, May – Sep 2026"
      }
    ],
    "phases": [
      {
        "title": "Remediation and hardening",
        "period": "16 Sep 2026",
        "summary": "One focused hardening pass.",
        "milestones": [
          {
            "id": "pw-access",
            "title": "Permission-based access control",
            "date": "2026-09-16",
            "ref": "af2bdbd",
            "refKind": "commit",
            "change": "Roles and permissions from one repeatable source.",
            "significance": "Access rules are defined once.",
            "verification": "commit"
          },
          {
            "id": "pw-audit",
            "title": "General audit trail",
            "date": "2026-09-16",
            "ref": "3452b1a",
            "refKind": "commit",
            "change": "One audit trail across the whole app.",
            "significance": "Every change traces to a person.",
            "verification": "commit"
          },
          {
            "id": "pw-uploads",
            "title": "Safer file uploads",
            "date": "2026-09-16",
            "ref": "24d1c3f",
            "refKind": "commit",
            "change": "Random file names and permission checks on uploads.",
            "significance": "Files can't be guessed or opened by the wrong user.",
            "verification": "commit"
          },
          {
            "id": "pw-tests",
            "title": "Fast automated tests",
            "date": "2026-09-16",
            "ref": "4684a80",
            "refKind": "commit",
            "change": "Fast automated tests on SQLite.",
            "significance": "Tests run quickly in CI without a database server.",
            "verification": "commit"
          }
        ]
      }
    ],
    "sourceNote": "Private company codebase. No code or screenshots are shown; descriptions are written from commit history.",
    "sceneSpot": "laptop",
    "outcome": "Hardened in one day: access control, audit trail, safe uploads and tests."
  }
];

export function getProject(slug: string | undefined): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function allMilestones() {
  return projects.flatMap((project) =>
    project.phases.flatMap((phase) => phase.milestones.map((milestone) => ({ project, milestone }))),
  );
}
