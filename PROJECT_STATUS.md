# BambooHR UI Template - Project Status

## Tech Stack
- React + Vite + TypeScript + Tailwind CSS v4
- Font Awesome icons + Lucide icons
- Custom fonts: Fields (headlines), Inter (body)
- Design tokens defined in `src/index.css`

## Pages Completed

### 1. Home
- Dashboard with gridlets

### 2. Directory/People (`src/pages/People/`)
- Employee cards with search, grouping by name/department/location/division, department filtering
- Mock data: 23 employees with realistic avatars from pravatar.cc

### 3. Hiring (`src/pages/Hiring/`)
- Job openings table with tabs (Job openings, Candidates, Talent pools)
- Status filter dropdown (Draft and open, Open only, Draft only)
- Mock data: 6 job openings

### 4. Analytics/Reports (`src/pages/Reports/`)
- Sidebar navigation with 13 categories
- AI question input using TextArea component with gradient border
- Suggestion question cards
- Insights section with 3 cards
- Recently viewed reports table (16 reports)
- Layout: Header at top spanning full width, sidebar + main content below

### 5. Files (`src/pages/Files/`) - NEEDS FIXES
- Sidebar with category navigation (All files, Signature Templates, Benefits Docs, Payroll, Trainings, Company Policies)
- File list with working checkboxes and select all
- Sort dropdown with actual sorting (Name A-Z/Z-A, Date Recent/Oldest, Size Largest/Smallest)
- Light green highlight on selected rows (#f0f9ed)
- File icons colored by type (red=PDF, blue=image, purple=audio)
- Mock data: 16 files in `src/data/files.ts`

## Files Page - Discrepancies to Fix
1. **"All Files" header and sort controls should be INSIDE the white card** - currently above it
2. Card structure should be:
   - Header row: "All Files" title + "Sort by" dropdown + download/delete buttons
   - Select All row: Checkbox with "Select All Files (count)"
   - File rows below

## Reusable Components Created

### TextArea (`src/components/TextArea/`)
- AI-themed input with gradient border
- Gradient: `linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)`
- Circle-arrow-up submit icon
- Props: placeholder, state, note, hasValue, hasLabel

### Icon (`src/components/Icon/`)
- Wraps Font Awesome + Lucide icons
- Recently added: folder, chevron-down, arrow-up-from-bracket, table-cells, arrow-down-to-line, trash-can, file, file-audio, image, circle-info
- Supports `style` prop for custom colors

## Global Styles (`src/index.css`)

### H1 Style
```css
h1 {
  font-family: 'Fields', system-ui, sans-serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 52px;
  color: #2e7918;
  margin: 0;
}
```

### Design Tokens
- Primary green: `--color-primary-strong: #2e7918`
- Surface colors, border colors, text colors all defined as CSS variables
- Spacing and radius tokens available

## Key Data Files
- `src/data/employees.ts` - 23 employees with departments, divisions, locations
- `src/data/jobOpenings.ts` - 6 job openings
- `src/data/analytics.ts` - Insights, reports, suggestion questions
- `src/data/files.ts` - 16 files with categories and types

## Layout Patterns

### Analytics/Files Layout
```
┌─────────────────────────────────────────────────┐
│ Header: H1 title + action buttons (full width)  │
├─────────────────────────────────────────────────┤
│ Sidebar (280px) │ Main Content (flex-1)         │
│ - Categories    │ - Content sections            │
│ - pl-8 padding  │ - pr-10 pl-6 pb-10 padding    │
└─────────────────────────────────────────────────┘
- Gray background extends behind entire page including sidebar
- No border between sidebar and content
```

## Git Repository
- Remote: https://github.com/mattcmorrell/bhr-ui-mcp.git
- All changes committed and pushed

## Next Steps
1. Fix Files page card structure (move header inside card)
2. Compare with Figma for any other discrepancies
3. Continue building remaining pages (MyInfo, Payroll if needed)
