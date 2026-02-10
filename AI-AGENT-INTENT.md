# AI Agent Design Intent

## Core Principle

**Every action item in a plan is a tool call.** If the AI agent can't execute it through a defined capability, it doesn't belong in a plan. The agent operates FOR and ON BEHALF OF the user — it is an operator with defined capabilities, not a consultant offering advice.

The agent does not:
- Suggest meetings to schedule
- Recommend conversations to have
- Propose organizational changes that require human judgment
- Cosplay as a strategy consultant

The agent does:
- Pull data and run analysis
- Draft and create records (job postings, candidate entries, documents)
- Screen and rank based on structured data
- Surface risks and anomalies
- Move records through workflows (with review gates)
- Generate artifacts (charts, reports, text summaries)

---

## The Tool Registry

Derived from three sources:
1. **Top-down:** BambooHR API capability inventory (what the platform exposes)
2. **Bottom-up:** Mock data models in `src/data/` (what we can simulate)
3. **Validation:** 5-strategy audit (app page walk, API docs, feature pages, data model gap analysis, HR practitioner workflows)

### Registry Status Key
- **LIVE** — Mock data exists, ready to simulate
- **PLANNED** — High-value tool, needs mock data added to `src/data/`
- **FUTURE** — Worth building eventually, lower demo priority
- **ADMIN** — System configuration tools for workflow builders (future product phase)

---

### Category 1: Analysis & Insight (Read-only, high AI value)

These are the agent's bread and butter. Pure data work the agent can do instantly.

| Tool | What It Does | Status | Mock Data Source |
|------|-------------|--------|-----------------|
| `analyze_compensation` | Compare employee comp to pay bands and market benchmarks. Flag below-midpoint, above-max, compa-ratio outliers. | LIVE | `compensationData.ts` (10 pay bands, 3 benchmarks), `employees.ts` (salary field) |
| `assess_promotion_readiness` | Score employees on promotion readiness using performance rating, tenure, comp ratio, and skills match. | LIVE | `employees.ts` (performanceRating, promotionReadiness, yearsOfExperience), `internalMobility.ts` (succession candidates) |
| `identify_flight_risks` | Flag employees with high flight risk based on comp position, tenure patterns, and performance. | LIVE | `employees.ts` (flightRisk field), `compensationData.ts` |
| `analyze_org_impact` | Model the ripple effects of a departure or promotion on reporting structure, span of control, and team composition. | LIVE | `employees.ts` (reportsTo, directReports), `internalMobility.ts` (ripple effects), `backfillDemoData.ts` |
| `screen_talent_pool` | Search and rank talent pool candidates against role requirements (skills, experience, rating). | LIVE | `talentPools.ts`, `candidates.ts` (skills, yearsOfExperience, rating) |
| `generate_workforce_analytics` | Produce headcount, turnover, tenure, and compensation analytics by department, location, or level. Does NOT include workload, project assignments, hours worked, or capacity data — BambooHR is not a project management tool. | LIVE | `analytics.ts`, `employees.ts` (full roster) |
| `analyze_time_off_patterns` | Surface PTO balance anomalies — employees who haven't taken time off, approaching caps, etc. | LIVE | `inboxData.ts` (time-off requests) |
| `review_pending_approvals` | Summarize what's sitting in the user's inbox — time-off requests, expense approvals, onboarding tasks. | LIVE | `inboxData.ts` (23 pending requests) |
| `get_whos_out` | Show who is currently out or scheduled to be out. Critical for workload planning and interim coverage during backfill. | PLANNED | Needs: `whosOut.ts` (calendar view of current/upcoming absences) |
| `analyze_performance_reviews` | Pull and summarize performance review data — ratings over time, peer feedback themes, manager assessments. Distinct from `assess_promotion_readiness` which is a composite score. | PLANNED | Needs: `performanceReviews.ts` (review history, 360 feedback, review cycles) |
| `analyze_training_gaps` | Identify employees missing required training, expiring certifications, or training needed for a role change/promotion. | PLANNED | Needs: `trainingRecords.ts` (training completions, certifications, expiry dates) |
| `analyze_hiring_velocity` | Pipeline metrics — time-in-stage, conversion rates, days-to-fill, candidate flow trends. | LIVE | `jobCandidates.ts` (appliedDate, status, statusTimestamp), `jobOpenings.ts` (createdOn) |
| `check_compliance_status` | Audit compliance posture — overdue training, expiring work authorizations, missing required documents, I-9 reverification. | PLANNED | Needs: `trainingRecords.ts`, `currentEmployee.ts` (passports[].expiry) |
| `surface_payroll_exceptions` | Flag pre-payroll anomalies — missing timesheets, overtime spikes, salary changes pending, deduction mismatches. | PLANNED | `payrollData.ts` (existing), needs enrichment with exception detail |
| `analyze_engagement_scores` | Trend eNPS over time, segment by department/location, surface open-ended feedback themes. | FUTURE | Needs: `surveyData.ts` (eNPS scores, survey responses, engagement metrics) |
| `analyze_benefits_enrollment` | Show enrollment rates, identify under-enrolled populations, flag employees with qualifying life events. | FUTURE | Needs: `benefitsData.ts` (plans, enrollment, dependents, deductions) |

