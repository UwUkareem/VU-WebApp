import { Trash2, Plus } from 'lucide-react';
import { SectionTitle } from '../../../../components/ui/SectionTitle';
import { TextInput } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { QuestionCard } from '../../../../components/ui/Cards';

export function StepEvaluation({
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
