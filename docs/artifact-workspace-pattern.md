# Artifact Workspace Pattern

## Overview

The Artifact Workspace is a full-screen editing environment where users can create, modify, and publish AI-generated artifacts. This pattern provides a consistent shell with pluggable, type-specific editing experiences.

## User Journey

1. User asks AI a question in the slide-in chat panel
2. AI generates an artifact (chart, document, org chart, etc.)
3. User clicks "Expand" to enter full-screen artifact workspace
4. User can:
   - Edit the artifact using type-specific controls
   - Continue conversing with AI in the chat panel
   - Publish/export/share when ready
5. User clicks "Back to chat" to return to main interface

## Architecture

### Universal Shell

The artifact workspace provides a consistent container regardless of artifact type:

```
┌─────────────────────────────────────────────────────────────────┐
│  ← Back    [Artifact Title]              Saved    [Publish ▾]   │
├─────────────────────────────────────────┬───────────────────────┤
│                                         │                       │
│         ARTIFACT AREA                   │       CHAT            │
│         (type-specific)                 │       (universal)     │
│                                         │                       │
│                                         │                       │
│                                         │                       │
│                                         │                       │
└─────────────────────────────────────────┴───────────────────────┘
```

#### Top Bar (Universal)
- **Back Button**: Returns to previous view (typically main chat interface)
- **Artifact Title**: Dynamic title that updates based on artifact content
- **Saved Indicator**: Auto-save status ("Saved" with checkmark)
- **Publish Button**: Dropdown menu with actions:
  - Save to Report
  - Save to Dashboard
  - Export as PNG
  - Share with User

#### Chat Panel (Universal)
- **Width**: ~400px (may vary slightly by artifact type)
- **Position**: Right side of screen
- **Header**: "BambooHR Assistant" with sparkle icon
- **Functionality**:
  - Display conversation history (from artifact creation)
  - Accept natural language commands to modify artifact
  - Provide contextual suggestions
  - Auto-scroll to show new messages

#### Artifact Area (Type-Specific)
- **Width**: Flexible, fills remaining space left of chat panel
- **Contents**: Varies by artifact type (see below)

## Artifact Types & Controls

### Charts/Visualizations

**Control Pattern**: Settings drawer with collapsed pill fallback

**Features**:
- **Settings Drawer** (280px wide, right side of artifact area):
  - Chart type buttons (Bar, Line, Pie, Table)
  - Measure dropdown (what to display)
  - Category dropdown (how to group)
  - Color palette selector
  - Filter options
  - Close button to collapse drawer

- **Collapsed Pills** (when drawer is closed):
  - Vertical stack in top-right of chart area
  - "Chart Settings" pill - reopens full drawer
  - "Bar" pill - change chart type
  - "Headcount" pill - change measure
  - "Department" pill - change category
  - "Green" pill - change color
  - Each pill shows current value and opens dropdown on click
  - Hover reveals downward caret

**Example**: demos/artifact-workspace-option-b-refined.html

---

### Documents (Future)

**Control Pattern**: Direct editing with lightweight formatting toolbar

**Expected Features**:
- Rich text editing area (full width minus chat)
- Floating or top-anchored toolbar:
  - Bold, italic, underline
  - Heading styles
  - Lists, alignment
  - Insert table/image
- AI can modify content via chat ("make this more formal")

---

### Org Charts (Future)

**Control Pattern**: Embedded controls on cards

**Expected Features**:
- Visual hierarchy display
- Cards showing employee info
- Embedded actions on each card:
  - Add person to team
  - Move to different manager
  - View details
- Pan/zoom for large hierarchies
- AI can restructure via chat ("add Sarah's team under this department")

---

### Tables (Future)

**Control Pattern**: Inline sort/filter with column controls

**Expected Features**:
- Data grid with sortable columns
- Column header dropdowns for filters
- Show/hide column toggles
- Inline editing of cell values (if applicable)
- Pagination or virtual scroll for large datasets
- AI can filter/transform via chat ("show only remote employees")

---

## Design Principles

### 1. Chat is Universal
The chat panel is present for all artifact types. It serves as:
- A conversational interface for modifications
- A history of how the artifact was created
- A fallback when users don't want to learn type-specific controls

