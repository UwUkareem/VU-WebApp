import { datastore } from '../datastore';
import {
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
} from '../database/mocks';

export const MOCKS = datastore.mocks;

export const mocksApi = Object.freeze({
  list: () => datastore.mocks,
  getById: getMockById,
  getStatus: getMockStatus,
  getStatusByTitle: getMockStatusByTitle,
  getUsedInJobsCount,
  getJobsUsing: getJobsUsingMock,
  getCandidatesPerJob,
  update: updateMock,
  create: addMock,
  remove: removeMock,
  duplicate: duplicateMock,
});

export {
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
};
