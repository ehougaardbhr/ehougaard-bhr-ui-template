# Org Chart Artifact Implementation Plan

## Overview

Build an organizational chart artifact view for **scenario planning** and organizational design. This is not a static org chart viewer - it's an interactive planning canvas where users can explore "what if" scenarios with AI coaching.

## Primary Use Cases

Users will ask questions like:
- "What would it look like if we added 5 people to this team?"
- "Is this too many people for a single manager to take on?"
- "Is the span of control appropriate?"
- "Let's add a TBH (To Be Hired) on this team."

The AI acts as an org chart expert, providing coaching like:
> "If you add 5 people to that team, they will need an extra manager, and the director above is already overloaded. You may have to add another director as well."

## Key UX Decisions

### 1. Interaction Model: AI-Driven (Option A)
- Users request changes through conversation with AI
- AI updates the org chart based on requests
- UI affordances provided for common actions (move someone, add TBH, etc.)
- **No drag-and-drop** for initial implementation (may add later)

### 2. Scenario Management
- Users can create and switch between multiple scenarios (Scenario 1, 2, 3...)
- Allows comparison of different organizational structure approaches
- Each scenario maintains its own state of additions/moves/changes

### 3. Edit Mode Visual Indicator
- Background: **Light dot grid** (similar to FigJam) when in edit mode
- Signals to users they're editing a scenario, not viewing the live org chart
- Regular white background for view-only mode (People page)

### 4. Employee Card Design

**Card Contents:**
- Avatar photo (or gray placeholder icon)
- Name (blue, clickable)
- Title
- Department
- Direct reports count at bottom (e.g., "13" with dropdown chevron)
- Pin icon in top-left corner
- Expand/collapse chevron for nodes with reports
- ~~"More..." link~~ (skipping - not including hire date)

**Card Interactions:**
- **Click pin icon** → Focuses on that employee (shows them at top with their reports beneath)
- **Click reports count** → Opens/closes the level beneath them
- **Click name** → Navigate to employee profile (future)
- **Blue border** → Selected/focused state

### 5. Top Controls Bar

**Left:**
- "Jump to an employee..." search box (with person icon) - quick navigation

**Center:**
- Depth level dropdown (number "1", "2", "3", "All", etc.)
- Up arrow button (go to parent/collapse)

**Right:**
- Filter button (≡) with dropdown
- Export button with dropdown

### 6. Export Formats

**Export Menu:**
1. **Download Org Chart** → PDF or PNG (simplified visual version)
2. **Download .csv to import to:**
   - Visio
   - Lucidchart
   - Unformatted .csv

### 7. Zoom Controls
- Zoom in button (+)
- Zoom out button (-)
- Positioned on right side of canvas

### 8. Layout & Hierarchy
- **Top-down tree structure** with connecting lines
- Clean vertical/horizontal lines showing reporting relationships
- Connect from bottom of parent card to top of child cards
- Cards arranged horizontally at each level
- Responsive scaling for different viewport sizes

## Shared Component Strategy

The org chart will be used in TWO places:
1. **Artifact view** (scenario planning with AI)
2. **People page** (viewing current org structure)

### Shared Components Architecture

Build reusable components in `/src/components/OrgChart/`:

1. **OrgChartNode** - Employee card component
2. **OrgChartTree** - Tree layout engine (positioning, connecting lines)
3. **OrgChartControls** - Jump to search, depth selector, up arrow
4. **OrgChartZoom** - Zoom in/out buttons
5. **OrgChartFilter** - Filter dropdown
6. **OrgChartExport** - Export menu

### Context-Specific Differences (via props)

| Feature | Artifact View | People Page |
|---------|---------------|-------------|
| Background | Dot grid (edit mode) | White |
| Data source | Scenario data | Current employee data |
| Editing | Edit affordances enabled | View-only |
| Container | Artifact workspace | People page layout |
| Scenario switcher | Yes | No |
| AI chat panel | Yes | No |

### Composition

- **Artifact view**: `/src/components/OrgChart/OrgChartArtifact.tsx`
- **People page**: `/src/pages/People/OrgChart.tsx`

Both compose the shared primitives differently based on context.

## Data Model

### OrgChartSettings Interface

```typescript
interface OrgChartSettings {
  rootEmployee: string;           // Employee ID or "all" for CEO
  depth: number | 'all';          // 1-5 or "all" levels
  filter: FilterType;             // "all" | "engineering" | "sales" | department names
  layout: LayoutType;             // "top-down" | "left-right"
  showPhotos: boolean;            // Toggle for avatar display
  compact: boolean;               // Compact vs expanded node view
}

type FilterType = 'all' | 'engineering' | 'sales' | 'product' | 'operations' | 'finance' | 'hr';
type LayoutType = 'top-down' | 'left-right';
```

