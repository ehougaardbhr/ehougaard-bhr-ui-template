# BambooHR UI Template - Project Status

## Tech Stack
- React + Vite + TypeScript + Tailwind CSS v4
- Font Awesome icons + Lucide icons
- Custom fonts: Fields (headlines), Inter (body)
- Design tokens defined in `src/index.css`
- React Router for navigation

## Pages Completed

### 1. Home (`src/pages/Home/`)
- Dashboard with gridlets
- Welcome section

### 2. My Info (`src/pages/MyInfo/`)
- Personal information form with multiple sections
- Job information, contact details, emergency contacts
- Avatar display with user info
- Mock data: Employee profile information

### 3. Directory/People (`src/pages/People/`)
- Employee cards with search, grouping by name/department/location/division, department filtering
- Mock data: 23 employees with realistic avatars from pravatar.cc

### 4. Hiring (`src/pages/Hiring/`)
- Job openings table with tabs (Job openings, Candidates, Talent pools)
- Status filter dropdown (Draft and open, Open only, Draft only)
- Mock data: 6 job openings

### 5. Analytics/Reports (`src/pages/Reports/`)
- Sidebar navigation with 13 categories
- AI question input using TextArea component with gradient border
- Suggestion question cards
- Insights section with 3 cards
- Recently viewed reports table (16 reports)
- Layout: Header at top spanning full width, sidebar + main content below

