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

## Open Questions

1. Should the "View All Activity" link on AutomationsCard route to a plan list page or directly to the most recent plan?
2. Where do completed plans live long-term? Do they fade from AutomationsCard?
3. How does parallel layout work on narrow screens?
4. Should review gate footers link to the specific chat message where the approval happened?

## Next Steps

1. Design the Activity list page (what AutomationsCard "View All" links to)
2. Consider how AutomationsCard rows link to the detail page
3. Get final approval on v6 mockup
4. Implement in React
