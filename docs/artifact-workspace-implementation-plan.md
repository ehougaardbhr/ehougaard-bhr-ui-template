# Artifact Workspace Implementation Plan

## Decisions Made

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route Structure | `/artifact/:type/:id` | Dedicated full-page route, follows existing `/chat` pattern |
| State Management | Separate ArtifactContext | Clean separation, supports future artifact types |
| Chart Rendering | Defer (simple SVG) | Focus on workspace UX first, add charting library later |
| Scope | Full implementation | Port all functionality from HTML mockup |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      ArtifactWorkspace (page)                   │
├─────────────────────────────────────────────────────────────────┤
│                        ArtifactTopBar                           │
│  [← Back to chat]  [Headcount by Department]    Saved [Publish] │
├───────────────────────────────────┬─────────────┬───────────────┤
│                                   │             │               │
│           ChartArea               │   Chart     │  Artifact     │
│         (flex: 1)                 │  Settings   │  ChatPanel    │
│                                   │   Drawer    │   (400px)     │
│    ┌─ ChartSettingsPills ─┐       │  (280px)    │               │
│    │ (when drawer closed) │       │             │               │
│    └──────────────────────┘       │             │               │
│                                   │             │               │
│        [Chart Rendering]          │             │               │
│                                   │             │               │
└───────────────────────────────────┴─────────────┴───────────────┘
```

---

## Files to Create

### 1. Context

**`src/contexts/ArtifactContext.tsx`**
```typescript
interface Artifact {
  id: string;
  type: 'chart' | 'document' | 'org-chart' | 'table';
  title: string;
  conversationId: string;
  createdAt: Date;
  settings: ChartSettings | DocumentSettings | etc;
}

interface ChartSettings {
  chartType: 'bar' | 'line' | 'pie' | 'table';
  measure: 'headcount' | 'salary' | 'tenure' | 'turnover';
  category: 'department' | 'location' | 'job-level' | 'employment-type';
  color: 'green' | 'blue' | 'purple' | 'multi';
  filter: 'all' | 'full-time' | 'contractors' | 'remote';
  benchmark: 'none' | 'industry' | 'previous';
}

interface ArtifactContextType {
  // State
  artifacts: Artifact[];
  selectedArtifact: Artifact | null;
  isDrawerOpen: boolean;

  // Actions
  selectArtifact: (id: string) => void;
  updateArtifactSettings: (settings: Partial<ChartSettings>) => void;
  toggleDrawer: () => void;
  setDrawerOpen: (open: boolean) => void;
  createArtifact: (type: string, conversationId: string) => Artifact;
}
```

### 2. Page

**`src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx`**
- Reads `:type` and `:id` from URL params
- Selects artifact from context
- Renders layout: TopBar + (ArtifactArea + ChatPanel)
- For now, only handles `type === 'chart'`

**`src/pages/ArtifactWorkspace/index.ts`**
- Export

### 3. Components

**`src/components/ArtifactTopBar/ArtifactTopBar.tsx`**
- Reuse: `Button` (back button), `TextHeadline` (title), `Icon`, `Dropdown` (publish menu)
- Props: `title`, `onBack`, `onPublish`
- "Saved" indicator with green checkmark
- Publish dropdown with 4 options

**`src/components/ChartArtifact/ChartArtifact.tsx`**
- Container for chart-specific workspace content
- Manages layout of ChartArea + ChartSettingsDrawer
- Renders appropriate chart type based on settings

**`src/components/ChartSettingsDrawer/ChartSettingsDrawer.tsx`**
- Reuse: `Button` (chart type buttons), `Dropdown` or custom select
- Header with "Chart Settings" title and close button
- Chart type row (Bar, Line, Pie, Table)
- Control sections: Measure, Compare, Category, Color, Filter
- Close button triggers `setDrawerOpen(false)`

**`src/components/ChartSettingsPills/ChartSettingsPills.tsx`**
- Visible when drawer is closed
- Vertical stack of pills showing current settings
- "Chart Settings" pill (opens drawer)
- Setting pills with dropdown on click (Chart Type, Measure, Category, Color)
- Caret appears on hover

**`src/components/ArtifactChatPanel/ArtifactChatPanel.tsx`**
- Reuse: `ChatContent` patterns (message bubbles, input)
- Simplified version of chat for artifact context
- Shows conversation related to this artifact
- Sends messages via ChatContext.addMessage()
- Auto-adds AI response messages when settings change

### 4. Data

**`src/data/artifactData.ts`**
- Mock artifacts array
- Chart mock data (department/location/job-level/employment-type × headcount/salary/tenure/turnover)
- Color palettes
- Label mappings

**`src/data/types.ts`** (extend existing)
- Artifact type definitions
- ChartSettings type

---

## Files to Modify

### 1. `src/App.tsx`

Add ArtifactProvider and routes:

```tsx
import { ArtifactProvider } from './contexts/ArtifactContext';
import { ArtifactWorkspace } from './pages/ArtifactWorkspace';

