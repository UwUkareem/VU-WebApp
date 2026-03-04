/**
 * Shared mock (evaluation module) data � consumed by MockList, MockDetails, and MockConfig.
 * Replace with API calls in production.
 *
 * IMPORTANT: A mock does NOT have its own "status" field.
 *   - "active"   = the mock is referenced by at least one ACTIVE job
 *   - "inactive"  = the mock is NOT used in any active job
 * Status is derived at runtime via getMockStatus().
 *
 * Evaluation: mocks can have BOTH criteria AND questions simultaneously.
 * All weights (criteria + questions) share a single 100% pool.
 */

import { JOBS } from '../../../Jobs/JobManagement/_shared/jobData';

export const MOCKS = [
  {
    id: 1,
    title: 'System Design',
    type: 'Technical',
    difficulty: 'Hard',
    duration: '45 min',
    durationMin: 45,
    description:
      'Evaluate candidates on their ability to design scalable, distributed systems with proper trade-off analysis.',
    skills: ['Architecture', 'Scalability', 'Trade-offs', 'Distributed Systems'],
    criteria: [
      { id: 'c1', name: 'Problem Solving', weight: 20 },
      { id: 'c2', name: 'Architecture Quality', weight: 20 },
      { id: 'c3', name: 'Communication', weight: 10 },
      { id: 'c4', name: 'Optimization', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a URL shortener service',
        description: 'End-to-end system design including storage, caching, and analytics.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 20,
      },
      {
        id: 'q2',
        title: 'Explain scaling strategies for a real-time chat system',
        description: 'WebSocket handling, message queues, and horizontal scaling.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 20,
      },
    ],
    avgScore: 74,
    totalSessions: 186,
    passRate: 52,
    createdDate: 'Nov 10, 2025',
  },
  {
    id: 2,
    title: 'Coding Challenge',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '60 min',
    durationMin: 60,
    description:
      'Test problem-solving skills through algorithmic coding challenges with emphasis on correctness and efficiency.',
    skills: ['DSA', 'Problem Solving', 'Complexity', 'Clean Code'],
    criteria: [
      { id: 'c1', name: 'Correctness', weight: 15 },
      { id: 'c2', name: 'Code Quality', weight: 10 },
      { id: 'c3', name: 'Efficiency', weight: 10 },
      { id: 'c4', name: 'Edge Cases', weight: 5 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Implement an LRU Cache',
        description: 'O(1) get and put operations with capacity eviction.',
        difficulty: 'hard',
        estimatedTime: '25 minutes',
        weight: 20,
      },
      {
        id: 'q2',
        title: 'Find the longest palindromic substring',
        description: 'Optimal time and space complexity required.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
      {
        id: 'q3',
        title: 'Merge K sorted arrays',
        description: 'Use appropriate data structures for optimal merging.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 78,
    totalSessions: 245,
    passRate: 61,
    createdDate: 'Nov 15, 2025',
  },
  {
    id: 3,
    title: 'Behavioral',
    type: 'Behavioral',
    difficulty: 'Easy',
    duration: '30 min',
    durationMin: 30,
    description:
      'Assess soft skills, teamwork, leadership qualities, and cultural fit through structured behavioral questions.',
    skills: ['Communication', 'Teamwork', 'Leadership', 'Conflict Resolution'],
    criteria: [
      { id: 'c1', name: 'Communication Clarity', weight: 15 },
      { id: 'c2', name: 'Teamwork & Collaboration', weight: 15 },
      { id: 'c3', name: 'Leadership Potential', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Tell me about a time you led a team through a challenge',
        description: 'Looking for leadership, problem resolution, and outcome focus.',
        difficulty: 'medium',
        estimatedTime: '10 minutes',
        weight: 20,
      },
      {
        id: 'q2',
        title: 'Describe a conflict with a teammate and how you resolved it',
        description: 'Assessing conflict resolution and empathy.',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        weight: 15,
      },
      {
        id: 'q3',
        title: 'How do you prioritize when everything is urgent?',
        description: 'Time management and decision-making under pressure.',
        difficulty: 'medium',
        estimatedTime: '5 minutes',
        weight: 15,
      },
      {
        id: 'q4',
        title: 'Give an example of a time you went above and beyond',
        description: 'Initiative and ownership mindset.',
        difficulty: 'easy',
        estimatedTime: '5 minutes',
        weight: 10,
      },
    ],
    avgScore: 82,
    totalSessions: 312,
    passRate: 72,
    createdDate: 'Oct 25, 2025',
  },
  {
    id: 4,
    title: 'Database Design',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    description:
      'Evaluate database modeling skills including schema design, normalization, indexing strategies, and query optimization.',
    skills: ['SQL', 'Normalization', 'Indexing', 'Query Optimization'],
    criteria: [
      { id: 'c1', name: 'Schema Design', weight: 20 },
      { id: 'c2', name: 'Normalization', weight: 15 },
      { id: 'c3', name: 'Query Performance', weight: 15 },
      { id: 'c4', name: 'Indexing Strategy', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a schema for an e-commerce platform',
        description: 'Products, orders, users, inventory. Include relationships and indexes.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Optimize a slow query with subqueries and joins',
        description: 'Given a query plan, identify bottlenecks and suggest improvements.',
        difficulty: 'hard',
        estimatedTime: '15 minutes',
        weight: 15,
      },
    ],
    avgScore: 71,
    totalSessions: 142,
    passRate: 48,
    createdDate: 'Dec 1, 2025',
  },
  {
    id: 5,
    title: 'API Design',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '35 min',
    durationMin: 35,
    description:
      'Assess ability to design clean, well-documented REST and GraphQL APIs with proper auth and error handling.',
    skills: ['REST', 'GraphQL', 'Auth', 'Error Handling'],
    criteria: [
      { id: 'c1', name: 'API Structure', weight: 20 },
      { id: 'c2', name: 'Documentation', weight: 15 },
      { id: 'c3', name: 'Security & Auth', weight: 20 },
      { id: 'c4', name: 'Error Handling', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a RESTful API for a task management app',
        description: 'Resources, endpoints, auth flow, pagination, error codes.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 15,
      },
      {
        id: 'q2',
        title: 'Compare REST vs GraphQL for a social media feed',
        description: 'Trade-offs in performance, flexibility, and caching.',
        difficulty: 'medium',
        estimatedTime: '10 minutes',
        weight: 15,
      },
    ],
    avgScore: 76,
    totalSessions: 118,
    passRate: 55,
    createdDate: 'Dec 5, 2025',
  },
  {
    id: 6,
    title: 'React Challenge',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '50 min',
    durationMin: 50,
    description:
      'Test React proficiency including hooks, state management, component design, and performance optimization.',
    skills: ['React', 'Hooks', 'State Management', 'Performance'],
    criteria: [
      { id: 'c1', name: 'Component Design', weight: 15 },
      { id: 'c2', name: 'State Management', weight: 15 },
      { id: 'c3', name: 'Hooks Usage', weight: 10 },
      { id: 'c4', name: 'Performance', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Build a dynamic form with validation',
        description: 'Multi-step form with real-time validation and error handling.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Optimize a list rendering 10,000 items',
        description: 'Virtualization, memoization, and reconciliation strategies.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 25,
      },
    ],
    avgScore: 80,
    totalSessions: 89,
    passRate: 65,
    createdDate: 'Jan 2, 2026',
  },
  {
    id: 7,
    title: 'CSS Architecture',
    type: 'Technical',
    difficulty: 'Easy',
    duration: '30 min',
    durationMin: 30,
    description:
      'Evaluate CSS knowledge including layout systems, responsive design, BEM methodology, and design tokens.',
    skills: ['CSS', 'Layout', 'BEM', 'Responsive Design'],
    criteria: [
      { id: 'c1', name: 'Layout Mastery', weight: 25 },
      { id: 'c2', name: 'Responsive Design', weight: 25 },
      { id: 'c3', name: 'Methodology', weight: 15 },
      { id: 'c4', name: 'Code Cleanliness', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Recreate a complex layout using CSS Grid and Flexbox',
        description: 'Responsive dashboard layout with sidebar, header, and content area.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 25,
      },
    ],
    avgScore: 0,
    totalSessions: 0,
    passRate: 0,
    createdDate: 'Feb 15, 2026',
  },
  {
    id: 8,
    title: 'Portfolio Review',
    type: 'Design',
    difficulty: 'Easy',
    duration: '25 min',
    durationMin: 25,
    description:
      'Review design portfolios assessing visual quality, UX thinking, process documentation, and presentation skills.',
    skills: ['Figma', 'UX', 'Visual Design', 'Presentation'],
    criteria: [
      { id: 'c1', name: 'Visual Quality', weight: 20 },
      { id: 'c2', name: 'UX Thinking', weight: 20 },
      { id: 'c3', name: 'Process', weight: 15 },
      { id: 'c4', name: 'Presentation', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Walk us through your favorite case study',
        description: 'Problem, process, decisions, outcome, and learnings.',
        difficulty: 'easy',
        estimatedTime: '10 minutes',
        weight: 15,
      },
      {
        id: 'q2',
        title: 'How would you redesign our onboarding flow?',
        description: 'Live critique and rapid ideation exercise.',
        difficulty: 'medium',
        estimatedTime: '10 minutes',
        weight: 15,
      },
    ],
    avgScore: 74,
    totalSessions: 56,
    passRate: 52,
    createdDate: 'Jan 10, 2026',
  },
  {
    id: 9,
    title: 'Case Study',
    type: 'Analytical',
    difficulty: 'Hard',
    duration: '60 min',
    durationMin: 60,
    description:
      'Present a business case for candidates to analyze. Tests strategic thinking, data interpretation, and presentation.',
    skills: ['Analysis', 'Strategy', 'Presentation', 'Data Interpretation'],
    criteria: [
      { id: 'c1', name: 'Analytical Rigor', weight: 15 },
      { id: 'c2', name: 'Strategic Thinking', weight: 15 },
      { id: 'c3', name: 'Presentation Quality', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Analyze the market opportunity for a new product vertical',
        description: 'Assess market sizing, competitive landscape, and go-to-market strategy.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Design a pricing strategy based on the provided data',
        description: 'Revenue modeling, margin analysis, and customer segmentation.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 20,
      },
      {
        id: 'q3',
        title: 'Present your recommendations to the board',
        description: 'Communication clarity, slide structure, Q&A handling.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 15,
      },
    ],
    avgScore: 72,
    totalSessions: 98,
    passRate: 44,
    createdDate: 'Dec 20, 2025',
  },
  {
    id: 10,
    title: 'SQL Assessment',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    description:
      'Test SQL proficiency through practical query challenges including joins, aggregation, window functions, and CTEs.',
    skills: ['SQL', 'Joins', 'Aggregation', 'Window Functions'],
    criteria: [
      { id: 'c1', name: 'Query Accuracy', weight: 20 },
      { id: 'c2', name: 'Efficiency', weight: 15 },
      { id: 'c3', name: 'Advanced Features', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Write a query to find top 3 customers by monthly revenue',
        description: 'Use window functions, CTEs, and proper aggregation.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Optimize a report query running on 10M rows',
        description: 'Identify missing indexes, rewrite subqueries, and suggest partitioning.',
        difficulty: 'hard',
        estimatedTime: '15 minutes',
        weight: 25,
      },
    ],
    avgScore: 68,
    totalSessions: 73,
    passRate: 42,
    createdDate: 'Jan 18, 2026',
  },
  {
    id: 11,
    title: 'CI/CD Pipeline',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    description:
      'Evaluate knowledge of CI/CD pipeline design, build automation, testing strategies, and deployment workflows.',
    skills: ['CI/CD', 'Docker', 'Testing', 'Automation'],
    criteria: [
      { id: 'c1', name: 'Pipeline Design', weight: 30 },
      { id: 'c2', name: 'Testing Strategy', weight: 25 },
      { id: 'c3', name: 'Docker Usage', weight: 25 },
      { id: 'c4', name: 'Best Practices', weight: 20 },
    ],
    questions: [],
    avgScore: 0,
    totalSessions: 0,
    passRate: 0,
    createdDate: 'Feb 20, 2026',
  },
  {
    id: 12,
    title: 'Cloud Architecture',
    type: 'Technical',
    difficulty: 'Hard',
    duration: '50 min',
    durationMin: 50,
    description:
      'Assess cloud architecture skills including AWS/GCP services, infrastructure-as-code, serverless, and cost optimization.',
    skills: ['AWS', 'IaC', 'Serverless', 'Cost Optimization'],
    criteria: [
      { id: 'c1', name: 'Service Selection', weight: 15 },
      { id: 'c2', name: 'Architecture Quality', weight: 15 },
      { id: 'c3', name: 'IaC & Automation', weight: 15 },
      { id: 'c4', name: 'Cost Awareness', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a serverless event-driven architecture',
        description: 'Lambda, SQS, EventBridge, DynamoDB � end-to-end design.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Migrate a monolith to microservices on AWS',
        description: 'Strategy, service decomposition, data migration, and rollback plan.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 20,
      },
    ],
    avgScore: 78,
    totalSessions: 38,
    passRate: 50,
    createdDate: 'Feb 1, 2026',
  },
];

/* -------------------------------------------------
   Status helpers � status is DERIVED from active jobs
   ------------------------------------------------- */

/** Check if a mock is "active" (used in at least one active job) */
export function getMockStatus(mockId) {
  const mock = MOCKS.find((m) => m.id === mockId);
  if (!mock) return 'inactive';
  return JOBS.some((j) => j.status === 'active' && j.mocks.some((m) => m.name === mock.title))
    ? 'active'
    : 'inactive';
}

/** Get computed status for a mock by title */
export function getMockStatusByTitle(mockTitle) {
  return JOBS.some((j) => j.status === 'active' && j.mocks.some((m) => m.name === mockTitle))
    ? 'active'
    : 'inactive';
}

/* -------------------------------------------------
   Query helpers
   ------------------------------------------------- */

/** Look up a single mock by id */
export function getMockById(id) {
  return MOCKS.find((m) => m.id === id) ?? null;
}

/** Count how many jobs use a given mock title */
export function getUsedInJobsCount(mockTitle) {
  return JOBS.filter((j) => j.mocks.some((m) => m.name === mockTitle)).length;
}

/** Get jobs that use a given mock title � returns detailed objects */
export function getJobsUsingMock(mockTitle) {
  return JOBS.filter((j) => j.mocks.some((m) => m.name === mockTitle)).map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    totalApplied: j.totalApplied,
    department: j.department,
  }));
}

