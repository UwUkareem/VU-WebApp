import { useState, useCallback, useMemo, useRef, memo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Rocket,
  Save,
  CheckCircle,
  Clock,
  Info,
} from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Button } from '../../../components/ui/Button';
import { Tags } from '../../../components/ui/Tags';
import { SectionTitle } from '../../../components/ui/SectionTitle';
import { TextInput, DropdownInput, Textarea } from '../../../components/ui/Input';
import { QuestionCard } from '../../../components/ui/Cards';
import {
  MOCK_STEPS_CREATE as STEPS_CREATE,
  MOCK_STEPS_EDIT as STEPS_EDIT,
  MOCK_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  INITIAL_MOCK_FORM,
} from '../../../data/config';
import './MockConfigForm.css';

/* -------------------------------------------------
   MockConfigForm  (3-step)
   Step 0 � Basic Info & Skills
   Step 1 � Evaluation (criteria + questions, shared 100% pool)
   Step 2 � Review & Publish / Save

   Props:
     mode         � 'create' | 'edit'
     initialData  � pre-filled form (edit)
     isActive     � true when mock is used in active job (limits editing)
     onPublish    � (form) => void
     onSaveDraft  � (form) => void  (create only)
     onSaveChanges � (form) => void (edit only)
   ------------------------------------------------- */

