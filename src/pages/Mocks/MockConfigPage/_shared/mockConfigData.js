/* -------------------------------------------------
   Static data shared between Create & Edit Mock flows
   ------------------------------------------------- */

export const STEPS_CREATE = [
  { label: 'Basic Info & Skills' },
  { label: 'Evaluation' },
  { label: 'Review & Publish' },
];

export const STEPS_EDIT = [
  { label: 'Basic Info & Skills' },
  { label: 'Evaluation' },
  { label: 'Review & Save' },
];

export const MOCK_TYPE_OPTIONS = [
  { value: 'technical', label: 'Technical' },
  { value: 'behavioral', label: 'Behavioral' },
  { value: 'analytical', label: 'Analytical' },
  { value: 'design', label: 'Design' },
];

export const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export const DURATION_OPTIONS = [
  { value: '15', label: '15 min' },
  { value: '20', label: '20 min' },
  { value: '25', label: '25 min' },
  { value: '30', label: '30 min' },
  { value: '35', label: '35 min' },
  { value: '40', label: '40 min' },
  { value: '45', label: '45 min' },
  { value: '50', label: '50 min' },
  { value: '60', label: '60 min' },
  { value: '90', label: '90 min' },
];

export const INITIAL_MOCK_FORM = {
  title: '',
  type: '',
  difficulty: '',
  durationMin: '',
  description: '',
  skills: [],
  criteria: [],
  questions: [],
};
