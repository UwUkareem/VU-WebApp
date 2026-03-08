import { memo, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  CheckCircle2,
  Circle,
  Lock,
  Play,
  Clock,
  FileText,
  AlertTriangle,
  ArrowRight,
  Shield,
  Loader,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import {
  APPLICATION,
  ASSESSMENT_RULES,
  getCompletedCount,
  allMocksCompleted,
} from '../_shared/applicationData';
import './JobOverview.css';

/* ── Status icon mapping ── */
const STATUS_ICONS = {
  completed: { Icon: CheckCircle2, className: 'job-overview__mock-icon--completed' },
  available: { Icon: Play, className: 'job-overview__mock-icon--available' },
  'in-progress': { Icon: Loader, className: 'job-overview__mock-icon--in-progress' },
  locked: { Icon: Lock, className: 'job-overview__mock-icon--locked' },
};

/* ── Component ── */
export const JobOverview = memo(function JobOverview({
  mocks: mocksProp,
  onStartMock,
  onSubmitApplication,
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedMockId, setSelectedMockId] = useState(null);

  const mocks = mocksProp || APPLICATION?.mocks || [];
  const completedCount = getCompletedCount();
  const totalCount = mocks.length;
  const isAllDone = allMocksCompleted();
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleMockClick = useCallback((mock) => {
    if (mock.status === 'locked' || mock.status === 'completed') return;
    setSelectedMockId(mock.id);
    setShowConfirm(true);
  }, []);

  const handleConfirmStart = useCallback(() => {
    setShowConfirm(false);
    if (selectedMockId) onStartMock(selectedMockId);
  }, [selectedMockId, onStartMock]);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
    setSelectedMockId(null);
  }, []);

  return (
    <div className="job-overview">
      {/* ── Confirmation overlay ── */}
      {showConfirm && (
        <div className="job-overview__overlay">
          <div className="job-overview__confirm-card">
            <div className="job-overview__confirm-icon">
              <AlertTriangle size={28} />
            </div>
            <h3 className="job-overview__confirm-title">Before You Start</h3>
            <p className="job-overview__confirm-description">
              Please read the following carefully before starting the assessment.
            </p>
            <ul className="job-overview__confirm-rules">
              <li>The timer will begin immediately once you start</li>
              <li>You cannot pause or restart the assessment</li>
              <li>Do not close or refresh the browser tab</li>
              <li>Ensure your environment is quiet and distraction-free</li>
            </ul>
            <div className="job-overview__confirm-actions">
              <Button variant="ghost" size="sm" onClick={handleCancelConfirm}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                iconRight={<Play size={14} />}
                onClick={handleConfirmStart}
              >
                Start Assessment
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Content ── */}
      <div className="job-overview__content">
        {/* Left — Mocks progress */}
        <div className="job-overview__main">
          {/* Progress bar */}
          <div className="job-overview__progress-card">
            <div className="job-overview__progress-header">
              <SectionTitle as="h3" variant="inline">
                Assessment Progress
              </SectionTitle>
              <span className="job-overview__progress-count">
                {completedCount} of {totalCount} completed
              </span>
            </div>
            <div className="job-overview__progress-bar">
              <div
                className="job-overview__progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Mock list */}
          <div className="job-overview__mock-list">
            {mocks.map((mock, idx) => {
              const { Icon, className: iconCls } = STATUS_ICONS[mock.status] || STATUS_ICONS.locked;
              const isClickable = mock.status === 'available' || mock.status === 'in-progress';

              return (
                <button
                  key={mock.id}
                  className={`job-overview__mock-card ${isClickable ? 'job-overview__mock-card--clickable' : ''} ${mock.status === 'completed' ? 'job-overview__mock-card--completed' : ''}`}
                  onClick={() => handleMockClick(mock)}
                  disabled={!isClickable}
                  type="button"
                >
                  <div className={`job-overview__mock-icon ${iconCls}`}>
                    <Icon size={20} />
                  </div>
                  <div className="job-overview__mock-info">
                    <div className="job-overview__mock-header">
                      <span className="job-overview__mock-number">Assessment {idx + 1}</span>
                      <span
                        className={`job-overview__mock-status job-overview__mock-status--${mock.status}`}
                      >
                        {mock.status === 'completed' && 'Completed'}
                        {mock.status === 'available' && 'Ready'}
                        {mock.status === 'in-progress' && 'In Progress'}
                        {mock.status === 'locked' && 'Locked'}
                      </span>
                    </div>
                    <h4 className="job-overview__mock-name">{mock.name}</h4>
                    <div className="job-overview__mock-meta">
                      <span className="job-overview__mock-detail">
                        <Clock size={12} />
                        {mock.duration}
                      </span>
                      <span className="job-overview__mock-detail">
                        <FileText size={12} />
                        {mock.type}
                      </span>
                      <span className="job-overview__mock-detail">{mock.difficulty}</span>
                      <span className="job-overview__mock-detail">Weight: {mock.weight}%</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Submit application */}
          {isAllDone && (
            <div className="job-overview__submit-section">
              <div className="job-overview__submit-info">
                <CheckCircle2 size={20} />
                <span>All assessments completed! You can now submit your application.</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                iconRight={<ArrowRight size={16} />}
                onClick={onSubmitApplication}
              >
                Submit Application
              </Button>
            </div>
          )}
        </div>

        {/* Right — Rules sidebar */}
        <div className="job-overview__sidebar">
          <div className="job-overview__rules-card">
            <div className="job-overview__rules-header">
              <Shield size={18} />
              <h3 className="job-overview__rules-title">Assessment Rules</h3>
            </div>
            <div className="job-overview__rules-divider" />
            <ul className="job-overview__rules-list">
              {ASSESSMENT_RULES.map((rule, idx) => (
                <li key={idx} className="job-overview__rule">
                  <Circle size={6} />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick stats */}
          <div className="job-overview__stats-card">
            <h3 className="job-overview__stats-title">Summary</h3>
            <div className="job-overview__stats-divider" />
            <div className="job-overview__stats-list">
              <div className="job-overview__stats-item">
                <span className="job-overview__stats-label">Total Assessments</span>
                <span className="job-overview__stats-value">{totalCount}</span>
              </div>
              <div className="job-overview__stats-item">
                <span className="job-overview__stats-label">Completed</span>
                <span className="job-overview__stats-value job-overview__stats-value--success">
                  {completedCount}
                </span>
              </div>
              <div className="job-overview__stats-item">
                <span className="job-overview__stats-label">Remaining</span>
                <span className="job-overview__stats-value">{totalCount - completedCount}</span>
              </div>
              <div className="job-overview__stats-item">
                <span className="job-overview__stats-label">Progress</span>
                <span className="job-overview__stats-value">{progressPercent}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

JobOverview.propTypes = {
  mocks: PropTypes.array,
  onStartMock: PropTypes.func.isRequired,
  onSubmitApplication: PropTypes.func.isRequired,
};
