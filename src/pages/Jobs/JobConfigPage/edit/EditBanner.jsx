import { AlertTriangle, Calendar, Lock } from 'lucide-react';
import './EditBanner.css';

const CONFIG = {
  active: {
    icon: AlertTriangle,
    cls: 'edit-banner--warning',
    title: (count) => `Live Job — ${count} Active Candidate${count !== 1 ? 's' : ''}`,
    body: 'Changing scoring weights may affect fairness for existing candidates. Mock removals are locked while evaluations are in progress.',
  },
  scheduled: {
    icon: Calendar,
    cls: 'edit-banner--scheduled',
    title: () => 'Scheduled Job',
    body: 'This job is scheduled but not yet live. All edits will take effect before it goes public.',
  },
  closed: {
    icon: Lock,
    cls: 'edit-banner--closed',
    title: () => 'Closed Job',
    body: 'This job is no longer accepting applications. You can update settings and reopen it from the review step.',
  },
};

export function EditBanner({ status, candidateCount = 0 }) {
  const cfg = CONFIG[status];
  if (!cfg) return null;

  const Icon = cfg.icon;

  return (
    <div className={`edit-banner ${cfg.cls}`}>
      <Icon size={16} className="edit-banner__icon" />
      <div className="edit-banner__body">
        <span className="edit-banner__title">{cfg.title(candidateCount)}</span>
        <span className="edit-banner__text">{cfg.body}</span>
      </div>
    </div>
  );
}
