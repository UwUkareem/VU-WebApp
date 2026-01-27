# VU - AI-Powered Virtual Interview Platform

> Making hiring and interview preparation more human, intelligent, and bias-free — by merging AI analytics with real communication.

## 🎯 What is VU?

VU is an AI-powered virtual interview platform that reimagines how people are evaluated and how companies recruit. Instead of relying on static CV filters or outdated test systems, VU enables interactive AI interviews that automatically assess communication, technical knowledge, and confidence.

### Two Modes

| Mode                 | For         | Features                                                            |
| -------------------- | ----------- | ------------------------------------------------------------------- |
| **Practice Mode**    | Job Seekers | Mock interviews, AI coaching, real-time feedback, skill analytics   |
| **Recruitment Mode** | Companies   | AI-led interviews, candidate ranking, analytics dashboards, reports |

### Core Features

- 🎥 **AI-Driven Virtual Screening** - Automated video interviews with AI evaluation
- 🎯 **Smart Question Generation** - Tailored questions based on CV, role, and difficulty
- 🛡️ **Cheating & Authenticity Detection** - Eye tracking, face recognition, tab-switching detection
- 📊 **Analytics Dashboards** - Performance insights, progress tracking, skill heat maps
- 📝 **AI Feedback & Reports** - Automated summaries of strengths, weaknesses, and skill match

## 🔗 Related Repositories