---

### Category 2: Draft & Create (Write operations — always produce artifacts for review)

These tools create things. The agent drafts, the user approves.

| Tool | What It Does | Status | Mock Data Source |
|------|-------------|--------|-----------------|
| `create_job_posting` | Draft a job requisition pre-filled from role data (title, department, salary range, description). | LIVE | `jobOpenings.ts` (existing openings as templates), `compensationData.ts` (salary ranges) |
| `draft_candidate_outreach` | Generate personalized outreach messages for talent pool candidates based on their profile and the role. | LIVE | `candidates.ts`, `talentPools.ts` |
| `generate_report` | Create a formatted report artifact (chart, table, or text) from analytical results. | LIVE | `artifactData.ts` (artifact system) |
| `draft_document` | Generate text documents — offer summaries, job descriptions, onboarding checklists, etc. | LIVE | `files.ts` (document types) |
| `create_onboarding_checklist` | Generate an onboarding task list for a new hire based on role and department. | LIVE | `inboxData.ts` (onboarding category) |
| `propose_compensation_change` | Draft a compensation adjustment proposal (amount, rationale, equity analysis) for manager review. Write companion to `analyze_compensation`. | LIVE | `employees.ts` (salary), `compensationData.ts` (pay bands, benchmarks) |
| `draft_development_plan` | Generate a personalized development plan for an employee based on their promotion readiness gaps, development areas, and target role. | LIVE | `internalMobility.ts` (developmentAreas[], strengthAreas[]), `employees.ts` |

---

### Category 3: Workflow Actions (Move records through stages — review gates required)

These tools take action in workflows. Always gated by user review.

| Tool | What It Does | Status | Mock Data Source |
|------|-------------|--------|-----------------|
| `advance_candidate` | Move a candidate to the next hiring stage after user approval. | LIVE | `jobCandidates.ts` (candidate statuses) |
| `submit_time_off_request` | Create a time-off request on behalf of or as recommended to an employee. | LIVE | `inboxData.ts` |
| `update_employee_record` | Update specific employee fields (title, department, location, compensation) after user approval. | LIVE | `employees.ts` |
| `approve_request` | Process an approval (time-off, expense, etc.) after user confirmation. | LIVE | `inboxData.ts` |
| `track_onboarding_progress` | Show which new hires have completed which onboarding steps. Surface blockers. | PLANNED | Needs: onboarding task completion data |
| `trigger_offboarding` | Initiate offboarding workflow — exit interview scheduling, equipment return, access revocation, COBRA notification, final paycheck calculation. | FUTURE | Needs: offboarding workflow data model |

---

### Category 4: Notifications & Communication

