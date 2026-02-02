import { useState } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { Pipeline } from './pages/Candidates';
import { Users, Briefcase, FileText, Building2, UserCircle2, Settings, Hash } from 'lucide-react';
import { ComponentShowcase } from './pages/_showcase';

/**
 * App - Main application entry point
 *
 * Currently renders pages with the full layout.
 * When routing is implemented, this will become a router wrapper.
 *
 * To view the component showcase, import ComponentShowcase instead:
 * import { ComponentShowcase } from './pages/_showcase';
 */
export default function App() {
  const [activePage, setActivePage] = useState('candidates');

  // Navigation items for sidebar
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
      subItems: [
        { label: 'Job Management', isActive: false },
        { label: 'Create Job', isActive: false },
        { label: 'Pipeline', isActive: false },
      ],
      onClick: () => setActivePage('jobs'),
    },
    {
      icon: FileText,
      label: 'Mocks',
      isActive: activePage === 'mocks',
      onClick: () => setActivePage('mocks'),
    },
    {
      icon: Building2,
      label: 'Company & Team',
      isActive: activePage === 'company',
      onClick: () => setActivePage('company'),
      separator: true,
    },
    {
      icon: UserCircle2,
      label: 'Profile',
      isActive: activePage === 'profile',
      onClick: () => setActivePage('profile'),
    },
    {
      icon: Settings,
      label: 'Settings',
      isActive: activePage === 'settings',
      onClick: () => setActivePage('settings'),
    },
  ];

  // Current user
  const user = {
    name: 'Hamedisntgay',
    email: 'Hamedisntgay@gmail.com',
    icon: Hash,
  };

  // Breadcrumb items based on current page
  const getBreadcrumbItems = () => {
    switch (activePage) {
      case 'candidates':
        return [{ label: 'Candidates' }];
      case 'jobs':
        return [{ label: 'Jobs' }];
      case 'mocks':
        return [{ label: 'Mocks' }];
      case 'company':
        return [{ label: 'Company & Team' }];
      case 'profile':
        return [{ label: 'Profile' }];
      case 'settings':
        return [{ label: 'Settings' }];
      default:
        return [];
    }
  };

  // Render page content based on active page
  const renderPage = () => {
    switch (activePage) {
      case 'candidates':
        return <Pipeline />;
      case 'jobs':
        return <ComponentShowcase />;
      case 'mocks':
        return <PlaceholderPage title="Mocks" />;
      case 'company':
        return <PlaceholderPage title="Company & Team" />;
      case 'profile':
        return <PlaceholderPage title="Profile" />;
      case 'settings':
        return <PlaceholderPage title="Settings" />;
      default:
        return <Pipeline />;
    }
  };

  return (
    <PageLayout navItems={navItems} user={user} breadcrumbItems={getBreadcrumbItems()}>
      {renderPage()}
    </PageLayout>
  );
}

// Temporary placeholder for pages not yet implemented
function PlaceholderPage({ title }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--text-secondary)',
        fontSize: '18px',
      }}
    >
      {title} page coming soon...
    </div>
  );
}
