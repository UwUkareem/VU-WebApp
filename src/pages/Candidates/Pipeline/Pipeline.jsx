import { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shortcuts } from '../../../components/layout/Shortcuts';
import { Tabs } from '../../../components/ui/Tabs';
import { TableHeader, TableRow, TableCell } from '../../../components/ui/Tables';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { FilterOverlay } from '../../../components/ui/FilterOverlay';
import { QuickInfoCard, InfoCard } from '../../../components/ui/Cards';
import { RadarChart, RadialBarChart, AreaChart, BarChart } from '../../../components/ui/Charts';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { CANDIDATES, toSlug } from '../../../data/candidates';
import { ArrowRight, Users, CheckCircle, Award, Clock } from 'lucide-react';
import { useResponsiveItemsPerPage } from '../../../hooks';
import './Pipeline.css';

const MOCK_CANDIDATES = CANDIDATES;

const TABLE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, fr: 1.2 },
  { key: 'job', label: 'Job', sortable: true, fr: 1.2 },
  { key: 'score', label: 'Score', sortable: true, fr: 1.5 },
  { key: 'date', label: 'Date', sortable: true, fr: 1 },
  { key: 'antiCheat', label: 'Anti-cheat', sortable: false, fr: 1 },
  { key: 'status', label: 'Status', sortable: false, fr: 1 },
];

const getScoreColor = (score) => {
  const t = Math.max(0, Math.min(1, (score - 40) / 60)); // 0 at 40, 1 at 100
  const h = Math.round(14 * t);
  const s = Math.round(100 * t);
  const l = Math.round(30 + 30 * t);
  return `hsl(${h}, ${s}%, ${l}%)`;
};

// Layout constants
const ROW_HEIGHT = 57;
const HEADER_HEIGHT = 45;
const PAGINATION_HEIGHT = 56;

// Shortcuts configuration
const SHORTCUTS_CONFIG = {
  filterLabel: 'Filters',
  secondaryAction: {
    label: '5 Active jobs',
    icon: ArrowRight,
  },
};

// Overlay filter definitions
const UNIQUE_JOBS = [...new Set(CANDIDATES.map((c) => c.job))].sort();
const STATUS_OPTIONS = ['Shortlist', 'Pending', 'Accepted', 'Rejected'];
const OVERLAY_FILTERS = [
  { key: 'status', label: 'Status', type: 'multiselect', options: STATUS_OPTIONS },
  { key: 'job', label: 'Job', type: 'multiselect', options: UNIQUE_JOBS },
  { key: 'score', label: 'Score', type: 'range', minLabel: 'Min', maxLabel: 'Max' },
  { key: 'flaggedOnly', label: 'Anti-cheat', type: 'toggle', toggleLabel: 'Show flagged only' },
];
const INITIAL_OVERLAY = { status: [], job: [], score: { min: '', max: '' }, flaggedOnly: false };

// Overview data
const OVERVIEW_STATS = {
  totalCandidates: 37,
  completedMocks: 420,
  averageScore: 78,
  pending: 264,
};

const PERFORMANCE_METRICS = [
  { label: 'Communication', value: 82 },
  { label: 'Problem Solving', value: 74 },
  { label: 'Technical Skills', value: 91 },
  { label: 'Time Management', value: 68 },
  { label: 'Critical Thinking', value: 79 },
];

const CANDIDATE_SCORE_DATA = [
  { label: 'Excellent (90-100)', value: 145 },
  { label: 'High (70-89)', value: 77 },
  { label: 'Moderate (50-69)', value: 44 },
  { label: 'Low (0-49)', value: 31 },
];

const APPLICATION_TREND_DATA = [
  { week: 'Week 1', applications: 24, mocks: 18 },
  { week: 'Week 2', applications: 31, mocks: 22 },
  { week: 'Week 3', applications: 28, mocks: 26 },
  { week: 'Week 4', applications: 42, mocks: 35 },
  { week: 'Week 5', applications: 38, mocks: 30 },
  { week: 'Week 6', applications: 55, mocks: 47 },
  { week: 'Week 7', applications: 49, mocks: 41 },
  { week: 'Week 8', applications: 63, mocks: 52 },
];

const SCORE_BY_ROLE_DATA = [
  { label: 'Frontend', value: 78 },
  { label: 'Backend', value: 85 },
  { label: 'UI/UX', value: 72 },
  { label: 'Data Analyst', value: 69 },
  { label: 'DevOps', value: 81 },
];