| Tool | What It Does | Status | Mock Data Source |
|------|-------------|--------|-----------------|
| `send_reminder` | Trigger a reminder notification for overdue items (timesheets, approvals, documents). | LIVE | `inboxData.ts`, simulated in `AutomationsCard` |
| `notify_stakeholder` | Alert a specific person about a plan outcome or action needed. | LIVE | `chatData.ts` (notification system) |

---

### Category 5: Admin Configuration (Policy & system setup — for workflow builders)

These tools configure the system itself. Not part of day-to-day agent plans — they're the building blocks for admins who create automated workflows for their business. A future phase of this product.

| Tool | What It Does | Status | Mock Data Source |
|------|-------------|--------|-----------------|
| `manage_job_architecture` | CRUD on pay bands, job levels (P1-P6, M1-M4), career ladders. Define the compensation and leveling structure. | ADMIN | `compensationData.ts` (pay bands), needs: job levels data |
| `benchmark_against_peers` | Compare aggregate metrics (comp, turnover, headcount, time-to-fill) against anonymized BambooHR customer data by industry, size, and region. BambooHR's unique data moat. | ADMIN | Needs: `peerBenchmarks.ts` (anonymized aggregate data) |
| `manage_comp_cycle` | Create and run compensation planning cycles — set budgets, generate manager worksheets, route for multi-level approval, track completion. | ADMIN | Needs: `compCycles.ts` (cycle config, budgets, worksheets) |
| `configure_pto_policy` | Create/edit PTO accrual rules, caps, carryover policies, blackout dates, approval chains. | ADMIN | Needs: `ptoPolicies.ts` (policy definitions) |
| `configure_payroll_rules` | Set up tax withholding rules, deduction schedules, pay frequencies, garnishment handling. | ADMIN | `payrollData.ts` (existing), needs: rules/config enrichment |

---

## Tool Count Summary

| Status | Count | Description |
|--------|-------|-------------|
| LIVE | 21 | Mock data exists, ready to simulate |
| PLANNED | 6 | High-value, needs new mock data files |
| FUTURE | 3 | Lower priority, build eventually |
| ADMIN | 5 | System config for workflow builders (future phase) |
| **Total** | **35** | |

---

## What the Agent Explicitly Cannot Do

These are hard constraints — not just things we haven't built yet, but things the agent **must never claim to do**.

### Cannot Make Decisions
- Hire or reject candidates
- Approve or deny promotions
- Set compensation amounts
- Terminate employment
- Make legal, tax, or compliance judgments

### Cannot Execute Human Actions (Yet — Out of Scope for Now)
- Schedule meetings or send calendar invites
- Send emails or Slack messages on behalf of the user
- Have conversations with employees
- Conduct interviews
- Negotiate offers

> **Future scope:** G Suite integrations could enable the agent to schedule meetings, draft/send emails, and send Slack messages on behalf of the user. When that lands, these move from "cannot do" to gated tool calls (e.g., `schedule_meeting`, `send_email`, `send_slack_message`). For now, the agent should not suggest these actions as plan items.

### Cannot Bypass the System
- Override permissions or access controls
- Invent or infer missing employee data
- Act without user context
- Provide advice that replaces HR, legal, or tax professionals

### Cannot Predict Unpredictable Things
- How a meeting will go
- Whether someone will accept an offer
- How team morale will shift
- Timeline for human decision-making processes

---

## How Plans Map to Tool Use

A plan is a sequence of tool calls organized into sections with review gates.

### Old Pattern (consultant mode — REJECTED)
```
Section: "Immediate Actions"
  - "Redistribute Tony's active projects among team members"  <-- HOW?
  - "Complete knowledge transfer documentation"                <-- WHO DOES THIS?
  - "Set up interim code review process"                       <-- MEETING-DEPENDENT
```

