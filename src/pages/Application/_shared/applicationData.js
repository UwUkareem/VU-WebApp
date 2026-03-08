/**
 * Shared application data — consumed by JobLanding, CandidateForm, JobOverview, MockSession, SubmissionComplete.
 *
 * Simulates the candidate-side experience after opening a job application link.
 * In production, this data would come from the backend via the job link token.
 */

import { getJobById } from '../../Jobs/JobManagement/_shared/jobData';
import { getMockById } from '../../Mocks/MockManagement/_shared/mockData';

/* ── Simulated job link → resolves to job id:1 ── */
const LINKED_JOB_ID = 1;

/**
 * Build the application context from the linked job.
 * Merges job-level data with full mock details for the candidate view.
 */
function buildApplicationContext() {
  const job = getJobById(LINKED_JOB_ID);
  if (!job) return null;

  const mocks = (job.mocks || []).map((jm, idx) => {
    const fullMock = getMockById(Number(String(jm.id).replace('m', '')));
    return {
      id: jm.id,
      index: idx,
      name: jm.name,
      weight: jm.weight,
      duration: jm.duration,
      durationMin: jm.durationMin,
      type: fullMock?.type ?? 'Technical',
      difficulty: fullMock?.difficulty ?? 'Medium',
      description: fullMock?.description ?? '',
      questionsCount: fullMock?.questions?.length ?? 0,
      status: 'locked', // 'locked' | 'available' | 'in-progress' | 'completed'
    };
  });

  // First mock is available by default
  if (mocks.length > 0) mocks[0].status = 'available';

  return {
    job: {
      id: job.id,
      title: job.title,
      department: job.department,
      seniority: job.seniority,
      jobType: job.jobType,
      location: job.location,
      locationType: job.locationType,
      description: job.description,
      skills: job.skills || [],
      totalDuration: mocks.reduce((sum, m) => sum + (m.durationMin || 0), 0),
      mocksCount: mocks.length,
      deadline: 'March 28, 2026',
    },
    company: {
      name: 'Acme Technologies',
      industry: 'Software & Technology',
      website: 'https://acmetech.io',
      size: '50–200 employees',
    },
    mocks,
  };
}

/* ── Application state (mutable — same pattern as other data stores) ── */
export const APPLICATION = buildApplicationContext();

/* ── Candidate data filled during CandidateForm ── */
export let CANDIDATE_INFO = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  resumeFile: null,
  resumeName: '',
  submittedAt: null,
};

/**
 * Save candidate form data.
 */
export function saveCandidateInfo(data) {
  CANDIDATE_INFO = { ...CANDIDATE_INFO, ...data, submittedAt: new Date().toISOString() };
}

/**
 * Mark a mock as completed and unlock the next one.
 * Returns the updated mocks array.
 */
export function completeMock(mockId) {
  if (!APPLICATION) return [];

  const idx = APPLICATION.mocks.findIndex((m) => m.id === mockId);
  if (idx === -1) return APPLICATION.mocks;

  APPLICATION.mocks[idx].status = 'completed';

  // Unlock next mock if exists
  if (idx + 1 < APPLICATION.mocks.length && APPLICATION.mocks[idx + 1].status === 'locked') {
    APPLICATION.mocks[idx + 1].status = 'available';
  }

  return [...APPLICATION.mocks];
}

/**
 * Mark a mock as in-progress.
 */
export function startMock(mockId) {
  if (!APPLICATION) return;
  const mock = APPLICATION.mocks.find((m) => m.id === mockId);
  if (mock) mock.status = 'in-progress';
}

/**
 * Check if all mocks are completed.
 */
export function allMocksCompleted() {
  if (!APPLICATION) return false;
  return APPLICATION.mocks.every((m) => m.status === 'completed');
}

/**
 * Get mock by id from the application context.
 */
export function getApplicationMock(mockId) {
  if (!APPLICATION) return null;
  return APPLICATION.mocks.find((m) => m.id === mockId) ?? null;
}

/**
 * Get completed mocks count.
 */
export function getCompletedCount() {
  if (!APPLICATION) return 0;
  return APPLICATION.mocks.filter((m) => m.status === 'completed').length;
}

/* ── Assessment rules shown to candidates ── */
export const ASSESSMENT_RULES = [
  'Once you start an assessment, the timer will begin immediately',
  'You cannot pause or restart an assessment once started',
  'Do not close or refresh the browser tab during an assessment',
  'Ensure your camera and microphone are enabled if required',
  'Your screen activity may be monitored for integrity purposes',
  'Complete all assessments to submit your application',
];

/* ── AI Interview sample conversation (for MockInterview demo) ── */
export const SAMPLE_CONVERSATION = [
  {
    id: 1,
    role: 'ai',
    message:
      "Welcome to the assessment! I'm your AI interviewer. Let's start with a warm-up question. Can you briefly introduce yourself and tell me about your relevant experience?",
    timestamp: '0:00',
  },
  {
    id: 2,
    role: 'candidate',
    message: '',
    timestamp: null,
    placeholder: 'Type your response here...',
  },
];
