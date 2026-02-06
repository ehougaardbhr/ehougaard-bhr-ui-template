# BHR UI Template — Claude Code Project Guide

## Project Overview
AI-first BambooHR HRIS demo application. Current focus: **EE Backfill Demo** — an AI-powered employee backfill planning workflow.

- **Branch:** `ee-backfill-demo`
- **PRD:** `PRD-ee-backfill-demo.md` (includes sprint plan + Plan artifact design intent at line ~681)
- **Tech:** React + TypeScript + Vite, CSS variables for theming

## Sprint Status
- **Sprint 1 (Foundation):** Complete — data enrichment, plan artifact type, home chat input, notifications, widget stub
- **Sprint 2 (LLM Integration):** Not started
- **Sprint 3 (E2E Wiring):** Not started

## Key Design Decisions

### Plan Artifact UX (Inline Chat View)
Iterated through 8 rounds of mockups (v1-v8). Mockup files: `demos/plan-in-collapsed-chat-v*.html`

**Final design: v8** — Two-state card with human-centered language

#### Two Card States

**Proposal State** — "Here's my plan, want me to run it?"
- Purple "Proposed" badge in title bar
- All action items show as "planned" (light grey outline circles)
- Section headers with no item count badges
- Review steps show as "Review — [Person's Name]" with rounded-square hand icon (70% opacity green)
- Footer: "3 review steps" text + "Edit Plan" (outline) + "Approve & Start" (primary green) buttons
- No progress bar, no timestamps

**Execution State** — "Here's where things stand"
- Badge changes based on state: "Working" (blue with spinner) or "Needs Your Review" (amber with hand icon)
- Continuous progress bar (smooth fill, not segmented) showing % complete
- Timestamp: "Started 47 min ago"
- Action items: done (green filled circle + check), working (blue filled circle + spinner), queued (grey outline circle)
- Completed sections collapse to single row: chevron + icon + title + "3/3" count
- Review steps:
  - **Passed:** Hand icon with green check badge overlay + grey text "Review — [Name]"
  - **Ready for review:** Green background tint + pulsing hand icon + green "Needs review" button inline
  - **Future:** Faded hand icon (45% opacity) + grey text
- Blocked sections show "Pending [Name]'s review" badge instead of item counts
- Footer: Just "4 of 10 complete" text, no buttons

#### Visual Rules
- **No "gate" language** — use "review step" everywhere, name the person not the mechanism
- **Review step spacing:** 16px padding-bottom, 16px bottom margin, no border above (flows from section)
- **Item icons:** Circles for AI work, rounded squares for human review
- **Colors:**
  - Green `#2e7918`: brand primary, review steps, done items
  - Blue `#2563EB`: working/in-progress
  - Grey `#A8A29E`: queued/future
  - Amber `#D97706`: awaiting user action
  - Purple `#7C3AED`: proposed state
- **Competitive reference screenshots:** `demos/Plan Screenshots/`

### Design Tokens
- Brand green: `#2e7918` (also `--color-primary`)
- Done/completed: `#059669` (emerald)
- Working/active: `#2563EB` (blue)
- Queued/future: `#A8A29E` (warm grey)
- Error/warning: yellow (reserved, not yet defined)
- Font: Inter
- Surface variables: `--surface-neutral-white`, `--text-neutral-x-strong`, etc.

## File Structure
```
src/
  components/    # Reusable UI components
  contexts/      # React context providers (ChatContext, ArtifactContext, AINotificationContext)
  data/          # Mock data (employees, candidates, talentPools, jobOpenings, etc.)
  layouts/       # AppLayout
  pages/         # Route pages (Home, OrgChart, etc.)
  services/      # Service layer (future: aiService)
  types/         # TypeScript interfaces
  utils/         # Utilities
demos/           # HTML mockups and reference screenshots
```

## Conventions
- Artifact types: `'text' | 'chart' | 'org-chart' | 'plan'`
- ActionItem status: `'planned' | 'queued' | 'working' | 'done'`
- ReviewStep interface: `{ id, description, reviewer, status: 'planned' | 'passed' | 'ready' | 'future' }`
- PlanStatus: `'proposed' | 'running' | 'paused' | 'completed'`
- Font Awesome 6.4.0 for icons in mockups
