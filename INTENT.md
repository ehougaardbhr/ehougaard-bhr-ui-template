# INTENT — Post-Approval Plan Tracking UX

## Goal

After an AI plan executes, the user needs a place to understand what happened: what was found, what was produced, what was decided, and by whom. Currently this is all buried in chat scroll, which is a poor retrieval surface.

We're designing a **Plan Detail Page** — a dedicated route (`/plans/:id`). But critically, this page is a **retrospective summary**, not a live dashboard. It organizes outcomes, not status.

## Key Reframing: Surface Roles

Each UI surface has a distinct job. The Plan Detail Page should not duplicate what other surfaces already do well.

| User question | Best surface | Why |
|---|---|---|
| Is anything stuck? | **AttentionCard** (home) | Already surfaces review gates needing action |
| Is the plan progressing? | **AutomationsCard** (home) | Shows running/complete at a glance |
| Approve something | **Chat** | Review gates are interactive there |
| What did the AI find? | **Plan Detail Page** | Chat scroll is bad for retrieval |
| What was decided? | **Plan Detail Page** | No audit trail exists elsewhere |
| Show me everything produced | **Plan Detail Page** | Artifacts scattered across messages |

**The Plan Detail Page is read-only.** Actions (approvals, review gates) stay in AttentionCard and chat. No "Review Now" buttons on this page — that creates a confusing second place to act.

**The primary use case is retrospective.** "What happened with the Tony backfill?" not "What's happening right now?" The mid-execution view is a lighter version of the same — findings so far + upcoming items — not a progress dashboard.

The flow: **notification pulls user in → AttentionCard shows what needs action → AutomationsCard gives overview → Chat is where you act → Plan Detail Page is where you review outcomes.**

## Current Direction — v5 (Findings + Upcoming + Parallel)

### Core Pattern: Finding Card

Each card represents one coherent insight synthesized from multiple tool calls. Three layers, all visible:

1. **Lead finding** (14px, bold opener) — the most important insight, high prominence. Example: *"Daniel Kim is significantly underpaid and a high flight risk."*

2. **Secondary findings** (13px, colored severity dots) — always visible below the lead, compact but readable. Red/amber/green/blue dots for at-a-glance severity scanning. No progressive disclosure — visual hierarchy does the work.

3. **Artifact chips** — inline at bottom of card. Clicking opens a **slide-out panel on the right** (420px) showing the artifact content while findings list narrows. User stays in context.

4. **Review gate footer** — who approved, when, and the decision context. Read-only on this page.

5. **Execution audit** (toggle) — "3 tools ran in 2 min" — implementation detail, correctly hidden by default.

### Upcoming Cards

Upcoming/queued sections show full item checklists with open dots, review gates, and who will approve. Clear **"UPCOMING"** badge (grey, uppercase). Answers "what happens next?" without requiring a separate plan overview.

### Parallel Branches

Side-by-side cards with "Running in parallel" / "Ran in parallel" label + branch icon. Shared review gate sits below both cards, explicitly noting it waits for both branches. During execution, one card can be done while the other is still working.

### Artifact Panel

Slide-out panel on the right when an artifact chip is clicked:
- Artifact content rendered inline (charts, tables, documents)
- "Open full view" and "Export"/"Edit" actions
- X to close, findings list returns to full width

### What the Page Does NOT Have

- **No action buttons.** No "Review Now", no "Approve", no "Pause". This is a read-only summary. Actions live in chat and AttentionCard.
- **No tabs.** Single scrollable view.
- **No tool-by-tool timeline.** Execution log behind toggle per card.
- **No status dashboard features.** Progress bar in header is contextual, not the primary purpose.

## Design Decisions Made

- **Retrospective summary, not live dashboard.** The page's job is comprehension after the fact, not status monitoring (home page) or interaction (chat).
- **Read-only.** Actions stay where they already work — AttentionCard for urgency, chat for interaction. No duplicate action surfaces.
- **Findings > tool calls.** Display unit is "insight surfaced", not "tool executed."
- **All findings visible by default.** Lead finding has typographic prominence; secondaries always shown. Progressive disclosure for findings hides good analysis.
- **Artifact panel, not new window.** Side-by-side viewing keeps context.
- **Expanded upcoming cards (Option A).** Shows full plan structure in the natural "what's next" position. Preferred over header disclosure (Option B, too hidden) and sidebar rail (Option C, too heavy).
- **Breadcrumb: Home > Activity > Plan** — supports AutomationsCard "View All Activity" becoming a real route.
- **"Open in chat" link always present** — the detail page is for reading, chat is for acting.

## Three User Moments

The page serves the same content at every stage, but the user's mindset differs:

| Moment | Scenario | What they need | Where they were before |
|---|---|---|---|
| **Right now** | Just approved in chat | Results streaming in | Chat — they stay there |
| **Next day** | Check-in from home page | Status + findings so far | AutomationsCard click |
| **Week later** | Boss asks "what happened?" | Full findings + decisions + artifacts | AutomationsCard or bookmark |

**Chat owns the "right now" moment.** The detail page serves next-day and week-later. AutomationsCard is the entry point for both.

## What's Done

- [x] Analyzed all existing UI surfaces (PlanInlineCard, AutomationsCard, AttentionCard, notifications, PlanFullView, chat panel)
- [x] Identified the real gap: retrospective comprehension (findings, artifacts, decisions), not status
- [x] v1 mockup: `demos/plan-detail-page.html` — timeline-based, three tabs. **Superseded.**
- [x] v2 mockup: `demos/plan-detail-page-v2.html` — findings-based cards, progressive disclosure. **Superseded** (hid too much).
- [x] v3 mockup: `demos/plan-detail-page-v3.html` — all findings visible, artifact slide-out panel. Approved as core pattern.
- [x] v4 mockup: `demos/plan-detail-page-v4.html` — compared 3 approaches for plan overview: expanded queued cards (A), header disclosure (B), sidebar rail (C). **User chose A.**
- [x] v5 mockup: `demos/plan-detail-page-v5.html` — findings + upcoming + parallel branches + artifact panel. Three states.
- [x] Reframed the page's role: retrospective summary, not dashboard. Actions stay in chat + home page. Page is read-only.
- [x] Clarified the three user moments (right now → chat, next day → detail page, week later → detail page). Mid-execution view is valuable but minimal and read-only.
- [x] v6 mockup: `demos/plan-detail-page-v6.html` — **current version.** Framed as "Next-Day Check-In" and "Week-Later Retrospective." Fully read-only. No action buttons. Waiting states use clock icon + "Open in chat" link. Calm, informational tone.
- [x] **Implemented Plan Detail Page** — React implementation at `/plans/:id` route:
  - Created mock data with two plan states (mid-execution + completed) in `src/data/planDetailData.ts`
  - Built FindingCard component handling done/awaiting/working/upcoming states with severity dots, artifact chips, review gate footers
  - Built ArtifactPanel component (440px slide-out) with comp chart, org report, dev plan renderers
  - Built PlanDetailHeader with status badges and progress bar
  - Built PlanDetail page with parallel group rendering logic, completion banner
  - Artifact panel coexists with AI chat panel (findings pane compresses when panel opens)
  - Added 7 new icons to Icon component (clipboard-list, clipboard-check, chart-bar, code-branch, arrow-right, briefcase, download)
  - Wired up AutomationsCard "View details" link navigating to plan detail page
  - Route: `/plans/plan-backfill-mid` (mid-execution), `/plans/plan-backfill-done` (completed)

## Rejected Approaches

- **Chat-only tracking** — Chat scroll is bad for retrieval. Can't answer "what was decided" or "show me all artifacts."
- **Enhanced PlanInlineCard only** — Anchored to chat. If chat is closed, you lose access.
- **Timeline/execution log (v1)** — CI/CD build log. Users think in insights, not tool calls.
- **Three tabs (v1)** — Fragments information users want to see together.
- **Progressive disclosure for findings (v2)** — Hides good analysis behind a toggle.
- **New window for artifacts** — Breaks context.
- **Header disclosure for plan overview (v4 Option B)** — Too hidden. User has to actively click.
- **Sidebar rail for plan overview (v4 Option C)** — Too heavy. Overbuilt for 3-4 section plans.
- **Action buttons on detail page (v5)** — Creates a confusing second place to approve/review. AttentionCard and chat already own actions.
- **Live dashboard framing** — Home page already handles status and urgency. Competing dashboard is redundant.
- **Pulsing amber "Review Now" on detail page (v5)** — Wrong tone. This page observes; it doesn't demand. Urgency belongs on the home page (AttentionCard).

## Open Questions (Plan Detail)

1. Where do completed plans live long-term? Do they fade from AutomationsCard?
2. How does parallel layout work on narrow screens?
3. Should review gate footers link to the specific chat message where the approval happened?
4. How should findings be generated during real plan execution? Current implementation uses hardcoded mock data — need to design how the execution engine populates findings.

---

# INTENT — Automations Page

## Goal

A dedicated top-level page (`/automations`) that serves as Jess's **AI control center** — where she sees, monitors, and manages everything the system AI is doing on her behalf. The home page AutomationsCard widget is the summary; this page is the full, detailed view.

This is NOT a log or activity feed — it's a **management dashboard** for active AI-driven automations. The user should be able to see what's running, what needs attention, and take action (pause, resume, cancel, edit).

