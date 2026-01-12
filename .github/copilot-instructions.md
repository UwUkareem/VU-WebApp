# Copilot Instructions for VU Frontend

## Project Overview

**VU** is an AI-powered virtual interview platform enabling interactive interviews with real-time feedback. Two distinct modes serve different users:

- **Practice Mode** – Job seekers conduct mock interviews with AI coaching and skill analytics
- **Recruitment Mode** – Companies use AI-led interviews for candidate screening and ranking

This is a React 19 SPA built with Vite 7, styled with Tailwind CSS 4, and design-first approach via Figma.

## Tech Stack & Commands

| Tool             | Version         | Command                                       |
| ---------------- | --------------- | --------------------------------------------- |
| **React**        | 19              | `npm run dev` – dev server with HMR           |
| **Vite**         | 7               | `npm run build` – production build            |
| **Tailwind CSS** | 4               | `npm run lint` – ESLint validation            |
| **ESLint**       | 9 (flat config) | `npm run preview` – preview prod build        |
| **Prettier**     | 3.7             | Auto-formats on save (includes Tailwind sort) |

**Design reference**: [Figma – VU-WebApp](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp)

## Architecture & File Structure

```
src/
├── components/ui/
│   ├── Button/           # Exported as named export via index.js
│   │   ├── Button.jsx    # Variant props: primary|secondary|ghost
│   │   ├── Button.css    # Per-component CSS w/ token variables
│   │   └── index.js      # Re-exported for barrel import
│   └── index.js          # Central UI export: export { Button }
├── components/layout/    # Header, nav, sidebar – page structure
├── pages/                # Top-level route components
├── styles/
│   ├── index.css         # Tailwind directives + design layer
│   └── tokens.css        # 460+ CSS custom properties from Figma
└── assets/               # Static images, icons
```

## Component Patterns

### UI Components (Reusable)

- **Location**: `src/components/ui/{ComponentName}/`
- **Props**: Use PropTypes validation (e.g., `Button` has `variant`, `disabled`, `iconLeft/Right`)
- **Exports**: Named exports from `ComponentName.jsx`, re-exported via `index.js`
- **Example**: `Button` accepts `className` prop for Tailwind extensions

### Design Token Integration

- CSS variables defined in `tokens.css` (e.g., `--btn-height`, `--btn-primary-bg`)
- Components apply via CSS: `.btn--primary { background-color: var(--btn-primary-bg); }`
- Tailwind can reference tokens: `bg-[var(--btn-primary-bg)]` (if needed for utilities)

### Styling Approach

- **Utility-first**: Prefer Tailwind classes in JSX
- **Component CSS**: Scope styles to `.btn`, `.btn--variant`, `.btn__icon` (BEM-like)
- **No inline styles** in production (App.jsx demo uses `style={}` for layout examples only)
- **Prettier sorts classes** automatically per Tailwind plugin

## Key Conventions

| Pattern            | Rule                                          | Example                               |
| ------------------ | --------------------------------------------- | ------------------------------------- |
| **Imports**        | Named for hooks/utils; default for components | `import { Button } from '../ui'`      |
| **Props**          | Use PropTypes for validation                  | See `Button.propTypes`                |
| **Variants**       | Validation array + fallback                   | `VARIANTS = ['primary', 'secondary']` |
| **Icons**          | Lucide React (`lucide-react` package)         | `<Info size={16} />`                  |
| **Disabled state** | Always handle in CSS (`:disabled` pseudo)     | `.btn:disabled { opacity: 0.6; }`     |

## Component Development Workflow

1. **Create folder**: `src/components/ui/NewComponent/`
2. **Create files**: `NewComponent.jsx`, `NewComponent.css`, `index.js`
3. **Define PropTypes** in the `.jsx` file
4. **Style with CSS tokens** from `tokens.css` (e.g., `var(--text-md)`)
5. **Export from barrel**: Add to `src/components/ui/index.js`
6. **Import where needed**: `import { NewComponent } from '../ui'`

## Related Backend

- **Backend repo**: [VU-WebApp (API services)](https://github.com/UwUkareem/VU-WebApp.git)
- **Assumed endpoints**: Authentication, interview data, feedback submission (to be integrated)