/** Get bar-chart-ready data: candidates per job for a given mock */
export function getCandidatesPerJob(mockTitle) {
  return JOBS.filter((j) => j.mocks.some((m) => m.name === mockTitle)).map((j) => ({
    label: j.title,
    candidates: j.totalApplied,
  }));
}

/* -------------------------------------------------
   CRUD helpers (simulated)
   ------------------------------------------------- */

/** Update a mock in-place (simulates API PATCH). Returns the updated mock or null. */
export function updateMock(id, patch) {
  const idx = MOCKS.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  MOCKS[idx] = { ...MOCKS[idx], ...patch };
  return MOCKS[idx];
}

/** Add a new mock (simulates API POST). Auto-assigns an id. Returns the new mock. */
export function addMock(data) {
  const maxId = MOCKS.reduce((m, mock) => Math.max(m, mock.id), 0);
  const newMock = {
    id: maxId + 1,
    avgScore: 0,
    totalSessions: 0,
    passRate: 0,
    createdDate: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    ...data,
  };
  MOCKS.push(newMock);
  return newMock;
}

/** Remove a mock by id. Returns true if removed. */
export function removeMock(id) {
  const idx = MOCKS.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  MOCKS.splice(idx, 1);
  return true;
}

/** Duplicate a mock � copies everything except id, resets stats. Returns the new mock. */
export function duplicateMock(id) {
  const source = getMockById(id);
  if (!source) return null;
  const { id: _id, ...rest } = source;
  return addMock({
    ...rest,
    title: `${rest.title} (Copy)`,
    avgScore: 0,
    totalSessions: 0,
    passRate: 0,
  });
}
