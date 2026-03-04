import { memo } from 'react';
import PropTypes from 'prop-types';
import { Sidebar } from '../Sidebar';
import { Navbar } from '../Navbar';
import './PageLayout.css';

const EMPTY_NAV = [];
const EMPTY_BREADCRUMBS = [];

export const PageLayout = memo(function PageLayout({
  navItems = EMPTY_NAV,
  user,
  breadcrumbItems = EMPTY_BREADCRUMBS,
  logo,
  children,
  className = '',
}) {
  return (
    <div className={['page-layout', className].filter(Boolean).join(' ')}>
      <Sidebar logo={logo} navItems={navItems} user={user} className="page-layout__sidebar" />
      <div className="page-layout__main">
        <Navbar breadcrumbItems={breadcrumbItems} className="page-layout__navbar" />
        <main className="page-layout__content">{children}</main>
      </div>
    </div>
  );
});

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
