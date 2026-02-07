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

Derived from two sources:
1. **Top-down:** BambooHR API capability inventory (what the platform exposes)
2. **Bottom-up:** Mock data models in `src/data/` (what we can simulate)

### Category 1: Analysis & Insight (Read-only, high AI value)

These are the agent's bread and butter. Pure data work the agent can do instantly.

| Tool | What It Does | API Basis | Mock Data Source |
|------|-------------|-----------|-----------------|
| `analyze_compensation` | Compare employee comp to pay bands and market benchmarks. Flag below-midpoint, above-max, compa-ratio outliers. | Read compensation history, Read employee profiles | `compensationData.ts` (10 pay bands, 3 benchmarks), `employees.ts` (salary field) |
| `assess_promotion_readiness` | Score employees on promotion readiness using performance rating, tenure, comp ratio, and skills match. | Read employee profiles, Read performance reviews, Read compensation history | `employees.ts` (performanceRating, promotionReadiness, yearsOfExperience), `internalMobility.ts` (succession candidates) |
| `identify_flight_risks` | Flag employees with high flight risk based on comp position, tenure patterns, and performance. | Read employee profiles, Read job changes | `employees.ts` (flightRisk field), `compensationData.ts` |
| `analyze_org_impact` | Model the ripple effects of a departure or promotion on reporting structure, span of control, and team composition. | Read reporting structure, Read departments | `employees.ts` (reportsTo, directReports), `internalMobility.ts` (ripple effects) |
| `screen_talent_pool` | Search and rank talent pool candidates against role requirements (skills, experience, rating). | Read candidate profiles, Read hiring stages | `talentPools.ts`, `candidates.ts` (skills, yearsOfExperience, rating) |
| `generate_workforce_analytics` | Produce headcount, turnover, tenure, and compensation analytics by department, location, or level. | Read workforce analytics, Read standard reports | `analytics.ts`, `employees.ts` (full roster) |
| `analyze_time_off_patterns` | Surface PTO balance anomalies — employees who haven't taken time off, approaching caps, etc. | Read time-off balances, Read time-off policies | `inboxData.ts` (time-off requests), future: dedicated PTO data |
| `review_pending_approvals` | Summarize what's sitting in the user's inbox — time-off requests, expense approvals, onboarding tasks. | Read time-off requests, Read onboarding tasks | `inboxData.ts` (23 pending requests) |

### Category 2: Draft & Create (Write operations — always produce artifacts for review)

These tools create things. The agent drafts, the user approves.

| Tool | What It Does | API Basis | Mock Data Source |
|------|-------------|-----------|-----------------|
| `create_job_posting` | Draft a job requisition pre-filled from role data (title, department, salary range, description). | Create job openings | `jobOpenings.ts` (existing openings as templates), `compensationData.ts` (salary ranges) |
| `draft_candidate_outreach` | Generate personalized outreach messages for talent pool candidates based on their profile and the role. | Create candidates, Read candidate profiles | `candidates.ts`, `talentPools.ts` |
| `generate_report` | Create a formatted report artifact (chart, table, or text) from analytical results. | Export report data | `artifactData.ts` (artifact system) |
| `draft_document` | Generate text documents — offer summaries, job descriptions, onboarding checklists, etc. | Upload employee documents | `files.ts` (document types) |
| `create_onboarding_checklist` | Generate an onboarding task list for a new hire based on role and department. | Assign onboarding tasks | `inboxData.ts` (onboarding category) |

### Category 3: Workflow Actions (Move records through stages — review gates required)

These tools take action in workflows. Always gated by user review.

| Tool | What It Does | API Basis | Mock Data Source |
|------|-------------|-----------|-----------------|
| `advance_candidate` | Move a candidate to the next hiring stage after user approval. | Move candidates through stages | `jobCandidates.ts` (candidate statuses) |
| `submit_time_off_request` | Create a time-off request on behalf of or as recommended to an employee. | Create time-off requests | `inboxData.ts` |
| `update_employee_record` | Update specific employee fields (title, department, location, compensation) after user approval. | Update employee fields | `employees.ts` |
| `approve_request` | Process an approval (time-off, expense, etc.) after user confirmation. | Approve/deny time-off requests | `inboxData.ts` |

