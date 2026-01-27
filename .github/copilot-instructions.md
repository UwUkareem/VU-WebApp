# Copilot Instructions for VU Frontend

## Project Overview

**VU** is an AI-powered virtual interview platform with two modes: **Practice Mode** (job seekers, mock interviews) and **Recruitment Mode** (companies, AI-led candidate screening). This is a React 19 SPA with Vite 7, Tailwind CSS 4, and a design-first approach from [Figma](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp).

## Tech Stack

- **React 19** + **Vite 7** (HMR dev server)
- **Tailwind CSS 4** with custom design tokens (460+ CSS variables in `src/styles/tokens.css`)
- **ESLint 9** (flat config) + **Prettier 3.7** (auto-formats, sorts Tailwind classes via `prettier-plugin-tailwindcss`)
- **Lucide React** for icons
- **PropTypes** for runtime prop validation (required for all components)

## Development Commands

```bash
npm run dev       # Dev server on http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint validation
```

**Note**: Prettier runs on save in VS Code. Tailwind classes are auto-sorted - don't manually reorder them.

## Architecture & File Organization

```
src/
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Input, Badge, Cards, etc.)
│   │   ├── Button/
│   │   │   ├── Button.jsx  # Component logic + PropTypes
│   │   │   ├── Button.css  # BEM-like CSS with design tokens
│   │   │   └── index.js    # Re-export: export { Button } from './Button'
│   │   └── index.js        # Barrel export for all UI components
│   └── layout/             # Layout components (PageLayout, Navbar, Sidebar, Shortcuts)
│       ├── PageLayout/     # Main app shell wrapper (sidebar + navbar + content)
│       └── index.js        # Barrel export for layout components
├── pages/                  # Route-level page components
│   ├── Candidates/         # Candidates page (Pipeline, Overview tabs)
│   ├── Jobs/               # Jobs management
│   ├── Mocks/              # Mock interviews
│   ├── CompanyTeam/        # Company & Team settings
│   ├── Profile/            # User profile
│   └── _showcase/          # Component showcase/demo (formerly App.jsx content)
├── styles/
│   ├── index.css           # Tailwind import + global styles
│   └── tokens.css          # Figma-exported CSS variables (--btn-*, --color-*, --size-*)
└── assets/                 # Static images, icons
```

**Key Files**:

- `src/components/ui/index.js` - Central barrel export. Always add new UI components here.
- `src/components/layout/PageLayout/` - Main app shell used by all pages (sidebar + navbar + content area).
- `src/styles/tokens.css` - Single source of truth for design values. Use these variables, don't hardcode colors/sizes.
- `src/pages/_showcase/ComponentShowcase.jsx` - Demo/test file for all UI components (preserved for reference).
- `src/App.jsx` - Main entry point, renders PageLayout with active page content.

**Routing**: Currently using manual state-based navigation in App.jsx. Will be replaced with React Router when implemented.

## Component Patterns

### 1. Component Structure (Standard Template)

Each UI component follows this structure:

- **Folder**: `src/components/ui/{ComponentName}/`
- **Files**:
  - `{ComponentName}.jsx` - Component logic with PropTypes
  - `{ComponentName}.css` - Scoped CSS using BEM-like naming (`.btn`, `.btn--variant`, `.btn__icon`)
  - `index.js` - Re-export: `export { ComponentName } from './{ComponentName}'`
- **Export from barrel**: Add to `src/components/ui/index.js` for centralized imports

**Example** (`src/components/ui/Button/`):

```jsx
// Button.jsx
export function Button({ variant = 'primary', children, ...props }) {
  return (
    <button className={`btn btn--${variant}`} {...props}>
      {children}
    </button>
  );
}
Button.propTypes = { variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']) };
```

### 2. Props & Validation (REQUIRED)

- **Always use PropTypes** for runtime validation (see `src/components/ui/Button/Button.jsx`)
- **Common props**: `className` (for extending Tailwind), `disabled`, `error`, `variant`
- **Icon props**: `iconLeft`, `iconRight` - accepts Lucide React components as nodes (wrap in `<span aria-hidden="true">` for accessibility)
- **Variants**: Define `VARIANTS` array for validation with fallback (e.g., `const VARIANTS = ['primary', 'secondary', 'ghost']`)
  - Invalid variants should fallback: `const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';`

### 3. Styling Approach (Hybrid CSS + Tailwind)

**Component CSS**: Use BEM-like classes with design tokens from `tokens.css`

- Pattern: `.component`, `.component--modifier`, `.component__element`
- Example: `.btn--primary { background-color: var(--btn-primary-bg); }`
- **NO `@apply`** or Tailwind directives in component CSS files

**Tailwind in JSX**: Apply utility classes via `className` prop for layout/spacing

