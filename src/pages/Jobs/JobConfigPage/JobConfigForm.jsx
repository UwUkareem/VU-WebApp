import { useState, useCallback, useMemo, useRef, memo } from 'react';
import { ArrowLeft, ArrowRight, Rocket, Save } from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Button } from '../../../components/ui/Button';
import { EditBanner } from './edit/EditBanner';
import { StepJobInfo, StepMocks, StepScheduling, StepReview, EditFooterActions } from './steps';
import {
  JOB_STEPS_CREATE as STEPS_CREATE,
  JOB_STEPS_EDIT as STEPS_EDIT,
  DEPARTMENT_OPTIONS,
  EMAIL_TRIGGERS,
  INITIAL_JOB_FORM as INITIAL_FORM,
  parseDurationMin,
} from '../../../data/config';
import { redistributeWeights } from '../../../utils';
import './JobConfigForm.css';

/* -------------------------------------------------
   JobConfigForm
   Props:
     mode          â€“ 'create' | 'edit'
     initialData   â€“ pre-filled form values (edit mode)
     status        â€“ 'draft' | 'scheduled' | 'active' | 'closed' (edit)
     candidateCount â€“ number of existing candidates (edit)
     onPublish     â€“ (form) => void
     onSaveDraft   â€“ (form) => void
     onSaveChanges â€“ (form) => void
     onStatusChange â€“ (newStatus) => void
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
  const [dragIndex, setDragIndex] = useState(null);

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
      if (isLive) return;
      manualWeightIds.current.delete(id);
      setForm((p) => {
        const filtered = p.mocks.filter((m) => m.id !== id);
        if (!filtered.length) return { ...p, mocks: [] };
        return { ...p, mocks: redistributeWeights(filtered, manualWeightIds.current) };
      });
    },
    [isLive]
  );

  const updateWeight = useCallback((id, weight) => {
    const num = Math.max(0, Math.min(100, parseInt(weight, 10) || 0));
    manualWeightIds.current.add(id);
    setForm((p) => ({
      ...p,
      mocks: redistributeWeights(p.mocks, manualWeightIds.current, id, num),
    }));
  }, []);

  /* -- Drag & drop -- */
  const handleDragStart = useCallback((i) => {
    dragIndexRef.current = i;
    setDragIndex(i);
  }, []);
  const handleDragEnd = useCallback(() => {
    dragIndexRef.current = null;
    setDragIndex(null);
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
    setDragIndex(i);
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
            dragIndex={dragIndex}
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
