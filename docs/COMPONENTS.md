# Reusable Components

## Layout Components

### GlobalHeader
**Location**: `src/components/GlobalHeader/`

Top navigation bar with:
- BambooHR logo
- Search bar
- Utility icons: Inbox, Help, Settings
- Settings gear shows selected state (gray background + green icon) when on `/settings` route
- Uses `useLocation` to detect current route

### GlobalNav
**Location**: `src/components/GlobalNav/`

Collapsible left sidebar with:
- 7 navigation items: Home, My Info, People, Hiring, Reports, Files, Payroll
- Selected state: Gray background + green icon + bold text
- Theme toggle button (sun/moon icon)
- Account section with avatar at bottom
- Expand/collapse button
- localStorage persistence (`bhr-nav-collapsed` key)

### AppLayout
**Location**: `src/layouts/AppLayout.tsx`

Main layout shell that wraps pages:
```tsx
<AppLayout>
  <YourPageContent />
</AppLayout>
```

## UI Components

### Avatar
**Location**: `src/components/Avatar/`

User avatar display:
- Props: `size`, `src`, `name`
- Fallback to initials if no image

### Button
**Location**: `src/components/Button/`

Standard button component:
- Props: `variant`, `size`, `icon`, `children`
- Variants: primary, secondary, ghost

### Icon
**Location**: `src/components/Icon/`

Unified icon wrapper for Font Awesome and Lucide:
- Props: `name`, `size`, `className`, `style`
- Supports custom colors via `style` prop

**Available Icons**:
- Font Awesome: folder, chevron-down, arrow-up-from-bracket, table-cells, arrow-down-to-line, trash-can, file, file-audio, image, circle-info, lock, thumbs-up, heart, sliders, bell, spa, palette, door-open, door-closed, chart-line, plane, graduation-cap, shield, check-circle, link, chevron-right, arrows-rotate
- Lucide: PanelLeftOpen, PanelLeftClose, Home, UserCircle, Users, IdCard, PieChart, FileText, CircleDollarSign, Sun, Moon

### TextHeadline
**Location**: `src/components/TextHeadline/`

Typography component for headlines:
- Props: `size`, `color`, `icon`, `className`
- Sizes: x-large (52px), large (40px), medium (32px), small (24px), x-small (20px)
- Colors: primary, neutral-strong, neutral-medium, neutral-weak, inverted, link
- Uses Fields font

### Gridlet
**Location**: `src/components/Gridlet/`

Dashboard card widget for Home page:
- Props: `title`, `children`, `icon`
- Consistent styling across dashboard

### TextArea
**Location**: `src/components/TextArea/`

AI-themed input with gradient border:
- Rainbow gradient: `linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)`
- Circle-arrow-up submit icon
- Props: `placeholder`, `state`, `note`, `hasValue`, `hasLabel`
- Used in Reports page for AI questions

### ProgressBar
**Location**: `src/components/ProgressBar/`

Progress indicator:
- Props: `value`, `max`, `label`, `color`
- Horizontal bar with fill percentage
- Created for Settings page (not yet implemented in UI)

### Dropdown
**Location**: `src/components/Dropdown/`

Select dropdown component:
- Props: `options`, `value`, `onChange`, `placeholder`
- Used across multiple pages

### Tabs
**Location**: `src/components/Tabs/`

Tab navigation:
- Props: `tabs`, `activeTab`, `onTabChange`
- Used in Hiring page

### EmployeeCard
**Location**: `src/components/EmployeeCard/`

Employee display card for People page:
- Shows avatar, name, job title, department
- Props: `employee`

## Chat Components

### AIChatPanel
**Location**: `src/components/AIChatPanel/`

Slide-in chat panel (can expand to full-screen):
- 383px wide when collapsed
- Full width when expanded
- Header with conversation dropdown
- Expand/collapse/close buttons
- Message display (user + AI)
- Input with gradient border
- Sidebar with conversation list (when expanded)
- Artifacts section in sidebar
- localStorage persistence: `bhr-chat-panel-open`, `bhr-chat-expanded`

## Artifact Components