| Repository                                                            | Description                |
| --------------------------------------------------------------------- | -------------------------- |
| **[VU-WebApp (Backend)](https://github.com/UwUkareem/VU-WebApp.git)** | Backend API services       |
| **This Repo**                                                         | Frontend React application |

## 🎨 Design

**Figma**: [VU-WebApp Design](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp?node-id=3-19&t=L6mHSgM4Kqr0tyu2-1)

---

## 🛠️ Tech Stack

| Technology       | Version | Purpose                                    |
| ---------------- | ------- | ------------------------------------------ |
| **React**        | 19      | UI Framework                               |
| **Vite**         | 7       | Build tool & HMR dev server                |
| **Tailwind CSS** | 4       | Utility-first styling with `@theme` config |
| **Lucide React** | 0.562+  | Icon components                            |
| **PropTypes**    | 15.8+   | Runtime prop validation                    |
| **ESLint**       | 9       | Linting (flat config)                      |
| **Prettier**     | 3.7     | Code formatting + Tailwind class sorting   |

### Design System

- **460+ CSS variables** exported from Figma in `src/styles/tokens.css`
- **Hybrid styling**: BEM-like component CSS + Tailwind utilities for layout
- **No routing library yet** - manual state-based navigation (React Router planned)

---

## 🚀 Getting Started

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

## 📁 Project Structure

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
│       └── index.js           # Barrel export
├── pages/                     # Route-level page components
│   ├── Candidates/            # CandidatesPage + Pipeline/
│   ├── CompanyTeam/           # (placeholder)
│   ├── Jobs/                  # (placeholder)
│   ├── Mocks/                 # (placeholder)
│   ├── Profile/               # (placeholder)
│   └── _showcase/             # ComponentShowcase (demo page)
├── styles/
│   ├── index.css              # Tailwind CSS 4 import + @theme config
│   └── tokens.css             # 460+ Figma-exported CSS variables
└── assets/                    # Static images, icons
```

### Key Files

| File                             | Purpose                                      |
| -------------------------------- | -------------------------------------------- |
| `src/components/ui/index.js`     | Central barrel export for UI components      |
| `src/components/layout/index.js` | Barrel export for layout components          |
| `src/styles/tokens.css`          | Design tokens - single source of truth       |
| `src/styles/index.css`           | Tailwind CSS 4 config via `@theme`           |
| `src/App.jsx`                    | Main entry point with state-based navigation |
| `src/pages/_showcase/`           | Component demo page                          |

---

## 🧩 Component Architecture

### Standard Component Structure

Each component follows this folder pattern:

```
src/components/ui/{ComponentName}/
├── {ComponentName}.jsx     # Component logic + PropTypes
├── {ComponentName}.css     # BEM-like CSS with design tokens
└── index.js                # Re-export
```

### Styling Approach

1. **Component CSS**: BEM-like classes (`.component`, `.component--modifier`, `.component__element`)
2. **Design Tokens**: Reference `var(--token-name)` from `tokens.css` - never hardcode colors/sizes
3. **Tailwind Utilities**: Apply via `className` prop for layout/spacing
4. **No `@apply`**: Tailwind CSS 4 doesn't support `@apply` in component CSS

### PropTypes (Required)

All components must include PropTypes for runtime validation:

```jsx
import PropTypes from 'prop-types';

Button.propTypes = {
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  disabled: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
};
```

### Icons

Using **Lucide React** for all icons:

```jsx
import { Users, Briefcase, Bell } from 'lucide-react';

<Button iconLeft={<Users size={16} />}>Candidates</Button>;
```

---

## 🎨 Design Tokens

460+ CSS variables in `src/styles/tokens.css`:

| Category   | Examples                                          |
| ---------- | ------------------------------------------------- |
| Typography | `--font-sans`, `--text-sm`, `--font-medium`       |
| Spacing    | `--size-1`, `--gap-sm`, `--gap-lg`                |
| Colors     | `--brand-default`, `--bg-base`, `--text-primary`  |
| Components | `--btn-primary-bg`, `--input-border`, `--card-bg` |
| Borders    | `--radius-sm`, `--radius-md`, `--border-subtle`   |

### Variant Configs

Components with multiple variants use centralized configs:

```js
// src/components/ui/Badge/variants.js
export const BADGE_VARIANTS = {
  candidateState: {
    accepted: { label: 'Accepted', color: 'green', Icon: CircleCheck },
    pending: { label: 'Pending', color: 'yellow', Icon: Clock },
    // ...
  },
  cheatingFlag: {
    /* ... */
  },
  jobStatus: {
    /* ... */
  },
  role: {
    /* ... */
  },
};
```

---

## 📄 Pages

### Current Pages

| Page           | Status         | Description              |
| -------------- | -------------- | ------------------------ |
| Candidates     | 🔄 Placeholder | Pipeline view with table |
| Jobs           | 🔄 Placeholder | Jobs management          |
| Mocks          | 🔄 Placeholder | Mock interviews          |
| Company & Team | 🔄 Placeholder | Company settings         |
| Profile        | 🔄 Placeholder | User profile             |
| \_showcase     | ✅ Implemented | Component demo page      |

### PageLayout Pattern

All pages use `PageLayout` component (sidebar + navbar + content):

```jsx
<PageLayout navItems={navItems} user={user} breadcrumbItems={breadcrumbs}>
  <YourPageContent />
</PageLayout>
```

---

## 🚧 Current State & Roadmap

### ✅ Implemented

- Component library (Button, Input variants, Badge, Cards, Tables, Tabs, Pagination, etc.)
- Layout system (PageLayout, Navbar, Sidebar, Shortcuts)
- Design token system (460+ variables from Figma)
- Candidates page with Pipeline view
- Component showcase page

### 🔄 Planned

- React Router integration (replace manual state navigation)
- Backend API integration
- Global state management (Context/Zustand when needed)
- Remaining pages (Jobs, Mocks, CompanyTeam, Profile)

---

## 📚 Additional Resources

- **Figma Design**: [VU-WebApp](https://www.figma.com/design/LgLS6zCwbhl4yISLlsN2qC/VU-WebApp?node-id=3-19&t=L6mHSgM4Kqr0tyu2-1)
- **Backend Repository**: [VU-WebApp Backend](https://github.com/Eyad-AbdElMohsen/VU)
- **Copilot Instructions**: `.github/copilot-instructions.md` for AI coding guidance

---

## 📄 License

This project is part of a graduation project.
