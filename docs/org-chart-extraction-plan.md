# Org Chart Extraction Plan

## Context

We've built an improved org chart component in the `experiments` branch as part of the artifacts system. We want to extract just the org chart functionality and merge it into `main` branch to add to the People section, WITHOUT bringing over any of the artifact system work.

## Current State

- **Main branch**: Has a directory page in People section, no org chart
- **Experiments branch**: Has full org chart implementation integrated into the artifact system
- **Goal**: Add org chart as new functionality in People section on main branch

## Key Questions to Answer

1. ✅ Does the main branch already have a People section with an org chart page?
   - **Answer**: No, it has a directory page

2. ✅ Are you planning to replace existing org chart functionality or add this as new?
   - **Answer**: Add as new

3. ❓ Do the org chart components have dependencies on the artifact system?
   - **Status**: Unknown - needs analysis

## Extraction Approaches

### Option 1: Cherry-pick Specific Commits

If the org chart commits are relatively independent, cherry-pick them onto main:

```bash
# Switch to main and update it
git checkout main
git pull origin main

# Create a new branch for the org chart work
git checkout -b feature/org-chart-improvements

# Cherry-pick specific commits (from the git log)
git cherry-pick <commit-hash-1>
git cherry-pick <commit-hash-2>
# etc.
```

**Pros**: Preserves commit history
**Cons**: Only works if commits are cleanly separated

### Option 2: Create New Branch and Copy Files

If the org chart components are self-contained, manually copy them:

```bash
# From main, create new branch
git checkout main
git checkout -b feature/org-chart-components

# Copy just the org chart files from experiments
git checkout experiments -- src/components/OrgChart/
git checkout experiments -- src/utils/orgChartLayout.ts
git checkout experiments -- src/data/employees.ts  # if needed

# Review and commit
git status
git commit -m "Add improved org chart components"
```

**Pros**: Clean separation, easy to control what gets included
**Cons**: Loses commit history, may need manual conflict resolution

### Option 3: Interactive Rebase

Pick exactly which commits to include:

```bash
# Create new branch from main
git checkout main
git checkout -b feature/org-chart-only

# Rebase interactively, picking only org chart commits
git rebase -i main experiments
# In the editor, mark only org chart commits as 'pick', others as 'drop'
```

**Pros**: Most surgical approach, preserves some history
**Cons**: Can be complex if commits are intermingled

## Analysis Needed

Before proceeding, we need to analyze the codebase to understand dependencies:

### 1. Compare Branches Locally
Use git commands to see what files changed between main and experiments:
```bash
git diff main experiments --name-only
git diff main experiments --stat
```

### 2. Analyze Imports/Dependencies
Read the org chart files and trace their import statements:
- Check what `OrgChartArtifact.tsx` imports
- Check what all files in `src/components/OrgChart/` import
- Identify external dependencies vs internal dependencies

### 3. Search for Cross-References
Use Grep to find where org chart components are referenced:
- Search for imports of org chart components
- Find all references to org chart in routing
- Identify coupling with artifact context providers

### 4. Check File Structure
Use Glob to identify all related files:
- List all org chart-related files
- List all artifact-related files
- Identify shared utilities and data files

### 5. Categorize Files

After analysis, categorize all relevant files into:

#### Pure Org Chart Files
Files that can be copied directly with no modifications
- Likely: `OrgChartNode.tsx`, `OrgChartTree.tsx`, `OrgChartControls.tsx`, etc.
- Likely: `orgChartLayout.ts`

#### Files Needing Adaptation
Files that need changes to work standalone
- **Likely**: `OrgChartArtifact.tsx` - probably tightly coupled to artifact system
  - May need to create `OrgChartPage.tsx` as a standalone version
  - Need to replace artifact routing with People section routing
  - Need to replace artifact context with local state or People context

#### Shared Dependencies
Files that both systems need
- Design tokens (already in main)
- Utility functions
- Employee data structure
- Type definitions

### 6. Identify Artifact-Specific Coupling

Check for dependencies on:
- **Routing**: Does it use artifact-specific routes? (`/artifact/org-chart/:id`)
- **Context**: Does it use `ArtifactContext` or other artifact providers?
- **Data structures**: Does it use `Artifact` type or `OrgChartSettings` tied to artifacts?
- **Parent components**: Is it wrapped in artifact-specific containers?

## Expected Adaptations

Based on typical patterns, we'll likely need to:

1. **Create standalone page component**: Convert `OrgChartArtifact.tsx` → `OrgChartPage.tsx`
   - Remove artifact context dependencies
   - Replace with People section routing
   - Adapt state management to work without artifact settings

2. **Update routing**: Add org chart routes to People section
   - May need to add to `src/pages/People/` or similar

3. **Adapt data flow**:
   - Remove dependency on artifact settings
   - Create local state or context for org chart settings
   - Ensure employee data is accessible

4. **Update imports**: Fix any import paths that reference artifact-specific code

## Next Steps

1. ✅ Complete org chart behavior refinements in experiments branch
2. ⏳ Run dependency analysis (using approach outlined above)
3. ⏳ Create detailed file list with categorization
4. ⏳ Identify required adaptations
5. ⏳ Choose extraction approach based on findings
6. ⏳ Execute extraction and test in main branch
7. ⏳ Create PR to merge org chart into main

## Related Files

- All org chart components: `src/components/OrgChart/*.tsx`
- Layout utilities: `src/utils/orgChartLayout.ts`
- Employee data: `src/data/employees.ts`
- Artifact integration: `src/pages/ArtifactWorkspace/ArtifactWorkspace.tsx`
- Org chart artifact wrapper: `src/components/OrgChart/OrgChartArtifact.tsx`

## Tailwind v4 Dark Mode Note

The org chart requires the Tailwind v4 dark mode configuration we added:
```css
/* In src/index.css */
@variant dark (&:where(.dark, .dark *));
```

This should already be compatible with main branch, but verify when merging.