### 2. Controls Match Artifact Complexity
- **High complexity** (charts): Dedicated settings panel with many options
- **Medium complexity** (tables): Inline controls on headers/cells
- **Low complexity** (docs): Minimal toolbar, mostly direct editing
- **Embedded complexity** (org charts): Controls live on the artifact itself

### 3. Progressive Disclosure
Don't show all controls at once. Examples:
- Chart settings drawer can collapse to pills
- Only show relevant controls based on artifact state
- Use dropdowns/menus to group related actions

### 4. Consistent Publishing Flow
Regardless of artifact type, the "Publish" button in the top bar provides:
- Save to Report
- Save to Dashboard
- Export
- Share with User

This ensures users always know how to finalize their work.

### 5. Auto-Save Everything
All changes are automatically saved. The "Saved" indicator provides confidence without requiring manual save actions.

## Visual Design

### Color Palette
- **Primary Green**: #2e7918 (actions, active states)
- **Light Green**: #f0f9ed (hover states, backgrounds)
- **Neutrals**: #fff (white), #f5f5f3 (background), #868180 (muted text)
- **Borders**: #e0e0e0 (standard), #d0d0d0 (hover)

### Typography
- **Font**: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **Title**: 16px, 600 weight
- **Body**: 13-14px, 400-500 weight
- **Labels**: 12px, 500 weight
- **Muted text**: 11-12px, #868180

### Spacing
- **Top Bar**: 56px height
- **Panel Padding**: 20-32px
- **Control Spacing**: 12-20px between groups
- **Chat Message Gap**: 16px

### Interactive Elements
- **Pills**: 32px height, 16px border-radius, semi-transparent with backdrop blur
- **Buttons**: 6-8px border-radius, subtle shadows
- **Dropdowns**: 8px border-radius, 4px margin from trigger
- **Transitions**: 0.15s ease for hovers, 0.3s for state changes

## Chat Integration

### Contextual Responses
When users change settings via controls, the AI acknowledges in chat:
- "I've changed the visualization to a line chart."
- "I've updated the chart to show Average Salary."
- "I've updated the chart to group by Location."
- "I've saved this chart to a report."

This creates a conversational flow and helps users understand what changed.

### Natural Language Commands
Users can ask the AI to:
- Change settings: "Show salary instead of headcount"
- Filter data: "Only show remote employees"
- Adjust styling: "Make the colors blue"
- Export: "Save this to my dashboard"

The AI updates both the artifact and the control UI to reflect changes.

## Implementation Notes

### Component Architecture (Future React Implementation)

```tsx
<ArtifactWorkspace>
  <TopBar
    onBack={handleBack}
    title={artifactTitle}
    onPublish={handlePublish}
  />

  <WorkspaceContainer>
    <ArtifactArea>
      {/* Render appropriate artifact component */}
      {artifactType === 'chart' && <ChartArtifact />}
      {artifactType === 'document' && <DocumentArtifact />}
      {artifactType === 'org-chart' && <OrgChartArtifact />}
      {artifactType === 'table' && <TableArtifact />}
    </ArtifactArea>

    <ChatPanel
      conversationId={conversationId}
      onMessage={handleChatMessage}
    />
  </WorkspaceContainer>
</ArtifactWorkspace>
```

### State Management
- Artifact-specific state (chart settings, document content, etc.)
- Chat conversation state
- Auto-save mechanism
- Undo/redo history (future)

### Routing
- `/artifact/:type/:id` - Main artifact workspace route
- Type parameter determines which artifact component to render
- ID identifies the specific artifact instance

## Future Enhancements

### Version History
- See previous versions of artifact
- Compare changes over time
- Restore to earlier version

### Real-time Collaboration
- Multiple users editing same artifact
- Presence indicators
- Cursor/selection sharing

### Templates
- Start from pre-built artifact templates
- Organization-specific templates
- Share templates across team

### Keyboard Shortcuts
- Quick actions without mouse
- Navigate between chat and artifact
- Common formatting commands

### Mobile Responsive
- Collapsible chat panel
- Touch-optimized controls
- Portrait vs landscape layouts

## References

- Working prototype: `demos/artifact-workspace-option-b-refined.html`
- Design explorations: `demos/explorations/`
- Figma design system: (link to be added)
