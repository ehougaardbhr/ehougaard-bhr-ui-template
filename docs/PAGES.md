# Completed Pages

All pages use `AppLayout` with `GlobalHeader` and `GlobalNav`.

## 1. Home (`/`)

**Location**: `src/pages/Home/`

Dashboard with gridlets showing:
- Welcome section with user greeting
- Quick stats and metrics
- Action cards

## 2. My Info (`/my-info`)

**Location**: `src/pages/MyInfo/`

Personal information form with:
- Avatar display with user info
- Job information section
- Contact details
- Emergency contacts
- Mock employee profile data

## 3. People (`/people`)

**Location**: `src/pages/People/`

Employee directory with:
- Search functionality
- Group by: Name, Department, Location, Division
- Department filter dropdown
- 23 employees with realistic avatars from pravatar.cc

## 4. Hiring (`/hiring`)

**Location**: `src/pages/Hiring/`

Job openings management:
- Tabs: Job openings, Candidates, Talent pools
- Status filter: Draft and open, Open only, Draft only
- Table with 6 job openings
- Mock hiring data

## 5. Reports (`/reports`)

**Location**: `src/pages/Reports/`

Analytics and reporting interface:
- Left sidebar with 13 report categories
- AI question input with gradient border (TextArea component)
- Suggestion question cards
- Insights section with 3 cards
- Recently viewed reports table (16 reports)
- Layout: Header spans full width, sidebar + content below

## 6. Files (`/files`)

**Location**: `src/pages/Files/`

Document management system:
- Left sidebar: All files, Signature Templates, Benefits Docs, Payroll, Trainings, Company Policies
- File list with working checkboxes and select all
- Sort dropdown: Name (A-Z/Z-A), Date (Recent/Oldest), Size (Largest/Smallest)
- Light green highlight on selected rows (#f0f9ed)
- File icons colored by type (red=PDF, blue=image, purple=audio)
- 16 mock files

## 7. Payroll (`/payroll`)

**Location**: `src/pages/Payroll/`

Comprehensive payroll management:

### Responsive Date Selector
- Cards: 160px wide with 20px minimum gap
- Cards disappear completely (not partially) when viewport shrinks
- Remaining cards redistribute using `justify-between`
- Arrow button: 40x40px circular, fixed on right
- Grey 2px horizontal line behind all cards
- Selected card: Beige background with green border
- Active date: Solid green background, white text
- Idle date: Light beige background, green text
- Notification badge at top-right of icon box

### Stats Cards
Horizontal layout matching Figma Card/Info component:
- 48x48px icon boxes with beige background
- Value: 18px semibold
- Label: 13px regular
- Stats: 88 people, $1,234 extra pay, 113 timesheets

### Reminders Section
- Working checkboxes with strikethrough on completion
- Functional state management

### Updates Section
- Refresh icon (arrows-rotate)
- No grey background container

### Right Sidebar
- Start payroll button: 48px height, 18px text
- 44x44px icon containers
- Global button styles

### Dark Mode Support
All colors use CSS variables that swap via `:root.dark`

### Mock Data
12 payroll dates (Jan-April), stats, reminders, details in `src/data/payrollData.ts`

## 8. Settings (`/settings`)

**Location**: `src/pages/Settings/`

Two-column settings interface:

### Left Sidebar (280px)
- 27 settings categories with icons
- Hover states: Green text + white background
- Icons: lock, thumbs-up, heart, sliders, bell, spa, palette, door-open, door-closed, chart-line, plane, graduation-cap, shield, check-circle, link

### Main Content
White card with Account section:
- Account header: Company name, account #, URL, owner info
- Vertical sub-tabs: Account Info, Billing, ACA Settings, etc.
- Selected state: Light gray background

### My Subscription Section
- Pro package card
- Add-Ons: Payroll, Time Tracking
- Job Postings + File Storage combined card

### Available Upgrades
- Elite, Benefits Administration, Global Employment cards
- Light gray icon backgrounds
- "Supercharge Your Workflow" promotional card

### Data Section
Data center location information

### Active State
Settings gear icon in GlobalHeader shows selected state (gray background + green icon) when on `/settings`

### Mock Data
Settings navigation items, account info, subscription details in `src/data/settingsData.ts`
