# Copilot Instructions for VU Frontend

## Project Overview

**VU** is an AI-powered virtual interview platform with two modes: **Practice Mode** (job seekers, mock interviews) and **Recruitment Mode** (companies, AI-led candidate screening). This React 19 SPA uses Vite 7, Tailwind CSS 4, and follows a design-first approach from [Figma](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp).

## Tech Stack & Tooling

| Technology       | Version | Purpose                                                              |
| ---------------- | ------- | -------------------------------------------------------------------- |
| **React**        | 19      | UI Framework                                                         |
| **Vite**         | 7       | Build tool & HMR dev server                                          |
| **Tailwind CSS** | 4       | Utility-first styling (via `@import 'tailwindcss'` + `@theme` block) |
| **Lucide React** | 0.562+  | Icon components (component-based, not font icons)                    |
| **PropTypes**    | 15.8+   | Runtime prop validation (required for all components)                |
| **ESLint**       | 9       | Linting (flat config in `eslint.config.js`)                          |
| **Prettier**     | 3.7     | Code formatting + Tailwind class sorting                             |

**No routing library yet** - manual state-based navigation in `App.jsx` (React Router planned).

## Development Commands

```bash
npm run dev       # Dev server on http://localhost:5173 (Vite HMR)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint validation
```

**Note**: Prettier runs on save in VS Code. Tailwind classes are auto-sorted by `prettier-plugin-tailwindcss`.

---

## Architecture & File Organization

```
src/
├── components/
│   ├── ui/                    # Reusable UI primitives
│   │   ├── Badge/             # Badge + RoleBadge + variants.js
│   │   ├── Breadcrumb/
│   │   ├── Button/
│   │   ├── Cards/             # ActionCard, EntityCard, InfoCard, QuestionCard, QuickInfoCard
│   │   ├── Charts/            # DonutChart, StatsChart
│   │   ├── Input/             # Input, InputField, Label, Hint + variants.jsx
│   │   ├── Pagination/
│   │   ├── SidebarButton/
│   │   ├── Tables/            # TableHeader, TableRow, TableCell
│   │   ├── Tabs/
│   │   ├── Tags/
│   │   ├── Toggle/
│   │   ├── User/
│   │   └── index.js           # Barrel export for all UI components
│   └── layout/                # Layout components
│       ├── Navbar/            # Navbar + NotificationDropdown
│       ├── PageLayout/        # Main app shell (sidebar + navbar + content)
│       ├── Shortcuts/         # Action bar (filters + search + buttons)
│       ├── Sidebar/
│       └── index.js           # Barrel export for layout components
├── pages/                     # Route-level page components
│   ├── Candidates/            # CandidatesPage + Pipeline/
│   ├── CompanyTeam/           # (placeholder)
│   ├── Jobs/                  # (placeholder)
│   ├── Mocks/                 # (placeholder)
│   ├── Profile/               # (placeholder)
│   └── _showcase/             # ComponentShowcase (demo page)
├── styles/
│   ├── index.css              # Tailwind CSS 4 import + @theme config + utilities
│   └── tokens.css             # 460+ Figma-exported CSS variables
└── assets/                    # Static images, icons
```

### Key Files

| File                                    | Purpose                                                        |
| --------------------------------------- | -------------------------------------------------------------- |
| `src/components/ui/index.js`            | Central barrel export - **add new UI components here**         |
| `src/components/layout/index.js`        | Barrel export for layout components                            |
| `src/styles/tokens.css`                 | 460+ design tokens from Figma - **single source of truth**     |
| `src/styles/index.css`                  | Tailwind CSS 4 config via `@theme` block + custom utilities    |
| `src/App.jsx`                           | Main entry point with state-based navigation in `renderPage()` |
| `src/pages/_showcase/ComponentShowcase` | Component demo page for testing                                |

---

## Component Patterns

### 1. Standard Component Structure

Every UI component follows this folder structure:

```
src/components/ui/{ComponentName}/
├── {ComponentName}.jsx     # Component logic + PropTypes
├── {ComponentName}.css     # BEM-like CSS with design tokens
└── index.js                # Re-export: export { ComponentName } from './{ComponentName}'
```

**Complete Example** (`src/components/ui/Button/Button.jsx`):

```jsx
import './Button.css';
import PropTypes from 'prop-types';

const VARIANTS = ['primary', 'secondary', 'ghost'];

export function Button({
  children,
  variant = 'primary',
  disabled = false,
  iconLeft,
  iconRight,
  type = 'button',
  className = '',
  ...props
}) {
  // Fallback to primary if invalid variant passed
  const safeVariant = VARIANTS.includes(variant) ? variant : 'primary';

  return (
    <button
      type={type}
      className={`btn btn--${safeVariant} ${className}`.trim()}
      disabled={disabled}
      {...props}
    >
      {iconLeft && (
        <span className="btn__icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconRight && (
        <span className="btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  disabled: PropTypes.bool,
  iconLeft: PropTypes.node,
  iconRight: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
};
```

