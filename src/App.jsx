import { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '../src/components/ui/Button';
import { Toggle } from '../src/components/ui/Toggle';
import { Badge, RoleBadge } from '../src/components/ui/Badge';
import { Breadcrumb } from '../src/components/ui/Breadcrumb';
import { Pagination } from '../src/components/ui/Pagination';
import { SidebarButton } from '../src/components/ui/SidebarButton';
import { User } from '../src/components/ui/User';
import { Tabs } from '../src/components/ui/Tabs';
import { Navbar } from '../src/components/layout/Navbar';
import { Sidebar } from '../src/components/layout/Sidebar';
import {
  TextInput,
  EmailInput,
  PasswordInput,
  SearchInput,
  DropdownInput,
  Textarea,
  FileInput,
} from '../src/components/ui/Input';
import { Info } from 'lucide-react';
import { Briefcase, FileText, Users, Settings, Hash, Building2, UserCircle2 } from 'lucide-react';

export default function App() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [role1, setRole1] = useState('owner');
  const [role2, setRole2] = useState('editor');
  const [role3, setRole3] = useState('viewer');
  const [searchValue, setSearchValue] = useState('');
  const [country, setCountry] = useState('');
  const [roleValue, setRoleValue] = useState('user');
  const [currentPage, setCurrentPage] = useState(1);

  const countryOptions = [
    { value: 'us', label: 'United States' },
    { value: 'ca', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'au', label: 'Australia' },
  ];

  return (
    <div style={styles.page}>
      {/* NAVBAR */}
      <Navbar
        breadcrumbItems={[
          { label: 'Candidates', href: '#' },
          { label: 'Pipeline', href: '#' },
          { label: 'Tab 3' },
        ]}
      />

      <div style={styles.content}>
        <h1 style={styles.title}>Buttons</h1>

        {/* PRIMARY */}
        <Section title="Primary">
          <Button>Button</Button>
          <Button iconLeft={<Info size={16} />}>With Icon</Button>
          <Button iconRight={<Info size={16} />}>Icon Right</Button>
          <Button disabled>Disabled</Button>
        </Section>

        {/* SECONDARY */}
        <Section title="Secondary">
          <Button variant="secondary">Default</Button>
          <Button variant="secondary" iconLeft={<Info size={16} />}>
            With Icon
          </Button>
          <Button variant="secondary" iconRight={<Info size={16} />}>
            Icon Right
          </Button>
          <Button variant="secondary" disabled>
            Disabled
          </Button>
        </Section>

        <h1 style={styles.title}>Toggle</h1>

        {/* TOGGLE */}
        <Section title="Toggle">
          <Toggle checked={toggle1} onChange={setToggle1} />
          <Toggle checked={toggle2} onChange={setToggle2} />
          <Toggle disabled />
          <Toggle checked disabled />
        </Section>

        <h1 style={styles.title}>Badges</h1>

        {/* CANDIDATE STATE */}
        <Section title="Candidate State">
          <Badge type="candidateState" variant="accepted" iconLeft iconRight />
          <Badge type="candidateState" variant="pending" />
          <Badge type="candidateState" variant="shortlist" />
          <Badge type="candidateState" variant="rejected" />
        </Section>

        {/* CHEATING FLAG */}
        <Section title="Cheating Flag">
          <Badge type="cheatingFlag" variant="clean" iconLeft />
          <Badge type="cheatingFlag" variant="flagged" iconLeft />
          <Badge type="cheatingFlag" variant="critical" iconLeft />
        </Section>

        {/* JOB STATUS */}
        <Section title="Job Status">
          <Badge type="jobStatus" variant="active" />
          <Badge type="jobStatus" variant="scheduled" />
          <Badge type="jobStatus" variant="closed" />
        </Section>

        {/* ROLE - Static (no dropdown) */}
        <Section title="Role (Static)">
          <Badge type="role" variant="owner" />
          <Badge type="role" variant="editor" />
          <Badge type="role" variant="viewer" />
        </Section>

        <h1 style={styles.title}>Breadcrumb</h1>

        {/* BREADCRUMB */}
        <Section title="Breadcrumb Navigation" vertical>
          <Breadcrumb items={[{ label: 'Tab 1' }]} />
          <Breadcrumb items={[{ label: 'Tab 1', href: '#' }, { label: 'Tab 2' }]} />
          <Breadcrumb
            items={[
              { label: 'Tab 1', href: '#' },
              { label: 'Tab 2', href: '#' },
              { label: 'Tab 3' },
            ]}
          />
          <Breadcrumb
            items={[
              { label: 'Home', onClick: () => console.log('Home') },
              { label: 'Projects', onClick: () => console.log('Projects') },
              { label: 'Dashboard', onClick: () => console.log('Dashboard') },
              { label: 'Settings' },
            ]}
          />
        </Section>

        {/* ROLE - Interactive with Dropdown */}
        <Section title="Role (Interactive Dropdown)">
          <RoleBadge value={role1} onChange={setRole1} />
          <RoleBadge value={role2} onChange={setRole2} />
          <RoleBadge value={role3} onChange={setRole3} />
          <RoleBadge value="viewer" disabled />
        </Section>

        <h1 style={styles.title}>Input Fields</h1>

        {/* TEXT INPUT */}
        <Section title="Text Input" vertical>
          <TextInput label="Full Name" placeholder="Enter your name" required />
          <TextInput label="Username" placeholder="@username" hint="Choose a unique username" />
          <TextInput
            label="Bio"
            placeholder="Tell us about yourself"
            showInfo
            infoTooltip="Brief description about yourself (max 160 characters)"
          />
        </Section>

        {/* EMAIL INPUT */}
        <Section title="Email Input (with validation)" vertical>
          <EmailInput
            label="Email Address"
            placeholder="you@example.com"
            required
            hint="We'll never share your email"
            showInfo
            infoTooltip="Enter a valid email address for account verification"
          />
          <EmailInput
            label="Work Email"
            placeholder="you@company.com"
            defaultValue="invalid-email"
          />
        </Section>

        {/* PASSWORD INPUT */}
        <Section title="Password Input" vertical>
          <PasswordInput label="Password" placeholder="Enter password" required />
          <PasswordInput
            label="Confirm Password"
            placeholder="Re-enter password"
            hint="Must be at least 8 characters"
          />
        </Section>

        {/* SEARCH INPUT */}
        <Section title="Search Input (with clear button)" vertical>
          <SearchInput
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <SearchInput
            label="Search Jobs"
            placeholder="Job title, keywords..."
            defaultValue="Designer"
          />
        </Section>

        {/* DROPDOWN INPUT */}
        <Section title="Dropdown Input (native select)" vertical>
          <DropdownInput
            label="Country"
            placeholder="Select country"
            options={countryOptions}
            value={country}
            onChange={(value) => setCountry(value)}
            required
          />
          <DropdownInput
            label="Role"
            options={[
              { value: 'admin', label: 'Administrator' },
              { value: 'user', label: 'User' },
              { value: 'guest', label: 'Guest' },
            ]}
            value={roleValue}
            onChange={(value) => setRoleValue(value)}
          />
        </Section>

        {/* TEXTAREA */}
        <Section title="Textarea (with counter & autosize)" vertical>
          <Textarea
            label="Description"
            placeholder="Write a description..."
            rows={3}
            hint="Brief overview of the project"
          />
          <Textarea
            label="Cover Letter"
            placeholder="Why do you want this job?"
            maxLength={500}
            showCounter
            required
          />
          <Textarea
            label="Auto-resize Comment"
            placeholder="Type to see auto-resize..."
            autosize
            maxHeight={200}
            hint="This textarea grows as you type"
          />
        </Section>

        {/* FILE INPUT */}
        <Section title="File Upload" vertical>
          <FileInput label="Upload Resume" hint="PDF or DOCX, max 5MB" />
          <FileInput label="Profile Picture" hint="JPG or PNG" required />
        </Section>

        {/* INPUT STATES */}
        <Section title="Input States" vertical>
          <TextInput label="Disabled" placeholder="Cannot type" disabled />
          <TextInput
            label="Error State"
            placeholder="Invalid input"
            hint="This field has an error"
            error
          />
        </Section>

        <h1 style={styles.title}>Pagination</h1>

        {/* PAGINATION */}
        <Section title="Basic Pagination">
          <div style={styles.paginationDemo}>
            <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />

            <Pagination
              currentPage={1}
              totalPages={5}
              onPageChange={(page) => console.log('Page:', page)}
            />

            <Pagination
              currentPage={25}
              totalPages={100}
              onPageChange={(page) => console.log('Page:', page)}
            />
          </div>
        </Section>

        <h1 style={styles.title}>Sidebar Buttons</h1>

        {/* SIDEBAR BUTTONS */}
        <Section title="Basic Sidebar Buttons" vertical>
          <div style={styles.sidebarDemo}>
            <SidebarButton icon={Briefcase} label="Candidates" />
            <SidebarButton icon={FileText} label="Mocks" />
            <SidebarButton icon={Users} label="Team" />
            <SidebarButton icon={Settings} label="Settings" isActive />
          </div>
        </Section>

        {/* SIDEBAR BUTTONS WITH SUB ITEMS */}
        <Section title="Sidebar Buttons with Sub-items" vertical>
          <div style={styles.sidebarDemo}>
            <SidebarButton
              icon={Briefcase}
              label="Candidates"
              subItems={[
                { label: 'Job Management', isActive: true },
                { label: 'Create Job', isActive: false },
                { label: 'Pipeline', isActive: true },
              ]}
            />
            <SidebarButton
              icon={FileText}
              label="Mocks"
              subItems={[
                { label: 'All Mocks', isActive: false },
                { label: 'Create Mock', isActive: false },
              ]}
            />
            <SidebarButton icon={Users} label="Team" isActive />
          </div>
        </Section>

        <h1 style={styles.title}>User Component</h1>

        {/* USER COMPONENT */}
        <Section title="User Display" vertical>
          <div style={styles.userDemo}>
            <User name="Hamedisntgay" email="Hamedisntgay@gmail.com" icon={Hash} />
          </div>
        </Section>

        <h1 style={styles.title}>Sidebar Layout</h1>

        {/* SIDEBAR LAYOUT */}
        <Section title="Complete Sidebar" vertical>
          <div style={styles.sidebarLayoutDemo}>
            <Sidebar
              navItems={[
                {
                  icon: Briefcase,
                  label: 'Candidates',
                  isActive: false,
                },
                {
                  icon: Briefcase,
                  label: 'Jobs',
                  isActive: true,
                  subItems: [
                    { label: 'Job Management', isActive: true },
                    { label: 'Create Job', isActive: false },
                  ],
                },
                {
                  icon: FileText,
                  label: 'Mocks',
                },
                {
                  icon: Building2,
                  label: 'Company & Team',
                  separator: true,
                },
                {
                  icon: UserCircle2,
                  label: 'Profile',
                },
                {
                  icon: Settings,
                  label: 'Settings',
                },
              ]}
              user={{
                name: 'Hamedisntgay',
                email: 'Hamedisntgay@gmail.com',
                icon: Hash,
              }}
            />
          </div>
        </Section>

        <h1 style={styles.title}>Tabs</h1>

        {/* TABS COMPONENT */}
        <Section title="Tab Navigation" vertical>
          <div style={styles.tabsDemo}>
            <Tabs
              items={[
                { label: 'Pipeline', isActive: true },
                { label: 'Overview', isActive: false },
              ]}
            />
          </div>
          <div style={styles.tabsDemo}>
            <Tabs
              items={[
                { label: 'Full Feedback', isActive: true },
                { label: 'Mock Replay', isActive: false },
                { label: 'CV Analysis', isActive: false },
              ]}
            />
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ------------------ */
/* Helper Components */
/* ------------------ */

function Section({ title, children, vertical }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={vertical ? styles.column : styles.row}>{children}</div>
    </div>
  );
}

Section.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  vertical: PropTypes.bool,
};

/* ------------------ */
/* Inline styles only for demo layout */
/* ------------------ */

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-base)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-sans)',
  },
  content: {
    padding: '40px',
  },
  title: {
    fontSize: '48px',
    fontWeight: 600,
    marginBottom: '40px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 500,
    marginBottom: '16px',
    color: 'var(--text-secondary)',
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
  },
  paginationDemo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
    alignItems: 'flex-start',
  },
  sidebarDemo: {
    width: '280px',
    padding: '16px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  userDemo: {
    width: '280px',
    backgroundColor: 'var(--bg-surface)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--border-default)',
  },
  sidebarLayoutDemo: {
    width: '280px',
    height: '100vh',
    border: '1px solid var(--border-default)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
  },
  tabsDemo: {
    width: '100%',
    maxWidth: '600px',
  },
};