## Scope Decisions

- **"Big stuff" only.** Plans like backfill workflows, hiring pipeline reviews, comp analyses — not lightweight background tasks like timesheet reminders or document collection.
- **Designed for 10+ automations** at scale.
- **Management actions per automation:** pause, resume, cancel, edit.
- **Primary view: what's active now.** Tab or dropdown to switch to history/audit view.
- **Clicking an automation → Plan Detail page** (`/plans/:id`). No inline detail view on this page.

## Current Direction — Alert Stack (#12) with refinements

**Winner: Concept 12 (Alert Stack)** — chosen from 15 explored concepts.

### Core Pattern
The page has two distinct zones with extreme visual contrast:

1. **Attention zone (top):** Stacked alert cards for automations needing the user. Each alert has:
   - A labeled intent: *"I have something to show you"*, *"I need your approval"*, *"Paused — waiting on you"*
   - Left color bar by type (amber for review/paused, purple for approval)
   - Specific action buttons (Review Findings, Approve, Resume, etc.)
   - Dismiss button to clear
   - Per-card management (pause, edit, cancel via ellipsis menu)

2. **Quiet zone (below):** Simple rows for automations running fine. Minimal visual weight. Per-row pause button, ellipsis menu, and chevron to navigate to Plan Detail.

### Key Insight
"Needs your attention" must be called out specifically with the AI's voice — *"I have something to show you"* vs *"I need your approval."* This is not a generic badge; it's a specific communication from the AI to the user.

### Global Controls
- **Active / History** toggle in page header
- **New Automation** button in page header
- Per-automation actions live in ellipsis menus (pause, edit, cancel)
- No "Pause All" — unnecessary edge case

### v5 Refinements (`demos/automations-page-v5.html`)
Based on UX review of v4:
- **One primary CTA per alert + ellipsis.** Reduced from 4+ buttons to avoid decision fatigue.
- **No dismiss X.** Alerts clear by acting on them, not by dismissing. Prevents accidentally hiding compliance items.
- **Timestamps everywhere.** "Waiting since Jan 17" on alerts, "30m ago" on quiet rows. Managers need to know staleness.
- **Dropped toolbar.** Merged Active/History + New into page header row. Less chrome before content.
- **Shortened alert copy.** Lead with key data: "2 weak pipelines, 4 below-market roles. Review to proceed."
- **Empty state.** Green "all clear" banner when nothing needs attention. Page feels good, not empty.
- **No Pause All, no Bulk Actions.** Premature. Per-item ellipsis is sufficient.
- **Two demo states:** "With Alerts" and "All Clear" to show both modes.

## What's Done

- [x] Stubbed Automations page at `/automations` with route, nav icon (bolt), and "View All Activity" link wired from AutomationsCard
- [x] Built 15 diverging concept mockups across 3 HTML files (`demos/automations-page-concepts.html`, `v2`, `v3`)
- [x] Clarified scope: big automations only, 10+ scale, management actions, tab for history
- [x] Key insight identified: attention items must use AI voice ("I have something to show you" / "I need your approval")
- [x] Winner selected: #12 (Alert Stack). Built two refinement variants in `demos/automations-page-concepts-v4.html`
- [x] UX review of v4A: simplified buttons, removed dismiss X, added timestamps, dropped toolbar/Pause All, added empty state
- [x] Built v5 refined mockup: `demos/automations-page-v5.html` — two states (with alerts / all clear)

## Rejected Approaches

- **Concepts 1–5** (Card List, Table, Kanban, Master/Detail, Dashboard) — functional but lacked the attention-calling pattern. Treated all automations equally.
- **Concepts 6–10** (Command Center, Gantt, Conversational, Status Rings, Priority Split) — too conceptual/novel. Command Center and Rings were aesthetic over substance. Conversational was redundant with existing chat. Gantt was too PM-tool. Priority Split was closest to the insight but too rigid.
- **Concepts 11, 13, 14** (AI Briefing, Triage Mode, Accordion) — elements may be reused but not selected as primary pattern. Triage mode too opinionated for a management page.
- **Concept B (Hero Banner + Stack)** — dark banner was visually striking but alert stack on white bg is cleaner for daily use.
- **Pause All button** — "When would I need this? When I scream stop the presses like Gonzo?" Per-item control is sufficient.
- **Bulk Actions dropdown** — premature. No real multi-select use case yet.
- **Dismiss X on alerts** — too dangerous for HR context. What does dismiss mean? Alerts clear by acting on them.

## Next Steps

1. User reviews v5, gives final approval
2. Build in React
3. Wire up per-automation management actions (pause/resume/cancel/edit via ellipsis)
4. Implement history tab
5. Replace dummy AutomationsCard data with real automation types
