import { datastore } from '../datastore';
import {
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
} from '../database/application';

export const applicationApi = Object.freeze({
  get: () => datastore.application,
  buildContext: buildApplicationContext,
  reset: resetApplication,
  candidateInfo: () => datastore.candidateInfo,
  saveCandidateInfo,
  completeMock,
  startMock,
  allMocksCompleted,
  getApplicationMock,
  getCompletedCount,
  assessmentRules: ASSESSMENT_RULES,
  sampleConversation: SAMPLE_CONVERSATION,
});

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
};
