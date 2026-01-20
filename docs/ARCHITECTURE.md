# Architecture & Tech Stack

## Tech Stack

- **React 18** + **TypeScript** - Modern UI framework with type safety
- **Vite** - Fast build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **React Router** - Client-side routing
- **Framer Motion** - Advanced animations
- **Font Awesome Free** + **Lucide** - Icon libraries

## Design Tokens

All design tokens are defined in `src/index.css` as CSS variables:

```css
:root {
  /* Colors */
  --color-primary-strong: #2e7918;
  --surface-neutral-white: #ffffff;
  --surface-neutral-xx-weak: #f5f1ee;
  --border-neutral-weak: #ddd6d0;
  --text-neutral-strong: #38312f;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Border Radius */
  --radius-xx-small: 4px;
  --radius-small: 8px;
  --radius-medium: 12px;
  --radius-large: 16px;
}
```

## Dark Mode

Dark mode uses CSS variables with a `:root.dark` selector:

```css
:root.dark {
  --surface-neutral-white: #1a1a1a;
  --surface-neutral-xx-weak: #242422;
  --border-neutral-x-weak: #424039;
  --text-neutral-strong: #d5d0cd;
}
```

**Important**: Do NOT use Tailwind `dark:` prefix classes—they don't work with this setup. Always use CSS variables like `var(--surface-neutral-white)`.

## Typography

- **Headlines**: Fields font (custom)
- **Body text**: Inter font (custom)
- **H1 style**: 44px/52px, Fields, bold, primary green

## Global Styles

H1 element has default styling:
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

## Layout Patterns

### Standard Page Layout
```
┌─────────────────────────────────────────────┐
│ GlobalHeader (search, inbox, help, settings)│
├──────┬──────────────────────────────────────┤
│ Nav  │ Page Content                         │
│ (56) │                                      │
│      │                                      │
└──────┴──────────────────────────────────────┘
```

### Sidebar + Content Layout (Analytics, Files)
```
┌─────────────────────────────────────────────┐
│ Header: H1 title + action buttons (full)   │
├──────────┬──────────────────────────────────┤
│ Sidebar  │ Main Content (flex-1)            │
│ (280px)  │ - Content sections               │
│ - pl-8   │ - pr-10 pl-6 pb-10               │
└──────────┴──────────────────────────────────┘
```

## Responsive Patterns

### Date Selector (Payroll page)
Cards disappear completely (not partially) when viewport shrinks:
- Card width: 160px
- Minimum gap: 20px
- Uses ResizeObserver to calculate visible cards
- Remaining cards redistribute using `justify-between`

### Navigation
- Desktop: Can toggle expand/collapse (saved to localStorage)
- Tablet (<1024px): Always collapsed

## Git Strategy

### Branches
- **`main`** - Clean template with stable features
- **`experiments`** - Experimental features (current work)
- Feature branches can merge back to `main` via Pull Requests

### Workflow
```bash
# Work on experiments
git checkout experiments
# ... make changes ...
git commit -m "Add new feature"
git push origin experiments

# Merge to main when stable
git checkout main
git merge experiments
git push origin main
```

## Project Structure

```
src/
├── assets/
│   ├── fonts/              # Fields + Inter fonts (embedded)
│   └── images/             # Logos and avatars
├── components/             # Reusable UI components
│   ├── GlobalHeader/
│   ├── GlobalNav/
│   ├── AIChatPanel/
│   └── [many more]/
├── contexts/               # React Context providers
│   ├── ChatContext.tsx
│   └── ArtifactContext.tsx
├── data/                   # Mock data files
│   ├── employees.ts
│   ├── chatData.ts
│   └── artifactData.ts
├── layouts/
│   └── AppLayout.tsx       # Main layout shell
├── pages/                  # Page components
│   ├── Home/
│   ├── MyInfo/
│   └── [others]/
└── index.css               # Design tokens + global styles
```

## Data Files

All mock data lives in `src/data/`:
- `employees.ts` - 23 employees with departments, locations
- `jobOpenings.ts` - 6 job openings
- `analytics.ts` - Reports, insights, questions
- `files.ts` - 16 files with categories
- `payrollData.ts` - Dates, stats, reminders
- `settingsData.ts` - Navigation items, account info
- `chatData.ts` - 15 mock conversations
- `artifactData.ts` - Chart definitions and data

## Key Dependencies

```json
{
  "react": "^18.3.1",
  "react-router-dom": "^7.1.1",
  "framer-motion": "^11.18.0",
  "@fortawesome/fontawesome-free": "^6.7.2",
  "lucide-react": "^0.468.0",
  "tailwindcss": "^4.0.0"
}
```
