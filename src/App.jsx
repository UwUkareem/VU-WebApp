import { useMemo, useCallback, useState, lazy, Suspense } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import { PageLayout } from './components/layout/PageLayout';
import { Pipeline } from './pages/Candidates/Pipeline/Pipeline';
import { JobList } from './pages/Jobs/JobManagement/JobList';
import { MockList } from './pages/Mocks/MockManagement/MockList/MockList';
import { Overview } from './pages/CompanyTeam/Overview/Overview';
import { getJoinRequestById } from './api';
import { buildApplicationContext } from './api';
import { getCandidateBySlug } from './api';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  UserCircle2,
  Settings,
  Hash,
  ClipboardCheck,
  LayoutTemplate,
} from 'lucide-react';

// ── Lazy-loaded pages (code-split at route level) ──
const CandidateDetails = lazy(() =>
  import('./pages/Candidates/CandidateDetails/CandidateDetails').then((m) => ({
    default: m.CandidateDetails,
  }))
);
const JobDetails = lazy(() =>
  import('./pages/Jobs/JobManagement/JobDetails').then((m) => ({ default: m.JobDetails }))
);
const CreateConfig = lazy(() =>
  import('./pages/Jobs/JobConfigPage').then((m) => ({ default: m.CreateConfig }))
);
const EditConfig = lazy(() =>
  import('./pages/Jobs/JobConfigPage').then((m) => ({ default: m.EditConfig }))
);
const MockDetails = lazy(() =>
  import('./pages/Mocks/MockManagement/MockDetails/MockDetails').then((m) => ({
    default: m.MockDetails,
  }))
);
const CreateMockConfig = lazy(() =>
  import('./pages/Mocks/MockConfigPage').then((m) => ({ default: m.CreateMockConfig }))
);
const EditMockConfig = lazy(() =>
  import('./pages/Mocks/MockConfigPage').then((m) => ({ default: m.EditMockConfig }))
);
const MemberDetails = lazy(() =>
  import('./pages/CompanyTeam/MemberDetails/MemberDetails').then((m) => ({
    default: m.MemberDetails,
  }))
);
const AddMembers = lazy(() =>
  import('./pages/CompanyTeam/AddMembers/AddMembers').then((m) => ({
    default: m.AddMembers,
  }))
);
const CompanySettings = lazy(() =>
  import('./pages/CompanyTeam/CompanySettings/CompanySettings').then((m) => ({
    default: m.CompanySettings,
  }))
);
const ProfilePage = lazy(() => import('./pages/Profile').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() =>
  import('./pages/Settings').then((m) => ({ default: m.SettingsPage }))
);
const JobLanding = lazy(() =>
  import('./pages/Application').then((m) => ({ default: m.JobLanding }))
);
const CandidateForm = lazy(() =>
  import('./pages/Application').then((m) => ({ default: m.CandidateForm }))
);
const JobOverview = lazy(() =>
  import('./pages/Application').then((m) => ({ default: m.JobOverview }))
);
const MockSession = lazy(() =>
  import('./pages/Application').then((m) => ({ default: m.MockSession }))
);
const SubmissionComplete = lazy(() =>
  import('./pages/Application').then((m) => ({ default: m.SubmissionComplete }))
);
const ComponentShowcase = lazy(() =>
  import('./pages/_showcase').then((m) => ({ default: m.ComponentShowcase }))
);

// ── Static config ──
const CURRENT_USER = {
  name: 'Hamedisnt',
  email: 'Hamedisnt@gmail.com',
  icon: Hash,
};