function App() {
  return (
    <ThemeProvider>
      <ChatProvider>
        <ArtifactProvider>
          <BrowserRouter>
            <Routes>
              {/* Existing routes */}

              {/* Artifact workspace - full page, no AppLayout */}
              <Route path="/artifact/:type/:id" element={<ArtifactWorkspace />} />
            </Routes>
          </BrowserRouter>
        </ArtifactProvider>
      </ChatProvider>
    </ThemeProvider>
  );
}
```

### 2. `src/components/AIChatPanel/AIChatPanel.tsx`

Wire up artifact thumbnails to navigate:

```tsx
// In the artifacts grid section
<div
  onClick={() => navigate(`/artifact/chart/${artifact.id}`)}
  className="cursor-pointer"
>
  {/* artifact thumbnail */}
</div>
```

### 3. `src/components/index.ts`

Export new components:
```typescript
export * from './ArtifactTopBar';
export * from './ChartArtifact';
export * from './ChartSettingsDrawer';
export * from './ChartSettingsPills';
export * from './ArtifactChatPanel';
```

---

## Component Reuse Map

| HTML Mockup Element | React Implementation |
|---------------------|---------------------|
| Back button | `<Button variant="standard">` with Icon |
| Artifact title | `<TextHeadline size="medium">` |
| Publish button | `<Button variant="primary">` + `<Dropdown>` |
| Chart type buttons | Custom component using `<Button>` or `<Tabs>` pattern |
| Dropdowns (measure, etc.) | `<Dropdown>` component |
| Close button (drawer) | `<Button variant="ghost">` with Icon |
| Settings pills | Custom component, style with Tailwind |
| Chat messages | Pattern from `<ChatContent>` |
| Chat input | `<TextArea>` with gradient border |
| Send button | `<Button variant="primary">` circular |
| Icons | `<Icon name="...">` component |

---

## Styling Approach

Use existing design tokens from `src/index.css`:

```css
/* Colors */
--color-primary-strong: #2e7918     /* Green buttons, active states */
--color-primary-medium: #3d9a21     /* Hover states */

/* Surfaces */
--surface-neutral-white: #ffffff    /* Cards, panels */
--surface-neutral-xx-weak: #f6f6f4  /* Backgrounds */

/* Borders */
--border-neutral-weak: #d4d2cf      /* Panel borders */
--border-neutral-x-weak: #e4e3e0    /* Subtle borders */

/* Text */
--text-neutral-xx-strong: #38312f  /* Headlines */
--text-neutral-medium: #676260     /* Secondary text */
--text-neutral-weak: #777270       /* Muted text */

/* Spacing */
--space-sm: 12px, --space-md: 16px, --space-lg: 20px, etc.
```

Use Tailwind classes for layout:
```tsx
// Example: Workspace container
<div className="flex h-[calc(100vh-56px)]">
  <div className="flex-1 flex">
    {/* Chart area */}
  </div>
  <div className="w-[280px] border-l">
    {/* Settings drawer */}
  </div>
  <div className="w-[400px] border-l">
    {/* Chat panel */}
  </div>
</div>
```

---

## Implementation Order

### Phase 1: Foundation
1. Create `ArtifactContext` with types and basic state
2. Create `artifactData.ts` with mock data
3. Add route to `App.tsx`
4. Create `ArtifactWorkspace` page shell

### Phase 2: Universal Shell
5. Create `ArtifactTopBar` component
6. Create `ArtifactChatPanel` component
7. Wire up layout in `ArtifactWorkspace`

### Phase 3: Chart Artifact
8. Create `ChartSettingsDrawer` component
9. Create `ChartSettingsPills` component
10. Create `ChartArtifact` container
11. Implement chart rendering (simple SVG)

### Phase 4: Interactivity
12. Wire up drawer open/close
13. Wire up pill dropdowns
14. Wire up settings changes → chart updates
15. Wire up settings changes → chat messages

### Phase 5: Integration
16. Wire up AIChatPanel thumbnails to navigate
17. Wire up "Back to chat" navigation
18. Test full flow

---

## Verification Checklist

- [ ] Navigate to `/artifact/chart/123` shows workspace
- [ ] Top bar displays artifact title
- [ ] Back button returns to previous page
- [ ] Publish dropdown shows 4 options
- [ ] Settings drawer shows all controls
- [ ] Closing drawer shows pills
- [ ] "Chart Settings" pill reopens drawer
- [ ] Pills show correct current values
- [ ] Pill hover shows caret
- [ ] Pill click opens dropdown
- [ ] Changing setting updates chart
- [ ] Changing setting adds chat message
- [ ] All 4 chart types render
- [ ] Dark mode works throughout
- [ ] AIChatPanel artifact click navigates to workspace
