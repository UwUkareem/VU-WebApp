import { useState } from 'react';
import { Shortcuts } from '../../../components/layout/Shortcuts';
import { Tabs } from '../../../components/ui/Tabs';
import { TableHeader, TableRow, TableCell } from '../../../components/ui/Tables';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { Star, ArrowRight, Plus } from 'lucide-react';
import './Pipeline.css';

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
];

const TABLE_COLUMNS = [
  { key: 'name', label: 'Name', sortable: true, width: '200px' },
  { key: 'job', label: 'Job', sortable: true, width: '200px' },
  { key: 'score', label: 'Score', sortable: true, width: '150px' },
  { key: 'date', label: 'Date', sortable: true, width: '150px' },
  { key: 'antiCheat', label: 'Anti-cheat', sortable: false, width: '160px' },
  { key: 'status', label: 'Status', sortable: false, width: '150px' },
];

const ITEMS_PER_PAGE = 12;

/**
 * Pipeline - Candidates pipeline view
 *
 * Displays a table of candidates with filtering, sorting, and pagination.
 * Part of the Candidates section of the app.
 */
export function Pipeline() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  // Sort candidates
  const sortedCandidates = [...MOCK_CANDIDATES].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (typeof aVal === 'number') return (aVal - bVal) * modifier;
    return String(aVal).localeCompare(String(bVal)) * modifier;
  });

  // Pagination
  const totalPages = 25; // As shown in Figma
  const paginatedCandidates = sortedCandidates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (columnKey, direction) => {
    setSortColumn(direction ? columnKey : null);
    setSortDirection(direction);
  };

  const columnsWithSortState = TABLE_COLUMNS.map((col) => ({
    ...col,
    sortState: sortColumn === col.key ? sortDirection : null,
  }));

  const tabs = [
    {
      label: 'Pipeline',
      isActive: activeTab === 'pipeline',
      onClick: () => setActiveTab('pipeline'),
    },
    {
      label: 'Overview',
      isActive: activeTab === 'overview',
      onClick: () => setActiveTab('overview'),
    },
  ];

  return (
    <div className="pipeline-page">
      {/* Shortcuts Bar */}
      <Shortcuts
        filterLabel="Fillters"
        filterCount={`${MOCK_CANDIDATES.length} Candidate Selected`}
        onFilterClick={() => console.log('Open filters')}
        secondaryAction={{
          label: '5 Active jobs',
          icon: ArrowRight,
        }}
        primaryAction={{
          label: 'Create job',
          icon: Plus,
          onClick: () => console.log('Create job'),
        }}
      />

      {/* Dashboard Container */}
      <div className="pipeline-page__dashboard">
        <div className="pipeline-page__content">
          {/* Tabs */}
          <Tabs items={tabs} />

          {/* Content based on active tab */}
          {activeTab === 'pipeline' && (
            <div className="pipeline-page__table">
              <TableHeader columns={columnsWithSortState} onSort={handleSort} />

              <div className="pipeline-page__rows">
                {paginatedCandidates.map((candidate) => (
                  <TableRow
                    key={candidate.id}
                    showMenu
                    onMenuClick={() => console.log('Menu clicked for', candidate.name)}
                    onClick={() => console.log('Row clicked:', candidate)}
                  >
                    <TableCell width="200px" color="tertiary">
                      {candidate.name}
                    </TableCell>
                    <TableCell width="200px" color="primary">
                      {candidate.job}
                    </TableCell>
                    <TableCell
                      width="150px"
                      color="primary"
                      icon={<Star size={16} fill="var(--yellow-500)" stroke="var(--yellow-500)" />}
                    >
                      {candidate.score}
                    </TableCell>
                    <TableCell width="150px" color="tertiary">
                      {candidate.date}
                    </TableCell>
                    <TableCell width="160px">
                      <Badge type="cheatingFlag" variant={candidate.antiCheat} iconLeft />
                    </TableCell>
                    <TableCell width="150px">
                      <Badge type="candidateState" variant={candidate.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </div>

              {/* Pagination */}
              <div className="pipeline-page__pagination">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="pipeline-page__overview">
              <p>Overview tab content coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
