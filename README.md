# BambooHR UI Template

A pixel-perfect recreation of the BambooHR application interface, built as a template for IXD (Interaction Design) exploration.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Font Awesome Free** + **Lucide** - Icon libraries

## Features

- ✅ 7 main pages (Home, My Info, People, Hiring, Reports, Files, Payroll)
- ✅ Collapsible navigation with localStorage persistence
- ✅ Responsive design (desktop + tablet, 768px minimum)
- ✅ Custom Fields & Inter fonts embedded (no external dependencies)
- ✅ Design tokens from Figma (colors, spacing, typography, shadows)
- ✅ Pixel-perfect Home dashboard with gridlet layout

## Getting Started

### Install dependencies
```bash
npm install
```

### Run development server
```bash
npm run dev
```

### Build for production
```bash
npm run build
```

### Preview production build
```bash
npm run preview
```

## Project Structure

```
src/
├── assets/
│   ├── fonts/          # Fields + Inter fonts (embedded)
│   └── images/         # Logos and avatars
├── components/
│   ├── Avatar/
│   ├── Button/
│   ├── GlobalHeader/   # Top bar with search
│   ├── GlobalNav/      # Collapsible sidebar
│   ├── Gridlet/        # Dashboard card widget
│   ├── Icon/           # Icon wrapper
│   └── TextHeadline/   # Typography component
├── layouts/
│   └── AppLayout.tsx   # Main layout shell
├── pages/
│   ├── Home/           # Dashboard (fully implemented)
│   ├── MyInfo/         # Placeholder
│   ├── People/         # Placeholder
│   ├── Hiring/         # Placeholder
│   ├── Reports/        # Placeholder
│   ├── Files/          # Placeholder
│   └── Payroll/        # Placeholder
└── index.css           # Design tokens + Tailwind config
```

## Design System

All design tokens are extracted from Figma and defined in `src/index.css`:

- **Colors**: Primary green (#2e7918), neutral grays
- **Spacing**: 4px base scale (xxs to xxxl)
- **Typography**: Fields (headlines), Inter (body text)
- **Border Radius**: 8px to 24px scale
- **Shadows**: Subtle depth with rgba shadows

## Navigation Features

- **Expand/Collapse**: Toggle button at bottom of nav (desktop only)
- **Active States**: Highlighted nav item based on current route
- **Tablet Behavior**: Always collapsed on screens < 1024px
- **Persistence**: Nav state saved to localStorage

## License

This is a template project for design exploration.
