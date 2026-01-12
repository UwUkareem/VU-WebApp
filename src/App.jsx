import { Button } from '../src/components/ui/Button';
import { Info } from 'lucide-react';

export default function App() {
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