export const MockConfigForm = memo(function MockConfigForm({
  mode = 'create',
  initialData,
  isActive = false,
  onPublish,
  onSaveChanges,
}) {
  const isEdit = mode === 'edit';
  const STEPS = isEdit ? STEPS_EDIT : STEPS_CREATE;

  const [activeStep, setActiveStep] = useState(0);
  const [form, setForm] = useState(initialData ?? INITIAL_MOCK_FORM);

  /** Track manually-edited weight ids (criteria + questions share one set) */
  const manualWeightIds = useRef(new Set());

  /* -- Field helpers -- */
  const updateField = useCallback((field, value) => setForm((p) => ({ ...p, [field]: value })), []);

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
    (tag) => {
      if (isActive) return;
      setForm((p) => ({ ...p, skills: p.skills.filter((s) => s !== tag) }));
    },
    [isActive]
  );

  /* -- Shared weight redistribution (same logic as Jobs) -- */
  const redistribute = useCallback((criteria, questions, targetId, targetWeight) => {
    const locked = manualWeightIds.current;
    const all = [...criteria, ...questions];
    const lockedSum =
      all
        .filter((item) => locked.has(item.id) && item.id !== targetId)
        .reduce((s, item) => s + (parseInt(item.weight, 10) || 0), 0) +
      (targetId ? targetWeight : 0);

    const autoItems = all.filter((item) => !locked.has(item.id) && item.id !== targetId);
    if (!autoItems.length) {
      if (targetId) {
        return {
          criteria: criteria.map((c) => (c.id === targetId ? { ...c, weight: targetWeight } : c)),
          questions: questions.map((q) => (q.id === targetId ? { ...q, weight: targetWeight } : q)),
        };
      }
      return { criteria, questions };
    }

    const remaining = Math.max(0, 100 - lockedSum);
    const base = Math.floor(remaining / autoItems.length);
    const rem = remaining - base * autoItems.length;
    const autoIds = new Set(autoItems.map((i) => i.id));
    let idx = 0;

    const update = (list) =>
      list.map((item) => {
        if (item.id === targetId) return { ...item, weight: targetWeight };
        if (autoIds.has(item.id)) return { ...item, weight: base + (idx++ < rem ? 1 : 0) };
        return item;
      });

    return { criteria: update(criteria), questions: update(questions) };
  }, []);

  /* -- Criteria -- */
  const addCriterion = useCallback(() => {
    manualWeightIds.current.clear();
    setForm((p) => {
      const newCriteria = [...p.criteria, { id: `c${Date.now()}`, name: '', weight: 0 }];
      const { criteria, questions } = redistribute(newCriteria, p.questions, null, 0);
      return { ...p, criteria, questions };
    });
  }, [redistribute]);

  const removeCriterion = useCallback(
    (id) => {
      if (isActive) return;
      manualWeightIds.current.delete(id);
      setForm((p) => {
        const newCriteria = p.criteria.filter((c) => c.id !== id);
        if (!newCriteria.length && !p.questions.length)
          return { ...p, criteria: [], questions: [] };

        const locked = manualWeightIds.current;
        const autoAll = [...newCriteria, ...p.questions].filter((i) => !locked.has(i.id));
        if (!autoAll.length) {
          manualWeightIds.current.clear();
          const all = [...newCriteria, ...p.questions];
          const b = Math.floor(100 / all.length);
          const r = 100 - b * all.length;
          let idx = 0;
          return {
            ...p,
            criteria: newCriteria.map((c) => ({ ...c, weight: b + (idx++ < r ? 1 : 0) })),
            questions: p.questions.map((q) => ({ ...q, weight: b + (idx++ < r ? 1 : 0) })),
          };
        }

        const { criteria, questions } = redistribute(newCriteria, p.questions, null, 0);
        return { ...p, criteria, questions };
      });
    },
    [isActive, redistribute]
  );

  const updateCriterion = useCallback(
    (id, field, value) => {
      if (field === 'weight') {
        const num = Math.max(0, Math.min(100, parseInt(value, 10) || 0));
        manualWeightIds.current.add(id);
        setForm((p) => {
          const updated = p.criteria.map((c) => (c.id === id ? { ...c, weight: num } : c));
          const { criteria, questions } = redistribute(updated, p.questions, id, num);
          return { ...p, criteria, questions };
        });
      } else {
        setForm((p) => ({
          ...p,
          criteria: p.criteria.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
        }));
      }
    },
    [redistribute]
  );

  /* -- Questions -- */
  const addQuestion = useCallback(() => {
    manualWeightIds.current.clear();
    setForm((p) => {
      const newQuestions = [
        ...p.questions,
        {
          id: `q${Date.now()}`,
          title: '',
          description: '',
          difficulty: '',
          estimatedTime: '',
          weight: 0,
        },
      ];
      const { criteria, questions } = redistribute(p.criteria, newQuestions, null, 0);
      return { ...p, criteria, questions };
    });
  }, [redistribute]);

  const removeQuestion = useCallback(
    (id) => {
      if (isActive) return;
      manualWeightIds.current.delete(id);
      setForm((p) => {
        const newQuestions = p.questions.filter((q) => q.id !== id);
        if (!newQuestions.length && !p.criteria.length)
          return { ...p, criteria: [], questions: [] };

        const locked = manualWeightIds.current;
        const autoAll = [...p.criteria, ...newQuestions].filter((i) => !locked.has(i.id));
        if (!autoAll.length) {
          manualWeightIds.current.clear();
          const all = [...p.criteria, ...newQuestions];
          const b = Math.floor(100 / all.length);
          const r = 100 - b * all.length;
          let idx = 0;
          return {
            ...p,
            criteria: p.criteria.map((c) => ({ ...c, weight: b + (idx++ < r ? 1 : 0) })),
            questions: newQuestions.map((q) => ({ ...q, weight: b + (idx++ < r ? 1 : 0) })),
          };
        }

        const { criteria, questions } = redistribute(p.criteria, newQuestions, null, 0);
        return { ...p, criteria, questions };
      });
    },
    [isActive, redistribute]
  );

  const updateQuestion = useCallback((id, data) => {
    setForm((p) => ({
      ...p,
      questions: p.questions.map((q) => (q.id === id ? { ...q, ...data } : q)),
    }));
  }, []);

  const updateQuestionWeight = useCallback(
    (id, weight) => {
      const num = Math.max(0, Math.min(100, parseInt(weight, 10) || 0));
      manualWeightIds.current.add(id);
      setForm((p) => {
        const updated = p.questions.map((q) => (q.id === id ? { ...q, weight: num } : q));
        const { criteria, questions } = redistribute(p.criteria, updated, id, num);
        return { ...p, criteria, questions };
      });
    },
    [redistribute]
  );

  /* -- Derived values -- */
  const totalWeight = useMemo(
    () =>
      form.criteria.reduce((s, c) => s + (parseInt(c.weight, 10) || 0), 0) +
      form.questions.reduce((s, q) => s + (parseInt(q.weight, 10) || 0), 0),
    [form.criteria, form.questions]
  );

  const totalItems = form.criteria.length + form.questions.length;

  const stepValidity = useMemo(
    () => ({
      0: !!(
        form.title.trim() &&
        form.type &&
        form.difficulty &&
        form.durationMin &&
        form.skills.length > 0
      ),
      1: totalItems > 0 && totalWeight === 100,
      2: true,
    }),
    [
      form.title,
      form.type,
      form.difficulty,
      form.durationMin,
      form.skills.length,
      totalItems,
      totalWeight,
    ]
  );

  const canNext = stepValidity[activeStep];
  const goNext = useCallback(
    () => setActiveStep((s) => Math.min(s + 1, STEPS.length - 1)),
    [STEPS.length]
  );
  const goBack = useCallback(() => setActiveStep((s) => Math.max(s - 1, 0)), []);

  /* -- Render steps -- */
  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <StepBasicInfoSkills
            form={form}
            updateField={updateField}
            addSkill={addSkill}
            removeSkill={removeSkill}
            isActive={isActive}
          />
        );
      case 1:
        return (
          <StepEvaluation
            form={form}
            isActive={isActive}
            addCriterion={addCriterion}
            removeCriterion={removeCriterion}
            updateCriterion={updateCriterion}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            updateQuestion={updateQuestion}
            updateQuestionWeight={updateQuestionWeight}
            totalWeight={totalWeight}
          />
        );
      case 2:
        return <StepReview form={form} totalWeight={totalWeight} />;
      default:
        return null;
    }
  };

  return (
    <div className="create-mock-page">
      <div className="create-mock">
        {/* Stepper */}
        <div className="create-mock__stepper">
          <Stepper
            steps={STEPS}
            activeStep={activeStep}
            onStepClick={setActiveStep}
            stepValidity={stepValidity}
          />
        </div>

        {/* Active banner */}
        {isActive && isEdit && (
          <div className="create-mock__active-banner">
            <Info size={16} />
            <span>
              This mock is used in active jobs. Some fields are locked to protect ongoing
              evaluations.
            </span>
          </div>
        )}
        {/* Step body */}
        <div className="create-mock__body" key={activeStep}>
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="create-mock__footer">
          <div className="create-mock__footer-left">
            {activeStep > 0 && (
              <Button variant="ghost" iconLeft={<ArrowLeft size={16} />} onClick={goBack}>
                Back
              </Button>
            )}
          </div>
          <div className="create-mock__footer-right">
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
              <Button
                variant="primary"
                iconLeft={<CheckCircle size={16} />}
                onClick={() => onSaveChanges?.(form)}
              >
                Save Changes
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  iconLeft={<Rocket size={16} />}
                  onClick={() => onPublish?.(form)}
                >
                  Create Mock
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
   STEP 1 � Basic Info & Skills (merged)
   ------------------------------------------------- */
function StepBasicInfoSkills({ form, updateField, addSkill, removeSkill, isActive }) {
  return (
    <>
      <section className="create-mock__section">
        <SectionTitle
          variant="inline"
          description="Define the core details for this evaluation module"
        >
          Basic Information
        </SectionTitle>
        <TextInput
          label="Mock Name"
          placeholder="e.g. System Design Interview"
          required
          value={form.title}
          onChange={(e) => updateField('title', e.target.value)}
          disabled={isActive}
        />
        <div className="create-mock__row create-mock__row--3">
          <DropdownInput
            label="Type"
            placeholder="Select type"
            required
            options={MOCK_TYPE_OPTIONS}
            value={form.type}
            onChange={(v) => updateField('type', v)}
            disabled={isActive}
          />
          <DropdownInput
            label="Difficulty"
            placeholder="Select difficulty"
            required
            options={DIFFICULTY_OPTIONS}
            value={form.difficulty}
            onChange={(v) => updateField('difficulty', v)}
            disabled={isActive}
          />
          <DropdownInput
            label="Estimated Duration"
            placeholder="Select duration"
            required
            options={DURATION_OPTIONS}
            value={form.durationMin}
            onChange={(v) => updateField('durationMin', v)}
            disabled={isActive}
          />
        </div>
        <Textarea
          label="Short Description"
          placeholder="Briefly describe what this mock evaluates..."
          rows={3}
          maxLength={500}
          showCounter
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
        />
      </section>

      <section className="create-mock__section">
        <SectionTitle
          variant="inline"
          description="Add skills this mock evaluates. Used for CV analysis, skill alignment scoring, and search/filter."
        >
          Skills Covered
        </SectionTitle>
        <Tags
          tags={form.skills}
          variant="editable"
          showTitle={false}
          onAdd={addSkill}
          onRemove={isActive ? undefined : removeSkill}
        />
        {form.skills.length === 0 && (
          <p className="create-mock__hint">
            Add at least one skill to continue. Type and press Enter.
          </p>
        )}
      </section>
    </>
  );
}

/* -------------------------------------------------
   STEP 2 � Evaluation (criteria + questions, shared pool)
   ------------------------------------------------- */
function StepEvaluation({
  form,
  isActive,
  addCriterion,
  removeCriterion,
  updateCriterion,
  addQuestion,
  removeQuestion,
  updateQuestion,
  updateQuestionWeight,
  totalWeight,
}) {
  const weightClass =
    totalWeight === 100
      ? 'create-mock__weight-value--exact'
      : totalWeight > 100
        ? 'create-mock__weight-value--over'
        : '';

  const totalItems = form.criteria.length + form.questions.length;

  return (
    <>
      <section className="create-mock__section">
        <SectionTitle
          variant="inline"
          description="All criteria and questions share a single 100% weight pool. Weights auto-redistribute when items are added."
        >
          Evaluation Structure
        </SectionTitle>

        {totalItems > 0 && (
          <div className="create-mock__weight-bar">
            <span className="create-mock__weight-label">Total Weight (Criteria + Questions)</span>
            <span className={`create-mock__weight-value ${weightClass}`}>{totalWeight}%</span>
          </div>
        )}
      </section>

      {/* Criteria section */}
      <section className="create-mock__section">
        <SectionTitle variant="inline" description="Define scoring criteria with weights">
          Scoring Criteria
        </SectionTitle>

        {form.criteria.length > 0 && (
          <div className="create-mock__criteria-list">
            {form.criteria.map((criterion) => (
              <div key={criterion.id} className="create-mock__criteria-item">
                <div className="create-mock__criteria-name">
                  <TextInput
                    showLabel={false}
                    showHint={false}
                    placeholder="e.g. Problem Solving"
                    value={criterion.name}
                    onChange={(e) => updateCriterion(criterion.id, 'name', e.target.value)}
                  />
                </div>
                <div className="create-mock__criteria-weight">
                  <TextInput
                    showLabel={false}
                    showHint={false}
                    value={String(criterion.weight)}
                    onChange={(e) => updateCriterion(criterion.id, 'weight', e.target.value)}
                    placeholder="%"
                  />
                </div>
                {!isActive && (
                  <button
                    type="button"
                    className="create-mock__criteria-remove"
                    onClick={() => removeCriterion(criterion.id)}
                    aria-label={`Remove ${criterion.name}`}
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <Button variant="dashed" iconLeft={<Plus size={16} />} onClick={addCriterion}>
          Add Criterion
        </Button>
      </section>

      {/* Questions section */}
      <section className="create-mock__section">
        <SectionTitle variant="inline" description="Add individual questions with score weights">
          Custom Questions
        </SectionTitle>

        {form.questions.length > 0 && (
          <div className="create-mock__questions-list">
            {form.questions.map((question, idx) => (
              <div key={question.id} className="create-mock__question-wrapper">
                <QuestionCard
                  questionNumber={idx + 1}
                  variant="edit"
                  defaultTitle={question.title}
                  defaultDescription={question.description}
                  defaultDifficulty={question.difficulty}
                  defaultEstimatedTime={question.estimatedTime}
                  defaultExpanded={!question.title}
                  onChange={(data) => updateQuestion(question.id, data)}
                  onRemove={isActive ? undefined : () => removeQuestion(question.id)}
                />
                <div className="create-mock__question-weight">
                  <span className="create-mock__question-weight-label">Weight</span>
                  <div className="create-mock__question-weight-input">
                    <TextInput
                      showLabel={false}
                      showHint={false}
                      value={String(question.weight)}
                      onChange={(e) => updateQuestionWeight(question.id, e.target.value)}
                      placeholder="%"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button variant="dashed" iconLeft={<Plus size={16} />} onClick={addQuestion}>
          Add Question
        </Button>
      </section>
    </>
  );
}

/* -------------------------------------------------
   STEP 3 � Review & Publish / Save
   ------------------------------------------------- */
function StepReview({ form, totalWeight }) {
  const typeLabel =
    MOCK_TYPE_OPTIONS.find((o) => o.value === form.type)?.label || form.type || '\u2014';
  const diffLabel =
    DIFFICULTY_OPTIONS.find((o) => o.value === form.difficulty)?.label ||
    form.difficulty ||
    '\u2014';
  const durLabel = form.durationMin ? `${form.durationMin} min` : '\u2014';

  const weightClass =
    totalWeight === 100
      ? 'create-mock__weight-value--exact'
      : totalWeight > 100
        ? 'create-mock__weight-value--over'
        : '';

  return (
    <>
      {/* Mock Info */}
      <section className="create-mock__section">
        <SectionTitle variant="inline">Mock Information</SectionTitle>
        <div className="create-mock__review-row">
          <div className="create-mock__review-group">
            <span className="create-mock__review-label">Mock Name</span>
            <span className="create-mock__review-value">{form.title || '\u2014'}</span>
          </div>
          <div className="create-mock__review-group">
            <span className="create-mock__review-label">Type</span>
            <span className="create-mock__review-value">{typeLabel}</span>
          </div>
        </div>
        <div className="create-mock__review-row">
          <div className="create-mock__review-group">
            <span className="create-mock__review-label">Difficulty</span>
            <span className="create-mock__review-value">{diffLabel}</span>
          </div>
          <div className="create-mock__review-group">
            <span className="create-mock__review-label">Duration</span>
            <span className="create-mock__review-value">{durLabel}</span>
          </div>
        </div>
        {form.description && (
          <div className="create-mock__review-group">
            <span className="create-mock__review-label">Description</span>
            <span className="create-mock__review-value">{form.description}</span>
          </div>
        )}
      </section>

      {/* Skills */}
      {form.skills.length > 0 && (
        <section className="create-mock__section">
          <SectionTitle variant="inline">Skills Covered</SectionTitle>
          <div className="create-mock__review-tags">
            {form.skills.map((s) => (
              <span key={s} className="create-mock__review-tag">
                {s}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Evaluation */}
      <section className="create-mock__section">
        <SectionTitle variant="inline">Evaluation Structure</SectionTitle>

        {form.criteria.length > 0 && (
          <>
            <span className="create-mock__review-sublabel">Criteria</span>
            <div className="create-mock__scoring">
              {form.criteria.map((c) => (
                <div key={c.id} className="create-mock__scoring-row">
                  <span className="create-mock__scoring-name">{c.name || '(unnamed)'}</span>
                  <span className="create-mock__scoring-weight">{c.weight}%</span>
                </div>
              ))}
            </div>
          </>
        )}

        {form.questions.length > 0 && (
          <>
            <span className="create-mock__review-sublabel">Questions</span>
            <div className="create-mock__scoring">
              {form.questions.map((q, idx) => (
                <div key={q.id} className="create-mock__scoring-row">
                  <span className="create-mock__scoring-name">
                    Q{idx + 1}: {q.title || '(untitled)'}
                  </span>
                  <span className="create-mock__scoring-weight">{q.weight}%</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div className="create-mock__weight-bar">
          <span className="create-mock__weight-label">Total Weight</span>
          <span className={`create-mock__weight-value ${weightClass}`}>{totalWeight}%</span>
        </div>
      </section>

      {/* Summary */}
      <section className="create-mock__section">
        <SectionTitle variant="inline">Summary</SectionTitle>
        <div className="create-mock__pipeline">
          <div className="create-mock__pipeline-item">
            <span className="create-mock__pipeline-number">{form.skills.length}</span>
            <span className="create-mock__pipeline-label">Skills</span>
          </div>
          <div className="create-mock__pipeline-item">
            <span className="create-mock__pipeline-number">{form.criteria.length}</span>
            <span className="create-mock__pipeline-label">Criteria</span>
          </div>
          <div className="create-mock__pipeline-item">
            <span className="create-mock__pipeline-number">{form.questions.length}</span>
            <span className="create-mock__pipeline-label">Questions</span>
          </div>
          <div className="create-mock__pipeline-item">
            <span className="create-mock__pipeline-number">
              <Clock size={16} /> {form.durationMin || 0}
            </span>
            <span className="create-mock__pipeline-label">Minutes</span>
          </div>
        </div>
      </section>
    </>
  );
}
