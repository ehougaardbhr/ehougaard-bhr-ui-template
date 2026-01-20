# Major Features

## AI Chat System

### Overview
Dual-mode AI chat interface that works across the entire application:
1. **Slide-in panel** - Appears on right side when "Ask" button clicked
2. **Expanded mode** - Panel grows to full-screen with sidebar

### Components
- **AIChatPanel** - Main chat component (see [COMPONENTS.md](COMPONENTS.md))
- **ChatContext** - State management for conversations

### Navigation Flow
1. User clicks "Ask" button in GlobalHeader → panel slides in (383px)
2. User clicks expand icon → panel expands to full width, sidebar appears
3. User clicks collapse → panel returns to 383px width
4. User clicks X → panel closes completely

### Features
- **Conversation list** with search
- **New chat** button creates empty conversation
- **Message display**: User bubbles (white, right-aligned) + AI responses (left-aligned)
- **Suggestion chips** after AI messages
- **Input area** with gradient border and auto-expanding textarea
- **localStorage persistence**: `bhr-chat-panel-open`, `bhr-chat-expanded`

### Animations
- **Duration**: 700ms
- **Easing**: `cubic-bezier(0.25, 0.8, 0.25, 1)`
- **Right-edge anchoring**: `right: 16px` stays constant, width expands leftward
- **Sidebar**: Smooth width/opacity transition (0 → 280px)

### Mock Data
15 conversations in `src/data/chatData.ts`:
- Employee Onboarding
- PTO Policy
- Benefits Overview
- And more...

## Artifacts System

### Overview
User-generated visualizations and documents displayed inline in conversations and editable in dedicated workspace.

### Artifact Types
Currently implemented:
- **Charts**: Bar, Line, Pie, Table

Planned:
- **Text**: Generation + rich text editing
- **Workflows**: Process/flowchart builder
- **Org Charts**: Hierarchy visualization + scenario planning

### Architecture

#### Inline Display
**InlineArtifactCard** component shows artifacts in conversations:
- White rounded card with chart
- Action buttons: Copy, Edit, Publish
- Edit button navigates to full workspace

#### Workspace View
Full-page editing at `/artifact/:type/:id`:

```
┌─────────────────────────────────────────────────────┐
│ [← Back]  Title           [Copy] [Menu]     Saved  │
├─────────────────────────────────────────────────────┤
│ [Bar▾] [Headcount▾] [by Dept▾] [Green▾]   ✓ Saved │
├──────┬──────────────────────────────────────┬───────┤
│      │                                      │       │
│ Tool │         Chart Display                │ Chat  │
│ Bar  │                                      │ Panel │
│      │                                      │       │
└──────┴──────────────────────────────────────┴───────┘
```

Components:
- **ArtifactTopBar**: Header with title and actions
- **ArtifactToolBar**: Left icon sidebar (88px)
- **ChartSettingsToolbar**: Horizontal dropdowns for chart controls
- **Chart components**: BarChart, LineChart, PieChart, TableChart
- **ArtifactChatPanel**: Right panel for AI collaboration

### Chart Features

#### Types
1. **Bar Chart**: Rounded bars, grid lines, responsive
2. **Line Chart**: Connected points, solid color only
3. **Pie Chart**: Multi-color default, percentages in slices
4. **Table Chart**: HTML table with hover states, totals

#### Controls
Dropdown pills for:
- **Chart Type**: Bar, Line, Pie, Table
- **Measure**: Headcount, Salary, Tenure, Turnover
- **Category**: Department, Location, Job Level, Employment Type
- **Color**: Green, Blue, Purple, Multi-color

Color intelligence:
- Pie charts: Always multi-color
- Line charts: Always solid color (multi-color hidden)
- Bar charts: Support both

#### Data
Mock data in `src/data/artifactData.ts`:
- 4 categories × 4 measures = 16 data sets
- Color palettes
- Label mappings
- Format utilities

### Artifact Context
**ArtifactContext** manages:
- Artifacts list
- Selected artifact
- Settings updates
- Creation/selection actions

### Navigation Integration
- **Chat sidebar**: Shows artifacts above conversation list
- **Inline cards**: Click "Edit" → navigate to workspace
- **Back button**: Return to chat from workspace

## Transition Animations (Disabled)

### Status
Infrastructure built but currently disabled due to positioning issues.

### Goal
Smooth transition when clicking "Edit" on inline artifact card:
1. Chat text fades out (300ms)
2. Card scales up from inline to workspace size (600ms)
3. Chat panel slides in from right (500ms)
4. Workspace chrome fades in (400ms)

### Implementation
- **ArtifactTransitionContext**: State management
- **ArtifactTransitionOverlay**: Portal-based animation overlay
- **Framer Motion**: Animation library
- Currently bypassed with direct navigation

See [ARCHIVE.md](ARCHIVE.md) for transition research details.

## Dark Mode

### Implementation
Uses CSS variables with `:root.dark` selector:
```css
:root.dark {
  --surface-neutral-white: #1a1a1a;
  --text-neutral-strong: #d5d0cd;
}
```

### Usage
**Important**: Do NOT use Tailwind `dark:` prefix. Always use CSS variables:
```tsx
// ✅ Correct
style={{ backgroundColor: 'var(--surface-neutral-white)' }}

// ❌ Wrong
className="bg-white dark:bg-gray-900"
```

### Toggle
Theme toggle button in GlobalNav switches between light/dark modes.

## Planned Features

### New Artifact Types

#### Text Artifacts
- Generation with AI
- Rich text editing
- Settings pills: Tone, Length, Style
- Formatting toolbar

#### Workflow Artifacts
- Process/flowchart builder
- Visual diagram editor
- Settings for layout and styling

#### Org Chart Artifacts
- Hierarchy visualization
- Scenario planning
- Interactive tree manipulation
- Department filters

All will reuse the same workspace layout and toolbar pattern.
