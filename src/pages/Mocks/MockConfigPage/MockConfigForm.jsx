import { useState, useCallback, useMemo, useRef, useEffect, memo } from 'react';
import { ArrowLeft, ArrowRight, Rocket, CheckCircle, Info } from 'lucide-react';
import { Stepper } from '../../../components/ui/Stepper';
import { Button } from '../../../components/ui/Button';
import { StepBasicInfoSkills, StepEvaluation, StepReview } from './steps';
import {
  MOCK_STEPS_CREATE as STEPS_CREATE,
  MOCK_STEPS_EDIT as STEPS_EDIT,
  INITIAL_MOCK_FORM,
} from '../../../api';
import { redistributeWeightsPair } from '../../../utils';
import './MockConfigForm.css';

/* -------------------------------------------------
   MockConfigForm  (3-step)
   Step 0 ï¿½ Basic Info & Skills
   Step 1 ï¿½ Evaluation (criteria + questions, shared 100% pool)
   Step 2 ï¿½ Review & Publish / Save

   Props:
     mode         ï¿½ 'create' | 'edit'
     initialData  ï¿½ pre-filled form (edit)
     isActive     ï¿½ true when mock is used in active job (limits editing)
     onPublish    ï¿½ (form) => void
     onSaveDraft  ï¿½ (form) => void  (create only)
     onSaveChanges ï¿½ (form) => void (edit only)
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
  const pageScrollRef = useRef(null);

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

  /* -- Shared weight redistribution -- */
  const redistribute = useCallback((criteria, questions, targetId, targetWeight) => {
    const { listA, listB } = redistributeWeightsPair(
      criteria,
      questions,
      manualWeightIds.current,
      targetId,
      targetWeight
    );
    return { criteria: listA, questions: listB };
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

  useEffect(() => {
    pageScrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeStep]);

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
    <div className="create-mock-page" ref={pageScrollRef}>
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

        {activeStep > 0 && (
          <div className="create-mock__mobile-back">
            <Button variant="ghost" iconLeft={<ArrowLeft size={16} />} onClick={goBack}>
              Back
            </Button>
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
