import { useState, useRef, useLayoutEffect, useMemo } from 'react';
import { Shortcuts } from '../../../components/layout/Shortcuts';
import { Tabs } from '../../../components/ui/Tabs';
import { TableHeader, TableRow, TableCell } from '../../../components/ui/Tables';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { QuickInfoCard, InfoCard } from '../../../components/ui/Cards';
import { DonutChart, StatsChart } from '../../../components/ui/Charts';
import { Star, ArrowRight, Plus } from 'lucide-react';
import './Pipeline.css';

// Lordicon animated icon URLs
const LORDICON_URLS = {
  users: 'https://cdn.lordicon.com/spzqjmbt.json', // multiple users icon
  checkCircle: 'https://cdn.lordicon.com/zdfcfvwu.json', // checkmark circle
  award: 'https://cdn.lordicon.com/brjnosij.json', // star/trophy award
  clock: 'https://cdn.lordicon.com/kiqyrejq.json', // hourglass/time
};

// Mock data - will be replaced with API calls
const MOCK_CANDIDATES = [
  {
    id: 1,
    name: 'Sarah Johnson',
    job: 'Frontend Developer',
    score: 92,
    date: 'Feb 7, 2025',
    antiCheat: 'clean',
    status: 'accepted',
  },
  {
    id: 2,
    name: 'Ahmed ElSayed',
    job: 'Backend Engineer',
    score: 88,
    date: 'Feb 6, 2025',
    antiCheat: 'flagged',
    status: 'shortlist',
  },
  {
    id: 3,
    name: 'Lina Markovic',
    job: 'UX Designer',
    score: 97,
    date: 'Feb 6, 2025',
    antiCheat: 'flagged',
    status: 'accepted',
  },
  {
    id: 4,
    name: 'Omar Khaled',
    job: 'Data Analyst',
    score: 75,
    date: 'Feb 5, 2025',
    antiCheat: 'clean',
    status: 'pending',
  },
  {
    id: 5,
    name: 'Maria Lopez',
    job: 'Product Manager',
    score: 89,
    date: 'Feb 5, 2025',
    antiCheat: 'critical',
    status: 'rejected',
  },
  {
    id: 6,
    name: 'David Kim',
    job: 'ML Engineer',
    score: 93,
    date: 'Feb 5, 2025',
    antiCheat: 'clean',
    status: 'shortlist',
  },
  {
    id: 7,
    name: 'Aya Mahmoud',
    job: 'Data Engineer',
    score: 55,
    date: 'Feb 5, 2025',
    antiCheat: 'clean',
    status: 'rejected',
  },
  {
    id: 8,
    name: 'Rania Ibrahim',
    job: 'Fullstack Developer',
    score: 94,
    date: 'Jan 29, 2025',
    antiCheat: 'clean',
    status: 'accepted',
  },
  {
    id: 9,
    name: 'Samuel Carter',
    job: 'HR Specialist',
    score: 81,
    date: 'Jan 29, 2025',
    antiCheat: 'critical',
    status: 'shortlist',
  },
  {
    id: 10,
    name: 'Mark Reed',
    job: 'SysAdmin',
    score: 76,
    date: 'Jan 28, 2025',
    antiCheat: 'clean',
    status: 'rejected',
  },
  {
    id: 11,
    name: 'Youssef Hamed',
    job: 'SEO Specialist',
    score: 83,
    date: 'Jan 28, 2025',
    antiCheat: 'clean',
    status: 'accepted',
  },
  {
    id: 12,
    name: 'Hadi Mansour',
    job: 'Business Analyst',
    score: 96,
    date: 'Jan 27, 2025',
    antiCheat: 'flagged',
    status: 'shortlist',
  },
  {
    id: 13,
    name: 'Samuel Carter',
    job: 'HR Specialist',
    score: 81,
    date: 'Jan 29, 2025',
    antiCheat: 'critical',
    status: 'shortlist',
  },
  {
    id: 14,
    name: 'Mark Reed',
    job: 'SysAdmin',
    score: 76,
    date: 'Jan 28, 2025',
    antiCheat: 'clean',
    status: 'rejected',
  },
  {
    id: 15,
    name: 'Youssef Hamed',
    job: 'SEO Specialist',
    score: 83,
    date: 'Jan 28, 2025',
    antiCheat: 'clean',
    status: 'accepted',
  },
  {
    id: 16,
    name: 'Hadi Mansour',
    job: 'Business Analyst',
    score: 96,
    date: 'Jan 27, 2025',
    antiCheat: 'flagged',
    status: 'shortlist',
  },
];

const TABLE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, fr: 1.5 },
  { key: 'job', label: 'Job', sortable: true, fr: 1.5 },
  { key: 'score', label: 'Score', sortable: true, fr: 1 },
  { key: 'date', label: 'Date', sortable: true, fr: 1 },
  { key: 'antiCheat', label: 'Anti-cheat', sortable: false, fr: 1 },
  { key: 'status', label: 'Status', sortable: false, fr: 1 },
];

