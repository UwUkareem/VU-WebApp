/**
 * Unified application data — candidate-side experience.
 * Builds the application context dynamically from a given jobId.
 */

import { getJobById } from './jobs';
import { getMockById } from './mocks';

/**
 * Build the application context from a job ID.
 * @param {number} jobId - The job to build context for (defaults to 1)
 */
export function buildApplicationContext(jobId = 1) {
  const job = getJobById(jobId);
  if (!job) return null;

  const mocks = (job.mocks || []).map((jm, idx) => {
    const fullMock = getMockById(jm.id);
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
      status: 'locked',
    };
  });

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

/* ── Application state (mutable) ── */
export let APPLICATION = buildApplicationContext(1);

/**
 * Reset application for a different job.
 */
export function resetApplication(jobId) {
  APPLICATION = buildApplicationContext(jobId);
  CANDIDATE_INFO = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    resumeFile: null,
    resumeName: '',
    submittedAt: null,
  };
  return APPLICATION;
}

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

export function saveCandidateInfo(data) {
  CANDIDATE_INFO = { ...CANDIDATE_INFO, ...data, submittedAt: new Date().toISOString() };
}

export function completeMock(mockId) {
  if (!APPLICATION) return [];
  const idx = APPLICATION.mocks.findIndex((m) => m.id === mockId);
  if (idx === -1) return APPLICATION.mocks;
  APPLICATION.mocks[idx].status = 'completed';
  if (idx + 1 < APPLICATION.mocks.length && APPLICATION.mocks[idx + 1].status === 'locked') {
    APPLICATION.mocks[idx + 1].status = 'available';
  }
  return [...APPLICATION.mocks];
}

export function startMock(mockId) {
  if (!APPLICATION) return;
  const mock = APPLICATION.mocks.find((m) => m.id === mockId);
  if (mock) mock.status = 'in-progress';
}

export function allMocksCompleted() {
  if (!APPLICATION) return false;
  return APPLICATION.mocks.every((m) => m.status === 'completed');
}

export function getApplicationMock(mockId) {
  if (!APPLICATION) return null;
  return APPLICATION.mocks.find((m) => m.id === mockId) ?? null;
}

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

/* ── AI Interview sample conversation ── */
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
