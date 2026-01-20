# Plan: Text Artifacts Implementation

## Overview
Add text artifact support following the same UX patterns as chart artifacts. Text artifacts will have settings pills (tone, length) and rich text editing capabilities.

## Implementation Steps

### 1. Update Data Model (`src/data/artifactData.ts`)

Add `TextSettings` interface alongside existing `ChartSettings`:

```typescript
export interface TextSettings {
  tone: 'professional' | 'casual' | 'formal' | 'friendly';
  length: 'brief' | 'standard' | 'detailed';
  format: 'paragraph' | 'bullets' | 'numbered';
}
```

Add mock text artifacts to the artifacts array with sample HR-related content (policy summaries, onboarding guides, etc.).

### 2. Update ArtifactContext (`src/contexts/ArtifactContext.tsx`)

- Add default `TextSettings` similar to existing chart defaults
- Update `updateArtifactSettings` to handle text settings
- Add helper to detect artifact type from settings

### 3. Create TextSettingsToolbar (`src/components/TextSettingsToolbar/`)

Reuse the `ToolbarDropdown` pattern from `ChartSettingsToolbar`:

**Pills/Dropdowns:**
- **Tone**: Professional, Casual, Formal, Friendly
- **Length**: Brief, Standard, Detailed
- **Format**: Paragraph, Bullets, Numbered List

Same styling: `h-8 px-3 rounded-full` buttons with caret icons.

### 4. Create TextEditor Component (`src/components/TextEditor/`)

Rich text editing with:
- Basic formatting toolbar (Bold, Italic, Underline)
- Heading levels (H1, H2, H3)
- Lists (bullet, numbered)
- Content area with editable text
- Uses `contentEditable` or simple textarea with markdown preview

### 5. Create TextDisplay Component (`src/components/TextDisplay/`)

Read-only rendering of text content for:
- InlineArtifactCard preview (truncated)
- Workspace view (full content)

### 6. Update ArtifactWorkspace (`src/pages/ArtifactWorkspace/`)

Add conditional rendering for text type:

```typescript
if (type === 'text') {
  return (
    <>
      <TextSettingsToolbar settings={settings} onSettingsChange={...} />
      <TextEditor content={artifact.content} onChange={...} />
    </>
  );
}
```

### 7. Update InlineArtifactCard (`src/components/InlineArtifactCard/`)

Add text artifact preview:
- Show truncated text content (first 200 chars)
- Different icon for text artifacts (document icon)
- Same action buttons (Copy, Edit, Publish)

### 8. Add Mock Data

Create 3-4 sample text artifacts in `artifactData.ts`:
- "PTO Policy Summary" - Professional, Standard length
- "Welcome Message for New Hires" - Friendly, Brief
- "Performance Review Template" - Formal, Detailed

## File Changes Summary

| File | Change |
|------|--------|
| `src/data/artifactData.ts` | Add TextSettings interface, mock text artifacts |
| `src/contexts/ArtifactContext.tsx` | Add text defaults, update type handling |
| `src/components/TextSettingsToolbar/` | New component (reuse toolbar pattern) |
| `src/components/TextEditor/` | New component (rich text editing) |
| `src/components/TextDisplay/` | New component (read-only rendering) |
| `src/pages/ArtifactWorkspace/` | Add text type conditional rendering |
| `src/components/InlineArtifactCard/` | Add text preview support |

## Dependencies
- No new dependencies needed
- Reuses existing patterns and components
