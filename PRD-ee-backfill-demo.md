# PRD: AI-Powered Employee Backfill Demo

## Overview

Build an end-to-end demo showcasing a **general-purpose AI planning system** within our BambooHR HRIS. A user describes a goal in natural language. The AI interviews them to deeply understand the situation, generates a plan, gets approval, then executes autonomously — notifying the human when it needs input.

The **first demo scenario** is backfilling a key employee departure, but the underlying system (interview → plan → approve → execute → notify) is designed to power any complex HR workflow: onboarding, reorgs, compensation reviews, performance improvement, etc.

**Branch:** `ee-backfill-demo`
**Project:** `/Users/mmorrell/CascadeProjects/bhr-ui-template`

---

## General AI Planning Flow

```
Phase 1: INITIATE
  → User describes a goal via Home Screen Chat Input (NEW)

Phase 2: INTERVIEW
  → AI acknowledges and empathizes
  → AI asks clarifying questions to deeply understand:
      - What is the user's actual goal? (not just the surface request)
      - What context does the AI need? (urgency, constraints, stakeholders)
      - What decisions has the user already made vs. needs help with?
      - Are there related concerns the user hasn't thought of?
  → AI adapts its questions based on answers (not a rigid script)
  → AI signals when it has enough info to create a plan
      (e.g., "I think I have a good understanding. Let me put together a plan.")

Phase 3: PLAN
  → AI generates a Plan artifact (NEW artifact type)
  → Plan sections are AI-determined based on the specific scenario
  → Plan is presented as an inline card in chat (read-only summary)
  → User can open the full artifact workspace to review, edit, and approve

Phase 4: APPROVE
  → User reviews the plan in the full artifact workspace
  → User can edit sections, add/remove action items, adjust details
  → User approves → triggers immediate execution (no extra confirmation)

Phase 5: EXECUTE
  → AI begins working on the plan autonomously
  → AI notifies user when it needs input or approval (NEW Notification)
  → User can check progress on the dashboard (NEW "What's Running" widget)
  → AI completes actions, reports results, and asks for next steps
```

---

## Demo Scenario: Backfilling Key Employee Departure

The first demo walks through the general flow with this specific scenario:

### Phase 2 Detail — AI Interview for Backfill

The AI should ask smart, contextual questions like:
- "I'm sorry to hear about Tony leaving. Tell me about your goals for this position — do you want to replace Tony's exact role, or is this an opportunity to reshape it?"
- "How urgent is the backfill? Is there someone covering Tony's responsibilities in the meantime?"
- "Do you already have approval for this position, or does someone need to sign off?"
- "Help me understand why Tony left — are there retention concerns we should address for the rest of the team? (pay bands, company culture, workload, etc.)"
- "Are you open to hiring internally, externally, or both?"
- "Is this a single role backfill, or do we need to think about multiple positions?"

The AI adapts — if the user says "we already have approval," it doesn't ask more about that. If the user mentions team morale concerns, the AI digs deeper there.

### Phase 5 Detail — Execution Paths

Based on the approved plan, the AI may execute along multiple paths:

**External Hiring:**
- Search talent pools & past applicants for qualified candidates
- Present manager with a ranked candidate list
- Write a new job requisition
- Send job req to manager → HR admin for approval

**Internal Hiring:**
- Analyze current team for promotion-ready employees
- Identify ripple effects in staffing (if someone is promoted, who backfills *them*?)
- Present internal candidates with rationale

