import { useMemo } from 'react';
import { GripVertical, Trash2, Plus, Search, AlertTriangle, Clock } from 'lucide-react';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { TextInput } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { MOCK_LIBRARY } from '../../../../data/config';

export function StepMocks({
  mocks,
  addMock,
  removeMock,
  updateWeight,
  totalWeight,
  totalDuration,
  showLibrary,
  setShowLibrary,
  librarySearch,
  setLibrarySearch,
  dragIndex,
  onDragStart,
  onDragOver,
  onDragEnd,
  isLive,
}) {
  const addedIds = useMemo(() => new Set(mocks.map((m) => m.id)), [mocks]);

  const filteredLibrary = useMemo(() => {
    if (!librarySearch.trim()) return MOCK_LIBRARY;
    const q = librarySearch.toLowerCase();
    return MOCK_LIBRARY.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q))
    );
  }, [librarySearch]);

  const weightClass =
    totalWeight === 100
      ? 'create-job__weight-value--exact'
      : totalWeight > 100
        ? 'create-job__weight-value--over'
        : '';
  const durationLevel =
    totalDuration < 90 ? 'normal' : totalDuration <= 150 ? 'moderate' : 'intensive';
  const durationLabel = { normal: 'Standard', moderate: 'Moderate', intensive: 'Intensive' }[
    durationLevel
  ];

  return (
    <section className="create-job__section">
      <SectionTitle
        variant="inline"
        description="Add mock interviews from the library. Drag to reorder and adjust weights. Weights must total exactly 100% to continue."
      >
        Mock Interviews
      </SectionTitle>

      {mocks.length > 0 && (
        <div className="create-job__mock-list">
          {mocks.map((mock, index) => (
            <div
              key={mock.id}
              className={[
                'create-job__mock-item',
                dragIndex === index ? 'create-job__mock-item--dragging' : '',
              ].join(' ')}
              draggable
              onDragStart={() => onDragStart(index)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
            >
              <span className="create-job__mock-drag" aria-label="Drag to reorder">
                <GripVertical size={16} />
              </span>
              <div className="create-job__mock-info">
                <span className="create-job__mock-name">{mock.name}</span>
                <span className="create-job__mock-meta">
                  <span>{mock.type}</span>
                  <span>&middot;</span>
                  <span>{mock.difficulty}</span>
                  <span>&middot;</span>
                  <span>{mock.duration}</span>
                </span>
                {mock.skills?.length > 0 && (
                  <div className="create-job__mock-skills">
                    {mock.skills.map((s) => (
                      <span key={s} className="create-job__mock-skill-tag">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="create-job__mock-weight">
                <TextInput
                  showLabel={false}
                  showHint={false}
                  value={String(mock.weight)}
                  onChange={(e) => updateWeight(mock.id, e.target.value)}
                  placeholder="%"
                />
              </div>
              <button
                type="button"
                className="create-job__mock-remove"
                onClick={() => removeMock(mock.id)}
                disabled={isLive}
                title={
                  isLive
                    ? 'Cannot remove mocks from a live job with candidates'
                    : `Remove ${mock.name}`
                }
                aria-label={`Remove ${mock.name}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Live-mode guardrail warning */}
      {isLive && mocks.length > 0 && (
        <div className="create-job__guardrail">
          <AlertTriangle size={14} />
          Weight changes will affect scoring fairness for existing candidates. Mock removals are
          disabled.
        </div>
      )}

      {mocks.length > 0 && (
        <div className="create-job__weight-bar">
          <span className="create-job__weight-label">Total Weight</span>
          <span className={`create-job__weight-value ${weightClass}`}>{totalWeight}%</span>
        </div>
      )}

      {mocks.length > 0 && (
        <div className="create-job__duration-bar">
          <span className="create-job__duration-label">Total Interview Time</span>
          <span className="create-job__duration-value">
            <Clock size={14} />
            {totalDuration} mins
            {totalDuration > 0 && (
              <span
                className={`create-job__duration-tag create-job__duration-tag--${durationLevel}`}
              >
                {durationLabel}
              </span>
            )}
          </span>
        </div>
      )}

      <div className="create-job__mock-library">
        <Button
          variant="dashed"
          iconLeft={<Plus size={16} />}
          onClick={() => setShowLibrary((o) => !o)}
        >
          Add Mock from Library
        </Button>
        <div
          className={`create-job__mock-library-menu ${showLibrary ? 'create-job__mock-library-menu--open' : ''}`}
        >
          <div className="create-job__mock-library-search">
            <Search size={14} />
            <input
              type="text"
              className="create-job__mock-library-search-input"
              placeholder="Search mocks..."
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
            />
          </div>
          <div className="create-job__mock-library-list">
            {filteredLibrary.map((mock) => {
              const isAdded = addedIds.has(mock.id);
              return (
                <button
                  key={mock.id}
                  type="button"
                  className={`create-job__mock-library-option ${isAdded ? 'create-job__mock-library-option--added' : ''}`}
                  onClick={() => !isAdded && addMock(mock)}
                  disabled={isAdded}
                >
                  <span>{mock.name}</span>
                  <span className="create-job__mock-library-detail">
                    {mock.type} &middot; {mock.difficulty} &middot; {mock.duration}
                  </span>
                </button>
              );
            })}
            {filteredLibrary.length === 0 && (
              <span className="create-job__mock-library-empty">No mocks found</span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