### InlineArtifactCard
**Location**: `src/components/InlineArtifactCard/`

Chart cards displayed in chat conversations:
- White rounded card with border
- Green title (24px TextHeadline)
- Action buttons: Copy, Edit, Publish
- Chart rendered inline (500x340 for compact, 700x480 for expanded)
- Responsive header design
- Integrates with ArtifactContext

### ArtifactTopBar
**Location**: `src/components/ArtifactTopBar/`

Header for artifact workspace:
- Title on left
- Copy/Menu/Back buttons on right
- Button styling: 1000px border radius, white background, subtle border/shadow
- Title: h1, 32px/40px, Fields font, primary green
- Three-dot menu: Dashboard, Report, Share, Download

### ArtifactToolBar
**Location**: `src/components/ArtifactToolBar/`

Left vertical icon toolbar in artifact workspace:
- 48px icon buttons
- Icons: sparkles, pen, search, image
- White background, rounded corners

### ArtifactChatPanel
**Location**: `src/components/ArtifactChatPanel/`

Chat panel for artifact workspace:
- 367px wide
- Grey outer container with 1px padding
- White inner content
- Rainbow gradient border on input
- Shows conversation related to artifact

## Chart Components

All located in `src/components/Charts/`

### BarChart
SVG bar chart with:
- Rounded corners on bars
- Grid lines
- Responsive sizing (900x600 base)
- Props: `settings`, `width`, `height`

### LineChart
Connected line graph with:
- Circle markers at data points
- Solid color (multi-color disabled)
- Grid lines
- Props: `settings`, `width`, `height`

### PieChart
Arc-based pie chart with:
- Multi-color default
- Percentages inside slices
- Multi-row legend (up to 3 items per row)
- Props: `settings`, `width`, `height`

### TableChart
HTML table with:
- Hover states
- Totals row
- Props: `settings`

### ChartSettingsToolbar
Horizontal toolbar with dropdowns:
- Chart Type, Measure, Category, Color
- "Saved" indicator with green checkmark
- Replaces old vertical drawer design
- Props: `settings`, `onSettingsChange`

## Text Components

All located in `src/components/`

### TextSettingsToolbar
**Location**: `src/components/TextSettingsToolbar/`

Horizontal toolbar with dropdown pills for text settings:
- Tone: Professional, Casual, Formal, Friendly
- Length: Brief, Standard, Detailed
- Format: Paragraph, Bullets, Numbered
- "Saved" indicator with green checkmark
- Matches ChartSettingsToolbar pattern
- Props: `settings`, `onSettingsChange`

### TextEditor
**Location**: `src/components/TextEditor/`

Rich text editor with formatting toolbar:
- ContentEditable-based editing
- Formatting buttons: Bold, Italic, Underline
- Heading buttons: H1, H2, H3, P
- List buttons: Bulleted, Numbered
- Scoped heading styles via `.text-editor-content` class
- User editing tracking to prevent cursor jumping
- Props: `content`, `format`, `onChange`

### TextDisplay
**Location**: `src/components/TextDisplay/`

Read-only text display with truncation:
- Shows text content with optional length limit
- Truncates with "..." if exceeds maxLength
- Used in InlineArtifactCard for previews
- Props: `content`, `maxLength`, `className`

## Context Providers

### ChatContext
**Location**: `src/contexts/ChatContext.tsx`

Manages chat state:
- Actions: `createNewChat`, `selectConversation`, `addMessage`
- localStorage persistence
- Search/filter functionality

### ArtifactContext
**Location**: `src/contexts/ArtifactContext.tsx`

Manages artifact state:
- Actions: `selectArtifact`, `updateArtifactSettings`, `updateArtifactContent`, `toggleDrawer`, `createArtifact`
- ChartSettings and TextSettings interfaces
- Mock artifacts list (charts and text)
- Default settings for both artifact types

### ArtifactTransitionContext
**Location**: `src/contexts/ArtifactTransitionContext.tsx`

Manages transition animations (currently disabled):
- Tracks transition state
- Coordinates animation timing
- Uses Framer Motion
