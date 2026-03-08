import { useState, useCallback } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { Pipeline } from './pages/Candidates';
import { JobList } from './pages/Jobs/JobManagement/JobList';
import { JobDetails } from './pages/Jobs/JobManagement/JobDetails';
import { CreateConfig, EditConfig } from './pages/Jobs/JobConfigPage';
import { MockList, MockDetails } from './pages/Mocks/MockManagement';
import { CreateMockConfig, EditMockConfig } from './pages/Mocks/MockConfigPage';
import { Overview, MemberDetails, AddMembers, CompanySettings } from './pages/CompanyTeam';
import { ProfilePage } from './pages/Profile';
import {
  JobLanding,
  CandidateForm,
  JobOverview,
  MockSession,
  SubmissionComplete,
} from './pages/Application';
import { getJoinRequestById } from './pages/CompanyTeam/_shared/companyData';
import {
  Users,
  Briefcase,
  FileText,
  Building2,
  UserCircle2,
  Settings,
  Hash,
  ClipboardCheck,
} from 'lucide-react';
import { ComponentShowcase } from './pages/_showcase';

// Static user config — hoisted outside component to avoid re-creation on every render
const CURRENT_USER = {
  name: 'Hamedisnt',
  email: 'Hamedisnt@gmail.com',
  icon: Hash,
};

