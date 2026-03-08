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
| **Tailwind CSS** | 4       | Utility-first styling with `@theme` config  |
| **Recharts**     | 2       | Charting library (Area, Bar, Radar, Radial) |
| **Lucide React** | 0.562+  | Icon components                             |
| **PropTypes**    | 15.8+   | Runtime prop validation                     |
| **ESLint**       | 9       | Linting (flat config)                       |
| **Prettier**     | 3.7     | Code formatting + Tailwind class sorting    |

### Design System

- **490+ CSS variables** in `src/styles/tokens.css` (exported from Figma)
- **Hybrid styling**: BEM-like component CSS + Tailwind utilities for layout
- **No routing library yet** — manual state-based navigation (React Router planned)

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
├── App.jsx                         # Root component + state-based router
├── styles/
│   ├── index.css                   # Tailwind CSS 4 import + @theme config
│   └── tokens.css                  # 490+ Figma-exported design tokens
├── components/
│   ├── layout/                     # App shell components
│   │   ├── Navbar/                 # Top bar + NotificationDropdown + avatar menu
│   │   ├── PageLayout/             # Main layout (sidebar + navbar + content area)
│   │   ├── Shortcuts/              # Action bar (filters, search, bulk actions)
│   │   ├── Sidebar/                # Collapsible navigation sidebar
│   │   └── index.js                # Barrel export
│   └── ui/                         # Reusable UI primitives
│       ├── Badge/                  # Badge + RoleBadge + variants config
│       ├── Breadcrumb/             # Breadcrumb navigation
│       ├── Button/                 # Button (primary, secondary, ghost, danger, dashed)
│       ├── Cards/                  # ActionCard, EntityCard, InfoCard, QuestionCard, QuickInfoCard
│       ├── Charts/                 # AreaChart, BarChart, RadarChart, RadialBarChart + chartTokens
│       ├── EmptyState/             # Empty placeholder for sections with no data
│       ├── Input/                  # Input, InputField, Label, Hint + variants (Email, Password, Search, Select, etc.)
│       ├── Pagination/             # Table/list pagination
│       ├── QuickSort/              # Sort dropdown
│       ├── RowMenu/                # Context menu for table rows
│       ├── SectionTitle/           # Section header with optional action
│       ├── SidebarButton/          # Navigation button used in Sidebar
│       ├── Stepper/                # Multi-step progress indicator
│       ├── Tables/                 # TableHeader, TableRow, TableCell
│       ├── Tabs/                   # Tab navigation
│       ├── Tags/                   # Tag input with add/remove
│       ├── Toggle/                 # Toggle switch
│       ├── User/                   # User avatar + name display
│       └── index.js                # Barrel export for all UI components
└── pages/                          # Route-level page components
    ├── _showcase/                  # Component demo/showcase page
    ├── Candidates/
    │   ├── Pipeline/               # Main candidate pipeline (table + filters)
    │   ├── CandidateDetails/       # Detail view (CVAnalysis, FullFeedback, MockReplay)
    │   └── _shared/candidateData.js
    ├── Jobs/
    │   ├── JobManagement/          # JobList + JobDetails
    │   ├── JobConfigPage/          # CreateConfig + EditConfig + form
    │   └── _shared/                # jobData.js, jobConfigData.js
    ├── Mocks/
    │   ├── MockManagement/         # MockList + MockDetails
    │   ├── MockConfigPage/         # CreateMockConfig + EditMockConfig + form
    │   └── _shared/                # mockData.js, mockConfigData.js
    ├── CompanyTeam/
    │   ├── Overview/               # Company stats + team member table
    │   ├── AddMembers/             # Join requests management
    │   ├── MemberDetails/          # Team member / request detail view
    │   ├── CompanySettings/        # Company info + department tags management
    │   └── _shared/companyData.js  # Shared company/team mock data + CRUD helpers
    └── Profile/                    # User profile (edit mode, password, activity timeline)
