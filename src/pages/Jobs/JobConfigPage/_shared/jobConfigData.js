/* -------------------------------------------------
   Static data shared between Create & Edit flows
   ------------------------------------------------- */

export const STEPS_CREATE = [
  { label: 'Job Info' },
  { label: 'Add Mocks' },
  { label: 'Scheduling' },
  { label: 'Review & Publish' },
];

export const STEPS_EDIT = [
  { label: 'Job Info' },
  { label: 'Add Mocks' },
  { label: 'Scheduling' },
  { label: 'Review & Save' },
];

export const JOB_TYPE_OPTIONS = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'temporary', label: 'Temporary' },
];

export const SENIORITY_OPTIONS = [
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
  { value: 'manager', label: 'Manager' },
];

export const LOCATION_TYPE_OPTIONS = [
  { value: 'on-site', label: 'On-site' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' },
];

export const DEPARTMENT_OPTIONS = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'design', label: 'Design' },
  { value: 'product', label: 'Product' },
  { value: 'data', label: 'Data' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'hr', label: 'Human Resources' },
];

export const MOCK_LIBRARY = [
  {
    id: 'm1',
    name: 'System Design',
    type: 'Technical',
    difficulty: 'Hard',
    duration: '45 min',
    durationMin: 45,
    skills: ['Architecture', 'Scalability', 'Trade-offs'],
  },
  {
    id: 'm2',
    name: 'Coding Challenge',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '60 min',
    durationMin: 60,
    skills: ['DSA', 'Problem Solving', 'Complexity'],
  },
  {
    id: 'm3',
    name: 'Behavioral',
    type: 'Soft Skills',
    difficulty: 'Easy',
    duration: '30 min',
    durationMin: 30,
    skills: ['Communication', 'Teamwork', 'Leadership'],
  },
  {
    id: 'm4',
    name: 'Database Design',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    skills: ['SQL', 'Normalization', 'Indexing'],
  },
  {
    id: 'm5',
    name: 'API Design',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '35 min',
    durationMin: 35,
    skills: ['REST', 'GraphQL', 'Auth'],
  },
  {
    id: 'm6',
    name: 'React Challenge',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '50 min',
    durationMin: 50,
    skills: ['React', 'Hooks', 'State'],
  },
  {
    id: 'm7',
    name: 'CSS Architecture',
    type: 'Technical',
    difficulty: 'Easy',
    duration: '30 min',
    durationMin: 30,
    skills: ['CSS', 'Layout', 'BEM'],
  },
  {
    id: 'm8',
    name: 'Portfolio Review',
    type: 'Design',
    difficulty: 'Easy',
    duration: '25 min',
    durationMin: 25,
    skills: ['Figma', 'UX', 'Visual Design'],
  },
  {
    id: 'm9',
    name: 'Case Study',
    type: 'Analytical',
    difficulty: 'Hard',
    duration: '60 min',
    durationMin: 60,
    skills: ['Analysis', 'Strategy', 'Presentation'],
  },
  {
    id: 'm10',
    name: 'SQL Assessment',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    skills: ['SQL', 'Joins', 'Aggregation'],
  },
  {
    id: 'm11',
    name: 'DevOps Basics',
    type: 'Technical',
    difficulty: 'Easy',
    duration: '30 min',
    durationMin: 30,
    skills: ['CI/CD', 'Docker', 'Linux'],
  },
  {
    id: 'm12',
    name: 'Cloud Architecture',
    type: 'Technical',
    difficulty: 'Hard',
    duration: '50 min',
    durationMin: 50,
    skills: ['AWS', 'IaC', 'Serverless'],
  },
];

export const EMAIL_TRIGGERS = [
  {
    id: 'on-apply',
    title: 'On Application',
    desc: 'Send a confirmation email when a candidate applies',
  },
  {
    id: 'on-shortlist',
    title: 'On Shortlist',
    desc: 'Notify the candidate when moved to shortlist',
  },
  { id: 'on-reject', title: 'On Rejection', desc: 'Send a rejection email to declined candidates' },
];

export const INITIAL_FORM = {
  title: '',
  department: '',
  jobType: '',
  seniority: '',
  description: '',
  skills: [],
  locationType: '',
  location: '',
  mocks: [],
  emails: { 'on-apply': true, 'on-shortlist': true, 'on-reject': false },
  startDate: '',
  endDate: '',
  maxCandidates: '',
};

export function parseDurationMin(str) {
  const match = String(str).match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}
