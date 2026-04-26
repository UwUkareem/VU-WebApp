# Copilot Instructions for VU Frontend

## Project Overview

**VU** is an AI-powered virtual interview platform with two modes: **Practice Mode** (job seekers, mock interviews) and **Recruitment Mode** (companies, AI-led candidate screening). This React 19 SPA uses Vite 7, React Router v6, and follows a design-first approach from [Figma](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp).

## Tech Stack & Tooling

| Technology       | Version | Purpose                                     |
| ---------------- | ------- | ------------------------------------------- |
| **React**        | 19      | UI Framework                                |
| **Vite**         | 7       | Build tool & HMR dev server                 |
| **React Router** | 6       | Client-side routing (declarative URL-based) |
| **Recharts**     | 2       | Charting library (Area, Bar, Radar, Radial) |
| **Lucide React** | 0.562+  | Icon components (component-based)           |
| **PropTypes**    | 15.8+   | Runtime prop validation                     |
| **ESLint**       | 9       | Linting (flat config in `eslint.config.js`) |

## Development Commands

```bash
npm run dev       # Dev server on http://localhost:5173 (Vite HMR)
npm run build     # Production build to dist/
npm run preview   # Preview production build locally
npm run lint      # ESLint validation
```

---

## Architecture & File Organization

```
src/
├── main.jsx                        # App entry point (BrowserRouter wraps App)
├── App.jsx                         # React Router v6 routes + page wrappers
├── components/
│   ├── ui/                         # Reusable UI primitives
│   │   ├── Badge/                  # Badge + RoleBadge + variants.js
│   │   ├── Breadcrumb/
│   │   ├── Button/
│   │   ├── Cards/                  # ActionCard, EntityCard, InfoCard, QuestionCard, QuickInfoCard
│   │   ├── Charts/                 # AreaChart, BarChart, RadarChart, RadialBarChart + chartTokens
│   │   ├── EmptyState/
│   │   ├── FilterOverlay/          # Portal-rendered slide-in filter panel
│   │   ├── Input/                  # Input, InputField, Label, Hint + variants.jsx
│   │   ├── Pagination/
│   │   ├── QuickSort/
│   │   ├── RowMenu/
│   │   ├── SectionTitle/
│   │   ├── SidebarButton/
│   │   ├── Stepper/
│   │   ├── Tables/                 # TableHeader, TableRow, TableCell
│   │   ├── Tabs/
│   │   ├── Tags/
│   │   ├── Toggle/
│   │   ├── User/
│   │   └── index.js                # Barrel export for all UI components
│   └── layout/                     # Layout components
│       ├── Navbar/                 # Navbar + NotificationDropdown
│       ├── PageLayout/             # Main app shell (sidebar + navbar + content)
│       ├── Shortcuts/              # Action bar (filters + search + buttons)
│       ├── Sidebar/
│       └── index.js                # Barrel export for layout components
├── data/                           # Centralised in-memory mock data + CRUD helpers
│   ├── index.js                    # Barrel export for all data helpers
│   ├── candidates.js               # Candidates, pipeline stages, filters
│   ├── jobs.js                     # Jobs with status, stats, mocks; CRUD
│   ├── mocks.js                    # Mock interviews; CRUD; getJobsUsingMock
│   ├── company.js                  # Company info, team members, join requests
│   ├── application.js              # Candidate-facing session state
│   └── config.js                   # Shared config constants
├── pages/                          # Route-level page components
│   ├── _showcase/                  # Component demo/showcase page
│   ├── Candidates/
│   │   ├── Pipeline/               # Candidate pipeline table + FilterOverlay + pagination
│   │   └── CandidateDetails/       # Tabbed detail view (CVAnalysis, FullFeedback, MockReplay)
│   ├── Jobs/
│   │   ├── JobManagement/          # JobList + JobDetails
│   │   └── JobConfigPage/          # CreateConfig + EditConfig (4-step form)
│   ├── Mocks/
│   │   ├── MockManagement/         # MockList + MockDetails
│   │   └── MockConfigPage/         # CreateMockConfig + EditMockConfig (3-step form)
│   ├── CompanyTeam/
│   │   ├── Overview/               # Company stats + team member table
│   │   ├── AddMembers/             # Join requests management
│   │   ├── MemberDetails/          # Member/request detail view
│   │   └── CompanySettings/        # Company info + departments
│   ├── Profile/                    # User profile (edit mode, activity timeline)
│   └── Application/                # Candidate-facing flow (standalone, no sidebar)
│       ├── JobLanding/             # Job description + Apply
│       ├── CandidateForm/          # Application form
│       ├── JobOverview/            # Mock interview checklist
│       ├── MockSession/            # Live mock (intro → interview phases)
│       └── SubmissionComplete/     # Confirmation screen
└── styles/
    ├── index.css                   # Global CSS reset + design token import
    └── tokens.css                  # 490+ Figma-exported design tokens
```