// Layout constants
const ROW_HEIGHT = 56;
const HEADER_HEIGHT = 40;
const PAGINATION_HEIGHT = 56;

// Shortcuts configuration
const SHORTCUTS_CONFIG = {
  filterLabel: 'Fillters',
  secondaryAction: {
    label: '5 Active jobs',
    icon: ArrowRight,
  },
  primaryAction: {
    label: 'Create job',
    icon: Plus,
    onClick: () => console.log('Create job'),
  },
};

// Reusable star icon for score display
const SCORE_ICON = <Star size={16} fill="var(--brand-600)" stroke="var(--brand-600)" />;

// Overview data
const OVERVIEW_STATS = {
  totalCandidates: 37,
  completedMocks: 420,
  averageScore: 78,
  pending: 264,
};

const PERFORMANCE_METRICS = [
  { label: 'Average Score', value: 88 },
  { label: 'Reviewed', value: 88 },
  { label: 'Title', value: 88 },
  { label: 'Title', value: 88 },
];

const CANDIDATE_SCORE_DATA = [
  { label: 'Excellent Performers (90-100)', value: 145, subtext: '' },
  { label: 'High Performers (80-79)', value: 77, subtext: '25.8%' },
  { label: 'Moderate Performers (40-59)', value: 44, subtext: '14.8%' },
  { label: 'Low Performers (0-39)', value: 31, subtext: '' },
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

export function Pipeline() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [overviewKey, setOverviewKey] = useState(0); // Force animation reset on tab change
  const [overviewSortColumn, setOverviewSortColumn] = useState(null);
  const [overviewSortDirection, setOverviewSortDirection] = useState(null);

  // Update overview key when switching to overview tab
  const handleTabChange = (tab) => {
    if (tab === 'overview' && activeTab !== 'overview') {
      setOverviewKey((prev) => prev + 1);
    }
    setActiveTab(tab);
  };

  // Sort candidates
  // Memoize sorted candidates to avoid recomputing on every render
  const sortedCandidates = useMemo(() => {
    return [...MOCK_CANDIDATES].sort((a, b) => {
      if (!sortColumn || !sortDirection) return 0;
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const modifier = sortDirection === 'asc' ? 1 : -1;
      if (typeof aVal === 'number') return (aVal - bVal) * modifier;
      return String(aVal).localeCompare(String(bVal)) * modifier;
    });
  }, [sortColumn, sortDirection]);

  // Responsive items per page calculation
  const tableRef = useRef(null);
  const [itemsPerPage, setItemsPerPage] = useState(1);

  useLayoutEffect(() => {
    if (!tableRef.current) return;

    const calculateItemsPerPage = () => {
      const tableHeight = tableRef.current.clientHeight;
      const availableHeight = tableHeight - HEADER_HEIGHT - PAGINATION_HEIGHT;
      const count = Math.floor(availableHeight / ROW_HEIGHT);
      setItemsPerPage(Math.max(1, count));
    };

    calculateItemsPerPage();

    const observer = new ResizeObserver(calculateItemsPerPage);
    observer.observe(tableRef.current);

    return () => observer.disconnect();
  }, []);

  // Pagination - memoize to avoid recalculating
  const totalPages = Math.max(1, Math.ceil(sortedCandidates.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);

  // Reset to page 1 if current page exceeds total pages after filtering/sorting
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(1);
  }

  const paginatedCandidates = useMemo(() => {
    const startIndex = (safePage - 1) * itemsPerPage;
    return sortedCandidates.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedCandidates, safePage, itemsPerPage]);

  const handleSort = (columnKey, direction) => {
    setSortColumn(direction ? columnKey : null);
    setSortDirection(direction);
  };

  const handleOverviewSort = (columnKey, direction) => {
    setOverviewSortColumn(direction ? columnKey : null);
    setOverviewSortDirection(direction);
  };

  // Memoize sorted job performance data
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

  // Memoize columns with sort state to avoid recalculating on every render
  const columnsWithSortState = useMemo(
    () =>
      TABLE_COLUMNS.map((col) => ({
        ...col,
        sortState: sortColumn === col.key ? sortDirection : null,
      })),
    [sortColumn, sortDirection]
  );

  // Memoize overview columns with sort state
  const overviewColumnsWithSortState = useMemo(
    () =>
      JOB_PERFORMANCE_COLUMNS.map((col) => ({
        ...col,
        sortState: overviewSortColumn === col.key ? overviewSortDirection : null,
      })),
    [overviewSortColumn, overviewSortDirection]
  );

  // Memoize grid template for performance
  const showMenu = true;
  const gridTemplateColumns = useMemo(
    () => `${TABLE_COLUMNS.map((col) => `${col.fr || 1}fr`).join(' ')}${showMenu ? ' 2rem' : ''}`,
    [showMenu]
  );

  const tabs = [
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
  ];

  return (
    <div className="pipeline-page">
      {/* Shortcuts Bar */}
      <Shortcuts
        filterLabel={SHORTCUTS_CONFIG.filterLabel}
        filterCount={`${sortedCandidates.length} Candidate${sortedCandidates.length !== 1 ? 's' : ''} Selected`}
        onFilterClick={() => console.log('Open filters')}
        secondaryAction={SHORTCUTS_CONFIG.secondaryAction}
        primaryAction={SHORTCUTS_CONFIG.primaryAction}
      />

      {/* Dashboard Container */}
      <div className="pipeline-page__dashboard">
        <div className="pipeline-page__content">
          {/* Tabs */}
          <Tabs items={tabs} />

          {/* Content based on active tab */}
          {activeTab === 'pipeline' && (
            <div className="pipeline-page__table" ref={tableRef}>
              <TableHeader
                className="pipeline-page__header"
                columns={columnsWithSortState}
                onSort={handleSort}
                gridTemplateColumns={gridTemplateColumns}
                showMenu={showMenu}
              />

              <div className="pipeline-page__rows">
                {paginatedCandidates.map((candidate) => (
                  <TableRow
                    className="pipeline-page__row"
                    key={candidate.id}
                    showMenu={showMenu}
                    onMenuClick={() =>
                      setOpenMenuId(openMenuId === candidate.id ? null : candidate.id)
                    }
                    onMenuSelect={(action) => {
                      console.log(`Action ${action} for`, candidate.name);
                      setOpenMenuId(null);
                    }}
                    menuOpen={openMenuId === candidate.id}
                    onMenuClose={() => setOpenMenuId(null)}
                    onClick={() => console.log('Row clicked:', candidate)}
                    gridTemplateColumns={gridTemplateColumns}
                  >
                    <TableCell color="tertiary">{candidate.name}</TableCell>
                    <TableCell color="secondary">{candidate.job}</TableCell>
                    <TableCell color="secondary" icon={SCORE_ICON}>
                      {candidate.score}
                    </TableCell>
                    <TableCell color="tertiary">{candidate.date}</TableCell>
                    <TableCell>
                      <Badge type="cheatingFlag" variant={candidate.antiCheat} iconLeft />
                    </TableCell>
                    <TableCell>
                      <Badge type="candidateState" variant={candidate.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </div>

              {/* Pagination */}
              <div className="pipeline-page__pagination">
                <Pagination
                  currentPage={safePage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div key={overviewKey} className="pipeline-page__overview">
              {/* Quick Stats */}
              <div className="overview__quick-stats">
                <QuickInfoCard
                  lordicon={LORDICON_URLS.users}
                  iconColor={'var(--text-tertiary)'}
                  number={OVERVIEW_STATS.totalCandidates}
                  title="Total Candidates"
                  animated={true}
                />
                <QuickInfoCard
                  lordicon={LORDICON_URLS.checkCircle}
                  iconColor={'var(--text-tertiary)'}
                  number={OVERVIEW_STATS.completedMocks}
                  title="Completed Mocks"
                  animated={true}
                />
                <QuickInfoCard
                  lordicon={LORDICON_URLS.award}
                  iconColor={'var(--text-tertiary)'}
                  number={OVERVIEW_STATS.averageScore}
                  title="Average Score"
                  animated={true}
                />
                <QuickInfoCard
                  lordicon={LORDICON_URLS.clock}
                  iconColor={'var(--text-tertiary)'}
                  number={OVERVIEW_STATS.pending}
                  title="Pending"
                  animated={true}
                />
              </div>

              {/* Charts Section */}
              <div className="overview__charts">
                <StatsChart
                  title="Performance Metrics"
                  stats={PERFORMANCE_METRICS}
                  animated={true}
                />
                <DonutChart
                  title="Candidate Score"
                  data={CANDIDATE_SCORE_DATA}
                  totalLabel="Total Candidates"
                  animated={true}
                />
              </div>

              {/* AI Insights */}
              <div className="overview__insights">
                <h3 className="overview__section-title">AI Insights</h3>
                <div className="overview__insights-grid">
                  {AI_INSIGHTS.map((insight, index) => (
                    <InfoCard
                      key={index}
                      title={insight.title}
                      description={insight.description}
                      showAiIcon={true}
                      animated={true}
                    />
                  ))}
                </div>
              </div>

              {/* Job Performance Table */}
              <div className="overview__table-section">
                <h3 className="overview__section-title">Job Performance</h3>
                <div className="overview__table-container">
                  <TableHeader
                    className="overview__table-header"
                    columns={overviewColumnsWithSortState}
                    onSort={handleOverviewSort}
                    gridTemplateColumns="2fr 1fr 1fr 1fr 1fr 1fr"
                  />
                  <div className="overview__table-rows">
                    {sortedJobPerformance.map((job, index) => (
                      <TableRow
                        key={index}
                        className="overview__table-row"
                        gridTemplateColumns="2fr 1fr 1fr 1fr 1fr 1fr"
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
    </div>
  );
}
