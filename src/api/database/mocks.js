/**
 * Unified mock (evaluation module) data.
 * Single source of truth for all mock assessments across the app.
 *
 * IMPORTANT: A mock does NOT have its own "status" field.
 *   - "active"  = the mock is referenced by at least one ACTIVE job
 *   - "inactive" = the mock is NOT used in any active job
 * Status is derived at runtime via getMockStatus().
 */

import { JOBS } from './jobs';

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
        description: 'Lambda, SQS, EventBridge, DynamoDB — end-to-end design.',
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
  // ── Additional mocks referenced by jobs but missing from original data ──
  {
    id: 13,
    title: 'Design Challenge',
    type: 'Design',
    difficulty: 'Medium',
    duration: '45 min',
    durationMin: 45,
    description:
      'Hands-on design exercise evaluating visual thinking, UX decision-making, and rapid prototyping skills.',
    skills: ['Figma', 'UX', 'Prototyping', 'Visual Design'],
    criteria: [
      { id: 'c1', name: 'Visual Thinking', weight: 20 },
      { id: 'c2', name: 'UX Decision-Making', weight: 20 },
      { id: 'c3', name: 'Prototyping Speed', weight: 15 },
      { id: 'c4', name: 'Design Rationale', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Redesign a checkout flow for mobile',
        description: 'Focus on reducing friction and improving conversion.',
        difficulty: 'medium',
        estimatedTime: '25 minutes',
        weight: 30,
      },
      {
        id: 'q2',
        title: 'Design a notification center for a SaaS dashboard',
        description: 'Consider hierarchy, grouping, and actionable notifications.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 69,
    totalSessions: 42,
    passRate: 44,
    createdDate: 'Jan 5, 2026',
  },
  {
    id: 14,
    title: 'Data Modeling',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '40 min',
    durationMin: 40,
    description:
      'Evaluate data modeling skills including entity-relationship design, dimensional modeling, and data warehouse patterns.',
    skills: ['ERD', 'Dimensional Modeling', 'Data Warehousing', 'ETL'],
    criteria: [
      { id: 'c1', name: 'Entity Design', weight: 20 },
      { id: 'c2', name: 'Relationship Mapping', weight: 20 },
      { id: 'c3', name: 'Dimensional Modeling', weight: 15 },
      { id: 'c4', name: 'Data Quality', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a star schema for a retail analytics platform',
        description: 'Fact tables, dimension tables, slowly changing dimensions.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Model a multi-tenant SaaS data architecture',
        description: 'Isolation strategies, shared schemas, and performance.',
        difficulty: 'hard',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 70,
    totalSessions: 58,
    passRate: 45,
    createdDate: 'Dec 10, 2025',
  },
  {
    id: 15,
    title: 'Strategy Assessment',
    type: 'Analytical',
    difficulty: 'Hard',
    duration: '45 min',
    durationMin: 45,
    description:
      'Evaluate product and business strategy skills including market analysis, prioritization, and roadmap planning.',
    skills: ['Product Strategy', 'Market Analysis', 'Prioritization', 'Roadmapping'],
    criteria: [
      { id: 'c1', name: 'Strategic Thinking', weight: 25 },
      { id: 'c2', name: 'Market Awareness', weight: 20 },
      { id: 'c3', name: 'Prioritization Framework', weight: 20 },
      { id: 'c4', name: 'Communication', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Define a go-to-market strategy for a new feature',
        description: 'Target audience, positioning, pricing, and launch plan.',
        difficulty: 'hard',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Prioritize a backlog of 10 features using a framework',
        description: 'RICE, ICE, or custom framework with justification.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 72,
    totalSessions: 44,
    passRate: 44,
    createdDate: 'Jan 25, 2026',
  },
  {
    id: 16,
    title: 'Monitoring Setup',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '35 min',
    durationMin: 35,
    description:
      'Assess ability to design monitoring, alerting, and observability systems for production infrastructure.',
    skills: ['Prometheus', 'Grafana', 'Alerting', 'Observability'],
    criteria: [
      { id: 'c1', name: 'Metric Design', weight: 25 },
      { id: 'c2', name: 'Alerting Strategy', weight: 25 },
      { id: 'c3', name: 'Dashboard Design', weight: 15 },
      { id: 'c4', name: 'Incident Response', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a monitoring stack for a microservices platform',
        description: 'Metrics, logs, traces — full observability pipeline.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 30,
      },
      {
        id: 'q2',
        title: 'Create an alerting strategy that minimizes alert fatigue',
        description: 'Severity levels, routing, escalation, and on-call workflows.',
        difficulty: 'medium',
        estimatedTime: '10 minutes',
        weight: 15,
      },
    ],
    avgScore: 82,
    totalSessions: 30,
    passRate: 58,
    createdDate: 'Feb 5, 2026',
  },
  {
    id: 17,
    title: 'Model Design',
    type: 'Technical',
    difficulty: 'Hard',
    duration: '50 min',
    durationMin: 50,
    description:
      'Evaluate ML model architecture skills including model selection, feature engineering, and evaluation pipeline design.',
    skills: ['PyTorch', 'Model Architecture', 'Feature Engineering', 'Evaluation'],
    criteria: [
      { id: 'c1', name: 'Model Selection', weight: 20 },
      { id: 'c2', name: 'Architecture Design', weight: 20 },
      { id: 'c3', name: 'Feature Engineering', weight: 15 },
      { id: 'c4', name: 'Evaluation Strategy', weight: 15 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Design a recommendation system for an e-commerce platform',
        description: 'Collaborative filtering, content-based, and hybrid approaches.',
        difficulty: 'hard',
        estimatedTime: '25 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Explain your approach to handling class imbalance',
        description: 'Sampling, loss functions, evaluation metrics, and practical trade-offs.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 88,
    totalSessions: 34,
    passRate: 65,
    createdDate: 'Jan 15, 2026',
  },
  {
    id: 18,
    title: 'Python Challenge',
    type: 'Technical',
    difficulty: 'Medium',
    duration: '45 min',
    durationMin: 45,
    description:
      'Test Python proficiency through data manipulation, scripting, and library-based coding challenges.',
    skills: ['Python', 'Pandas', 'NumPy', 'Scripting'],
    criteria: [
      { id: 'c1', name: 'Code Quality', weight: 20 },
      { id: 'c2', name: 'Library Usage', weight: 20 },
      { id: 'c3', name: 'Problem Solving', weight: 15 },
      { id: 'c4', name: 'Testing', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Process and analyze a CSV dataset using Pandas',
        description: 'Cleaning, transformation, aggregation, and visualization.',
        difficulty: 'medium',
        estimatedTime: '20 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'Build a CLI tool for file batch processing',
        description: 'argparse, file I/O, error handling, and logging.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 20,
      },
    ],
    avgScore: 92,
    totalSessions: 41,
    passRate: 72,
    createdDate: 'Jan 20, 2026',
  },
  {
    id: 19,
    title: 'Paper Review',
    type: 'Analytical',
    difficulty: 'Medium',
    duration: '30 min',
    durationMin: 30,
    description:
      'Assess ability to read, comprehend, and critically evaluate ML research papers and translate findings into practice.',
    skills: ['Research', 'Critical Analysis', 'ML Theory', 'Communication'],
    criteria: [
      { id: 'c1', name: 'Comprehension', weight: 25 },
      { id: 'c2', name: 'Critical Analysis', weight: 25 },
      { id: 'c3', name: 'Practical Application', weight: 15 },
      { id: 'c4', name: 'Communication', weight: 10 },
    ],
    questions: [
      {
        id: 'q1',
        title: 'Summarize and critique the Attention Is All You Need paper',
        description: 'Key contributions, limitations, and real-world impact.',
        difficulty: 'medium',
        estimatedTime: '15 minutes',
        weight: 25,
      },
      {
        id: 'q2',
        title: 'How would you apply this paper to a production search system?',
        description: 'Practical implementation, trade-offs, and scaling considerations.',
        difficulty: 'hard',
        estimatedTime: '10 minutes',
        weight: 20,
      },
    ],
    avgScore: 90,
    totalSessions: 28,
    passRate: 70,
    createdDate: 'Feb 8, 2026',
  },
];

/* -------------------------------------------------
   Status helpers — status is DERIVED from active jobs
   ------------------------------------------------- */

export function getMockStatus(mockId) {
  const mock = MOCKS.find((m) => m.id === mockId);
  if (!mock) return 'inactive';
  return JOBS.some((j) => j.status === 'active' && j.mocks.some((m) => m.id === mockId))
    ? 'active'
    : 'inactive';
}

export function getMockStatusByTitle(mockTitle) {
  const mock = MOCKS.find((m) => m.title === mockTitle);
  if (!mock) return 'inactive';
  return getMockStatus(mock.id);
}

/* -------------------------------------------------
   Query helpers
   ------------------------------------------------- */

export function getMockById(id) {
  return MOCKS.find((m) => m.id === id) ?? null;
}

export function getUsedInJobsCount(mockTitle) {
  const mock = MOCKS.find((m) => m.title === mockTitle);
  if (!mock) return 0;
  return JOBS.filter((j) => j.mocks.some((m) => m.id === mock.id)).length;
}

export function getJobsUsingMock(mockTitle) {
  const mock = MOCKS.find((m) => m.title === mockTitle);
  if (!mock) return [];
  return JOBS.filter((j) => j.mocks.some((m) => m.id === mock.id)).map((j) => ({
    id: j.id,
    title: j.title,
    status: j.status,
    totalApplied: j.totalApplied,
    department: j.department,
  }));
}

export function getCandidatesPerJob(mockTitle) {
  const mock = MOCKS.find((m) => m.title === mockTitle);
  if (!mock) return [];
  return JOBS.filter((j) => j.mocks.some((m) => m.id === mock.id)).map((j) => ({
    label: j.title,
    candidates: j.totalApplied,
  }));
}

/* -------------------------------------------------
   CRUD helpers (simulated)
   ------------------------------------------------- */

export function updateMock(id, patch) {
  const idx = MOCKS.findIndex((m) => m.id === id);
  if (idx === -1) return null;
  MOCKS[idx] = { ...MOCKS[idx], ...patch };
  return MOCKS[idx];
}

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

export function removeMock(id) {
  const idx = MOCKS.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  MOCKS.splice(idx, 1);
  return true;
}

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
