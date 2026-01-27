import { useState } from 'react';
import { Shortcuts } from '../../components/layout/Shortcuts';
import { Tabs } from '../../components/ui/Tabs';
import { TableHeader, TableRow, TableCell } from '../../components/ui/Tables';
import { Badge } from '../../components/ui/Badge';
import { Pagination } from '../../components/ui/Pagination';
import { Star, ArrowRight, Plus } from 'lucide-react';
import './CandidatesPage.css';

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
  { key: 'name', label: 'Name', sortable: true, width: '250px' },
  { key: 'job', label: 'Job', sortable: true, width: '180px' },
  { key: 'score', label: 'Score', sortable: true, width: '100px' },
  { key: 'date', label: 'Date', sortable: true, width: '150px' },
  { key: 'antiCheat', label: 'Anti-cheat', sortable: false, width: '120px' },
  { key: 'status', label: 'Status', sortable: false, width: '120px' },
];

const ITEMS_PER_PAGE = 12;

export function CandidatesPage() {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null);

  // Filter and sort candidates
  const filteredCandidates = MOCK_CANDIDATES.filter((candidate) =>
    candidate.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    const aVal = a[sortColumn];
    const bVal = b[sortColumn];
    const modifier = sortDirection === 'asc' ? 1 : -1;
    if (typeof aVal === 'number') return (aVal - bVal) * modifier;
    return String(aVal).localeCompare(String(bVal)) * modifier;
  });

  // Pagination
  const totalPages = Math.ceil(sortedCandidates.length / ITEMS_PER_PAGE);
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
    <div className="candidates-page">
      {/* Shortcuts Bar */}
      <Shortcuts
        filterLabel="Filters"
        filterCount={`${filteredCandidates.length} Candidate Selected`}
        onFilterClick={() => console.log('Open filters')}
        searchValue={searchValue}
        onSearchChange={(e) => {
          setSearchValue(e.target.value);
          setCurrentPage(1);
        }}
        searchPlaceholder="Search"
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

      {/* Tabs */}
      <div className="candidates-page__tabs">
        <Tabs items={tabs} />
      </div>

      {/* Content based on active tab */}
      {activeTab === 'pipeline' && (
        <div className="candidates-page__table-container">
          <TableHeader columns={columnsWithSortState} onSort={handleSort} />

          {paginatedCandidates.map((candidate) => (
            <TableRow
              key={candidate.id}
              showMenu
              onMenuClick={() => console.log('Menu clicked for', candidate.name)}
              onClick={() => console.log('Row clicked:', candidate)}
            >
              <TableCell width="250px" color="primary">
                {candidate.name}
              </TableCell>
              <TableCell width="180px" color="secondary">
                {candidate.job}
              </TableCell>
              <TableCell
                width="100px"
                color="primary"
                icon={<Star size={14} fill="var(--brand-default)" stroke="var(--brand-default)" />}
              >
                {candidate.score}
              </TableCell>
              <TableCell width="150px" color="tertiary">
                {candidate.date}
              </TableCell>
              <TableCell width="120px">
                <Badge type="cheatingFlag" variant={candidate.antiCheat} iconLeft />
              </TableCell>
              <TableCell width="120px">
                <Badge type="candidateState" variant={candidate.status} />
              </TableCell>
            </TableRow>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="candidates-page__pagination">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'overview' && (
        <div className="candidates-page__overview">
          {/* Overview content will go here */}
          <p>Overview tab content coming soon...</p>
        </div>
      )}
    </div>
  );
}
