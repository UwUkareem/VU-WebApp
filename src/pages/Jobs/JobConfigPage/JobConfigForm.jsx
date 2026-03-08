import { useState, useCallback, useMemo, useRef, memo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  Trash2,
  Plus,
  Send,
  Rocket,
  Save,
  Clock,
  Search,
  AlertTriangle,
  PauseCircle,
  XCircle,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Button } from '../../../components/ui/Button';
import { Toggle } from '../../../components/ui/Toggle';
import { Tags } from '../../../components/ui/Tags';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { TextInput, DropdownInput, Textarea } from '../../../components/ui/Input';
import { EditBanner } from './edit/EditBanner';
import {
  JOB_STEPS_CREATE as STEPS_CREATE,
  JOB_STEPS_EDIT as STEPS_EDIT,
  JOB_TYPE_OPTIONS,
  SENIORITY_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  MOCK_LIBRARY,
  EMAIL_TRIGGERS,
  INITIAL_JOB_FORM as INITIAL_FORM,
  parseDurationMin,
} from '../../../data/config';
import './JobConfigForm.css';

/* -------------------------------------------------
   JobConfigForm
   Props:
     mode          – 'create' | 'edit'
     initialData   – pre-filled form values (edit mode)
     status        – 'draft' | 'scheduled' | 'active' | 'closed' (edit)
     candidateCount – number of existing candidates (edit)
     onPublish     – (form) => void
     onSaveDraft   – (form) => void
     onSaveChanges – (form) => void
     onStatusChange – (newStatus) => void
   ------------------------------------------------- */

