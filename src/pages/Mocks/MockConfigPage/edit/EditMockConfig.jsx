import { useMemo } from 'react';
import { MockConfigForm } from '../MockConfigForm';
import { getMockById, getMockStatus, updateMock } from '../../MockManagement/_shared/mockData';
import { MOCK_TYPE_OPTIONS, DIFFICULTY_OPTIONS } from '../_shared/mockConfigData';

/**
 * Convert a shared-data mock object into the form shape expected by MockConfigForm.
 */
function mockToForm(mock) {
  return {
    title: mock.title,
    type: mock.type.toLowerCase(),
    difficulty: mock.difficulty.toLowerCase(),
    durationMin: String(mock.durationMin),
    description: mock.description,
    skills: [...mock.skills],
    criteria: mock.criteria.map((c) => ({
      id: c.id,
      name: c.name,
      weight: c.weight,
    })),
    questions: mock.questions.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      difficulty: q.difficulty,
      estimatedTime: q.estimatedTime,
      weight: q.weight,
    })),
  };
}

/**
 * EditMockConfig � renders MockConfigForm in edit mode with pre-filled data.
 * Passes isActive to restrict editing when mock is used in active jobs.
 */
export function EditMockConfig({ mockId }) {
  const mock = getMockById(mockId);
  const formData = useMemo(() => (mock ? mockToForm(mock) : null), [mock]);
  const isActive = mock ? getMockStatus(mock.id) === 'active' : false;

  const handleSaveChanges = (form) => {
    if (!mock) return;
    const typeLabel =
      MOCK_TYPE_OPTIONS.find((o) => o.value === form.type)?.label || form.type || mock.type;
    const diffLabel =
      DIFFICULTY_OPTIONS.find((o) => o.value === form.difficulty)?.label ||
      form.difficulty ||
      mock.difficulty;
    const durationMin = parseInt(form.durationMin, 10) || mock.durationMin;

    updateMock(mock.id, {
      title: form.title,
      type: typeLabel,
      difficulty: diffLabel,
      duration: `${durationMin} min`,
      durationMin,
      description: form.description,
      skills: [...form.skills],
      criteria: form.criteria.map((c) => ({
        id: c.id,
        name: c.name,
        weight: parseInt(c.weight, 10) || 0,
      })),
      questions: form.questions.map((q) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        difficulty: q.difficulty,
        estimatedTime: q.estimatedTime,
        weight: parseInt(q.weight, 10) || 0,
      })),
    });
    console.log('[EditMock] saved:', form);
  };

  if (!formData) {
    return (
      <div style={{ padding: 'var(--padding-lg)', color: 'var(--text-tertiary)' }}>
        Mock not found.
      </div>
    );
  }

  return (
    <MockConfigForm
      mode="edit"
      initialData={formData}
      isActive={isActive}
      onSaveChanges={handleSaveChanges}
    />
  );
}
