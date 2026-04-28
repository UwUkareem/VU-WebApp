import {
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
} from '../database/config';
import { JOBS } from '../database/jobs';
import { MOCKS } from '../database/mocks';
import { CANDIDATES } from '../database/candidates';
import {
  ROLES,
  COMPANY,
  CURRENT_USER_ID,
  TEAM_MEMBERS,
  ACTIVITY_LOG,
  JOIN_REQUESTS,
} from '../database/company';
import { APPLICATION, CANDIDATE_INFO } from '../database/application';

const configData = Object.freeze({
  jobStepsCreate: JOB_STEPS_CREATE,
  jobStepsEdit: JOB_STEPS_EDIT,
  jobTypeOptions: JOB_TYPE_OPTIONS,
  seniorityOptions: SENIORITY_OPTIONS,
  locationTypeOptions: LOCATION_TYPE_OPTIONS,
  departmentOptions: DEPARTMENT_OPTIONS,
  mockLibrary: MOCK_LIBRARY,
  emailTriggers: EMAIL_TRIGGERS,
  initialJobForm: INITIAL_JOB_FORM,
  parseDurationMin,
  mockStepsCreate: MOCK_STEPS_CREATE,
  mockStepsEdit: MOCK_STEPS_EDIT,
  mockTypeOptions: MOCK_TYPE_OPTIONS,
  difficultyOptions: DIFFICULTY_OPTIONS,
  durationOptions: DURATION_OPTIONS,
  initialMockForm: INITIAL_MOCK_FORM,
});

export const datastore = {
  get jobs() {
    return JOBS;
  },
  get mocks() {
    return MOCKS;
  },
  get candidates() {
    return CANDIDATES;
  },
  get roles() {
    return ROLES;
  },
  get company() {
    return COMPANY;
  },
  get currentUserId() {
    return CURRENT_USER_ID;
  },
  get teamMembers() {
    return TEAM_MEMBERS;
  },
  get activityLog() {
    return ACTIVITY_LOG;
  },
  get joinRequests() {
    return JOIN_REQUESTS;
  },
  get application() {
    return APPLICATION;
  },
  get candidateInfo() {
    return CANDIDATE_INFO;
  },
  get config() {
    return configData;
  },
};

export function getDatastoreSnapshot() {
  return {
    jobs: datastore.jobs,
    mocks: datastore.mocks,
    candidates: datastore.candidates,
    roles: datastore.roles,
    company: datastore.company,
    currentUserId: datastore.currentUserId,
    teamMembers: datastore.teamMembers,
    activityLog: datastore.activityLog,
    joinRequests: datastore.joinRequests,
    application: datastore.application,
    candidateInfo: datastore.candidateInfo,
    config: datastore.config,
  };
}