### New Pattern (operator mode — CORRECT)
```
Section: "Compensation & Risk Analysis"
  Tool: analyze_compensation(department="Technology", benchmark=true)
  Tool: identify_flight_risks(team=Uma Patel's direct reports)
  Review Gate: "Review findings with Uma Patel before proceeding"

Section: "Internal Candidate Assessment"
  Tool: assess_promotion_readiness(candidates=[Daniel Kim, Rachel Green])
  Tool: analyze_org_impact(scenario="promote Daniel Kim to Senior SE")
  Tool: draft_development_plan(employee=Daniel Kim, target_role="Senior SE")
  Review Gate: "Confirm internal candidate direction"

Section: "External Hiring Pipeline"
  Tool: create_job_posting(template="Senior Software Engineer", salary_range=PayBand)
  Tool: screen_talent_pool(pool="Technology", requirements=role_requirements)
  Tool: draft_candidate_outreach(candidates=top_ranked, role=posting)
  Review Gate: "Approve job posting and outreach before publishing"
```

Each action item has a 1:1 relationship with a tool call. The AI can describe what it will find or produce, but the action itself is always a defined capability.

---

## Agent Architecture

### Agent Modes

The LLM is not just a plan generator. It's a conversational agent with multiple modes:

1. **Conversational Q&A** — Answer questions about the org, employees, policies. "Who reports to Uma?" / "What's Daniel Kim's salary?" / "How many open reqs do we have?"
2. **Insight surfacing** — Proactively reason about data. "Turnover in Engineering is 2x the company average" / "Three employees haven't taken PTO in 6 months"
3. **Plan generation** — When a situation calls for structured action, propose a tool-based plan. "Tony Ramirez is leaving — here's a backfill plan."
4. **Plan execution** — Run the plan step by step, pausing at review gates.

The agent should fluidly move between modes. A conversation might start with Q&A ("Tell me about Tony's team"), shift to insight ("I notice two flight risks on that team"), and escalate to a plan ("Want me to build a retention and backfill plan?").

### System Prompt Design

The system prompt is a **source-of-truth markdown file** (`AGENT-SYSTEM-PROMPT.md`) whose contents get injected into the LLM's system message at runtime:

```ts
const systemPrompt = fs.readFileSync('AGENT-SYSTEM-PROMPT.md', 'utf-8');
const response = await anthropic.messages.create({
  system: systemPrompt,
  messages: conversationHistory,
});
```

The system prompt needs three layers:

#### Layer 1: Persona & Constraints
- Who the agent is (HR operations assistant for BambooHR)
- What it can and cannot do (operator, not consultant — reference the constraints above)
- Voice/tone: competent, direct, data-first. Not sycophantic, not robotic.

#### Layer 2: Org Context
- Employee roster summary (names, titles, departments, key metrics)
- Org structure (reporting relationships, team sizes)
- Current state (open reqs, pending approvals, recent departures)
- Enough data for the LLM to answer questions and reason about the org without tool calls

#### Layer 3: Tool Definitions
- Concise tool schemas (name, description, parameters, return type)
- NOT the full intent doc — just what the LLM needs to generate valid tool calls
- Plan examples showing operator pattern vs consultant anti-pattern

### Context Strategy

**Decision: Lean prompt + tool-based retrieval.** The system prompt contains persona, constraints, and tool schemas only (~2K tokens). No org data baked in. When the LLM needs employee data, org structure, or metrics, it calls tools to fetch them. This scales to any org size and keeps the prompt stable across customers.

### Tool Composition

Tools chain together — the output of one informs the input of the next. The LLM figures out the chaining based on context, not explicit wiring.

Examples:
- `analyze_compensation` finds Daniel Kim is 15% below midpoint → `propose_compensation_change` drafts an adjustment
- `assess_promotion_readiness` scores Rachel Green as "ready now" → `draft_development_plan` creates her transition plan
- `screen_talent_pool` ranks 5 candidates → `draft_candidate_outreach` generates personalized messages for the top 3
- `analyze_org_impact` shows team is at risk → `identify_flight_risks` + `analyze_compensation` dig into why