### Scenario Data Structure

```typescript
interface OrgChartScenario {
  id: string;
  name: string;                   // "Scenario 1", "Scenario 2", etc.
  baseDate: Date;                 // Starting point for scenario
  changes: OrgChartChange[];      // List of modifications
}

interface OrgChartChange {
  id: string;
  type: 'add' | 'move' | 'remove' | 'edit';
  employeeId: string;             // For existing employees
  data?: Partial<Employee>;       // For new/edited employee data
  timestamp: Date;
  aiSuggestion?: string;          // AI coaching message
}

interface TBH {
  id: string;                     // Temporary ID for to-be-hired
  title: string;
  department: string;
  reportsTo: string;              // Manager ID
  isTBH: true;                    // Flag for styling/behavior
}
```

### Existing Employee Data

Already available in `/src/data/employees.ts`:
- 23 employees with hierarchy info
- `reportsTo` field (manager tracking)
- `directReports` count
- Department, location, division
- Avatar URLs

## Component Architecture

### 1. OrgChartNode Component

**Location**: `/src/components/OrgChart/OrgChartNode.tsx`

**Props**:
```typescript
interface OrgChartNodeProps {
  employee: Employee | TBH;
  isSelected?: boolean;
  isFocused?: boolean;
  onPinClick?: (id: string) => void;
  onExpandClick?: (id: string) => void;
  onNodeClick?: (id: string) => void;
  showPhoto?: boolean;
  compact?: boolean;
}
```

**Features**:
- Avatar with photo or placeholder
- Name (clickable, blue)
- Title and department
- Direct reports count badge (clickable)
- Pin icon (clickable)
- Expand/collapse chevron
- Hover states
- Selected state (blue border)
- TBH visual indicator (dashed border?)

### 2. OrgChartTree Component

**Location**: `/src/components/OrgChart/OrgChartTree.tsx`

**Props**:
```typescript
interface OrgChartTreeProps {
  rootEmployee: string | 'all';
  employees: Employee[];
  depth: number | 'all';
  layout: LayoutType;
  focusedEmployee?: string;
  expandedNodes: Set<string>;
  onNodeSelect?: (id: string) => void;
  onNodeExpand?: (id: string) => void;
  onNodePin?: (id: string) => void;
  settings: OrgChartSettings;
  zoomLevel?: number;
  panX?: number;
  panY?: number;
}
```

**Responsibilities**:
- Build employee hierarchy tree from flat data
- Calculate node positions using tree layout algorithm
- Render SVG connecting lines
- Render OrgChartNode components
- Handle zoom transformations
- Handle pan/drag navigation
- Filter by depth and other settings

**Algorithm**:
- Recursive tree traversal
- Position nodes based on level (y-axis) and sibling index (x-axis)
- Calculate spacing to avoid overlaps
- Draw vertical/horizontal SVG paths for connections

### 3. OrgChartControls Component

**Location**: `/src/components/OrgChart/OrgChartControls.tsx`

**Features**:
- "Jump to an employee..." search input with autocomplete
- Depth level dropdown (1, 2, 3, All)
- Up arrow button (go to parent)
- Filter button with dropdown
- Export button with menu

### 4. OrgChartSettingsToolbar Component

**Location**: `/src/components/OrgChart/OrgChartSettingsToolbar.tsx`

Similar pattern to `ChartSettingsToolbar` with dropdown pills:
- Root Employee
- Depth
- Filter (by department)
- Layout (top-down/left-right)
- Toggle: Show Photos
- Toggle: Compact View
- "Saved" indicator

### 5. OrgChartArtifact Component

**Location**: `/src/components/OrgChart/OrgChartArtifact.tsx`

**Composition**:
```
┌────────────────────────────────────────────────────────┐
│ ArtifactTopBar (Back, Title, Copy, Menu)              │
├────────────────────────────────────────────────────────┤
│ OrgChartSettingsToolbar                                │
├────────────────────────────────────────────────────────┤
│ OrgChartControls                                       │
├──────┬─────────────────────────────┬──────────────────┤
│ Tool │  OrgChartTree               │  ArtifactChatPanel│
│ Bar  │  (with dot grid background) │  (AI coaching)   │
│      │  + OrgChartZoom             │                  │
└──────┴─────────────────────────────┴──────────────────┘
```