- Example: `<Button className="mt-4 flex gap-2" />`
- **NO inline styles** in production code (App.jsx uses them for demo purposes only)

**Design Tokens** (`src/styles/tokens.css`):

- 460+ CSS variables from Figma: `--btn-*`, `--color-*`, `--size-*`, `--text-*`, `--icon-*`, `--gap-*`
- Components reference via `var(--token-name)` in CSS files
- Tailwind can use tokens via arbitrary values: `bg-[var(--color-primary)]` (use sparingly)
- **Don't hardcode colors/sizes** - always use tokens for consistency with design system

### 4. Accessibility (Non-Negotiable)

- **Icons**: Wrap in `<span aria-hidden="true">` (see `src/components/ui/Button/Button.jsx`)
- **Inputs**: Use `aria-invalid`, `aria-describedby` for error/hint association (see `src/components/ui/Input/InputField.jsx`)
- **Disabled states**: Style with `:disabled` pseudo-class in CSS, not conditional classes
- **Dropdowns**: Add `aria-expanded`, `aria-label` on trigger buttons (see `src/components/layout/Navbar/Navbar.jsx`)
- **Interactive elements**: Always include accessible names (button text, aria-label, or aria-labelledby)

### 5. Variant Systems (Centralized Configs)

**Badges** use a centralized variant config (`src/components/ui/Badge/variants.js`):

```js
export const BADGE_VARIANTS = {
  candidateState: {
    accepted: { label: 'Accepted', color: 'green', Icon: CircleCheck },
    pending: { label: 'Pending', color: 'yellow', Icon: Clock },
    // ...
  },
  role: { owner: { label: 'Owner', color: 'purple', Icon: Crown } /* ... */ },
};
```

**Pattern**: When a component has multiple related variants (e.g., status states, roles), extract to `variants.js` file for maintainability.

**Inputs** have specialized variants (`src/components/ui/Input/variants.jsx`):

- `TextInput`, `EmailInput` (with validation), `PasswordInput` (with toggle), `SearchInput`, `DropdownInput`, `Textarea`, `FileInput`
- Use `forwardRef` for ref forwarding to native input elements
- Each variant composes from base `Input` component

### 6. Animation Patterns

**Entrance animations** (IntersectionObserver - see `src/components/ui/Cards/ActionCard/ActionCard.jsx`):

```jsx
const [isVisible, setIsVisible] = useState(!animated);
useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    },
    { threshold: 0.1 }
  );
  if (cardRef.current) observer.observe(cardRef.current);
  return () => observer.disconnect();
}, [animated]);
```

Use for performance-optimized scroll-based animations. Toggle CSS classes based on `isVisible` state.

**Collapsible UI** (CSS Grid - see `src/components/ui/Cards/QuestionCard/QuestionCard.jsx`):

```css
.question-card__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.question-card--expanded .question-card__content {
  grid-template-rows: 1fr;
}
```

**Why this pattern**: Smooth height transitions without hardcoded pixel values. Toggle icon rotates 180deg when expanded.

### 7. Dropdown/Modal Patterns (Event Handling)

`src/components/layout/Navbar/Navbar.jsx` shows best practices:

**Close on outside click**:

```jsx
useEffect(() => {
  if (!isOpen) return;
  const handleClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      close();
    }
  };
  document.addEventListener('mousedown', handleClick);
  return () => document.removeEventListener('mousedown', handleClick);
}, [isOpen, close]);
```

**Close on Escape**:

```jsx
const handleKeyDown = (e) => {
  if (e.key === 'Escape') close();
};
document.addEventListener('keydown', handleKeyDown);
```

**Use `useCallback`** for stable event handlers to prevent unnecessary re-renders:

```jsx
const close = useCallback(() => setIsOpen(false), []);
```

## Key Conventions

| Pattern                   | Convention                                                            | Example                                                                            |
| ------------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Imports**               | Named exports for components, default for barrel exports              | `import { Button } from './components/ui'`                                         |
| **PropTypes**             | Always validate props with PropTypes (required)                       | `Button.propTypes = { variant: PropTypes.oneOf([...]) }`                           |
| **Icons**                 | Lucide React components                                               | `import { Info } from 'lucide-react'`<br/>`<Info size={16} />`                     |
| **CSS Naming**            | BEM-like: `.component`, `.component--modifier`, `.component__element` | `.btn--primary`, `.input-field__icon`                                              |
| **CSS Variables**         | Design tokens from tokens.css (never hardcode)                        | `background-color: var(--btn-primary-bg);`                                         |
| **Disabled States**       | CSS `:disabled` pseudo-class, not JS conditional classes              | `.btn:disabled { opacity: 0.6; pointer-events: none; }`                            |
| **forwardRef**            | Use for components wrapping native elements (inputs, buttons, etc.)   | `export const Input = forwardRef(function Input(props, ref) { /* ... */ })`        |
| **useId**                 | Generate accessible input IDs (React 18+)                             | `const inputId = useId();` (then `htmlFor={inputId}`)                              |
| **Fallback Variants**     | Validate + fallback for invalid props                                 | `const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';`            |
| **No Unused Vars Rule**   | ESLint allows uppercase constants (e.g., `VARIANTS`)                  | `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` (eslint.config.js) |
| **Prettier Integration**  | Auto-formats on save, sorts Tailwind classes                          | Don't manually reorder Tailwind classes - Prettier handles it                      |
| **Component File Naming** | PascalCase for component files                                        | `Button.jsx`, `InputField.jsx`, `QuestionCard.jsx`                                 |