The plan generation prompt should include examples of these chains so the LLM learns the composition patterns.

### Review Gate Design

When the agent pauses at a review gate:
- **Summary of work done** — What tools ran, key findings
- **Decision needed** — What the user needs to approve or decide
- **Options presented** — If applicable, choices with tradeoffs
- **One-click actions** — "Approve and continue" / "Edit plan" / "Stop here"

Review gates are NOT just confirmation dialogs. They're decision points where the agent presents its analysis and the human applies judgment.

### Simulation vs Production

The architecture is designed so that **only the tool executors change** when moving from demo to production:

| Layer | Demo | Production |
|-------|------|------------|
| System prompt | Same | Same |
| Plan generation | Same LLM, same tool schemas | Same |
| Tool execution | Read from `src/data/*.ts` mock files | Call BambooHR REST API |
| Artifact rendering | Same React components | Same |
| Review gates | Same UX | Same |

This means everything we build for the demo — plan generation, plan rendering, review gate UX — carries forward to production with zero changes.

---

## Demo Simulation Strategy

We are NOT connected to a live BambooHR instance. We simulate tool execution using mock data.

### How It Works
1. **System prompt** tells the LLM what tools are available (tool registry above)
2. **LLM generates plans** using only available tools as action items
3. **Plan execution engine** simulates tool calls by:
   - Reading from `src/data/` files (the "API responses")
   - Generating artifacts (charts, text, reports) as "output"
   - Creating realistic delays (3-5 seconds per action)
   - Pausing at review gates for user approval
4. **Results surface** in the plan card, AutomationsCard, and AttentionCard

### What We Need to Build
- **Tool definitions** in the system prompt (name, description, parameters, what it returns)
- **Simulated tool executors** that map tool calls to mock data reads + artifact generation
- **Plan templates** that demonstrate realistic tool-use-based plans (replace current consultant-mode mock)

---

## Mapping to Existing Mock Data

| Mock Data File | Supports Tools |
|---|---|
| `employees.ts` | analyze_compensation, assess_promotion_readiness, identify_flight_risks, analyze_org_impact, update_employee_record, propose_compensation_change, draft_development_plan |
| `compensationData.ts` | analyze_compensation, propose_compensation_change (pay bands + benchmarks) |
| `internalMobility.ts` | assess_promotion_readiness, analyze_org_impact, draft_development_plan (succession candidates + ripple effects + development areas) |
| `jobOpenings.ts` | create_job_posting, analyze_hiring_velocity (templates + existing openings) |
| `candidates.ts` + `talentPools.ts` | screen_talent_pool, draft_candidate_outreach, advance_candidate |
| `jobCandidates.ts` | advance_candidate, analyze_hiring_velocity (pipeline stages + timestamps) |
| `inboxData.ts` | review_pending_approvals, approve_request, submit_time_off_request, analyze_time_off_patterns |
| `backfillDemoData.ts` | analyze_org_impact (departure context + scenario analysis) |
| `analytics.ts` | generate_workforce_analytics |
| `artifactData.ts` | generate_report, draft_document (artifact creation) |
| `payrollData.ts` | surface_payroll_exceptions (needs enrichment) |
| `files.ts` | draft_document (document templates) |
| `currentEmployee.ts` | check_compliance_status (passport/visa expiry) |

### New Mock Data Files Needed (for PLANNED tools)

| File | Tools It Enables | Priority |
|------|-----------------|----------|
| `performanceReviews.ts` | analyze_performance_reviews | High — needed for credible promotion/backfill analysis |
| `trainingRecords.ts` | analyze_training_gaps, check_compliance_status | High — compliance and promotion workflows |
| `whosOut.ts` | get_whos_out | Medium — backfill coverage planning |
| `surveyData.ts` | analyze_engagement_scores | Low — engagement analysis |
| `benefitsData.ts` | analyze_benefits_enrollment | Low — benefits workflows |

---

## BambooHR Product Coverage Map