### 2. PropTypes (REQUIRED)

All components must include PropTypes for runtime validation:

```jsx
import PropTypes from 'prop-types';

Component.propTypes = {
  // Required props
  label: PropTypes.string.isRequired,

  // Optional with defaults
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  disabled: PropTypes.bool,
  className: PropTypes.string,

  // Icons (Lucide components passed as JSX)
  icon: PropTypes.elementType, // For component reference: icon={Mail}
  iconLeft: PropTypes.node, // For rendered JSX: iconLeft={<Mail size={16} />}

  // Children
  children: PropTypes.node,

  // Event handlers
  onClick: PropTypes.func,
  onChange: PropTypes.func,

  // Complex shapes
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
  }),

  // Arrays
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
    })
  ),
};
```

### 3. Styling Approach (Hybrid CSS + Tailwind)

**Component CSS** (`{Component}.css`):

- Use BEM-like naming: `.component`, `.component--modifier`, `.component__element`
- Reference design tokens: `var(--token-name)`
- **NO `@apply`** (not supported in Tailwind CSS 4)

```css
/* Button.css */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--gap-sm);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  border-radius: var(--radius-md);
  font-weight: var(--font-medium);
  transition: all 0.2s ease;
}

.btn--primary {
  background-color: var(--btn-primary-bg);
  color: var(--btn-primary-fg);
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--btn-primary-hover);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn__icon {
  display: flex;
  align-items: center;
}
```

**Tailwind in JSX**:

- Use `className` prop for layout/spacing utilities
- Passed classes are merged with component classes

```jsx
<Button className="mt-4 w-full" variant="primary">
  Submit
</Button>
```

### 4. Design Tokens (`src/styles/tokens.css`)

460+ CSS variables exported from Figma. **Never hardcode colors/sizes.**

```css
:root {
  /* Typography */
  --font-sans: 'Inter', sans-serif;
  --font-mono: 'Roboto Mono', ui-monospace, monospace;
  --font-regular: 300;
  --font-medium: 400;
  --font-semibold: 500;
  --font-bold: 600;
  --text-xs: 0.75rem; /* 12px */
  --text-sm: 0.8125rem; /* 13px */
  --text-base: 0.875rem; /* 14px */
  --text-md: 1rem; /* 16px */

  /* Spacing */
  --size-1: 0.25rem; /* 4px */
  --size-2: 0.5rem; /* 8px */
  --size-4: 1rem; /* 16px */
  --gap-xs: 0.25rem;
  --gap-sm: 0.5rem;
  --gap-md: 0.75rem;
  --gap-lg: 1rem;

  /* Colors - see tokens.css for full palette */
  --brand-default: #...;
  --bg-base: #...;
  --text-primary: #...;

  /* Component-specific */
  --btn-primary-bg: var(--brand-default);
  --btn-primary-fg: #fff;
  --btn-primary-hover: var(--brand-600);
}
```

### 5. Centralized Variant Configs

For components with multiple variant types, use a `variants.js` file:

**`src/components/ui/Badge/variants.js`**:

```js
import {
  CircleCheck,
  Clock,
  Star,
  Ban,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Crown,
  Pencil,
  Eye,
} from 'lucide-react';

export const BADGE_VARIANTS = {
  candidateState: {
    accepted: { label: 'Accepted', color: 'green', Icon: CircleCheck },
    pending: { label: 'Pending', color: 'yellow', Icon: Clock },
    shortlist: { label: 'Shortlist', color: 'blue', Icon: Star },
    rejected: { label: 'Rejected', color: 'red', Icon: Ban },
  },
  cheatingFlag: {
    clean: { label: 'Clean', color: 'green', Icon: ShieldCheck },
    flagged: { label: 'Flagged', color: 'yellow', Icon: ShieldAlert },
    critical: { label: 'Critical', color: 'red', Icon: ShieldX },
  },
  jobStatus: {
    active: { label: 'Active', color: 'green', Icon: Sparkles },
    scheduled: { label: 'Scheduled', color: 'yellow', Icon: CalendarClock },
    closed: { label: 'Closed', color: 'gray', Icon: CircleMinus },
  },
  role: {
    owner: { label: 'Owner', color: 'purple', Icon: Crown },
    editor: { label: 'Editor', color: 'teal', Icon: Pencil },
    viewer: { label: 'Viewer', color: 'gray', Icon: Eye },
  },
};

export const BADGE_TYPES = Object.keys(BADGE_VARIANTS);
```

**Usage**:

```jsx
<Badge type="candidateState" variant="accepted" />
<Badge type="cheatingFlag" variant="flagged" iconLeft />
<Badge type="role" variant="owner" />
```