### Category 4: Notifications & Communication

| Tool | What It Does | API Basis | Mock Data Source |
|------|-------------|-----------|-----------------|
| `send_reminder` | Trigger a reminder notification for overdue items (timesheets, approvals, documents). | Trigger workflow notifications | `inboxData.ts`, simulated in `AutomationsCard` |
| `notify_stakeholder` | Alert a specific person about a plan outcome or action needed. | Webhooks / workflow notifications | `chatData.ts` (notification system) |

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
  Review Gate: "Confirm internal candidate direction"

Section: "External Hiring Pipeline"
  Tool: create_job_posting(template="Senior Software Engineer", salary_range=PayBand)
  Tool: screen_talent_pool(pool="Technology", requirements=role_requirements)
  Tool: draft_candidate_outreach(candidates=top_ranked, role=posting)
  Review Gate: "Approve job posting and outreach before publishing"
```

Each action item has a 1:1 relationship with a tool call. The AI can describe what it will find or produce, but the action itself is always a defined capability.

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
| `employees.ts` | analyze_compensation, assess_promotion_readiness, identify_flight_risks, analyze_org_impact, update_employee_record |
| `compensationData.ts` | analyze_compensation (pay bands + benchmarks) |
| `internalMobility.ts` | assess_promotion_readiness, analyze_org_impact (succession candidates + ripple effects) |
| `jobOpenings.ts` | create_job_posting (templates + existing openings) |
| `candidates.ts` + `talentPools.ts` | screen_talent_pool, draft_candidate_outreach, advance_candidate |
| `jobCandidates.ts` | advance_candidate (pipeline stages) |
| `inboxData.ts` | review_pending_approvals, approve_request, submit_time_off_request |
| `backfillDemoData.ts` | analyze_org_impact (departure context + scenario analysis) |
| `analytics.ts` | generate_workforce_analytics |
| `artifactData.ts` | generate_report, draft_document (artifact creation) |
| `payrollData.ts` | Payroll-related analysis (future) |
| `files.ts` | draft_document (document templates) |

---

## Open Questions

1. **Tool granularity:** Are tools like `analyze_compensation` too coarse? Should we break them into `get_pay_band`, `get_market_benchmark`, `calculate_compa_ratio` as separate tools?
2. **Review gate placement:** Should every write operation have a review gate, or can some low-risk actions (like generating a report) execute without approval?
3. **Plan generation:** Do we constrain the LLM to pick from a fixed tool set (structured tool use), or let it describe actions in natural language that we map to tools?
4. **Artifact output:** When a tool runs, what artifact type does it produce? (e.g., `analyze_compensation` -> chart artifact, `create_job_posting` -> text artifact)
5. **Mock data gaps:** We have no dedicated PTO balance data, no performance review history, and no document templates. Do we need to add these to `src/data/`?
6. **Error simulation:** Should the agent ever fail? (e.g., "Insufficient permissions to access compensation data for this employee")

---

## Rejected Approaches

- **Consultant mode plans** — Plans that suggest meetings, conversations, and organizational changes the AI can't execute. This was the v1 approach and felt hollow.
- **Unconstrained LLM output** — Letting the LLM generate any action item without mapping to a tool registry. Produces impressive-sounding but unexecutable plans.
- **Top-down only** — Defining tools purely from the API spec without checking if we have mock data to simulate them. Leads to tools we can't demo.

---

## Next Steps

1. Rewrite the Tony Ramirez backfill plan mock data to use tool-based action items
2. Define tool schemas in the system prompt
3. Build simulated tool executors
4. Update plan execution engine to surface tool outputs as artifacts
5. Test end-to-end: user asks for backfill plan -> LLM generates tool-based plan -> execution simulates tools -> user reviews at gates