## Component Development Workflow

When creating a new UI component, follow these steps:

1. **Create folder**: `src/components/ui/{ComponentName}/`
2. **Create files**:
   - `{ComponentName}.jsx` - Component logic + PropTypes
   - `{ComponentName}.css` - Scoped styles with design tokens
   - `index.js` - Re-export: `export { ComponentName } from './{ComponentName}'`
3. **Add to barrel export**: Export from `src/components/ui/index.js`
4. **Use design tokens**: Reference `var(--token-name)` from `src/styles/tokens.css` (check tokens.css for available variables before hardcoding)
5. **Add PropTypes** for all props (this is required, not optional)
6. **Support className prop** for Tailwind extension
7. **Test in showcase**: See `src/pages/_showcase/ComponentShowcase.jsx` for component demos
8. **Verify accessibility**: Icons wrapped in `aria-hidden`, inputs have proper labels/hints

**Example barrel export** (`src/components/ui/index.js`):

```js
export { Button } from './Button';
export { Toggle } from './Toggle';
export { Badge, BADGE_VARIANTS, BADGE_TYPES } from './Badge';
```

## Page Development Workflow

All pages follow a consistent layout pattern using `PageLayout` component (sidebar + navbar + content area).

### Page Structure Template

```
src/pages/{PageName}/
├── {PageName}Page.jsx     # Main page component
├── {PageName}Page.css     # Page-specific styles
└── index.js               # Re-export: export { {PageName}Page } from './{PageName}Page'
```

### Standard Page Pattern (see `src/pages/Candidates/CandidatesPage.jsx`):

```jsx
import { useState } from 'react';
import { Shortcuts } from '../../../components/layout/Shortcuts';
import { Tabs } from '../../../components/ui/Tabs';
// ... other component imports

export function CandidatesPage() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchValue, setSearchValue] = useState('');
  // ... page state

  return (
    <div className="candidates-page">
      {/* Shortcuts Bar - filters, search, actions */}
      <Shortcuts ... />

      {/* Tabs - if page has multiple views */}
      <Tabs items={tabs} />

      {/* Main Content - tables, cards, etc. */}
      {activeTab === 'pipeline' && <PipelineContent />}
      {activeTab === 'overview' && <OverviewContent />}
    </div>
  );
}
```

### Page Layout Components

- **PageLayout** (`src/components/layout/PageLayout/`) - Main app shell wrapper. Renders sidebar + navbar + content.
- **Shortcuts** - Top action bar with filters, search, and action buttons.
- **Tabs** - Tab navigation for switching between page views.

### Adding a New Page

1. Create folder: `src/pages/{PageName}/`
2. Create `{PageName}Page.jsx`, `{PageName}Page.css`, `index.js`
3. Add page to `App.jsx` switch statement in `renderPage()`
4. Add navigation item to `navItems` array in `App.jsx`

## Current State & Future Work

- **Routing**: Currently using manual state-based navigation in App.jsx. Will migrate to React Router.
- **Backend integration**: API calls will connect to [VU-WebApp backend](https://github.com/UwUkareem/VU-WebApp.git)
- **Component Showcase**: Moved to `src/pages/_showcase/ComponentShowcase.jsx` - preserved for reference and testing.
- **State management**: Currently using local `useState`. Global state solution (Context/Zustand/etc.) will be added when needed for data sharing across routes.

## Troubleshooting

- **ESLint flat config**: Uses `defineConfig` syntax (ESLint 9+). Don't use old `.eslintrc` format.
- **Prettier sorting**: Tailwind classes auto-sort on save via `prettier-plugin-tailwindcss`. Don't manually reorder or you'll see formatting changes on next save.
- **Vite HMR issues**: Check for default/named export mismatches. Use `export function Component() {}` or `export default function Component() {}` consistently.
- **Design token not found**: Check `src/styles/tokens.css` (460+ variables). If a design value isn't there, ask before hardcoding - it may need to be added to the design system.
- **Import errors from barrel**: Ensure component is exported from both its own `index.js` AND `src/components/ui/index.js`.