### 6. Files (`src/pages/Files/`)
- Sidebar with category navigation (All files, Signature Templates, Benefits Docs, Payroll, Trainings, Company Policies)
- File list with working checkboxes and select all
- Sort dropdown with actual sorting (Name A-Z/Z-A, Date Recent/Oldest, Size Largest/Smallest)
- Light green highlight on selected rows (#f0f9ed)
- File icons colored by type (red=PDF, blue=image, purple=audio)
- Mock data: 16 files in `src/data/files.ts`

### 7. Payroll (`src/pages/Payroll/`)
- **Responsive date selector** with ResizeObserver-based card visibility:
  - Cards are 160px wide with 20px minimum gap
  - Cards disappear completely (not partially) when viewport shrinks
  - Remaining cards redistribute using justify-between
  - Arrow button (40x40px circular) fixed on right
  - Grey 2px horizontal line behind all cards
  - Selected card: beige background (`--surface-neutral-xx-weak`) with green border
  - Active date number box: solid green background with white text
  - Idle date number box: light beige background with green text
  - Notification badge positioned at top-right of icon box
- **Stats cards** (horizontal layout matching Card/Info Figma component):
  - 48x48px icon boxes with `--surface-neutral-xx-weak` background
  - Value: 18px semibold, Label: 13px regular
  - Stats: 88 people, $1,234 extra pay, 113 timesheets
- **Functional reminders** section with working checkboxes and strikethrough on completion
- **Updates section** with arrows-rotate (refresh) icon, no grey background container
- **Right sidebar**: Start payroll button (48px, 18px text), 44x44px icon containers, global button styles
- **Dark mode support**: All colors use CSS variables that swap via `:root.dark`
- Mock data: 12 payroll dates (Jan-April), stats, reminders, details in `src/data/payrollData.ts`

### 8. Settings (`src/pages/Settings/`)
- Two-column layout: Left sidebar (280px) + Main content card
- **Left sidebar**: 27 settings navigation categories with icons and hover states (green text + white background)
- **Main content**: White card with Account section
- Account header with company name, account #, URL, and owner info
- Vertical sub-tabs (Account Info, Billing, ACA Settings, etc.) with selected state (light gray background)
- **My Subscription section**: Pro package card, Add-Ons (Payroll, Time Tracking), Job Postings + File Storage combined card
- **Available Upgrades**: Elite, Benefits Administration, Global Employment cards with light gray icon backgrounds
- Supercharge Your Workflow promotional card
- Data section with data center location
- Mock data: Settings nav items, account info, subscription details in `src/data/settingsData.ts`
- Settings gear icon in GlobalHeader shows selected state (gray background + green icon) when on /settings

## Reusable Components Created

### TextArea (`src/components/TextArea/`)
- AI-themed input with gradient border
- Gradient: `linear-gradient(93deg, #87C276 0%, #7AB8EE 33.65%, #C198D4 66.83%, #F2A766 96.15%)`
- Circle-arrow-up submit icon
- Props: placeholder, state, note, hasValue, hasLabel

### Icon (`src/components/Icon/`)
- Wraps Font Awesome + Lucide icons
- **Settings page icons**: lock, thumbs-up, heart, sliders, bell, spa, palette, door-open, door-closed, chart-line, plane, graduation-cap, shield, check-circle, link
- **Payroll page icons**: chevron-right, arrows-rotate (refresh icon for Updates section)
- **Other icons**: folder, chevron-down, arrow-up-from-bracket, table-cells, arrow-down-to-line, trash-can, file, file-audio, image, circle-info
- Supports `style` prop for custom colors
- Lucide icons: PanelLeftOpen, PanelLeftClose, Home, UserCircle, Users, IdCard, PieChart, FileText, CircleDollarSign, Sun, Moon

### ProgressBar (`src/components/ProgressBar/`)
- Created for Settings page (not yet implemented in UI)
- Horizontal bar with fill percentage
- Props: value, max, label, color

### GlobalHeader (`src/components/GlobalHeader/`)
- Logo, search bar, utility icons (inbox, help, settings)
- Settings gear icon shows selected state when on /settings (gray background + green icon)
- Uses `useLocation` to detect current route

### GlobalNav (`src/components/GlobalNav/`)
- Collapsible left navigation with 7 items: Home, My Info, People, Hiring, Reports, Files, Payroll
- Selected state: Gray background + green icon + bold text
- Theme toggle button (sun/moon icon)
- Account section with avatar
- Expand/collapse functionality with localStorage persistence

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
- **Dark mode variables** in `:root.dark` selector:
  - `--surface-neutral-white: #1a1a1a`
  - `--surface-neutral-xx-weak: #242422`
  - `--border-neutral-x-weak: #424039`
  - `--text-neutral-strong: #d5d0cd`

## Key Data Files
- `src/data/employees.ts` - 23 employees with departments, divisions, locations
- `src/data/jobOpenings.ts` - 6 job openings
- `src/data/analytics.ts` - Insights, reports, suggestion questions
- `src/data/files.ts` - 16 files with categories and types
- `src/data/payrollData.ts` - 12 payroll dates (Jan-April for wide screens), stats, reminders (with functional checkboxes), details
- `src/data/settingsData.ts` - Settings navigation items (27 categories), account info, subscription, add-ons, upgrades

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

## Dark Mode Implementation
- Uses CSS variables defined in `src/index.css` with `:root.dark` selector
- All components should use CSS variables like `var(--surface-neutral-white)` instead of hardcoded colors
- Do NOT use Tailwind `dark:` prefix classes - they don't work correctly with this setup
- Variables automatically swap values when `.dark` class is on root element

## Responsive Patterns

### Date Selector (Payroll page)
```tsx
const CARD_WIDTH = 160;
const MIN_GAP = 20;
const BUTTON_WIDTH = 40;

// ResizeObserver calculates how many cards fit
const availableWidth = containerWidth - BUTTON_WIDTH - MIN_GAP;
const maxCards = Math.floor((availableWidth + MIN_GAP) / (CARD_WIDTH + MIN_GAP));
const visibleDates = payrollDates.slice(0, visibleCardCount);

// Cards use justify-between to distribute evenly
<div className="flex items-center justify-between flex-1">
  {visibleDates.map(...)}
</div>
```

## AI Chat Feature (In Progress)

### Overview
Building a dual-mode AI chat interface:
1. **Slide-in panel** - Appears on right side of any page when "Ask" button clicked
2. **Full-screen view** - Dedicated route with sidebar navigation

### Components Created

#### AIChatPanel (`src/components/AIChatPanel/`)
- Slide-in panel (399px wide) on right side with beige border container
- Header with conversation title dropdown, expand button, close button
- Message display with user bubbles (right-aligned, white background) and AI responses
- Input area with gradient border (86px height), textarea, paperclip/image/microphone icons
- Expand button navigates to `/chat/:conversationId`
- State persisted in localStorage: `bhr-chat-panel-open`

#### ChatContext (`src/contexts/ChatContext.tsx`)
- Centralized state management for conversations
- Actions: `createNewChat`, `selectConversation`, `addMessage`
- localStorage persistence for selected conversation
- Search/filter functionality for conversation list

#### ChatSidebar (`src/components/ChatSidebar/`)
- 280px wide sidebar for full-screen chat view
- Header: Green sparkle icon, collapse button (arrows inward), close button
- New Chat button creates empty conversation
- "Chats" section with search functionality
- Scrollable conversation list with active state highlighting
- No borders (removed for cleaner look)

#### ChatContent (`src/components/ChatContent/`)
- Main chat display area with rounded grey background (20px radius)
- User messages: white bubbles, no border, right-aligned
- AI messages: "BambooHR Assistant" label with green sparkle icon, left-aligned
- Suggestion chips after AI responses
- Input: pill-shaped white container (max-width 800px) with shadow on grey background
- Auto-expanding textarea

#### Chat Page (`src/pages/Chat/`)
- Full-screen chat view at `/chat` and `/chat/:conversationId`
- No GlobalHeader, no GlobalNav - completely standalone
- Two-column layout: ChatSidebar (280px) + ChatContent (flex-1)
- URL-driven conversation selection

### Navigation Flow
1. User clicks "Ask" button in GlobalHeader → slide-in panel opens
2. User clicks expand icon → navigates to `/chat/:id`, panel closes
3. User clicks collapse (arrows) → returns to home with slide-in panel open
4. User clicks X → returns to home with chat completely closed

### Data
- `src/data/chatData.ts` - 15 mock conversations (Employee Onboarding, PTO Policy, Benefits, etc.)
- Interfaces: `ChatMessage`, `ChatConversation`

### Transition Research (Demo Pages)

#### `/chat-transitions-demo`
Testing 5 different transition styles for panel → full-screen:
1. **Expand** - Panel physically grows from right edge (380px → full width)
2. **Slide Handoff** - Panel exits left, full-screen enters from right
3. **Slide Fade** - Panel fades in place, full-screen slides over from right
4. **Zoom** - Panel zooms/scales out from right (0.95 → 1.0 scale)
5. **Crossfade** - Simple opacity transition

**Current speeds**: 2.7 seconds (slowed 9x for analysis)
**Findings**:
- Expand and Zoom anchored to right edge work smoothly
- Slide-handoff avoids conflicting motion
- All transitions use `ease-out` timing

#### `/text-reflow-demo-2`
Testing 7 solutions for text reflow during expansion:
1. **None** - Standard behavior (distracting line jumps)
2. **Never Reflow** - Fixed 600px width, content never reflows
3. **Slide Away/Back** - Content slides off during transition
4. **Scale Transform** - Content scales (0.95) instead of reflowing
5. **Delayed Reveal** - Fade out → animate → fade in
6. **Shell Only** - Container animates, content "snaps" at end
7. **Crossfade Layouts** - Two versions (narrow/wide) crossfade

**Problem**: Text wrapping/unwrapping during width changes draws eye away from main animation
**Goal**: Find solution that keeps focus on panel expansion, not text reflow

### Current Status (Main Branch)
- ✅ Slide-in panel functional with localStorage persistence
- ✅ Full-screen view with sidebar navigation
- ✅ Conversation list, search, new chat working
- ✅ URL routing and state management
- ✅ Expand/collapse buttons wired correctly
- ✅ Production animation implemented (700ms, cubic-bezier(0.25, 0.8, 0.25, 1))
- ✅ Panel expands in-place without route change
- ✅ Sidebar emerges with smooth width/opacity transition

### Experimental Features (Experiments Branch)

#### Artifacts Section
- **Location**: Full-screen chat sidebar, above Chats list
- **Purpose**: Display user-generated content (charts, reports, images)
- **Layout**:
  - 3x3 grid of artifact thumbnails (colored boxes with icons)
  - Shows 3 artifacts initially (1 row)
  - "See more" expands to 9 artifacts (3 rows)
  - "See less" collapses back to 3
- **Styling**:
  - Blue link color (#0066CC) for "See more/less"
  - Placeholder artifacts with colored backgrounds (green, blue, purple, orange)
  - Icons: chart-line, file-lines, image, chart-pie, etc.
- **Status**: Non-clickable placeholders, ready for real data integration

### Technical Details
- Animations use CSS transitions with custom durations (700ms)
- Easing: `cubic-bezier(0.25, 0.8, 0.25, 1)` for smooth deceleration
- Right-edge anchoring: `right: 16px` stays constant, width expands leftward
- Transform origin: `right center` for zoom effects
- Sidebar width: 0 → 280px with synchronized opacity
- Background: Grey rounded container (20px radius) on white outer padding

## Branch Strategy
- **`main` branch** - Clean template with completed features
- **`experiments` branch** - Experimental features like Artifacts
- Contributors can create feature branches and merge back to `main` via Pull Requests

## Next Steps
1. ~~Choose final transition style and text reflow solution~~ ✅ Completed
2. ~~Apply chosen transition to production Chat components~~ ✅ Completed
3. ~~Speed up animations to production speed~~ ✅ Completed (700ms)
4. Test dark mode compatibility for all chat components
5. Polish any remaining styling details
6. **Experiments**: Make Artifacts clickable and integrate with real data