export const JobConfigForm = memo(function JobConfigForm({
  mode = 'create',
  initialData,
  status,
  candidateCount = 0,
  onPublish,
  onSaveDraft,
  onSaveChanges,
  onStatusChange,
}) {
  const isEdit = mode === 'edit';
  const isLive = isEdit && status === 'active' && candidateCount > 0;

  const STEPS = isEdit ? STEPS_EDIT : STEPS_CREATE;

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialData ?? INITIAL_FORM);
  const [showMockLibrary, setShowMockLibrary] = useState(false);
  const [librarySearch, setLibrarySearch] = useState('');
  const dragIndexRef = useRef(null);
  const manualWeightIds = useRef(new Set());
  const [, forceRender] = useState(0);

  /* -- Field updaters -- */
  const updateField = useCallback((field, value) => setForm((p) => ({ ...p, [field]: value })), []);

  const updateEmail = useCallback(
    (id, checked) => setForm((p) => ({ ...p, emails: { ...p.emails, [id]: checked } })),
    []
  );

  /* -- Skills -- */
  const addSkill = useCallback((tag) => {
    const n = tag.trim().charAt(0).toUpperCase() + tag.trim().slice(1);
    if (!n) return;
    setForm((p) =>
      p.skills.some((s) => s.toLowerCase() === n.toLowerCase())
        ? p
        : { ...p, skills: [...p.skills, n] }
    );
  }, []);

  const removeSkill = useCallback(
    (tag) => setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== tag) })),
    []
  );

  /* -- Mock management -- */
  const addMock = useCallback((mock) => {
    manualWeightIds.current.clear();
    setForm((p) => {
      if (p.mocks.some((m) => m.id === mock.id)) return p;
      const count = p.mocks.length + 1;
      const base = Math.floor(100 / count);
      const rem = 100 - base * count;
      return {
        ...p,
        mocks: [
          ...p.mocks.map((m, i) => ({ ...m, weight: base + (i < rem ? 1 : 0) })),
          { ...mock, weight: base },
        ],
      };
    });
    setShowMockLibrary(false);
  }, []);

  const removeMock = useCallback(
    (id) => {
      if (isLive) return; // locked on live jobs
      manualWeightIds.current.delete(id);
      setForm((p) => {
        const filtered = p.mocks.filter((m) => m.id !== id);
        if (!filtered.length) return { ...p, mocks: [] };
        const locked = manualWeightIds.current;
        const autoMocks = filtered.filter((m) => !locked.has(m.id));
        if (!autoMocks.length) {
          manualWeightIds.current.clear();
          const b = Math.floor(100 / filtered.length);
          const r = 100 - b * filtered.length;
          return { ...p, mocks: filtered.map((m, i) => ({ ...m, weight: b + (i < r ? 1 : 0) })) };
        }
        const lockedSum = filtered
          .filter((m) => locked.has(m.id))
          .reduce((s, m) => s + m.weight, 0);
        const remaining = Math.max(0, 100 - lockedSum);
        const base = Math.floor(remaining / autoMocks.length);
        const r = remaining - base * autoMocks.length;
        let idx = 0;
        return {
          ...p,
          mocks: filtered.map((m) => {
            if (locked.has(m.id)) return m;
            return { ...m, weight: base + (idx++ < r ? 1 : 0) };
          }),
        };
      });
    },
    [isLive]
  );

  const updateWeight = useCallback((id, weight) => {
    const num = Math.max(0, Math.min(100, parseInt(weight, 10) || 0));
    manualWeightIds.current.add(id);
    setForm((p) => {
      const locked = manualWeightIds.current;
      const lockedSum = p.mocks
        .filter((m) => locked.has(m.id))
        .reduce((s, m) => (m.id === id ? s + num : s + m.weight), 0);
      const autoMocks = p.mocks.filter((m) => !locked.has(m.id));
      if (!autoMocks.length)
        return { ...p, mocks: p.mocks.map((m) => (m.id === id ? { ...m, weight: num } : m)) };
      const remaining = Math.max(0, 100 - lockedSum);
      const base = Math.floor(remaining / autoMocks.length);
      const r = remaining - base * autoMocks.length;
      let idx = 0;
      return {
        ...p,
        mocks: p.mocks.map((m) => {
          if (m.id === id) return { ...m, weight: num };
          if (locked.has(m.id)) return m;
          return { ...m, weight: base + (idx++ < r ? 1 : 0) };
        }),
      };
    });
  }, []);

  /* -- Drag & drop -- */
  const handleDragStart = useCallback((i) => {
    dragIndexRef.current = i;
    forceRender((n) => n + 1);
  }, []);
  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    forceRender((n) => n + 1);
  }, []);
  const handleDragOver = useCallback((e, i) => {
    e.preventDefault();
    const prev = dragIndexRef.current;
    if (prev === null || prev === i) return;
    setForm((f) => {
      const mocks = [...f.mocks];
      const [moved] = mocks.splice(prev, 1);
      mocks.splice(i, 0, moved);
      return { ...f, mocks };
    });
    dragIndexRef.current = i;
  }, []);

  /* -- Derived values -- */
  const totalWeight = useMemo(() => form.mocks.reduce((s, m) => s + m.weight, 0), [form.mocks]);
  const totalDuration = useMemo(
    () => form.mocks.reduce((s, m) => s + (m.durationMin || parseDurationMin(m.duration)), 0),
    [form.mocks]
  );

  const stepValidity = useMemo(
    () => ({
      0: !!(form.title.trim() && form.department && form.jobType && form.seniority),
      1: form.mocks.length > 0 && totalWeight === 100,
      2: true,
      3: true,
    }),
    [form.title, form.department, form.jobType, form.seniority, form.mocks.length, totalWeight]
  );

  const canNext = stepValidity[activeStep];

  const goNext = useCallback(
    () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1)),
    [STEPS.length]
  );
  const goBack = useCallback(() => setActiveStep((s) => Math.max(s - 1, 0)), []);

  const statusPreview = useMemo(() => {
    const lines = [];
    const now = new Date();
    const start = form.startDate ? new Date(form.startDate) : null;
    const end = form.endDate ? new Date(form.endDate) : null;
    if (!start || start <= now) lines.push({ color: 'green', text: 'Will be Active immediately' });
    else
      lines.push({
        color: 'yellow',
        text: `Will be Scheduled until ${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      });
    if (end)
      lines.push({
        color: 'red',
        text: `Will Auto-close on ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      });
    if (form.maxCandidates)
      lines.push({
        color: 'red',
        text: `Will Auto-close after ${form.maxCandidates} applications`,
      });
    return lines;
  }, [form.startDate, form.endDate, form.maxCandidates]);

  const departmentOptions = useMemo(() => {
    if (!form.department) return DEPARTMENT_OPTIONS;
    return DEPARTMENT_OPTIONS.some((o) => o.value === form.department)
      ? DEPARTMENT_OPTIONS
      : [
          ...DEPARTMENT_OPTIONS,
          {
            value: form.department,
            label: form.department.charAt(0).toUpperCase() + form.department.slice(1),
          },
        ];
  }, [form.department]);

  const enabledEmailCount = useMemo(
    () => EMAIL_TRIGGERS.filter((t) => form.emails[t.id]).length,
    [form.emails]
  );

  /* -- Render steps -- */
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepJobInfo
            form={form}
            updateField={updateField}
            departmentOptions={departmentOptions}
            addSkill={addSkill}
            removeSkill={removeSkill}
          />
        );
      case 1:
        return (
          <StepMocks
            mocks={form.mocks}
            addMock={addMock}
            removeMock={removeMock}
            updateWeight={updateWeight}
            totalWeight={totalWeight}
            totalDuration={totalDuration}
            showLibrary={showMockLibrary}
            setShowLibrary={setShowMockLibrary}
            librarySearch={librarySearch}
            setLibrarySearch={setLibrarySearch}
            dragIndex={dragIndexRef.current}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            isLive={isLive}
          />
        );
      case 2:
        return (
          <StepScheduling
            form={form}
            updateField={updateField}
            updateEmail={updateEmail}
            statusPreview={statusPreview}
          />
        );
      case 3:
        return (
          <StepReview
            form={form}
            totalWeight={totalWeight}
            totalDuration={totalDuration}
            statusPreview={statusPreview}
            enabledEmailCount={enabledEmailCount}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-job-page">
      <div className="create-job">
        {/* Stepper */}
        <div className="create-job__stepper">
          <Stepper
            steps={STEPS}
            activeStep={activeStep}
            onStepClick={setActiveStep}
            stepValidity={stepValidity}
          />
        </div>

        {/* Edit context banner */}
        {isEdit && status && status !== 'draft' && (
          <EditBanner status={status} candidateCount={candidateCount} />
        )}

        {/* Step body */}
        <div className="create-job__body" key={activeStep}>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="create-job__footer">
          <div className="create-job__footer-left">
            {activeStep > 0 && (
              <Button variant="ghost" iconLeft={<ArrowLeft size={16} />} onClick={goBack}>
                Back
              </Button>
            )}
          </div>

          <div className="create-job__footer-right">
            {activeStep < STEPS.length - 1 ? (
              <Button
                variant="primary"
                iconRight={<ArrowRight size={16} />}
                onClick={goNext}
                disabled={!canNext}
              >
                Continue
              </Button>
            ) : isEdit ? (
              <EditFooterActions
                status={status}
                onSaveChanges={() => onSaveChanges?.(form)}
                onStatusChange={onStatusChange}
              />
            ) : (
              <>
                <Button
                  variant="ghost"
                  iconLeft={<Save size={16} />}
                  onClick={() => onSaveDraft?.(form)}
                >
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  iconLeft={<Rocket size={16} />}
                  onClick={() => onPublish?.(form)}
                >
                  Publish Job
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

/* -------------------------------------------------
   Edit footer actions — depends on current status
   ------------------------------------------------- */
function EditFooterActions({ status, onSaveChanges, onStatusChange }) {
  switch (status) {
    case 'active':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<PauseCircle size={16} />}
            onClick={() => onStatusChange?.('paused')}
          >
            Pause Job
          </Button>
          <Button
            variant="danger"
            iconLeft={<XCircle size={16} />}
            onClick={() => onStatusChange?.('closed')}
          >
            Close Job
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    case 'scheduled':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<XCircle size={16} />}
            onClick={() => onStatusChange?.('draft')}
          >
            Unpublish
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    case 'closed':
      return (
        <>
          <Button
            variant="ghost"
            iconLeft={<RefreshCw size={16} />}
            onClick={() => onStatusChange?.('active')}
          >
            Reopen Job
          </Button>
          <Button variant="primary" iconLeft={<CheckCircle size={16} />} onClick={onSaveChanges}>
            Save Changes
          </Button>
        </>
      );
    default: // draft
      return (
        <>
          <Button variant="ghost" iconLeft={<Save size={16} />} onClick={onSaveChanges}>
            Save Draft
          </Button>
          <Button
            variant="primary"
            iconLeft={<Rocket size={16} />}
            onClick={() => onStatusChange?.('active')}
          >
            Publish Job
          </Button>
        </>
      );
  }
}

/* -------------------------------------------------
   STEP 1 — Job Info
   ------------------------------------------------- */
function StepJobInfo({ form, updateField, departmentOptions, addSkill, removeSkill }) {
  return (
    <>
      <section className="create-job__section">
        <SectionTitle variant="inline" description="Enter the core details for this job posting">
          Basic Information
        </SectionTitle>
        <TextInput
          label="Job Title"
          placeholder="e.g. Senior Software Engineer"
          required
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
        />
        <div className="create-job__row create-job__row--3">
          <DropdownInput
            label="Department"
            placeholder="Select department"
            required
            options={departmentOptions}
            value={form.department}
            onChange={(v) => updateField('department', v)}
          />
          <DropdownInput
            label="Job Type"
            placeholder="Select type"
            required
            options={JOB_TYPE_OPTIONS}
            value={form.jobType}
            onChange={(v) => updateField('jobType', v)}
          />
          <DropdownInput
            label="Seniority Level"
            placeholder="Select level"
            required
            options={SENIORITY_OPTIONS}
            value={form.seniority}
            onChange={(v) => updateField('seniority', v)}
          />
        </div>
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Add the skills and technologies candidates should have"
        >
          Skills & Requirements
        </SectionTitle>
        <Tags
          tags={form.skills}
          variant="editable"
          showTitle={false}
          onAdd={addSkill}
          onRemove={removeSkill}
        />
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Describe the role, responsibilities, and expectations"
        >
          Job Description
        </SectionTitle>
        <Textarea
          label="Description"
          showLabel={false}
          placeholder="Describe the role, responsibilities, and what a typical day looks like..."
          rows={5}
          maxLength={2000}
          showCounter
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </section>

      <section className="create-job__section">
        <SectionTitle variant="inline" description="Where will this role be based?">
          Location
        </SectionTitle>
        <div className="create-job__row create-job__row--2">
          <DropdownInput
            label="Work Arrangement"
            placeholder="Select arrangement"
            options={LOCATION_TYPE_OPTIONS}
            value={form.locationType}
            onChange={(v) => updateField('locationType', v)}
          />
          <TextInput
            label="City / Country"
            placeholder="e.g. San Francisco, CA"
            value={form.location}
            onChange={(e) => updateField('location', e.target.value)}
          />
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------
   STEP 2 — Mock Interviews
   ------------------------------------------------- */
function StepMocks({
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

/* -------------------------------------------------
   STEP 3 — Email & Scheduling
   ------------------------------------------------- */
function StepScheduling({ form, updateField, updateEmail, statusPreview }) {
  const today = new Date().toISOString().split('T')[0];
  const handleStartDate = (v) => {
    updateField('startDate', v);
    if (form.endDate && v > form.endDate) updateField('endDate', '');
  };

  return (
    <>
      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Choose which automated emails to send to candidates"
        >
          Email Notifications
        </SectionTitle>
        <div className="create-job__mock-list">
          {EMAIL_TRIGGERS.map((t) => (
            <div key={t.id} className="create-job__trigger">
              <div className="create-job__trigger-info">
                <span className="create-job__trigger-title">{t.title}</span>
                <span className="create-job__trigger-desc">{t.desc}</span>
              </div>
              <Toggle
                checked={form.emails[t.id]}
                onChange={(checked) => updateEmail(t.id, checked)}
              />
            </div>
          ))}
        </div>
      </section>

      <section className="create-job__section">
        <SectionTitle
          variant="inline"
          description="Set the application window and candidate limits"
        >
          Scheduling
        </SectionTitle>
        <div className="create-job__row create-job__row--3">
          <TextInput
            label="Start Date"
            type="date"
            min={today}
            value={form.startDate}
            onChange={(e) => handleStartDate(e.target.value)}
            hint="Leave blank to start immediately"
          />
          <TextInput
            label="End Date"
            type="date"
            min={form.startDate || today}
            value={form.endDate}
            onChange={(e) => updateField('endDate', e.target.value)}
            hint="Leave blank for no end date"
          />
          <TextInput
            label="Max Candidates"
            type="number"
            min="1"
            placeholder="e.g. 200"
            value={form.maxCandidates}
            onChange={(e) => updateField('maxCandidates', e.target.value)}
            hint="Limit applications accepted"
          />
        </div>
        <div className="create-job__status-preview">
          <span className="create-job__status-preview-title">Status Preview</span>
          {statusPreview.map((line, i) => (
            <div key={i} className="create-job__status-row">
              <span className={`create-job__status-dot create-job__status-dot--${line.color}`} />
              <span>{line.text}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

/* -------------------------------------------------
   STEP 4 — Review & Publish / Save
   ------------------------------------------------- */
function StepReview({ form, totalWeight, totalDuration, statusPreview, enabledEmailCount }) {
  const deptLabel =
    DEPARTMENT_OPTIONS.find((o) => o.value === form.department)?.label || form.department || '—';
  const typeLabel =
    JOB_TYPE_OPTIONS.find((o) => o.value === form.jobType)?.label || form.jobType || '—';
  const seniorityLabel =
    SENIORITY_OPTIONS.find((o) => o.value === form.seniority)?.label || form.seniority || '—';
  const locLabel =
    LOCATION_TYPE_OPTIONS.find((o) => o.value === form.locationType)?.label ||
    form.locationType ||
    '—';

  return (
    <>
      {/* Job Info */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Job Information</SectionTitle>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Job Title</span>
            <span className="create-job__review-value">{form.title || '—'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Department</span>
            <span className="create-job__review-value">{deptLabel}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Job Type</span>
            <span className="create-job__review-value">{typeLabel}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Seniority</span>
            <span className="create-job__review-value">{seniorityLabel}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Location</span>
            <span className="create-job__review-value">
              {locLabel}
              {form.location ? ` — ${form.location}` : ''}
            </span>
          </div>
        </div>
        {form.skills.length > 0 && (
          <div className="create-job__review-group">
            <span className="create-job__review-label">Skills</span>
            <div className="create-job__review-tags">
              {form.skills.map((s) => (
                <span key={s} className="create-job__review-tag">
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
        {form.description && (
          <div className="create-job__review-group">
            <span className="create-job__review-label">Description</span>
            <span className="create-job__review-value">{form.description}</span>
          </div>
        )}
      </section>

      {/* Scoring Formula */}
      {form.mocks.length > 0 && (
        <section className="create-job__section">
          <SectionTitle variant="inline">Scoring Formula</SectionTitle>
          <div className="create-job__scoring">
            {form.mocks.map((m) => (
              <div key={m.id} className="create-job__scoring-row">
                <span className="create-job__scoring-name">{m.name}</span>
                <span className="create-job__scoring-weight">{m.weight}%</span>
              </div>
            ))}
          </div>
          <div className="create-job__weight-bar">
            <span className="create-job__weight-label">Total Weight</span>
            <span
              className={`create-job__weight-value ${totalWeight === 100 ? 'create-job__weight-value--exact' : totalWeight > 100 ? 'create-job__weight-value--over' : ''}`}
            >
              {totalWeight}%
            </span>
          </div>
        </section>
      )}

      {/* Pipeline */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Estimated Hiring Pipeline</SectionTitle>
        <div className="create-job__pipeline">
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{form.mocks.length}</span>
            <span className="create-job__pipeline-label">Interview Rounds</span>
          </div>
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{totalDuration}</span>
            <span className="create-job__pipeline-label">Minutes Total</span>
          </div>
          <div className="create-job__pipeline-item">
            <span className="create-job__pipeline-number">{enabledEmailCount}</span>
            <span className="create-job__pipeline-label">Email Triggers</span>
          </div>
        </div>
      </section>

      {/* Scheduling & Emails */}
      <section className="create-job__section">
        <SectionTitle variant="inline">Scheduling & Emails</SectionTitle>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Start Date</span>
            <span className="create-job__review-value">{form.startDate || 'Immediately'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">End Date</span>
            <span className="create-job__review-value">{form.endDate || 'No end date'}</span>
          </div>
        </div>
        <div className="create-job__review-row">
          <div className="create-job__review-group">
            <span className="create-job__review-label">Max Candidates</span>
            <span className="create-job__review-value">{form.maxCandidates || 'Unlimited'}</span>
          </div>
          <div className="create-job__review-group">
            <span className="create-job__review-label">Status</span>
            <div>
              {statusPreview.map((line, i) => (
                <div key={i} className="create-job__status-row">
                  <span
                    className={`create-job__status-dot create-job__status-dot--${line.color}`}
                  />
                  <span>{line.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="create-job__review-group">
          <span className="create-job__review-label">Email Notifications</span>
          <div className="create-job__review-tags">
            {EMAIL_TRIGGERS.filter((t) => form.emails[t.id]).map((t) => (
              <span key={t.id} className="create-job__review-tag">
                <Send size={12} style={{ marginRight: 4 }} />
                {t.title}
              </span>
            ))}
            {EMAIL_TRIGGERS.every((t) => !form.emails[t.id]) && (
              <span className="create-job__review-value">None enabled</span>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
