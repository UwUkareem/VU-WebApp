# Copilot Instructions for VU Frontend

## Project Overview

**VU** is an AI-powered virtual interview platform with two modes: **Practice Mode** (job seekers, mock interviews) and **Recruitment Mode** (companies, AI-led candidate screening). This is a React 19 SPA with Vite 7, Tailwind CSS 4, and a design-first approach from [Figma](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp).

## Tech Stack

- **React 19** + **Vite 7** (HMR dev server)
- **Tailwind CSS 4** with custom design tokens (460+ CSS variables in `src/styles/tokens.css`)
- **ESLint 9** (flat config) + **Prettier 3.7** (auto-formats, sorts Tailwind classes)
- **Lucide React** for icons
- **PropTypes** for runtime prop validation

## Development Commands

```bash
npm run dev       # Dev server on http://localhost:5173
npm run build     # Production build to dist/
npm run preview   # Preview production build
npm run lint      # ESLint validation
```

## Architecture & File Organization

```
src/
├── components/ui/          # Reusable UI primitives (Button, Input, Badge, Cards, etc.)
│   ├── Button/
│   │   ├── Button.jsx      # Component logic + PropTypes
│   │   ├── Button.css      # BEM-like CSS with design tokens
│   │   └── index.js        # Re-export: export { Button } from './Button'
│   └── index.js            # Barrel export for all UI components
├── components/layout/      # Page-level layout (Navbar, Sidebar, Shortcuts)
├── pages/                  # Route-level page components (currently empty, placeholder)
├── styles/
│   ├── index.css           # Tailwind @layer directives + global styles
│   └── tokens.css          # Figma-exported CSS variables (--btn-*, --color-*, --size-*)
└── assets/                 # Static images, icons
```

**Routing**: Not yet implemented. Pages will live in `pages/` when routing is added.

## Component Patterns

### 1. Component Structure (Example: Button)

Each UI component follows this structure:

- **Folder**: `src/components/ui/{ComponentName}/`
- **Files**:
  - `{ComponentName}.jsx` - Component logic with PropTypes
  - `{ComponentName}.css` - Scoped CSS using BEM-like naming (`.btn`, `.btn--variant`, `.btn__icon`)
  - `index.js` - Re-exports: `export { ComponentName } from './{ComponentName}'`
- **Export from barrel**: Add to `src/components/ui/index.js` for centralized imports

### 2. Props & Validation

- **Always use PropTypes** for runtime validation (see `src/components/ui/Button/Button.jsx`)
- **Common props**: `className` (for extending Tailwind), `disabled`, `error`, `variant`
- **Icon props**: `iconLeft`, `iconRight` - accepts Lucide React components as nodes
- **Variants**: Define `VARIANTS` array for validation with fallback (e.g., `const VARIANTS = ['primary', 'secondary', 'ghost']`)

### 3. Styling Approach

**Hybrid CSS + Tailwind**:

- **Component CSS**: Use BEM-like classes (`.btn`, `.btn--primary`, `.btn__icon`) with design tokens from `tokens.css`
  - Example: `.btn--primary { background-color: var(--btn-primary-bg); }`
- **Tailwind in JSX**: Apply utility classes via `className` prop for layout/spacing
  - Example: `<Button className="mt-4" />`
- **No inline styles** in production code (App.jsx has inline styles for demo purposes only)

**Design Tokens** (`src/styles/tokens.css`):

- 460+ CSS variables from Figma: `--btn-*`, `--color-*`, `--size-*`, `--text-*`, `--icon-*`, `--gap-*`
- Components reference via `var(--token-name)` in CSS
- Tailwind can use tokens via arbitrary values: `bg-[var(--color-primary)]`

### 4. Accessibility

- **Icons**: Wrap in `<span aria-hidden="true">` (see `src/components/ui/Button/Button.jsx`)
- **Inputs**: Use `aria-invalid`, `aria-describedby` for error/hint association (see `src/components/ui/Input/Input.jsx`)
- **Disabled states**: Always style with `:disabled` pseudo-class in CSS

