import { MockConfigForm } from '../MockConfigForm';
import { addMock } from '../../../../data/mocks';
import { MOCK_TYPE_OPTIONS, DIFFICULTY_OPTIONS } from '../../../../data/config';

/**
 * Convert the create-form shape into the shared-data mock shape.
 */
function formToMock(form) {
  const typeLabel =
    MOCK_TYPE_OPTIONS.find((o) => o.value === form.type)?.label || form.type || 'Technical';
  const diffLabel =
    DIFFICULTY_OPTIONS.find((o) => o.value === form.difficulty)?.label ||
    form.difficulty ||
    'Medium';
  const durationMin = parseInt(form.durationMin, 10) || 30;

  return {
    title: form.title,
    type: typeLabel,
    difficulty: diffLabel,
    duration: `${durationMin} min`,
    durationMin,
    description: form.description,
    skills: [...form.skills],
    criteria: form.criteria.map((c, i) => ({
      id: c.id || `c${i + 1}`,
      name: c.name,
      weight: parseInt(c.weight, 10) || 0,
    })),
    questions: form.questions.map((q, i) => ({
      id: q.id || `q${i + 1}`,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      estimatedTime: q.estimatedTime,
      weight: parseInt(q.weight, 10) || 0,
    })),
  };
}

/**
 * CreateMockConfig � thin wrapper that renders MockConfigForm in create mode.
 * On publish the mock is stored in the shared data file.
 * Status is derived (not set manually).
 */
export function CreateMockConfig({ onCreated }) {
  const handlePublish = (form) => {
    const mock = addMock(formToMock(form));
    console.log('[CreateMock] created:', mock);
    onCreated?.(mock.id);
  };

  return <MockConfigForm mode="create" onPublish={handlePublish} />;
}
