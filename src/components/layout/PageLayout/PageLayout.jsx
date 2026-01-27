import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import './PageLayout.css';

/**
 * PageLayout - Main layout wrapper for all pages
 *
 * Provides the consistent app shell with:
 * - Fixed sidebar on the left
 * - Navbar with breadcrumb at the top
 * - Main content area that fills remaining space
 *
 * Usage:
 * <PageLayout
 *   navItems={sidebarNavItems}
 *   user={currentUser}
 *   breadcrumbItems={[{ label: 'Candidates' }, { label: 'Pipeline' }]}
 * >
 *   <YourPageContent />
 * </PageLayout>
 */
export function PageLayout({
  navItems = [],
  user,
  breadcrumbItems = [],
  logo,
  children,
  className = '',
}) {
  return (
    <div className={`page-layout ${className}`.trim()}>
      <Sidebar logo={logo} navItems={navItems} user={user} className="page-layout__sidebar" />
      <div className="page-layout__main">
        <Navbar breadcrumbItems={breadcrumbItems} className="page-layout__navbar" />
        <main className="page-layout__content">{children}</main>
      </div>
    </div>
  );
}

PageLayout.propTypes = {
  /** Navigation items for the sidebar */
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.elementType,
      label: PropTypes.string.isRequired,
      isActive: PropTypes.bool,
      onClick: PropTypes.func,
      separator: PropTypes.bool,
      subItems: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          isActive: PropTypes.bool,
          onClick: PropTypes.func,
        })
      ),
    })
  ),
  /** Current user info displayed in sidebar footer */
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    icon: PropTypes.elementType,
  }),
  /** Breadcrumb navigation items */
  breadcrumbItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  /** Custom logo element for sidebar */
  logo: PropTypes.node,
  /** Page content */
  children: PropTypes.node,
  /** Additional CSS classes */
  className: PropTypes.string,
};
