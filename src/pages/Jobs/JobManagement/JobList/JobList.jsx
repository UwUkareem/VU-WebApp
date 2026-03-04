import { useState, useMemo, useCallback, memo } from 'react';
import {
  Users,
  Pencil,
  Eye,
  Plus,
  Copy,
  FileText,
  Clock,
  Trash2,
  XCircle,
  Layers,
} from 'lucide-react';
import { Shortcuts } from '../../../../components/layout/Shortcuts';
import { EntityCard } from '../../../../components/ui/Cards';
import { QuickSort } from '../../../../components/ui/QuickSort';
import { Pagination } from '../../../../components/ui/Pagination';
import { JOBS } from '../_shared/jobData';
import './JobList.css';

/* ── Menu options ── */

const CARD_MENU_OPTIONS = [
  { id: 'view', label: 'View Details', icon: Eye, variant: 'default' },
  { id: 'edit', label: 'Edit Job', icon: Pencil, variant: 'default' },
  { id: 'mocks', label: 'Manage Mocks', icon: Layers, variant: 'default' },
  { id: 'duplicate', label: 'Duplicate Job', icon: Copy, variant: 'default', separator: true },
  { id: 'close', label: 'Close Job', icon: XCircle, variant: 'default' },
  { id: 'delete', label: 'Delete', icon: Trash2, variant: 'danger', separator: true },
];

/* ── Smart date helpers ── */

const STATUS_DATE_CONFIG = {
  active: { suffix: '', subtitle: 'Until closing' },
  scheduled: { suffix: '', subtitle: 'Until opening' },
  closed: { suffix: ' ago', subtitle: 'Since closed' },
  draft: { suffix: ' ago', subtitle: 'Since created' },
};

function formatSmartDate(status, duration) {
  const cfg = STATUS_DATE_CONFIG[status] || { suffix: '', subtitle: 'Duration' };
  return {
    title: `${duration}${cfg.suffix}`,
    subtitle: cfg.subtitle,
  };
}

/* ── Derived list data — enriched from shared JOBS ── */

const MOCK_JOBS = JOBS.map((j) => ({
  ...j,
  totalCandidates: j.totalApplied,
  mocks: j.mocks.map((m) => m.name),
}));

/* ── Filter configs ── */

const STATUS_FILTERS = ['All', 'Active', 'Scheduled', 'Closed', 'Draft'];
const SORT_OPTIONS = ['Recently Modified', 'Avg Score', 'Total Candidates', 'Linked Mocks'];

const ITEMS_PER_PAGE = 6;

/* ── Shortcuts config ── */

const SHORTCUTS_CONFIG = {
  filterLabel: 'Filters',
  primaryAction: {
    label: 'Create job',
    icon: Plus,
    onClick: () => console.log('Create job'),
  },
};

/* ── Component ── */

export const JobList = memo(function JobList({ onViewJob, onEditJob }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Modified');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  const filteredJobs = useMemo(() => {
    const statusLower = statusFilter !== 'All' ? statusFilter.toLowerCase() : null;
    const q = searchValue.trim() ? searchValue.toLowerCase() : null;

    let jobs = MOCK_JOBS.filter((j) => {
      if (statusLower && j.status !== statusLower) return false;
      if (q && !j.title.toLowerCase().includes(q) && !j.department.toLowerCase().includes(q))
        return false;
      return true;
    });

    switch (sortBy) {
      case 'Avg Score':
        jobs.sort((a, b) => b.avgScore - a.avgScore);
        break;
      case 'Total Candidates':
        jobs.sort((a, b) => b.totalCandidates - a.totalCandidates);
        break;
      case 'Linked Mocks':
        jobs.sort((a, b) => b.mocks.length - a.mocks.length);
        break;
      default:
        jobs.sort((a, b) => b.id - a.id);
        break;
    }

    return jobs;
  }, [statusFilter, sortBy, searchValue]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedJobs = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredJobs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredJobs, safePage]);

  const handleMenuSelect = useCallback(
    (jobId, action) => {
      if (action === 'view') {
        onViewJob?.(jobId);
        return;
      }
      if (action === 'edit') {
        onEditJob?.(jobId);
        return;
      }
      console.log(`Action: ${action} on job #${jobId}`);
    },
    [onViewJob, onEditJob]
  );

  return (
    <div className="job-list">
      <Shortcuts
        filterLabel={SHORTCUTS_CONFIG.filterLabel}
        onFilterClick={() => console.log('Open filters')}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search"
        primaryAction={SHORTCUTS_CONFIG.primaryAction}
      >
        <QuickSort
          groups={[
            {
              label: 'Status',
              options: STATUS_FILTERS,
              value: statusFilter,
              onChange: (f) => {
                setStatusFilter(f);
                setCurrentPage(1);
              },
            },
            {
              label: 'Sort by',
              options: SORT_OPTIONS,
              value: sortBy,
              onChange: setSortBy,
            },
          ]}
        />
      </Shortcuts>

      <div className="job-list__content">
        {/* Job cards */}
        <div className="job-list__cards">
          {paginatedJobs.map((job) => {
            const smartDate = formatSmartDate(job.status, job.duration);
            return (
              <EntityCard
                key={job.id}
                className="job-list__card"
                userName={job.title}
                userEmail={job.department}
                showAvatar={false}
                showBadge
                badgeType="jobStatus"
                badgeVariant={job.status}
                showMenu
                menuOptions={CARD_MENU_OPTIONS}
                onMenuSelect={(action) => handleMenuSelect(job.id, action)}
                onClick={() => onViewJob?.(job.id)}
                score={job.avgScore}
                scoreLabel="Avg Score"
                colLeft={{
                  icon: Users,
                  title: String(job.totalCandidates),
                  subtitle: 'Total Candidates',
                }}
                colMid={{
                  icon: FileText,
                  title: String(job.mocks.length),
                  subtitle: 'Linked Mocks',
                }}
                colRight={{
                  icon: Clock,
                  title: smartDate.title,
                  subtitle: smartDate.subtitle,
                }}
                tags={job.skills}
                tagsLimit={3}
                animated
              />
            );
          })}
        </div>

        {/* Pagination */}
        <div className="job-list__pagination">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredJobs.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
});
