import { memo, useMemo, useCallback } from 'react';
import {
  Pencil,
  Copy,
  Clock,
  Zap,
  Briefcase,
  Target,
  TrendingUp,
  CalendarDays,
  Users,
  Lock,
} from 'lucide-react';
import { EntityCard, QuickInfoCard } from '../../../../components/ui/Cards';
import { Button } from '../../../../components/ui/Button';
import { Badge } from '../../../../components/ui/Badge';
import { BarChart } from '../../../../components/ui/Charts';
import { SectionTitle } from '../../../../components/ui/SectionTitle/SectionTitle';
import {
  getMockById,
  getMockStatus,
  duplicateMock,
  getJobsUsingMock,
  getCandidatesPerJob,
} from '../_shared/mockData';
import './MockDetails.css';

const ICON_SM = 14;

/* -------------------------------------------------
   MockDetails
   ------------------------------------------------- */
export const MockDetails = memo(function MockDetails({
  mockId = 1,
  onEdit,
  onDuplicate,
  onViewMock,
}) {
  const mock = getMockById(mockId);

  const status = useMemo(() => getMockStatus(mockId), [mockId]);
  const isActive = status === 'active';
  const jobsUsing = useMemo(() => (mock ? getJobsUsingMock(mock.title) : []), [mock]);
  const chartData = useMemo(() => (mock ? getCandidatesPerJob(mock.title) : []), [mock]);

  const handleEdit = useCallback(() => onEdit?.(mockId), [onEdit, mockId]);

  const handleDuplicate = useCallback(() => {
    const dup = duplicateMock(mockId);
    if (dup && onDuplicate) onDuplicate(dup.id);
    else if (dup && onViewMock) onViewMock(dup.id);
  }, [mockId, onDuplicate, onViewMock]);

  if (!mock) {
    return (
      <div className="mock-details mock-details--empty">
        <span>Mock not found.</span>
      </div>
    );
  }

  const totalWeight =
    mock.criteria.reduce((s, c) => s + c.weight, 0) +
    mock.questions.reduce((s, q) => s + q.weight, 0);

  return (
    <div className="mock-details">
      {/* MAIN */}
      <div className="mock-details__main">
        <div className="mock-details__scroll">
          {/* 1. Header */}
          <EntityCard
            showAvatar={false}
            userName={mock.title}
            userEmail={`${mock.type} \u00B7 ${mock.difficulty}`}
            showBadge
            badgeType="jobStatus"
            badgeVariant={status}
            colLeft={{ icon: Clock, title: mock.duration, subtitle: 'Duration' }}
            colMid={{ icon: Zap, title: String(mock.skills.length), subtitle: 'Skills' }}
            colRight={{
              icon: Briefcase,
              title: String(jobsUsing.length),
              subtitle: 'Used in Jobs',
            }}
            tags={mock.skills}
            tagsLimit={6}
            showDescription
            descriptionTitle="Description"
            descriptionContent={mock.description}
            animated={false}
          />

          {/* 2. Quick stats */}
          <div className="mock-details__stats">
            <QuickInfoCard
              icon={<Users />}
              number={mock.totalSessions}
              title="Total Sessions"
              animated={false}
            />
            <QuickInfoCard
              icon={<Target />}
              number={`${mock.avgScore}%`}
              title="Avg Score"
              animated={false}
            />
            <QuickInfoCard
              icon={<TrendingUp />}
              number={`${mock.passRate}%`}
              title="Pass Rate"
              animated={false}
            />
            <QuickInfoCard
              icon={<CalendarDays />}
              number={mock.createdDate}
              title="Created"
              animated={false}
            />
          </div>

          {/* 3. Candidates per Job � bar chart */}
          {chartData.length > 0 && (
            <section className="mock-details__section">
              <BarChart
                title={`Candidates per Job (${jobsUsing.length})`}
                data={chartData}
                dataKeys={[{ key: 'candidates', label: 'Candidates' }]}
                xKey="label"
              />
            </section>
          )}

          {/* 4. Used in Jobs */}
          {jobsUsing.length > 0 && (
            <section className="mock-details__section">
              <SectionTitle variant="inline">Used in Jobs ({jobsUsing.length})</SectionTitle>
              <div className="mock-details__jobs-list">
                {jobsUsing.map((job) => (
                  <div key={job.id} className="mock-details__job-row">
                    <Briefcase size={14} />
                    <span className="mock-details__job-title">{job.title}</span>
                    <span className="mock-details__job-dept">{job.department}</span>
                    <Badge type="jobStatus" variant={job.status} />
                    <span className="mock-details__job-candidates">
                      <Users size={12} /> {job.totalApplied}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <aside className="mock-details__sidebar">
        {/* Quick Actions */}
        <div className="mock-details__card">
          <div className="mock-details__action-list">
            <Button
              variant="primary"
              size="sm"
              iconLeft={<Pencil size={ICON_SM} />}
              onClick={handleEdit}
            >
              {isActive ? 'Edit Mock (Limited)' : 'Edit Mock'}
            </Button>
            {isActive && (
              <div className="mock-details__active-notice">
                <Lock size={12} />
                <span>
                  Active in {jobsUsing.filter((j) => j.status === 'active').length} job(s) � some
                  fields locked
                </span>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              iconLeft={<Copy size={ICON_SM} />}
              onClick={handleDuplicate}
            >
              Duplicate
            </Button>
          </div>
        </div>

        {/* Mock Info */}
        <div className="mock-details__card">
          <SectionTitle variant="inline">Mock Info</SectionTitle>

          <div className="mock-details__info-group">
            <span className="mock-details__info-label">Details</span>
            <div className="mock-details__formula">
              <div className="mock-details__formula-row">
                <span className="mock-details__formula-name">Type</span>
                <span className="mock-details__formula-pct">{mock.type}</span>
              </div>
              <div className="mock-details__formula-row">
                <span className="mock-details__formula-name">Difficulty</span>
                <span className="mock-details__formula-pct">{mock.difficulty}</span>
              </div>
              <div className="mock-details__formula-row">
                <span className="mock-details__formula-name">Duration</span>
                <span className="mock-details__formula-pct">{mock.duration}</span>
              </div>
              <div className="mock-details__formula-row">
                <span className="mock-details__formula-name">Status</span>
                <span className="mock-details__formula-pct">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Evaluation structure in sidebar */}
          {(mock.criteria.length > 0 || mock.questions.length > 0) && (
            <>
              <div className="mock-details__divider" />
              <div className="mock-details__info-group">
                <span className="mock-details__info-label">Evaluation Structure</span>
                <div className="mock-details__formula">
                  {mock.criteria.map((c) => (
                    <div key={c.id} className="mock-details__formula-row">
                      <span className="mock-details__formula-name">{c.name}</span>
                      <span className="mock-details__formula-pct">{c.weight}%</span>
                    </div>
                  ))}
                  {mock.questions.map((q, idx) => (
                    <div key={q.id} className="mock-details__formula-row">
                      <span className="mock-details__formula-name">
                        Q{idx + 1}: {q.title}
                      </span>
                      <span className="mock-details__formula-pct">{q.weight}%</span>
                    </div>
                  ))}
                  <div className="mock-details__formula-row mock-details__formula-row--total">
                    <span className="mock-details__formula-name">Total</span>
                    <span className="mock-details__formula-pct">{totalWeight}%</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </aside>
    </div>
  );
});
