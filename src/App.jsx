import { useState } from 'react';
import { Button } from '../src/components/ui/Button';
import { Toggle } from '../src/components/ui/Toggle';
import { Badge, RoleBadge } from '../src/components/ui/Badge';
import { Info } from 'lucide-react';

export default function App() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [role1, setRole1] = useState('owner');
  const [role2, setRole2] = useState('editor');
  const [role3, setRole3] = useState('viewer');

  return (
    <div style={styles.page}>
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

      {/* ROLE - Interactive with Dropdown */}
      <Section title="Role (Interactive Dropdown)">
        <RoleBadge value={role1} onChange={setRole1} />
        <RoleBadge value={role2} onChange={setRole2} />
        <RoleBadge value={role3} onChange={setRole3} />
        <RoleBadge value="viewer" disabled />
      </Section>
    </div>
  );
}

/* ------------------ */
/* Helper Components */
/* ------------------ */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <div style={styles.row}>{children}</div>
    </div>
  );
}

/* ------------------ */
/* Inline styles only for demo layout */
/* ------------------ */

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-base)',
    color: 'var(--text-primary)',
    padding: '40px',
    fontFamily: 'var(--font-sans)',
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
};
