# Edit Artifact Workspace - Implementation Plan

## Overview

Redesign the artifact editing workspace to feel like an extension of fullscreen chat, not a nested mode. Remove the settings drawer in favor of a horizontal toolbar.

## Current vs New Layout

```
CURRENT:
┌──────────────────────────────────────────────────────────────────────────┐
│ [← Back to chat]  Title                         ✓ Saved  [Publish ▾]    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                    ┌──────────────────┐  │
│                                                    │ [Settings]       │  │
│                                                    │ [Bar ▾]          │  │
│                 CHART                              │ [Headcount ▾]    │  │
│                                                    │ [by Dept ▾]      │  │
│                                                    │ [Green ▾]        │  │
│                                                    └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘

NEW:
┌──────────────────────────────────────────────────────────────────────────┐
│ Title                                       [📋] [•••]  [← Back to chat] │
├──────────────────────────────────────────────────────────────────────────┤
│ [Bar ▾] [Headcount ▾] [by Department ▾] [● Green ▾]            ✓ Saved  │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                              CHART                                       │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Header Redesign

### File: `src/components/ArtifactTopBar/ArtifactTopBar.tsx`

**Changes:**

1. **Remove "Back to chat" from left side**
2. **Title moves to far left** (larger, green, Fields font)
3. **Add Copy icon button** (icon only, pill shape)
4. **Add three-dot menu button** (icon only, contains Publish actions)
5. **Add "Back to chat" button on right** (with left arrow icon)
6. **Remove "Saved" indicator** (moves to toolbar in Phase 2)

**New header structure:**
```tsx
<header>
  {/* Left: Title only */}
  <h1>{title}</h1>

  {/* Right: Actions */}
  <div>
    <IconButton icon="copy" tooltip="Copy" />
    <IconButton icon="ellipsis" tooltip="More options">
      {/* Dropdown: Add to Dashboard, Save as Report, Share, Download */}
    </IconButton>
    <Button>
      <Icon name="arrow-left" />
      Back to chat
    </Button>
  </div>
</header>
```

**Styling:**
- Title: 32px, Fields font, `--color-primary-strong`
- Icon buttons: 32x32px, rounded-full, white bg, border
- "Back to chat": pill-shaped button with border

---

## Phase 2: Settings Toolbar

### File: `src/components/Charts/ChartSettingsToolbar.tsx` (NEW)

**Purpose:** Replace vertical ChartSettingsPills with horizontal toolbar row

**Structure:**
```tsx
<div className="toolbar-row">
  {/* Left: Setting dropdowns */}
  <div className="flex gap-2">
    <DropdownPill icon="chart-bar" label="Bar" />
    <DropdownPill icon="users" label="Headcount" />
    <DropdownPill icon="building" label="by Department" />
    <DropdownPill icon="circle" label="Green" color="green" />
  </div>

  {/* Right: Save status */}
  <div className="flex items-center gap-1.5">
    <Icon name="check" className="text-green" />
    <span>Saved</span>
  </div>
</div>
```

**Styling:**
- Height: 48px
- Background: white
- Border-bottom: 1px solid `--border-neutral-weak`
- Dropdowns: pill-shaped (rounded-full), white bg, border, icon + label + caret
- "Saved": 13px, `--text-neutral-medium`

**Dropdown behavior:**
- Opens downward (below button)
- Left-aligned to button
- Same options as current ChartSettingsPills

---

## Phase 3: Remove Settings Drawer

### Files to modify:

1. **`src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx`**
   - Remove `isDrawerOpen` and `setDrawerOpen` usage
   - Remove `<ChartSettingsDrawer />` component
   - Remove `<ChartSettingsPills />` component
   - Add `<ChartSettingsToolbar />` between header and chart area

2. **`src/contexts/ArtifactContext.tsx`**
   - Keep `isDrawerOpen` state for now (can remove later)
   - Or remove if no longer needed anywhere

3. **`src/components/Charts/ChartSettingsDrawer.tsx`**
   - Can be deleted or kept for potential future use
   - Mark as deprecated if keeping

4. **`src/components/Charts/ChartSettingsPills.tsx`**
   - Will be replaced by ChartSettingsToolbar
   - Can be deleted after toolbar is working

---

## Phase 4: Layout Adjustments

### File: `src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx`

**New layout structure:**
```tsx
<div className="h-screen flex flex-col">
  {/* Header */}
  <ArtifactTopBar ... />

  {/* Settings Toolbar */}
  <ChartSettingsToolbar
    settings={...}
    onSettingsChange={...}
  />

  {/* Main content area */}
  <div className="flex flex-1 overflow-hidden">
    {/* Chart area - no longer needs absolute positioning for pills */}
    <div className="flex-1 p-8">
      <div className="chart-container">
        {/* Chart */}
      </div>
    </div>

    {/* Chat panel - unchanged */}
    <ArtifactChatPanel ... />
  </div>
</div>
```

---

## Implementation Order

### Step 1: Create ChartSettingsToolbar
- [ ] Create new component file
- [ ] Port dropdown logic from ChartSettingsPills
- [ ] Style as horizontal row with pill buttons
- [ ] Add "Saved" indicator on right
- [ ] Test dropdowns work correctly

### Step 2: Integrate Toolbar into Workspace
- [ ] Import ChartSettingsToolbar in ArtifactWorkspace
- [ ] Add toolbar between header and main content
- [ ] Remove ChartSettingsPills rendering
- [ ] Remove ChartSettingsDrawer rendering
- [ ] Verify chart settings still update correctly

### Step 3: Redesign Header
- [ ] Update ArtifactTopBar component
- [ ] Move title to left (styled larger, green)
- [ ] Add Copy icon button
- [ ] Add three-dot menu with publish actions
- [ ] Move "Back to chat" to right side
- [ ] Remove "Saved" from header

### Step 4: Polish & Cleanup
- [ ] Remove unused drawer state if applicable
- [ ] Delete or deprecate ChartSettingsPills
- [ ] Delete or deprecate ChartSettingsDrawer
- [ ] Test all interactions
- [ ] Verify responsive behavior
- [ ] Check dark mode compatibility

---

## Component Specifications

### IconButton (may need to create)
```tsx
interface IconButtonProps {
  icon: string;
  onClick: () => void;
  tooltip?: string;
  size?: 'sm' | 'md';
}
```
- 32x32px (md) or 28x28px (sm)
- rounded-full
- white background
- 1px border `--border-neutral-medium`
- Icon centered, 16px

### ToolbarDropdown
```tsx
interface ToolbarDropdownProps {
  icon?: string;
  label: string;
  value: string;
  options: { value: string; label: string; icon?: string }[];
  onChange: (value: string) => void;
}
```
- Pill-shaped button
- Icon (optional) + Label + Caret
- Dropdown opens below, left-aligned
- Selected item highlighted

---

## Risk Mitigation

1. **Branch isolation**: All work on `edit-artifact` branch
2. **Incremental changes**: Each phase can be tested independently
3. **Fallback**: Can revert to `experiments` branch if needed
4. **No data changes**: Only UI components affected

---

## Success Criteria

- [ ] Header shows: Title | Copy | "..." | Back to chat
- [ ] Settings toolbar shows: [Type] [Measure] [Category] [Color] ... Saved
- [ ] No settings drawer or floating pills
- [ ] All chart settings still functional
- [ ] "Back to chat" navigates correctly
- [ ] Three-dot menu contains publish actions
- [ ] Visual style matches Figma design