### Key Files

| File                             | Purpose                                         |
| -------------------------------- | ----------------------------------------------- |
| `src/App.jsx`                    | React Router v6 routes + page wrappers          |
| `src/styles/tokens.css`          | 490+ design tokens — single source of truth     |
| `src/styles/index.css`           | Global CSS reset + token import                 |
| `src/data/index.js`              | Central barrel export for all data helpers      |
| `src/components/ui/index.js`     | Central barrel export for all UI primitives     |
| `src/components/layout/index.js` | Barrel export for layout components             |
| `src/pages/_showcase/`           | Component demo page (useful for visual testing) |

---

## Component Patterns

### 1. Standard Component Structure

Every UI component follows this folder structure:

```
src/components/ui/{ComponentName}/
├── {ComponentName}.jsx     # Component logic + PropTypes + memo()
├── {ComponentName}.css     # BEM-like CSS with design tokens
└── index.js                # Re-export: export { ComponentName } from './{ComponentName}'
```

**Complete Example** (`src/components/ui/Button/Button.jsx`):

```jsx
import './Button.css';
import PropTypes from 'prop-types';
import { memo } from 'react';

export const Button = memo(function Button({
  children,
  variant = 'primary',
  size,
  disabled = false,
  loading = false,
  iconLeft,
  iconRight,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <button
      type={type}
      className={['btn', `btn--${variant}`, size && `btn--${size}`, className]
        .filter(Boolean)
        .join(' ')}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="btn__loader" />}
      {iconLeft && (
        <span className="btn__icon" aria-hidden="true">
          {iconLeft}
        </span>
      )}
      {children && <span className="btn__label">{children}</span>}
      {iconRight && (
        <span className="btn__icon" aria-hidden="true">
          {iconRight}
        </span>
      )}
    </button>
  );
});

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'dashed']),
  size: PropTypes.oneOf(['sm', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
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

### 3. Styling Approach (BEM CSS + Design Tokens)

**Component CSS** (`{Component}.css`):

- Use BEM-like naming: `.component`, `.component--modifier`, `.component__element`
- Reference design tokens: `var(--token-name)`
- Never hardcode colors or sizes

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

**className assembly pattern** — all components use filter(Boolean).join:

```jsx
className={['btn', `btn--${variant}`, size && `btn--${size}`, className]
  .filter(Boolean)
  .join(' ')}
```

### 4. Design Tokens (`src/styles/tokens.css`)

490+ CSS variables exported from Figma. **Never hardcode colors/sizes.**

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

All use `memo(forwardRef(...))` for memoization + ref forwarding:

```jsx
export const TextInput = memo(
  forwardRef((props, ref) => <Input ref={ref} type="text" {...props} />)
);
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

This project uses **three distinct CSS animation strategies** — pick based on context.

---

**A. Entrance via IntersectionObserver** (all Cards, Charts)

Every animated component wraps in `memo`, uses `animated` prop (default `true`), and fires once:

```jsx
export const QuickInfoCard = memo(function QuickInfoCard({ animated = true, ... }) {
  const [isVisible, setIsVisible] = useState(!animated); // skip state if animated=false
  const cardRef = useRef(null);

  useEffect(() => {
    if (!animated) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [animated]);

  return (
    <div ref={cardRef} className={`quick-info-card${isVisible ? ' quick-info-card--visible' : ''}`}>
```

CSS pattern — hidden by default, visible via modifier class:

```css
.quick-info-card {
  opacity: 0;
  transform: translateY(var(--size-4)); /* translateY(var(--size-8)) for larger cards */
  transition:
    opacity var(--transition-slow),
    transform var(--transition-slow);
}
.quick-info-card--visible {
  opacity: 1;
  transform: translateY(0);
}
```

> **Hover states** are added separately with `border-color`, `box-shadow`, and `background-color` transitions. Left-border accent (`border-left-color: var(--brand-600)`) is used on InfoCard and QuickInfoCard for the hover highlight.

