import { datastore } from '../datastore';
import { parseDurationMin } from '../database/config';

export const JOB_STEPS_CREATE = datastore.config.jobStepsCreate;
export const JOB_STEPS_EDIT = datastore.config.jobStepsEdit;
export const JOB_TYPE_OPTIONS = datastore.config.jobTypeOptions;
export const SENIORITY_OPTIONS = datastore.config.seniorityOptions;
export const LOCATION_TYPE_OPTIONS = datastore.config.locationTypeOptions;
export const DEPARTMENT_OPTIONS = datastore.config.departmentOptions;
export const MOCK_LIBRARY = datastore.config.mockLibrary;
export const EMAIL_TRIGGERS = datastore.config.emailTriggers;
export const INITIAL_JOB_FORM = datastore.config.initialJobForm;
export const MOCK_STEPS_CREATE = datastore.config.mockStepsCreate;
export const MOCK_STEPS_EDIT = datastore.config.mockStepsEdit;
export const MOCK_TYPE_OPTIONS = datastore.config.mockTypeOptions;
export const DIFFICULTY_OPTIONS = datastore.config.difficultyOptions;
export const DURATION_OPTIONS = datastore.config.durationOptions;
export const INITIAL_MOCK_FORM = datastore.config.initialMockForm;

export const configApi = Object.freeze({
  get: () => datastore.config,
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

export { parseDurationMin };