const AI_INSIGHTS = [
  {
    title: 'Skill Gap Alert',
    description:
      'Candidates applying for Backend roles show low scores in System Design (avg 54%). Consider adding targeted questions or skill-based mocks.',
  },
  {
    title: 'Performance Forecast',
    description:
      'Based on current trends, UI/UX Designer candidates are expected to improve average scores by +8% next month.',
  },
  {
    title: 'Quality Trend',
    description:
      'Average candidate quality dropped by 6% this week due to high fail rates in Python mocks.',
  },
];

const JOB_PERFORMANCE_DATA = [
  { job: 'Frontend Developer', avgScore: 78.2, accepted: 5, rejected: 3, pending: 12, total: 40 },
  { job: 'Backend Engineer', avgScore: 87, accepted: 8, rejected: 2, pending: 7, total: 92 },
  { job: 'UI/UX Designer', avgScore: 78, accepted: 25, rejected: 4, pending: 54, total: 45 },
  { job: 'Data Analyst', avgScore: 76, accepted: 57, rejected: 45, pending: 89, total: 12 },
];

const JOB_PERFORMANCE_COLUMNS = [
  { key: 'job', label: 'Job', sortable: true },
  { key: 'avgScore', label: 'Avg Score', sortable: true },
  { key: 'accepted', label: 'Accepted', sortable: true },
  { key: 'rejected', label: 'Rejected', sortable: true },
  { key: 'pending', label: 'Pending', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
];

const GRID_TEMPLATE = `${TABLE_COLUMNS.map((col) => `${col.fr || 1}fr`).join(' ')} 2rem`;
const JOB_PERF_GRID = JOB_PERFORMANCE_COLUMNS.map((col) =>
  col.key === 'job' ? '2fr' : '1fr'
).join(' ');

const SELECTED_CANDIDATE_STORAGE_KEY = 'pipeline:lastSelectedCandidateId';

function getStoredSelectedCandidateId() {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(SELECTED_CANDIDATE_STORAGE_KEY);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export const Pipeline = memo(function Pipeline() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [overviewKey, setOverviewKey] = useState(0); // Force animation reset on tab change
  const [overviewSortColumn, setOverviewSortColumn] = useState(null);
  const [overviewSortDirection, setOverviewSortDirection] = useState(null);
  const [lastSelectedId, setLastSelectedId] = useState(() => getStoredSelectedCandidateId());
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [overlayFilters, setOverlayFilters] = useState(INITIAL_OVERLAY);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (overlayFilters.status.length) count++;
    if (overlayFilters.job.length) count++;
    if (overlayFilters.score.min || overlayFilters.score.max) count++;
    if (overlayFilters.flaggedOnly) count++;
    return count;
  }, [overlayFilters]);

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  // Clear row selection when clicking anywhere outside a table row
  const handleDocumentClick = useCallback(
    (e) => {
      // If a menu is open, let it close first — don't deselect on this click
      if (openMenuId !== null) return;
      if (!e.target.closest('.table-row') && !e.target.closest('.row-menu')) {
        setLastSelectedId(null);
      }
    },
    [openMenuId]
  );

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => document.removeEventListener('mousedown', handleDocumentClick);
  }, [handleDocumentClick]);

  useEffect(() => {
    const selectedFromState = location.state?.selectedCandidateId;
    if (Number.isFinite(selectedFromState) && selectedFromState > 0) {
      setLastSelectedId(selectedFromState);
    }
  }, [location.state]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (lastSelectedId === null) {
      window.sessionStorage.removeItem(SELECTED_CANDIDATE_STORAGE_KEY);
      return;
    }
    window.sessionStorage.setItem(SELECTED_CANDIDATE_STORAGE_KEY, String(lastSelectedId));
  }, [lastSelectedId]);

  const handleCandidateSelect = useCallback(
    (candidate) => {
      setLastSelectedId(candidate.id);
      navigate(`/candidates/${toSlug(candidate.name)}`, {
        state: { selectedCandidateId: candidate.id },
      });
    },
    [navigate]
  );

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    if (tab === 'overview') setOverviewKey((k) => k + 1);
  }, []);

  const sortedCandidates = useMemo(() => {
    const q = searchValue.trim() ? searchValue.toLowerCase() : null;
    const { status, job, score, flaggedOnly } = overlayFilters;
    const scoreMin = score.min !== '' ? Number(score.min) : null;
    const scoreMax = score.max !== '' ? Number(score.max) : null;

    let list = MOCK_CANDIDATES.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.job.toLowerCase().includes(q)) return false;
      if (status.length && !status.map((s) => s.toLowerCase()).includes(c.status)) return false;
      if (job.length && !job.includes(c.job)) return false;
      if (scoreMin !== null && c.score < scoreMin) return false;
      if (scoreMax !== null && c.score > scoreMax) return false;
      if (flaggedOnly && c.antiCheat !== 'flagged') return false;
      return true;
    });

    return list.sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'number') return (aVal - bVal) * modifier;
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });
  }, [sortColumn, sortDirection, searchValue, overlayFilters]);

  // Responsive items per page calculation
  const { tableRef, itemsPerPage } = useResponsiveItemsPerPage(
    { rowHeight: ROW_HEIGHT, headerHeight: HEADER_HEIGHT, paginationHeight: PAGINATION_HEIGHT },
    { paginationSelector: '.pipeline-page__pagination' }
  );

  const totalPages = Math.max(1, Math.ceil(sortedCandidates.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const paginatedCandidates = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return sortedCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCandidates, safePage, itemsPerPage]);

  const handleSort = useCallback((columnKey, direction) => {
    setSortColumn(direction ? columnKey : null);
    setSortDirection(direction);
  }, []);

  const handleOverviewSort = useCallback((columnKey, direction) => {
    setOverviewSortColumn(direction ? columnKey : null);
    setOverviewSortDirection(direction);
  }, []);

  const sortedJobPerformance = useMemo(() => {
    if (!overviewSortColumn || !overviewSortDirection) return JOB_PERFORMANCE_DATA;

    return [...JOB_PERFORMANCE_DATA].sort((a, b) => {
      const aVal = a[overviewSortColumn];
      const bVal = b[overviewSortColumn];
      const modifier = overviewSortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'number') return (aVal - bVal) * modifier;
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });
  }, [overviewSortColumn, overviewSortDirection]);

  const columnsWithSortState = useMemo(
    () =>
      TABLE_COLUMNS.map((col) => ({
        ...col,
        sortState: sortColumn === col.key ? sortDirection : null,
      })),
    [sortColumn, sortDirection]
  );

  const overviewColumnsWithSortState = useMemo(
    () =>
      JOB_PERFORMANCE_COLUMNS.map((col) => ({
        ...col,
        sortState: overviewSortColumn === col.key ? overviewSortDirection : null,
      })),
    [overviewSortColumn, overviewSortDirection]
  );

  const tabs = useMemo(
    () => [
      {
        label: 'Pipeline',
        isActive: activeTab === 'pipeline',
        onClick: () => handleTabChange('pipeline'),
      },
      {
        label: 'Overview',
        isActive: activeTab === 'overview',
        onClick: () => handleTabChange('overview'),
      },
    ],
    [activeTab, handleTabChange]
  );

  return (
    <div className={`pipeline-page${activeTab === 'overview' ? ' pipeline-page--overview' : ''}`}>
      <Shortcuts
        filterLabel={SHORTCUTS_CONFIG.filterLabel}
        filterCount={
          activeFilterCount
            ? [
                overlayFilters.status.length && 'Status',
                overlayFilters.job.length && 'Job',
                (overlayFilters.score.min || overlayFilters.score.max) && 'Score',
                overlayFilters.flaggedOnly && 'Anti-cheat',
              ]
                .filter(Boolean)
                .join(' · ')
            : 'No filters'
        }
        onFilterClick={() => setIsFilterOpen(true)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search candidates..."
        secondaryAction={SHORTCUTS_CONFIG.secondaryAction}
      />

      <div className="pipeline-page__dashboard">
        <div className="pipeline-page__content">
          <Tabs items={tabs} />

          {activeTab === 'pipeline' && (
            <div className="pipeline-page__table" ref={tableRef}>
              <TableHeader
                className="pipeline-page__header"
                columns={columnsWithSortState}
                onSort={handleSort}
                gridTemplateColumns={GRID_TEMPLATE}
                showMenu
              />

              <div className="pipeline-page__rows">
                {paginatedCandidates.map((candidate) => (
                  <TableRow
                    className="pipeline-page__row"
                    key={candidate.id}
                    showMenu
                    selected={candidate.id === lastSelectedId}
                    onMouseDown={() => setLastSelectedId(candidate.id)}
                    onMenuClick={() => {
                      setLastSelectedId(candidate.id);
                      setOpenMenuId(openMenuId === candidate.id ? null : candidate.id);
                    }}
                    onMenuSelect={(action) => {
                      if (action === 'View Details') {
                        handleCandidateSelect(candidate);
                      } else {
                        console.log(`Action ${action} for`, candidate.name);
                      }
                      setOpenMenuId(null);
                    }}
                    menuOpen={openMenuId === candidate.id}
                    onMenuClose={() => setOpenMenuId(null)}
                    onClick={() => handleCandidateSelect(candidate)}
                    gridTemplateColumns={GRID_TEMPLATE}
                  >
                    <TableCell
                      color="tertiary"
                      icon={
                        <span className="pipeline-page__avatar">
                          {candidate.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      }
                    >
                      {candidate.name}
                    </TableCell>
                    <TableCell color="secondary">{candidate.job}</TableCell>
                    <TableCell className="pipeline-page__score-cell">
                      <span className="pipeline-page__score">
                        <span className="pipeline-page__score-bar">
                          <span
                            className="pipeline-page__score-fill"
                            style={{
                              width: `${candidate.score}%`,
                              backgroundColor: getScoreColor(candidate.score),
                            }}
                          />
                        </span>
                        <span className="pipeline-page__score-value">{candidate.score}</span>
                      </span>
                    </TableCell>
                    <TableCell color="tertiary">{candidate.date}</TableCell>
                    <TableCell>
                      <Badge type="cheatingFlag" variant={candidate.antiCheat} iconLeft outline />
                    </TableCell>
                    <TableCell>
                      <Badge type="candidateState" variant={candidate.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </div>

              <div className="pipeline-page__pagination">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  totalItems={sortedCandidates.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div key={overviewKey} className="pipeline-page__overview">
              <div className="overview__quick-stats">
                <QuickInfoCard
                  icon={<Users />}
                  number={OVERVIEW_STATS.totalCandidates}
                  title="Total Candidates"
                  animated={true}
                />
                <QuickInfoCard
                  icon={<CheckCircle />}
                  number={OVERVIEW_STATS.completedMocks}
                  title="Completed Mocks"
                  animated={true}
                />
                <QuickInfoCard
                  icon={<Award />}
                  number={OVERVIEW_STATS.averageScore}
                  title="Average Score"
                  animated={true}
                />
                <QuickInfoCard
                  icon={<Clock />}
                  number={OVERVIEW_STATS.pending}
                  title="Pending"
                  animated={true}
                />
              </div>

              <div className="overview__charts-section">
                <SectionTitle>Performance Overview</SectionTitle>
                <div className="overview__charts">
                  <AreaChart
                    title="Application & Mock Trend"
                    data={APPLICATION_TREND_DATA}
                    xKey="week"
                    dataKeys={[
                      { key: 'applications', label: 'Applications', color: '#e64f28' },
                      { key: 'mocks', label: 'Completed Mocks', color: '#0057b5' },
                    ]}
                    animated={true}
                  />
                  <RadarChart
                    title="Avg. Performance Metrics"
                    stats={PERFORMANCE_METRICS}
                    animated={true}
                  />
                  <BarChart
                    title="Avg. Score by Role"
                    data={SCORE_BY_ROLE_DATA}
                    dataKeys={[{ key: 'value', label: 'Avg Score' }]}
                    animated={true}
                  />
                  <RadialBarChart
                    title="Candidate Score Distribution"
                    data={CANDIDATE_SCORE_DATA}
                    animated={true}
                  />
                </div>
              </div>

              <div className="overview__insights">
                <SectionTitle>AI Insights</SectionTitle>
                <div className="overview__insights-grid">
                  {AI_INSIGHTS.map((insight, index) => (
                    <InfoCard
                      key={index}
                      title={insight.title}
                      description={insight.description}
                      animated={true}
                    />
                  ))}
                </div>
              </div>

              <div className="overview__table-section">
                <SectionTitle>Job Performance</SectionTitle>
                <div className="overview__table-container">
                  <TableHeader
                    className="overview__table-header"
                    columns={overviewColumnsWithSortState}
                    onSort={handleOverviewSort}
                    gridTemplateColumns={JOB_PERF_GRID}
                  />
                  <div className="overview__table-rows">
                    {sortedJobPerformance.map((job, index) => (
                      <TableRow
                        key={index}
                        className="overview__table-row"
                        gridTemplateColumns={JOB_PERF_GRID}
                        style={{ '--row-index': index }}
                      >
                        <TableCell color="tertiary" className="overview__table-cell--job">
                          {job.job}
                        </TableCell>
                        <TableCell color="tertiary" className="overview__table-cell--value">
                          {job.avgScore}
                        </TableCell>
                        <TableCell color="tertiary" className="overview__table-cell--value">
                          {job.accepted}
                        </TableCell>
                        <TableCell color="tertiary" className="overview__table-cell--value">
                          {job.rejected}
                        </TableCell>
                        <TableCell color="tertiary" className="overview__table-cell--value">
                          {job.pending}
                        </TableCell>
                        <TableCell color="tertiary" className="overview__table-cell--value">
                          {job.total}
                        </TableCell>
                      </TableRow>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={OVERLAY_FILTERS}
        values={overlayFilters}
        onApply={(v) => {
          setOverlayFilters(v);
          setCurrentPage(1);
        }}
      />
    </div>
  );
});