---

**B. Staggered entrance via CSS custom property** (chart lists, table rows)

Each item gets `style={{ '--item-delay': `${index \* 100}ms` }}` in JSX. CSS reads it:

```jsx
// StatsChart.jsx / DonutChart.jsx
{stats.map((stat, index) => (
  <div key={index} className="stats-chart__item" style={{ '--item-delay': `${index * 100}ms` }}>
```

```css
/* StatsChart.css */
.stats-chart__item {
  opacity: 0;
  transition-delay: var(--item-delay, 0ms);
}
.stats-chart--visible .stats-chart__item {
  opacity: 1;
}
```

---

**C. Staggered CSS `@keyframes`** (Breadcrumb items)

When transitions aren't enough, use `animation-delay` with a per-item CSS variable:

```jsx
// Breadcrumb.jsx
<li style={{ '--item-index': index }} className="breadcrumb__item">
```

```css
/* Breadcrumb.css */
.breadcrumb__item {
  animation: breadcrumb-fade-in var(--transition-slow) both;
  animation-delay: calc(var(--item-index, 0) * 50ms);
}
@keyframes breadcrumb-fade-in {
  from {
    opacity: 0;
    transform: translateX(calc(-1 * var(--size-2)));
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

---

**D. Collapsible/expand** (CSS Grid height transition)

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

**E. Immediate entrance via `requestAnimationFrame`** (QuestionCard — dynamically added to a list)

When an item is programmatically added (e.g. "Add Question" button), use `requestAnimationFrame` instead of IntersectionObserver so the animation fires on the very next paint:

```jsx
// QuestionCard.jsx
const [isVisible, setIsVisible] = useState(false);
const [isRemoving, setIsRemoving] = useState(false);

useEffect(() => {
  requestAnimationFrame(() => setIsVisible(true));
}, []);

const handleRemove = () => {
  setIsRemoving(true);
  setTimeout(() => onRemove?.(), 300); // match CSS transition duration
};

