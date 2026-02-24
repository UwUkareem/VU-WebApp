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
  const [breadcrumbItems, setBreadcrumbItems] = useState([{ label: 'Candidates' }]);

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
        { label: 'Job Management', isActive: false },
        { label: 'Create Job', isActive: false },
        { label: 'Pipeline', isActive: false },
      ],
      onClick: () => {
        setActivePage('jobs');
        setBreadcrumbItems([{ label: 'Jobs' }]);
      },
    },
    {
      icon: FileText,
      label: 'Mocks',
      isActive: activePage === 'mocks',
      onClick: () => {
        setActivePage('mocks');
        setBreadcrumbItems([{ label: 'Mocks' }]);
      },
    },
    {
      icon: Building2,
      label: 'Company & Team',
      isActive: activePage === 'company',
      onClick: () => {
        setActivePage('company');
        setBreadcrumbItems([{ label: 'Company & Team' }]);
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
    },
  ];

  // Current user
  const user = {
    name: 'Hamedisntgay',
    email: 'Hamedisntgay@gmail.com',
    icon: Hash,
  };

  // Breadcrumb update handler
  const handleBreadcrumbUpdate = (items) => {
    setBreadcrumbItems(items);
  };

  // Render page content based on active page
  const renderPage = () => {
    switch (activePage) {
      case 'candidates':
        return <Pipeline onBreadcrumbUpdate={handleBreadcrumbUpdate} />;
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
        return <Pipeline onBreadcrumbUpdate={handleBreadcrumbUpdate} />;
    }
  };

  return (
    <PageLayout navItems={navItems} user={user} breadcrumbItems={breadcrumbItems}>
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