### 6. Input Variants (`src/components/ui/Input/variants.jsx`)

Specialized input components that compose from base `Input`:

| Component       | Features                         |
| --------------- | -------------------------------- |
| `TextInput`     | Basic text input                 |
| `EmailInput`    | Email validation on blur         |
| `PasswordInput` | Show/hide toggle                 |
| `SearchInput`   | Search icon + clear button       |
| `DropdownInput` | Chevron icon + dropdown behavior |
| `Textarea`      | Multi-line text                  |
| `FileInput`     | File upload with drag & drop     |

All use `forwardRef` for ref forwarding:

```jsx
export const TextInput = forwardRef((props, ref) => <Input ref={ref} type="text" {...props} />);
TextInput.displayName = 'TextInput';
```

### 7. Accessibility (Non-Negotiable)

```jsx
// Icons - always hide from screen readers when decorative
{iconLeft && (
  <span className="btn__icon" aria-hidden="true">
    {iconLeft}
  </span>
)}

// Interactive elements - always have accessible names
<button aria-label="Notifications" aria-expanded={isOpen}>
  <Bell size={20} />
</button>

// Inputs - associate labels and error messages
<Input
  id={inputId}
  aria-invalid={error ? 'true' : undefined}
  aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
/>

// Tables - use proper roles
<div role="row">
  <div role="columnheader">Name</div>
</div>

// Tabs - use ARIA roles
<div role="tablist">
  <button role="tab" aria-selected={isActive}>Tab 1</button>
</div>
```

### 8. Animation Patterns

**Entrance animations** (IntersectionObserver):

```jsx
const [isVisible, setIsVisible] = useState(!animated);
const cardRef = useRef(null);

useEffect(() => {
  if (!animated) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );

  if (cardRef.current) observer.observe(cardRef.current);
  return () => observer.disconnect();
}, [animated]);

// Apply visibility class
<div className={`card ${isVisible ? 'card--visible' : ''}`} ref={cardRef}>
```

**Collapsible UI** (CSS Grid for smooth height transitions):

```css
.card__content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.card--expanded .card__content {
  grid-template-rows: 1fr;
}

.card__content > div {
  overflow: hidden;
}
```

### 9. Dropdown/Modal Patterns

**Close on outside click + Escape** (`src/components/layout/Navbar/Navbar.jsx`):

```jsx
const [isOpen, setIsOpen] = useState(false);
const dropdownRef = useRef(null);
const close = useCallback(() => setIsOpen(false), []);

useEffect(() => {
  if (!isOpen) return;

  const handleEvent = (e) => {
    if (e.type === 'keydown' && e.key === 'Escape') close();
    if (e.type === 'mousedown' && dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      close();
    }
  };

  document.addEventListener('mousedown', handleEvent);
  document.addEventListener('keydown', handleEvent);

  return () => {
    document.removeEventListener('mousedown', handleEvent);
    document.removeEventListener('keydown', handleEvent);
  };
}, [isOpen, close]);
```

---

## Page Development

### PageLayout Pattern

All pages are wrapped in `PageLayout` which provides sidebar + navbar + content area:

```jsx
// App.jsx
import { PageLayout } from './components/layout/PageLayout';

export default function App() {
  const [activePage, setActivePage] = useState('candidates');

  const navItems = [
    {
      icon: Users,
      label: 'Candidates',
      isActive: activePage === 'candidates',
      onClick: () => setActivePage('candidates'),
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      isActive: activePage === 'jobs',
      onClick: () => setActivePage('jobs'),
    },
    // ... more nav items
  ];

  const user = { name: 'User Name', email: 'user@example.com', icon: Hash };

  return (
    <PageLayout navItems={navItems} user={user} breadcrumbItems={getBreadcrumbItems()}>
      {renderPage()}
    </PageLayout>
  );
}
```

### Page Structure

```
src/pages/{PageName}/
├── {PageName}Page.jsx     # Main page component (or just PageName.jsx)
├── {PageName}Page.css     # Page-specific styles
├── index.js               # Re-export
└── {SubPage}/             # Optional sub-pages
    ├── {SubPage}.jsx
    ├── {SubPage}.css
    └── index.js
```

### Standard Page Pattern (`src/pages/Candidates/Pipeline/Pipeline.jsx`):