**Props**:
```typescript
interface OrgChartArtifactProps {
  artifact: Artifact;
  scenario?: OrgChartScenario;
  onSettingsChange: (settings: OrgChartSettings) => void;
  onScenarioChange: (changes: OrgChartChange[]) => void;
}
```

### 6. ScenarioSwitcher Component

**Location**: `/src/components/OrgChart/ScenarioSwitcher.tsx`

**UI**:
- Tabs or dropdown for "Scenario 1", "Scenario 2", "Scenario 3"
- "+ New Scenario" button
- Visual indicator for current scenario
- Show number of changes in each scenario

### 7. OrgChartActionMenu Component

**Location**: `/src/components/OrgChart/OrgChartActionMenu.tsx`

**Actions** (context menu or toolbar):
- Move employee
- Add TBH
- Remove employee
- Edit title/department
- Duplicate employee (for what-if)

## Implementation Checklist

### Phase 1: Core Visualization
- [ ] Define OrgChartSettings and data types in `/src/data/artifactData.ts`
- [ ] Create OrgChartNode component with all states (selected, focused, TBH)
- [ ] Build tree layout algorithm with positioning logic
- [ ] Create OrgChartTree component with SVG rendering
- [ ] Add connecting lines between nodes
- [ ] Implement expand/collapse functionality
- [ ] Implement pin/focus functionality

### Phase 2: Controls & Settings
- [ ] Create OrgChartControls (search, depth, up arrow)
- [ ] Create OrgChartSettingsToolbar with all dropdown pills
- [ ] Create OrgChartZoom component
- [ ] Create OrgChartFilter with department options
- [ ] Create OrgChartExport with PDF/PNG/CSV options
- [ ] Wire up all controls to update tree rendering

### Phase 3: Scenarios & Editing
- [ ] Create ScenarioSwitcher component
- [ ] Create OrgChartActionMenu with edit affordances
- [ ] Implement scenario data structure in ArtifactContext
- [ ] Add dot grid background for edit mode
- [ ] Handle TBH (To Be Hired) node creation and rendering
- [ ] Implement move employee logic
- [ ] Implement add/remove employee logic

### Phase 4: Integration
- [ ] Update ArtifactContext to handle org-chart type
- [ ] Create OrgChartArtifact wrapper component
- [ ] Integrate into ArtifactWorkspace with routing
- [ ] Update InlineArtifactCard to render org-chart preview
- [ ] Add mock org-chart artifacts to artifactData.ts
- [ ] Wire up AI chat panel with scenario planning context

### Phase 5: People Page
- [ ] Create People/OrgChart.tsx page component
- [ ] Compose shared OrgChart components for People page view
- [ ] Add "New Employee" button
- [ ] Remove edit affordances (view-only mode)
- [ ] White background (no dot grid)
- [ ] Add List/Directory/Org Chart view switcher
- [ ] Wire up to current employee data (not scenario data)

### Phase 6: Polish & Testing
- [ ] Test zoom/pan functionality
- [ ] Test large hierarchies (deep and wide)
- [ ] Test export to all formats (PDF, PNG, CSV)
- [ ] Test responsive behavior
- [ ] Test keyboard navigation
- [ ] Add loading states
- [ ] Add empty states
- [ ] Test with edge cases (circular references, orphaned employees)

## File Changes Summary

### New Files
- `/src/components/OrgChart/OrgChartNode.tsx`
- `/src/components/OrgChart/OrgChartTree.tsx`
- `/src/components/OrgChart/OrgChartControls.tsx`
- `/src/components/OrgChart/OrgChartSettingsToolbar.tsx`
- `/src/components/OrgChart/OrgChartZoom.tsx`
- `/src/components/OrgChart/OrgChartFilter.tsx`
- `/src/components/OrgChart/OrgChartExport.tsx`
- `/src/components/OrgChart/OrgChartArtifact.tsx`
- `/src/components/OrgChart/ScenarioSwitcher.tsx`
- `/src/components/OrgChart/OrgChartActionMenu.tsx`
- `/src/components/OrgChart/index.ts` (exports)
- `/src/pages/People/OrgChart.tsx`
- `/src/utils/orgChartLayout.ts` (tree layout algorithm)
- `/src/data/scenarios.ts` (scenario mock data)

### Modified Files
- `/src/data/artifactData.ts` - Add OrgChartSettings type, mock artifacts
- `/src/contexts/ArtifactContext.tsx` - Handle org-chart settings updates
- `/src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx` - Add org-chart rendering
- `/src/components/InlineArtifactCard/InlineArtifactCard.tsx` - Add org-chart preview
- `/src/index.css` - Add dot grid background utility class

