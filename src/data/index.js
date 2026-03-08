/**
 * Central data re-exports — import from '@/data' or '../data'.
 */

// Mocks
export {
  MOCKS,
  getMockById,
  getMockStatus,
  getMockStatusByTitle,
  getUsedInJobsCount,
  getJobsUsingMock,
  getCandidatesPerJob,
  updateMock,
  addMock,
  removeMock,
  duplicateMock,
} from './mocks';

// Jobs
export { JOBS, getJobById, updateJob, addJob, removeJob, duplicateJob } from './jobs';

// Candidates
export {
  CANDIDATES,
  getCandidateById,
  getCandidatesByJob,
  getCandidatesByJobId,
} from './candidates';

// Company
export {
  ROLES,
  hasPermission,
  COMPANY,
  CURRENT_USER_ID,
  TEAM_MEMBERS,
  ACTIVITY_LOG,
  JOIN_REQUESTS,
  getMemberById,
  getJoinRequestById,
  updateMember,
  removeMember,
  getMemberActivities,
  acceptJoinRequest,
  declineJoinRequest,
  updateJoinRequest,
  updateCompany,
  getPendingRequestsCount,
  generateInviteLink,
} from './company';

// Application
export {
  APPLICATION,
  buildApplicationContext,
  resetApplication,
  CANDIDATE_INFO,
  saveCandidateInfo,
  completeMock,
  startMock,
  allMocksCompleted,
  getApplicationMock,
  getCompletedCount,
  ASSESSMENT_RULES,
  SAMPLE_CONVERSATION,
} from './application';

// Config
export {
  JOB_STEPS_CREATE,
  JOB_STEPS_EDIT,
  JOB_TYPE_OPTIONS,
  SENIORITY_OPTIONS,
  LOCATION_TYPE_OPTIONS,
  DEPARTMENT_OPTIONS,
  MOCK_LIBRARY,
  EMAIL_TRIGGERS,
  INITIAL_JOB_FORM,
  parseDurationMin,
  MOCK_STEPS_CREATE,
  MOCK_STEPS_EDIT,
  MOCK_TYPE_OPTIONS,
  DIFFICULTY_OPTIONS,
  DURATION_OPTIONS,
  INITIAL_MOCK_FORM,
} from './config';