```jsx
import { useState } from 'react';
import { Shortcuts } from '../../../components/layout/Shortcuts';
import { Tabs } from '../../../components/ui/Tabs';
import { TableHeader, TableRow, TableCell } from '../../../components/ui/Tables';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import './Pipeline.css';

// Mock data - will be replaced with API calls
const MOCK_CANDIDATES = [
  /* ... */
];

export function Pipeline() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  return (
    <div className="pipeline">
      {/* Shortcuts - filters, search, actions */}
      <Shortcuts
        onFilterClick={() => {}}
        searchPlaceholder="Search candidates"
        primaryAction={{ label: 'Add Candidate', icon: Plus, onClick: () => {} }}
      />

      {/* Tabs - page sections */}
      <Tabs
        items={[
          {
            label: 'Pipeline',
            isActive: activeTab === 'pipeline',
            onClick: () => setActiveTab('pipeline'),
          },
          {
            label: 'Overview',
            isActive: activeTab === 'overview',
            onClick: () => setActiveTab('overview'),
          },
        ]}
      />

      {/* Content */}
      <div className="pipeline__table">
        <TableHeader columns={columns} onSort={handleSort} />
        {candidates.map((candidate) => (
          <TableRow key={candidate.id}>
            <TableCell>{candidate.name}</TableCell>
            <TableCell>
              <Badge type="candidateState" variant={candidate.status} />
            </TableCell>
          </TableRow>
        ))}
      </div>

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
    </div>
  );
}
```

### Adding a New Page

1. Create folder: `src/pages/{PageName}/`
2. Create `{PageName}.jsx`, `{PageName}.css`, `index.js`
3. Add to `App.jsx`:
   - Add case in `renderPage()` switch
   - Add nav item in `navItems` array
   - Add breadcrumb in `getBreadcrumbItems()`

---

## Barrel Exports

### UI Components (`src/components/ui/index.js`):

```js
// UI Components
export { default as Button } from './Button';
export { Toggle } from './Toggle';
export { Badge, BADGE_VARIANTS, BADGE_TYPES } from './Badge';
export { Breadcrumb } from './Breadcrumb';
export { Pagination } from './Pagination';
export { SidebarButton } from './SidebarButton';
export { User } from './User';
export { Tabs } from './Tabs';
export { Tags } from './Tags';
export { TableHeader, TableRow, TableCell } from './Tables';
export { StatsChart } from './StatsChart';
```

### Layout Components (`src/components/layout/index.js`):

```js
export { Navbar } from './Navbar';
export { Sidebar } from './Sidebar';
export { Shortcuts } from './Shortcuts';
export { PageLayout } from './PageLayout';
```

---

## Key Conventions Summary

| Pattern               | Convention                                                             |
| --------------------- | ---------------------------------------------------------------------- |
| **Component exports** | Named exports: `export function Button() {}`                           |
| **PropTypes**         | Required for all components                                            |
| **Icons**             | Lucide React: `import { Icon } from 'lucide-react'`                    |
| **Icon sizing**       | In JSX: `<Icon size={16} />`                                           |
| **CSS naming**        | BEM-like: `.component`, `.component--modifier`, `.component__element`  |
| **CSS values**        | Design tokens: `var(--token-name)` - never hardcode                    |
| **Disabled styling**  | CSS `:disabled` pseudo-class                                           |
| **Ref forwarding**    | `forwardRef` for input components                                      |
| **Variant fallback**  | `const safeVariant = VARIANTS.includes(variant) ? variant : 'primary'` |
| **Event cleanup**     | Always return cleanup function from `useEffect`                        |
| **Stable callbacks**  | Use `useCallback` for event handlers passed to effects                 |
| **Mock data**         | Prefix with `MOCK_`: `const MOCK_CANDIDATES = [...]`                   |
| **File naming**       | PascalCase: `Button.jsx`, `InputField.jsx`                             |
| **Tailwind sorting**  | Automatic via Prettier - don't manually reorder                        |

---

## Current State & Roadmap

### ✅ Implemented

- Component library (Button, Input variants, Badge, Cards, Tables, Tabs, Pagination, etc.)
- Layout system (PageLayout, Navbar, Sidebar, Shortcuts)
- Design token system (460+ variables from Figma)
- Candidates page with Pipeline view
- Component showcase page

### 🔄 Planned

- React Router integration (replace manual state navigation)
- Backend API integration ([VU-WebApp backend](https://github.com/UwUkareem/VU-WebApp.git))
- Global state management (Context/Zustand when needed)
- Remaining pages (Jobs, Mocks, CompanyTeam, Profile)

---

## Troubleshooting

| Issue                        | Solution                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------- |
| ESLint config errors         | Use flat config format (`eslint.config.js`), not `.eslintrc`                      |
| Tailwind classes reordering  | Normal - Prettier plugin auto-sorts on save                                       |
| Vite HMR not working         | Check export consistency (named vs default)                                       |
| Design token not found       | Check `src/styles/tokens.css` first; don't hardcode                               |
| Import not found from barrel | Ensure exported from both `{Component}/index.js` AND `src/components/ui/index.js` |
| `@apply` not working         | Tailwind CSS 4 doesn't support `@apply` - use design tokens in CSS instead        |
