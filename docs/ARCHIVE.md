# Archive - Historical Notes

This document contains research, experiments, and historical decisions that informed current implementations.

## Transition Research

### Demo Pages
Two demo pages were built to research animation approaches:

#### `/chat-transitions-demo`
Tests 5 different transition styles for panel → full-screen:

1. **Expand** - Panel physically grows from right edge (380px → full width)
2. **Slide Handoff** - Panel exits left, full-screen enters from right
3. **Slide Fade** - Panel fades in place, full-screen slides over
4. **Zoom** - Panel zooms/scales from right (0.95 → 1.0 scale)
5. **Crossfade** - Simple opacity transition

**Findings**:
- Expand and Zoom anchored to right edge work smoothly
- Slide-handoff avoids conflicting motion
- All use `ease-out` timing
- Settled on expand approach for production

#### `/text-reflow-demo-2`
Tests 7 solutions for text reflow during expansion:

1. **None** - Standard behavior (distracting line jumps)
2. **Never Reflow** - Fixed 600px width
3. **Slide Away/Back** - Content slides off during transition
4. **Scale Transform** - Content scales instead of reflowing
5. **Delayed Reveal** - Fade out → animate → fade in
6. **Shell Only** - Container animates, content "snaps"
7. **Crossfade Layouts** - Two versions crossfade

**Problem**: Text wrapping/unwrapping draws eye away from main animation.

**Solution**: Not addressed yet—current production uses simple expand without solving text reflow issue.

### Production Implementation
**Chosen approach**: Panel expands in-place at current route.
- Duration: 700ms
- Easing: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- Right edge stays fixed at 16px
- Sidebar appears with smooth width/opacity

## Deleted Features

### Chat Routes (Removed in experiments branch)
Originally had dual chat implementations:
- `/chat` - Full-page chat view with ChatSidebar + ChatContent
- AIChatPanel - Slide-in panel

**Problem**: Two implementations caused state sync issues.

**Solution**: Deleted entire `/chat` route system (365 lines):
- Removed Chat page
- Removed ChatSidebar component
- Removed ChatContent component
- Now uses only AIChatPanel for all chat

**Benefits**:
- Single source of truth
- No sync bugs
- Simpler architecture

## Edit Artifact Branch (Merged)

### Purpose
Redesigned artifact workspace from Figma to feel less like "a mode within a mode."

### Changes Made
1. **Horizontal settings toolbar** - Replaced 280px vertical drawer
2. **Simplified header** - Title left, buttons right
3. **Settings inside card** - Header and toolbar moved into white chart card
4. **Left icon toolbar** - Added 88px vertical sidebar
5. **Exact Figma styling** - Button borders, shadows, colors matched precisely

### Files
- Created: ChartSettingsToolbar, ArtifactToolBar
- Redesigned: ArtifactTopBar, ArtifactChatPanel
- Restructured: ArtifactWorkspace layout

Branch merged into experiments on Jan 20, 2026.

## Responsive Artifact Cards

### Challenge
Inline artifact cards need to work in narrow sidebar (383px) and expanded chat (wider).

### Solutions Explored
1. **Stack layout** - Title on top, buttons below (recommended)
2. **Icon-only buttons** - Remove text labels on small screens
3. **Overflow menu** - Collapse all actions into "•••"
4. **Responsive hybrid** - flex-wrap to stack when needed

**Current status**: Not fully addressed. Cards may overflow in narrow sidebar.

## Old Chart Settings Drawer

### Original Design
Vertical 280px drawer on right side with:
- Chart type segmented control
- Dropdowns for settings
- Slide-in/out animation

### Why Changed
Felt like too much nesting: App → Chat → Artifact Editor → Settings Panel

### New Design
Horizontal toolbar with pills/dropdowns directly below title.

## Artifacts Section Evolution

### Original Location
Bottom of ChatContent component, only visible in full-screen chat.

### Problem
Not discoverable—users didn't know artifacts existed.

### Solution
Moved to sidebar above Chats list:
- Shows 3 artifacts initially
- "See more" expands to all
- Visible in both panel and expanded modes
- All artifacts from all conversations

## Branch History

### main Branch
Clean template with stable features. Intended for designers to clone.

### experiments Branch
Current development work:
- Artifact workspace redesign
- Transition animation infrastructure
- New artifact type planning

### edit-artifact Branch (Deleted)
Temporary branch for workspace redesign. Merged to experiments, then deleted.

## Animation Infrastructure (Disabled)

### Built But Not Working
Infrastructure exists but disabled due to positioning bugs:
- ArtifactTransitionContext - State management
- ArtifactTransitionOverlay - Portal-based animation
- Framer Motion integration

### Problem
Elements were "flying all over the place" during animation. Coordinate calculations incorrect.

### Current State
Direct navigation used instead. Animation code remains in codebase for future fix.

## Color Intelligence for Charts

### Evolution
Initially all charts could use any color.

### Problems
- Pie charts with single color hard to read
- Line charts with multi-color looked busy

### Solution
Smart defaults:
- Pie charts: Force multi-color
- Line charts: Hide multi-color option, force solid
- Bar charts: Support both

Implemented in dropdown options based on selected chart type.

## Design Token Approach

### Initial Approach
Hardcoded colors, Tailwind classes.

### Problems
- Dark mode impossible
- Hard to update theme
- Inconsistent styling

### Solution
CSS variables for everything:
```css
:root {
  --color-primary-strong: #2e7918;
}
:root.dark {
  --color-primary-strong: #4a9e2a;
}
```

**Rule**: Never use Tailwind `dark:` prefix. Always use CSS variables.

## Payroll Date Selector

### Challenge
Show date cards that disappear completely (not partially) when viewport shrinks.

### Solution
ResizeObserver-based calculation:
```tsx
const CARD_WIDTH = 160;
const MIN_GAP = 20;
const availableWidth = containerWidth - BUTTON_WIDTH - MIN_GAP;
const maxCards = Math.floor((availableWidth + MIN_GAP) / (CARD_WIDTH + MIN_GAP));
```

Cards use `justify-between` to redistribute remaining space.

## Figma MCP Integration

Used Figma MCP tools to:
- Extract exact styling from designs
- Get screenshots for reference
- Ensure pixel-perfect implementation

Particularly useful for:
- Button border radius (1000px pill shape)
- Box shadows (1px 1px 0px 1px rgba...)
- Spacing and padding measurements