## Design Tokens

### Dot Grid Background

**Light Mode**:
```css
.org-chart-edit-bg {
  background-image: radial-gradient(circle, #cbd5e1 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #f8fafc;
}
```

**Dark Mode**:
```css
.dark .org-chart-edit-bg {
  background-image: radial-gradient(circle, #475569 1px, transparent 1px);
  background-size: 20px 20px;
  background-color: #0f172a;
}
```

### Node Spacing
- Horizontal spacing: 40px between sibling nodes
- Vertical spacing: 80px between levels
- Node width: 180px (compact) or 220px (expanded)
- Node height: ~120px with photo, ~100px without

### Pan & Drag Navigation
- Mouse drag to pan across the canvas
- Right-click drag as alternative (if using left-click for selection)
- Inertia scrolling for smooth panning
- Visual feedback during drag (cursor change, opacity change)

## Dependencies

- No new npm dependencies required
- Uses existing SVG rendering
- Uses existing employee data structure
- Reuses existing artifact patterns and components

## Future Enhancements

### High Priority

**1. Span of Control Warnings**
- Visual indicators on manager cards when they exceed recommended span (7-10 direct reports)
- Different warning levels (yellow caution, red critical)
- Tooltip suggestions: "This manager has 12 reports. Industry best practice is 7-10."
- AI coaching: "Consider splitting this team - you might need to add another manager."

**2. AI-Powered Org Health Metrics**
- Overall org health score based on:
  - Span of control balance
  - Management layer depth (too flat or too deep)
  - Ratio of managers to individual contributors
  - Department balance and symmetry
- Real-time health indicators as users make changes
- Specific coaching for each metric violation

**3. Salary & Budget Impact Calculations**
- When adding TBHs or moving people, show:
  - Total headcount change
  - Estimated salary impact (if salary ranges stored)
  - Budget tier changes (junior/mid/senior)
  - Department budget allocation
- Visual budget bar showing impact on department/company budget

**4. Cascade Impact Analysis**
- When user wants to move someone up a level:
  - Show warning if manager is already overloaded
  - Suggest restructuring: "You'll need to promote/add another manager here"
  - Show ripple effects through multiple levels
- AI explanation: "If Sarah moves to Director, we need another manager under John to handle his expanded team"

### Medium Priority

**5. Scenario Comparison View**
- Side-by-side comparison of 2-3 scenarios
- Highlight differences:
  - Green: new additions
  - Red: removals
  - Blue: moves/changes
  - Gray: unchanged
- Diff view showing exact changes made in each scenario
- "What if we combined these scenarios?" suggestion

**6. Drag-and-Drop Reorganization (Option B/C)**
- Visual feedback during drag (ghost card, connection preview)
- Drop zones highlight on valid targets
- Undo/redo for drag actions
- AI coaching during drag: "Are you sure? This would overload that manager"

**7. Timeline View of Organizational Changes**
- Visual timeline showing scenario evolution
- Replay feature to see changes unfold step-by-step
- Timestamp on each change with AI reasoning
- Export timeline as video or animated GIF

### Lower Priority

**8. Real-Time Collaboration**
- Multiple users editing same scenario
- Live cursor tracking and highlights
- Comment system on specific nodes
- Change log showing who made what change

**9. Integration with Real BambooHR Data**
- Load current org structure from actual HR system
- Sync scenarios back to HR for implementation
- Integration with compensation data
- Real historical data for trend analysis

**10. Advanced Filtering & Search**
- Filter by salary range, tenure, performance rating
- Search by skills, certifications, location
- "Find all people who could move to management" suggestions
- Bulk operations on filtered groups

**11. Role & Competency Mapping**
- Show required skills for roles
- Highlight skill gaps when filling positions
- Suggest internal candidates with matching skills
- Training/development recommendations

**12. Department-Level Org Planning**
- Create sub-scenarios for individual departments
- Rollup view of all department plans
- Validate cross-department dependencies
- Show total company impact of all department changes

### Implementation Notes

These enhancements should be:
- **Modular**: Each builds on the core org chart, not blocking initial release
- **Data-Driven**: Use mock data initially, real data when HR integration available
- **AI-First**: Leverage AI coaching for each enhancement
- **Non-Blocking**: Users can ignore warnings/suggestions and proceed anyway
- **Informative**: Show consequences and alternative approaches