### 5. Variant Systems

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

**Inputs** have specialized variants (`src/components/ui/Input/variants.jsx`):

- `TextInput`, `EmailInput` (with validation), `PasswordInput` (with toggle), `SearchInput`, `DropdownInput`, `Textarea`, `FileInput`
- Use `forwardRef` for ref forwarding to native input elements

### 6. Animation Pattern (ActionCard)

`src/components/ui/Cards/ActionCard/ActionCard.jsx` uses IntersectionObserver for scroll-based animations:

```jsx
const [isVisible, setIsVisible] = useState(!animated);
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
  if (cardRef.current) observer.observe(cardRef.current);
  return () => observer.disconnect();
}, [animated]);
```

Apply this pattern for performance-optimized entrance animations.

### 7. Dropdown/Modal Patterns (Navbar)

`src/components/layout/Navbar/Navbar.jsx` shows best practices for dropdowns:

- **Close on outside click**: `useEffect` + `mousedown` listener checking `ref.contains(e.target)`
- **Close on Escape**: Listen for `keydown` + `e.key === 'Escape'`
- **useCallback** for stable event handlers to prevent unnecessary re-renders

## Key Conventions

| Pattern                 | Convention                                                            | Example                                                                            |
| ----------------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Imports**             | Named exports for components, default for barrel exports              | `import { Button } from './components/ui'`                                         |
| **PropTypes**           | Always validate props with PropTypes                                  | `Button.propTypes = { variant: PropTypes.oneOf([...]) }`                           |
| **Icons**               | Lucide React components                                               | `import { Info } from 'lucide-react'`<br/>`<Info size={16} />`                     |
| **CSS Naming**          | BEM-like: `.component`, `.component--modifier`, `.component__element` | `.btn--primary`, `.input-field__icon`                                              |
| **CSS Variables**       | Design tokens from tokens.css                                         | `background-color: var(--btn-primary-bg);`                                         |
| **Disabled States**     | CSS `:disabled` pseudo-class, not JS conditional classes              | `.btn:disabled { opacity: 0.6; pointer-events: none; }`                            |
| **forwardRef**          | Use for components wrapping native elements                           | `export const Input = forwardRef(function Input(props, ref) { /* ... */ })`        |
| **useId**               | Generate accessible input IDs                                         | `const inputId = useId();` (React 18+)                                             |
| **Fallback Variants**   | Validate + fallback for invalid props                                 | `const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';`            |
| **No Unused Vars Rule** | ESLint allows uppercase constants (e.g., `VARIANTS`)                  | `'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]` (eslint.config.js) |

## Component Development Workflow

When creating a new UI component:

1. **Create folder**: `src/components/ui/{ComponentName}/`
2. **Create files**:
   - `{ComponentName}.jsx` - Component logic + PropTypes
   - `{ComponentName}.css` - Scoped styles with design tokens
   - `index.js` - Re-export: `export { ComponentName } from './{ComponentName}'`
3. **Add to barrel**: Export from `src/components/ui/index.js`
4. **Use design tokens**: Reference `var(--token-name)` from `src/styles/tokens.css`
5. **Add PropTypes** for all props
6. **Support className prop** for Tailwind extension
7. **Test in App.jsx** (currently serves as a component showcase/demo)

## Current State & Future Work

- **Routing**: Not implemented. When added, page components will go in `src/pages/`
- **Backend integration**: API calls will connect to [VU-WebApp backend](https://github.com/UwUkareem/VU-WebApp.git)
- **App.jsx**: Currently a demo/showcase file with inline examples of all components. Will be refactored when routing is added.

## Troubleshooting

- **ESLint flat config**: Uses `defineConfig` syntax (ESLint 9+). Don't use old `.eslintrc` format.
- **Prettier sorting**: Tailwind classes auto-sort on save via `prettier-plugin-tailwindcss`. Don't manually reorder.
- **Vite HMR issues**: Check for default/named export mismatches. Use `export function Component() {}` or `export default function Component() {}` consistently.
