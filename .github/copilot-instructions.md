# Copilot Instructions for VU Frontend

## Project Overview

VU is an AI-powered virtual interview platform with two modes:

- **Practice Mode** - For job seekers to practice with AI coaching
- **Recruitment Mode** - For companies to screen candidates with AI

Built with React 19, Vite 7, and Tailwind CSS 4. UI-first development using Figma design system.

## Tech Stack

- **Framework**: React 19 with JSX (not TypeScript)
- **Build Tool**: Vite 7 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS 4 with design tokens from Figma
- **Linting**: ESLint 9 flat config + React Hooks plugin
- **Formatting**: Prettier with `prettier-plugin-tailwindcss`

## Development Commands

```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI (buttons, inputs, cards, modals)
│   └── layout/       # Layout (header, sidebar, footer, navigation)
├── pages/            # Page-level components (route views)
├── styles/
│   ├── index.css     # Tailwind entry with @layer directives
│   └── tokens.css    # Figma design tokens (CSS variables)
└── assets/           # Images, icons, fonts
```

## Code Conventions

### Components

- Function components with hooks only
- Default exports: `export default ComponentName`
- One component per file, PascalCase naming
- Named imports for hooks: `import { useState } from 'react'`

### Styling

- Tailwind utility classes in JSX
- Design tokens in `src/styles/tokens.css`
- Prettier auto-sorts Tailwind classes

### File Naming

- Components: `Button.jsx`, `InterviewCard.jsx`
- Pages: `HomePage.jsx`, `DashboardPage.jsx`

## Key Features to Implement

- Video interview interface
- AI feedback displays
- Analytics dashboards
- Candidate/recruiter dashboards
- Authentication flows
- Utils: `src/utils/formatDate.js`

## Figma Integration

1. Export design tokens from Figma (colors, typography, spacing)
2. Add CSS variables to `src/styles/tokens.css`
3. Reference in Tailwind or components: `var(--color-primary)`

## When Adding Features

- Components go in appropriate subfolder under `src/components/`
- Pages go in `src/pages/`
- Keep components small and focused
- Use Tailwind utilities; avoid inline styles