export default function App() {
  const [activePage, setActivePage] = useState('candidates');
  const [activeJobsPage, setActiveJobsPage] = useState('job-management');
  const [activeMocksPage, setActiveMocksPage] = useState('mock-management');
  const [activeCompanyPage, setActiveCompanyPage] = useState('team-overview');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [breadcrumbItems, setBreadcrumbItems] = useState([{ label: 'Candidates' }]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedMockId, setSelectedMockId] = useState(null);

  // Application flow (candidate-facing)
  const [applicationStep, setApplicationStep] = useState('landing');
  const [applicationMockId, setApplicationMockId] = useState(null);

  // Navigation items for sidebar
  const navItems = [
    {
      icon: Users,
      label: 'Candidates',
      isActive: activePage === 'candidates',
      onClick: () => {
        setActivePage('candidates');
        setBreadcrumbItems([{ label: 'Candidates' }]);
      },
    },
    {
      icon: Briefcase,
      label: 'Jobs',
      isActive: activePage === 'jobs',
      subItems: [
        {
          label: 'Job Management',
          isActive: activePage === 'jobs' && activeJobsPage === 'job-management',
          onClick: () => {
            setActivePage('jobs');
            setActiveJobsPage('job-management');
            setSelectedJobId(null);
            setBreadcrumbItems([{ label: 'Job Management' }]);
          },
        },
        {
          label: 'Create Job',
          isActive: activePage === 'jobs' && activeJobsPage === 'create-job',
          onClick: () => {
            setActivePage('jobs');
            setActiveJobsPage('create-job');
            setBreadcrumbItems([{ label: 'Create Job' }]);
          },
        },
      ],
      onClick: () => {
        setActivePage('jobs');
        setActiveJobsPage('job-management');
        setSelectedJobId(null);
        setBreadcrumbItems([{ label: 'Job Management' }]);
      },
    },
    {
      icon: FileText,
      label: 'Mocks',
      isActive: activePage === 'mocks',
      subItems: [
        {
          label: 'Mock Management',
          isActive: activePage === 'mocks' && activeMocksPage === 'mock-management',
          onClick: () => {
            setActivePage('mocks');
            setActiveMocksPage('mock-management');
            setSelectedMockId(null);
            setBreadcrumbItems([{ label: 'Mock Management' }]);
          },
        },
        {
          label: 'Create Mock',
          isActive: activePage === 'mocks' && activeMocksPage === 'create-mock',
          onClick: () => {
            setActivePage('mocks');
            setActiveMocksPage('create-mock');
            setBreadcrumbItems([{ label: 'Create Mock' }]);
          },
        },
      ],
      onClick: () => {
        setActivePage('mocks');
        setActiveMocksPage('mock-management');
        setSelectedMockId(null);
        setBreadcrumbItems([{ label: 'Mock Management' }]);
      },
    },
    {
      icon: Building2,
      label: 'Company',
      isActive: activePage === 'company',
      subItems: [
        {
          label: 'Overview',
          isActive: activePage === 'company' && activeCompanyPage === 'team-overview',
          onClick: () => {
            setActivePage('company');
            setActiveCompanyPage('team-overview');
            setSelectedMemberId(null);
            setSelectedRequestId(null);
            setBreadcrumbItems([{ label: 'Overview' }]);
          },
        },
        {
          label: 'Add Members',
          isActive: activePage === 'company' && activeCompanyPage === 'join-requests',
          onClick: () => {
            setActivePage('company');
            setActiveCompanyPage('join-requests');
            setSelectedMemberId(null);
            setSelectedRequestId(null);
            setBreadcrumbItems([{ label: 'Add Members' }]);
          },
        },
        {
          label: 'Company Settings',
          isActive: activePage === 'company' && activeCompanyPage === 'company-settings',
          onClick: () => {
            setActivePage('company');
            setActiveCompanyPage('company-settings');
            setSelectedMemberId(null);
            setSelectedRequestId(null);
            setBreadcrumbItems([{ label: 'Company Settings' }]);
          },
        },
      ],
      onClick: () => {
        setActivePage('company');
        setActiveCompanyPage('team-overview');
        setSelectedMemberId(null);
        setSelectedRequestId(null);
        setBreadcrumbItems([{ label: 'Overview' }]);
      },
      separator: true,
    },
    {
      icon: UserCircle2,
      label: 'Profile',
      isActive: activePage === 'profile',
      onClick: () => {
        setActivePage('profile');
        setBreadcrumbItems([{ label: 'Profile' }]);
      },
    },
    {
      icon: Settings,
      label: 'Settings',
      isActive: activePage === 'settings',
      onClick: () => {
        setActivePage('settings');
        setBreadcrumbItems([{ label: 'Settings' }]);
      },
      separator: true,
    },
    {
      icon: ClipboardCheck,
      label: 'Application',
      isActive: activePage === 'application',
      onClick: () => {
        setActivePage('application');
        setApplicationStep('landing');
        setApplicationMockId(null);
      },
    },
  ];

  // Breadcrumb update handler
  const handleBreadcrumbUpdate = (items) => {
    setBreadcrumbItems(items);
  };

  // Navbar avatar dropdown navigation
  const handleNavigate = useCallback((page) => {
    if (page === 'profile') {
      setActivePage('profile');
      setBreadcrumbItems([{ label: 'My Profile' }]);
    } else if (page === 'settings') {
      setActivePage('settings');
      setBreadcrumbItems([{ label: 'Settings' }]);
    } else if (page === 'company-settings') {
      setActivePage('company');
      setActiveCompanyPage('company-settings');
      setSelectedMemberId(null);
      setSelectedRequestId(null);
      setBreadcrumbItems([{ label: 'Company Settings' }]);
    }
  }, []);

  // Render page content based on active page
  const renderPage = () => {
    switch (activePage) {
      case 'candidates':
        return <Pipeline onBreadcrumbUpdate={handleBreadcrumbUpdate} />;
      case 'jobs':
        if (activeJobsPage === 'create-job')
          return (
            <CreateConfig
              onCreated={(jobId) => {
                setSelectedJobId(jobId);
                setActiveJobsPage('job-details');
                setBreadcrumbItems([
                  {
                    label: 'Job Management',
                    onClick: () => {
                      setActiveJobsPage('job-management');
                      setSelectedJobId(null);
                      setBreadcrumbItems([{ label: 'Job Management' }]);
                    },
                  },
                  { label: 'Job Details' },
                ]);
              }}
            />
          );
        if (activeJobsPage === 'edit-job') return <EditConfig jobId={selectedJobId} />;
        if (activeJobsPage === 'job-details')
          return (
            <JobDetails
              jobId={selectedJobId}
              onEdit={() => {
                setActiveJobsPage('edit-job');
                setBreadcrumbItems([
                  {
                    label: 'Job Management',
                    onClick: () => {
                      setActiveJobsPage('job-management');
                      setSelectedJobId(null);
                      setBreadcrumbItems([{ label: 'Job Management' }]);
                    },
                  },
                  { label: 'Edit Job' },
                ]);
              }}
              onDuplicate={(newId) => {
                setSelectedJobId(newId);
                setBreadcrumbItems([
                  {
                    label: 'Job Management',
                    onClick: () => {
                      setActiveJobsPage('job-management');
                      setSelectedJobId(null);
                      setBreadcrumbItems([{ label: 'Job Management' }]);
                    },
                  },
                  { label: 'Job Details' },
                ]);
              }}
              onViewJob={(newId) => {
                setSelectedJobId(newId);
              }}
            />
          );
        return (
          <JobList
            onBreadcrumbUpdate={handleBreadcrumbUpdate}
            onViewJob={(jobId) => {
              setSelectedJobId(jobId);
              setActiveJobsPage('job-details');
              setBreadcrumbItems([
                {
                  label: 'Job Management',
                  onClick: () => {
                    setActiveJobsPage('job-management');
                    setSelectedJobId(null);
                    setBreadcrumbItems([{ label: 'Job Management' }]);
                  },
                },
                { label: 'Job Details' },
              ]);
            }}
            onEditJob={(jobId) => {
              setSelectedJobId(jobId);
              setActiveJobsPage('edit-job');
              setBreadcrumbItems([
                {
                  label: 'Job Management',
                  onClick: () => {
                    setActiveJobsPage('job-management');
                    setSelectedJobId(null);
                    setBreadcrumbItems([{ label: 'Job Management' }]);
                  },
                },
                { label: 'Edit Job' },
              ]);
            }}
          />
        );
      case 'mocks':
        if (activeMocksPage === 'create-mock')
          return (
            <CreateMockConfig
              onCreated={(mockId) => {
                setSelectedMockId(mockId);
                setActiveMocksPage('mock-details');
                setBreadcrumbItems([
                  {
                    label: 'Mock Management',
                    onClick: () => {
                      setActiveMocksPage('mock-management');
                      setSelectedMockId(null);
                      setBreadcrumbItems([{ label: 'Mock Management' }]);
                    },
                  },
                  { label: 'Mock Details' },
                ]);
              }}
            />
          );
        if (activeMocksPage === 'edit-mock') return <EditMockConfig mockId={selectedMockId} />;
        if (activeMocksPage === 'mock-details')
          return (
            <MockDetails
              mockId={selectedMockId}
              onEdit={() => {
                setActiveMocksPage('edit-mock');
                setBreadcrumbItems([
                  {
                    label: 'Mock Management',
                    onClick: () => {
                      setActiveMocksPage('mock-management');
                      setSelectedMockId(null);
                      setBreadcrumbItems([{ label: 'Mock Management' }]);
                    },
                  },
                  { label: 'Edit Mock' },
                ]);
              }}
              onDuplicate={(newId) => {
                setSelectedMockId(newId);
                setBreadcrumbItems([
                  {
                    label: 'Mock Management',
                    onClick: () => {
                      setActiveMocksPage('mock-management');
                      setSelectedMockId(null);
                      setBreadcrumbItems([{ label: 'Mock Management' }]);
                    },
                  },
                  { label: 'Mock Details' },
                ]);
              }}
              onViewMock={(newId) => {
                setSelectedMockId(newId);
              }}
            />
          );
        return (
          <MockList
            onViewMock={(mockId) => {
              setSelectedMockId(mockId);
              setActiveMocksPage('mock-details');
              setBreadcrumbItems([
                {
                  label: 'Mock Management',
                  onClick: () => {
                    setActiveMocksPage('mock-management');
                    setSelectedMockId(null);
                    setBreadcrumbItems([{ label: 'Mock Management' }]);
                  },
                },
                { label: 'Mock Details' },
              ]);
            }}
            onEditMock={(mockId) => {
              setSelectedMockId(mockId);
              setActiveMocksPage('edit-mock');
              setBreadcrumbItems([
                {
                  label: 'Mock Management',
                  onClick: () => {
                    setActiveMocksPage('mock-management');
                    setSelectedMockId(null);
                    setBreadcrumbItems([{ label: 'Mock Management' }]);
                  },
                },
                { label: 'Edit Mock' },
              ]);
            }}
            onCreateMock={() => {
              setActiveMocksPage('create-mock');
              setBreadcrumbItems([{ label: 'Create Mock' }]);
            }}
          />
        );
      case 'company':
        if (selectedRequestId) {
          const request = getJoinRequestById(selectedRequestId);
          if (request) {
            return (
              <MemberDetails
                request={request}
                onAccepted={(memberId) => {
                  setSelectedRequestId(null);
                  setSelectedMemberId(memberId);
                  setBreadcrumbItems([
                    {
                      label: 'Add Members',
                      onClick: () => {
                        setSelectedMemberId(null);
                        setSelectedRequestId(null);
                        setActiveCompanyPage('join-requests');
                        setBreadcrumbItems([{ label: 'Add Members' }]);
                      },
                    },
                    { label: 'Member Details' },
                  ]);
                }}
                onDeclined={() => {
                  setSelectedRequestId(null);
                  setActiveCompanyPage('join-requests');
                  setBreadcrumbItems([{ label: 'Add Members' }]);
                }}
              />
            );
          }
        }
        if (selectedMemberId) {
          return (
            <MemberDetails
              memberId={selectedMemberId}
              onRemoved={() => {
                setSelectedMemberId(null);
                setActiveCompanyPage('team-overview');
                setBreadcrumbItems([{ label: 'Overview' }]);
              }}
            />
          );
        }
        if (activeCompanyPage === 'join-requests')
          return (
            <AddMembers
              onViewMember={(memberId) => {
                setSelectedMemberId(memberId);
                setBreadcrumbItems([
                  {
                    label: 'Add Members',
                    onClick: () => {
                      setSelectedMemberId(null);
                      setActiveCompanyPage('join-requests');
                      setBreadcrumbItems([{ label: 'Add Members' }]);
                    },
                  },
                  { label: 'Member Details' },
                ]);
              }}
              onViewRequest={(requestId) => {
                setSelectedRequestId(requestId);
                setBreadcrumbItems([
                  {
                    label: 'Add Members',
                    onClick: () => {
                      setSelectedRequestId(null);
                      setActiveCompanyPage('join-requests');
                      setBreadcrumbItems([{ label: 'Add Members' }]);
                    },
                  },
                  { label: 'Request Details' },
                ]);
              }}
            />
          );
        if (activeCompanyPage === 'company-settings') return <CompanySettings />;
        return (
          <Overview
            onEditCompany={() => {
              setActiveCompanyPage('company-settings');
              setBreadcrumbItems([{ label: 'Company Settings' }]);
            }}
            onViewMember={(memberId) => {
              setSelectedMemberId(memberId);
              setBreadcrumbItems([
                {
                  label: 'Overview',
                  onClick: () => {
                    setSelectedMemberId(null);
                    setActiveCompanyPage('team-overview');
                    setBreadcrumbItems([{ label: 'Overview' }]);
                  },
                },
                { label: 'Member Details' },
              ]);
            }}
          />
        );
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <ComponentShowcase />;
      default:
        return <Pipeline onBreadcrumbUpdate={handleBreadcrumbUpdate} />;
    }
  };

  // ── Application flow (candidate-facing, no dashboard chrome) ──
  const renderApplicationFlow = () => {
    let content;
    switch (applicationStep) {
      case 'landing':
        content = <JobLanding onApply={() => setApplicationStep('form')} />;
        break;
      case 'form':
        content = (
          <CandidateForm
            onSubmit={() => setApplicationStep('overview')}
            onBack={() => setApplicationStep('landing')}
          />
        );
        break;
      case 'overview':
        content = (
          <JobOverview
            onStartMock={(mockId) => {
              setApplicationMockId(mockId);
              setApplicationStep('mock-session');
            }}
            onSubmitApplication={() => setApplicationStep('complete')}
          />
        );
        break;
      case 'mock-session':
        content = (
          <MockSession
            mockId={applicationMockId}
            onComplete={() => {
              setApplicationMockId(null);
              setApplicationStep('overview');
            }}
          />
        );
        break;
      case 'complete':
        content = (
          <SubmissionComplete
            onBackToJobs={() => {
              setActivePage('candidates');
              setApplicationStep('landing');
              setApplicationMockId(null);
              setBreadcrumbItems([{ label: 'Candidates' }]);
            }}
          />
        );
        break;
      default:
        content = <JobLanding onApply={() => setApplicationStep('form')} />;
    }

    return (
      <div className="application-shell">
        <div className="application-shell__main">{content}</div>
      </div>
    );
  };

  // Application is a standalone candidate experience — skip dashboard layout
  if (activePage === 'application') {
    return renderApplicationFlow();
  }

  return (
    <PageLayout
      navItems={navItems}
      user={CURRENT_USER}
      breadcrumbItems={breadcrumbItems}
      onNavigate={handleNavigate}
    >
      {renderPage()}
    </PageLayout>
  );
}
