# VU - AI-Powered Virtual Interview Platform

> Making hiring and interview preparation more human, intelligent, and bias-free — by merging AI analytics with real communication.

## What is VU?

VU is an AI-powered virtual interview platform that reimagines how people are evaluated and how companies recruit. Instead of relying on static CV filters or outdated test systems, VU enables interactive AI interviews that automatically assess communication, technical knowledge, and confidence.

### Two Modes

| Mode                 | For         | Features                                                            |
| -------------------- | ----------- | ------------------------------------------------------------------- |
| **Practice Mode**    | Job Seekers | Mock interviews, AI coaching, real-time feedback, skill analytics   |
| **Recruitment Mode** | Companies   | AI-led interviews, candidate ranking, analytics dashboards, reports |

### Core Features

- **AI-Driven Virtual Screening** — Automated video interviews with AI evaluation
- **Smart Question Generation** — Tailored questions based on CV, role, and difficulty
- **Cheating & Authenticity Detection** — Eye tracking, face recognition, tab-switching detection
- **Analytics Dashboards** — Performance insights, progress tracking, skill heat maps
- **AI Feedback & Reports** — Automated summaries of strengths, weaknesses, and skill match

## Related Repositories

| Repository                                                        | Description                |
| ----------------------------------------------------------------- | -------------------------- |
| **[VU-WebApp (Backend)](https://github.com/Eyad-AbdElMohsen/VU)** | Backend API services       |
| **This Repo**                                                     | Frontend React application |

## Design

**Figma**: [VU-WebApp Design](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp?node-id=3-19&t=L6mHSgM4Kqr0tyu2-1)

---

## Tech Stack

| Technology       | Version | Purpose                                     |
| ---------------- | ------- | ------------------------------------------- |
| **React**        | 19      | UI Framework                                |
| **Vite**         | 7       | Build tool & HMR dev server                 |
| **React Router** | 6       | Client-side routing (declarative URL-based) |
| **Recharts**     | 2       | Charting library (Area, Bar, Radar, Radial) |
| **Lucide React** | 0.562+  | Icon components                             |
| **PropTypes**    | 15.8+   | Runtime prop validation                     |
| **ESLint**       | 9       | Linting (flat config)                       |

### Design System

- **490+ CSS variables** in `src/styles/tokens.css` (exported from Figma)
- **BEM-like component CSS** — each component owns its `.css` file, classes follow `.block`, `.block__element`, `.block--modifier`
- **React Router v6** — full declarative URL-based navigation with `useNavigate`, `useParams`, nested routes

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/UwUkareem/VU-WebApp.git
cd vu-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start dev server with HMR |
| `npm run build`   | Build for production      |
| `npm run preview` | Preview production build  |
| `npm run lint`    | Run ESLint                |

---

## Project Structure

```
src/
├── main.jsx                        # App entry point
├── App.jsx                         # Root component + React Router v6 route definitions
├── styles/
│   ├── index.css                   # Global CSS reset + design token import
│   └── tokens.css                  # 490+ Figma-exported design tokens
├── data/                           # Centralised in-memory mock data + CRUD helpers
│   ├── index.js                    # Barrel export for all data helpers
│   ├── candidates.js               # Candidates, pipeline stages, filters
│   ├── jobs.js                     # Jobs list with status, dates, stats, CRUD
│   ├── mocks.js                    # Mock interviews, CRUD, getJobsUsingMock
│   ├── company.js                  # Company info, team members, join requests
│   ├── application.js              # Candidate-facing application session data
│   └── config.js                   # Shared config constants
├── components/
│   ├── layout/                     # App shell components
│   │   ├── Navbar/                 # Top bar + NotificationDropdown + avatar menu
│   │   ├── PageLayout/             # Main layout (sidebar + navbar + content area)
│   │   ├── Shortcuts/              # Action bar (filters, search, create button)
│   │   ├── Sidebar/                # Collapsible navigation sidebar
│   │   └── index.js                # Barrel export
│   └── ui/                         # Reusable UI primitives
│       ├── Badge/                  # Badge + RoleBadge + variants config
│       ├── Breadcrumb/             # Breadcrumb navigation trail
│       ├── Button/                 # Button (primary, secondary, ghost, danger, dashed)
│       ├── Cards/                  # ActionCard, EntityCard, InfoCard, QuestionCard, QuickInfoCard
│       ├── Charts/                 # AreaChart, BarChart, RadarChart, RadialBarChart + chartTokens
│       ├── EmptyState/             # Empty placeholder for sections with no data
│       ├── FilterOverlay/          # Slide-in filter panel (portal-rendered, avoids overflow clipping)
│       ├── Input/                  # Input, InputField, DropdownInput, Label, Hint + variants
│       ├── Pagination/             # Table/list pagination
│       ├── QuickSort/              # Sort dropdown
│       ├── RowMenu/                # Context menu for table rows
│       ├── SectionTitle/           # Section header with optional action slot
│       ├── SidebarButton/          # Navigation button used in Sidebar
│       ├── Stepper/                # Multi-step progress indicator
│       ├── Tables/                 # TableHeader, TableRow, TableCell
│       ├── Tabs/                   # Tab navigation (supports scrollRef for auto scroll-reset)
│       ├── Tags/                   # Tag chips with add/remove
│       ├── Toggle/                 # Toggle switch (boolean onChange)
│       ├── User/                   # User avatar + name display
│       └── index.js                # Barrel export for all UI components
└── pages/                          # Route-level page components
    ├── _showcase/                  # Component demo/showcase page
    ├── Candidates/
    │   ├── Pipeline/               # Candidate pipeline table + FilterOverlay + pagination
    │   └── CandidateDetails/       # Tabbed detail view (CVAnalysis, FullFeedback, MockReplay)
    ├── Jobs/
    │   └── JobManagement/
    │       ├── JobList/            # Jobs table + search + Create Job button
    │       └── JobDetails/         # Job detail sidebar layout + charts + candidate table
    ├── Mocks/
    │   └── MockManagement/
    │       ├── MockList/           # Mocks table + search + filters
    │       └── MockDetails/        # Mock detail sidebar layout + charts + jobs list
    ├── CompanyTeam/
    │   ├── Overview/               # Company stats + team member table
    │   ├── AddMembers/             # Join requests management
    │   ├── MemberDetails/          # Team member / request detail view
    │   └── CompanySettings/        # Company info + department tags management
    ├── Profile/                    # User profile (edit mode, password, activity timeline)
    └── Application/                # Candidate-facing application flow (standalone, no sidebar)
        ├── JobLanding/             # Job description + Apply button
        ├── CandidateForm/          # Application form (personal info, CV upload)
        ├── JobOverview/            # Mock interview checklist + start prompts
        ├── MockSession/            # Live mock interview (intro → interview phases)
        └── SubmissionComplete/     # Confirmation screen
```

### Key Files

| File                             | Purpose                                                 |
| -------------------------------- | ------------------------------------------------------- |
| `src/App.jsx`                    | Root component — React Router v6 routes + page wrappers |
| `src/styles/tokens.css`          | Design tokens — single source of truth (490+ vars)      |
| `src/styles/index.css`           | Global CSS reset + token import                         |
| `src/data/index.js`              | Central barrel export for all data helpers              |
| `src/components/ui/index.js`     | Central barrel export for all UI primitives             |
| `src/components/layout/index.js` | Barrel export for layout components                     |
| `src/pages/_showcase/`           | Component demo page (useful for visual testing)         |

---

## Component Architecture

### Standard Component Structure

Each component follows this folder pattern:

```
src/components/ui/{ComponentName}/
├── {ComponentName}.jsx     # Component logic + PropTypes + memo()
├── {ComponentName}.css     # BEM-like CSS with design tokens
└── index.js                # Named re-export
```

### Conventions

- **All UI components** are wrapped in `React.memo()` for render optimization
- **Named exports only** — no default exports (consistent barrel pattern)
- **PropTypes** required on every component for runtime validation
- **BEM-like CSS** — `.component`, `.component--modifier`, `.component__element`
- **Design tokens** — reference `var(--token-name)` from `tokens.css`, never hardcode colors/sizes
- **className assembly** — `['cls', cond && 'mod'].filter(Boolean).join(' ')`
- **Lucide React** — all icons come from `lucide-react`
- **Stable callbacks** — `useCallback` for handlers passed to children or effects

### Data Layer

All data lives in `src/data/` — a single centralised layer of in-memory mock data with mutable CRUD helpers:

| File                  | Data                                                             |
| --------------------- | ---------------------------------------------------------------- |
| `data/candidates.js`  | Candidates, pipeline stages, stage transitions, filters          |
| `data/jobs.js`        | Jobs with status, stats, mocks list; create/update/duplicate     |
| `data/mocks.js`       | Mock interviews; create/update/duplicate; `getJobsUsingMock`     |
| `data/company.js`     | Company info, team members, join requests, department tags       |
| `data/application.js` | Candidate-facing session state (form data, mock progress)        |
| `data/config.js`      | Shared constants (seniority levels, job types, difficulty, etc.) |

---

## Design Tokens

490+ CSS variables in `src/styles/tokens.css`:

| Category    | Examples                                                                            |
| ----------- | ----------------------------------------------------------------------------------- |
| Typography  | `--font-sans`, `--text-sm`, `--font-medium`                                         |
| Spacing     | `--size-1`, `--gap-sm`, `--gap-lg`                                                  |
| Colors      | `--brand-default`, `--bg-base`, `--text-primary`                                    |
| Components  | `--btn-primary-bg`, `--input-border`, `--card-bg`                                   |
| Borders     | `--radius-sm`, `--radius-md`, `--border-subtle`                                     |
| Shadows     | `--shadow-sm`, `--shadow-md`, `--shadow-card`                                       |
| Status      | `--status-success-*`, `--status-error-*`, `--status-danger-*`, `--status-warning-*` |
| Transitions | `--transition-fast`, `--transition-base`                                            |

---

## Pages

### Current Status

| Page            | Status         | Sub-pages / Routes                                                                                               |
| --------------- | -------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Candidates**  | ✅ Implemented | Pipeline (`/candidates`), CandidateDetails (`/candidates/:id`) with CV Analysis, Full Feedback, Mock Replay tabs |
| **Jobs**        | ✅ Implemented | JobList (`/jobs`), JobDetails (`/jobs/:id`) with Share Job, Test Application, status management                  |
| **Mocks**       | ✅ Implemented | MockList (`/mocks`), MockDetails (`/mocks/:id`) with Test Mock, Edit, Duplicate                                  |
| **Company**     | ✅ Implemented | Overview, AddMembers, MemberDetails, CompanySettings (`/company/*`)                                              |
| **Profile**     | ✅ Implemented | Profile view/edit, password change, activity timeline (`/profile`)                                               |
| **Application** | ✅ Implemented | Candidate-facing flow: Landing → Form → Overview → MockSession → Complete (`/apply/:jobId/*`)                    |
| **Settings**    | 🔄 Placeholder | Currently shows ComponentShowcase                                                                                |

### Routing (React Router v6)

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
/profile                  → Profile
/apply/:jobId             → JobLanding (candidate-facing)
/apply/:jobId/form        → CandidateForm
/apply/:jobId/overview    → JobOverview (mock checklist)
/apply/:jobId/mock/:mockId→ MockSession (live interview)
/apply/:jobId/complete    → SubmissionComplete
```

### Sidebar Navigation

```
Candidates
Jobs
Mocks
Company
  ├── Overview
  ├── Add Members
  └── Company Settings
───────────
Profile
Settings
```

### PageLayout Pattern

All dashboard pages render inside `PageLayout` (sidebar + navbar + content area). The application flow (`/apply/*`) uses a standalone `ApplicationLayout` with no sidebar.

```jsx
// Dashboard pages
<PageLayout breadcrumbItems={breadcrumbs}>
  <YourPageContent />
</PageLayout>

// Application flow (candidate-facing)
<div className="application-shell">
  <Outlet />
</div>
```

---

## Current State & Roadmap

### Implemented

- ✅ **Component library** — 20+ components: Button, Input variants (text, email, password, search, dropdown), Badge, Cards (Action, Entity, Info, Question, QuickInfo), Tables, Charts (Area, Bar, Radar, Radial), Tabs, Pagination, FilterOverlay, Toggle, Tags, Stepper, EmptyState, RowMenu, QuickSort, SectionTitle, User
- ✅ **Layout system** — PageLayout, Navbar (notifications + avatar dropdown), collapsible Sidebar, Shortcuts action bar
- ✅ **Design token system** — 490+ variables from Figma (`tokens.css`)
- ✅ **React Router v6** — URL-based navigation with `useNavigate`, `useParams`, nested routes
- ✅ **Centralised data layer** — `src/data/` with full CRUD helpers for all entities
- ✅ **All dashboard pages** — Candidates, Jobs, Mocks, Company, Profile with full detail views
- ✅ **Candidate-facing application flow** — Job landing → form → mock overview → live mock session → completion
- ✅ **FilterOverlay** — Portal-rendered slide-in filter panel (escapes `overflow: hidden` parent constraints)
- ✅ **Share Job** — Copies candidate application URL to clipboard with visual feedback
- ✅ **Breadcrumb navigation** — Contextual back-links per page

### Planned

- Backend API integration (replace in-memory mock data)
- Authentication & protected routes
- Global state management (Context or Zustand when needed)
- Settings page
- Real AI mock session integration

---

## Additional Resources

- **Figma Design**: [VU-WebApp](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp?node-id=3-19&t=L6mHSgM4Kqr0tyu2-1)
- **Backend Repository**: [VU-WebApp Backend](https://github.com/Eyad-AbdElMohsen/VU)
- **Copilot Instructions**: `.github/copilot-instructions.md` for AI coding guidance

---

## License

This project is part of a graduation project.