Cross-referencing the 12 BambooHR product areas against our tool registry:

| BambooHR Product Area | Coverage | Key Tools |
|---|---|---|
| HR Data & Reporting | Good | generate_workforce_analytics, generate_report, update_employee_record |
| Compensation | Good | analyze_compensation, propose_compensation_change |
| Applicant Tracking (ATS) | Good | create_job_posting, screen_talent_pool, advance_candidate, draft_candidate_outreach, analyze_hiring_velocity |
| Time & Attendance | Partial | analyze_time_off_patterns, submit_time_off_request, get_whos_out (PLANNED) |
| Onboarding | Partial | create_onboarding_checklist, track_onboarding_progress (PLANNED) |
| Performance Management | Partial | assess_promotion_readiness, analyze_performance_reviews (PLANNED) |
| Payroll | Thin | surface_payroll_exceptions (PLANNED) |
| Compliance | Thin | check_compliance_status (PLANNED) |
| Benefits Administration | Future | analyze_benefits_enrollment (FUTURE) |
| Employee Experience | Future | analyze_engagement_scores (FUTURE) |
| Global Employment | Not planned | Out of demo scope |
| Integrations | Not planned | Out of demo scope |

---

## Research Methodology

Tool registry validated through 5 strategies (Jan 2026):

1. **App page walk** — Read every page component in our app, mapped tool coverage per page. Found 5 pages with zero AI integration.
2. **BambooHR API docs** — Audited all REST API endpoint categories against tool registry. Found 8 high-value gaps.
3. **BambooHR feature pages** — Scraped 12 product area pages. Found 4 completely missing categories (Payroll, Benefits, Employee Experience, Compliance).
4. **Data model gap analysis** — Field-by-field audit of all 15 `src/data/` files. 65% coverage, 15+ high-value unmapped fields.
5. **HR practitioner workflows** — Cross-referenced daily HR manager tasks (limited by web access constraints).

---

## Open Questions

1. **Tool granularity:** Are tools like `analyze_compensation` too coarse? Should we break them into `get_pay_band`, `get_market_benchmark`, `calculate_compa_ratio` as separate tools?
2. **Review gate placement:** Should every write operation have a review gate, or can some low-risk actions (like generating a report) execute without approval?
3. **Plan generation:** Do we constrain the LLM to pick from a fixed tool set (structured tool use), or let it describe actions in natural language that we map to tools?
4. **Artifact output:** When a tool runs, what artifact type does it produce? (e.g., `analyze_compensation` -> chart artifact, `create_job_posting` -> text artifact)
5. **Error simulation:** Should the agent ever fail? (e.g., "Insufficient permissions to access compensation data for this employee")

---

## Rejected Approaches

- **Consultant mode plans** — Plans that suggest meetings, conversations, and organizational changes the AI can't execute. This was the v1 approach and felt hollow.
- **Unconstrained LLM output** — Letting the LLM generate any action item without mapping to a tool registry. Produces impressive-sounding but unexecutable plans.
- **Top-down only** — Defining tools purely from the API spec without checking if we have mock data to simulate them. Leads to tools we can't demo.
- **Over-scoping the registry** — 30+ possible tools identified in research. Pruned to 31 (22 LIVE + 6 PLANNED + 3 FUTURE) to keep the demo focused. Many Tier 3 tools (diversity analysis, exit trend analysis, competitor recruiting analysis) deferred until core workflows are solid.

---

## Next Steps

1. Rewrite the Tony Ramirez backfill plan mock data to use tool-based action items
2. Define tool schemas in the system prompt (name, description, parameters, return type)
3. Build simulated tool executors for LIVE tools
4. Add mock data files for PLANNED tools (performanceReviews.ts, trainingRecords.ts, whosOut.ts)
5. Update plan execution engine to surface tool outputs as artifacts
6. Test end-to-end: user asks for backfill plan -> LLM generates tool-based plan -> execution simulates tools -> user reviews at gates
