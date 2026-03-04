import { useState, useMemo, useCallback, memo } from 'react';
import { Pencil, Eye, Plus, Copy, Clock, Trash2, Briefcase, Zap } from 'lucide-react';
import { Shortcuts } from '../../../../components/layout/Shortcuts';
import { EntityCard } from '../../../../components/ui/Cards';
import { QuickSort } from '../../../../components/ui/QuickSort';
import { Pagination } from '../../../../components/ui/Pagination';
import { MOCKS, getUsedInJobsCount, getMockStatus } from '../_shared/mockData';
import './MockList.css';

/* Menu options */

const CARD_MENU_OPTIONS = [
  { id: 'view', label: 'View Details', icon: Eye, variant: 'default' },
  { id: 'edit', label: 'Edit Mock', icon: Pencil, variant: 'default' },
  { id: 'duplicate', label: 'Duplicate Mock', icon: Copy, variant: 'default', separator: true },
  { id: 'delete', label: 'Delete', icon: Trash2, variant: 'danger', separator: true },
];

/* Difficulty badge display */

const DIFFICULTY_META = { Easy: 'Easy', Medium: 'Medium', Hard: 'Hard' };

/* Filter configs */

const STATUS_FILTERS = ['All', 'Active', 'Inactive'];
const TYPE_FILTERS = ['All', 'Technical', 'Behavioral', 'Analytical', 'Design'];
const SORT_OPTIONS = ['Recently Created', 'Avg Score', 'Total Sessions', 'Used in Jobs'];

const ITEMS_PER_PAGE = 6;

/* Shortcuts config */

const SHORTCUTS_CONFIG = {
  filterLabel: 'Filters',
  primaryAction: {
    label: 'Create mock',
    icon: Plus,
    onClick: () => console.log('Create mock'),
  },
};

/* Component */

export const MockList = memo(function MockList({ onViewMock, onEditMock, onCreateMock }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Created');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');

  const handleSearchChange = useCallback((e) => {
    setSearchValue(e.target.value);
    setCurrentPage(1);
  }, []);

  /* Enrich mocks with computed status and usedInJobs */
  const enrichedMocks = useMemo(
    () =>
      MOCKS.map((m) => ({
        ...m,
        computedStatus: getMockStatus(m.id),
        usedInJobs: getUsedInJobsCount(m.title),
      })),
    []
  );

  const filteredMocks = useMemo(() => {
    const statusLower = statusFilter !== 'All' ? statusFilter.toLowerCase() : null;
    const typeLower = typeFilter !== 'All' ? typeFilter.toLowerCase() : null;
    const q = searchValue.trim() ? searchValue.toLowerCase() : null;

    let mocks = enrichedMocks.filter((m) => {
      if (statusLower && m.computedStatus !== statusLower) return false;
      if (typeLower && m.type.toLowerCase() !== typeLower) return false;
      if (
        q &&
        !m.title.toLowerCase().includes(q) &&
        !m.type.toLowerCase().includes(q) &&
        !m.skills.some((s) => s.toLowerCase().includes(q))
      )
        return false;
      return true;
    });

    switch (sortBy) {
      case 'Avg Score':
        mocks.sort((a, b) => b.avgScore - a.avgScore);
        break;
      case 'Total Sessions':
        mocks.sort((a, b) => b.totalSessions - a.totalSessions);
        break;
      case 'Used in Jobs':
        mocks.sort((a, b) => b.usedInJobs - a.usedInJobs);
        break;
      default:
        mocks.sort((a, b) => b.id - a.id);
        break;
    }

    return mocks;
  }, [statusFilter, typeFilter, sortBy, searchValue, enrichedMocks]);

  const totalPages = Math.max(1, Math.ceil(filteredMocks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedMocks = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredMocks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMocks, safePage]);

  const handleMenuSelect = useCallback(
    (mockId, action) => {
      if (action === 'view') {
        onViewMock?.(mockId);
        return;
      }
      if (action === 'edit') {
        onEditMock?.(mockId);
        return;
      }
      console.log(`Action: ${action} on mock #${mockId}`);
    },
    [onViewMock, onEditMock]
  );

  const shortcutsConfig = useMemo(
    () => ({
      ...SHORTCUTS_CONFIG,
      primaryAction: {
        ...SHORTCUTS_CONFIG.primaryAction,
        onClick: () => onCreateMock?.(),
      },
    }),
    [onCreateMock]
  );

  return (
    <div className="mock-list">
      <Shortcuts
        filterLabel={shortcutsConfig.filterLabel}
        onFilterClick={() => console.log('Open filters')}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search mocks..."
        primaryAction={shortcutsConfig.primaryAction}
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
              label: 'Type',
              options: TYPE_FILTERS,
              value: typeFilter,
              onChange: (f) => {
                setTypeFilter(f);
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

      <div className="mock-list__content">
        <div className="mock-list__cards">
          {paginatedMocks.map((mock) => (
            <EntityCard
              key={mock.id}
              className="mock-list__card"
              userName={mock.title}
              userEmail={`${mock.type} \u00B7 ${DIFFICULTY_META[mock.difficulty] || mock.difficulty}`}
              showAvatar={false}
              showBadge
              badgeType="jobStatus"
              badgeVariant={mock.computedStatus}
              showMenu
              menuOptions={CARD_MENU_OPTIONS}
              onMenuSelect={(action) => handleMenuSelect(mock.id, action)}
              onClick={() => onViewMock?.(mock.id)}
              score={mock.avgScore}
              scoreLabel="Avg Score"
              colLeft={{
                icon: Zap,
                title: String(mock.skills.length),
                subtitle: 'Skills',
              }}
              colMid={{
                icon: Briefcase,
                title: String(mock.usedInJobs),
                subtitle: 'Used in Jobs',
              }}
              colRight={{
                icon: Clock,
                title: mock.duration,
                subtitle: 'Duration',
              }}
              tags={mock.skills}
              tagsLimit={3}
              animated
            />
          ))}
        </div>

        <div className="mock-list__pagination">
          <Pagination
            currentPage={safePage}
            totalPages={totalPages}
            totalItems={filteredMocks.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
});