// className combines all three states:
`question-card ${isExpanded ? 'question-card--expanded' : ''} ${isVisible ? 'question-card--visible' : ''} ${isRemoving ? 'question-card--removing' : ''}`;
```

The `question-card--removing` class plays an exit animation (opacity → 0, scale down) before the item is actually removed from the DOM.

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

### Routing (React Router v6)

All routing is defined in `App.jsx`. Dashboard pages render inside `DashboardLayout` (sidebar + navbar + content via `<Outlet />`). The application flow (`/apply/*`) uses a standalone `ApplicationLayout`.

```
/candidates               → Pipeline (list)
/candidates/:slug         → CandidateDetails (tabbed detail)
/jobs                     → JobList
/jobs/create              → CreateConfig (4-step form)
/jobs/:id                 → JobDetails
/jobs/:id/edit            → EditConfig
/mocks                    → MockList
/mocks/create             → CreateMockConfig (3-step form)
/mocks/:id                → MockDetails
/mocks/:id/edit           → EditMockConfig
/company                  → CompanyTeam Overview
/company/team/:id         → MemberDetails (from overview)
/company/members          → AddMembers
/company/members/:id      → MemberDetails (from requests)
/company/requests/:id     → RequestDetails
/company/settings         → CompanySettings
/profile                  → ProfilePage
/apply/:jobId             → JobLanding (candidate-facing)
/apply/:jobId/form        → CandidateForm
/apply/:jobId/overview    → JobOverview (mock checklist)
/apply/:jobId/mock/:mockId→ MockSession
/apply/:jobId/complete    → SubmissionComplete
```

### Page Wrappers Pattern

Page wrappers in `App.jsx` bridge `useParams()`/`useNavigate()` to component props:

```jsx
function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <JobDetails
      jobId={Number(id)}
      onEdit={() => navigate(`/jobs/${id}/edit`)}
      onDuplicate={(newId) => navigate(`/jobs/${newId}`)}
      onViewJob={(newId) => navigate(`/jobs/${newId}`)}
    />
  );
}
```

### PageLayout Pattern

```jsx
// Dashboard pages (App.jsx)
<Route element={<DashboardLayout />}>
  <Route path="/candidates" element={<CandidatesPage />} />
  ...
</Route>

// Application flow (standalone, no sidebar)
<Route path="/apply/:jobId" element={<ApplicationLayout />}>
  <Route index element={<AppLandingPage />} />
  ...
</Route>
```

### Page Structure

```
src/pages/{PageName}/
├── {PageName}.jsx     # Main page component (memo-wrapped)
├── {PageName}.css     # Page-specific styles
├── index.js           # Re-export
└── {SubPage}/         # Optional sub-pages
    ├── {SubPage}.jsx
    ├── {SubPage}.css
    └── index.js
```

### Adding a New Page

1. Create folder: `src/pages/{PageName}/`
2. Create `{PageName}.jsx`, `{PageName}.css`, `index.js`
3. Create a page wrapper function in `App.jsx`
4. Add `<Route>` inside `<DashboardLayout>` in the route definitions
5. Add breadcrumb mapping in `getRouteBreadcrumbs()`
6. Add sidebar nav item in `buildNavItems()`

---

## Barrel Exports

### UI Components (`src/components/ui/index.js`):

```js
export { Button } from './Button';
export { Toggle } from './Toggle';
export { Badge, BADGE_VARIANTS, BADGE_TYPES } from './Badge';
export { Breadcrumb } from './Breadcrumb';
export { EmptyState } from './EmptyState';
export { Pagination } from './Pagination';
export { SidebarButton } from './SidebarButton';
export { User } from './User';
export { Tabs } from './Tabs';
export { Tags } from './Tags';
export { QuickSort } from './QuickSort';
export { Stepper } from './Stepper';
export { TableHeader, TableRow, TableCell } from './Tables';
export { SectionTitle } from './SectionTitle';
export { FilterOverlay } from './FilterOverlay';
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

| Pattern               | Convention                                                                 |
| --------------------- | -------------------------------------------------------------------------- |
| **Component exports** | Named exports: `export const Button = memo(function Button() {})`          |
| **Memoization**       | All components wrapped in `React.memo()`                                   |
| **PropTypes**         | Required for all components                                                |
| **Icons**             | Lucide React: `import { Icon } from 'lucide-react'`                        |
| **Icon sizing**       | In JSX: `<Icon size={16} />`                                               |
| **CSS naming**        | BEM-like: `.component`, `.component--modifier`, `.component__element`      |
| **CSS values**        | Design tokens: `var(--token-name)` — never hardcode                        |
| **className**         | `['cls', cond && 'mod'].filter(Boolean).join(' ')`                         |
| **Disabled styling**  | CSS `:disabled` pseudo-class                                               |
| **Ref forwarding**    | `memo(forwardRef(...))` for input components + set `.displayName`          |
| **Event cleanup**     | Always return cleanup function from `useEffect`                            |
| **Stable callbacks**  | Use `useCallback` for event handlers passed to child components or effects |
| **Constants**         | Module-scope for static config: `const TABLE_COLUMNS = [...]`              |
| **Data exports**      | SCREAMING_CASE for arrays: `CANDIDATES`, camelCase for helpers             |
| **File naming**       | PascalCase: `Button.jsx`, `InputField.jsx`                                 |

---

## Current State & Roadmap

### ✅ Implemented

- 30+ component library (Button, Input variants, Badge, Cards, Tables, Charts, Tabs, Pagination, FilterOverlay, Toggle, Tags, Stepper, EmptyState, RowMenu, QuickSort, SectionTitle, User, etc.)
- Layout system (PageLayout, Navbar with notifications, collapsible Sidebar, Shortcuts)
- Design token system (490+ variables from Figma)
- React Router v6 with nested routes, breadcrumbs, page wrappers
- Centralised data layer (`src/data/`) with full CRUD helpers
- All dashboard pages (Candidates, Jobs, Mocks, CompanyTeam, Profile)
- Candidate-facing application flow (Landing → Form → Overview → MockSession → Complete)
- Portal-rendered FilterOverlay
- Component showcase page

### 🔄 Planned

- Backend API integration (replace in-memory mock data)
- Authentication & protected routes
- Global state management (Context or Zustand when needed)
- Settings page
- Real AI mock session integration

---

## Troubleshooting

| Issue                        | Solution                                                                          |
| ---------------------------- | --------------------------------------------------------------------------------- |
| ESLint config errors         | Use flat config format (`eslint.config.js`), not `.eslintrc`                      |
| Vite HMR not working         | Check export consistency (named vs default)                                       |
| Design token not found       | Check `src/styles/tokens.css` first; don't hardcode                               |
| Import not found from barrel | Ensure exported from both `{Component}/index.js` AND `src/components/ui/index.js` |
