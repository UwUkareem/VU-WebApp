import { Send } from 'lucide-react';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import {
  DEPARTMENT_OPTIONS,
  JOB_TYPE_OPTIONS,
  SENIORITY_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  EMAIL_TRIGGERS,
} from '../../../../api';

export function StepReview({ form, totalWeight, totalDuration, statusPreview, enabledEmailCount }) {
  const deptLabel =
    DEPARTMENT_OPTIONS.find((o) => o.value === form.department)?.label || form.department || '—';
  const typeLabel =
    JOB_TYPE_OPTIONS.find((o) => o.value === form.jobType)?.label || form.jobType || '—';
  const seniorityLabel =
    SENIORITY_OPTIONS.find((o) => o.value === form.seniority)?.label || form.seniority || '—';
  const locLabel =
    LOCATION_TYPE_OPTIONS.find((o) => o.value === form.locationType)?.label ||
    form.locationType ||
    '—';

  return (
    <>
      {/* Job Info */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Job Information</SectionTitle>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Job Title</span>
            <span className="create-job__review-value">{form.title || '—'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Department</span>
            <span className="create-job__review-value">{deptLabel}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Job Type</span>
            <span className="create-job__review-value">{typeLabel}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Seniority</span>
            <span className="create-job__review-value">{seniorityLabel}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Location</span>
            <span className="create-job__review-value">
              {locLabel}
              {form.location ? ` — ${form.location}` : ''}
            </span>
          </div>
        </div>
        {form.skills.length > 0 && (
          <div className="create-job__review-group">
            <span className="create-job__review-label">Skills</span>
            <div className="create-job__review-tags">
              {form.skills.map((s) => (
                <span key={s} className="create-job__review-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {form.description && (
          <div className="create-job__review-group">
            <span className="create-job__review-label">Description</span>
            <span className="create-job__review-value">{form.description}</span>
          </div>
        )}
      </section>

      {/* Scoring Formula */}
      {form.mocks.length > 0 && (
        <section className="create-job__section">
          <SectionTitle variant="inline">Scoring Formula</SectionTitle>
          <div className="create-job__scoring">
            {form.mocks.map((m) => (
              <div key={m.id} className="create-job__scoring-row">
                <span className="create-job__scoring-name">{m.name}</span>
                <span className="create-job__scoring-weight">{m.weight}%</span>
              </div>
            ))}
          </div>
          <div className="create-job__weight-bar">
            <span className="create-job__weight-label">Total Weight</span>
            <span
              className={`create-job__weight-value ${totalWeight === 100 ? 'create-job__weight-value--exact' : totalWeight > 100 ? 'create-job__weight-value--over' : ''}`}
            >
              {totalWeight}%
            </span>
          </div>
        </section>
      )}

      {/* Pipeline */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Estimated Hiring Pipeline</SectionTitle>
        <div className="create-job__pipeline">
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{form.mocks.length}</span>
            <span className="create-job__pipeline-label">Interview Rounds</span>
          </div>
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{totalDuration}</span>
            <span className="create-job__pipeline-label">Minutes Total</span>
          </div>
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{enabledEmailCount}</span>
            <span className="create-job__pipeline-label">Email Triggers</span>
          </div>
        </div>
      </section>

      {/* Scheduling & Emails */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Scheduling & Emails</SectionTitle>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Start Date</span>
            <span className="create-job__review-value">{form.startDate || 'Immediately'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">End Date</span>
            <span className="create-job__review-value">{form.endDate || 'No end date'}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Max Candidates</span>
            <span className="create-job__review-value">{form.maxCandidates || 'Unlimited'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Status</span>
            <div>
              {statusPreview.map((line, i) => (
                <div key={i} className="create-job__status-row">
                  <span
                    className={`create-job__status-dot create-job__status-dot--${line.color}`}
                  />
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="create-job__review-group">
          <span className="create-job__review-label">Email Notifications</span>
          <div className="create-job__review-tags">
            {EMAIL_TRIGGERS.filter((t) => form.emails[t.id]).map((t) => (
              <span key={t.id} className="create-job__review-tag">
                <Send size={12} style={{ marginRight: 4 }} />
                {t.title}
              </span>
            ))}
            {EMAIL_TRIGGERS.every((t) => !form.emails[t.id]) && (
              <span className="create-job__review-value">None enabled</span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