**Multi-Role Scenarios:**
If the backfill involves multiple positions (e.g., Tony's departure triggers a reorg, or the team was already understaffed), the AI should:
- Identify all roles that need filling
- Prioritize them by urgency and dependency
- Create a plan that addresses them as a coordinated effort, not isolated hires

**Proactive Actions** (AI thinks beyond the obvious):
The AI should dynamically identify follow-up concerns the user may not have thought of. These are not hardcoded — the AI generates them based on context. Examples:
- Flag if Tony's pay band was below market (retention risk for others)
- Check if Tony's departure creates a single point of failure
- Suggest updating the job description based on how the role has evolved
- Identify training needs if promoting internally
- Notice if the team has had multiple departures recently (pattern?)
- Recommend interim coverage if the backfill will take time

---

## Decisions Made

| Question | Decision |
|----------|----------|
| AI integration approach | **Real LLM integration** (OpenAI/Claude API with crafted prompts) |
| Plan artifact rendering | **Both**: Inline card in chat (read-only) + full artifact workspace (editable) |
| Plans as artifact type | Plans are a 6th artifact type added to the existing system (alongside chart, text, document, org-chart, table) |
| Demo scope | **Full flow** — all 4 new UI components (home chat input, plan artifact, notifications, "what's running" widget) |
| Demo data | **Add Tony + context** — create Tony employee with departure data |
| LLM provider | **Both (configurable)** — Abstract service layer so OpenAI or Claude can be swapped. Default to one for demo. |
| Plan structure | **AI-generated** — Let the LLM decide what sections make sense for the scenario. No rigid template. |
| Approval flow | **Immediate execution** — Approving the plan triggers AI to start working right away. No extra confirmation. |
| Home screen chat input | **Floating input bar** — Same component and styling as the existing floating input bar on the org chart page. Designs for a final version will come later. |
| Notifications | **Desktop-style notifications** (like macOS) when AI needs human input/approval. Home screen gridlet alerts will be stubbed minimally (teammate designing home screen). **NOTE: Human-in-the-loop notifications is a major feature area we will return to and build out robustly in a future phase.** |

---

## All Questions Resolved

---

## What Exists Today (Can Reuse)

### Artifact System (FULLY BUILT)
The `experiments` branch has a complete, mature artifact system. This is the foundation we'll extend.

**Types & Data** (`src/data/artifactData.ts`):
- `ArtifactType = 'chart' | 'text' | 'document' | 'org-chart' | 'table'` — we add `'plan'` as 6th type
- `Artifact` interface: `{ id, type, title, conversationId, createdAt, settings, content? }`
- Each type has its own settings interface: `ChartSettings`, `TextSettings`, `OrgChartSettings`
- `settings` field uses `Record<string, unknown>` fallback — already extensible for new types
- 10 mock artifacts pre-loaded

**Context & State** (`src/contexts/ArtifactContext.tsx`):
- `ArtifactProvider` with full CRUD: `selectArtifact()`, `createArtifact()`, `updateArtifactSettings()`, `updateArtifactContent()`
- `getArtifactsByConversation()` — links artifacts to chat conversations
- localStorage persistence for selected artifact
- `createArtifact()` already handles type-specific default settings with fallback to `{}`

**Inline Rendering** (`src/components/InlineArtifactCard/InlineArtifactCard.tsx`):
- Renders artifact cards inline in chat messages
- Supports compact (panel) and fullscreen modes
- Type-specific rendering: charts (bar/line/pie/table), text (truncated preview), org-chart (thumbnail with icon)
- Action buttons: Copy, Edit (→ navigates to `/artifact/:type/:id`), Publish (dashboard/report/share/download)
- Click-to-expand behavior in compact mode

**Full Artifact Workspace** (`src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx`):
- Route: `/artifact/:type/:id`
- Full-screen editing experience outside main app layout
- Type-specific rendering: charts with `ChartSettingsToolbar`, text with `TextEditor`, org-chart with `OrgChartArtifact`
- `ArtifactTopBar` — back button, title, copy, publish actions
- `ArtifactChatPanel` — side panel for conversing about the artifact
- **Type whitelist check**: currently only allows `chart`, `text`, `org-chart` — needs `plan` added

**Supporting Components:**
- `ArtifactToolBar` (`src/components/ArtifactToolBar/`)
- `ArtifactTopBar` (`src/components/ArtifactTopBar/`)
- `ArtifactChatPanel` (`src/components/ArtifactChatPanel/`)
- `ArtifactTransitionOverlay` (`src/components/ArtifactTransitionOverlay/`)
- `OrgChartThumbnail` (`src/components/OrgChart/`)

### AI Chat System (FULLY BUILT)
- **AIChatPanel** (`src/components/AIChatPanel/AIChatPanel.tsx`) — slide-in panel (383px), expandable to fullscreen, already renders `InlineArtifactCard` for messages with `artifactId`
- **ChatContent** (`src/components/ChatContent/ChatContent.tsx`) — message rendering, input, suggestion chips
- **ChatSidebar** (`src/components/ChatSidebar/ChatSidebar.tsx`) — conversation list, search
- **ChatContext** (`src/contexts/ChatContext.tsx`) — conversation state: `selectConversation()`, `createNewChat()`, `addMessage()`
- **MarkdownContent** (`src/components/MarkdownContent/MarkdownContent.tsx`) — full markdown rendering (headers, lists, code, tables, links)
- **ChatMessage** already has `artifactId?: string` field for inline artifact references
- **15 mock conversations** in `src/data/chatData.ts`, several already reference artifacts

### Home / Dashboard
- **Home page** (`src/pages/Home/Home.tsx`) — hero section + 9-widget grid
- **Gridlet** (`src/components/Gridlet/`) — reusable dashboard card/widget with title, minHeight

### Hiring & Talent
- **Hiring page** (`src/pages/Hiring/`) — job openings, candidates, talent pools tabs
- **Job data** (`src/data/jobOpenings.ts`) — job openings with status, candidates, hiring lead
- **Talent pool data** (`src/data/talentPools.ts`)
- **Candidate data** (`src/data/candidates.ts`, `src/data/jobCandidates.ts`)

### Employee Data
- **61 employees** (`src/data/employees.ts`) — full org hierarchy (CEO → VPs → Managers → ICs)
- **reportsTo** and **directReports** fields — org chain already modeled
- **isTBH** field — "To Be Hired" positions already supported
- **Departments**: Finance, HR, Marketing, Product, Technology, Operations
- **Locations**: Hercules CA, London, Lindon UT, Remote, Vancouver, Sydney

### Notifications (Partial)
- **SuccessNotification** (`src/components/SuccessNotification/`) — green banner, slide-down, dismiss
- **Inbox system** (`src/data/inboxData.ts`) — 23 mock requests with approval workflow

### Layout & Navigation
- **AppLayout** (`src/layouts/AppLayout.tsx`) — GlobalNav + GlobalHeader + content + AIChatPanel
- **Design tokens** in `src/index.css` — colors, spacing, radius, shadows, dark mode

---

## Data Enrichment

The AI needs rich, realistic data to make the demo convincing. All data stays in TypeScript files in `src/data/` — no database, no backend. The LLM service imports relevant slices and serializes them into the system prompt.

This investment pays off beyond the backfill demo — every future AI scenario (onboarding, reorgs, comp reviews, etc.) reuses the same enriched dataset.

### Storage Approach
- All data in **TypeScript files** (`src/data/*.ts`) — fully typed, zero latency, imported directly
- No database or API layer needed — this is a frontend-only demo
- LLM receives curated data slices in system prompts (not the full dataset)
- ~200 employee records fully enriched ≈ a few hundred KB — Vite handles this instantly

### 1. Employee Data Enrichment (`src/data/employees.ts`)

**Current state:** 57 employees with name, title, department, location, org chain, hire date. All hire dates are the same ("01/15/2020"). No compensation, performance, or skills data.

**Add these fields to the `Employee` interface:**

```typescript
// Compensation
salary?: number;                    // Annual salary
payBand?: { min: number; max: number; midpoint: number };
currency?: string;                  // 'USD', 'GBP', 'CAD', 'AUD'
lastRaise?: string;                 // Date of last raise
lastRaisePercent?: number;          // % of last raise

// Performance
performanceRating?: 1 | 2 | 3 | 4 | 5;  // 1=Needs Improvement, 5=Exceptional
lastReviewDate?: string;
promotionReadiness?: 'ready_now' | 'ready_in_1yr' | 'not_ready';
flightRisk?: 'low' | 'medium' | 'high';

// Skills & Experience
skills?: string[];                  // ['Python', 'React', 'People Management', etc.]
yearsOfExperience?: number;
education?: string;                 // 'BS Computer Science', 'MBA', etc.
certifications?: string[];

// Tenure (replace single static date with realistic variety)
hireDate?: string;                  // Varied realistic dates
startDate?: string;                 // Original start date (if different)

// Status
status?: 'active' | 'departed' | 'on_leave';
departureDate?: string;             // For departed employees (Tony)
departureReason?: string;           // 'Voluntary - New Opportunity', 'Voluntary - Relocation', etc.
```

**Data population guidelines:**
- Vary hire dates realistically (2018–2025)
- Salary ranges should be realistic for title/location (SF > Lindon UT > London etc.)
- Performance ratings: bell curve distribution (mostly 3s, some 4s, few 1s and 5s)
- Skills should match role (engineers get tech skills, marketing gets marketing skills)
- Populate `promotionReadiness` for at least Tony's team members so the AI can suggest internal candidates
- Mark 2-3 employees as `flightRisk: 'high'` so AI can flag retention concerns

### 2. Tony — The Departed Employee

**Add Tony to `employees.ts`** as a senior individual contributor in the Technology department:

```typescript
{
  id: 200,
  name: 'Tony Ramirez',
  firstName: 'Tony',
  lastName: 'Ramirez',
  title: 'Senior Software Engineer',
  department: 'Technology',
  location: 'Hercules, CA',
  division: 'North America',
  reportsTo: 15,                    // Reports to a Tech Manager (e.g., Marcus Chen)
  directReports: 0,
  status: 'departed',
  departureDate: '2026-01-24',
  departureReason: 'Voluntary - New Opportunity',
  hireDate: '2021-03-15',
  salary: 165000,
  payBand: { min: 140000, max: 190000, midpoint: 165000 },
  performanceRating: 4,
  skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'System Design', 'Mentoring'],
  yearsOfExperience: 8,
  education: 'BS Computer Science, UC Berkeley',
  // ... standard fields (email, phone, avatar, etc.)
}
```

**Also create `src/data/backfillDemoData.ts`** with Tony-specific context the AI needs:
- Tony's exit interview notes (summarized — reason for leaving, what he liked/disliked)
- His project responsibilities and current ownership areas
- Knowledge transfer status (what's documented vs. in his head)
- Impact assessment — what's at risk with Tony gone

### 3. Compensation & Pay Bands (`src/data/compensationData.ts` — NEW)

**Create this file** with market rate data the AI can reference:

```typescript
export interface PayBand {
  level: string;           // 'IC1', 'IC2', 'IC3', 'IC4', 'IC5', 'M1', 'M2', 'D1', 'VP', 'C-Suite'
  title: string;           // 'Junior Engineer', 'Senior Engineer', etc.
  department: string;
  location: string;        // Pay varies by market
  min: number;
  midpoint: number;
  max: number;
  currency: string;
}

export interface MarketBenchmark {
  role: string;
  location: string;
  p25: number;             // 25th percentile
  p50: number;             // Median
  p75: number;             // 75th percentile
  source: string;          // 'Industry Average 2025'
}
```

**Why this matters:** The AI can flag if Tony was underpaid (retention risk for others), suggest competitive salary ranges for the backfill, and compare internal candidates' current comp to the open role's band.

### 4. Talent Pool & Candidates Enrichment

**`src/data/talentPools.ts`** — Currently just 3 pools with a count. Enrich:

```typescript
export interface TalentPool {
  id: string;
  title: string;
  icon: IconName;
  candidatesCount: number;
  department: string;               // NEW: link to department
  description?: string;             // NEW
  lastUpdated?: string;             // NEW
  candidateIds?: string[];          // NEW: link to actual candidates
}
```

Add a "Technology" talent pool with candidates who match Tony's role.

**`src/data/candidates.ts`** — Currently 6 generic candidates. Enrich existing + add new:

```typescript
// Add to Candidate interface:
skills?: string[];                  // ['React', 'TypeScript', 'AWS', ...]
yearsOfExperience?: number;
education?: string;
currentCompany?: string;
currentTitle?: string;
salaryExpectation?: number;
availability?: string;             // 'Immediate', '2 weeks', '1 month'
source?: string;                   // 'LinkedIn', 'Referral', 'Past Applicant', 'Career Page'
matchScore?: number;               // 0-100 AI-calculated fit score
notes?: string;                    // Recruiter notes
talentPoolId?: string;             // Link to talent pool
```

**Add 4-6 realistic candidates** who could fill Tony's role — mix of strong, medium, and weak fits so the AI can make interesting recommendations.

### 5. Job Openings Enrichment (`src/data/jobOpenings.ts`)

**Add to `JobOpening` interface:**

```typescript
department?: string;                // Link to department
salaryRange?: { min: number; max: number };
description?: string;              // Full job description (markdown)
requirements?: string[];           // Required skills/qualifications
niceToHaves?: string[];            // Preferred qualifications
employmentType?: string;           // 'Full-Time', 'Part-Time', 'Contract'
reportsTo?: number;                // Employee ID of hiring manager
priority?: 'low' | 'medium' | 'high' | 'urgent';
approvedBy?: string;
approvalDate?: string;
```

### 6. Internal Mobility Data (`src/data/internalMobility.ts` — NEW)

Data the AI needs to suggest internal promotions:

```typescript
export interface InternalCandidate {
  employeeId: number;               // Links to employees.ts
  readinessLevel: 'ready_now' | 'ready_in_6mo' | 'ready_in_1yr';
  strengthAreas: string[];
  developmentAreas: string[];
  interestInRole: boolean;          // Has expressed interest in growth
  managerEndorsement: boolean;
  successorFor?: number[];          // Employee IDs they could succeed
  notes?: string;
}

export interface RippleEffect {
  scenario: string;                 // "Promote Alex → need to backfill Alex's role"
  promotedEmployee: number;
  vacatedRole: string;
  impactLevel: 'low' | 'medium' | 'high';
  mitigation?: string;
}
```

**Why this matters:** When the AI suggests promoting someone internally, it can show the ripple effect — "If we promote Alex to Tony's role, we'd need to backfill Alex's current position. Here are 2 internal candidates for that..."

---

## What Needs to Be Built (NEW)

### 1. Home Screen Chat Input
**Location:** `src/pages/Home/Home.tsx`
**Description:** A floating input bar on the home/dashboard page — same component and styling as the existing floating input bar on the org chart page. When the user types and submits, it opens the AI chat panel with that message as the first user message in a new conversation.
**Approach:** Reuse the org chart's floating input bar component. Wire to `ChatContext.createNewChat()` + `addMessage()`. Final designs will come later from a teammate.

### 2. Plan Artifact Type (EXTENDS EXISTING SYSTEM)
This is NOT building from scratch — it's adding `'plan'` to the existing artifact infrastructure.

**Files to modify:**
- `src/data/artifactData.ts` — Add `'plan'` to `ArtifactType` union, add `PlanSettings` interface, add `PlanSection` and `ActionItem` types
- `src/contexts/ArtifactContext.tsx` — Add default settings for `plan` type in `createArtifact()`
- `src/components/InlineArtifactCard/InlineArtifactCard.tsx` — Add plan-specific inline rendering (read-only card with status, sections summary, approve button)
- `src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx` — Add `'plan'` to type whitelist, add plan-specific full view with editing + approval

**New components to create:**
- `src/components/PlanArtifact/PlanInlineCard.tsx` — Compact card for chat: shows plan title, status badge, section count, approve/review CTA
- `src/components/PlanArtifact/PlanFullView.tsx` — Full workspace view: editable sections, action items with checkboxes, status management, approve/reject buttons
- `src/components/PlanArtifact/PlanSettingsToolbar.tsx` — Settings bar (like `ChartSettingsToolbar` / `TextSettingsToolbar`) for plan-specific controls

**Proposed Plan data structure:**
```typescript
// Added to artifactData.ts
export type PlanStatus = 'draft' | 'pending_approval' | 'approved' | 'in_progress' | 'completed';

export interface PlanSection {
  id: string;
  title: string;
  content: string; // markdown
  actionItems?: ActionItem[];
}

export interface ActionItem {
  id: string;
  description: string;
  owner?: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate?: string;
}

export interface PlanSettings {
  status: PlanStatus;
  sections: PlanSection[];
  approvedBy?: string;
  approvedAt?: string;
}
```

The `Artifact` interface already works — `type: 'plan'`, `settings: PlanSettings`, `content` for summary text.

### 3. Real LLM Integration (Configurable Provider)
**Files to create:**
- `src/services/aiService.ts` — Abstract LLM client with provider interface (OpenAI + Claude implementations)
- `src/services/providers/openai.ts` — OpenAI provider
- `src/services/providers/anthropic.ts` — Anthropic/Claude provider
- `src/prompts/backfillPrompts.ts` — System prompts for backfill scenario

**Files to modify:**
- `src/contexts/ChatContext.tsx` — Wire `addMessage()` to call LLM instead of just storing; add streaming support
- Environment config (`.env`) for API keys + provider selection

**AI behavior to implement:**
- **Empathize & understand phase**: Ask clarifying questions about the role, urgency, approval needs, retention concerns
- **Plan generation**: AI decides appropriate sections based on conversation context. Creates Plan artifact, presents for approval.
- **Smart follow-up suggestions**: Proactively suggest related actions (review pay bands, check company culture, etc.)
- **Knowledge of employee data**: Reference Tony's team, org structure, talent pools from `src/data/employees.ts`

### 4. Notification Component (Human-in-the-Loop — Phase 1)
**New component:** `src/components/AINotification/`
**Description:** Desktop-style notifications (macOS-like) that appear when the AI needs human input or approval. This is Phase 1 of a larger human-in-the-loop system that will be built out robustly in a future phase.

**Phase 1 scope:**
- Desktop-style notification popups, slide in from top-right (like macOS)
- Triggered when AI needs: input, approval, or has a question
- Click notification → opens relevant chat conversation
- **Auto-dismiss after 10 seconds** with a manual dismiss (X) button
- Notifications can stack (newest on top) if multiple arrive

**Architectural requirement — works on any page:**
- The notification system must live at the **`AppLayout` level**, not inside any specific page
- The user is free to navigate anywhere in the app while the AI works (or simulates working) in the background
- Notifications appear regardless of what page the user is on — People, Hiring, Home, Settings, etc.
- This is core to the demo experience: the manager kicks off the AI, goes about their day, and gets notified when the AI needs them

**Not in Phase 1** (punt for future):
- Notification history/persistence (ephemeral only for now)
- Sound
- Notification preferences/settings
- **FUTURE**: This will expand into a comprehensive human-in-the-loop notification center with routing, escalation, and priority management.

### 5. "What's Currently Running" Home Widget (STUB)
**New component:** `src/components/AITasksWidget/`
**Location:** Added to Home page grid as a new Gridlet
**Description:** Minimal stub showing active AI tasks. A teammate is designing the home screen, so keep this very lightweight for now:
- Basic task list with name and status
- Link to open the relevant chat conversation
- **Will be replaced** when the home screen design is finalized

### 6. Data Enrichment (Enables All AI Features)
See the **Data Enrichment** section above for full details. Summary of new/modified data files:
- **`employees.ts`** — Add compensation, performance, skills to all 57 employees + add Tony (departed)
- **`compensationData.ts`** (NEW) — Pay bands and market benchmarks by role/location
- **`internalMobility.ts`** (NEW) — Internal candidate readiness, ripple effect scenarios
- **`backfillDemoData.ts`** (NEW) — Tony's exit context, project ownership, impact assessment
- **`candidates.ts`** — Enrich with skills, experience + add candidates matching Tony's role
- **`talentPools.ts`** — Add Technology pool, link to actual candidates
- **`jobOpenings.ts`** — Add descriptions, salary ranges, requirements

---

## Architecture Notes

### How Plan Artifacts Flow Through Existing System

```
1. AI generates plan → calls ArtifactContext.createArtifact('plan', conversationId, title)
2. AI message includes artifactId → InlineArtifactCard renders PlanInlineCard
3. User clicks "Review Plan" → navigates to /artifact/plan/:id
4. ArtifactWorkspace renders PlanFullView (editable sections, approve button)
5. User approves → PlanSettings.status = 'approved', triggers async execution
```

This follows the EXACT same pattern as chart/text/org-chart artifacts. No new plumbing needed.

### Fullscreen Chat with Artifact (Already Exists)

The expanded AIChatPanel already shows artifacts inline. The ArtifactWorkspace already provides the full editing experience with the ArtifactChatPanel sidebar. We just need to add plan-specific rendering to both.

### State Management
- **ArtifactContext** — already handles artifact CRUD, just needs plan defaults
- **ChatContext** — needs LLM integration wired into `addMessage()`
- **New: `AITaskContext`** — for tracking async AI execution tasks (notification state, progress, active tasks)

---

## Verification / Testing Plan

1. **Home chat input**: Type a message on home page → opens chat with that message
2. **AI conversation**: AI responds with empathetic, contextual questions about backfill
3. **Plan creation**: AI generates a Plan artifact → inline card appears in chat
4. **Plan inline card**: Shows plan title, status badge, section summary, "Review Plan" button
5. **Plan workspace**: Click "Review Plan" → `/artifact/plan/:id` → full editable view with sections and action items
6. **Plan approval**: Approve plan → status changes, AI begins execution phase
7. **Notifications**: AI sends notifications at checkpoints during execution
8. **Progress widget**: Home dashboard shows active AI task with status
9. **End-to-end**: Complete the full flow from "Tony left" to plan approved

---

## File Map (All paths relative to project root)

### Modify Existing — Data Enrichment
- `src/data/employees.ts` — Add compensation, performance, skills, tenure fields to interface + enrich all 57 employees + add Tony (departed)
- `src/data/talentPools.ts` — Add department links, candidate IDs, Technology pool
- `src/data/candidates.ts` — Add skills, experience, salary expectations, match scores + add 4-6 Tony-role candidates
- `src/data/jobOpenings.ts` — Add department, salary range, description, requirements, priority

### Modify Existing — Features
- `src/data/artifactData.ts` — Add `'plan'` type, `PlanSettings`, `PlanSection`, `ActionItem` interfaces, mock plan artifacts
- `src/data/chatData.ts` — Add backfill demo conversation with plan artifact reference
- `src/contexts/ArtifactContext.tsx` — Add plan defaults in `createArtifact()`, support `updateArtifactContent` for plans
- `src/contexts/ChatContext.tsx` — Wire LLM integration into message flow
- `src/components/InlineArtifactCard/InlineArtifactCard.tsx` — Add plan-specific inline rendering
- `src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx` — Add `'plan'` to type whitelist, render PlanFullView
- `src/pages/Home/Home.tsx` — Add chat input + AI tasks widget

### Create New — Data
- `src/data/compensationData.ts` — Pay bands, market benchmarks by role/location
- `src/data/internalMobility.ts` — Internal candidates, readiness levels, ripple effects
- `src/data/backfillDemoData.ts` — Tony-specific context (exit notes, project ownership, impact assessment)

### Create New — Features
- `src/components/PlanArtifact/PlanInlineCard.tsx` — Compact plan card for chat
- `src/components/PlanArtifact/PlanFullView.tsx` — Full plan editor for workspace
- `src/components/PlanArtifact/PlanSettingsToolbar.tsx` — Plan-specific toolbar
- `src/services/aiService.ts` — Abstract LLM client with provider interface
- `src/services/providers/openai.ts` — OpenAI provider implementation
- `src/services/providers/anthropic.ts` — Anthropic/Claude provider implementation
- `src/prompts/backfillPrompts.ts` — System prompts for backfill scenario
- `src/components/AINotification/AINotification.tsx` — Notification component
- `src/components/AITasksWidget/AITasksWidget.tsx` — Dashboard progress widget
- `src/contexts/AITaskContext.tsx` — Async task state management

---

## Build Sprints

### Dependency Graph

```
                    ┌──────────────┐
                    │ Sprint 1     │
                    │ (all parallel)│
                    └──────┬───────┘
                           │
        ┌──────────┬───────┼────────┬──────────┐
        ▼          ▼       ▼        ▼          ▼
   ┌─────────┐ ┌───────┐ ┌────┐ ┌──────┐ ┌────────┐
   │  Data   │ │ Plan  │ │Home│ │Notif.│ │Widget  │
   │Enrichmt.│ │Artifact│ │Chat│ │Comp. │ │(stub)  │
   │         │ │ Type  │ │Input│ │      │ │        │
   └────┬────┘ └───┬───┘ └──┬─┘ └──┬───┘ └───┬────┘
        │          │        │      │          │
        ▼          ▼        ▼      ▼          ▼
   ┌────────────────────────────────────────────────┐
   │ Sprint 2: LLM Integration                      │
   │ (needs data + plan artifact + chat input)       │
   └───────────────────────┬────────────────────────┘
                           │
                           ▼
   ┌────────────────────────────────────────────────┐
   │ Sprint 3: End-to-End Wiring & Polish            │
   │ (needs everything above)                        │
   └────────────────────────────────────────────────┘
```

### Sprint 1: Foundation (ALL PARALLEL — no dependencies on each other)

These 5 workstreams touch completely different files and can run simultaneously.

**1A. Data Enrichment** — Autonomy: HIGH
- Add compensation/performance/skills fields to Employee interface
- Enrich all 57 employees with realistic data (varied hire dates, salaries, ratings, skills)
- Add Tony Ramirez as departed employee
- Create `compensationData.ts`, `internalMobility.ts`, `backfillDemoData.ts`
- Enrich candidates with skills/experience, add 4-6 Tony-role candidates
- Add Technology talent pool, enrich job openings

**1B. Plan Artifact Type** — Autonomy: HIGH
- Add `'plan'` to ArtifactType union, PlanSettings/PlanSection/ActionItem interfaces
- Add default plan settings in createArtifact()
- Build PlanInlineCard, PlanFullView, PlanSettingsToolbar
- Add `'plan'` to ArtifactWorkspace type whitelist
- Add mock plan artifact to test with

**1C. Home Screen Chat Input** — Autonomy: HIGH
- Reuse org chart floating input bar on Home page
- Wire to ChatContext.createNewChat() + addMessage()
- On submit: open AI chat panel with new conversation

**1D. Notification Component** — Autonomy: HIGH
- macOS-style notifications, slide in top-right, stackable
- Mount at AppLayout level (works on any page)
- Auto-dismiss 10 seconds, manual X, click → opens chat
- Create AINotificationContext for app-wide state

**1E. "What's Running" Widget (STUB)** — Autonomy: HIGH
- Minimal Gridlet widget with hardcoded example tasks
- Will be replaced when home screen design arrives

### Sprint 2: LLM Integration

**Depends on:** Sprint 1A (data), 1B (plan artifact), 1C (chat input)

**2A. LLM Service Layer** — Autonomy: HIGH
- Abstract provider interface + OpenAI and Anthropic implementations
- Environment config for API keys + provider selection
- Streaming response support

**2B. System Prompts + Chat Wiring** — Autonomy: MEDIUM (needs prompt review)
- System prompt with AI persona, employee/comp/candidate data context
- Interview phase instructions, plan generation trigger, proactive suggestions
- Wire ChatContext.addMessage() to LLM service with streaming
- **Checkpoint: review system prompts after first draft**

### Sprint 3: End-to-End Wiring & Polish

**Depends on:** Everything above. **Collaborative sprint.**

**3A. Execution Simulation** — Simulate AI "working" with timed delays, fire notifications, update widget
**3B. End-to-End Testing** — Full flow from home input through execution
**3C. Polish** — Prompt tuning, transitions, error handling, demo-ready path

### Checkpoints (3 total)
1. **After Sprint 1:** Quick visual check — plan card, notification, chat input (~5 min)
2. **During Sprint 2:** Review system prompts (~15 min)
3. **Sprint 3:** End-to-end demo walkthrough (collaborative)

---

## Plan Artifact UX — Collapsed Chat View (Design Intent)

**Status:** In active design exploration (v3 mockups complete, v4 next).
**Mockup files:** `demos/plan-in-collapsed-chat.html` (v1), `demos/plan-in-collapsed-chat-v2.html` (v2), `demos/plan-in-collapsed-chat-v3.html` (v3)

### Core Mental Model

The Plan artifact in the collapsed chat is NOT a to-do list for the human. It's a **live dashboard of AI execution** with clear **review gates** where the AI pauses and asks for human sign-off.

The flow is:
1. **AI works autonomously** through plan items (queued → working → done)
2. **AI pauses at review gates** — these are checkpoints where it needs human input before continuing
3. **Human reviews AI output** (not "goes and does work") — e.g., reviews the job posting draft the AI wrote, reviews the candidate shortlist the AI prepared
4. **After review, AI continues** to the next batch of work

### Four Item States

| State | Visual | Meaning |
|-------|--------|---------|
| **Queued** | Grey dot/circle | AI hasn't started this yet |
| **Working** | Blue spinner | AI is currently executing this |
| **Done** | Green check, strikethrough text | AI completed this |
| **Needs Review** | Amber callout/gate | AI paused here — waiting for human to review output |

### Review Gates (Key Concept)

Review gates are **visually distinct from AI task items**. They are NOT another checkbox — they're a different kind of element entirely. Design principles:

- **Amber/yellow color** — warm, attention-getting, distinct from the blue/green/grey of AI states
- **Full-width break** — the gate cuts across the card/timeline to create a hard visual separation
- **Brief context label** — tells the human what they're reviewing (e.g., "Job posting draft, candidate shortlist") but doesn't tell them what to do. The human knows their job.
- **Not prescriptive** — the AI doesn't say "You must approve the job posting." It says "Here's the job posting draft for your review."

### Multiple Review Gates and Multiple Reviewers

Plans can have **multiple review gates** at different points in the workflow. The AI should do as much work as possible (or as much as is prudent) before hitting a review gate.

Different gates may require **different humans** to review:
- Manager reviews candidate shortlist
- HR Admin approves new job posting
- Finance approves salary range for new hire
- etc.

The plan edit mode (full artifact workspace) should allow humans to **insert additional review gates** at points where they want to be consulted. This is handled in the Plan workspace, not in the collapsed chat view.

### Design Direction (from 3 rounds of mockups)

**Round 1 (v1):** Explored 5 basic approaches — Checklist Card, Section Progress, Kanban Mini, Timeline, Inline Flat List. Favorites: B (Section Progress) and D (Timeline) for grouping/structure.

**Round 2 (v2):** Explored AI vs Human role distinction — Two-Zone Split, Sections+Chips, Timeline Handoffs, Summary Counts, Color-Bar Items. Favorites: B (Sections+Chips) and C (Timeline Handoffs) for clear role separation.

**Round 3 (v3):** Refined to "AI runs, human reviews" model with 4 states and review gates — Progress Pipeline, Sections+States, Timeline+Gates, Compact+Banner, Phase Blocks. **Winner: B (Sections + States)** — groups items by plan section, shows live status per item, amber review gate callout between sections, last section shows "After review" state.

### Why B (Sections + States) Won

- **Preserves plan structure** — sections like "Immediate Actions", "Hiring Strategy", "Retention" give the user a mental map of the plan
- **Per-section status badges** (Done / Working / After review) give quick section-level overview
- **Per-item status** (check / spinner / dot) shows granular progress within sections
- **Review gate as visual break** between sections — not another list item, but a callout that interrupts the flow
- **Scales to multiple workstreams** — different sections can be at different stages (one Done, one Working, one blocked on review)
- **Scales to multiple review gates** — can have a gate between any two sections

### Next Step (v4 — 3 more mockups)

Refine approach B with these considerations:
- Multiple review gates in one plan (not just one)
- Different reviewers for different gates (show who needs to review)
- The "After review" section should make clear that AI will resume automatically after review
- Consider: should the card show section headers even when all items in the section are done? (progressive collapse?)

### What This Means for Implementation

The current `PlanInlineCard.tsx` and `PlanFullView.tsx` from Sprint 1 need to be updated to match this new design. The data model may also need updates:

- `ActionItem.status` should support: `'queued' | 'working' | 'done' | 'needs_review'`
- Need a `ReviewGate` concept — either as a special ActionItem type or a separate field on PlanSection
- `ActionItem.reviewer` or `ReviewGate.reviewer` — who needs to review (role or person)
- Sections should show their aggregate status (computed from child items)
- The collapsed chat card should be a live-updating view, not static
