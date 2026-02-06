# Screenshot Audit Results

**Audit Date:** 2026-02-06
**Total files reviewed:** 80 (78 images + 2 video files)
**Files kept:** 28 (35%)
**Files deleted:** 52 (65%)
**Usefulness rate: 35%**

---

## Kept Files (28) -- With Descriptions

### Cursor Plan Mode (9 files)
| File | Description |
|------|-------------|
| `claude-artifacts-output-demo.png` | **MISLABELED** -- Actually shows Cursor Docs page for Plan Mode, explaining how Plan Mode works with step-by-step workflow (Ask, Plan, Build). Excellent reference for plan documentation UX. |
| `copilot-plan-mode-demo.png` | Cursor Plan Mode in action: shows a "Prepared plan" card with title "Add GitHub OAuth Authentication", 3 todos as a checklist, file reference (.plan.md), "Read detailed plan" link, and a "Build" button. Core plan artifact UI reference. |
| `cursor-changelog-2.2-debug-dropdown.jpg` | Cursor mode selector dropdown showing Agent/Plan/Debug/Ask modes with icons. Shows how mode switching is presented in the UI. |
| `cursor-plan-mode-blog-viewport.png` | Zapier blog about Claude Artifacts -- actually captures Canvas-related content. Borderline, but shows the concept of artifact-based editing. Kept for the split-panel paradigm reference. |
| `cursor-plan-mode-checklist-todos.png` | **HIGH VALUE** -- Clean screenshot of Cursor's plan checklist: "Todos (4/6)" with green checkmarks for completed items, blue spinner for in-progress, and empty circles for pending. Shows "+162 -12" file diff count and Keep/Undo buttons. |
| `cursor-plan-mode-docs.png` | Linear Plan page showing project workflows, status updates, Slack thread integration, and initiatives section. Shows project management UI patterns. |
| `cursor-plan-mode-full.png` | Cursor blog post "Introducing Plan Mode" -- shows the plan UI with an OAuth implementation checklist inside the editor, plus the blog post text explaining how to use Plan Mode. |
| `cursor-plan-mode-hero-image.png` | **HIGH VALUE** -- Clean Cursor Plan Mode UI: shows the prepared plan card with title, .plan.md file, todo checklist (3 items), and Build button. Cropped product screenshot, excellent reference. |
| `cursor-plan-mode-hero-official.png` | Tighter crop of the same Cursor Plan Mode card -- plan title, file link, 3 todos, and Build button. Slightly different framing. |
| `cursor-plan-mode-implementation.png` | **HIGH VALUE** -- Full Cursor Plan Mode in context: split view showing the plan markdown document on the left (with structured headings, numbered steps, code references) and the plan card on the right (with 7 todos, progress, View Plan link, and Build button). Shows the dual-pane plan editing experience. |

### Devin (2 files)
| File | Description |
|------|-------------|
| `devin-progress-tab-expanded.png` | **HIGH VALUE** -- Devin's session view with Progress tab selected, showing a timeline of execution steps (git commands, npm runs, file edits) on the left, and a Browser preview on the right. Shows step-by-step execution logging with expandable items and progress indicators (24/26, 25/26). |
| `devin-session-tools-docs.png` | Devin documentation page explaining Session Tools (Progress Tab, Shell & Terminal, IDE, Browser). Shows the documentation for how Devin structures task execution visibility. |

### GitHub Copilot Workspace (2 files)
| File | Description |
|------|-------------|
| `github-copilot-workspace-full-page.png` | **HIGH VALUE** -- Full Copilot Workspace landing page showing the workspace UI with a plan-like interface: task specification panel on the left, code implementation panel on the right, in a purple/blue themed environment. Shows the plan-to-implementation flow. |
| `github-copilot-workspace-hero-view.png` | Linear Plan page (mislabeled) showing "Manage projects end-to-end" with Feature specs document UI, milestones with dependencies, and text-to-issue commands. Shows how collaborative planning docs look in a project management context. |

