# Copilot Instructions for vu-frontend

## Project Overview
React 19 frontend application built with Vite 7. This is a graduation project frontend in early development stage.

## Tech Stack
- **Framework**: React 19 with JSX (not TypeScript)
- **Build Tool**: Vite 7 with `@vitejs/plugin-react`
- **Styling**: Tailwind CSS 4 (installed, needs configuration in `src/index.css`)
- **Linting**: ESLint 9 with flat config, React Hooks plugin, React Refresh plugin
- **Formatting**: Prettier

## Development Commands
```bash
npm run dev      # Start dev server with HMR
npm run build    # Production build to dist/
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
```

## Project Structure
```
src/
├── main.jsx      # App entry point, renders into #root with StrictMode
├── App.jsx       # Root component
├── index.css     # Global styles (add Tailwind directives here)
├── App.css       # Component-specific styles
└── assets/       # Static assets imported in components
public/           # Static files served at root (favicon, etc.)
```

## Code Conventions

### Component Pattern
- Use function components with hooks (no class components)
- Export components as default: `export default ComponentName`
- Use named imports for React hooks: `import { useState } from 'react'`

### ESLint Rules
- Unused variables error except those starting with uppercase or underscore (`varsIgnorePattern: '^[A-Z_]'`)
- React Hooks rules enforced (exhaustive deps, rules of hooks)
- React Refresh compatibility required for HMR

### File Organization
- Components in `.jsx` files
- CSS imports at component level when component-specific
- Assets imported directly in components: `import logo from './assets/logo.svg'`
- Public assets referenced with absolute path: `src="/vite.svg"`

## Setup Notes
- Tailwind CSS 4 is installed but requires setup. Add to `src/index.css`:
  ```css
  @import "tailwindcss";
  ```
- No routing or state management libraries installed yet
- No API client configured yet

## When Adding Features
- Place new components in `src/` (consider creating `src/components/` for organization)
- Use Tailwind utility classes for styling when possible
- Ensure components are compatible with React Refresh for HMR
