import { useState, useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import { Pencil, Eye, Plus, Copy, Clock, Trash2, Briefcase, Zap } from 'lucide-react';
import { Shortcuts } from '../../../../components/layout/Shortcuts';
import { EntityCard } from '../../../../components/ui/Cards';
import { Pagination } from '../../../../components/ui/Pagination';
import { FilterOverlay } from '../../../../components/ui/FilterOverlay';
import { MOCKS, getUsedInJobsCount, getMockStatus } from '../../../../api';
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
};

/* Overlay filter definitions */

const DIFFICULTY_FILTERS = ['Easy', 'Medium', 'Hard'];
const OVERLAY_FILTERS = [
  {
    key: 'statusQuick',
    label: 'Status',
    type: 'select',
    options: STATUS_FILTERS.filter((v) => v !== 'All').map((v) => ({ value: v, label: v })),
  },
  {
    key: 'typeQuick',
    label: 'Type',
    type: 'select',
    options: TYPE_FILTERS.filter((v) => v !== 'All').map((v) => ({ value: v, label: v })),
  },
  {
    key: 'sortQuick',
    label: 'Sort by',
    type: 'select',
    options: SORT_OPTIONS.map((v) => ({ value: v, label: v })),
  },
  { key: 'difficulty', label: 'Difficulty', type: 'multiselect', options: DIFFICULTY_FILTERS },
  { key: 'score', label: 'Avg Score', type: 'range', minLabel: 'Min', maxLabel: 'Max' },
  { key: 'sessions', label: 'Total Sessions', type: 'range', minLabel: 'Min', maxLabel: 'Max' },
];
const INITIAL_OVERLAY = {
  statusQuick: '',
  typeQuick: '',
  sortQuick: 'Recently Created',
  difficulty: [],
  score: { min: '', max: '' },
  sessions: { min: '', max: '' },
};

/* Component */

export const MockList = memo(function MockList({ onViewMock, onEditMock, onCreateMock }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recently Created');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [overlayFilters, setOverlayFilters] = useState(INITIAL_OVERLAY);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (overlayFilters.statusQuick) count++;
    if (overlayFilters.typeQuick) count++;
    if (overlayFilters.sortQuick && overlayFilters.sortQuick !== 'Recently Created') count++;
    if (overlayFilters.difficulty.length) count++;
    if (overlayFilters.score.min || overlayFilters.score.max) count++;
    if (overlayFilters.sessions.min || overlayFilters.sessions.max) count++;
    return count;
  }, [overlayFilters]);

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
      if (overlayFilters.difficulty.length && !overlayFilters.difficulty.includes(m.difficulty))
        return false;
      const scoreMin = overlayFilters.score.min !== '' ? Number(overlayFilters.score.min) : null;
      const scoreMax = overlayFilters.score.max !== '' ? Number(overlayFilters.score.max) : null;
      if (scoreMin !== null && m.avgScore < scoreMin) return false;
      if (scoreMax !== null && m.avgScore > scoreMax) return false;
      const sessMin =
        overlayFilters.sessions.min !== '' ? Number(overlayFilters.sessions.min) : null;
      const sessMax =
        overlayFilters.sessions.max !== '' ? Number(overlayFilters.sessions.max) : null;
      if (sessMin !== null && m.totalSessions < sessMin) return false;
      if (sessMax !== null && m.totalSessions > sessMax) return false;
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
  }, [statusFilter, typeFilter, sortBy, searchValue, enrichedMocks, overlayFilters]);

  const totalPages = Math.max(1, Math.ceil(filteredMocks.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedMocks = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredMocks.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredMocks, safePage]);

  const handleMenuSelect = useCallback(
    (mockId, action) => {
      if (action === 'view') onViewMock?.(mockId);
      else if (action === 'edit') onEditMock?.(mockId);
    },
    [onViewMock, onEditMock]
  );

  const shortcutsConfig = useMemo(
    () => ({
      ...SHORTCUTS_CONFIG,
      primaryAction: {
        label: 'Create mock',
        icon: Plus,
        onClick: () => onCreateMock?.(),
      },
    }),
    [onCreateMock]
  );

  return (
    <div className="mock-list">
      <Shortcuts
        filterLabel={shortcutsConfig.filterLabel}
        filterCount={activeFilterCount ? `${activeFilterCount} active` : undefined}
        onFilterClick={() => setIsFilterOpen(true)}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search mocks..."
        primaryAction={shortcutsConfig.primaryAction}
      />

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

      <FilterOverlay
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={OVERLAY_FILTERS}
        values={overlayFilters}
        onApply={(v) => {
          setOverlayFilters(v);
          setStatusFilter(v.statusQuick || 'All');
          setTypeFilter(v.typeQuick || 'All');
          setSortBy(v.sortQuick || 'Recently Created');
          setCurrentPage(1);
        }}
      />
    </div>
  );
});

MockList.propTypes = {
  onViewMock: PropTypes.func,
  onEditMock: PropTypes.func,
  onCreateMock: PropTypes.func,
};