### Linear Plan & Project Management (15 files)
| File | Description |
|------|-------------|
| `linear-build-hero.png` | Linear's issue tracking view showing "Todo" and "In Progress" columns with issue cards (engineering tickets with labels like Mobile, Bug, Performance, Assistant). Clean kanban-style task tracking UI. |
| `linear-cycles.png` | Linear's issue creation UI with detailed form fields, plus list/board view toggle, grouping/ordering filters. Shows the issue management and view customization patterns. |
| `linear-initiatives.png` | **HIGH VALUE** -- Linear's Initiatives table view with columns: Name, Target, Initiative Health (On track/At risk/Off track), Projects count, Active Progress. Tabbed filter bar (Active/Planned/Completed). Strategic planning dashboard. |
| `linear-issue-tracking.png` | Linear issue tracking page with Todo/In Progress columns, issue cards with metadata, and testimonial. Slightly different view from build-hero, shows the two-column layout more clearly. |
| `linear-issue-views.png` | Linear issue creation form (detailed) with template support, rich-text editor, labels, estimates, and custom issue attributes. Shows how structured task creation works. |
| `linear-milestones.png` | **HIGH VALUE** -- Linear project detail view with "Split fares" project showing: Properties panel, In Progress status, team members, timeline (May-Q4 2024), Initiatives link, Dependencies, Docs & links (designs, meeting notes, #beta-customers), Requirements section, and Milestones (Proof-of-concept, Internal beta) with dates. Complete project planning artifact. |
| `linear-plan-hero.png` | **HIGH VALUE** -- Linear Plan page showing "Manage projects end-to-end" with Feature specs UI (collaborative editing, project templates, text-to-issue commands) and milestone/dependency views. Key reference for plan artifact structure. |
| `linear-plan-hero2.png` | Linear Plan hero with timeline visualization showing project milestones across a date axis. Shows the visual planning timeline pattern. |
| `linear-planning-views.png` | **HIGH VALUE** -- Linear Initiatives table (Active tab) showing multiple initiatives with health status, targets, project counts, and active progress bars. Below: "Align everyone on the strategy" with initiative detail card, and "Monitor progress at scale" with health status dashboard showing On track/Off track/At risk status indicators. |
| `linear-product-pipeline.png` | Continuation of planning-views showing initiative detail, progress monitoring, and "Map out your product journey" section with List/Board/Timeline/Swimlanes view toggles. Shows multiple visualization modes for plans. |
| `linear-project-management.png` | Linear project management view showing Feature specs collaborative document, milestones with dependencies, and "Break projects down with Milestones" section. Shows the spec-to-implementation flow. |
| `linear-project-status.png` | **HIGH VALUE** -- Linear project detail showing "Split fares" with Properties, In Progress status, Initiatives, Dependencies, Docs & links, Requirements (blurred), and Milestones with dates. Also shows: Flexible project workflows with custom status icons (Idea through Shipped), project updates, and Slack-synced comment threads. |
| `linear-project-updates.png` | Linear project updates showing "On track" status badge, Slack thread integration, and Initiatives coordination section. Shows how project health communication works. |
| `linear-task-list.png` | Linear project detail page showing the full "A singular place for all project documentation" view with split specs/issues, attached custom issue views, project health analytics, and "Break projects down with Milestones" section with dependency graph. |

---

## Deleted Files (52) -- With Reasons

### Blog Articles / Tutorial Text (27 files)
These are screenshots of blog posts, tutorials, or documentation articles that show mostly text content, not actual product UI:

| File | Reason |
|------|--------|
| `canvas-vs-artifacts-medium-comparison.png` | Medium blog article hero -- "ChatGPT 4.0 Canvas vs Claude 3.5 Artifacts" with stock illustration |
| `canvas-vs-artifacts-medium-comparison-2.png` | Medium blog text with email signup popup overlay |
| `canvas-vs-artifacts-medium-comparison-3.png` | Medium blog text with email signup popup overlay (FAQ section) |
| `chatgpt-canvas-bgr-article.png` | BGR news article about ChatGPT Canvas with stock illustration |
| `chatgpt-canvas-computerworld.png` | Computerworld article about ChatGPT Canvas -- long scrolled text page |
| `chatgpt-canvas-datacamp-coding.png` | DataCamp tutorial about ChatGPT Canvas -- tutorial text with small UI inset |
| `chatgpt-canvas-datacamp-examples.png` | DataCamp tutorial -- versioning section with small UI element screenshots |
| `chatgpt-canvas-datacamp-features.png` | DataCamp tutorial -- feature bullet list, not actual UI |
| `chatgpt-canvas-datacamp-hero.png` | DataCamp tutorial -- same as examples, duplicate scroll position |
| `chatgpt-canvas-godofprompt.png` | "God of Prompt" blog -- AI Bundle marketing page with small Canvas screenshot |
| `chatgpt-canvas-godofprompt-2.png` | "God of Prompt" blog hero with illustration |
| `chatgpt-canvas-learnprompting.png` | LearnPrompting blog article with video player and text |
| `chatgpt-canvas-learnprompting-2.png` | LearnPrompting blog continuation -- "How to Access Canvas" text instructions |
| `chatgpt-canvas-openai-help.png` | OpenAI help center text page about Canvas feature -- documentation text, not UI |
| `chatgpt-canvas-stockimg-guide.png` | StockImg AI guide -- long scrolled page with marketing-style ChatGPT content |
| `chatgpt-canvas-vs-artifacts-venturebeat.png` | VentureBeat article footer -- "How to use Canvas" text with newsletter signup |
| `chatgpt-canvas-vs-artifacts-venturebeat-2.png` | Duplicate of above (identical content) |
| `claude-artifacts-albato-guide.png` | Albato blog hero -- "How to Use Claude Artifacts: 7 Powerful Ways" with illustration |
| `claude-artifacts-albato-guide-2.png` | Albato blog text about enabling artifacts -- tutorial instructions |
| `claude-artifacts-albato-guide-3.png` | Albato blog text about types of artifacts -- bullet point list |
| `claude-artifacts-help-center.png` | Claude Support article text -- "What are artifacts and how do I use them?" |
| `claude-artifacts-help-center-full.png` | Same Claude Support article -- full-page capture showing mostly text and small UI thumbnails |
| `claude-artifacts-zapier-full.png` | Zapier blog -- "How to use Claude Artifacts" with Anthropic logo illustration |
| `github-copilot-workspace-tips.png` | GitHub Blog article hero -- "5 tips and tricks when using GitHub Copilot Workspace" |
| `github-copilot-workspace-tips-2.png` | GitHub Blog article text continuation -- tips about being specific |
| `github-copilot-workspace-tips-3.png` | GitHub Blog article text -- tip about decomposing tasks |
| `cursor-plan-mode-blog-viewport.png` | Zapier blog about Claude Artifacts (mislabeled as Cursor). Actually kept for split-panel reference. |

*Note: cursor-plan-mode-blog-viewport.png was actually kept -- count adjusted below.*

### Marketing / Landing Pages (8 files)
| File | Reason |
|------|--------|
| `canvas-vs-artifacts-comparison-overview.png` | Linear homepage full-page marketing -- "The system for modern product development" hero + feature grid. Not a plan UI. |
| `cursor-plan-mode-blog-post-hero.png` | Linear homepage hero (mislabeled as Cursor) -- icons grid + "Planning" feature teaser |
| `cursor-plan-mode-blog-top.png` | Same as above but with "The system for modern product development" tagline visible |
| `github-copilot-workspace-hero.png` | Copilot Workspace sunset landing page -- "Technical Preview ending" banner, no UI |
| `linear-homepage-app-ui.png` | Linear homepage hero with background app screenshot (too dark/small) + client logos |
| `linear-homepage-hero.png` | Linear homepage hero -- "purpose-built tool for planning" tagline + dark app preview |
| `linear-homepage-issue-board.png` | Linear homepage section -- mostly marketing text about issue tracking with small UI preview |
| `linear-homepage-product-direction.png` | Linear homepage section -- "AI-assisted product development" with agent assignment UI |
| `linear-homepage-cycles-triage.png` | Linear homepage section showing cycles/triage marketing text with small project overview cards |
| `linear-homepage-project-overview.png` | Linear homepage section showing self-driving operations and MCP integration marketing |
| `github-copilot-workspace-blog.png` | Linear Plan page (mislabeled) -- duplicate of linear-plan-hero content |

### Video Files (2 files)
| File | Reason |
|------|--------|
| `cursor-plan-mode-changelog-1.7-video.mp4` | Video file -- cannot be used as static design reference |
| `cursor-plan-mode-changelog-2.2-video.mp4` | Video file -- cannot be used as static design reference |

### Unrelated UI / Garbage (7 files)
| File | Reason |
|------|--------|
| `claude-artifacts-split-panel-view.png` | **Completely blank** -- off-white empty image, nothing rendered |
| `cursor-plan-mode-geeky-gadgets-article.png` | Geeky Gadgets blog article about Cursor Plan Mode -- text with hero image |
| `cursor-plan-mode-geeky-gadgets-hero.jpg` | Stock photo of person using Cursor with "Plan Mode" text overlay -- promotional hero image |
| `cursor-plan-mode-luca-becker-hero.jpg` | Blog hero illustration -- split "Hooks" vs "Planning Mode" artistic graphic, no UI |
| `cursor-plan-mode-prompt-demo.png` | **Custom Fields UI** from a different project -- field name/type/value form, not plan UI |
| `cursor-plan-mode-result.png` | **Custom Fields UI** continuation -- Due date, Assigned to fields with visibility toggles |
| `cursor-plan-mode-visualization.png` | **Custom Fields UI** -- Due date picker, Yes/No checkbox, field type dropdown. Completely unrelated to plan mode. |
| `cursor-plan-mode-youtube-thumbnail.jpg` | YouTube thumbnail from a Plan Mode video -- "Plan Mode" text with laptop photo |
| `cursor-setup-illustration.png` | Cursor Plan mode selector showing the input field with Plan/Auto dropdown. Minimal UI. |
| `cursor-plan-mode-changelog-1.7-poster.png` | Cursor settings page showing Rules, Memories, Commands. Not plan mode UI. |
| `github-copilot-workspace-vsmag.png` | Visual Studio Magazine article with ads and popups |
| `github-copilot-workspace-vsmag-2.png` | Visual Studio Magazine article continuation with ads |
| `linear-triage.png` | Linear triage/backlog hygiene page -- inbox notifications and auto-archive rules, not planning UI |

---

## Introspection: How to Gather Screenshots Better Next Time

### What Went Wrong

1. **Wrong content type captured (65% waste rate):** The agents overwhelmingly captured blog articles, tutorials, and marketing pages *about* the tools rather than screenshots *of* the tools themselves. Searching for "ChatGPT Canvas" or "Cursor Plan Mode" naturally surfaces SEO-optimized blog posts, not the actual product UI.

2. **Mislabeled files everywhere:** Multiple files were saved with names referencing one product but actually contained screenshots from a completely different product (e.g., `github-copilot-workspace-blog.png` was actually a Linear Plan page, `cursor-plan-mode-blog-post-hero.png` was a Linear homepage). This suggests the agents navigated through links, ended up on different sites, and saved whatever they were looking at under the original target name.

3. **Captured intermediate/error states:** One file was a completely blank off-white page (failed render). Another was a "cursor.com is blocked" Chrome error. These should never have been saved.

4. **Video files captured:** Two .mp4 files were saved that cannot serve as static design references.

5. **Unrelated UI captured:** Several screenshots show a "Custom Fields" form UI that appears to be from the project's own app, not from any competitor. The agent likely had the local app open and screenshotted the wrong window.

6. **Redundant captures:** Multiple screenshots of the same page at different scroll positions or slightly different crops (e.g., linear-plan-hero and linear-plan-hero2 are nearly identical).

7. **Blog-first search strategy failed:** The agents appear to have used Google searches that surfaced blog content, then screenshotted whatever those blog pages showed. They did not navigate to the actual product UIs.

### Proposed Better Approach: `/screenshot-research` Skill

A reusable Skill (slash command) for efficiently gathering design reference screenshots:

#### Ideal Workflow

```
/screenshot-research "plan mode / task execution UI" --products "Cursor, Devin, Linear, GitHub Copilot"
```

**Phase 1: Source Identification**
- For each product, go directly to the official product URL (not Google)
- Prioritize: official docs > product pages > changelog posts > demo videos (frame captures)
- Maintain a registry of known product URLs to skip the search step entirely:
  - Cursor: cursor.com/docs, cursor.com/changelog
  - Linear: linear.app (requires auth), linear.app/features
  - Devin: devin.ai, docs.devin.ai
  - GitHub Copilot Workspace: githubnext.com/projects/copilot-workspace

**Phase 2: Capture with Validation**
- Before saving any screenshot, run a validation check:
  1. **Is actual product UI visible?** (Not just text/marketing copy)
  2. **Is the UI relevant to the search topic?** (Plan/task UI vs. settings page)
  3. **Is the image non-blank?** (Check that pixel variance exceeds a threshold)
  4. **Is it an error page?** (Check for "blocked", "404", "error" text)
  5. **Is it mostly ads/popups?** (Dismiss cookie banners and popups before capturing)
- Use element-targeted screenshots when possible (screenshot a specific UI component, not the full page)

**Phase 3: Deduplication**
- Before saving, compare with already-captured images
- If the content is >80% similar to an existing capture, skip it
- Name files descriptively: `{product}-{feature}-{specific-element}.png`

**Phase 4: Verification Report**
- Generate a thumbnail grid of all captured images
- Output a summary with descriptions before finalizing

#### Key Heuristics to Filter Out Garbage

1. **URL-based filtering:** Reject screenshots from known blog/news domains (medium.com, bgr.com, venturebeat.com, computerworld.com, geekygadgets.com) unless specifically requested
2. **Content-type detection:** If the page is >60% text with <40% UI elements, it is a blog article, not a product screenshot
3. **Navigation depth limit:** If you had to click through more than 2 links from the product's homepage, you are probably on a third-party site
4. **Error state detection:** Check for common error patterns before saving (blank pages, "blocked", "404", "denied", etc.)
5. **Viewport validation:** Ensure the page has fully loaded (wait for network idle) before capturing
6. **Popup dismissal:** Always dismiss cookie banners, newsletter popups, and login modals before capturing

#### What Would Have Produced Better Results for This Specific Task

Instead of Googling "ChatGPT Canvas plan mode" (which surfaces blogs), the agent should have:
- Opened ChatGPT directly and created a Canvas artifact to screenshot
- Opened Cursor IDE and activated Plan Mode to screenshot the actual UI
- Opened linear.app and navigated to a project's plan view
- Opened Devin and started a session to capture the progress tab
- Used the Wayback Machine or official demo videos to find Copilot Workspace UI (since it was sunset)

The fundamental mistake was treating this as a web search task instead of a product interaction task. The best screenshots of product UIs come from using the products, not from reading about them.