// ── Route → breadcrumb mapping ──
function getRouteBreadcrumbs(pathname, navigate) {
  if (pathname === '/candidates') return [{ label: 'Candidates' }];
  if (/^\/candidates\/[a-z0-9-]+$/.test(pathname)) {
    const slug = pathname.split('/').pop();
    const name = slug
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return [{ label: 'Candidates', onClick: () => navigate('/candidates') }, { label: name }];
  }

  if (pathname === '/jobs') return [{ label: 'Job Management' }];
  if (pathname === '/jobs/create') return [{ label: 'Create Job' }];
  if (/^\/jobs\/\d+$/.test(pathname))
    return [
      { label: 'Job Management', onClick: () => navigate('/jobs') },
      { label: 'Job Details' },
    ];
  if (/^\/jobs\/\d+\/edit$/.test(pathname))
    return [{ label: 'Job Management', onClick: () => navigate('/jobs') }, { label: 'Edit Job' }];

  if (pathname === '/mocks') return [{ label: 'Mock Management' }];
  if (pathname === '/mocks/create') return [{ label: 'Create Mock' }];
  if (/^\/mocks\/\d+$/.test(pathname))
    return [
      { label: 'Mock Management', onClick: () => navigate('/mocks') },
      { label: 'Mock Details' },
    ];
  if (/^\/mocks\/\d+\/edit$/.test(pathname))
    return [
      { label: 'Mock Management', onClick: () => navigate('/mocks') },
      { label: 'Edit Mock' },
    ];

  if (pathname === '/company') return [{ label: 'Overview' }];
  if (/^\/company\/team\/\d+$/.test(pathname))
    return [
      { label: 'Overview', onClick: () => navigate('/company') },
      { label: 'Member Details' },
    ];
  if (pathname === '/company/members') return [{ label: 'Add Members' }];
  if (/^\/company\/members\/\d+$/.test(pathname))
    return [
      { label: 'Add Members', onClick: () => navigate('/company/members') },
      { label: 'Member Details' },
    ];
  if (/^\/company\/requests\/\d+$/.test(pathname))
    return [
      { label: 'Add Members', onClick: () => navigate('/company/members') },
      { label: 'Request Details' },
    ];
  if (pathname === '/company/settings') return [{ label: 'Company Settings' }];

  if (pathname === '/profile') return [{ label: 'My Profile' }];
  if (pathname === '/settings') return [{ label: 'Settings' }];
  if (pathname === '/showcase') return [{ label: 'Component Showcase' }];

  return [{ label: 'Candidates' }];
}

// ── Sidebar nav items derived from current pathname ──
function buildNavItems(pathname, navigate) {
  return [
    {
      icon: Users,
      label: 'Candidates',
      isActive: pathname.startsWith('/candidates'),
      onClick: () => navigate('/candidates'),
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      isActive: pathname.startsWith('/jobs'),
      subItems: [
        {
          label: 'Job Management',
          isActive: pathname.startsWith('/jobs') && pathname !== '/jobs/create',
          onClick: () => navigate('/jobs'),
        },
        {
          label: 'Create Job',
          isActive: pathname === '/jobs/create',
          onClick: () => navigate('/jobs/create'),
        },
      ],
      onClick: () => navigate('/jobs'),
    },
    {
      icon: FileText,
      label: 'Mocks',
      isActive: pathname.startsWith('/mocks'),
      subItems: [
        {
          label: 'Mock Management',
          isActive: pathname.startsWith('/mocks') && pathname !== '/mocks/create',
          onClick: () => navigate('/mocks'),
        },
        {
          label: 'Create Mock',
          isActive: pathname === '/mocks/create',
          onClick: () => navigate('/mocks/create'),
        },
      ],
      onClick: () => navigate('/mocks'),
    },
    {
      icon: Building2,
      label: 'Company',
      isActive: pathname.startsWith('/company'),
      subItems: [
        {
          label: 'Overview',
          isActive: pathname === '/company' || pathname.startsWith('/company/team'),
          onClick: () => navigate('/company'),
        },
        {
          label: 'Add Members',
          isActive:
            pathname.startsWith('/company/members') || pathname.startsWith('/company/requests'),
          onClick: () => navigate('/company/members'),
        },
        {
          label: 'Company Settings',
          isActive: pathname === '/company/settings',
          onClick: () => navigate('/company/settings'),
        },
      ],
      onClick: () => navigate('/company'),
      separator: true,
    },
    {
      icon: UserCircle2,
      label: 'Profile',
      isActive: pathname === '/profile',
      onClick: () => navigate('/profile'),
    },
    {
      icon: Settings,
      label: 'Settings',
      isActive: pathname === '/settings',
      onClick: () => navigate('/settings'),
      separator: true,
    },
    {
      icon: LayoutTemplate,
      label: 'Showcase',
      isActive: pathname === '/showcase',
      onClick: () => navigate('/showcase'),
    },
    {
      icon: ClipboardCheck,
      label: 'Application',
      isActive: pathname.startsWith('/apply'),
      onClick: () => navigate('/apply/1'),
    },
  ];
}