```

### Key Files

| File                             | Purpose                                             |
| -------------------------------- | --------------------------------------------------- |
| `src/App.jsx`                    | Root component — state-based page router (~510 LOC) |
| `src/styles/tokens.css`          | Design tokens — single source of truth (490+ vars)  |
| `src/styles/index.css`           | Tailwind CSS 4 config via `@theme` directive        |
| `src/components/ui/index.js`     | Central barrel export for all UI primitives         |
| `src/components/layout/index.js` | Barrel export for layout components                 |
| `src/pages/_showcase/`           | Component demo page (useful for visual testing)     |

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
- **Tailwind utilities** — applied via `className` prop for layout/spacing, no `@apply`
- **Lucide React** — all icons come from `lucide-react`

### Data Layer

Currently using in-memory mock data with mutable CRUD helpers in `_shared/` folders:

| File                                                   | Data                                      |
| ------------------------------------------------------ | ----------------------------------------- |
| `pages/Candidates/_shared/candidateData.js`            | Candidates, pipeline stages, filters      |
| `pages/Jobs/JobManagement/_shared/jobData.js`          | Jobs list with status, dates, stats       |
| `pages/Jobs/JobConfigPage/_shared/jobConfigData.js`    | Job creation/edit field configs           |
| `pages/Mocks/MockManagement/_shared/mockData.js`       | Mock interviews list                      |
| `pages/Mocks/MockConfigPage/_shared/mockConfigData.js` | Mock creation field configs               |
| `pages/CompanyTeam/_shared/companyData.js`             | Company info, team members, join requests |

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

| Page       | Status         | Sub-pages                                                  |
| ---------- | -------------- | ---------------------------------------------------------- |
| Candidates | ✅ Implemented | Pipeline, CandidateDetails (CV Analysis, Feedback, Replay) |
| Jobs       | ✅ Implemented | JobList, JobDetails, CreateJob, EditJob                    |
| Mocks      | ✅ Implemented | MockList, MockDetails, CreateMock, EditMock                |
| Company    | ✅ Implemented | Overview, AddMembers, MemberDetails, CompanySettings       |
| Profile    | ✅ Implemented | Profile view/edit, password change, activity timeline      |
| Settings   | 🔄 Placeholder | Currently shows ComponentShowcase                          |

### Sidebar Navigation

```
Candidates
Jobs
  ├── Job Management
  └── Create Job
Mocks
  ├── Mock Management
  └── Create Mock
Company
  ├── Overview
  ├── Add Members
  └── Company Settings
───────────
Profile
Settings
```

### PageLayout Pattern

All pages render inside `PageLayout` (sidebar + navbar + content area):

```jsx
<PageLayout
  navItems={navItems}
  user={user}
  breadcrumbItems={breadcrumbs}
  onNavigate={handleNavigate}
>
  <YourPageContent />
</PageLayout>
```

---

## Current State & Roadmap

### Implemented

- Full component library (20+ components: Button, Input variants, Badge, Cards, Tables, Charts, Tabs, Pagination, etc.)
- Layout system (PageLayout, Navbar with notifications + avatar dropdown, collapsible Sidebar, Shortcuts)
- Design token system (490+ variables from Figma)
- All 5 main pages with sub-pages and full CRUD flows
- Breadcrumb navigation with clickable back-links
- In-memory mock data with create/update/delete/duplicate operations

### Planned

- React Router integration (replace manual state-based navigation)
- Backend API integration (replace in-memory mock data)
- Global state management (Context or Zustand when needed)
- Authentication & protected routes
- Settings page

---

## Additional Resources

- **Figma Design**: [VU-WebApp](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp?node-id=3-19&t=L6mHSgM4Kqr0tyu2-1)
- **Backend Repository**: [VU-WebApp Backend](https://github.com/Eyad-AbdElMohsen/VU)
- **Copilot Instructions**: `.github/copilot-instructions.md` for AI coding guidance

---

## License

This project is part of a graduation project.
