# BHR UI Template — Claude Code Project Guide

## Project Overview
AI-first BambooHR HRIS demo application. Current focus: **EE Backfill Demo** — an AI-powered employee backfill planning workflow.

- **Branch:** `ee-backfill-demo`
- **PRD:** `PRD-ee-backfill-demo.md` (includes sprint plan + Plan artifact design intent at line ~681)
- **Tech:** React + TypeScript + Vite, CSS variables for theming

## Sprint Status
- **Sprint 1 (Foundation):** Complete — data enrichment, plan artifact type, home chat input, notifications, widget stub
- **Sprint 2 (LLM Integration):** Complete — LLM service layer, system prompts, chat wiring with GPT-5 Mini
- **Sprint 3 (E2E Wiring):** Complete — plan execution engine, review gates, live widget updates

## Key Design Decisions
- **Home Page Redesign:** See PRD section "Plan Artifact UX" (~line 681). Key components: `AutomationsCard`, `AttentionCard`. Read PRD before modifying these.
- **Plan Artifact UX (v8 final):** See PRD section "Plan Artifact UX — Collapsed Chat View" (~line 681). Mockups: `demos/plan-in-collapsed-chat-v*.html`. Reference screenshots: `demos/Plan Screenshots/`. Read PRD before modifying plan rendering.
- **What's Pending Workshopping:** Expansion content detail, "View All" link destinations, empty states.

## Design Tokens
- Brand green: `#2e7918` (`--color-primary`)
- Done/completed: `#059669` (emerald)
- Working/active: `#2563EB` (blue)
- Queued/future: `#A8A29E` (warm grey)
- Amber (awaiting action): `#D97706`
- Purple (proposed): `#7C3AED`
- Font: Inter

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