// ══════════════════════════════════════════════════════════
// Dashboard layout — sidebar + navbar + breadcrumbs
// ══════════════════════════════════════════════════════════
function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = getRouteBreadcrumbs(location.pathname, navigate);

  const navItems = useMemo(
    () => buildNavItems(location.pathname, navigate),
    [location.pathname, navigate]
  );

  const handleNavigate = useCallback(
    (page) => {
      const routes = {
        profile: '/profile',
        settings: '/settings',
        'company-settings': '/company/settings',
      };
      if (routes[page]) navigate(routes[page]);
    },
    [navigate]
  );

  return (
    <PageLayout
      navItems={navItems}
      user={CURRENT_USER}
      breadcrumbItems={breadcrumbs}
      onNavigate={handleNavigate}
    >
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </PageLayout>
  );
}

// ══════════════════════════════════════════════════════════
// Page wrappers — bridge route params → component props
// ══════════════════════════════════════════════════════════
function CandidatesPage() {
  return <Pipeline />;
}
function CandidateDetailsPage() {
  const { slug } = useParams();
  const candidate = getCandidateBySlug(slug);
  if (!candidate) return <Navigate to="/candidates" replace />;
  return <CandidateDetails candidate={candidate} />;
}

function JobListPage() {
  const navigate = useNavigate();
  return (
    <JobList
      onViewJob={(id) => navigate(`/jobs/${id}`)}
      onEditJob={(id) => navigate(`/jobs/${id}/edit`)}
      onCreateJob={() => navigate('/jobs/create')}
    />
  );
}

function JobDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <JobDetails
      jobId={Number(id)}
      onEdit={() => navigate(`/jobs/${id}/edit`)}
      onDuplicate={(newId) => navigate(`/jobs/${newId}`)}
      onViewJob={(newId) => navigate(`/jobs/${newId}`)}
      onTest={() => navigate(`/apply/${id}`)}
    />
  );
}

function CreateJobPage() {
  const navigate = useNavigate();
  return <CreateConfig onCreated={(id) => navigate(`/jobs/${id}`)} />;
}

function EditJobPage() {
  const { id } = useParams();
  return <EditConfig jobId={Number(id)} />;
}

function MockListPage() {
  const navigate = useNavigate();
  return (
    <MockList
      onViewMock={(id) => navigate(`/mocks/${id}`)}
      onEditMock={(id) => navigate(`/mocks/${id}/edit`)}
      onCreateMock={() => navigate('/mocks/create')}
    />
  );
}

function MockDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <MockDetails
      mockId={Number(id)}
      onEdit={() => navigate(`/mocks/${id}/edit`)}
      onDuplicate={(newId) => navigate(`/mocks/${newId}`)}
      onViewMock={(newId) => navigate(`/mocks/${newId}`)}
      onTestMock={(jobId) => navigate(`/apply/${jobId}/mock/${id}`)}
    />
  );
}

function CreateMockPage() {
  const navigate = useNavigate();
  return <CreateMockConfig onCreated={(id) => navigate(`/mocks/${id}`)} />;
}

function EditMockPage() {
  const { id } = useParams();
  return <EditMockConfig mockId={Number(id)} />;
}

function OverviewPage() {
  const navigate = useNavigate();
  return (
    <Overview
      onEditCompany={() => navigate('/company/settings')}
      onViewMember={(id) => navigate(`/company/team/${id}`)}
    />
  );
}

function TeamMemberPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <MemberDetails memberId={Number(id)} onRemoved={() => navigate('/company')} />;
}

function AddMembersPage() {
  const navigate = useNavigate();
  return (
    <AddMembers
      onViewMember={(id) => navigate(`/company/members/${id}`)}
      onViewRequest={(id) => navigate(`/company/requests/${id}`)}
    />
  );
}

function MemberFromRequestsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  return <MemberDetails memberId={Number(id)} onRemoved={() => navigate('/company/members')} />;
}

function RequestDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = getJoinRequestById(Number(id));
  if (!request) return <Navigate to="/company/members" replace />;
  return (
    <MemberDetails
      request={request}
      onAccepted={(memberId) => navigate(`/company/members/${memberId}`)}
      onDeclined={() => navigate('/company/members')}
    />
  );
}

// ══════════════════════════════════════════════════════════
// Application layout — candidate-facing, no dashboard chrome
// ══════════════════════════════════════════════════════════
function ApplicationLayout() {
  const { jobId } = useParams();
  const [lastJobId, setLastJobId] = useState(null);

  // Initialize application data when jobId changes (React derived-state pattern)
  if (lastJobId !== jobId) {
    buildApplicationContext(Number(jobId) || 1);
    setLastJobId(jobId);
  }

  return (
    <div className="application-shell">
      <div className="application-shell__main">
        <Suspense fallback={null}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
}

function AppLandingPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  return <JobLanding onApply={() => navigate(`/apply/${jobId}/form`)} />;
}

function AppFormPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  return (
    <CandidateForm
      onSubmit={() => navigate(`/apply/${jobId}/overview`)}
      onBack={() => navigate(`/apply/${jobId}`)}
    />
  );
}

function AppOverviewPage() {
  const navigate = useNavigate();
  const { jobId } = useParams();
  return (
    <JobOverview
      onStartMock={(mockId) => navigate(`/apply/${jobId}/mock/${mockId}`)}
      onSubmitApplication={() => navigate(`/apply/${jobId}/complete`)}
    />
  );
}

function AppMockPage() {
  const navigate = useNavigate();
  const { jobId, mockId } = useParams();
  return (
    <MockSession mockId={Number(mockId)} onComplete={() => navigate(`/apply/${jobId}/overview`)} />
  );
}

function AppCompletePage() {
  const navigate = useNavigate();
  return <SubmissionComplete onBackToJobs={() => navigate('/candidates')} />;
}

// ══════════════════════════════════════════════════════════
// Root — route definitions
// ══════════════════════════════════════════════════════════
export default function App() {
  return (
    <Routes>
      {/* Dashboard pages (with sidebar + navbar) */}
      <Route element={<DashboardLayout />}>
        <Route path="/candidates" element={<CandidatesPage />} />
        <Route path="/candidates/:slug" element={<CandidateDetailsPage />} />
        <Route path="/jobs" element={<JobListPage />} />
        <Route path="/jobs/create" element={<CreateJobPage />} />
        <Route path="/jobs/:id" element={<JobDetailsPage />} />
        <Route path="/jobs/:id/edit" element={<EditJobPage />} />
        <Route path="/mocks" element={<MockListPage />} />
        <Route path="/mocks/create" element={<CreateMockPage />} />
        <Route path="/mocks/:id" element={<MockDetailsPage />} />
        <Route path="/mocks/:id/edit" element={<EditMockPage />} />
        <Route path="/company" element={<OverviewPage />} />
        <Route path="/company/team/:id" element={<TeamMemberPage />} />
        <Route path="/company/members" element={<AddMembersPage />} />
        <Route path="/company/members/:id" element={<MemberFromRequestsPage />} />
        <Route path="/company/requests/:id" element={<RequestDetailsPage />} />
        <Route path="/company/settings" element={<CompanySettings />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/showcase" element={<ComponentShowcase />} />
      </Route>

      {/* Application flow (candidate-facing, standalone) */}
      <Route path="/apply/:jobId" element={<ApplicationLayout />}>
        <Route index element={<AppLandingPage />} />
        <Route path="form" element={<AppFormPage />} />
        <Route path="overview" element={<AppOverviewPage />} />
        <Route path="mock/:mockId" element={<AppMockPage />} />
        <Route path="complete" element={<AppCompletePage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/candidates" replace />} />
    </Routes>
  );
}
